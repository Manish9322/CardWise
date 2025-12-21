'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const frameVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.5,
    },
  },
};

const letterVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: 0.8,
      delay: 1.2,
      ease: [0.6, 0.01, -0.05, 0.9],
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
        <div className="relative w-72 h-32 md:w-96 md:h-40 flex flex-col items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 288 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.rect 
                    x="1" 
                    y="1" 
                    width="286" 
                    height="126" 
                    rx="12" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2"
                    variants={frameVariants}
                />
            </svg>
            <motion.div
                className="relative flex flex-col items-center"
                variants={textContainerVariants}
            >
                <motion.h1
                    className="text-5xl md:text-6xl font-bold text-primary flex overflow-hidden"
                    aria-label={title}
                    variants={textContainerVariants}
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
                <motion.div 
                    className="w-4/5 h-0.5 bg-primary mt-2"
                    variants={lineVariants}
                />
            </motion.div>
        </div>
    </motion.div>
  );
}
