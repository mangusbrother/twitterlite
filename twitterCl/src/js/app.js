'use strict';

var app = angular.module('twitterlite', ['ngRoute',
        'ngSanitize',
        'angularMoment',
        'twitterlite.parseFilter',
        'twitterlite.commonCodeService',
        'twitterlite.hashtagDirective',
        'twitterlite.homeController',
        'twitterlite.listController'
    ]);

// Configure routing within the application.

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
        templateUrl: 'tpl/homepage.html',
        controller: 'HomeController'
    
	}).when('/messages/hashtags/:hashtag', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'
 
	}).when('/messages/mention/:mention', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'
		
	}).when('/messages/user/:username', {
        templateUrl: 'tpl/list.html',
        controller: 'ListController'

    }).otherwise({redirectTo:'/'});
}]);

// Configure time settings of angularMoment.
app.constant('angularMomentConfig', {
    preprocess: 'unix',
    timezone: 'Europe/Amsterdam'
});
