import { useState, useEffect } from "react";
import "../../App.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
function VolLogin() {
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	async function login(e){
		e.preventDefault();
		let userData = {
			email: email,
			password: password
		}
		let basicAuthHeader = btoa(`${email}:${password}`)
		try{
			let headers = {
				Authorization: `Basic ${basicAuthHeader}`
			}
			await axios.post('http://localhost:3000/volunteer/login', userData, { headers })
				.then(response => {
					sessionStorage.setItem('isLoggedIn', true)
					sessionStorage.setItem('userType', 'volunteer')
					sessionStorage.setItem('userToken', response.data.token)
					navigate('/volunteer-dashboard')
				})
				.catch(error => {
					console.log('error logging in')
				})
		}
		catch(err){
			console.log('If checks for status codes here')
		}
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
					<button onClick={login}>
						GO
					</button>
				</form>
			</div>
		</>
	);
}

export default VolLogin;
