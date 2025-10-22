const express=require("express");
const router=express.Router();
const cors=require("cors");
const Admin=require("../../models/admin/admin");
const {body,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const{ fetchAdmin }=require("../../middleware/fetchadmin");

router.use(cors());
const JWT_SECRET=process.env.JWT_SECRET;

// Route 1: Create a new admin using: POST "/api/admin/createadmin". No login required
router.post("/createadmin",[
    body("name","Enter a valid name").isLength({min:3}),
    body("email","Enter a valid email").isEmail(),
    body("password","Password must be at least 5 characters").isLength({min:5}),
],async(req,res)=>{
    // If there are errors, return Bad request and the errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let admin=await Admin.findOne({email:req.body.email});
        if(admin){
            return res.status(500).json({error:"Sorry a admin with this email already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);
        
        // Creating a new admin
        admin=await Admin.create({
            name:req.body.name,
            email:req.body.email,
            password:secPass
        });

        const data={
            admin:{
                id:admin.id
            }
        }

        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({authToken});
        console.log(authToken,admin);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/adminlogin",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const{email,password}=req.body;
    try{
        // Finding the user with the email if such a email is present or not
        let admin=await Admin.findOne({email});
        if(!admin){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const passcomp=await bcrypt.compare(password,admin.password);// Comparing the password with hashed password
        if(!passcomp){
            return res.status(400).json({error:"Please try to login with correct credentials"});
        }

        const data={
            admin:{
                id:admin.id
            }
        }
        // Generating JWT token
        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({authToken});
        console.log("Logged in successfully");
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Protected Admin route
router.get("/admindash",fetchAdmin,async(req,res)=>{
    try{
        const adminId=req.admin.id;
        const admin=await Admin.findById(adminId).select("-password");
        res.send(admin);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports=router;