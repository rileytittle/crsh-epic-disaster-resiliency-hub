import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import styles from "./HomeownerApplication.module.css";

const HomeownerApply = () => {
	let emailRegEx =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const [validated, setValidated] = useState(false);
	const [formValidity, setFormValidity] = useState({
		first_name: null,
		last_name: null,
		email: null,
		phone_number: null,
		street_address_1: null,
		city: null,
		zip_code: null,
		county: null,
		help: null,
		other: null,
		description: null,
	});
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone_number: "",
		street_address_1: "",
		street_address_2: undefined,
		city: "",
		state: "Florida",
		zip_code: "",
		county: "",
		helpExterior: false,
		helpInterior: false,
		helpEmotional: false,
		helpSupplies: false,
		helpWater: false,
		helpFood: false,
		helpOther: false,
		other: "",
		description: "",
	});

	function toggleOther() {
		const checkbox = document.getElementById("helpOther");
		const customResponse = document.getElementById("other");
		const customCounter = document.getElementById("otherCount");
		const label = document.getElementById("otherLabel");

		// Toggle the textarea based on the checkbox status
		if (checkbox.checked) {
			label.style.display = "none";
			customResponse.style.display = "inline";
			customCounter.style.display = "inline";
		} else {
			label.style.display = "inline";
			customResponse.style.display = "none";
			customResponse.value = ""; // Clear input when unchecked
			customCounter.style.display = "none";
			setFormData({
				...formData,
				other: "",
			}); // Clear input when unchecked
		}
	}
	useEffect(() => {
		//					  if any checkbox is checked
		const checkboxValidity =
			formData.helpExterior ||
			formData.helpInterior ||
			formData.helpEmotional ||
			formData.helpSupplies ||
			formData.helpWater ||
			formData.helpFood ||
			formData.helpOther;
		setFormValidity((prev) => ({ ...prev, help: checkboxValidity }));

		//					if  other=unchecked     or  other=checked       &   other has data                &   other is less than 100 chars
		const otherValidity =
			!formData.helpOther ||
			(formData.helpOther &&
				formData.other.trim() !== "" &&
				formData.other.trim().length <= 100);
		setFormValidity((prev) => ({ ...prev, other: otherValidity }));
	}, [formData]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		//console.log(`name: ${name}, value: ${value}, checked: ${checked}`);
		if (type === "checkbox") {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
			if (name == "helpOther" && formData.other == "") {
				formValidity.other = false;
			} else {
				let validation = false;
				switch (name) {
					case "first_name":
					case "last_name":
					case "street_address_1":
					case "city":
						validation = value.trim() != "";
						break;
					case "email":
						validation = emailRegEx.test(value.trim());
						break;
					case "phone_number":
						validation = value.trim().length == 10;
						break;
					case "zip_code":
						validation = value.trim().length == 5;
						break;
					case "county":
						validation =
							value.trim() != "Choose..." && value.trim() != "";
						break;
					case "other":
						validation =
							value.trim() != "" && value.trim().length <= 100;
						break;
					case "description":
						validation =
							value.trim() != "" && value.trim().length <= 500;
						break;
				}
				//console.log(`${name}: ${validation}`);
				setFormValidity({
					...formValidity,
					[name]: validation,
				});
			}
		}
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
			email: emailRegEx.test(formData.email.trim()),
			phone_number: formData.phone_number.trim().length == 10,
			street_address_1: formData.street_address_1.trim() != "",
			city: formData.city.trim() != "",
			zip_code: formData.zip_code.trim().length == 5,
			county:
				formData.county.trim() != "Choose..." &&
				formData.county.trim() != "",
			help:
				formData.helpExterior ||
				formData.helpInterior ||
				formData.helpEmotional ||
				formData.helpSupplies ||
				formData.helpWater ||
				formData.helpFood ||
				formData.helpOther,
			other:
				!formData.helpOther ||
				(formData.helpOther &&
					formData.other.trim() !== "" &&
					formData.other.trim().length <= 100),
			description:
				formData.description.trim() != "" &&
				formData.description.trim().length <= 500,
		};

		setFormValidity(newFormValidity);

		const isFormValid = Object.values(newFormValidity).every(
			(valid) => valid
		);

		if (!isFormValid) {
			console.log(`not validated: ${isFormValid}`);
			e.stopPropagation();
		} else {
			console.log(`validated: ${isFormValid}`, formData);
			console.log(JSON.stringify(formData));
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/homeowner/requestHelp`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(formData),
					}
				);

				const result = await response.json();
				console.log(result);
				alert(result.message);
				//document.getElementById("homeownerForm").reset();
			} catch (error) {
				console.error("Error:", error);
			}
		}
		setValidated(true);
	};
	return (
		// action=`${import.meta.env.VITE_BACKEND_URL}/homeowner/requestHelp` method="POST"
		<div>
			<div className="text-center text-decoration-underline">
				<h2 className="fw-bold">Request Help</h2>
			</div>
			<div className="container mt-4">
				<div className="text-center my-3">
					<a href="/request-help/status">
						<button className="btn btn-info">
							Check the Status of your Application
						</button>
					</a>
				</div>
				<form
					noValidate
					id="homeownerForm"
					onSubmit={formSubmitted}
					className="row g-3 needs-validation"
				>
					<div
						className={`card rounded-3 shadow-lg ${styles.cardParent0} mb-4`}
					>
						<div
							className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}
						>
							<div className="card-body">
								<div className="row">
									<div className="col">
										<input
											placeholder="First Name"
											type="text"
											className={`form-control ${
												formValidity.first_name === null
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
											className={`form-control ${
												formValidity.last_name === null
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

								<div className="row mt-2">
									<div className="col">
										<input
											placeholder="E-Mail"
											type="email"
											className={`form-control ${
												formValidity.email === null
													? ""
													: formValidity.email
													? "is-valid"
													: "is-invalid"
											}`}
											name="email"
											id="email"
											value={formData.email}
											onChange={handleChange}
											required
										/>
										<div className="invalid-feedback">
											Please enter a valid E-mail
										</div>
									</div>
									<div className="col">
										<input
											placeholder="Phone Number"
											type="tel"
											className={`form-control ${
												formValidity.phone_number ===
												null
													? ""
													: formValidity.phone_number
													? "is-valid"
													: "is-invalid"
											}`}
											name="phone_number"
											id="phone_number"
											value={formData.phone_number}
											onChange={handleChange}
											required
										/>
										<div className="invalid-feedback">
											Please enter a valid Phone Number.
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
											className={`form-control ${
												formValidity.street_address_1 ===
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
									<div className="col-md-5">
										<label
											htmlFor="city"
											className="form-label"
										>
											City
										</label>
										<input
											type="text"
											className={`form-control ${
												formValidity.city === null
													? ""
													: formValidity.city
													? "is-valid"
													: "is-invalid"
											}`}
											name="city"
											id="city"
											value={formData.city}
											onChange={handleChange}
											required
										/>
										<div className="invalid-feedback">
											Please enter a valid city.
										</div>
									</div>
									<div className="col-md-2">
										<label
											htmlFor="state"
											className="form-label"
										>
											State
										</label>
										<select
											data-tooltip-id="stateTooltip"
											disabled={true}
											id="state"
											name="state"
											className="form-select"
											placeholder="Florida"
											value={formData.state}
											onChange={handleChange}
											required
										>
											<option>Florida</option>
										</select>
										<Tooltip
											id="stateTooltip"
											place="top"
											effect="solid"
										>
											Florida is the only supported State
										</Tooltip>
									</div>
									<div className="col-md-2">
										<label
											htmlFor="zip_code"
											className="form-label"
										>
											Zip
										</label>
										<input
											type="number"
											className={`form-control ${
												formValidity.zip_code === null
													? ""
													: formValidity.zip_code
													? "is-valid"
													: "is-invalid"
											}`}
											name="zip_code"
											id="zip_code"
											value={formData.zip_code}
											onChange={handleChange}
											required
										/>
										<div className="invalid-feedback">
											Please enter a valid zip code.
										</div>
									</div>
									<div className="col-md-3">
										<label
											htmlFor="county"
											className="form-label"
										>
											County
										</label>
										<select
											required
											id="county"
											name="county"
											className={`form-select ${
												formValidity.county === null
													? ""
													: formValidity.county
													? "is-valid"
													: "is-invalid"
											}`}
											placeholder="Choose..."
											value={formData.county}
											onChange={handleChange}
										>
											<option>Choose...</option>
											<option>Charlotte</option>
											<option>Sarasota</option>
										</select>
										<div className="invalid-feedback">
											Please select a county.
										</div>
									</div>
								</div>
							</div>
						</div>
						<div
							className={`${
								styles.cardParent1
							} card rounded-3 shadow-sm m-2 ${
								formValidity.help === null
									? ""
									: formValidity.help
									? "is-valid"
									: "is-invalid"
							}`}
						>
							<div className="card-header">
								I need help with...
							</div>
							<div className="card-body">
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpExterior"
										type="checkbox"
										name="helpExterior"
										value={formData.helpExterior}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpExterior"
									>
										Yard Cleanup
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpInterior"
										type="checkbox"
										name="helpInterior"
										value={formData.helpInterior}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpInterior"
									>
										Interior Cleanup
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpEmotional"
										type="checkbox"
										name="helpEmotional"
										value={formData.helpEmotional}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpEmotional"
									>
										Emotional Support
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpSupplies"
										type="checkbox"
										name="helpSupplies"
										value={formData.helpSupplies}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpSupplies"
									>
										Cleaning Supplies
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpWater"
										type="checkbox"
										name="helpWater"
										value={formData.helpWater}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpWater"
									>
										Clean Water
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpFood"
										type="checkbox"
										name="helpFood"
										value={formData.helpFood}
										onChange={handleChange}
									/>
									<label
										className="form-check-label"
										htmlFor="helpFood"
									>
										Emergency Food
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										id="helpOther"
										value="other"
										checked={formData.helpOther}
										type="checkbox"
										name="helpOther"
										onChange={handleChange}
										onClick={toggleOther}
									/>
									<label
										id="otherLabel"
										className="form-check-label"
										htmlFor="other"
									>
										Other
									</label>
									<input
										className={`${
											formValidity.other === null
												? ""
												: formValidity.other
												? "is-valid"
												: "is-invalid"
										}`}
										type="text"
										name="other"
										id="other"
										style={{ display: "none" }}
										placeholder="Other"
										value={formData.other}
										onChange={handleChange}
									/>
									<span
										className={`${styles.counter}`}
										name="otherCount"
										id="otherCount"
										style={{ display: "none" }}
									>
										&ensp;
										{formData.other.trim().length} / 100
									</span>
									<div className="invalid-feedback">
										Please enter an other area of help.{" "}
										<br />
										Other must be less than 100 characters.
									</div>
								</div>
							</div>
						</div>
						<div className="invalid-feedback text-center mb-3">
							Please select a help type.
						</div>
						<div
							className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}
						>
							<div className="card-header">
								Description
								<span className={`${styles.counter}`}>
									&ensp; {formData.description.trim().length}{" "}
									/ 500
								</span>
							</div>
							<div className="card-body">
								<textarea
									required
									rows="3"
									name="description"
									id="description"
									value={formData.description}
									onChange={handleChange}
									className={`form-control ${
										formValidity.description === null
											? ""
											: formValidity.description
											? "is-valid"
											: "is-invalid"
									}`}
								></textarea>
								<div className="invalid-feedback text-center">
									Please enter a brief description of the help
									needed. <br />
									Description must be less than 500 characters
								</div>
							</div>
						</div>

						<div className={`collapse`}>
							<label htmlFor="inputImages" className="form-label">
								Upload photos of the help area
							</label>
							<input
								className="form-control"
								type="file"
								accept="image/*"
								id="inputImages"
								multiple
							/>
						</div>
						<div className="text-center my-3">
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	); //
};
export default HomeownerApply;
