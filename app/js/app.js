'use strict';

// Declare app level module which depends on filters, and services
var meetupRaffler = angular.module('meetupRaffler', [
	'ngRoute',
	'meetupRafflerFilters',
	'meetupRafflerServices',
	'meetupRafflerDirectives',
	'meetupRafflerControllers'
]);

var meetupRafflerControllers = angular.module('meetupRafflerControllers', ['ngCookies']);

var meetupRafflerServices = angular.module('meetupRafflerServices', ['ngResource']);
meetupRafflerServices.value('version', '0.1');

// Routes

meetupRaffler.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/home.html',
				controller: 'home'
			})
			.when('/meetups', {
				templateUrl: 'partials/meetup-list.html',
				controller: 'meetupList'
			})
			.otherwise({
				redirectTo: '/'
			});
	}
]);