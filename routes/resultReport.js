var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:district', function(req, res, next) {
    let district = req.params.district;
    res.render("resultReport",{
        district:district
    });
});



router.get('/*', function(req, res, next) {
    res.render('error');
});



module.exports = router;
