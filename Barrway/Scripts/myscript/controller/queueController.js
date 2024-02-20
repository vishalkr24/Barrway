
(function () {
    'use strict';

    FormGeneratorApp.controller('queueController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        var chat = $.connection.queueManager;
        var isHubConnected = false;

        // general functions and declarations
        $(document).on("click", ".session-row-element", function () {
            $(".session-row-element").removeClass("active");
            $(this).addClass("active");

            $scope.currentSession = $scope.sessionList.find(x => x.Id == $(this).attr("session-element-id"))
            $scope.bindSessionData();
        });

        $(document).on("click", "input[name=queue-activator-trigger]", function () {
            let queueId = $(this).attr("id").split('-')[1];
            let value = ($(this).is(":checked")) ? 'Y' : 'N';
            chat.server.updateQueueActivationStatus(String(queueId), String(value));
        });

        $(document).on("click", "#queue-summary-nav-btn", function () {
            $("#queue-summary-section").show();
            $("#queue-section").hide();
            $("#queue-summary-nav-btn").addClass("active");
            $("#queue-list-nav-btn").removeClass("active")
        });

        $(document).on("click", "#queue-list-nav-btn", function () {
            $("#queue-summary-section").hide();
            $("#queue-section").show();
            $("#queue-summary-nav-btn").removeClass("active");
            $("#queue-list-nav-btn").addClass("active")
        });

        $scope.bindSessionData = function () {
            $(".session-name").text($scope.currentSession.SESSION_NAME);
            $scope.getQueueList();
        }

        $scope.UpdateQueueSchedular = function () {
            window.location.href = "/BusinessAdmin/SetupCalendarEvent?CompanyId=" + localStorage.getItem("COMPANY_ID") + "&&CalendarCode=" + localStorage.getItem("CALENDAR_CODE") + "&&Step=3";
        }

        $scope.ShowLoading = function () {
            $scope.showLoader1 = false;
        }

        $scope.HideLoading = function () {
            $scope.showLoader1 = true;
        }

        $scope.init = function () {
            $scope.$proxyScope = angular.element($('#quequeDiv')).scope();
            $scope.sessionList = [];
            $scope.queueList = [];
            $scope.showLoader1 = true;
            console.log(chat);
            $scope.ShowLoading();
            $scope.getQueueList();
        };

        // establish Signalr Connection
        $scope.StartSignalRConnection = function () {
            if (!isHubConnected) {
                $.connection.hub.start().done(function () {
                    isHubConnected = true;
                    $scope.init();
                });
            } else {
                $scope.init();
            }
        }





        //Functions to send request to server
        $scope.getSessionList = function () {
            chat.server.getSessionList(String(localStorage.getItem("CALENDAR_CODE")), String(localStorage.getItem("COMPANY_CODE")));
        }

        $scope.getCurrentSession = function () {
            chat.server.getCurrentSession(String(localStorage.getItem("CALENDAR_CODE")), String(localStorage.getItem("COMPANY_CODE")));
        }

        $scope.getQueueList = function () {
            chat.server.getQueueList(String(localStorage.getItem("CALENDAR_CODE")), String(localStorage.getItem("COMPANY_CODE")), false);
        }






        //Functions to receive response from server
        chat.client.showErrorResult = function (response) {
            notifierService.notifyMessage("error", "Error", response.Message);
        };

        chat.client.showWarningResult = function (response) {
            notifierService.notifyMessage("warning", "Warning", response.Message);
        };

        chat.client.showSuccessResult = function (response) {
            let msg = response.Message;
            notifierService.notifyMessage("success", "Success", msg);
        };

        chat.client.ShowLoading = function (response) {
            $scope.ShowLoading();
        }

        chat.client.updateQueues = function (response) {
            if (response.Status) {
                angular.element($('#quequeDiv')).scope().queueList = response.Data;
                $scope.HideLoading();
            }
        }

        chat.client.updateCurrentSession = function (response) {
            debugger;
            $scope.currentSession = response.Data[0];
            $scope.bindSessionData();
        }

        chat.client.updateSessions = function (response) {

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

        $scope.StartSignalRConnection();
    });

}(FormGeneratorApp));