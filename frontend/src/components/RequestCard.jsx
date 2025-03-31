import React from "react";
import { Link } from "react-router-dom";

function RequestCard({
	id,
	firstName,
	lastName,
	email,
	phoneNumber,
	streetAddress1,
	streetAddress2,
	city,
	state,
	zip,
	county,
	status,
	reasonRejected,
	helpType,
	other,
	description,
	dateCreated,
	timeCreated,
}) {
	return (
		<div className="card" style={{ width: 20 + "rem" }}>
			<div className="card-body">
				<h5 className="card-title">{firstName + " " + lastName}</h5>
				<h6>{status}</h6>
				<h7>{county} County</h7>
				<br></br>
				<h7>{zip}</h7>
				<h7 className="card-subtitle mb-2 text-body-secondary">
					<ul>
						{helpType.map((area, index) => (
							<li key={index}>{area}</li>
						))}
					</ul>
				</h7>
				<Link
					to="/homeowner-requests/request-details"
					className="card-link"
					state={{
						id,
						firstName,
						lastName,
						email,
						phoneNumber,
						streetAddress1,
						streetAddress2,
						city,
						state,
						zip,
						county,
						status,
						reasonRejected,
						helpType,
						other,
						description,
						dateCreated,
						timeCreated,
					}}
				>
					More info
				</Link>
			</div>
		</div>
	);
}

export default RequestCard;
