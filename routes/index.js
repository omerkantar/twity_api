/**
 * Created by omer on 2.05.2017.
 */


var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

/* GET home page. */

router.get('/',function(req, res){
    res.sendFile(path.join(__dirname+'/../views/index.html'));
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname+'/../views/login.html'));
});

// Perform session logout and redirect to homepage
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
    function(req, res) {
        res.redirect(req.session.returnTo || '/user');
    });


module.exports = router;