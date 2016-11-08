var express= require('express');
var router= express.Router();
var auth= require('./controllers/authentication_controller');
var postc= require('./controllers/post_controller');

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
});

//Write something and post it to your wall
router.post('/text',function(req,res) {
    postc.addPost(req.body,req.user);
     res.status(200).send();
});

//Load your posts
router.get('/load', function(req,res) {
    var loads=postc.loadPost(req.user,function(docs){
        res.status(200).send(docs);
    });

});

module.exports= router;
