import express from "express";
import { HomeownerApplication } from "../models/homeownerApplication.model";

let app = express.Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
  res.send("Homeowner Assistance Backend");
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

export { app };