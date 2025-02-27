import React, { useState } from "react";
import axios from "axios";
function GenerateReports() {
	const [year, setYear] = useState(0);
	const [queryResponse, setQueryResponse] = useState(null);
	async function generateReport() {
		try {
			const response = await axios.post(
				"http://localhost:3000/admin/reports",
				{
					year: year,
				},
				{
					responseType: "blob", // Make sure you're getting a blob response
				}
			);

			// Create a Blob from the response data
			const blob = new Blob([response.data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});

			// Create an anchor element to trigger the download
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "example.xlsx"; // Specify the download file name
			link.click(); // Simulate a click to start the download
		} catch (error) {
			console.error("Error downloading the file:", error);
		}
	}
	return (
		<div>
			<div className="card">
				<div className="card-body">
					<label htmlFor="year" className="form-label">
						Year
					</label>
					<select
						id="year"
						name="year"
						className="form-select"
						placeholder="Choose..."
						value={year}
						onChange={(e) => {
							setYear(e.target.value);
						}}
					>
						<option value="2020">2020</option>
						<option value="2021">2021</option>
						<option value="2022">2022</option>
						<option value="2023">2023</option>
						<option value="2024">2024</option>
						<option value="2025">2025</option>
						<option value="2026">2026</option>
						<option value="2027">2027</option>
						<option value="2028">2028</option>
						<option value="2029">2029</option>
						<option value="2030">2030</option>
					</select>
					<button onClick={generateReport}>Generate</button>
				</div>
			</div>
		</div>
	);
}

export default GenerateReports;
