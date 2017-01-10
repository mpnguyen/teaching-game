/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, ViewContainerRef} from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import { UserService } from "./services/user.service"
import {Utils} from "./others/Utils";

@Component({
    selector: 'forget-pass',
    styleUrls: ['./forget.component.css'],
    templateUrl: './forget.component.html'
})
export class ForgetComponent {

    user:User = new User();

    message: string = null;

    constructor(private router: Router, private location: Location, private userService: UserService) {}

    showSuccess(success: string){
        Utils.ShowSuccess(success);
    }
    showError(error: string){
        Utils.ShowError(error);
    }
    forgetPass(): void {
        this.userService.forgetPass(this.user)
            .then(res => {
                if (res.success) {
                  this.showSuccess("Success! Please check your email!");
                  setTimeout(() => {
                    this.router.navigate(['/home']);
                  }, 2000);
                } else {
                  this.showError("Failed! Something is wrong. Sorry for that!");
                  setTimeout(() => {
                    this.router.navigate(['/home']);
                  }, 2000);
                }
            })
            .catch(err => console.log(err));
    }

    navigateToHome() {
        this.router.navigate(['home']);
    }
}
