import { Router, application } from "express";

import { HelpRequest } from "../models/helpRequest.model";
import { HomeownerStatus } from "../models/homeownerStatus.model";

import { HomeownerApplication } from "../models/homeownerApplication.model";
import { VolunteerAuthChecker } from "../utils/volunteerAuth.utils";
import { sendEmail } from "../utils/mailService";
import { AdminAuthChecker } from "../utils/adminAuth.utils";

import { Pool } from "pg";
import { Job } from "../models/job.model";
import * as dotenv from "dotenv";
// Load custom .env file
dotenv.config();
const IN_DEVELOPMENT = false;

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

let HomeownerApplications: HelpRequest[] = []; // database

app.get("/", (req, res) => {
	res.send("Homeowner Assistance Backend");
});

app.get("/viewRequests", AdminAuthChecker, async (req, res) => {
	let sendRequests: HelpRequest[] = [];
	try {
		// Query to get rows with the "Active" status
		const result = await pool.query(
			"SELECT * FROM request WHERE status IN ($1, $2);",
			["Accepted", "Active"]
		);

		// Define the columns with boolean values representing help types
		const helpTypeColumns = [
			"emotional_support",
			"cleaning_supplies",
			"clean_water",
			"emergency_food",
			"yard_cleanup",
			"interior_cleanup",
		];

		// Map the result rows to an array of Job objects
		result.rows.forEach((row) => {
			const helpType: string[] = [];

			helpTypeColumns.forEach((column) => {
				if (row[column]) {
					const label = column
						.replace(/_/g, " ") // Replace underscores with spaces
						.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

					helpType.push(label);
				}
			});

			const newJob = new HelpRequest(
				row.request_id,
				row.first_name,
				row.last_name,
				row.email,
				row.phone_number,
				row.street_address_1,
				row.street_address_2,
				row.city,
				row.state,
				row.zip_code,
				row.county,
				row.status,
				row.reason_rejected,
				helpType,
				row.other,
				row.description,
				row.date_created,
				row.time_created,
				row.notes
			);
			sendRequests.push(newJob);
		});

		if (sendRequests.length > 0) {
			res.status(200).json(sendRequests);
		} else {
			res.status(404).json({ message: "No requests found." });
		}
	} catch (e) {
		console.error("Error querying database", e);
		res.status(500).json({ message: "Internal Server Error" });
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
		//console.log(currentDate); // Example: "2025-03-28"
		const now = new Date();
		const currentTime = now.toTimeString().split(" ")[0]; // Removes timezone and milliseconds
		//console.log(currentTime); // Example: "14:35:45"

		let result = await pool.query(
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
				"Unevaluated",
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
		if (result.rowCount) {
			if (result.rowCount > 0) {
				//adding mailgun email to success branch
				await sendEmail(
					email,
					"Your Help Request Has Been Submitted",
					"This is a confirmation that your request for Epic community helpers has been successfully submitted. We will review your request and reach back out to you shortly!"
				);

				res.status(200).send({
					message: "Request succcessfully Submitted",
				});
			} else {
				res.status(400).send({ message: "No rows affected" });
			}
		} else {
			res.status(400).send({ message: "Error adding request" });
		}
	} catch (e) {
		res.status(500).send({
			success: false,
			message: "Something went wrong",
		});
		console.log(e);
	}
	// Add the new volunteer to the list
});

app.get("/requestHelp/status", async (req, res) => {
	let { first_name, last_name, street_address_1, street_address_2 } =
		req.query;
	if (street_address_2 == "NULL") {
		street_address_2 = "";
	}
	try {
		let requests = await pool.query(`
			SELECT status, reason_rejected, yard_cleanup, interior_cleanup, emotional_support, cleaning_supplies, clean_water, emergency_food, other, description, date_created, time_created
			FROM request
			WHERE first_name ILIKE '${first_name}' AND last_name ILIKE '${last_name}' AND street_address_1 ILIKE '${street_address_1}' AND street_address_2 ILIKE '${street_address_2}'
			ORDER BY date_created DESC, time_created DESC;
		`);

		if (requests.rows.length === 0) {
			return res.status(404).json({ message: "No results found. Please double check your spelling" }); // Return 404 if no rows are found
		}

		let request = requests.rows[0];
		//console.log(request);
		let status = request.status;
		let reasonRejected = request.reason_rejected;
		let helpType: string[] = [];
		if (request.yard_cleanup) {
			helpType.push("Yard cleanup");
		}
		if (request.interior_cleanup) {
			helpType.push("Interior cleanup");
		}
		if (request.emotional_support) {
			helpType.push("Emotional support");
		}
		if (request.cleaning_supplies) {
			helpType.push("Cleaning supplies");
		}
		if (request.clean_water) {
			helpType.push("Clean water");
		}
		if (request.emergency_food) {
			helpType.push("Emergency food");
		}
		if (request.other != "") {
			helpType.push(request.other);
		}
		let description = request.description;
		let dateCreated = request.date_created;
		let timeCreated = request.time_created;

		let statusInformation = new HomeownerStatus(
			status,
			reasonRejected,
			helpType,
			description,
			dateCreated,
			timeCreated
		);

		res.status(200).send(statusInformation);
	} catch (e) {
		res.status(500).send({ message: "Something went wrong" });
		console.log(e);
	}
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
