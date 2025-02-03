import express from "express";
import { HomeownerApplication } from "../models/homeownerApplication.model";


let app = express.Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
  res.send("Homeowner Assistance Backend");
});
let requests: HomeownerApplication[] = [];
let dummy1 = new HomeownerApplication(
  999,
  'Hayden',
  "O'Neill",
  "haydeno221@outlook.com",
  9045555555,
  "9274 Real Street",
  "",
  "Jacksonville",
  "florida",
  43325,
  ["Emotional Support"],
  ""
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
  const { first_name, last_name, email, phone_number, street_address_1, street_address_2, city, state, zip_code, helpTypes, other } = req.body;
  const id = Math.floor(Math.random() * 100000);

  // Create a new instance of VolunteerApplication
  const newHomeownerRequest = new HomeownerApplication(
    id,
    first_name,
    last_name,
    email,
    phone_number,
    street_address_1,
    street_address_2,
    city,
    state,
    zip_code,
    helpTypes,
    other
  );

  // Add the new volunteer to the list
  HomeownerApplications.push(newHomeownerRequest);
  console.log(newHomeownerRequest)
  res.status(200).send({ message: 'Request Submitted' })
});

app.get("/requestHelp", (req, res) => {
  res.send("Here is your Help!");
});

/*
app.post("/update-assignment", (req, res) => {
  const { requestName, volunteers } = req.body;

  // Find the request by ID (assuming requestId corresponds to the index in requests array)
  const request = requests.find((req) => req.first_name + req.last_name === requestName); // Adjust if request does not have an id property

  if (request) {
    request.assignedVolunteers.push(volunteers); // Update the assigned volunteers
    console.log(JSON.stringify(request));
    res.status(200).json({ message: 'Volunteers assigned successfully!' });
  } else {
    res.status(404).json({ message: 'Request not found.' });
  }
});
*/
export { app };
