import e from "express";

export class helpRequest {
    firstName:string;
    lastName:string;
    email:string;
    address:string;
    city:string;
    state:string;
    zip:number;
    helpType:string;
    assignedVolunteers:string[]=[];
    constructor( 
        firstName:string,
        lastName:string,
        email:string,
        address:string,
        city:string,
        state:string,
        zip:number,
        helpType:string){
            this.firstName=firstName;
            this.lastName=lastName;
            this.email=email;
            this.address=address;
            this.city=city;
            this.state=state;
            this.zip=zip;
            this.helpType=helpType;

    }
}