"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volunteer = void 0;
const volunteerApplication_model_1 = require("./volunteerApplication.model");
class Volunteer extends volunteerApplication_model_1.volunteerApplication {
    constructor(id, firstName, lastName, phoneNumber, email, streetAddress, city, state, zipCode, areasOfHelp, teamLeader, password) {
        super(id, firstName, lastName, phoneNumber, email, streetAddress, state, city, zipCode, areasOfHelp);
        this.teamLeader = teamLeader;
        this.password = password;
    }
}
exports.Volunteer = Volunteer;
