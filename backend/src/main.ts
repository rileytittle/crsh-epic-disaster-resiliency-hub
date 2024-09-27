import express from "express";
import { app as AdminRouter } from "./routes/admin.route";

let cors = require("cors");
let app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173", // Allow only this origin
	})
);

app.use("/admin", AdminRouter);

app.listen(3000);
