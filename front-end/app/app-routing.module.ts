/**
 * Created by mp_ng on 11/20/2016.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }  from './home.component';
import { LoginComponent }  from './login.component';
import {RegisterComponent} from "./register.component";
import {ForgetComponent} from "./forget.component";
import {ResetComponent} from "./reset.component";
import {DashboardComponent} from "./dashboard.component";

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home',  component: HomeComponent },
    { path: 'login',     component: LoginComponent },
    { path: 'register',     component: RegisterComponent },
    { path: 'forget',     component: ForgetComponent },
    { path: 'dashboard',     component: DashboardComponent },
    { path: 'reset/:token',     component: ResetComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}
