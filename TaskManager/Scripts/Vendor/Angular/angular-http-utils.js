(function (angular) {
    "use strict";

    angular.module("httpUtils", ["ng"]).factory("$httpAbortable", httpRequest);

    function httpRequest($http, $q) {
        return {
            request: requestHandler
        }

        function requestHandler(req) {
            var deferredAbort = $q.defer();
            var request = $http(angular.extend({}, req, { timeout: deferredAbort.promise }));

            /**
             * handle resolve/rejection for the request
             */
            var promise = request.then(
                function (response) {
                    return (response);
                },
                function (response) {
                    return ($q.reject(response));
                }
            );

            /**
             * @description about the current http request.
             * @returns {promise} 
             */
            promise.abort = function () {
                deferredAbort.resolve();
            };

            /**
             * cleanup
             */
            promise.finally(function () {
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            });

            return (promise);
        }
    }
    httpRequest.$inject = ["$http", "$q"];

})(angular);