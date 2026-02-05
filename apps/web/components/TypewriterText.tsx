'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/lib/audioManager';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  sound?: boolean;
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  className = '', 
  onComplete,
  sound = true 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= text.length) {
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
      
      if (sound && Math.random() > 0.7) {
        audioManager.play('typing');
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, onComplete, sound]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">▋</span>
    </span>
  );
}
