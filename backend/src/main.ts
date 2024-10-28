import express from "express";
import volunteerRoutes from "./Routes/Volunteer.route";

let cors = require("cors");
let app = express();
app.use(express.json());

app.use(
	cors({
		origin: "http://localhost:5173", // Allow only this origin
	})
);

app.use("/Volunteer", volunteerRoutes);

app.get("/", (req, res) => {
    res.send("Hello mom!");
});


app.listen(3000);
