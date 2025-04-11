import { Router, application } from "express";
import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import { HomeownerRequest } from "../models/homeownerRequest.model";
import { HelpRequest } from "../models/helpRequest.model";
import { Job } from "../models/job.model";
import { VolunteerAuthChecker } from "../utils/volunteerAuth.utils";
import sgMail from "@sendgrid/mail";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
let saltRounds = 10;
require("dotenv").config();
const SECRET_KEY =
	"0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";
const IN_DEVELOPMENT = process.env.IN_DEVELOPMENT;
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
								{
									email: user.email,
									isAdmin: true,
									userType: "admin",
									firstName: user.first_name,
									lastName: user.last_name,
								},
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
		console.log(e);
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
		let password =
			application.rows[0].first_name[0] + application.rows[0].last_name;
		let hashedPassword = await bcrypt.hash(password, saltRounds);
		let result = await pool.query(
			`INSERT INTO volunteer (email, password, assignment, first_name, last_name, phone_number, street_address_1, street_address_2, city, state, zip_code, admin_team, hospitality, logistic_tracking, community_outreach, community_helpers, offered)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, $16, $17)`,
			[
				application.rows[0].email,
				hashedPassword,
				null,
				application.rows[0].first_name,
				application.rows[0].last_name,
				application.rows[0].phone_number,
				application.rows[0].street_address_1,
				application.rows[0].street_address_2,
				application.rows[0].city,
				application.rows[0].state,
				application.rows[0].zip_code,
				application.rows[0].admin_team || false,
				application.rows[0].hospitality || false,
				application.rows[0].logistic_tracking || false,
				application.rows[0].community_outreach || false,
				application.rows[0].community_helpers || false,
				null,
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
});
app.get("/homeowner-requests/assigned-volunteers/:id", async (req, res) => {
	try {
		let result = await pool.query(
			"SELECT * FROM volunteer WHERE assignment = $1",
			[req.params.id]
		);
		res.status(200).send(result.rows);
	} catch (e) {
		res.status(500).send({ message: "There was an error in the server" });
	}
});

app.post("/homeowner-requests/close", async (req, res) => {
	try {
		if (req.body.id) {
			let result = await pool.query(
				"UPDATE request SET status = 'Resolved' WHERE request_id = $1",
				[parseInt(req.body.id)]
			);
			if (result.rowCount) {
				if (result.rowCount > 0) {
					res.status(200).send("Success");
				} else {
					res.status(404).send({
						message: "Could not find record",
						id: req.body.id,
					});
				}
			} else {
				res.status(400).send({
					message: "The query failed to execute",
				});
			}
		} else {
			res.status(400).send({ message: "You must pass id with request" });
		}
	} catch (e) {
		res.status(500).send({ message: "Internal server error" });
	}
});
app.post("/homeowner-requests/accept", async (req, res) => {
	try {
		if (req.body.id) {
			let result = await pool.query(
				"UPDATE request SET status = 'Accepted' WHERE request_id = $1",
				[parseInt(req.body.id)]
			);
			if (result.rowCount) {
				if (result.rowCount > 0) {
					res.status(200).send("Success");
				} else {
					res.status(404).send("Could not find request");
				}
			} else {
				res.status(400).send({
					message: "The query failed to execute",
				});
			}
		}
	} catch (e) {
		res.status(500).send({ message: "Internal server error" });
	}
});
app.get("/assign-volunteer/list", async (req, res) => {
	try {
		// Query the VolunteerAccount table
		const result = await pool.query('SELECT * FROM "volunteer" WHERE "assignment" IS NULL');

		// Map the results to Volunteer instances
		const volunteers = result.rows.map((row) => {
			const areasOfHelp: string[] = [];
			if (row.admin_team) areasOfHelp.push("Admin Team");
			if (row.hospitality) areasOfHelp.push("Hospitality");
			if (row.logistic_tracking) areasOfHelp.push("Logistics");
			if (row.community_outreach) areasOfHelp.push("Community Outreach");
			if (row.community_helpers) areasOfHelp.push("Community Helpers");

			return new Volunteer(
				row.id,
				row.first_name,
				row.last_name,
				row.phone_number,
				row.email,
				row.street_address_1,
				row.street_address_2,
				row.city,
				row.state,
				row.zip_code,
				areasOfHelp,
				row.team_leader,
				row.password
			);
		});

		// Return the array of Volunteer instances
		res.json(volunteers);
	} catch (err) {
		console.error("Error fetching volunteers:", err);
		res.status(500).json({ error: "Failed to fetch volunteers" });
	}
});
app.patch("/volunteers/volunteer-details", async (req, res) => {
	try {
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
		if (result.rowCount) {
			if (result.rowCount > 0) {
				res.status(200).send({
					message: "Successfully updated record",
				});
			} else {
				res.status(404).send({
					message: "Could not find a record to update.",
				});
			}
		} else {
			res.status(500).send({ message: "Internal server error" });
		}
	} catch (e) {
		res.status(500).send({ Area: req.body.selectedArea, error: e });
	}
});
app.post("/assign-volunteer/updateAssignment", async (req, res) => {
	let assignment = req.body.assignment;
	let volunteerIds = req.body.volunteerIds; // Now it's an array of IDs
	console.log(assignment, volunteerIds);

	if (!Array.isArray(volunteerIds) || volunteerIds.length === 0) {
		return res.status(400).send({ message: "No volunteers selected." });
	}

	try {
		// Start a transaction to ensure all updates are done atomically
		const client = await pool.connect();
		try {
			await client.query("BEGIN"); // Begin the transaction

			// Update each volunteer in the array
			for (let volId of volunteerIds) {
				await client.query(
					'UPDATE "volunteer" SET "offered" = $1 WHERE "id" = $2',
					[assignment, volId]
				);
			}
			await client.query(
				"UPDATE request SET status = 'Active' WHERE request_id = $1",
				[assignment]
			);
			await client.query("COMMIT"); // Commit the transaction
			res.status(200).send({ message: "Volunteers Assigned" });
		} catch (error) {
			await client.query("ROLLBACK"); // Rollback the transaction in case of error
			console.error("Error assigning volunteers:", error);
			res.status(500).send({ message: "Failed to assign volunteers." });
		} finally {
			client.release(); // Release the client back to the pool
		}
	} catch (error) {
		console.error("Error with database transaction:", error);
		res.status(500).send({ message: "Database error." });
	}
});
app.post("/homeowner-requests/reject", async (req, res) => {
	try {
		if (req.body.id) {
			let result = await pool.query(
				"UPDATE request SET status = 'Rejected' WHERE request_id = $1",
				[parseInt(req.body.id)]
			);
			if (result.rowCount) {
				if (result.rowCount > 0) {
					res.status(200).send("Success");
				} else {
					res.status(404).send("Could not find request");
				}
			} else {
				res.status(400).send({
					message: "The query failed to execute",
				});
			}
		}
	} catch (e) {
		res.status(500).send({ message: "Internal server error" });
	}
});
app.delete("/volunteers/volunteer-details", async (req, res) => {
	try {
		let areaToChange = "";
		if (req.body.selectedArea === "Hospitality Team") {
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
		if (result.rowCount) {
			if (result.rowCount > 0) {
				res.status(200).send({
					message: "Successfully updated record",
				});
			} else {
				res.status(404).send({
					message: "Could not find a record to update.",
				});
			}
		} else {
			res.status(500).send({ message: "Internal server error" });
		}
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
		if (volunteer.rowCount === 0) {
			return res.status(404).send({ message: "Volunteer not found" });
		}

		const volunteerData = volunteer.rows[0];

		// Assigning each column value to a local constant
		let id = volunteerData.id;
		let firstName = volunteerData.first_name;
		let lastName = volunteerData.last_name;
		let phoneNumber = volunteerData.phone_number;
		let email = volunteerData.email;
		let streetAddress1 = volunteerData.street_address_1;
		let streetAddress2 = volunteerData.street_address_2;
		let city = volunteerData.city;
		let state = volunteerData.state;
		let zipCode = volunteerData.zip_code;
		let areasOfHelp: string[] = [];
		if (volunteerData.admin_team) {
			areasOfHelp.push("Volunteer Management and Administration Team");
		}
		if (volunteerData.hospitality) {
			areasOfHelp.push("Hospitality Team");
		}
		if (volunteerData.logistic_tracking) {
			areasOfHelp.push("Logistic Tracking");
		}
		if (volunteerData.community_outreach) {
			areasOfHelp.push("Community Outreach");
		}
		if (volunteerData.community_helpers) {
			areasOfHelp.push("Community Helpers");
		}
		let teamLeader = volunteerData.team_leader;
		let password = volunteerData.password;

		// Passing the variables into the constructor
		let volunteerDetails = new Volunteer(
			id,
			firstName,
			lastName,
			phoneNumber,
			email,
			streetAddress1,
			streetAddress2,
			city,
			state,
			zipCode,
			areasOfHelp,
			teamLeader,
			password
		);

		res.status(200).send(volunteerDetails);
	} catch (e) {
		res.status(500).send(e);
	}
});
app.get("/homeowner-requests", async (req, res) => {
	try {
		let requests = await pool.query("SELECT * FROM request;");
		let requestList: HelpRequest[] = [];
		for (let request of requests.rows) {
			let id = request.request_id;
			let firstName = request.first_name;
			let lastName = request.last_name;
			let email = request.email;
			let phoneNumber = request.phone_number;
			let streetAddress1 = request.street_address_1;
			let streetAddress2 = request.street_address_2;
			let city = request.city;
			let state = request.state;
			let zipCode = request.zip_code;
			let county = request.county;
			let status = request.status;
			let reasonRejected = request.reason_rejected;
			let helpType: string[] = [];
			if (request.yard_cleanup) {
				helpType.push("Yard cleanup");
			}
			if (request.interior_cleanup) {
				helpType.push("Interior Cleanup");
			}
			if (request.emotional_support) {
				helpType.push("Emotional Support");
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

			let other = request.other;
			let description = request.description;
			let dateCreated = request.date_created;
			let timeCreated = request.time_created;
			let newRequest = new HelpRequest(
				id,
				firstName,
				lastName,
				email,
				phoneNumber,
				streetAddress1,
				streetAddress2,
				city,
				state,
				zipCode,
				county,
				status,
				reasonRejected,
				helpType,
				other,
				description,
				dateCreated,
				timeCreated
			);
			requestList.push(newRequest);
		}
		res.status(200).send(requestList);
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
app.post("/reports", async (req, res) => {
	let queryString = "SELECT * FROM request";
	let queryConditions: string[] = [];
	let year = parseInt(req.body.year);
	let month = parseInt(req.body.month);
	let county = req.body.county;
	let zipCode = parseInt(req.body.zipCode);
	let status = req.body.status;
	let uniqueHomes = req.body.uniqueHomes;
	if (req.body.uniqueHomes && req.body.uniqueHomes == true) {
		queryString =
			"SELECT DISTINCT ON (street_address_1, street_address_2) * FROM request";
	}
	if (req.body.year && req.body.year != "0") {
		queryConditions.push(`EXTRACT(YEAR FROM date_created) = ${year}`);
	}
	if (req.body.month && req.body.month != "0") {
		queryConditions.push(`EXTRACT(MONTH FROM date_created) = ${month}`);
	}
	if (req.body.county && req.body.county != "empty") {
		queryConditions.push(`county = '${county}'`);
	}
	if (req.body.zipCode && req.body.zipCode != "0") {
		queryConditions.push(`zip_code = '${zipCode}'`);
	}
	if (req.body.status && req.body.status != "empty") {
		queryConditions.push(`status = '${status}'`);
	}
	if (queryConditions.length > 0) {
		queryString += " WHERE " + queryConditions.join(" AND ");
	}
	console.log(queryString);
	let queryResult = await pool.query(queryString);
	let queryRows = queryResult.rows;
	// console.log(queryRows);
	if (queryRows.length > 0) {
		// Create a new workbook and worksheet
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Report");

		// console.log(queryRows);

		// Add column headers
		worksheet.columns = [
			{ header: "ID", key: "request_id", width: 10 },
			{ header: "First Name", key: "first_name", width: 20 },
			{ header: "Last Name", key: "last_name", width: 20 },
			{ header: "Phone Number", key: "phone_number", width: 15 },
			{ header: "email", key: "email", width: 20 },
			{ header: "Street Address 1", key: "street_address_1", width: 30 },
			{ header: "Street Address 2", key: "street_address_2", width: 30 },
			{ header: "City", key: "city", width: 20 },
			{ header: "County", key: "county", width: 15 },
			{ header: "Zip Code", key: "zip_code", width: 10 },
			{ header: "Yard Cleanup", key: "yard_cleanup", width: 15 },
			{ header: "Interior Cleanup", key: "interior_cleanup", width: 15 },
			{
				header: "Emotional Support",
				key: "emotional_support",
				width: 20,
			},
			{
				header: "Cleaning Supplies",
				key: "cleaning_supplies",
				width: 20,
			},
			{ header: "Clean Water", key: "clean_water", width: 15 },
			{ header: "Emergency Food", key: "emergency_food", width: 15 },
			{ header: "Other", key: "other", width: 30 },
			{ header: "Date Created", key: "date_created", width: 15 },
			{ header: "Time Created", key: "time_created", width: 20 },
			{ header: "Status", key: "status", width: 10 },
			{ header: "Reason Rejected", key: "reason_rejected", width: 30 },
		];

		// Add rows
		for (let row of queryRows) {
			worksheet.addRow({
				request_id: row.request_id,
				first_name: row.first_name,
				last_name: row.last_name,
				phone_number: row.phone_number,
				email: row.email,
				street_address_1: row.street_address_1,
				street_address_2: row.street_address_2,
				city: row.city,
				county: row.county,
				zip_code: row.zip_code,
				yard_cleanup: row.yard_cleanup,
				interior_cleanup: row.interior_cleanup,
				emotional_support: row.emotional_support,
				cleaning_supplies: row.cleaning_supplies,
				clean_water: row.clean_water,
				emergency_food: row.emergency_food,
				other: row.other,
				date_created: row.date_created.toISOString().split("T")[0], // Format year as a date string (YYYY-MM-DD)
				time_created: row.time_created,
				status: row.status,
				reason_rejected: row.reason_rejected,
			});
		}

		// Set the response headers for file download
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=example.xlsx"
		);

		// Write the workbook to the response object (this sends the file directly to the client)
		await workbook.xlsx.write(res);
		res.end(); // Make sure to end the response
	} else {
		res.status(400).send({ message: "No records found" });
	}
});
export { app };
