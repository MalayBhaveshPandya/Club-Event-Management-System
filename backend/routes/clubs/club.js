const express = require("express");
const router = express.Router();
const fileUpload = require("../../middleware/cloudConfig");
const authClub = require("../../middleware/clubauth.js");
const authApprovedClub = require("../../middleware/clubApproved.js");
const { body } = require("express-validator");
const clubController = require("../../controllers/club_controller");

router.post("/clublogin", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], clubController.clubLogin);
//Registering for Club and getting the club details and verifying it
router.post("/createclubs", fileUpload, clubController.createClub);
router.get("/getclub", authClub, clubController.getClub);
router.post("/verifyotp", clubController.verifyOTP);

//Event Creation,getting clubs events and all events
router.post("/addevents", authApprovedClub, fileUpload, clubController.addEvent);
router.get("/getevents", authApprovedClub, clubController.getAllEvents);
router.get("/events/:eventId/registrations", authApprovedClub, clubController.getEventRegistrations);
router.get("/events", authApprovedClub, clubController.getClubEvents);

module.exports = router;