"use strict";

angular.module("taskmanager.components", ["ng"]);
"use strict";

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
"use strict";

angular.module("taskmanager.config", ["ng"]);

angular.module("taskmanager.config").factory("apiConfigFactory", [function () {
    return {
        projects: { path: window.location.protocol + "//localhost:57739/api" },
        system: { path: window.location.protocol + "//localhost:55362/api" },
        tasks: { path: window.location.protocol + "//localhost:57765/api" }
    };
}]);
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
"use strict";
//(function (angular) {

//    "use strict";

//    angular.module("taskmanager.authentication").controller("loginController", loginCtrl);

//    function loginCtrl($state, $scope, $location) {

//        var controller = {};

//        return controller;

//    }

//    loginCtrl.$inject = ["$state", "$scope", "$location"];
//})(angular);
"use strict";
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects", ["ui.router"]);

    angular.module("taskmanager.projects").config(config);

    function config(stateProvider) {

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
            controller: "projectCreateController",
            controllerAs: "projectCreateCtrl"
        });
    }

    config.$inject = ["$stateProvider"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").factory("projectFactory", projectFactory);

    function projectFactory($http, $q, $cookies, $httpAbortable, config) {
        var settings = {
            apiUrl: config.projects.path
        };

        return {
            upload: upload,
            getProjects: getProjects,
            getProjectById: getProjectById
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

        // projects get methods
        function getProjects() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/projects"
            }).then(resolve).catch(errorHandler);
        }

        function getProjectById(projectId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/project?projectId=" + projectId
            }).then(resolve).catch(errorHandler);
        }

        function resolve(response) {
            return response;
        }

        function errorHandler(error) {
            console.log("Error handler caught exception: " + error);
        }
    }

    projectFactory.$inject = ["$http", "$q", "$cookies", "$httpAbortable", "apiConfigFactory"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").controller("projectCreateController", projectCreateCtrl);

    function projectCreateCtrl(projectId, $scope, $state, $stateParams, $mdDialog, projectFactory) {
        var controller = $scope;
        controller.projectId = projectId;
        controller.project = {};

        // method exposure
        controller.save = save;
        controller.cancel = cancel;
        controller.close = close;

        init();

        return controller;

        function goBack() {
            $state.go("app.projects.display");
        }

        function init() {
            clear();

            if (projectId != 0) projectFactory.getProjectById(projectId).then(processProject);
        }

        function processProject(project) {
            controller.project = project.data;
        }

        function saveHandled() {
            projectFactory.upload(controller.project).then(resolve).catch(errorHandler);
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

        function clear() {
            controller.project = {};
        }
    }
    projectCreateCtrl.$inject = ["projectId", "$scope", "$state", "$stateParams", "$mdDialog", "projectFactory"];
})(angular);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (angular) {
    "use strict";

    angular.module("taskmanager.projects").controller("projectsLoadController", projectsLoadCtrl);

    function projectsLoadCtrl($scope, $state, $stateParams, $q, $filter, $mdDialog, projectFactory) {

        var controller = {};
        controller.projects = [];

        //method exposure
        controller.load = load;
        controller.openCreateDialog = openCreateDialog;
        controller.openAddTaskDialog = openAddTaskDialog;

        // initialise data
        load();

        return controller;

        /**
         * @description open the create project dialog
         * @returns {} 
         */
        function openCreateDialog(projectId) {
            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: 'App/Projects/Views/projects.add.project.html',
                controller: "projectCreateController",
                clickOutsideToClose: true,
                fullscreen: !0, // Only for -xs, -sm
                bindToController: true,
                locals: { projectId: projectId }
            });
        }

        /**
         * @description open the add task dialog
         * @returns {} 
         */
        function openAddTaskDialog(projectId) {
            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: 'App/Tasks/Views/tasks.add.task.html',
                controller: "taskCreateController",
                clickOutsideToClose: true,
                fullscreen: !0, // Only for -xs, -sm
                locals: {
                    projectId: projectId,
                    taskId: 0
                }
            });
        }

        /**
         * @description retrieve a list of projects from the server
         * @param {} resetPagination 
         * @returns {} projects
         */
        function load() {
            clear();
            projectFactory.getProjects().then(processProjects);
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

    projectsLoadCtrl.$inject = ["$scope", "$state", "$stateParams", "$q", "$filter", "$mdDialog", "projectFactory"];
})(angular);
"use strict";

angular.module("taskmanager.tasks", ["ui.router"]);

angular.module("taskmanager.tasks").config(["$stateProvider", function (stateProvider) {

    stateProvider.state("app.tasks", {
        url: "/tasks",
        abstract: true,
        template: "<ui-view flex=\"100\"/>"
    });

    stateProvider.state("app.tasks.display", {
        url: "/tasks-display",
        templateUrl: "App/Tasks/Views/tasks.html",
        controller: "tasksLoadController",
        controllerAs: "tasksLoadCtrl"
    });

    stateProvider.state("app.tasks.create", {
        url: "/create",
        templateUrl: "/App/Tasks/Views/tasks.add.task.html",
        controller: "taskCreateController",
        controllerAs: "taskCreateCtrl"
    });
}]);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (angular) {
    "use strict";

    angular.module("taskmanager.tasks").controller("taskCreateController", taskCreateCtrl);

    function taskCreateCtrl(taskId, projectId, $scope, $state, $stateParams, $mdDialog, taskFactory, appDataFactory) {
        var controller = $scope;

        controller.task = {};
        controller.task.projectId = projectId;

        controller.projectsSrc = [];
        controller.accountsSrc = [];

        // method exposure
        controller.save = save;
        controller.cancel = cancel;
        controller.close = close;

        // initialize
        init();
        populateDropdowns();

        return controller;

        /**
         * @desc load inital data for create form
         * @returns {} 
         */
        function init() {
            if (taskId != 0) taskFactory.getTaskById(taskId).then(processTask);
        }

        function processTask(task) {
            controller.task = task.data;
        }

        /**
         * @desc method to handle save event
         * @returns {} 
         */
        function saveHandled() {
            taskFactory.upload(controller.task).then(resolve).catch(errorHandler);
        }

        /**
         * @desc populate drop down lists for the create form
         * @returns {} 
         */
        function populateDropdowns() {
            clearDropdowns();

            appDataFactory.getProjects().then(processProjects);

            appDataFactory.getAccounts().then(processAccounts);
        }

        function processProjects(projects) {

            if (_typeof(projects.data) === "object") controller.projectsSrc = projects.data[0];

            controller.projectsSrc = projects.data;
        }

        function processAccounts(accounts) {

            if (_typeof(accounts.data) === "object") controller.accountsSrc = accounts.data[0];

            controller.accountsSrc = accounts.data;
        }

        function clearDropdowns() {
            controller.projectsSrc = [];
            controller.accountsSrc = [];
        }

        function goToTasks() {
            $state.go("app.tasks.display");
        }

        // dialog methods
        function save() {
            saveHandled();
            close();
        };

        function cancel() {
            $mdDialog.cancel();
        };

        function close() {
            $mdDialog.hide();
        };

        function resolve() {
            goToTasks();
        }

        function errorHandler(error) {
            console.log(error);
        }
    }

    taskCreateCtrl.$inject = ["taskId", "projectId", "$scope", "$state", "$stateParams", "$mdDialog", "taskFactory", "appDataFactory"];
})(angular);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (angular) {
    "use strict";

    angular.module("taskmanager.tasks").controller("tasksLoadController", tasksLoadCtrl);

    function tasksLoadCtrl($scope, $state, $stateParams, $q, $filter, $mdDialog, taskFactory) {
        var controller = {};
        controller.tasks = [];
        controller.personal = true;

        isLoading(false); // get this working!!!

        //method exposure
        controller.filterLoad = filterLoad;
        controller.openCreateDialog = openCreateDialog;

        // initialise data
        init();

        return controller;

        /**
         * @description open the add task dialog
         * @returns {} 
         */
        function openCreateDialog(taskId) {

            $mdDialog.show({
                parent: angular.element(document.body),
                templateUrl: 'App/Tasks/Views/tasks.add.task.html',
                controller: "taskCreateController",
                clickOutsideToClose: true,
                fullscreen: !0, // Only for -xs, -sm
                locals: {
                    taskId: taskId,
                    projectId: 0 // used for create method on projects page
                }
            });
        }

        function init() {
            loadData(controller.personal);
        }

        function filterLoad() {
            controller.personal = !controller.personal;
            loadData(controller.personal);
        }

        /**
         * @description Retrieve list of tasks from server
         * @param {} personal - toggles between the accounts tasks and the whole teams
         * @returns {} 
         */
        function loadData(personal) {
            clear();
            isLoading(true);

            var id = personal ? 1 : null;

            taskFactory.getTasks(id).then(processTasks);
        }

        function processTasks(tasks) {
            if (tasks === undefined || tasks === null) return;

            if (_typeof(tasks.data) === "object") {
                controller.tasks = tasks.data[0];
            }
            isLoading(false);
            controller.tasks = tasks.data;
        }

        /**
         * @description clear the existing collection ready to load tasks
         * @returns {} 
         */
        function clear() {
            controller.tasks = [];
        };

        function isLoading(loading) {
            controller.isLoading = loading;
        }
    }

    tasksLoadCtrl.$inject = ["$scope", "$state", "$stateParams", "$q", "$filter", "$mdDialog", "taskFactory"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager.tasks").factory("taskFactory", taskFactory);

    function taskFactory($http, $q, $cookies, $httpAbortable, config) {
        var settings = {
            apiUrl: config.tasks.path
        };

        return {
            upload: upload,
            getTasks: getTasks,
            getTaskById: getTaskById,
            getBacklog: getBacklog
        };

        function upload(model) {
            return typeof model.taskId === "undefined" ? create(model) : update(model);
        }

        /**
         * @desc create a task
         * @param {} model 
         * @returns {} 
         */
        function create(model) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/create/task",
                data: $.param(model)
            }).then(resolve).catch(errorHandler);
        }

        /**
         * @desc update task details
         * @param {} model 
         * @returns {} 
         */
        function update(model) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/update/task",
                data: $.param(model)
            }).then(resolve).catch(errorHandler);
        }

        // tasks get methods
        function getTasks(id) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/get/tasks?accountId=" + id
            }).then(resolve).catch(errorHandler);
        }

        /**
         * @desc Get task with the specified Id 
         * @param {} taskId 
         * @returns {} 
         */
        function getTaskById(id) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/task?taskId=" + id
            }).then(resolve).catch(errorHandler);
        }

        // backlog tasks get methods
        function getBacklog(id) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/get/backlog?accountId=" + id
            }).then(resolve).catch(errorHandler);
        }

        function resolve(response) {
            return response;
        }

        function errorHandler(error) {
            console.log("Error handler caught exception: " + error);
        }
    }

    taskFactory.$inject = ["$http", "$q", "$cookies", "$httpAbortable", "apiConfigFactory"];
})(angular);
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

    stateProvider.state("app.backlog.display", {
        url: "/backlog-display",
        templateUrl: "App/Backlog/Views/backlog.html",
        controller: "backlogLoadController",
        controllerAs: "backlogLoadCtrl"
    });
}]);
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (angular) {
    "use strict";

    angular.module("taskmanager.backlog").controller("backlogLoadController", backlogLoadCtrl);

    function backlogLoadCtrl($scope, $state, $stateParams, $q, $filter, $mdDialog, taskFactory) {
        var controller = {};
        controller.backlog = [];
        controller.personal = true;
        isLoading(false); // get this working!!!

        //method exposure
        controller.filterLoad = filterLoad;

        // initialise data
        init();

        return controller;

        function init() {
            loadData(controller.personal);
        }

        function filterLoad() {
            controller.personal = !controller.personal;
            loadData(controller.personal);
        }

        /**
         * @description Retrieve list of backlogged tasks from server
         * @param {} personal - toggles between the accounts tasks and the whole teams
         * @returns {} 
         */
        function loadData(personal) {
            clear();
            isLoading(true);

            var id = personal ? 1 : null; // edit this to be the logged in accounts Id

            taskFactory.getBacklog(id).then(processBacklog);
        }

        function processBacklog(tasks) {
            console.log(tasks.data);
            if (tasks === undefined || tasks === null) return;

            if (_typeof(tasks.data) === "object") {
                controller.backlog = tasks.data[0];
            }
            isLoading(false);
            controller.backlog = tasks.data;
        }

        /**
         * @description clear the existing collection ready to load tasks
         * @returns {} 
         */
        function clear() {
            controller.backlog = [];
        };

        function isLoading(loading) {
            controller.isLoading = loading;
        }
    }

    backlogLoadCtrl.$inject = ["$scope", "$state", "$stateParams", "$q", "$filter", "$mdDialog", "taskFactory"];
})(angular);
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

/**
 * angular module declaration
 */

angular.module("taskmanager", ["ng", "ngCookies", "ngMaterial", "httpUtils", "ui.router", "ui.breadcrumbs", "LocalStorageModule", "taskmanager.config", "taskmanager.components",
//"taskmanager.authentication",
"taskmanager.calendar", "taskmanager.projects", "taskmanager.tasks", "taskmanager.overview", "taskmanager.backlog"]);

angular.module("taskmanager").config(["$stateProvider", "$urlRouterProvider", "$httpProvider", "localStorageServiceProvider", function ($stateProvider, $urlRouteProvider, $httpProvider, localStorageServiceProvider) {

    // default root on app start
    $urlRouteProvider.otherwise("/app/projects/projects-display");

    //  configure local storage
    localStorageServiceProvider.setPrefix("taskmanager").setStorageType("sessionStorage").setNotify(true, true);

    //  root level view 
    $stateProvider.state("app", {
        url: "/app",
        templateUrl: "App/App/Views/app.index.html",
        controller: "appController",
        controllerAs: "appCtrl"
    });

    //  inject http interceptors
    $httpProvider.interceptors.push("httpInterceptor");
}]);

/**
 * launch the app
 */
angular.module("taskmanager").run(["$rootScope", "$state", "$stateParams", "$location", function ($rootScope, $state, $stateParams, $location) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $location.path("/app/overview/personal-overview");
}]);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager").controller("appController", appCtrl);

    function appCtrl($scope, $state) {
        var controller = {};

        // return
        return controller;
    }

    appCtrl.$inject = ["$scope", "$state"];
})(angular);
"use strict";

(function (angular) {
    "use strict";

    angular.module("taskmanager").factory("appDataFactory", appDataFactory);

    function appDataFactory($http, $q, $httpAbortable, localStorage, config) {
        var settings = {
            systemApiUrl: config.system.path,
            projectsApiUrl: config.projects.path,
            tasksApiUrl: config.tasks.path
        };

        return {
            // accounts
            getAccounts: getAccounts,
            getAccountById: getAccountById,
            // projects
            getProjects: getProjects,
            getProjectById: getProjectById
        };

        // account get methods
        function getAccounts() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.systemApiUrl + "/get/accounts"
            }).then(resolve).catch(errorHandler);
        }

        function getAccountById(accountId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.systemApiUrl + "/get/account?accountId=" + accountId
            }).then(resolve).catch(errorHandler);
        }

        // project get methods
        function getProjects() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.projectsApiUrl + "/get/projects"
            }).then(resolve).catch(errorHandler);
        }

        function getProjectById(projectId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.projectsApiUrl + "/get/project?projectId=" + projectId
            }).then(resolve).catch(errorHandler);
        }

        function resolve(response) {
            return response;
        }

        function errorHandler(error) {
            console.log("Error handler caught exception: " + error);
        }
    }

    appDataFactory.$inject = ["$http", "$q", "$httpAbortable", "localStorageService", "apiConfigFactory"];
})(angular);
"use strict";
"use strict";

(function (angular) {
    angular.module("taskmanager").factory("httpInterceptor", httpInterceptor);

    function httpInterceptor($q, $location) {
        return {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };

        /**
        * intercept http requests
        *
        * @return promise
        */
        function request(req) {
            //console.log(req);
            req.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

            // Return the config or wrap it in a promise if blank.
            return req || $q.when(req);
        }

        /**
        * intercept http request errors
        *
        * @return promise
        */
        function requestError(rejection) {
            // console.log(rejection); // Contains the data about the error on the request.

            // Return the promise rejection.
            return $q.reject(rejection);
        }

        /**
        * intercept http response
        *
        * @return promise
        */
        function response(res) {
            //console.log(res); // Contains the data from the response.

            // Return the response or promise.
            return res || $q.when(res);
        }

        /**
        * intercept http response failures
        *
        * @return promise
        */
        function responseError(rejection) {
            //console.log(rejection); // Contains the data about the error.

            if (response.status === 403) {}
            //lxNotificationService.error("Error " + rejection.status + " occured, with reason: " + rejection.data.message);


            // Return the promise rejection.
            return $q.reject(rejection);
        }
    }

    httpInterceptor.$inject = ["$q", "$location"];
})(angular);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMubW9kdWxlLmpzIiwiRGlyZWN0aXZlcy9wcmVsb2FkZXIuZGlyZWN0aXZlLmpzIiwiYXBwLmNvbmZpZy5qcyIsImF1dGhlbnRpY2F0aW9uLm1vZHVsZS5qcyIsIkNvbnRyb2xsZXJzL2F1dGhlbnRpY2F0aW9uLmxvZ2luLmNvbnRyb2xsZXIuanMiLCJwcm9qZWN0cy5tb2R1bGUuanMiLCJGYWN0b3JpZXMvcHJvamVjdHMucHJvamVjdEZhY3RvcnkuanMiLCJDb250cm9sbGVycy9wcm9qZWN0cy5jcmVhdGUuY29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL3Byb2plY3RzLmxvYWQuY29udHJvbGxlci5qcyIsInRhc2tzLm1vZHVsZS5qcyIsIkNvbnRyb2xsZXJzL3Rhc2tzLmNyZWF0ZS5jb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvdGFza3MubG9hZC5jb250cm9sbGVyLmpzIiwiRmFjdG9yaWVzL3Rhc2tzLnRhc2tGYWN0b3J5LmpzIiwib3ZlcnZpZXcubW9kdWxlLmpzIiwiYmFja2xvZy5tb2R1bGUuanMiLCJDb250cm9sbGVycy9iYWNrbG9nLmxvYWQuY29udHJvbGxlci5qcyIsImNhbGVuZGFyLm1vZHVsZS5qcyIsIkNvbnRyb2xsZXJzL2NhbGVuZGFyLmNvbnRyb2xsZXIuanMiLCJhcHAubW9kdWxlLmpzIiwiQ29udHJvbGxlcnMvYXBwLmNvbnRyb2xsZXIuanMiLCJGYWN0b3JpZXMvYXBwLmFwcERhdGEuZmFjdG9yeS5qcyIsIkZhY3Rvcmllcy9hcHAuYXV0aGVudGljYXRpb24uZmFjdG9yeS5qcyIsIkZhY3Rvcmllcy9odHRwSW50ZXJjZXB0b3IuanMiXSwibmFtZXMiOlsiYW5ndWxhciIsIm1vZHVsZSIsImRpcmVjdGl2ZSIsInByZWxvYWRlciIsInJlc3RyaWN0IiwiY29udHJvbGxlciIsIiRzY29wZSIsImxvYWRpbmciLCIkaW5qZWN0IiwiZmFjdG9yeSIsInByb2plY3RzIiwicGF0aCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJzeXN0ZW0iLCJ0YXNrcyIsImNvbmZpZyIsInN0YXRlUHJvdmlkZXIiLCJzdGF0ZSIsInVybCIsImFic3RyYWN0IiwidGVtcGxhdGUiLCJ0ZW1wbGF0ZVVybCIsImNvbnRyb2xsZXJBcyIsInByb2plY3RGYWN0b3J5IiwiJGh0dHAiLCIkcSIsIiRjb29raWVzIiwiJGh0dHBBYm9ydGFibGUiLCJzZXR0aW5ncyIsImFwaVVybCIsInVwbG9hZCIsImdldFByb2plY3RzIiwiZ2V0UHJvamVjdEJ5SWQiLCJtb2RlbCIsInByb2plY3RJZCIsImNyZWF0ZSIsInVwZGF0ZSIsInJlcXVlc3QiLCJtZXRob2QiLCJkYXRhIiwiJCIsInBhcmFtIiwidGhlbiIsInJlc29sdmUiLCJjYXRjaCIsImVycm9ySGFuZGxlciIsInJlc3BvbnNlIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwicHJvamVjdENyZWF0ZUN0cmwiLCIkc3RhdGUiLCIkc3RhdGVQYXJhbXMiLCIkbWREaWFsb2ciLCJwcm9qZWN0Iiwic2F2ZSIsImNhbmNlbCIsImNsb3NlIiwiaW5pdCIsImdvQmFjayIsImdvIiwiY2xlYXIiLCJwcm9jZXNzUHJvamVjdCIsInNhdmVIYW5kbGVkIiwiaGlkZSIsInByb2plY3RzTG9hZEN0cmwiLCIkZmlsdGVyIiwibG9hZCIsIm9wZW5DcmVhdGVEaWFsb2ciLCJvcGVuQWRkVGFza0RpYWxvZyIsInNob3ciLCJwYXJlbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJib2R5IiwiY2xpY2tPdXRzaWRlVG9DbG9zZSIsImZ1bGxzY3JlZW4iLCJiaW5kVG9Db250cm9sbGVyIiwibG9jYWxzIiwidGFza0lkIiwicHJvY2Vzc1Byb2plY3RzIiwidGFza0NyZWF0ZUN0cmwiLCJ0YXNrRmFjdG9yeSIsImFwcERhdGFGYWN0b3J5IiwidGFzayIsInByb2plY3RzU3JjIiwiYWNjb3VudHNTcmMiLCJwb3B1bGF0ZURyb3Bkb3ducyIsImdldFRhc2tCeUlkIiwicHJvY2Vzc1Rhc2siLCJjbGVhckRyb3Bkb3ducyIsImdldEFjY291bnRzIiwicHJvY2Vzc0FjY291bnRzIiwiYWNjb3VudHMiLCJnb1RvVGFza3MiLCJ0YXNrc0xvYWRDdHJsIiwicGVyc29uYWwiLCJpc0xvYWRpbmciLCJmaWx0ZXJMb2FkIiwibG9hZERhdGEiLCJpZCIsImdldFRhc2tzIiwicHJvY2Vzc1Rhc2tzIiwidW5kZWZpbmVkIiwiZ2V0QmFja2xvZyIsImJhY2tsb2dMb2FkQ3RybCIsImJhY2tsb2ciLCJwcm9jZXNzQmFja2xvZyIsIiRzdGF0ZVByb3ZpZGVyIiwiJHVybFJvdXRlUHJvdmlkZXIiLCIkaHR0cFByb3ZpZGVyIiwibG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyIiwib3RoZXJ3aXNlIiwic2V0UHJlZml4Iiwic2V0U3RvcmFnZVR5cGUiLCJzZXROb3RpZnkiLCJpbnRlcmNlcHRvcnMiLCJwdXNoIiwicnVuIiwiJHJvb3RTY29wZSIsIiRsb2NhdGlvbiIsImFwcEN0cmwiLCJsb2NhbFN0b3JhZ2UiLCJzeXN0ZW1BcGlVcmwiLCJwcm9qZWN0c0FwaVVybCIsInRhc2tzQXBpVXJsIiwiZ2V0QWNjb3VudEJ5SWQiLCJhY2NvdW50SWQiLCJodHRwSW50ZXJjZXB0b3IiLCJyZXF1ZXN0RXJyb3IiLCJyZXNwb25zZUVycm9yIiwicmVxIiwiaGVhZGVycyIsIndoZW4iLCJyZWplY3Rpb24iLCJyZWplY3QiLCJyZXMiLCJzdGF0dXMiXSwibWFwcGluZ3MiOiI7O0FBQUFBLFFBQVFDLE1BQVIsQ0FBZSx3QkFBZixFQUF5QyxDQUFDLElBQUQsQ0FBekM7OztBQ0FBLENBQUMsVUFBVUQsT0FBVixFQUFtQjtBQUNoQjs7QUFFQUEsWUFBUUMsTUFBUixDQUFlLHdCQUFmLEVBQXlDQyxTQUF6QyxDQUFtRCxXQUFuRCxFQUFnRUMsU0FBaEU7O0FBRUEsYUFBU0EsU0FBVCxHQUFxQjtBQUNqQixlQUFPO0FBQ0hDLHNCQUFVLEdBRFA7QUFFSEMsd0JBQVksQ0FBQyxRQUFELEVBQVdBLFVBQVg7QUFGVCxTQUFQOztBQUtBLGlCQUFTQSxVQUFULENB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UDs7QUFPQTs7Ozs7QUFLQSxpQkFBUzdGLE9BQVQsQ0FBaUI4RixHQUFqQixFQUFzQjtBQUNsQjtBQUNBQSxnQkFBSUMsT0FBSixDQUFZLGNBQVosSUFBOEIsa0RBQTlCOztBQUVBO0FBQ0EsbUJBQU9ELE9BQU8xRyxHQUFHNEcsSUFBSCxDQUFRRixHQUFSLENBQWQ7QUFDSDs7QUFFRDs7Ozs7QUFLQSxpQkFBU0YsWUFBVCxDQUFzQkssU0FBdEIsRUFBaUM7QUFDOUI7O0FBRUM7QUFDQSxtQkFBTzdHLEdBQUc4RyxNQUFILENBQVVELFNBQVYsQ0FBUDtBQUNIOztBQUVEOzs7OztBQUtBLGlCQUFTeEYsUUFBVCxDQUFrQjBGLEdBQWxCLEVBQXVCO0FBQ25COztBQUVBO0FBQ0EsbUJBQU9BLE9BQU8vRyxHQUFHNEcsSUFBSCxDQUFRRyxHQUFSLENBQWQ7QUFDSDs7QUFFRDs7Ozs7QUFLQSxpQkFBU04sYUFBVCxDQUF1QkksU0FBdkIsRUFBa0M7QUFDOUI7O0FBRUEsZ0JBQUl4RixTQUFTMkYsTUFBVCxLQUFvQixHQUF4QixFQUE2QixDQUU1QjtBQURHOzs7QUFHSjtBQUNBLG1CQUFPaEgsR0FBRzhHLE1BQUgsQ0FBVUQsU0FBVixDQUFQO0FBQ0g7QUFDSjs7QUFFRE4sb0JBQWdCMUgsT0FBaEIsR0FBMEIsQ0FBQyxJQUFELEVBQU8sV0FBUCxDQUExQjtBQUNILENBbEVELEVBa0VHUixPQWxFSCIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY29tcG9uZW50c1wiLCBbXCJuZ1wiXSk7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmNvbXBvbmVudHNcIikuZGlyZWN0aXZlKFwicHJlbG9hZGVyXCIsIHByZWxvYWRlcik7XHJcblxyXG4gICAgZnVuY3Rpb24gcHJlbG9hZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkFcIixcclxuICAgICAgICAgICAgY29udHJvbGxlcjogW1wiJHNjb3BlXCIsIGNvbnRyb2xsZXJdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRzY29wZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByZWxvYWRlci4kaW5qZWN0ID0gW107XHJcbn0pKGFuZ3VsYXIpO1xyXG4iLCJhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmNvbmZpZ1wiLCBbXCJuZ1wiXSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmNvbmZpZ1wiKS5mYWN0b3J5KFwiYXBpQ29uZmlnRmFjdG9yeVwiLCBbXHJcbiAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwcm9qZWN0czogeyBwYXRoOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vbG9jYWxob3N0OjU3NzM5L2FwaVwiIH0sXHJcbiAgICAgICAgICAgIHN5c3RlbTogeyBwYXRoOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vbG9jYWxob3N0OjU1MzYyL2FwaVwiIH0sXHJcbiAgICAgICAgICAgIHRhc2tzOiB7IHBhdGg6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9sb2NhbGhvc3Q6NTc3NjUvYXBpXCIgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXSk7IiwiLy8oZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuLy8gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuYXV0aGVudGljYXRpb25cIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbi8vICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuYXV0aGVudGljYXRpb25cIikuY29uZmlnKGNvbmZpZyk7XHJcblxyXG4vLyAgICBmdW5jdGlvbiBjb25maWcoc3RhdGVQcm92aWRlcikge1xyXG4vLyAgICAgICAgc3RhdGVQcm92aWRlclxyXG4vLyAgICAgICAgICAgIC5zdGF0ZShcImF1dGhlbnRpY2F0aW9uXCIsIHtcclxuLy8gICAgICAgICAgICAgICAgdXJsOiBcIi9hdXRoZW50aWNhdGlvblwiLFxyXG4vLyAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuLy8gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHVpLXZpZXcvPlwiXHJcbi8vICAgICAgICAgICAgfSk7XHJcblxyXG4vLyAgICAgICAgc3RhdGVQcm92aWRlclxyXG4vLyAgICAgICAgICAgICAgICAuc3RhdGUoXCJhdXRoZW50aWNhdGlvbi5sb2dpblwiLCB7XHJcbi8vICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2xvZ2luXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCIvQXBwL0F1dGhlbnRpY2F0aW9uL1ZpZXdzL2F1dGhlbnRpY2F0aW9uLmxvZ2luLmh0bWxcIixcclxuLy8gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwibG9naW5Db250cm9sbGVyXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwibG9naW5DdHJsXCJcclxuLy8gICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgIH1cclxuXHJcbi8vICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcbi8vfSkoYW5ndWxhcik7IiwiLy8oZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuXHJcbi8vICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuLy8gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5hdXRoZW50aWNhdGlvblwiKS5jb250cm9sbGVyKFwibG9naW5Db250cm9sbGVyXCIsIGxvZ2luQ3RybCk7XHJcblxyXG4vLyAgICBmdW5jdGlvbiBsb2dpbkN0cmwoJHN0YXRlLCAkc2NvcGUsICRsb2NhdGlvbikge1xyXG5cclxuLy8gICAgICAgIHZhciBjb250cm9sbGVyID0ge307XHJcbiAgICAgICAgXHJcbi8vICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgICAgICBcclxuLy8gICAgfVxyXG5cclxuLy8gICAgbG9naW5DdHJsLiRpbmplY3QgPSBbXCIkc3RhdGVcIiwgXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIl07XHJcbi8vfSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIucHJvamVjdHNcIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLnByb2plY3RzXCIpLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbmZpZyhzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKFwiYXBwLnByb2plY3RzXCIsIHtcclxuICAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdHNcIixcclxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiPHVpLXZpZXcgZmxleD1cXFwiMTAwXFxcIi8+XCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKFwiYXBwLnByb2plY3RzLmRpc3BsYXlcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wcm9qZWN0cy1kaXNwbGF5XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvUHJvamVjdHMvVmlld3MvcHJvamVjdHMuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9qZWN0c0xvYWRDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6IFwicHJvamVjdHNMb2FkQ3RybFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5wcm9qZWN0cy5jcmVhdGVcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVhdGVcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIi9BcHAvUHJvamVjdHMvVmlld3MvcHJvamVjdHMuYWRkLnByb2plY3QuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJwcm9qZWN0Q3JlYXRlQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInByb2plY3RDcmVhdGVDdHJsXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcblxyXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5wcm9qZWN0c1wiKS5mYWN0b3J5KFwicHJvamVjdEZhY3RvcnlcIiwgcHJvamVjdEZhY3RvcnkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHByb2plY3RGYWN0b3J5KCRodHRwLCAkcSwgJGNvb2tpZXMsICRodHRwQWJvcnRhYmxlLCBjb25maWcpIHtcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGFwaVVybDogY29uZmlnLnByb2plY3RzLnBhdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1cGxvYWQ6IHVwbG9hZCxcclxuICAgICAgICAgICAgZ2V0UHJvamVjdHM6IGdldFByb2plY3RzLFxyXG4gICAgICAgICAgICBnZXRQcm9qZWN0QnlJZDogZ2V0UHJvamVjdEJ5SWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWQobW9kZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBtb2RlbC5wcm9qZWN0SWQgPT09IFwidW5kZWZpbmVkXCIgPyBjcmVhdGUobW9kZWwpIDogdXBkYXRlKG1vZGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBjcmVhdGUgYSBwcm9qZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHt9IG1vZGVsIFxyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZShtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHBBYm9ydGFibGUucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi9jcmVhdGUvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbShtb2RlbClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiB1cGRhdGUgcHJvamVjdCBkZXRhaWxzXHJcbiAgICAgICAgICogQHBhcmFtIHt9IG1vZGVsIFxyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZShtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHBBYm9ydGFibGUucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi91cGRhdGUvcHJvamVjdFwiLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbShtb2RlbClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwcm9qZWN0cyBnZXQgbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFByb2plY3RzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHBBYm9ydGFibGUucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHNldHRpbmdzLmFwaVVybCArIFwiL2dldC9wcm9qZWN0c1wiXHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cEFib3J0YWJsZS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIHVybDogc2V0dGluZ3MuYXBpVXJsICsgXCIvZ2V0L3Byb2plY3Q/cHJvamVjdElkPVwiICsgcHJvamVjdElkXHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGhhbmRsZXIgY2F1Z2h0IGV4Y2VwdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm9qZWN0RmFjdG9yeS4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcIiRjb29raWVzXCIsIFwiJGh0dHBBYm9ydGFibGVcIiwgXCJhcGlDb25maWdGYWN0b3J5XCJdO1xyXG5cclxufSkoYW5ndWxhcik7XHJcbiIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLnByb2plY3RzXCIpLmNvbnRyb2xsZXIoXCJwcm9qZWN0Q3JlYXRlQ29udHJvbGxlclwiLCBwcm9qZWN0Q3JlYXRlQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gcHJvamVjdENyZWF0ZUN0cmwocHJvamVjdElkLCAkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkbWREaWFsb2csIHByb2plY3RGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSAkc2NvcGU7XHJcbiAgICAgICAgY29udHJvbGxlci5wcm9qZWN0SWQgPSBwcm9qZWN0SWQ7XHJcbiAgICAgICAgY29udHJvbGxlci5wcm9qZWN0ID0ge307XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gbWV0aG9kIGV4cG9zdXJlXHJcbiAgICAgICAgY29udHJvbGxlci5zYXZlID0gc2F2ZTtcclxuICAgICAgICBjb250cm9sbGVyLmNhbmNlbCA9IGNhbmNlbDtcclxuICAgICAgICBjb250cm9sbGVyLmNsb3NlID0gY2xvc2U7XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvQmFjaygpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnByb2plY3RzLmRpc3BsYXlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBjbGVhcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb2plY3RJZCAhPSAwKSBcclxuICAgICAgICAgICAgICAgIHByb2plY3RGYWN0b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgLmdldFByb2plY3RCeUlkKHByb2plY3RJZClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihwcm9jZXNzUHJvamVjdCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzUHJvamVjdChwcm9qZWN0KSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvamVjdCA9IHByb2plY3QuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVIYW5kbGVkKCkge1xyXG4gICAgICAgICAgICBwcm9qZWN0RmFjdG9yeS51cGxvYWQoY29udHJvbGxlci5wcm9qZWN0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZGlhbG9nIG1ldGhvZHNcclxuICAgICAgICBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgICAgICAgICBzYXZlSGFuZGxlZCgpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCkge1xyXG4gICAgICAgICAgICAkbWREaWFsb2cuY2FuY2VsKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICBmdW5jdGlvbiByZXNvbHZlKCkge1xyXG4gICAgICAgICAgIGdvQmFjaygpO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvamVjdCA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcm9qZWN0Q3JlYXRlQ3RybC4kaW5qZWN0ID0gW1wicHJvamVjdElkXCIsIFwiJHNjb3BlXCIsIFwiJHN0YXRlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJG1kRGlhbG9nXCIsIFwicHJvamVjdEZhY3RvcnlcIl07XHJcblxyXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5wcm9qZWN0c1wiKS5jb250cm9sbGVyKFwicHJvamVjdHNMb2FkQ29udHJvbGxlclwiLCBwcm9qZWN0c0xvYWRDdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiBwcm9qZWN0c0xvYWRDdHJsKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRxLCAkZmlsdGVyLCAkbWREaWFsb2csIHByb2plY3RGYWN0b3J5KSB7XHJcblxyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0ge307XHJcbiAgICAgICAgY29udHJvbGxlci5wcm9qZWN0cyA9IFtdO1xyXG5cclxuICAgICAgICAvL21ldGhvZCBleHBvc3VyZVxyXG4gICAgICAgIGNvbnRyb2xsZXIubG9hZCA9IGxvYWQ7XHJcbiAgICAgICAgY29udHJvbGxlci5vcGVuQ3JlYXRlRGlhbG9nID0gb3BlbkNyZWF0ZURpYWxvZztcclxuICAgICAgICBjb250cm9sbGVyLm9wZW5BZGRUYXNrRGlhbG9nID0gb3BlbkFkZFRhc2tEaWFsb2c7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaW5pdGlhbGlzZSBkYXRhXHJcbiAgICAgICAgbG9hZCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIG9wZW4gdGhlIGNyZWF0ZSBwcm9qZWN0IGRpYWxvZ1xyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIG9wZW5DcmVhdGVEaWFsb2cocHJvamVjdElkKSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdBcHAvUHJvamVjdHMvVmlld3MvcHJvamVjdHMuYWRkLnByb2plY3QuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInByb2plY3RDcmVhdGVDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjbGlja091dHNpZGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZnVsbHNjcmVlbjogITAsIC8vIE9ubHkgZm9yIC14cywgLXNtXHJcbiAgICAgICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbG9jYWxzOiB7IHByb2plY3RJZDogcHJvamVjdElkIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gb3BlbiB0aGUgYWRkIHRhc2sgZGlhbG9nXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gb3BlbkFkZFRhc2tEaWFsb2cocHJvamVjdElkKSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdBcHAvVGFza3MvVmlld3MvdGFza3MuYWRkLnRhc2suaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcInRhc2tDcmVhdGVDb250cm9sbGVyXCIsXHJcbiAgICAgICAgICAgICAgICBjbGlja091dHNpZGVUb0Nsb3NlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZnVsbHNjcmVlbjogITAsIC8vIE9ubHkgZm9yIC14cywgLXNtXHJcbiAgICAgICAgICAgICAgICBsb2NhbHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0SWQ6IHByb2plY3RJZCxcclxuICAgICAgICAgICAgICAgICAgICB0YXNrSWQ6IDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gcmV0cmlldmUgYSBsaXN0IG9mIHByb2plY3RzIGZyb20gdGhlIHNlcnZlclxyXG4gICAgICAgICAqIEBwYXJhbSB7fSByZXNldFBhZ2luYXRpb24gXHJcbiAgICAgICAgICogQHJldHVybnMge30gcHJvamVjdHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBsb2FkKCkge1xyXG4gICAgICAgICAgICBjbGVhcigpO1xyXG4gICAgICAgICAgICBwcm9qZWN0RmFjdG9yeVxyXG4gICAgICAgICAgICAgICAgLmdldFByb2plY3RzKClcclxuICAgICAgICAgICAgICAgIC50aGVuKHByb2Nlc3NQcm9qZWN0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzUHJvamVjdHMocHJvamVjdHMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9qZWN0cy5kYXRhID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gcHJvamVjdHMuZGF0YVswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzID0gcHJvamVjdHMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBjbGVhciB0aGUgZXhpc3RpbmcgY29sbGVjdGlvbiByZWFkeSB0byBsb2FkIHByb2plY3RzXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucHJvamVjdHMgPSBbXTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByb2plY3RzTG9hZEN0cmwuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcIiRxXCIsIFwiJGZpbHRlclwiLCBcIiRtZERpYWxvZ1wiLCBcInByb2plY3RGYWN0b3J5XCJdO1xyXG5cclxufSkoYW5ndWxhcik7XHJcblxyXG4iLCJhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLnRhc2tzXCIsIFtcInVpLnJvdXRlclwiXSk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLnRhc2tzXCIpLmNvbmZpZyhbXHJcblwiJHN0YXRlUHJvdmlkZXJcIixcclxuZnVuY3Rpb24oc3RhdGVQcm92aWRlcikge1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHAudGFza3NcIiwge1xyXG4gICAgICAgICAgICB1cmw6IFwiL3Rhc2tzXCIsXHJcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8dWktdmlldyBmbGV4PVxcXCIxMDBcXFwiLz5cIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHAudGFza3MuZGlzcGxheVwiLCB7XHJcbiAgICAgICAgICAgIHVybDogXCIvdGFza3MtZGlzcGxheVwiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvVGFza3MvVmlld3MvdGFza3MuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcInRhc2tzTG9hZENvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInRhc2tzTG9hZEN0cmxcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgXHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC50YXNrcy5jcmVhdGVcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jcmVhdGVcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIi9BcHAvVGFza3MvVmlld3MvdGFza3MuYWRkLnRhc2suaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJ0YXNrQ3JlYXRlQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiBcInRhc2tDcmVhdGVDdHJsXCJcclxuICAgICAgICAgICAgfSk7XHJcbn1dKSIsIihmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIudGFza3NcIikuY29udHJvbGxlcihcInRhc2tDcmVhdGVDb250cm9sbGVyXCIsIHRhc2tDcmVhdGVDdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiB0YXNrQ3JlYXRlQ3RybCh0YXNrSWQsIHByb2plY3RJZCwgJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgJG1kRGlhbG9nLCB0YXNrRmFjdG9yeSwgYXBwRGF0YUZhY3RvcnkpIHtcclxuICAgICAgICB2YXIgY29udHJvbGxlciA9ICRzY29wZTtcclxuICAgICAgICBcclxuICAgICAgICBjb250cm9sbGVyLnRhc2sgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyLnRhc2sucHJvamVjdElkID0gcHJvamVjdElkO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnRyb2xsZXIucHJvamVjdHNTcmMgPSBbXTtcclxuICAgICAgICBjb250cm9sbGVyLmFjY291bnRzU3JjID0gW107XHJcblxyXG4gICAgICAgIC8vIG1ldGhvZCBleHBvc3VyZVxyXG4gICAgICAgIGNvbnRyb2xsZXIuc2F2ZSA9IHNhdmU7XHJcbiAgICAgICAgY29udHJvbGxlci5jYW5jZWwgPSBjYW5jZWw7XHJcbiAgICAgICAgY29udHJvbGxlci5jbG9zZSA9IGNsb3NlO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplXHJcbiAgICAgICAgaW5pdCgpO1xyXG4gICAgICAgIHBvcHVsYXRlRHJvcGRvd25zKCk7XHJcblxyXG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzYyBsb2FkIGluaXRhbCBkYXRhIGZvciBjcmVhdGUgZm9ybVxyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0YXNrSWQgIT0gMCkgXHJcbiAgICAgICAgICAgICAgICB0YXNrRmFjdG9yeVxyXG4gICAgICAgICAgICAgICAgICAgLmdldFRhc2tCeUlkKHRhc2tJZClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihwcm9jZXNzVGFzayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzVGFzayh0YXNrKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIudGFzayA9IHRhc2suZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjIG1ldGhvZCB0byBoYW5kbGUgc2F2ZSBldmVudFxyXG4gICAgICAgICAqIEByZXR1cm5zIHt9IFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVIYW5kbGVkKCkge1xyXG4gICAgICAgICAgICB0YXNrRmFjdG9yeS51cGxvYWQoY29udHJvbGxlci50YXNrKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2MgcG9wdWxhdGUgZHJvcCBkb3duIGxpc3RzIGZvciB0aGUgY3JlYXRlIGZvcm1cclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBwb3B1bGF0ZURyb3Bkb3ducygpIHtcclxuICAgICAgICAgICAgY2xlYXJEcm9wZG93bnMoKTtcclxuXHJcbiAgICAgICAgICAgIGFwcERhdGFGYWN0b3J5XHJcbiAgICAgICAgICAgICAgICAuZ2V0UHJvamVjdHMoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocHJvY2Vzc1Byb2plY3RzKTtcclxuXHJcbiAgICAgICAgICAgIGFwcERhdGFGYWN0b3J5XHJcbiAgICAgICAgICAgICAgICAuZ2V0QWNjb3VudHMoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocHJvY2Vzc0FjY291bnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gcHJvY2Vzc1Byb2plY3RzKHByb2plY3RzKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb2plY3RzLmRhdGEgPT09IFwib2JqZWN0XCIpIFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5wcm9qZWN0c1NyYyA9IHByb2plY3RzLmRhdGFbMF07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzU3JjID0gcHJvamVjdHMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NBY2NvdW50cyhhY2NvdW50cykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhY2NvdW50cy5kYXRhID09PSBcIm9iamVjdFwiKVxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5hY2NvdW50c1NyYyA9IGFjY291bnRzLmRhdGFbMF07XHJcblxyXG4gICAgICAgICAgICBjb250cm9sbGVyLmFjY291bnRzU3JjID0gYWNjb3VudHMuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFyRHJvcGRvd25zKCkge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnByb2plY3RzU3JjID0gW107XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWNjb3VudHNTcmMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdvVG9UYXNrcygpIHtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLnRhc2tzLmRpc3BsYXlcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBkaWFsb2cgbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIHNhdmVIYW5kbGVkKCk7XHJcbiAgICAgICAgICAgIGNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FuY2VsKCkge1xyXG4gICAgICAgICAgICAkbWREaWFsb2cuY2FuY2VsKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlKCkge1xyXG4gICAgICAgICAgICBnb1RvVGFza3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHRhc2tDcmVhdGVDdHJsLiRpbmplY3QgPSBbXCJ0YXNrSWRcIiwgXCJwcm9qZWN0SWRcIiwgXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkc3RhdGVQYXJhbXNcIiwgXCIkbWREaWFsb2dcIiwgXCJ0YXNrRmFjdG9yeVwiLCBcImFwcERhdGFGYWN0b3J5XCJdO1xyXG5cclxufSkoYW5ndWxhcik7IiwiKGZ1bmN0aW9uKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci50YXNrc1wiKS5jb250cm9sbGVyKFwidGFza3NMb2FkQ29udHJvbGxlclwiLCB0YXNrc0xvYWRDdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiB0YXNrc0xvYWRDdHJsKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRxLCAkZmlsdGVyLCAkbWREaWFsb2csIHRhc2tGYWN0b3J5KSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSB7fTtcclxuICAgICAgICBjb250cm9sbGVyLnRhc2tzID0gW107XHJcbiAgICAgICAgY29udHJvbGxlci5wZXJzb25hbCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlzTG9hZGluZyhmYWxzZSk7IC8vIGdldCB0aGlzIHdvcmtpbmchISFcclxuXHJcbiAgICAgICAgLy9tZXRob2QgZXhwb3N1cmVcclxuICAgICAgICBjb250cm9sbGVyLmZpbHRlckxvYWQgPSBmaWx0ZXJMb2FkO1xyXG4gICAgICAgIGNvbnRyb2xsZXIub3BlbkNyZWF0ZURpYWxvZyA9IG9wZW5DcmVhdGVEaWFsb2c7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpc2UgZGF0YVxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBvcGVuIHRoZSBhZGQgdGFzayBkaWFsb2dcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBvcGVuQ3JlYXRlRGlhbG9nKHRhc2tJZCkge1xyXG5cclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ0FwcC9UYXNrcy9WaWV3cy90YXNrcy5hZGQudGFzay5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwidGFza0NyZWF0ZUNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNsaWNrT3V0c2lkZVRvQ2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBmdWxsc2NyZWVuOiAhMCwgLy8gT25seSBmb3IgLXhzLCAtc21cclxuICAgICAgICAgICAgICAgIGxvY2Fsczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhc2tJZDogdGFza0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3RJZDogMCAvLyB1c2VkIGZvciBjcmVhdGUgbWV0aG9kIG9uIHByb2plY3RzIHBhZ2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICBsb2FkRGF0YShjb250cm9sbGVyLnBlcnNvbmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyTG9hZCgpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlci5wZXJzb25hbCA9ICFjb250cm9sbGVyLnBlcnNvbmFsO1xyXG4gICAgICAgICAgICBsb2FkRGF0YShjb250cm9sbGVyLnBlcnNvbmFsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZSBsaXN0IG9mIHRhc2tzIGZyb20gc2VydmVyXHJcbiAgICAgICAgICogQHBhcmFtIHt9IHBlcnNvbmFsIC0gdG9nZ2xlcyBiZXR3ZWVuIHRoZSBhY2NvdW50cyB0YXNrcyBhbmQgdGhlIHdob2xlIHRlYW1zXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZERhdGEocGVyc29uYWwpIHtcclxuICAgICAgICAgICAgY2xlYXIoKTtcclxuICAgICAgICAgICAgaXNMb2FkaW5nKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlkID0gcGVyc29uYWwgPyAxIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHRhc2tGYWN0b3J5LmdldFRhc2tzKGlkKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocHJvY2Vzc1Rhc2tzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NUYXNrcyh0YXNrcykge1xyXG4gICAgICAgICAgICBpZiAodGFza3MgPT09IHVuZGVmaW5lZCB8fCB0YXNrcyA9PT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0YXNrcy5kYXRhID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLnRhc2tzID0gdGFza3MuZGF0YVswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLnRhc2tzID0gdGFza3MuZGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBjbGVhciB0aGUgZXhpc3RpbmcgY29sbGVjdGlvbiByZWFkeSB0byBsb2FkIHRhc2tzXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIudGFza3MgPSBbXTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc0xvYWRpbmcobG9hZGluZykge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmlzTG9hZGluZyA9IGxvYWRpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB0YXNrc0xvYWRDdHJsLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkc3RhdGVQYXJhbXNcIiwgXCIkcVwiLCBcIiRmaWx0ZXJcIiwgXCIkbWREaWFsb2dcIiwgXCJ0YXNrRmFjdG9yeVwiXTtcclxuXHJcbn0pKGFuZ3VsYXIpOyIsIihmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIudGFza3NcIikuZmFjdG9yeShcInRhc2tGYWN0b3J5XCIsIHRhc2tGYWN0b3J5KTtcclxuXHJcbiAgICBmdW5jdGlvbiB0YXNrRmFjdG9yeSgkaHR0cCwgJHEsICRjb29raWVzLCAkaHR0cEFib3J0YWJsZSwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBhcGlVcmw6IGNvbmZpZy50YXNrcy5wYXRoXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB1cGxvYWQ6IHVwbG9hZCxcclxuICAgICAgICAgICAgZ2V0VGFza3M6IGdldFRhc2tzLFxyXG4gICAgICAgICAgICBnZXRUYXNrQnlJZDogZ2V0VGFza0J5SWQsXHJcbiAgICAgICAgICAgIGdldEJhY2tsb2c6IGdldEJhY2tsb2dcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZChtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG1vZGVsLnRhc2tJZCA9PT0gXCJ1bmRlZmluZWRcIiA/IGNyZWF0ZShtb2RlbCkgOiB1cGRhdGUobW9kZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2MgY3JlYXRlIGEgdGFza1xyXG4gICAgICAgICAqIEBwYXJhbSB7fSBtb2RlbCBcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjcmVhdGUobW9kZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi9jcmVhdGUvdGFza1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0obW9kZWwpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2MgdXBkYXRlIHRhc2sgZGV0YWlsc1xyXG4gICAgICAgICAqIEBwYXJhbSB7fSBtb2RlbCBcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUobW9kZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogc2V0dGluZ3MuYXBpVXJsICsgXCIvdXBkYXRlL3Rhc2tcIixcclxuICAgICAgICAgICAgICAgIGRhdGE6ICQucGFyYW0obW9kZWwpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGFza3MgZ2V0IG1ldGhvZHNcclxuICAgICAgICBmdW5jdGlvbiBnZXRUYXNrcyhpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHBBYm9ydGFibGUucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi9nZXQvdGFza3M/YWNjb3VudElkPVwiICsgaWRcclxuICAgICAgICAgICAgfSkudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2MgR2V0IHRhc2sgd2l0aCB0aGUgc3BlY2lmaWVkIElkIFxyXG4gICAgICAgICAqIEBwYXJhbSB7fSB0YXNrSWQgXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGFza0J5SWQoaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5hcGlVcmwgKyBcIi9nZXQvdGFzaz90YXNrSWQ9XCIgKyBpZFxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgLy8gYmFja2xvZyB0YXNrcyBnZXQgbWV0aG9kc1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEJhY2tsb2coaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHVybDogc2V0dGluZ3MuYXBpVXJsICsgXCIvZ2V0L2JhY2tsb2c/YWNjb3VudElkPVwiICsgaWRcclxuICAgICAgICAgICAgfSkudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGhhbmRsZXIgY2F1Z2h0IGV4Y2VwdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRhc2tGYWN0b3J5LiRpbmplY3QgPSBbXCIkaHR0cFwiLCBcIiRxXCIsIFwiJGNvb2tpZXNcIiwgXCIkaHR0cEFib3J0YWJsZVwiLCBcImFwaUNvbmZpZ0ZhY3RvcnlcIl07XHJcblxyXG59KShhbmd1bGFyKTsiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5hbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLm92ZXJ2aWV3XCIsIFtcInVpLnJvdXRlclwiXSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlci5vdmVydmlld1wiKS5jb25maWcoY29uZmlnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb25maWcoc3RhdGVQcm92aWRlcikge1xyXG5cclxuICAgICAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zdGF0ZShcImFwcC5vdmVydmlld1wiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL292ZXJ2aWV3XCIsXHJcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBcIjx1aS12aWV3Lz5cIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhcHAub3ZlcnZpZXcucGVyc29uYWxcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9wZXJzb25hbC1vdmVydmlld1wiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiQXBwL092ZXJ2aWV3L1BlcnNvbmFsL1ZpZXdzL3BlcnNvbmFsLm92ZXJ2aWV3Lmh0bWxcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhcHAub3ZlcnZpZXcudGVhbVwiLCB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3RlYW0tb3ZlcnZpZXdcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIkFwcC9PdmVydmlldy9UZWFtL1ZpZXdzL3RlYW0ub3ZlcnZpZXcuaHRtbFwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gW1wiJHN0YXRlUHJvdmlkZXJcIl07XHJcblxyXG59KShhbmd1bGFyKTsiLCJhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmJhY2tsb2dcIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuYmFja2xvZ1wiKS5jb25maWcoW1xyXG5cIiRzdGF0ZVByb3ZpZGVyXCIsXHJcbmZ1bmN0aW9uIChzdGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZShcImFwcC5iYWNrbG9nXCIsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi9iYWNrbG9nXCIsXHJcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogXCI8dWktdmlldy8+XCJcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKFwiYXBwLmJhY2tsb2cuZGlzcGxheVwiLCB7XHJcbiAgICAgICAgICAgIHVybDogXCIvYmFja2xvZy1kaXNwbGF5XCIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIkFwcC9CYWNrbG9nL1ZpZXdzL2JhY2tsb2cuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBcImJhY2tsb2dMb2FkQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYmFja2xvZ0xvYWRDdHJsXCJcclxuICAgICAgICB9KTtcclxuICAgIFxyXG59XSkiLCIoZnVuY3Rpb24oYW5ndWxhcikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmJhY2tsb2dcIikuY29udHJvbGxlcihcImJhY2tsb2dMb2FkQ29udHJvbGxlclwiLCBiYWNrbG9nTG9hZEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhY2tsb2dMb2FkQ3RybCgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkcSwgJGZpbHRlciwgJG1kRGlhbG9nLCB0YXNrRmFjdG9yeSkge1xyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0ge307XHJcbiAgICAgICAgY29udHJvbGxlci5iYWNrbG9nID0gW107XHJcbiAgICAgICAgY29udHJvbGxlci5wZXJzb25hbCA9IHRydWU7XHJcbiAgICAgICAgaXNMb2FkaW5nKGZhbHNlKTsgLy8gZ2V0IHRoaXMgd29ya2luZyEhIVxyXG5cclxuICAgICAgICAvL21ldGhvZCBleHBvc3VyZVxyXG4gICAgICAgIGNvbnRyb2xsZXIuZmlsdGVyTG9hZCA9IGZpbHRlckxvYWQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gaW5pdGlhbGlzZSBkYXRhXHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgbG9hZERhdGEoY29udHJvbGxlci5wZXJzb25hbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbHRlckxvYWQoKSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIucGVyc29uYWwgPSAhY29udHJvbGxlci5wZXJzb25hbDtcclxuICAgICAgICAgICAgbG9hZERhdGEoY29udHJvbGxlci5wZXJzb25hbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmUgbGlzdCBvZiBiYWNrbG9nZ2VkIHRhc2tzIGZyb20gc2VydmVyXHJcbiAgICAgICAgICogQHBhcmFtIHt9IHBlcnNvbmFsIC0gdG9nZ2xlcyBiZXR3ZWVuIHRoZSBhY2NvdW50cyB0YXNrcyBhbmQgdGhlIHdob2xlIHRlYW1zXHJcbiAgICAgICAgICogQHJldHVybnMge30gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZERhdGEocGVyc29uYWwpIHtcclxuICAgICAgICAgICAgY2xlYXIoKTtcclxuICAgICAgICAgICAgaXNMb2FkaW5nKHRydWUpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGlkID0gcGVyc29uYWwgPyAxIDogbnVsbDsgLy8gZWRpdCB0aGlzIHRvIGJlIHRoZSBsb2dnZWQgaW4gYWNjb3VudHMgSWRcclxuXHJcbiAgICAgICAgICAgIHRhc2tGYWN0b3J5LmdldEJhY2tsb2coaWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihwcm9jZXNzQmFja2xvZyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzQmFja2xvZyh0YXNrcykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YXNrcy5kYXRhKTtcclxuICAgICAgICAgICAgaWYgKHRhc2tzID09PSB1bmRlZmluZWQgfHwgdGFza3MgPT09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGFza3MuZGF0YSA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5iYWNrbG9nID0gdGFza3MuZGF0YVswXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpc0xvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICBjb250cm9sbGVyLmJhY2tsb2cgPSB0YXNrcy5kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIGNsZWFyIHRoZSBleGlzdGluZyBjb2xsZWN0aW9uIHJlYWR5IHRvIGxvYWQgdGFza3NcclxuICAgICAgICAgKiBAcmV0dXJucyB7fSBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlci5iYWNrbG9nID0gW107XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNMb2FkaW5nKGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgY29udHJvbGxlci5pc0xvYWRpbmcgPSBsb2FkaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYmFja2xvZ0xvYWRDdHJsLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkc3RhdGVcIiwgXCIkc3RhdGVQYXJhbXNcIiwgXCIkcVwiLCBcIiRmaWx0ZXJcIiwgXCIkbWREaWFsb2dcIiwgXCJ0YXNrRmFjdG9yeVwiXTtcclxuXHJcbn0pKGFuZ3VsYXIpOyIsImFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY2FsZW5kYXJcIiwgW1widWkucm91dGVyXCJdKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXIuY2FsZW5kYXJcIikuY29uZmlnKFtcclxuICAgIFwiJHN0YXRlUHJvdmlkZXJcIixcclxuICAgIGZ1bmN0aW9uIChzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgc3RhdGVQcm92aWRlclxyXG4gICAgICAgICAgICAuc3RhdGUoXCJhcHAuY2FsZW5kYXJcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYWxlbmRhclwiLFxyXG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCI8dWktdmlldy8+XCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLnN0YXRlKFwiYXBwLmNhbGVuZGFyLmRpc3BsYXlcIiwge1xyXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9jYWxlbmRhci1kaXNwbGF5XCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvQ2FsZW5kYXIvVmlld3MvY2FsZW5kYXIuaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJjYWxlbmRhckNvbnRyb2xsZXJcIixcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJjYWxlbmRhckN0cmxcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1dKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyLmNhbGVuZGFyXCIpLmNvbnRyb2xsZXIoXCJjYWxlbmRhckNvbnRyb2xsZXJcIiwgW1xyXG4gICAgICAgIFwiJHNjb3BlXCIsXHJcbiAgICAgICAgXCIkc3RhdGVcIixcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgY29udHJvbGxlciA9IHt9O1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogYW5ndWxhciBtb2R1bGUgZGVjbGFyYXRpb25cclxuICovXHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXJcIiwgW1xyXG4gICAgXCJuZ1wiLFxyXG4gICAgXCJuZ0Nvb2tpZXNcIixcclxuICAgIFwibmdNYXRlcmlhbFwiLFxyXG4gICAgXCJodHRwVXRpbHNcIixcclxuICAgIFwidWkucm91dGVyXCIsXHJcbiAgICBcInVpLmJyZWFkY3J1bWJzXCIsXHJcbiAgICBcIkxvY2FsU3RvcmFnZU1vZHVsZVwiLFxyXG4gICAgXCJ0YXNrbWFuYWdlci5jb25maWdcIixcclxuICAgIFwidGFza21hbmFnZXIuY29tcG9uZW50c1wiLFxyXG4gICAgLy9cInRhc2ttYW5hZ2VyLmF1dGhlbnRpY2F0aW9uXCIsXHJcbiAgICBcInRhc2ttYW5hZ2VyLmNhbGVuZGFyXCIsXHJcbiAgICBcInRhc2ttYW5hZ2VyLnByb2plY3RzXCIsXHJcbiAgICBcInRhc2ttYW5hZ2VyLnRhc2tzXCIsXHJcbiAgICBcInRhc2ttYW5hZ2VyLm92ZXJ2aWV3XCIsXHJcbiAgICBcInRhc2ttYW5hZ2VyLmJhY2tsb2dcIlxyXG5dKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXJcIikuY29uZmlnKFtcclxuICAgIFwiJHN0YXRlUHJvdmlkZXJcIixcclxuICAgIFwiJHVybFJvdXRlclByb3ZpZGVyXCIsXHJcbiAgICBcIiRodHRwUHJvdmlkZXJcIixcclxuICAgIFwibG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyXCIsXHJcbiAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZVByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlUHJvdmlkZXIpIHtcclxuXHJcbiAgICAgICAgLy8gZGVmYXVsdCByb290IG9uIGFwcCBzdGFydFxyXG4gICAgICAgICR1cmxSb3V0ZVByb3ZpZGVyLm90aGVyd2lzZShcIi9hcHAvcHJvamVjdHMvcHJvamVjdHMtZGlzcGxheVwiKTtcclxuXHJcbiAgICAgICAgLy8gIGNvbmZpZ3VyZSBsb2NhbCBzdG9yYWdlXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC5zZXRQcmVmaXgoXCJ0YXNrbWFuYWdlclwiKVxyXG4gICAgICAgICAgICAuc2V0U3RvcmFnZVR5cGUoXCJzZXNzaW9uU3RvcmFnZVwiKVxyXG4gICAgICAgICAgICAuc2V0Tm90aWZ5KHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAvLyAgcm9vdCBsZXZlbCB2aWV3IFxyXG4gICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoXCJhcHBcIiwge1xyXG4gICAgICAgICAgICB1cmw6IFwiL2FwcFwiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJBcHAvQXBwL1ZpZXdzL2FwcC5pbmRleC5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IFwiYXBwQ29udHJvbGxlclwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6IFwiYXBwQ3RybFwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIC8vICBpbmplY3QgaHR0cCBpbnRlcmNlcHRvcnNcclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFwiaHR0cEludGVyY2VwdG9yXCIpO1xyXG4gICAgfVxyXG5dKTtcclxuXHJcbi8qKlxyXG4gKiBsYXVuY2ggdGhlIGFwcFxyXG4gKi9cclxuYW5ndWxhci5tb2R1bGUoXCJ0YXNrbWFuYWdlclwiKS5ydW4oW1xyXG4gICAgXCIkcm9vdFNjb3BlXCIsXHJcbiAgICBcIiRzdGF0ZVwiLFxyXG4gICAgXCIkc3RhdGVQYXJhbXNcIixcclxuICAgIFwiJGxvY2F0aW9uXCIsXHJcbiAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRsb2NhdGlvbikge1xyXG4gICAgICBcclxuICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcclxuICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcclxuXHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoXCIvYXBwL292ZXJ2aWV3L3BlcnNvbmFsLW92ZXJ2aWV3XCIpO1xyXG4gICAgfVxyXG5dKTsiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiOyBcclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXJcIikuY29udHJvbGxlcihcImFwcENvbnRyb2xsZXJcIiwgYXBwQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gYXBwQ3RybCgkc2NvcGUsICRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBjb250cm9sbGVyID0ge307XHJcblxyXG4gICAgICAgIC8vIHJldHVyblxyXG4gICAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcEN0cmwuJGluamVjdCA9IFsgXCIkc2NvcGVcIiwgXCIkc3RhdGVcIl07XHJcbn0pKGFuZ3VsYXIpO1xyXG4iLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwidGFza21hbmFnZXJcIikuZmFjdG9yeShcImFwcERhdGFGYWN0b3J5XCIsIGFwcERhdGFGYWN0b3J5KTtcclxuXHJcbiAgICBmdW5jdGlvbiBhcHBEYXRhRmFjdG9yeSgkaHR0cCwgJHEsICRodHRwQWJvcnRhYmxlLCBsb2NhbFN0b3JhZ2UsIGNvbmZpZykge1xyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgc3lzdGVtQXBpVXJsOiBjb25maWcuc3lzdGVtLnBhdGgsXHJcbiAgICAgICAgICAgIHByb2plY3RzQXBpVXJsOiBjb25maWcucHJvamVjdHMucGF0aCxcclxuICAgICAgICAgICAgdGFza3NBcGlVcmw6IGNvbmZpZy50YXNrcy5wYXRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvLyBhY2NvdW50c1xyXG4gICAgICAgICAgICBnZXRBY2NvdW50czogZ2V0QWNjb3VudHMsXHJcbiAgICAgICAgICAgIGdldEFjY291bnRCeUlkOiBnZXRBY2NvdW50QnlJZCxcclxuICAgICAgICAgICAgLy8gcHJvamVjdHNcclxuICAgICAgICAgICAgZ2V0UHJvamVjdHM6IGdldFByb2plY3RzLFxyXG4gICAgICAgICAgICBnZXRQcm9qZWN0QnlJZDogZ2V0UHJvamVjdEJ5SWRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBhY2NvdW50IGdldCBtZXRob2RzXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QWNjb3VudHMoKSB7XHJcbiAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5zeXN0ZW1BcGlVcmwgKyBcIi9nZXQvYWNjb3VudHNcIlxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjY291bnRCeUlkKGFjY291bnRJZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHBBYm9ydGFibGUucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IHNldHRpbmdzLnN5c3RlbUFwaVVybCArIFwiL2dldC9hY2NvdW50P2FjY291bnRJZD1cIiArIGFjY291bnRJZFxyXG4gICAgICAgICAgICB9KS50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3JIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHByb2plY3QgZ2V0IG1ldGhvZHNcclxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcclxuICAgICAgICAgICAgcmV0dXJuICRodHRwQWJvcnRhYmxlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXR0aW5ncy5wcm9qZWN0c0FwaVVybCArIFwiL2dldC9wcm9qZWN0c1wiXHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzb2x2ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvckhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UHJvamVjdEJ5SWQocHJvamVjdElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cEFib3J0YWJsZS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgIHVybDogc2V0dGluZ3MucHJvamVjdHNBcGlVcmwgKyBcIi9nZXQvcHJvamVjdD9wcm9qZWN0SWQ9XCIgKyBwcm9qZWN0SWRcclxuICAgICAgICAgICAgfSkudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9ySGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZXNvbHZlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVycm9ySGFuZGxlcihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGhhbmRsZXIgY2F1Z2h0IGV4Y2VwdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhcHBEYXRhRmFjdG9yeS4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCIkcVwiLCBcIiRodHRwQWJvcnRhYmxlXCIsIFwibG9jYWxTdG9yYWdlU2VydmljZVwiLCBcImFwaUNvbmZpZ0ZhY3RvcnlcIl07XHJcblxyXG59KShhbmd1bGFyKTsiLG51bGwsIihmdW5jdGlvbihhbmd1bGFyKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZShcInRhc2ttYW5hZ2VyXCIpLmZhY3RvcnkoXCJodHRwSW50ZXJjZXB0b3JcIiwgaHR0cEludGVyY2VwdG9yKTtcclxuXHJcbiAgICBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3IoJHEsICRsb2NhdGlvbikge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3QsXHJcbiAgICAgICAgICAgIHJlcXVlc3RFcnJvcjogcmVxdWVzdEVycm9yLFxyXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2UsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IHJlc3BvbnNlRXJyb3JcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogaW50ZXJjZXB0IGh0dHAgcmVxdWVzdHNcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAcmV0dXJuIHByb21pc2VcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVlc3QocmVxKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVxKTtcclxuICAgICAgICAgICAgcmVxLmhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiO1xyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBjb25maWcgb3Igd3JhcCBpdCBpbiBhIHByb21pc2UgaWYgYmxhbmsuXHJcbiAgICAgICAgICAgIHJldHVybiByZXEgfHwgJHEud2hlbihyZXEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBpbnRlcmNlcHQgaHR0cCByZXF1ZXN0IGVycm9yc1xyXG4gICAgICAgICpcclxuICAgICAgICAqIEByZXR1cm4gcHJvbWlzZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcmVxdWVzdEVycm9yKHJlamVjdGlvbikge1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlamVjdGlvbik7IC8vIENvbnRhaW5zIHRoZSBkYXRhIGFib3V0IHRoZSBlcnJvciBvbiB0aGUgcmVxdWVzdC5cclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgcHJvbWlzZSByZWplY3Rpb24uXHJcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogaW50ZXJjZXB0IGh0dHAgcmVzcG9uc2VcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAcmV0dXJuIHByb21pc2VcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlcykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7IC8vIENvbnRhaW5zIHRoZSBkYXRhIGZyb20gdGhlIHJlc3BvbnNlLlxyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSByZXNwb25zZSBvciBwcm9taXNlLlxyXG4gICAgICAgICAgICByZXR1cm4gcmVzIHx8ICRxLndoZW4ocmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogaW50ZXJjZXB0IGh0dHAgcmVzcG9uc2UgZmFpbHVyZXNcclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAcmV0dXJuIHByb21pc2VcclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlRXJyb3IocmVqZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVqZWN0aW9uKTsgLy8gQ29udGFpbnMgdGhlIGRhdGEgYWJvdXQgdGhlIGVycm9yLlxyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICAgICAgICAvL2x4Tm90aWZpY2F0aW9uU2VydmljZS5lcnJvcihcIkVycm9yIFwiICsgcmVqZWN0aW9uLnN0YXR1cyArIFwiIG9jY3VyZWQsIHdpdGggcmVhc29uOiBcIiArIHJlamVjdGlvbi5kYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHByb21pc2UgcmVqZWN0aW9uLlxyXG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGh0dHBJbnRlcmNlcHRvci4kaW5qZWN0ID0gW1wiJHFcIiwgXCIkbG9jYXRpb25cIl07XHJcbn0pKGFuZ3VsYXIpO1xyXG5cclxuIl19
