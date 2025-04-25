import React, { useState, useEffect } from "react";
import axios from "axios";
import RequestCard from "../components/RequestCard";

function HomeownerRequests() {
	const [requests, setRequests] = useState([]);
	useEffect(() => {
		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};
		axios
			.get(`${import.meta.env.VITE_API_URL}/admin/homeowner-requests`, {
				headers,
			})
			.then((res) => {
				// console.log(res.data);
				setRequests(
					res.data.filter(
						(request) => request.status == "Unevaluated"
					)
				);
			})
			.catch((error) => {
				console.error("Error fetching applications:", error);
			});
	}, []);
	return (

		<div className="m-5">
			{requests.length > 0 ? (
				<div className="mt-4">
					<h1 className="display-6 text-primary">
						New Homeowner Requests
					</h1>
					<div className="card">
						<div className="card-body">
							<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5">
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
										description={request.description}
										dateCreated={request.dateCreated}
										timeCreated={request.timeCreated}
									></RequestCard>
								))}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="text-center mt-4">
					<h1 className="display-6 text-primary">
						No Homeowner Requests found
					</h1>
				</div>
			)}
		</div>
	);
}

export default HomeownerRequests;
