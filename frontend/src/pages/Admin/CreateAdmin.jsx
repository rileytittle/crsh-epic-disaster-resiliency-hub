import React, { useState } from "react";
import axios from "axios";

function CreateAdmin() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [errorOccurred, setErrorOccurred] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	async function createAdmin() {
		if (
			firstName != "" &&
			lastName != "" &&
			email != "" &&
			password != ""
		) {
			let token = sessionStorage.getItem("userToken");
			let headers = {
				Authorization: `Bearer ${token}`,
			};
			await axios
				.post(
					`${import.meta.env.VITE_API_URL}/admin/create-account`,
					{
						firstName: firstName,
						lastName: lastName,
						email: email,
						password: password,
					},
					{
						headers,
					}
				)
				.then((response) => {
					setErrorMessage("");
					setErrorOccurred(false);
					alert("New admin account successfully created");
					setFirstName("");
					setLastName("");
					setEmail("");
					setPassword("");
				})
				.catch((error) => {
					console.log("Error creating new admin account");
					console.log(error);
				});
		} else {
			setErrorMessage("All fields requred.");
			setErrorOccurred(true);
		}
	}
	return (
		<>
			{errorOccurred ? (
				<div className="alert alert-danger" role="alert">
					{errorMessage}
				</div>
			) : (
				<></>
			)}
			<div className="container mt-5">
				<div className="text-center mt-4">
					<h1 className="display-5 text-primary">
						Create new Admin Account
					</h1>
				</div>
				<div className="row justify-content-center">
					<div className="col-md-4">
						<div>
							<div className="mb-3">
								<input
									type="text"
									className="form-control"
									onChange={(e) =>
										setFirstName(e.target.value)
									}
									value={firstName}
									placeholder="First Name"
								/>
							</div>
							<div className="mb-3">
								<input
									type="text"
									className="form-control"
									onChange={(e) =>
										setLastName(e.target.value)
									}
									value={lastName}
									placeholder="Last Name"
								/>
							</div>
							<div className="mb-3">
								<input
									type="email"
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
								onClick={createAdmin}
								className="btn btn-primary w-100"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CreateAdmin;
