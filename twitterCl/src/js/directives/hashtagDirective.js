'use strict';

angular.module('twitterlite.hashtagDirective', ['twitterlite.parseFilter'])
	.directive('hashtag', ['$filter', function($filter) {
		return {

			// Matches attribute name.
			restrict: 'A',
			scope:{ hashtag:'@' },
			link: function(scope, element, attr) {

				var parseFilter = $filter('parseTags');

				// Invoke parseFilter to linkify hashtags.
				var msgWithLinkedTags = parseFilter(attr.hashtag, 'hashtag');

				// Invoke parseFilter to linkify mentions.
				var msgWithLinkedTagsAndMentions = parseFilter(msgWithLinkedTags, 'mention');

				element.html(msgWithLinkedTagsAndMentions); 
			}
		};
}]);