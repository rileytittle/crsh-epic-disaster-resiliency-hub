"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authchecker = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = "0fb5f53f4d7ae5114979d94d01ddf11bf7e11d30dadf025732642995194fdf5fa0e62d5f726de0315e09c780319f98e512dc3c3a6c0ea8c847e7f1e76885bcd0";
let Authchecker = (req, res, next) => {
    if (req.headers["authorization"]) {
        let header = req.headers["authorization"];
        if (header.includes("Bearer")) {
            let token = header.split(" ")[1];
            try {
                let payload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
                res.setHeader("loggedinuser", payload.email);
                next();
            }
            catch (e) {
                console.log(e);
                res.status(401).send({ message: "Unauthorized" });
            }
        }
        else if (header.includes("Basic") && req.url == "/login") {
            next();
        }
        else {
            res.status(401).send({ message: "Unauthorized" });
        }
    }
    else {
        res.status(401).send({ message: "Unauthorized" });
    }
};
exports.Authchecker = Authchecker;
