import { Component, OnInit } from '@angular/core';
import { Covid19Service } from '../covid19.service';
import { User } from '../user.model';
import { New } from '../new.model';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  user!: User;

  date: any;
  country!: String;
  description!: String;

  constructor(public covid19Service: Covid19Service) { }

  ngOnInit(): void {
    this.user = this.covid19Service.getCurrentUser();
  }

  addNew(){
    const currentNew: New = {
      date: new Date(this.date),
      country: this.country,
      description: this.description,
      author_uid: this.user.uid,
      author_displayName: this.user.displayName,
      author_email: this.user.email
    };
    this.covid19Service.addNew(currentNew);
    this.date = undefined;
    this.description = undefined!;
    this.country = undefined!;
  }

}
