import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
function ConfirmRejection() {
	const location = useLocation();
	const { firstName, lastName, id, email } = location.state;
	const navigate = useNavigate();
	function rejectVolunteer() {
		console.log(id);
		let token = sessionStorage.getItem("userToken");
		let headers = {
			Authorization: `Bearer ${token}`,
		};
		axios
			.post(
				`${import.meta.env.VITE_API_URL}/admin/create-volunteer/reject`,
				{
					id: id,
					email: email,
				},
				{
					headers,
				}
			)
			.then((res) => {
				navigate("/create-volunteer");
			})
			.catch((error) => {
				console.error("Error rejecting applicant:", error);
			});
	}
	function cancelRejection() {
		navigate("/create-volunteer");
	}
	return (
		<div className="d-flex justify-content-center align-items-center position-fixed top-0 left-0 w-100 h-100 bg-dark bg-opacity-50">
			<div className="bg-white p-4 rounded">
				<h3 className="text-center">
					Are you sure you want to reject the volunteer application
					for {firstName + " " + lastName}?
				</h3>
				<div className="d-flex justify-content-center mt-4">
					<button
						className="btn btn-danger mx-2"
						onClick={rejectVolunteer}
					>
						Yes
					</button>
					<button
						className="btn btn-secondary mx-2"
						onClick={cancelRejection}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmRejection;
