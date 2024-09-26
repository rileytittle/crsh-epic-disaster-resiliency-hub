"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("./routes/admin.route");
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/admin", admin_route_1.app);
app.use("/", (req, res) => {
    res.send("Hello mom!");
});
app.listen(3000);
