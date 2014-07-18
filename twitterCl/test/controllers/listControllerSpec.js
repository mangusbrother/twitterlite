'use strict';

describe('ListController', function() {

	var scope, httpBackend, service, routeParams, listCtrl;

	beforeEach(angular.mock.module('twitterlite.listController'));
	beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http, $routeParams) {
		scope = $rootScope.$new();
		routeParams = {};
		httpBackend = $httpBackend;
	}));

	it ('should get messages by hashtags', inject(function($controller, $http) {

		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages/hashtags/test?limit=5&offset=0').respond([{}, {}, {}]);
		routeParams.hashtag = 'test';
        
		listCtrl = $controller('ListController', {
			$scope: scope, 
			$http: $http,
			$routeParams: routeParams
		});

        scope.getNextTweets();
        httpBackend.flush();
        expect(scope.messages.length).toBe(3);
	}));

	it ('should get messages by mention', inject(function($controller, $http) {

		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages/mention/test?limit=5&offset=0').respond([{}, {}, {}]);
		routeParams.mention = 'test';

		listCtrl = $controller('ListController', {
			$scope: scope, 
			$http: $http,
			$routeParams: routeParams
		});

        scope.getNextTweets();
        httpBackend.flush();
        expect(scope.messages.length).toBe(3);
	}));
});