import "../App.css";
import axios from "axios";


function ChangeAccountDetails(props) {
    return (
        <div className="div-account-details">
            <p>Would you like to change your account details?</p>
            <form>
                <label>Email:</label>
                <input type="text" defaultValue={props.email} readOnly />

                <label>Phone:</label>
                <input type="text" defaultValue={props.phone} id="phone" />

                <label>Address:</label>
                <input type="text" defaultValue={props.address} id="address" />

                <label>City:</label>
                <input type="text" defaultValue={props.city} id="city" />

                <label>State:</label>
                <input type="text" defaultValue={props.state} id="state" />

                <label>Zip:</label>
                <input type="text" defaultValue={props.zip} id="zip" />

                <button type="button" onClick={() => handleClick(props.email)}>Update Details</button>
            </form>
        </div>
    );
}

function handleClick(email) {
    const updatedDetails = {
        email: email,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
    };

    console.log("Updated Details:", updatedDetails);
    
    axios.post("http://localhost:3000/volunteer/update-user-details", updatedDetails)
        .then(response => {
            console.log("Update Successful:", response.data);
            alert("User details updated successfully!");
        })
        .catch(error => {
            console.error("Error updating user details:", error);
            alert("Failed to update user details.");
        });
}


export default ChangeAccountDetails;



