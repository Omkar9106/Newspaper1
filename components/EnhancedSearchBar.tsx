'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function EnhancedSearchBar({ onSearch, placeholder = "Search news, topics, or sources..." }: EnhancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit}>
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
            className="w-full pl-12 pr-24 py-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-blue-500 transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {query && (
              <motion.button
                type="button"
                onClick={handleClear}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Search
            </motion.button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
