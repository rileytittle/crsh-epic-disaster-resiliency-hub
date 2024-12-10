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
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/admin/create-volunteer/applications",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			.then((res) => {
				setApplications(res);
				console.log(res);
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
							firstName={application.firstName}
							lastName={application.lastName}
							email={application.email}
							areasOfHelp={application.areasOfHelp}
						></ApplicationCard>
					))}
				</div>
			</div>
		</>
	);
}

export default CreateVolunteer;
