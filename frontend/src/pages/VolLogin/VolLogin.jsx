import { useState } from "react";
import "../../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VolLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	async function login(e) {
		e.preventDefault();
		let userData = { email, password };
		let basicAuthHeader = btoa(`${email}:${password}`);

		try {
			let headers = { Authorization: `Basic ${basicAuthHeader}` };
			await axios
				.post(`http://localhost:3000/volunteer/login`, userData, {
					headers,
				})
				.then((response) => {
					sessionStorage.setItem("isLoggedIn", true);
					sessionStorage.setItem("userType", "volunteer");
					sessionStorage.setItem("userToken", response.data.token);
					sessionStorage.setItem("justLoggedIn", true);
					navigate("/volunteer-dashboard");
				})
				.catch(() => {
					console.log("Error logging in");
				});
		} catch (err) {
			console.log("If checks for status codes here");
		}
	}

	// Navigate to the request-reset page instead of sending a request
	function handleForgotPassword() {
		navigate("/volunteer/request-reset");
	}

	return (
		<>
			<div style={{ textAlign: "center" }}>
				<h1>Volunteer Login Portal</h1>
				<form>
					<input
						type="text"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="Email"
					/>
					<input
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder="Password"
					/>
					<button onClick={login}>GO</button>
				</form>
				<button
					onClick={handleForgotPassword}
					style={{ marginTop: "10px" }}
				>
					Forgot Password?
				</button>
				{message && <p>{message}</p>}
			</div>
		</>
	);
}

export default VolLogin;
