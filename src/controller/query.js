import { StatusCodes } from "http-status-codes";
import ExpressError from "../utils/expressError.js";
import {langfuse} from "../utils/langfuse.js"
import { app as ragGraph } from "../knowledgegraph/graph.js";



export const query=async(req,res,next)=>{
  

      const { text } = req.body;
    const { documentId } = req.params;
 

    if(!documentId){
       return next(
           new ExpressError(
             "document id is required",
             StatusCodes.BAD_REQUEST
           )
          )

    }

    const trace=langfuse.trace({
     name:"portfolio-rag-query",
     input:{
          question: text

     }
    })

const result = await ragGraph.invoke({
        query: text,
        documentId,
         chatHistory: [],
         trace,
         user_id:1
  });

  await langfuse.flushAsync();

  return res.status(StatusCodes.OK).json({
  question: text,
  answer: result.answer,
  action: result.action || null,
  target: result.target || null,
  url: result.url || null
});

}