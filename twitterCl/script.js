var offset;
var limit = 10; 
function hideAlert(){
	$("#errorBox").hide();
	$("#tweetError").hide();
	$("#usernameError").hide();
}

/**
 checks if the username field and the tweet content are correct to be posted.
 If not it populates the error field
*/
function verifyContents(){
	hideAlert();
	var verified = true;
	var l = $("#username").val().length;
	
	if(l <= 0  || l > 20){
		verified = false;
		$("#usernameError").show();
	}
	l = $("#inputArea").val().length;
	
	if(l <=0 || l > 140){
		$("#tweetError").show();
		verified = false;
	}
	
	if(!verified){
		$("#errorBox").show();
	}
	
	return verified;
}

function documentReadyIndex() {
	
	populateAll();
	
	$("#tweetBtn").click(function() {
		if (verifyContents()){
			$.ajax({
				type: "POST",
				url:"http://localhost:8080/twitterlite/tweets",
				data: { 
					username : $("#username").val(), 
					content : $("#inputArea").val()
				},
				success: function(data) {
					populateAll();
				}
			});
		}
	});
}

function documentReadyList() {
	
	var hashtag = getURLParameter("hashtag");
	var username = getURLParameter("user");
	
	if (hashtag != "")
		getTweetsByHashtags(hashtag);
	else
		getTweetsByUser(username);
	
}
function getTweetsByHashtags(hashtag) {
	
	var url = "http://localhost:8080/twitterlite/messages/hashtags/" + hashtag; 
	var request = $.ajax({
		type: "GET",
		url: url,
	}).done(function() {		
		$("#allTweets").html("");
		var data = $.parseJSON(request.responseText);
		for (var i in data){
			$("#allTweets").prepend(getStylingForTweet(data[i]));
		}
	});
}

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
function getTweetsByUser(username) {
	
	var request = $.ajax({
		type: "GET",
		url:"http://localhost:8080/twitterlite/messages/mention/" + username
	
	}).done(function() {
		$("#allTweets").html("");
		
		var data = $.parseJSON(request.responseText);
		for (var i in data){
			$("#allTweets").prepend(getStylingForTweet(data[i]));
		}
	});
}

function parseTags(content){

	content = content.replace(/#(\S+)/g, '<a class=\"hashtags\" href=\"list.html?hashtag=$1\">#$1</a>');
	content = content.replace(/@(\S+)/g, '<a class=\"mentions\" href=\"list.html?user=$1\">@$1</a>');
	
	return content;
}

function getDateFormatForMs(timeMs){
	var time = new Date(timeMs);
	
	// 11th July 2014
	var curr_date = time.getDate();
	var m_names = new Array("January", "February", "March", 
	"April", "May", "June", "July", "August", "September", 
	"October", "November", "December");
	var sup = "";
	if (curr_date == 1 || curr_date == 21 || curr_date ==31) {
		sup = "st";
	} else if (curr_date == 2 || curr_date == 22) {
		sup = "nd";
	} else if (curr_date == 3 || curr_date == 23) {
		sup = "rd";
	} else {
		sup = "th";
	}
	var curr_month = time.getMonth();
	var curr_year = time.getFullYear();

	// H:mm AM
	var a_p = "";
	var curr_hour = time.getHours();
	if (curr_hour < 12) {
		a_p = "AM";
	} else {
		a_p = "PM";
	}
	if (curr_hour == 0) {
		curr_hour = 12;
	}
	if (curr_hour > 12) {
		curr_hour = curr_hour - 12;
	}
	var curr_min = time.getMinutes();
	curr_min = curr_min + "";
	if (curr_min.length == 1) {
		curr_min = "0" + curr_min;
	}
	
	return curr_date + "<SUP>" + sup + "</SUP> " + m_names[curr_month] + " " + curr_year + " " + curr_hour + ":" + curr_min + " " + a_p;
}

function getStylingForTweet(tweet){

	return "<div class=\"row\">"+
				"<div class=\"[ col-xs-12 col-sm-offset-1 col-sm-5 ] panelArea\">"+
					"<div class=\"[ panel panel-default ] panel-post\">"+
						"<div class=\"panel-heading\">"+
							"<h3>"+tweet.username+"</h3>"+
							"<h5><span>"+getDateFormatForMs(tweet.date)+"</span> </h5>"+
						"</div>"+
					"<div class=\"panel-body\">"+
						"<p>"+parseTags(tweet.content)+"</p>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>";
}

function populateAll(){

	offset = 0;
	$("#allTweets").html("");
	populateNext();
}

function checkNext(){
	// check if next call results 0 to hide Next-button
	var request2 = $.ajax({
		type: 'GET',
		url:"http://localhost:8080/twitterlite/messages",
		data: {limit:limit,offset:offset}
	}).done(function(){
		var data2 = $.parseJSON(request2.responseText);
		if(data2.length == 0){
			$("#showNext").hide();
		}else{
			$("#showNext").show();
		}
	});
}
function populateNext(){
	var request = $.ajax({
		type: 'GET',
		url:"http://localhost:8080/twitterlite/messages",
		data: {limit:limit,offset:offset}
		/*
			data is of the following format:
				username: ""
				content: ""
				date: (ms)
				hashtags: []
				mentions: []
		*/
		}).done(function(){
			var data = $.parseJSON(request.responseText);
			for (var i in data){
				$("#allTweets").append(getStylingForTweet(data[i]));
			}	
			offset = offset+10;
			checkNext();
		});

}
