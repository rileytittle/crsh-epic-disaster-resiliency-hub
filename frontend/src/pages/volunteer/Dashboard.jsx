import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [schedule, setSchedule] = useState([]);

  
  useEffect(() => {

    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/volunteer/job/offered");
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error("Jobs data is not an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };

    
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("http://localhost:3000/volunteer/job/schedule");
        setSchedule(response.data); 

        console.log(schedule.length);
      } catch (error) {
        console.error("Error fetching schedule", error);
      }
    };

    fetchJobs();    
    fetchSchedule(); 
  }, []);  

  const acceptJob = async () => {
    try {
      const response = await axios.post("http://localhost:3000/volunteer/job/accept");
      if (response.status === 200) {
        
        console.log("Job accepted!");

        //window.location.reload();

      }
    } catch (error) {
      console.error("Error accepting job", error);
    }
  };

  return (
    <div>
      <h1>Volunteer Dashboard</h1>
      
      {/* Render the jobs */}
      <div>
        <h2>Available Jobs</h2>
        {jobs.length === 0 ? (
          <p>No jobs available</p>
        ) : (
          <ul>
            {jobs.map((job, index) => (
              <li key={index}>{job.helpType} {job.address} {job.city} {job.state}</li>  
            ))}
          </ul>
        )}
      </div>

      <div>
        <button onClick={acceptJob}>Accept a Job</button>
      </div>
      
      {/* Render the schedule */}
      <div>
        <h2>Scheduled Jobs</h2>
        {schedule.length === 0 ? (
          <p>No jobs scheduled</p>
        ) : (
          <ul>
            {schedule.map((job, index) => (
              <li key={index}>{job.helpType} {job.address} {job.city} {job.state}</li>  
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;