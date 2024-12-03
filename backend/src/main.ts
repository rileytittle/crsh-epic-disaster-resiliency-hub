import express from "express";
import { app as AdminRouter } from "./Routes/admin.route";
import { app as helpRouter } from "./Routes/homeowner.route";
import {app as volunteerRouter} from "./Routes/Volunteer.route";


let cors = require("cors");
let app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173", // Allow only this origin
	})
);

app.use("/admin", AdminRouter);
app.use("/homeowner", helpRouter);
app.use("/volunteer", volunteerRouter);

app.listen(3000);
