import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountrypageComponent } from './countrypage/countrypage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SigninComponent } from './signin/signin.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { AuthGuard } from './auth.guard';
import { SecurePagesGuard } from './secure-pages.guard';


const routes: Routes = [
  { path: "homepage", component: HomepageComponent},
  { path: "countrypage/:name", component: CountrypageComponent},
  { path: "signin", component: SigninComponent, 
  canActivate: [SecurePagesGuard]},
  { path: "add-news", component: AddNewsComponent,
  canActivate: [AuthGuard]},
  { path: "", pathMatch:"full", component: HomepageComponent},
  { path: "**", redirectTo: "homepage", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
