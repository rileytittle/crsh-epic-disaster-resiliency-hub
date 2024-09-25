import express from "express";

let app = express();

app.use("/", (req, res) => {
	res.send("Hello mom!");
});

app.listen(3000);
