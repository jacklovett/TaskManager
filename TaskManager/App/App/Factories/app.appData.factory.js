(function (angular) {
    "use strict";

    angular.module("taskmanager").factory("appDataFactory", appDataFactory);

    function appDataFactory($http, $q, $httpAbortable, localStorage, config) {
        var settings = {
            systemApiUrl: config.system.path,
            projectsApiUrl: config.projects.path,
            tasksApiUrl: config.tasks.path
        }

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
            }).then(resolve)
                .catch(errorHandler);
        }

        function getAccountById(accountId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.systemApiUrl + "/get/account?accountId=" + accountId
            }).then(resolve)
                .catch(errorHandler);
        }

        // project get methods
        function getProjects() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.projectsApiUrl + "/get/projects"
            }).then(resolve)
                .catch(errorHandler);
        }

        function getProjectById(projectId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.projectsApiUrl + "/get/project?projectId=" + projectId
            }).then(resolve)
                .catch(errorHandler);
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