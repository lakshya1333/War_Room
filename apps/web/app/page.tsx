'use client';

import { useState, useEffect } from 'react';
import { ReconInput } from '@/components/ReconInput';
import { AttackTree } from '@/components/AttackTree';
import { ThinkingDisplay } from '@/components/ThinkingDisplay';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { DownloadReport } from '@/components/DownloadReport';
import { MatrixRain } from '@/components/MatrixRain';
import { NetworkTopology3D } from '@/components/NetworkTopology3D';
import { PulsingAlert } from '@/components/PulsingAlert';
import { useRecon } from '@/hooks/useRecon';
import { audioManager } from '@/lib/audioManager';
import { Shield, Target, Activity, Terminal, Crosshair, Volume2, VolumeX, Eye } from 'lucide-react';

export default function Home() {
  const [sessionId, setSessionId] = useState('INITIALIZING');
  const [mounted, setMounted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [show3D, setShow3D] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [alerts, setAlerts] = useState<Array<{ id: string; severity: 'low' | 'medium' | 'high' | 'critical'; message: string }>>([]);
  
  const { 
    startRecon, 
    status, 
    attackTree, 
    thinkingSteps, 
    exploits,
    executionResults,
    gitInfo,
    htmlReport,
    markdownReport,
    targetName,
    isLoading 
  } = useRecon();

  useEffect(() => {
    setSessionId(Date.now().toString(16).toUpperCase());
    setMounted(true);
    audioManager.initialize();
  }, []);

  // Trigger alerts for critical vulnerabilities
  useEffect(() => {
    attackTree.forEach((node) => {
      if (node.severity === 'critical' || node.severity === 'high') {
        const alertId = `alert-${node.id}`;
        if (!alerts.find(a => a.id === alertId)) {
          setAlerts(prev => [...prev, {
            id: alertId,
            severity: node.severity,
            message: `${node.severity.toUpperCase()}: ${node.name}`
          }]);
        }
      }
    });
  }, [attackTree]);

  // Play sounds for status changes
  useEffect(() => {
    if (status === 'scanning') {
      audioManager.play('scan-start');
    }
  }, [status]);

  useEffect(() => {
    if (soundEnabled) {
      audioManager.setMuted(false);
    } else {
      audioManager.setMuted(true);
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 selection:text-red-200">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Alerts */}
      {alerts.map((alert, idx) => (
        <div key={alert.id} style={{ top: `${20 + idx * 100}px` }}>
          <PulsingAlert
            severity={alert.severity}
            message={alert.message}
            onDismiss={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
          />
        </div>
      ))}
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-20"></span>
              <Shield className="relative h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                WAR ROOM <span className="text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">V.4.0 🚀</span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                AI-Powered Offensive Cyber Operations • Gemini 2.0 Flash Thinking
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono text-zinc-500">
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setShow3D(!show3D)}
              className={`flex items-center gap-2 transition-colors ${show3D ? 'text-green-500' : 'hover:text-white'}`}
              title="Toggle 3D visualization"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">3D VIEW</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${status ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span>SYSTEM {status ? 'ACTIVE' : 'IDLE'}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>LATENCY: 24ms</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>NODES: {attackTree.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 pb-16 space-y-8">
        {/* 3D Network Topology (Full Width when enabled) */}
        {show3D && attackTree.length > 0 && (
          <div className="cyber-border rounded-lg bg-zinc-950/80 backdrop-blur-xl overflow-hidden">
            <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500 animate-pulse" />
                <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">3D Network Topology</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVrMode(!vrMode)}
                  className={`text-xs px-3 py-1 rounded ${vrMode ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                >
                  {vrMode ? '🥽 VR MODE' : 'ENABLE VR'}
                </button>
                <button
                  onClick={() => setShow3D(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="h-[600px]">
              <NetworkTopology3D attackTree={attackTree} vrMode={vrMode} />
            </div>
          </div>
        )}
        
        {/* Top Grid: Input & Thinking */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Input & Tree (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ReconInput onLaunch={startRecon} isLoading={isLoading} />
            <AttackTree nodes={attackTree} />
          </div>

          {/* Right Column: Thinking & Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ThinkingDisplay steps={thinkingSteps} />
            {exploits.length > 0 && (
              <div className="cyber-border rounded-lg bg-zinc-950/80 p-1 backdrop-blur-xl">
                 <div className="border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Exploitation Dashboard</span>
                    </div>
                 </div>
                 <div className="p-4">
                   <ResultsDashboard exploits={exploits} results={executionResults} />
                 </div>
              </div>
            )}
            {(htmlReport || markdownReport) && (
              <DownloadReport 
                htmlReport={htmlReport} 
                markdownReport={markdownReport}
                targetName={targetName}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Footer / Status Line */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-black/80 px-4 py-1 backdrop-blur text-[10px] font-mono text-zinc-600 flex justify-between">
        <div>
          SESSION_ID: {sessionId} // GEMINI_2.0_FLASH_THINKING_EXP // SECURE_CONNECTION // 3D_ENABLED
        </div>
        <div>
           COPYRIGHT 2026 WAR ROOM OPS • HACKATHON EDITION
        </div>
      </footer>
    </div>
  );
}
