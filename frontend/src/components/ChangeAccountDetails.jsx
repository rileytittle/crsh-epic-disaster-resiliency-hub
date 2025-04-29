import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect } from "react";

function ChangeAccountDetails(props) {
	const [formData, setFormData] = useState({
		phone: "",
		address: "",
		city: "",
		state: "",
		zip: "",
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Sync props with state
	useEffect(() => {
		setFormData({
			phone: props.phone || "",
			address: props.address || "",
			city: props.city || "",
			state: props.state || "",
			zip: props.zip || "",
		});
	}, [props.phone, props.address, props.city, props.state, props.zip]);

	// Clear messages after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setError("");
			setSuccess("");
		}, 5000);

		return () => clearTimeout(timer);
	}, [error, success]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleClick = () => {
		// Frontend validation
		const { phone, address, city, state, zip } = formData;

		if (!phone || !address || !city || !state || !zip) {
			setError("All fields must be filled out.");
			return;
		}

		if (!/^\d+$/.test(phone)) {
			setError("Phone number must contain only digits.");
			return;
		}

		const updatedDetails = { email: props.email, ...formData };

		const headers = {
			Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
		};

		axios
			.post(
				`${import.meta.env.VITE_API_URL}/volunteer/update-user-details`,
				updatedDetails,
				{ headers }
			)
			.then((response) => {
				console.log("Update Successful:", response.data);
				setSuccess("User details updated successfully!");
				setError("");
			})
			.catch((error) => {
				console.error("Error updating user details:", error);
				const errMsg =
					error.response?.data?.message ||
					"Failed to update user details.";
				setError(errMsg);
				setSuccess("");
			});
	};

	return (
		<div className="container mt-4">
			<div className="card shadow-sm">
				<div className="card-body">
					<h5 className="card-title text-center mb-3">
						Update Account Details
					</h5>
					<p className="text-muted text-center">
						Would you like to change your account details?
					</p>

					{error && <div className="alert alert-danger">{error}</div>}
					{success && (
						<div className="alert alert-success">{success}</div>
					)}

					<form>
						<div className="mb-3">
							<label className="form-label">Email:</label>
							<input
								type="text"
								className="form-control"
								value={props.email}
								readOnly
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Phone:</label>
							<input
								type="text"
								className="form-control"
								id="phone"
								value={formData.phone}
								onChange={handleChange}
							/>
						</div>

						<div className="mb-3">
							<label className="form-label">Address:</label>
							<input
								type="text"
								className="form-control"
								id="address"
								value={formData.address}
								onChange={handleChange}
							/>
						</div>

						<div className="row">
							<div className="col-md-6 mb-3">
								<label className="form-label">City:</label>
								<input
									type="text"
									className="form-control"
									id="city"
									value={formData.city}
									onChange={handleChange}
								/>
							</div>
							<div className="col-md-3 mb-3">
								<label className="form-label">State:</label>
								<input
									type="text"
									className="form-control"
									id="state"
									value={formData.state}
									onChange={handleChange}
								/>
							</div>
							<div className="col-md-3 mb-3">
								<label className="form-label">Zip:</label>
								<input
									type="text"
									className="form-control"
									id="zip"
									value={formData.zip}
									onChange={handleChange}
								/>
							</div>
						</div>

						<div className="text-center">
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleClick}
							>
								Update Details
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ChangeAccountDetails;
