export interface AttackTreeNode {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
  status?: 'pending' | 'analyzing' | 'complete';
}

export interface ThinkingStep {
  id: string;
  step: number;
  thought: string;
  reasoning: string;
  timestamp: number;
}

export interface Exploit {
  id: string;
  name: string;
  description: string;
  script: string;
  language: 'bash' | 'python' | 'javascript';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  errors?: string;
  duration: number;
}
