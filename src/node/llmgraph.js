import llmCall from "../service/llm.js";
import { addData } from "../memory/memory.js";

const llmCallNode = async (state) => {

  const generation = state.trace.generation({
    name: "final-answer",
    model: "gpt-4.1-mini",
    input: {
      question: state.standaloneQuery,
      context: state.rrfResults.slice(0, 5)
    }
  });

  const context = state.rrfResults
  .slice(0, 5)
  .map((item, index) =>
    `Chunk ${index + 1}:\n${item.payload.text}`
  )
  .join("\n\n");

  const finalResult = await llmCall(
    state.standaloneQuery,
   context
  );

  generation.end({
    output: finalResult
  });


  addData(state.user_id, "user", state.query);
  addData(state.user_id, "assistant", finalResult);

  return {
    answer: finalResult
  };
};

export { llmCallNode };