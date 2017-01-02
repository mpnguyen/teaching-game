/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {SocketClient} from "./services/socket.service";
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'my-home',
    styles: [''],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{

    gamePIN: string;
    username: string;

    constructor(private router: Router, private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit(): void {
        SocketClient.getInstance().on('joinRoomSuccess', data => {
            this.showSuccess(data.message);
            setTimeout(() => this.router.navigate(['waiting']), 2000);
        });

        SocketClient.getInstance().on('joinRoomFail', data => {
            this.showError(data.message);
        });
    }

    joinGame() {
        let data = {
            username: this.username,
            gamePIN: this.gamePIN
        };

        SocketClient.getInstance().emit('joinGame', data);
    }

    showSuccess(msg: string) {
        this.toastr.success(msg, 'Success!');
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }
}
