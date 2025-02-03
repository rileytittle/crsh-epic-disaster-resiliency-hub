export class HomeownerApplication {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    street_address_1: string;
    street_address_2: string;
    city: string;
    state: string;
    zip_code: number;
    status: string= "pending";
    reason_rejected: string = "";
    helpTypes: string[];
    other: string;
    constructor(
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        phone_number: number,
        street_address_1: string,
        street_address_2: string,
        city: string,
        state: string,
        zip_code: number,
        helpTypes: string[],
        other: string
    ) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.street_address_1 = street_address_1;
        this.street_address_2 = street_address_2;
        this.city = city;
        this.state = state;
        this.zip_code = zip_code;
        this.helpTypes = helpTypes;
        this.other = other;
    }
}