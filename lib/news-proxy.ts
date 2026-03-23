import axios from 'axios';

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

export class NewsProxyService {
  private static baseUrl = '/api/news';
  private static fallbackUrl = 'https://newsapi.org/v2';
  private static fallbackKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  static async getTopHeadlights(
    country: string = 'us', 
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    try {
      // Try proxy first
      const params = new URLSearchParams({
        endpoint: 'top-headlines',
        country,
        pageSize: pageSize.toString(),
        page: page.toString(),
      });

      const response = await axios.get(`${this.baseUrl}?${params}`, {
        timeout: 15000,
      });

      return response.data;
    } catch (proxyError) {
      console.warn('Proxy failed, trying direct API:', proxyError instanceof Error ? proxyError.message : 'Unknown error');
      
      // Fallback to direct API if proxy fails
      if (!this.fallbackKey) {
        throw new Error('Both proxy and fallback API failed - no API key available');
      }

      try {
        const params = new URLSearchParams({
          apiKey: this.fallbackKey,
          country,
          pageSize: pageSize.toString(),
          page: page.toString(),
        });

        const response = await axios.get(`${this.fallbackUrl}/top-headlines?${params}`, {
          timeout: 15000,
        });

        return response.data;
      } catch (directError) {
        console.error('Direct API also failed:', directError instanceof Error ? directError.message : 'Unknown error');
        throw this.handleError(proxyError);
      }
    }
  }

  static async getEverything(
    query: string = '',
    category: string = '',
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    try {
      const params = new URLSearchParams({
        endpoint: 'everything',
        pageSize: pageSize.toString(),
        page: page.toString(),
      });

      if (query) {
        params.append('q', query);
      }
      if (category) {
        params.append('category', category);
      }

      const response = await axios.get(`${this.baseUrl}?${params}`, {
        timeout: 15000,
      });

      return response.data;
    } catch (proxyError) {
      console.warn('Proxy failed, trying direct API:', proxyError instanceof Error ? proxyError.message : 'Unknown error');
      
      // Fallback to direct API if proxy fails
      if (!this.fallbackKey) {
        throw new Error('Both proxy and fallback API failed - no API key available');
      }

      try {
        const params = new URLSearchParams({
          apiKey: this.fallbackKey,
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

        const response = await axios.get(`${this.fallbackUrl}/everything?${params}`, {
          timeout: 15000,
        });

        return response.data;
      } catch (directError) {
        console.error('Direct API also failed:', directError instanceof Error ? directError.message : 'Unknown error');
        throw this.handleError(proxyError);
      }
    }
  }

  static async getByCategory(
    category: string, 
    country: string = 'us',
    pageSize: number = 20,
    page: number = 1
  ): Promise<NewsResponse> {
    try {
      const params = new URLSearchParams({
        endpoint: 'top-headlines',
        category,
        country,
        pageSize: pageSize.toString(),
        page: page.toString(),
      });

      const response = await axios.get(`${this.baseUrl}?${params}`, {
        timeout: 15000,
      });

      return response.data;
    } catch (proxyError) {
      console.warn('Proxy failed, trying direct API:', proxyError instanceof Error ? proxyError.message : 'Unknown error');
      
      // Fallback to direct API if proxy fails
      if (!this.fallbackKey) {
        throw new Error('Both proxy and fallback API failed - no API key available');
      }

      try {
        const params = new URLSearchParams({
          apiKey: this.fallbackKey,
          country,
          category,
          pageSize: pageSize.toString(),
          page: page.toString(),
        });

        const response = await axios.get(`${this.fallbackUrl}/top-headlines?${params}`, {
          timeout: 15000,
        });

        return response.data;
      } catch (directError) {
        console.error('Direct API also failed:', directError instanceof Error ? directError.message : 'Unknown error');
        throw this.handleError(proxyError);
      }
    }
  }

  private static handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const axiosError = error as { response?: { data?: { error?: string; message?: string }; status?: number } };
      const message = axiosError.response?.data?.error || axiosError.response?.data?.message || 'Unknown error';
      return new Error(`API Error (${axiosError.response?.status}): ${message}`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      // The request was made but no response was received
      return new Error('Network error: Unable to connect to the server');
    } else if (error instanceof Error) {
      // Something happened in setting up the request that triggered an Error
      return new Error(`Request error: ${error.message}`);
    } else {
      return new Error('Unknown error occurred');
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
