define([
	'meetupRafflerServices'
], function(meetupRafflerServices) {
	'use strict';

	// Configuration Service

	meetupRafflerServices.factory('configService', ['$window',
		function($window) {

			var useMeetupWebServices = false; // If false will used cached data files

			var userMeetupId = 69467752;      // Users meetup ID

			return {
				useMeetupWebServices: function() {
					return useMeetupWebServices;
				},
				userMeetupId: function() {
					return userMeetupId;
				}
			};
		}
	]);
});
