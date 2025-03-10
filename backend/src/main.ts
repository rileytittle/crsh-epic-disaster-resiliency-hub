import express from "express";
import { app as AdminRouter } from "./routes/admin.route";
import { app as helpRouter } from "./routes/homeowner.route";
import { app as volunteerRouter } from "./routes/Volunteer.route";
const port = process.env.PORT || 3000;
let cors = require("cors");
let app = express();

let vercelURL = "https://crsh-epic-disaster-resiliency-hub-client.vercel.app";
let localURL = "http://localhost:5173";

app.use(express.json());
app.use(
	cors({
		origin: "https://crsh-epic-disaster-resiliency-hub-client.vercel.app",
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

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

export default app;
