"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = require("express");
const job_model_1 = require("../models/job.model");
let app = (0, express_1.Router)();
exports.app = app;
let jobs = new Set();
let schedule = new Set();
const hardcodedJobs = [
    new job_model_1.Job("1", "John", "Smith", "JSmith@email.com", "123 Flordia Street", "Orlando", "Fl", "12345", "cleanup", "cleanup"),
    new job_model_1.Job("2", "Jack", "Johnson", "JJohnson@email.com", "456 Dunn Creek Road", "Tampe", "Fl", "12345", "tree removal", "tree removal"),
    new job_model_1.Job("3", "Jenny", "Garfunkle", "JGarfunkle@email.com", "789 Grover Court", "Yulee", "Fl", "12345", "roofing", "roofing"),
    new job_model_1.Job("4", "Trevor", "Moore", "TMoore@email.com", "135 Chemtrail Street", "Orlando", "Fl", "12345", "water damage", "water damage"),
    new job_model_1.Job("5", "Hariet", "Truman", "HTruman@email.com", "675 Joemama Road", "Jacksonville", "Fl", "12345", "food delivery", "food delivery"),
];
app.post("/job/accept", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (jobs.size > 0) {
            // Get the first job from the jobs set
            const jobIterator = jobs.values();
            const jobToSchedule = jobIterator.next().value; // Extract the first job from the iterator
            if (jobToSchedule) {
                schedule.add(jobToSchedule);
                jobs.delete(jobToSchedule);
                console.log(`Job '${jobToSchedule.id} - ${jobToSchedule.firstName} ${jobToSchedule.lastName}' has been scheduled.`); // For debugging
            }
        }
        res.status(200).send("Job accepted");
    }
    catch (e) {
        res.status(400).send("Problem rejected application");
    }
}));
app.get("/job/schedule", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(Array.from(schedule)); // Convert the Set to an array to send it as JSON
}));
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
