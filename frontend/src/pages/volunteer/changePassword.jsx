import React from "react";
import { useState, useEffect } from "react";

function PasswordChange() {
	const [passwordData, setPasswordData] = useState({
		username: "",
		currentPassword: "",
		newPassword: "",
		newPassword2: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPasswordData({
			...passwordData,
			[name]: value,
		});
	};

	const formSubmitted = async (e) => {
		e.preventDefault();
		if (passwordData.newPassword != passwordData.newPassword2)
			alert("new passwords must match");
		else if (passwordData.currentPassword == passwordData.newPassword)
			alert("new password must not match old password");
		else {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_URL}/volunteer/changePassword`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(passwordData),
					}
				);

				const result = await response.json();
				console.log(result);
				alert(result.message);
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return (
		<>
			<center>
				<h3>Change your Password</h3> <br />
				<div>
					<form onSubmit={formSubmitted} className="row g-3">
						<div className="row-2">
							<div className="col-md-3">
								<label
									htmlFor="username"
									className="form-label"
								>
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
								<label
									htmlFor="currentPassword"
									className="form-label"
								>
									Current Password
								</label>
								<input
									type="text"
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
								<label
									htmlFor="newPassword"
									className="form-label"
								>
									New Password
								</label>
								<input
									type="text"
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
								<label
									htmlFor="newPassword2"
									className="form-label"
								>
									Repeat New Password
								</label>
								<input
									type="text"
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
