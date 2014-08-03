'use strict';

require.config({

	paths: {
		'domReady'      : '../lib/requirejs/domReady',
		'angular'       : '../lib/angular/angular',
		'ngRoute'       : '../lib/angular/angular-route',
		'ngResource'    : '../lib/angular/angular-resource',
		'ngCookies'     : '../lib/angular/angular-cookies',
		'noty'          : '../lib/noty/jquery.noty',
		'notyLayout'    : '../lib/noty/layouts/center',
		'notyTheme'     : '../lib/noty/themes/default',
		'bootstrap'     : '../lib/bootstrap/bootstrap.min',
		'bootstrapDocs' : '../lib/bootstrap/docs.min'
	},

	shim: {
		angular: {
			exports: 'angular'
		},
		ngRoute: {
			deps: ['angular']
		},
		ngResource: {
			deps: ['angular']
		},
		ngCookies: {
			deps: ['angular']
		},
	},

});

require([
	'app',
	'noty',
	'notyLayout',
	'notyTheme',
	'bootstrap',
	'bootstrapDocs',
	'authorisation',
	'filters',
	'directives',
	'home',
	'meetups',
	'meetup'
], function(app) {

	app.init();

});
