import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HomepageComponent } from './homepage/homepage.component';
import { CountrypageComponent } from './countrypage/countrypage.component';
import { SigninComponent } from './signin/signin.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CountrypageComponent,
    SigninComponent,
    AddNewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ChartsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
