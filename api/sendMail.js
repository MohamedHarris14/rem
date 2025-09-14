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
  const nows = new Date();

let hours = nows.getHours(); // 0-23
const minutes = nows.getMinutes(); // 0-59
const ampm = hours >= 12 ? 'PM' : 'AM';

hours = hours % 12; // convert 0-23 to 0-11
hours = hours ? hours : 12; // convert 0 to 12

const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;


  const mailOptions = {
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: "Tablet podunga anbey",
    text: `It's ${formattedTime}! tablet 💊 pottutiya pondatti 😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘😘.`,
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
