function parseTags(elementId){
	var content = $(elementId).html();
	content = content.replace(/#(\\w+|\\W+)/g,function(text,link){
		return '<a href="list.html?value='+link+'">'+link+'</a>';
	})
	content = content.replace(/@(\\w+|\\W+)/g,function(text,link){
		return '<a href="list.html?value='+link+'">'+link+'</a>';
	})
	$(elementId).html(content);
	
}
function tweet(){
	alert("Test");
}
function populateAll(){
	$.ajax({
		type: 'GET',
		url:"http://localhost:8080/twitterlite/messages",
		data:{ get_param: 'value' },
		success: function(data){
			var names = data
			$('allTweets').text(data);
		}
	);
}