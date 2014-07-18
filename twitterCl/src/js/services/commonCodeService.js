'use strict';

angular.module('twitterlite.commonCodeService', [])
	.factory('CommonCode', function($http) {
		var root = {};
		
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