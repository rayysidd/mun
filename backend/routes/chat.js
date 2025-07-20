const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { topic, committee, country, type, context } = req.body;
    
    // Initialize the model with the Google Search tool enabled
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      tools: {
        googleSearch: {}, // Enable Google Search
      },
    });

    // Construct a new prompt that instructs the model to search first
    const prompt =`
      First, perform a Google search to find the official or widely recognized stance of ${country} on the topic of "${topic}".
      Then, using that information, act as a representative of ${country} and generate a ${type} speech for the following MUN topic: "${topic}".
      Additional Context: ${context}.
      The speech must accurately reflect the country's position you found in the search.In the output include only the speech and nothing else
    `;

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
    
    // Initialize the model with the Google Search tool enabled
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      tools: {
        googleSearch: {}, // Enable Google Search
      },
    });

    // Construct a new prompt that instructs the model to search first
    const prompt = `
      First, perform a Google search to find the official or widely recognized stance of ${country} on the topic of "${topic}".
      Then, using that information, act as a representative of ${country} and generate a ${type} speech for the following MUN topic: "${topic}".
      Additional Context: ${context}.
      The speech must accurately reflect the country's position you found in the search.In the output include only the speech and nothing else
    `;

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
    
    // Initialize the model with the Google Search tool enabled
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      tools: {
        googleSearch: {}, // Enable Google Search
      },
    });

    // Construct a new prompt that instructs the model to search first
    const prompt = `
      First, perform a Google search to find the official or widely recognized stance of ${country} on the topic of "${topic}".
      Also include recent events
      Then, using that information, act as a representative of ${country} and draft a UN resolution for the topic: "${topic}".
      Additional Context: ${context}.
      The resolution must follow proper UN format, be realistic, implementable, and accurately reflect the country's position you found in the search.
    `;

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
