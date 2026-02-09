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
      <div className="glass-panel flex h-[450px] flex-col items-center justify-center rounded-xl p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--accent-blue)]/20 opacity-75" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-cyan)]/10 border border-[var(--accent-blue)]/30 shimmer-effect">
            <Brain className="h-12 w-12 text-[var(--accent-blue)]" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">NEURAL ENGINE STANDBY</h3>
        <p className="metadata-label">Awaiting target parameters for analysis...</p>
        <div className="mt-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-elevated flex h-[650px] flex-col overflow-hidden rounded-xl">
      {/* Enhanced Header */}
      <div className="border-b border-[var(--border-accent)] bg-gradient-to-r from-[var(--accent-blue)]/10 to-[var(--accent-cyan)]/5 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30">
              <Cpu className="h-4 w-4 text-[var(--accent-blue)] animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-sm font-bold text-[var(--accent-blue)]">GEMINI 2.0 FLASH</span>
              <p className="metadata-label mt-0.5">Extended Thinking Mode Active</p>
            </div>
          </div>
          <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg">
            <Activity className="h-3.5 w-3.5 text-[var(--status-success)] animate-pulse" />
            <span className="metadata-label">PROCESSING</span>
          </div>
        </div>
      </div>

      {/* Enhanced Content Stream */}
      <div 
        ref={containerRef}
        className="flex-1 space-y-3 overflow-y-auto p-6 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => {
            const isActive = step.id === activeStepId;
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: index * 0.05 
                }}
                className={cn(
                  "relative border-l-2 pl-5 py-3 rounded-r-lg transition-all duration-300",
                  isActive 
                    ? "border-[var(--accent-blue)] bg-gradient-to-r from-[var(--accent-blue)]/10 to-transparent" 
                    : "border-[var(--border-primary)] hover:border-[var(--accent-cyan)]/30"
                )}
              >
                {/* Step Header */}
                <div className="mb-2 flex items-center gap-3">
                  <span className={cn(
                    "font-bold metadata-label",
                    isActive ? "text-[var(--accent-blue)]" : "text-[var(--foreground-tertiary)]"
                  )}>
                    STEP {String(step.step).padStart(2, '0')}
                  </span>
                  <span className="metadata-label text-[var(--foreground-tertiary)]">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1.5 glass-panel px-2 py-0.5 rounded">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
                      <span className="metadata-label text-[var(--accent-blue)]">LIVE</span>
                    </span>
                  )}
                </div>
                
                {/* Thought Content */}
                <div className="prose prose-invert max-w-none">
                  <p className={cn(
                    "text-sm leading-relaxed font-mono",
                    isActive ? "text-white" : "text-[var(--foreground-secondary)]"
                  )}>
                    {isActive ? (
                      <TypewriterText text={step.thought} />
                    ) : (
                      step.thought
                    )}
                  </p>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeCursor"
                    className="absolute -left-[5px] top-0 h-full w-[3px] rounded-full bg-[var(--accent-blue)]"
                    style={{
                      boxShadow: '0 0 10px var(--accent-blue-glow), 0 0 20px var(--accent-blue-glow)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Thinking Cursor */}
        <div className="flex items-center gap-2 pl-5 py-2">
          <span className="h-3 w-0.5 bg-[var(--accent-blue)] animate-pulse" />
          <span className="metadata-label text-[var(--accent-blue)] animate-pulse">Analyzing...</span>
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
