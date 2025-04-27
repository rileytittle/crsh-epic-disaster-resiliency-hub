import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./volunteerApp.module.css";

const VolunteerForm = () => {
	const navigate = useNavigate();

	const [formValidity, setFormValidity] = useState({
		firstName: null,
		lastName: null,
		phoneNumber: null,
		email: null,
		streetAddress1: null,
		city: null,
		state: null,
		county: null,
		zipCode: null,
		areasOfHelp: null,
	});

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",
		streetAddress1: "",
		streetAddress2: "",
		city: "",
		state: "",
		county: "",
		zipCode: "",
		areasOfHelp: [],
	});

	const [tooltipText, setTooltipText] = useState("");
	const [submitDisabled, setSubmitDisabled] = useState(true);

	const handleTOS = () => {
		setSubmitDisabled(!submitDisabled);
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === "areasOfHelp") {
			setFormData((prevData) => {
				const newAreasOfHelp = checked
					? [...prevData.areasOfHelp, value]
					: prevData.areasOfHelp.filter((area) => area !== value);

				return {
					...prevData,
					areasOfHelp: newAreasOfHelp,
				};
			});

		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
		setFormValidity({
			...formValidity,
			[name]: validate(name, value),
		});
	};
	useEffect(() => { //checkbox executes faster than the formData updates so it needs to be checked seperately
		// if any checkbox is checked
		const checkboxValidity = formData.areasOfHelp.length != 0;
		setFormValidity((prev) => ({ ...prev, areasOfHelp: checkboxValidity }));
	}, [formData]);

	function validate(field, value) {
		switch (field) {
			case "firstName":		// Validate first name
			case "lastName":		// Validate last name
			case "streetAddress1":	// Validate address
			case "city":			// Validate city
			case "county":			// Validate county
				return value.trim() != "";

			case "phoneNumber": 	// Validate phone number
				return (/^[\d]{10}$/.test(value));

			case "email":			// Validate email
				return (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value));

			case "state":			// Validate state
				return value.trim() != "";

			case "zipCode":			// Validate zip code
				return (/^\d{5}$/.test(value))
		}
	};


	const handleSubmit = async (e) => {
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
			firstName: validate = ("firstName", formData.firstName),
			lastName: validate = ("lastName", formData.lastName),
			phoneNumber: validate = ("phoneNumber", formData.phoneNumber),
			email: validate = ("email", formData.email),
			streetAddress1: validate = ("streetAddress1", formData.streetAddress1),
			city: validate = ("city", formData.city),
			state: validate = ("state", formData.state),
			county: validate = ("county", formData.county),
			zipCode: validate = ("zipCode", formData.zipCode),
			areasOfHelp: (formData.areasOfHelp.length != 0),

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
				const response = await fetch(`${import.meta.env.VITE_API_URL}/volunteer/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				const result = await response.json();
				console.log(result);
				if (response.ok) {
					navigate("/thank-you");
				} else {
					alert("Submission failed");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	const handleMouseEnter = (text) => setTooltipText(text);
	const handleMouseLeave = () => setTooltipText("");

	return (
		<div className="container mt-5">
			<div className="text-center mt-4">
				<h1 className="display-5 text-primary">
					Apply to Volunteer
				</h1>
			</div>
			<div className="container mt-4">
				<div className="text-center my-3">
					<a className="btn btn-primary" href="/applyVolunteer/status">
						Check the Status of your Application
					</a>
				</div>
			</div>
			<form noValidate id="volunteerApplicantForm" onSubmit={handleSubmit} className="row g-3 needs-validation" >
				<div className={`card rounded-3 shadow-lg ${styles.cardParent0} mb-4`} >
					<div className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}>
						<div className="card-body px-3 pt-2">
							<div className="row">
								<div className="col-md-6 mt-2">
									<input
										placeholder="First Name"
										type="text"
										name="firstName"
										className={`form-control ${formValidity.firstName === null
											? ""
											: formValidity.firstName
												? "is-valid"
												: "is-invalid"
											}`}
										value={formData.firstName}
										onChange={handleChange}
										required
									/>
									<div className="invalid-feedback">
										First Name is required.
									</div>
								</div>
								<div className="col-md-6 mt-2">
									<input
										placeholder="Last Name"
										type="text"
										name="lastName"
										className={`form-control ${formValidity.lastName === null
											? ""
											: formValidity.lastName
												? "is-valid"
												: "is-invalid"
											}`}
										value={formData.lastName}
										onChange={handleChange}
										required
									/>
									<div className="invalid-feedback">
										Last Name is required.
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6 mt-2">
									<input
										placeholder="Phone Number"
										type="tel"
										name="phoneNumber"
										className={`form-control ${formValidity.phoneNumber === null
											? ""
											: formValidity.phoneNumber
												? "is-valid"
												: "is-invalid"
											}`}
										value={formData.phoneNumber}
										onChange={handleChange}
										required
									/>
									<div className="invalid-feedback">
										Phone Number is required.
									</div>
								</div>
								<div className="col-md-6 mt-2">
									<input
										placeholder="Email"
										type="email"
										name="email"
										className={`form-control ${formValidity.email === null
											? ""
											: formValidity.email
												? "is-valid"
												: "is-invalid"
											}`}
										value={formData.email}
										onChange={handleChange}
										required
									/>
									<div className="invalid-feedback">
										Email is required.
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}>
						<div className="card-body px-4">
							<div className="row">
								<input
									placeholder="Street Address Line 1"
									type="text"
									name="streetAddress1"
									className={`form-control ${formValidity.streetAddress1 === null
										? ""
										: formValidity.streetAddress1
											? "is-valid"
											: "is-invalid"
										}`}
									value={formData.streetAddress1}
									onChange={handleChange}
									required
								/>
								<div className="invalid-feedback">
									Street Address 1 is required.
								</div>
							</div>
							<div className="row mt-2">
								<input
									placeholder="Street Address Line 2"
									type="text"
									name="streetAddress2"
									className="form-control"
									value={formData.streetAddress2}
									onChange={handleChange}
								/>

							</div>
							<div className="row mt-2">
								<input
									placeholder="City"
									type="text"
									name="city"
									className={`form-control ${formValidity.city === null
										? ""
										: formValidity.city
											? "is-valid"
											: "is-invalid"
										}`}
									value={formData.city}
									onChange={handleChange}
									required
								/>
								<div className="invalid-feedback">
									City is required.
								</div>

							</div>
							<div className="row mt-2">
								<select
									placeholder="Select a state..."
									name="state"
									className={`form-select ${formValidity.state === null
										? ""
										: formValidity.state
											? "is-valid"
											: "is-invalid"
										}`}
									value={formData.state}
									onChange={handleChange}
									required
								>
									<option value="">Select a state...</option>
									<option value="Alabama">Alabama</option>
									<option value="Alaska">Alaska</option>
									<option value="Arizona">Arizona</option>
									<option value="Arkansas">Arkansas</option>
									<option value="California">California</option>
									<option value="Colorado">Colorado</option>
									<option value="Connecticut">Connecticut</option>
									<option value="Delaware">Delaware</option>
									<option value="Florida">Florida</option>
									<option value="Georgia">Georgia</option>
									<option value="Hawaii">Hawaii</option>
									<option value="Idaho">Idaho</option>
									<option value="Illinois">Illinois</option>
									<option value="Indiana">Indiana</option>
									<option value="Iowa">Iowa</option>
									<option value="Kansas">Kansas</option>
									<option value="Kentucky">Kentucky</option>
									<option value="Louisiana">Louisiana</option>
									<option value="Maine">Maine</option>
									<option value="Maryland">Maryland</option>
									<option value="Massachusetts">Massachusetts</option>
									<option value="Michigan">Michigan</option>
									<option value="Minnesota">Minnesota</option>
									<option value="Mississippi">Mississippi</option>
									<option value="Missouri">Missouri</option>
									<option value="Montana">Montana</option>
									<option value="Nebraska">Nebraska</option>
									<option value="Nevada">Nevada</option>
									<option value="New Hampshire">New Hampshire</option>
									<option value="New Jersey">New Jersey</option>
									<option value="New Mexico">New Mexico</option>
									<option value="New York">New York</option>
									<option value="North Carolina">North Carolina</option>
									<option value="North Dakota">North Dakota</option>
									<option value="Ohio">Ohio</option>
									<option value="Oklahoma">Oklahoma</option>
									<option value="Oregon">Oregon</option>
									<option value="Pennsylvania">Pennsylvania</option>
									<option value="Rhode Island">Rhode Island</option>
									<option value="South Carolina">South Carolina</option>
									<option value="South Dakota">South Dakota</option>
									<option value="Tennessee">Tennessee</option>
									<option value="Texas">Texas</option>
									<option value="Utah">Utah</option>
									<option value="Vermont">Vermont</option>
									<option value="Virginia">Virginia</option>
									<option value="Washington">Washington</option>
									<option value="West Virginia">West Virginia</option>
									<option value="Wisconsin">Wisconsin</option>
									<option value="Wyoming">Wyoming</option>
								</select>
								<div className="invalid-feedback">
									State is required.
								</div>

							</div>
							<div className="row mt-2">

								<input
									placeholder="County"
									type="text"
									name="county"
									className={`form-control ${formValidity.county === null
										? ""
										: formValidity.county
											? "is-valid"
											: "is-invalid"
										}`}
									value={formData.county}
									onChange={handleChange}
									required
								/>
								<div className="invalid-feedback">
									County is required.
								</div>

							</div>
							<div className="row mt-2">
								<input
									placeholder="Zip Code"
									type="number"
									name="zipCode"
									className={`form-control ${formValidity.zipCode === null
										? ""
										: formValidity.zipCode
											? "is-valid"
											: "is-invalid"
										}`}
									value={formData.zipCode}
									onChange={handleChange}
									required
								/>
								<div className="invalid-feedback">
									Zip Code is required.
								</div>
							</div>
						</div>
					</div>

					<div className={`${styles.cardParent1} card rounded-3 shadow-sm m-2`}>
						<div className="card-header">
							Areas of Help:
						</div>
						<div className="card-body">
							<div className="row px-2">
								<div className={`card col-md-6 p-2`}>
									<div className={`${formValidity.areasOfHelp === null
										? ""
										: formValidity.areasOfHelp
											? "is-valid"
											: "is-invalid"
										}`}
									>
										<div
											className={`col`}
											onMouseEnter={() => handleMouseEnter("Collaborate with Sarasota Government contact to acquire volunteers from other areas if required. Assure volunteer applications and waivers are completed. Data Entry to CRM software. Train volunteers with basic and expected roles. Manage and collect volunteer hours for reporting to the county. Make phone calls to clients requesting work, or volunteers. Answer phone calls.")}
											onMouseLeave={handleMouseLeave}
										>
											<label className="btn btn-light w-100">
												<input
													className="me-1"
													type="checkbox"
													name="areasOfHelp"
													value="Volunteer Management and Administration Team"
													checked={formData.areasOfHelp.includes("Volunteer Management and Administration Team")}
													onChange={handleChange}
												/>
												Volunteer Management and Administration
											</label>
										</div>

										<div
											className={`col mt-2`}
											onMouseEnter={() => handleMouseEnter("Makes sure volunteers are fed and rested. Keeps the food management systems in order and items needed for delivery. Collects donations such as clothes, shoes, towels and hygiene items for delivery.")}
											onMouseLeave={handleMouseLeave}
										>
											<label className="btn btn-light w-100">
												<input
													className="me-1"
													type="checkbox"
													name="areasOfHelp"
													value="Hospitality Team"
													checked={formData.areasOfHelp.includes("Hospitality Team")}
													onChange={handleChange}
												/>
												Hospitality
											</label>
										</div>


										<div
											className={`col mt-2`}
											onMouseEnter={() => handleMouseEnter("Identifies where things are located, keeps track of all materials signed out, and tracks the return. Organize, manage incoming supplies of food, water, tarps, equipment, etc.")}
											onMouseLeave={handleMouseLeave}
										>
											<label className="btn btn-light w-100">
												<input
													className="me-1"
													type="checkbox"
													name="areasOfHelp"
													value="Logistic Tracking Team"
													checked={formData.areasOfHelp.includes("Logistic Tracking Team")}
													onChange={handleChange}
												/>
												Logistic Tracking
											</label>
										</div>


										<div
											className={`col mt-2`}
											onMouseEnter={() => handleMouseEnter("Engage with local community to raise awareness about the hub’s services. Notify neighborhoods without power or communication ability on where to get help. May require visiting devastated neighborhoods and handing out flyers.")}
											onMouseLeave={handleMouseLeave}
										>
											<label className="btn btn-light w-100">
												<input
													className="me-1"
													type="checkbox"
													name="areasOfHelp"
													value="Community Outreach Team"
													checked={formData.areasOfHelp.includes("Community Outreach Team")}
													onChange={handleChange}
												/>
												Community Outreach
											</label>
										</div>


										<div
											className={`col mt-2`}
											onMouseEnter={() => handleMouseEnter("Physically helping in the affected areas for indoor or outdoor debris removal, general")}
											onMouseLeave={handleMouseLeave}
										>
											<label className="btn btn-light w-100">
												<input
													className="me-1"
													type="checkbox"
													name="areasOfHelp"
													value="Community Helpers Team"
													checked={formData.areasOfHelp.includes("Community Helpers Team")}
													onChange={handleChange}
												/>
												EPIC Helpers
											</label>
										</div>
									</div>
									<div className="invalid-feedback text-center mt-3 mb-0">
										Areas of Help is required.
									</div>
								</div>
								<div className={`col-md-6 `} style={{ minHeight: "260px" }}>
									{tooltipText && <p className={`m-0`}>{tooltipText}</p>}
								</div>
							</div>
						</div>
					</div>
					<div className="mx-auto mb-4 btn btn-light"
					>
						<div className="row me-3">
							<div className="col-auto">
								<input
									className="ms-3 mt-2"
									style={{ transform: "scale(2)" }}
									type="checkbox"
									value=""
									id="checkDefault"
									onChange={handleTOS}
								/>
							</div>
							<div className="col text-start">
								<label
									className="ms-2"
									htmlFor="checkDefault"
								>
									[DUMMY DATA] By clicking this checkbox, you agree to EPIC's Terms of Service and acknowledge that your personal information will be processed as outlined in our Privacy Policy. This includes using your data to improve our services and communicate with you about updates and offers. If you have any concerns about how your data is handled, please review our Privacy Policy for more details.
								</label>
							</div>
						</div>
					</div>
					<button type="submit" className="text-center my-3 btn btn-primary" disabled={submitDisabled}>
						Submit
					</button>
				</div>
			</form >
		</div >
	);
};

export default VolunteerForm;
