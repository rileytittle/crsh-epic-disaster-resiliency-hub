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
		await axios
			.post(
				`https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/create-volunteer/accept`,
				{
					id: id,
					teamLeader: teamLeader,
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
		<>
			<div className="card">
				<div className="card-body">
					<h1>{firstName + " " + lastName}</h1>
					<p>{email}</p>
					<p>
						{areasOfHelp.map((area, index) => (
							<li key={index}>{area}</li>
						))}
					</p>
					<label>
						<input type="checkbox" onChange={handleCheckBox} />
						Team Leader
					</label>
					<br></br>
					<button
						type="button"
						className="btn btn-primary"
						onClick={createVolunteer}
					>
						Create Volunteer Account
					</button>
				</div>
			</div>
		</>
	);
}

export default ConfirmVolunteer;
