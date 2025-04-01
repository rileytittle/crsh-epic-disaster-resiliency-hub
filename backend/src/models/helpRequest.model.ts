import e from "express";

export class helpRequest {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
	streetAddress1: string;
	streetAddress2: string | undefined = undefined;
	city: string;
	state: string;
	zipCode: number;
	county: string;
	status: string;
	reasonRejected: string;
	helpType: string[];
	other: string | undefined = undefined;
	description: string;
	dateCreated: Date;
	timeCreated: string;
	constructor(
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: number,
		streetAddress1: string,
		streetAddress2: string | undefined,
		city: string,
		state: string,
		zipCode: number,
		county: string,
		status: string,
		reasonRejected: string,
		helpType: string[],
		other: string | undefined,
		description: string,
		dateCreated: Date,
		timeCreated: string
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.streetAddress1 = streetAddress1;
		if (streetAddress2) {
			this.streetAddress2 = streetAddress2;
		}
		this.city = city;
		this.state = state;
		this.zipCode = zipCode;
		this.county = county;
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
