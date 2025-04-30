import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import JobCard from "../../components/JobCard";

function VolunteerDashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const userToken = sessionStorage.getItem("userToken");

	const [user, setUser] = useState("");
	const [assigned, setAssigned] = useState("");
	const [offered, setOffered] = useState("");

	useEffect(() => {
		const isLoggedIn = sessionStorage.getItem("isLoggedIn");
		const userType = sessionStorage.getItem("userType");
		const justLoggedIn = sessionStorage.getItem("justLoggedIn");
		const hasReloaded = sessionStorage.getItem("hasReloaded");
		console.log("test");
		if (!isLoggedIn || userType !== "volunteer") {
			// Redirect to login if not logged in or not an admin
			navigate("/vol-login");
		} else if (justLoggedIn === "true" && !hasReloaded) {
			// Mark reload as completed and refresh the page
			sessionStorage.setItem("justLoggedIn", "false");
			sessionStorage.setItem("hasReloaded", "true");
			navigate(0); // Programmatic page reload
		} else if (hasReloaded) {
			// Clear reload flag after it has been used
			sessionStorage.removeItem("hasReloaded");
		}
	}, [navigate]);

	useEffect(() => {
		if (!userToken) return;

		async function fetchData() {
			try {
				let headers = {
					Authorization: `Bearer ${sessionStorage.getItem(
						"userToken"
					)}`, // Fixed template literal syntax
				};

				const [userRes, jobsRes] = await Promise.all([
					axios.get(
						`${
							import.meta.env.VITE_API_URL
						}/volunteer/user-details`,
						{
							params: { userToken },
							headers: headers,
						}
					),
					axios.get(
						`${import.meta.env.VITE_API_URL}/volunteer/jobs`,
						{
							params: { userToken },
							headers: headers,
						}
					),
				]);

				setUser(userRes.data);
				setAssigned(jobsRes.data[0]);
				setOffered(jobsRes.data[1]);
			} catch (error) {
				console.error("Error fetching data:", error);
				setError("Failed to load data.");
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [userToken]);

	const answerOffer = (action) => {
		if (!offered || !user.id) {
			console.error("Invalid offer or user ID");
			return;
		}

		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`, // Fixed template literal syntax
		};

		axios

			.post(
				`${import.meta.env.VITE_API_URL}/volunteer/job-accept`,
				{
					offered: offered.id,
					action,
					id: user.id,
				},
				{ headers }
			)
			.then((response) => {
				console.log(response.data);
				if (action === "accept") {
					setAssigned(offered);
				}
				setOffered(0);
			})
			.catch((error) => {
				console.error("Error processing job action:", error);
			});
	};

	if (
		!sessionStorage.getItem("isLoggedIn") ||
		sessionStorage.getItem("userType") !== "volunteer"
	) {
		return <h1 className="text-center text-danger mt-5">Please Login</h1>;
	}

	return (
		<div className="container mt-4">
			<div className="text-center mt-4">
				<h1 className="display-5 text-primary">Volunteer Dashboard</h1>
			</div>
			<div className="card shadow-sm">
				<div className="card-body text-center">
					<h2 className="fw-semibold">
						{user.firstName} {user.lastName}
					</h2>

					{loading ? (
						<p className="text-muted mt-3">Loading...</p>
					) : error ? (
						<p className="text-danger mt-3">{error}</p>
					) : (
						<>
							{offered && typeof offered === "object" ? (
								<div className="mt-4">
									<h4 className="fw-bold">Job Offer</h4>
									<JobCard job={offered} />
									<div className="btn-group mt-3">
										<button
											className="btn btn-success px-4"
											onClick={() =>
												answerOffer("accept")
											}
										>
											Accept
										</button>
										<button
											className="btn btn-danger px-4 ms-2"
											onClick={() =>
												answerOffer("reject")
											}
										>
											Reject
										</button>
									</div>
								</div>
							) : assigned && typeof assigned === "object" ? (
								<div className="mt-4">
									<h4 className="fw-bold">Assigned Job</h4>
									<JobCard job={assigned} />
								</div>
							) : (
								<div className="mt-4">
									<h4 className="fw-bold">No Jobs Yet</h4>
									<p className="text-muted">
										You haven’t been assigned a job yet. An
										admin will contact you when a role
										becomes available.
									</p>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default VolunteerDashboard;
