import { Router } from "express";

import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Pool } from "pg";
import { Job } from '../models/job.model';
import { Request, Response } from "express";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});
  
const SECRET_KEY =
	"0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";

const app = Router();

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
		0,
		"Riley",
		"Tittle",
		9047352653,
		"rileytittle02@gmail.com",
		"7816 Southside Blvd",
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
								{ email: user.email, isVolunteer: true, assignment: user.assignment },
								SECRET_KEY
							);
							res.status(200).send({ token: token, 
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

app.post("/create", (req, res) => {
	const {
		firstName,
		lastName,
		phoneNumber,
		email,
		streetAddress,
		city,
		state,
		zipCode,
		areasOfHelp,
	} = req.body;
	const id = Math.floor(Math.random() * 10000);

	// Create a new instance of VolunteerApplication
	const newVolunteer = new VolunteerApplication(
		id,
		firstName,
		lastName,
		phoneNumber,
		email,
		streetAddress,
		city,
		state,
		zipCode,
		areasOfHelp
	);

	// Add the new volunteer to the list
	volunteerApplications.push(newVolunteer);

	res.status(201).json({
		message: "Volunteer Application Created",
		volunteer: newVolunteer,
	});
});

app.post("/changePassword", (req, res) => {
	const { username, currentPassword, newPassword } = req.body;

	// Create a new instance of VolunteerApplication
	const index = dummyVolunteers.findIndex(
		(volunteer) => volunteer.id == username
	);

	console.log(`${dummyVolunteers[0].id} == ${username} (${index})`);
	if (index != -1) {
		if (dummyVolunteers[index].password == currentPassword) {
			dummyVolunteers[index].password = newPassword;
			res.status(200).json({ message: "Password Succesfully Updated" });
			console.log(dummyVolunteers[index]);
		} else {
			res.status(401).json({ message: "Old Password does not match" });
		}
	} else {
		res.status(401).json({ message: "Username Not Found" });
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



app.post("/job-accept", async (req: Request, res: Response): Promise<any> => {
	try {
	  const { offered, action, id } = req.body;  
  
	  // Validate inputs
	  if (!offered || !action || !id) {
		return res.status(400).send("Missing required parameters: 'offered', 'action', or 'id'.");
	  }
  
	  if (action === 'reject') {
		// Reject the job for a specific volunteer
		await pool.query(
		  "UPDATE Volunteer SET offered = NULL WHERE offered = $1 AND id = $2",
		  [offered, id]
		);
		
		res.status(200).send("Job rejected successfully");
	  } else if (action === 'accept') {
		// Accept the job: set assignment to offered and clear offered
		await pool.query(
		  "UPDATE Volunteer SET assignment = $1, offered = NULL WHERE id = $2",
		  [offered, id]
		);
		
		res.status(200).send("Job accepted successfully");
	  } else {
		return res.status(400).send("Invalid action. Must be 'accept' or 'reject'.");
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).send("Error processing job action");
	}
  });

  app.get("/assigned", async (req: Request, res: Response) => {
	try {
		const { assignment: assignment} = req.query;
	  
		const queryResult = await pool.query("SELECT * FROM Request WHERE request_id = $1", [assignment]);
		res.status(200).send(queryResult.rows);
		
	  } catch (error) {
		console.error("Error in /assigned API:", error);
		res.status(500).send({ message: "Internal Server Error", error: (error as Error).message });
	  }
  });

  app.get("/offered", async (req: Request, res: Response) => {
	try {
	  const { offered } = req.query;
  
	  // Execute query
	  const queryResult = await pool.query("SELECT * FROM Request WHERE request_id = $1", [offered]);
  
	  // Return the rows in the response
	  res.status(200).send(queryResult.rows);
	} catch (error) {
	  console.error("Error in /offered API:", error);
	  res.status(500).send({ message: "Internal Server Error", error: (error as Error).message });
	}
  });
  

export { app };
