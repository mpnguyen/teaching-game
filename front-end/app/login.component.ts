/**
 * Created by mp_ng on 11/20/2016.
 */
import { Component } from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import { UserService } from "./services/user.service"
import {LocalStorageService} from 'ng2-webstorage';

@Component({
    moduleId: module.id,
    selector: 'user-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent {

    user:User = new User();

    message: string = null;

    constructor(private router: Router, private userService: UserService, private storage:LocalStorageService) {}

    login(): void {
        this.userService.login(this.user)
            .then(res => {
                if (res.success) {
                    this.message = null;
                    this.storage.store('access_token', res.token);
                    this.storage.store('is_login', true);
                    alert('Success!');
                    this.router.navigate(['/home']);
                } else {
                    this.message = res.message;
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