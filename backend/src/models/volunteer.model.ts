import { VolunteerApplication } from "./volunteerApplication.model";

export class Volunteer extends VolunteerApplication {
	assignment: number | null;
	offered: number | null;
	constructor(
		id: number,
		email: string,
		firstName: string,
		lastName: string,
		phoneNumber: number,
		streetAddress1: string,
		streetAddress2: string,
		city: string,
		state: string,
		zipCode: number,
		areasOfHelp: string[],
		assignment: number | null,
		offered: number | null
	) {
		super(
			id,
			firstName,
			lastName,
			phoneNumber,
			email,
			streetAddress1,
			streetAddress2,
			state,
			city,
			zipCode,
			areasOfHelp
		);
		this.assignment = assignment;
		this.offered = offered;
	}
}
