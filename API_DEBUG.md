# API Debugging Guide

## How to Check if API Keys are Working

### Step 1: Verify Your .env File
1. Make sure you have a `.env` file in the root directory (not just `.env.example`)
2. Your `.env` file should look like this:
```env
VITE_GEMINI_API_KEY=your_actual_key_here
VITE_GOOGLE_SEARCH_API_KEY=your_actual_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_actual_id_here
```

### Step 2: Restart Your Dev Server
**IMPORTANT:** After adding or changing API keys in `.env`, you MUST restart your dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the dev server starts!

### Step 3: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for these debug messages:
   - `API Configuration:` - Shows if keys are detected
   - `Starting API fetch for opportunities...` - Shows when API fetch starts
   - `Found X search results` - Shows how many results Google Search found
   - `Successfully extracted X opportunities from API` - Shows how many opportunities were extracted

### Step 4: Common Issues

#### Issue: "API keys not configured"
**Solution:** 
- Check that your `.env` file exists in the root directory
- Verify keys don't have quotes around them: `VITE_GEMINI_API_KEY=key` (not `VITE_GEMINI_API_KEY="key"`)
- Restart your dev server

#### Issue: "Google Search API error"
**Possible causes:**
- Invalid API key
- API not enabled in Google Cloud Console
- Quota exceeded (free tier has limits)
- Invalid Search Engine ID

**Solution:**
- Verify your API key at: https://console.cloud.google.com/apis/credentials
- Enable "Custom Search API" in Google Cloud Console
- Check your Search Engine ID at: https://programmablesearchengine.google.com/

#### Issue: "Gemini API error"
**Possible causes:**
- Invalid API key
- API not enabled
- Quota exceeded

**Solution:**
- Get a new API key from: https://makersuite.google.com/app/apikey
- Enable "Generative Language API" in Google Cloud Console

#### Issue: "No search results found"
**Possible causes:**
- Search Engine ID is incorrect
- Search Engine is not configured to search the web
- API quota exceeded

**Solution:**
- Verify your Search Engine ID
- Make sure your Custom Search Engine is set to "Search the entire web"
- Check API quotas in Google Cloud Console

### Step 5: Test API Keys Manually

You can test your Google Search API key with this URL (replace YOUR_KEY and YOUR_ENGINE_ID):
```
https://www.googleapis.com/customsearch/v1?key=YOUR_KEY&cx=YOUR_ENGINE_ID&q=test
```

You can test your Gemini API key with curl:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Note
Even if API keys don't work, the app will still function using the comprehensive mock data (50+ opportunities). The API integration is optional and enhances the data with real-time opportunities.

