(function () {
    'use strict';

    FormGeneratorApp.controller('marketplaceQueueController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {

        $scope.currentCalendarCode = $("#currentCalendarCode").val();
        $scope.currentCompanyCode = $("#currentCompanyCode").val();
        $scope.queueList = [];

        $scope.chat = $.connection.queueManager;
        $.connection.hub.start().done(function () {
            $scope.GetQueueList();
        });

        $scope.GetQueueList = function () {
            $scope.chat.server.getQueueList(String($scope.currentCalendarCode), String($scope.currentCompanyCode));
        }

        $scope.chat.client.updateQueues = function (response) {
            
            if (response.Status) {
                $scope.queueList = response.Data;
            }
        }
    });

}(FormGeneratorApp));