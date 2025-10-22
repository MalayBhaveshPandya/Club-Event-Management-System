const express=require("express");
const router=express.Router();
const cors=require("cors");
const {body,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Club=require("../../models/club/club");
const fileUpload = require("../../middleware/cloudConfig");
const {sendOTP}=require("../../utils/emailService.js");
const OtpVerification = require("../../models/student/otpv.js");

const JWT_SECRET=process.env.JWT_SECRET;

// Route to get all clubs
router.get("/clubs",async(req,res)=>{
    try{
        const clubs=await Club.find();
        res.json(clubs);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
});

//Creating a club
router.post("/createclubs", fileUpload, async(req,res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        try{
            const logoUrl=req.file? req.file.path : "https://example.com/default-logo.png";

            let club=await Club.findOne({name:req.body.name});
            if(club){
                return res.status(500).json({error:"Sorry a club with this name already exists"});
            }
            const salt=await bcrypt.genSalt(10);
            const secPass=await bcrypt.hash(req.body.password,salt);
            
            console.log("Uploaded file:", req.file);

            // Creating a new club
            club=await Club.create({
                name:req.body.name,
                description:req.body.description,
                logo:logoUrl,
                membersCount:req.body.membersCount,
                password:secPass,
                email:req.body.email
            });
            await sendOTP(club._id,club.name,club.email);
            const data={
                club:{
                    id:club.id
                }
            }   
            const authToken=jwt.sign(data,JWT_SECRET);
            res.json({authToken});
            console.log(authToken,club);
        }catch(error){
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
});

router.post("/verifyotp",async(req,res)=>{
    try{
        let {userId,otp}=req.body;
        if(!userId || !otp){
            return res.status(400).json({message:"Empty otp details are not allowed"});
        }else{
            const otpRecord=await OtpVerification.findOne({userId});
            if(!otpRecord){
                return res.status(400).json({message:"Account record doesn't exist or has been verified already"});
            }
            const isMatch=await bcrypt.compare(otp,otpRecord.otp);
            if(!isMatch){
                return res.status(400).json({message:"Invalid OTP passed"});
            }else{
                await Club.updateOne({_id:userId},{isVerified:true});
                await OtpVerification.deleteMany({userId});
                return res.json({message:"User email verified successfully"});
            }
        }
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports=router;