import AccountDetails from "../../components/AccountDetails";
import ChangeAccountDetails from "../../components/ChangeAccountDetails";
import axios from 'axios';
import { useState, useEffect } from "react";

// Page where volunteer users can update information about their account
function VolunteerAccountSettings() {
    const userToken = sessionStorage.getItem("userToken");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    useEffect(() => {
        function fetchUserData() {
            const apiUrl = 'https://crsh-epic-disaster-resiliency-hub-server.vercel.app/volunteer/user-details';

            axios.get(apiUrl, {
                params: { userToken: userToken }
            })
            .then(response => {
                console.log('User data:', response.data);

                // Assuming response.data is an array and the first element contains the user details
                const user = response.data;

                setEmail(user.email);
                setPhone(user.phoneNumber);
                setAddress(user.streetAddress);
                setCity(user.city);
                setState(user.state);
                setZip(user.zipCode);
            })
            .catch(error => {
                // Handle error
                console.error('There was an error fetching the user data:', error);
            });
        }

        if (userToken) {
            fetchUserData();
        }

    }, [userToken]);  // Fetch data only when userToken changes

    return (
        <>
            <h1>Account Details</h1>
            <AccountDetails email={email} phone={phone} address={address} city={city} state={state} zip={zip} />
            <ChangeAccountDetails email={email} phone={phone} address={address} city={city} state={state} zip={zip} />
        </>
    );
}

export default VolunteerAccountSettings;
