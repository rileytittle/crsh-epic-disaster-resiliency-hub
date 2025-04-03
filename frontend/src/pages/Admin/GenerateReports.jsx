import React, { useState } from "react";
import axios from "axios";
function GenerateReports() {
	const [year, setYear] = useState("0");
	const [month, setMonth] = useState("0");
	const [county, setCounty] = useState("empty");
	const [zipCode, setZipCode] = useState("0");
	const [status, setStatus] = useState("empty");
	const [uniqueHomes, setUniqueHomes] = useState(false);
	const [queryResponse, setQueryResponse] = useState(null);
	// async function testFunction() {
	// 	console.log("year: " + year);
	// 	console.log("Month: " + month);
	// 	console.log("County: " + county);
	// 	console.log("Zip: " + zipCode);
	// 	console.log("status: " + status);
	// }
	async function generateReport() {
		try {
			let headers = {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
			};
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/admin/reports`,
				{
					year: year,
					month: month,
					county: county,
					zipCode: zipCode,
					status: status,
					uniqueHomes: uniqueHomes,
				},
				{
					responseType: "blob", // Make sure you're getting a blob response
					headers: headers,
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
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card p-4">
						<div className="card-body">
							<h1 className="text-center mb-4">
								Generate Reports
							</h1>

							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									checked={uniqueHomes}
									onChange={(e) => {
										setUniqueHomes(e.target.checked);
									}}
									id="flexCheckDefault"
								/>
								<label
									className="form-check-label"
									htmlFor="flexCheckDefault"
								>
									Only include each address ONCE
								</label>
							</div>

							<div className="mb-3">
								<label htmlFor="year" className="form-label">
									Year
								</label>
								<select
									id="year"
									name="year"
									className="form-select"
									value={year}
									onChange={(e) => {
										setYear(e.target.value);
									}}
								>
									<option value="0">Any</option>
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
							</div>

							<div className="mb-3">
								<label htmlFor="month" className="form-label">
									Month
								</label>
								<select
									id="month"
									name="month"
									className="form-select"
									value={month}
									onChange={(e) => {
										setMonth(e.target.value);
									}}
								>
									<option value="0">Any</option>
									<option value="1">January</option>
									<option value="2">February</option>
									<option value="3">March</option>
									<option value="4">April</option>
									<option value="5">May</option>
									<option value="6">June</option>
									<option value="7">July</option>
									<option value="8">August</option>
									<option value="9">September</option>
									<option value="10">October</option>
									<option value="11">November</option>
									<option value="12">December</option>
								</select>
							</div>

							<div className="mb-3">
								<label htmlFor="county" className="form-label">
									County
								</label>
								<select
									id="county"
									name="county"
									className="form-select"
									value={county}
									onChange={(e) => {
										setCounty(e.target.value);
									}}
								>
									<option value="empty">Any</option>
									<option value="Charlotte">Charlotte</option>
									<option value="Sarasota">Sarasota</option>
								</select>
							</div>

							<div className="mb-3">
								<label
									htmlFor="zip-code"
									className="form-label"
								>
									Zip Code
								</label>
								<select
									id="zip-code"
									name="zip-code"
									className="form-select"
									value={zipCode}
									onChange={(e) => {
										setZipCode(e.target.value);
									}}
								>
									<option value="0">Any</option>
									<option value="34223">34223</option>
									<option value="34224">34224</option>
									<option value="33947">33947</option>
									<option value="33946">33946</option>
									<option value="33981">33981</option>
								</select>
							</div>

							<div className="mb-3">
								<label htmlFor="status" className="form-label">
									Request Status
								</label>
								<select
									id="status"
									name="status"
									className="form-select"
									value={status}
									onChange={(e) => {
										setStatus(e.target.value);
									}}
								>
									<option value="empty">Any</option>
									<option value="Unevaluated">
										Unevaluated
									</option>
									<option value="Accepted">Accepted</option>
									<option value="Active">Active</option>
									<option value="Rejected">Rejected</option>
									<option value="Resolved">Resolved</option>
								</select>
							</div>

							<div className="d-flex justify-content-center">
								<button
									onClick={generateReport}
									className="btn btn-primary"
								>
									Generate Report
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GenerateReports;
