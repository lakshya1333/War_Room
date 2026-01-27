import Docker from 'dockerode';
import type { ExecutionResult } from '../types/index.js';

export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async executeScript(script: string, target: string): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      // Determine language from script
      const isPython = script.includes('import ') || script.includes('def ') || script.includes('python');
      const image = isPython ? 'python:3.11-slim' : 'alpine:latest';
      const cmd = isPython 
        ? ['python', '-c', script]
        : ['sh', '-c', script];

      // Create container
      const container = await this.docker.createContainer({
        Image: image,
        Cmd: cmd,
        HostConfig: {
          AutoRemove: true,
          NetworkMode: 'bridge',
          Memory: 512 * 1024 * 1024, // 512MB
          CpuPeriod: 100000,
          CpuQuota: 50000, // 50% CPU
        },
        Env: [
          `TARGET=${target}`,
          'PYTHONUNBUFFERED=1'
        ]
      });

      // Start container
      await container.start();

      // Collect output
      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true
      });

      let output = '';
      let errors = '';

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          container.stop().catch(() => {});
          reject(new Error('Execution timeout (30s)'));
        }, 30000);

        stream.on('data', (chunk: Buffer) => {
          const str = chunk.toString();
          if (str.includes('stderr')) {
            errors += str;
          } else {
            output += str;
          }
        });

        stream.on('end', () => {
          clearTimeout(timeout);
          resolve();
        });

        stream.on('error', (err: Error) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      // Wait for container to finish
      await container.wait();

      const duration = Date.now() - startTime;

      return {
        success: true,
        output: output || 'Script executed successfully (no output)',
        errors: errors ? errors : undefined,
        duration
      };

    } catch (error: any) {
      return {
        success: false,
        output: '',
        errors: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  async cleanup() {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const warRoomContainers = containers.filter((c: any) => 
        c.Image.includes('python') || c.Image.includes('alpine')
      );

      for (const containerInfo of warRoomContainers) {
        const container = this.docker.getContainer(containerInfo.Id);
        try {
          await container.stop();
          await container.remove();
        } catch (err) {
          console.error('Error cleaning up container:', err);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}
