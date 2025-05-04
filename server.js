require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500'
}));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/chat', limiter);

// Conversation storage
const conversations = new Map();

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, conversationId } = req.body;
    
    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Get or create conversation
    let conversation = conversations.get(conversationId) || [
      { 
        role: "system", 
        content: "You are KANEAI, a helpful development assistant. Be friendly, concise, and technical when needed."
      }
    ];
    
    // Add new messages
    conversation = [...conversation, ...messages];
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.MODEL || "gpt-3.5-turbo",
      messages: conversation,
      temperature: 0.7,
      max_tokens: 250
    });
    
    // Store updated conversation
    conversations.set(conversationId, conversation);
    
    res.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});