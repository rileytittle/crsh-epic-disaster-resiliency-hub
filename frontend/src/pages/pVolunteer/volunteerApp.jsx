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

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name === "areasOfHelp") {
			setFormData((prevData) => {
				const newAreasOfHelp = checked
					? [...prevData.areasOfHelp, value] // Add value if checked
					: prevData.areasOfHelp.filter((area) => area !== value); // Remove value if unchecked

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
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/volunteer/create",
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
			if(response.ok){
				navigate("/thank-you");
			}
			else{
				alert("submission failed")
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form className={styles.volunteerForm} onSubmit={handleSubmit}>
			<input
				className={styles.volunteerInput}
				type="text"
				name="firstName"
				placeholder="First Name"
				value={formData.firstName}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="text"
				name="lastName"
				placeholder="Last Name"
				value={formData.lastName}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="tel"
				name="phoneNumber"
				placeholder="Phone Number"
				value={formData.phoneNumber}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="email"
				name="email"
				placeholder="Email"
				value={formData.email}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="text"
				name="streetAddress1"
				placeholder="Street Address Line 1"
				value={formData.streetAddress1}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="text"
				name="streetAddress2"
				placeholder="Street Address Line 2"
				value={formData.streetAddress2}
				onChange={handleChange}
			/>
			<input
				className={styles.volunteerInput}
				type="text"
				name="city"
				placeholder="City"
				value={formData.city}
				onChange={handleChange}
				required
			/>
			<input
				className={styles.volunteerInput}
				type="text"
				name="state"
				placeholder="State"
				value={formData.state}
				onChange={handleChange}
				required
			/>
			<select
						id="county"
						name="county"
						className={styles.volunteerInput}
						placeholder="Choose..."
						value={formData.county}
						onChange={handleChange}
						required
					>
						<option>Choose...</option>
						<option>Charlotte</option>
						<option>Sarasota</option>
			</select>
			<input
				className={styles.volunteerInput}
				type="text"
				name="zipCode"
				placeholder="Zip Code"
				value={formData.zipCode}
				onChange={handleChange}
				required
			/>

			<label>Areas of Help:</label>
			<div className={styles.areasOfHelpContainer}>
				<label
					htmlFor="managementTeam"
					className={styles.volunteerLabel}
				>
					<input
						className={styles.checkboxInput}
						type="checkbox"
						id="managementTeam"
						name="areasOfHelp"
						value="Volunteer Management and Administration Team"
						checked={formData.areasOfHelp.includes(
							"Volunteer Management and Administration Team"
						)}
						onChange={handleChange}
					/>
					Volunteer Management and Administration Team
					<span className={styles.infoTooltip}>
						Collaborate with Sarasota Government contact to acquire
						volunteers from other areas if required. Assure
						volunteer applications and waivers are completed. Data
						Entry to CRM software. Train volunteers with basic and
						expected roles. Manage and collect volunteer hours for
						reporting to the county. Make phone calls to clients
						requesting work, or volunteers. Answer phone calls.
					</span>
				</label>
				<label className={styles.volunteerLabel}>
					<input
						className={styles.checkboxInput}
						type="checkbox"
						name="areasOfHelp"
						value="Hospitality Team"
						checked={formData.areasOfHelp.includes(
							"Hospitality Team"
						)}
						onChange={handleChange}
					/>
					Hospitality Team
					<span className={styles.infoTooltip}>
						Makes sure volunteers are fed and rested. Keeps the food
						management systems in order and items needed for
						delivery. Collects donations such as clothes, shoes,
						towels and hygiene items for delivery.
					</span>
				</label>

				<label className={styles.volunteerLabel}>
					<input
						className={styles.checkboxInput}
						type="checkbox"
						name="areasOfHelp"
						value="Logistic Tracking Team"
						checked={formData.areasOfHelp.includes(
							"Logistic Tracking Team"
						)}
						onChange={handleChange}
					/>
					Logistic Tracking Team
					<span className={styles.infoTooltip}>
						Identifies where things are located, keeps track of all
						materials signed out, and tracks the return. Organize,
						manage incoming supplies of food, water, tarps,
						equipment, etc.
					</span>
				</label>

				<label className={styles.volunteerLabel}>
					<input
						className={styles.checkboxInput}
						type="checkbox"
						name="areasOfHelp"
						value="Community Outreach Team"
						checked={formData.areasOfHelp.includes(
							"Community Outreach Team"
						)}
						onChange={handleChange}
					/>
					Community Outreach
					<span className={styles.infoTooltip}>
						Engage with local community to raise awareness about the
						hub’s services. Notify neighborhoods without power or
						communication ability on where to get help. May require
						visiting devastated neighborhoods and handing out
						flyers.
					</span>
				</label>
				<label className={styles.volunteerLabel}>
					<input
						className={styles.checkboxInput}
						type="checkbox"
						name="areasOfHelp"
						value="Community Helpers Team"
						checked={formData.areasOfHelp.includes(
							"Community Helpers Team"
						)}
						onChange={handleChange}
					/>
					Community Helpers Team
					<span className={styles.infoTooltip}>
						Physically helping in the affected areas for indoor or
						outdoor debris removal, general
					</span>
				</label>
			</div>

			<button type="submit">Submit</button>
		</form>
	);
};

export default VolunteerForm;
