/**
 * Created by omer on 2.05.2017.
 */


var screen_name = getCook('screen_name').replace(/\"/g,'');

var DATA = {
    TWEETS: null,
    FAVORITES: null,
    USER: null,
    RECOMMENDATIONS: null
};

var mainContainer = document.getElementById("main-container");
var profileContainer = document.getElementById("user-temp");
var visibleTemp = null;

viewDidLoad();

function viewDidLoad() {
    profileContainer.style.display = "none";

    if (DATA.USER == null) {
        GET("me", function (json) {
            DATA.USER = json;
            showingUserTemplate(json);
            window.location.hash = "#tweets";
        })
    }else {
        showingUserTemplate(DATA.USER);
        window.location.hash = "#tweets";
    }

};

// ROUTE
window.onhashchange = function () {
    var hash = location.hash;
    route(hash);
};

function route(hash) {
    switch (hash) {
        case "#tweets":
            routeToViewId(VIEWS.TWEETS);
            break;
        case "#favourites":
            routeToViewId(VIEWS.FAVOURITES);
            break;
        case "#recommendations":
            routeToViewId(VIEWS.RECOMMENDATIONS);
            break;
        default:
            routeToViewId(VIEWS.TWEETS);
            break;
    }
};

var VIEWS = {
    TWEETS: "tweets-temp",
    FAVOURITES: "favourites-temp",
    RECOMMENDATIONS: "recommendations-temp"
};

function showingUserTemplate(data) {
    console.log("data", data);

    profileContainer.style.display = "block";

    var userTemplate = new Vue({
        el: '#user-temp',
        data: {
            user: data
        }
    });
}


function routeToViewId(id) {
    mainContainer.style.display = "none";
    if (visibleTemp) {
        visibleTemp.style.display = "none";
    }

    switch (id) {
        case VIEWS.TWEETS:
            if (DATA.TWEETS == null) {

                GET("tweets", function (json) {
                    DATA.TWEETS = json;
                    loadingTweets();
                    setVisibleTemp(id);

                });
            }else {
                setVisibleTemp(id);
            }

            break;
        case VIEWS.FAVOURITES:

            if (DATA.FAVORITES == null) {
                GET("favorites", function (json) {
                    DATA.FAVORITES = json;
                    loadingFavorities();
                    setVisibleTemp(id);

                })
            }else {
                setVisibleTemp(id);
            }

            break;
        case VIEWS.RECOMMENDATIONS:

            if (DATA.RECOMMENDATIONS == null) {


            }else {
                setVisibleTemp(id);
            }
            break;
        default :
            break;
    }
}

function loadingTweets() {

    var json = DATA.TWEETS;

    var tweetsTemplate = new Vue({
        el: '#tweets-temp',
        data: {
            hashtags: json.hashtags,
            mentions: json.mentions
        }
    });

    showingTweetsCharts();

}

function loadingFavorities() {

    var json = DATA.FAVORITES;

    var tweetsTemplate = new Vue({
        el: '#favorities-temp',
        data: {
            hashtags: json.hashtags,
            mentions: json.mentions,
            users: json.users
        }
    });
}

function setVisibleTemp(temp) {
    allhide();
    visibleTemp = document.getElementById(temp);
    mainContainer.style.display = "block";
    visibleTemp.style.display = "block";
}


function allhide() {
    document.getElementById(VIEWS.TWEETS).style.display = "none";
    document.getElementById(VIEWS.FAVOURITES).style.display = "none";
    document.getElementById(VIEWS.RECOMMENDATIONS).style.display = "none";

}


function GET(type, callback) {
    var url = "/user/" + type + "?screen_name=" + screen_name;
    request("GET", url, function (data) {
        var json = JSON.parse(data);
        callback(json);
    });
}

var REQUEST_TYPE  = {
    me: "me",
    tweets: "tweets",
    favorites: "favorites"
};


