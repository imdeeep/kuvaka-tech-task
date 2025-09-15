const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to wait for a few seconds
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAiInsight(offer, lead) {
  const maxRetries = 3; 

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `
        Product/Offer Details:
        - Name: ${offer.name}
        - Value Propositions: ${offer.value_props.join(', ')}
        - Ideal Use Cases: ${offer.ideal_use_cases.join(', ')}

        Prospect (Lead) Details:
        - Name: ${lead.name}
        - Role: ${lead.role}
        - Company: ${lead.company}
        - Industry: ${lead.industry}
        - Location: ${lead.location}
        - LinkedIn Bio: ${lead.linkedin_bio}

        Based on the product and prospect details, classify the buying intent of this prospect as "High", "Medium", or "Low". 
        Then, provide a 1-2 sentence explanation for your classification.
        
        Format your response as a JSON object with two keys: "intent" and "reasoning".
        Example: {"intent": "High", "reasoning": "Fits ICP SaaS mid-market and role is a decision maker."}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text.replace('```json', '').replace('```', '').trim();
      const aiResponse = JSON.parse(jsonString);

      let points = 0;
      if (aiResponse.intent === 'High') points = 50;
      else if (aiResponse.intent === 'Medium') points = 30;
      else if (aiResponse.intent === 'Low') points = 10;
      
      return {
        points,
        intent: aiResponse.intent,
        reasoning: aiResponse.reasoning,
      };

    } catch (error) {
      const isOverloadedError = error.message && error.message.includes('503');

      console.log(`Attempt ${attempt} failed. Is it an overload error? ${isOverloadedError}`);

      if (isOverloadedError && attempt < maxRetries) {
        console.log('Model is overloaded. Waiting 2 seconds and retrying...');
        await delay(2000); 
      } else {
        console.error('AI analysis failed permanently after multiple retries:', error);
        throw error; 
      }
    }
  }
  return {
    points: 10,
    intent: 'Low',
    reasoning: 'AI analysis failed or could not determine intent after multiple retries.',
  };
}

module.exports = { getAiInsight };