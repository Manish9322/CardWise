'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotate: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

export default function IntroAnimation() {
  const title = 'CardWise';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background pointer-events-none"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.h1
        className="text-6xl md:text-8xl font-bold text-primary flex overflow-hidden"
        aria-label={title}
      >
        {title.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.div>
  );
}
