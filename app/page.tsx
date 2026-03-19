'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NewsService, Article } from '@/lib/news';
import { ThemeProvider } from '@/contexts/ThemeContext';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EnhancedNewsCard from '@/components/EnhancedNewsCard';
import Sidebar from '@/components/Sidebar';
import EnhancedSearchBar from '@/components/EnhancedSearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample breaking news data
  const breakingNews = [
    "🚨 Major tech breakthrough announced in quantum computing research",
    "🌍 Climate summit reaches historic agreement on emissions reduction",
    "💹 Stock markets reach all-time highs amid economic recovery",
    "⚽ World Cup qualifiers: Exciting matches across all continents",
    "🏥 Medical breakthrough: New treatment shows promising results"
  ];

  const fetchArticles = async (category?: string, query?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (query) {
        response = await NewsService.getEverything(query, '', 30);
      } else if (category && category !== 'general') {
        response = await NewsService.getByCategory(category);
      } else {
        response = await NewsService.getTopHeadlines('us', 50);
      }
      
      setArticles(response.articles);
      
      // Set trending articles (first 10 articles)
      setTrendingArticles(response.articles.slice(0, 10));
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const mainArticles = articles.slice(3); // Exclude hero section articles

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚠️ {error}</h1>
            <button
              onClick={() => fetchArticles(selectedCategory, searchQuery)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breaking News Ticker */}
        <BreakingNewsTicker news={breakingNews} />

        {/* Navigation */}
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EnhancedSearchBar onSearch={handleSearch} />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Search results for: <span className="font-semibold text-blue-600 dark:text-blue-400">&ldquo;{searchQuery}&rdquo;</span>
              </p>
              <button
                onClick={() => handleSearch('')}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm underline"
              >
                Clear search
              </button>
            </motion.div>
          )}

          {/* Hero Section */}
          <HeroSection articles={articles} />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainArticles.map((article, index) => (
                  <EnhancedNewsCard
                    key={article.url}
                    article={article}
                    index={index + 3}
                    variant="default"
                    showCategory={true}
                  />
                ))}
              </div>

              {mainArticles.length === 0 && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-500 dark:text-gray-400 text-lg">
                    No more articles available in this category.
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar
                articles={articles}
                trendingArticles={trendingArticles}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">O</span>
                </div>
                <span className="font-semibold">Omkar News Hub</span>
              </div>
              <p className="text-sm">© 2024 Omkar News Hub. Stay informed with the latest news from around the world.</p>
              <p className="text-xs mt-2">Powered by NewsAPI | Built with Next.js & Tailwind CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
