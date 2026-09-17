import { generateQueries } from "../service/queryGenerator.js";

export async function multiQueryNode(state) {


    const querySpan = state.trace.span({
        name: "multi-query",
        input: {
            standaloneQuery: state.standaloneQuery
        }
    });

    const queries = await generateQueries(state.standaloneQuery);

    querySpan.end({
        output: {
            queries
        }
    });

    return {
        multipleQueries: queries
    };
}