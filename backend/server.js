const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { generateVideoContent } = require('./services/gemini');

// Load environment variables


// Initialize Express app
const app = express();
const PORT =  5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// API routes

// Video content generation endpoint
app.post('/api/generate-video-content', async (req, res) => {
  const { topic, niche } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  
  try {
    const content = await generateVideoContent(topic, niche);
    res.json({
      success: true,
      topic,
      niche,
      content
    });
  } catch (error) {
    console.error('Error in generate-video-content endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate content'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 