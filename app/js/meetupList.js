'use strict';

// Controller

meetupRafflerControllers.controller('meetupList', ['$scope', 'meetupListData', '$location', '$cookieStore',
	function($scope, meetupListData, $location, $cookieStore) {
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

		var hashFragment = $location.hash();
		var authData = $cookieStore.get('auth');
		if (!authData || hashFragment) {
			authData = getAuthStuff($location.hash());
			$cookieStore.put('auth', authData);
		}
		
		var meetupList = meetupListData.getMeetupList({
			memberId: '69467752',
			access_token: authData['access_token']
		});
		meetupList.$promise.then(
			function(event) {
				$scope.meetupList = event.results;
				console.log(event);
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