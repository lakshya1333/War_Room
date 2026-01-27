import { Code, CheckCircle, XCircle, Loader, Terminal } from 'lucide-react';
import { useState } from 'react';

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

  return (
    <div className="space-y-6">
      {/* Exploits Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exploits.map(exploit => {
          const result = getResult(exploit.id);
          
          return (
            <div
              key={exploit.id}
              onClick={() => setSelectedExploit(exploit.id)}
              className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-red-500 hover:bg-zinc-900"
            >
              <div className="mb-2 flex items-start justify-between">
                <Code className="h-5 w-5 text-red-500" />
                {result && (
                  result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )
                )}
                {!result && <Loader className="h-5 w-5 animate-spin text-yellow-500" />}
              </div>
              
              <h3 className="font-semibold text-white">{exploit.name}</h3>
              <p className="mt-1 text-xs text-zinc-400">{exploit.category}</p>
              
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                  {exploit.language}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  exploit.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  exploit.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {exploit.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Exploit Details */}
      {selectedExploit && (() => {
        const exploit = exploits.find(e => e.id === selectedExploit);
        const result = getResult(selectedExploit);
        
        if (!exploit) return null;

        return (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{exploit.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{exploit.description}</p>
              </div>
              <button
                onClick={() => setSelectedExploit(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Script */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">Script</span>
              </div>
              <pre className="overflow-x-auto rounded-md bg-black p-4 text-sm">
                <code className="text-green-400">{exploit.script}</code>
              </pre>
            </div>

            {/* Execution Results */}
            {result && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">
                    Execution Result
                    {result.duration && (
                      <span className="ml-2 text-zinc-400">
                        ({result.duration}ms)
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {result.output && (
                    <div className="rounded-md bg-black p-4">
                      <p className="text-xs font-medium text-zinc-400 mb-2">OUTPUT</p>
                      <pre className="text-sm text-zinc-300 whitespace-pre-wrap">
                        {result.output}
                      </pre>
                    </div>
                  )}
                  
                  {result.errors && (
                    <div className="rounded-md bg-red-500/10 p-4">
                      <p className="text-xs font-medium text-red-400 mb-2">ERRORS</p>
                      <pre className="text-sm text-red-300 whitespace-pre-wrap">
                        {result.errors}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Total Exploits</p>
          <p className="mt-1 text-2xl font-bold text-white">{exploits.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Executed</p>
          <p className="mt-1 text-2xl font-bold text-white">{results.length}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Successful</p>
          <p className="mt-1 text-2xl font-bold text-green-500">
            {results.filter(r => r.success).length}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-sm text-zinc-400">Failed</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            {results.filter(r => !r.success).length}
          </p>
        </div>
      </div>
    </div>
  );
}
