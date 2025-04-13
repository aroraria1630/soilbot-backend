import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { crop } = req.body;

  if (!crop) {
    return res.status(400).json({ error: "Crop name is required." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Give soil care advice for growing ${crop} in medium moisture soil`,
        },
      ],
    });

    const advice = completion.data.choices[0].message.content;
    res.status(200).json({ advice });
  } catch (error) {
    console.error("Error from OpenAI:", error.message);
    res.status(500).json({ error: "AI advice failed." });
  }
}
