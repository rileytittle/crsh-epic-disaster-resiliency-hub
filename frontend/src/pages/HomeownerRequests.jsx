import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestCard from "../components/RequestCard";

function HomeownerRequests() {
	const [requests, setRequests] = useState([]);
	useEffect(() => {
		axios
			.get(`${VITE_SERVER_URL}/admin/homeowner-requests`)
			.then((res) => {
				console.log(res.data);
				setRequests(res.data);
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
					{requests.map((request) => (
						<RequestCard
							key={request.id}
							id={request.id}
							firstName={request.first_name}
							lastName={request.last_name}
							email={request.email}
							address={request.street_address_1}
							city={request.city}
							state={request.state}
							zip={request.zip_code}
						></RequestCard>
					))}
				</div>
			</div>
		</>
	);
}

export default HomeownerRequests;
