import { Reference } from "@angular/compiler/src/render3/r3_ast";
import { DocumentReference } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Covid19Service } from './covid19.service';

export class New{
    date!: any;
    description!: String | undefined;
    country!: String | undefined;
    author_uid!: String | undefined;
    author_email!: String | undefined;
    author_displayName!: String | undefined;

    constructor(
        date: Date,
        description: String,
        country: String,
        author_uid:String,
        author_email: String,
        author_displayName: String){
            this.date = date;
            this.description = description;
            this.country = country;
            this.author_uid=author_uid;
            this.author_email = author_email;
            this.author_displayName = author_displayName;
        }
}
