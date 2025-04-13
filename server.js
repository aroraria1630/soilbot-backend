import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/moisture", (req, res) => {
  // Replace this hardcoded value with actual sensor data later if needed
  res.json({ moisture: 730 });
});

app.post("/advice", async (req, res) => {
  const { crop } = req.body;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    return res.status(500).json({ error: "OpenAI API key not configured" });
  }

  if (!crop) {
    return res.status(400).json({ error: "Crop name is required" });
  }

  try {
    const prompt = `Give soil moisture advice for growing ${crop} in simple, clear language.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content;

    res.json({ advice: message || "Sorry, no advice available." });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to fetch advice from AI." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
