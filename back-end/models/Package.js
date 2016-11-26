var mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
    id: String,
    title: String,
    questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Package', PackageSchema);