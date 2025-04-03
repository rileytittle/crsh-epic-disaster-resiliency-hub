import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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
			.post(
				`${
					import.meta.env.VITE_API_URL
				}/admin/homeowner-requests/accept`,
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
				`${
					import.meta.env.VITE_API_URL
				}/admin/homeowner-requests/reject`,
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
	useEffect(() => {
		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};
		axios
			.get(
				`${
					import.meta.env.VITE_API_URL
				}/admin/homeowner-requests/assigned-volunteers/${id}`,
				{ headers }
			)
			.then((res) => {
				console.log(res.data);
				setAssignedVolunteers(res.data);
			});
	}, []);
	return (
		<div className="container mt-4">
			<div className="card rounded-3 shadow-lg mb-4">
				<div className="card-body">
					<div className="text-center mb-4">
						<h1 className="fw-bold">
							{firstName + " " + lastName}
						</h1>
					</div>

					<div className="mb-3">
						<h2 className="fw-bold">Contact Information</h2>
						<p>{phoneNumber}</p>
						<p>{email}</p>
					</div>

					<div className="mb-3">
						<h2 className="fw-bold">Address</h2>
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
					</div>

					<div className="mb-3">
						<h2 className="fw-bold">Details</h2>
						<h4>Help Area:</h4>
						<ul>
							{helpType.map((area, index) => (
								<li key={index}>{area}</li>
							))}
							{other ? <li>{other}</li> : <></>}
						</ul>

						<h4>Description:</h4>
						<p>{description}</p>
					</div>

					{status === "Active" ? (
						<div className="mb-3">
							<h4 className="fw-bold">Assigned Volunteers:</h4>
							{assignedVolunteers.map((volunteer, index) => (
								<div key={index}>
									<p>
										{volunteer.first_name}{" "}
										{volunteer.last_name}:{" "}
										{volunteer.phone_number} -{" "}
										{volunteer.email}{" "}
										<Link
											to="/volunteers/volunteer-details"
											state={volunteer}
										>
											PROFILE
										</Link>
									</p>
								</div>
							))}
						</div>
					) : (
						<div className="d-flex justify-content-around mt-4">
							<button
								type="button"
								className="btn btn-primary"
								onClick={acceptRequest}
							>
								Accept Request
							</button>
							<button
								type="button"
								className="btn btn-danger"
								onClick={rejectRequest}
							>
								Reject Request
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default RequestDetails;
