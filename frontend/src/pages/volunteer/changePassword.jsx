import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PasswordChange() {

	const navigate = useNavigate();

	const [passwordData, setPasswordData] = useState({
		username: "",
		currentPassword: "",
		newPassword: "",
		newPassword2: "",
	});
	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(""); 
	};

	const formSubmitted = async (e) => {
		e.preventDefault();
		setError(""); 

		if (passwordData.newPassword !== passwordData.newPassword2) {
			setError("New passwords must match.");
			return;
		}
		if (passwordData.currentPassword === passwordData.newPassword) {
			setError("New password must not match the old password.");
			return;
		}

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/volunteer/changePassword`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
					},
					body: JSON.stringify(passwordData),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				setError(result.message || "Failed to change password.");
			} else {
				alert(result.message); 
				setPasswordData({
					username: "",
					currentPassword: "",
					newPassword: "",
					newPassword2: "",
				});
			}
		} catch (err) {
			console.error("Error:", err);
			setError("Server error. Please try again later.");
		}
	};

	return (
		<>
			<div className="container mt-4">
				<button className="btn btn-secondary mb-3" onClick={() => navigate("/volunteer-dashboard")}>← Back to Dashboard</button>
			</div>
			<center>
				<h3>Change your Password</h3>
				<br />

				{error && (
					<div
						className="alert alert-danger"
						style={{ width: "fit-content", maxWidth: "90%" }}
					>
						{error}
					</div>
				)}
				<div>
					<form onSubmit={formSubmitted} className="row g-3">
						<div className="row-2">
							<div className="col-md-3">
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									type="text"
									className="form-control"
									name="username"
									id="username"
									value={passwordData.username}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="row-2">
							<div className="col-md-3">
								<label htmlFor="currentPassword" className="form-label">
									Current Password
								</label>
								<input
									type="password"
									className="form-control"
									name="currentPassword"
									id="currentPassword"
									value={passwordData.currentPassword}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="row-2">
							<div className="col-md-3">
								<label htmlFor="newPassword" className="form-label">
									New Password
								</label>
								<input
									type="password"
									className="form-control"
									name="newPassword"
									id="newPassword"
									value={passwordData.newPassword}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="row-2">
							<div className="col-md-3">
								<label htmlFor="newPassword2" className="form-label">
									Repeat New Password
								</label>
								<input
									type="password"
									className="form-control"
									name="newPassword2"
									id="newPassword2"
									value={passwordData.newPassword2}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<div className="col-12">
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						</div>
					</form>
				</div>
			</center>
		</>
	);
}

export default PasswordChange;
