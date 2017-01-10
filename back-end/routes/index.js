var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'duqvgbkhv',
    api_key: '746766614426462',
    api_secret: '64P-Mc9548hWYoMBH4TJ8pu07pA'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uploads/:image', function (req, res, next) {
  res.sendfile(__dirname + '/uploads/ ' +req.params.image);
});


router.post('/files', upload.single('image'), function (req, res, next) {
    if(req.file === undefined || req.file === null){
            return res.json({
                success: false,
                message: "Error occurred"
            })
        }
	
	cloudinary.uploader.upload(req.file.path, function(result) {
        console.log(result);
		if(result.error){
			return res.json({
                success: false,
                message: "Invalid image file"
            })
		}
        var image = result.url;
        res.json({
            success: true,
            image: image
        });
    });
});

module.exports = router;
