(function (angular) {
    "use strict";
    angular.module("taskmanager.projects", ["ui.router"]);

    angular.module("taskmanager.projects").config(config);

    function config(stateProvider) {

        stateProvider
            .state("app.projects", {
                url: "/projects",
                abstract: true,
                template: "<ui-view flex=\"100\"/>"
            });

        stateProvider
            .state("app.projects.display", {
                url: "/projects-display",
                templateUrl: "App/Projects/Views/projects.html",
                controller: "projectsLoadController",
                controllerAs: "projectsLoadCtrl"
            });

        stateProvider
            .state("app.projects.create", {
                url: "/create",
                templateUrl: "/App/Projects/Views/projects.add.project.html",
                controller: "projectCreateController",
                controllerAs: "projectCreateCtrl"
            });

    }

    config.$inject = ["$stateProvider"];

})(angular);