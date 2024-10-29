import { HomeownerRequest } from "./homeownerRequest.model";

export class Job extends HomeownerRequest {
	assignedTeam: string;
	constructor(
		id: number,
		firstName: string,
		lastName: string,
		email: string,
		address: string,
		city: string,
		state: string,
		zip: number,
		helpType: string[],
		assignedTeam: string
	) {
		super(
			id,
			firstName,
			lastName,
			email,
			address,
			city,
			state,
			zip,
			helpType
		);
		this.assignedTeam = assignedTeam;
	}
}
