'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Eye, Cloud, Mail, Send, Flame } from 'lucide-react';
import { Article } from '@/lib/news';

interface SidebarProps {
  articles: Article[];
  trendingArticles: Article[];
}

export default function Sidebar({ articles, trendingArticles }: SidebarProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const getMostReadArticles = () => {
    return articles.slice(0, 5);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Trending News */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <motion.div
              key={article.url}
              whileHover={{ x: 5 }}
              className="flex gap-3 cursor-pointer group"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {article.source.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Most Read */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Read</h3>
        </div>
        <div className="space-y-3">
          {getMostReadArticles().map((article) => (
            <motion.div
              key={article.url}
              whileHover={{ scale: 1.02 }}
              className="border-l-4 border-blue-600 pl-3 py-2 cursor-pointer group"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="w-5 h-5" />
          <h3 className="text-lg font-bold">Weather</h3>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">24°C</div>
          <div className="text-blue-100 mb-4">Partly Cloudy</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="text-blue-200">Mon</div>
              <div className="font-semibold">22°</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200">Tue</div>
              <div className="font-semibold">25°</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200">Wed</div>
              <div className="font-semibold">23°</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Subscription */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Newsletter</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get the latest news delivered to your inbox daily.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </motion.button>
        </form>
        {isSubscribed && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 dark:text-green-400 text-center"
          >
            Successfully subscribed!
          </motion.p>
        )}
      </motion.div>
    </motion.aside>
  );
}
