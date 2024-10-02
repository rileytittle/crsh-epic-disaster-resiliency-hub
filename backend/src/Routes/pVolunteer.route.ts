import { Router } from "express";
import { VolunteerApplication } from "../Models/volunteerApplication.model";

const router = Router(); 

let volunteerApplications: VolunteerApplication[] = []; // Temporary storage of applications

router.post("/create", (req, res) => {
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

export default router; 
