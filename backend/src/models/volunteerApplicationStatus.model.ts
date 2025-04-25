import e from "express";

export class VolunteerApplicationStatus {
	status: string;
	reasonRejected: string;
	helpAreas: string[];
	dateCreated: Date;
	timeCreated: string;
	constructor(
		status: string,
		reasonRejected: string,
		teams: string[],
		dateCreated: Date,
		timeCreated: string
	) {
		this.status = status;
		this.reasonRejected = reasonRejected;
		this.helpAreas = teams;
		this.dateCreated = dateCreated;
		this.timeCreated = timeCreated;
	}
}
