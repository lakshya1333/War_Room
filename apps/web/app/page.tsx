'use client';

import { useState } from 'react';
import { ReconInput } from '@/components/ReconInput';
import { AttackTree } from '@/components/AttackTree';
import { ThinkingDisplay } from '@/components/ThinkingDisplay';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { useRecon } from '@/hooks/useRecon';

export default function Home() {
  const { 
    startRecon, 
    status, 
    attackTree, 
    thinkingSteps, 
    exploits,
    executionResults,
    isLoading 
  } = useRecon();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-red-500">
            ⚔️ WAR ROOM
          </h1>
          <p className="text-sm text-zinc-400">
            Automated Penetration Testing & Reconnaissance
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <ReconInput onLaunch={startRecon} isLoading={isLoading} />

        {status && (
          <div className="mt-8 space-y-6">
            {/* Status Bar */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400">Status</p>
                  <p className="text-lg font-semibold capitalize">{status}</p>
                </div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attack Tree */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">🌳 Attack Tree</h2>
                <AttackTree nodes={attackTree} />
              </div>

              {/* Thinking Display */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">🧠 AI Thinking</h2>
                <ThinkingDisplay steps={thinkingSteps} />
              </div>
            </div>

            {/* Results Dashboard */}
            {(exploits.length > 0 || executionResults.length > 0) && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">📊 Results Dashboard</h2>
                <ResultsDashboard 
                  exploits={exploits} 
                  results={executionResults}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
