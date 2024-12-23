"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controller/product");
require("reflect-metadata");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Store files in memory (or use diskStorage to save locally)
const upload = (0, multer_1.default)({ storage: storage });
// Define middleware for handling file uploads (thumbnail and images)
const cpUpload = upload.fields([
    { name: "thumbnail", maxCount: 1 }, // Single file for thumbnail
    { name: "images", maxCount: 10 }, // Multiple files for images (adjust the max count as needed)
]);
// router handlers for product
router.get("/", product_1.getProducts);
router.post("/", cpUpload, product_1.createProduct);
router.delete("/:id", product_1.deleteProduct);
router.put("/:id", product_1.updateProduct);
router.get("/:id", product_1.getProduct);
exports.default = router;
