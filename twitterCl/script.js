function parseTags(content){
	content.replace(/(^|\s)(#[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	content.replace(/(^|\s)(@[a-z\d-]+)/ig, "$1<a href=\"list.html?value=$2\">$2</a>");
	return content;
}
function tweet(){
	alert("Test");
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