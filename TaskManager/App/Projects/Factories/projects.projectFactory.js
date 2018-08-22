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
            })
                .then(resolve)
                .catch(errorHandler);
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
            })
            .then(resolve)
            .catch(errorHandler);
        }

        // projects get methods
        function getProjects() {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/projects"
            }).then(resolve)
                .catch(errorHandler);
        }

        function getProjectById(projectId) {
            return $httpAbortable.request({
                method: "GET",
                url: settings.apiUrl + "/get/project?projectId=" + projectId
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

    projectFactory.$inject = ["$http", "$q", "$cookies", "$httpAbortable", "apiConfigFactory"];

})(angular);
