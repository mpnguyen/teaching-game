/**
 * Created by mp_ng on 11/25/2016.
 */
import { Component, OnInit } from '@angular/core';
import {UserService} from "./services/user.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "ng2-webstorage";
import {User} from "./models/user.model";
import {Package} from "./models/package.model";
import {Question} from "./models/question.model";

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    access_token: string;
    user: User = new User();
    packages: Package[];
    questions: Question[];
    newQuestion: Question = new Question();
    idPackage: string;

    ngOnInit(): void {
        this.access_token = this.storage.retrieve("access_token");
        if (this.access_token == null || this.access_token == "")
            this.router.navigate(['login']);

        this.userService.getPackage(this.access_token)
            .then(res => {
                if (res.success) {
                    this.packages = res.packages;
                } else {
                    alert(res.message);
                }
            }).catch(err => console.log(err));

    }

    loadQuestion(id: string) {
        this.userService.getQuestion(id, this.access_token)
            .then(res => {
                if (res.success) {
                    this.idPackage = id;
                    this.questions = res.questions;
                } else {
                    alert(res.message);
                }
            }).catch(err => console.log(err));
    }

    editQuestion(question: Question){

        if(question.question == ''){
            alert("Question can not empty!!");
            return;
        }

        for(let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                alert("The answer of each question can not empty!!!");
                return;
            }
        }

        this.userService.editQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if (res.success) {

                } else {
                    alert("Fail!");
                }
            }).catch(err => console.log(err));

        this.openEditForm(question._id);
    }

    addNewQuestion(question: Question){

        if(question.question == ''){
            alert("Question can not empty!!");
            return;
        }

        for(let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                alert("The answer of each question can not empty!!!");
                return;
            }
        }

        this.userService.newQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if(res.success) {
                    let question: Question = res.question;
                    this.questions.push(question);
                } else {
                    alert(res.message);
                }
            }).catch(err => console.log(err));

        this.newQuestion = new Question();
        this.openAddForm();
    }

    openAddForm() {
        $('#btn_add').click();
    }

    openEditForm(id: string) {
        $('#btn' + id).click();
    }

    constructor(private router: Router, private userService: UserService, private storage:LocalStorageService) {}
}