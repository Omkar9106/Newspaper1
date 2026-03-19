'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search news..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? "0 10px 40px rgba(59, 130, 246, 0.15)" 
              : "0 4px 20px rgba(0, 0, 0, 0.08)"
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <motion.div
              animate={{ rotate: isFocused ? 360 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" as const }}
            >
              <Search className={`h-5 w-5 transition-colors duration-300 ${
                isFocused ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </motion.div>
          </div>
          
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
          
          {query && (
            <motion.button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200">
                <span className="text-gray-600 text-sm">×</span>
              </div>
            </motion.button>
          )}
        </motion.div>
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-y-0 right-0 px-6 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700 transition-colors duration-300"
        >
          Search
        </motion.button>
      </form>
    </motion.div>
  );
}
