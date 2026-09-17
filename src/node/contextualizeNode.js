import { getHistory } from "../memory/memory.js";
import { contextualizeQuestion } from "../service/contextualize.js";

export async function contextualizeNode(state) {
    const { query, user_id } = state;

    
    const querySpan = state.trace.span({
        name: "contextualize-question",
        input: {
            query
        }
    });

    const history = getHistory(user_id);

    if (history.length === 0) {
        querySpan.end({
            output: {
                standaloneQuery: query,
                historyUsed: false
            }
        });

        return {
            standaloneQuery: query
        };
    }

    const standaloneQuery = await contextualizeQuestion(
        history,
        query
    );

    querySpan.end({
        output: {
            standaloneQuery,
            historyUsed: true
        }
    });

    return {
        standaloneQuery
    };
}