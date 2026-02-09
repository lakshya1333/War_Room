'use client';

import { AlertTriangle, Shield, AlertCircle, Info, ChevronRight, FileCode, FolderOpen, Copy, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { GlitchText } from './GlitchText';
import { TypewriterText } from './TypewriterText';
import { audioManager } from '@/lib/audioManager';

interface CodeSnippet {
  file: string;
  lineStart: number;
  lineEnd: number;
  code: string;
  issue: string;
}

interface AttackTreeNode {
  id: string;
  title?: string;
  name?: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
  affectedFiles?: string[];
  codeSnippets?: CodeSnippet[];
  cve?: string;
  remediation?: string;
}

interface AttackTreeProps {
  nodes: AttackTreeNode[];
}

const severityIcons = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Shield,
  low: Info
};

const severityConfig = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/50', glow: 'shadow-red-500/20' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/50', glow: 'shadow-orange-500/20' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', glow: 'shadow-yellow-500/20' },
  low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50', glow: 'shadow-blue-500/20' }
} as const;

const defaultConfig = { 
  color: 'text-zinc-500', 
  bg: 'bg-zinc-500/10', 
  border: 'border-zinc-500/50', 
  glow: 'shadow-zinc-500/20' 
};

function CodeSnippetDisplay({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-lg border border-zinc-800 bg-black/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <FileCode className="h-3 w-3 text-orange-500" />
          <span className="font-mono text-orange-500">{snippet.file}</span>
          <span className="text-zinc-600">:</span>
          <span className="text-zinc-500">L{snippet.lineStart}-{snippet.lineEnd}</span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded p-1 hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3 text-zinc-500" />
          )}
        </button>
      </div>
      <pre className="overflow-x-auto rounded bg-zinc-950 p-3 text-xs">
        <code className="font-mono text-green-400">{snippet.code}</code>
      </pre>
      <div className="mt-2 flex items-start gap-2 rounded bg-yellow-500/10 p-2 text-xs">
        <AlertTriangle className="h-3 w-3 shrink-0 text-yellow-500 mt-0.5" />
        <span className="text-yellow-500/90">{snippet.issue}</span>
      </div>
    </div>
  );
}

function TreeNode({ node, depth = 0 }: { node: AttackTreeNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isNew, setIsNew] = useState(true);
  
  useEffect(() => {
    // Play sound when new node appears
    if (isNew) {
      audioManager.play('vulnerability-found');
      const timer = setTimeout(() => setIsNew(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const normalizedSeverity = (node.severity || 'low').toLowerCase() as keyof typeof severityConfig;
  const Icon = severityIcons[normalizedSeverity] || Info;
  const config = severityConfig[normalizedSeverity] || defaultConfig;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10"
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border glass-panel p-5 transition-all duration-300 hover:border-[var(--accent-cyan)]/50",
            config.border
          )}
        >
          {/* Severity Indicator Bar */}
          <div className={cn(
            "absolute inset-y-0 left-0 w-1",
            config.bg.replace('/10', '/80')
          )} />
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-cyan)]/0 to-[var(--accent-blue)]/0 group-hover:from-[var(--accent-cyan)]/5 group-hover:to-[var(--accent-blue)]/5 pointer-events-none transition-all duration-500" />
          
          {depth > 0 && (
            <div className="absolute -left-4 top-1/2 h-px w-4 bg-zinc-700" />
          )}

          <div className="flex items-start gap-4 relative z-10">
            {/* Icon Badge */}
            <div className={cn(
              "mt-1 rounded-lg p-2.5 border",
              config.bg,
              config.border,
              "shimmer-effect"
            )}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>

            <div className="flex-1 min-w-0">
              {/* Title and Badges Row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-base text-white group-hover:text-glow-cyan transition-all flex-1 min-w-0">
                  {isNew ? (
                    <GlitchText text={node.name || 'Unknown'} severity={normalizedSeverity} glitchOnMount />
                  ) : (
                    node.name || 'Unknown'
                  )}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {node.cve && (
                    <span className="glass-panel px-2.5 py-1 text-[10px] font-mono font-bold text-[var(--accent-cyan)] border-[var(--accent-cyan)]/30">
                      {node.cve}
                    </span>
                  )}
                  <span className={cn(
                    "status-badge",
                    `status-${normalizedSeverity}`
                  )}>
                    {node.severity}
                  </span>
                  {node.children && node.children.length > 0 && (
                    <ChevronRight className={cn(
                      "h-4 w-4 text-[var(--foreground-tertiary)] transition-all duration-300",
                      isExpanded ? "rotate-90 text-[var(--accent-cyan)]" : ""
                    )} />
                  )}
                </div>
              </div>
              
              {/* Description */}
              <p className="mt-2.5 text-sm text-[var(--foreground-secondary)] leading-relaxed group-hover:text-[var(--foreground-primary)] transition-colors">
                {node.description}
              </p>

              {/* Affected Files */}
              {node.affectedFiles && node.affectedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {node.affectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 rounded bg-zinc-800/50 px-2 py-1 text-xs"
                    >
                      <FolderOpen className="h-3 w-3 text-orange-500" />
                      <span className="font-mono text-orange-400">{file}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Snippets */}
              {node.codeSnippets && node.codeSnippets.length > 0 && (
                <div className="mt-3 space-y-2">
                  {node.codeSnippets.map((snippet, i) => (
                    <CodeSnippetDisplay key={i} snippet={snippet} />
                  ))}
                </div>
              )}

              {/* Remediation */}
              {node.remediation && (
                <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-green-500">
                    <Check className="h-3 w-3" />
                    <span>REMEDIATION</span>
                  </div>
                  <p className="text-xs text-green-400/80">{node.remediation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isExpanded && node.children && node.children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative ml-8 mt-4 space-y-4 border-l-2 border-zinc-800/50 pl-8"
          >
            {node.children.map((child, index) => (
              <TreeNode key={child.id || `child-${depth}-${index}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AttackTree({ nodes }: AttackTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="glass-panel flex h-[350px] flex-col items-center justify-center rounded-xl p-8 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-[var(--accent-cyan)]/20 opacity-75" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/10 border border-[var(--border-primary)]">
            <Share2 className="h-10 w-10 text-[var(--foreground-tertiary)]" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">ATTACK TREE EMPTY</h3>
        <p className="metadata-label">Waiting for intelligence gathering...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel-elevated rounded-xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--border-accent)] bg-gradient-to-r from-[var(--status-critical)]/5 to-[var(--status-high)]/5 px-6 py-3.5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--status-critical)]/10 border border-[var(--status-critical)]/30">
              <Share2 className="h-4 w-4 text-[var(--status-critical)]" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              <span className="text-glow-cyan">ATTACK VECTOR MAP</span>
            </h2>
          </div>
          
          {/* Severity Legend */}
          <div className="flex gap-3">
            {Object.keys(severityConfig).map((severity) => (
              <div key={severity} className="flex items-center gap-1.5">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  severityConfig[severity as keyof typeof severityConfig].bg.replace('/10', '/80')
                )} />
                <span className="metadata-label">{severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tree Nodes */}
      <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
        {nodes.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
