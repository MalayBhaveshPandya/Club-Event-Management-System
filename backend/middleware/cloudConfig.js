const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"Event/ClubLogos",
        allowedFormats:["jpg","png","jpeg"]
    }
});

const multer=require('multer');
const upload = multer({ storage });

// Export the single-file upload middleware
module.exports = upload.single('logo');