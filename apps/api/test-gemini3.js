import 'dotenv/config';

async function testGemini3() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🧪 Testing gemini-3-flash-preview model\n');
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'You are now running on Gemini 3! Say "Gemini 3 Flash is online and ready for cybersecurity reconnaissance!"'
          }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!\n');
      console.log('Status:', response.status);
      console.log('Model Response:', data.candidates[0].content.parts[0].text);
      console.log('\n🚀 Gemini 3 Flash Preview is working!\n');
    } else {
      console.log('❌ Failed:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testGemini3();
