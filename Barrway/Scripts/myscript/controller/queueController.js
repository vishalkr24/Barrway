(function () {
    'use strict';

    FormGeneratorApp.controller('queueController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        
        $scope.init = function () {
            $scope.chat = $.connection.queueManager;
            $.connection.hub.start().done(function () {
                notifierService.notifyMessage("success", "Updating Live!");
            });
        };

        $scope.init();

        //Functions to receive response from server
        $scope.chat.client.addNewMessageToPage = function (name, message) {
            alert(message);
        };

        //Functions to send request to server
        $scope.chat.server.send($('#displayname').val(), $('#message').val());

    });

}(FormGeneratorApp));