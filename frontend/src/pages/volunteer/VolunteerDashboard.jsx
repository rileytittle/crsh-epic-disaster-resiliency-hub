import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function VolunteerDashboard() {
  const navigate = useNavigate();

  const [assignedData, setAssignedData] = useState(null);  // State to store job data
  const [offeredData, setOfferedData] = useState(null);
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);      // State to handle any errors

  const firstName = sessionStorage.getItem('firstName');
  const lastName = sessionStorage.getItem('lastName');
  
  const userId = sessionStorage.getItem('id'); 
  const userToken = sessionStorage.getItem('userToken'); // Assuming this token is used for authentication

  // Use state for assignment and offered
  const [assignment, setAssignment] = useState(parseInt(sessionStorage.getItem('assignment')) || 'No Assigned Jobs');
  const [offered, setOffered] = useState(parseInt(sessionStorage.getItem('offered')) || 'No Offered Jobs');

  // Function to fetch assigned jobs
  const fetchAssigned = async () => {
    try {
      const response = await axios.get('http://localhost:3000/volunteer/assigned', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          assignment: assignment,
        },
      });
      setAssignedData(response.data);
    } catch (err) {
      setError('Failed to load assigned job data.');
    }
  };

  // Function to fetch offered jobs
  const fetchOffered = async () => {
    try {
      const response = await axios.get('http://localhost:3000/volunteer/offered', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          offered: offered,
        },
      });
      setOfferedData(response.data);
    } catch (err) {
      setError('Failed to load offered job data.');
    }
  };

  // Function to fetch both assigned and offered data
  const fetchData = async () => {
    setLoading(true); // Start loading

    if (assignment !== 'No Assigned Jobs') {
      await fetchAssigned();
    }

    if (offered !== 'No Offered Jobs') {
      await fetchOffered();
    }

    setLoading(false); // Set loading to false after both calls are made
  };

  // Fetch data on component mount or when relevant state changes
  useEffect(() => {
    fetchData();
  }, [userToken, assignment, offered]);

  // Function to accept a job
  const acceptJob = async (action) => {
    setLoading(true); // Set loading to true while the job is being accepted

    try {
      const response = await axios.post('http://localhost:3000/volunteer/job-accept', {
        offered: offered,  // Send assignment in the body
        action: action,    // Send action in the body
        id: userId,        // Send user ID in the body
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // Authorization header
        },
      });

      console.log('Job accepted:', response.data);
      
      // After accepting the job, update the state and sessionStorage accordingly
      if(action === "accept"){
        setAssignment(offered);   // Move the job to assigned
        setOffered(null);  // Clear the offered job by setting it to null
        sessionStorage.setItem('assignment', offered);
        sessionStorage.setItem('offered', 'No Offered Jobs');
      } else {
        setOffered(null);  // Clear the offered job if rejected
        sessionStorage.setItem('offered', 'No Offered Jobs');
      }

      fetchData();  // Re-fetch data to update the UI
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('Failed to accept job.');
    } finally {
      setLoading(false); // Set loading to false after the action is completed
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
          {assignedData ? (
          <div>
            <p>Current Assignment:</p>
            <ul>
              {assignedData.map((job, index) => {
                return (
                  <li key={index}>
                    | {job.request_id} | {job.street_address_1} |
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p>No job assignment available.</p>
        )}

        {offeredData && offeredData.length > 0 ? (
          <div>
            <p>Job Offers:</p>
            <ul>
              {offeredData.map((job, index) => {
                return (
                  <li key={index}>
                    | {job.request_id} | {job.street_address_1} |
                    <button onClick={() => acceptJob('accept')} style={{ margin: '10px' }}>Accept</button>
                    <button onClick={() => acceptJob('reject')} style={{ margin: '10px' }}>Reject</button>
                  </li>
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
