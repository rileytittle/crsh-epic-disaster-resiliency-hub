export class VolunteerApplication {
	id: number;
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email: string;
	streetAddress1: string;
	streetAddress2: string;
	city: string;
	state: string;
	zipCode: number;
	areasOfHelp: string[];
	evaluated: boolean = false;
	rejected: boolean = false;
	reasonRejected: string = "";
	constructor(
		id: number,
		firstName: string,
		lastName: string,
		phoneNumber: number,
		email: string,
		streetAddress1: string,
		streetAddress2: string,
		city: string,
		state: string,
		zipCode: number,
		areasOfHelp: string[]
	) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.streetAddress1 = streetAddress1;
		this.streetAddress2 = streetAddress2;
		this.city = city;
		this.state = state;
		this.zipCode = zipCode;
		this.areasOfHelp = areasOfHelp;
	}
}
