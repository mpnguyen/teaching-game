import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule }     from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { Ng2Webstorage} from 'ng2-webstorage';

import { UserService } from "./services/user.service"
import { QuestionService } from "./services/question.service";

import { AppComponent }  from './app.component';
import { HomeComponent }  from './home.component';
import { LoginComponent }  from './login.component';
import { RegisterComponent }  from './register.component';
import { ForgetComponent }  from './forget.component';
import { ResetComponent }  from './reset.component';
import { DashboardComponent } from "./dashboard.component";
import { ErrorComponent } from "./error.component";
import { PlayComponent } from "./play.component";
import { WaitingScreenComponent } from "./waiting-screen.component";
import {CommonModule} from "@angular/common";
import {CreateGameComponent} from "./create-game.component";

@NgModule({
  imports:      [ BrowserModule, CommonModule, AppRoutingModule, FormsModule, HttpModule, Ng2Webstorage ],
  providers: [ UserService, QuestionService ],
  declarations: [ AppComponent, HomeComponent, LoginComponent, RegisterComponent, CreateGameComponent,
    ForgetComponent, ResetComponent, DashboardComponent, ErrorComponent, PlayComponent, WaitingScreenComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
