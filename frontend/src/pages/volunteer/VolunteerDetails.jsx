import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function VolunteerDetails() {
	function addArea() {
		console.log("Clicked: ", selectedArea);
		axios
			.patch(
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details",
				{
					id: id,
					selectedArea: selectedArea,
				}
			)
			.then((res) => {
				setVolunteer(res.data);
				setSelectedArea("");
			})
			.catch((error) => {
				console.error(error);
			});
	}
	function deleteArea(area) {
		console.log("Clicked: ", area);
		axios
			.delete(
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details",
				{
					data: {
						id: id,
						selectedArea: area,
					},
				}
			)
			.then((res) => {
				setVolunteer(res.data);
				setSelectedArea("");
			})
			.catch((error) => {
				console.error(error);
			});
	}
	const [volunteer, setVolunteer] = useState({});
	const [selectedArea, setSelectedArea] = useState(""); // State to track selected area
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
	//console.log(id);
	useEffect(() => {
		axios
			.get(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details/${id}`
			)
			.then((res) => {
				setVolunteer(res.data);
				//console.log(res.data);
			})
			.catch((error) => {
				console.error("Error fetching volunteers:", error);
			});
	}, [id]);
	const navigate = useNavigate();
	//console.log(location.state);
	if (!volunteer) {
		<p>Loading data</p>;
	}
	return (
		<div className="card">
			<div className="card-body">
				<h1>{volunteer.firstName + " " + volunteer.lastName}</h1>
				<p>{volunteer.email}</p>
				<p>{volunteer.phoneNumber}</p>
				<p>
					{volunteer.streetAddress +
						", " +
						volunteer.city +
						", " +
						volunteer.state +
						" " +
						volunteer.zipCode}
				</p>
				<p>
					{/* Check if areasOfHelp is defined before mapping */}
					{volunteer.areasOfHelp &&
					volunteer.areasOfHelp.length > 0 ? (
						<ul>
							{volunteer.areasOfHelp.map((area, index) => (
								<li key={index}>
									{area}
									<button
										type="button"
										class="btn btn-danger"
										onClick={() => deleteArea(area)}
									>
										Delete
									</button>
								</li>
							))}
						</ul>
					) : (
						<p>No areas of help specified.</p>
					)}
					<div class="input-group mb-3">
						<button
							class="btn btn-outline-secondary"
							type="button"
							onClick={addArea}
						>
							Add
						</button>
						<select
							class="form-select"
							id="inputGroupSelect03"
							aria-label="Example select with button addon"
							value={selectedArea} // Set the value of the select to the state variable
							onChange={(e) => setSelectedArea(e.target.value)} // Update the state when an option is selected
						>
							<option selected>Choose...</option>
							<option value="Volunteer Management and Administration Team">
								Volunteer Management and Administration Team
							</option>
							<option value="Hospitality Team">
								Hospitality Team
							</option>
							<option value="Logistic Tracking Team">
								Logistic Tracking Team
							</option>
							<option value="Community Outreach">
								Community Outreach
							</option>
							<option value="Community Helpers Team">
								Community Helpers Team
							</option>
							<option value="Logistic Tracking Team">
								Logistic Tracking Team
							</option>
						</select>
					</div>
				</p>
				<p>Team Leader: {volunteer.teamLeader ? "true" : "false"}</p>
			</div>
		</div>
	);
}

export default VolunteerDetails;
