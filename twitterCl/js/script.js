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
 
	}).when('/messages/mention/:mention', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'
		
	}).when('/messages/user/:username', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'

    }).otherwise({redirectTo:'/'});
}]);


app.filter('to_trusted', ['$sce', function($sce) {
	
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

app.factory('CommonCode', function($http) {
	var root = {};
	
	// Returns a sanitised version of the datw which is appropriate for display.
	root.parseDate = function(timeMs) {
		
		var date = $.format.prettyDate(timeMs);
		if(date) return date;	
		return 'just now';
	};
	
	// Updates mentions and hashtags within a tweet with the appropriate links.
	root.parseTags = function(content) {
		
		content = content.replace(/#(\S+)/g, '<a class=\'hashtags\' href=\'#/messages/hashtags/$1\'>#$1</a>');
		content = content.replace(/@(\S+)/g, '<a class=\'mentions\' href=\'#/messages/mention/$1\'>@$1</a>');
		return content;			
	};

	root.retrieveMessages = function(url, limit, offset) {

		var promise = $http({
						method: 'GET', 
						url: url,
						params: {
							limit: limit, 
							offset: offset
						}
					});

		return promise;
	};

	return root;
});


app.controller('HomeController', ['$scope', '$http', 'CommonCode', function($scope, $http, CommonCode) {
	
	var offset = 0;
	var limit = 5;
	var showLoadButton = true;
	$scope.service = CommonCode;
	
	$scope.init = function init() {

		$scope.getNextTweets();
	};
	
	$scope.getNextTweets = function getNextTweets() {
		
		var promise = CommonCode.retrieveMessages('http://localhost:8080/twitterlite/messages', limit, offset);
		promise.success(function(data) {

			// In case of first read, the retrieved data must be copied directly to $scope.messages
			if (!$scope.messages) {

				$scope.messages = data;
			} 
			// Otherwise, the retrieved data may simply be appended.
			else{

				$.each(data, function(key, msg) {
				
					var message = {username: msg.username, content: msg.content, date: msg.date};
					$scope.messages.push(message);
				});
			}			
			
			// Show or hide 'Load More' button as a result of the retrieved data.
			offset += data.length;

			if (data.length === 0 || data.length < limit) {
				
				showLoadButton = false;
			}
		}).error(function(){

			console.log('Message retrieval failed.');
		});
	};
	
	$scope.postMessage = function postMessage(isValid) {
		
		if (isValid) {		
			var xsrf = $.param({
				username: $scope.formUsername,
				content: $scope.formContent
			});
			
			$http({
				method: 'POST',
				url:'http://localhost:8080/twitterlite/tweets',
				data: xsrf,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			
			}).success(function(data) {
				
				var date = new Date().getTime();
				var parsedDate = $scope.service.parseDate(date);
				
				var message = {username: $scope.formUsername, content: $scope.formContent, date: parsedDate};
				$scope.messages.unshift(message);
				offset++;
				
			}).error(function (){

				console.log('Message posting failed.');
			});
		}
	};

	$scope.showButton = function showButton(){

    	return showLoadButton;
    };

}]);

app.controller('ListController', ['$scope', '$http', '$routeParams', 'CommonCode', function($scope, $http, $routeParams, CommonCode) {
	
	var showLoadButton = true;
	var offset = 0;
	var limit = 5;
	$scope.service = CommonCode;
	var hashtag = $routeParams.hashtag;
	var mention = $routeParams.mention;
	var username = $routeParams.username;

	$scope.init = function init() {

		$scope.getNextTweets();
	};

	$scope.getNextTweets = function getMoreTweets() {
		
		var url = 'http://localhost:8080/twitterlite/messages/';
		
		if (hashtag) {
			url = url + 'hashtags/' + hashtag;
		} else if (mention) {
			url = url + 'mention/' + mention;
		} else if (username) {
			url = url + 'user/' + username;
		}

		var promise = CommonCode.retrieveMessages(url, limit, offset);
		promise.success(function(data) {

			// In case of first read, the retrieved data must be copied directly to $scope.messages
			if (!$scope.messages) {

				$scope.messages = data;
			} 
			// Otherwise, the retrieved data may simply be appended.
			else{

				$.each(data, function(key, msg) {
				
					var message = {username: msg.username, content: msg.content, date: msg.date};
					$scope.messages.push(message);
				});
			}			
			
			// Show or hide 'Load More' button as a result of the retrieved data.
			offset += data.length;

			if (data.length === 0 || data.length < limit) {
				
				showLoadButton = false;
			}
		}).error(function(){

			console.log('Filtered message retrieval failed.');
		});
	};

	$scope.showButton = function showButton(){

    	return showLoadButton;
    };
}]);