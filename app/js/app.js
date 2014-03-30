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
			.when('/login', {
				templateUrl: 'partials/login.html',
				controller: 'authorisation'
			})
			.when('/meetups', {
				templateUrl: 'partials/meetup-list.html',
				controller: 'meetupList'
			})
			.when('/meetups/:groupId', {
				templateUrl: 'partials/meetup-event.html',
				controller: 'meetupEvent'
			//})
			//.otherwise({
			//	redirectTo: '/'
			});
	}
]);

// this is run after angular is instantiated and bootstrapped
meetupRaffler.run(['$rootScope', '$location', 'authService',
	function($rootScope, $location, authService) {

		// *****
		// Initialize authentication
		// *****
		$rootScope.authService = authService;

		$rootScope.$watch('authService.authorized()', function () {

			// if never logged in, do nothing (otherwise bookmarks fail)
			if ($rootScope.authService.initialState()) {
				// we are public browsing
				return;
			}

			// instantiate and initialize an auth notification manager
			$rootScope.authNotifier = new NotificationManager($rootScope);

			// when user logs in, redirect to home
			if ($rootScope.authService.authorized()) {
				$rootScope.authNotifier.notify('information', 'Successfully logged in!');
			}

			// when user logs out, redirect to home
			if (!$rootScope.authService.authorized()) {
				$rootScope.authNotifier.notify('information', 'Thanks for visiting. You have been signed out.');
			}

		}, true);
	}
]);
