const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../Cloudinary/cloudinary")


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "EmployeeCv",
        allowed_formats: ["jpg", "png", "gif", "jpeg", "webp", "pdf", "doc", "docx"],
        // transformation: [{ width: 500, height: 500 }],
    }
})

const uploadEmployeePicture = multer({ storage })
module.exports = uploadEmployeePicture