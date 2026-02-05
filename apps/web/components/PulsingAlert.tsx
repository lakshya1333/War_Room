'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Skull } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

interface PulsingAlertProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  onDismiss?: () => void;
}

export function PulsingAlert({ severity, message, onDismiss }: PulsingAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (severity === 'critical') {
      audioManager.play('critical-alert');
      // Play repeating alert
      const interval = setInterval(() => {
        audioManager.play('critical-alert');
      }, 2000);
      return () => clearInterval(interval);
    } else if (severity === 'high') {
      audioManager.play('vulnerability-found');
    }
  }, [severity]);

  useEffect(() => {
    if (severity !== 'critical') {
      const timeout = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [severity, onDismiss]);

  if (!visible) return null;

  const getConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          icon: Skull,
          bg: 'bg-red-950/80',
          border: 'border-red-500',
          text: 'text-red-200',
          pulse: 'animate-pulse',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          bg: 'bg-orange-950/80',
          border: 'border-orange-500',
          text: 'text-orange-200',
          pulse: 'animate-pulse',
          glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bg: 'bg-yellow-950/80',
          border: 'border-yellow-500',
          text: 'text-yellow-200',
          pulse: '',
          glow: ''
        };
      case 'low':
        return {
          icon: Shield,
          bg: 'bg-blue-950/80',
          border: 'border-blue-500',
          text: 'text-blue-200',
          pulse: '',
          glow: ''
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-20 right-6 z-50 max-w-md border-2 ${config.border} ${config.bg} ${config.text} p-4 rounded-lg backdrop-blur-md ${config.pulse} ${config.glow}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 flex-shrink-0 ${severity === 'critical' ? 'animate-bounce' : ''}`} />
        <div className="flex-1">
          <div className="font-bold uppercase text-sm tracking-wider mb-1">
            {severity} SEVERITY
          </div>
          <div className="text-sm">{message}</div>
        </div>
        {severity !== 'critical' && (
          <button
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="text-white/50 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
