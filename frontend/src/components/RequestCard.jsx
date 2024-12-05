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
	helpType,
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
				<p className="card-text">
					{helpType.map((helpType, index) => (
						<li key={index}>{helpType}</li>
					))}
				</p>
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
						helpType,
					}}
				>
					More info
				</Link>
			</div>
		</div>
	);
}

export default RequestCard;
