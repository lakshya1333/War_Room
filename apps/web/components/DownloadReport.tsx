'use client';

import { Download, FileText, FileCode } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DownloadReportProps {
  htmlReport?: string;
  markdownReport?: string;
  targetName: string;
}

export function DownloadReport({ htmlReport, markdownReport, targetName }: DownloadReportProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    if (!htmlReport) return;
    setDownloading(true);
    const safeTarget = targetName.replace(/[^a-z0-9]/gi, '_');
    const filename = `war-room-report-${safeTarget}-${Date.now()}.html`;
    downloadFile(htmlReport, filename, 'text/html');
    setTimeout(() => setDownloading(false), 1000);
  };

  const handleDownloadMarkdown = () => {
    if (!markdownReport) return;
    setDownloading(true);
    const safeTarget = targetName.replace(/[^a-z0-9]/gi, '_');
    const filename = `war-room-report-${safeTarget}-${Date.now()}.md`;
    downloadFile(markdownReport, filename, 'text/markdown');
    setTimeout(() => setDownloading(false), 1000);
  };

  const handleOpenHTMLPreview = () => {
    if (!htmlReport) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlReport);
      newWindow.document.close();
    }
  };

  if (!htmlReport && !markdownReport) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-border rounded-lg bg-zinc-950/80 p-1 backdrop-blur-xl"
    >
      <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-green-500" />
          <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">
            Security Reports
          </span>
        </div>
        <span className="text-xs text-zinc-500">Ready for download</span>
      </div>
      
      <div className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {htmlReport && (
            <>
              <button
                onClick={handleDownloadHTML}
                disabled={downloading}
                className="group relative flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-green-500/50 hover:bg-zinc-800 disabled:opacity-50"
              >
                <div className="rounded-md bg-green-500/10 p-2">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">HTML Report</div>
                  <div className="text-xs text-zinc-500">Full interactive report</div>
                </div>
                <Download className="h-4 w-4 text-zinc-500 group-hover:text-green-500 transition-colors" />
              </button>

              <button
                onClick={handleOpenHTMLPreview}
                className="group relative flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-blue-500/50 hover:bg-zinc-800"
              >
                <div className="rounded-md bg-blue-500/10 p-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">Preview Report</div>
                  <div className="text-xs text-zinc-500">Open in new tab</div>
                </div>
                <FileText className="h-4 w-4 text-zinc-500 group-hover:text-blue-500 transition-colors" />
              </button>
            </>
          )}

          {markdownReport && (
            <button
              onClick={handleDownloadMarkdown}
              disabled={downloading}
              className="group relative flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-purple-500/50 hover:bg-zinc-800 disabled:opacity-50"
            >
              <div className="rounded-md bg-purple-500/10 p-2">
                <FileCode className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-white">Markdown Report</div>
                <div className="text-xs text-zinc-500">Text-based format</div>
              </div>
              <Download className="h-4 w-4 text-zinc-500 group-hover:text-purple-500 transition-colors" />
            </button>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-zinc-900/50 p-3 border border-zinc-800">
          <div className="flex items-start gap-2 text-xs text-zinc-500">
            <FileText className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Reports contain detailed vulnerability analysis, code snippets, remediation steps, and proof-of-concept exploits. 
              <span className="text-yellow-500 font-semibold"> Handle with care.</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
