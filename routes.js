var express= require('express');
var router= express.Router();
var auth= require('./controllers/authentication_controller');
var upl= require('./controllers/upload_controller');

//Get login
router.get('/login', function(req,res) {
    res.render('login', {layout: false});
});

//Register-Validate User
router.post('/login', function(req,res) {
    auth.registerUser(req,res);
});

//Authenticate User
router.post('/home', auth.passport.authenticate('local',{successRedirect:'/home',failureRedirect:'/login',failureFlash:true}));

//Get Homepage
router.get('/home', auth.ensureAuthenticated,function(req,res) {
    res.render('home', {layout: false});
});

//Get Logout
router.get('/logout',auth.ensureAuthenticated, function(req,res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/login');
})

//Upload file
router.post('/upload_file', auth.ensureAuthenticated, function(req, res) {
    upl.upload(req.headers,req,res);
})

module.exports= router;
