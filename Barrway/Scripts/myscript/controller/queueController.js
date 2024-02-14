(function () {
    'use strict';

    FormGeneratorApp.controller('queueController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        //Functions to send request to server
        $scope.getSessionList = function () {

            $scope.chat.server.getSessionList(String(localStorage.getItem("CALENDAR_CODE")), String(localStorage.getItem("COMPANY_CODE")));
        }

        $scope.chat = $.connection.queueManager;
        $.connection.hub.start().done(function () {
            notifierService.notifyMessage("success", "Updating Live!");
            $scope.getSessionList();
        });

        $scope.init = function () {
            $scope.sessionList = [];
        };

        //Functions to receive response from server
        $scope.chat.client.showErrorResult = function (response) {
            notifierService.notifyMessage("error", "Error", response.Message);
        };

        $scope.chat.client.showWarningResult = function (response) {
            notifierService.notifyMessage("warning", "Warning", response.Message);
        };

        $scope.chat.client.showSuccessResult = function (response) {
            notifierService.notifyMessage("success", "Success", response.Message);
        };

        $scope.chat.client.updateSessions = function (response) {
            if (response.Status) {

                $scope.sessionList = response.Data;

                let binderString = "";
                let count = 1;

                $scope.sessionList.forEach(x => {
                    x.isActive = "true";
                    x.SESSION_START_TIME = moment("10/10/2024 " + x.SESSION_START_TIME).format("hh:mm a");
                    x.SESSION_END_TIME = moment("10/10/2024 " + x.SESSION_END_TIME).format("hh:mm a");

                    if (count == 1) {
                        $scope.currentSession = x;
                    }

                    binderString += `<div session-element-id="${x.Id}" class="session-element session-row-element ${(count == 1) ? "active" : ""}" >
                                        <span>${x.SESSION_NAME}</span><br />
                                        ${x.SESSION_START_TIME} - ${x.SESSION_END_TIME}
                                    </div>`
                    count++;
                });

                $("#session-scroller").empty();
                $("#session-scroller").append(binderString)
                $scope.bindSessionData();
            }
        };

        $(document).on("click", ".session-row-element", function () {
            $(".session-row-element").removeClass("active");
            $(this).addClass("active");

            $scope.currentSession = $scope.sessionList.find(x => x.Id == $(this).attr("session-element-id"))
            $scope.bindSessionData();
        });

        $scope.bindSessionData = function () {
            $(".session-name").text($scope.currentSession.SESSION_NAME);
        }

        $scope.init();

    });

}(FormGeneratorApp));