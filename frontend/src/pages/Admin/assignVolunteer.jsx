import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assignVolunteers.css";

const AssignVolunteer = () => {
	const [requests, setRequests] = useState([]);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showAssignMenu, setShowAssignMenu] = useState(false);
	const [volunteers, setVolunteers] = useState([]);
	const [selectedVolunteerIds, setSelectedVolunteerIds] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [volunteerSearchTerm, setVolunteerSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("");
	const [selectedTeam, setSelectedTeam] = useState("");

	// Pagination state
	const [requestPage, setRequestPage] = useState(1);
	const [volunteerPage, setVolunteerPage] = useState(1);
	const requestsPerPage = 10; // Number of requests per page
	const volunteersPerPage = 10; // Number of volunteers per page
	let headers = {
		Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
	};
	useEffect(() => {
		fetchRequests();
	}, []);

	const fetchRequests = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/homeowner/viewRequests`, 
        {
					method: "GET",
					headers: headers,
				}
			);
			const data = await response.json();
			if (Array.isArray(data)) {
				setRequests(data);
			} else {
				console.error("Unexpected response format:", data);
				alert("Failed to load requests.");
			}
		} catch (error) {
			console.error("Error fetching requests:", error);
		}
	};

	const handleSelectRequest = (request) => {
		setSelectedRequest(request); // Update selectedRequest with the chosen request
		setShowAssignMenu(true); // Show the assignment menu when a request is selected
	};
	const handleDeselectRequest = () => {
		setSelectedRequest(null);
		setShowAssignMenu(false);
		setVolunteers([]);
		setSelectedVolunteerIds([]);
	};
	const handleVolunteerSelect = (volunteer) => {
		const isSelected = selectedVolunteerIds.includes(volunteer.id);

		if (isSelected) {
			// Remove volunteer from selected list if already selected
			setSelectedVolunteerIds(
				selectedVolunteerIds.filter((id) => id !== volunteer.id)
			);
		} else {
			// Add volunteer to selected list
			setSelectedVolunteerIds([...selectedVolunteerIds, volunteer.id]);
		}
	};

	const handleAssignButtonClick = () => {
		setShowAssignMenu(true);
	};
	const formatPhoneNumber = (phoneNumber) => {
		const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // Remove non-numeric characters
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/); // Match the pattern (xxx)(xxx)(xxxx)
	  
		if (match) {
		  return `(${match[1]})-${match[2]}-${match[3]}`; // Format to (xxx)-xxx-xxxx
		}
	  
		return phoneNumber; // Return the original phone number if it doesn't match the format
	  };

	const handleTeamButtonClick = async (team) => {
		setSelectedTeam(team); // Set the selected team when a button is clicked
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/admin/assign-volunteer/list`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionStorage.getItem(
							"userToken"
						)}`,
					},
				}
			);

			const data = await response.json();
			console.log("Fetched Volunteers:", data); 

			if (Array.isArray(data)) {
				setVolunteers(data); // Directly assign the array to the state
			} else {
				console.error("Invalid data format:", data);
			}
		} catch (error) {
			console.error("Error fetching volunteers:", error);
		}
	};

	const handleAssignVolunteer = async () => {
		if (!selectedRequest?.id || selectedVolunteerIds.length === 0) {
			alert("Please select a request and at least one volunteer.");
			return;
		}

		try {
			// Send all selected volunteers in the body
			const response = await fetch(
				`${
					import.meta.env.VITE_API_URL
				}/admin/assign-volunteer/updateAssignment`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionStorage.getItem(
							"userToken"
						)}`,
					},
					body: JSON.stringify({
						assignment: selectedRequest.id,
						volunteerIds: selectedVolunteerIds, // Array of selected volunteer IDs
					}),
				}
			);

			const data = await response.json();
			alert(data.message);
			handleDeselectRequest();

		} catch (error) {
			console.error("Error assigning volunteers:", error);
			alert("Failed to assign volunteers.");
		}
	};

	// Pagination: Slice the filtered requests based on the current page
	const filteredRequests = requests.filter((request) => {
		const fullName =
			`${request.firstName} ${request.lastName}`.toLowerCase();
		return (
			(fullName.includes(searchTerm.toLowerCase()) ||
				request.id?.toString().includes(searchTerm)) &&
			(filterType ? request.helpType.includes(filterType) : true)
		);
	});

	const requestsToDisplay = filteredRequests.slice(
		(requestPage - 1) * requestsPerPage,
		requestPage * requestsPerPage
	);

	// Pagination: Slice the filtered volunteers based on the current page
	const filteredVolunteers = volunteers.filter((volunteer) => {
		const fullName =
			`${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
		return (
			(fullName.includes(volunteerSearchTerm.toLowerCase()) ||
				volunteer.id?.toString().includes(volunteerSearchTerm)) &&
			(selectedTeam ? volunteer.areasOfHelp.includes(selectedTeam): true)
		);
	});

	const volunteersToDisplay = filteredVolunteers.slice(
		(volunteerPage - 1) * volunteersPerPage,
		volunteerPage * volunteersPerPage
	);

	// Pagination controls
	const totalRequestsPages = Math.ceil(
		filteredRequests.length / requestsPerPage
	);
	const totalVolunteersPages = Math.ceil(
		filteredVolunteers.length / volunteersPerPage
	);

	return (
		<div className="container mt-5 assign-volunteer-page">
			<h1>Current Homeowner Requests</h1>

			<div className="mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="Search Requests by Name or ID"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<select
					className="form-select"
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
				>
					<option value="">All Help Types</option>
					{[...new Set(requests.flatMap((req) => req.helpType))].map(
						(type, index) => (
							<option key={index} value={type}>
								{type}
							</option>
						)
					)}
				</select>
			</div>
			{requestsToDisplay.length > 0 ? (
				<table className="table table-striped">
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Contact Information</th>
							<th>Address</th>
							<th>Help Type</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{requestsToDisplay.map((request, index) => (
							<tr key={request.id || index}>
								<td>{request.id}</td>
								<td>
									{request.firstName} {request.lastName}
								</td>
								<td>{request.email}
									<br />
									{formatPhoneNumber(request.phoneNumber)}
								</td>
								<td>
									{request.streetAddress1}{request.streetAddress2 ? `, ${request.streetAddress2}` : ""}, {request.city},{" "}
									{request.state} {request.zip}
								</td>
								<td>
									<ul>
										{request.helpType.map((type, i) => (
											<li key={i}>{type}</li>
										))}
									</ul>
								</td>
								<td>
									<button
										className="btn btn-primary"
										onClick={(e) => {
											e.stopPropagation(); // Prevent row click event from interfering
											handleSelectRequest(request);
											handleAssignButtonClick();
										}}
									>
										Select
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No matching requests found.</p>
			)}

			{/* Pagination Controls for Requests */}
			<div className="pagination">
				<button
					className="btn btn-outline-primary"
					onClick={() =>
						setRequestPage((prev) => Math.max(prev - 1, 1))
					}
				>
					Previous
				</button>
				<span className="mx-2">
					Page {requestPage} of {totalRequestsPages}
				</span>
				<button
					className="btn btn-outline-primary"
					onClick={() =>
						setRequestPage((prev) =>
							Math.min(prev + 1, totalRequestsPages)
						)
					}
				>
					Next
				</button>
			</div>

			{selectedRequest && (
				<div className="card mt-4 p-3">
					<h2>Request Details</h2>
					<p>
						<strong>Name:</strong> {selectedRequest.firstName}{" "}
						{selectedRequest.lastName}
					</p>
					<p>
						<strong>Email:</strong> {selectedRequest.email}
					</p>
					<p>
						<strong>Phone:</strong> {formatPhoneNumber(selectedRequest.phoneNumber)}
					</p>
					<p>
						<strong>Address:</strong> {selectedRequest.streetAddress1}{selectedRequest.streetAddress2 ? `, ${selectedRequest.streetAddress2}` : ""},{" "}
						{selectedRequest.city}, {selectedRequest.state}{" "}
						{selectedRequest.zip}
					</p>
					<p>
						<strong>Support Type:</strong>{" "}
						{selectedRequest.helpType.join(", ")}
					</p>
					<p>
						<strong>Description:</strong>{" "}
						{selectedRequest.description}
					</p>
					<button
						className="btn btn-secondary"
						onClick={handleDeselectRequest}
					>
						Back to Requests
					</button>
				</div>
			)}

			{showAssignMenu && (
				<div className="card mt-4 p-3">
					<h3>
						Select a Team for {selectedRequest?.firstName}{" "}
						{selectedRequest?.lastName}
					</h3>
					<div className="btn-group mb-3" role="group">
						<button
							className="btn btn-outline-primary"
							onClick={() => handleTeamButtonClick("Admin Team")}
						>
							Admin Team
						</button>
						<button
							className="btn btn-outline-primary"
							onClick={() => handleTeamButtonClick("Hospitality")}
						>
							Hospitality
						</button>
						<button
							className="btn btn-outline-primary"
							onClick={() => handleTeamButtonClick("Logistics")}
						>
							Logistics
						</button>
						<button
							className="btn btn-outline-primary"
							onClick={() =>
								handleTeamButtonClick("Community Outreach")
							}
						>
							Community Outreach
						</button>
						<button
							className="btn btn-outline-primary"
							onClick={() =>
								handleTeamButtonClick("Community Helpers")
							}
						>
							EPIC Helpers
						</button>
						<button
							className="btn btn-outline-danger"
							onClick={() => setShowAssignMenu(false)}
						>
							Close
						</button>
					</div>

					{/* Volunteer Search Bar */}
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Search Volunteers by Name or ID"
							value={volunteerSearchTerm}
							onChange={(e) =>
								setVolunteerSearchTerm(e.target.value)
							}
						/>
					</div>

					{selectedTeam && volunteersToDisplay.length === 0 ? (
						<p>No volunteers available for this team.</p>
					) : (
						volunteersToDisplay.length > 0 && (
							<table className="table table-striped">
								<thead>
									<tr>
										<th>#</th>
										<th>Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Address</th>
										<th>Select</th>
									</tr>
								</thead>
								<tbody>
									{volunteersToDisplay.map((volunteer) => (
										<tr key={volunteer.id}>
											<td>{volunteer.id}</td>
											<td>
												{volunteer.firstName}{" "}
												{volunteer.lastName}
											</td>
											<td>{volunteer.email}</td>
											<td>{formatPhoneNumber(volunteer.phoneNumber)}</td>
											<td>
												{volunteer.streetAddress1 ||
													"N/A"}
												{volunteer.streetAddress2
													? `, ${volunteer.streetAddress2}`
													: ""}
												,{volunteer.city || "N/A"},
												{volunteer.state || "N/A"},
												{volunteer.zipCode || "N/A"}
											</td>
											<td>
												<input
													type="checkbox"
													checked={selectedVolunteerIds.includes(
														volunteer.id
													)}
													onChange={() =>
														handleVolunteerSelect(
															volunteer
														)
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)
					)}

					{/* Pagination Controls for Volunteers */}
					<div className="pagination">
						<button
							className="btn btn-outline-primary"
							onClick={() =>
								setVolunteerPage((prev) =>
									Math.max(prev - 1, 1)
								)
							}
						>
							Previous
						</button>
						<span className="mx-2">
							Page {volunteerPage} of {totalVolunteersPages}
						</span>
						<button
							className="btn btn-outline-primary"
							onClick={() =>
								setVolunteerPage((prev) =>
									Math.min(prev + 1, totalVolunteersPages)
								)
							}
						>
							Next
						</button>
					</div>

					<button
						className="btn btn-success"
						onClick={handleAssignVolunteer}
					>
						Assign Volunteer(s)
					</button>
				</div>
			)}
		</div>
	);
};

export default AssignVolunteer;
