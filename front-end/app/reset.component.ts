/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnInit} from '@angular/core';
import { User } from "./models/user.model";
import {Router, Params, ActivatedRoute} from "@angular/router";
import {UserService} from "./services/user.service";
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    selector: 'reset-pass',
    styleUrls: ['./reset.component.css'],
    templateUrl: './reset.component.html'
})
export class ResetComponent implements OnInit{

    user:User = new User();

    confirmPass: string = "";

    token: string;

    messageConfirmPass: string;

    constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {}

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.userService.checkToken(params['token']))
            .subscribe(res => {
                let response: any = res;
                if (response.success) {
                    this.token = response.token;
                } else {
                    alert("False");
                    this.router.navigate(['/home']);
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