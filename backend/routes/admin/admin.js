const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { fetchAdmin } = require("../../middleware/fetchadmin");
const adminController = require("../../controllers/admin_controller");


// Creating Admin
router.post("/createadmin", [
  body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
], adminController.createAdmin);


// Logging in  Admin
router.post("/login", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], adminController.adminLogin);


// Club Management
router.put("/approve-club/:clubId", fetchAdmin, adminController.approveClub);
router.delete("/reject-club/:clubId", fetchAdmin, adminController.rejectClub);
router.get("/all-clubs", fetchAdmin, adminController.getAllClubs);

module.exports = router;