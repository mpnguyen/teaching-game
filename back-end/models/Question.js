var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    image: String,
    answers: [String],
    correct: { type: Number, required: true },
    package: {type: mongoose.Schema.Types.ObjectId, ref: 'Package'}
});

mongoose.model('Question', QuestionSchema);