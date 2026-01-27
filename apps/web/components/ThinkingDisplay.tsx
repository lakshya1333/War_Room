import { Brain, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ThinkingStep {
  id: string;
  step: number;
  thought: string;
  reasoning: string;
  timestamp: number;
}

interface ThinkingDisplayProps {
  steps: ThinkingStep[];
}

export function ThinkingDisplay({ steps }: ThinkingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [steps]);

  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <Brain className="mx-auto h-12 w-12 text-zinc-600" />
        <p className="mt-4 text-zinc-400">AI thinking process will appear here...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="max-h-[600px] space-y-4 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
    >
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className="animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4"
        >
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-400">
              Step {step.step}
            </span>
            <span className="text-xs text-zinc-500">
              {new Date(step.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            {step.thought}
          </p>
        </div>
      ))}
    </div>
  );
}
