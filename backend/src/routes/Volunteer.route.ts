import { Router } from "express";

import { VolunteerApplication } from "../models/volunteerApplication.model";

import { VolunteerApplicationStatus } from "../models/volunteerApplicationStatus.model";
import { Volunteer } from "../models/volunteer.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { Job } from "../models/job.model";
import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import { sendEmail } from "../utils/mailService";
import { VolunteerAuthChecker } from "../utils/volunteerAuth.utils";

require("dotenv").config();

const IN_DEVELOPMENT = false;
let pool: Pool;
/**user: "postgres",
		host: "localhost",
		database: "Senior-Project",
		password: "garnetisGold!1820",
		port: 5432, */

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

const SECRET_KEY = process.env.SECRET_KEY || "unsecured";

let app = Router();

/*************************************************DUMMMY DATA*********************************************************/
let volunteerApplications: VolunteerApplication[] = []; // Temporary storage of applications

let dummyVolunteers: Volunteer[] = [
	new Volunteer(
		0,
		"Riley",
		"Tittle",
		9047352653,
		"rileytittle02@gmail.com",
		"7816 Southside Blvd",
		"",
		"Jacksonville",
		"FL",
		32256,
		["Logistic Tracking"],
		false,
		"password"
	),
	new Volunteer(
		1,
		"Coleman",
		"George",
		9047352653,
		"fake@email.com",
		"7816 Southside Blvd",
		"",
		"Jacksonville",
		"FL",
		32256,
		["Logistic Tracking", "Community Outreach"],
		false,
		"differentPassword"
	),
];
let dummyApplications: VolunteerApplication[] = [
	new VolunteerApplication(
		1,
		"Riley",
		"Tittle",
		9047352653,
		"rileytittle02@gmail.com",
		"7816 Southside Blvd",
		"",
		"Jacksonville",
		"FL",
		32256,
		["Logistic Tracking"]
	),
	new VolunteerApplication(
		1,
		"Coleman",
		"George",
		9047352653,
		"fake@email.com",
		"7816 Southside Blvd",
		"",
		"Jacksonville",
		"FL",
		32256,
		["Logistic Tracking", "Community Outreach"]
	),
];
dummyApplications[1].evaluated = true;
dummyApplications[1].rejected = true;
dummyApplications[1].reasonRejected =
	"we are not accepting volunteers under 18 years old";
/*************************************************DUMMMY DATA*********************************************************/

app.post("/login", VolunteerAuthChecker, async (req, res) => {
	try {
		//write some logic here
		if (req.headers["authorization"]) {
			let userInfo = req.headers["authorization"].split(" ")[1]; //Base 64 Encoded
			let decodedUserInfo = atob(userInfo);
			let email = decodedUserInfo.split(":")[0];
			let password = decodedUserInfo.split(":")[1];
			console.log(email, password, decodedUserInfo, userInfo);
			let queryResult = await pool.query(
				"SELECT * FROM Volunteer WHERE email = $1",
				[email]
			);

			if (queryResult.rows.length > 0) {
				let user = queryResult.rows[0];
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
									isVolunteer: true,
									userType: "volunteer",
									firstName: user.first_name,
									lastName: user.last_name,
									assignment: user.assignment,
								},
								SECRET_KEY
							);
							res.status(200).send({
								token: token,
								firstName: user.first_name, // Send first name separately
								lastName: user.last_name, // Send last name separately
								assignment: user.assignment,
								offered: user.offered,
								id: user.id,
							});
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
		console.error("Error in login route:", e); // Log the error
		res.status(500).send({ message: "Internal Server Error", error: e });
	}
});

app.post("/create", async (req: Request, res: Response): Promise<any> => {
	const {
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
	} = req.body;

	let id = Math.floor(Math.random() * 1000000) + 1;

	// Create a new instance of VolunteerApplication
	const newVolunteer = new VolunteerApplication(
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
		areasOfHelp
	);

	try {
		// Insert the volunteer data into the database
		const currentDate = new Date().toISOString().split("T")[0];
		const now = new Date();
		const currentTime = now.toTimeString().split(" ")[0]; // Removes timezone and milliseconds
		let result = await pool.query(
			`INSERT INTO "volunteerapplications" 
      (first_name, last_name, phone_number, email, street_address_1, street_address_2, 
       city, state, zip_code, admin_team, hospitality, logistic_tracking, 
       community_outreach, community_helpers, status, reason_rejected, date_created, time_created)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
			[
				newVolunteer.firstName,
				newVolunteer.lastName,
				newVolunteer.phoneNumber,
				newVolunteer.email,
				newVolunteer.streetAddress1,
				newVolunteer.streetAddress2,
				newVolunteer.city,
				newVolunteer.state,
				newVolunteer.zipCode,
				newVolunteer.areasOfHelp.includes(
					"Volunteer Management and Administration Team"
				),
				newVolunteer.areasOfHelp.includes("Hospitality Team"),
				newVolunteer.areasOfHelp.includes("Logistic Tracking Team"),
				newVolunteer.areasOfHelp.includes("Community Outreach Team"),
				newVolunteer.areasOfHelp.includes("Community Helpers Team"),
				"Unevaluated",
				null,
				currentDate,
				currentTime,
			]
		);

		// Send success response

		await sendEmail(
			email,
			"Your Application Has Been Submitted",
			"This is a confirmation that your application for Epic community helpers has been successfully submitted. We will review your request and reach back out to you shortly!"
		);

		res.status(201).json({
			message: "Volunteer Application Created",
			volunteer: newVolunteer,
		});
	} catch (e) {
		if (e instanceof Error) {
			console.log(e.message);
			res.status(500).json({
				message: "Something went wrong",
				error: e.message,
			});
		} else {
			console.log("An unknown error occurred:", e);
			res.status(500).json({
				message: "Something went wrong",
				error: "Unknown error",
			});
		}
	}
});
app.get("/status", async (req, res) => {
	let { first_name, last_name, street_address_1, street_address_2 } =
		req.query;
	if (street_address_2 == "NULL") {
		street_address_2 = "";
	}
	try {
		let applications = await pool.query(`
			SELECT status, reason_rejected, admin_team, hospitality, logistic_tracking, community_outreach, community_helpers, date_created, time_created
			FROM volunteerapplications
			WHERE first_name ILIKE '${first_name}' AND last_name ILIKE '${last_name}' AND street_address_1 ILIKE '${street_address_1}' AND street_address_2 ILIKE '${street_address_2}'
			ORDER BY date_created DESC, time_created DESC;
		`);

		if (applications.rows.length === 0) {
			return res.status(404).json({ message: "No results found. Please double check your spelling. In addition, an accepted request will not display here." }); // Return 404 if no rows are found
		}

		let applicant = applications.rows[0];
		//console.log(request);
		let status = applicant.status;
		let reasonRejected = applicant.reason_rejected;
		let helpAreas: string[] = [];
		if (applicant.admin_team) {
			helpAreas.push("Administration Team");
		}
		if (applicant.hospitality) {
			helpAreas.push("Hospitality");
		}
		if (applicant.logistic_tracking) {
			helpAreas.push("Logistic Tracking");
		}
		if (applicant.community_outreach) {
			helpAreas.push("Community Outreach");
		}
		if (applicant.community_helpers) {
			helpAreas.push("Community Helpers");
		}
		let dateCreated = applicant.date_created;
		let timeCreated = applicant.time_created;

		let statusInformation = new VolunteerApplicationStatus(
			status,
			reasonRejected,
			helpAreas,
			dateCreated,
			timeCreated
		);

		res.status(200).send(statusInformation);
	} catch (e) {
		res.status(500).send({ message: "Something went wrong" });
		console.log(e);
	}
});

app.post("/changePassword", async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(400).send({ message: "User token is required" });
	}

	// Decode token to get email
	const decodedToken = jwtDecode<{ email: string }>(token);
	const email = decodedToken.email;

	try {
		const userQuery = await pool.query(
			"SELECT password FROM Volunteer WHERE email = $1",
			[email]
		);

		if (userQuery.rows.length === 0) {
			return res.status(404).send({ message: "User not found" });
		}

		const hashedPassword = userQuery.rows[0].password;

		const match = await bcrypt.compare(currentPassword, hashedPassword);
		if (!match) {
			return res
				.status(401)
				.send({ message: "Incorrect current password" });
		}

		const saltRounds = 10;
		const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

		await pool.query(
			"UPDATE Volunteer SET password = $1 WHERE email = $2",
			[newHashedPassword, email]
		);

		res.status(200).send({ message: "Password successfully updated" });
	} catch (err) {
		console.error("Error changing password:", err);
		res.status(500).send({ message: "Server error" });
	}
});

app.post("/resetPassword", (req, res) => {
	const { username } = req.body;

	// Create a new instance of VolunteerApplication
	const index = dummyVolunteers.findIndex(
		(volunteer) => volunteer.id == username
	);
	const newPassword = Math.floor(
		Math.random() * (999999 - 100000 + 1) + 100000
	);

	if (index != -1) {
		dummyVolunteers[index].password = newPassword.toString();
		res.status(200).json({
			message: `Password Reset; new password is ${newPassword}`,
		});
		console.log(dummyVolunteers[index]);
	} else {
		res.status(401).json({ message: "Username Not Found" });
	}
});

app.post("/status", (req, res) => {
	const { firstName, lastName } = req.body;

	// Create a new instance of VolunteerApplication
	const index = dummyApplications.findIndex(
		(applicant) =>
			applicant.firstName.toLowerCase() == firstName.toLowerCase() &&
			applicant.lastName.toLowerCase() == lastName.toLowerCase()
	);

	if (index != -1) {
		if (!dummyApplications[index].evaluated) {
			res.status(200).json({ message: `Your application is pending!` });
		} else {
			if (dummyApplications[index].rejected) {
				if (dummyApplications[index].reasonRejected == "") {
					res.status(200).json({
						message: `Your application has been rejected for an unknown reason`,
					});
				} else {
					res.status(200).json({
						message: `Your application has been rejected because ${dummyApplications[index].reasonRejected}`,
					});
				}
			}
		}

		console.log(dummyVolunteers[index]);
	} else {
		res.status(401).json({ message: "Name Not Found" });
	}
});

/*Returns an array of Job objects
 * if a job doesn't exist, it will return 0
 * assignment is index 0
 * offered is index 1
 */
app.get(
	"/jobs",
	VolunteerAuthChecker,
	async (req: Request, res: Response): Promise<any> => {
		try {
			const userToken = req.query.userToken as string;

			if (!userToken) {
				return res
					.status(400)
					.send({ message: "User token is required" });
			}

			const decodedToken = jwtDecode<{ email: string }>(userToken);

			const queryUser = await pool.query(
				"SELECT assignment, offered FROM Volunteer WHERE email = $1",
				[decodedToken.email]
			);

			if (queryUser.rows.length === 0) {
				return res.status(404).send({ message: "Volunteer not found" });
			}

			const user = queryUser.rows[0];

			let jobs: (Job | number)[] = [];

			// Function to map request data to Job model
			const createJobFromRequest = (
				row: any,
				assignedTeam: string
			): Job => {
				const helpTypes: string[] = [];

				if (row.yard_cleanup) helpTypes.push("Yard Cleanup");
				if (row.interior_cleanup) helpTypes.push("Interior Cleanup");
				if (row.emotional_support) helpTypes.push("Emotional Support");
				if (row.cleaning_supplies) helpTypes.push("Cleaning Supplies");
				if (row.clean_water) helpTypes.push("Clean Water");
				if (row.emergency_food) helpTypes.push("Emergency Food");
				if (row.other) helpTypes.push(row.other);

				return new Job(
					row.request_id,
					row.first_name,
					row.last_name,
					row.email,
					row.street_address_1,
					row.city,
					row.state,
					row.zip_code,
					helpTypes,
					assignedTeam
				);
			};

			if (user.assignment !== null) {
				const queryResult = await pool.query(
					"SELECT * FROM Request WHERE request_id = $1",
					[user.assignment]
				);

				if (queryResult.rows.length > 0) {
					let job = createJobFromRequest(
						queryResult.rows[0],
						"Assigned Team"
					);
					console.log(job);

					jobs.push(job);
				}
			} else {
				jobs.push(0);
			}

			if (user.offered !== null) {
				const queryResult = await pool.query(
					"SELECT * FROM Request WHERE request_id = $1",
					[user.offered]
				);

				if (queryResult.rows.length > 0) {
					jobs.push(
						createJobFromRequest(
							queryResult.rows[0],
							"Offered Team"
						)
					);
				}
			} else {
				jobs.push(0);
			}

			console.log("Jobs", jobs);

			res.status(200).json(jobs);
		} catch (error) {
			console.error("Error in /jobs API:", error);
			res.status(500).send({
				message: "Internal Server Error",
				error: (error as Error).message,
			});
		}
	}
);

//allows user to accept or reject their job
app.post(
	"/job-accept",
	VolunteerAuthChecker,
	async (req: Request, res: Response): Promise<any> => {
		try {
			const { offered, action, id } = req.body;

			// Validate inputs
			if (!offered || !action || !id) {
				return res
					.status(400)
					.send(
						"Missing required parameters: 'offered', 'action', or 'id'."
					);
			}

			if (action === "reject") {
				// Reject the job for a specific volunteer
				await pool.query(
					"UPDATE Volunteer SET offered = NULL WHERE offered = $1 AND id = $2",
					[offered, id]
				);

				res.status(200).send("Job rejected successfully");
			} else if (action === "accept") {
				// Accept the job: set assignment to offered and clear offered
				await pool.query(
					"UPDATE Volunteer SET assignment = $1, offered = NULL WHERE id = $2",
					[offered, id]
				);

				res.status(200).send("Job accepted successfully");
			} else {
				return res
					.status(400)
					.send("Invalid action. Must be 'accept' or 'reject'.");
			}
		} catch (error) {
			console.error(error);
			res.status(500).send("Error processing job action");
		}
	}
);

app.get(
	"/user-details",
	VolunteerAuthChecker,
	async (req: Request, res: Response): Promise<any> => {
		try {
			const userToken = req.query.userToken as string;

			console.log("userToken:", userToken);

			if (!userToken) {
				return res
					.status(400)
					.send({ message: "User token is required" });
			}

			const decodedToken = jwtDecode<{ email: string }>(userToken);

			if (!decodedToken.email) {
				return res
					.status(400)
					.send({ message: "Invalid token: email missing" });
			}

			console.log("Decoded Token:", decodedToken);

			const queryResult = await pool.query(
				"SELECT * FROM Volunteer WHERE email = $1",
				[decodedToken.email]
			);

			if (queryResult.rows.length === 0) {
				return res.status(404).send({ message: "Volunteer not found" });
			}

			const row = queryResult.rows[0];

			const workTypes: string[] = [];

			// Check each boolean field and add the corresponding string to the array if true
			if (row.admin_team) workTypes.push("admin");
			if (row.hospitality) workTypes.push("hospitality");
			if (row.logistic_tracking) workTypes.push("logistic_tracking");
			if (row.community_outreach) workTypes.push("community_outreach");
			if (row.community_helpers) workTypes.push("community_helpers");

			const volunteer = new Volunteer(
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
				workTypes,
				row.team_leader,
				"Yeah, you really thought I was going to send a password back to the frontend lol"
			);

			//console.log(volunteer);

			res.status(200).send(volunteer);
		} catch (error) {
			console.error("Error in /user-details API:", error);
			res.status(500).send({
				message: "Internal Server Error",
				error: (error as Error).message,
			});
		}
	}
);

app.post(
	"/update-user-details",
	VolunteerAuthChecker,
	async (req: Request, res: any) => {
		try {
			const { email, phone, address, city, state, zip } = req.body;

			if (!email || !phone || !address || !city || !state || !zip) {
				return res
					.status(400)
					.json({ message: "All fields are required." });
			}

			if (!/^\d+$/.test(phone)) {
				return res
					.status(400)
					.json({
						message: "Phone number must contain only digits.",
					});
			}

			const query = `
            UPDATE Volunteer 
            SET phone_number = $1, street_address_1 = $2, city = $3, state = $4, zip_code = $5
            WHERE email = $6
            RETURNING *;
        `;
			const values = [phone, address, city, state, zip, email];

			const result = await pool.query(query, values);

			if (result.rowCount === 0) {
				return res.status(404).json({ message: "User not found." });
			}

			res.status(200).json({
				message: "User details updated successfully.",
				user: result.rows[0],
			});
		} catch (error: any) {
			console.error("Error updating user details:", error);
			res.status(500).json({
				message: "Internal Server Error",
				error: error.message,
			});
		}
	}
);

export { app };
