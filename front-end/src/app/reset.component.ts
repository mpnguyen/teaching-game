/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { User } from "./models/user.model";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {UserService} from "./services/user.service";
import 'rxjs/add/operator/switchMap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'reset-pass',
    styleUrls: ['./reset.component.css'],
    templateUrl: './reset.component.html'
})
export class ResetComponent implements OnInit{

    user:User = new User();

    confirmPass: string = "";

    token: string;

    messageConfirmPass: string;

    constructor(private toastr: ToastsManager, vRef: ViewContainerRef,private router: Router, private route: ActivatedRoute, private userService: UserService) {
      this.toastr.setRootViewContainerRef(vRef);
    }

  showSuccess(success: string){
    this.toastr.success(success,'Success!');
  }
  showError(error: string){
    this.toastr.success(error,'Error!');
  }

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.checkToken(params['token']))
            .subscribe(res => {
                let response: any = res;
                if (response.success) {
                    this.token = response.token;
                    this.showSuccess(response.token);
                    setTimeout(() => {
                      this.router.navigate(['/home']);
                    }, 2000);
                } else {
                  this.showError("Failed!");
                  setTimeout(() => {
                    this.router.navigate(['/home']);
                  }, 2000);
                }
            });
    }

    checkValidPassword() {
        if (this.user.password === this.confirmPass) {
            this.messageConfirmPass = null;
        } else {
            this.messageConfirmPass = "Please check your confirm password"
        }
    }

    resetPass(): void {
        if (this.user.password != this.confirmPass) {
            alert("Not correct!");
            return;
        }

        this.userService.resetPass(this.user.password, this.token)
            .then(res => {
                if (res.success) {
                    alert("Success!");
                    this.router.navigate(['/home']);
                } else {
                    alert("Error!");
                }
            });
    }

}
