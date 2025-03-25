import React, { useEffect, useState } from "react";

const AssignVolunteer = () => {
	const [requests, setRequests] = useState([]); // State to hold the requests
	const [selectedRequest, setSelectedRequest] = useState(null); // State to hold the selected request
	const [showAssignMenu, setShowAssignMenu] = useState(false); // State to toggle the assign menu
	const [volunteers, setVolunteers] = useState([]); // State to hold the volunteers returned from the API
	const [selectedVolunteer, setSelectedVolunteer] = useState(null); // State to hold the selected volunteer

	// Function to fetch requests from the backend
	const fetchRequests = async () => {
		try {
			const response = await fetch(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/homeowner/viewRequests`
			);
			const data = await response.json();

			// Check if data is an array before calling .map()
			if (Array.isArray(data)) {
				setRequests(data); // Set requests directly if it's an array
			} else {
				console.error("Unexpected response format:", data);
				alert("Failed to load requests. Please try again.");
			}
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
		setSelectedVolunteer(null); // Clear selected volunteer
	};

	// Handle showing the assign menu
	const handleShowAssignMenu = () => {
		setShowAssignMenu(true);
	};

	// Function to handle team button click
	const handleTeamButtonClick = async (team) => {
		try {
			const response = await fetch(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/assign-volunteer/list`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ team }),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const data = await response.json();
			if (Array.isArray(data.volunteers) && data.volunteers.length > 0) {
				setVolunteers(data.volunteers); // Set the volunteers returned from the API
			} else {
				setVolunteers([]);
				alert(data.message); // Notify if no volunteers found
			}
		} catch (error) {
			console.error("Error fetching volunteers:", error);
		}
	};

	// Function to handle radio button change
	const handleVolunteerSelect = (volunteer) => {
		setSelectedVolunteer(volunteer); // Set the selected volunteer
	};

	// Function to handle volunteer assignments
	const handleAssignVolunteer = async () => {
		if (!selectedRequest?.id || !selectedVolunteer) {
			alert("Please select a request and a volunteer.");
			return;
		}

		try {
			const response = await fetch(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/assign-volunteer/updateAssignment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						assignment: selectedRequest.id, // Send the request ID
						id: selectedVolunteer.id, // Send the ID of the selected volunteer
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
			console.error("Error assigning volunteer:", error);
			alert("Failed to assign volunteer.");
		}
	};

	return (
		<div>
			<h1>Current Homeowner Requests</h1>
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
								{request.firstname} {request.lastname} -{" "}
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
						<strong>Name:</strong> {selectedRequest.firstname}{" "}
						{selectedRequest.lastname}
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
						Assign Volunteer
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
						Choose a team to assign a volunteer from for{" "}
						{selectedRequest.firstName} {selectedRequest.lastName}
					</h3>
					<button
						onClick={() => handleTeamButtonClick("admin_team")}
						style={{ margin: "5px" }}
					>
						Volunteer Management and Administration
					</button>
					<button
						onClick={() => handleTeamButtonClick("hospitality")}
						style={{ margin: "5px" }}
					>
						Hospitality Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("logistic_tracking")
						}
						style={{ margin: "5px" }}
					>
						Logistic Tracking Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("community_outreach")
						}
						style={{ margin: "5px" }}
					>
						Community Outreach Team
					</button>
					<button
						onClick={() =>
							handleTeamButtonClick("community_helpers")
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
							<h4>Select a Volunteer:</h4>
							<ul>
								{volunteers.map((volunteer, index) => (
									<li key={index}>
										<label>
											<input
												type="radio"
												name="volunteer"
												checked={
													selectedVolunteer?.id ===
													volunteer.id
												}
												onChange={() =>
													handleVolunteerSelect(
														volunteer
													)
												}
											/>
											{volunteer.id} {volunteer.email}{" "}
											{volunteer.first_name}{" "}
											{volunteer.last_name}{" "}
											{volunteer.phone_number}
										</label>
									</li>
								))}
							</ul>
							<button
								onClick={handleAssignVolunteer}
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
