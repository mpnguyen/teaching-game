/**
 * Created by mp_ng on 11/20/2016.
 */
import { Component } from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import { UserService } from "./services/user.service"

@Component({
    moduleId: module.id,
    selector: 'forget-pass',
    styleUrls: ['./forget.component.css'],
    templateUrl: './forget.component.html'
})
export class ForgetComponent {

    user:User = new User();

    message: string = null;

    constructor(private router: Router, private location: Location, private userService: UserService) {}

    forgetPass(): void {
        this.userService.forgetPass(this.user)
            .then(res => {
                console.log(res);
                if (res.success) {
                    alert("Success! Please check your email!");
                    this.router.navigate(['/home']);
                } else {
                    this.message = res.messageUsername;
                }
            })
            .catch(err => console.log(err));
    }

}