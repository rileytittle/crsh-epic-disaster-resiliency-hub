import express from "express";
import { app as AdminRouter } from "./routes/admin.route";

let app = express();
app.use(express.json());

app.use("/admin", AdminRouter);
app.use("/", (req, res) => {
	res.send("Hello mom!");
});

app.listen(3000);
