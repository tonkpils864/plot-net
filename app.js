var express= require('express');
var path= require('path');
var cookieParser= require('cookie-parser');
var bodyParser=require('body-parser');
var exphbs= require('express-handlebars');
var expressValidator= require('express-validator');
var flash= require('connect-flash');
var session= require('express-session');
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
var mongo= require('mongodb');
var mongoose= require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/loginapp');
var db=mongoose.connection;

var home= require('./routes/home');
var login= require('./routes/login');
var User= require('./models/user');

//init app
var app= express();

//View Engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'login'}));
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Express session
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
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
    },
    customValidators: {
        isUsernameAvailable: function(username) {
            return new Promise(function(resolve, reject) {
                User.findOne({ username: username })
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
        },
        isEmailAvailable: function(email) {
            return new Promise(function(resolve, reject) {
                User.findOne({ email: email })
                .then(function(mail) {
                    if (!mail) {
                        resolve(mail);
                    }
                    else {
                        reject(mail);
                    }
                })
                .catch(function(error){
                    if (error) {
                        reject(error);
                    }
                });
            });
        }
    }
}));

//Connect flash
app.use(flash());

//Global vars
app.use(function (req,res, next) {
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user= req.user || null;
    next();
});

app.use('/',login);
app.use('/',home);

//Set Port
app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port '+ app.get('port'));
});
