# Deployment Guide - Omkar News Hub

## 🚀 Common Issues & Solutions

### 1. Environment Variables Not Working in Production

**Problem**: API works locally but fails after deployment.

**Solution**: 
- Use server-side environment variables (`NEWS_API_KEY`) instead of client-side (`NEXT_PUBLIC_`)
- Set environment variables in your deployment platform

#### Vercel Deployment:
```bash
# Set environment variables in Vercel dashboard or CLI
vercel env add NEWS_API_KEY
# Enter your API key when prompted
```

#### Netlify Deployment:
```bash
# In Netlify dashboard: Site settings > Build & deploy > Environment
# Add: NEWS_API_KEY = your_api_key_here
```

#### Docker/Other Platforms:
```bash
# Set environment variable
export NEWS_API_KEY=85c1330357534127950b9cd187110694
```

### 2. CORS Issues

**Problem**: Browser blocks requests to News API from different domains.

**Solution**: Use the included API proxy at `/api/news`

- ✅ **Before (Direct API Call)**:
```javascript
// ❌ This fails in production due to CORS
const response = await axios.get('https://newsapi.org/v2/top-headlines?apiKey=YOUR_KEY');
```

- ✅ **After (Proxy API Call)**:
```javascript
// ✅ This works - no CORS issues
const response = await axios.get('/api/news?endpoint=top-headlines&country=us');
```

### 3. API Rate Limiting

**Problem**: "429 Too Many Requests" error.

**Solutions**:
- Free News API plan: 1,000 requests per day
- Implement caching (next step)
- Add retry logic with exponential backoff
- Upgrade to paid plan for higher limits

### 4. API Key Exposure

**Problem**: API key visible in client-side code.

**Solution**: 
- ✅ Server-side API routes hide the API key
- ✅ Environment variables are not exposed to browser
- ✅ Proxy adds security layer

## 🔧 Environment Setup

### Required Environment Variables:

```bash
# Server-side (recommended for production)
NEWS_API_KEY=85c1330357534127950b9cd187110694

# Client-side (fallback only)
NEXT_PUBLIC_NEWS_API_KEY=85c1330357534127950b9cd187110694
```

### Platform-Specific Setup:

#### Vercel:
1. Go to Vercel Dashboard → Your Project → Settings
2. Add Environment Variables:
   - `NEWS_API_KEY`: Your News API key
   - `NEXT_PUBLIC_NEWS_API_KEY`: Your News API key
3. Redeploy

#### Netlify:
1. Go to Netlify Dashboard → Your Site → Site Settings
2. Build & Deploy → Environment
3. Add variables:
   - `NEWS_API_KEY`: Your News API key
   - `NEXT_PUBLIC_NEWS_API_KEY`: Your News API key
4. Redeploy

#### Railway/Render/Docker:
```bash
# Set in environment or docker-compose.yml
NEWS_API_KEY=85c1330357534127950b9cd187110694
```

## 🐛 Debugging Steps

### 1. Check Environment Variables
```javascript
// In your API route, add debugging
console.log('API Key exists:', !!process.env.NEWS_API_KEY);
console.log('API Key length:', process.env.NEWS_API_KEY?.length);
```

### 2. Test API Route Directly
```bash
# Test your proxy endpoint
curl "https://your-domain.com/api/news?endpoint=top-headlines&country=us"
```

### 3. Check Network Tab
- Open browser DevTools → Network tab
- Look for failed requests to `/api/news`
- Check response status and error messages

### 4. Verify CORS Headers
```javascript
// Should see these headers in API response
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🛡️ Security Best Practices

1. **Never expose API keys in client code**
2. **Use server-side API routes**
3. **Set proper CORS headers**
4. **Add rate limiting**
5. **Monitor API usage**
6. **Use HTTPS in production**

## 📝 Next Steps

1. ✅ Environment variables configured
2. ✅ API proxy implemented
3. ✅ CORS issues resolved
4. ✅ Error handling improved
5. 🔄 Add caching (Redis/Next.js cache)
6. 🔄 Add rate limiting
7. 🔄 Monitor API usage

## 🆘 Common Error Messages

### "API key not configured"
- Set `NEWS_API_KEY` in deployment environment
- Check environment variable names match exactly

### "CORS error"
- Ensure you're using `/api/news` proxy
- Check that proxy route exists and works

### "401 Unauthorized"
- Verify API key is valid
- Check News API account status

### "429 Too Many Requests"
- Implement caching
- Reduce API calls
- Upgrade API plan

## 📞 Support

If issues persist:
1. Check deployment logs
2. Verify environment variables
3. Test API route directly
4. Check News API status: https://newsapi.org/status
