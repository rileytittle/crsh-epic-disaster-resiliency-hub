import { Router, application } from "express";
import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import { HomeownerRequest } from "../models/homeownerRequest.model";
import { Job } from "../models/job.model";
import { Authchecker } from "../utils/auth.utils";
import sgMail from "@sendgrid/mail";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
let saltRounds = 10;
const SECRET_KEY =
	"0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});
let app = Router();
//enter your api key below
// let emailAPIKey = "";
// sgMail.setApiKey(emailAPIKey);

//Dummy data below
//*******************************

let jobs: Job[] = [];
let requests: HomeownerRequest[] = [
	{
		id: 1,
		firstName: "Riley",
		lastName: "Tittle",
		email: "fakeemail@email.com",
		address: "1234 Main Street",
		city: "Jacksonville",
		state: "FL",
		zip: 32256,
		helpType: ["Yard cleanup"],
		evaluation: undefined,
	},
];
let volunteerApplications: VolunteerApplication[] = [];
// let firstApplication = new VolunteerApplication(
// 	0,
// 	"Riley",
// 	"Tittle",
// 	9047352653,
// 	"rileytittle02@gmail.com",
// 	"7816 Southside Blvd",
// 	"Jacksonville",
// 	"FL",
// 	32256,
// 	["Logistic Tracking Team"]
// );
// let secondApplication = new VolunteerApplication(
// 	1,
// 	"Coleman",
// 	"George",
// 	9047352653,
// 	"fake@email.com",
// 	"7816 Southside Blvd",
// 	"Jacksonville",
// 	"FL",
// 	32256,
// 	["Logistic Tracking Team", "Community Outreach Team"]
// );
// volunteerApplications.push(firstApplication);
// volunteerApplications.push(secondApplication);

let volunteers: Volunteer[] = [];

//*******************************
app.post("/create-account", async (req, res) => {
	try {
		//write some logic here
		let queryResult = await pool.query(
			"SELECT * FROM AdminAccount WHERE email = $1",
			[req.body.email]
		);
		if (queryResult.rows.length == 0) {
		} else {
			res.status(400).send({ message: "Email already in use" });
		}
		res.status(200).send("Success");
	} catch (e) {
		res.status(500).send(e);
	}
});
app.post("/login", async (req, res) => {
	try {
		//write some logic here
		if (req.headers["authorization"]) {
			let userInfo = req.headers["authorization"].split(" ")[1]; //Base 64 Encoded
			let decodedUserInfo = atob(userInfo);
			let email = decodedUserInfo.split(":")[0];
			let password = decodedUserInfo.split(":")[1];
			console.log(email, password, decodedUserInfo, userInfo);
			let queryResult = await pool.query(
				"SELECT * FROM AdminAccount WHERE email = $1",
				[email]
			);
			if (queryResult.rows.length > 0) {
				let user = queryResult.rows[0];
				console.log(user.password);
				bcrypt.compare(
					password,
					user.password.trim(),
					(err, result) => {
						console.log({
							password,
							storedHash: user.password.trim(),
							err,
							result,
						});
						if (result) {
							let token = jwt.sign(
								{ email: user.email, isAdmin: true },
								SECRET_KEY
							);
							res.status(200).send({ token: token });
						} else {
							res.status(401).send({
								status: 401,
								message: "Incorrect password",
							});
						}
					}
				);
			} else {
				res.status(401).send({
					message: "No account with that email found",
				});
			}
		} else {
			res.status(401).send({ message: "missing required login details" });
		}
	} catch (e) {
		res.status(500).send(e);
	}
});
app.post("/create-volunteer/accept", async (req, res) => {
	//get areas of help and team lead variables from body
	//create volunteer object and give it these variables
	try {
		let application = await pool.query(
			"SELECT * FROM volunteerapplications WHERE id = $1",
			[req.body.id]
		);
		let result = pool.query(
			`INSERT INTO volunteer (email, password, assignment, first_name, last_name, phone_number, street_address, city, state, zip_code, admin_team, hospitality, logistic_tracking, community_outreach, community_helpers)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
			[
				application.rows[0].email,
				application.rows[0].first_name[0] +
					application.rows[0].last_name,
				null,
				application.rows[0].first_name,
				application.rows[0].last_name,
				application.rows[0].phone_number,
				application.rows[0].street_address,
				application.rows[0].city,
				application.rows[0].state,
				application.rows[0].zip_code,
				application.rows[0].admin_team || false,
				application.rows[0].hospitality || false,
				application.rows[0].logistic_tracking || false,
				application.rows[0].community_outreach || false,
				application.rows[0].community_helpers || false,
			]
		);
		let result2 = await pool.query(
			"DELETE from volunteerapplications WHERE id = $1",
			[req.body.id]
		);
		res.status(201).send("Volunteer created!");
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post("/create-volunteer/reject", async (req, res) => {
	try {
		let result = await pool.query(
			"UPDATE volunteerapplications SET status = 'rejected' WHERE email = $1",
			[req.body.email]
		);
		res.status(200).send("Applicant rejected");
	} catch (e) {
		res.status(400).send("Problem rejected application");
	}
});

app.get("/create-volunteer/applications", async (req, res) => {
	try {
		let result = await pool.query(
			"SELECT * FROM volunteerapplications WHERE status != 'rejected'"
		);
		res.status(200).send(result.rows);
	} catch (e) {
		res.status(400).send("Something went wrong");
	}
	res.status(200).send();
});

app.post("/homeowner-requests/accept", (req, res) => {
	try {
		//write some logic here
		let foundRequest: HomeownerRequest | undefined = undefined;
		if (req.body.id) {
			for (let request of requests) {
				if (request.id == parseInt(req.body.id)) {
					foundRequest = request;
					break;
				}
			}
			if (foundRequest) {
				let newJob = new Job(
					foundRequest.id,
					foundRequest.firstName,
					foundRequest.lastName,
					foundRequest.email,
					foundRequest.address,
					foundRequest.city,
					foundRequest.state,
					foundRequest.zip,
					foundRequest.helpType,
					"Test Team"
				);
				foundRequest.evaluation = "accepted";
				jobs.push(newJob);
				res.status(200).send("Success");
			} else {
				res.status(404).send("Could not find request");
			}
		}
	} catch (e) {
		res.send("bad");
	}
});
app.post("/assign-volunteer/list", async (req, res) => {
	const { team } = req.body;

	let filteredVolunteers = await pool.query(
		`SELECT id, first_name, last_name, email, phone_number FROM "volunteer" WHERE "${team}" = TRUE`
	);

	res.status(200).json({
		volunteers: filteredVolunteers.rows.map((volunteer) => ({
			id: volunteer.id,
			first_name: volunteer.first_name,
			last_name: volunteer.last_name,
			email: volunteer.email,
			phone_number: volunteer.phone_number,
		})),
		message: filteredVolunteers.rowCount
			? `${filteredVolunteers.rowCount} volunteer(s) found for the ${team} team.`
			: "No volunteers found for this team.",
	});
});
app.patch("/volunteers/volunteer-details", async (req, res) => {
	try {
		// Ensure `areaToChange` is a valid column name.
		if (
			![
				"hospitality",
				"community_helpers",
				"community_outreach",
				"admin_team",
				"logistic_tracking",
			].includes(req.body.selectedArea)
		) {
			res.status(400).send({ error: "Invalid area name" });
		}

		// Update the volunteer record
		const updateQuery = `UPDATE volunteer SET ${req.body.selectedArea} = true WHERE id = $1`;
		let result = await pool.query(updateQuery, [parseInt(req.body.id)]);
		let result2 = await pool.query(
			"SELECT * FROM volunteer WHERE id = $1",
			[parseInt(req.body.id)]
		);
		res.status(200).send(result2.rows[0]);
	} catch (e) {
		res.status(500).send({ Area: req.body.selectedArea, error: e });
	}
});
app.post("/assign-volunteer/updateAssignment", async (req, res) => {
	let assignment = req.body.assignment;
	let volId = req.body.id;
	console.log(assignment, volId);
	try {
		await pool.query(
			'UPDATE "volunteer" SET "offered" = $1 WHERE "id" = $2',
			[assignment, volId]
		);
		res.status(200).send({ message: "Volunteer Assigned" });
	} catch (e) {
		res.status(500).send(e);
	}
});
app.post("/homeowner-requests/reject", (req, res) => {
	try {
		let foundRequest: HomeownerRequest | undefined = undefined;
		if (req.body.id) {
			for (let request of requests) {
				if (request.id == parseInt(req.body.id)) {
					foundRequest = request;
					break;
				}
			}
			if (foundRequest) {
				foundRequest.evaluation = "rejected";
			} else {
				res.status(404).send("Could not find request");
			}
		} else {
			res.status(400).send("Must supply id");
		}
		res.status(200).send("Success");
	} catch (e) {
		res.send("Bad");
	}
});

app.delete("/volunteers/volunteer-details", async (req, res) => {
	try {
		let areaToChange = "";
		if (req.body.selectedArea === "Hospitality") {
			areaToChange = "hospitality";
		} else if (req.body.selectedArea === "Community Helpers") {
			areaToChange = "community_helpers";
		} else if (req.body.selectedArea === "Community Outreach") {
			areaToChange = "community_outreach";
		} else if (
			req.body.selectedArea ===
			"Volunteer Management and Administration Team"
		) {
			areaToChange = "admin_team";
		} else if (req.body.selectedArea === "Logistic Tracking") {
			areaToChange = "logistic_tracking";
		}

		// Ensure `areaToChange` is a valid column name.
		if (
			![
				"hospitality",
				"community_helpers",
				"community_outreach",
				"admin_team",
				"logistic_tracking",
			].includes(areaToChange)
		) {
			res.status(400).send({ error: "Invalid area name" });
		}

		// Update the volunteer record
		const updateQuery = `UPDATE volunteer SET ${areaToChange} = false WHERE id = $1`;
		let result = await pool.query(updateQuery, [parseInt(req.body.id)]);
		let result2 = await pool.query(
			"SELECT * FROM volunteer WHERE id = $1",
			[parseInt(req.body.id)]
		);
		res.status(200).send(result2.rows[0]);
	} catch (e) {
		res.status(500).send({ Area: req.body.selectedArea, error: e });
	}
});
app.get("/volunteers/volunteer-details/:id", async (req, res) => {
	try {
		let volunteer = await pool.query(
			"SELECT * FROM volunteer WHERE id = $1",
			[parseInt(req.params.id)]
		);
		res.status(200).send(volunteer.rows[0]);
	} catch (e) {
		res.status(500).send(e);
	}
});

app.get("/homeowner-requests", async (req, res) => {
	try {
		let requests = await pool.query(
			"SELECT request_id, first_name, last_name, email, street_address_1, city, state, zip_code, status FROM request;"
		);
		res.status(200).send(requests.rows);
	} catch (e) {
		res.send(e);
	}
});

app.get("/volunteers", async (req, res) => {
	try {
		let volunteers = await pool.query("SELECT * FROM volunteer");
		res.status(200).send(volunteers.rows);
	} catch (e) {
		res.status(500).send(e);
	}
});
app.get("/reports", async (req, res) => {
	let queryString = "SELECT * FROM requests";
	if (req.body.year) {
		queryString = queryString + " WHERE year = " + parseInt(req.body.year);
	}
	let queryResult = await pool.query(queryString);
	let queryRows = queryResult.rows;
	// Create a new workbook and worksheet
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Report");

	console.log(queryRows);
	// Add column headers
	worksheet.columns = [
		{ header: "ID", key: "id", width: 10 },
		{ header: "Name", key: "name", width: 30 },
		{ header: "Age", key: "age", width: 10 },
	];

	// Add some rows
	worksheet.addRow({ id: 1, name: "John Doe", age: 30 });
	worksheet.addRow({ id: 2, name: "Jane Smith", age: 25 });

	// Set the response headers for file download
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");

	// Write the workbook to the response object (this sends the file directly to the client)
	await workbook.xlsx.write(res);
	res.end(); // Make sure to end the response
});
export { app };
