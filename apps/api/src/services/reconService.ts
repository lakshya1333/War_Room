import { Server } from 'socket.io';
import { GeminiService } from './geminiService.js';
import { DockerService } from './dockerService.js';
import { GitService } from './gitService.js';
import { ReportService } from './reportService.js';
import type { AttackTreeNode, SecurityReport, GitRepoInfo } from '../types/index.js';

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
    const gitService = new GitService();
    const reportService = new ReportService();

    const target = url || repo || 'unknown';
    let gitInfo: GitRepoInfo | undefined;

    // Phase 0: Git Repository Analysis (if applicable)
    if (repo) {
      try {
        io.emit('recon:status', { 
          sessionId, 
          status: 'scanning',
          message: 'Analyzing Git repository...'
        });
        
        gitInfo = await gitService.analyzeRepository(repo);
        
        io.emit('recon:git-info', { 
          sessionId, 
          gitInfo: {
            totalFiles: gitInfo.files.length,
            technologies: gitInfo.technologies,
            hasSecrets: gitInfo.secretsFound,
            packageFiles: gitInfo.packageFiles.length,
            configFiles: gitInfo.configFiles.length
          }
        });
      } catch (error: any) {
        console.error('Git analysis error:', error);
        io.emit('recon:warning', { 
          sessionId, 
          message: `Could not analyze repository: ${error.message}` 
        });
      }
    }

    // Phase 1: Initial Analysis
    io.emit('recon:status', { 
      sessionId, 
      status: 'analyzing',
      message: 'Analyzing target security posture...'
    });

    const attackTree = await gemini.generateAttackTree(target, image, (node: AttackTreeNode) => {
      io.emit('recon:tree-update', { sessionId, node });
    }, gitInfo);

    io.emit('recon:tree-complete', { sessionId, tree: attackTree });

    // Phase 1.5: Generate Code Fixes (if repo analysis found vulnerabilities)
    if (repo && attackTree.length > 0) {
      try {
        io.emit('recon:status', { 
          sessionId, 
          status: 'fixing',
          message: '🔧 Generating security fixes with Gemini 2.0...'
        });
        
        const codeFixes = await gemini.generateCodeFixes(attackTree, gitInfo);
        
        if (codeFixes.length > 0) {
          io.emit('recon:code-fixes', { 
            sessionId, 
            fixes: codeFixes,
            message: `Generated ${codeFixes.length} security fixes`
          });
        }
      } catch (error: any) {
        console.error('Code fix generation error:', error);
      }
    }

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

    // Phase 5: Generate Reports
    io.emit('recon:status', { 
      sessionId, 
      status: 'reporting',
      message: 'Generating security reports...'
    });

    const report: SecurityReport = {
      sessionId,
      target,
      timestamp: Date.now(),
      summary: {
        criticalIssues: attackTree.filter(n => n.severity === 'critical').length,
        highIssues: attackTree.filter(n => n.severity === 'high').length,
        mediumIssues: attackTree.filter(n => n.severity === 'medium').length,
        lowIssues: attackTree.filter(n => n.severity === 'low').length,
      },
      attackTree,
      exploits,
      recommendations: [
        'Address critical vulnerabilities immediately',
        'Implement security headers and CORS policies',
        'Review and update dependencies regularly',
        'Enable security monitoring and logging',
        'Conduct regular penetration testing'
      ]
    };

    const htmlReport = reportService.generateHTMLReport(report);
    const markdownReport = reportService.generateMarkdownReport(report);

    io.emit('recon:reports', {
      sessionId,
      html: htmlReport,
      markdown: markdownReport
    });

    // Phase 6: Complete
    io.emit('recon:complete', { 
      sessionId,
      summary: {
        target,
        attackTreeNodes: attackTree.length,
        exploitsGenerated: exploits.length,
        criticalIssues: report.summary.criticalIssues,
        highIssues: report.summary.highIssues,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Reconnaissance error:', error);
    io.emit('recon:error', { sessionId, error: error.message });
  }
}
