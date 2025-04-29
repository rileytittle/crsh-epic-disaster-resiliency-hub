import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
function ConfirmDeleteVolunteer() {
	const location = useLocation();
	const { first_name, last_name, id } = location.state;
	const navigate = useNavigate();
	function deleteVolunteer() {
		if (id) {
			let headers = {
				Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
			};
			axios
				.delete(
					`${
						import.meta.env.VITE_API_URL
					}/admin/delete-volunteer/${id}`,
					{ headers }
				)
				.then((res) => {
					navigate("/volunteers");
				});
		} else {
			console.log("Error in deleting on frontend");
		}
	}
	function cancelDeletion() {
		navigate("/volunteers");
	}
	return (
		<div className="d-flex justify-content-center align-items-center position-fixed top-0 left-0 w-100 h-100 bg-dark bg-opacity-50">
			<div className="bg-white p-4 rounded">
				<h3 className="text-center">
					Are you sure you want to delete the account for{" "}
					{first_name + " " + last_name}?
				</h3>
				<div className="d-flex justify-content-center mt-4">
					<button
						className="btn btn-danger mx-2"
						onClick={deleteVolunteer}
					>
						Yes
					</button>
					<button
						className="btn btn-secondary mx-2"
						onClick={cancelDeletion}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmDeleteVolunteer;
