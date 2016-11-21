var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var mailer = require('nodemailer');

var User = mongoose.model('User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function (req, res, next) {
  var temp = new User(req.body);

  temp.save(function (err, temp) {
    if(err) {return next(err);}
    res.json(temp);
  });
});

router.get('/isusernamevalid', function (req, res, next) {
  console.log(req.query.username);
  User.findOne({username: req.query.username}, function (err, user) {
    if(user){
      return res.json({
        success: false,
        message: 'Invalid username'
      })
    }
    res.json({
      success: true,
      message: 'Valid username'
    })
  })
});

router.get('/isemailvalid', function (req, res, next) {
  console.log(req.query.email);
  User.findOne({email: req.query.email}, function (err, user) {
    if(user){
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
  User.findOne({username: req.body.username}, function (err, user) {
    if(err) {return next(err);}
    if(!user){
      return res.json({
      success: false,
      message: 'Cant find user'
      });
    }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if(err){return next(err);}
        if(!isMatch){return res.json({
          success: false,
          message: 'Wrong password'
        });}
        var token = jwt.sign(user, "user", {
          expiresIn: 60*60*24
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      });
  })
});

router.param('user', function (req, res, next, id) {
  var token = req.headers['x-access-token'];

  if(token){
    jwt.verify(token, 'user', function (err, decoded) {
      if(err){
        res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        var query = User.findById(id);

        query.exec(function (err, user) {
          if(err){return next(err);}
          if(!user) { return next(new Error('Cant find user'));}

        });
        req.profile = decoded._doc;
        console.log(decoded);
        next();
      }
    })
  }
});

router.get('/profiles/:user', function (req, res, next) {
  res.json("return something");
});

router.post('/forget', function (req, res, next) {
  User.findOne({email: req.body.email}, function (err, user) {
    if(err){return next(err);}
    if(!user) {return res.json({
      success: false,
      message: 'Email not found'
    })}

    var token;

    crypto.randomBytes(16, function (err, buffer) {
      token = buffer.toString('hex');

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      user.save(function (err) {
        if(err) {return next(err);}

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

        smtpTransport.sendMail(mailOptions, function(err) {
          console.log(err);
          if(err){return res.json({
            success: false,
            message: 'Internal server error, try again later',
            token: user.resetPasswordToken
          });}
          res.json({success: true});
        });
      });
    });
  });

});

router.get('/reset', function (req, res, next) {
  console.log(req.query.token);
  User.findOne({resetPasswordToken: req.query.token, resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
    if(err) {return next(err)};
    if(!user){return res.json({
      success: false,
      message: 'Link invaid'
    })}
    res.json({
      token: user.resetPasswordToken,
      success: true
    });
  })
});

router.post('/reset', function (req, res, next) {
  console.log(req.body.token);

  User.findOne({resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
    console.log(user);
    if(!user){return  res.json({
      success:false
    })}
    user.password = req.body.password;
    user.save(function (err) {
      if(err) {return next(err);}
      res.json({success: true})
    })
  });
});

module.exports = router;
