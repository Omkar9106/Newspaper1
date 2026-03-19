'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  const spinnerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    hidden: { y: 0, opacity: 0.3 },
    visible: {
      y: -10,
      opacity: 1,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      variants={spinnerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center py-12"
    >
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={dotVariants}
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
