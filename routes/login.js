var express= require('express');
var router= express.Router();
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
var User= require('../models/user');

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

passport.use(new LocalStrategy(
  function(username, password, done) {
      User.getUserByUsername(username, function(err,user) {
            if(err) throw err;
            if(!user) {
                return done(null, false,{message:'Unknown User'});
            }
            User.comparePassword(password,user.password, function(err,isMatch) {
                if(err) throw err;
                if(isMatch) {
                    return done(null,user);
                }else  {
                    return done(null, false,{message:'Invalid password'});
                }
            })
      });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/home', passport.authenticate('local',{successRedirect:'/home',failureRedirect:'/login',failureFlash:true}));


module.exports= router;
