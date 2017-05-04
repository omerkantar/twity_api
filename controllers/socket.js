/**
 * Created by omer on 2.05.2017.
 */



var Twit = require('./twit');
var T = Twit.Twit;

var User = require('../models/user');


function me(screen_name, socket) {
    var filter = '' + screen_name;
    var stream = T.stream('statuses/filter', { track:  filter });
    stream.on('tweet', function (tweet) {
        console.log("T.stream.on tweet: ", tweet);
        var data = { "tweet": tweet };
        socket.emit("me", data);
    });

    socket.on('disconnect', function () {
        if (stream) {
            stream.stop();
        }
    })
}


module.exports = {
    start: function(io) {
        io.on('connection', function (socket) {
            socket.on('me', function(data) {
                me(data, socket);
            });
        });

    }
};

