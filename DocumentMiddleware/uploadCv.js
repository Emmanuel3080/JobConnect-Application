const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Cloudinary/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine resource type
        const resourceType = file.mimetype === "application/pdf" || file.mimetype.includes("msword") ? "raw" : "image";

        return {
            folder: "EmployeeCv",
            resource_type: resourceType,
            allowed_formats: ["jpg", "png", "gif", "jpeg", "pdf", "doc", "docx"],
        };
    }
});

const uploadEmployeeCv = multer({ storage });
module.exports = uploadEmployeeCv;