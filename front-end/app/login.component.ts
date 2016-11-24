/**
 * Created by mp_ng on 11/20/2016.
 */
import { Component } from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import { UserService } from "./services/user.service"

@Component({
    moduleId: module.id,
    selector: 'user-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {

    user:User = new User();

    message: string = null;

    constructor(private router: Router, private userService: UserService) {}

    login(): void {
        this.userService.login(this.user)
            .then(res => {
                if (res.success) {
                    this.message = null;
                    alert("Success!");
                    this.router.navigate(['/home']);
                } else {
                    this.message = res.messageUsername;
                }
            })
            .catch(err => console.log(err));
    }

    register(): void {
        this.router.navigate(['/register']);
    }

    forgetPass(): void {
        this.router.navigate(['/forget']);
    }

}