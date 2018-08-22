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

            if (projectId != 0) 
                projectFactory
                    .getProjectById(projectId)
                    .then(processProject);
        }

        function processProject(project) {
            controller.project = project.data;
        }

        function saveHandled() {
            projectFactory.upload(controller.project)
                .then(resolve)
                .catch(errorHandler);
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