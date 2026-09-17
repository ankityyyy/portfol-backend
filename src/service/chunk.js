import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

 export const getText=async(docs)=>{

     const split=new RecursiveCharacterTextSplitter({
           chunksize:1000,
     chunkOverlap: 150,       
    separators: [
      "\n\n",   
      "\n",     
      ". ",     
      " ",      
    ],
     })

     let splitDoc=await split.splitDocuments(docs)

   


     return splitDoc;
}