import React from "react";
import ApplicationCard from "../components/ApplicationCard";
import axios from "axios";
import { useState, useEffect } from "react";

function CreateVolunteer() {
	const [applications, setApplications] = useState([]);
	useEffect(() => {
		let token = sessionStorage.getItem("userToken");

		axios
			.get(`${SERVER_URL}/admin/create-volunteer/applications`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

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
			<div className="card">
				<div className="card-body">
					{applications.map((application) => (
						<ApplicationCard
							key={application.id}
							id={application.id}
							firstName={application.first_name} // Updated for snake_case
							lastName={application.last_name} // Updated for snake_case
							email={application.email}
							areasOfHelp={[
								application.logistic_tracking &&
									"Logistic Tracking",
								application.community_helpers &&
									"Community Helpers",
								application.hospitality && "Hospitality",
								application.community_outreach &&
									"Community Outreach",
							].filter(Boolean)} // Dynamically compute areas of help
						/>
					))}
				</div>
			</div>
		</>
	);
}

export default CreateVolunteer;
