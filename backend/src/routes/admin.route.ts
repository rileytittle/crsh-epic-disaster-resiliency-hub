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

	const filteredVolunteers = volunteers.filter((volunteer) =>
		volunteer.areasOfHelp.includes(team)
	);

	res.status(200).json({
		volunteers: filteredVolunteers,
		message:
			filteredVolunteers.length > 0
				? `${filteredVolunteers.length} volunteer(s) found for the ${team} team.`
				: "No volunteers found for this team.",
	});
});
app.patch("/volunteers/volunteer-details", (req, res) => {
	try {
		let foundVolunteer: Volunteer | undefined = undefined;

		for (let volunteer of volunteers) {
			if (volunteer.id == parseInt(req.body.id)) {
				foundVolunteer = volunteer;
				break;
			}
		}
		if (foundVolunteer) {
			if (!foundVolunteer.areasOfHelp.includes(req.body.selectedArea)) {
				foundVolunteer.areasOfHelp.push(req.body.selectedArea);
				res.status(200).send(foundVolunteer);
			} else {
				res.status(400).send("Area is already in volunteer's account");
			}
		} else {
			res.status(404).send("Could not find volunteer");
		}
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

app.delete("/volunteers/volunteer-details", (req, res) => {
	try {
		let areaToChange = "";
		if (req.body.area == "Hospitality") {
			areaToChange = "hospitality";
		} else if (req.body.area == "Community Helpers") {
			areaToChange = "community_helpers";
		} else if (req.body.area == "Community Outreach") {
			areaToChange = "community_outreach";
		} else if (
			req.body.area == "Volunteer Management and Administration Team"
		) {
			areaToChange = "admin_team";
		} else if (req.body.area == "Logistic Tracking") {
			areaToChange = "logistic_tracking";
		}
		let result = pool.query(
			"UPDATE volunteer SET $1 = false WHERE id = $2",
			[areaToChange, parseInt(req.body.id)]
		);
	} catch (e) {
		res.status(500).send(e);
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

app.get("/homeowner-requests", (req, res) => {
	try {
		let filteredRequests = requests.filter(
			(request) => request.evaluation === undefined
		);
		res.status(200).send(filteredRequests);
	} catch (e) {
		res.send("Bad");
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
export { app };
