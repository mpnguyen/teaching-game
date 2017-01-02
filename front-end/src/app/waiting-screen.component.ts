import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {SocketClient} from "./services/socket.service";
@Component({
    selector: 'forget-pass',
    styleUrls: ['./waiting-screen.component.css'],
    templateUrl: './waiting-screen.component.html'
})
export class WaitingScreenComponent implements OnInit{


    listUser: string[] = [];

    constructor(private router: Router, private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit(): void {
        SocketClient.getInstance().on('hostLeaveRoom', data => {
            this.showError(data.message);
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 2000);
        });

        SocketClient.getInstance().on('newPlayerJoined', data => {
            this.listUser = data;
            console.log('test');
            console.log(data);
        });

        SocketClient.getInstance().emit('playerJoinedRoom', {});
    }


    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }
}
