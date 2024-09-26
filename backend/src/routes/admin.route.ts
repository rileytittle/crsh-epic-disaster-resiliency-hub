import { Router } from "express";
let app = Router();

app.post("/", (req, res) => {
	res.status(201).send("recieved");
});
