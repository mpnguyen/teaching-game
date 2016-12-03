/**
 * Created by mp_ng on 11/25/2016.
 */
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "ng2-webstorage";
import {Package} from "./models/package.model";
import {Question} from "./models/question.model";
import {QuestionService} from "./services/question.service";

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    access_token: string;
    packages: Package[] = new Array();
    questions: Question[];
    newQuestion: Question = new Question();
    idPackage: string;
    newPackage: string = '';

    ngOnInit(): void {
        this.access_token = this.storage.retrieve("access_token");
        if (this.access_token == null || this.access_token == "")
            this.router.navigate(['login']);

        this.questionService.getPackage(this.access_token)
            .then(res => {
                if (res.success) {
                    this.packages = res.packages;
                } else {
                    alert(res.message);
                }
            }).catch(err => console.log(err));

    }

    ngAfterViewInit():void {

    }

    loadQuestion(id: string) {
        this.questionService.getQuestion(id, this.access_token)
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

        if (question.question == ''){
            alert('Question can not empty!!');
            return;
        }

        for (let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                alert('The answer of each question can not empty!!!');
                return;
            }
        }

        this.questionService.editQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if (res.success) {

                } else {
                    alert('Fail!');
                }
            }).catch(err => console.log(err));

        this.openEditForm(question._id);
    }

    addNewQuestion(question: Question){

        if (question.question == ''){
            alert('Question can not empty!!');
            return;
        }

        for (let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                alert('The answer of each question can not empty!!!');
                return;
            }
        }

        this.questionService.newQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if(res.success) {
                    let question: Question = res.question;
                    console.log(question);
                    this.questions.push(question);
                } else {
                    alert(res.message);
                }
            }).catch(err => console.log(err));

        this.newQuestion = new Question();
        this.openAddForm();
    }

    addNewPackage() {
        if (this.newPackage == '') {
            alert('Package name can not empty');
            return;
        }

        this.questionService.addNewPackage(this.newPackage, this.access_token)
            .then(res => {
                debugger;
                if (res.success) {
                    this.packages.push(res.package);
                    this.newPackage = '';
                } else {
                    alert(res.message);
                }
            })
            .catch(err => console.log(err));
    }

    deletePackage(idPackage: string) {
        this.questionService.deletePackage(idPackage, this.access_token)
            .then(res => {
                debugger;
                if (res.success) {
                    let item = this.packages.find(item => item.id == idPackage);
                    this.packages.splice(this.packages.indexOf(item), 1);
                }
            }).catch(err => console.log(err));
    }

    deleteQuestion(idQuestion: string) {
        this.questionService.deleteQuestion(idQuestion, this.idPackage, this.access_token)
            .then(res => {
                if (res.success) {
                    let item = this.questions.find(item => item._id == idQuestion);
                    this.questions.splice(this.questions.indexOf(item), 1);
                }
            }).catch(err => console.log(err))
    }

    uploadImage(event: any) {
        let files = event.srcElement.files;
        console.log(files);
    }

    openAddForm() {
        $('#btn_add').click();
    }

    openEditForm(id: string) {
        $('#btn' + id).click();
    }

    constructor(private router: Router, private questionService: QuestionService, private storage:LocalStorageService) {}
}