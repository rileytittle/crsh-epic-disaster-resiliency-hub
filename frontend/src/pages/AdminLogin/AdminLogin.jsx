import { useState } from "react";
import "../../App.css";

function AdminLogin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoggedin, setIsLoggedin] = useState(false);

	function login(e) {
		e.preventDefault();
		const userData = {
			username,
			password,
		};

		if (username === "guest" && password === "pass") {
			setIsLoggedin(true);
			localStorage.setItem("token-info", JSON.stringify(userData));
			setUsername("");
			setPassword("");
		} else {
			alert("Invalid credentials");
		}
	};

	const logout = () => {
		localStorage.removeItem("token-info");
		setIsLoggedin(false);
	};

	return (
		<>
			<div style={{ textAlign: "center" }}>
				{!isLoggedin ? (
					<>
						<h1>Use 'guest' and 'pass' to log in</h1>
						<form action="">
							<input
								type="text"
								onChange={(e) => setUsername(e.target.value)}
								value={username}
								placeholder="Username"
							/>
							<input
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								value={password}
								placeholder="Password"
							/>
							<button type="submit" onClick={login}>
								GO
							</button>
						</form>
					</>
				) : (
					<>
						<h1>User is logged in</h1>
						<button onClickCapture={logout}>logout user</button>
					</>
				)}
			</div>
		</>
	);
}

export default AdminLogin;
