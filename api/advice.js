import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { crop, moisture } = req.body;

  if (!crop) {
    return res.status(400).json({ error: "Crop name is required." });
  }

  const prompt = `You are a soil expert. The current soil moisture is ${moisture ?? 'unknown'} units. The user wants to grow ${crop}. Give friendly, clear advice on whether this is a good idea and what to do.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're an agriculture assistant that helps people grow crops wisely." },
        { role: "user", content: prompt }
      ],
    });

    const advice = completion.data.choices?.[0]?.message?.content;
    res.status(200).json({ advice: advice || "Sorry, I couldn’t generate advice." });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "Failed to generate advice." });
  }
}
