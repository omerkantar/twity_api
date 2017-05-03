/**
 * Created by omer on 2.05.2017.
 */


var lock = new Auth0Lock('kAvxHwFKWTSMceNlaxhi24nKygxlY7z2', 'omearthling.auth0.com');
var user = new Object();


function clickAuthorization() {
    console.log("clickked btn-login");
    lock.show();
}

lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
        if (error) {
            // Handle error
            return;
        }
        localStorage.setItem('id_token', authResult.idToken);
        // Display user information
        show_profile_info(profile);
    });
});

var socket = io.connect('http://localhost:5454/');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});



function getCook(cookiename)
{
    // Get name followed by anything except a semicolon
    var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}
