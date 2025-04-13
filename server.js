const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let moisture = 480; // Replace with real sensor reading if available

app.post("/advice", async (req, res) => {
  const crop = req.body.crop?.toLowerCase() || "wheat";

  const prompt = `
You are a smart farming assistant.
Soil moisture is currently ${moisture}.
The user wants to grow ${crop}.
Give clear advice in 1–2 sentences about whether the soil is okay for this crop and what they should do.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert agricultural assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content || "Sorry, couldn't generate advice.";

    res.json({ advice });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ advice: "Failed to get AI response." });
  }
});
