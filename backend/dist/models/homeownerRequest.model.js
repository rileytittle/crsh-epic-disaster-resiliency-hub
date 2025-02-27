"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeownerRequest = void 0;
class HomeownerRequest {
    id;
    firstName;
    lastName;
    email;
    address;
    city;
    state;
    zip;
    helpType;
    evaluation = undefined;
    constructor(id, firstName, lastName, email, address, city, state, zip, helpType) {
        this.id = id;
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
exports.HomeownerRequest = HomeownerRequest;
