import express from "express";
import { getProducts,createProduct, deleteProduct, updateProduct, getProduct } from '../controller/product';
import "reflect-metadata"; 
import multer from "multer";
const router = express.Router();


const storage = multer.memoryStorage();  // Store files in memory (or use diskStorage to save locally)
const upload = multer({ storage: storage });

// Define middleware for handling file uploads (thumbnail and images)
const cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 }, // Single file for thumbnail
  { name: "images", maxCount: 10 },   // Multiple files for images (adjust the max count as needed)
]);


// router handlers for product
router.get("/", getProducts);
router.post("/", cpUpload, createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.get("/:id", getProduct);

export default router;