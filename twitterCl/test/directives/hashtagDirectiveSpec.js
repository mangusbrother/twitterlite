'use strict';

describe('Hashtag Directive', function () {
	var contentEl, $scope;

	beforeEach(angular.mock.module('twitterlite.hashtagDirective'));
	beforeEach(angular.mock.inject(function($compile, $rootScope) {
		$scope = $rootScope;
		$scope.message = { username: 'bernice', content: 'testing with @bernice #karma', date: '1405669336594'}
		contentEl = angular.element('<p hashtag=\'{{message.content}}\'></p>');
		$compile(contentEl)($rootScope);
	}));

	it ('should have message.content defined', function() {
		// update 
		$scope.$digest();
		expect(contentEl.attr('hashtag')).toBe('testing with @bernice #karma');
	});

	it ('should contain links for hashtag and mention', function() {

		var contentElChildren = contentEl.children('a');

		// check element with hashtag attribute has 2 children, first one being a mention, second being a hashtag
		expect(contentElChildren.length).toEqual(2);
		expect(contentElChildren[0].className).toEqual('mentions');
		expect(contentElChildren[1].className).toEqual('hashtags');
	});
});