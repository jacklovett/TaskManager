(function (angular) {
    "use strict";
angular.module("taskmanager.overview", ["ui.router"]);

    angular.module("taskmanager.overview").config(config);

    function config(stateProvider) {

        stateProvider
            .state("app.overview", {
                url: "/overview",
                abstract: true,
                template: "<ui-view/>"
            });

        stateProvider
            .state("app.overview.personal", {
                url: "/personal-overview",
                templateUrl: "App/Overview/Personal/Views/personal.overview.html"
            });

        stateProvider
            .state("app.overview.team", {
                url: "/team-overview",
                templateUrl: "App/Overview/Team/Views/team.overview.html"
            });
    }

    config.$inject = ["$stateProvider"];

})(angular);