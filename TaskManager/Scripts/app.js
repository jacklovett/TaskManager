"use strict";

angular.module("taskmanager.components", ["ng"]);
"use strict";

(function () {
    angular.module("taskmanager.components").directive("subMenuTrigger", subMenuTrigger);

    function subMenuTrigger() {
        return {
            restrict: "A",
            link: function link(scope, elm, attrs) {

                var element = $(elm);
                var parent = element.parent("li");

                //parent.removeClass("open");

                element.click(function (e) {
                    e.preventDefault();

                    $("nav[role=navigation] li a[sub-menu-trigger]").not(element).parent("li").children("ul.sub-menu").slideUp();
                    $("nav[role=navigation] li").not(parent).removeClass("open");

                    parent.children("ul.sub-menu").slideToggle();
                    parent.toggleClass("open");
                });
            }
        };
    }
})();
"use strict";

angular.module("taskmanager.config", ["ng"]);

angular.module("taskmanager.config").factory("apiConfigFactory", [function () {
    return {
        projects: { path: window.location.protocol + "//localhost:57739/api" },
        system: { path: window.location.protocol + "//localhost:55362/api" },
        tasks: { path: window.location.protocol + "//localhost:57765/api" }
    };
}]);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.authentication", ["ui.router"]);
    angular.module("taskmanager.authentication").config(config);

    function config(stateProvider) {
        stateProvider.state("authentication", {
            abstract: true,
            url: "/authentication",
            template: "<ui-view/>"
        });

        stateProvider.state("authentication.login", {
            url: "/login",
            templateUrl: "/App/Authentication/Views/authentication.login.html",
            controller: "loginController",
            controllerAs: "loginCtrl"
        });
    }

    config.$inject = ["$stateProvider"];
})(angular);
"use strict";

(function (angular) {

    "use strict";

    angular.module("taskmanager.authentication").controller("loginController", loginCtrl);

    function loginCtrl($state, $scope, $location) {

        var controller = {};

        return controller;
    }

    loginCtrl.$inject = ["$state", "$scope", "$location"];
})(angular);
"use strict";

angular.module("taskmanager.projects", ["ui.router"]);

angular.module("taskmanager.projects").config(["$stateProvider", function (stateProvider) {
    stateProvider.state("app.projects", {
        url: "/projects",
        abstract: true,
        template: "<ui-view flex=\"100\"/>"
    });

    stateProvider.state("app.projects.display", {
        url: "/projects-display",
        templateUrl: "App/Projects/Views/projects.html",
        controller: "projectsLoadController",
        controllerAs: "projectsLoadCtrl"
    });

    stateProvider.state("app.projects.create", {
        url: "/create",
        templateUrl: "/App/Projects/Views/projects.add.project.html",
        controller: "projectsCreateController",
        controllerAs: "projectsCreateCtrl"
    });
}]);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").controller("projectOverviewController", projectOverviewCtrl);

    function projectOverviewCtrl($scope, $state, $stateParams, $q, $filter, $mdDialog, projectsFactory) {

        var controller = {};
        controller.projects = [];

        //method exposure
        controller.load = load;
        controller.openDialog = openDialog;

        // initialise data
        load();

        return controller;

        /**
         * @description open the dialog
         * @returns {} 
         */
        function openDialog() {
            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: 'App/Projects/Views/projects.add.project.html',
                clickOutsideToClose: true,
                controller: "projectsCreateController"
            });
        }

        /**
         * @description retrieve a list of projects from the server
         * @param {} resetPagination 
         * @returns {} projects
         */
        function load() {
            clear();
            projectsFactory.getProjects().then(processProjects);
        }

        function processProjects(projects) {
            controller.projects = projects.data;
            console.log(controller.projects[0].isActive);
        }

        /**
         * @description clear the existing collection ready to load projects
         * @returns {} 
         */
        function clear() {
            controller.projects = [];
        };
    }

    projectOverviewCtrl.$inject = ["$scope", "$state", "$stateParams", "$q", "$filter", "$mdDialog", "projectsFactory"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").controller("projectsCreateController", projectsCreateCtrl);
    function projectsCreateCtrl($scope, $state, $mdDialog, projectsFactory) {
        var controller = $scope;
        controller.project = {};

        // method exposure
        controller.save = save;
        controller.cancel = cancel;
        controller.close = close;

        return controller;

        function goBack() {
            $state.go("app.projects.display");
        }

        function saveHandled() {
            projectsFactory.upload(controller.project).then(resolve).catch(errorHandler);
        }

        // dialog methods
        function save() {
            saveHandled();
            controller.close();
        };

        function cancel() {
            $mdDialog.cancel();
        };

        function close() {
            $mdDialog.hide();
        };

        function resolve() {
            goBack();
        }

        function errorHandler(error) {
            console.log(error);
        }
    }
    projectsCreateCtrl.$inject = ["$scope", "$state", "$mdDialog", "projectsFactory"];
})(angular);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").controller("projectsLoadController", projectsLoadCtrl);

    function projectsLoadCtrl($scope, $state, $stateParams, $q, $filter, $mdDialog, projectsFactory) {

        var controller = {};
        controller.projects = [];

        //method exposure
        controller.load = load;
        controller.openDialog = openDialog;

        // initialise data
        load();

        return controller;

        /**
         * @description open the dialog
         * @returns {} 
         */
        function openDialog() {
            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: 'App/Projects/Views/projects.add.project.html',
                controller: "projectsCreateController",
                clickOutsideToClose: true,
                fullscreen: !0 // Only for -xs, -sm
            });
        }

        /**
         * @description retrieve a list of projects from the server
         * @param {} resetPagination 
         * @returns {} projects
         */
        function load() {
            clear();
            projectsFactory.getProjects().then(processProjects);
        }

        function processProjects(projects) {

            if (_typeof(projects.data) === "object") {
                controller.projects = projects.data[0];
            }

            controller.projects = projects.data;
        }

        /**
         * @description clear the existing collection ready to load projects
         * @returns {} 
         */
        function clear() {
            controller.projects = [];
        };
    }

    projectsLoadCtrl.$inject = ["$scope", "$state", "$stateParams", "$q", "$filter", "$mdDialog", "projectsFactory"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").factory("projectsFactory", projectsFactory);

    function projectsFactory($http, $q, $cookies, $httpAbortable, config) {
        var settings = {
            apiUrl: config.projects.path
        };

        return {
            upload: upload,
            getProjects: getProjects
        };

        function upload(model) {
            return typeof model.projectId === "undefined" ? create(model) : update(model);
        }

        /**
         * @description create a project
         * @param {} model 
         * @returns {} 
         */
        function create(model) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/create/project",
                data: $.param(model)
            }).then(resolve).catch(errorHandler);
        }

        /**
         * @description update project details
         * @param {} model 
         * @returns {} 
         */
        function update(model) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/update/project",
                data: $.param(model)
            }).then(resolve).catch(errorHandler);
        }

        /**
         * @description retrieve projects
         * @returns {promise} 
         */
        function getProjects() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/projects"
            }).then(resolve).catch(errorHandler);
        }

        function resolve(response) {
            return response;
        }

        function errorHandler(error) {
            console.log("Error handler caught exception: " + error);
        }
    }

    projectsFactory.$inject = ["$http", "$q", "$cookies", "$httpAbortable", "apiConfigFactory"];
})(angular);
"use strict";

angular.module("taskmanager.tasks", ["ui.router"]);

angular.module("taskmanager.tasks").config(["$stateProvider", function (stateProvider) {

    stateProvider.state("app.tasks", {
        url: "/tasks",
        abstract: true,
        template: "<ui-view/>"
    });

    stateProvider.state("app.tasks.personal", {
        url: "/personal-tasks",
        templateUrl: "App/Tasks/Personal/Views/personal.tasks.html"
    });

    stateProvider.state("app.tasks.team", {
        url: "/team-tasks",
        templateUrl: "App/Tasks/Team/Views/team.tasks.html"
    });
}]);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.overview", ["ui.router"]);

    angular.module("taskmanager.overview").config(config);

    function config(stateProvider) {

        stateProvider.state("app.overview", {
            url: "/overview",
            abstract: true,
            template: "<ui-view/>"
        });

        stateProvider.state("app.overview.personal", {
            url: "/personal-overview",
            templateUrl: "App/Overview/Personal/Views/personal.overview.html"
        });

        stateProvider.state("app.overview.team", {
            url: "/team-overview",
            templateUrl: "App/Overview/Team/Views/team.overview.html"
        });
    }

    config.$inject = ["$stateProvider"];
})(angular);
"use strict";

angular.module("taskmanager.backlog", ["ui.router"]);

angular.module("taskmanager.backlog").config(["$stateProvider", function (stateProvider) {

    stateProvider.state("app.backlog", {
        url: "/backlog",
        abstract: true,
        template: "<ui-view/>"
    });

    stateProvider.state("app.backlog.personal", {
        url: "/personal-backlog",
        templateUrl: "App/Backlog/Personal/Views/personal.backlog.html"
    });

    stateProvider.state("app.backlog.team", {
        url: "/team-backlog",
        templateUrl: "App/Backlog/Team/Views/team.backlog.html"
    });
}]);
"use strict";

angular.module("taskmanager.calendar", ["ui.router"]);

angular.module("taskmanager.calendar").config(["$stateProvider", function (stateProvider) {
    stateProvider.state("app.calendar", {
        url: "/calendar",
        abstract: true,
        template: "<ui-view/>"
    });

    stateProvider.state("app.calendar.display", {
        url: "/calendar-display",
        templateUrl: "App/Calendar/Views/calendar.html",
        controller: "calendarController",
        controllerAs: "calendarCtrl"
    });
}]);
"use strict";

(function () {
    angular.module("taskmanager.calendar").controller("calendarController", ["$scope", "$state", function ($scope, $state) {
        var controller = {};
    }]);
})();
"use strict";

angular.module("taskmanager.team", ["ui.router"]);

angular.module("taskmanager.team").config(["$stateProvider", function (stateProvider) {
    stateProvider.state("app.team", {
        url: "/team",
        abstract: true,
        template: "<ui-view/>"
    });

    stateProvider.state("app.team.backlog", {
        url: "/backlog",
        templateUrl: "App/Team/Backlog/Views/team.backlog.html"
    });

    stateProvider.state("app.team.overview", {
        url: "/overview",
        templateUrl: "App/Team/Overview/Views/team.overview.html"
    });

    stateProvider.state("app.team.tasks", {
        url: "/active-tasks",
        templateUrl: "App/Team/ActiveTasks/Views/team.active.tasks.html"
    });
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMubW9kdWxlLmpzIiwiRGlyZWN0aXZlcy9zdWItbWVudS5kaXJlY3RpdmUuanMiLCJhcHAuY29uZmlnLmpzIiwiYXV0aGVudGljYXRpb24ubW9kdWxlLmpzIiwiQ29udHJvbGxlcnMvYXV0aGVudGljYXRpb24ubG9naW4uY29udHJvbGxlci5qcyIsInByb2plY3RzLm1vZHVsZS5qcyIsIkNvbnRyb2xsZXJzL3Byb2plY3Qub3ZlcnZpZXcuY29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL3Byb2plY3RzLmNyZWF0ZS5jb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvcHJvamVjdHMubG9hZC5jb250cm9sbGVyLmpzIiwiRmFjdG9yaWVzL3Byb2plY3RzLmZhY3RvcnkuanMiLCJ0YXNrcy5tb2R1bGUuanMiLCJvdmVydmlldy5tb2R1bGUuanMiLCJiYWNrbG9nLm1vZHVsZS5qcyIsImNhbGVuZGFyLm1vZHVsZS5qcyIsIkNvbnRyb2xsZXJzL2NhbGVuZGFyLmNvbnRyb2xsZXIuanMiLCJ0ZWFtLm1vZHVsZS5qcyJdLCJuYW1lcyI6WyJhbmd1bGFyIiwibW9kdWxlIiwiZGlyZWN0aXZlIiwic3ViTWVudVRyaWdnZXIiLCJyZXN0cmljdCIsImxpbmsiLCJzY29wZSIsImVsbSIsImF0dHJzIiwiZWxlbWVudCIsIiQiLCJwYXJlbnQiLCJjbGljayIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm5vdCIsImNoaWxkcmVuIiwic2xpZGVVcCIsInJlbW92ZUNsYXNzIiwic2xpZGVUb2dnbGUiLCJ0b2dnbGVDbGFzcyIsImZhY3RvcnkiLCJwcm9qZWN0cyIsInBhdGgiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInByb3RvY29sIiwic3lzdGVtIiwidGFza3MiLCJjb25maWciLCJzdGF0ZVByb3ZpZGVyIiwic3RhdGUiLCJhYnN0cmFjdCIsInVybCIsInRlbXBsYXRlIiwidGVtcGxhdGVVcmwiLCJjb250cm9sbGVyIiwiY29udHJvbGxlckFzIiwiJGluamVjdCIsImxvZ2luQ3RybCIsIiRzdGF0ZSIsIiRzY29wZSIsIiRsb2NhdGlvbiIsInByb2plY3RPdmVydmlld0N0cmwiLCIkc3RhdGVQYXJhbXMiLCIkcSIsIiRmaWx0ZXIiLCIkbWREaWFsb2ciLCJwcm9qZWN0c0ZhY3RvcnkiLCJsb2FkIiwib3BlbkRpYWxvZyIsInNob3ciLCJkb2N1bWVudCIsImJvZHkiLCJjbGlja091dHNpZGVUb0Nsb3NlIiwiY2xlYXIiLCJnZXRQcm9qZWN0cyIsInRoZW4iLCJwcm9jZXNzUHJvamVjdHMiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsImlzQWN0aXZlIiwicHJvamVjdHNDcmVhdGVDdHJsIiwicHJvamVjdCIsInNhdmUiLCJjYW5jZWwiLCJjbG9zZSIsImdvQmFjayIsImdvIiwic2F2ZUhhbmRsZWQiLCJ1cGxvYWQiLCJyZXNvbHZlIiwiY2F0Y2giLCJlcnJvckhhbmRsZXIiLCJoaWRlIiwiZXJyb3IiLCJwcm9qZWN0c0xvYWRDdHJsIiwiZnVsbHNjcmVlbiIsIiRodHRwIiwiJGNvb2tpZXMiLCIkaHR0cEFib3J0YWJsZSIsInNldHRpbmdzIiwiYXBpVXJsIiwibW9kZWwiLCJwcm9qZWN0SWQiLCJjcmVhdGUiLCJ1cGRhdGUiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW0iLCJyZXNwb25zZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsUUFBUUMsTUFBUixDQUFlLHdCQUFmLEVBQXlDLENBQUMsSUFBRCxDQUF6Qzs7O0FDQUEsQ0FBQyxZQUFZO0FBQ1RELFlBQVFDLE1BQVIsQ0FBZSx3QkFBZixFQUF5Q0MsU0FBekMsQ0FBbUQsZ0JBQW5ELEVBQXFFQyxjQUFyRTs7QUFFQSxhQUFTQSxjQUFULEdBQTBCO0FBQ3RCLGVBQU87QUFDSEMsc0JBQVUsR0FEUDtBQUVIQyxrQkFBTSxjQUFVQyxLQUFWLEVBQWlCQyxHQUFqQixFQUFzQkMsS0FBdEIsRUFBNkI7O0FBRS9CLG9CQUFJQyxVQUFVQyxFQUFFSCxHQUFGLENBQWQ7QUFDQSxvQkFBSUksU0FBU0YsUUFBUUUsTUFBUixDQUFl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LFVBQVNLLE1BQVQsRUFBaUJELE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUlKLGFBQWEsRUFBakI7QUFHSCxLQVBtRSxDQUF4RTtBQVNILENBVkQ7OztBQ0FBcEMsUUFBUUMsTUFBUixDQUFlLGtCQUFmLEVBQW1DLENBQUMsV0FBRCxDQUFuQzs7QUFFQUQsUUFBUUMsTUFBUixDQUFlLGtCQUFmLEVBQW1DNEIsTUFBbkMsQ0FBMEMsQ0FDMUMsZ0JBRDBDLEVBRTFDLFVBQVVDLGFBQVYsRUFBeUI7QUFDckJBLGtCQUNLQyxLQURMLENBQ1csVUFEWCxFQUN1QjtBQUNmRSxhQUFLLE9BRFU7QUFFZkQsa0JBQVUsSUFGSztBQUdmRSxrQkFBVTtBQUhLLEtBRHZCOztBQU9BSixrQkFDS0MsS0FETCxDQUNXLGtCQURYLEVBQytCO0FBQ3ZCRSxhQUFLLFVBRGtCO0FBRXZCRSxxQkFBYTtBQUZVLEtBRC9COztBQU1BTCxrQkFDS0MsS0FETCxDQUNXLG1CQURYLEVBQ2dDO0FBQ3hCRSxhQUFLLFdBRG1CO0FBRXhCRSxxQkFBYTtBQUZXLEtBRGhDOztBQU1BTCxrQkFDS0MsS0FETCxDQUNXLGdCQURYLEVBQzZCO0FBQ3JCRSxhQUFLLGVBRGdCO0FBRXJCRSxxQkFBYTtBQUZRLEtBRDdCO0FBS0gsQ0EzQnlDLENBQTFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY29tcG9uZW50c1wiLCBbXCJuZ1wiXSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY29tcG9uZW50c1wiKS5kaXJlY3RpdmUoXCJzdWJNZW51VHJpZ2dlclwiLCBzdWJNZW51VHJpZ2dlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gc3ViTWVudVRyaWdnZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiQVwiLFxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsbSwgYXR0cnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICQoZWxtKTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJlbnQgPSBlbGVtZW50LnBhcmVudChcImxpXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vcGFyZW50LnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsaWNrKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkKFwibmF2W3JvbGU9bmF2aWdhdGlvbl0gbGkgYVtzdWItbWVudS10cmlnZ2VyXVwiKS5ub3QoZWxlbWVudCkucGFyZW50KFwibGlcIikuY2hpbGRyZW4oXCJ1bC5zdWItbWVudVwiKS5zbGlkZVVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIm5hdltyb2xlPW5hdmlnYXRpb25dIGxpXCIpLm5vdChwYXJlbnQpLnJlbW92ZUNsYXNzKFwib3BlblwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuKFwidWwuc3ViLW1lbnVcIikuc2xpZGVUb2dnbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQudG9nZ2xlQ2xhc3MoXCJvcGVuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSkoKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5jb25maWdcIiwgW1wibmdcIl0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5jb25maWdcIikuZmFjdG9yeShcImFwaUNvbmZpZ0ZhY3RvcnlcIiwgW1xyXG4gICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcHJvamVjdHM6IHsgcGF0aDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL2xvY2FsaG9zdDo1NzczOS9hcGlcIiB9LFxyXG4gICAgICAgICAgICBzeXN0ZW06IHsgcGF0aDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL2xvY2FsaG9zdDo1NTM2Mi9hcGlcIiB9LFxyXG4gICAgICAgICAgICB0YXNrczogeyBwYXRoOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vbG9jYWxob3N0OjU3NzY1L2FwaVwiIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbl0pOyIsIihmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmF1dGhlbnRpY2F0aW9uXCIsIFtcInVpLnJvdXRlclwiXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmF1dGhlbnRpY2F0aW9uXCIpLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyhzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhdXRoZW50aWNhdGlvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVybDogXCIvYXV0aGVudGljYXRpb25cIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3Lz5cIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAgICAgLnN0YXRlKFwiYXV0aGVudGljYXRpb24ubG9naW5cIiwge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvbG9naW5cIixcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCIvQXBwL0F1dGhlbnRpY2F0aW9uL1ZpZXdzL2F1dGhlbnRpY2F0aW9uLmxvZ2luLmh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImxvZ2luQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJsb2dpbkN0cmxcIlxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxufSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5hdXRoZW50aWNhdGlvblwiKS5jb250cm9sbGVyKFwibG9naW5Db250cm9sbGVyXCIsIGxvZ2luQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW5DdHJsKCRzdGF0ZSwgJHNjb3BlLCAkbG9jYXRpb24pIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB7fTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbkN0cmwuJGluamVjdCA9IFtcIiRzdGF0ZVwiLCBcIiRzY29wZVwiLCBcIiRsb2NhdGlvblwiXTtcclxufSkoYW5ndWxhcik7IiwiYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5wcm9qZWN0c1wiLCBbXCJ1aS5yb3V0ZXJcIl0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5wcm9qZWN0c1wiKS5jb25maWcoW1xyXG4gICAgXCIkc3RhdGVQcm92aWRlclwiLFxyXG4gICAgZnVuY3Rpb24gKHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5wcm9qZWN0c1wiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3Byb2plY3RzXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3IGZsZXg9XFxcIjEwMFxcXCIvPlwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5wcm9qZWN0cy5kaXNwbGF5XCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdHMtZGlzcGxheVwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL1Byb2plY3RzL1ZpZXdzL3Byb2plY3RzLmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvamVjdHNMb2FkQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInByb2plY3RzTG9hZEN0cmxcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhcHAucHJvamVjdHMuY3JlYXRlXCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvY3JlYXRlXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCIvQXBwL1Byb2plY3RzL1ZpZXdzL3Byb2plY3RzLmFkZC5wcm9qZWN0Lmh0bWxcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwicHJvamVjdHNDcmVhdGVDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwicHJvamVjdHNDcmVhdGVDdHJsXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XSk7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIucHJvamVjdHNcIikuY29udHJvbGxlcihcInByb2plY3RPdmVydmlld0NvbnRyb2xsZXJcIiwgcHJvamVjdE92ZXJ2aWV3Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvamVjdE92ZXJ2aWV3Q3RybCgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkcSwgJGZpbHRlciwgJG1kRGlhbG9nLCBwcm9qZWN0c0ZhY3RvcnkpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gW107XHJcblxyXG4gICAgICAgIC8vbWV0aG9kIGV4cG9zdXJlXHJcbiAgICAgICAgY29udHJvbGxlci5sb2FkID0gbG9hZDtcclxuICAgICAgICBjb250cm9sbGVyLm9wZW5EaWFsb2cgPSBvcGVuRGlhbG9nO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXNlIGRhdGFcclxuICAgICAgICBsb2FkKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gb3BlbiB0aGUgZGlhbG9nXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gb3BlbkRpYWxvZygpIHtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ0FwcC9Qcm9qZWN0cy9WaWV3cy9wcm9qZWN0cy5hZGQucHJvamVjdC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInByb2plY3RzQ3JlYXRlQ29udHJvbGxlclwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIHJldHJpZXZlIGEgbGlzdCBvZiBwcm9qZWN0cyBmcm9tIHRoZSBzZXJ2ZXJcclxuICAgICAgICAgKiBAcGFyYW0ge30gcmVzZXRQYWdpbmF0aW9uIFxyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IHByb2plY3RzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZCgpIHtcclxuICAgICAgICAgICAgY2xlYXIoKTtcclxuICAgICAgICAgICAgcHJvamVjdHNGYWN0b3J5XHJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvamVjdHMoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocHJvY2Vzc1Byb2plY3RzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NQcm9qZWN0cyhwcm9qZWN0cykge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gcHJvamVjdHMuZGF0YTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY29udHJvbGxlci5wcm9qZWN0c1swXS5pc0FjdGl2ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gY2xlYXIgdGhlIGV4aXN0aW5nIGNvbGxlY3Rpb24gcmVhZHkgdG8gbG9hZCBwcm9qZWN0c1xyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gW107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdE92ZXJ2aWV3Q3RybC4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJHFcIiwgXCIkZmlsdGVyXCIsIFwiJG1kRGlhbG9nXCIsIFwicHJvamVjdHNGYWN0b3J5XCJdO1xyXG5cclxufSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIucHJvamVjdHNcIikuY29udHJvbGxlcihcInByb2plY3RzQ3JlYXRlQ29udHJvbGxlclwiLCBwcm9qZWN0c0NyZWF0ZUN0cmwpO1xyXG4gICAgZnVuY3Rpb24gcHJvamVjdHNDcmVhdGVDdHJsKCRzY29wZSwgJHN0YXRlLCAkbWREaWFsb2csIHByb2plY3RzRmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0gJHNjb3BlO1xyXG4gICAgICAgIGNvbnRyb2xsZXIucHJvamVjdCA9IHt9O1xyXG5cclxuICAgICAgICAvLyBtZXRob2QgZXhwb3N1cmVcclxuICAgICAgICBjb250cm9sbGVyLnNhdmUgPSBzYXZlO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2FuY2VsID0gY2FuY2VsO1xyXG4gICAgICAgIGNvbnRyb2xsZXIuY2xvc2UgPSBjbG9zZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvQmFjaygpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2plY3RzLmRpc3BsYXlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzYXZlSGFuZGxlZCgpIHtcclxuICAgICAgICAgICAgcHJvamVjdHNGYWN0b3J5LnVwbG9hZChjb250cm9sbGVyLnByb2plY3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkaWFsb2cgbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIHNhdmVIYW5kbGVkKCk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5jYW5jZWwoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjbG9zZSgpIHtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgIGZ1bmN0aW9uIHJlc29sdmUoKSB7XHJcbiAgICAgICAgICAgZ29CYWNrKCk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGVycm9yKSB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByb2plY3RzQ3JlYXRlQ3RybC4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJG1kRGlhbG9nXCIsIFwicHJvamVjdHNGYWN0b3J5XCJdO1xyXG5cclxufSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIucHJvamVjdHNcIikuY29udHJvbGxlcihcInByb2plY3RzTG9hZENvbnRyb2xsZXJcIiwgcHJvamVjdHNMb2FkQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvamVjdHNMb2FkQ3RybCgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkcSwgJGZpbHRlciwgJG1kRGlhbG9nLCBwcm9qZWN0c0ZhY3RvcnkpIHtcclxuXHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9tZXRob2QgZXhwb3N1cmVcclxuICAgICAgICBjb250cm9sbGVyLmxvYWQgPSBsb2FkO1xyXG4gICAgICAgIGNvbnRyb2xsZXIub3BlbkRpYWxvZyA9IG9wZW5EaWFsb2c7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpc2UgZGF0YVxyXG4gICAgICAgIGxvYWQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBvcGVuIHRoZSBkaWFsb2dcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBvcGVuRGlhbG9nKCkge1xyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnQXBwL1Byb2plY3RzL1ZpZXdzL3Byb2plY3RzLmFkZC5wcm9qZWN0Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9qZWN0c0NyZWF0ZUNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuOiAhMCAvLyBPbmx5IGZvciAteHMsIC1zbVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiByZXRyaWV2ZSBhIGxpc3Qgb2YgcHJvamVjdHMgZnJvbSB0aGUgc2VydmVyXHJcbiAgICAgICAgICogQHBhcmFtIHt9IHJlc2V0UGFnaW5hdGlvbiBcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBwcm9qZWN0c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWQoKSB7XHJcbiAgICAgICAgICAgIGNsZWFyKCk7XHJcbiAgICAgICAgICAgIHByb2plY3RzRmFjdG9yeVxyXG4gICAgICAgICAgICAgICAgLmdldFByb2plY3RzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKHByb2Nlc3NQcm9qZWN0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzUHJvamVjdHMocHJvamVjdHMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvamVjdHMuZGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5wcm9qZWN0cyA9IHByb2plY3RzLmRhdGFbMF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvamVjdHMgPSBwcm9qZWN0cy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIGNsZWFyIHRoZSBleGlzdGluZyBjb2xsZWN0aW9uIHJlYWR5IHRvIGxvYWQgcHJvamVjdHNcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlci5wcm9qZWN0cyA9IFtdO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByb2plY3RzTG9hZEN0cmwuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcIiRxXCIsIFwiJGZpbHRlclwiLCBcIiRtZERpYWxvZ1wiLCBcInByb2plY3RzRmFjdG9yeVwiXTtcclxuXHJcbn0pKGFuZ3VsYXIpO1xyXG5cclxuIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIucHJvamVjdHNcIikuZmFjdG9yeShcInByb2plY3RzRmFjdG9yeVwiLCBwcm9qZWN0c0ZhY3RvcnkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHByb2plY3RzRmFjdG9yeSgkaHR0cCwgJHEsICRjb29raWVzLCAkaHR0cEFib3J0YWJsZSwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBhcGlVcmw6IGNvbmZpZy5wcm9qZWN0cy5wYXRoXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXBsb2FkOiB1cGxvYWQsXHJcbiAgICAgICAgICAgIGdldFByb2plY3RzOiBnZXRQcm9qZWN0c1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZChtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG1vZGVsLnByb2plY3RJZCA9PT0gXCJ1bmRlZmluZWRcIiA/IGNyZWF0ZShtb2RlbCkgOiB1cGRhdGUobW9kZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIGNyZWF0ZSBhIHByb2plY3RcclxuICAgICAgICAgKiBAcGFyYW0ge30gbW9kZWwgXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cEFib3J0YWJsZS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHNldHRpbmdzLmFwaVVybCArIFwiL2NyZWF0ZS9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKG1vZGVsKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIHVwZGF0ZSBwcm9qZWN0IGRldGFpbHNcclxuICAgICAgICAgKiBAcGFyYW0ge30gbW9kZWwgXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cEFib3J0YWJsZS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHNldHRpbmdzLmFwaVVybCArIFwiL3VwZGF0ZS9wcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiAkLnBhcmFtKG1vZGVsKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiByZXRyaWV2ZSBwcm9qZWN0c1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtwcm9taXNlfSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi9nZXQvcHJvamVjdHNcIlxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBlcnJvckhhbmRsZXIoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBoYW5kbGVyIGNhdWdodCBleGNlcHRpb246IFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvamVjdHNGYWN0b3J5LiRpbmplY3QgPSBbXCIkaHR0cFwiLCBcIiRxXCIsIFwiJGNvb2tpZXNcIiwgXCIkaHR0cEFib3J0YWJsZVwiLCBcImFwaUNvbmZpZ0ZhY3RvcnlcIl07XHJcblxyXG59KShhbmd1bGFyKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci50YXNrc1wiLCBbXCJ1aS5yb3V0ZXJcIl0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci50YXNrc1wiKS5jb25maWcoW1xyXG5cIiRzdGF0ZVByb3ZpZGVyXCIsXHJcbmZ1bmN0aW9uKHN0YXRlUHJvdmlkZXIpIHtcclxuXHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKFwiYXBwLnRhc2tzXCIsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi90YXNrc1wiLFxyXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHVpLXZpZXcvPlwiXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZShcImFwcC50YXNrcy5wZXJzb25hbFwiLCB7XHJcbiAgICAgICAgICAgIHVybDogXCIvcGVyc29uYWwtdGFza3NcIixcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL1Rhc2tzL1BlcnNvbmFsL1ZpZXdzL3BlcnNvbmFsLnRhc2tzLmh0bWxcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgIC5zdGF0ZShcImFwcC50YXNrcy50ZWFtXCIsIHtcclxuICAgICAgICAgICB1cmw6IFwiL3RlYW0tdGFza3NcIixcclxuICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvVGFza3MvVGVhbS9WaWV3cy90ZWFtLnRhc2tzLmh0bWxcIlxyXG4gICAgICAgfSk7XHJcbn1dKSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIub3ZlcnZpZXdcIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLm92ZXJ2aWV3XCIpLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyhzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKFwiYXBwLm92ZXJ2aWV3XCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvb3ZlcnZpZXdcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHVpLXZpZXcvPlwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5vdmVydmlldy5wZXJzb25hbFwiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3BlcnNvbmFsLW92ZXJ2aWV3XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvT3ZlcnZpZXcvUGVyc29uYWwvVmlld3MvcGVyc29uYWwub3ZlcnZpZXcuaHRtbFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5vdmVydmlldy50ZWFtXCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvdGVhbS1vdmVydmlld1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL092ZXJ2aWV3L1RlYW0vVmlld3MvdGVhbS5vdmVydmlldy5odG1sXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlnLiRpbmplY3QgPSBbXCIkc3RhdGVQcm92aWRlclwiXTtcclxuXHJcbn0pKGFuZ3VsYXIpOyIsImFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuYmFja2xvZ1wiLCBbXCJ1aS5yb3V0ZXJcIl0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5iYWNrbG9nXCIpLmNvbmZpZyhbXHJcblwiJHN0YXRlUHJvdmlkZXJcIixcclxuZnVuY3Rpb24gKHN0YXRlUHJvdmlkZXIpIHtcclxuXHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKFwiYXBwLmJhY2tsb2dcIiwge1xyXG4gICAgICAgICAgICB1cmw6IFwiL2JhY2tsb2dcIixcclxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3Lz5cIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHAuYmFja2xvZy5wZXJzb25hbFwiLCB7XHJcbiAgICAgICAgICAgIHVybDogXCIvcGVyc29uYWwtYmFja2xvZ1wiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvQmFja2xvZy9QZXJzb25hbC9WaWV3cy9wZXJzb25hbC5iYWNrbG9nLmh0bWxcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgIC5zdGF0ZShcImFwcC5iYWNrbG9nLnRlYW1cIiwge1xyXG4gICAgICAgICAgIHVybDogXCIvdGVhbS1iYWNrbG9nXCIsXHJcbiAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL0JhY2tsb2cvVGVhbS9WaWV3cy90ZWFtLmJhY2tsb2cuaHRtbFwiXHJcbiAgICAgICB9KTtcclxufV0pIiwiYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5jYWxlbmRhclwiLCBbXCJ1aS5yb3V0ZXJcIl0pO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5jYWxlbmRhclwiKS5jb25maWcoW1xyXG4gICAgXCIkc3RhdGVQcm92aWRlclwiLFxyXG4gICAgZnVuY3Rpb24gKHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5jYWxlbmRhclwiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhbGVuZGFyXCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3Lz5cIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhcHAuY2FsZW5kYXIuZGlzcGxheVwiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2NhbGVuZGFyLWRpc3BsYXlcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIkFwcC9DYWxlbmRhci9WaWV3cy9jYWxlbmRhci5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNhbGVuZGFyQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcImNhbGVuZGFyQ3RybFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfV0pOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY2FsZW5kYXJcIikuY29udHJvbGxlcihcImNhbGVuZGFyQ29udHJvbGxlclwiLCBbXHJcbiAgICAgICAgXCIkc2NvcGVcIixcclxuICAgICAgICBcIiRzdGF0ZVwiLFxyXG4gICAgICAgIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyID0ge307XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCJhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLnRlYW1cIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIudGVhbVwiKS5jb25maWcoW1xyXG5cIiRzdGF0ZVByb3ZpZGVyXCIsXHJcbmZ1bmN0aW9uIChzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKFwiYXBwLnRlYW1cIiwge1xyXG4gICAgICAgICAgICB1cmw6IFwiL3RlYW1cIixcclxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3Lz5cIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHAudGVhbS5iYWNrbG9nXCIsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi9iYWNrbG9nXCIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIkFwcC9UZWFtL0JhY2tsb2cvVmlld3MvdGVhbS5iYWNrbG9nLmh0bWxcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHAudGVhbS5vdmVydmlld1wiLCB7XHJcbiAgICAgICAgICAgIHVybDogXCIvb3ZlcnZpZXdcIixcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL1RlYW0vT3ZlcnZpZXcvVmlld3MvdGVhbS5vdmVydmlldy5odG1sXCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKFwiYXBwLnRlYW0udGFza3NcIiwge1xyXG4gICAgICAgICAgICB1cmw6IFwiL2FjdGl2ZS10YXNrc1wiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvVGVhbS9BY3RpdmVUYXNrcy9WaWV3cy90ZWFtLmFjdGl2ZS50YXNrcy5odG1sXCJcclxuICAgICAgICB9KTtcclxufV0pIl19
