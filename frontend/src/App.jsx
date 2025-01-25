import { useState } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/Homepage";
import HomeownerApplication from "./pages/HomeownerApplication";
import HomeownerRequests from "./pages/HomeownerRequests";
import RequestDetails from "./pages/RequestDetails";
import EmailTest from './pages/SendEmailPage';


import HomeownerForm from "./pages/HomeownerApplication";
import CreateVolunteer from "./pages/CreateVolunteer";
import ConfirmVolunteer from "./pages/ConfirmVolunteer";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import VolLogin from './pages/VolLogin/VolLogin'
import VolunteerForm from "./pages/pVolunteer/volunteerApp";
import Volunteers from "./pages/volunteer/Volunteers";
import VolunteerDetails from "./pages/volunteer/VolunteerDetails";
import AssignVolunteer from "./pages/Admin/assignVolunteer";

import ApplicationStatus from "./pages/pVolunteer/applicationStatus";
import VolunteerPasswordChange from "./pages/volunteer/changePassword";
import VolunteerPasswordReset from "./pages/volunteer/resetPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import SendEmailPage from "./pages/SendEmailPage";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<MainLayout />}>
			<Route path="/home" element={<Homepage />}></Route>
			<Route
				path="/create-volunteer"
				element={<CreateVolunteer />}
			></Route>
			<Route path="/request-help" element={<HomeownerForm />}></Route>
			<Route
				path="/create-volunteer/confirm"
				element={<ConfirmVolunteer />}
			></Route>
			<Route
				path="/homeowner-requests"
				element={<HomeownerRequests />}
			></Route>
			<Route
				path="/homeowner-requests/request-details"
				element={<RequestDetails />}
			></Route>
			<Route path="/admin-login" element={<AdminLogin />}></Route>
			<Route path="/admin-dashboard" element={<AdminDashboard/>}></Route>
			
			<Route path="/vol-login" element={<VolLogin />}></Route>
			<Route path='/volunteer-dashboard' element={<VolunteerDashboard/>}></Route>
			<Route path="/applyVolunteer" element={<VolunteerForm />}></Route>
			<Route path='/test-email' element={<SendEmailPage/>}></Route>

			<Route
				path="/assignVolunteers"
				element={<AssignVolunteer />}
			></Route>
			<Route
				path="/applyVolunteer/status"
				element={<ApplicationStatus />}
			></Route>
			<Route
				path="/volunteer/changePassword"
				element={<VolunteerPasswordChange />}
			></Route>
			<Route
				path="/volunteer/resetPassword"
				element={<VolunteerPasswordReset />}
			></Route>
			<Route path="/volunteers" element={<Volunteers />}></Route>
			<Route
				path="/volunteers/volunteer-details"
				element={<VolunteerDetails />}
			></Route>
		</Route>
	)
);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
