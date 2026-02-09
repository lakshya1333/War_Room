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
import { motion } from 'framer-motion';

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
    <div className="min-h-screen text-white selection:bg-[var(--accent-cyan)]/30 selection:text-[var(--accent-cyan)]">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Alerts - Island Architecture */}
      <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
        {alerts.map((alert, idx) => (
          <div key={alert.id} className="island-float" style={{ animationDelay: `${idx * 0.2}s` }}>
            <PulsingAlert
              severity={alert.severity}
              message={alert.message}
              onDismiss={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
            />
          </div>
        ))}
      </div>
      
      {/* Header - Glassmorphic */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-primary)] glass-panel">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-50" />
        
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-cyan)] opacity-20"></span>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30">
                <Shield className="h-5 w-5 text-[var(--accent-cyan)]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-glow-cyan">WAR ROOM</span>
                <span className="metadata-label bg-[var(--surface-glass)] px-2 py-0.5 rounded border border-[var(--border-primary)]">
                  V4.0 ALPHA
                </span>
              </h1>
              <p className="metadata-label mt-0.5">
                AI-Powered Offensive Cyber Operations • Gemini 2.0 Flash Thinking
              </p>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="glass-panel px-3 py-2 rounded-lg hover:border-[var(--accent-cyan)]/50 transition-all group"
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-[var(--accent-cyan)] group-hover:scale-110 transition-transform" />
              ) : (
                <VolumeX className="h-4 w-4 text-[var(--foreground-tertiary)] group-hover:scale-110 transition-transform" />
              )}
            </button>
            
            {/* 3D View Toggle */}
            <button
              onClick={() => setShow3D(!show3D)}
              className={`glass-panel px-3 py-2 rounded-lg transition-all group ${
                show3D ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10' : 'hover:border-[var(--accent-cyan)]/50'
              }`}
              title="Toggle 3D visualization"
            >
              <div className="flex items-center gap-2">
                <Eye className={`h-4 w-4 transition-all ${show3D ? 'text-[var(--accent-cyan)]' : 'text-[var(--foreground-tertiary)]'} group-hover:scale-110`} />
                <span className="hidden md:inline metadata-label">{show3D ? '3D ON' : '3D OFF'}</span>
              </div>
            </button>
            
            {/* System Status */}
            <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  status ? 'bg-[var(--status-success)]' : 'bg-[var(--status-critical)]'
                }`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${
                  status ? 'bg-[var(--status-success)]' : 'bg-[var(--status-critical)]'
                }`}></span>
              </span>
              <span className="metadata-label">SYSTEM {status ? 'ACTIVE' : 'IDLE'}</span>
            </div>
            
            {/* Metrics */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                <span className="metadata-label">24ms</span>
              </div>
              <div className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[var(--accent-blue)]" />
                <span className="metadata-label">{attackTree.length} NODES</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 pb-20 space-y-6">
        {/* 3D Network Topology - Floating Island */}
        {show3D && attackTree.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel-elevated rounded-xl overflow-hidden"
          >
            <div className="border-b border-[var(--border-accent)] bg-gradient-to-r from-[var(--accent-cyan)]/5 to-[var(--accent-blue)]/5 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30">
                  <Eye className="h-4 w-4 text-[var(--accent-cyan)] animate-pulse" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white uppercase tracking-wide">3D Network Topology</span>
                  <p className="metadata-label mt-0.5">Real-time attack surface visualization</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVrMode(!vrMode)}
                  className={`metadata-label px-4 py-2 rounded-lg transition-all ${
                    vrMode 
                      ? 'bg-[var(--accent-cyan)] text-black font-bold' 
                      : 'glass-panel hover:border-[var(--accent-cyan)]/50'
                  }`}
                >
                  {vrMode ? '🥽 VR ACTIVE' : 'ENABLE VR'}
                </button>
                <button
                  onClick={() => setShow3D(false)}
                  className="glass-panel px-3 py-2 rounded-lg hover:border-[var(--status-critical)]/50 hover:text-[var(--status-critical)] transition-all"
                  title="Close 3D view"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="h-[600px] relative">
              <NetworkTopology3D attackTree={attackTree} vrMode={vrMode} />
              <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded-lg">
                <p className="metadata-label">
                  <Crosshair className="inline h-3 w-3 mr-1" />
                  {attackTree.length} Attack Vectors Mapped
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Bento Grid Layout - Optimized Information Density */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Left Column - Command & Control */}
          <div className="lg:col-span-5 space-y-5">
            {/* Target Acquisition */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ReconInput onLaunch={startRecon} isLoading={isLoading} />
            </motion.div>
            
            {/* Attack Vector Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AttackTree nodes={attackTree} />
            </motion.div>
          </div>

          {/* Right Column - Intelligence & Execution */}
          <div className="lg:col-span-7 space-y-5">
            {/* AI Thinking Stream */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ThinkingDisplay steps={thinkingSteps} />
            </motion.div>
            
            {/* Exploitation Dashboard */}
            {exploits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel-elevated rounded-xl overflow-hidden"
              >
                <div className="border-b border-[var(--border-accent)] bg-gradient-to-r from-[var(--status-critical)]/5 to-[var(--status-high)]/5 px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--status-critical)]/10 border border-[var(--status-critical)]/30">
                      <Crosshair className="h-4 w-4 text-[var(--status-critical)]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">Exploitation Dashboard</span>
                      <p className="metadata-label mt-0.5">Active exploit payloads and execution results</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResultsDashboard exploits={exploits} results={executionResults} />
                </div>
              </motion.div>
            )}
            
            {/* Report Download */}
            {(htmlReport || markdownReport) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DownloadReport 
                  htmlReport={htmlReport} 
                  markdownReport={markdownReport}
                  targetName={targetName}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer - Floating Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-primary)] glass-panel">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-30" />
        
        <div className="container mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-6 metadata-label">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3 text-[var(--accent-cyan)]" />
              <span>SESSION: <span className="text-[var(--accent-cyan)] font-mono">{sessionId}</span></span>
            </div>
            <div className="hidden md:block">GEMINI_2.0_FLASH_THINKING_EXP</div>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--status-success)] animate-pulse"></span>
              <span>SECURE_CONNECTION</span>
            </div>
            {show3D && (
              <div className="hidden lg:flex items-center gap-1.5">
                <Eye className="h-3 w-3 text-[var(--accent-cyan)]" />
                <span>3D_ENABLED</span>
              </div>
            )}
          </div>
          <div className="metadata-label hidden md:block">
            COPYRIGHT 2026 WAR ROOM OPS • HACKATHON EDITION
          </div>
        </div>
      </footer>
    </div>
  );
}
