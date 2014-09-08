define([
	'app',
	'meetupRafflerControllers',
	'meetupRafflerServices',
	'json!../data/winners.json',
	'meetupHelpers'
], function(app, meetupRafflerControllers, meetupRafflerServices, previousWinners) {
	'use strict';

	// Controller

	meetupRafflerControllers.controller('meetup', ['$scope', '$rootScope', '$route', 'meetupEventService', 'meetupEventRsvpsService', 'authService', 'configService',
		function($scope, $rootScope, $route, meetupEventService, meetupEventRsvpsService, authService, configService) {

			if (!authService.isLoggedIn()) {

			}

			$scope.getRandomMember = function() {
				app.getRandomMember($rootScope, $scope, previousWinners);
			}

			$scope.resetMemberTiles = function() {
				app.clearWinner();
				$scope.isSelectingPrizeWinner = false;
			}

			$scope.isSelectingPrizeWinner = false;

			var groupId = $route.current.params['groupId'];

			if (!configService.useMeetupWebServices()) {
				require([
					"json!../data/meetup.json",
					"json!../data/rsvps.json"
				], function(dataMeetup, dataMeetupRsvps) {
					$scope.$apply(function() {
						$scope.meetup = dataMeetup.results[0];
						$scope.rsvps = app.explodeTheGuests(dataMeetupRsvps.results);
					});
				});
			} else {
				var meetup = meetupEventService.getmeetup({
					group_id: groupId,
					access_token: authService.accessToken()
				});

				meetup.$promise
					.then(
						function(event) {
							$scope.meetup = event.results[0];

							var rsvps = meetupEventRsvpsService.getEventRsvps({
								event_id: $scope.meetup.id,
								access_token: authService.accessToken()
							});

							return rsvps.$promise;
						},
						function(response) {
							console.log(response);
						})
					.then(
						function(eventRsvps) {
							$scope.rsvps = app.explodeTheGuests(eventRsvps.results);
						},
						function(response) {
							console.log(response);
						});
			}
		}
	]);

	// Service

	meetupRafflerServices.factory('meetupEventService', ['$resource',
		function($resource) {
			// TODO - do we need to handle previous meetups too
			var resource = $resource('https://api.meetup.com/2/events?&status=upcoming,past&limited_events=true&page=1&desc=true&group_id=:group_id&access_token=:access_token',
				{
					access_token : '@access_token'
				},
				{
					get: {
						cache: true
					}
				});
			return {
				getmeetup: function(options) {
					var meetup = resource.get({
						group_id: options.group_id,
						access_token: options.access_token
					});
					return meetup;
				}
			}
		}
	]);

	meetupRafflerServices.factory('meetupEventRsvpsService', ['$resource',
		function($resource) {
			var resource = $resource('https://api.meetup.com/2/rsvps?&rsvp=yes&event_id=:event_id&access_token=:access_token',
				{
					access_token : '@access_token'
				},
				{
					get: {
						cache: true
					}
				});
			return {
				getEventRsvps: function(options) {
					var meetupRsvps = resource.get({
						event_id: options.event_id,
						access_token: options.access_token
					});
					return meetupRsvps;
				}
			}
		}
	]);
});
