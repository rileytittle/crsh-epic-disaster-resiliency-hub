import { HomeownerApplication } from './homeownerApplication.model';

export class Job extends HomeownerApplication {
    assignedTeam: string;

    constructor(
        id: number, 
        firstName: string,
        lastName: string,
        email: string,
        phone: number, 
        address_1: string,
        address_2: string,
        city: string,
        state: string,
        zipCode: number, 
        helpTypes: string[],
        other: string,
        assignedTeam: string
    ) {
        
        super(id, firstName, lastName, email, phone, address_1, address_2, city, state, zipCode, helpTypes, other);
        this.assignedTeam = assignedTeam;
    }
}
