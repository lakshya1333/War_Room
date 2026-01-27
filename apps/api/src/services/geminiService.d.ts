import { AttackTreeNode, ThinkingStep, Exploit } from '../types';
export declare class GeminiService {
    private genAI;
    private model;
    private thinkingModel;
    constructor();
    generateAttackTree(target: string, image?: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
    }, onNodeUpdate?: (node: AttackTreeNode) => void): Promise<AttackTreeNode[]>;
    analyzeWithThinking(target: string, image: any, attackTree: AttackTreeNode[], onThinkingStep?: (step: ThinkingStep) => void): Promise<ThinkingStep[]>;
    generateExploits(target: string, attackTree: AttackTreeNode[], thinkingSteps: ThinkingStep[], onExploitGenerated?: (exploit: Exploit) => void): Promise<Exploit[]>;
}
//# sourceMappingURL=geminiService.d.ts.map