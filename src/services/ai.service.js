const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAiInsight(offer, lead) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

    // Clean up the text to make sure it's valid JSON
    const jsonString = text.replace('```json', '').replace('```', '').trim();
    const aiResponse = JSON.parse(jsonString);

    // Map intent to points
    let points = 0;
    if (aiResponse.intent === 'High') {
      points = 50;
    } else if (aiResponse.intent === 'Medium') {
      points = 30;
    } else if (aiResponse.intent === 'Low') {
      points = 10;
    }

    return {
      points,
      intent: aiResponse.intent,
      reasoning: aiResponse.reasoning,
    };
  } catch (error) {
    console.error('Error contacting AI service:', error);
    // Return a default low score in case of AI error
    return {
      points: 10,
      intent: 'Low',
      reasoning: 'AI analysis failed or could not determine intent.',
    };
  }
}

module.exports = { getAiInsight };