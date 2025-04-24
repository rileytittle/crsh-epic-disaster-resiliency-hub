import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ConfirmVolunteer() {
	const location = useLocation();
	const { id, firstName, lastName, email, areasOfHelp } = location.state;
	const [teamLeader, setTeamLeader] = useState(false);
	const navigate = useNavigate();

	function handleCheckBox() {
		setTeamLeader(!teamLeader);
	}
	async function createVolunteer() {
		let token = sessionStorage.getItem("userToken");
		let headers = {
			Authorization: `Bearer ${token}`,
		};
		await axios
			.post(
				`${import.meta.env.VITE_API_URL}/admin/create-volunteer/accept`,
				{
					id: id,
					teamLeader: teamLeader,
				},
				{
					headers,
				}
			)
			.then((res) => {
				navigate("/create-volunteer");
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}
	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card p-4 shadow-lg">
						<div className="card-body">
							<h1 className="text-center mb-4">
								{firstName + " " + lastName}
							</h1>
							<h2 className="mb-3">Contact Information</h2>
							<p>{email}</p>

							<h2 className="mb-3">Areas of Help</h2>
							{areasOfHelp && areasOfHelp.length > 0 ? (
								<ul className="list-group mb-3">
									{areasOfHelp.map((area, index) => (
										<li
											key={index}
											className="list-group-item"
										>
											{area}
										</li>
									))}
								</ul>
							) : (
								<p>No areas of help specified.</p>
							)}

							<div className="form-check mb-3">
								<input
									type="checkbox"
									className="form-check-input"
									id="teamLeaderCheckbox"
									onChange={handleCheckBox}
								/>
								<label
									className="form-check-label"
									htmlFor="teamLeaderCheckbox"
								>
									Team Leader
								</label>
							</div>

							<button
								type="button"
								className="btn btn-primary w-100"
								onClick={createVolunteer}
							>
								Create Volunteer Account
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ConfirmVolunteer;
