import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.log("File not found at path:", localFilePath);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("File uploaded on Cloudinary: " + response.url);
    // delete local file from server asynchronously
    fs.promises
      .unlink(localFilePath)
      .catch((err) => console.log("Error deleting local file:", err));
    return response;
  } catch (error) {
    console.log("Error in cloudinary:", error);
    // Only try to delete if file exists
    if (fs.existsSync(localFilePath)) {
      fs.promises
        .unlink(localFilePath)
        .catch((err) => console.log("Error deleting local file on error:", err));
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary", result, "---", publicId);
  } catch (error) {
    console.log("Error deleting file from Cloudinary", error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
