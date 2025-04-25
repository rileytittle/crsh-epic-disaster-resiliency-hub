import "./Homepage.css";
export default function Homepage() {
	return (
		<>
			<div className="text-center mt-4">
				<h1 className="display-4 text-primary">
					EPIC Disaster Resiliency Hub
				</h1>
			</div>
			<div className="text-center mt-4">
				<a href="https://epiccommunitycenter.org/" className="display-7 btn btn-primary">
					<h4 className="display-7">
						EPIC Community Resource Center
					</h4>
				</a>
			</div>
			<div className="d-flex flex-column align-items-center">
				<div className="image-container">
					<img
						src="/EPIC-logo.png"
						alt="Displayed"
						className="img-fluid rounded scaled-image"
					/>
				</div>
				<div className="card-container">
					<div className="card rounded-3 shadow-lg">
						<div className="card-body">
							<div className="text-center">
								<h2 className="mb-3 text-primary">
									Our Mission
								</h2>
								<p className="fs-5 text-muted">
									During day-to-day operations, known as{" "}
									<strong>Blue Skies</strong>, EPIC is a center
									providing partner resources with programs
									and services that educate, support, and
									promote mental well-being for individuals
									struggling physically, emotionally, and
									spiritually.
								</p>
								<p className="fs-5 text-muted">
									After a disaster, known as{" "}
									<strong>Gray Skys</strong>, EPIC, in
									partnership with the American Red Cross,
									transitions to a Disaster Resilience Hub
									serving the Southern Sarasota and Western
									Charlotte Counties in Florida. EPIC will be
									prepared to take action to inform the
									community about the current weather advisory
									or act in response to a major disaster
									impact by beginning recovery efforts.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
