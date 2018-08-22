//(function (angular) {
//    "use strict";
//    angular.module("taskmanager.authentication", ["ui.router"]);

//    angular.module("taskmanager.authentication").config(config);

//    function config(stateProvider) {
//        stateProvider
//            .state("authentication", {
//                url: "/authentication",
//                abstract: true,
//                template: "<ui-view/>"
//            });

//        stateProvider
//                .state("authentication.login", {
//                    url: "/login",
//                    templateUrl: "/App/Authentication/Views/authentication.login.html",
//                    controller: "loginController",
//                    controllerAs: "loginCtrl"
//                });
//    }

//    config.$inject = ["$stateProvider"];
//})(angular);