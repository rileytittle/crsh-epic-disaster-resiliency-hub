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
import CreateVolunteer from "./pages/CreateVolunteer";
import ConfirmVolunteer from "./pages/ConfirmVolunteer";
import Login from "./pages/login/Login";

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
				element={<HomeownerApplication />}
			></Route>
			<Route
				path="/create-volunteer/confirm"
				element={<ConfirmVolunteer />}
			></Route>
			<Route path="/login" element={<Login />}></Route>
		</Route>
	)
);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
