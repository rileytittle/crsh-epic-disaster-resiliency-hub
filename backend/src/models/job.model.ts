import { HomeownerRequest } from "./homeownerRequest.model";

export class Job extends HomeownerRequest {
	assignedTeam: number[] = [];
	other:string;
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
		other:string
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
		this.other=other
		
	}
}
