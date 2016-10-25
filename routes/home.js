var express= require('express');
var router= express.Router();

//Get Homepage
router.get('/home', ensureAuthenticated,function(req,res) {
    res.render('home', {layout: false});
});

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg','You are not authorised to do that.');
        res.redirect('/login');
    }
}

router.get('/logout',ensureAuthenticated, function(req,res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/login');
})

module.exports= router;
