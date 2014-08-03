define([
	'angular',
	'ngResource'
], function(angular) {
	'use strict';

	var meetupRafflerServices = angular.module('meetupRafflerServices', ['ngResource']);

	meetupRafflerServices.value('version', '0.1');

	return meetupRafflerServices;

});