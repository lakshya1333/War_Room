import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('');

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
  // Based on https://ai.google.dev/gemini-api/docs/models/gemini
  const modelsToTest = [
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-8b',
    'gemini-exp-1206',
    'learnlm-1.5-pro-experimental',
    'gemini-1.5-pro-002',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro-001',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-001-tuning',
  ];
  
  console.log('Testing available models with your API key...\n');
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} - WORKS! Response: ${text.substring(0, 50)}...`);
      return modelName; // Return first working model
    } catch (error) {
      const errorMsg = error.message.includes('404') ? '404 Not Found' : error.message.split('\n')[0];
      console.log(`❌ ${modelName} - ${errorMsg}`);
    }
  }
  
  console.log('\n⚠️  None of the tested models work. Your API key may need to be regenerated or may not have access to Gemini models.');
}

testModels();
