/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { User } from "./models/user.model";
import {Router} from "@angular/router";
import { UserService } from "./services/user.service"
import {LocalStorageService} from 'ng2-webstorage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'user-login',
    styleUrls: ['./login.component.css'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy{


    user:User = new User();

    message: string = null;

    constructor(private toastr: ToastsManager,private vRef: ViewContainerRef, private router: Router, private userService: UserService, private storage:LocalStorageService) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnDestroy(): void {
    }

    showSuccess() {
        this.toastr.success('Congratulation! Your login is successful!!!', 'Success!');
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }

    login(): void {

        this.userService.login(this.user)
            .then(res => {
                if (res.success) {
                    this.message = null;
                    this.storage.store('access_token', res.token);
                    this.storage.store('is_login', true);
                    this.router.navigate(['/dashboard']);
                } else {
                    this.message = res.message;
                    this.showError(res.message);
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
