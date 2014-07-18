'use strict';

angular.module('twitterlite.homeController', ['twitterlite.commonCodeService'])
	.controller('HomeController', ['$scope', '$http', 'CommonCode', function($scope, $http, CommonCode) {

		var offset = 0;
		var limit = 5;
		var showLoadButton = true;
		$scope.service = CommonCode;
		$scope.messages = [];
		$scope.formUsername = '';
		$scope.formContent = '';

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
				else {
					angular.forEach(data, function(msg, key) {
						var message = {username: msg.username, content: msg.content, date: msg.date};
						$scope.messages.push(message);
					});
				}
				// Next time to load more data, start from last message
				offset += data.length;

				// Show or hide 'Load More' button as a result of the retrieved data.
				if (data.length === 0 || data.length < limit) {
					showLoadButton = false;
				}
			}).error(function() {
				console.log('Message retrieval failed.');
			});
		};
		
		$scope.postMessage = function postMessage() {
			$http({
				method: 'POST',
				url:'http://localhost:8080/twitterlite/tweets',
				params: {
					username: $scope.formUsername,
					content: $scope.formContent
				}
			
			}).success(function(data) {	
				var date = new Date().getTime();			
				var message = {username: $scope.formUsername, content: $scope.formContent, date: date};
				$scope.messages.unshift(message);
				offset++;
				
			}).error(function () {
				console.log('Message posting failed.');
			});
		};

		$scope.showButton = function showButton(){
	    	return showLoadButton;
	    };
}]);
