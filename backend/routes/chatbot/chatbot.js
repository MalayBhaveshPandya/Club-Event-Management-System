const express = require("express");
const router = express.Router();
const cors = require("cors");
const axios = require("axios");
const chatbotController=require("../../controllers/chatbot_controller");
router.use(cors());

router.post("/chat", chatbotController.chatBot);

module.exports = router;
