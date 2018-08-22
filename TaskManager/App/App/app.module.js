"use strict";

/**
 * angular module declaration
 */
angular.module("taskmanager", [
    "ng",
    "ngCookies",
    "ngMaterial",
    "httpUtils",
    "ui.router",
    "ui.breadcrumbs",
    "LocalStorageModule",
    "taskmanager.config",
    "taskmanager.components",
    //"taskmanager.authentication",
    "taskmanager.calendar",
    "taskmanager.projects",
    "taskmanager.tasks",
    "taskmanager.overview",
    "taskmanager.backlog"
]);

angular.module("taskmanager").config([
    "$stateProvider",
    "$urlRouterProvider",
    "$httpProvider",
    "localStorageServiceProvider",
    function ($stateProvider, $urlRouteProvider, $httpProvider, localStorageServiceProvider) {

        // default root on app start
        $urlRouteProvider.otherwise("/app/projects/projects-display");

        //  configure local storage
        localStorageServiceProvider
            .setPrefix("taskmanager")
            .setStorageType("sessionStorage")
            .setNotify(true, true);

        //  root level view 
       $stateProvider
        .state("app", {
            url: "/app",
            templateUrl: "App/App/Views/app.index.html",
            controller: "appController",
            controllerAs: "appCtrl"
        });
            
        //  inject http interceptors
        $httpProvider.interceptors.push("httpInterceptor");
    }
]);

/**
 * launch the app
 */
angular.module("taskmanager").run([
    "$rootScope",
    "$state",
    "$stateParams",
    "$location",
    function ($rootScope, $state, $stateParams, $location) {
      
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $location.path("/app/overview/personal-overview");
    }
]);