(function(angular) {
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

            taskFactory.getTasks(id)
                .then(processTasks);
        }

        function processTasks(tasks) {
            if (tasks === undefined || tasks === null) return;

            if (typeof tasks.data === "object") {
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