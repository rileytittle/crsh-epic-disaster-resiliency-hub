import "bootstrap/dist/css/bootstrap.min.css";

function JobCard({ job }) {
	if (!job) return null; // Prevents rendering errors if job is null

	return (
		<div className="card shadow-sm mb-3">
			<div className="card-body">
				<h5 className="card-title text-primary fw-bold">Job Details</h5>
				<div className="row">
					<div className="col-md-6">
						<p className="mb-1">
							<strong>Street:</strong> {job.address}
						</p>
						<p className="mb-1">
							<strong>City:</strong> {job.city}
						</p>
					</div>
					<div className="col-md-6">
						<p className="mb-1">
							<strong>State:</strong> {job.state}
						</p>
						<p className="mb-1">
							<strong>Zip:</strong> {job.zip}
						</p>
					</div>
				</div>

				<p className="mt-2">
					<strong>Help Type:</strong>{" "}
					<span className="badge bg-success">
						{job.helpType.join(", ")}
					</span>
				</p>

			</div>
		</div>
	);
}

export default JobCard;
