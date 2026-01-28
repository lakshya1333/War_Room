import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiAPI() {
  console.log('🔑 Testing Gemini API Key...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }
  
  console.log('✓ API Key found:', apiKey.substring(0, 10) + '...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with gemini-1.5-flash (the model we're using)
    console.log('Testing model: gemini-1.5-flash');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('📡 Making test request...\n');
    
    const result = await model.generateContent('Say "API connection successful!" if you can read this.');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Model Response:');
    console.log('─'.repeat(50));
    console.log(text);
    console.log('─'.repeat(50));
    console.log('\n🎉 Your API key is working correctly with gemini-1.5-flash!\n');
    
  } catch (error) {
    console.error('❌ ERROR:');
    console.error('─'.repeat(50));
    console.error('Status:', error.status || 'Unknown');
    console.error('Message:', error.message);
    console.error('Full Error:', JSON.stringify(error, null, 2));
    if (error.response) {
      console.error('Response:', error.response);
    }
    console.error('─'.repeat(50));
    console.log('\n💡 Possible issues:');
    console.log('  • API key might be invalid or expired');
    console.log('  • Model "gemini-1.5-flash" might not be available for your API key');
    console.log('  • Network/firewall issues');
    console.log('  • API quota exceeded\n');
    process.exit(1);
  }
}

testGeminiAPI();
