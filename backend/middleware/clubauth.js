// middleware/authClub.js
const jwt = require("jsonwebtoken");
const Club = require("../models/club/club");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const club = await Club.findById(decoded.club.id);

    if (!club) return res.status(404).json({ message: "Club not found" });
    if (!club.isApproved)
      return res.status(403).json({ message: "Club not approved to create events" });

    req.club = club;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
