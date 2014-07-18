'use strict';

describe('RouteProvider', function() {
	
	var scope, route, location;

	beforeEach(angular.mock.module('twitterlite'));
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

	describe('Invalid Route', function() {
		beforeEach(angular.mock.inject(function($httpBackend) {
			$httpBackend.expectGET('tpl/homepage.html').respond(200);
		}));

		it ('should load the Home Controller on /', function() {
			location.path('/bernice/pass');
			scope.$digest();
			expect(route.current.controller).toBe('HomeController');
		});
	});
});