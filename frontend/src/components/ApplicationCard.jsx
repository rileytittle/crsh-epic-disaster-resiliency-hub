import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const ApplicationCard = ({
	id,
	firstName,
	lastName,
	phoneNumber,
	streetAddress1,
	streetAddress2,
	zipCode,
	state,
	email,
	areasOfHelp,
}) => {
	return (
		<div className="card" style={{ width: 20 + "rem" }}>
			<div className="card-body">
				<h5 className="card-title">{firstName + " " + lastName}</h5>
				<h6 className="card-subtitle mb-2 text-body-secondary">
					{email}
				</h6>
				<h6 className="card-subtitle mb-2 text-body-secondary">
					{phoneNumber}
				</h6>
				<p className="card-text">
					{areasOfHelp.map((area, index) => (
						<li key={index}>{area}</li>
					))}
				</p>
				<Link
					to="/volunteer/confirm-rejection"
					state={{
						firstName,
						lastName,
						id,
						email,
					}}
					className="card-link"
				>
					Reject Applicant
				</Link>
				<Link
					to="/create-volunteer/confirm"
					className="card-link"
					state={{
						id,
						firstName,
						lastName,
						phoneNumber,
						streetAddress1,
						streetAddress2,
						zipCode,
						state,
						email,
						areasOfHelp,
					}}
				>
					More info
				</Link>
			</div>
		</div>
	);
};

export default ApplicationCard;
