import React from "react";
import { useState, useEffect } from "react";

function ApplicationStatus() {
	const [applicationData, setApplicationData] = useState({
		firstName: "",
		lastName: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setApplicationData({
			...applicationData,
			[name]: value,
		});
	};

	const formSubmitted = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/volunteer/status`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(applicationData),
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
				<h3>Check the Status of your Application</h3> <br />
				<div>
					<form onSubmit={formSubmitted} className="row g-3">
						<div className="row-2">
							<div className="col-md-3">
								<label
									htmlFor="firstName"
									className="form-label"
								>
									First Name
								</label>
								<input
									type="text"
									className="form-control"
									name="firstName"
									id="firstName"
									value={applicationData.username}
									onChange={handleChange}
									required
								/>
							</div>
							<br />
							<div className="col-md-3">
								<label
									htmlFor="lastName"
									className="form-label"
								>
									Last Name
								</label>
								<input
									type="text"
									className="form-control"
									name="lastName"
									id="lastName"
									value={applicationData.username}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
						<br />
						<div className="col-12">
							<button type="submit" className="btn btn-primary">
								Check
							</button>
						</div>
					</form>
				</div>
			</center>
		</>
	);
}

export default ApplicationStatus;
