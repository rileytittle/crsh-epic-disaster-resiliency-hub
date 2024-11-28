import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

let Authchecker = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers["authorization"]) {
		let header = req.headers["authorization"];
		if (header.includes("Bearer")) {
			let token = header.split(" ")[1];
			try {
				let payload = jwt.verify(token, "SECRETKEY") as any;
				res.setHeader("loggedinuser", payload.email);
				next();
			} catch (e) {
				console.log(e);
				res.status(401).send({ message: "Unauthorized" });
			}
		} else if (header.includes("Basic") && req.url == "/login") {
			next();
		} else {
			res.status(401).send({ message: "Unauthorized" });
		}
	} else {
		res.status(401).send({ message: "Unauthorized" });
	}
};
export { Authchecker };
