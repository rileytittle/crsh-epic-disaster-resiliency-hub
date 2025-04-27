export class HomeownerApplication { // hopefully delete this as well
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    street_address_1: string;
    street_address_2: string;
    city: string;
    state: string;
    county: string;
    zip_code: number;
    status: string = "pending";
    reason_rejected: string = "";
    yard_cleanup: boolean;
    interior_cleanup: boolean;
    emotional_support: boolean;
    cleaning_supplies: boolean;
    clean_water: boolean;
    emergency_food: boolean;
    other: string = "";
    constructor( // hopefully delete this as well
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        phone_number: number,
        street_address_1: string,
        street_address_2: string,
        city: string,
        state: string,
        county: string,
        zip_code: number,
        yard_cleanup: boolean,
        interior_cleanup: boolean,
        emotional_support: boolean,
        cleaning_supplies: boolean,
        clean_water: boolean,
        emergency_food: boolean,
        other: string,
    ) { // hopefully delete this as well
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.street_address_1 = street_address_1;
        this.street_address_2 = street_address_2;
        this.city = city;
        this.state = state;
        this.county = county;
        this.zip_code = zip_code;
        this.yard_cleanup = yard_cleanup;
        this.interior_cleanup = interior_cleanup;
        this.emotional_support = emotional_support;
        this.cleaning_supplies = cleaning_supplies;
        this.clean_water = clean_water;
        this.emergency_food = emergency_food;
        this.other = other;
    }
}