import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function VolunteerDashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem('isLoggedIn') || sessionStorage.getItem('userType') !== 'volunteer') {
          navigate("/vol-login");
        } else if (sessionStorage.getItem('justLoggedIn') === 'true') {
          // Set justLoggedIn to false and reload the page only once
          sessionStorage.setItem('justLoggedIn', 'false');
          // Add a flag in sessionStorage to indicate the reload has been triggered
          sessionStorage.setItem('hasReloaded', 'true');
          navigate(0); // Navigate to the current page programmatically (no full page reload)
        }
      }, [navigate]);
    
      useEffect(() => {
        // Ensure reload happens only once and doesn't re-trigger on subsequent renders
        if (sessionStorage.getItem('hasReloaded') === 'true') {
          // Clear the flag after reload has been triggered
          sessionStorage.removeItem('hasReloaded');
        }
      }, []); // This only runs on component mount, so it's a one-time effect
    
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