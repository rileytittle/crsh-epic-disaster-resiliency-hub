import React, { act } from "react";
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
	async function deleteArea(area) {
		console.log("Clicked: ", area);
		await axios
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
				const activeAreas = [];

				// Check each area and add it to the array if true
				if (res.data.hospitality) activeAreas.push("Hospitality");
				if (res.data.community_helpers)
					activeAreas.push("Community Helpers");
				if (res.data.community_outreach)
					activeAreas.push("Community Outreach");
				if (res.data.admin_team)
					activeAreas.push(
						"Volunteer Management and Administration Team"
					);
				if (res.data.logistic_tracking)
					activeAreas.push("Logistic Tracking");
				setAreasOfHelp(activeAreas);
				setVolunteer(res.data);
				setSelectedArea("");
			})
			.catch((error) => {
				console.error(error);
			});
	}
	const [volunteer, setVolunteer] = useState({});
	const [areasOfHelp, setAreasOfHelp] = useState({});
	const [selectedArea, setSelectedArea] = useState(""); // State to track selected area
	const location = useLocation();
	const { id } = location.state;
	//console.log(id);
	useEffect(() => {
		axios
			.get(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers/volunteer-details/${id}`
			)
			.then((res) => {
				const activeAreas = [];

				// Check each area and add it to the array if true
				if (res.data.hospitality) activeAreas.push("Hospitality");
				if (res.data.community_helpers)
					activeAreas.push("Community Helpers");
				if (res.data.community_outreach)
					activeAreas.push("Community Outreach");
				if (res.data.admin_team)
					activeAreas.push(
						"Volunteer Management and Administration Team"
					);
				if (res.data.logistic_tracking)
					activeAreas.push("Logistic Tracking");
				setAreasOfHelp(activeAreas);
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
				<h1>{volunteer.first_name + " " + volunteer.last_name}</h1>
				<p>{volunteer.email}</p>
				<p>{volunteer.phone_number}</p>
				<p>
					{volunteer.street_address +
						", " +
						volunteer.city +
						", " +
						volunteer.state +
						" " +
						volunteer.zip_code}
				</p>
				<p>
					{/* Check if areasOfHelp is defined before mapping */}
					{areasOfHelp && areasOfHelp.length > 0 ? (
						<ul>
							{areasOfHelp.map((area, index) => (
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
							<option value="hospitality">
								Hospitality Team
							</option>
							<option value="logistic_tracking">
								Logistic Tracking Team
							</option>
							<option value="community_outreach">
								Community Outreach
							</option>
							<option value="community_helpers">
								Community Helpers Team
							</option>
						</select>
					</div>
				</p>
			</div>
		</div>
	);
}

export default VolunteerDetails;
