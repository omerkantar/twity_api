/**
 * Created by omer on 2.05.2017.
 */


function findBestHashtags(tweets) {

    var list = new Array();

    for (var i = 0; i < tweets.length; i++) {
        var obj = tweets[i];
        if (obj != null && obj != undefined) {
            var hashtags = obj.entities.hashtags;
            if (hashtags) {
                for (var j = 0; j < hashtags.length; j++) {
                    var tag = hashtags[j];
                    if (tag.text) {
                        list.push(tag.text);
                    }
                }
            }
        }
    }
    var json = new Object();
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var tag = list[i];
            var item = json[tag];

            if (item) {
                item.count++;
            }else {
                item = {
                    "hashtag": tag,
                    count: 1
                };
            }
            json[tag] = item;
        }
    }

    var values = Object.keys(json).map(function (key) {
        return json[key];
    });


    values.sort(function(a, b) {
        return b.count - a.count;
    });

    return values;
}

function findMentions(tweets) {

    var list = new Array();

    for (var i = 0; i < tweets.length; i++) {
        var obj = tweets[i];
        if (obj != null && obj != undefined) {
            var user_mentions = obj.entities.user_mentions;
            if (user_mentions) {
                for (var j = 0; j < user_mentions.length; j++) {
                    var mention = user_mentions[j];
                    if (mention.screen_name) {
                        list.push({
                            "screen_name": mention.screen_name,
                            "name": mention.name,
                            "id": mention.id
                        });
                    }
                }
            }
        }
    }
    var json = new Object();
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var mention = list[i];
            var item = json[mention.screen_name];

            if (item) {
                item.count++;
            }else {
                item = {
                    "mention": mention,
                    count: 1
                };
            }
            json[mention.screen_name] = item;
        }
    }

    var values = Object.keys(json).map(function (key) {
        return json[key];
    });


    values.sort(function(a, b) {
        return b.count - a.count;
    });

    return values;
}



function findUsers(tweets) {

    var list = new Array();

    for (var i = 0; i < tweets.length; i++) {
        var obj = tweets[i];
        if (obj != null && obj != undefined) {
            var user = obj.user;
            if (user) {
                list.push({
                    "screen_name": user.screen_name,
                    "name": user.name,
                    "description": user.description,
                    "user_model": user
                });
            }
        }
    }
    var json = new Object();
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var user = list[i];
            var item = json[user.screen_name];

            if (item) {
                item.count++;
            }else {
                item = {
                    "user": user,
                    count: 1
                };
            }
            json[user.screen_name] = item;
        }
    }

    var values = Object.keys(json).map(function (key) {
        return json[key];
    });


    values.sort(function(a, b) {
        return b.count - a.count;
    });

    return values;

}

function popularTweets(tweets) {

    var list = new Array();

    for(var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i];
        if (tweet.favorite_count > 0) {
            var obj = {
                "tweet": tweet,
                count: tweet.favorite_count
            };
            list.push(obj);
        }
    };

    if (list.length > 1) {
        list.sort(function (a, b) {
            return b.count - a.count;
        });
    }

    return list;
}




module.exports = {
    tweets: function (type, tweets, callback) {

        var data = {
            "hashtags": findBestHashtags(tweets),
            "mentions": findMentions(tweets)
        };

        if (type == "FAVORITIES") {
            data.users = findUsers(tweets);
        }

        callback(data);
    },

    ANALYSIS_TYPE : {
        TWEETS: "TWEETS",
        FAVORITIES: "FAVORITIES"
    },

    popularTweets: function (tweets, callback) {
        var list = popularTweets(tweets);
        callback(list);
    }
};