import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState({});

	useEffect(() => {
		const isLoggedIn = sessionStorage.getItem("isLoggedIn");
		const userType = sessionStorage.getItem("userType");
		const justLoggedIn = sessionStorage.getItem("justLoggedIn");
		const hasReloaded = sessionStorage.getItem("hasReloaded");
		console.log("test");
		if (!isLoggedIn || userType !== "admin") {
			// Redirect to login if not logged in or not an admin
			navigate("/admin-login");
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
		fetchNotifications();
	}, []);

	async function fetchNotifications() {
		let headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};
		await axios
			.get(`${import.meta.env.VITE_API_URL}/admin/notifications`, {
				headers: headers,
			})
			.then((result) => {
				setNotifications(result.data[0]);
				console.log(result.data[0]);
			})
			.catch((e) => {
				console.log("Error fetching notifications");
			});
	}
	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card p-4">
						<div className="card-body">
							{sessionStorage.getItem("isLoggedIn") &&
							sessionStorage.getItem("userType") === "admin" &&
							notifications ? (
								<>
									<h1 className="text-center mb-4">
										Admin Dashboard
									</h1>
									<div className="row">
										{/* Left Column: Notifications */}
										<div className="col-6">
											<h4>Notifications</h4>
											<div className="mb-3">
												<p>
													<strong>
														Unevaluated Requests:
													</strong>{" "}
													{
														notifications.unevaluated_count
													}
												</p>
											</div>
											<div className="mb-3">
												<p>
													<strong>
														Accepted Requests:
													</strong>{" "}
													{
														notifications.accepted_count
													}
												</p>
											</div>
											<div className="mb-3">
												<p>
													<strong>
														Active Requests:
													</strong>{" "}
													{notifications.active_count}
												</p>
											</div>
										</div>

										{/* Right Column: Actions */}
										<div className="col-6">
											<h4>Actions</h4>
											<div className="row">
												{/* First Set of Actions */}
												<div className="col-6">
													<a
														href="/homeowner-requests"
														className="btn btn-primary w-100 mb-2"
													>
														Evaluate Requests
													</a>
													<a
														href="/assignVolunteers"
														className="btn btn-success w-100 mb-2"
													>
														Assign Volunteers to
														request
													</a>
													<a
														href="/requests-in-progress"
														className="btn btn-warning w-100 mb-2"
													>
														Requests in Progress
													</a>
												</div>
												{/* Second Set of Actions */}
												<div className="col-6">
													<a
														href="/create-volunteer"
														className="btn btn-danger w-100 mb-2"
													>
														Volunteer Applications
													</a>
													<a
														href="/volunteers"
														className="btn btn-info w-100 mb-2"
													>
														Volunteer Database
													</a>
													<a
														href="/generate-reports"
														className="btn btn-secondary w-100"
													>
														Download Reports
													</a>
												</div>
											</div>
										</div>
									</div>
								</>
							) : (
								<p className="text-center">Loading...</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminDashboard;
