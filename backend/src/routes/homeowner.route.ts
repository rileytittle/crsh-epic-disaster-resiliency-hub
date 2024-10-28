import express from "express";

let app = express.Router();
//app.use(express.json());       
//app.use(express.urlencoded({extended: true})); 

app.get("/", (req, res) => {
	res.send("Homeowner Assistance Backend");
});

app.post("/requestHelp", (req, res) => {
    if (
		req.body.inputFirstName
        && req.body.inputLastName
	) {
		let firstName = req.body.inputFirstName
        let lastName = req.body.inputLastName
		let email = req.body.inputEmail
        let address = req.body.inputAddress
        let city = req.body.inputCity
        let state = req.body.inputState
        let zip = req.body.inputZip
        let helpType = req.body.inputHelpType
		res.status(200).send({message:'Form Submitted'})
    } else {
		res.status(400).send({message:'Missing Required Attributes'})
	}
});
app.get("/requestHelp", (req, res) => {
	res.send("Here is your Help!");
});

export { app };