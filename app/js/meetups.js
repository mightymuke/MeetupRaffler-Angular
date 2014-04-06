'use strict';

// Controller

meetupRafflerControllers.controller('meetups', ['$scope', 'meetupsData', 'authService',
	function($scope, meetupsData, authService) {

		if (!authService.isLoggedIn()) {

		}
		
		var meetups = meetupsData.getmeetups({
			memberId: '69467752',
			access_token: authService.accessToken()
		});

		meetups.$promise.then(
			function(event) {
				$scope.meetups = event.results;
			},
			function(response) {
				console.log(response);
			}
		);
	}
]);

// Service

meetupRafflerServices.factory('meetupsData', ['$resource',
	function($resource) {
		var resource = $resource('https://api.meetup.com/2/groups?member_id=:memberId&access_token=:access_token',
			{
				access_token : '@access_token'
			},
			{
		        get: {
		            cache: true
        		}
			});
		return {
			getmeetups: function(options) {
				var meetups = resource.get({
					memberId: options.memberId,
					access_token: options.access_token
				});
				return meetups;
			},
			query: {
				method: 'GET',
				isArray: true
			}
		}
	}
]);