export type AttackTreeNode = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
  status?: 'pending' | 'analyzing' | 'complete';
}

export type ThinkingStep = {
  id: string;
  step: number;
  thought: string;
  reasoning: string;
  timestamp: number;
}

export type Exploit = {
  id: string;
  name: string;
  description: string;
  script: string;
  language: 'bash' | 'python' | 'javascript';
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
}

export type ExecutionResult = {
  success: boolean;
  output: string;
  errors?: string | undefined;
  duration: number;
}
