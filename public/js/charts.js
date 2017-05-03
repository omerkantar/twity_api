/**
 * Created by omer on 2.05.2017.
 */


var ctxHashtags1 = document.getElementById("hashtagChart1");
var ctxMentions1 = document.getElementById("mentionsChart1");

var chartHash1, chartHash2;
var chartMention1, chartMention2;


function showingTweetsCharts() {

    var data = DATA.TWEETS;

    hashtagsChartLabels(data.hashtags, function (labels, counts) {
        chartHash1 = getChart(ctxHashtags1, labels, counts);
        displayCharts();
    });

    mentionsChartLabels(data.mentions, function (labels, counts) {
        chartMention1 = getChart(ctxMentions1, labels, counts);
        displayCharts();

    })
}



function displayCharts() {
    ctxHashtags1.style.display = "block";
    ctxMentions1.style.display = "block";
}

function hashtagsChartLabels(hashtags, callback) {
    var labels = new Array();
    var counts = new Array();

    for (var i = 0; i < 6; i++) {
        var tag = hashtags[i];
        if (tag.count != 1) {
            labels.push(tag.hashtag);
            counts.push(tag.count);
        }
    }

    callback(labels, counts);
}

function mentionsChartLabels(mentions, callback) {
    var labels = new Array();
    var counts = new Array();

    for(var i = 0; i < 6; i++) {
        var men = mentions[i];
        if (men.count > 1) {
            labels.push(men.mention.name);
            counts.push(men.count);
        }
    }
    callback(labels, counts);
}

function usersChartLabels(users, callback) {

    var labels = new Array();
    var counts = new Array();

    for(var i = 0; i < 6; i++) {
        var usr = users[i];
        if (usr.count > 1) {
            labels.push(usr.user.name);
            counts.push(usr.count);
        }
    }
    callback(labels, counts);

}


function getChart(obj, labels, counts) {

    var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };


    var chart = new Chart(obj, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ]
                }]
        },
        options: options
    });

    return chart;
}