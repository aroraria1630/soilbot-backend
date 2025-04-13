// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.get("/", (req, res) => {
  res.send("SoilBot backend is live 🌱");
});

app.post("/api/advice", async (req, res) => {
  try {
    const { crop } = req.body;
    const moisture = 30; // Simulated; replace with sensor data if needed

    const prompt = `Give soil care advice for growing ${crop} in moisture level of ${moisture}%.`;

    const aiRes = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ advice: aiRes.data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get advice from OpenAI" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
