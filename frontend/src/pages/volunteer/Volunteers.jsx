import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Volunteers() {
	const [volunteers, setVolunteers] = useState([]);

	useEffect(() => {
		axios
			.get(
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/volunteers"
			)
			.then((res) => {
				// Transform data to include areas of help
				const transformedData = res.data.map((volunteer) => ({
					...volunteer,
					areasOfHelp: [
						volunteer.admin_team && "Admin Team",
						volunteer.hospitality && "Hospitality",
						volunteer.logistic_tracking && "Logistic Tracking",
						volunteer.community_outreach && "Community Outreach",
						volunteer.community_helpers && "Community Helpers",
					].filter(Boolean), // Remove any `false` values
				}));
				setVolunteers(transformedData);
				console.log(transformedData);
			})
			.catch((error) => {
				console.error("Error fetching volunteers:", error);
			});
	}, []);

	return (
		<div>
			<h1>Volunteers</h1>
			<div className="card">
				<div className="card-body">
					<table className="table">
						<thead>
							<tr>
								<th scope="col">Edit</th>
								<th scope="col">#</th>
								<th scope="col">First Name</th>
								<th scope="col">Last Name</th>
								<th scope="col">Email</th>
								<th scope="col">Areas of Help</th>
							</tr>
						</thead>
						<tbody>
							{volunteers.map((volunteer) => (
								<tr key={volunteer.id}>
									<td>
										<Link
											to="/volunteers/volunteer-details"
											state={volunteer}
										>
											Edit
										</Link>
									</td>
									<th scope="row">{volunteer.id}</th>
									<td>{volunteer.first_name}</td>
									<td>{volunteer.last_name}</td>
									<td>{volunteer.email}</td>
									<td>
										{volunteer.areasOfHelp.join(", ") ||
											"None"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Volunteers;
