import { Request, Response } from "express";
import { AppDataSource } from "../utils/data-source";
import { Product } from "../models/product";
import s3 from "../utils/aws";



const productRepository = AppDataSource.getRepository(Product);

// Upload a file to S3 and return the file URL
const uploadToS3 = async (file: any) => {
  const params = {
    Bucket: "inovantsolution", // Replace with your bucket name
    Key: `products/${Date.now()}-${file.originalname}`, // File path in the bucket
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: "public-read",  // Set file permissions (public read)
  };

  try {
    const s3Response = await s3.upload(params).promise();
    console.log(s3Response);
    return s3Response.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Error uploading file to S3");
  }
};

// create product controller
export const createProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log(req);
    const { name, price, sku } = req.body;
    console.log(name, price, sku, req.files);

    // Access files
    let thumbnail = null;
    if (req.files && !Array.isArray(req.files) && "thumbnail" in req.files) {
      thumbnail = req.files["thumbnail"][0];
    }

    let images: Express.Multer.File[] = [];
    if (req.files && !Array.isArray(req.files) && "images" in req.files) {
      images = req.files["images"];
    }

    let thumbnailUrl = null;
    if (thumbnail) {
      // If you are uploading to AWS S3
      thumbnailUrl = await uploadToS3(thumbnail);
    }

    let imageUrls = [];
    if (images.length > 0) {
      for (let image of images) {
        const imageUrl = await uploadToS3(image);
        console.log(imageUrl);
        imageUrls.push(imageUrl);
      }
    }

    const newProduct = new Product();
    newProduct.name = name;
    newProduct.price = price;
    newProduct.sku = sku;
    newProduct.thumbnail = thumbnailUrl || ""; // URL of the uploaded thumbnail
    newProduct.images = Array.isArray(imageUrls) ? imageUrls : [];

    const savedProduct = await productRepository.save(newProduct);

    res.status(201).json({
      message: "Product uploaded successfully!",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all product controller
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find();
    res.json({
      success: true,
      data: {
        products,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// delete product controller
export const updateProduct = async (req: Request, res: Response) => {};

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

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const productRepository = AppDataSource.getRepository(Product);

    // Find the product by ID
    const product = await productRepository.findOneBy({ id: parseInt(id) });

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const filesToDelete: string[] = [];

    // Extract the key for the thumbnail
    if (product.thumbnail) {
      const thumbnailKey = product.thumbnail.split("amazonaws.com/")[1]; // Extract key from URL
      if (thumbnailKey) filesToDelete.push(thumbnailKey);
    }

    // Extract keys for the images
    if (product.images.length > 0) {
      product.images.forEach((imageUrl) => {
        const imageKey = imageUrl.split("amazonaws.com/")[1]; // Extract key from URL
        if (imageKey) filesToDelete.push(imageKey);
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

    const deleteResponse = await s3.deleteObjects(deleteParams).promise();
    console.log("S3 Delete Response:", deleteResponse);

    // Remove the product
    await productRepository.remove(product);

    // Send success response
    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const productRepository = AppDataSource.getRepository(Product);

    // Find product by ID
    const product = await productRepository.findOneBy({ id: parseInt(id) });

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
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
