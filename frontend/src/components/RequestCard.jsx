import React from "react";
import { Link } from "react-router-dom";

function RequestCard({
	id,
	firstName,
	lastName,
	email,
	address,
	city,
	state,
	zip,
}) {
	return (
		<div className="card" style={{ width: 20 + "rem" }}>
			<div className="card-body">
				<h5 className="card-title">{firstName + " " + lastName}</h5>
				<h6 className="card-subtitle mb-2 text-body-secondary">
					{email}
					<br></br>
					{address + ", " + city + ", " + state + " " + zip}
				</h6>
				<Link
					to="/homeowner-requests/request-details"
					className="card-link"
					state={{
						id,
						firstName,
						lastName,
						email,
						address,
						city,
						state,
						zip,
					}}
				>
					More info
				</Link>
			</div>
		</div>
	);
}

export default RequestCard;
