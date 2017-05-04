




var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/twity_app');

var routes = require('./routes/index');
var user = require('./routes/user');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./controllers/socket').start(io);

var port = 5454;


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:4200');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       "omearthling.auth0.com",
    clientID:     "kAvxHwFKWTSMceNlaxhi24nKygxlY7z2",
    clientSecret: "Ox7C7gRofzTDI5Fk_cSuVpuOp9ExAe3LGHYNGO4oZP1q6T4lGNtu08AWYEuY7e01",
    callbackURL:  'http://localhost:5454/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    if (profile != null && profile != undefined) {
        var User = {};
        User.profile = profile;
        User.accessToken = accessToken;
        User.refreshToken = refreshToken;
        User.extraParams = extraParams;

        //var model = new UserModel();
        //
        //model.username = profile._json.screen_name;
        //model.access_token = accessToken;
        //
        //model.save(function (err) {
        //    console.log("saved model ", model, err);
        //});

    }

    return done(null, profile);
});



passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/user', user);


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


server.listen(port);
console.log("Server listening on port " + port);


module.exports = app;