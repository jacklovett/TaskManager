(function(angular) {
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

            taskFactory.getBacklog(id)
                .then(processBacklog);
        }

        function processBacklog(tasks) {
            console.log(tasks.data);
            if (tasks === undefined || tasks === null) return;

            if (typeof tasks.data === "object") {
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