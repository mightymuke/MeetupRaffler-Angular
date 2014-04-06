'use strict';

// Controller

meetupRafflerControllers.controller('meetups', ['$scope', 'meetupsService', 'authService',
	function($scope, meetupsService, authService) {

		if (!authService.isLoggedIn()) {

		}

		// $scope.meetups = dataMeetups.results;		

		var meetups = meetupsService.getmeetups({
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

meetupRafflerServices.factory('meetupsService', ['$resource',
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