import { Router } from "express";
import { Job } from '../models/job.model';

let app = Router();


let jobs = new Set<Job>();  
let schedule = new Set<Job>(); 

const hardcodedJobs: Job[] = [
	new Job("1", "John", "Smith", "JSmith@email.com", "123 Flordia Street", "Orlando", "Fl", "12345", "cleanup", "cleanup"),
	new Job("2", "Jack", "Johnson", "JJohnson@email.com", "456 Dunn Creek Road", "Tampe", "Fl", "12345", "tree removal", "tree removal"),
	new Job("3", "Jenny", "Garfunkle", "JGarfunkle@email.com", "789 Grover Court", "Yulee", "Fl", "12345", "roofing", "roofing"),
	new Job("4", "Trevor", "Moore", "TMoore@email.com", "135 Chemtrail Street", "Orlando", "Fl", "12345", "water damage", "water damage"),
	new Job("5", "Hariet", "Truman", "HTruman@email.com", "675 Joemama Road", "Jacksonville", "Fl", "12345", "food delivery", "food delivery"),
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
    res.status(400).send("Problem rejected application");
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