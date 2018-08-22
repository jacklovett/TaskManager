(function (angular) {
    "use strict"; 
    angular.module("taskmanager").controller("appController", appCtrl);

    function appCtrl($scope, $state) {
        var controller = {};

        // return
        return controller;
    }

    appCtrl.$inject = [ "$scope", "$state"];
})(angular);
