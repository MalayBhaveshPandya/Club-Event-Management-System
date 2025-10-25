const Admin = require("../models/admin/admin");
const Club = require("../models/club/club");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendClubApprovalEmail, sendClubRejectionEmail } = require("../utils/emailService.js");

const JWT_SECRET = process.env.JWT_SECRET;


// Creating a new admin
const createAdmin = async (req, res) => {
  try {
    // Checking if admin already exists
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      return res.status(400).json({ error: "An admin with this email already exists" });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // Creating new admin
    admin = await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass
    });

    // Generating JWT
    const data = { admin: { _id: admin._id } };
    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({ success: true, authToken, admin });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


// Admin Logging in
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finding admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Comparing passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generating JWT
    const data = { admin: { _id: admin._id } };
    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


// Approving club by ID
const approveClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    club.isApproved = true;
    await club.save();

    // Sending notification email
    await sendClubApprovalEmail(club.name, club.email);

    res.json({ message: "Club approved successfully", club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Rejecting / deleting club
const rejectClub = async (req, res) => {
  try {
    const clubId = req.params.clubId;
    const club = await Club.findByIdAndDelete(clubId);

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Sending rejection email
    await sendClubRejectionEmail(club.name, club.email);
    res.json({ message: "Club rejected and deleted", club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Getting all clubs (approved and unapproved)
const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find().select("-password");
    res.json(clubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  createAdmin,
  adminLogin,
  approveClub,
  rejectClub,
  getAllClubs
};