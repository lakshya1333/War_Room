'use client';

import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  glitchOnMount?: boolean;
}

export function GlitchText({ text, className = '', severity = 'medium', glitchOnMount = false }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(glitchOnMount);

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text);
      return;
    }

    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let frame = 0;
    const maxFrames = severity === 'critical' ? 20 : severity === 'high' ? 15 : 10;

    const interval = setInterval(() => {
      if (frame >= maxFrames) {
        setDisplayText(text);
        setIsGlitching(false);
        clearInterval(interval);
        return;
      }

      const glitched = text
        .split('')
        .map((char, idx) => {
          if (Math.random() < 0.3) {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return char;
        })
        .join('');

      setDisplayText(glitched);
      frame++;
    }, 50);

    return () => clearInterval(interval);
  }, [text, isGlitching, severity]);

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
    }
  };

  return (
    <span
      className={`${className} ${getSeverityColor()} ${isGlitching ? 'animate-pulse' : ''}`}
      onMouseEnter={() => setIsGlitching(true)}
    >
      {displayText}
    </span>
  );
}
