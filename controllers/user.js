/**
 * Created by omer on 2.05.2017.
 */



var Twit = require('./twit');
var Analysis = require('./analysis');

var T = Twit.Twit;
var User = require('../models/user');


function findUser(screen_name, callback) {
    if (screen_name == null ||
        screen_name == undefined) {
        console.log("error findUser(screen_name, callback) screen_name: ", screen_name);
        return;
    };

    User.findOne({"screen_name": screen_name})
        .populate('recommendations')
        .exec(function (err, user) {
            callback(err, user);
        })
};

function loginCtrl(user) {
    var screen_name = user._json.screen_name;
    findUser(screen_name, function (err, obj) {
        if (err) {
            createUser(screen_name, user._json);
        }else if (obj == null || obj == undefined) {
            createUser(screen_name, user._json);
        }
    });
};




module.exports = {
    login: function (req) {
        var user = req.user;
        loginCtrl(user);
        Twit.auth();
    },
    me: function (req, res) {
        var name = req.query.screen_name;
        Twit.user(name, function (data, next) {
            console.log("me data", data);
            res.send(data);
        })
    },
    tweetsAnalysis: function (req, res) {
        var name = req.query.screen_name;
        Twit.tweets(name, function (data, next) {
            Analysis.tweets(Analysis.ANALYSIS_TYPE.TWEETS, data, function (json) {
                res.send(json);
            })
        })
    },

    favoritiesAnalysis: function (req, res) {
        var name = req.query.screen_name;
        Twit.favorities(name, function (data, next) {
            Analysis.tweets("FAVORITIES", data, function (json) {
                res.send(json);
            })
        })
    }
};


// USER MODELS

function createUser(screen_name, json) {
    try {
        var user = new User();
        user.screen_name = screen_name;
        user.description = json.description;
        user.save(function (err) {
        });
    }catch (e) {
    }
}
