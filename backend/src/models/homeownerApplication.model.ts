export class HomeownerApplication {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zipCode: number;
    helpTypes: string[];
    other: string;
    assignedVolunteers:string[]=[];
    evaluated: boolean = false;
    rejected: boolean = false;
    reasonRejected: string = "";
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
        other: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.address_1 = address_1;
        this.address_2 = address_2;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.helpTypes = helpTypes;
        this.other = other;
    }
}