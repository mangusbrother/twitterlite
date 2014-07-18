'use strict';

angular.module('twitterlite.hashtagDirective', ['twitterlite.parseFilter'])
	.directive('hashtag', ['$filter', function($filter) {
		return {
			restrict: 'A',
			scope:{ hashtag:'@' },
			link: function(scope, element, attr) {

				var parseFilter = $filter('parseTags');
				var output = parseFilter(attr.hashtag, 'hashtag');
				output = parseFilter(output, 'mention');

				element.html(output); 
			}
		};
}]);