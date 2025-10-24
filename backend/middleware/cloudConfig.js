const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Event/Uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Accept both "logo" and "poster"
const fileUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "poster", maxCount: 1 },
]);

module.exports = fileUpload;
