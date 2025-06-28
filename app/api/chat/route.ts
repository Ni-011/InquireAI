import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, checkSearchLimit, incrementSearchCount } from '@/lib/auth';

async function searchGoogle(query: string, apiKey: string, searchEngineId: string, numResults: number = 5) {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=${numResults}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

async function callGemini(prompt: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Gemini error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, isGuest, isDeepSearch } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let user = null;
    let remainingSearches = 0;

    if (!isGuest) {
      // Auth check for logged-in users
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const token = authHeader.substring(7);
      user = verifyToken(token);
      if (!user) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      // Check search limit for logged-in users
      const limitCheck = await checkSearchLimit(user.id);
      if (!limitCheck.canSearch) {
        return NextResponse.json({ 
          error: `Daily search limit reached (7/7). Try again tomorrow!`, 
          remaining: 0 
        }, { status: 429 });
      }
      remainingSearches = limitCheck.remaining;
    }

    // Get API keys
    const apiKey = process.env.GEMINI_API_KEY;
    const searchApiKey = process.env.SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID || 'f1e246445d02d4e5c';
    
    if (!apiKey || !searchApiKey) {
      return NextResponse.json({ error: 'API keys not configured' }, { status: 500 });
    }

    // Enhanced date/time context
    const now = new Date();
    const currentDateTime = {
      readable: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZoneName: 'short' 
      }),
      year: now.getFullYear()
    };

    // Generate search queries with enhanced context
    const searchPrompt = isDeepSearch
      ? `Current date: ${currentDateTime.readable}, ${currentDateTime.time}

Research topic: "${message}"

Generate 4-5 targeted search queries for comprehensive research. For current events include terms like "latest", "breaking", "current", "${currentDateTime.year}". Provide only the search queries, one per line.`
      : `Current date: ${currentDateTime.readable}, ${currentDateTime.time}

Query: "${message}"

Generate 3-4 targeted search queries for recent information. For news/events include "latest", "breaking", "current", "${currentDateTime.year}". Provide only the search queries, one per line.`;

    const searchQueries = await callGemini(searchPrompt, apiKey);
    if (!searchQueries) throw new Error('Failed to generate search queries');

    // Parse queries
    const queries = searchQueries.split('\n')
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0 && !q.includes('Example') && !q.includes('format'))
      .map((q: string) => q.replace(/^["']|["']$/g, ''))
      .slice(0, isDeepSearch ? 10 : 4);

    // Perform searches with more results per query
    const allResults = [];
    for (const query of queries) {
      const results = await searchGoogle(query, searchApiKey, searchEngineId, isDeepSearch ? 15 : 10);
      if (results.length > 0) {
        allResults.push(...results.slice(0, isDeepSearch ? 10 : 8));
      }
    }

    // Build search context
    const searchContext = allResults.map((result, index) => 
      `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}\n`
    ).join('\n');

    // Generate final response with enhanced context
    const finalPrompt = isDeepSearch
      ? `Current date: ${currentDateTime.readable}, ${currentDateTime.time}

Request: "${message}"

Search Results:
${searchContext}

Provide a comprehensive research report with Executive Summary, Current Status, Analysis, Key Findings, and Conclusion. Prioritize recent information and cite sources using [number] format.`
      : `Current date: ${currentDateTime.readable}, ${currentDateTime.time}

Question: "${message}"

Search Results:
${searchContext}

Provide a comprehensive answer prioritizing recent information. For news/events, emphasize current developments. Cite sources using [number] format and be specific about timing.`;

    const finalResponse = await callGemini(finalPrompt, apiKey);
    if (!finalResponse) throw new Error('Failed to generate response');

    // Increment search count after successful search (only for logged-in users)
    if (user) {
      await incrementSearchCount(user.id);
      const updatedLimit = await checkSearchLimit(user.id);
      remainingSearches = updatedLimit.remaining;
    }

    return NextResponse.json({
      response: finalResponse,
      searchResults: allResults.slice(0, isDeepSearch ? 20 : 12),
      searchQueries: queries,
      searchesRemaining: user ? remainingSearches : undefined
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}