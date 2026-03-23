// Server-side News API service (for API routes)
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
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

export class NewsServerService {
  static async getTopHeadlines(
    country: string = 'us', 
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY not configured in server environment');
    }

    try {
      const params = new URLSearchParams({
        apiKey: NEWS_API_KEY,
        country,
        pageSize: pageSize.toString(),
        page: page.toString(),
      });

      const response = await axios.get(`${BASE_URL}/top-headlines?${params}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Omkar-News-Hub/1.0',
        },
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Server-side News API Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  static async getEverything(
    query: string = '',
    category: string = '',
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY not configured in server environment');
    }

    try {
      const params = new URLSearchParams({
        apiKey: NEWS_API_KEY,
        pageSize: pageSize.toString(),
        page: page.toString(),
        sortBy: 'publishedAt',
      });

      if (query) {
        params.append('q', query);
      }
      if (category) {
        params.append('category', category);
      }

      const response = await axios.get(`${BASE_URL}/everything?${params}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Omkar-News-Hub/1.0',
        },
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Server-side News API Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  static async getByCategory(
    category: string, 
    country: string = 'us',
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    if (!NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY not configured in server environment');
    }

    try {
      const params = new URLSearchParams({
        apiKey: NEWS_API_KEY,
        country,
        category,
        pageSize: pageSize.toString(),
        page: page.toString(),
      });

      const response = await axios.get(`${BASE_URL}/top-headlines?${params}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Omkar-News-Hub/1.0',
        },
      });

      return response.data;
    } catch (error: unknown) {
      console.error('Server-side News API Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
}
