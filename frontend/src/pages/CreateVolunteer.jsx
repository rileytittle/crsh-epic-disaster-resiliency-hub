import React from "react";
import ApplicationCard from "../components/ApplicationCard";
import axios from "axios";
import { useState, useEffect } from "react";

function CreateVolunteer() {
	const [applications, setApplications] = useState([]);
	useEffect(() => {
		let token = sessionStorage.getItem('userToken');

		axios
			.get("http://localhost:3000/admin/create-volunteer/applications",{
				headers: {
					Authorization: `Bearer ${token}`
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
