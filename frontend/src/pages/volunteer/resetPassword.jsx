import React from "react";
import { useState, useEffect } from "react";

function PasswordReset() {
	const [passwordData, setPasswordData] = useState({
		username: "",
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

		try {
			const response = await fetch(
				`${SERVER_URL}/volunteer/resetPassword`,
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
	};

	return (
		<>
			<center>
				<h3>Reset your Password</h3> <br />
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

						<div className="col-12">
							<button type="submit" className="btn btn-primary">
								Reset Password
							</button>
						</div>
					</form>
				</div>
			</center>
		</>
	);
}

export default PasswordReset;
