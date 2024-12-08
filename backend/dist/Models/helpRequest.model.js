"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpRequest = void 0;
class helpRequest {
    constructor(firstName, lastName, email, address, city, state, zip, helpType) {
        this.assignedVolunteers = [];
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.helpType = helpType;
    }
}
exports.helpRequest = helpRequest;
