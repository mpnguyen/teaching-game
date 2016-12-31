/**
 * Created by mp_ng on 11/25/2016.
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "ng2-webstorage";
import {Package} from "./models/package.model";
import {Question} from "./models/question.model";
import {QuestionService} from "./services/question.service";
import {Constants} from "./others/Config";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

declare let $: any;

@Component({
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
    baseUrl: string = Constants.BASE_URL;

    ngOnInit(): void {
        this.access_token = this.storage.retrieve("access_token");
        if (this.access_token == null || this.access_token == "") {
            this.router.navigate(['login']);
            return;
        }

        this.questionService.getPackage(this.access_token)
            .then(res => {
                if (res.success) {
                    this.packages = res.packages;
                    this.showSuccessQuestionService();
                } else {
                    this.showError(res.message);
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
                    this.showSuccessQuestionServiceLoading();
                } else {
                    this.showError(res.message);
                }
            }).catch(err => console.log(err));
    }

    editQuestion(question: Question){

        if (question.question == ''){
            this.showErrorQuestionEmpty();
            return;
        }

        for (let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                this.showErrorQuestionAnswerEmpty();
                return;
            }
        }

        this.questionService.editQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if (res.success) {
                    this.showSuccessEditingQuestion();
                } else {
                    this.showError(res.message);
                }
            }).catch(err => console.log(err));

        this.openEditForm(question._id);
    }

    addNewQuestion(question: Question){

        if (question.question == ''){
            this.showErrorQuestionEmpty();
            return;
        }

        for (let i = 0;i<=3;i++){
            if(question.answers[i] == ''){
                this.showErrorQuestionAnswerEmpty();
                return;
            }
        }

        this.questionService.newQuestion(question, this.idPackage, this.access_token)
            .then(res => {
                if(res.success) {
                    let question: Question = res.question;
                    console.log(question);
                    this.questions.push(question);
                    this.showSuccessAddingQuestion();
                } else {
                    this.showError(res.message);
                }
            }).catch(err => console.log(err));

        this.newQuestion = new Question();
        this.openAddForm();
    }

    addNewPackage() {
        if (this.newPackage == '') {
            this.showErrorPackageName();
            return;
        }

        this.questionService.addNewPackage(this.newPackage, this.access_token)
            .then(res => {

                if (res.success) {
                    this.packages.push(res.package);
                    this.newPackage = '';
                    this.showSuccessAddingPackages();
                } else {
                    this.showError(res.message);
                }
            })
            .catch(err => console.log(err));
    }

    deletePackage(idPackage: string) {
        this.questionService.deletePackage(idPackage, this.access_token)
            .then(res => {

                if (res.success) {
                    let item = this.packages.find(item => item.id == idPackage);
                    this.packages.splice(this.packages.indexOf(item), 1);
                    this.showSuccessDeletingPackages();
                } else {
                    this.showError(res.message);
                }
            }).catch(err => console.log(err));
    }

    deleteQuestion(idQuestion: string) {
        this.questionService.deleteQuestion(idQuestion, this.idPackage, this.access_token)
            .then(res => {
                if (res.success) {
                    let item = this.questions.find(item => item._id == idQuestion);
                    this.questions.splice(this.questions.indexOf(item), 1);
                    this.showSuccessDeletingPackages();
                } else {
                    this.showError(res.message);
                }

            }).catch(err => console.log(err));
    }

    uploadImage(event: any, question: Question = null) {
        let files = event.srcElement.files;

        if (files.length > 0) {
            this.questionService.uploadQuestionImage(files[0], this.access_token)
                .then(res => {
                    if (res.success) {
                        this.showSuccessUploadingImage();
                        if (question) {
                            question.image = res.image;
                        } else {
                            this.newQuestion.image = res.image;
                        }
                    } else {
                        this.showError(res.message);
                    }
                }).catch(err => console.log(err));
        }
    }

    openAddForm() {
        $('#btn_add').click();
    }

    openEditForm(id: string) {
        $('#btn' + id).click();
    }

    showSuccess() {
        this.toastr.success('You are awesome! You have got all the questions!', 'Success!');
    }

    showSuccessAddingPackages() {
        this.toastr.success('Ding dong! Your package has been updated right below!', 'Success!');
    }

    showSuccessAddingQuestion() {
        this.toastr.success('Your questions have been added perfectly!', 'Success!');
    }
    showSuccessEditingQuestion() {
        this.toastr.success('Your questions have been edited successfully!', 'Success!');
    }

    showSuccessQuestionService() {
        this.toastr.success('Question services are excellent!', 'Success!');
    }

    showSuccessQuestionServiceLoading() {
        this.toastr.success('Loading question is perfect!', 'Success!');
    }

    showSuccessDeletingPackages() {
        this.toastr.success('Packages have been deleted successfully ', 'Success!');
    }

    showSuccessUploadingImage() {
        this.toastr.success('Your images are wonderful!', 'Success!');
    }

    showErrorQuestionEmpty() {
        this.toastr.error('Questions could not be empty!', 'Error!');
    }

    showErrorQuestionAnswerEmpty() {
        this.toastr.error('The answers of each question can not be empty!', 'Error!');
    }

    showErrorPackageName() {
        this.toastr.error('The package name could not be empty!', 'Error!');
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }

    constructor(private router: Router, private questionService: QuestionService, private storage:LocalStorageService,private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }
}
