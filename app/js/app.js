define([
	'angular',
	'notificationManager',
	'ngRoute'
], function(angular, NotificationManager) {
	'use strict';

    // Declare app level module which depends on filters, and services
    var meetupRaffler = angular.module('meetupRaffler', [
    	'ngRoute',
    	'meetupRafflerFilters',
		'meetupRafflerServices',
		'meetupRafflerDirectives',
		'meetupRafflerControllers'
    ]);

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
					templateUrl: 'partials/meetups.html',
					controller: 'meetups'
				})
				.when('/meetups/:groupId', {
					templateUrl: 'partials/meetup.html',
					controller: 'meetup'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);

	// Bootstrap
	meetupRaffler.init = function () {
		angular.bootstrap(document, ['meetupRaffler']);
	};

	// This is run after angular is instantiated and bootstrapped
	meetupRaffler.run(['$rootScope', '$location', 'authService', 'configService',
		function($rootScope, $location, authService, configService) {

			$rootScope.configService = configService;

			// Instantiate and initialize a notification manager
			$rootScope.Notifier = new NotificationManager($rootScope);

			// Initialize authentication
			$rootScope.authService = authService;

			$rootScope.$watch('authService.authorized()', function(newValue, oldValue) {

				// if initial run, then no change so do nothing as
				// the listener is always called during the first $digest loop after it was registered
				// https://docs.angularjs.org/api/ng/type/$rootScope.Scope
				if (newValue === oldValue) {
					return;
				}

				// if never logged in, do nothing (otherwise bookmarks fail)
				if ($rootScope.authService.initialState()) {
					// we are public browsing
					return;
				}

				// when user logs in
				if ($rootScope.authService.authorized()) {
					$rootScope.Notifier.notify('information', 'Successfully logged in!');
				}

				// when user logs out
				if (!$rootScope.authService.authorized()) {
					$rootScope.Notifier.notify('information', 'Thanks for visiting. You have been signed out.');
				}

			}, true);
		}
	]);

	return meetupRaffler;
});
