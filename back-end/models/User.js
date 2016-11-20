var mongoose = require('mongoose');
var passwordHash = require('password-hash');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    packages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Package'}]
});

UserSchema.pre('save', function (next) {
    var user = this;
    if(!user.isModified('password')) return next();

    var hashedPass = passwordHash.generate(user.password);
    user.password = hashedPass;
    next();
});

UserSchema.methods.comparePassword = function (cadidatePassword, cb) {
    console.log(this._id);
    var k = passwordHash.verify(cadidatePassword, this.password);
    cb(null, k);
};

mongoose.model('User', UserSchema);