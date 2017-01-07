/**
 * Created by mp_ng on 11/25/2016.
 */
import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "ng2-webstorage";
import {Package} from "./models/package.model";
import {Question} from "./models/question.model";
import {QuestionService} from "./services/question.service";
import {Constants} from "./others/Config";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {SocketClient} from "./services/socket.service";
import {Utils} from "./others/Utils";

declare let $: any;

@Component({
    selector: 'dashboard',
    styleUrls: ['./dashboard.component.css'],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

    access_token: string;
    packages: Package[] = new Array();
    questions: Question[];
    newQuestion: Question = new Question();
    idPackage: string;
    newPackage: string = '';
    baseUrl: string = Constants.BASE_URL;

    ngOnInit(): void {
        if (SocketClient.getData().isFBLogin) {
            window.location.reload(true);
        }
        this.access_token = this.storage.retrieve("access_token");
        if (this.access_token == null || this.access_token == "" || !this.storage.retrieve("is_login")) {
            this.storage.store("is_login", false);
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
                    setTimeout(() => {
                        this.storage.store("is_login", false);
                        this.router.navigate(['login']);
                    }, 1500);
                    return;
                }
            }).catch(err => console.log(err));
        SocketClient.getInstance().on("newGameCreated", data => {
            SocketClient.getData().gamePIN = data.gamePIN;
            SocketClient.getData().isHost = true;
            this.router.navigate(['waiting']);
        });
    }

    ngOnDestroy(): void {
        SocketClient.getInstance().removeAllListeners();
    }

    ngAfterViewInit():void {

    }

    loadQuestion(id: string) {
        this.questionService.getQuestion(id, this.access_token)
            .then(res => {
                if (res.success) {
                    if (this.idPackage !== id) {
                        this.showSuccessQuestionServiceLoading();
                    }

                    this.idPackage = id;
                    this.questions = res.questions;
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
        if (idPackage === this.idPackage) {
            this.idPackage = "";
        }

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

    playGame() {
        if (!this.idPackage) {
            this.showError("Please choose package!");
            return;
        }

        SocketClient.getInstance().emit("createNewGame", this.idPackage);
    }

    openAddForm() {
        $('#btn_add').click();
    }

    openEditForm(id: string) {
        $('#btn' + id).click();
    }

    showSuccess() {
        Utils.ShowSuccess('You are awesome! You have got all the questions!');
    }

    showSuccessAddingPackages() {
        Utils.ShowSuccess('Ding dong! Your package has been updated right below!');
    }

    showSuccessAddingQuestion() {
        Utils.ShowSuccess('Your questions have been added perfectly!');
    }
    showSuccessEditingQuestion() {
        Utils.ShowSuccess('Your questions have been edited successfully!');
    }

    showSuccessQuestionService() {
        Utils.ShowSuccess('Question services are excellent!');
    }

    showSuccessQuestionServiceLoading() {
        Utils.ShowSuccess('Loading question is perfect!');
    }

    showSuccessDeletingPackages() {
        Utils.ShowSuccess('Packages have been deleted successfully ');
    }

    showSuccessUploadingImage() {
        Utils.ShowSuccess('Your images are wonderful!');
    }

    showErrorQuestionEmpty() {
        Utils.ShowError('Questions could not be empty!');
    }

    showErrorQuestionAnswerEmpty() {
        Utils.ShowError('The answers of each question can not be empty!');
    }

    showErrorPackageName() {
        Utils.ShowError('The package name could not be empty!');
    }

    showError(error: string) {
        Utils.ShowError(error);
    }

    constructor(private router: Router, private questionService: QuestionService, private storage:LocalStorageService) {}
}
