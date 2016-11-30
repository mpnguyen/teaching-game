var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/:image', function (req, res, next) {
    res.sendfile('./uploads/' + req.params.image.trim());
});

module.exports = router;
