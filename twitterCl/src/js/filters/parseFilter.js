'use strict';

angular.module('twitterlite.parseFilter', [])
	.filter('parseTags', function() {
		return function(content, type) {

			/*
			/ Define a covertor object which maps a type to the corresponding 
			/ REGEX expression and replacement pattern.
			*/
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

			// If the given type does no match to any of the defined types, default to 'other'.
			var isValidType = Object.keys(convertors).some(function(value) {
				return value == type;
			});

			if (!isValidType) {
				type = 'other';
			}

			// If the type is undefined, also default to 'other'.
			var convertor = convertors[type || 'other'];

			/*
			/ Carry out the conversion.
			/ If the given content is undefined, default to the empty string.
			*/

			return content ? content.replace(convertor.regex, convertor.pattern) : '';
		};
});