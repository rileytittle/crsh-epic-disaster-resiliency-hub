import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
function AdminLogin() {
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function login(e) {
		e.preventDefault();
		let userData = {
			email: email,
			password: password,
		};
		let basicAuthHeader = btoa(`${email}:${password}`);
		try {
			let headers = {
				Authorization: `Basic ${basicAuthHeader}`,
			};
			//console.log(`backend URL: ${import.meta.env.VITE_BACKEND_URL}/admin/login`);
			await axios
				.post(`${import.meta.env.VITE_API_URL}/admin/login`, userData, {
					headers,
				})
				.then((response) => {
					sessionStorage.setItem("isLoggedIn", true);
					sessionStorage.setItem("userType", "admin");
					sessionStorage.setItem("userToken", response.data.token);
					sessionStorage.setItem("justLoggedIn", true);
					navigate("/admin-dashboard");
				})
				.catch((error) => {
					console.log("error logging in");
					console.log(error);
				});
		} catch (err) {
			console.log("If checks for status codes here");
		}
	}
	return (
		<>
			<div className="container mt-5">
				<div className="row justify-content-center">
					<div className="col-md-4">
						<h1 className="text-center mb-4">Admin Login Portal</h1>
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
									onChange={(e) =>
										setPassword(e.target.value)
									}
									value={password}
									placeholder="Password"
								/>
							</div>
							<button
								type="submit"
								className="btn btn-primary w-100"
							>
								Log In
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminLogin;
