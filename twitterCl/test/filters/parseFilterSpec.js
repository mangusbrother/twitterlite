'use strict';

describe('ParseFilter', function () {

	var $filter;

	beforeEach(angular.mock.module('twitterlite.parseFilter'));
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

  	it('should not linkify \'other\' messages', function () {
    	
    	var message = '#fun at @ixaris';
    	var filteredString = $filter('parseTags')(message, 'bernice');

    	expect(filteredString).toEqual('#fun at @ixaris');
  	});
});