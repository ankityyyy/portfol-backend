import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQueries = async (question) => {

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
Generate 3 different search queries for retrieving relevant
information from a document database.

Return them as a numbered list.
        `
      },
      {
        role: "user",
        content: question
      }
    ],
     max_tokens: 150,
  temperature: 0.3
  });

  const text = completion.choices[0].message.content;

  // convert text → array
  const queries = text
    .split("\n")
    .map(q => q.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

 
  return queries;
};