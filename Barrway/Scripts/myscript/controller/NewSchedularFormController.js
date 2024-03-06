(function () {
    'use strict';

    FormGeneratorApp.controller('NewSchedularFormController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        var queueList = [];
        var sessionList = [];
        var createdCalendarCode = localStorage.getItem("CALENDAR_CODE");
        var createdCompanyCode = localStorage.getItem("COMPANY_CODE");
        $scope.SchedularId = null;
        $scope.isQueue = -1;

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

            setTimeout(function () {
                $scope.CalendarData = getSingleCalendar(localStorage.getItem("CALENDAR_CODE"));
                $scope.ConfigData = JSON.parse(getScheduleTypeJson());

                $scope.BindView();
            }, 500);

        };

        $scope.BindView = function () {
            debugger;
            $scope.ViewName = "";

            if ($scope.ConfigData["Type" + $scope.CalendarData.Data.CALENDAR_CATEGORY_ID].Is_Category_Based == true) {
                $scope.ViewName = $scope.ConfigData["Type" + $scope.CalendarData.Data.CALENDAR_CATEGORY_ID].Category["Category" + $scope.CalendarData.Data.CALENDAR_TYPE].View_Name;
            } else {
                $scope.ConfigData["Type" + $scope.CalendarData.Data.CALENDAR_CATEGORY_ID].View_Name;
            }

            if ($scope.ViewName == "S3A") {
                $scope.isQueue = 0;
                $("#duration-area").show();
                $("#sub-heading-helper").text("")
                $("#duration-helper").text("");
                $("#schedule-name-helper").text("Class schedule");
                $("#staff-ddl-area").show();
            } else if ($scope.ViewName == "S3B") {
                $scope.isQueue = 0;
                $("#duration-area").show();
                $("#sub-heading-helper").text("Please set the business schedule for each service and staff")
                $("#duration-helper").text("System will divide your business hours into booking sessions.")
                $("#schedule-name-helper").text("Business hours");
                $("#staff-ddl-area").show();
            }
            else if ($scope.ViewName == "S3D") {
                $scope.isQueue = 0;
                $("#duration-area").show();
                $("#sub-heading-helper").text("Please set the business schedule for each service and location")
                $("#duration-helper").text("System will divide your business hours into booking sessions.")
                $("#schedule-name-helper").text("Business hours");
                $("#staff-ddl-area").hide();
            }
            else if ($scope.ViewName == "S3E") {
                $scope.isQueue = 0;
                $("#duration-area").show();
                $("#sub-heading-helper").text("Please set the business schedule for each service and location")
                $("#duration-helper").text("")
                $("#schedule-name-helper").text("Business hours");
                $("#staff-ddl-area").hide();
            }
            else if ($scope.ViewName == "S3F") {
                $scope.isQueue = 1;
                bindQueueSchedule();
            }
            else if ($scope.ViewName == "S3G") {
                $scope.isQueue = 0;
                $("#duration-area").hide();
                $("#sub-heading-helper").text("")
                $("#duration-helper").text("")
                $("#schedule-name-helper").text("Class schedule");
                $("#staff-ddl-area").hide();
            }
            else if ($scope.ViewName == "S3H") {
                $scope.isQueue = 2;
                bindSessionSchedule();
            }
            $scope.$apply();

        }

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
            debugger;
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
                //notifierService.notifyMessage("error", "Warning", "Can not delete all slots!");
                $(`[data-input-day="${abbr}"][data-input-type="start"][data-input-id="${id}"]`).val('');
                $(`[data-input-day="${abbr}"][data-input-type="end"][data-input-id="${id}"]`).val('');
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

        $scope.validateSchedularForm = function () {
            let finalStatus = true;
            debugger;
            if ($("#SCH_ACTIVITY option:selected").val() == "-1") {
                $("#SCH_ACTIVITY_ERROR").show();
                finalStatus = false;
            } else {
                $("#SCH_ACTIVITY_ERROR").hide();
            }

            let arr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

            let slotError = true;

            arr.forEach(x => {
                let data = $scope.scheduleList[x];

                data.forEach(y => {
                    if (y.start != "" && y.end != "" && y.start != null && y.end != null) {
                        slotError = false;
                    }
                });
            })

            if (slotError) {
                $("#SCH_SLOT_ERROR").show();
                finalStatus = false;
            } else {
                $("#SCH_SLOT_ERROR").hide();
            }

            return finalStatus
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

            if ($scope.validateSchedularForm()) {
                //data = JSON.stringify(data);

                if ($scope.ViewName == "S3D" || $scope.ViewName == "S3E" || $scope.ViewName == "S3G") {
                    data.SCH_RESOURCE = null;
                }

                if ($scope.ViewName == "S3H") {
                    data.SCHEDULAR_TYPE = "QUEUE_2";
                } else if ($scope.ViewName == "S3F") {
                    data.SCHEDULAR_TYPE = "QUEUE_1";
                } else {
                    data.SCHEDULAR_TYPE = "CALENDAR";
                }

                adminService.postAsync('/Calendar/AddSchedule/', { dataList: [data] }).then(function (res) {
                    if (!res.data.Status) {
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
                        window.location.replace("/calendar/index#/calender/2305");
                        //window.location.reload();
                    }

                }, function (err) {
                    alert("something went wrong!!");
                });
            } else {
                alert("Please recheck the form");
            }


        }


        $(document).on("change", "#exampleFormControlSelect1", function () {
            addQueueRow();
        });

        $(document).on("change", "#exampleFormControlSelect2", function () {
            addSessionRow();
        });

        function bindQueueSchedule() {
            $(document).on("change paste", "#queue-schedular-form-section #booking-queue-table tbody input, select", function () {

                let name = ($(this).attr("type") == "radio") ? $(this).attr("name").split("-") : $(this).attr("id").split("-");

                queueList.find(x => x.rowId == name[1])[name[0]] = this.value;

            });

            $(document).on("change paste", "#queue-schedular-form-section #booking-session-table tbody input, select", function () {

                let name = ($(this).attr("type") == "radio") ? $(this).attr("name").split("-") : $(this).attr("id").split("-");

                sessionList.find(x => x.rowId == name[1])[name[0]] = this.value;

            });

            var data = getQueueAndSession(localStorage.getItem("COMPANY_CODE"), localStorage.getItem("CALENDAR_CODE"));

            if (!data.Status) {
                addQueueRow();
                addSessionRow();
                return;
            } else {
                var response = data.Data;

                let queue = response.queue
                debugger;
                let session = response.session

                if (queue.length > 0) {
                    $("#exampleFormControlSelect1").val(queue.length);
                    for (var i = 0; i < queue.length; i++) {
                        addQueueRow(queue[i]);
                    }
                } else {
                    addQueueRow();
                }

                if (session.length) {
                    $("#exampleFormControlSelect2").val(session.length);
                    for (var i = 0; i < session.length; i++) {
                        addSessionRow(session[i]);
                    }
                } else {
                    addSessionRow();
                }
            }

        }

        function bindSessionSchedule() {

        }

        $scope.AddQueueSession = function () {
            debugger;
            // add validations
            if (true) {
                $.ajax({
                    url: "/Calendar/AddQueueSession/",
                    method: "POST",
                    data: {
                        data: {
                            "QueueList": queueList,
                            "SessionList": sessionList
                        },
                        ScheduleId: null                        
                    },
                    success: function(response) {
                        if (!response.Status) {
                            swal({
                                icon: "error",
                                title: "Error",
                                text: response.Message
                            });
                        } else {
                            swal({
                                icon: "success",
                                title: "Success",
                                text: "Queue and session updated/created successfully!"
                            }).then(function (check) {
                                window.location.replace("/calendar/index#/queue-manager");
                            });
                        }
                    }
                })
                

            }
        }

        function addQueueRow(dataElement = null) {
            let binderString = "";

            if (dataElement != null) {
                let queueElement = {
                    Id: dataElement.Id,
                    rowId: dataElement.Id,
                    QUEUE_NAME: dataElement.QUEUE_NAME,
                    QUEUE_PREFIX: dataElement.QUEUE_PREFIX,
                    QUEUE_START_NUMBER: dataElement.QUEUE_START_NUMBER,
                    QUEUE_END_NUMBER: dataElement.QUEUE_END_NUMBER,
                    QUEUE_RESET_NUMBER: dataElement.QUEUE_RESET_NUMBER,
                    QUEUE_TYPE: "RESTAURANT",
                    CALENDAR_CODE: createdCalendarCode,
                    COMPANY_CODE: createdCompanyCode
                };

                queueList.push(queueElement);

                binderString += `<tr id="queue-table-row-${queueElement.rowId}">
                                                    <td>
                                                        <input type="text" class="form-control" id="QUEUE_NAME-${queueElement.Id}" value="${queueElement.QUEUE_NAME}"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" id="QUEUE_PREFIX-${queueElement.Id}" value="${queueElement.QUEUE_PREFIX}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="number" class="form-control" id="QUEUE_START_NUMBER-${queueElement.Id}"  value="${queueElement.QUEUE_START_NUMBER}" min="0"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="number" class="form-control" id="QUEUE_END_NUMBER-${queueElement.Id}"  value="${queueElement.QUEUE_END_NUMBER}"/>
                                                    </td>
                                                    <td style="width:160px;">
                                                        <select class="form-control" id="QUEUE_RESET_NUMBER-${queueElement.Id}" value="${queueElement.QUEUE_RESET_NUMBER}">
                                                            <option value="AFTER SESSION">After Session</option>
                                                            <option value="PER DAY">Per Day</option>
                                                            <option value="PER MONTH">Per Month</option>
                                                            <option value="NO RESET">No Reset</option>
                                                        </select>
                                                    </td>
                                                </tr>`;
            } else {
                let rowCount = parseInt($("#exampleFormControlSelect1 option:selected").val());
                debugger;
                if (isNaN(rowCount)) {
                    $("#exampleFormControlSelect1").val("1")
                    rowCount = 1;
                }

                rowCount = (rowCount > 5) ? 5 : rowCount;

                if (rowCount < queueList.length) {
                    swal({
                        icon: "warning",
                        title: "Warning",
                        text: "Already Sesion can not be removed",
                        confirm: "Ok"
                    }).then(function (check) {
                        if (check) {
                            debugger;
                            let elementsToDelete = queueList.length - rowCount;
                            for (var i = 0; i < elementsToDelete; i++) {
                                if (queueList[queueList.length - 1].Id == undefined || queueList[queueList.length - 1].Id == null) {
                                    $("#queue-table-row-" + queueList[queueList.length - 1].rowId).remove();
                                    queueList.pop();
                                }
                            }

                        }
                    })
                } else {
                    let counter = rowCount - queueList.length;
                    for (var i = 0; i < counter; i++) {
                        let queueElement = {
                            Id: null,
                            rowId: (queueList.length == 0) ? 1 : parseInt(queueList[queueList.length - 1].rowId) + 1,
                            QUEUE_NAME: "",
                            QUEUE_PREFIX: "",
                            QUEUE_START_NUMBER: "1",
                            QUEUE_END_NUMBER: "100",
                            QUEUE_RESET_NUMBER: "AFTER SESSION",
                            CALENDAR_CODE: createdCalendarCode,
                            COMPANY_CODE: createdCompanyCode
                        };

                        queueList.push(queueElement);

                        binderString += `<tr id="queue-table-row-${queueElement.rowId}">
                                                    <td>
                                                        <input type="text" class="form-control" id="QUEUE_NAME-${queueElement.rowId}" value="${queueElement.QUEUE_NAME}"/>
                                                    </td>
                                                    <td>
                                                        <input type="text" class="form-control" id="QUEUE_PREFIX-${queueElement.rowId}" value="${queueElement.QUEUE_PREFIX}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="number" class="form-control" id="QUEUE_START_NUMBER-${queueElement.rowId}"  value="${queueElement.QUEUE_START_NUMBER}" min="0"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="number" class="form-control" id="QUEUE_END_NUMBER-${queueElement.rowId}"  value="${queueElement.QUEUE_END_NUMBER}"/>
                                                    </td>
                                                    <td style="width:160px;">
                                                        <select class="form-control" id="QUEUE_RESET_NUMBER-${queueElement.rowId}">
                                                            <option selected value="AFTER SESSION">After Session</option>
                                                            <option value="PER DAY">Per Day</option>
                                                            <option value="PER MONTH">Per Month</option>
                                                            <option value="NO RESET">No Reset</option>
                                                        </select>
                                                    </td>
                                                </tr>`;
                    }
                }



            }

            $("#queue-schedular-form-section #booking-queue-table tbody").append(binderString);
        }

        function addSessionRow(dataElement = null) {
            let binderString = "";

            if (dataElement != null) {
                let sessionElement = {
                    Id: dataElement.Id,
                    rowId: dataElement.Id,
                    SESSION_NAME: dataElement.SESSION_NAME,
                    SESSION_START_TIME: dataElement.SESSION_START_TIME,
                    SESSION_END_TIME: dataElement.SESSION_END_TIME,
                    TICKETING_TYPE: dataElement.TICKETING_TYPE,
                    QUEUE_OPEN_TIME: dataElement.QUEUE_OPEN_TIME,
                    CALENDAR_CODE: createdCalendarCode,
                    COMPANY_CODE: createdCompanyCode
                };

                sessionList.push(sessionElement);

                binderString += `<tr id="session-table-row-${sessionElement.rowId}">
                                                    <td>
                                                        <input type="text" class="form-control" id="SESSION_NAME-${dataElement.Id}" value="${sessionElement.SESSION_NAME}"/>
                                                    </td>
                                                    <td>
                                                        <input type="time" class="form-control" id="SESSION_START_TIME-${dataElement.Id}" value="${sessionElement.SESSION_START_TIME.substring(11, sessionElement.SESSION_START_TIME.length)}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="time" class="form-control" id="SESSION_END_TIME-${dataElement.Id}" value="${sessionElement.SESSION_END_TIME.substring(11, sessionElement.SESSION_START_TIME.length)}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <div class="booking_queue_radio">
                                                            <input type="radio" name="TICKETING_TYPE-${dataElement.Id}" id="TICKETING_TYPE-Auto-${dataElement.Id}" value="Auto" ${(sessionElement.TICKETING_TYPE == "Auto") ? "checked" : ""}>
                                                            <label for="TICKETING_TYPE-Auto-${dataElement.Id}">Auto</label>
                                                            <input type="radio" name="TICKETING_TYPE-${dataElement.Id}" id="TICKETING_TYPE-Manual-${dataElement.Id}" value="Manual" ${(sessionElement.TICKETING_TYPE == "Auto") ? "checked" : ""}>
                                                            <label for="TICKETING_TYPE-Manual-${dataElement.Id}">Manual</label>
                                                        </div>
                                                    </td>
                                                    <td style="width:160px;">
                                                        <input type="time" class="form-control" id="QUEUE_OPEN_TIME-${dataElement.Id}" value="${sessionElement.QUEUE_OPEN_TIME}"/>
                                                    </td>
                                                </tr>`;
            } else {
                let rowCount = parseInt($("#exampleFormControlSelect2 option:selected").val());

                rowCount = (rowCount > 5) ? 5 : rowCount;

                if (rowCount < sessionList.length) {
                    swal({
                        icon: "warning",
                        title: "Warning",
                        text: "Already Sesion can not be removed",
                        confirm: "Ok"
                    }).then(function (check) {
                        if (check) {
                            let elementsToDelete = sessionList.length - rowCount;
                            for (var i = 0; i < elementsToDelete; i++) {
                                if (sessionList[sessionList.length - 1].Id == undefined || sessionList[sessionList.length - 1].Id == null) {
                                    $("#session-table-row-" + sessionList[sessionList.length - 1].rowId).remove();
                                    sessionList.pop();
                                }

                            }

                        }
                    })
                } else {
                    let counter = rowCount - sessionList.length;
                    for (var i = 0; i < counter; i++) {

                        let sessionElement = {
                            Id: null,
                            rowId: (sessionList.length == 0) ? 1 : parseInt(sessionList[sessionList.length - 1].rowId) + 1,
                            SESSION_NAME: "",
                            SESSION_START_TIME: "",
                            SESSION_END_TIME: "",
                            TICKETING_TYPE: "Auto",
                            QUEUE_OPEN_TIME: "",
                            CALENDAR_CODE: createdCalendarCode,
                            COMPANY_CODE: createdCompanyCode,
                        };

                        sessionList.push(sessionElement);

                        binderString += `<tr id="session-table-row-${sessionElement.rowId}">
                                                    <td>
                                                        <input type="text" class="form-control" id="SESSION_NAME-${sessionElement.rowId}" value="${sessionElement.SESSION_NAME}"/>
                                                    </td>
                                                    <td>
                                                        <input type="time" class="form-control" id="SESSION_START_TIME-${sessionElement.rowId}" value="${sessionElement.SESSION_START_TIME}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="time" class="form-control" id="SESSION_END_TIME-${sessionElement.rowId}" value="${sessionElement.SESSION_END_TIME}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <div class="booking_queue_radio">
                                                            <input type="radio" name="TICKETING_TYPE-${sessionElement.rowId}" id="TICKETING_TYPE-Auto-${sessionElement.rowId}" value="Auto" ${(sessionElement.TICKETING_TYPE == "Auto") ? "checked" : ""}>
                                                            <label for="TICKETING_TYPE-Auto-${sessionElement.rowId}">Auto</label>
                                                            <input type="radio" name="TICKETING_TYPE-${sessionElement.rowId}" id="TICKETING_TYPE-Manual-${sessionElement.rowId}" value="Manual" ${(sessionElement.TICKETING_TYPE == "Manual") ? "checked" : ""}>
                                                            <label for="TICKETING_TYPE-Manual-${sessionElement.rowId}">Manual</label>
                                                        </div>
                                                    </td>
                                                    <td style="width:160px;">
                                                        <input type="time" class="form-control" id="QUEUE_OPEN_TIME-${sessionElement.rowId}" value="${sessionElement.QUEUE_OPEN_TIME}"/>
                                                    </td>
                                                </tr>`;
                    }
                }



                //$("#booking-session-table tbody").empty();
            }

            $("#booking-session-table tbody").append(binderString);
        }



        /* copy slots */

        $scope.copyslots = function () {
            if ($('#copy_slots_cheb').is(":checked")) {
                debugger;
                let start = [];
                let end = [];
                $('[data-input-day="Mon"][data-input-type="start"][data-input-id]').each(function (index, el) {
                    start.push({ index: $(el).data("input-id"), value: $(el).val() });
                });
                $('[data-input-day="Mon"][data-input-type="end"][data-input-id]').each(function (index, el) {
                    end.push({ index: $(el).data("input-id"), value: $(el).val() });
                });
                // $scope.scheduleList

                $.each($scope.scheduleList, function (value) {
                    if (value != "Mon") {
                        start.forEach((x,index) => {
                            if ($(`[data-input-day="${value}"][data-input-type="start"][data-input-id="${x.index}"]`).length == 0) {
                                $scope.addFormElement(value);
                            }

                            $(`[data-input-day="${value}"][data-input-type="start"][data-input-id="${x.index}"]`).val(x.value);
                            $scope.scheduleList[value].find(y => y.Id == x.index)["start"] = x.value;
                            $(`[data-input-day="${value}"][data-input-type="end"][data-input-id="${x.index}"]`).val(end[index].value);
                            $scope.scheduleList[value].find(y => y.Id == x.index)["end"] = end[index].value;
                        });
                    }
                });

            }
        }

        $scope.init();
    });

}(FormGeneratorApp));


