export class HomeownerRequest { //probably delete this and get anything its referencing to the other one
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	address: string;
	city: string;
	state: string;
	zip: number;
	helpType: string[];
	evaluation: string | undefined = undefined;
	constructor( // probably delete this
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		address: string,
		city: string,
		state: string,
		zip: number,
		helpType: string[]
	) { // probably delete this
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.address = address;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.helpType = helpType;
	}
}
