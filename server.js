import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Simulated real-time moisture value
let moisture = Math.floor(Math.random() * (750 - 550 + 1)) + 550;

// Route 1: GET current soil moisture
app.get('/moisture', (req, res) => {
  res.json({ moisture });
});

// Route 2: POST crop for advice
app.post('/advice', async (req, res) => {
  const { crop } = req.body;
  if (!crop) {
    return res.status(400).json({ advice: 'Please provide a crop.' });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const openaiRes = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in farming and soil conditions.',
        },
        {
          role: 'user',
          content: `The user wants to grow ${crop}. The current soil moisture is ${moisture}. What is your advice for planting this crop right now? Be specific.`,
        },
      ],
    });

    const advice = openaiRes.choices?.[0]?.message?.content;
    if (advice) {
      res.json({ advice });
    } else {
      res.json({ advice: 'Sorry, no advice available.' });
    }
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ advice: 'Something went wrong while generating advice.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
