import React from "react";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<a className="navbar-brand" href="/home">&nbsp;EPIC</a>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<div className="navbar-nav">
						<a className="nav-item nav-link active" href="/create-volunteer">Create Volunteer</a>
						<a className="nav-item nav-link" href="/request-help">Request Help</a>
						<a className="nav-item nav-link" href="/homeowner-requests">Requests</a>
					</div>
				</div>
			</nav>
			<Outlet />
		</>
	);
};

export default MainLayout;
