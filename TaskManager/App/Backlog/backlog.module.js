angular.module("taskmanager.backlog", ["ui.router"]);

angular.module("taskmanager.backlog").config([
"$stateProvider",
function (stateProvider) {

    stateProvider
        .state("app.backlog", {
            url: "/backlog",
            abstract: true,
            template: "<ui-view/>"
        });

    stateProvider
        .state("app.backlog.display", {
            url: "/backlog-display",
            templateUrl: "App/Backlog/Views/backlog.html",
            controller: "backlogLoadController",
            controllerAs: "backlogLoadCtrl"
        });
    
}])