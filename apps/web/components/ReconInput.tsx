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
    <div className="cyber-border relative overflow-hidden rounded-lg bg-zinc-950/80 p-1 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <Command className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Target Acquisition</h2>
              <p className="text-xs text-zinc-500">Select reconnaissance vector</p>
            </div>
          </div>
          <div className="flex rounded-lg bg-zinc-900/50 p-1">
            {(['url', 'repo', 'image'] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                  mode === m ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {mode === m && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-md bg-zinc-800"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 capitalize">
                  {m === 'url' && <Globe className="h-4 w-4" />}
                  {m === 'repo' && <Github className="h-4 w-4" />}
                  {m === 'image' && <Upload className="h-4 w-4" />}
                  {m}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'url' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Target URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://target.com"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {mode === 'repo' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">GitHub Repository</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                      placeholder="owner/repo"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {mode === 'image' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Upload Intelligence</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-zinc-800 bg-zinc-900/30 py-12 transition-all hover:border-red-500/50 hover:bg-zinc-900/50"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 group-hover:bg-zinc-800/80 group-hover:scale-110 transition-all duration-300">
                      <Upload className="h-8 w-8 text-zinc-400 group-hover:text-red-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-300">
                        {image ? image.name : 'Drop screenshot or click to upload'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
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

          <button
            type="submit"
            disabled={isLoading || (!url && !repo && !image)}
            className="group relative w-full overflow-hidden rounded-lg bg-red-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-500 hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-noise opacity-10" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>INITIALIZING SCAN...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>LAUNCH RECONNAISSANCE</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </form>
      </div>
    </div>
  );
}
