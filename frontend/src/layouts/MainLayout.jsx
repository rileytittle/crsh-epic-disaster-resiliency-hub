import React, { useEffect, useState } from "react";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import logo from "../../public/EPIC-logo.png";

const MainLayout = () => {
	function logout() {
		sessionStorage.removeItem("isLoggedIn");
		sessionStorage.removeItem("userType");
		sessionStorage.removeItem("userToken");
		navigate("/");
	}
	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="/home">
						<img
							src={logo}
							alt="Logo"
							style={{ height: "100px" }}
						/>
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div
						className="navbar-collapse collapse"
						id="navbarSupportedContent"
					>
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							{sessionStorage.getItem("isLoggedIn") &&
							sessionStorage.getItem("userType") ==
								"volunteer" ? (
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Volunteer
									</a>
									<ul className="dropdown-menu">
										<li>
											<a
												className="dropdown-item disabled"
												href="#"
											>
												Action
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/volunteer/account-details"
											>
												Update Account Details
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/volunteer/changePassword"
											>
												Change Password
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/volunteer/resetPassword"
											>
												Reset Password
											</a>
										</li>
										<li>
											<a
												className="nav-item nav-link"
												href="/volunteer/jobs"
											>
												Check Job Offer
											</a>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/applyVolunteer/status"
											>
												Check Status of Application
											</a>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li>
										<li>
											<a
												className="dropdown-item disabled"
												href="#"
											>
												Disabled
											</a>
										</li>
									</ul>
								</li>
							) : (
								<></>
							)}
							{sessionStorage.getItem("isLoggedIn") &&
							sessionStorage.getItem("userType") == "admin" ? (
								<li className="nav-item dropdown">
									<a
										className="nav-link dropdown-toggle"
										href="#"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Admin
									</a>
									<ul className="dropdown-menu">
										<li>
											<a
												className="dropdown-item"
												href="/create-volunteer"
											>
												New Volunteer Applications
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/volunteers"
											>
												Volunteer Database
											</a>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/homeowner-requests"
											>
												New Requests
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/assignVolunteers"
											>
												Assign volunteers to job
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/requests-in-progress"
											>
												Requests in Progress
											</a>
										</li>
										<li>
											<a
												className="dropdown-item"
												href="/generate-reports"
											>
												Generate Reports
											</a>
										</li>
									</ul>
								</li>
							) : (
								<></>
							)}
							{!sessionStorage.getItem("isLoggedIn") ? (
								<li className="nav-item">
									<a className="nav-link" href="/admin-login">
										Admin Login
									</a>
								</li>
							) : (
								<></>
							)}
							{!sessionStorage.getItem("isLoggedIn") ? (
								<li className="nav-item">
									<a className="nav-link" href="/vol-login">
										Volunteer Login
									</a>
								</li>
							) : (
								<></>
							)}
							{!sessionStorage.getItem("isLoggedIn") ? (
								<li className="nav-item">
									<a
										className="nav-link"
										href="/applyVolunteer"
									>
										Apply to Volunteer
									</a>
								</li>
							) : (
								<></>
							)}
						</ul>
						{!sessionStorage.getItem("isLoggedIn") ? (
							<>
								<a className="nav-link" href="/request-help">
									Request Help
								</a>
							</>
						) : (
							<a className="nav-link" href="#" onClick={logout}>
								Log Out
							</a>
						)}
					</div>
				</div>
			</nav>
			<Outlet />
		</>
	);
};

export default MainLayout;
