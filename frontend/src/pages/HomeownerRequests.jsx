import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestCard from "../components/RequestCard";

function HomeownerRequests() {
	const [requests, setRequests] = useState([]);
	useEffect(() => {
		axios
			.get(`http://localhost:3000/admin/homeowner-requests`)
			.then((res) => {
				// console.log(res.data);
				setRequests(res.data);
				// console.log(res.data.zip_code);
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
							phoneNumber={request.phoneNumber}
							streetAddress1={request.streetAddress1}
							streetAddress2={request.streetAddress2}
							city={request.city}
							state={request.state}
							zip={request.zipCode}
							county={request.county}
							status={request.status}
							reasonRejected={request.reasonRejected}
							helpType={request.helpType}
							other={request.other}
							dateCreated={request.dateCreated}
							timeCreated={request.timeCreated}
						></RequestCard>
					))}
				</div>
			</div>
		</>
	);
}

export default HomeownerRequests;
