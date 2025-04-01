import "bootstrap/dist/css/bootstrap.min.css";

function AccountDetails(props) {
	return (
		<div className="container mt-4">
			<div className="card shadow-sm">
				<div className="card-body">
					<h5 className="card-title text-center mb-3">
						Account Details
					</h5>
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<strong>Email:</strong> {props.email}
						</li>
						<li className="list-group-item">
							<strong>Phone:</strong> {props.phone}
						</li>
						<li className="list-group-item">
							<strong>Address:</strong> {props.address}
						</li>
						<li className="list-group-item">
							<strong>City:</strong> {props.city}
						</li>
						<li className="list-group-item">
							<strong>State:</strong> {props.state}
						</li>
						<li className="list-group-item">
							<strong>Zip:</strong> {props.zip}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default AccountDetails;
