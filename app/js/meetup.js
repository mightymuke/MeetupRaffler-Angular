define([
	'meetupRafflerControllers',
	'meetupRafflerServices'
], function(meetupRafflerControllers, meetupRafflerServices) {
	'use strict';

	// Controller

	meetupRafflerControllers.controller('meetup', ['$scope', '$rootScope', '$route', 'meetupEventService', 'meetupEventRsvpsService', 'authService',
		function($scope, $rootScope, $route, meetupEventService, meetupEventRsvpsService, authService) {
			$scope.getRandomMember = function() {
				var min = 0;
				var max = $scope.rsvps.length - 1;
				var selectedPrize = $("#prize option:selected");
				var selectedPrizeText = selectedPrize.text().trim();
				var selectedPrizeValue = selectedPrize.val();
				if (selectedPrizeText !== "") {

					var memberFound = false;
					var count = 0;
					while (!memberFound && count < 5) {
						var memberIndex = Math.floor(Math.random() * (max - min + 1)) + min;
						var member = $scope.rsvps[memberIndex].member;
						memberFound = memberIsValidForPrize(member.member_id, selectedPrizeValue);
						count += 1;
					}

					if (count < 5) {
						$rootScope.authNotifier.notify('success', 'Congratulations<br/>' + member.name + ' has won a ' + selectedPrizeText + '!');
					} else {
						$rootScope.authNotifier.notify('error', 'Unable to find a winner');
					}

				} else {
					$rootScope.authNotifier.notify('error', 'Please select a prize you silly billy!');
				}
			}

			var memberIsValidForPrize = function(member_id, prize) {
				console.log('checking ' + member_id + " for " + prize);
				// Marcus Bristol - Organiser - 69467752
				// David Teirney - Pluralsight monthly subscription - 4067396
				// Kalman Bekesi - JetBrains license (IntellJ IDEA) - 4388211
				// Mathew Peachey - JetBrains license (PyCharm) - 138673112

				var prizesAlreadyWon = [];
			prizesAlreadyWon["apress"] = [69467752];
			prizesAlreadyWon["pluralsight"] = [69467752, 4067396];
			prizesAlreadyWon["jetbrains"] = [69467752, 4388211, 138673112];

				return $.inArray(member_id, prizesAlreadyWon[prize]) < 0;
			}

			var explodeTheGuests = function(rsvps) {
				var guests = rsvps.filter(function(rsvp) {
					return rsvp.guests > 0;
				});

				guests.forEach(function(rsvp) {
					for (var guest = 0; guest < rsvp.guests; guest++) {
						rsvps.push({
							member: {
								name: rsvp.member.name + ' (Guest #' + (guest + 1) + ')',
								member_id: rsvp.member_id
							},
							group: rsvp.group,
							rsvp_id: rsvp.rsvp_id
						});
					}
				});

				return rsvps;
			}

			var groupId = $route.current.params['groupId'];

		// $scope.meetup = dataMeetup.results[0];
		// $scope.rsvps = explodeTheGuests(dataMeetupRsvps.results);

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
							$scope.rsvps = explodeTheGuests(eventRsvps.results);
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
			var resource = $resource('https://api.meetup.com/2/events?&status=upcoming&limited_events=true&page=1&group_id=:group_id&access_token=:access_token',
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
