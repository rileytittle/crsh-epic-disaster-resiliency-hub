"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("./routes/admin.route");
let cors = require("cors");
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors({
    origin: "http://localhost:5173", // Allow only this origin
}));
app.use("/admin", admin_route_1.app);
app.listen(3000);
