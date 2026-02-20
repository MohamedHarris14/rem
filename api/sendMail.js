import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";


const logFile = "/tmp/lastSent.json"; 

export default async function handler(req, res) {
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const hour = now.getHours(); // 0-23

  // Determine slot: AM or PM
  const slot = hour < 12 ? today : today;

  // Check if already sent in this slot
  let log = {};
  if (fs.existsSync(logFile)) {
    log = JSON.parse(fs.readFileSync(logFile, "utf-8"));
    if (log[today] && log[today][slot]) {
      return res.status(200).json({ message: `Email already sent today ${slot}` });
    }
  }

  // Configure transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
const quotes = [
  "You are my joy.",
  "The baby will know your warmth forever.",
  "You are my one and only.",
  "Our journey is perfect with you.",
  "You are my love story.",
  "The baby is blessed by your strength.",
  "You are my everything in this world.",
  "Our family is lucky to have you.",
  "You are my shining star.",
  "The baby is the reflection of your love.",
  "You are my happiness.",
  "Our love grows stronger with you.",
  "You are my true love.",
  "The baby will inherit your beauty.",
  "You are my soulmate.",
  "Our journey is more beautiful because of you.",
  "You are my best friend.",
  "The baby feels your endless love.",
  "You are my forever partner.",
  "Our family is brighter with you.",
  "You are my sunshine forever.",
  "The baby is safe in your heart.",
  "You are my reason to smile.",
  "Our love will live forever.",
  "You are my heart forever.",
  "The baby will be blessed with your love.",
  "You are my endless blessing.",
  "Our little one will always know love."
]


function getQuoteByDate(date = new Date()) {
  const startDate = new Date("2025-09-23"); // first day to start quotes
  const diffDays = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  const index = diffDays % quotes.length; // cycle after 192 days
  return quotes[index];
}

  const mailOptions = {
    from: `"JH 💓" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: "Marakkama tablet podu kannamma 😘😘",
    text: getQuoteByDate(),
  };

  try {
    await transporter.sendMail(mailOptions);

    // Update log
    log[today] = log[today] || {};
    log[today][slot] = true;
    fs.writeFileSync(logFile, JSON.stringify(log));

    res.status(200).json({ message: `Email sent successfully ${slot}!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
