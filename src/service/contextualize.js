import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function contextualizeQuestion(history, query) {

    const conversation = history
        .map(item => `${item.role}: ${item.message}`)
        .join("\n");

    const prompt = `
Convert the user's latest question into a standalone question.

Conversation:
${conversation}

Latest question:
${query}

Return ONLY the standalone question.
`;

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content.trim();
}