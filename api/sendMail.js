import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function sendMail() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: "Test Email",
    text: "Hello! This is a test email."
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendMail();
