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
const job_model_1 = require("../Models/job.model");
const app = (0, express_1.Router)();
exports.app = app;
let volunteerApplications = []; // Temporary storage of applications
let dummyVolunteers = [
    new volunteer_model_1.Volunteer(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"], false, "password"),
    new volunteer_model_1.Volunteer(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"], false, "differentPassword")
];
let dummyApplications = [
    new volunteerApplication_model_1.VolunteerApplication(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"]),
    new volunteerApplication_model_1.VolunteerApplication(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"])
];
dummyApplications[1].evaluated = true;
dummyApplications[1].rejected = true;
dummyApplications[1].reasonRejected = "we are not accepting volunteers under 18 years old";
app.post("/create", (req, res) => {
    const { firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp } = req.body;
    const id = Math.floor(Math.random() * 10000);
    // Create a new instance of VolunteerApplication
    const newVolunteer = new volunteerApplication_model_1.VolunteerApplication(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp);
    // Add the new volunteer to the list
    volunteerApplications.push(newVolunteer);
    res.status(201).json({ message: 'Volunteer Application Created', volunteer: newVolunteer });
});
app.post("/changePassword", (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    // Create a new instance of VolunteerApplication
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
//added by Corey
let jobs = new Set();
let schedule = new Set();
//temporary jobs meant to simulate an admin offering new jobs to the volunteer
const hardcodedJobs = [
    new job_model_1.Job(1, "John", "Smith", "JSmith@email.com", 1234567890, "123 Florida Street", "Apt 101", "Orlando", "Fl", 12345, ["cleanup"], "cleanup", "cleanup"),
    new job_model_1.Job(2, "Jack", "Johnson", "JJohnson@email.com", 2345678901, "456 Dunn Creek Road", "Suite 202", "Tampa", "Fl", 12345, ["tree removal"], "tree removal", "tree removal"),
    new job_model_1.Job(3, "Jenny", "Garfunkle", "JGarfunkle@email.com", 3456789012, "789 Grover Court", "None", "Yulee", "Fl", 12345, ["roofing"], "roofing", "roofing"),
    new job_model_1.Job(4, "Trevor", "Moore", "TMoore@email.com", 4567890123, "135 Chemtrail Street", "None", "Orlando", "Fl", 12345, ["water damage"], "water damage", "water damage"),
    new job_model_1.Job(5, "Harriet", "Truman", "HTruman@email.com", 5678901234, "675 Joemama Road", "Apt 303", "Jacksonville", "Fl", 12345, ["food delivery"], "food delivery", "food delivery")
];
app.post("/job/accept", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (jobs.size > 0) {
            // Get the first job from the jobs set
            const jobIterator = jobs.values();
            const jobToSchedule = jobIterator.next().value; // Extract the first job from the iterator
            if (jobToSchedule) {
                schedule.add(jobToSchedule);
                jobs.delete(jobToSchedule);
                console.log(`Job '${jobToSchedule.id} - ${jobToSchedule.firstName} ${jobToSchedule.lastName}' has been scheduled.`); // For debugging
            }
        }
        res.status(200).send("Job accepted");
    }
    catch (e) {
        res.status(400).send("Problem rejected job choice");
    }
}));
app.post("/job/reject", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (jobs.size > 0) {
            // Get the first job from the jobs set
            const jobIterator = jobs.values();
            const jobToSchedule = jobIterator.next().value; // Extract the first job from the iterator
            if (jobToSchedule) {
                jobs.delete(jobToSchedule);
                console.log(`Job '${jobToSchedule.id} - ${jobToSchedule.firstName} ${jobToSchedule.lastName}' has been rejected.`); // For debugging
            }
        }
        res.status(200).send("Job rejected");
    }
    catch (e) {
        res.status(400).send("Problem rejected job choice");
    }
}));
app.get("/job/schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(Array.from(schedule)); // Convert the Set to an array to send it as JSON
}));
app.get("/job/offered", (req, res) => {
    // Initialize the jobs set if not already initialized
    if (!jobs) {
        jobs = new Set();
    }
    // If no jobs are in the set, add one
    if (jobs.size === 0) {
        const randomJobNumber = Math.floor(Math.random() * 5);
        const jobToAdd = hardcodedJobs[randomJobNumber];
        jobs.add(jobToAdd);
        console.log(`Assigned job: ${jobToAdd}`);
        console.log(`Schedule size: ${schedule.size}`);
    }
    // Return the jobs as an array
    res.json(Array.from(jobs));
});
