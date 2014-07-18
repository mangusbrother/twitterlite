'use strict';

describe('HomeController', function () {

	var scope, service, httpBackend, contentEl;

	beforeEach(angular.mock.module('twitterlite.homeController'));
	beforeEach(angular.mock.inject(function($rootScope, $controller, $httpBackend, $http, $compile) {
		scope = $rootScope.$new();
		$controller('HomeController', {
			$scope: scope, 
			$http: $http,
		});
		httpBackend = $httpBackend;
	}));

	// comparing messages.length when calling API with GET
	it('should get a list of messages', function() {
		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages?limit=5&offset=0').respond([{}, {}, {}]);
        scope.getNextTweets();
        httpBackend.flush();
        expect(scope.messages.length).toBe(3);
	});

	it ('should initialize messages array to empty', function() {

		expect(scope.messages.length).toBe(0);
	});

	it ('should initialize username to empty', function() {

		expect(scope.formUsername).toBe('');
	});

	it ('should initialize content to empty', function() {

		expect(scope.formContent).toBe('');
	});

	it ('should not post on bad request', function() {
			var data = { username: 'test', content: 'testing' };
			httpBackend.when('POST', 'http://localhost:8080/twitterlite/tweets?content=testing&username=test').respond(401, {});
			
			scope.formUsername = 'test';
			scope.formContent = 'testing';
			
			scope.postMessage();
			httpBackend.flush();
			expect(scope.messages.length).toBe(0);
		});

	it('should post a message', function() {
		var data = { username: 'test', content: 'testing' };
		httpBackend.when('POST', 'http://localhost:8080/twitterlite/tweets?content=testing&username=test').respond(200, {});

		scope.formUsername = 'test';
		scope.formContent = 'testing';

		scope.postMessage();
		httpBackend.flush();
		expect(scope.messages.length).toBe(1);
	});

	it ('should hide \'Load More\' button if no messages are received', inject(function($controller, $http) {

		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages?limit=5&offset=0').respond([{}]);
        scope.getNextTweets();
        httpBackend.flush();

        expect(scope.showButton()).toBe(false);
	}));

	it ('should hide \'Load More\' button if returned messages < limit', inject(function($controller, $http) {

		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages?limit=5&offset=0').respond([{}, {}]);
        scope.getNextTweets();
        httpBackend.flush();

        expect(scope.showButton()).toBe(false);
	}));

	it ('should show \'Load More\' button', inject(function($controller, $http) {

		httpBackend.when('GET', 'http://localhost:8080/twitterlite/messages?limit=5&offset=0').respond([{}, {}, {}, {}, {}]);
        scope.getNextTweets();
        httpBackend.flush();

        expect(scope.showButton()).toBe(true);
	}));

	it ('should show \'Load More\' button on init', inject(function($controller, $http) {
		
        expect(scope.showButton()).toBe(true);
	}));
});