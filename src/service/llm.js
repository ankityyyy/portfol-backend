import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const system_prompt = `
You are an AI assistant for a developer's portfolio.

Answer the user's questions using ONLY the provided portfolio context.

Rules:
- Answer only using information from the provided context.
- Do not use outside knowledge or make assumptions.
- If the answer is not available in the context, reply exactly:
  "I couldn't find this information in the portfolio."
- Do not invent projects, skills, experience, links, or achievements.
- If multiple context chunks contain relevant information, combine them into one clear answer.
- Keep answers concise and helpful.
- Do not mention the document context, embeddings, vector databases, RAG, or the retrieval process.
`;

const llmCall = async (question, context) => {

  const result = await client.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: system_prompt
      },
      {
        role: "user",
        content: `
Portfolio Information:
${context}

User Question:
${question}
`
      }
    ],

    max_tokens: 300
  });

  return result.choices[0].message.content;
};

export default llmCall;