/**
 * Created by omer on 2.05.2017.
 */



var Twit = require('./twit');
var Analysis = require('./analysis');

var T = Twit.Twit;
var User = require('../models/user');
var RecommendationCtrl = require('./recommendation');

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

function loginCtrlMe(user) {
    var screen_name = user.screen_name;
    findUser(screen_name, function (err, obj) {
        if (err) {
            createUser(screen_name, user);
        }else if (obj == null || obj == undefined) {
            createUser(screen_name, user);
        }
    });
};


function saveFavorites(screen_name, data) {
    findUser(screen_name, function (err, usr) {
        if (usr) {
            if (usr.analysis == null) {
                usr.analysis = new Object();
            };
            usr.analysis.favorities.push(data);
            usr.save(function (err) {
                if (err) {
                    console.log("error - save favorites", err);
                }
            })
        }
    })
}

function saveTweets(screen_name, data) {
    findUser(screen_name, function (err, usr) {
        if (usr) {
            if (usr.analysis == null) {
                usr.analysis = new Object();
            };
            usr.analysis.tweets.push(data);
            usr.save(function (err) {
                if (err) {
                    console.log("error - save favorites", err);
                }
            })
        }
    })
}


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
            loginCtrlMe(data);
            res.send(data);
        })
    },

    tweetsAnalysis: function (req, res) {
        var name = req.query.screen_name;
        Twit.tweets(name, function (data, next) {
            Analysis.tweets(Analysis.ANALYSIS_TYPE.TWEETS, data, function (json) {
                saveTweets(name, json);
                res.send(json);
            })
        })
    },

    favoritiesAnalysis: function (req, res) {
        var name = req.query.screen_name;
        Twit.favorities(name, function (data, next) {
            Analysis.tweets("FAVORITIES", data, function (json) {
                saveFavorites(name, json);
                res.send(json);
            })
        })
    },

    recommendations: function (req, res) {
        var name = req.query.screen_name;
        findUser(name, function (err, usr) {
            if (usr) {
                RecommendationCtrl.recommendations(usr, function (list) {
                    res.send(list);
                });
            }
        });
    },

    popularTweets: function (req, res) {
        var name = req.query.screen_name;
        Twit.tweets(name, function (data, next) {
            Analysis.popularTweets(data, function (list) {
                var json = {
                    "popular_tweets": list
                };
                res.send(json);
            });
        })
    }
};


// USER MODELS

function createUser(screen_name, json) {
    try {
        var user = new User();
        user.screen_name = screen_name;
        user.analysis = {
            tweets: [],
            favorities: [],
        };
        if (json) {
            user.description = json.description;
        }
        user.save(function (err) {
            if (err) {
                console.log("user saved error", err);
            }
        });
    }catch (e) {
    }
}



