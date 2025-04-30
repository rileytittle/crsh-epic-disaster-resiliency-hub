import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assignVolunteers.css";
import { Link } from "react-router-dom";

function ActiveRequests() {
	const [requests, setRequests] = useState([]);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [showAssignMenu, setShowAssignMenu] = useState(false);
	const [volunteers, setVolunteers] = useState([]);
	const [selectedVolunteer, setSelectedVolunteer] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [volunteerSearchTerm, setVolunteerSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("");
	const [selectedTeam, setSelectedTeam] = useState("");

	useEffect(() => {
		fetchRequests();
	}, []);

	const fetchRequests = async () => {
		try {
			let headers = {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
			};
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/admin/homeowner-requests`,
				{
					method: "GET", // Optional, defaults to 'GET'
					headers: headers,
				}
			);

			let data = await response.json();
			console.log(data.filter((request) => request.status == "Active"));
			if (Array.isArray(data)) {
				setRequests(
					data.filter((request) => request.status == "Active")
				);
			} else {
				console.error("Unexpected response format:", data);
				alert("Failed to load requests.");
			}
		} catch (error) {
			console.error("Error fetching requests:", error);
		}
	};

	const handleSelectRequest = (request) => {
		setSelectedRequest(request);
		setShowAssignMenu(false); // Reset assign menu when switching requests
	};

	const handleDeselectRequest = () => {
		setSelectedRequest(null);
		setShowAssignMenu(false);
		setVolunteers([]);
		setSelectedVolunteer(null);
	};

	const handleMoreInfoButtonClick = () => {};

	const filteredRequests = requests.filter((request) => {
		const fullName =
			`${request.firstName} ${request.lastName}`.toLowerCase();
		return (
			(fullName.includes(searchTerm.toLowerCase()) ||
				request.id?.toString().includes(searchTerm)) &&
			(filterType ? request.helpType.includes(filterType) : true)
		);
	});

	return (
		<div className="m-5">
			<div className="mt-4">
				<h1 className="display-6 text-primary">
					Current Homeowner Requests
				</h1>
			</div>

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

			{filteredRequests.length > 0 ? (
				<table className="table table-striped">
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Email</th>
							<th>Address</th>
							<th>County</th>
							<th>Help Type</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredRequests.map((request, index) => (
							<tr
								key={request.id || index}
								onClick={() => handleSelectRequest(request)}
							>
								<td>{request.id}</td>
								<td>
									{request.firstName} {request.lastName}
								</td>
								<td>{request.email}</td>
								<td>
									{request.streetAddress1},{" "}
									{request.streetAddress2
										? request.streetAddress2 + ", "
										: ""}{" "}
									{request.city}, {request.state}{" "}
									{request.zip}
								</td>
								<td>{request.county}</td>
								<td>
									<ul>
										{request.helpType.map((type, i) => (
											<li key={i}>{type}</li>
										))}
									</ul>
								</td>
								<td>
									<Link
										to="/homeowner-requests/request-details"
										className="card-link"
										state={request}
									>
										More info
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No matching requests found.</p>
			)}

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
						<strong>Address:</strong> {selectedRequest.address},{" "}
						{selectedRequest.city}, {selectedRequest.state}{" "}
						{selectedRequest.zip}
					</p>
					<p>
						<strong>Support Type:</strong>{" "}
						{selectedRequest.helpType.join(", ")}
					</p>
					<button
						className="btn btn-secondary"
						onClick={handleDeselectRequest}
					>
						Back to Requests
					</button>
				</div>
			)}
		</div>
	);
}

export default ActiveRequests;
