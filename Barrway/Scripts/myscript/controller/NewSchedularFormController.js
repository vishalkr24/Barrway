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

            $scope.serviceDetails = {
                DURATION_FIELD: 60,
                REST_PERIOD_BETWEEN_SESSION: 10
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

        $scope.GetSingleService = function () {

            let serviceId = $("#SCH_ACTIVITY option:selected").val()

            if (serviceId == 0) {
                alert("Please select a Course/Service");
                return;
            }

            adminService.postAsync('/Calendar/GetServiceMasterList/', { companyCode: localStorage.getItem("COMPANY_CODE"), filters: [{ field: "CALENDAR_CODE", type: "=", value: localStorage.getItem("CALENDAR_CODE") }, { field: "Id", type: "=", value: serviceId }] }).then(function (res) {
                debugger;
                $scope.serviceDetails = res.data.data[0];
            }, function (err) {

            });

        }

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

        $scope.saveSchedularForm = function () {

            var data = {
                Id: $scope.SchedularId,
                COMPANY_CODE: localStorage.getItem("COMPANY_CODE"),
                CALENDAR_CODE: localStorage.getItem("CALENDAR_CODE"),
                SCH__NAME: "",
                SCH_LOCATION: $("#SCH_LOCATION option:selected").val(),
                SCH_ACTIVITY: $("#SCH_ACTIVITY option:selected").val(),
                SCH_RESOURCE: $("#SCH_RESOURCE option:selected").val(),
                SCH_MEDIUM: "ZOOM",
                DURATION_FIELD: $("#SCH_SESSION_DURATION").val(),
                REST_PERIOD_BETWEEN_SESSION: $("#SCH_REST_PERIOD").val(),
                MAXIMUM_NO_OF_PARTICIPANTS: $("#SCH_CAPACITY").val(),
                SCH_DESCRIPTION: "",
                SCH_FROM_DATE: $("#SCH_FROM_DATE").val(),
                SCH_TO_DATE: $("#SCH_TO_DATE").val(),
                SCH_ALTERNATIVE_WEEK: $("#ALTERNATE_WEEK option:selected").val(),
                IF_SLOT_EXIST: "SKIP",
                IF_SLOT_DOES_NOT_EXIST: "INSERT",
                table: $scope.scheduleList,
                CREATION_TYPE: "AUTOMATIC"
            }

            if (true) {
                //data = JSON.stringify(data);

                adminService.postAsync('/Calendar/AddSchedule/', { dataList: [data] }).then(function (res) {
                    if (res.data != "Success") {
                        swal({
                            icon: "error",
                            title: "Error",
                            text: res.data.Message
                        }).then(function () {
                            debugger;
                            if (res.data.Message == "Slots Overlaping!") {
                                let arr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

                                arr.forEach(x => {
                                    let data = res.data.Data.Data.table[x];

                                    data.forEach(y => {
                                        if (y.IsOverlapped == "true") {
                                            $("#elements-row-" + x + " div[data-element-id=SCH_" + y.Id + "]").addClass("error")
                                        } else {
                                            $("#elements-row-" + x + " div[data-element-id=SCH_" + y.Id + "]").removeClass("error")
                                        }
                                    });
                                })
                            }
                        });

                    } else {
                        $scope.SchedularId = 0;
                        window.location.reload();
                    }

                }, function (err) {
                    alert("something went wrong!!");
                });
            }


        }




        $scope.init();
    });

}(FormGeneratorApp));


