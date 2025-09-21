import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const logFile = path.resolve("./lastSent.txt");

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
  
function duedate(){
    // Target date: 3rd April 2026
const targetDate = new Date("2026-04-03");

// Current date
const today = new Date();

// Calculate difference in milliseconds
const diffTime = targetDate.getTime() - today.getTime();

// Convert to days (1000ms * 60s * 60m * 24h)
const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// Display reminder
if (remainingDays > 0) {
  return `⏳ ${remainingDays} days left until 3rd April 2026 🎊`;
} else if (remainingDays === 0) {
  return "🎉 Today is 3rd April 2026!";
} else {
  return `✅ 3rd April 2026 was ${Math.abs(remainingDays)} days ago 🎊`;
}
}
  const mailOptions = {
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: duedate(),
    text: "Morning tablet podu kannamma 😘😘",
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
