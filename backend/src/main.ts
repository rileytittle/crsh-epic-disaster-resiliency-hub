import express from "express";
import cors from "cors";
import volunteerRoutes from "./Routes/pVolunteer.route";

const app = express();
app.use(cors());

app.use(express.json());


app.use("/pVolunteer", volunteerRoutes);

app.get("/", (req, res) => {
    res.send("Hello mom!");
});


app.listen(3000);
