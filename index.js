import express from 'express';
import dotenv from "dotenv";
 
const app=express();
const PORT = process.env.PORT || 2000;
import uploadRouter from "./src/routes/chat.js" 
import ExpressError from "./src/utils/ExpressError.js"
import { StatusCodes } from "http-status-codes";
import cors from "cors";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/",(req,res)=>{
     res.send("i am working")
})


app.use("/api/v1",uploadRouter)

app.use((req,res,next)=>{
     next(new ExpressError("Page not found", StatusCodes.NOT_FOUND));
})

app.use((err,req,res,next)=>{
     let message=err.message || "Something went wrong";
     let status=err.statusCode || 500

     return res.status(status).json({
          message
     })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
