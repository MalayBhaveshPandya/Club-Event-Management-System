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
const Event=require("../../models/club/event");
const EventRegistration=require("../../models/club/eventRegistration");
const {sendRegistrationConfirmation}=require("../../utils/emailService.js");

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
        await sendOTP(student.name,student.email);
        const data={
            student:{
                _id:student._id
            }
        };

        const authToken=jwt.sign(data,JWT_SECRET);
        res.json({authToken,email:student.email});
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
                _id:student._id
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
        const stuId=req.student._id;
        const student=await Student.findById(stuId).select("-password");
        res.json(student);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Missing email or OTP" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    const otpRecord = await OtpVerification.findOne({ userId: student._id });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP record not found or already verified" });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Student.updateOne({ _id: student._id }, { isVerified: true });
    await OtpVerification.deleteMany({ userId: student._id });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/events/:id/register", fetchStudent, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    console.log("Fetched event:", event);

    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }
    const { responses } = req.body;
    const studentId = req.student && req.student._id;
    const student = await Student.findById(studentId);
    console.log("Student ID from token:", studentId);
    console.log("Registration responses:", responses);

    if (!responses || typeof responses !== 'object') {
      return res.status(400).json({ message: "Missing or invalid responses" });
    }
    // Validate required fields
    for (const field of event.registrationForm) {
      if (field.required && !responses[field.label]) {
        return res.status(400).json({
          message: `Field ${field.label} is required`
        });
      }
    }

    await EventRegistration.create({
      event: eventId,
      registrant: studentId,
      responses,
    });

    res.status(201).json({ message: "Registration Successful" });
    await sendRegistrationConfirmation(student, event);
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    res.status(500).json({
      message: "Registration Failed",
      error: err.message
    });
  }
});



module.exports=router;