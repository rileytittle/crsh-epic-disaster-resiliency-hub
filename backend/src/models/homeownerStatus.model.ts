export class HomeownerStatus {
	status: string;
	reasonRejected: string;
	helpType: string[];
	description: string;
	dateCreated: Date;
	timeCreated: string;
	constructor(
		status: string,
		reasonRejected: string,
		helpType: string[],
		description: string,
		dateCreated: Date,
		timeCreated: string
	) {
		this.status = status;
		this.reasonRejected = reasonRejected;
		this.helpType = helpType;
		this.description = description;
		this.dateCreated = dateCreated;
		this.timeCreated = timeCreated;
	}
}
