"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const homeownerApplication_model_1 = require("../models/homeownerApplication.model");
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
let app = (0, express_1.Router)();
exports.app = app;
let HomeownerApplications = []; // database
app.get("/", (req, res) => {
    res.send("Homeowner Assistance Backend");
});
let requests = [];
requests.push(new homeownerApplication_model_1.HomeownerApplication(999, "Hayden", "O'Neill", "haydeno221@outlook.com", 9045555555, "9274 Real Street", "", "Jacksonville", "florida", 43325, ["Emotional Support"], "")); //
app.get("/viewRequests", (req, res) => {
    if (requests.length > 0) {
        res.status(200).json(requests);
    }
    else {
        res.status(404).json({ message: "No requests found." });
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
        let result = pool.query(`INSERT INTO request (first_name, last_name, email, phone_number, street_address_1, street_address_2, city, state, zip_code, status, yard_cleanup, interior_cleanup, emotional_support, cleaning_supplies, clean_water, emergency_food, other)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`, [
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
        ]);
        res.status(200).send({ message: "Request succcessfully Submitted" });
    }
    catch (e) {
        res.status(400).send({ message: "Something went wrong" });
        console.log(e);
    }
    // Add the new volunteer to the list
});
app.get("/requestHelp", (req, res) => {
    res.send("Here is your Help!");
});
