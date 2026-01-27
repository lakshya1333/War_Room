import { useState, useRef } from 'react';
import { Upload, Globe, Github, Zap } from 'lucide-react';

interface ReconInputProps {
  onLaunch: (formData: FormData) => void;
  isLoading: boolean;
}

export function ReconInput({ onLaunch, isLoading }: ReconInputProps) {
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

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Globe className="h-4 w-4" />
              Target URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Repo Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Github className="h-4 w-4" />
              GitHub Repo
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="owner/repository"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Upload className="h-4 w-4" />
            Screenshot / Hardware Photo (Optional)
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-zinc-700 bg-zinc-800/50 p-8 hover:border-red-500 hover:bg-zinc-800"
          >
            {image ? (
              <div className="text-center">
                <p className="text-sm font-medium text-white">{image.name}</p>
                <p className="text-xs text-zinc-400">{(image.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-zinc-500" />
                <p className="mt-2 text-sm text-zinc-400">
                  Click to upload image
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        {/* Launch Button */}
        <button
          type="submit"
          disabled={isLoading || (!url && !repo)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Running Reconnaissance...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Launch Recon
            </>
          )}
        </button>
      </form>
    </div>
  );
}
