angular.module("taskmanager.calendar", ["ui.router"]);

angular.module("taskmanager.calendar").config([
    "$stateProvider",
    function (stateProvider) {
        stateProvider
            .state("app.calendar", {
                url: "/calendar",
                abstract: true,
                template: "<ui-view/>"
            });

        stateProvider
            .state("app.calendar.display", {
                url: "/calendar-display",
                templateUrl: "App/Calendar/Views/calendar.html",
                controller: "calendarController",
                controllerAs: "calendarCtrl"
            });
    }]);