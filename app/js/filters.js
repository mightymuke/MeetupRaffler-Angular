'use strict';

angular.module('meetupRafflerFilters', []).
	filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		}
	}
]);
