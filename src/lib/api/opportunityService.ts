import { Opportunity } from '@/types/opportunity';
import { mockOpportunities } from '@/lib/mock-data';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GOOGLE_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

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
  
  // If API keys are not configured, return empty array (will fallback to mock data)
  if (!GEMINI_API_KEY || !GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.warn('API keys not configured. Using mock data.');
    return [];
  }

  try {
    // Search queries for different opportunity types
    const searchQueries = [
      'hackathons 2025 India students',
      'internships 2025 India tech',
      'Google Summer of Code 2025',
      'open source programs 2025',
      'fellowships 2025 India',
      'MLH hackathons 2025',
      'tech internships India 2025',
      'coding competitions 2025',
    ];

    // Fetch search results for each query
    const searchPromises = searchQueries.map(query => 
      searchGoogle(query)
    );
    
    const searchResults = await Promise.all(searchPromises);
    const allResults = searchResults.flat();

    // Use Gemini to extract structured data from search results
    const geminiPromises = allResults.slice(0, 30).map(result => 
      extractOpportunityData(result)
    );

    const extractedOpportunities = await Promise.all(geminiPromises);
    opportunities.push(...extractedOpportunities.filter(opp => opp !== null) as Opportunity[]);

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
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`
    );
    
    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: any) => ({
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
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
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

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
    // Try to fetch from API first
    const apiOpportunities = await fetchOpportunitiesFromAPI();
    
    // Combine with mock data and deduplicate by name
    const allOpportunities = [...mockOpportunities];
    const existingNames = new Set(mockOpportunities.map(opp => opp.name.toLowerCase()));
    
    apiOpportunities.forEach(opp => {
      if (!existingNames.has(opp.name.toLowerCase())) {
        allOpportunities.push(opp);
        existingNames.add(opp.name.toLowerCase());
      }
    });

    return allOpportunities;
  } catch (error) {
    console.error('Error getting opportunities:', error);
    // Fallback to mock data only
    return mockOpportunities;
  }
}

