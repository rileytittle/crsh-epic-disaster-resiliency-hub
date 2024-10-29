"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const volunteerApplication_model_1 = require("../models/volunteerApplication.model");
const volunteer_model_1 = require("../models/volunteer.model");
const job_model_1 = require("../models/job.model");
let app = (0, express_1.Router)();
exports.app = app;
//enter your api key below
// let emailAPIKey = "";
// sgMail.setApiKey(emailAPIKey);
//Dummy data below
//*******************************
let jobs = [];
let requests = [
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
let volunteerApplications = [];
let firstApplication = new volunteerApplication_model_1.VolunteerApplication(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"]);
let secondApplication = new volunteerApplication_model_1.VolunteerApplication(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"]);
volunteerApplications.push(firstApplication);
volunteerApplications.push(secondApplication);
let volunteers = [];
//*******************************
app.post("/create-volunteer/accept", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get areas of help and team lead variables from body
    //create volunteer object and give it these variables
    try {
        let foundApplication = undefined;
        for (let application of volunteerApplications) {
            if (application.email === req.body.email) {
                foundApplication = application;
            }
        }
        if (foundApplication &&
            !foundApplication.evaluated &&
            typeof req.body.teamLeader === "boolean") {
            let myPassword = "password";
            foundApplication.evaluated = true;
            let newVolunteer = new volunteer_model_1.Volunteer(0, foundApplication.firstName, foundApplication.lastName, foundApplication.phoneNumber, foundApplication.email, foundApplication.streetAddress, foundApplication.city, foundApplication.state, foundApplication.zipCode, foundApplication.areasOfHelp, req.body.teamLeader, myPassword);
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
        }
        else {
            res.status(404).send("Could not find application");
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
app.post("/create-volunteer/reject", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //find application that we're rejecting
        let foundApplication = false;
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
        }
        else {
            res.status(404).send("Application not found");
        }
    }
    catch (e) {
        res.status(400).send("Problem rejected application");
    }
}));
app.get("/create-volunteer/applications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filteredApplications = volunteerApplications.filter((application) => !application.rejected && !application.evaluated);
    res.status(200).send(filteredApplications);
}));
app.post("/homeowner-requests/accept", (req, res) => {
    try {
        //write some logic here
        let foundRequest = undefined;
        if (req.body.id) {
            for (let request of requests) {
                if (request.id == parseInt(req.body.id)) {
                    foundRequest = request;
                    break;
                }
            }
            if (foundRequest) {
                let newJob = new job_model_1.Job(foundRequest.id, foundRequest.firstName, foundRequest.lastName, foundRequest.email, foundRequest.address, foundRequest.city, foundRequest.state, foundRequest.zip, foundRequest.helpType, "Test Team");
                foundRequest.evaluation = "accepted";
                jobs.push(newJob);
                res.status(200).send("Success");
            }
            else {
                res.status(404).send("Could not find request");
            }
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.post("/homeowner-requests/reject", (req, res) => {
    try {
        let foundRequest = undefined;
        if (req.body.id) {
            for (let request of requests) {
                if (request.id == parseInt(req.body.id)) {
                    foundRequest = request;
                    break;
                }
            }
            if (foundRequest) {
                foundRequest.evaluation = "rejected";
            }
            else {
                res.status(404).send("Could not find request");
            }
        }
        else {
            res.status(400).send("Must supply id");
        }
        res.status(200).send("Success");
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get("/homeowner-requests", (req, res) => {
    try {
        let filteredRequests = requests.filter((request) => request.evaluation === undefined);
        res.status(200).send(filteredRequests);
    }
    catch (e) {
        res.status(500).send(e);
    }
});
