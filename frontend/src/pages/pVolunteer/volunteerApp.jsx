import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./volunteerApp.module.css";

const VolunteerForm = () => {
	const navigate = useNavigate();

	const [tooltipText, setTooltipText] = useState("");
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

	const validate = (field, value) => {
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

			case "areasOfHelp":		// Validate areas of help
				return (formData.areasOfHelp.length != 0);
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
						<div className="card-body">
							<div className="row">
								<div className="col">
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
								<div className="col">
									<input
										placeholder="First Name"
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
							<div className="row mt-2">
								<div className="col">
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
								<div className="col">
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
						<div className="card-body">
							<div className="row mt-2">
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
						<div className={styles.areasOfHelpWrapper}>
							<div className="card-header">
								Areas of Help:
							</div>
							<div className="card-body">
								<div className={styles.areasOfHelpContainer}>
									<div
										className={styles.checkboxWrapper}
										onMouseEnter={() => handleMouseEnter("Collaborate with Sarasota Government contact to acquire volunteers from other areas if required. Assure volunteer applications and waivers are completed. Data Entry to CRM software. Train volunteers with basic and expected roles. Manage and collect volunteer hours for reporting to the county. Make phone calls to clients requesting work, or volunteers. Answer phone calls.")}
										onMouseLeave={handleMouseLeave}
									>
										<label className={styles.volunteerLabel}>
											<input
												className={styles.checkboxInput}
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
										className={styles.checkboxWrapper}
										onMouseEnter={() => handleMouseEnter("Makes sure volunteers are fed and rested. Keeps the food management systems in order and items needed for delivery. Collects donations such as clothes, shoes, towels and hygiene items for delivery.")}
										onMouseLeave={handleMouseLeave}
									>
										<label className={styles.volunteerLabel}>
											<input
												className={styles.checkboxInput}
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
										className={styles.checkboxWrapper}
										onMouseEnter={() => handleMouseEnter("Identifies where things are located, keeps track of all materials signed out, and tracks the return. Organize, manage incoming supplies of food, water, tarps, equipment, etc.")}
										onMouseLeave={handleMouseLeave}
									>
										<label className={styles.volunteerLabel}>
											<input
												className={styles.checkboxInput}
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
										className={styles.checkboxWrapper}
										onMouseEnter={() => handleMouseEnter("Engage with local community to raise awareness about the hub’s services. Notify neighborhoods without power or communication ability on where to get help. May require visiting devastated neighborhoods and handing out flyers.")}
										onMouseLeave={handleMouseLeave}
									>
										<label className={styles.volunteerLabel}>
											<input
												className={styles.checkboxInput}
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
										className={styles.checkboxWrapper}
										onMouseEnter={() => handleMouseEnter("Physically helping in the affected areas for indoor or outdoor debris removal, general")}
										onMouseLeave={handleMouseLeave}
									>
										<label className={styles.volunteerLabel}>
											<input
												className={styles.checkboxInput}
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
							</div>
						</div>

						<div className={styles.tooltipTextBlock}>
							{tooltipText && <p>{tooltipText}</p>}
						</div>
						<div className="invalid-feedback">
							Areas of Help is required.
						</div>
					</div>
					<button type="submit" className={styles.volunteerButton}>
						Submit
					</button>
				</div>
			</form>
		</div >
	);
};

export default VolunteerForm;
