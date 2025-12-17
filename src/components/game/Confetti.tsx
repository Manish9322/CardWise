'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const CONFETTI_COUNT = 50;

const Confetti = ({ active }: { active: boolean }) => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: CONFETTI_COUNT }).map((_, index) => {
        const colors = ['bg-primary', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-red-400', 'bg-pink-400'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * 360;
        const distance = Math.random() * 150 + 50;
        const translateX = `${Math.cos(angle) * distance}px`;
        const translateY = `${Math.sin(angle) * distance}px`;
        
        const style: React.CSSProperties & { [key: string]: any } = {
          '--translateX': translateX,
          '--translateY': translateY,
          '--scale': Math.random() * 0.5 + 0.5,
          animationDelay: `${Math.random() * 0.2}s`,
        };

        return (
          <div
            key={index}
            className={cn('confetti-piece absolute h-2 w-2 rounded-full', randomColor)}
            style={style}
          />
        );
      });
      setPieces(newPieces);
    } else {
        const timer = setTimeout(() => setPieces([]), 1000);
        return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && pieces.length === 0) {
    return null;
  }
  
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
        {pieces}
    </div>
  );
};

export default Confetti;
