// middleware/fetchAdmin.js
const jwt = require("jsonwebtoken");

function fetchAdmin(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Admin JWT data:", data); // Debug log
    
    if (!data.admin || !data.admin.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    
    req.admin = data.admin; // Attach admin to request
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
}

module.exports = { fetchAdmin };
