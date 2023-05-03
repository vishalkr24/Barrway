var previewApp = angular.module('previewApp', ["ui.router", "ngResource", 'toaster', 'ngAnimate']);


previewApp.controller('formPreviewController', function ($scope, $http, $location, $window) {
    $scope.init = function () {
        console.log('index');
    };
    $scope.init();
});