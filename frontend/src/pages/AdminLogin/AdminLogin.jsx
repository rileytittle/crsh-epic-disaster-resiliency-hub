import { useState } from "react";
import "../../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState(""); // Added message state
	const navigate = useNavigate();

	async function login(e) {
		e.preventDefault();
		setMessage("");
		const userData = { email, password };
		const basicAuthHeader = btoa(`${email}:${password}`);

		try {
			const headers = { Authorization: `Basic ${basicAuthHeader}` };
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/admin/login`,
				userData,
				{ headers }
			);

			sessionStorage.setItem("isLoggedIn", true);
			sessionStorage.setItem("userType", "admin");
			sessionStorage.setItem("userToken", response.data.token);
			sessionStorage.setItem("justLoggedIn", true);
			navigate("/admin-dashboard");
		} catch (err) {
			if (err.response && err.response.status === 401) {
				setMessage("Incorrect email or password.");
			} else {
				setMessage("Something went wrong. Please try again.");
			}
			console.error(err);
		}
	}

	function handleForgotPassword() {
		navigate("/admin/request-reset");
	}

	return (
		<div className="container mt-5">
			<div className="text-center mt-4">
				<h1 className="display-5 text-primary">
					Admin Login Portal
				</h1>
			</div>
			<div className="row justify-content-center">
				<div className="col-md-4">


					{/* Error Message */}
					{message && (
						<div className="alert alert-danger text-center" role="alert">
							{message}
						</div>
					)}

					<form onSubmit={login}>
						<div className="mb-3">
							<input
								type="text"
								className="form-control"
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								placeholder="Email"
							/>
						</div>
						<div className="mb-3">
							<input
								type="password"
								className="form-control"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								placeholder="Password"
							/>
						</div>
						<button type="submit" className="btn btn-primary w-100">
							Log In
						</button>
					</form>
					<button
						onClick={handleForgotPassword}
						className="btn btn-link mt-3 w-100"
						style={{ textDecoration: "none", color: "#007bff" }}
					>
						Forgot Password?
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdminLogin;
