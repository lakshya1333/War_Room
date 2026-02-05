import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log('Fetching available models from Google AI API...\n');
  
  try {
    // Direct API call to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.models?.length || 0} models available:\n`);
    
    if (data.models) {
      for (const model of data.models) {
        // Only show models that support generateContent
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          const modelName = model.name.replace('models/', '');
          console.log(`✅ ${modelName}`);
          console.log(`   Display: ${model.displayName}`);
          console.log(`   Description: ${model.description}`);
          console.log('');
        }
      }
    }
  } catch (error) {
    console.error('Error listing models:', error.message);
    console.log('\n⚠️  Your API key may have quota/rate limits.');
    console.log('Check: https://aistudio.google.com/apikey');
    console.log('Or try regenerating a new API key.');
  }
}

listModels();
