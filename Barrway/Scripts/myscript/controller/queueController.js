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
            return;
        };

        $scope.chat.client.showWarningResult = function (response) {
            notifierService.notifyMessage("warning", "Warning", response.Message);
            return;
        };

        $scope.chat.client.showSuccessResult = function (response) {
            let msg = response.Message;
            notifierService.notifyMessage("success", "Success", msg);
            return;
        };

        $scope.chat.client.updateQueues = function (response) {
            if (response.Status) {
                debugger;
                $scope.queueList = response.Data;

            }
        }

        $scope.chat.client.updateSessions = function (response) {
            
            if (response.Status) {

                $scope.sessionList = response.Data;

                let binderString = "";
                let count = 1;
                if ($scope.sessionList.length > 0) {
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

                    if ($scope.sessionList.length < 5) {
                        binderString += `<div class="session-element" style="padding-top: 16px;" onclick="angular.element(this).scope().UpdateQueueSchedular()">
                                        <span>+ Add session</span><br />
                                    </div>`;
                    }

                    $("#session-scroller").empty();
                    $("#session-scroller").append(binderString)
                    $scope.bindSessionData();
                } else {
                    binderString += `<div class="session-element">
                                        <span>No Sessions Found</span><br />
                                    </div>`;

                    $("#session-scroller").empty();
                    $("#session-scroller").append(binderString)
                }


            }

        };

        $(document).on("click", ".session-row-element", function () {
            $(".session-row-element").removeClass("active");
            $(this).addClass("active");

            $scope.currentSession = $scope.sessionList.find(x => x.Id == $(this).attr("session-element-id"))
            $scope.bindSessionData();
        });

        $(document).on("click", "input[name=queue-activator-trigger]", function () {
            let queueId = $(this).attr("id").split('-')[1];
            let value = ($(this).is(":checked")) ? 'Y' : 'N';
            $scope.chat.server.updateQueueActivationStatus(String(queueId), String(value));
        });

        $scope.bindSessionData = function () {
            $(".session-name").text($scope.currentSession.SESSION_NAME);

            $scope.chat.server.getQueueList(String(localStorage.getItem("CALENDAR_CODE")), String(localStorage.getItem("COMPANY_CODE")));

        }

        $scope.UpdateQueueSchedular = function () {
            window.location.href = "/BusinessAdmin/SetupCalendarEvent?CompanyId=" + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + localStorage.getItem("CALENDAR_CODE") + "&&Step=3";
        }

        $scope.init();

    });

}(FormGeneratorApp));