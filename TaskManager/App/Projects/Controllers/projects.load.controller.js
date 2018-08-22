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
            projectFactory
                .getProjects()
                .then(processProjects);
        }

        function processProjects(projects) {
            if (typeof projects.data === "object") {
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

