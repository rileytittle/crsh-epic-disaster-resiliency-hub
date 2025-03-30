import { useState } from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from "./layouts/MainLayout";
import Homepage from "./pages/Homepage";
import HomeownerRequests from "./pages/HomeownerRequests";
import RequestDetails from "./pages/RequestDetails";
//import EmailTest from './pages/SendEmailPage';

import HomeownerApplicationStatus from "./pages/Homeowner/applicationStatus";
import HomeownerForm from "./pages/Homeowner/HomeownerApplication";

import CreateVolunteer from "./pages/CreateVolunteer";
import ConfirmVolunteer from "./pages/ConfirmVolunteer";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import VolLogin from "./pages/VolLogin/VolLogin";
import VolunteerForm from "./pages/pVolunteer/volunteerApp";
import Volunteers from "./pages/volunteer/Volunteers";
import VolunteerDetails from "./pages/volunteer/VolunteerDetails";
import AssignVolunteer from "./pages/Admin/assignVolunteer";

import VolunteerApplicationStatus from "./pages/pVolunteer/applicationStatus";
import VolunteerPasswordChange from "./pages/volunteer/changePassword";
import VolunteerPasswordReset from "./pages/volunteer/resetPassword";
import VolunteerRequestReset from "./pages/volunteer/RequestReset";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerJobs from "./pages/volunteer/jobsOffered";
import VolunteerAccountSettings from "./pages/volunteer/VolunteerAccountSettings";
import ThankYouPage from "./pages/pVolunteer/ThankYouPage";
import GenerateReports from "./pages/Admin/GenerateReports";


const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<MainLayout />}>
			<Route index element={<Navigate to="/home" replace />} />
			<Route path="/home" element={<Homepage />}></Route>

			<Route path="/request-help" element={<HomeownerForm />}></Route>
			<Route
				path="/request-help/status"
				element={<HomeownerApplicationStatus />}
			></Route>

			<Route
				path="/create-volunteer"
				element={<CreateVolunteer />}
			></Route>
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
			<Route path="/admin-dashboard" element={<AdminDashboard />}></Route>

			<Route path="/vol-login" element={<VolLogin />}></Route>
			<Route
				path="/volunteer-dashboard"
				element={<VolunteerDashboard />}
			></Route>
			<Route 
			path="/applyVolunteer" 
			element={<VolunteerForm />}>
			</Route>
			 <Route 
			 path="/thank-you" 
			 element={<ThankYouPage />} 
			 />
			<Route
				path="/applyVolunteer/status"
				element={<VolunteerApplicationStatus />}
			></Route>
			<Route
				path="/assignVolunteers"
				element={<AssignVolunteer />}
			></Route>

			<Route path="/volunteer/jobs" element={<VolunteerJobs />}></Route>
			<Route
				path="/volunteer/changePassword"
				element={<VolunteerPasswordChange />}
			></Route>
			<Route
				path="/volunteer/reset-password"
				element={<VolunteerPasswordReset />}
			></Route>
			<Route
				path="/volunteer/request-reset"
				element={<VolunteerRequestReset />}
			></Route>
			<Route path="/volunteers" element={<Volunteers />}></Route>
			<Route
				path="/volunteers/volunteer-details"
				element={<VolunteerDetails />}
			></Route>
			<Route
				path="/volunteer/account-details"
				element={<VolunteerAccountSettings />}
			></Route>
			<Route
				path="/generate-reports"
				element={<GenerateReports />}
			></Route>
		</Route>
	)
);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
