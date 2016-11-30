var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploads/:image', function (req, res, next) {
  res.sendfile(__dirname + '/uploads/ ' +req.params.image);
});


router.post('/files', upload.single('image'), function (req, res, next) {
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
