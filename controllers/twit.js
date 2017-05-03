/**
 * Created by omer on 2.05.2017.
 */


var Twit = require('twit');


var config = {
    "consumer_key": "cNWruGG7dzPVRSvEYnzomopCb",
    "consumer_secret": "G7NxC4V9BpH7DJ8R8Fh0b1wvaNFqbKIxfcS1KXbykA9HsSASW4",
    "access_token_key": "2246971327-LhDuJXi8fU5sNKk2LagN10wh5657zJnn5t2WPDK",
    "access_token_secret": "nwaoF0pkY7e57XWKd095bIYEEfGfmfFdAOf5Y0CpJISPe"
};

var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token_key,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60*1000
});


function auth() {
    T.get('account/verify_credentials', { skip_status: true })
        .catch(function (err) {
            console.log('caught error', err.stack)
            if (err) {
                if (callback) {
                    callback(err, null);
                }
            }
        })
        .then(function (result) {
            console.log('data', result.data);
            if (result.data != null && result.data != undefined) {

            }
        });
}


function favoritiesBlock(screenName, callback) {
    var options = {
        screen_name: screenName,
        count: 200
    };

    T.get('favorites/list', options, function (err, data, response) {
        if (err) {
            console.log("error favorites/list ", err)
        }else {
            callback(data, response);
        }

    });
}

function tweetsBlock(screenName, callback) {

    var options = {
        screen_name: screenName,
        count: 1000
    };

    T.get('statuses/user_timeline', options, function (err, data, response) {
        if (err) {
            console.log("error statuses/user_timeline ", err)
        }else {
            callback(data, response);
        }
    });

}

function userBlock(screenName, callback) {
    var options = {
        screen_name: screenName
    };

    T.get('users/show', options, function (err, data, response) {
        if (data) {
            callback(data, response);
        }else {
            console.log("error users/show ", err)
        }

    });

}



module.exports = {
    tweets: function (name, callback) {
        tweetsBlock(name, callback);
    },

    favorities: function (name, callback) {
        favoritiesBlock(name, callback);
    },

    user: function (name, callback) {
        userBlock(name, callback);
    },
    auth: function() {
        auth();
    },
    Twit: T
};