import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { User } from './user.model';
import { Router } from '@angular/router';
import { isDefined } from '@angular/compiler/src/util';
import { New } from './new.model';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { HttpClient } from '@angular/common/http'
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class Covid19Service {

  private user!: User;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private firestore : AngularFirestore,
    private http: HttpClient) { }
  
  public getSummary() {
    return this.http.get<any>("https://api.covid19api.com/summary");
  }

  public getCountryData(jsonObject : any, name : string){
    return jsonObject.find((element: { Country: string; }) => element.Country === name);
  }

  public dayoneCountry(country: string){
    return this.http.get<any>("https://api.covid19api.com/total/dayone/country/"+country);
  }

  public getPieChartData(){
    return this.http.get<any>("https://corona.lmao.ninja/v2/historical/all?lastdays=1");
  }

  public getBarChartData(){
    return this.http.get<any>("https://corona.lmao.ninja/v2/historical/all?lastdays=8");
  }

  public getLineChartData(){
    var initial = new Date('04/13/2020');
    var current = new Date();
    var difference = current.getTime() - initial.getTime();
    var days = Math.round(difference / (1000 * 3600 * 24));

    return this.http.get<any>("https://corona.lmao.ninja/v2/historical/all?lastdays="+days.toString());
  }

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credentials.user?.uid!,
      displayName: credentials.user?.displayName!,
      email: credentials.user?.email!
    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate(["add-news"]);
  }

  private updateUserData(){
    this.firestore.collection("users").doc(this.user?.uid).set({
      uid: this.user?.uid,
      displayName: this.user?.displayName,
      email: this.user?.email
    }, { merge: true});
  }

  getCurrentUser(){
    if(this.user==null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user")!);
    }
    return this.user;
  }

  userSignedIn(): boolean{
    const user = localStorage.getItem("user");
    if (user == null){
      return false;
    }
    else{
      return JSON.parse(user) != null;
    }
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user!=null;
    this.router.navigate(["homepage"]);
  }

  getNews(){
    return this.firestore
    .collection("news", ref => ref.orderBy('date', 'desc'))
    .valueChanges();
  }

  getUser(uid:string){
    return this.firestore.collection("users").doc(uid).valueChanges();
  }

  addNew(currentNew: New){
    this.firestore.collection("news").add(currentNew);
  }
}
