import { Router, application } from "express";
import { HomeownerApplication } from "../models/homeownerApplication.model";
import { Authchecker } from "../utils/auth.utils";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Load custom .env file
dotenv.config();
const IN_DEVELOPMENT = true;
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
let app = Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
	res.send("Homeowner Assistance Backend");
});
let requests: HomeownerApplication[] = [];
requests.push(
	new HomeownerApplication(
		999,
		"Hayden",
		"O'Neill",
		"haydeno221@outlook.com",
		9045555555,
		"9274 Real Street",
		"",
		"Jacksonville",
		"florida",
		"Sarasota",
		43325,
		true,
		false,
		true,
		false,
		true,
		false,
		""
	)
); //

app.get("/viewRequests", (req, res) => {
	if (requests.length > 0) {
		res.status(200).json(requests);
	} else {
		res.status(404).json({ message: "No requests found." });
	}
});

app.post("/requestHelp", async (req, res) => {
	console.log(req.body);

	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const email = req.body.email;
	const phone_number = req.body.phone_number;
	const street_address_1 = req.body.street_address_1;
	const street_address_2 = req.body.street_address_2;
	const city = req.body.city;
	const state = req.body.state;
	const zip_code = req.body.zip_code;
	const county = req.body.county;
	const yard_cleanup = req.body.helpExterior;
	const interior_cleanup = req.body.helpInterior;
	const emotional_support = req.body.helpEmotional;
	const cleaning_supplies = req.body.helpSupplies;
	const clean_water = req.body.helpWater;
	const emergency_food = req.body.helpFood;
	const other = req.body.other;
	const description = req.body.description;

	// console.log("yard_cleanup:", req.body.yard_cleanup);
	// console.log("interior_cleanup:", req.body.interior_cleanup);
	// // send data to the database test
	// console.log(`first_name: ${first_name}`);
	// console.log(`last_name: ${last_name}`);
	// console.log(`email: ${email}`);
	// console.log(`phone_number: ${phone_number}`);
	// console.log(`street_address_1: ${street_address_1}`);
	// console.log(`street_address_2: ${street_address_2}`);
	// console.log(`city: ${city}`);
	// console.log(`state: ${state}`);
	// console.log(`zip_code: ${zip_code}`);
	// console.log(`yard_cleanup: ${yard_cleanup}`);
	// console.log(`interior_cleanup: ${interior_cleanup}`);
	// console.log(`emotional_support: ${emotional_support}`);
	// console.log(`cleaning_supplies: ${cleaning_supplies}`);
	// console.log(`clean_water: ${clean_water}`);
	// console.log(`emergency_food: ${emergency_food}`);
	// console.log(`other: ${other}`);

	try {
		const currentDate = new Date().toISOString().split("T")[0];
		console.log(currentDate); // Example: "2025-03-28"
		const now = new Date();
		const currentTime = now.toTimeString().split(" ")[0]; // Removes timezone and milliseconds
		console.log(currentTime); // Example: "14:35:45"

		let result = pool.query(
			`INSERT INTO request (first_name, last_name, email, phone_number, street_address_1, street_address_2, city, state, zip_code, county, status, reason_rejected, yard_cleanup, interior_cleanup, emotional_support, cleaning_supplies, clean_water, emergency_food, other, description, date_created, time_created)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
			[
				first_name,
				last_name,
				email,
				phone_number,
				street_address_1,
				street_address_2,
				city,
				state,
				zip_code,
				county,
				"Pending",
				null,
				yard_cleanup,
				interior_cleanup,
				emotional_support,
				cleaning_supplies,
				clean_water,
				emergency_food,
				other,
				description,
				currentDate,
				currentTime,
			]
		);
		res.status(200).send({ message: "Request succcessfully Submitted" });
	} catch (e) {
		res.status(500).send({ message: "Something went wrong" });
		console.log(e);
	}
	// Add the new volunteer to the list
});

app.get("/requestHelp", (req, res) => {
	res.send("Here is your Help!");
});

/*
app.post("/update-assignment", (req, res) => {
  const { requestName, volunteers } = req.body;

  // Find the request by ID (assuming requestId corresponds to the index in requests array)
  const request = requests.find((req) => req.first_name + req.last_name === requestName); // Adjust if request does not have an id property

  if (request) {
    request.assignedVolunteers.push(volunteers); // Update the assigned volunteers
    console.log(JSON.stringify(request));
    res.status(200).json({ message: 'Volunteers assigned successfully!' });
  } else {
    res.status(404).json({ message: 'Request not found.' });
  }
});
*/
export { app };
