import { Router, application } from "express";
import { HomeownerApplication } from "../models/homeownerApplication.model";
import { Authchecker } from "../utils/auth.utils";
import { Pool } from "pg";
import { Job } from "../models/job.model";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});
let app = Router();

let HomeownerApplications: HomeownerApplication[] = []; // database

app.get("/", (req, res) => {
	res.send("Homeowner Assistance Backend");
});
let requests: HomeownerApplication[] = [];
requests.push(
	new HomeownerApplication(
		999,
		"Hayden",
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
); //

app.get("/viewRequests", async (req, res) => {
	let sendRequests: Job[] = [];
	try {
	  // Query to get rows with the "Active" status
	  const result = await pool.query(
		'SELECT * FROM "Request" WHERE status = $1',
		['Active']
	  );
  
	  // Define the columns with boolean values representing help types
	  const helpTypeColumns = [
		'emotional_support',
		'cleaning_supplies',
		'clean_water',
		'emergency_food',
		'yard_cleanup',
		'interior_cleanup',
		
	  ];
  
	  // Map the result rows to an array of Job objects
	  result.rows.forEach(row => {
		const helpType: string[] = [];
  
		
		helpTypeColumns.forEach(column => {
		  if (row[column]) {
			
			const label = column
			  .replace(/_/g, ' ')  // Replace underscores with spaces
			  .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize each word
  
			helpType.push(label);
		  }
		});
  
		
		const newJob = new Job(
		  row.id, 
		  row.first_name,  
		  row.last_name,  
		  row.email,  
		  row.street_address_1,  
		  row.city,  
		  row.state,  
		  row.zip_code,  
		  helpType,
		  row.other  
		);
		sendRequests.push(newJob);
	  });
  
	
	  if (sendRequests.length > 0) {
		res.status(200).json(sendRequests);  
	  } else {
		res.status(404).json({ message: "No requests found." });  
	  }
	} catch (e) {
	  console.error('Error querying database', e);
	  res.status(500).json({ message: 'Internal Server Error' });  
	}
  });

app.post("/requestHelp", async (req, res) => {
	console.log(req.body);

	const first_name = req.body.first_name;
	const last_name = req.body.last_name;
	const email = req.body.email;
	const phone_number = req.body.phone_number;
	const street_address_1 = req.body.street_address_1;
	const street_address_2 = req.body.street_address_2;
	const city = req.body.city;
	const state = req.body.state;
	const zip_code = req.body.zip_code;
	const county = req.body.county;
	const yard_cleanup = req.body.helpExterior;
	const interior_cleanup = req.body.helpInterior;
	const emotional_support = req.body.helpEmotional;
	const cleaning_supplies = req.body.helpSupplies;
	const clean_water = req.body.helpWater;
	const emergency_food = req.body.helpFood;
	const other = req.body.other;

	console.log("yard_cleanup:", req.body.yard_cleanup);
	console.log("interior_cleanup:", req.body.interior_cleanup);
	// send data to the database test
	console.log(`first_name: ${first_name}`);
	console.log(`last_name: ${last_name}`);
	console.log(`email: ${email}`);
	console.log(`phone_number: ${phone_number}`);
	console.log(`street_address_1: ${street_address_1}`);
	console.log(`street_address_2: ${street_address_2}`);
	console.log(`city: ${city}`);
	console.log(`state: ${state}`);
	console.log(`zip_code: ${zip_code}`);
	console.log(`yard_cleanup: ${yard_cleanup}`);
	console.log(`interior_cleanup: ${interior_cleanup}`);
	console.log(`emotional_support: ${emotional_support}`);
	console.log(`cleaning_supplies: ${cleaning_supplies}`);
	console.log(`clean_water: ${clean_water}`);
	console.log(`emergency_food: ${emergency_food}`);
	console.log(`other: ${other}`);

	try {
		let result = pool.query(
			`INSERT INTO request (first_name, last_name, email, phone_number, street_address_1, street_address_2, city, state, zip_code, status, yard_cleanup, interior_cleanup, emotional_support, cleaning_supplies, clean_water, emergency_food, other)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
			[
				first_name,
				last_name,
				email,
				phone_number,
				street_address_1,
				street_address_2,
				city,
				state,
				zip_code,
				"Pending",
				yard_cleanup,
				interior_cleanup,
				emotional_support,
				cleaning_supplies,
				clean_water,
				emergency_food,
				other,
			]
		);
		res.status(200).send({ message: "Request succcessfully Submitted" });
	} catch (e) {
		res.status(400).send({ message: "Something went wrong" });
		console.log(e);
	}
	// Add the new volunteer to the list
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
