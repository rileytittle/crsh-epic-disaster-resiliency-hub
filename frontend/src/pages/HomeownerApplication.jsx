import React, { useState } from "react";

const HomeownerApply = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address_1: "",
		address_2: "",
		city: "",
		state: "",
		zip: "",
		helpType: [],
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

		if (name === "inputHelpType") {
			setFormData((prevData) => {
				const newHelpType = checked
					? [...prevData.helpType, value] // Add value if checked
					: prevData.helpType.filter((area) => area !== value); // Remove value if unchecked

				return {
					...prevData,
					helpType: newHelpType,
				};
			});
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

		try {
			const response = await fetch(
				"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/homeowner/requestHelp",
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
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		// action="https://crsh-epic-disaster-resiliency-hub-server.vercel.app/homeowner/requestHelp" method="POST"
		<div style={{ margin: "5px" }}>
			<div style={{ marginBottom: "50px" }}>
				<center>
					<a href='/request-help/status' className='text-decoration-none'>
						<button className="btn btn-primary btn-sm px-5 d-flex justify-content-center" type='button'>Check the Status of your Application</button>
					</a>
				</center>
			</div>
			<form onSubmit={formSubmitted} className="row g-3">
				<div className="col-md-6">
					<label htmlFor="firstName" className="form-label">
						First Name
					</label>
					<input
						type="text"
						className="form-control"
						name="firstName"
						id="firstName"
						value={formData.firstName}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="lastName" className="form-label">
						Last Name
					</label>
					<input
						type="text"
						className="form-control"
						name="lastName"
						id="lastName"
						value={formData.lastName}
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
					<label htmlFor="phone" className="form-label">
						Phone Number
					</label>
					<input
						type="tel"
						className="form-control"
						name="phone"
						id="phone"
						placeholder=""
						value={formData.phone}
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
						name="address_1"
						id="address_1"
						placeholder="1234 Main St"
						value={formData.address_1}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-12">
					<label htmlFor="address_2" className="form-label">
						Address 2
					</label>
					<input
						type="text"
						className="form-control"
						name="address_2"
						id="address_2"
						placeholder="Apartment, studio, or floor"
						value={formData.address_2}
						onChange={handleChange}
					/>
				</div>
				<div className="col-md-6">
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
				<div className="col-md-4">
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
					<label htmlFor="zip" className="form-label">
						Zip
					</label>
					<input
						type="number"
						className="form-control"
						name="zip"
						id="zip"
						value={formData.zipCode}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-12">
					I need help with...
					<div style={{ margin: "0px 0px 0px 20px" }}>
						<div className="form-check">
							<input
								className="form-check-input"
								id="helpYard"
								value="yardCleanup"
								checked={formData.helpType.includes(
									"yardCleanup"
								)}
								type="checkbox"
								name="inputHelpType"
								onChange={handleChange}
							/>
							<label
								className="form-check-label"
								htmlFor="helpYard"
							>
								Yard Cleanup
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								id="helpInterior"
								value="interiorCleanup"
								checked={formData.helpType.includes(
									"interiorCleanup"
								)}
								type="checkbox"
								name="inputHelpType"
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
								value="emotionalSupport"
								checked={formData.helpType.includes(
									"emotionalSupport"
								)}
								type="checkbox"
								name="inputHelpType"
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
								value="cleaningSupplies"
								checked={formData.helpType.includes(
									"cleaningSupplies"
								)}
								type="checkbox"
								name="inputHelpType"
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
								value="cleanWater"
								checked={formData.helpType.includes(
									"cleanWater"
								)}
								type="checkbox"
								name="inputHelpType"
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
								value="emergencyFood"
								checked={formData.helpType.includes(
									"emergencyFood"
								)}
								type="checkbox"
								name="inputHelpType"
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
								checked={formData.helpType.includes("other")}
								type="checkbox"
								name="inputHelpType"
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
