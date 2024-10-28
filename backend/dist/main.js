"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pVolunteer_route_1 = __importDefault(require("./Routes/Volunteer.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/pVolunteer", pVolunteer_route_1.default);
app.get("/", (req, res) => {
    res.send("Hello mom!");
});
app.listen(3001);
