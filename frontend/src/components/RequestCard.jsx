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
		<div className="card mb-3" style={{ width: 20 + "rem" }}>
			<div className="card-body">
				<h3 className="card-title">{firstName + " " + lastName}</h3>
				<h5>{email}</h5>
				<h5>{phoneNumber}</h5>
				<div>
					{county} County, {zip}
				</div>
				<div>Wants help with:</div>
				<div className="card-subtitle mb-2 text-body-secondary">
					<ul>
						{helpType.map((area, index) => (
							<li key={index}>{area}</li>
						))}
					</ul>
				</div>
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
