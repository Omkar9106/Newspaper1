'use client';

import { motion } from 'framer-motion';
import { Article } from '@/lib/news';
import { Calendar, User, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EnhancedNewsCardProps {
  article: Article;
  index: number;
  variant?: 'default' | 'small' | 'featured';
  showCategory?: boolean;
}

export default function EnhancedNewsCard({ 
  article, 
  index, 
  variant = 'default',
  showCategory = true 
}: EnhancedNewsCardProps) {
  const router = useRouter();

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getCategoryFromSource = (sourceName: string) => {
    const source = sourceName.toLowerCase();
    if (source.includes('tech') || source.includes('gizmodo')) return 'Technology';
    if (source.includes('sport') || source.includes('espn')) return 'Sports';
    if (source.includes('business') || source.includes('bloomberg')) return 'Business';
    if (source.includes('health') || source.includes('medical')) return 'Health';
    if (source.includes('entertainment') || source.includes('hollywood')) return 'Entertainment';
    return 'General';
  };

  const category = getCategoryFromSource(article.source.name);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut" as const
      }
    }
  };

  const getCardClasses = () => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group transition-all duration-300';
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} col-span-1 md:col-span-2 lg:col-span-2`;
      case 'small':
        return `${baseClasses} h-64`;
      default:
        return baseClasses;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return 'h-64 md:h-80';
      case 'small':
        return 'h-32';
      default:
        return 'h-48';
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onClick={() => router.push(`/article/${index}`)}
      className={getCardClasses()}
    >
      <div className={`relative ${getImageHeight()} overflow-hidden`}>
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="text-center">
              <div className="text-4xl mb-2">📰</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No image available</p>
            </div>
          </div>
        )}
        
        {/* Category Tag */}
        {showCategory && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
            className="absolute top-4 left-4 z-10"
          >
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              {category}
            </span>
          </motion.div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          className={`font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${
            variant === 'featured' ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
        >
          {article.title}
        </motion.h2>

        {variant !== 'small' && article.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
            className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2"
          >
            {article.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
          className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-20 md:max-w-none">
                {article.source.name}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{getRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
