import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listAvailableModels() {
  console.log('🔍 Checking available Gemini models for your API key...\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    console.log('📡 Testing common model names...\n');
    
    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash-exp'
    ];
    
    console.log('✅ Testing Models:');
    console.log('═'.repeat(80));
    
    for (const modelName of modelsToTest) {
      try {
        console.log(`\n🧪 Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log(`   ✅ WORKS! Response: ${response.text().substring(0, 50)}...`);
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message.substring(0, 80)}...`);
      }
    }
    
    console.log('\n' + '═'.repeat(80));
    
  } catch (error) {
    console.error('❌ ERROR:');
    console.error('Status:', error.status || 'Unknown');
    console.error('Message:', error.message);
    console.log('\n💡 Your API key might be invalid or there might be a network issue\n');
    process.exit(1);
  }
}

listAvailableModels();
