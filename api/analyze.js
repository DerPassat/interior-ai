import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { images } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const content = [
      {
        type: "input_text",
        text: `
Analysiere diese Autoinnenraum Bilder.

Gib JSON zurück mit:
- zustand (leicht/mittel/stark)
- empfehlung (Refresh Clean | Premium Detail | Showroom Elite)
- extras (array)
- confidence (0-100)
`
      },
      ...images.map(img => ({
        type: "input_image",
        image_url: img
      }))
    ];

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{ role: "user", content }]
    });

    res.status(200).json(JSON.parse(response.output_text));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
