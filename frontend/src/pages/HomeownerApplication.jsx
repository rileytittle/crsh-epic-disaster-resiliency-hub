import React from "react";
//import ApplicationCard from "../components/ApplicationCard";
import axios from "axios";
import { useState, useEffect } from "react";

function formSubmitted(formData) {
    alert("The form was submitted");
  }

function HomeownerApply() {
    return ( // action="http://localhost:3000/homeowner/requestHelp" method="POST" 
        <>
            <form onSubmit={formSubmitted} className="row g-3">
                <div className="col-md-6">
                    <label htmlFor="inputFirstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" name="inputFirstName" id="inputFirstName"></input>
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputLastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="inputLastName" id="inputLastName"></input>
                </div>
                <div className="col-12">
                    <label htmlFor="inputEmail" className="form-label">E-Mail</label>
                    <input type="email" className="form-control" name="inputEmail" id="inputEmail" placeholder=""></input>
                </div>
                <div className="col-12">
                    <label htmlFor="inputAddress" className="form-label">Address</label>
                    <input type="text" className="form-control" name="inputAddress" id="inputAddress" placeholder="1234 Main St"></input>
                </div>
                <div className="col-12">
                    <label htmlFor="inputAddress2" className="form-label">Address 2</label>
                    <input type="text" className="form-control" name="inputAddress2" id="inputAddress2" placeholder="Apartment, studio, or floor"></input>
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputCity" className="form-label">City</label>
                    <input type="text" className="form-control" name="inputCity" id="inputCity"></input>
                </div>
                <div className="col-md-4">
                    <label htmlFor="inputState" className="form-label">State</label>
                    <select id="inputState" name="inputState" className="form-select">
                        <option selected>Choose...</option>
                        <option>Florida</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label htmlFor="inputZip" className="form-label">Zip</label>
                    <input type="number" className="form-control" name="inputZip" id="inputZip"></input>
                </div>
                <div className="col-12">
                    I need help with...
                    <div className="form-check">
                        <input className="form-check-input" id="helpTarping" value="tarping" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpTarping">Tarping</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpYard" value="yardCleanup" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpYard">Yard Cleanup</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpInterior" value="interiorCleanup" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpInterior">Interior Cleanup</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpEmotional" value="emotionalSupport" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpEmotional">Emotional Support</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpSupplies" value="cleaningSupplies" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpSupplies">Cleaning Supplies</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpWater" value="cleanWater" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpWater">Clean Water</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpFood" value="emergencyFood" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpFood">Emergency Food</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" id="helpOther" value="other" type="checkbox" name="inputHelpType"></input>
                        <label className="form-check-label" htmlFor="helpOther">Other</label>
                    </div>
                </div>
                <div>
                    <label htmlFor="inputImages" className="form-label">Upload photos of the help area</label>
                    <input className="form-control" type="file" accept="image/*" id="inputImages" multiple />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form >
        </>
    ) // 
}
export default HomeownerApply
/*
Name
Phone number
email
physical address for service requested with state and County
“I need help with” 
    ☐ Tarping
    ☐ Yard cleanup
    ☐ Interior cleanup
    ☐ Emotional Support
    ☐ Cleaning Supplies
    ☐ Clean Water
    ☐ Emergency Food
    ☐ Other ____________
Ability to upload photos
SUBMIT button: “Submit” 
*/