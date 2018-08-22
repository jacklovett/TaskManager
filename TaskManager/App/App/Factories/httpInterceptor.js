(function(angular) {
    angular.module("taskmanager").factory("httpInterceptor", httpInterceptor);

    function httpInterceptor($q, $location) {
        return {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        }

        /**
        * intercept http requests
        *
        * @return promise
        */
        function request(req) {
            //console.log(req);
            req.headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";

            // Return the config or wrap it in a promise if blank.
            return req || $q.when(req);
        }

        /**
        * intercept http request errors
        *
        * @return promise
        */
        function requestError(rejection) {
           // console.log(rejection); // Contains the data about the error on the request.

            // Return the promise rejection.
            return $q.reject(rejection);
        }

        /**
        * intercept http response
        *
        * @return promise
        */
        function response(res) {
            //console.log(res); // Contains the data from the response.

            // Return the response or promise.
            return res || $q.when(res);
        }

        /**
        * intercept http response failures
        *
        * @return promise
        */
        function responseError(rejection) {
            //console.log(rejection); // Contains the data about the error.

            if (response.status === 403) {
                //lxNotificationService.error("Error " + rejection.status + " occured, with reason: " + rejection.data.message);
            }

            // Return the promise rejection.
            return $q.reject(rejection);
        }
    }

    httpInterceptor.$inject = ["$q", "$location"];
})(angular);

