import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import JobCard from "../../components/JobCard";

function VolunteerDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const userToken = sessionStorage.getItem("userToken");

    const [user, setUser] = useState("");
    const [assigned, setAssigned] = useState("");
    const [offered, setOffered] = useState("");

    useEffect(() => {
        if (!userToken) return;

        async function fetchData() {
            try {
                const [userRes, jobsRes] = await Promise.all([
                    axios.get("http://localhost:3000/volunteer/user-details", {
                        params: { userToken },
                    }),
                    axios.get("http://localhost:3000/volunteer/jobs", {
                        params: { userToken },
                    }),
                ]);

                setUser(userRes.data);
                setAssigned(jobsRes.data[0]);
                setOffered(jobsRes.data[1]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false); // Stop loading once both requests are done
            }
        }

        fetchData();
    }, [userToken]);

    const answerOffer = (action) => {
        if (!offered || !user.id) {
            console.error("Invalid offer or user ID");
            return;
        }

        axios
            .post("http://localhost:3000/volunteer/job-accept", {
                offered: offered.id,
                action,
                id: user.id,
            })
            .then((response) => {
                console.log(response.data);
                if (action === "accept") {
                    setAssigned(offered);
                }
                setOffered(0); // Clear the offered job after action
            })
            .catch((error) => {
                console.error("Error processing job action:", error);
            });
    };

    if (!sessionStorage.getItem("isLoggedIn") || sessionStorage.getItem("userType") !== "volunteer") {
        return <h1>Please Login</h1>;
    }

    return (
        <>
            <h1>Volunteer Dashboard</h1>
            <h2>Welcome, {user.firstName} {user.lastName}!</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <p>
                        {assigned !== 0 ? (
                            <>
                                <strong>Current Job</strong>
                                <JobCard job={assigned} />
                            </>
                        ) : (
                            "Nothing assigned"
                        )}
                    </p>

                    <p>
                        {offered !== 0 ? (
                            <>
                                <strong>Current Offer</strong>
                                <JobCard job={offered} />
                                <button onClick={() => answerOffer("accept")}>Accept</button>
                                <button onClick={() => answerOffer("reject")}>Reject</button>
                            </>
                        ) : (
                            "Nothing offered"
                        )}
                    </p>
                </>
            )}
        </>
    );
}

export default VolunteerDashboard;
