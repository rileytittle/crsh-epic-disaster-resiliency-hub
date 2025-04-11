import express from "express";

import { app as AdminRouter } from "./routes/admin.route";
import { app as helpRouter } from "./routes/homeowner.route";
import { app as volunteerRouter } from "./routes/Volunteer.route";
import { mailgunRouter as mailgunRouter } from "./routes/mailgun.route";

import { AdminAuthChecker } from "./utils/adminAuth.utils";
import { VolunteerAuthChecker } from "./utils/volunteerAuth.utils";
import * as dotenv from "dotenv";

// Load custom .env file
dotenv.config();

const port = process.env.PORT || 3000;
let cors = require("cors");
let app = express();
const IN_DEVELOPMENT = process.env.IN_DEVELOPMENT;
let vercelURL = "https://crsh-epic-disaster-resiliency-hub-client.vercel.app";
let localURL = "http://localhost:5173";

app.use(express.json());

if (IN_DEVELOPMENT) {
	app.use(
		cors({
			origin: localURL,
		})
	);
} else {
	app.use(
		cors({
			origin: vercelURL,
		})
	);
}

app.get("/", (req, res) => {
	try {
		//write some logic here
		res.status(200).send("Your app deployed!");
	} catch (e) {
		res.status(500).send(e);
	}
});

app.use("/admin", AdminRouter);
app.use("/homeowner", helpRouter);
app.use("/volunteer", volunteerRouter);
app.use("/mailgun", mailgunRouter);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export default app;
