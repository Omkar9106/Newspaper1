import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'top-headlines';
    const country = searchParams.get('country') || 'us';
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const pageSize = searchParams.get('pageSize') || '20';
    const page = searchParams.get('page') || '1';

    if (!NEWS_API_KEY) {
      console.error('Environment variables check:');
      console.error('NEWS_API_KEY:', !!process.env.NEWS_API_KEY);
      console.error('NEXT_PUBLIC_NEWS_API_KEY:', !!process.env.NEXT_PUBLIC_NEWS_API_KEY);
      console.error('All env vars:', Object.keys(process.env).filter(key => key.includes('NEWS')));
      
      return NextResponse.json(
        { 
          error: 'News API key not configured',
          debug: {
            has_server_key: !!process.env.NEWS_API_KEY,
            has_client_key: !!process.env.NEXT_PUBLIC_NEWS_API_KEY,
            available_env_vars: Object.keys(process.env).filter(key => key.includes('NEWS'))
          }
        },
        { status: 500 }
      );
    }

    // Build API URL based on endpoint
    let apiUrl = `${BASE_URL}/${endpoint}?apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&page=${page}`;

    if (endpoint === 'top-headlines') {
      if (category) {
        apiUrl += `&category=${category}`;
      }
      apiUrl += `&country=${country}`;
    } else if (endpoint === 'everything') {
      if (q) {
        apiUrl += `&q=${encodeURIComponent(q)}`;
      }
      if (category) {
        apiUrl += `&category=${category}`;
      }
    }

    console.log('Fetching from News API:', apiUrl.replace(NEWS_API_KEY, '***'));

    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Omkar-News-Hub/1.0',
      },
    });

    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    return NextResponse.json(response.data, { headers });
  } catch (error: unknown) {
    console.error('News API Error:', error instanceof Error ? error.message : 'Unknown error');
    
    // Handle specific error cases
    if (error && typeof error === 'object' && 'response' in error) {
      // News API responded with error
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosError.response?.status || 500;
      const message = axiosError.response?.data?.message || 'News API error';
      
      if (status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key or API key not found' },
          { status: 401 }
        );
      } else if (status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `News API error: ${message}` },
          { status: status }
        );
      }
    } else if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 408 }
      );
    } else {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
