import { VolunteerApplication } from "./volunteerApplication.model";
export class Volunteer extends VolunteerApplication {
	teamLeader: boolean;
	password: string;
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
		areasOfHelp: string[],
		teamLeader: boolean,
		password: string
	) {
		super(
			id,
			firstName,
			lastName,
			phoneNumber,
			email,
			streetAddress,
			state,
			city,
			zipCode,
			areasOfHelp
		);
		this.teamLeader = teamLeader;
		this.password = password;
	}
}
