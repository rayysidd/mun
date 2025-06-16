const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { topic,committee, country,type, context } = req.body;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt with country-specific context
    const prompt = `As a representative of ${country}, please provide a ${type} for the commiittee ${committee},on the topic ${topic}
    Context: ${context}.
    Include the name of the committee as well (${committee})
    Please maintain consider the country's stance on international issues.`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error generating response' });
  }
});

// Generate speech endpoint
router.post('/speech', async (req, res) => {
  try {
    const { topic, country, type, context } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `As a representative of ${country}, please generate a ${type} speech for the following MUN topic: ${topic}
    Context: ${context}
    The speech should reflect the country's position on the issue.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const speech = response.text();

    res.json({ speech });
  } catch (error) {
    console.error('Speech generation error:', error);
    res.status(500).json({ message: 'Error generating speech' });
  }
});

// Generate resolution endpoint
router.post('/resolution', async (req, res) => {
  try {
    const { topic, country, context } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `As a representative of ${country}, please draft a UN resolution for the following topic: ${topic}
    Context: ${context}
    The resolution should follow proper UN format and reflect the country's position while being realistic and implementable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resolution = response.text();

    res.json({ resolution });
  } catch (error) {
    console.error('Resolution generation error:', error);
    res.status(500).json({ message: 'Error generating resolution' });
  }
});

module.exports = router; 