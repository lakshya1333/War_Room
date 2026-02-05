'use client';

import { useState } from 'react';
import { FileCode, Check, X, Copy, Download, Wand2 } from 'lucide-react';
import { GlitchText } from './GlitchText';

interface CodeFix {
  file: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
}

interface CodeFixesDisplayProps {
  fixes: CodeFix[];
}

export function CodeFixesDisplay({ fixes }: CodeFixesDisplayProps) {
  const [selectedFix, setSelectedFix] = useState(0);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedFixed, setCopiedFixed] = useState(false);

  if (fixes.length === 0) return null;

  const currentFix = fixes[selectedFix];

  const copyOriginal = () => {
    navigator.clipboard.writeText(currentFix.originalCode);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const copyFixed = () => {
    navigator.clipboard.writeText(currentFix.fixedCode);
    setCopiedFixed(true);
    setTimeout(() => setCopiedFixed(false), 2000);
  };

  const downloadPatch = () => {
    const patch = `--- a/${currentFix.file}
+++ b/${currentFix.file}
@@ -1,${currentFix.originalCode.split('\n').length} +1,${currentFix.fixedCode.split('\n').length} @@
-${currentFix.originalCode.split('\n').join('\n-')}
+${currentFix.fixedCode.split('\n').join('\n+')}`;

    const blob = new Blob([patch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFix.file.replace(/\//g, '_')}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cyber-border rounded-lg bg-zinc-950/80 backdrop-blur-xl overflow-hidden">
      <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-purple-500 animate-pulse" />
          <GlitchText 
            text="AI-GENERATED SECURITY FIXES" 
            className="text-sm font-bold uppercase tracking-wide"
            severity="high"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{fixes.length} fixes available</span>
          <button
            onClick={downloadPatch}
            className="text-xs px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Patch
          </button>
        </div>
      </div>

      {/* File selector */}
      <div className="border-b border-zinc-800/50 bg-black/30 p-2 flex gap-2 overflow-x-auto">
        {fixes.map((fix, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedFix(idx)}
            className={`text-xs px-3 py-1.5 rounded whitespace-nowrap transition-colors ${
              selectedFix === idx
                ? 'bg-purple-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <FileCode className="h-3 w-3 inline mr-1" />
            {fix.file.split('/').pop()}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* Explanation */}
        <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-3">
          <div className="text-xs font-bold text-purple-400 mb-1 uppercase tracking-wide">Fix Explanation</div>
          <div className="text-sm text-zinc-300">{currentFix.explanation}</div>
        </div>

        {/* Side-by-side diff */}
        <div className="grid grid-cols-2 gap-4">
          {/* Original Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase">Vulnerable Code</span>
              </div>
              <button
                onClick={copyOriginal}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copiedOriginal ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="bg-red-950/20 border border-red-500/30 rounded-lg overflow-hidden">
              <pre className="p-3 overflow-x-auto text-xs">
                <code className="font-mono text-red-400">{currentFix.originalCode}</code>
              </pre>
            </div>
          </div>

          {/* Fixed Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-xs font-bold text-green-500 uppercase">Secure Code</span>
              </div>
              <button
                onClick={copyFixed}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                {copiedFixed ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="bg-green-950/20 border border-green-500/30 rounded-lg overflow-hidden">
              <pre className="p-3 overflow-x-auto text-xs">
                <code className="font-mono text-green-400">{currentFix.fixedCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800/50">
          <button className="text-xs px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700">
            View Diff
          </button>
          <button className="text-xs px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Apply Fix
          </button>
        </div>
      </div>
    </div>
  );
}
