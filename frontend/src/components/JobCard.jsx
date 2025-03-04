import "../App.css";

function JobCard({ job }) {
    if (!job) return null; // Prevents rendering errors if job is null

    return (
        <div className="div-account-details-grid">
            <p>Street: {job.address}</p>
            <p>City: {job.city}</p>
            <p>State: {job.state}</p>
            <p>Zip: {job.zip}</p>
            <p>Help Type: {job.helpType.join(", ")}</p> {/* Ensure it's displayed correctly */}
            <p>Team: {job.assignedTeam}</p>
        </div>
    );
}

export default JobCard;
