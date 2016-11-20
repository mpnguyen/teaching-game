var mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
    id: String,
    package: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

mongoose.model('Package', PackageSchema);