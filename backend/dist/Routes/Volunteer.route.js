"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const volunteerApplication_model_1 = require("../models/volunteerApplication.model");
const app = (0, express_1.Router)();
exports.app = app;
let volunteerApplications = []; // Temporary storage of applications
app.post("/create", (req, res) => {
    const { firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp } = req.body;
    const id = Math.floor(Math.random() * 10000);
    // Create a new instance of VolunteerApplication
    const newVolunteer = new volunteerApplication_model_1.VolunteerApplication(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp);
    // Add the new volunteer to the list
    volunteerApplications.push(newVolunteer);
    res.status(201).json({ message: 'Volunteer Application Created', volunteer: newVolunteer });
});
