"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReconnaissance = startReconnaissance;
const socket_io_1 = require("socket.io");
const geminiService_1 = require("./geminiService");
const dockerService_1 = require("./dockerService");
const types_1 = require("../types");
async function startReconnaissance(params) {
    const { sessionId, url, repo, image, io } = params;
    try {
        io.emit('recon:status', {
            sessionId,
            status: 'initializing',
            message: 'Starting reconnaissance...'
        });
        const gemini = new geminiService_1.GeminiService();
        const docker = new dockerService_1.DockerService();
        // Phase 1: Initial Analysis
        io.emit('recon:status', {
            sessionId,
            status: 'analyzing',
            message: 'Analyzing target...'
        });
        const target = url || repo || 'unknown';
        const attackTree = await gemini.generateAttackTree(target, image, (node) => {
            io.emit('recon:tree-update', { sessionId, node });
        });
        io.emit('recon:tree-complete', { sessionId, tree: attackTree });
        // Phase 2: Thinking Mode Analysis
        io.emit('recon:status', {
            sessionId,
            status: 'thinking',
            message: 'Deep analysis in progress...'
        });
        const thinkingSteps = await gemini.analyzeWithThinking(target, image, attackTree, (step) => {
            io.emit('recon:thinking', { sessionId, step });
        });
        // Phase 3: Generate Exploits
        io.emit('recon:status', {
            sessionId,
            status: 'generating',
            message: 'Generating exploit scripts...'
        });
        const exploits = await gemini.generateExploits(target, attackTree, thinkingSteps, (exploit) => {
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
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('Reconnaissance error:', error);
        io.emit('recon:error', { sessionId, error: error.message });
    }
}
//# sourceMappingURL=reconService.js.map