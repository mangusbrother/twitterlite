/*global $:false */
'use strict';

var offset;
var limit = 10;

var app = angular.module('twitterlite', ['ngSanitize'])
	.filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
	
app.controller('RetrieveMessages', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
	
	$scope.getDateFormatForMs = function(timeMs) {				
		var date = $.format.prettyDate(timeMs);
		if(date) return date;
		return 'just now';
	}
	
	$scope.parseTags = function(content) {				
		content = content.replace(/#(\S+)/g, '<a class=\'hashtags\' href=\'list.html?hashtag=$1\'>#$1</a>');
		content = content.replace(/@(\S+)/g, '<a class=\'mentions\' href=\'list.html?user=$1\'>@$1</a>');
		
		return content;
	}
	
	$scope.init = function() {
		$http({
			method: 'GET', 
			url: 'http://localhost:8080/twitterlite/messages'
		
		}).success(function(data) {
			$scope.messages = data; // response data
		});
	};
	
	$scope.postMessage = function (username, content) {
		
		var xsrf = $.param({
			username: username,
			content: content
		});
		
		$http({
		
			method: 'POST',
			url:'http://localhost:8080/twitterlite/tweets',
			data: xsrf,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		
		}).success(function(data) {
			
			var date = new Date().getTime();
			var parsedDate = $scope.getDateFormatForMs(date);
			
			var message = {username: username, content: content, date: parsedDate};
			$scope.messages.unshift(message);
			
		});
	};
}]);
