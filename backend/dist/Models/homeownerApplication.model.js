"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeownerApplication = void 0;
class HomeownerApplication {
    constructor(id, firstName, lastName, email, phone, address_1, address_2, city, state, zipCode, helpTypes, other) {
        this.evaluated = false;
        this.rejected = false;
        this.reasonRejected = "";
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.address_1 = address_1;
        this.address_2 = address_2;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.helpTypes = helpTypes;
        this.other = other;
    }
}
exports.HomeownerApplication = HomeownerApplication;
