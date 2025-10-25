const Student = require("../models/student/student");
const OtpVerification = require("../models/student/otpv");
const Event = require("../models/club/event");
const EventRegistration = require("../models/club/eventRegistration");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP, sendRegistrationConfirmation } = require("../utils/emailService");

const JWT_SECRET = process.env.JWT_SECRET;

// Creating a new student
const createStudent = async (req, res) => {
  try {
    // Check if student already exists
    let student = await Student.findOne({ email: req.body.email });
    if (student) {
      return res.status(400).json({ 
        error: "Sorry a user with this email already exists" 
      });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Creating new student
    student = await Student.create({
      name: req.body.name,
      email: req.body.email,
      sapid: req.body.sapid,
      department: req.body.department,
      division: req.body.division,
      rollno: req.body.rollno,
      year: req.body.year,
      password: secPass
    });

    // Sending OTP for email verification
    await sendOTP(student.name, student.email);

    // Generating JWT token
    const data = {
      student: {
        _id: student._id
      }
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    
    res.json({ 
      authToken, 
      email: student.email 
    });
    
    console.log(authToken, student);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Student loggging in
const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finding student by email
    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ 
        success: false, 
        error: "Please try to login with correct credentials" 
      });
    }

    // Comparing password
    const passcomp = await bcrypt.compare(password, student.password);
    if (!passcomp) {
      return res.status(400).json({ 
        success: false, 
        error: "Please try to login with correct credentials" 
      });
    }

    // Generating JWT token
    const data = {
      student: {
        _id: student._id
      }
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Getting student details
const getStudent = async (req, res) => {
  try {
    const stuId = req.student._id;
    const student = await Student.findById(stuId).select("-password");
    res.json(student);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// Verifying OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Missing email or OTP" });
    }

    // Finding student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Finding OTP record
    const otpRecord = await OtpVerification.findOne({ userId: student._id });
    if (!otpRecord) {
      return res.status(400).json({ 
        message: "OTP record not found or already verified" 
      });
    }

    // Verifying OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Updating student verification status
    await Student.updateOne({ _id: student._id }, { isVerified: true });
    
    // Deleting OTP records
    await OtpVerification.deleteMany({ userId: student._id });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Getting event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer");
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Registering for an event
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { responses } = req.body;
    const studentId = req.student && req.student._id;

    // Validating student authentication
    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Finding event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    // Finding student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Checking if already registered
    const alreadyRegistered = await EventRegistration.findOne({
      event: eventId,
      registrant: studentId
    });

    if (alreadyRegistered) {
      return res.status(409).json({ 
        message: "Already registered for this event" 
      });
    }

    // Validating responses
    if (!responses || typeof responses !== "object") {
      return res.status(400).json({ 
        message: "Missing or invalid responses" 
      });
    }

    // Validating required fields
    for (const field of (event.registrationForm || [])) {
      if (field.required && !responses[field.label]) {
        return res.status(400).json({
          message: `Field ${field.label} is required`
        });
      }
    }

    // Creating registration
    const registration = await EventRegistration.create({
      event: eventId,
      registrant: studentId,
      responses
    });

    // Sending confirmation email
    sendRegistrationConfirmation(student, event).catch(err =>
      console.error("EMAIL ERROR:", err)
    );

    res.status(201).json({ 
      message: "Registration Successful", 
      registrationId: registration._id 
    });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    res.status(500).json({
      message: "Registration Failed",
      error: err.message
    });
  }
};

// Get student's registered events
const getMyEvents = async (req, res) => {
  try {
    const studentId = req.student._id;
    
    const registrations = await EventRegistration.find({ 
      registrant: studentId 
    }).populate("event");
    
    // Extracting events from registrations
    const events = registrations.map(reg => reg.event);
    
    res.json(events);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createStudent,
  studentLogin,
  getStudent,
  verifyOTP,
  getEventById,
  registerForEvent,
  getMyEvents
};
