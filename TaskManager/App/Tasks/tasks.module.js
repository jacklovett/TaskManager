angular.module("taskmanager.tasks", ["ui.router"]);

angular.module("taskmanager.tasks").config([
"$stateProvider",
function(stateProvider) {

    stateProvider
        .state("app.tasks", {
            url: "/tasks",
            abstract: true,
            template: "<ui-view flex=\"100\"/>"
        });

    stateProvider
        .state("app.tasks.display", {
            url: "/tasks-display",
            templateUrl: "App/Tasks/Views/tasks.html",
            controller: "tasksLoadController",
            controllerAs: "tasksLoadCtrl"
        });
    
    stateProvider
            .state("app.tasks.create", {
                url: "/create",
                templateUrl: "/App/Tasks/Views/tasks.add.task.html",
                controller: "taskCreateController",
                controllerAs: "taskCreateCtrl"
            });
}])