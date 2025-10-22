const express=require("express");
const router=express.Router();
const cors=require("cors");
const Student=require("../../models/student/student");
const {body,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {fetchStudent}=require("../../middleware/fetchstudent");
const {sendOTP}=require("../../utils/emailService.js");
router.use(cors());
const OtpVerification = require("../../models/student/otpv.js");
const JWT_SECRET=process.env.JWT_SECRET;

router.post("/createstudent",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
    body("sapid","Enter 11 digit sap id").isLength({min:11,max:11}),
    body("year","Enter a valid year between 1 to 4").isInt({min:1,max:4})
],async(req,res)=>{ 
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        let student=await Student.findOne({email:req.body.email});
        if(student){
            return res.status(400).json({error:"Sorry a user with this email already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);

        // Creating a new student
        student=await Student.create({
            name:req.body.name,
            email:req.body.email,
            sapid:req.body.sapid,
            department:req.body.department,
            division:req.body.division,
            rollno:req.body.rollno,
            year:req.body.year,
            password:secPass
        })
        await sendOTP(student._id,student.name,student.email);
        const data={
            student:{
                id:student._id
            }
        };

        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({authToken});
        console.log(authToken,student);
    }catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/studentlogin",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,error:errors.array()[0].msg});
    }

    const{email,password}=req.body;
    try{
        // Finding the user with the email if such a email is present or not
        let student=await Student.findOne({email});
        if(!student){
            return res.status(400).json({success:false,error:"Please try to login with correct credentials"});
        }

        const passcomp=await bcrypt.compare(password,student.password);// Comparing the password with hashed password
        if(!passcomp){
            return res.status(400).json({success:false,error:"Please try to login with correct credentials"});
        }
        const data={
            student:{
                id:student.id
            }
        };

        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({success:true,authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});     


router.get("/getstudent",fetchStudent,async(req,res)=>{
    try{
        const stuId=req.student.id;
        const student=await Student.findById(stuId).select("-password");
        res.json(student);
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
                await Student.updateOne({_id:userId},{isVerified:true});
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