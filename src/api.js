import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function explain(topic, mode) {
  const prompt = `
Topic: ${topic}

Mode: ${mode}

Instructions:

If mode is ELI5:
Use very simple language and relatable analogies.

If mode is Student:
Explain clearly with examples and practical understanding.

If mode is Expert:
Provide technical details, terminology, and deeper concepts.

If mode is Summary:
Return concise bullet points.

If mode is Quiz:
Generate 5 questions and provide answers at the end.

Format the response neatly.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}