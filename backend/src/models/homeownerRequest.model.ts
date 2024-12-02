export class HomeownerRequest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    helpType: string;
    evaluation?: string;

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        address: string,
        city: string,
        state: string,
        zip: string,
        helpType: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.helpType = helpType;
        this.evaluation = undefined;
    }
}