'use strict';

// Controller

meetupRafflerControllers.controller('home', ['$scope',
	function($scope) {
		$scope.edit = function() {
			console.log("edit");
			$scope.isEditing = true;
		};

		$scope.doneEditing = function() {
			console.log("doneEditing");
			$scope.isEditing = false;
		};

		$scope.isEditing = false;
		$scope.title = "Dashboard";
	}]
);

