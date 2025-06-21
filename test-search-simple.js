// Test Google Custom Search API with different approaches
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

async function testSimpleSearch() {
  const searchApiKey = process.env.SEARCH_API_KEY;
  
  console.log('🔑 Testing Google Custom Search API (Simple approach)');
  console.log('Search API Key:', searchApiKey ? '✅ Present' : '❌ Missing');
  
  if (!searchApiKey) {
    console.log('❌ SEARCH_API_KEY not found in environment variables');
    return;
  }
  
  const testQuery = 'weather today';
  
  // Try different search engine IDs
  const searchEngineIds = [
    '017576662512468239146:omuauf_lfve', // Original from docs
    'partner-pub-4485203643434653:9582345732', // Alternative general search
    '000455696194071821846:1rugqfxm_xq', // Another common one
  ];
  
  for (const searchEngineId of searchEngineIds) {
    console.log(`\n🔍 Testing with Search Engine ID: ${searchEngineId}`);
    console.log(`🔍 Query: "${testQuery}"`);
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${searchApiKey}&cx=${searchEngineId}&q=${encodeURIComponent(testQuery)}&num=3`;
    
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
        console.log('\n📋 WORKING SEARCH ENGINE FOUND! ✅');
        console.log('🎯 Working Search Engine ID:', searchEngineId);
        console.log('\n📋 Sample results:');
        data.items.slice(0, 2).forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}`);
          console.log(`   ${item.snippet?.substring(0, 150)}...`);
          console.log(`   ${item.link}\n`);
        });
        
        console.log(`\n🔧 Add this to your .env file:`);
        console.log(`SEARCH_ENGINE_ID=${searchEngineId}`);
        return; // Found working one, exit
      } else {
        console.log('⚠️ No results found');
        if (data.searchInformation) {
          console.log('🔍 Search info:', data.searchInformation.totalResults, 'total results');
        }
      }
      
    } catch (error) {
      console.log('💥 Error:', error.message);
    }
  }
  
  console.log('\n❌ None of the test search engines returned results.');
  console.log('🛠️ You need to create your own Custom Search Engine:');
  console.log('1. Go to https://programmablesearchengine.google.com/');
  console.log('2. Create a new search engine');
  console.log('3. Set it to search the entire web (use "*" as the site)');
  console.log('4. Copy the Search Engine ID to your .env file');
}

testSimpleSearch(); 