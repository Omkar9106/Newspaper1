'use client';

import { motion } from 'framer-motion';
import { Article } from '@/lib/news';
import EnhancedNewsCard from './EnhancedNewsCard';

interface HeroSectionProps {
  articles: Article[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Article - Left Side */}
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
          }}
          className="lg:col-span-2"
        >
          <EnhancedNewsCard
            article={featuredArticle}
            index={0}
            variant="featured"
            showCategory={true}
          />
        </motion.div>

        {/* Side Articles - Right Side */}
        <div className="space-y-6">
          {sideArticles.map((article, index) => (
            <motion.div
              key={article.url}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { 
                  opacity: 1, 
                  x: 0, 
                  transition: { 
                    duration: 0.6, 
                    delay: 0.2 + index * 0.1 
                  } 
                }
              }}
            >
              <EnhancedNewsCard
                article={article}
                index={index + 1}
                variant="small"
                showCategory={true}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
