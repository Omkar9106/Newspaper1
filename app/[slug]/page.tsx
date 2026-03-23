'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Article, NewsService } from '@/lib/news';
import ShareButtons from '@/components/ShareButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, User, ArrowLeft, Quote } from 'lucide-react';
import Image from 'next/image';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the specific article by slug
    // For now, we'll simulate this with the first article from general news
    const fetchArticle = async () => {
      try {
        const response = await NewsService.getTopHeadlines('us', 10);
        const articles = response.articles;
        
        if (articles.length > 0) {
          // Use the slug to select an article (in real app, this would be a direct API call)
          const slugIndex = parseInt(params.slug as string) || 0;
          const selectedArticle = articles[Math.min(slugIndex, articles.length - 1)];
          setArticle(selectedArticle);
          
          // Set related articles (excluding the current one)
          const related = articles.filter((_, index) => index !== slugIndex).slice(0, 3);
          setRelatedArticles(related);
        }
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to News</span>
          </motion.button>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <header className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span className="font-medium">{article.source.name}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {article.title}
              </h1>

              {article.source.name && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.source.name}</span>
                </div>
              )}
            </motion.div>

            {/* Featured Image */}
            {article.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-6">
            {article.description && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl text-gray-700 leading-relaxed font-medium bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600"
              >
                {article.description}
              </motion.p>
            )}

            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border-l-4 border-gray-400"
            >
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    &ldquo;Stay informed with the latest developments and breaking news from around the world. Our commitment is to bring you accurate, timely, and comprehensive coverage.&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 mt-4">— Omkar News Team</p>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            {article.content && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-4"
              >
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className={`text-gray-700 leading-relaxed ${
                      index % 3 === 0 ? 'bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="border-t border-gray-200 pt-8"
            >
              <ShareButtons
                title={article.title}
                url={article.url}
                description={article.description || ''}
              />
            </motion.div>
          </div>
        </motion.article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16 border-t border-gray-200 pt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <motion.article
                  key={relatedArticle.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-gray-200"
                  onClick={() => router.push(`/article/${index + 1}`)}
                >
                  {relatedArticle.image && (
                    <div className="relative h-40">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedArticle.description}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      {relatedArticle.source.name} • {formatDate(relatedArticle.publishedAt)}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
