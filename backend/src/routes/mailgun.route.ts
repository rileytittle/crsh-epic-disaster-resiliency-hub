import { Router } from "express";
import mailgun from "mailgun-js";
import * as dotenv from 'dotenv';

// Test route to verify that it is being loaded
console.log("Mailgun routes are being set up");

// Load custom .env file
dotenv.config();

if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  throw new Error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not set in the environment variables.");
}

const router = Router();

// Mailgun setup
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

router.get("/test", (req, res) => {
    res.status(200).send("Mailgun route is working correctly!");
  });

// Define the email endpoint
router.post("/send-email", (req, res) => {
    console.log("we are here");
    console.log("Headers:", req.headers); // Log headers for debugging
    console.log("Body:", req.body); // Log body for debugging

    const { to, subject, text } = req.body;

    

    const data = {
        from: "Corey <mailgun@sandbox0899d39dee96409cb71929568a4022bd.mailgun.org>",
        to,
        subject,
        text,
    };

    mg.messages().send(data, (error: any, body: any) => {
        if (error) {
          console.error("Mailgun Error:", error); // Log detailed Mailgun error
          return res.status(500).json({ error: error.message });
        }
        console.log("Mailgun Response:", body); // Log Mailgun's response for debugging
        res.status(200).json({ message: "Email sent successfully", body });
      });
      
});

export { router as mailgunRouter };