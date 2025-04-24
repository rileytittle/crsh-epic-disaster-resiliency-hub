import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const SECRET_KEY = process.env.SECRET_KEY || "unsecured";
let AdminAuthChecker = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers["authorization"]) {
		let header = req.headers["authorization"];
		if (header.includes("Bearer")) {
			let token = header.split(" ")[1];
			try {
				let payload = jwt.verify(token, SECRET_KEY) as any;
				if (payload.userType == "admin") {
					res.setHeader("loggedinuser", payload.email);
					next();
				} else {
					res.status(401).send({ message: "Unauthorized 1" });
				}
			} catch (e) {
				console.log(e);
				res.status(401).send({ message: "Unauthorized 2" });
			}
		} else if (header.includes("Basic") && req.url == "/login") {
			next();
		} else res.status(401).send({ message: "Unauthorized 3" });
	} else {
		res.status(401).send({ message: "Unauthorized - no header" });
	}
};
export { AdminAuthChecker };
