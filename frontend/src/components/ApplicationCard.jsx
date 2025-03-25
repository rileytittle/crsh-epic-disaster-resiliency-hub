import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const ApplicationCard = ({ id, firstName, lastName, email, areasOfHelp }) => {
	function rejectVolunteer() {
		console.log(email);
		axios
			.post(`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/create-volunteer/reject`, {
				email: email,
			})
			.then((res) => {
				navigate("/create-volunteer");
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}
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
				<Link
					onClick={(e) => {
						rejectVolunteer();
						window.location.reload();
					}}
					className="card-link"
				>
					Reject Applicant
				</Link>
				<Link
					to="/create-volunteer/confirm"
					className="card-link"
					state={{ id, firstName, lastName, email, areasOfHelp }}
				>
					More info
				</Link>
			</div>
		</div>
	);
};

export default ApplicationCard;
