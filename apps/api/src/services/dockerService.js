"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerService = void 0;
const dockerode_1 = __importDefault(require("dockerode"));
const types_1 = require("../types");
class DockerService {
    docker;
    constructor() {
        this.docker = new dockerode_1.default();
    }
    async executeScript(script, target) {
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
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    container.stop().catch(() => { });
                    reject(new Error('Execution timeout (30s)'));
                }, 30000);
                stream.on('data', (chunk) => {
                    const str = chunk.toString();
                    if (str.includes('stderr')) {
                        errors += str;
                    }
                    else {
                        output += str;
                    }
                });
                stream.on('end', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                stream.on('error', (err) => {
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
                errors: errors || undefined,
                duration
            };
        }
        catch (error) {
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
            const warRoomContainers = containers.filter(c => c.Image.includes('python') || c.Image.includes('alpine'));
            for (const containerInfo of warRoomContainers) {
                const container = this.docker.getContainer(containerInfo.Id);
                try {
                    await container.stop();
                    await container.remove();
                }
                catch (err) {
                    console.error('Error cleaning up container:', err);
                }
            }
        }
        catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}
exports.DockerService = DockerService;
//# sourceMappingURL=dockerService.js.map