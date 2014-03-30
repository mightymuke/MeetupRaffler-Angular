'use strict';

// Controller

meetupRafflerControllers.controller('meetupEvent', ['$scope', '$rootScope', '$route', 'meetupEventData', 'meetupEventRsvps', 'authService',
	function($scope, $rootScope, $route, meetupEventData, meetupEventRsvps, authService) {
		$scope.getRandomMember = function() {
			var min = 0;
			var max = $scope.rsvps.length - 1;
			var memberIndex = Math.floor(Math.random() * (max - min + 1)) + min;
			var memberName = $scope.rsvps[memberIndex].member.name;
			$rootScope.authNotifier.notify('success', 'Member ' + memberName + " has won!");
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
						rsvp_id: rsvp.rsvp_id
					});
				}
			});

			return rsvps;
		}

		var groupId = $route.current.params['groupId'];

		var meetup = meetupEventData.getMeetupEvent({
			group_id: groupId,
			access_token: authService.accessToken()
		});


		meetup.$promise
			.then(
				function(event) {
					$scope.meetupEvent = event.results[0];

					var rsvps = meetupEventRsvps.getEventRsvps({
						event_id: $scope.meetupEvent.id,
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
]);

// Service

meetupRafflerServices.factory('meetupEventData', ['$resource',
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
			getMeetupEvent: function(options) {
				var meetupEvent = resource.get({
					group_id: options.group_id,
					access_token: options.access_token
				});
				return meetupEvent;
			}
		}
	}
]);

meetupRafflerServices.factory('meetupEventRsvps', ['$resource',
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
