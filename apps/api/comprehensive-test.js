import 'dotenv/config';

async function comprehensiveTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Comprehensive API Key Test\n');
  console.log('API Key:', apiKey.substring(0, 15) + '...\n');
  
  // Test 1: List models endpoint
  console.log('═'.repeat(80));
  console.log('TEST 1: Listing Available Models');
  console.log('═'.repeat(80));
  
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(listUrl);
    const data = await response.json();
    
    console.log('Status:', response.status);
    if (response.ok) {
      console.log('\n✅ Available Models:');
      data.models?.forEach(model => {
        console.log(`  • ${model.name} - ${model.displayName}`);
      });
    } else {
      console.log('\n❌ Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
  
  // Test 2: Try v1 API (not v1beta)
  console.log('\n' + '═'.repeat(80));
  console.log('TEST 2: Trying v1 API (instead of v1beta)');
  console.log('═'.repeat(80));
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
  
  // Test 3: Try gemini-1.5-flash
  console.log('\n' + '═'.repeat(80));
  console.log('TEST 3: Trying gemini-1.5-flash with v1beta');
  console.log('═'.repeat(80));
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello' }] }]
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
  
  console.log('\n' + '═'.repeat(80));
  console.log('\n💡 Recommendations:');
  console.log('1. Verify your API key at: https://aistudio.google.com/app/apikey');
  console.log('2. Ensure billing is enabled at: https://console.cloud.google.com/billing');
  console.log('3. Check API is enabled at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
  console.log('4. Your key might be for a different Google AI product\n');
}

comprehensiveTest();
