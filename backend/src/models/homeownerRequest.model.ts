export class homeownerRequest {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: number;
	streetAddress1: string;
	streetAddress2: string;
	city: string;
	state: string;
	zip: number;
	status: string;
	reasonRejected: string | undefined = undefined;
	helpType: string[];
	constructor(
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber: number,
		streetAddress1: string,
		streetAddress2: string,
		city: string,
		state: string,
		zip: number,
		helpType: string[],
		status: string
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.streetAddress1 = streetAddress1;
		this.streetAddress2 = streetAddress2;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.helpType = helpType;
		this.status = status;
	}
}
