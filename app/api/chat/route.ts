import { NextRequest, NextResponse } from 'next/server';

// Function to search Google using Custom Search API
async function searchGoogle(query: string, apiKey: string, searchEngineId: string) {
  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
    
    console.log(`🔍 Searching Google for: "${query}"`);
    console.log(`📡 Search URL: ${searchUrl.replace(apiKey, 'API_KEY_HIDDEN')}`);
    
    const response = await fetch(searchUrl);
    
    console.log(`📊 Google API Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Search API error:', response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ Google API returned ${data.items?.length || 0} results for query: "${query}"`);
    
    if (data.items && data.items.length > 0) {
      console.log('📋 Search results preview:');
      data.items.slice(0, 2).forEach((item: any, index: number) => {
        console.log(`  ${index + 1}. ${item.title}`);
        console.log(`     ${item.snippet?.substring(0, 100)}...`);
      });
    } else {
      console.log('⚠️ No search results found');
    }
    
    return data.items || [];
  } catch (error) {
    console.error('💥 Error searching Google:', error);
    return null;
  }
}

// Function to call Gemini API
async function callGeminiAPI(prompt: string, apiKey: string, step: string) {
  try {
    console.log(`🤖 Calling Gemini API for: ${step}`);
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    console.log(`📊 Gemini API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Gemini API error for ${step}:`, response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    
    console.log(`✅ Gemini API response for ${step}: ${result ? 'Success' : 'Empty'}`);
    if (result) {
      console.log(`📄 Response preview: ${result.substring(0, 200)}...`);
    }
    
    return result;
  } catch (error) {
    console.error(`💥 Error calling Gemini API for ${step}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    console.log('\n🚀 === NEW CHAT REQUEST ===');
    console.log('📨 Received message:', message);

    if (!message) {
      console.log('❌ No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const searchApiKey = process.env.SEARCH_API_KEY;
    const searchEngineId = process.env.SEARCH_ENGINE_ID || 'f1e246445d02d4e5c';
    
    console.log('🔑 API Keys status:');
    console.log('  - Gemini API Key:', !!apiKey ? '✅ Present' : '❌ Missing');
    console.log('  - Search API Key:', !!searchApiKey ? '✅ Present' : '❌ Missing');
    console.log('  - Search Engine ID:', searchEngineId);
    
    if (!apiKey) {
      console.log('❌ No Gemini API key found');
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    if (!searchApiKey) {
      console.log('❌ No Search API key found');
      return NextResponse.json(
        { error: 'Search API key not configured. Please set SEARCH_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    // STEP 1: Ask LLM what to search for
    console.log('\n📋 === STEP 1: QUERY ANALYSIS ===');
    const searchAnalysisPrompt = `Analyze the following user question and determine what specific search queries would be most helpful to answer it comprehensively.

User Question: "${message}"

Please provide 3-5 specific search queries that would help gather the most relevant and up-to-date information to answer this question. Format your response as a simple list, one search query per line, without any additional text or formatting. Focus on:
- Current/recent information if the question involves time-sensitive topics
- Multiple perspectives or sources for controversial topics  
- Technical details for how-to questions
- Factual data for informational questions

Example format:
current weather New York today
New York weather forecast
NYC temperature humidity`;

    const searchQueries = await callGeminiAPI(searchAnalysisPrompt, apiKey, 'Query Analysis');
    if (!searchQueries) {
      throw new Error('Failed to analyze search requirements');
    }

    console.log('🎯 Raw search queries from AI:', searchQueries);

    // Parse the search queries from LLM response
    const queries = searchQueries.split('\n')
      .map((q: string) => q.trim())
      .filter((q: string) => q.length > 0 && !q.startsWith('Example') && !q.includes('format'))
      .slice(0, 5); // Limit to 5 queries max

    console.log('✅ Parsed search queries:', queries);
    console.log(`📊 Total queries to execute: ${queries.length}`);

    // STEP 2: Perform all searches
    console.log('\n🌐 === STEP 2: WEB SEARCH EXECUTION ===');
    const allSearchResults = [];
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\n🔍 Executing search ${i + 1}/${queries.length}: "${query}"`);
      
      const results = await searchGoogle(query, searchApiKey, searchEngineId);
      if (results && results.length > 0) {
        const topResults = results.slice(0, 3); // Top 3 results per query
        allSearchResults.push(...topResults);
        console.log(`✅ Added ${topResults.length} results from this search`);
      } else {
        console.log('⚠️ No results from this search');
      }
    }

    console.log(`\n📊 SEARCH SUMMARY:`);
    console.log(`  - Total searches performed: ${queries.length}`);
    console.log(`  - Total results collected: ${allSearchResults.length}`);

    if (allSearchResults.length === 0) {
      console.log('❌ WARNING: No search results found at all!');
    } else {
      console.log('📋 Sample of collected results:');
      allSearchResults.slice(0, 3).forEach((result: any, index: number) => {
        console.log(`  ${index + 1}. ${result.title}`);
        console.log(`     Snippet: ${result.snippet?.substring(0, 100)}...`);
        console.log(`     URL: ${result.link}`);
      });
    }

    // STEP 3: Generate final answer with search context
    console.log('\n🤖 === STEP 3: AI RESPONSE GENERATION ===');
    
    let searchContext = '';
    if (allSearchResults.length > 0) {
      searchContext = allSearchResults.map((result: any, index: number) => 
        `[${index + 1}] ${result.title}
${result.snippet}
Source: ${result.link}
`
      ).join('\n');
      
      console.log(`📄 Search context length: ${searchContext.length} characters`);
      console.log('📋 Search context preview:');
      console.log(searchContext.substring(0, 500) + '...');
    } else {
      console.log('⚠️ No search context available - proceeding with AI knowledge only');
    }

    const finalPrompt = `You are an AI assistant tasked with answering a user's question using both your knowledge and current web search results.

User Question: "${message}"

Web Search Results:
${searchContext}

Instructions:
1. Provide a comprehensive, accurate answer to the user's question
2. Integrate information from the search results when relevant and current
3. Always cite your sources using [number] format when referencing search results
4. If search results contradict each other, acknowledge this and explain the different perspectives
5. If the search results don't contain relevant information, rely on your general knowledge but mention this
6. Be conversational but informative
7. Structure your response clearly with proper formatting

Please provide your response now:`;

    console.log(`📝 Final prompt length: ${finalPrompt.length} characters`);

    const finalResponse = await callGeminiAPI(finalPrompt, apiKey, 'Final Response');
    if (!finalResponse) {
      throw new Error('Failed to generate final response');
    }

    console.log('\n✅ === RESPONSE GENERATION COMPLETE ===');
    console.log(`📊 Final response length: ${finalResponse.length} characters`);
    console.log(`📋 Response preview: ${finalResponse.substring(0, 200)}...`);

    // Return response with search results for display
    const responseData = { 
      response: finalResponse,
      searchResults: allSearchResults.slice(0, 6), // Return top 6 results for display
      searchQueries: queries // Also return the queries that were used
    };

    console.log(`📤 Returning response with ${responseData.searchResults.length} search results and ${responseData.searchQueries.length} queries`);

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('\n💥 === ERROR IN CHAT API ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}