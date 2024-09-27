import { Router, application } from "express";
import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import sgMail from "@sendgrid/mail";
let app = Router();
//enter your api key below
let emailAPIKey = "";
sgMail.setApiKey(emailAPIKey);

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
	["Logistic Tracking"]
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
	["Logistic Tracking", "Community Outreach"]
);
volunteerApplications.push(firstApplication);
volunteerApplications.push(secondApplication);

let volunteers: Volunteer[] = [];
//*******************************

app.post("/create-volunteer/accept", async (req, res) => {
	//get areas of help and team lead variables from body
	//create volunteer object and give it these variables
	try {
		let password = "myPassword";
		if (
			req.body.firstName &&
			req.body.lastName &&
			req.body.phoneNumber &&
			req.body.email &&
			req.body.streetAddress &&
			req.body.city &&
			req.body.state &&
			req.body.zipCode &&
			req.body.areasOfHelp &&
			req.body.teamLeader
		) {
			let newVolunteer = new Volunteer(
				req.body.id,
				req.body.firstName,
				req.body.lastName,
				parseInt(req.body.phoneNumber),
				req.body.email,
				req.body.streetAddress,
				req.body.city,
				req.body.state,
				parseInt(req.body.zipCode),
				req.body.areasOfHelp,
				req.body.teamLeader,
				password
			);
			//push it onto the list
			volunteers.push(newVolunteer);
			let msg = {
				to: newVolunteer.email,
				from: "coletittle@ymail.com",
				subject: "Your Volunteer Account",
				text: "email was sent correctly",
			};
			sgMail
				.send(msg)
				.then(() => {
					console.log("Email sent");
				})
				.catch((error) => {
					console.error(error);
				});
			res.status(201).send(volunteers);
		} else {
			res.status(400).send("Couldn't create new volunteer object");
		}
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post("/create-volunteer/reject", async (req, res) => {
	try {
		//find application that we're rejecting
		let foundApplication: VolunteerApplication | undefined = undefined;
		for (let application of volunteerApplications) {
			if ((application.email = req.body.email)) {
				//set approved to false
				//set reasonRejected to body, if it exists
				application.approved = false;
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

app.get("/create-volunteer/applications", async (req, res) => {
	res.status(200).send(volunteerApplications);
});
export { app };
