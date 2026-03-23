import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || '85c1330357534127950b9cd187110694';
const BASE_URL = 'https://newsapi.org/v2';

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export class NewsService {
  static async getTopHeadlines(country: string = 'us', pageSize: number = 20): Promise<NewsResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apiKey: API_KEY,
          country,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  }

  static async getEverything(
    query: string = '',
    category: string = '',
    pageSize: number = 20
  ): Promise<NewsResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          apiKey: API_KEY,
          q: query,
          category,
          pageSize,
          sortBy: 'publishedAt',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching everything:', error);
      throw error;
    }
  }

  static async getByCategory(category: string, country: string = 'us'): Promise<NewsResponse> {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          apiKey: API_KEY,
          country,
          category,
          pageSize: 20,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching by category:', error);
      throw error;
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
