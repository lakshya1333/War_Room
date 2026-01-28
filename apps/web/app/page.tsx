'use client';

import { useState, useEffect } from 'react';
import { ReconInput } from '@/components/ReconInput';
import { AttackTree } from '@/components/AttackTree';
import { ThinkingDisplay } from '@/components/ThinkingDisplay';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useRecon } from '@/hooks/useRecon';
import { Shield, Target, Activity, Terminal, Crosshair } from 'lucide-react';

export default function Home() {
  const [sessionId, setSessionId] = useState('INITIALIZING');
  const [mounted, setMounted] = useState(false);
  
  const { 
    startRecon, 
    status, 
    attackTree, 
    thinkingSteps, 
    exploits,
    executionResults,
    isLoading 
  } = useRecon();

  useEffect(() => {
    setSessionId(Date.now().toString(16).toUpperCase());
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 selection:text-red-200">
      {/* Background Grid Animation is handled in globals.css */}
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-20"></span>
              <Shield className="relative h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                WAR ROOM <span className="text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">V.3.0</span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Automated Offensive Cyber Operations
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span>SYSTEM {status ? 'ACTIVE' : 'IDLE'}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>LATENCY: 24ms</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>NODES: {attackTree.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        {/* Top Grid: Input & Thinking */}
        <div className="grid gap-6 lg:grid-cols-12 h-full">
          {/* Left Column: Input & Tree (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ReconInput onLaunch={startRecon} isLoading={isLoading} />
            <AttackTree nodes={attackTree} />
          </div>

          {/* Right Column: Thinking & Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ThinkingDisplay steps={thinkingSteps} />
            {exploits.length > 0 && (
              <div className="cyber-border rounded-lg bg-zinc-950/80 p-1 backdrop-blur-xl">
                 <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Exploitation Dashboard</span>
                    </div>
                 </div>
                 <div className="p-4">
                   <ResultsDashboard exploits={exploits} results={executionResults} />
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer / Status Line */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-black/80 px-4 py-1 backdrop-blur text-[10px] font-mono text-zinc-600 flex justify-between">
        <div>
          SESSION_ID: {sessionId} // GEMINI_3_PRO_PREVIEW // SECURE_CONNECTION
        </div>
        <div>
           COPYRIGHT 2026 WAR ROOM OPS
        </div>
      </footer>
    </div>
  );
}
