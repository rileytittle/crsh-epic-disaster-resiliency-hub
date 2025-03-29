import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "datatables.net-dt";
import $ from "jquery"; // Don't forget to import jQuery

let table = new DataTable("#myTable", {
	// config options...
});
function Volunteers() {
	const [volunteers, setVolunteers] = useState([]);
	//`http://localhost:3000
	//http://localhost:3000
	useEffect(() => {
		axios
			.get(`http://localhost:3000/admin/volunteers`)
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
				// Initialize DataTable after setting the data
				setTimeout(() => {
					$("#myTable").DataTable();
				}, 0); // Delay to ensure DOM is updated before DataTable initializes
				console.log(transformedData);
			})
			.catch((error) => {
				console.error("Error fetching volunteers:", error);
			});
		// Cleanup function to destroy the DataTable when the component unmounts
		return () => {
			$("#myTable").DataTable().destroy();
		};
	}, []);

	return (
		<div>
			<h1>Volunteers</h1>
			<div className="card">
				<div className="card-body">
					<table className="table" id="myTable">
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
