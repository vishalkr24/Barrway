(function () {
    'use strict';

    FormGeneratorApp.controller('marketplaceQueueController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {

        $scope.currentCalendarCode = $("#currentCalendarCode").val();
        $scope.currentCompanyCode = $("#currentCompanyCode").val();
        $scope.currentUserId = $("#currentUserId").val();
        var chat = $.connection.queueManager;
        var isHubConnected = false;

        // general functions and declarations

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

        $scope.bookTicket = function (queueId) {
            $scope.enrollPublicUser(queueId);
        }

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
        $scope.getQueueList = function () {
            chat.server.getMarketplaceQueueList(String($scope.currentCalendarCode), String($scope.currentCompanyCode), false);
        }






        //Functions to receive response from server

        chat.client.ShowMarketplaceLoading = function (response) {
            $scope.ShowLoading();
        }

        chat.client.showMarketplaceErrorResult = function (response) {
            notifierService.notifyMessage("error", "Error", response.Message);
        };

        chat.client.showMarketplaceWarningResult = function (response) {
            notifierService.notifyMessage("warning", "Warning", response.Message);
        };

        chat.client.showMarketplaceSuccessResult = function (response) {
            let msg = response.Message;
            notifierService.notifyMessage("success", "Success", msg);
        };


        chat.client.bookTicketConfirmation = function (response) {
            swal({
                title: "Alert",
                text: response.Message,
                icon: "info",
                buttons: {
                    confirm: "Yes, Confirm",
                    cancel: "No"
                }
            }).then(function (check) {
                if (check) {
                    response.Data.IsApproved = 'Y';

                    chat.server.bookTicket(response.Data);
                }
            })
        }

        chat.client.updateMarketplaceQueues = function (response) {
            debugger;
            if (response.Status) {
                angular.element($('#quequeDiv')).scope().queueList = response.Data;
                $scope.$apply();
                $scope.HideLoading();
            }
        }

        $scope.StartSignalRConnection();


        $scope.enrollPublicUser = function (queueId) {

            $.ajax({
                url: "/Account/CheckPublicUserLogin",
                type: "POST",
                success: function (response) {
                    hideLoader();
                    if (!response.Status) {

                        swal({
                            title: "Login Required",
                            text: "Kindly login into your account and then you can enroll yourself into this calendar.",
                            icon: "info",
                            buttons: {
                                confirm: "Login",
                                cancel: "Leave it"
                            }
                        }).then(function (check) {
                            if (check) {
                                window.location.href = '/Account/BusinessLogin?returnUrl=/Marketplace/CompanySchedule?' + window.location.href.split('?')[1].replace('&', '$') + '';
                            }
                        });
                    } else {
                        
                        let data = {
                            QUEUE_ID: String(queueId),
                            STATUS: "WAITING",
                            IsApproved: "N",
                            USER_ID: String($scope.currentUserId)
                        };

                        chat.server.bookTicket(data);

                    }

                },
                error: function () {

                }
            })


        }
    });

}(FormGeneratorApp));