function parseTags(content){
	content.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	content.replace(/(^|\s)(@[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	return content;
}

function documentReady() {
	$("#tweetBtn").click(function() {
	
		$.ajax({
			type: "POST",
			url:"http://localhost:8080/twitterlite/tweets",
			data: { 
				username : $("#username").val(), 
				content : $("#inputArea").val()
			},
			success: function(data) {
				alert("added");
			}
		});
	});
	populateAll();
}

function populateAll(){
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
				$("#allTweets").append("<div>"+parseTags(data[i].content)+"</div>");
			}
		});

}