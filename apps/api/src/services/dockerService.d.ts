import { ExecutionResult } from '../types';
export declare class DockerService {
    private docker;
    constructor();
    executeScript(script: string, target: string): Promise<ExecutionResult>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=dockerService.d.ts.map