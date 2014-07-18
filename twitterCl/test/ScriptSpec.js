'use strict';
describe('twitterlite', function() { 
	
	beforeEach(angular.mock.module('twitterlite'));

	describe('HomeController', function () {
		var scope, service, httpBackend, contentEl;

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
	
	describe('ParseFilter', function () {

		var $filter;

	  	beforeEach(function () {

	    	inject(function(_$filter_) {
	      		$filter = _$filter_;
	    	});
	  	});

	  	it('should linkify single hashtags', function () {
	    	
	    	var message = 'my #test';
	    	var filteredString = $filter('parseTags')(message, 'hashtag');

	    	// Assert.
	    	expect(filteredString).toEqual('my <a class=\'hashtags\' href=\'#/messages/hashtags/test\'>#test</a>');
	  	});

	  	it ('should linkify multiple hashtags', function() {

	  		var message = '#can we #test it?';
	    	var filteredString = $filter('parseTags')(message, 'hashtag');

	    	expect(filteredString).toEqual('<a class=\'hashtags\' href=\'#/messages/hashtags/can\'>#can</a> we <a class=\'hashtags\' href=\'#/messages/hashtags/test\'>#test</a> it?');
	  	});

	  	it ('should linkify joined hashtags', function() {

	  		var message = 'testing #two#hashes';
	    	var filteredString = $filter('parseTags')(message, 'hashtag');

	    	expect(filteredString).toEqual( 'testing <a class=\'hashtags\' href=\'#/messages/hashtags/two\'>#two</a><a class=\'hashtags\' href=\'#/messages/hashtags/hashes\'>#hashes</a>');
	  	});

	  	it('should linkify single mentions', function () {
	    	
	    	var message = 'Testing with @kurt';
	    	var filteredString = $filter('parseTags')(message, 'mention');
	    	
	    	expect(filteredString).toEqual('Testing with <a class=\'mentions\' href=\'#/messages/mention/kurt\'>@kurt</a>');
	  	});

	  	it('should linkify multiple mentions', function () {
	    	
	    	var message = 'Testing with @kurt and @sarah';
	    	var filteredString = $filter('parseTags')(message, 'mention');
	    	
	    	expect(filteredString).toEqual('Testing with <a class=\'mentions\' href=\'#/messages/mention/kurt\'>@kurt</a> and <a class=\'mentions\' href=\'#/messages/mention/sarah\'>@sarah</a>');
	  	});

	  	it('should linkify joined mentions', function () {
	    	
	    	var message = 'Testing with @kurt@sarah@jean';
	    	var filteredString = $filter('parseTags')(message, 'mention');
	    	
	    	expect(filteredString).toEqual('Testing with <a class=\'mentions\' href=\'#/messages/mention/kurt\'>@kurt</a><a class=\'mentions\' href=\'#/messages/mention/sarah\'>@sarah</a><a class=\'mentions\' href=\'#/messages/mention/jean\'>@jean</a>');
	  	});

	  	it('should not linkify \'other\' messages', function () {
	    	
	    	var message = '#fun at @ixaris';
	    	var filteredString = $filter('parseTags')(message, 'other');

	    	expect(filteredString).toEqual('#fun at @ixaris');
	  	});
	});

	describe('Hashtag Directive', function () {
		var contentEl, $scope;

		beforeEach(angular.mock.inject(function($compile, $rootScope) {
			$scope = $rootScope;
			$scope.message = { username: 'bernice', content: 'testing with @bernice #karma', date: '1405669336594'}
			contentEl = angular.element('<p hashtag=\'{{message.content}}\'></p>');
			$compile(contentEl)($rootScope);
		}));

		it ('should have message.content defined', function() {
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

	describe('RouteProvider', function() {

		var scope, route, location;

		beforeEach(angular.mock.inject(function($location, $route, $rootScope) {
			location = $location;
			route = $route;
			scope = $rootScope;
		}));

		describe('Basic Route', function() {
			beforeEach(angular.mock.inject(function($httpBackend) {
				$httpBackend.expectGET('tpl/homepage.html').respond(200);
			}));

			it ('should load the Home Controller on /', function() {
				location.path('/');
				scope.$digest();
				expect(route.current.controller).toBe('HomeController');
			});
		});

		describe('Hashtag Route', function() {
			beforeEach(angular.mock.inject(function($httpBackend) {
				$httpBackend.expectGET('tpl/list.html').respond(200);
			}));

			it ('should load the List Controller on /messages/hashtags/:hashtag', function() {
				location.path('/messages/hashtags/test');
				scope.$digest();
				expect(route.current.controller).toBe('ListController');
			});
		});

		describe('Mention Route', function() {
			beforeEach(angular.mock.inject(function($httpBackend) {
				$httpBackend.expectGET('tpl/list.html').respond(200);
			}));

			it ('should load the List Controller on /messages/mention/:mention', function() {
				location.path("/messages/mention/test");
				scope.$digest();
				expect(route.current.controller).toBe('ListController');
			});
		});

		describe('List Route', function() {
			beforeEach(angular.mock.inject(function($httpBackend) {
				$httpBackend.expectGET('tpl/list.html').respond(200);
			}));

			it ('should load the List Controller on /messages/user/:username', function() {
				location.path("/messages/user/test");
				scope.$digest();
				expect(route.current.controller).toBe('ListController');
			});
		});
	});

	describe('ListController', function() {

		var scope, httpBackend, service, routeParams, listCtrl;

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
});
