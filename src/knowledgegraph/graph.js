import {
  StateGraph,
  START,
  END,

} from "@langchain/langgraph";

import {contextualizeNode} from "../node/contextualizeNode.js"
import {multiQueryNode} from "../node/multiquery.js"
import {qdrantNode} from "../node/qdrantNode.js"
import {rrfNode} from "../node/rrfGraph.js"
import {llmCallNode} from "../node/llmgraph.js"
import { actionNode } from "../node/actionNode.js";

const graphState = {
    query: "",
    user_id: "",
    documentId: "",
    chatHistory: [],
    standaloneQuery: "",
    multipleQueries:[],
    qdrantResults: [],
      rrfResults:[],
      answer:"",

      action: "",
  target: "",
  url: "",
    trace: null
};


const graph=new  StateGraph({
      channels: graphState
})


function routeAfterAction(state) {

  if (state.action === "open_link") {
    return "END";
  }

  return "RAG";
}
graph.addNode("contextualizeNode",contextualizeNode)
graph.addNode("multiQueryNode", multiQueryNode);
graph.addNode("qdrantNode", qdrantNode);
graph.addNode("rrfNode",rrfNode);
graph.addNode("llmCallNode",llmCallNode)
graph.addNode("actionNode", actionNode);


graph.addEdge(START, "actionNode");
graph.addConditionalEdges(
  "actionNode",
  routeAfterAction,
  {
    END: END,
    RAG: "contextualizeNode"
  }
);
graph.addEdge("contextualizeNode", "multiQueryNode")
graph.addEdge("multiQueryNode","qdrantNode")
graph.addEdge("qdrantNode","rrfNode")
graph.addEdge("rrfNode","llmCallNode")
graph.addEdge("llmCallNode",END)


export  const app = graph.compile();