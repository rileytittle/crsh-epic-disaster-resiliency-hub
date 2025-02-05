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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
const SECRET_KEY = "0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";
const app = (0, express_1.Router)();
exports.app = app;
/*************************************************DUMMMY DATA*********************************************************/
let volunteerApplications = []; // Temporary storage of applications
let dummyVolunteers = [
    new volunteer_model_1.Volunteer(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"], false, "password"),
    new volunteer_model_1.Volunteer(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"], false, "differentPassword")
];
let dummyApplications = [
    new volunteerApplication_model_1.volunteerApplication(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"]),
    new volunteerApplication_model_1.volunteerApplication(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"])
];
dummyApplications[1].evaluated = true;
dummyApplications[1].rejected = true;
dummyApplications[1].reasonRejected = "we are not accepting volunteers under 18 years old";
/*************************************************DUMMMY DATA*********************************************************/
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //write some logic here
        if (req.headers["authorization"]) {
            let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
            let decodedUserInfo = atob(userInfo);
            let email = decodedUserInfo.split(':')[0];
            let password = decodedUserInfo.split(':')[1];
            console.log(email, password, decodedUserInfo, userInfo);
            let queryResult = yield pool.query('SELECT * FROM "VolunteerAccount" WHERE email = $1', [email]);
            if (queryResult.rows.length > 0) {
                let user = queryResult.rows[0];
                console.log(user.password);
                bcrypt_1.default.compare(password, user.password.trim(), (err, result) => {
                    console.log({ password, storedHash: user.password.trim(), err, result });
                    if (result) {
                        let token = jsonwebtoken_1.default.sign({ email: user.email, isVolunteer: true }, SECRET_KEY);
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
app.post("/create", (req, res) => {
    const { firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp } = req.body;
    const id = Math.floor(Math.random() * 10000);
    // Create a new instance of VolunteerApplication
    const newVolunteer = new volunteerApplication_model_1.volunteerApplication(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp);
    // Add the new volunteer to the list
    volunteerApplications.push(newVolunteer);
    res.status(201).json({ message: 'Volunteer Application Created', volunteer: newVolunteer });
});
app.post("/changePassword", (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    // Create a new instance of volunteerApplication
    const index = dummyVolunteers.findIndex(volunteer => volunteer.id == username);
    console.log(`${dummyVolunteers[0].id} == ${username} (${index})`);
    if (index != -1) {
        if (dummyVolunteers[index].password == currentPassword) {
            dummyVolunteers[index].password = newPassword;
            res.status(200).json({ message: 'Password Succesfully Updated' });
            console.log(dummyVolunteers[index]);
        }
        else {
            res.status(401).json({ message: 'Old Password does not match' });
        }
    }
    else {
        res.status(401).json({ message: 'Username Not Found' });
    }
});
app.post("/resetPassword", (req, res) => {
    const { username } = req.body;
    // Create a new instance of VolunteerApplication
    const index = dummyVolunteers.findIndex(volunteer => volunteer.id == username);
    const newPassword = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    if (index != -1) {
        dummyVolunteers[index].password = newPassword.toString();
        res.status(200).json({ message: `Password Reset; new password is ${newPassword}` });
        console.log(dummyVolunteers[index]);
    }
    else {
        res.status(401).json({ message: 'Username Not Found' });
    }
});
app.post("/status", (req, res) => {
    const { firstName, lastName } = req.body;
    // Create a new instance of VolunteerApplication
    const index = dummyApplications.findIndex(applicant => applicant.firstName.toLowerCase() == firstName.toLowerCase() && applicant.lastName.toLowerCase() == lastName.toLowerCase());
    if (index != -1) {
        if (!dummyApplications[index].evaluated) {
            res.status(200).json({ message: `Your application is pending!` });
        }
        else {
            if (dummyApplications[index].rejected) {
                if (dummyApplications[index].reasonRejected == '') {
                    res.status(200).json({ message: `Your application has been rejected for an unknown reason` });
                }
                else {
                    res.status(200).json({ message: `Your application has been rejected because ${dummyApplications[index].reasonRejected}` });
                }
            }
        }
        console.log(dummyVolunteers[index]);
    }
    else {
        res.status(401).json({ message: 'Name Not Found' });
    }
});
app.post("/updateAssignment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let assignment = req.body.assignment;
    let volId = req.body.id;
    console.log(assignment, volId);
    try {
        yield pool.query('UPDATE "VolunteerAccount" SET "assignment" = $1 WHERE "id" = $2', [assignment, volId]);
        res.status(200).send({ message: "Volunteer Assigned" });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
