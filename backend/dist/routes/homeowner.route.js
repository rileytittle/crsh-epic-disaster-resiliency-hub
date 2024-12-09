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
const express_1 = __importDefault(require("express"));
const helpRequest_model_1 = require("../models/helpRequest.model");
const homeownerApplication_model_1 = require("../models/homeownerApplication.model");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "Senior-Project",
    password: "garnetisGold!1820",
    port: 5432,
});
let app = express_1.default.Router();
exports.app = app;
let HomeownerApplications = []; // database
app.get("/", (req, res) => {
    res.send("Homeowner Assistance Backend");
});
let requests = [];
let dummy1 = new helpRequest_model_1.helpRequest(1, 'Hayden', "O'Neill", "haydeno221@outlook.com", "9274 Real Street", "Jacksonville", "florida", 4325, "Emotional Support");
requests.push(dummy1);
app.get("/viewRequests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure status is checked correctly in SQL
        const result = yield pool.query('SELECT * FROM "Request" WHERE "status" = $1', // Using parameterized query
        ['Active']);
        if (result.rowCount && result.rowCount > 0) {
            res.status(200).json(result.rows.map((request) => ({
                id: request.id,
                firstname: request.first_name,
                lastname: request.last_name,
                email: request.email,
                address: request.street_address_1
            })));
        }
        else {
            res.status(404).json({ message: 'No requests found.' });
        }
    }
    catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error while fetching requests.' });
    }
}));
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
app.post("/update-assignment", (req, res) => {
    const { requestName, volunteers } = req.body;
    // Find the request by ID (assuming requestId corresponds to the index in requests array)
    const request = requests.find((req) => req.firstName + req.lastName === requestName); // Adjust if request does not have an id property
    if (request) {
        request.assignedVolunteers.push(volunteers); // Update the assigned volunteers
        console.log(JSON.stringify(request));
        res.status(200).json({ message: 'Volunteers assigned successfully!' });
    }
    else {
        res.status(404).json({ message: 'Request not found.' });
    }
});
