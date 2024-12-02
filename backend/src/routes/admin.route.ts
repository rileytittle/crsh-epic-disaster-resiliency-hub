import { Router, application } from "express";
import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import { Authchecker } from "../utils/auth.utils";
import sgMail from "@sendgrid/mail";
import { Pool } from "pg";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
let saltRounds = 10;
const SECRET_KEY =
	"0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "Senior-Project",
	password: "garnetisGold!1820",
	port: 5432,
});
let app = Router();
//enter your api key below
// let emailAPIKey = "";
// sgMail.setApiKey(emailAPIKey);

//Dummy data below
//*******************************




let volunteerApplications: VolunteerApplication[] = [];
let firstApplication = new VolunteerApplication(
	0,
	"Riley",
	"Tittle",
	9047352653,
	"rileytittle02@gmail.com",
	"7816 Southside Blvd",
	"Jacksonville",
	"FL",
	32256,
	["Logistic Tracking Team"]
);
let secondApplication = new VolunteerApplication(
	1,
	"Coleman",
	"George",
	9047352653,
	"fake@email.com",
	"7816 Southside Blvd",
	"Jacksonville",
	"FL",
	32256,
	["Logistic Tracking Team", "Community Outreach Team"]
);
volunteerApplications.push(firstApplication);
volunteerApplications.push(secondApplication);

let volunteers: Volunteer[] = [];




//*******************************
app.post("/create-account", async (req, res) => {
	try {
		//write some logic here
		let queryResult = await pool.query(
			'SELECT * FROM AdminAccount WHERE email = $1',
			[req.body.email]
		);
		if(queryResult.rows.length == 0){
			
		}
		else{
			res.status(400).send({message:'Email already in use'});
		}
		res.status(200).send("Success");
	} catch (e) {
		res.status(500).send(e);
	}
});
app.post("/login", async (req, res) => {
	try {
		//write some logic here
		if(req.headers["authorization"]){
			let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
			let decodedUserInfo = atob(userInfo);
			let email= decodedUserInfo.split(':')[0];
			let password= decodedUserInfo.split(':')[1];
			console.log(email, password, decodedUserInfo, userInfo)
			let queryResult = await pool.query(
				'SELECT * FROM AdminAccount WHERE email = $1', 
				[email]
			);
			if(queryResult.rows.length > 0){
				let user = queryResult.rows[0]
				console.log(user.password)
				bcrypt.compare(password, user.password.trim(), (err, result)=>{
					console.log({ password, storedHash: user.password.trim(), err, result });
					if(result){
						let token = jwt.sign({email:user.email, isAdmin:true}, SECRET_KEY);
						res.status(200).send({token:token});
					}
					else{
						res.status(401).send({status:401, message:'Incorrect password'});
					}
				})
			}
			else{
				res.status(401).send({message:'No account with that email found'})
			}
		}
		else{
			res.status(401).send({message: 'missing required login details'})
		}
	} catch (e) {
		res.status(500).send(e);
	}
});
app.post("/create-volunteer/accept", async (req, res) => {
	//get areas of help and team lead variables from body
	//create volunteer object and give it these variables
	try {
		let foundApplication: VolunteerApplication | undefined = undefined;
		for (let application of volunteerApplications) {
			if (application.email === req.body.email) {
				foundApplication = application;
			}
		}
		if (
			foundApplication &&
			!foundApplication.evaluated &&
			typeof req.body.teamLeader === "boolean"
		) {
			let myPassword = "password";
			foundApplication.evaluated = true;
			let newVolunteer = new Volunteer(
				0,
				foundApplication.firstName,
				foundApplication.lastName,
				foundApplication.phoneNumber,
				foundApplication.email,
				foundApplication.streetAddress,
				foundApplication.city,
				foundApplication.state,
				foundApplication.zipCode,
				foundApplication.areasOfHelp,
				req.body.teamLeader,
				myPassword
			);
			newVolunteer.evaluated = true;
			//push it onto the list
			volunteers.push(newVolunteer);
			// let msg = {
			// 	to: newVolunteer.email,
			// 	from: "coletittle@ymail.com",
			// 	subject: "Your Volunteer Account",
			// 	text: "email was sent correctly",
			// };
			// sgMail
			// 	.send(msg)
			// 	.then(() => {
			// 		console.log("Email sent");
			// 	})
			// 	.catch((error) => {
			// 		console.error(error);
			// 	});
			res.status(201).send(volunteers);
		} else {
			res.status(404).send("Could not find application");
		}
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post("/create-volunteer/reject", async (req, res) => {
	try {
		//find application that we're rejecting
		let foundApplication: boolean = false;
		for (let application of volunteerApplications) {
			if (application.email === req.body.email) {
				//set approved to false
				//set reasonRejected to body, if it exists
				foundApplication = true;
				application.rejected = true;
				if (req.body.reasonRejected) {
					application.reasonRejected = req.body.reasonRejected;
				}
			}
		}
		if (foundApplication) {
			res.status(200).send("Application rejected");
		} else {
			res.status(404).send("Application not found");
		}
	} catch (e) {
		res.status(400).send("Problem rejected application");
	}
});

app.get("/create-volunteer/applications", Authchecker, async (req, res) => {
	let filteredApplications = volunteerApplications.filter(
		(application) => !application.rejected && !application.evaluated
	);
	res.status(200).send(filteredApplications);
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
export { app };
