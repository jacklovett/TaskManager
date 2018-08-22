(function(angular) {
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
                })
                .then(resolve)
                .catch(errorHandler);
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
            })
            .then(resolve)
            .catch(errorHandler);
        }

        // tasks get methods
        function getTasks(id) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/get/tasks?accountId=" + id
            }).then(resolve)
           .catch(errorHandler);
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
            }).then(resolve)
                .catch(errorHandler);
        }

       // backlog tasks get methods
        function getBacklog(id) {
            return $httpAbortable.request({
                method: "POST",
                url: settings.apiUrl + "/get/backlog?accountId=" + id
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

    taskFactory.$inject = ["$http", "$q", "$cookies", "$httpAbortable", "apiConfigFactory"];

})(angular);