/**
 * Created by omer on 4.05.2017.
 */



var Twit = require('./twit');

var Analysis = require('./analysis');

var User = require('../models/user');
var Recommendation = require('../models/recommendation');



module.exports = {
    recommendations: function (user, callback) {
        var list = new Array();
        createRecommendation(0, user, function (rec1) {
            list.push(rec1);
            createRecommendation(1, user, function (rec2) {
                list.push(rec2);
                callback(list);
            })
        })

    }
};


function createRecommendation(type, usr, callback) {

    var recommendation = new Recommendation();
    recommendation.user = usr._id;

    switch (type) {
        case 0:
        // POPULAR TWEET
            Twit.tweets(usr.screen_name, function (data, next) {
                Analysis.popularTweets(data, function (list) {
                    recommendation.title = "Popülerler tweetleri";
                    var first = list[0];
                    var sec = list[1];
                    var third = list[2];
                    if (first) {
                        recommendation.populars.push(first);
                    }
                    if (sec) {
                        recommendation.populars.push(sec);
                    }
                    if (third) {
                        recommendation.populars.push(third);
                    }

                    recommendation.save(function (err) {
                        if (err) {
                            console.log("error recommendation.save", err);
                        }else {
                            usr.recommendations.push(recommendation._id);
                            usr.save(function (err2) {
                                callback(recommendation);
                            })
                        }
                    });

                });
            });

            break;
        case 1:
            // FAVORI Users
            recommendation.title = "En çok favorilediği kullanıcılar";
            var favorites = usr.analysis.favorities;
            if (favorites.length > 0) {
                var last = favorites[favorites.length - 1];
                if (last.mentions) {
                    console.log("last mentions", last.mentions);

                    if (last.mentions.length > 0) {
                        var first = last.mentions[0];
                        var secound = last.mentions[1];
                        var third = last.mentions[2];

                        if (first) {
                            console.log("first mention", first);
                            recommendation.users.push(first);
                        }
                        if (secound) {
                            console.log("secound mention", secound);

                            recommendation.users.push(secound);
                        }
                        if (third) {
                            console.log("third mention", third);

                            recommendation.users.push(third);
                        }
                    }
                }

            }

            recommendation.save(function (err) {
                if (err) {
                    console.log("error recommendation.save", err);
                }else {
                    usr.recommendations.push(recommendation._id);
                    usr.save(function (err2) {
                        callback(recommendation);
                    })
                }
            })


            break;

        default :

            break;
    }

    return;

};


