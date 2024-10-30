import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VolunteerDetails() {
	const location = useLocation();
	const {
		id,
		firstName,
		lastName,
		phoneNumber,
		email,
		streetAddress,
		city,
		state,
		zipCode,
		areasOfHelp,
		teamLeader,
	} = location.state;
	const navigate = useNavigate();
	return (
		<div className="card">
			<div className="card-body">
				<h1>{firstName + " " + lastName}</h1>
				<p>{email}</p>
				<p>{phoneNumber}</p>
				<p>
					{streetAddress + ", " + city + ", " + state + " " + zipCode}
				</p>
				<p>
					{areasOfHelp.map((area, index) => (
						<li key={index}>{area}</li>
					))}
				</p>
				<p>Team Leader: {teamLeader ? "true" : "false"}</p>
			</div>
		</div>
	);
}

export default VolunteerDetails;
