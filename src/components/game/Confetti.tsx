'use client';

import React from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
    onComplete: () => void;
}

export default function Confetti({ onComplete }: ConfettiProps) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
  }, []);

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={200}
      recycle={false}
      onConfettiComplete={onComplete}
      className="!fixed"
    />
  );
}
