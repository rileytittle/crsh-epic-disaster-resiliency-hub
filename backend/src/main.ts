import express from "express";
import { app as VolunteerRouter } from "./routes/volunteer.route";

let cors = require("cors");
let app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173", // Allow only this origin
	})
);

app.use("/volunteer", VolunteerRouter);

app.listen(3000);
