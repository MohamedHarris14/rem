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
  
const quotes = [
  "You are my partner in love and in life.",
  "Pregnancy makes you shine brighter every day.",
  "The baby will always carry your love.",
  "You are stronger than you think.",
  "Our family is growing with love.",
  "You are the most beautiful woman in the world.",
  "The baby is blessed to have you as a mother.",
  "You are loved beyond words.",
  "Our future is brighter with you in it.",
  "You are my everything.",
  "The baby will know nothing but love.",
  "You are radiant with beauty.",
  "Our love is eternal.",
  "You are the miracle of my life.",
  "The baby will always feel your warmth.",
  "You are my heart and soul.",
  "Our little one is lucky to have you.",
  "You are my forever love.",
  "The baby feels your love in every moment.",
  "You are my inspiration every day.",
  "Our family is stronger because of you.",
  "You are beautiful inside and out.",
  "The baby will inherit your kindness.",
  "You are my blessing.",
  "Our love story is endless.",
  "You are my angel.",
  "The baby will grow in love.",
  "You are the most amazing woman I know.",
  "Our journey is magical because of you.",
  "You are my dream come true.",
  "The baby feels your heartbeat of love.",
  "You are the light of my life.",
  "Our love is the foundation of this miracle.",
  "You are my soulmate and best friend.",
  "The baby is nurtured by your love.",
  "You are my partner in this beautiful journey.",
  "Our family is complete with you.",
  "You are my safe place.",
  "The baby is surrounded by your love.",
  "You are my greatest treasure.",
  "Our love is infinite.",
  "You are my everything and more.",
  "The baby will grow with your strength.",
  "You are the sunshine of my life.",
  "Our baby is a symbol of our love.",
  "You are my heart’s desire.",
  "The baby will always know your care.",
  "You are my love, today and always.",
  "Our little one is a blessing because of you.",
  "You are the queen of my life.",
  "The baby feels safe with you.",
  "You are my world.",
  "Our love is unshakable.",
  "You are my forever happiness.",
  "The baby will be proud to call you mom.",
  "You are my miracle.",
  "Our family is built on your love.",
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
