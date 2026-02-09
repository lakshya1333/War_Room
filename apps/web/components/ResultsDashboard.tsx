'use client';

import { Code, CheckCircle, XCircle, Loader, Terminal, Play, Clock, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

interface ResultsDashboardProps {
  exploits: Exploit[];
  results: ExecutionResult[];
}

export function ResultsDashboard({ exploits, results }: ResultsDashboardProps) {
  const [selectedExploit, setSelectedExploit] = useState<string | null>(null);

  const getResult = (exploitId: string) => {
    return results.find(r => r.exploitId === exploitId);
  };

  const executedCount = results.length;
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => r.success === false).length;

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-5 border-l-2 border-[var(--accent-cyan)]"
        >
          <p className="metadata-label mb-2">Total Exploits</p>
          <p className="text-3xl font-mono font-bold text-white">{exploits.length}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="glass-panel rounded-xl p-5 border-l-2 border-[var(--accent-blue)]"
        >
          <p className="metadata-label mb-2">Executed</p>
          <p className="text-3xl font-mono font-bold text-[var(--accent-blue)]">{executedCount}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-5 border-l-2 border-[var(--status-success)]"
        >
          <p className="metadata-label mb-2">Successful</p>
          <p className="text-3xl font-mono font-bold text-[var(--status-success)]">{successCount}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass-panel rounded-xl p-5 border-l-2 border-[var(--status-critical)]"
        >
          <p className="metadata-label mb-2">Failed</p>
          <p className="text-3xl font-mono font-bold text-[var(--status-critical)]">{failureCount}</p>
        </motion.div>
      </div>

      {/* Enhanced Exploits Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exploits.map((exploit, index) => {
          const result = getResult(exploit.id);
          const isSelected = selectedExploit === exploit.id;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.08,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              key={exploit.id}
              onClick={() => setSelectedExploit(exploit.id)}
              className={cn(
                "group cursor-pointer rounded-xl glass-panel p-5 transition-all duration-300 hover:scale-[1.02]",
                isSelected 
                  ? "border-[var(--accent-cyan)] ring-2 ring-[var(--accent-cyan)]/30 shadow-[var(--shadow-glow-cyan)]" 
                  : "hover:border-[var(--accent-cyan)]/50"
              )}
            >
              {/* Icon and Status */}
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/10 border border-[var(--accent-cyan)]/30 p-3 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-5 w-5 text-[var(--accent-cyan)]" />
                </div>
                {result && (
                  result.success ? (
                    <CheckCircle className="h-6 w-6 text-[var(--status-success)] drop-shadow-[0_0_8px_var(--status-success)]" />
                  ) : (
                    <XCircle className="h-6 w-6 text-[var(--status-critical)] drop-shadow-[0_0_8px_var(--status-critical)]" />
                  )
                )}
                {!result && (
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--status-medium)]" 
                    style={{ boxShadow: '0 0 8px var(--status-medium)' }} 
                  />
                )}
              </div>
              
              {/* Title and Category */}
              <h3 className="font-bold text-white line-clamp-1 mb-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                {exploit.name}
              </h3>
              <p className="metadata-label mb-4">{exploit.category}</p>
              
              {/* Footer: Language and Severity */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                <span className="font-mono text-xs text-[var(--foreground-tertiary)] px-2 py-1 glass-panel rounded">
                  {exploit.language}
                </span>
                <span className={cn(
                  "status-badge",
                  exploit.severity === 'critical' ? 'status-critical' :
                  exploit.severity === 'high' ? 'status-high' :
                  'status-medium'
                )}>
                  {exploit.severity}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail View */}
      <AnimatePresence>
        {selectedExploit && (() => {
          const exploit = exploits.find(e => e.id === selectedExploit);
          const result = getResult(selectedExploit);
          
          if (!exploit) return null;

          return (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="cyber-border overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800"
            >
              <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-zinc-400" />
                  <h3 className="font-mono font-bold text-white">EXECUTION CONSOLE // {exploit.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedExploit(null)}
                  className="rounded bg-zinc-800 p-1 hover:bg-zinc-700 hover:text-white"
                >
                   Close Console
                </button>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-2">
                {/* Script Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-400">Payload Script</h4>
                    <span className="text-xs text-zinc-500">{exploit.language}</span>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-zinc-900 p-4">
                    <pre className="overflow-x-auto text-xs font-mono text-green-400 scrollbar-thin scrollbar-thumb-zinc-700">
                      <code>{exploit.script}</code>
                    </pre>
                  </div>
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-bold text-red-400">Target Description</p>
                        <p className="text-sm text-red-300/80">{exploit.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Execution Result */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-400">Execution Output</h4>
                    {result && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        <span>{result.duration}ms</span>
                      </div>
                    )}
                  </div>
                  <div className="flex h-[300px] flex-col rounded-lg bg-black border border-zinc-800 p-4 font-mono text-xs">
                    {!result ? (
                      <div className="flex flex-1 flex-col items-center justify-center text-zinc-500">
                        <Loader className="mb-2 h-6 w-6 animate-spin" />
                        <p>Waiting for sandbox execution...</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto whitespace-pre-wrap text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-800">
                          {result.output || <span className="text-zinc-600 italic">No standard output</span>}
                          {result.errors && (
                            <div className="mt-4 border-t border-red-900/50 pt-4 text-red-400">
                              <span className="text-red-500 font-bold">[STDERR]</span>
                              <br/>
                              {result.errors}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-2">
                          <div className={cn("h-2 w-2 rounded-full", result.success ? "bg-green-500" : "bg-red-500")} />
                          <span className={result.success ? "text-green-500" : "text-red-500"}>
                            Process exited with code {result.success ? '0 (Success)' : '1 (Error)'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
