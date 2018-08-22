(function(angular) {
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
            if (taskId != 0) 
                taskFactory
                   .getTaskById(taskId)
                    .then(processTask);
        }

        function processTask(task) {
            controller.task = task.data;
        }

        /**
         * @desc method to handle save event
         * @returns {} 
         */
        function saveHandled() {
            taskFactory.upload(controller.task)
                .then(resolve)
                .catch(errorHandler);
        }

        /**
         * @desc populate drop down lists for the create form
         * @returns {} 
         */
        function populateDropdowns() {
            clearDropdowns();

            appDataFactory
                .getProjects()
                .then(processProjects);

            appDataFactory
                .getAccounts()
                .then(processAccounts);
        }
        
        function processProjects(projects) {
            
            if (typeof projects.data === "object") 
                controller.projectsSrc = projects.data[0];
            
            controller.projectsSrc = projects.data;
        }

        function processAccounts(accounts) {

            if (typeof accounts.data === "object")
                controller.accountsSrc = accounts.data[0];

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