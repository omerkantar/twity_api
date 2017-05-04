


var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();
var path = require('path');

var UserCtrl = require('../controllers/user');

// Get the user profile
router.get('/', ensureLoggedIn, function(req, res, next) {
    UserCtrl.login(req);
    var session = req.session;
    console.log("session", session);
    var cookieValue = JSON.stringify(req.user._json.screen_name);
    res.clearCookie('session');
    res.clearCookie('screen_name');
    res.clearCookie('user');
    res.cookie('screen_name', cookieValue);

    res.sendFile(path.join(__dirname+'/../views/user.html'));
});

router.get('/me', function (req, res) {
    var screen_name = req.query.screen_name;
    UserCtrl.me(req, res);
});

router.get('/tweets', function(req, res) {
    UserCtrl.tweetsAnalysis(req, res);
});

router.get('/favorites', function(req, res) {
    UserCtrl.favoritiesAnalysis(req, res);
});

router.get('/popular', function (req, res) {
    UserCtrl.popularTweets(req, res);
});

router.get('/recommendations', function (req, res) {
    UserCtrl.recommendations(req, res);
});

module.exports = router;
