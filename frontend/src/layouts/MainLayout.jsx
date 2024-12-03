import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="/home">EPIC</a>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="navbar-collapse collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a className="nav-link active" href="/home">Home</a>
							</li>
							{sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('userType') == 'volunteer' ? 
							(<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Volunteer
								</a>
								<ul className="dropdown-menu">
									<li><a className="dropdown-item disabled" href="#">Action</a></li>
									<li><a className="dropdown-item" href="/volunteer/changePassword">Change Password</a></li>
									<li><a className="dropdown-item" href="/volunteer/resetPassword">Reset Password</a></li>
									<li><hr className="dropdown-divider" /></li>
									<li><a className="dropdown-item" href="/applyVolunteer">Apply to Volunteer</a></li>
									<li><a className="dropdown-item" href="/applyVolunteer/status">Check Status of Application</a></li>
                  				    <li><a className="nav-item nav-link" href="/assignVolunteers">Assign volunteers to job</a></li>
									<li><hr className="dropdown-divider" /></li>
									<li><a className="dropdown-item disabled" href="#">Disabled</a></li>
								</ul>
							</li>) : 
							(<></>)}
							{sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('userType') == 'admin' ? (<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									Admin
								</a>
								<ul className="dropdown-menu">
									<li><a className="dropdown-item" href="/create-volunteer">Create Volunteer</a></li>
									<li><hr className="dropdown-divider" /></li>
									<li><a className="dropdown-item disabled" href="#">Something else here</a></li>
								</ul>
							</li>) : (<></>)}
							<li className="nav-item">
								<a className="nav-link" aria-disabled="true" href="/admin-login">Admin Login</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" aria-disabled="true" href="/vol-login">Volunteer Login</a>
							</li>
						</ul>
						<a className="nav-link" href="/request-help">Request Help</a>

					</div>
				</div>
			</nav>
			<Outlet />
		</>
	);
};

export default MainLayout;
