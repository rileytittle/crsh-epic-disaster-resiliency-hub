import AccountDetails from "../../components/AccountDetails";
import ChangeAccountDetails from "../../components/ChangeAccountDetails";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useState, useEffect } from "react";

//page where volunteer users can update information about their account
function VolunteerAccountSettings() {
    const userToken = sessionStorage.getItem("userToken");
    const email = jwtDecode(userToken).email;
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    
    useEffect(() => {
        function fetchUserData() {
            const apiUrl = 'http://localhost:3000/volunteer/user-details';

            axios.get(apiUrl, {
                params: {
                    email: email 
                }
            })
            .then(response => {
                //console.log('User data:', response.data);

                // Set the phone and address values in state
                setPhone(response.data[0].phone_number);
                setAddress(response.data[0].street_address);
                setCity(response.data[0].city);
                setState(response.data[0].state);
                setZip(response.data[0].zip_code);
            })
            .catch(error => {
                // Handle error
                console.error('There was an error fetching the user data:', error);
            });
        }

        fetchUserData();
    }, [email]);

    return (
        <>
            <h1>Account Details</h1>
            <AccountDetails email={email} phone={phone} address={address} city={city} state={state} zip={zip} />
            <ChangeAccountDetails email={email} phone={phone} address={address} city={city} state={state} zip={zip} />

        </>
    );
}

export default VolunteerAccountSettings;