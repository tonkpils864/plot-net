var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
var User= require('../models/user');
var mongoose= require('mongoose');
mongoose.Promise = require('bluebird');

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

function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg','You are not authorised to do that.');
        res.redirect('/login');
    }
}

function registerUser(req,res) {
    var name= req.body.name;
    var email= req.body.email;
    var username= req.body.username;
    var password= req.body.password;
    var password2= req.body.password2;

    //Validation
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('username', 'Username is required.').notEmpty();
    if(username) {
        req.checkBody('username', 'Username Taken').isAvailable();
    }
    req.checkBody('email', 'Email is required.').notEmpty();
    if(email) {
        req.checkBody('email', 'Email is not valid.').isEmail();
        req.checkBody('email', 'Email taken.').isAvailable(); //CUSTOM VALIDATION FUNCTION
    }
    req.checkBody('password', 'Password is required.').notEmpty();
    if(password) {
        req.checkBody('password2','Password validation is required.').notEmpty();
        if(password2) {
            req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);
        }
    }

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
        //Registration
        req.flash('success_msg', 'You are now registered and can now login');
        res.redirect('/login');
    })
    .catch(function(errors) {
        res.render('login', {
            errors:errors
        ,layout: false});
    });
}

function errorFormatter(param, msg, value) { // format the objects that populate the error array that is returned in req.validationErrors()
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
}

function isAvailable(name) { //custom function called above
    return new Promise(function(resolve, reject) {
        User.findOne(checkNameOrEmail(name))
        .then(function(user) {
            if (!user) {
                resolve(user);
            }
            else {
                reject(user);
            }
        })
        .catch(function(error){
            if (error) {
                reject(error);
            }
        });
    });
}

function checkNameOrEmail(name) {
    if(name.indexOf("@")>-1){
        var query= {email:name};
        return query;
    }
    else {
        var query= {username:name};
        return query;
    }
}

module.exports= {
    passport:passport,
    ensureAuthenticated: ensureAuthenticated,
    registerUser:registerUser,
    authenticate:passport.authenticate,
    errorFormatter:errorFormatter,
    isAvailable:isAvailable
};
