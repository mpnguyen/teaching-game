/**
 * Created by mp_ng on 11/20/2016.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {User} from "../models/user.model";
import {Constants} from "../others/Config";

@Injectable()
export class UserService {
    private baseUrl = Constants.BASE_URL;

    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'application/json'});

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.messageUsername || error);
    }

    login(user: User): Promise<any> {
        let url = this.baseUrl + 'users/authenticate';
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    loginFB(): Promise<any> {
        let url = this.baseUrl + 'users/facebook';
        let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.get(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    register(user: User): Promise<any> {
        let url = this.baseUrl + 'users';
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    forgetPass(user: User): Promise<any> {
        let url = this.baseUrl + 'users/forget';
        return this.http.post(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    checkToken(token: string): Promise<any> {
        let url = this.baseUrl + 'users/reset?token=' + token;
        return this.http.get(url)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    resetPass(password: string, token: string): Promise<any>{
        let url = this.baseUrl + 'users/reset';
        let body = {
            password: password,
            token: token
        }
        return this.http.post(url, body, { headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    checkValidUsername(user: User): Promise<any>  {
        let url = this.baseUrl + 'users/isusernamevalid/?username=' + user.username;
        return this.http.get(url)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    checkValidEmail(user: User): Promise<any> {
        let url = this.baseUrl + 'users/isemailvalid/?email=' + user.email;
        return this.http.get(url)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getProfile(access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile';
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token });
        return this.http.get(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}
