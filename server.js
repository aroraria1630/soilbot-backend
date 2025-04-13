
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/advice", async (req, res) => {
  const { crop } = req.body;

  if (!crop) {
    return res.status(400).json({ advice: "❌ Crop name is required." });
  }

  try {
    const prompt = `You are a soil and crop advisor. Based on the crop "${crop}", provide concise soil preparation and watering advice for farming. Be friendly.`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const advice = completion.data.choices[0].message.content.trim();
    res.json({ advice });
  } catch (error) {
    console.error("Error from OpenAI:", error.message);
    res.status(500).json({ advice: "⚠️ Failed to fetch advice from AI." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
