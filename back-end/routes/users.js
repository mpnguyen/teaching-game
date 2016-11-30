var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mailer = require('nodemailer');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var User = mongoose.model('User');
var Package = mongoose.model('Package');
var Question = mongoose.model('Question');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
    var temp = new User(req.body);

    temp.save(function (err, temp) {
        if (err) {
            return res.json({
                success: false,
                message: "Register fail"
            })
        }
        res.json({
            success: true,
            message: "Register successful"
        });
    });
});

router.get('/isusernamevalid', function (req, res, next) {
    console.log(req.query.username);
    User.findOne({ username: req.query.username },
        function (err, user) {
            if (user) {
                return res.json({
                    success: false,
                    message: 'Invalid username'
                });
            }
            return res.json({
                success: true,
                message: 'Valid username'
            });
        });
});

router.get('/isemailvalid', function (req, res, next) {
    console.log(req.query.email);
    User.findOne({ email: req.query.email }, function (err, user) {
        if (user) {
            return res.json({
                success: false,
                message: 'Invalid email'
            })
        }
        res.json({
            success: true,
            message: 'Valid email'
        })
    })
});

router.post('/authenticate', function (req, res, next) {
    console.log(req.body);
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) { return next(err); }
        if (!user) {
            return res.json({
                success: false,
                message: 'Cant find user'
            });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (err) { return next(err); }
            if (!isMatch) {
                return res.json({
                    success: false,
                    message: 'Wrong password'
                });
            }
            var token = jwt.sign(user, "user", {
                expiresIn: 60 * 60 * 24
            });
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        });
    })
});

router.post('/forget', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { return next(err); }
        if (!user) {
            return res.json({
                success: false,
                message: 'Email not found'
            })
        }

        var token;

        crypto.randomBytes(16, function (err, buffer) {
            token = buffer.toString('hex');

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;

            user.save(function (err) {
                if (err) { return next(err); }

                var smtpTransport = mailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: 'spqcorp',
                        pass: 'spq123456'
                    }
                });

                var mailOptions = {
                    to: user.email,
                    from: 'noreply@spqcorp.com',
                    subject: 'Teaching-game Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + user.resetPasswordToken + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                smtpTransport.sendMail(mailOptions, function (err) {
                    console.log(err);
                    if (err) {
                        return res.json({
                            success: false,
                            message: 'Internal server error, try again later',
                            token: user.resetPasswordToken
                        });
                    }
                    res.json({ success: true });
                });
            });
        });
    });

});

router.get('/reset', function (req, res, next) {
    console.log(req.query.token);
    User.findOne({ resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (err) { return next(err) };
        if (!user) {
            return res.json({
                success: false,
                message: 'Link invaid'
            })
        }
        res.json({
            token: user.resetPasswordToken,
            success: true
        });
    })
});

router.post('/reset', function (req, res, next) {
    User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            return res.json({
                success: false
            })
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err) {
            if (err) { return next(err); }
            res.json({ success: true })
        })
    });
});

router.use('/profile', function (req, res, next) {
    var token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'user', function (err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                var query = User.findById(decoded._doc._id, '-resetPasswordToken -resetPasswordExpires -password');
                query.exec(function (err, user) {
                    if (err) { return res.json({
                        success: false,
                        message: "Error occurred"
                    }); }
                    if (!user) { return res.json({ success: false, message: 'Cannot find user.' }); }
                    req.profile = user;
                    next();
                });
            }
        })
    }
    else{
        res.json({
            success: false,
            message: 'Cannot find token'
        })
    }
});

router.get('/profile', function (req, res, next) {
   res.json({
       success: true,
       profile: req.profile
   });
});


// ========================== packages & questions manager ===============================================================

/* package route; CRUD package */
router.get('/profile/packages', function (req, res, next) {
    req.profile.populate('packages', '-questions -user', function (err, user) {
        if(err){return res.json({
            success: false,
            message: 'Cannot get packages'
        })}
        res.json({
            success: true,
            packages: user.packages
        });
    })
});

router.post('/profile/packages', function (req, res, next) {
    var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();
    if (Package.findOne({ id: id }) != null) {
        id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 6).toUpperCase();
    }
    var package = new Package(req.body);
    package.id = id;
    package.user = req.profile;
    package.save(function (err, package) {
        if (err) { return next(err); }
        req.profile.packages.push(package);
        req.profile.save(function (err, user) {
            if (err) { return res.json({
                success: false,
                message: "Error occurred"
            }) }
            res.json({
                success: true,
                packages: user.packages
            });
        })
    });
});

router.param('package', function (req, res, next, id) {
    Package.findOne({id: id}, '-user', function (err, package) {
        if(err) {return res.json({
            success: false,
            message: 'Cannot find package'
        })}
        req.package = package;
        next();
    })
});

router.get('/profile/packages/:package', function (req, res, next) {
    res.json({
        success: true,
        package:req.package
    });
});

router.delete('/profile/packages/:package', function (req, res, next) {
   req.package.remove(function (err, result) {
       if(err){return next(err)}
       res.json(result);
   })
});

router.get('/profile/packages/:package/questions', function (req, res, next) {
   req.package.populate('questions', function (err, package) {
       if(err) {return res.json({
           success: false,
           message: "Cannot find questions"
       })}
       res.json({
           success: true,
           questions: package.questions
       })
   })
});

router.post('/profile/packages/:package/questions', function (req, res, next) {
    var question = new Question(req.body);
    console.log(req.body);
    question.package = req.package;
    question.save(function (err, question) {
        if(err) {return next(err)}
        req.package.questions.push(question);
        req.package.save(function (err, package) {
            if(err){return next(err)}
            res.json({
                success: true,
                question: question
            })
        })
    })
});

router.param('question', function (req, res, next, id) {
    var query = Question.findById(id);
    query.exec(function (err, question) {
        if(err) {return new Error({
            success: false,
            message: "Error occurred"
        })}
        console.log(question);
        req.question = question;
        next();
    })
});

router.get('/profile/packages/:package/questions/:question', function (req, res, next) {
    res.json({
        success: true,
        question: req.question
    })
});

router.put('/profile/packages/:package/questions/:question', function (req, res, next) {
   req.question.update(req.body, function (err, question) {
       if(err){return res.json({
           success: false,
           message: "Error occurred"
       })}
       res.json({
           success: true,
           message: "Update successful"
       })
   })
});

router.delete('/profile/packages/:package/questions/:question', function (req, res, next) {
   req.question.remove(function (err, result) {
       if(err){return res.json({
           success: false,
           message: err
       })}
       res.json({
           success: true,
           message: result
       })
   })
});

router.post('/file', upload.single('image'), function (req, res, next) {
    console.log(req.file);
    if(req.file === undefined || req.file === null){
        return res.json({
            success: false,
            message: "Error occurred"
        })
    }
    var image = req.file.filename;
    res.json({
        success: true,
        image: image
    });
});

module.exports = router;
