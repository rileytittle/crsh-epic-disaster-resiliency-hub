import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
function RequestDetails() {
	const location = useLocation();
	const [assignedVolunteers, setAssignedVolunteers] = useState([]);
	const {
		id,
		firstName,
		lastName,
		email,
		phoneNumber,
		streetAddress1,
		streetAddress2,
		city,
		state,
		zip,
		county,
		status,
		reasonRejected,
		helpType,
		other,
		description,
		dateCreated,
		timeCreated,
	} = location.state;
	const navigate = useNavigate();

	async function acceptRequest() {
		await axios
			.post(`http://localhost:3000/admin/homeowner-requests/accept`, {
				id: id,
			})
			.then((res) => {
				navigate("/homeowner-requests");
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}
	async function rejectRequest() {
		await axios
			.post(`http://localhost:3000/admin/homeowner-requests/reject`, {
				id: id,
			})
			.then((res) => {
				navigate("/homeowner-requests");
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}
	useEffect(() => {
		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};
		axios
			.get(
				`http://localhost:3000/admin/homeowner-requests/assigned-volunteers/${id}`,
				{ headers }
			)
			.then((res) => {
				console.log(res.data);
				setAssignedVolunteers(res.data);
			});
	}, []);
	return (
		<>
			<div className="card">
				<div className="card-body">
					<h1>{firstName + " " + lastName}</h1>
					<h2>Contact Information</h2>
					<p>{phoneNumber}</p>
					<p>{email}</p>
					<h2>Address</h2>
					<p>
						{streetAddress1 +
							(streetAddress2 ? " " + streetAddress2 : "") +
							", " +
							city +
							", " +
							state +
							" " +
							zip}
					</p>
					<p>{county} County</p>
					<h2>Details</h2>
					<h4>Help Area:</h4>
					<div>
						<ul>
							{helpType.map((area, index) => (
								<li key={index}>{area}</li>
							))}
							{other ? <li>{other}</li> : <></>}
						</ul>
					</div>
					<h4>Description:</h4>
					<p>{description}</p>
					<p>Pictures should go here</p>
					<br></br>
					{status == "Active" ? (
						<div>
							<h4>Assigned Volunteers:</h4>
							{assignedVolunteers.map((volunteer) => (
								<div>
									<p>
										{volunteer.first_name}{" "}
										{volunteer.last_name}:{" "}
										{volunteer.phone_number} -{" "}
										{volunteer.email}
									</p>
								</div>
							))}
						</div>
					) : (
						<>
							<button
								type="button"
								className="btn btn-primary"
								onClick={acceptRequest}
							>
								Accept Request
							</button>
							<button
								type="button"
								className="btn"
								onClick={rejectRequest}
							>
								Reject Request
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
}

export default RequestDetails;
