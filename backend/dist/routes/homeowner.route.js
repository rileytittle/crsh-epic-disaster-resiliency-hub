"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));

const helpRequest_model_1 = require("../models/helpRequest.model");

let app = express_1.default.Router();
exports.app = app;
//app.use(express.json());       
//app.use(express.urlencoded({extended: true})); 
app.get("/", (req, res) => {
    res.send("Homeowner Assistance Backend");
});

let requests = [];
let dummy1 = new helpRequest_model_1.helpRequest('Hayden', "O'Neill", "haydeno221@outlook.com", "9274 Real Street", "Jacksonville", "florida", 4325, "Emotional Support");
requests.push(dummy1);
app.get("/viewRequests", (req, res) => {
    if (requests.length > 0) {
        res.status(200).json(requests);
    }
    else {
        res.status(404).json({ message: 'No requests found.' });
    }
});

app.post("/requestHelp", (req, res) => {
    if (req.body.inputFirstName
        && req.body.inputLastName) {
        let firstName = req.body.inputFirstName;
        let lastName = req.body.inputLastName;
        let email = req.body.inputEmail;
        let address = req.body.inputAddress;
        let city = req.body.inputCity;
        let state = req.body.inputState;
        let zip = req.body.inputZip;
        let helpType = req.body.inputHelpType;
        res.status(200).send({ message: 'Form Submitted' });
    }
    else {
        res.status(400).send({ message: 'Missing Required Attributes' });
    }
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

