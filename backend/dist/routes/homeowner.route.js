"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const homeownerApplication_model_1 = require("../models/homeownerApplication.model");
let app = express_1.default.Router();
exports.app = app;
let HomeownerApplications = []; // database
app.get("/", (req, res) => {
    res.send("Homeowner Assistance Backend");
});
app.post("/requestHelp", (req, res) => {
    const { firstName, lastName, email, phone, address_1, address_2, city, state, zip, helpType, other } = req.body;
    const id = Math.floor(Math.random() * 100000);
    // Create a new instance of VolunteerApplication
    const newHomeownerRequest = new homeownerApplication_model_1.HomeownerApplication(id, firstName, lastName, email, phone, address_1, address_2, city, state, zip, helpType, other);
    // Add the new volunteer to the list
    HomeownerApplications.push(newHomeownerRequest);
    console.log(newHomeownerRequest);
    res.status(200).send({ message: 'Request Submitted' });
});
app.get("/requestHelp", (req, res) => {
    res.send("Here is your Help!");
});
