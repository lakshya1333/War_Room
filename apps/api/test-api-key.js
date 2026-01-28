import 'dotenv/config';

async function testAPIKeyWithFetch() {
  console.log('🔍 Testing API Key with direct HTTP request...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }
  
  console.log('API Key:', apiKey.substring(0, 15) + '...');
  console.log('API Key Length:', apiKey.length);
  console.log('');
  
  // Try direct API call
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    console.log('📡 Making direct HTTP request to Gemini API...\n');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello'
          }]
        }]
      })
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    console.log('');
    
    const data = await response.json();
    console.log('Response Body:');
    console.log(JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ API Key is VALID and working!');
    } else {
      console.log('\n❌ API call failed. Possible issues:');
      console.log('  • API key might be invalid or expired');
      console.log('  • API key might not have access to Gemini API');
      console.log('  • Billing might not be enabled');
      console.log('  • Try regenerating your API key at: https://makersuite.google.com/app/apikey');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testAPIKeyWithFetch();
