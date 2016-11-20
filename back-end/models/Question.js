var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    id: String,
    question: String,
    answers: [String],
    package: {type: mongoose.Schema.Types.ObjectId, ref: 'Package'}
});

mongoose.model('Question', QuestionSchema);