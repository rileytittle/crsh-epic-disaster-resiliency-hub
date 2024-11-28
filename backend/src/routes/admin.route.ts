import { Router, application } from "express";
import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import { Authchecker } from "../utils/auth.utils";
import sgMail from "@sendgrid/mail";
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
