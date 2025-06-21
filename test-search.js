// Simple test script to verify Google Custom Search API
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

async function testGoogleSearch() {
  const searchApiKey = process.env.SEARCH_API_KEY;
  const searchEngineId = process.env.SEARCH_ENGINE_ID || '017576662512468239146:omuauf_lfve';
  
  console.log('🔑 Testing Google Custom Search API');
  console.log('Search API Key:', searchApiKey ? '✅ Present' : '❌ Missing');
  console.log('Search Engine ID:', searchEngineId);
  
  if (!searchApiKey) {
    console.log('❌ SEARCH_API_KEY not found in environment variables');
    return;
  }
  
  // Test with multiple queries
  const testQueries = [
    'weather today',
    'latest news',
    'JavaScript tutorial'
  ];
  
  for (const testQuery of testQueries) {
    console.log(`\n🔍 Testing search with query: "${testQuery}"`);
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(testQuery)}&num=3`;
    
    console.log('🌐 Making request to Google Custom Search API...');
    
    try {
      const response = await fetch(searchUrl);
      console.log('📊 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        continue;
      }
      
      const data = await response.json();
      console.log('✅ Search successful!');
      console.log('📊 Results found:', data.items?.length || 0);
      
      if (data.items && data.items.length > 0) {
        console.log('\n📋 Sample results:');
        data.items.slice(0, 2).forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}`);
          console.log(`   ${item.snippet?.substring(0, 100)}...`);
          console.log(`   ${item.link}\n`);
        });
        break; // If we get results, we're good
      } else {
        console.log('⚠️ No results for this query');
        if (data.searchInformation) {
          console.log('🔍 Search info:', data.searchInformation);
        }
      }
      
    } catch (error) {
      console.log('💥 Error:', error.message);
    }
  }
}

testGoogleSearch(); 