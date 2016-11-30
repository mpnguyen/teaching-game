import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule }     from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import {Ng2Webstorage} from 'ng2-webstorage';

import { UserService } from "./services/user.service"

import { AppComponent }  from './app.component';
import { HomeComponent }  from './home.component';
import { LoginComponent }  from './login.component';
import { RegisterComponent }  from './register.component';
import { ForgetComponent }  from './forget.component';
import { ResetComponent }  from './reset.component';
import {DashboardComponent} from "./dashboard.component";
import {QuestionService} from "./services/question.service";

@NgModule({
    imports:      [ BrowserModule, AppRoutingModule, FormsModule, HttpModule, Ng2Webstorage ],
    providers: [ UserService, QuestionService ],
    declarations: [ AppComponent, HomeComponent, LoginComponent, RegisterComponent,
        ForgetComponent, ResetComponent, DashboardComponent ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
