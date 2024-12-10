import { Router } from "express";

import { VolunteerApplication } from "../models/volunteerApplication.model";
import { Volunteer } from "../models/volunteer.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Pool } from "pg";
import { Job } from '../models/job.model';

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "Senior-Project",
	password: "A1a2a1234!",
	port: 5432,
});
const SECRET_KEY =
	"0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";

const app = Router();

/*************************************************DUMMMY DATA*********************************************************/
let volunteerApplications: VolunteerApplication[] = []; // Temporary storage of applications

let dummyVolunteers: Volunteer[] = [
  new Volunteer(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"], false,
    "password"
  ),
  new Volunteer(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"], false,
    "differentPassword"
  )
]
let dummyApplications: VolunteerApplication[] = [
  new VolunteerApplication(0, "Riley", "Tittle", 9047352653, "rileytittle02@gmail.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking"]),
  new VolunteerApplication(1, "Coleman", "George", 9047352653, "fake@email.com", "7816 Southside Blvd", "Jacksonville", "FL", 32256, ["Logistic Tracking", "Community Outreach"])
]
dummyApplications[1].evaluated = true
dummyApplications[1].rejected = true
dummyApplications[1].reasonRejected = "we are not accepting volunteers under 18 years old"
/*************************************************DUMMMY DATA*********************************************************/

app.post("/login", async (req, res) => {
	try {
		//write some logic here
		if(req.headers["authorization"]){
			let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
			let decodedUserInfo = atob(userInfo);
			let email= decodedUserInfo.split(':')[0];
			let password= decodedUserInfo.split(':')[1];
			console.log(email, password, decodedUserInfo, userInfo)
			let queryResult = await pool.query(
				'SELECT * FROM "VolunteerAccount" WHERE email = $1', 
				[email]
			);
			if(queryResult.rows.length > 0){
				let user = queryResult.rows[0]
				console.log(user.password)
				bcrypt.compare(password, user.password.trim(), (err, result)=>{
					console.log({ password, storedHash: user.password.trim(), err, result });
					if(result){
						let token = jwt.sign({email:user.email, isVolunteer:true}, SECRET_KEY);
						res.status(200).send({token:token});
					}
					else{
						res.status(401).send({status:401, message:'Incorrect password'});
					}
				})
			}
			else{
				res.status(401).send({message:'No account with that email found'})
			}
		}
		else{
			res.status(401).send({message: 'missing required login details'})
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

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

app.post("/status", (req, res) => {
  const { firstName, lastName } = req.body;

  // Create a new instance of VolunteerApplication
  const index = dummyApplications.findIndex(applicant => applicant.firstName.toLowerCase() == firstName.toLowerCase() && applicant.lastName.toLowerCase() == lastName.toLowerCase())

  if (index != -1) {
    if (!dummyApplications[index].evaluated) {
      res.status(200).json({ message: `Your application is pending!` });
    } else {
      if (dummyApplications[index].rejected) {
        if (dummyApplications[index].reasonRejected == '') {
          res.status(200).json({ message: `Your application has been rejected for an unknown reason` });
        } else {
          res.status(200).json({ message: `Your application has been rejected because ${dummyApplications[index].reasonRejected}` });
        }
      }
    }

    console.log(dummyVolunteers[index])
  } else {
    res.status(401).json({ message: 'Name Not Found' });
  }
});

//added by Corey
let jobs = new Set<Job>();  
let schedule = new Set<Job>(); 

//temporary jobs meant to simulate an admin offering new jobs to the volunteer
const hardcodedJobs: Job[] = [
  new Job(1, "John", "Smith", "JSmith@email.com", 1234567890, "123 Florida Street", "Apt 101", "Orlando", "Fl", 12345, ["cleanup"], "cleanup", "cleanup"),
  new Job(2, "Jack", "Johnson", "JJohnson@email.com", 2345678901, "456 Dunn Creek Road", "Suite 202", "Tampa", "Fl", 12345, ["tree removal"], "tree removal", "tree removal"),
  new Job(3, "Jenny", "Garfunkle", "JGarfunkle@email.com", 3456789012, "789 Grover Court", "None", "Yulee", "Fl", 12345, ["roofing"], "roofing", "roofing"),
  new Job(4, "Trevor", "Moore", "TMoore@email.com", 4567890123, "135 Chemtrail Street", "None", "Orlando", "Fl", 12345, ["water damage"], "water damage", "water damage"),
  new Job(5, "Harriet", "Truman", "HTruman@email.com", 5678901234, "675 Joemama Road", "Apt 303", "Jacksonville", "Fl", 12345, ["food delivery"], "food delivery", "food delivery")
];

app.post("/job/accept", async (req, res) => {
  try {
    
	if (jobs.size > 0) {
		// Get the first job from the jobs set
		const jobIterator = jobs.values();
		const jobToSchedule = jobIterator.next().value;  // Extract the first job from the iterator
	
		if (jobToSchedule) {
			
			schedule.add(jobToSchedule);
			jobs.delete(jobToSchedule);
	
			console.log(`Job '${jobToSchedule.id} - ${jobToSchedule.firstName} ${jobToSchedule.lastName}' has been scheduled.`);  // For debugging
		}
	}
    
    res.status(200).send("Job accepted"); 
  } catch (e) {
    res.status(400).send("Problem rejected job choice");
  }
});

app.post("/job/reject", async (req, res) => {
  try {
    
	if (jobs.size > 0) {
		// Get the first job from the jobs set
		const jobIterator = jobs.values();
		const jobToSchedule = jobIterator.next().value;  // Extract the first job from the iterator
	
		if (jobToSchedule) {
			
			jobs.delete(jobToSchedule);
	
			console.log(`Job '${jobToSchedule.id} - ${jobToSchedule.firstName} ${jobToSchedule.lastName}' has been rejected.`);  // For debugging
		}
	}
    
    res.status(200).send("Job rejected"); 
  } catch (e) {
    res.status(400).send("Problem rejected job choice");
  }
});

app.post("/job/job-completed", async (req, res) => {
  try {

    const details = req.body.details;

    if (details) {
      console.log("Details received:", details); // Log the details to the console
    } else {
      console.log("No details provided.");
    }
    
	  if (jobs.size > 0) {
      // Get the first job from the jobs set
      const jobIterator = schedule.values();
      const jobToDelete = jobIterator.next().value;  // Extract the first job from the iterator
	
      if (jobToDelete) {
        
        schedule.delete(jobToDelete);
    
        console.log(`Job '${jobToDelete.id} - ${jobToDelete.firstName} ${jobToDelete.lastName}' has been reported as completed.`);  // For debugging
      }
	  }
    
    res.status(200).send("Job rejected"); 
  } catch (e) {
    res.status(400).send("Problem rejected job choice");
  }
});

app.get("/job/schedule", async (req, res) => {

  res.json(Array.from(schedule));  // Convert the Set to an array to send it as JSON
});

app.get("/job/offered", (req, res) => {
	// Initialize the jobs set if not already initialized
	if (!jobs) {
	  jobs = new Set();
	}
  
	// If no jobs are in the set, add one
	if (jobs.size === 0) {
	  const randomJobNumber = Math.floor(Math.random() * 5);
	  
	  const jobToAdd = hardcodedJobs[randomJobNumber]; 
	  jobs.add(jobToAdd);
	  console.log(`Assigned job: ${jobToAdd}`);
	  console.log(`Schedule size: ${schedule.size}`);  
	}
  
	// Return the jobs as an array
	res.json(Array.from(jobs)); 
  });


export { app }; 
