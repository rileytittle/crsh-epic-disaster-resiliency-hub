import React, { useState } from "react";

const HomeownerApply = () => {
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone_number: "",
		street_address_1: "",
		street_address_2: undefined,
		city: "",
		state: "",
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
	});

	function toggleOther() {
		const checkbox = document.getElementById("helpOther");
		const customResponse = document.getElementById("other");
		const label = document.getElementById("otherLabel");

		// Toggle the textarea based on the checkbox status
		if (checkbox.checked) {
			label.style.display = "none";
			customResponse.style.display = "inline";
		} else {
			label.style.display = "inline";
			customResponse.style.display = "none";
			customResponse.value = ""; // Clear input when unchecked
			setFormData({
				...formData,
				other: "",
			}); // Clear input when unchecked
		}
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		//console.log(type);
		if (type === "checkbox") {
			setFormData({
				...formData,
				[e.target.id]: e.target.checked,
			});
			/*
			setFormData((prevData) => {
				const newHelpType = checked
					? [...prevData.helpType, value] // Add value if checked
					: prevData.helpType.filter((area) => area !== value); // Remove value if unchecked

				return {
					...prevData,
					helpType: newHelpType,
				};
			});
			*/
		} else {
			//console.log({ name, value, checked });
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const formSubmitted = async (e) => {
		e.preventDefault();
		console.log(formData);
		console.log(JSON.stringify(formData));
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/homeowner/requestHelp`,
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
	};

	return (
		// action=`${import.meta.env.VITE_BACKEND_URL}/homeowner/requestHelp` method="POST"
		<div style={{ margin: "5px" }}>
			<form
				id="homeownerForm"
				onSubmit={formSubmitted}
				className="row g-3"
			>
				<div className="col-md-6">
					<label htmlFor="first_name" className="form-label">
						First Name
					</label>
					<input
						type="text"
						className="form-control"
						name="first_name"
						id="first_name"
						value={formData.first_name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="last_name" className="form-label">
						Last Name
					</label>
					<input
						type="text"
						className="form-control"
						name="last_name"
						id="last_name"
						value={formData.last_name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="email" className="form-label">
						E-Mail
					</label>
					<input
						type="email"
						className="form-control"
						name="email"
						id="email"
						placeholder=""
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="phone_number" className="form-label">
						Phone Number
					</label>
					<input
						type="tel"
						className="form-control"
						name="phone_number"
						id="phone_number"
						placeholder=""
						value={formData.phone_number}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-12">
					<label htmlFor="address_1" className="form-label">
						Address
					</label>
					<input
						type="text"
						className="form-control"
						name="street_address_1"
						id="street_address_1"
						placeholder="1234 Main St"
						value={formData.street_address_1}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-12">
					<label htmlFor="street_address_2" className="form-label">
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
					<label htmlFor="city" className="form-label">
						City
					</label>
					<input
						type="text"
						className="form-control"
						name="city"
						id="city"
						value={formData.city}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-2">
					<label htmlFor="state" className="form-label">
						State
					</label>
					<select
						id="state"
						name="state"
						className="form-select"
						placeholder="Choose..."
						value={formData.state}
						onChange={handleChange}
						required
					>
						<option>Choose...</option>
						<option>Florida</option>
					</select>
				</div>
				<div className="col-md-2">
					<label htmlFor="zip_code" className="form-label">
						Zip
					</label>
					<input
						type="number"
						className="form-control"
						name="zip_code"
						id="zip_code"
						value={formData.zip_code}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-3">
					<label htmlFor="county" className="form-label">
						County
					</label>
					<select
						id="county"
						name="county"
						className="form-select"
						placeholder="Choose..."
						value={formData.county}
						onChange={handleChange}
					>
						<option>Choose...</option>
						<option>Charlotte</option>
						<option>Sarasota</option>
					</select>
				</div>
				<div className="col-12">
					I need help with...
					<div style={{ margin: "0px 0px 0px 20px" }}>
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
								type="text"
								name="other"
								id="other"
								style={{ display: "none" }}
								placeholder="Other"
								value={formData.other}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
				<div>
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
				<div className="col-12">
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</div>
			</form>
		</div>
	); //
};
export default HomeownerApply;
/*
Name
Phone number
email
physical address for service requested with state and County
“I need help with” 
	☐ Tarping
	☐ Yard cleanup
	☐ Interior cleanup
	☐ Emotional Support
	☐ Cleaning Supplies
	☐ Clean Water
	☐ Emergency Food
	☐ Other ____________
Ability to upload photos
SUBMIT button: “Submit” 
*/
