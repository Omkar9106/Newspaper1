'use client';

import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface BreakingNewsTickerProps {
  news: string[];
}

export default function BreakingNewsTicker({ news }: BreakingNewsTickerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || news.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="relative bg-red-600 text-white overflow-hidden"
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2 bg-red-700 px-4 py-2 z-10">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          <span className="font-semibold text-sm uppercase tracking-wide">Breaking</span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div
            className="flex items-center gap-8 py-2"
            animate={{
              x: [0, -50 * news.length]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...news, ...news].map((item, index) => (
              <span key={index} className="text-sm whitespace-nowrap px-4">
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-2 hover:bg-red-700 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
