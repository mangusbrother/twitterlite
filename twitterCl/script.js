function documentReadyIndex() {
	
	populateAll();
	
	$("#tweetBtn").click(function() {
	
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
	});
	
	hashtagsMentionsClick();
}

function hashtagsMentionsClick() {
	
	$(document).on("click", ".hashtags", function() {
	
		var hashtag = $(this).html();
		hashtag = hashtag.substring(1, hashtag.length);
		
		var url = "http://localhost:8080/twitterlite/messages/hashtags/" + hashtag; 
		
		var request = $.ajax({
			type: "GET",
			url: url,
		}).done(function() {
			alert("hashtag");
		
			$("#allTweets").html("");
			
			var data = $.parseJSON(request.responseText);
			for (var i in data){
				$("#allTweets").prepend(getStylingForTweet(data[i]));
			}
		});
	});

	$(document).on("click", ".mentions", function() {
		
		var username = $(this).html();
		username = username.substring(1, username.length);
		
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
	});
	
}

function parseTags(content){

	content = content.replace(/#(\S+)/g, '<a class=\"hashtags\" href=\"list.html\">#$1</a>');
	content = content.replace(/@(\S+)/g, '<a class=\"mentions\" href=\"list.html\">@$1</a>');
	
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
	
	return curr_hour + " : " + curr_min + " " + a_p + " " + curr_date + "<SUP>" + sup + "</SUP> " + m_names[curr_month] + " " + curr_year ;
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

	$("#allTweets").html("");

	var request = $.ajax({
		type: 'GET',
		url:"http://localhost:8080/twitterlite/messages",
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
				$("#allTweets").prepend(getStylingForTweet(data[i]));
			}
		});

}
