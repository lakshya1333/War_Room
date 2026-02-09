'use client';

import { useState, useRef } from 'react';
import { Upload, Globe, Github, Zap, Terminal, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReconInputProps {
  onLaunch: (formData: FormData) => void;
  isLoading: boolean;
}

type InputMode = 'url' | 'repo' | 'image';

export function ReconInput({ onLaunch, isLoading }: ReconInputProps) {
  const [mode, setMode] = useState<InputMode>('url');
  const [url, setUrl] = useState('');
  const [repo, setRepo] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (url) formData.append('url', url);
    if (repo) formData.append('repo', repo);
    if (image) formData.append('image', image);

    onLaunch(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel-elevated relative overflow-hidden rounded-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 to-transparent pointer-events-none" />
      
      <div className="p-6 relative z-10">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/10 border border-[var(--accent-cyan)]/30 shimmer-effect">
              <Command className="h-5 w-5 text-[var(--accent-cyan)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Target Acquisition</h2>
              <p className="metadata-label mt-0.5">Select reconnaissance vector</p>
            </div>
          </div>
          
          {/* Enhanced Tab Switcher */}
          <div className="glass-panel rounded-lg p-1 flex gap-1">
            {(['url', 'repo', 'image'] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300",
                  mode === m 
                    ? "text-white" 
                    : "text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)]"
                )}
              >
                {mode === m && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/10 border border-[var(--accent-cyan)]/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide metadata-label">
                  {m === 'url' && <Globe className="h-4 w-4" />}
                  {m === 'repo' && <Github className="h-4 w-4" />}
                  {m === 'image' && <Upload className="h-4 w-4" />}
                  {m}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {mode === 'url' && (
                <div className="space-y-2">
                  <label className="metadata-label">Target URL</label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-tertiary)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://target.com"
                      className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-glass)] py-3.5 pl-12 pr-4 text-white placeholder:text-[var(--foreground-tertiary)] focus:border-[var(--accent-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all backdrop-blur-sm"
                      autoFocus
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--accent-cyan)]/0 to-[var(--accent-blue)]/0 group-focus-within:from-[var(--accent-cyan)]/5 group-focus-within:to-[var(--accent-blue)]/5 pointer-events-none transition-all duration-300" />
                  </div>
                </div>
              )}

              {mode === 'repo' && (
                <div className="space-y-2">
                  <label className="metadata-label">GitHub Repository</label>
                  <div className="relative group">
                    <Github className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-tertiary)] group-focus-within:text-[var(--accent-cyan)] transition-colors" />
                    <input
                      type="text"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="owner/repo"
                      className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--surface-glass)] py-3.5 pl-12 pr-4 text-white placeholder:text-[var(--foreground-tertiary)] focus:border-[var(--accent-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all backdrop-blur-sm"
                      autoFocus
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--accent-cyan)]/0 to-[var(--accent-blue)]/0 group-focus-within:from-[var(--accent-cyan)]/5 group-focus-within:to-[var(--accent-blue)]/5 pointer-events-none transition-all duration-300" />
                  </div>
                </div>
              )}

              {mode === 'image' && (
                <div className="space-y-2">
                  <label className="metadata-label">Upload Intelligence</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--surface-glass)] py-10 transition-all hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--surface-elevated)] backdrop-blur-sm"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/10 border border-[var(--accent-cyan)]/30 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-cyan)] transition-all duration-300">
                      <Upload className="h-7 w-7 text-[var(--accent-cyan)]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        {image ? image.name : 'Drop screenshot or click to upload'}
                      </p>
                      <p className="mt-1.5 metadata-label">
                        Supports PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Launch Button */}
          <button
            type="submit"
            disabled={isLoading || (!url && !repo && !image)}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] px-6 py-4 font-bold text-white shadow-lg hover:shadow-[var(--shadow-glow-cyan)] transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale"
          >
            <div className="absolute inset-0 bg-noise opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
                  <span className="text-sm uppercase tracking-wider">INITIALIZING SCAN...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                  <span className="text-sm uppercase tracking-wider">LAUNCH RECONNAISSANCE</span>
                  <Zap className="h-5 w-5 transition-transform group-hover:scale-125 group-hover:-rotate-12" />
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
