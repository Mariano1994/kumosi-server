import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.ts";

const storage = new CloudinaryStorage({
	cloudinary,
});

export const upload = multer({ storage });
