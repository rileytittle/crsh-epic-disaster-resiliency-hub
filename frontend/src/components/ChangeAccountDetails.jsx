import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useState, useEffect } from "react";

function ChangeAccountDetails(props) {
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
    });

    // Sync props with state when props change
    useEffect(() => {
        setFormData({
            phone: props.phone || "",
            address: props.address || "",
            city: props.city || "",
            state: props.state || "",
            zip: props.zip || "",
        });
    }, [props.phone, props.address, props.city, props.state, props.zip]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleClick = () => {
        const updatedDetails = { email: props.email, ...formData };

        axios.post("http://localhost:3000/volunteer/update-user-details", updatedDetails)
            .then(response => {
                console.log("Update Successful:", response.data);
                alert("User details updated successfully!");
            })
            .catch(error => {
                console.error("Error updating user details:", error);
                alert("Failed to update user details.");
            });
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title text-center mb-3">Update Account Details</h5>
                    <p className="text-muted text-center">Would you like to change your account details?</p>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input type="text" className="form-control" value={props.email} readOnly />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone:</label>
                            <input type="text" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Address:</label>
                            <input type="text" className="form-control" id="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">City:</label>
                                <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">State:</label>
                                <input type="text" className="form-control" id="state" value={formData.state} onChange={handleChange} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Zip:</label>
                                <input type="text" className="form-control" id="zip" value={formData.zip} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="button" className="btn btn-primary" onClick={handleClick}>
                                Update Details
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangeAccountDetails;
