export class volunteerApplication {
	id: number;
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email: string;
	streetAddress: string;
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
		streetAddress: string,
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
		this.streetAddress = streetAddress;
		this.city = city;
		this.state = state;
		this.zipCode = zipCode;
		this.areasOfHelp = areasOfHelp;
	}
}