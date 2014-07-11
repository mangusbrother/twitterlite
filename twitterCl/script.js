function parseTags(content){
	//content.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	//content.replace(/(^|\s)(@[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	
	content.replace(/#(\S+)/g, '<a href=\"list.html\">#$1</a>');
	content.replace(/@(\S+)/g, '<a href=\"list.html\">@$1</a>');
		
	return content;
}

function documentReady() {
	
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
$(".hashtags").click(function() {
	
	var hashtag = $(this).val();
	hashtag = hashtag.substring(1, hashtag.length);
	
	$.ajax({
		type: "GET",
		url:"http://localhost:8080/twitterlite/messages/hashtags/" + hashtag,
		success: function(data) {
			populateAll();
		}
	});
});

$(".mention").click(function() {
	
	var username = $(this).val();
	username = username.substring(1, username.length);
	
	$.ajax({
		type: "GET",
		url:"http://localhost:8080/twitterlite/messages/mention/" + hashtag,
		success: function(data) {
			populateAll();
		}
	});
});
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
				"<div class=\"[ col-xs-12 col-sm-offset-1 col-sm-5 ]\">"+
					"<div class=\"[ panel panel-default ] panel-post\">"+
						"<div class=\"panel-heading\">"+
							"<h3>"+tweet.username+"</h3>"+
							"<h5><span>Date</span> - <span>"+getDateFormatForMs(tweet.date)+"</span> </h5>"+
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
