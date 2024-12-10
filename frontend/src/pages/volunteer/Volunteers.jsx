import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Volunteers() {
	const [volunteers, setVolunteers] = useState([]);
	useEffect(() => {
		axios
			.get("http://localhost:3000/admin/volunteers")
			.then((res) => {
				setVolunteers(res.data);
				console.log(res.data);
			})
			.catch((error) => {
				console.error("Error fetching volunteers:", error);
			});
	}, []);
	return (
		<>
			<div className="card">
				<div className="card-body">
					<div class="mb-3">
						<label for="" class="form-label">
							Email address
						</label>
						<input
							class="form-control"
							id=""
							placeholder="First Name"
						/>
					</div>
				</div>
			</div>
			<div className="card">
				<div className="card-body">
					<table class="table">
						<thead>
							<tr>
								<th scope="col">Edit</th>
								<th scope="col">#</th>
								<th scope="col">First</th>
								<th scope="col">Last</th>
								<th scope="col">email</th>
								<th scope="col">Area of Help</th>
							</tr>
						</thead>
						<tbody>
							{volunteers.map((volunteer) => (
								<tr>
									<td>
										<Link
											to="/volunteers/volunteer-details"
											state={volunteer}
										>
											Edit
										</Link>
									</td>
									<th scope="row">{volunteer.id}</th>
									<td>{volunteer.firstName}</td>
									<td>{volunteer.lastName}</td>
									<td>{volunteer.email}</td>
									<td>{volunteer.areasOfHelp.join(", ")}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default Volunteers;
