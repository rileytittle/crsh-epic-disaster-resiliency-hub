"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("./routes/admin.route");
const homeowner_route_1 = require("./routes/homeowner.route");
const Volunteer_route_1 = require("./routes/Volunteer.route");
const port = process.env.PORT || 3000;
let cors = require("cors");
let app = (0, express_1.default)();
let vercelURL = "https://crsh-epic-disaster-resiliency-hub-client.vercel.app";
let localURL = "http://localhost:5173";
app.use(express_1.default.json());
app.use(cors({
    origin: "https://crsh-epic-disaster-resiliency-hub-client.vercel.app",
}));
app.get("/", (req, res) => {
    try {
        //write some logic here
        res.status(200).send("Your app deployed!");
    }
    catch (e) {
        res.status(500).send(e);
    }
});
app.use("/admin", admin_route_1.app);
app.use("/homeowner", homeowner_route_1.app);
app.use("/volunteer", Volunteer_route_1.app);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
exports.default = app;
