import { useNavigate } from "react-router-dom";
import AccountDetails from "../../components/AccountDetails";
import ChangeAccountDetails from "../../components/ChangeAccountDetails";
import axios from "axios";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function VolunteerAccountSettings() {
	const navigate = useNavigate(); // Initialize navigation
	const userToken = sessionStorage.getItem("userToken");

	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zip, setZip] = useState("");

	useEffect(() => {
		function fetchUserData() {
			let headers = {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`, // Fixed template literal syntax
			};

			axios
				.get(`${import.meta.env.VITE_API_URL}/volunteer/user-details`, {
					params: { userToken },
					headers,
				})
				.then((response) => {
					console.log("User data:", response.data);
					const user = response.data;

					setEmail(user.email);
					setPhone(user.phoneNumber);
					setAddress(user.streetAddress1);
					setCity(user.city);
					setState(user.state);
					setZip(user.zipCode);
				})
				.catch((error) => {
					console.error(
						"There was an error fetching the user data:",
						error
					);
				});
		}

		if (userToken) {
			fetchUserData();
		}
	}, [userToken]);

	return (
		<div className="container mt-4">
			{/* Back Button */}
			<button
				className="btn btn-secondary mb-3"
				onClick={() => navigate("/volunteer-dashboard")}
			>
				← Back to Dashboard
			</button>

			<h1 className="text-center">Account Details</h1>
			<AccountDetails
				email={email}
				phone={phone}
				address={address}
				city={city}
				state={state}
				zip={zip}
			/>
			<ChangeAccountDetails
				email={email}
				phone={phone}
				address={address}
				city={city}
				state={state}
				zip={zip}
			/>
		</div>
	);
}

export default VolunteerAccountSettings;
