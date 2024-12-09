import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestCard from "../components/RequestCard";

function HomeownerRequests() {
	const [requests, setRequests] = useState([]);
	useEffect(() => {
		axios
			.get("http://localhost:3000/admin/homeowner-requests")
			.then((res) => {
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
							firstName={request.firstName}
							lastName={request.lastName}
							email={request.email}
							address={request.address}
							city={request.city}
							state={request.state}
							zip={request.zip}
							helpType={request.helpType}
						></RequestCard>
					))}
				</div>
			</div>
		</>
	);
}

export default HomeownerRequests;