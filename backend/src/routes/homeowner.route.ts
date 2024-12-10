import express from "express";
import { helpRequest } from "../models/helpRequest.model";
import { HomeownerApplication } from "../models/homeownerApplication.model";


let app = express.Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
  res.send("Homeowner Assistance Backend");
});
/*************************************************DUMMMY DATA*********************************************************/
let requests: helpRequest[] = [];
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
/*********************************************************************************************************************/
let dummyRequests: HomeownerApplication[] = [
  new HomeownerApplication(
    1,
    "Harrison",
    "A",
    "HarrisonBardon@gmail.com",
    2156797318,
    "21 Princeton Ave",
    "",
    "Auburn",
    "Maine",
    4210,
    ["Emotional Support", "Cleaning Supplies", "Clean Water", "Emergency Food"],
    ""
  ),
  new HomeownerApplication(
    2,
    "Harrison",
    "B",
    "LandonCompagna@gmail.com",
    5052090323,
    "103 Heatherlynn Cir",
    "",
    "Clinton",
    "Mississippi",
    39056,
    ["Emotional Support", "Cleaning Supplies", "Clean Water", "Emergency Food"],
    ""
  ),
  new HomeownerApplication(
    3,
    "Harrison",
    "C",
    "ClarettaSwymer@gmail.com",
    4722613412,
    "52 Haleys Rd",
    "",
    "Susquehanna",
    "Pennsylvania",
    18847,
    ["Emotional Support", "Cleaning Supplies", "Clean Water", "Emergency Food"],
    ""
  )
];
dummyRequests[0].evaluated = false;
dummyRequests[1].evaluated = true;
dummyRequests[2].evaluated = true;
dummyRequests[2].rejected = true;
dummyRequests[2].reasonRejected = "you are out of our radius";
/*************************************************DUMMMY DATA*********************************************************/
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

  // Create a new instance of HomeownerApplication
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

  // Add the new homeowner to the list
  HomeownerApplications.push(newHomeownerRequest);
  console.log(newHomeownerRequest)
  res.status(200).send({ message: 'Request Submitted' })
});

app.post("/requestHelp/status", (req, res) => {
  const { firstName, lastName } = req.body;
  let checker = false;
  for (let i=0; i < dummyRequests.length; i++) {
    if (dummyRequests[i].firstName == firstName && dummyRequests[i].lastName == lastName) {
      checker = true;
        if (dummyRequests[i].evaluated == true) {
          if (dummyRequests[i].rejected == true) {
            res.status(200).json({ message: `Your request has been denied because ${dummyRequests[i].reasonRejected}` });
          } else {
            res.status(200).json({ message: 'Your request has been approved!' });
          }
        } else {
          res.status(200).json({ message: 'Your request is being evaluated.' });
        }
        break
    }
}
if (!checker) {
  res.status(404).json({ message: 'Request not Found.' });
}
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
