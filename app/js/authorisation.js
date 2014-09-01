define([
	'meetupRafflerControllers',
	'meetupRafflerServices',
	'jquery.cookie'
], function(meetupRafflerControllers, meetupRafflerServices) {
	'use strict';

	// Authorisation Controller

	meetupRafflerControllers.controller('authorisation', ['$scope', 'authService', '$location', '$window',
		function($scope, authService, $location, $window) {
			var getAuthStuff = function(queryString) {
				var data = {};
				var dataItems = queryString.split('&');
				for (var i in dataItems) {
					var dataItem = dataItems[i].split('=');
					if (dataItem.length !== 2) {
				   		continue;
					}
					data[dataItem[0]] = dataItem[1];
			   }
			   return data;
			}

			$.cookie.json = true;
			var hashFragment = $location.hash();
			var authData = $.cookie('auth');
			if (hashFragment) {
				authData = getAuthStuff($location.hash());
				var now = new Date();
				var time = now.getTime();
				time += authData['expires_in'] * 1000;
				now.setTime(time);
				$.cookie('auth', authData, { expires: now });
				authService.completeLogin(authData['access_token']);
			} else if (!authData) {
				authService.login();
			}

			$location.url('/meetups');
		}
	]);

	// Authorisation Service

	meetupRafflerServices.factory('authService', ['$window',
		function($window) {
			//var currentUser = null;
			var authorized = false;
			var initialState = true;
			var accessToken = null;

			var hydrateCredentials = function(access_token) {
				authorized = true;
				//currentUser = "cool dude"; //name;
				accessToken = access_token;
			}

			var ensureCredentialsHydrated = function() {
				if (!initialState) { return; }
				$.cookie.json = true;
				var authData = $.cookie('auth');
				if (!authData) { return; }
				hydrateCredentials(authData['access_token']);
				initialState = false;
			}

			return {
				initialState: function() {
					return initialState;
				},
				login: function() {
					$window.location.href = "https://secure.meetup.com/oauth2/authorize?client_id=m61ttgfkb90dvso8choqa8sltr&response_type=token&redirect_uri=http%3A%2F%2Flocalhost:8001%2Fapp%2Findex.html%23%2Flogin";
				},
				completeLogin: function(access_token) {
					hydrateCredentials(access_token);
					initialState = false;
				},
				logout: function() {
					$.removeCookie('auth');
					//currentUser = null;
					accessToken = null;
					authorized = false;
				},
				isLoggedIn: function() {
					ensureCredentialsHydrated();
					return authorized;
				},
				//currentUser: function() {
				//	return currentUser;
				//},
				authorized: function() {
					ensureCredentialsHydrated();
					return authorized;
				},
				accessToken: function() {
					ensureCredentialsHydrated();
					return accessToken;
				}
			};
		}
	]);
});
