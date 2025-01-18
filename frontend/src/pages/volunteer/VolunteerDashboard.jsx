import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

function VolunteerDashboard() {
    const navigate = useNavigate();

    const [jobData, setJobData] = useState(null);  // State to store job data
    const [loading, setLoading] = useState(true);  // State for loading indicator
    const [error, setError] = useState(null);      // State to handle any errors

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

      const userEmail = sessionStorage.getItem('userToken') ? sessionStorage.getItem('userToken') : '';
      
  // Retrieve the user's name and assignment from sessionStorage
  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  const assignment = sessionStorage.getItem('assignment') || 'No Assigned Jobs';
  const userId = sessionStorage.getItem('id'); 

  const userToken = sessionStorage.getItem('userToken'); // Assuming this token is used for authentication

  useEffect(() => {
    // API call to fetch volunteer job data
    const fetchJobData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/volunteer/job', {
          headers: {
            Authorization: `Bearer ${userToken}`, // Pass token for authorization
          }, 
          params: {
            assignment: assignment,  
          },
        });
        setJobData(response.data);  // Store the job data in state
        setLoading(false);           // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to load job data.'); 
        setLoading(false);
      }
    };

    if (assignment != 'No Assigned Jobs') {
      fetchJobData();  
      console.log(jobData);
    }
  }, [userToken]);

  /*Accepts or rejects a job
  * @param action -- a string that should be either 'reject' or 'accept', this later determines the function of the API 
  */
  const acceptJob = async (action) => {
    try {

      console.log(assignment,action,userId);
      const response = await axios.post('http://localhost:3000/volunteer/job-accept', {
        assignment: assignment,  // Send assignment in the body
        action: action,          // Send action in the body
        id: userId,              // Send user ID in the body
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // Authorization header
        },
      });
      console.log('Job accepted successfully:', response.data);
      // Optionally, update state or notify the user
    } catch (err) {
      console.error(err);
      setError('Failed to accept job.');
    }
  };
  

  // Display loading state or error message if needed
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {sessionStorage.getItem('isLoggedIn') && sessionStorage.getItem('userType') === "volunteer" ? (
        <>
          <h1>Volunteer Dashboard</h1>
          <p>Welcome, {firstName} {lastName}!</p>
          {/* Display job data from API response */}
          {jobData ? (
          <div>
            <p>Your current assignment:</p>
            <ul>
              {jobData.map((job, index) => {
                return (
                  <>
                  <li key={index}>
                    | {job.id} | {job.street_address} |
                    {job.tarping === true && " Tarping |"} 
                    {job.yard_cleanup === true && " Yard Cleanup |"} 
                    {job.interior_cleanup === true && " Interior Cleanup |"} 
                    {job.emotional_support === true && " Emotional Support |"} 
                    {job.cleaning_supplies === true && " Cleaning Supplies |"} 
                    {job.clean_water === true && " Clean Water |"}  
                    {job.emergency_food === true && " Emergency Food |"}
                  </li>

                  <button onClick={() => acceptJob('accept')} style={{ margin: '10px' }}>Accept</button>
                  <button onClick={() => acceptJob('reject')} style={{ margin: '10px' }}>Reject</button>
                  </>
                  
                );
              })}
            </ul>
          </div>
        ) : (
          <p>No job offers available.</p>
        )}

          
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default VolunteerDashboard;