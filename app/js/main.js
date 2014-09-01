'use strict';

require.config({

	paths: {
		"jquery"        : [
							'//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
							'../lib/jquery/jquery-1.11.0.min'
						  ],
		'jquery.cookie' : '../lib/jquery/jquery.cookie',
		'domReady'      : '../lib/requirejs/domReady',
		'text'          : '../lib/requirejs/text',
		'json'          : '../lib/requirejs/json',
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
		'angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'jquery.cookie': {
			deps: ['jquery']
		},
		'ngRoute': {
			deps: ['angular']
		},
		'ngResource': {
			deps: ['angular']
		},
		'ngCookies': {
			deps: ['angular']
		},
		'noty': {
			deps: ['jquery']
		},
		'notyLayout': {
			deps: ['jquery', 'noty']
		},
		'notyTheme': {
			deps: ['jquery', 'noty']
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'bootstrapDocs': {
			deps: ['jquery', 'bootstrap']
		}
	}

});

// require([
//	"../lib/noty/jquery.noty",
 // "../lib/noty/layouts/center",
 //  "../lib/noty/themes/default",
 //   "../lib/bootstrap/bootstrap.min",
 //    "../lib/bootstrap/docs.min",
 //     "../lib/angular/angular",
 //      "../lib/angular/angular-route",
 //       "../lib/angular/angular-cookies",
 //        "../lib/angular/angular-resource",
 //         "authorisation",
 //          "directives",
 //           "filters",
 //            "home",
 //             "meetup",
 //              "meetups",
 //               "data",
 //                "notificationManager"],

require([
	'app',
	'jquery',
	'config',
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
