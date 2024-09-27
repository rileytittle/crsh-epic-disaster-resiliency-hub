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
const mail_1 = __importDefault(require("@sendgrid/mail"));
let app = (0, express_1.Router)();
exports.app = app;
//enter your api key below
let emailAPIKey = "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";
mail_1.default.setApiKey(emailAPIKey);
//Dummy data below
//*******************************
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
        let password = "myPassword";
        if (req.body.firstName &&
            req.body.lastName &&
            req.body.phoneNumber &&
            req.body.email &&
            req.body.streetAddress &&
            req.body.city &&
            req.body.state &&
            req.body.zipCode &&
            req.body.areasOfHelp &&
            req.body.teamLeader) {
            let newVolunteer = new volunteer_model_1.Volunteer(req.body.id, req.body.firstName, req.body.lastName, parseInt(req.body.phoneNumber), req.body.email, req.body.streetAddress, req.body.city, req.body.state, parseInt(req.body.zipCode), req.body.areasOfHelp, req.body.teamLeader, password);
            //push it onto the list
            volunteers.push(newVolunteer);
            let msg = {
                to: newVolunteer.email,
                from: "coletittle@ymail.com",
                subject: "Your Volunteer Account",
                text: "email was sent correctly",
            };
            mail_1.default
                .send(msg)
                .then(() => {
                console.log("Email sent");
            })
                .catch((error) => {
                console.error(error);
            });
            res.status(201).send(volunteers);
        }
        else {
            res.status(400).send("Couldn't create new volunteer object");
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
        let foundApplication = undefined;
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
    res.status(200).send(volunteerApplications);
}));
