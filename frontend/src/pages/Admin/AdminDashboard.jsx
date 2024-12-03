import React, { useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        if(!sessionStorage.getItem('isLoggedIn')){
            navigate("/admin-login");
        }
        if(sessionStorage.getItem('userType') != 'admin'){
            navigate('/admin-login')
        }
    })
    return (
        <>
            {sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('userType') == "admin" ? (
                <h1>Admin dashboard</h1>
            ) : (
                <></>
            )}
        </>
        
    )
}

export default AdminDashboard