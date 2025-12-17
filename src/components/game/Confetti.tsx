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
        const style = {
          left: `${Math.random() * 100}vw`,
          animationDelay: `${Math.random() * 3}s`,
        };
        return (
          <div
            key={index}
            className={cn('confetti-piece absolute top-0 h-4 w-2 rounded-full', randomColor)}
            style={style}
          />
        );
      });
      setPieces(newPieces);
    } else {
        // Clearing pieces when not active
        const timer = setTimeout(() => setPieces([]), 3000);
        return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active && pieces.length === 0) {
    return null;
  }
  
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {pieces}
    </div>
  );
};

export default Confetti;
