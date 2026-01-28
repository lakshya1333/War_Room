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
      {/* Stats Header */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="cyber-border rounded-lg bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Total Exploits</p>
          <p className="mt-1 text-2xl font-mono font-bold text-white">{exploits.length}</p>
        </div>
        <div className="cyber-border rounded-lg bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Executed</p>
          <p className="mt-1 text-2xl font-mono font-bold text-blue-400">{executedCount}</p>
        </div>
        <div className="cyber-border rounded-lg bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Successful</p>
          <p className="mt-1 text-2xl font-mono font-bold text-green-400">{successCount}</p>
        </div>
        <div className="cyber-border rounded-lg bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Failed</p>
          <p className="mt-1 text-2xl font-mono font-bold text-red-400">{failureCount}</p>
        </div>
      </div>

      {/* Exploits Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exploits.map((exploit, index) => {
          const result = getResult(exploit.id);
          const isSelected = selectedExploit === exploit.id;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={exploit.id}
              onClick={() => setSelectedExploit(exploit.id)}
              className={cn(
                "cursor-pointer rounded-lg border bg-zinc-900/50 p-4 transition-all hover:bg-zinc-900",
                isSelected ? "border-red-500 ring-1 ring-red-500" : "border-zinc-800 hover:border-red-500/50"
              )}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-zinc-800 p-2">
                  <Code className="h-5 w-5 text-zinc-400" />
                </div>
                {result && (
                  result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )
                )}
                {!result && <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />}
              </div>
              
              <h3 className="font-semibold text-white line-clamp-1">{exploit.name}</h3>
              <p className="mt-1 text-xs text-zinc-400">{exploit.category}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500">
                  {exploit.language}
                </span>
                <span className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                  exploit.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  exploit.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
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
