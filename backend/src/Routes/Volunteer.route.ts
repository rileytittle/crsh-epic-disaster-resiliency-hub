import { Router } from "express";

import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";

const app = Router();

let volunteerApplications: VolunteerApplication[] = []; // Temporary storage of applications

let dummyVolunteers: Volunteer[] = [
  new Volunteer(
    0,
    "Riley",
    "Tittle",
    9047352653,
    "rileytittle02@gmail.com",
    "7816 Southside Blvd",
    "Jacksonville",
    "FL",
    32256,
    ["Logistic Tracking"],
    false,
    "password"
  ),
  new Volunteer(
    1,
    "Coleman",
    "George",
    9047352653,
    "fake@email.com",
    "7816 Southside Blvd",
    "Jacksonville",
    "FL",
    32256,
    ["Logistic Tracking", "Community Outreach"],
    false,
    "differentPassword"
  )
]

app.post("/create", (req, res) => {

  const { firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp } = req.body;
  const id = Math.floor(Math.random() * 10000);

  // Create a new instance of VolunteerApplication
  const newVolunteer = new VolunteerApplication(
    id,
    firstName,
    lastName,
    phoneNumber,
    email,
    streetAddress,
    city,
    state,
    zipCode,
    areasOfHelp
  );

  // Add the new volunteer to the list
  volunteerApplications.push(newVolunteer);

  res.status(201).json({ message: 'Volunteer Application Created', volunteer: newVolunteer });
});

app.post("/changePassword", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  // Create a new instance of VolunteerApplication
  const index = dummyVolunteers.findIndex(volunteer => volunteer.id == username)

  console.log(`${dummyVolunteers[0].id} == ${username} (${index})`)
  if (index != -1) {
    if (dummyVolunteers[index].password == currentPassword) {
      dummyVolunteers[index].password = newPassword
      res.status(200).json({ message: 'Password Succesfully Updated' });
      console.log(dummyVolunteers[index])
    } else {
      res.status(401).json({ message: 'Old Password does not match' });
    }
  } else {
    res.status(401).json({ message: 'Username Not Found' });
  }
});

app.post("/resetPassword", (req, res) => {
  const { username } = req.body;

  // Create a new instance of VolunteerApplication
  const index = dummyVolunteers.findIndex(volunteer => volunteer.id == username)
  const newPassword = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

  if (index != -1) {
      dummyVolunteers[index].password = newPassword.toString()
      res.status(200).json({ message: `Password Reset; new password is ${newPassword}` });
      console.log(dummyVolunteers[index])
  } else {
    res.status(401).json({ message: 'Username Not Found' });
  }
});

export { app }; 
