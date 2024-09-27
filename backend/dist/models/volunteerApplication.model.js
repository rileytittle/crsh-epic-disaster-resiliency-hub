"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolunteerApplication = void 0;
class VolunteerApplication {
    constructor(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp) {
        this.rejected = false; //set this to true when admin creates volunteer; false if rejects
        this.reasonRejected = "";
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.areasOfHelp = areasOfHelp;
    }
}
exports.VolunteerApplication = VolunteerApplication;
