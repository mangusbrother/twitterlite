function documentReady() {
	
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

	function populateAll(){
		$.ajax({
			type: 'GET',
			url:"http://localhost:8080/twitterlite/messages",
			data:{ get_param: 'value' },
			success: function(data){
				var names = data
				$('allTweets').text(data);
			}
		});
	}
});