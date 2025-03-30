import { Router } from "express";
import mailgun from "mailgun-js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

dotenv.config();

const router = Router();

const IN_DEVELOPMENT = true;
let pool: Pool;

if (IN_DEVELOPMENT) {
	pool = new Pool({
		user: "postgres",
		host: "localhost",
		database: "Senior-Project",
		password: "garnetisGold!1820",
		port: 5432,
	});
} else {
	pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	});
}

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY as string,
	domain: process.env.MAILGUN_DOMAIN as string,
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Change this in production!

//Request Password Reset (Generate JWT & Send Email)
router.post("/request-password-reset", async (req, res) => {
	const { email } = req.body;

	try {
		//Check if user exists
		const userQuery = await pool.query(
			"SELECT email FROM volunteer WHERE email = $1",
			[email]
		);
		if (userQuery.rowCount === 0) {
			console.log("we are here");
			return res.status(404).json({ error: "User not found" });
		}

		//Generate a JWT (valid for 1 hour)
		const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

		//Create reset link
		const resetLink = `http://localhost:5173/volunteer/reset-password?token=${resetToken}`;

		//Send email
		const emailData = {
			from: "EPIC <no-reply@mg.epic-disaster-relief.com>",
			to: email,
			subject: "Password Reset Request",
			text: `Click the link to reset your password: ${resetLink}`,
		};

		mg.messages().send(emailData, (error, body) => {
			if (error) {
				console.error("Mailgun Error:", error);
				return res
					.status(500)
					.json({ error: "Failed to send reset email" });
			}
			res.status(200).json({ message: "Password reset email sent" });
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({ error: error });
	}
});

//actually resets the password
router.post("/reset-password", async (req, res) => {
	const { token, newPassword } = req.body;

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
		if (!decoded.email) {
			return res.status(400).json({ error: "Invalid token" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await pool.query(
			"UPDATE volunteer SET password = $1 WHERE email = $2",
			[hashedPassword, decoded.email]
		);

		res.status(200).json({ message: "Password successfully reset" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ error: "Invalid or expired token" });
	}
});

export { router as mailgunRouter };
