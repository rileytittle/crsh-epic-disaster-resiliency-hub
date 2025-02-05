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
		address,
		city,
		state,
		zip,
		helpType,
	} = location.state;
	const navigate = useNavigate();

	async function acceptRequest() {
		await axios
			.post(
				`${import.meta.env.VITE_BACKEND_URL}/admin/homeowner-requests/accept`,
				{
					id: id,
				}
			)
			.then((res) => {
				navigate("/homeowner-requests");
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}
	async function rejectRequest() {
		await axios
			.post(
				`${import.meta.env.VITE_BACKEND_URL}/admin/homeowner-requests/reject`,
				{
					id: id,
				}
			)
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
					<p>{email}</p>
					<p>
						Location:{" "}
						{address + ", " + city + ", " + state + " " + zip}
					</p>
					<p>
						{helpType.map((area, index) => (
							<li key={index}>{area}</li>
						))}
					</p>
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
