const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const OtpVerification = require("../models/student/otpv.js");
const Student=require("../models/student/student.js");
const Club=require("../models/club/club.js");

// Validating environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER and EMAIL_PASS must be set in .env file");
}

// Creating transporter
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

// Verifying transporter
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Transporter verification failed:", err);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

const sendOTP = async (name, email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(otp, 10);
    const student = await Student.findOne({ email:email });
    // Deleting any existing OTP for the user
    await OtpVerification.deleteMany({ userId: student._id });

    // Saving new OTP record
    const otpRecord = await OtpVerification.create({
      userId: student._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Emailing content
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

const sendOTP1 = async (name, email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(otp, 10);
    const club = await Club.findOne({ email:email });
    if(!club){
      console.error("Club not found for email",email);
      return;
    }
    // Deleting any existing OTP for the user
    await OtpVerification.deleteMany({ userId: club._id });

    // Saving new OTP record
    const otpRecord = await OtpVerification.create({
      userId: club._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Emailing content
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

const sendRegistrationConfirmation = async (student, event) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: `
        <p>Dear <b>${student.name}</b>,</p>
        <p>You have successfully registered for the event: <b>${event.title}</b>.</p>
        <p><b>Date:</b> ${event.date ? new Date(event.date).toLocaleString() : "TBD"}</p>
        <p><b>Location:</b> ${event.location || "TBD"}</p>
        <p>We look forward to your participation!</p>
        <hr/>
        <p>Club & Event Management System</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Registration confirmation sent to ${student.email}`);
  } catch (error) {
    console.error("❌ Error sending registration confirmation:", error);
  }
};

const sendAdminClubAlert = async (clubName, clubEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Club Registration Alert: ${clubName}`,
      html: `
        <h2>🚨 New Club Registration</h2>
        <p>A new club has been created and requires your approval:</p>
        <p><b>Club Name:</b> ${clubName}</p>
        <p><b>Club Email:</b> ${clubEmail}</p>
        <p>Please log in to the admin dashboard to approve or reject this club.</p>
        <hr/>
        <p>Club & Event Management System</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin alert sent for new club: ${clubName}`);
  } catch (error) {
    console.error("❌ Error sending admin alert:", error);
  }
};

// Sending approval email to club
const sendClubApprovalEmail = async (clubName, clubEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clubEmail,
      subject: `🎉 Club Approved: ${clubName}`,
      html: `
        <h2>Congratulations! 🎉</h2>
        <p>Dear <b>${clubName}</b>,</p>
        <p>Your club has been <b>approved</b> by the admin!</p>
        <p>You can now start creating and managing events on the platform.</p>
        <p>Thank you for being part of the Club & Event Management System.</p>
        <hr/>
        <p>Best regards,<br>Admin Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email sent to ${clubEmail}`);
  } catch (error) {
    console.error("❌ Error sending approval email:", error);
  }
};

// Sending rejection email to club
const sendClubRejectionEmail = async (clubName, clubEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clubEmail,
      subject: `Club Registration Status: ${clubName}`,
      html: `
        <h2>Club Registration Update</h2>
        <p>Dear <b>${clubName}</b>,</p>
        <p>Unfortunately, your club registration has been <b>rejected</b> by the admin.</p>
        <p>If you believe this is an error or have questions, please contact the admin team.</p>
        <hr/>
        <p>Best regards,<br>Admin Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email sent to ${clubEmail}`);
  } catch (error) {
    console.error("❌ Error sending rejection email:", error);
  }
};

const sendEventNotificationEmail=async(email,name,event)=>{
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `New Event Alert: ${event.title}`,
      html: `
      <h2>🎉 New Event Posted!</h2>
        <p>Dear <b>${name}</b>,</p>
        <p>A new event has been posted:</p>
        <h3>${event.title}</h3>
        <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
        <p><b>Location:</b> ${event.location}</p>
        <p>${event.description}</p>
        <p>Register now to participate!</p>
        <hr/>
        <p>Club & Event Management System</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Event notification sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending event notification email:", error);
  }
};

const sendInterviewReminderEmail=async(email,name,interviewDetails)=>{
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Interview Reminder: ${interviewDetails.position}`,
      html: `
      <h2>📅 Interview Reminder</h2>
        <p>Dear <b>${name}</b>,</p>
        <p>This is a reminder about your upcoming interview:</p>
        <p><b>Position:</b> ${interviewDetails.position || "N/A"}</p>
        <p><b>Date:</b> ${interviewDetails.date}</p>
        <p><b>Time:</b> ${interviewDetails.time}</p>
        <p><b>Location:</b> ${interviewDetails.location || "TBD"}</p>
        <p>Good luck!</p>
        <hr/>
        <p>Club & Event Management System</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`✅ Interview reminder sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending interview reminder email:", error);
  }
};

module.exports = { 
  sendOTP, 
  sendOTP1, 
  sendRegistrationConfirmation, 
  sendAdminClubAlert,
  sendClubApprovalEmail,
  sendClubRejectionEmail,
  sendEventNotificationEmail,
  sendInterviewReminderEmail
};