import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface CodeSnippet {
  file: string;
  lineStart: number;
  lineEnd: number;
  code: string;
  issue: string;
}

interface AttackTreeNode {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
  affectedFiles?: string[];
  codeSnippets?: CodeSnippet[];
  cve?: string;
  remediation?: string;
}

interface ThinkingStep {
  id: string;
  step: number;
  thought: string;
  reasoning: string;
  timestamp: number;
}

interface Exploit {
  id: string;
  name: string;
  description: string;
  script: string;
  language: string;
  severity: string;
  category: string;
}

interface ExecutionResult {
  exploitId: string;
  success?: boolean;
  output?: string;
  errors?: string;
  duration?: number;
}

interface GitInfo {
  totalFiles: number;
  technologies: string[];
  hasSecrets: boolean;
  packageFiles: number;
  configFiles: number;
}

export function useRecon() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('');
  const [attackTree, setAttackTree] = useState<AttackTreeNode[]>([]);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [exploits, setExploits] = useState<Exploit[]>([]);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
  const [htmlReport, setHtmlReport] = useState<string>('');
  const [markdownReport, setMarkdownReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetName, setTargetName] = useState<string>('');

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('recon:status', (data) => {
      setStatus(data.status);
    });

    socketInstance.on('recon:git-info', (data) => {
      setGitInfo(data.gitInfo);
    });

    socketInstance.on('recon:tree-update', (data) => {
      // Transform 'name' to 'title' for frontend compatibility
      const node = data.node;
      setAttackTree(prev => [...prev, node]);
    });

    socketInstance.on('recon:tree-complete', (data) => {
      // Transform all nodes
      const transformedTree = data.tree.map((node: any) => ({
        ...node,
        ...node
      }));
      setAttackTree(transformedTree);
    });

    socketInstance.on('recon:thinking', (data) => {
      setThinkingSteps(prev => [...prev, data.step]);
    });

    socketInstance.on('recon:exploit', (data) => {
      setExploits(prev => [...prev, data.exploit]);
    });

    socketInstance.on('recon:execution-result', (data) => {
      setExecutionResults(prev => [...prev, data]);
    });

    socketInstance.on('recon:reports', (data) => {
      setHtmlReport(data.html);
      setMarkdownReport(data.markdown);
    });

    socketInstance.on('recon:complete', (data) => {
      setStatus('complete');
      setIsLoading(false);
    });

    socketInstance.on('recon:error', (data) => {
      console.error('Recon error:', data.error);
      setStatus('error');
      setIsLoading(false);
    });

    return () => {
      socketInstance.close();
    };
  }, []);

  const startRecon = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    setStatus('');
    setAttackTree([]);
    setThinkingSteps([]);
    setExploits([]);
    setExecutionResults([]);
    setGitInfo(null);
    setHtmlReport('');
    setMarkdownReport('');

    // Extract target name
    const url = formData.get('url') as string;
    const repo = formData.get('repo') as string;
    setTargetName(url || repo || 'target');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/recon`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to start reconnaissance');
      }

      const data = await response.json();
      console.log('Recon started:', data);
    } catch (error) {
      console.error('Error starting recon:', error);
      setIsLoading(false);
      setStatus('error');
    }
  }, []);

  return {
    startRecon,
    status,
    attackTree,
    thinkingSteps,
    exploits,
    executionResults,
    gitInfo,
    htmlReport,
    markdownReport,
    targetName,
    isLoading
  };
}
