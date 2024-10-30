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
import HomeownerForm from "./pages/HomeownerApplication";
import CreateVolunteer from "./pages/CreateVolunteer";
import ConfirmVolunteer from "./pages/ConfirmVolunteer";
import Login from "./pages/Login/Login";
import VolunteerForm from "./pages/pVolunteer/volunteerApp";
import VolunteerPasswordChange from "./pages/volunteer/changePassword";
import VolunteerPasswordReset from "./pages/volunteer/resetPassword";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<MainLayout />}>
			<Route path="/home" element={<Homepage />}></Route>
			<Route
				path="/create-volunteer"
				element={<CreateVolunteer />}
			></Route>
			<Route
				path="/request-help"
				element={<HomeownerForm />}
			></Route>
			<Route
				path="/create-volunteer/confirm"
				element={<ConfirmVolunteer />}
			></Route>
			<Route path="/login" element={<Login />}></Route>
			<Route 
				path="/applyVolunteer" 
				element={<VolunteerForm />}>
			</Route>
			<Route
				path="/volunteer/changePassword"
				element={<VolunteerPasswordChange />}
			></Route>
			<Route
				path="/volunteer/resetPassword"
				element={<VolunteerPasswordReset />}
			></Route>
		</Route>
	)
);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
