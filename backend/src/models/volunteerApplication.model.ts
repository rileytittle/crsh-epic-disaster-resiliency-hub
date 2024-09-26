export class VolunteerApplication {
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email: string;
	streetAddress: string;
	city: string;
	state: string;
	zipCode: number;
	areasOfHelp: string[];
	approved: boolean | undefined = undefined; //set this to true when admin creates volunteer; false if rejects
	reasonRejected: string | undefined = undefined;
	constructor(
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
