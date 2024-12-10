import React, { useState } from "react";

const HomeownerStatus = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        //console.log({ name, value, checked });
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const formSubmitted = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                //"https://crsh-epic-disaster-resiliency-hub-server.vercel.app/homeowner/requestHelp/status",
                "http://localhost:3000/homeowner/requestHelp/status",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        // action="https://crsh-epic-disaster-resiliency-hub-server.vercel.app/homeowner/requestHelp" method="POST"
        <div style={{ margin: "5px" }}>
            <form onSubmit={formSubmitted} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    ); //
};
export default HomeownerStatus;
