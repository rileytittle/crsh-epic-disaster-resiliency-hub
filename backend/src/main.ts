import express from "express";
const functions = require("firebase-functions");

let app = express();

app.use("/", (req, res) => {
	res.send("Hello mom!");
});

app.listen(3000);

module.exports = app;
