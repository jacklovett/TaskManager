(function (angular) {
    "use strict";

    angular.module("taskmanager.components").directive("preloader", preloader);

    function preloader() {
        return {
            restrict: "A",
            controller: ["$scope", controller]
        };

        function controller($scope) {
            $scope.loading = true;

            return $scope;
        }
    };

    preloader.$inject = [];
})(angular);
