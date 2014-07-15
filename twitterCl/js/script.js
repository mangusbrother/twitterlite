/*global $:false */
'use strict';

var app = angular.module('twitterlite', ['ngSanitize', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) { 	
	
	$routeProvider.when('/', {
        templateUrl: 'tpl/homepage.html',
        controller: 'HomeController'
    
	}).when('/messages/hashtags/:hashtag', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'
 
	}).when('/messages/mention/:username', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'
		
	}).otherwise({redirectTo:'/'});
}]);

app.filter('to_trusted', ['$sce', function($sce) {
	
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

app.factory('CommonCode', function() {
	var root = {};
	
	root.parseDate = function(timeMs) {
		
		var date = $.format.prettyDate(timeMs);
		if(date) return date;	
		return 'just now';
	};
	
	root.parseTags = function(content) {
		
		content = content.replace(/#(\S+)/g, '<a class=\'hashtags\' href=\'#/messages/hashtags/$1\'>#$1</a>');
		content = content.replace(/@(\S+)/g, '<a class=\'mentions\' href=\'#/messages/mention/$1\'>@$1</a>');
		return content;			
	};
	return root;
});


app.controller('HomeController', ['$scope', '$http', 'CommonCode', function($scope, $http, CommonCode) {
	
	$scope.offset = 0;
	$scope.limit = 10;
	$scope.service = CommonCode;
	
	$scope.init = function init() {
		
		$http({
			method: 'GET', 
			url: 'http://localhost:8080/twitterlite/messages',
			params: {
				limit: $scope.limit, 
				offset: $scope.offset
			}
		}).success(function(data) {
			
			$scope.messages = data;
			$scope.offset += data.length;
		});
	};
	
	$scope.getNextTweets = function getNextTweets() {
		
		$http({
			method: 'GET', 
			url: 'http://localhost:8080/twitterlite/messages',
			params: {
				limit: $scope.limit, 
				offset: $scope.offset
			}
		}).success(function(data) {
			
			$scope.offset += data.length;
			
			$.each(data, function(key, msg) {
			
				var message = {username: msg.username, content: msg.content, date: msg.date};
				$scope.messages.push(message);
			});
			
			if (data.length === 0) {
				$('#showNext').hide();
			} else {
				$('#showNext').show();
			}
		});
	};
	
	$scope.postMessage = function postMessage(isValid, username, content) {
				
		if (isValid) {		
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
				var parsedDate = $scope.service.parseDate(date);
				
				var message = {username: username, content: content, date: parsedDate};
				$scope.messages.unshift(message);
				$scope.offset++;
				
			});
		}
	};
}]);

app.controller('ListController', ['$scope', '$http', '$routeParams', 'CommonCode', function($scope, $http, $routeParams, CommonCode) {
	
	$scope.service = CommonCode;
	$scope.hashtag = $routeParams.hashtag;
	$scope.mention = $routeParams.username;

	$scope.init = function init() {
		
		var url = 'http://localhost:8080/twitterlite/messages/';
		
		if ($scope.hashtag) {
			url = url + '/hashtags/' + $scope.hashtag;
		} else if ($scope.mention) {
			url = url + '/mention/' + $scope.mention;
		}
		
		$http({
			method: 'GET', 
			url: url
		
		}).success(function(data) {
			$scope.messages = data; // response data
		});		
	};
}]);