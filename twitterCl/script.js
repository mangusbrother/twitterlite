var offset;
var limit = 10;

function hideAlert(){
	$("#errorBox").hide();
	$("#tweetError").hide();
	$("#usernameFormatError").hide();
}

/**
 checks if the username field and the tweet content are correct to be posted.
 If not it populates the error field
*/
function verifyContents(){
	hideAlert();
	var verified = true;
	var username = $("#username").val();
	var l = username.length;
	
	if(l <= 0  || l > 20 || !username.match(/^((\w)(\w*[-']*)*)$/)){
		verified = false;
		$("#usernameFormatError").show();
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
			
			var contents = $("#inputArea").val();
			$("#inputArea").val('');
			
			$.ajax({
				type: "POST",
				url:"http://localhost:8080/twitterlite/tweets",
				data: { 
					username : $("#username").val(), 
					content : contents
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
	
	if (hashtag) {
		getTweetsByHashtags(hashtag);
	}
	
	else if (username) {
		getTweetsByUser(username);
	}
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
			$("#allTweets").append(getStylingForTweet(data[i]));
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
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

function getTweetsByUser(username) {
	
	var url = "http://localhost:8080/twitterlite/messages/mention/" + username;
	
	var request = $.ajax({
		type: "GET",
		url:url,
	
	}).done(function() {
		$("#allTweets").html("");
		
		var data = $.parseJSON(request.responseText);
		for (var i in data){
			$("#allTweets").append(getStylingForTweet(data[i]));
		}
	});
}

function parseTags(content){

	content = content.replace(/#(\S+)/g, '<a class=\"hashtags\" href=\"list.html?hashtag=$1\">#$1</a>');
	content = content.replace(/@(\S+)/g, '<a class=\"mentions\" href=\"list.html?user=$1\">@$1</a>');
	
	return content;
}

function getDateFormatForMs(timeMs){
	var date = $.format.prettyDate(timeMs);
	if(date) return date;
	return "just now";
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