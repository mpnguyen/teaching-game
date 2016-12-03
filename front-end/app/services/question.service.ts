/**
 * Created by mp_ng on 11/30/2016.
 */
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Question} from "../models/question.model";
import {Constants} from "../others/Config";

@Injectable()
export class QuestionService {
    private baseUrl = Constants.BASE_URL;

    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'application/json'});

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.messageUsername || error);
    }

    getPackage(access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages';
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token });
        return this.http.get(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getQuestion(id: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/' + id + "/questions/" ;
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token });
        return this.http.get(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    editQuestion(question: Question, idPackage: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/' + idPackage + '/questions/' + question._id;
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token});
        let body = {
            'question': question.question,
            'answers': question.answers,
            'image': question.image,
            'correct': question.correct
        };
        return this.http.put(url, body, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    newQuestion(question: Question, idPackage: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/' + idPackage + '/questions/';
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token});
        let body = {
            'question': question.question,
            'answers': question.answers,
            'image': question.image,
            'correct': question.correct
        };
        return this.http.post(url, body, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deleteQuestion(idQuestion: string, idPackage: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/' + idPackage + '/questions/' + idQuestion;
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token});
        return this.http.delete(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deletePackage(idPackage: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/' + idPackage;
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token});
        return this.http.delete(url, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    addNewPackage(titlePackage: string, access_token: string): Promise<any> {
        let url = this.baseUrl + 'users/profile/packages/';
        let headers = new Headers({'Content-Type': 'application/json', 'x-access-token': access_token});
        let body = {
            title: titlePackage
        };
        return this.http.post(url, body, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    uploadQuestionImage(file: File|any, access_token: string): Promise<any> {
        console.log(file);
        let url = this.baseUrl + 'files';
        let headers = new Headers({'x-access-token': access_token});

        let formData:FormData = new FormData();
        formData.append('image', file);

        return this.http.post(url, formData, headers)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}