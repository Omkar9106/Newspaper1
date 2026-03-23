import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY || 'f8900772867af22c9d6625a70da03c37';
const BASE_URL = 'https://gnews.io/api/v4';

export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: Article[];
}

export class NewsService {
  static async getTopHeadlines(country: string = 'us', pageSize: number = 20): Promise<NewsResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apikey: API_KEY,
          country: country.toLowerCase(),
          max: pageSize,
          lang: 'en',
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching top headlines:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch top headlines';
      throw new Error(errorMessage);
    }
  }

  static async getEverything(
    query: string = '',
    category: string = '',
    pageSize: number = 20
  ): Promise<NewsResponse> {
    try {
      const params: Record<string, string | number> = {
        apikey: API_KEY,
        max: pageSize,
        lang: 'en',
      };

      if (query) {
        params.q = query;
      }

      if (category && category !== 'general') {
        params.topic = category;
      }

      const response = await axios.get(`${BASE_URL}/search`, { params });
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching everything:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news';
      throw new Error(errorMessage);
    }
  }

  static async getByCategory(category: string, country: string = 'us'): Promise<NewsResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apikey: API_KEY,
          country: country.toLowerCase(),
          topic: category === 'general' ? undefined : category,
          max: 20,
          lang: 'en',
        },
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching by category:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch news by category';
      throw new Error(errorMessage);
    }
  }
}

export const categories = [
  { value: 'general', label: 'General' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
];
