export type AttackTreeNode = {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
  status?: 'pending' | 'analyzing' | 'complete';
  affectedFiles?: string[];
  codeSnippets?: CodeSnippet[];
  cve?: string;
  remediation?: string;
}

export type CodeSnippet = {
  file: string;
  lineStart: number;
  lineEnd: number;
  code: string;
  issue: string;
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

export type GitRepoInfo = {
  url: string;
  files: string[];
  technologies: string[];
  packageFiles: string[];
  configFiles: string[];
  secretsFound: boolean;
}

export type SecurityReport = {
  sessionId: string;
  target: string;
  timestamp: number;
  summary: {
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
  attackTree: AttackTreeNode[];
  exploits: Exploit[];
  recommendations: string[];
}
