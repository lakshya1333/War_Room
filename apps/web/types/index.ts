export interface AttackTreeNode {
  id: string;
  name: string;  // Backend uses 'name', not 'title'
  title?: string; // Optional alias for backwards compatibility
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in-progress' | 'completed' | 'failed';
  children?: AttackTreeNode[];
  affectedFiles?: string[];
  codeSnippets?: Array<{
    file: string;
    lineStart: number;
    lineEnd: number;
    code: string;
    issue: string;
  }>;
  cve?: string;
  remediation?: string;
}
