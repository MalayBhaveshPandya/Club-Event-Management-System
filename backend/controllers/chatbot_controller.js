const express = require("express");
const router = express.Router();
const cors = require("cors");
const axios = require("axios");
const chatBot = async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request: messages array required" });
  }

  if (messages.length > 0 && messages[messages.length - 1].content) {
    messages[messages.length - 1].content = `${messages[messages.length - 1].content.trim()}.`;
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not set");
    return res.status(500).json({ error: "Server misconfiguration: GEMINI_API_KEY not set" });
  }

  // Map messages to Gemini 'contents' format
  const contents = messages.map((m) => ({
    role:
      m.role === "assistant"
        ? "model"
        : m.role === "system"
        ? "system"
        : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = { contents };

  console.log("Sending request to Gemini API:", JSON.stringify(body, null, 2));

  try {
    const geminiResp = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Received response from Gemini API:", JSON.stringify(geminiResp.data, null, 2));

    // Extract plain text from Gemini response candidate
    const candidate = geminiResp.data?.candidates?.[0];
    let assistantContent = "";

    if (candidate?.content?.parts && Array.isArray(candidate.content.parts)) {
  assistantContent = candidate.content.parts.map((p) => p.text).join(" ");
} else if (typeof candidate?.content === "string") {
  assistantContent = candidate.content;
} else {
  assistantContent = "Sorry, no valid response from Gemini.";
}


    console.log("Final assistant content sent:", assistantContent);

    // Send plain text only
    return res.json({ role: "assistant", content: assistantContent });
  } catch (error) {
    if (error.response) {
      console.error("Gemini API error response data:", error.response.data);
      return res.status(error.response.status || 500).json({ error: error.response.data });
    } else {
      console.error("Gemini API error message:", error.message);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }
};
module.exports={
    chatBot
};