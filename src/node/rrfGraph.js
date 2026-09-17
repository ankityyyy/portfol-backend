import rrf from "../service/rrf.js";

export async function rrfNode(state) {

     
  const rrfSpan = state.trace.span({
    name: "rrf",
    input: {
      resultCount: state.qdrantResults.length
    }
  });

  const finalResults = rrf(state.qdrantResults);

  rrfSpan.end({
    output: {
      resultCount: finalResults.length
    }
  });

  return {
    rrfResults: finalResults
  };
}