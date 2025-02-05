"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerApplication = void 0;
class volunteerApplication {
    constructor(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp) {
        this.evaluated = false;
        this.rejected = false;
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
exports.volunteerApplication = volunteerApplication;
