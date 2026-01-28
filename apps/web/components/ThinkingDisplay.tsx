'use client';

import { Brain, Zap, Terminal, Cpu, Activity } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  useEffect(() => {
    if (steps.length > 0) {
      setActiveStepId(steps[steps.length - 1].id);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [steps]);

  if (steps.length === 0) {
    return (
      <div className="cyber-border flex h-[400px] flex-col items-center justify-center rounded-lg bg-zinc-950/80 p-8 text-center backdrop-blur-xl">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20 opacity-75" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
            <Brain className="h-10 w-10 text-zinc-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-zinc-300">NEURAL ENGINE STANDBY</h3>
        <p className="mt-2 text-sm text-zinc-500">Awaiting target parameters for analysis...</p>
      </div>
    );
  }

  return (
    <div className="cyber-border flex h-[600px] flex-col overflow-hidden rounded-lg bg-zinc-950/80 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-purple-500 animate-pulse" />
          <span className="font-mono text-sm font-bold text-purple-400">GEMINI ALPHA 2.0 // THINKING_MODE</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Activity className="h-3 w-3" />
          <span>PROCESSING</span>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={containerRef}
        className="flex-1 space-y-4 overflow-y-auto p-4 font-mono scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => {
            const isActive = step.id === activeStepId;
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  "relative border-l-2 pl-4 transition-colors",
                  isActive ? "border-purple-500 bg-purple-500/5" : "border-zinc-800"
                )}
              >
                <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <span className={cn(
                    "font-bold",
                    isActive ? "text-purple-400" : "text-zinc-600"
                  )}>
                    Step 0{step.step}
                  </span>
                  <span className="text-zinc-700">
                    [{new Date(step.timestamp).toLocaleTimeString()}]
                  </span>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className={cn(
                    "text-sm leading-relaxed",
                    isActive ? "text-zinc-200" : "text-zinc-500"
                  )}>
                    {isActive ? (
                      <TypewriterText text={step.thought} />
                    ) : (
                      step.thought
                    )}
                  </p>
                </div>
                
                {isActive && (
                  <motion.div
                    layoutId="cursor"
                    className="absolute -left-[5px] top-0 h-full w-[2px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Loading Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-600">
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index >= text.length) {
          clearInterval(intervalId);
          return text;
        }
        const nextChar = text.charAt(index);
        index++;
        return prev + nextChar;
      });
    }, 10); // Adjust speed here

    return () => clearInterval(intervalId);
  }, [text]);

  return <span>{displayedText}</span>;
}
