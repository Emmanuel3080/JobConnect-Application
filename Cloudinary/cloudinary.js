const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv")
dotenv.config()


cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloud_apiKey,
    api_secret: process.env.cloud_apiSecret
})

module.exports = cloudinary