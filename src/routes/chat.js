import express from 'express';
const router = express.Router();
import {uploadFile} from "../middleware/uploadFile.js";
import {uploadPdf} from "../controller/upload.js"
import wrapAsync from "../utils/wrapAsync.js"
import {query} from "../controller/query.js"


router.post("/upload",uploadFile.single("file"),wrapAsync(uploadPdf))
router.post("/query/:documentId",wrapAsync(query))

export default router;