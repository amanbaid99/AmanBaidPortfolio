import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { PlanguagesComponent } from './components/planguages/planguages.component';
import { InterestsComponent } from './components/interests/interests.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ExperienceComponent,
    EducationComponent,
    PlanguagesComponent,
    InterestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
