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
}

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
				$("#allTweets").prepend("<div>"+parseTags(data[i].content)+"</div>");
			}
		});

}