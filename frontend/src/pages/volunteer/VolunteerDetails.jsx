import React, { act } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./VolunteerDetails.css";
function VolunteerDetails() {
	let headers = {
		Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
	};
	function addArea() {
		console.log("Clicked: ", selectedArea);
		axios
			.patch(
				`${
					import.meta.env.VITE_API_URL
				}/volunteers/volunteer-details`,
				{
					id: id,
					selectedArea: selectedArea,
				},
				{ headers }
			)
			.then((res) => {
				setSelectedArea("");
			})
			.catch((error) => {
				console.error(error);
			});
	}
	async function deleteArea(area) {
		setSelectedArea(area);
		console.log("Clicked: ", area);
		await axios
			.delete(
				`${
					import.meta.env.VITE_API_URL
				}/admin/volunteers/volunteer-details`,
				{
					data: {
						id: id,
						selectedArea: area,
					},
					headers: headers,
				}
			)
			.then((res) => {
				setSelectedArea("");
			})
			.catch((error) => {
				console.error(error);
			});
	}
	const [volunteer, setVolunteer] = useState({});
	const [selectedArea, setSelectedArea] = useState(""); // State to track selected area
	const location = useLocation();
	const { id } = location.state;
	//console.log(id);
	useEffect(() => {
		axios
			.get(
				`${
					import.meta.env.VITE_API_URL
				}/admin/volunteers/volunteer-details/${id}`,
        { headers }
			)
			.then((res) => {
				console.log(res.data);
				setVolunteer(res.data);
				//console.log(res.data);
			})
			.catch((error) => {
				console.error("Error fetching volunteers:", error);
			});
	}, [id, selectedArea]);
	const navigate = useNavigate();
	//console.log(location.state);
	if (!volunteer) {
		<p>Loading data</p>;
	}
	return (
		<div className="card">
			<div className="card-body">
				<h1>{volunteer.firstName + " " + volunteer.lastName}</h1>
				<h2>Contact Information</h2>
				<p>{volunteer.phoneNumber}</p>
				<p>{volunteer.email}</p>
				<h2>Address</h2>
				<p>
					{volunteer.streetAddress1 +
						(volunteer.streetAddress2
							? " " + volunteer.streetAddress2
							: "") +
						", " +
						volunteer.city +
						", " +
						volunteer.state +
						" " +
						volunteer.zipCode}
				</p>
				<div>
					{/* Check if areasOfHelp is defined before mapping */}
					<h2>Areas of Help</h2>
					{volunteer.areasOfHelp &&
					volunteer.areasOfHelp.length > 0 ? (
						<ul>
							{volunteer.areasOfHelp.map((area, index) => (
								<li
									key={index}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "10px",
									}}
								>
									{area}
									<button
										type="button"
										className="btn btn-danger"
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
					<div className="input-group mb-3 w-auto">
						<button
							className="btn btn-outline-secondary"
							type="button"
							onClick={addArea}
						>
							Add
						</button>
						<select
							className="form-select custom-select"
							id="inputGroupSelect03"
							aria-label="Example select with button addon"
							value={selectedArea} // Set the value of the select to the state variable
							onChange={(e) => setSelectedArea(e.target.value)} // Update the state when an option is selected
						>
							<option>Choose...</option>
							<option value="admin_team">
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
				</div>
			</div>
		</div>
	);
}

export default VolunteerDetails;
