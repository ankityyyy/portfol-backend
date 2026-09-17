import { StatusCodes } from "http-status-codes";
import ExpressError from "../utils/ExpressError.js";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {getText} from "../service/chunk.js"
import {EmbeddingService} from "../service/emb.js"
import { VectorStore} from "../service/vectorStore.js"


export const uploadPdf=async(req,res,next)=>{

      if (!req.file) {
         return next(
           new ExpressError(
             "Resume file is required",
             StatusCodes.BAD_REQUEST
           )
         );
       }



       let tempPath;
let docs;

try {
  // Get the operating system's temporary directory.
  // Examples:
  // Windows -> C:\Users\<User>\AppData\Local\Temp
  // Linux   -> /tmp
  tempPath = path.join(
    os.tmpdir(),
    `${Date.now()}-${req.file.originalname}`
  );

  // Write the uploaded PDF buffer to the temporary file.
  await fs.writeFile(tempPath, req.file.buffer);

  // PDFLoader expects a file path, so pass the temp file path.
  const loader = new PDFLoader(tempPath);

  // Read the PDF and convert it into LangChain Documents.
  docs = await loader.load();

  

} finally {
  // This block always runs, even if an error occurs above.
  if (tempPath) {
    try {
      // Delete the temporary file.
      await fs.unlink(tempPath);
    } catch (err) {
      console.error("Failed to delete temp file:", err.message);
    }
  }
}

if (!docs || docs.length === 0) {
  return next(
    new ExpressError("Failed to load PDF documents", StatusCodes.BAD_REQUEST)
  );
}

 const splitDocs = await getText(docs);
 
 if (!splitDocs || splitDocs.length === 0) {
   return next(
     new ExpressError("Failed to create chunks", StatusCodes.BAD_REQUEST)
   );
 }

 const texts=splitDocs.map(doc=>doc.pageContent)

 const embeddingService=new EmbeddingService(process.env.OPENAI_API_KEY)

  const embeddings = await embeddingService.createEmbedding(texts);

  if (!embeddings ||embeddings.length === 0) {
  return next(
    new ExpressError("Failed to create embeddings", StatusCodes.BAD_REQUEST)
  );
}

const documentId = crypto.randomUUID();
  
      const vectorStore = new VectorStore();
  
   await vectorStore.createCollection();
  console.log("data come")
  
  await vectorStore.addDocuments(splitDocs, embeddings, documentId);
  

  return res.json({
    message: "PDF processed",
    documentId,
    chunks: splitDocs.length,
    embeddings: embeddings.length
  });




 
}

