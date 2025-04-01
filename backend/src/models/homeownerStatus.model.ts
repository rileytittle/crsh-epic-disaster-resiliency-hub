import e from "express";

export class HomeownerStatus {
	status: string;
	reasonRejected: string;
	helpType: string[];
	other: string | undefined = undefined;
	description: string;
	dateCreated: Date;
	timeCreated: string;
	constructor(
		status: string,
		reasonRejected: string,
		helpType: string[],
		other: string | undefined,
		description: string,
		dateCreated: Date,
		timeCreated: string
	) {
		this.status = status;
		this.reasonRejected = reasonRejected;
		this.helpType = helpType;
		if (other) {
			this.other = other;
		}
		this.description = description;
		this.dateCreated = dateCreated;
		this.timeCreated = timeCreated;
	}
}
