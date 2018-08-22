angular.module("taskmanager.config", ["ng"]);

angular.module("taskmanager.config").factory("apiConfigFactory", [
    function() {
        return {
            projects: { path: window.location.protocol + "//localhost:57739/api" },
            system: { path: window.location.protocol + "//localhost:55362/api" },
            tasks: { path: window.location.protocol + "//localhost:57765/api" }
        }
    }
]);