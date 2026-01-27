import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface AttackTreeNode {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
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

export function useRecon() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [status, setStatus] = useState<string>('');
  const [attackTree, setAttackTree] = useState<AttackTreeNode[]>([]);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [exploits, setExploits] = useState<Exploit[]>([]);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('recon:status', (data) => {
      setStatus(data.status);
    });

    socketInstance.on('recon:tree-update', (data) => {
      setAttackTree(prev => [...prev, data.node]);
    });

    socketInstance.on('recon:tree-complete', (data) => {
      setAttackTree(data.tree);
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
    isLoading
  };
}
