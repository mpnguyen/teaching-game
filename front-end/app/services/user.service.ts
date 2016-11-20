/**
 * Created by mp_ng on 11/20/2016.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {User} from "../models/user.model";

@Injectable()
export class UserService {
    private baseUrl = 'http://192.168.2.5:3000/';

    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'application/json'});

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    login(user: User): Promise<any> {
        let url = this.baseUrl + "users/authenticate";
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    register(user: User): Promise<any> {
        let url = this.baseUrl + "users";
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    forgetPass(user: User): Promise<any> {
        let url = this.baseUrl + "users/forget";
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    checkToken(token: string): Promise<any> {
        let url = this.baseUrl + "users/reset?token=" + token;
        return this.http.get(url)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    resetPass(password: string, token: string): Promise<any>{
        let url = this.baseUrl + "users/reset";
        let body = {
            password: password,
            token: token
        }
        return this.http.post(url, body, { headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}