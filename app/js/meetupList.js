'use strict';

// Controller

meetupRafflerControllers.controller('meetupList', ['$scope', 'meetupListData', 'authService',
	function($scope, meetupListData, authService) {

		if (!authService.isLoggedIn()) {

		}
		var meetupList = meetupListData.getMeetupList({
			memberId: '69467752',
			access_token: authService.accessToken()
		});
		meetupList.$promise.then(
			function(event) {
				$scope.meetupList = event.results;
			},
			function(response) {
				console.log(response);
			}
		);
	}
]);

// Service

meetupRafflerServices.factory('meetupListData', ['$resource',
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
			getMeetupList: function(options) {
				var meetupList = resource.get({
					memberId: options.memberId,
					access_token: options.access_token
				});
				return meetupList;
			},
			query: {
				method: 'GET',
				isArray: true
			}
		}
	}
]);