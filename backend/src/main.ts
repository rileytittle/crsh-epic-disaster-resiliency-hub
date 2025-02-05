import express from "express";


import { app as AdminRouter } from "./routes/admin.route";
import { app as helpRouter } from "./routes/homeowner.route";
import { app as volunteerRouter } from "./routes/Volunteer.route";
import { mailgunRouter } from './routes/mailgun.route';
import * as dotenv from 'dotenv';

// Load custom .env file
dotenv.config();

const port = process.env.PORT || 3000;
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(
	cors({
		origin: process.env.FRONTEND_URL, //https://crsh-epic-disaster-resiliency-hub-client.vercel.app
	})
); 



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
