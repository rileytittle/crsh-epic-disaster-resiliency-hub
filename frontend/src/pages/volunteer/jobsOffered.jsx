import React, { useEffect, useState } from "react";
import axios from "axios";

const JobsOffered = () => {
  const [jobs, setJobs] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get("http://localhost:3000/volunteer/job/offered");
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error("Jobs data is not an array:", response.data);
        }
      } catch (error) {
        setError("Error fetching jobs");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get("http://localhost:3000/volunteer/job/schedule");
        setSchedule(response.data);
      } catch (error) {
        setError("Error fetching schedule");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    fetchSchedule();
  }, []);

  const acceptJob = async (jobId) => {
    try {
      const response = await axios.post("http://localhost:3000/volunteer/job/accept", { jobId });
      if (response.status === 200) {
        //Remove the accepted job from jobs and add to schedule
        const acceptedJob = jobs.find(job => job.id === jobId);
        setJobs(jobs.filter(job => job.id !== jobId)); // Remove the accepted job from available jobs
        setSchedule([...schedule, acceptedJob]); // Add the accepted job to the schedule
        console.log("Job accepted!");
      }
    } catch (error) {
      console.error("Error accepting job", error);
      setError("Error accepting job");
    }
  };

  const rejectJob = async (jobId) => {
    try {
      const response = await axios.post("http://localhost:3000/volunteer/job/reject", { jobId });
      if (response.status === 200) {
        setJobs(jobs.filter(job => job.id !== jobId));
        console.log("Job rejected!");
      }
    } catch (error) {
      console.error("Error rejecting job", error);
      setError("Error rejecting job");
    }
  };

  const completeJob = async (jobId) => {
    try {
      const response = await axios.post("http://localhost:3000/volunteer/job/job-completed", {
        jobId,
        details,
      });
      if (response.status === 200) {
        setSchedule(schedule.filter(job => job.id !== jobId)); 
        console.log("Job completed!");
      }
    } catch (error) {
      console.error("Error completing job", error);
      setError("Error completing job");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Volunteer Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Render Available Jobs */}
      <div>
        <h2>Available Jobs</h2>
        {loading ? <p>Loading...</p> : (
          jobs.length === 0 ? <p>No jobs available</p> : (
            <ul>
              {jobs.map((job, index) => (
                <li key={index}>
                  {job.helpTypes} {job.address_1} {job.city} {job.state}
                  <button onClick={() => acceptJob(job.id)} style={{ margin: '10px' }}>Accept</button>
                  <button onClick={() => rejectJob(job.id)} style={{ margin: '10px' }}>Reject</button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>

      {/* Render Scheduled Jobs */}
      <div>
        <h2>Scheduled Jobs</h2>
        {loading ? <p>Loading...</p> : (
          schedule.length === 0 ? <p>No jobs scheduled</p> : (
            <ul>
              {schedule.map((job, index) => (
                <li key={index}>
                  {job.helpTypes} {job.address_1} {job.city} {job.state}
                  {schedule.length > 0 && (
                    <div>
                      <label htmlFor="details">Details: </label>
                      <input
                        type="text"
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Enter job completion details"
                        style={{ marginRight: '10px' }}
                      />
                      <button onClick={() => completeJob(job.id)} style={{ margin: '10px' }}>
                        Job Completed
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default JobsOffered;
