(function () {
    'use strict';

    FormGeneratorApp.controller('NewSchedularFormController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        
        $scope.init = function () {
            $scope.scheduleList = {
                "Mon": [],
                "Tue": [],
                "Wed": [],
                "Thu": [],
                "Fri": [],
                "Sat": [],
                "Sun": []
            };

            $scope.addFormElement("Mon");
            $scope.addFormElement("Tue");
            $scope.addFormElement("Wed");
            $scope.addFormElement("Thu");
            $scope.addFormElement("Sat");
            $scope.addFormElement("Sun");
            $scope.addFormElement("Fri");


            adminService.postAsync('/Calendar/GetLocationMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), filters: [{ field: "CALENDAR_CODE", type: "=", value: localStorage.getItem("CALENDAR_CODE") }] }).then(function (res) {

                $scope.locationList = res.data.data;

            }, function (err) {

            });

            adminService.postAsync('/Calendar/GetServiceMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), filters: [{ field: "CALENDAR_CODE", type: "=", value: localStorage.getItem("CALENDAR_CODE") }] }).then(function (res) {

                $scope.serviceList = res.data.data;

            }, function (err) {

            });

            adminService.postAsync('/Calendar/GetServiceProviderMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), filters: [{ field: "CALENDAR_CODE", type: "=", value: localStorage.getItem("CALENDAR_CODE") }] }).then(function (res) {

                $scope.serviceProviderList = res.data.data;
            }, function (err) {

            });

        };

        $scope.addFormElement = function (abbr) {
            let id = getMaxId(abbr);
            console.log($scope.scheduleList[abbr]);

            if ($scope.scheduleList[abbr].length >= 5) {
                notifierService.notifyMessage("error", "Limit Reached!", "Can not add more than 5 slots.")
                return false;
            }

            $scope.scheduleList[abbr].push({ "Id": id, "start": "", "end": "" });

            $("#elements-row-" + abbr).append(`<div class="schedular-element form-element"  data-element-id="SCH_${id}">
                                        <div>
                                            ${(abbr == "Mon") ? "<b>From</b>" : ""}
                                            <input type="time" class="form-control" name="form-time-input" data-input-day="${abbr}" data-input-type="start" data-input-id="${id}" />
                                        </div>
                                        <div> <b>--</b> </div>
                                        <div>
                                            ${(abbr == "Mon") ? "<b>To</b>" : ""}
                                            <input type="time" class="form-control" name="form-time-input" data-input-day="${abbr}" data-input-type="end" data-input-id="${id}" />
                                        </div>
                                        <div class="delete-element">
                                            <button class="btn btn-primary" onclick="angular.element(this).scope().deleteFormElement('${abbr}', ${id})"><i class="fa fa-times" aria-hidden="true"></i></button>
                                        </div>
                                    </div>`);
        }

        $scope.deleteFormElement = function (abbr, id) {
            if ($scope.scheduleList[abbr].length <= 1) {
                notifierService.notifyMessage("error", "Warning", "Can not delete all slots!");
                return false;
            }
            
            $scope.scheduleList[abbr].splice($scope.scheduleList[abbr].findIndex(x => x.Id == id), 1);
            $("#elements-row-" + abbr + " .form-element[data-element-id=SCH_" + id + "]").remove();

        }

        function getMaxId(abbr) {
            $scope.scheduleList[abbr];

            let maxValue = 0;

            if ($scope.scheduleList[abbr].length > 0) {
                $scope.scheduleList[abbr].forEach(x => {
                    if (x => x.Id > maxValue) maxValue = x.Id;
                });
            }

            return parseInt(maxValue) + 1;
        }


        $(document).on("change", "input[name=form-time-input]", function () {
            let type = $(this).attr("data-input-type");
            let id = $(this).attr("data-input-id");
            let day = $(this).attr("data-input-day");
            let val = this.value;

            $scope.scheduleList[day].find(x => x.Id == id)[type] = val;
            console.log($scope.scheduleList);
        })






        $scope.init();
    });

}(FormGeneratorApp));


