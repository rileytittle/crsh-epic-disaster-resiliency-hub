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
const corsOptions = {
	origin: "https://crsh-epic-disaster-resiliency-hub-client.vercel.app", // Allow only your frontend domain (or use '*' for all origins, but this is not recommended in production)
	methods: ["GET", "POST", "OPTIONS"], // Allow the OPTIONS method for preflight requests
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"Accept",
		"X-Requested-With",
		"Content-Disposition", // Allow custom headers like Content-Disposition for file downloads
	],
	preflightContinue: false, // Don't let the CORS middleware handle OPTIONS requests automatically
	optionsSuccessStatus: 200, // For older browsers like IE11
};

app.use(cors(corsOptions));

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
