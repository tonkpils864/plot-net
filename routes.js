var express= require('express');
var router= express.Router();
var User= require('./models/user');
var Routes= require('./controllers/authentication_controller');

//Get login
router.get('/login', function(req,res) {
    res.render('login', {layout: false});
});

//Register User
router.post('/login', function(req,res) {
     var name= req.body.name;
     var email= req.body.email;
     var username= req.body.username;
     var password= req.body.password;
     var password2= req.body.password2;

     //Validation
     req.checkBody('name', 'Name is required.').notEmpty();
     req.checkBody('email', 'Email is required.').notEmpty();
     req.checkBody('email', 'Email is not valid.').isEmail();
     req.checkBody('email', 'Email taken.').isEmailAvailable();
     req.checkBody('username', 'Username is required.').notEmpty();
     req.checkBody('username', 'Username Taken').isUsernameAvailable();
     req.checkBody('password', 'Password is required.').notEmpty();
     req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

     req.asyncValidationErrors()
     .then(function() {
         var newUser= new User({
            name:name,
            email:email,
            username:username,
            password:password
         });

         User.createUser(newUser, function(err, user) {
             if(err) throw err;
         });

         req.flash('success_msg', 'You are now registered and can now login');
         res.redirect('/login');
     })
     .catch(function(errors) {
         res.render('login', {
             errors:errors
         ,layout: false});
     });
});


router.post('/home', Routes.passport.authenticate('local',{successRedirect:'/home',failureRedirect:'/login',failureFlash:true}));

//Get Homepage
router.get('/home', Routes.ensureAuthenticated,function(req,res) {
    res.render('home', {layout: false});
});

router.get('/logout',Routes.ensureAuthenticated, function(req,res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/login');
})

module.exports= router;
