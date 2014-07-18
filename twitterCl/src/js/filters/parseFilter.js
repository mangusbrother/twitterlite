'use strict';

angular.module('twitterlite.parseFilter', [])
	.filter('parseTags', function() {
		return function(content, type) {
			var convertors = {
				hashtag : {
					regex : /#([a-zA-Z0-9]+)/g,
					pattern : '<a class=\'hashtags\' href=\'#/messages/hashtags/$1\'>#$1</a>'
				},
				mention : {
					regex : /@([a-zA-Z0-9]+)/g,
					pattern : '<a class=\'mentions\' href=\'#/messages/mention/$1\'>@$1</a>'
				},
				other : {
					regex : /(.*)/g,
					pattern : '$1'
				}
			};

			var checkType = Object.keys(convertors).some(function(value) {
				return value == type;
			});

			type = checkType ? type : 'other';
			var convertor = convertors[type || 'other'];

			if (content) return content.replace(convertor.regex, convertor.pattern);
			else return '';
		};
});