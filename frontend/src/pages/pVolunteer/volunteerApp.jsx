import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./volunteerApp.module.css";

const VolunteerForm = () => {
	const navigate = useNavigate();
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

	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [tooltipText, setTooltipText] = useState("");

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

		setTouched({ ...touched, [name]: true });
	};


	const handleBlur = (e) => {
		setTouched({ ...touched, [e.target.name]: true });
		validate(e.target.name);
	};

	const validate = (field) => {
		const newErrors = { ...errors };

		// Validate first name
		if (field === "firstName" || !field) {
			if (!formData.firstName) newErrors.firstName = "First Name is required.";
			else delete newErrors.firstName;
		}

		// Validate last name
		if (field === "lastName" || !field) {
			if (!formData.lastName) newErrors.lastName = "Last Name is required.";
			else delete newErrors.lastName;
		}

		// Validate phone number
		if (field === "phoneNumber" || !field) {
			if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
			else if (!/^[\d]{10}$/.test(formData.phoneNumber))
				newErrors.phoneNumber = "Please enter a valid phone number.";
			else delete newErrors.phoneNumber;
		}

		// Validate email
		if (field === "email" || !field) {
			if (!formData.email) newErrors.email = "Email is required.";
			else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
				newErrors.email = "Please enter a valid email address.";
			else delete newErrors.email;
		}

		// Validate address
		if (field === "streetAddress1" || !field) {
			if (!formData.streetAddress1)
				newErrors.streetAddress1 = "Street Address Line 1 is required.";
			else delete newErrors.streetAddress1;
		}

		// Validate city
		if (field === "city" || !field) {
			if (!formData.city) newErrors.city = "City is required.";
			else delete newErrors.city;
		}

		// Validate state
		if (field === "state" || !field) {
			if (!formData.state) newErrors.state = "State is required.";
			else delete newErrors.state;
		}

		// Validate county
		if (field === "county" || !field) {
			if (!formData.county) newErrors.county = "County is required.";
			else delete newErrors.county;
		}

		// Validate zip code
		if (field === "zipCode" || !field) {
			if (!formData.zipCode) newErrors.zipCode = "Zip Code is required.";
			else if (!/^[\d]{5}$/.test(formData.zipCode)) {
				newErrors.zipCode = "Please enter a valid zip code.";
			}
			else delete newErrors.zipCode;
		}

		// Validate areas of help
		if (field === "areasOfHelp" || !field) {
			if (formData.areasOfHelp.length === 0 && touched.areasOfHelp) {
				newErrors.areasOfHelp = "At least one area of help is required.";
			} else {
				delete newErrors.areasOfHelp;
			}
		}

		setErrors(newErrors);
	};


	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if at least one area of help is selected
		if (formData.areasOfHelp.length === 0) {
			setErrors((prevErrors) => ({
				...prevErrors,
				areasOfHelp: "At least one area of help is required.",
			}));
			return;
		} else {
			// If areasOfHelp has selections, clear the error
			setErrors((prevErrors) => {
				const { areasOfHelp, ...rest } = prevErrors;
				return rest; // Removes the areasOfHelp error if it's selected
			});
		}

		// Proceed with the submission if no errors
		if (Object.keys(errors).length > 0) {
			alert("Please fix the errors before submitting.");
			return;
		}

		try {
			const response = await fetch(`http://localhost:3000/volunteer/create`, { //${import.meta.env.VITE_API_URL}
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
		<form className={styles.volunteerForm} onSubmit={handleSubmit}>
			<input
				className={`${styles.volunteerInput} ${touched.firstName && errors.firstName ? styles.error : ""}`}
				type="text"
				name="firstName"
				placeholder="First Name"
				value={formData.firstName}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.firstName && errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

			<input
				className={`${styles.volunteerInput} ${touched.lastName && errors.lastName ? styles.error : ""}`}
				type="text"
				name="lastName"
				placeholder="Last Name"
				value={formData.lastName}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.lastName && errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

			<input
				className={`${styles.volunteerInput} ${touched.phoneNumber && errors.phoneNumber ? styles.error : ""}`}
				type="tel"
				name="phoneNumber"
				placeholder="Phone Number"
				value={formData.phoneNumber}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.phoneNumber && errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}

			<input
				className={`${styles.volunteerInput} ${touched.email && errors.email ? styles.error : ""}`}
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.email && errors.email && <p className={styles.error}>{errors.email}</p>}

			<input
				className={`${styles.volunteerInput} ${touched.streetAddress1 && errors.streetAddress1 ? styles.error : ""}`}
				type="text"
				name="streetAddress1"
				placeholder="Street Address Line 1"
				value={formData.streetAddress1}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.streetAddress1 && errors.streetAddress1 && <p className={styles.error}>{errors.streetAddress1}</p>}

			<input
				className={styles.volunteerInput}
				type="text"
				name="streetAddress2"
				placeholder="Street Address Line 2"
				value={formData.streetAddress2}
				onChange={handleChange}
			/>

			<input
				className={`${styles.volunteerInput} ${touched.city && errors.city ? styles.error : ""}`}
				type="text"
				name="city"
				placeholder="City"
				value={formData.city}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.city && errors.city && <p className={styles.error}>{errors.city}</p>}

			<div className={styles.stateWrapper}>
				<input
					className={`${styles.volunteerInput} ${touched.state && errors.state ? styles.error : ""}`}
					type="text"
					name="state"
					placeholder="State"
					value="Florida"
					onChange={handleChange}
					onBlur={handleBlur}
					required
					disabled
				/>
				{touched.state && errors.state && <p className={styles.error}>{errors.state}</p>}
			</div>

			<select
				id="county"
				name="county"
				className={`${styles.volunteerInput} ${touched.county && errors.county ? styles.error : ""}`}
				value={formData.county}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			>
				<option>Choose...</option>
				<option>Charlotte</option>
				<option>Sarasota</option>
			</select>
			{touched.county && errors.county && <p className={styles.error}>{errors.county}</p>}

			<input
				className={`${styles.volunteerInput} ${touched.zipCode && errors.zipCode ? styles.error : ""}`}
				type="text"
				name="zipCode"
				placeholder="Zip Code"
				value={formData.zipCode}
				onChange={handleChange}
				onBlur={handleBlur}
				required
			/>
			{touched.zipCode && errors.zipCode && <p className={styles.error}>{errors.zipCode}</p>}

			<div className={styles.areasOfHelpWrapper}>
				<label className={styles.areasOfHelpLabel}>Areas of Help:</label>
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
							Community Helpers
						</label>
					</div>
				</div>
			</div>

			<div className={styles.tooltipTextBlock}>
				{tooltipText && <p>{tooltipText}</p>}
			</div>
			{errors.areasOfHelp && <p className={styles.error}>{errors.areasOfHelp}</p>}
			<button type="submit" className={styles.volunteerButton}>
				Submit
			</button>
		</form>
	);
};

export default VolunteerForm;
