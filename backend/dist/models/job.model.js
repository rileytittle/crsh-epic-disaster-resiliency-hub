"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const homeownerRequest_model_1 = require("./homeownerRequest.model");
class Job extends homeownerRequest_model_1.HomeownerRequest {
    assignedTeam;
    constructor(id, firstName, lastName, email, address, city, state, zip, helpType, assignedTeam) {
        super(id, firstName, lastName, email, address, city, state, zip, helpType);
        this.assignedTeam = assignedTeam;
    }
}
exports.Job = Job;
