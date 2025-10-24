const express=require("express");
const router=express.Router();
const cors=require("cors");
const {body,validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Club=require("../../models/club/club");
const fileUpload = require("../../middleware/cloudConfig");
const {sendOTP1}=require("../../utils/emailService.js");
const OtpVerification = require("../../models/student/otpv.js");
const {fetchClub}=require("../../middleware/fetchclub.js");
const JWT_SECRET=process.env.JWT_SECRET;
const authClub=require("../../middleware/clubauth.js");
const Event=require("../../models/club/event");
const EventRegistration=require("../../models/club/eventRegistration");

router.post("/clublogin",[
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
        let club=await Club.findOne({email});
        if(!club){
            return res.status(400).json({success:false,error:"Please try to login with correct credentials"});
        }

        const passcomp=await bcrypt.compare(password,club.password);// Comparing the password with hashed password
        if(!passcomp){
            return res.status(400).json({success:false,error:"Please try to login with correct credentials"});
        }
        const data={
            club:{
                id:club._id
            }
        };

        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({success:true,authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
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

            // Creating a new club(Saving in database)
            club=await Club.create({
                name:req.body.name,
                description:req.body.description,
                logo:logoUrl,
                membersCount:req.body.membersCount,
                password:secPass,
                email:req.body.email
            });
            await sendOTP1(club.name,club.email);
            const data={
                club:{
                    id:club._id
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

// Route to get all clubs
router.get("/getclub",fetchClub,async(req,res)=>{
    try{
        const cluId=req.club.id;
        const clubs=await Club.findById(cluId).select("-password");
        res.json(clubs);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server Error"});
    }
});

router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Received:", req.body); // Debug log

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const club = await Club.findOne({ email });
    if (!club) {
      return res.status(400).json({ message: "Club not found" });
    }

    const otpRecord = await OtpVerification.findOne({ userId: club._id });
    if (!otpRecord) {
      return res.status(400).json({ message: "No OTP found for this club" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Club.updateOne({ _id: club._id }, { isVerified: true });
    await OtpVerification.deleteMany({ userId: club._id });

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addevents",authClub,fileUpload,async(req,res)=>{
   try{
    const posterUrl = req.files?.poster
      ? req.files.poster[0].path
      : "https://example.com/default-poster.png";
    const newEvent=await Event.create({
        organizer:req.club._id,
        title:req.body.title,
        description:req.body.description,
        date:req.body.date,
        location:req.body.location,
        poster:posterUrl,
        registrationForm:JSON.parse(req.body.registrationForm||"[]"),
    });
    res.status(201).json({
        message:"Event created Successfully",
        event: newEvent
    });
   }catch(error){
    res.status(500).json({
        message:"Internal Server Error"
    });
   }
})


router.get("/getevents", async (req, res) => {
  try {
    // Populate organizer (club) information
    const events = await Event.find()
      .sort({ date: -1 })//sorting from newest events to oldest events
      .populate("organizer", "name email membersCount logo isVerified");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Only accessible to the club that created the event, Responses
router.get("/events/:eventId/registrations", authClub, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    console.log("EventID param:", req.params.eventId);

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (String(event.organizer) !== String(req.club._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const registrations = await EventRegistration.find({ event: eventId })
      .populate("registrant", "name email rollno")
      .sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (err) {
    console.error("Fetch registration failed");
    console.error(err);
    res.status(500).json({ message: "Fetch registrations failed", error: err.message });
  }
});

// Get all events for the authenticated club
router.get("/events", authClub, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.club._id })
      .populate("organizer", "name email logo membersCount isVerified")
      .sort({ date: -1 });
    res.json(events);
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    res.status(500).json({ message: "Failed to fetch club events", error: err.message });
  }
});


module.exports=router;