import React, { useEffect, useState } from "react";

// Define the AssignVolunteer component
const AssignVolunteer = () => {
	const [requests, setRequests] = useState([]); // State to hold the requests
	const [selectedRequest, setSelectedRequest] = useState(null); // State to hold the selected request
	const [showAssignMenu, setShowAssignMenu] = useState(false); // State to toggle the assign menu
	const [volunteers, setVolunteers] = useState([]); // State to hold the volunteers returned from the API
	const [selectedVolunteers, setSelectedVolunteers] = useState([]); // State to hold selected volunteers

	// Function to fetch requests from the backend
	const fetchRequests = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/homeowner/viewRequests`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setRequests(data);
		} catch (error) {
			console.error("Error fetching requests:", error);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	// Handle request selection
	const handleSelectRequest = (request) => {
		setSelectedRequest(request);
	};

	// Handle deselecting the request
	const handleDeselectRequest = () => {
		setSelectedRequest(null);
		setShowAssignMenu(false); // Hide the assign menu when deselecting
		setVolunteers([]); // Clear volunteers when deselecting
		setSelectedVolunteers([]); // Clear selected volunteers
	};

	// Handle showing the assign menu
	const handleShowAssignMenu = () => {
		setShowAssignMenu(true);
	};

	// Function to handle team button click
	const handleTeamButtonClick = async (team) => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/admin/assign-volunteer/list`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ team }), // Sending the selected team in the request body
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			if (data.volunteers && data.volunteers.length > 0) {
				setVolunteers(data.volunteers); // Set the volunteers returned from the API
			} else {
				setVolunteers([]);
				alert(data.message);
			}
		} catch (error) {
			console.error("Error fetching volunteers:", error);
		}
	};

	// Function to handle checkbox change
	const handleVolunteerSelect = (volunteer) => {
		setSelectedVolunteers((prevSelected) => {
			if (prevSelected.includes(volunteer)) {
				// If already selected, remove from the array
				return prevSelected.filter((v) => v !== volunteer);
			} else {
				// If not selected, add to the array
				return [...prevSelected, volunteer];
			}
		});
	};

	// Function to handle volunteer assignments
	const handleAssignVolunteers = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/homeowner/update-assignment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						requestName:
							selectedRequest.firstName +
							selectedRequest.lastName,
						volunteers: selectedVolunteers,
					}),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			alert(data.message); // Notify the user of success or failure
			handleDeselectRequest(); // Reset the selection after assignment
		} catch (error) {
			console.error("Error assigning volunteers:", error);
			alert("Failed to assign volunteers."); // Notify the user of the error
		}
	};

	return (
		<div>
			<h1>Volunteer Requests</h1>
			<div>
				{requests.length > 0 ? (
					<ul>
						{requests.map((request, index) => (
							<li
								key={index}
								onClick={() => handleSelectRequest(request)}
								style={{
									cursor: "pointer",
									margin: "10px 0",
									padding: "10px",
									border: "1px solid #ccc",
								}}
							>
								{request.firstName} {request.lastName} -{" "}
								{request.helpType}
							</li>
						))}
					</ul>
				) : (
					<p>No requests found.</p>
				)}
			</div>
			{selectedRequest && (
				<div
					style={{
						marginTop: "20px",
						padding: "10px",
						border: "1px solid #007bff",
						borderRadius: "5px",
					}}
				>
					<h2>Request Details</h2>
					<p>
						<strong>Name:</strong> {selectedRequest.firstName}{" "}
						{selectedRequest.lastName}
					</p>
					<p>
						<strong>Email:</strong> {selectedRequest.email}
					</p>
					<p>
						<strong>Address:</strong> {selectedRequest.address},{" "}
						{selectedRequest.city}, {selectedRequest.state}{" "}
						{selectedRequest.zip}
					</p>
					<p>
						<strong>Support Type:</strong>{" "}
						{selectedRequest.helpType}
					</p>
					<button onClick={handleDeselectRequest}>
						Back to Requests
					</button>
					<button
						onClick={handleShowAssignMenu}
						style={{ marginLeft: "10px" }}
					>
						Assign Volunteers
					</button>
				</div>
			)}
			{showAssignMenu && selectedRequest && (
				<div
					style={{
						marginTop: "20px",
						padding: "10px",
						border: "1px solid #28a745",
						borderRadius: "5px",
					}}
				>
					<h3>
						Choose a team to assign volunteers from for{" "}
						{selectedRequest.firstName} {selectedRequest.lastName}
					</h3>
					<button
						onClick={() =>
							handleTeamButtonClick(
								"Volunteer Management and Administration"
							)
						}
						style={{ margin: "5px" }}
					>
						Volunteer Management and Administration
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("Hospitality Team")
						}
						style={{ margin: "5px" }}
					>
						Hospitality Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("Logistic Tracking Team")
						}
						style={{ margin: "5px" }}
					>
						Logistic Tracking Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("Community Outreach Team")
						}
						style={{ margin: "5px" }}
					>
						Community Outreach Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("Community Helpers Team")
						}
						style={{ margin: "5px" }}
					>
						Community Helpers Team
					</button>

					<button
						onClick={() => setShowAssignMenu(false)}
						style={{ marginTop: "10px" }}
					>
						Close
					</button>

					{volunteers.length > 0 && (
						<div style={{ marginTop: "20px" }}>
							<h4>Select Volunteers:</h4>
							<ul>
								{volunteers.map((volunteer, index) => (
									<li key={index}>
										<label>
											<input
												type="checkbox"
												checked={selectedVolunteers.includes(
													volunteer
												)}
												onChange={() =>
													handleVolunteerSelect(
														volunteer
													)
												}
											/>
											{volunteer.firstName}{" "}
											{volunteer.lastName}{" "}
											{/* Adjust this according to your volunteer object structure */}
										</label>
									</li>
								))}
							</ul>
							<button
								onClick={handleAssignVolunteers}
								style={{
									marginTop: "10px",
									color: "white",
									backgroundColor: "#007bff",
									border: "none",
									padding: "10px 15px",
									borderRadius: "5px",
								}}
							>
								Assign
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AssignVolunteer;
