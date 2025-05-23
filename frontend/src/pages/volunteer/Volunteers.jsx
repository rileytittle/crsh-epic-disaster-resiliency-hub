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
	//`${import.meta.env.VITE_API_URL}
	//${import.meta.env.VITE_API_URL}
	useEffect(() => {
		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};
		axios
			.get(`${import.meta.env.VITE_API_URL}/admin/volunteers`, {
				headers,
			})
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
		<div className="m-5">
			<div className="mt-4">
				<h1 className="display-6 text-primary">Volunteers</h1>
			</div>
			<div className="card">
				<div className="card-body">
					<table className="table" id="myTable">
						<thead>
							<tr>
								<th scope="col">Edit</th>
								<th scope="col">#</th>
								<th scope="col">First Name</th>
								<th scope="col">Last Name</th>
								<th scope="col">Phone Number</th>
								<th scope="col">Email</th>
								<th scope="col">Areas of Help</th>
								<th scope="col">Delete</th>
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
									<td>{volunteer.phone_number}</td>
									<td>{volunteer.email}</td>
									<td>
										{volunteer.areasOfHelp.join(", ") ||
											"None"}
									</td>
									<td>
										<Link
											to="/volunteer/confirm-deletion"
											className="btn btn-danger"
											state={{
												first_name:
													volunteer.first_name,
												last_name: volunteer.last_name,
												id: volunteer.id,
											}}
										>
											Delete
										</Link>
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
