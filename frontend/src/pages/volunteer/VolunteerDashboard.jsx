import React, { useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function VolunteerDashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if(!sessionStorage.getItem('isLoggedIn')){
            navigate("/vol-login");
        }
        if(sessionStorage.getItem('userType') != 'volunteer'){
            navigate('/vol-login')
        }
    })
    return (
        <>
            {sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('userType') == "volunteer" ? (
                <h1>Volunteer dashboard</h1>
            ) : (
                <></>
            )}
        </>
        
    )
}

export default VolunteerDashboard