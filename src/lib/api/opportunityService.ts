import { Opportunity } from '@/types/opportunity';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

// Debug: Log API key status (without exposing actual keys)
console.log('API Configuration:', {
  hasGeminiKey: !!GEMINI_API_KEY,
  hasSearchKey: !!GOOGLE_SEARCH_API_KEY,
  hasEngineId: !!GOOGLE_SEARCH_ENGINE_ID,
  geminiKeyLength: GEMINI_API_KEY?.length || 0,
  searchKeyLength: GOOGLE_SEARCH_API_KEY?.length || 0,
  engineIdLength: GOOGLE_SEARCH_ENGINE_ID?.length || 0,
});

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Fetch opportunities using Google Search API and Gemini AI
 */
export async function fetchOpportunitiesFromAPI(): Promise<Opportunity[]> {
  const opportunities: Opportunity[] = [];
  
  // Validate API keys
  if (!GEMINI_API_KEY || !GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.warn('API keys not configured. Using mock data.');
    console.warn('Missing keys:', {
      gemini: !GEMINI_API_KEY,
      search: !GOOGLE_SEARCH_API_KEY,
      engineId: !GOOGLE_SEARCH_ENGINE_ID,
    });
    return [];
  }

  // Validate Search Engine ID format (should not look like an API key)
  if (GOOGLE_SEARCH_ENGINE_ID.startsWith('AIzaSy')) {
    console.error('ERROR: Search Engine ID appears to be an API key, not a Search Engine ID!');
    console.error('Search Engine ID should be a short string like "017576662512468239146:omuauf_lfve"');
    console.error('Get your Search Engine ID from: https://programmablesearchengine.google.com/');
    return [];
  }

  console.log('Starting API fetch for opportunities...');
  
  try {
    // Search queries for different opportunity types - updated to 2026
    const searchQueries = [
      'hackathons 2026 India students',
      'internships 2026 India tech',
      'Google Summer of Code 2026',
      'open source programs 2026',
      'fellowships 2026 India',
      'MLH hackathons 2026',
      'tech internships India 2026',
      'coding competitions 2026',
    ];

    // Fetch search results for each query
    const searchPromises = searchQueries.map(query => 
      searchGoogle(query)
    );
    
    const searchResults = await Promise.all(searchPromises);
    const allResults = searchResults.flat();
    
    console.log(`Found ${allResults.length} search results`);

    if (allResults.length === 0) {
      console.warn('No search results found. Check your Google Search API configuration.');
      return [];
    }

    // Use Gemini to extract structured data from search results (limit to 10 for testing)
    const resultsToProcess = allResults.slice(0, 10);
    console.log(`Processing ${resultsToProcess.length} results with Gemini...`);
    
    const geminiPromises = resultsToProcess.map(result => 
      extractOpportunityData(result)
    );

    const extractedOpportunities = await Promise.all(geminiPromises);
    const validOpportunities = extractedOpportunities.filter(opp => opp !== null) as Opportunity[];
    
    console.log(`Successfully extracted ${validOpportunities.length} opportunities from API`);
    opportunities.push(...validOpportunities);

    return opportunities;
  } catch (error) {
    console.error('Error fetching opportunities from API:', error);
    return [];
  }
}

/**
 * Search Google Custom Search API
 */
async function searchGoogle(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`;
    console.log(`Searching Google for: "${query}"`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Search API error (${response.status}):`, errorText);
      throw new Error(`Google Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Google Search API returned error:', data.error);
      return [];
    }
    
    const items = data.items || [];
    console.log(`Found ${items.length} results for "${query}"`);
    
    return items.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error(`Error searching Google for "${query}":`, error);
    return [];
  }
}

/**
 * Use Gemini AI to extract structured opportunity data from search results
 */
async function extractOpportunityData(result: SearchResult): Promise<Opportunity | null> {
  try {
    console.log(`Extracting data for: ${result.title}`);
    const prompt = `Extract structured information about this tech opportunity from the following search result. 
Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "name": "opportunity name",
  "organizer": "organizer name",
  "description": "brief description",
  "category": "hackathon|internship|opensource|fellowship",
  "mode": "online|offline|hybrid",
  "level": "beginner|intermediate|advanced",
  "applicationStart": "YYYY-MM-DD or null",
  "applicationEnd": "YYYY-MM-DD or null",
  "eventStart": "YYYY-MM-DD or null",
  "eventEnd": "YYYY-MM-DD or null",
  "location": "city, country or null",
  "country": "country name",
  "isIndiaFocused": true/false,
  "eligibility": ["requirement1", "requirement2"],
  "techStack": ["tech1", "tech2"],
  "domains": ["domain1", "domain2"],
  "stipend": "amount or null",
  "prizes": "prize info or null",
  "officialLink": "url",
  "applicationLink": "url or null"
}

Search result:
Title: ${result.title}
Link: ${result.link}
Snippet: ${result.snippet}

If the information is insufficient or not a tech opportunity, return null.`;

    // Try supported Gemini API models - use v1beta with correct model names
    // Based on Google's current API, these are the available models
    const modelCombos = [
      { model: 'gemini-1.5-flash-latest' },  // Latest flash model
      { model: 'gemini-1.5-pro-latest' },    // Latest pro model
      { model: 'gemini-1.5-flash' },        // Specific version
      { model: 'gemini-1.5-pro' },          // Specific version
      { model: 'gemini-pro' },               // Legacy (might still work)
    ];
    
    for (const combo of modelCombos) {
      try {
        // Use v1beta endpoint - this is the standard for generateContent
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${combo.model}:generateContent?key=${GEMINI_API_KEY}`;
        console.log(`Calling Gemini API with model: ${combo.model}...`);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          }),
        });
        
        if (response.ok) {
          // Success - use this response
          const data = await response.json();
          
          if (data.error) {
            console.warn(`Gemini API (${combo.model}) returned error:`, data.error.message);
            continue; // Try next model silently
          }
          
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          
          if (!text) {
            console.warn('No text returned from Gemini for:', result.title);
            return null;
          }
          
          // Extract JSON from response (handle markdown code blocks)
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.warn('No JSON found in Gemini response for:', result.title);
            return null;
          }
          
          const opportunityData = JSON.parse(jsonMatch[0]);
          
          // Validate and transform to Opportunity format
          if (!opportunityData.name || !opportunityData.officialLink) {
            return null;
          }
          
          return {
            id: `api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: opportunityData.name,
            organizer: opportunityData.organizer || 'Unknown',
            description: opportunityData.description || '',
            category: opportunityData.category || 'hackathon',
            mode: opportunityData.mode || 'online',
            level: opportunityData.level || 'intermediate',
            applicationStart: opportunityData.applicationStart 
              ? new Date(opportunityData.applicationStart) 
              : new Date(),
            applicationEnd: opportunityData.applicationEnd 
              ? new Date(opportunityData.applicationEnd) 
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            eventStart: opportunityData.eventStart 
              ? new Date(opportunityData.eventStart) 
              : new Date(),
            eventEnd: opportunityData.eventEnd 
              ? new Date(opportunityData.eventEnd) 
              : new Date(),
            location: opportunityData.location || undefined,
            country: opportunityData.country || 'Worldwide',
            isIndiaFocused: opportunityData.isIndiaFocused || false,
            eligibility: Array.isArray(opportunityData.eligibility) 
              ? opportunityData.eligibility 
              : [],
            techStack: Array.isArray(opportunityData.techStack) 
              ? opportunityData.techStack 
              : [],
            domains: Array.isArray(opportunityData.domains) 
              ? opportunityData.domains 
              : [],
            stipend: opportunityData.stipend || undefined,
            prizes: opportunityData.prizes || undefined,
            officialLink: opportunityData.officialLink,
            applicationLink: opportunityData.applicationLink || undefined,
            featured: false,
            verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        } else {
          const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
          if (response.status === 404) {
            console.warn(`Gemini model ${combo.model} not available (404), trying next...`);
          } else {
            console.warn(`Gemini API (${combo.model}) error (${response.status}):`, errorData.error?.message);
          }
          // Continue to next model silently
        }
      } catch (err: any) {
        console.warn(`Error with Gemini model ${combo.model}:`, err.message);
        // Continue to next model silently
      }
    }
    
    // If all models failed, return null gracefully (don't throw)
    console.warn('All Gemini models failed, skipping this search result');
    return null;
  } catch (error) {
    console.error('Error extracting opportunity data:', error);
    return null;
  }
}

/**
 * Get all opportunities (API + mock data combined)
 */
export async function getAllOpportunities(): Promise<Opportunity[]> {
  try {
    // Fetch only from API; no mock fallback here
    const apiOpportunities = await fetchOpportunitiesFromAPI();
    console.log('getAllOpportunities: returning', apiOpportunities.length, 'API opportunities');
    return apiOpportunities;
  } catch (error) {
    console.error('Error getting opportunities:', error);
    // On error, return empty list (UI will show no results)
    return [];
  }
}


