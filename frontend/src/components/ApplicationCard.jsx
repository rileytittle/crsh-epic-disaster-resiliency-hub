import React from "react";

const ApplicationCard = ({ id, firstName, lastName, email, areasOfHelp }) => {
	return (
		<div className="card" style={{ width: 20 + "rem" }}>
			<div className="card-body">
				<h5 className="card-title">{firstName + " " + lastName}</h5>
				<h6 className="card-subtitle mb-2 text-body-secondary">
					{email}
				</h6>
				<p className="card-text">
					{areasOfHelp.map((area, index) => (
						<li key={index}>{area}</li>
					))}
				</p>
				<a href="#" className="card-link">
					Reject Applicant
				</a>
				<a href="#" className="card-link">
					Create Volunteer
				</a>
			</div>
		</div>
	);
};

export default ApplicationCard;
