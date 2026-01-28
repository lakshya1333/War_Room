import 'dotenv/config';

async function testNewModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🧪 Testing gemini-2.5-flash model\n');
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "API connection successful!" if you can read this.'
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!\n');
      console.log('Status:', response.status);
      console.log('Model Response:', data.candidates[0].content.parts[0].text);
      console.log('\n🎉 Your API key works perfectly with gemini-2.5-flash!\n');
    } else {
      console.log('❌ Failed:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testNewModel();
