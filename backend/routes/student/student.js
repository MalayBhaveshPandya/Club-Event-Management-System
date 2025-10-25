const express = require("express");
const router = express.Router();
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const { fetchStudent } = require("../../middleware/fetchstudent");
const studentController = require("../../controllers/student_controller");

router.use(cors());

// Validating middleware wrapper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Creating student
router.post(
  "/createstudent",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
    body("sapid", "Enter 11 digit sap id").isLength({ min: 11, max: 11 }),
    body("year", "Enter a valid year between 1 to 4").isInt({ min: 1, max: 4 })
  ],
  validate,
  studentController.createStudent
);

// Student logging in , getting student details and also verification part
router.post(
  "/studentlogin",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  validate,
  studentController.studentLogin
);

router.get("/getstudent", fetchStudent, studentController.getStudent);
router.post("/verifyotp", studentController.verifyOTP);

//Getting my events, registering the events and getting all the events.
router.get("/event/:id", studentController.getEventById);
router.post("/events/:id/register", fetchStudent, studentController.registerForEvent);
router.get("/myevents", fetchStudent, studentController.getMyEvents);

module.exports = router;
