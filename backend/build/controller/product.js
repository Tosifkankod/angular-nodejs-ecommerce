"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = exports.deleteProduct = exports.updateProduct = exports.getProducts = exports.createProduct = void 0;
const data_source_1 = require("../utils/data-source");
const product_1 = require("../models/product");
const aws_1 = __importDefault(require("../utils/aws"));
const productRepository = data_source_1.AppDataSource.getRepository(product_1.Product);
// Upload a file to S3 and return the file URL
const uploadToS3 = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: "inovantsolution", // Replace with your bucket name
        Key: `products/${Date.now()}-${file.originalname}`, // File path in the bucket
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: "public-read",  // Set file permissions (public read)
    };
    try {
        const s3Response = yield aws_1.default.upload(params).promise();
        console.log(s3Response);
        return s3Response.Location; // Return the URL of the uploaded file
    }
    catch (error) {
        console.error("Error uploading to S3:", error);
        throw new Error("Error uploading file to S3");
    }
});
// create product controller
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req);
        const { name, price, sku } = req.body;
        console.log(name, price, sku, req.files);
        // Access files
        let thumbnail = null;
        if (req.files && !Array.isArray(req.files) && "thumbnail" in req.files) {
            thumbnail = req.files["thumbnail"][0];
        }
        let images = [];
        if (req.files && !Array.isArray(req.files) && "images" in req.files) {
            images = req.files["images"];
        }
        let thumbnailUrl = null;
        if (thumbnail) {
            // If you are uploading to AWS S3
            thumbnailUrl = yield uploadToS3(thumbnail);
        }
        let imageUrls = [];
        if (images.length > 0) {
            for (let image of images) {
                const imageUrl = yield uploadToS3(image);
                console.log(imageUrl);
                imageUrls.push(imageUrl);
            }
        }
        const newProduct = new product_1.Product();
        newProduct.name = name;
        newProduct.price = price;
        newProduct.sku = sku;
        newProduct.thumbnail = thumbnailUrl || ""; // URL of the uploaded thumbnail
        newProduct.images = Array.isArray(imageUrls) ? imageUrls : [];
        const savedProduct = yield productRepository.save(newProduct);
        res.status(201).json({
            message: "Product uploaded successfully!",
            product: savedProduct,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.createProduct = createProduct;
// get all product controller
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productRepository.find();
        res.json({
            success: true,
            data: {
                products,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getProducts = getProducts;
// delete product controller
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateProduct = updateProduct;
//delete product controller
// export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
//     const { id } = req.params;
//     try {
//       const productRepository = AppDataSource.getRepository(Product);
//       // Find the product by ID
//       const product = await productRepository.findOneBy({ id: parseInt(id) });
//       // Check if the product exists
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found",
//         });
//       }
//       const filesToDelete: string[] = [];
//       if (product.thumbnail) {
//         const thumbnailParts = product.thumbnail.split("amazonaws.com/").pop();
//         console.log(thumbnailParts);
//         const thumbnailKey = thumbnailParts ? thumbnailParts[1] : null; // Extract key from URL
//         filesToDelete.push(thumbnailKey!);
//       }
//       if (product.images.length > 0) {
//         product.images.forEach((imageUrl) => {
//           const imageParts = imageUrl.split("amazonaws.com/").pop();
//           const imageKey = imageParts ? imageParts[1] : null; // Extract key from URL
//           filesToDelete.push(imageKey!);
//         });
//       }
//       console.log(filesToDelete);
//       // Delete files from S3
//       const deleteParams = {
//         Bucket: "inovantsolution"!,
//         Delete: {
//           Objects: filesToDelete.map((key) => ({ Key: key })),
//         },
//       };
//       const deleteResponse = await s3.deleteObjects(deleteParams).promise();
//       console.log(deleteResponse);
//       // Remove the product
//       // await productRepository.remove(product);
//       // Send success response
//       return res.json({
//         success: true,
//         message: "Product deleted successfully",
//       });
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   };
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productRepository = data_source_1.AppDataSource.getRepository(product_1.Product);
        // Find the product by ID
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        // Check if the product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        const filesToDelete = [];
        // Extract the key for the thumbnail
        if (product.thumbnail) {
            const thumbnailKey = product.thumbnail.split("amazonaws.com/")[1]; // Extract key from URL
            if (thumbnailKey)
                filesToDelete.push(thumbnailKey);
        }
        // Extract keys for the images
        if (product.images.length > 0) {
            product.images.forEach((imageUrl) => {
                const imageKey = imageUrl.split("amazonaws.com/")[1]; // Extract key from URL
                if (imageKey)
                    filesToDelete.push(imageKey);
            });
        }
        console.log("Files to delete:", filesToDelete); // Debug log
        // Delete files from S3
        const deleteParams = {
            Bucket: "inovantsolution", // Replace with your bucket name
            Delete: {
                Objects: filesToDelete.map((key) => ({ Key: key })),
            },
        };
        const deleteResponse = yield aws_1.default.deleteObjects(deleteParams).promise();
        console.log("S3 Delete Response:", deleteResponse);
        // Remove the product
        yield productRepository.remove(product);
        // Send success response
        return res.json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.deleteProduct = deleteProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productRepository = data_source_1.AppDataSource.getRepository(product_1.Product);
        // Find product by ID
        const product = yield productRepository.findOneBy({ id: parseInt(id) });
        // If product not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        // Return the product
        return res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.getProduct = getProduct;
