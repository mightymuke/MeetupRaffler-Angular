define([
	'angular'
], function(angular) {
	'use strict';

	return angular.module('meetupRafflerDirectives', [])

		.directive('appVersion', ['version', function(version) {
			return function(scope, element, attrs) {
				element.text(version);
			};
		}])

		.directive('matchRoute', ['$location', function($location) {
			return {
				restrict: 'A',

				link: function(scope, element, attrs, controller) {
					// Watch for the $location
					scope.$watch(function() {
						return $location.path();
					}, function(newValue, oldValue) {
						var activeClass = attrs.activeClass;
						if (!activeClass) {
							activeClass = 'active';
						}
						var pattern = attrs.matchRoute;
						var regexp = new RegExp('^' + pattern + '$', ['i']);
						if (regexp.test(newValue)) {
							element.addClass(activeClass);
						} else {
							element.removeClass(activeClass);
						}
      				});
    			}
			};
		}])

		.directive('noty', function() {
			return {
				restrict:'A',

				link: function (scope, element, attrs) {

					// set notification (noty) defaults on global scope
					var opts = {
						layout: 'center',
						theme: 'defaultTheme',
						dismissQueue: true, // If you want to use queue feature set this true
						template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
						animation: {
							open: {height: 'toggle'},
							close: {height: 'toggle'},
							easing: 'swing',
							speed: 250 // opening & closing animation speed
						},
						timeout: false, // delay for closing event. Set false for sticky notifications
						force: false, // adds notification to the beginning of queue when set to true
						modal: false,
						maxVisible: 5, // you can set max visible notification for dismissQueue true option
						closeWith: ['click'], // ['click', 'button', 'hover']
						callback: {
							onShow: function() {},
							afterShow: function() {},
							onClose: function() {},
							afterClose: function() {}
						},
						buttons: false // an array of buttons
					};

					var index = scope.$index;
					if (typeof(index) !== 'undefined' && scope.notifications && scope.notifications[index] && !scope.notifications[index]['processed']) {
						var notification = scope.notifications[index];
						var text = notification['text'];
						var type = notification['type'];

						opts.text = text;
						opts.type = type;

						// errors persist on screen longer
						if (type == 'error') {
							opts.timeout = 55000;
						}

						notification['processed'] = true;

						noty(opts);
					}
				}
			}
		});
});