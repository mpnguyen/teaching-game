/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, ViewContainerRef} from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import { UserService } from "./services/user.service"
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'forget-pass',
    styleUrls: ['./forget.component.css'],
    templateUrl: './forget.component.html'
})
export class ForgetComponent {

    user:User = new User();

    message: string = null;

    constructor(private router: Router, private location: Location, private userService: UserService,public toastr: ToastsManager, vRef: ViewContainerRef) {
      this.toastr.setRootViewContainerRef(vRef);
    }

    showSuccess(success: string){
        this.toastr.success(success,'Success!');
    }
    showError(error: string){
      this.toastr.success(error,'Error!');
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

}
