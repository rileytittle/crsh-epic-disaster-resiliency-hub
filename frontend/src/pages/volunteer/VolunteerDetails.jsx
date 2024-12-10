import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function VolunteerDetails() {
	const [volunteer, setVolunteer] = useState({});
	const [selectedArea, setSelectedArea] = useState(""); // Track selected area
	const location = useLocation();
	const { id } = location.state; // Get the volunteer ID from route state

	// Fetch volunteer details
	useEffect(() => {
		axios
			.get(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details/${id}`
			)
			.then((res) => {
				setVolunteer(res.data);
			})
			.catch((error) => {
				console.error("Error fetching volunteer:", error);
			});
	}, [id]);

	// Add or toggle area of help
	function toggleArea(area) {
		axios
			.patch(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details`,
				{ id, area }
			)
			.then((res) => {
				setVolunteer(res.data); // Update the state with the new volunteer data
			})
			.catch((error) => {
				console.error("Error updating area:", error);
			});
	}

	if (!volunteer) {
		return <p>Loading data...</p>;
	}

	return (
		<div className="card">
			<div className="card-body">
				<h1>{volunteer.first_name + " " + volunteer.last_name}</h1>
				<p>Email: {volunteer.email}</p>
				<p>Phone: {volunteer.phone_number}</p>
				<p>
					Address:{" "}
					{volunteer.street_address +
						", " +
						volunteer.city +
						", " +
						volunteer.state +
						" " +
						volunteer.zip_code}
				</p>
				<p>
					Areas of Help:
					<ul>
						{/* Display areas of help based on boolean fields */}
						{[
							{ name: "Admin Team", key: "admin_team" },
							{ name: "Hospitality Team", key: "hospitality" },
							{
								name: "Logistic Tracking Team",
								key: "logistic_tracking",
							},
							{
								name: "Community Outreach",
								key: "community_outreach",
							},
							{
								name: "Community Helpers Team",
								key: "community_helpers",
							},
						].map((area) => (
							<li key={area.key}>
								{area.name}{" "}
								{volunteer[area.key] ? (
									<button
										type="button"
										className="btn btn-danger"
										onClick={() => toggleArea(area.key)}
									>
										Remove
									</button>
								) : (
									<button
										type="button"
										className="btn btn-success"
										onClick={() => toggleArea(area.key)}
									>
										Add
									</button>
								)}
							</li>
						))}
					</ul>
				</p>
				<p>Team Leader: {volunteer.team_leader ? "Yes" : "No"}</p>
			</div>
		</div>
	);
}

export default VolunteerDetails;
