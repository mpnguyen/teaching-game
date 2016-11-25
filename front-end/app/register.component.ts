/**
 * Created by mp_ng on 11/20/2016.
 */
import { Component } from '@angular/core';
import { User } from "./models/user.model";
import { Router} from "@angular/router";
import {UserService} from "./services/user.service";

@Component({
    moduleId: module.id,
    selector: 'user-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {

    user:User = new User();

    confirmPass: string = "";

    messageUsername: string;
    messageEmail: string;

    constructor(private router: Router, private userService: UserService) {}

    login(): void {
        this.router.navigate(['/login']);
    }

    register(): void {
        this.userService.register(this.user)
            .then(res => {
                if (res.success) {
                    alert(res.message);
                    this.router.navigate(['home']);
                } else {
                    this.messageUsername = res.message;
                }
            })
            .catch(err => console.log(err));
    }

    checkValidUsername() {
        this.userService.checkValidUsername(this.user)
            .then(res => {
                if (res.success) {
                    this.messageUsername = null;
                } else {
                    this.messageUsername = res.message;
                }
            })
            .catch(err => console.log(err));
    }

    checkValidEmail() {
        this.userService.checkValidEmail(this.user)
            .then(res => {
                if (res.success) {
                    this.messageEmail = null;
                } else {
                    this.messageEmail = res.message;
                }
            })
            .catch(err => console.log(err));
    }

}