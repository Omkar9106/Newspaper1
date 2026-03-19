'use client';

import { motion } from 'framer-motion';
import { Article } from '@/lib/news';
import { Calendar, ExternalLink, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const router = useRouter();
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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1 + 0.2,
        ease: "easeOut" as const
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {article.urlToImage ? (
          <motion.div variants={imageVariants}>
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center p-4">
              <div className="text-6xl mb-2">📰</div>
              <p className="text-sm">No image available</p>
            </div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span className="font-medium">{article.source.name}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
        >
          {article.title}
        </motion.h2>

        {article.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
            className="text-gray-600 mb-4 line-clamp-3"
          >
            {article.description}
          </motion.p>
        )}

        {article.author && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.6, duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-gray-500 mb-4"
          >
            <User className="w-3 h-3" />
            <span>{article.author}</span>
          </motion.div>
        )}

        <motion.a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.7, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <span>Read More</span>
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.article>
  );
}
