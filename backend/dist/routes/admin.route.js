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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const volunteerApplication_model_1 = require("../models/volunteerApplication.model");
const volunteer_model_1 = require("../models/volunteer.model");
const job_model_1 = require("../models/job.model");
const pg_1 = require("pg");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
let saltRounds = 10;
const SECRET_KEY = "0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "Senior-Project",
    password: "garnetisGold!1820",
    port: 5432,
});
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
let firstApplication = new volunteerApplication_model_1.VolunteerApplication(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking Team"]);
let secondApplication = new volunteerApplication_model_1.VolunteerApplication(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking Team", "Community Outreach Team"]);
volunteerApplications.push(firstApplication);
volunteerApplications.push(secondApplication);
let volunteers = [];
//*******************************
app.post("/create-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //write some logic here
        let queryResult = yield pool.query('SELECT * FROM AdminAccount WHERE email = $1', [req.body.email]);
        if (queryResult.rows.length == 0) {
        }
        else {
            res.status(400).send({ message: 'Email already in use' });
        }
        res.status(200).send("Success");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //write some logic here
        if (req.headers["authorization"]) {
            let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
            let decodedUserInfo = atob(userInfo);
            let email = decodedUserInfo.split(':')[0];
            let password = decodedUserInfo.split(':')[1];
            console.log(email, password, decodedUserInfo, userInfo);
            let queryResult = yield pool.query('SELECT * FROM AdminAccount WHERE email = $1', [email]);
            if (queryResult.rows.length > 0) {
                let user = queryResult.rows[0];
                console.log(user.password);
                bcrypt_1.default.compare(password, user.password.trim(), (err, result) => {
                    console.log({ password, storedHash: user.password.trim(), err, result });
                    if (result) {
                        let token = jsonwebtoken_1.default.sign({ email: user.email, isAdmin: true }, SECRET_KEY);
                        res.status(200).send({ token: token });
                    }
                    else {
                        res.status(401).send({ status: 401, message: 'Incorrect password' });
                    }
                });
            }
            else {
                res.status(401).send({ message: 'No account with that email found' });
            }
        }
        else {
            res.status(401).send({ message: 'missing required login details' });
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
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
        res.send("bad");
    }
});
app.post("/assign-volunteer/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { team } = req.body;
    const filteredVolunteers = volunteers.filter((volunteer) => volunteer.areasOfHelp.includes(team));
    res.status(200).json({
        volunteers: filteredVolunteers,
        message: filteredVolunteers.length > 0
            ? `${filteredVolunteers.length} volunteer(s) found for the ${team} team.`
            : "No volunteers found for this team.",
    });
}));
app.patch("/volunteers/volunteer-details", (req, res) => {
    try {
        let foundVolunteer = undefined;
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
            }
            else {
                res.status(400).send("Area is already in volunteer's account");
            }
        }
        else {
            res.status(404).send("Could not find volunteer");
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
        res.send("Bad");
    }
});
app.delete("/volunteers/volunteer-details", (req, res) => {
    try {
        let foundVolunteer = undefined;
        for (let volunteer of volunteers) {
            if (volunteer.id == parseInt(req.body.id)) {
                foundVolunteer = volunteer;
                break;
            }
        }
        if (foundVolunteer) {
            let newAreas = foundVolunteer.areasOfHelp.filter((area) => area !== req.body.selectedArea);
            foundVolunteer.areasOfHelp = newAreas;
            res.status(200).send(foundVolunteer);
        }
        else {
            res.status(404).send("Could not find volunteer");
        }
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.get("/volunteers/volunteer-details/:id", (req, res) => {
    try {
        //write some logic here
        let foundVolunteer = undefined;
        for (let volunteer of volunteers) {
            if (volunteer.id == parseFloat(req.params.id)) {
                foundVolunteer = volunteer;
                break;
            }
        }
        if (foundVolunteer) {
            res.status(200).send(foundVolunteer);
        }
        else {
            res.status(404).send("Could not find volunteer");
        }
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
        res.send("Bad");
    }
});
app.get("/volunteers", (req, res) => {
    try {
        //write some logic here
        res.status(200).send(volunteers);
    }
    catch (e) {
        res.status(500).send(e);
    }
});
