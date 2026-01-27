import { Server } from 'socket.io';
import { GeminiService } from './geminiService.js';
import { DockerService } from './dockerService.js';
import type { AttackTreeNode } from '../types/index.js';

type ReconParams = {
  sessionId: string;
  url?: string;
  repo?: string;
  image?: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
  } | undefined;
  io: Server;
}

export async function startReconnaissance(params: ReconParams) {
  const { sessionId, url, repo, image, io } = params;
  
  try {
    io.emit('recon:status', { 
      sessionId, 
      status: 'initializing',
      message: 'Starting reconnaissance...'
    });

    const gemini = new GeminiService();
    const docker = new DockerService();

    // Phase 1: Initial Analysis
    io.emit('recon:status', { 
      sessionId, 
      status: 'analyzing',
      message: 'Analyzing target...'
    });

    const target = url || repo || 'unknown';
    const attackTree = await gemini.generateAttackTree(target, image, (node: AttackTreeNode) => {
      io.emit('recon:tree-update', { sessionId, node });
    });

    io.emit('recon:tree-complete', { sessionId, tree: attackTree });

    // Phase 2: Thinking Mode Analysis
    io.emit('recon:status', { 
      sessionId, 
      status: 'thinking',
      message: 'Deep analysis in progress...'
    });

    const thinkingSteps = await gemini.analyzeWithThinking(target, image, attackTree, (step: any) => {
      io.emit('recon:thinking', { sessionId, step });
    });

    // Phase 3: Generate Exploits
    io.emit('recon:status', { 
      sessionId, 
      status: 'generating',
      message: 'Generating exploit scripts...'
    });

    const exploits = await gemini.generateExploits(target, attackTree, thinkingSteps, (exploit: any) => {
      io.emit('recon:exploit', { sessionId, exploit });
    });

    // Phase 4: Execute Exploits
    io.emit('recon:status', { 
      sessionId, 
      status: 'executing',
      message: 'Running exploit scripts in sandbox...'
    });

    for (const exploit of exploits) {
      try {
        io.emit('recon:execution-start', { 
          sessionId, 
          exploitId: exploit.id,
          name: exploit.name
        });

        const result = await docker.executeScript(exploit.script, target);
        
        io.emit('recon:execution-result', { 
          sessionId, 
          exploitId: exploit.id,
          result 
        });
      } catch (error: any) {
        io.emit('recon:execution-error', { 
          sessionId, 
          exploitId: exploit.id,
          error: error.message 
        });
      }
    }

    // Phase 5: Complete
    io.emit('recon:complete', { 
      sessionId,
      summary: {
        target,
        attackTreeNodes: attackTree.length,
        exploitsGenerated: exploits.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Reconnaissance error:', error);
    io.emit('recon:error', { sessionId, error: error.message });
  }
}
