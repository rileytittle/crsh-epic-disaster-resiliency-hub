import express from "express";
import { helpRequest } from "../models/helpRequest.model";
import { HomeownerApplication } from "../models/homeownerApplication.model";


let app = express.Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
  res.send("Homeowner Assistance Backend");
});
let requests:helpRequest[] = [];
let dummy1 = new helpRequest(
  'Hayden',
  "O'Neill",
  "haydeno221@outlook.com",
  "9274 Real Street",
  "Jacksonville",
  "florida",
  4325,
  "Emotional Support"

)
requests.push(dummy1);

app.get("/viewRequests", (req, res) => {
  if (requests.length > 0) {
    res.status(200).json(requests); 
  } else {
    res.status(404).json({ message: 'No requests found.' }); 
  }
});


app.post("/requestHelp", (req, res) => {
  const { firstName, lastName, email, phone, address_1, address_2, city, state, zip, helpType, other } = req.body;
  const id = Math.floor(Math.random() * 100000);

  // Create a new instance of VolunteerApplication
  const newHomeownerRequest = new HomeownerApplication(
    id,
    firstName,
    lastName,
    email,
    phone,
    address_1,
    address_2,
    city,
    state,
    zip,
    helpType,
    other,
  );

  // Add the new volunteer to the list
  HomeownerApplications.push(newHomeownerRequest);
  console.log(newHomeownerRequest)
  res.status(200).send({ message: 'Request Submitted' })
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
  } else {
    res.status(404).json({ message: 'Request not found.' });
  }
});
export { app };
