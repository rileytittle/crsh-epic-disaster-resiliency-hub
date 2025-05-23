import { Router } from "express";
import mailgun from "mailgun-js";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { Request, Response } from "express";

dotenv.config();

const router = Router();

const IN_DEVELOPMENT = false;
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

const JWT_SECRET = process.env.SECRET_KEY || "your_jwt_secret";

//Request Password Reset (Generate JWT & Send Email)
router.post(
	"/request-password-reset",
	async (req: Request, res: Response): Promise<any> => {
		const { email } = req.body;

		try {
			const userQuery = await pool.query(
				"SELECT email FROM volunteer WHERE email = $1",
				[email]
			);
			if (userQuery.rowCount === 0) {
				console.log("we are here");
				return res.status(404).json({ error: "User not found" });
			}

			//Generate a JWT (valid for 1 hour)
			const resetToken = jwt.sign({ email }, JWT_SECRET, {
				expiresIn: "1h",
			});

			const resetLink = `${process.env.FRONTEND_DOMAIN}/volunteer/reset-password?token=${resetToken}`;

			//Send email
			const emailData = {
				from: `EPIC <no-reply@${process.env.MAILGUN_DOMAIN as string}>`,
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
	}
);

router.post(
	"/request-password-reset-admin",
	async (req: Request, res: Response): Promise<any> => {
		const { email } = req.body;

		try {
			const userQuery = await pool.query(
				"SELECT email FROM AdminAccount WHERE email = $1",
				[email]
			);
			if (userQuery.rowCount === 0) {
				console.log("we are here");
				return res.status(404).json({ error: "User not found" });
			}

			//Generate a JWT (valid for 1 hour)
			const resetToken = jwt.sign({ email }, JWT_SECRET, {
				expiresIn: "1h",
			});

			const resetLink = `${process.env.FRONTEND_DOMAIN}/admin/reset-password?token=${resetToken}`;

			//Send email
			const emailData = {
				from: `EPIC <no-reply@${process.env.MAILGUN_DOMAIN as string}>`,
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
	}
);

//actually resets the password
router.post(
	"/reset-password",
	async (req: Request, res: Response): Promise<any> => {
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
	}
);

router.post(
	"/reset-password-admin",
	async (req: Request, res: Response): Promise<any> => {
		const { token, newPassword } = req.body;

		try {
			const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
			if (!decoded.email) {
				return res.status(400).json({ error: "Invalid token" });
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);

			await pool.query(
				"UPDATE AdminAccount SET password = $1 WHERE email = $2",
				[hashedPassword, decoded.email]
			);

			res.status(200).json({ message: "Password successfully reset" });
		} catch (error) {
			console.error(error);
			res.status(400).json({ error: "Invalid or expired token" });
		}
	}
);

export { router as mailgunRouter };
