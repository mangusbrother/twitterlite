'use strict';

angular.module('twitterlite.listController', ['ngRoute', 'twitterlite.commonCodeService'])
	.controller('ListController', ['$scope', '$http', '$routeParams', 'CommonCode', function($scope, $http, $routeParams, CommonCode) {
	
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
				url += 'hashtags/' + hashtag;
			} else if (mention) {
				url += 'mention/' + mention;
			} else if (username) {
				url += 'user/' + username;
			}
			var promise = CommonCode.retrieveMessages(url, limit, offset);
			promise.
			// On success, update the message list.
			success(function(data) {

				// In case of first read, the retrieved data must be copied directly to $scope.messages
				if (!$scope.messages) {
					$scope.messages = data;
				} 
				// Otherwise, the retrieved data may simply be appended.
				else {

					angular.forEach(data, function(msg, key) {
						var message = {username: msg.username, content: msg.content, date: msg.date};
						$scope.messages.push(message);
					});
				}			
				// Show or hide 'Load More' button as a result of the retrieved data.
				offset += data.length;

				if (data.length === 0 || data.length < limit) {
					showLoadButton = false;
				}
			})

			// Notify the user upon error.
			.error(function(){
				console.log('Filtered message retrieval failed.');
			});
		};

		// Controls the display of the 'Load More' messages panel.
 		$scope.showButton = function showButton(){
	    	return showLoadButton;
	    };
}]);