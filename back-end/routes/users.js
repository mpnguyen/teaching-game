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
  })
});

router.post('/authenticate', function (req, res, next) {
  console.log(req.body.username);
  User.findOne({username: req.body.username}, function (err, user) {
    if(err) {return next(err);}
    if(user!=null) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if(err){return next(err);}
        if(!isMatch){return next(new Error('Wrong password'))}
        var token = jwt.sign(user, "user", {
          expiresIn: 60*60*24
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      });
    }
    else
    {
      res.json(null);
    }
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
    if(!user) {return next(new Error("Email not found"));}

    var token;

    crypto.randomBytes(16, function (err, buffer) {
      token = buffer.toString('hex');

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      user.save(function (err) {
        if(err) {return next(err);}

        var smtpTransport = mailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // use SSL
          auth: {
            user: 'reset.spqcorp@gmail.com',
            pass: 'spq123456'
          }
        });

        var mailOptions = {
          to: user.email,
          from: 'reset.spqcorp@gmail.com',
          subject: 'Teaching-game Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + user.resetPasswordToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
          if(err){return next(err);}
          res.json({success: true});
        });
      });
    });
  });

});

router.get('/reset/:token', function (req, res, next) {
  console.log(req.params.token);
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
    if(err) {return next(err)};
    console.log(user);
    if(!user){return next(new Error('Cant find user'))}
    res.json({success: true});
  })
});

router.post('/reset/:token', function (req, res, next) {
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}, function (err, user) {
    user.password = req.body.password;
    user.save(function (err) {
      if(err) {return next(err);}
      res.json({success: true})
    })
  });
});

module.exports = router;
