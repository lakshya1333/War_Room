'use client';

import { AlertTriangle, Shield, AlertCircle, Info, ChevronRight, FileCode, FolderOpen, Copy, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeSnippet {
  file: string;
  lineStart: number;
  lineEnd: number;
  code: string;
  issue: string;
}

interface AttackTreeNode {
  id: string;
  name: string;
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
  
  const normalizedSeverity = (node.severity || 'low').toLowerCase() as keyof typeof severityConfig;
  const Icon = severityIcons[normalizedSeverity] || Info;
  const config = severityConfig[normalizedSeverity] || defaultConfig;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10"
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-zinc-900/80 p-4 transition-all hover:bg-zinc-800",
            config.border,
            config.glow
          )}
        >
          <div className={cn("absolute inset-y-0 left-0 w-1 opacity-50", config.bg.replace('/10', '/50'))} />
          
          {depth > 0 && (
            <div className="absolute -left-4 top-1/2 h-px w-4 bg-zinc-700" />
          )}

          <div className="flex items-start gap-4">
            <div className={cn("mt-1 rounded-md p-2", config.bg)}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-sm font-bold text-zinc-100 group-hover:text-white">
                  {node.name}
                </h3>
                <div className="flex items-center gap-2">
                  {node.cve && (
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                      {node.cve}
                    </span>
                  )}
                  <span className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                    config.bg,
                    config.color
                  )}>
                    {node.severity}
                  </span>
                  {node.children && node.children.length > 0 && (
                    <ChevronRight className={cn(
                      "h-4 w-4 text-zinc-500 transition-transform",
                      isExpanded ? "rotate-90" : ""
                    )} />
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300">
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
      <div className="cyber-border flex h-[300px] flex-col items-center justify-center rounded-lg bg-zinc-950/80 p-8 text-center backdrop-blur-xl">
        <Share2 className="mb-4 h-12 w-12 text-zinc-800" />
        <h3 className="font-mono text-lg font-bold text-zinc-500">ATTACK TREE EMPTY</h3>
        <p className="text-sm text-zinc-600">Waiting for intelligence gathering...</p>
      </div>
    );
  }

  return (
    <div className="cyber-border rounded-lg bg-zinc-950/80 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Share2 className="h-5 w-5 text-red-500" />
          <span className="text-red-500">ATTACK VECTOR MAP</span>
        </h2>
        <div className="flex gap-2">
          {Object.keys(severityConfig).map((severity) => (
            <div key={severity} className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", severityConfig[severity as keyof typeof severityConfig].bg.replace('/10', ''))} />
              <span className="text-[10px] uppercase text-zinc-500">{severity}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {nodes.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
