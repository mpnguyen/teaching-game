/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, ViewContainerRef} from '@angular/core';
import { User } from "./models/user.model";
import { Router} from "@angular/router";
import {UserService} from "./services/user.service";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


@Component({
    selector: 'user-register',
    styleUrls: ['./register.component.css'],
    templateUrl: './register.component.html'
})
export class RegisterComponent {

    user:User = new User();

    confirmPass: string = "";

    messageUsername: string;
    messageEmail: string;
    messageConfirmPass: string;

    constructor(private router: Router, private userService: UserService,public toastr: ToastsManager, vRef: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vRef);
    }
    showSuccess(success: string){
      this.toastr.success(success,'Success!');
    }
    showError(error: string){
      this.toastr.success(error,'Error!');
    }
    login(): void {
        this.router.navigate(['/login']);
    }

    register(): void {
        this.userService.register(this.user)
            .then(res => {
                if (res.success) {
                  this.showSuccess(res.message);
                  setTimeout(() => {
                    this.router.navigate(['/home']);
                  }, 2000);

                } else {
                  this.showError(res.message);
                  setTimeout(() => {
                    this.router.navigate(['/home']);
                  }, 2000);
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

    checkValidPassword() {
        if (this.user.password === this.confirmPass) {
            this.messageConfirmPass = null;
        } else {
            this.messageConfirmPass = "Please check your confirm password"
        }
    }

}
