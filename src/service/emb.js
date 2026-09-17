import OpenAI from "openai";
import ExpressError from "../utils/ExpressError.js";

export class EmbeddingService {
    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
        this.model = "text-embedding-3-small";
    }

    async createEmbedding(text) {
        try {
            const inputArray = Array.isArray(text) ? text : [text];

            const response = await this.client.embeddings.create({
                model: this.model,
                input: inputArray
            });

            
            return response.data.map(item => item.embedding);

        } catch (err) {
            throw new ExpressError(
                "Embedding creation failed",
                500
            );
        }
    }
}