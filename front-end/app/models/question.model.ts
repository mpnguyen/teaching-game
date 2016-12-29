/**
 * Created by mp_ng on 11/26/2016.
 */
export class Question {
    _id: string;
    question: string;
    image: string;
    answers: string[];
    correct: number;

    constructor() {
        this._id = '';
        this.question = '';
        this.image = '';
        this.answers = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.answers[i] = '';
        }
        this.correct = 0;

    }
}