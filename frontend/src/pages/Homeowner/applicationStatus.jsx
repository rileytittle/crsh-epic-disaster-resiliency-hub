import React from "react";
import { useState, useEffect } from "react";
import styles from "./HomeownerApplication.module.css";

function ApplicationStatus() {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		street_address_1: "",
		street_address_2: "",
	});
	const [formValidity, setFormValidity] = useState({
		first_name: null,
		last_name: null,
		street_address_1: null,
	});

	function toggleInformation() {

	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		setFormValidity({
			...formValidity,
			[name]: value.trim() != "",
		});
	};

	const formSubmitted = async (e) => {
		e.preventDefault();
		setFormValidity((prevState) =>
			Object.fromEntries(
				Object.entries(prevState).map(([key, value]) => [
					key,
					value === null ? false : value,
				])
			)
		);
		// Validate all fields upon form submission
		const newFormValidity = {
			first_name: formData.first_name.trim() !== "",
			last_name: formData.last_name.trim() !== "",
			street_address_1: formData.street_address_1.trim() != "",
		};
		const street_address_2 = formData.street_address_2.trim() === "" ? "NULL" : formData.street_address_2; // Set to NULL if empty
		
		setFormValidity(newFormValidity);

		const isFormValid = Object.values(newFormValidity).every(
			(valid) => valid
		);

		if (!isFormValid) {
			console.log(`not validated: ${isFormValid}`);
			e.stopPropagation();
		} else {
			try {
				const response = await fetch(
					`http://localhost:3000/homeowner/requestHelp/status?first_name=${encodeURIComponent(formData.first_name)}&last_name=${encodeURIComponent(formData.last_name)}&street_address_1=${encodeURIComponent(formData.street_address_1)}&street_address_2=${encodeURIComponent(street_address_2)}`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json", },
					}
				);
				const result = await response.json();
				
				if (response.status != 200) {
					alert(result.message);
				} else {
					alert(response.statusText);
					toggleInformation()
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return (
		<>
			<div className="container text-center mt-4">
				<div className="text-decoration-underline">
					<h2 className="fw-bold">Check Status</h2>
				</div>
				<div>
					<form
						noValidate
						id="homeownerForm"
						onSubmit={formSubmitted}
						className="row g-3 needs-validation"
					>
						<div className={`card rounded-3 shadow-lg ${styles.cardParent0} mb-4`}>
							<div
								className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}
							>
								<div className="card-body">
									<div className="row">
										<div className="col">
											<input
												placeholder="First Name"
												type="text"
												className={`form-control ${formValidity.first_name === null
													? ""
													: formValidity.first_name
														? "is-valid"
														: "is-invalid"
													}`}
												name="first_name"
												id="first_name"
												value={formData.first_name}
												onChange={handleChange}
												required
											/>
											<div className="invalid-feedback">
												Please enter a First Name
											</div>
										</div>
										<div className="col">
											<input
												placeholder="Last Name"
												type="text"
												className={`form-control ${formValidity.last_name === null
													? ""
													: formValidity.last_name
														? "is-valid"
														: "is-invalid"
													}`}
												name="last_name"
												id="last_name"
												value={formData.last_name}
												onChange={handleChange}
												required
											/>
											<div className="invalid-feedback">
												Please enter a Last Name
											</div>
										</div>
									</div>

								</div>
							</div>
							<div
								className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}
							>
								<div className="card-body">
									<div className="row">
										<div className="col-12">
											<label
												htmlFor="address_1"
												className="form-label"
											>
												Address
											</label>
											<input
												type="text"
												className={`form-control ${formValidity.street_address_1 ===
													null
													? ""
													: formValidity.street_address_1
														? "is-valid"
														: "is-invalid"
													}`}
												name="street_address_1"
												id="street_address_1"
												placeholder="1234 Main St"
												value={formData.street_address_1}
												onChange={handleChange}
												required
											/>
											<div className="invalid-feedback">
												Please enter a valid address.
											</div>
										</div>
										<div className="col-12">
											<label
												htmlFor="street_address_2"
												className="form-label"
											>
												Address 2
											</label>
											<input
												type="text"
												className="form-control"
												name="street_address_2"
												id="street_address_2"
												placeholder="Apartment, studio, or floor"
												value={formData.street_address_2}
												onChange={handleChange}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="mb-3">
								<button type="submit" className="btn btn-primary">
									Check
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

export default ApplicationStatus;
