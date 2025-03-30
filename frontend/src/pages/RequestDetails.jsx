import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
function RequestDetails() {
	const location = useLocation();
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
					<></>
					<p>Pictures should go here</p>
					<br></br>
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
				</div>
			</div>
		</>
	);
}

export default RequestDetails;
