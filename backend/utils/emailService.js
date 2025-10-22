const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const OtpVerification = require("../models/student/otpv.js");

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER and EMAIL_PASS must be set in .env file");
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Transporter verification failed:", err);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

const sendOTP = async (_id, name, email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Delete any existing OTP for the user
    await OtpVerification.deleteMany({ userId: _id });

    // Save new OTP record
    const otpRecord = await OtpVerification.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email - Club & Event Management System",
      html: `
        <p>Dear <b>${name}</b>,</p>
        <p>Your OTP for verification is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
        <p>Thank you,<br>Club & Event Management System</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    if (res) res.status(500).send("Internal Server Error");
  }
};

module.exports = { sendOTP };
