import express from "express";
import { app as AdminRouter } from "./routes/admin.route";
import { app as helpRouter } from "./routes/homeowner.route";
import { app as volunteerRouter } from "./routes/Volunteer.route";

let cors = require("cors");
let app = express();
app.use(express.json());

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

app.listen(3000);
