import React from "react";
import ApplicationCard from "../components/ApplicationCard";
import axios from "axios";
import { useState, useEffect } from "react";

function CreateVolunteer() {
	const [applications, setApplications] = useState([]);
	useEffect(() => {
		let token = sessionStorage.getItem("userToken");

		axios
			.get(
				`${
					import.meta.env.VITE_API_URL
				}/admin/create-volunteer/applications`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			.then((res) => {
				setApplications(res.data);
				console.log(res.data);
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}, []);

	return (
		<>
			{applications.length > 0 ? (
				<div className="card">
					<div className="card-body">
						{applications.map((application) => (
							<ApplicationCard
								key={application.id}
								id={application.id}
								firstName={application.first_name} // Updated for snake_case
								lastName={application.last_name} // Updated for snake_case
								phoneNumber={application.phone_number}
								streetAddress1={application.street_address_1}
								streetAddress2={application.street_address_2}
								zipCode={application.zip_code}
								state={application.state}
								email={application.email}
								areasOfHelp={[
									application.admin_team &&
										"Volunteer Management and Administration",
									application.logistic_tracking &&
										"Logistic Tracking",
									application.community_helpers &&
										"EPIC Helpers",
									application.hospitality && "Hospitality",
									application.community_outreach &&
										"Community Outreach",
								].filter(Boolean)} // Dynamically compute areas of help
							/>
						))}
					</div>
				</div>
			) : (
				<h2>No Volunteer Applications found</h2>
			)}
		</>
	);
}

export default CreateVolunteer;
