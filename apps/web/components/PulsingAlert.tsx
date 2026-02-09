'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Skull } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';
import { motion } from 'framer-motion';

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
          bg: 'from-[var(--status-critical)]/20 to-[var(--status-critical)]/5',
          border: 'border-[var(--status-critical)]',
          iconBg: 'bg-[var(--status-critical)]/20',
          iconColor: 'text-[var(--status-critical)]',
          text: 'text-white',
          pulse: 'animate-pulse',
          glow: 'shadow-[0_0_30px_var(--status-critical)]'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          bg: 'from-[var(--status-high)]/20 to-[var(--status-high)]/5',
          border: 'border-[var(--status-high)]',
          iconBg: 'bg-[var(--status-high)]/20',
          iconColor: 'text-[var(--status-high)]',
          text: 'text-white',
          pulse: 'animate-pulse',
          glow: 'shadow-[0_0_20px_var(--status-high)]'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bg: 'from-[var(--status-medium)]/20 to-[var(--status-medium)]/5',
          border: 'border-[var(--status-medium)]',
          iconBg: 'bg-[var(--status-medium)]/20',
          iconColor: 'text-[var(--status-medium)]',
          text: 'text-white',
          pulse: '',
          glow: ''
        };
      case 'low':
        return {
          icon: Shield,
          bg: 'from-[var(--status-low)]/20 to-[var(--status-low)]/5',
          border: 'border-[var(--status-low)]',
          iconBg: 'bg-[var(--status-low)]/20',
          iconColor: 'text-[var(--status-low)]',
          text: 'text-white',
          pulse: '',
          glow: ''
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`glass-panel-elevated rounded-xl border-2 ${config.border} ${config.text} p-4 max-w-sm backdrop-blur-xl ${config.pulse} ${config.glow}`}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config.bg} pointer-events-none`} />
      
      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2.5 rounded-lg ${config.iconBg} border ${config.border}`}>
          <Icon className={`h-5 w-5 ${config.iconColor} ${severity === 'critical' ? 'animate-bounce' : ''}`} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-bold uppercase text-xs tracking-widest mb-1.5 metadata-label">
            {severity} SEVERITY
          </div>
          <div className="text-sm leading-relaxed">{message}</div>
        </div>
        
        {/* Close Button */}
        {severity !== 'critical' && (
          <button
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="flex-shrink-0 glass-panel p-1.5 rounded-lg hover:border-[var(--accent-cyan)]/50 transition-all"
            title="Dismiss alert"
          >
            <span className="text-[var(--foreground-tertiary)] hover:text-white text-sm">✕</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
