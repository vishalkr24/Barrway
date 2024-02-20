(function () {
    'use strict';

    FormGeneratorApp.controller('QueueSchedularFormController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        
        var queueList = [];
        var sessionList = [];
        var createdCalendarCode = localStorage.getItem("CALENDAR_CODE");
        var createdCompanyCode = localStorage.getItem("COMPANY_CODE");
        $scope.SchedularId = null;
        

        $scope.init = function () {
            bindQueueSchedule();
        }

        $(document).on("change", "#exampleFormControlSelect1", function () {
            addQueueRow();
        });

        $(document).on("change", "#exampleFormControlSelect2", function () {
            addSessionRow();
        });

        $(document).on("change paste", "#booking-queue-table tbody input", function () {

            let name = ($(this).attr("type") == "radio") ? $(this).attr("name").split("-") : $(this).attr("id").split("-");

            queueList.find(x => x.rowId == name[1])[name[0]] = this.value;

        });

        $(document).on("change paste", "#booking-session-table tbody input", function () {

            let name = ($(this).attr("type") == "radio") ? $(this).attr("name").split("-") : $(this).attr("id").split("-");

            sessionList.find(x => x.rowId == name[1])[name[0]] = this.value;

        });

        function bindQueueSchedule() {

            var data = getSchedule(localStorage.getItem("COMPANY_CODE"), localStorage.getItem("CALENDAR_CODE"), true);
            debugger;
            if (data.Status) {

                var response = data.Data;

                $scope.SchedularId = response.Id;

                let queue = JSON.parse(response.SCH_SCHEDULE_TABLE).QueueList
                let session = JSON.parse(response.SCH_SCHEDULE_TABLE).SessionList

                $("#exampleFormControlSelect1").val(queue.length);
                $("#exampleFormControlSelect2").val(session.length);
                if (queue.length > 0) {
                    for (var i = 0; i < queue.length; i++) {
                        addQueueRow(queue[i]);
                    }
                } else {
                    addQueueRow();
                }

                if (session.length) {
                    for (var i = 0; i < session.length; i++) {
                        addSessionRow(session[i]);
                    }
                } else {
                    addSessionRow();
                }

            } else {
                addQueueRow();
                addSessionRow();
            }

        }

        $scope.AddQueueSession = function () {
            debugger;
            // add validations
            if (true) {

                var data = {
                    Id: $scope.SchedularId,
                    COMPANY_CODE: localStorage.getItem("COMPANY_CODE"),
                    CALENDAR_CODE: localStorage.getItem("CALENDAR_CODE"),
                    SCH__NAME: "",
                    SCH_LOCATION: "",
                    SCH_ACTIVITY: "",
                    SCH_RESOURCE: "",
                    SCH_MEDIUM: "ZOOM",
                    DURATION_FIELD: 0,
                    REST_PERIOD_BETWEEN_SESSION: 0,
                    MAXIMUM_NO_OF_PARTICIPANTS: 0,
                    SCH_DESCRIPTION: "",
                    SCH_FROM_DATE: moment(new Date()).format("YYYY-MM-DD"),
                    SCH_TO_DATE: moment(new Date()).format("YYYY-MM-DD"),
                    SCH_ALTERNATIVE_WEEK: "EVERY-WEEK",
                    IF_SLOT_EXIST: "SKIP",
                    IF_SLOT_DOES_NOT_EXIST: "INSERT",
                    SCH_SCHEDULE_TABLE: JSON.stringify({
                        QueueList: queueList,
                        SessionList: sessionList
                    }),
                    CREATION_TYPE: "AUTOMATIC",
                    SCHEDULAR_TYPE: "QUEUE"
                }

                adminService.postAsync('/Calendar/AddSchedule/', { dataList: [data] }).then(function (res) {
                    if (!res.data.Status) {
                        swal({
                            icon: "error",
                            title: "Error",
                            text: res.data.Message
                        });
                    } else {
                        swal({
                            icon: "success",
                            title: "Success",
                            text: "Queue and session " + ((data.Id != null) ? " updated " : " created ") + " successfully!"
                        }).then(function (check) {
                            window.location.replace("/calendar/index#/queue-manager");
                        });
                    }
                });



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
                                                        <input type="text" class="form-control" id="QUEUE_RESET_NUMBER-${queueElement.Id}" value="${queueElement.QUEUE_RESET_NUMBER}"/>
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
                            QUEUE_RESET_NUMBER: "",
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
                                                        <input type="text" class="form-control" id="QUEUE_RESET_NUMBER-${queueElement.rowId}" value="${queueElement.QUEUE_RESET_NUMBER}"/>
                                                    </td>
                                                </tr>`;
                    }
                }



            }

            $("#booking-queue-table tbody").append(binderString);
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
                                                        <input type="datetime" class="form-control" id="SESSION_START_TIME-${dataElement.Id}" value="${sessionElement.SESSION_START_TIME}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="datetime" class="form-control" id="SESSION_END_TIME-${dataElement.Id}" value="${sessionElement.SESSION_END_TIME}"/>
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
                                                        <input type="datetime" class="form-control" id="QUEUE_OPEN_TIME-${dataElement.Id}" value="${sessionElement.QUEUE_OPEN_TIME}"/>
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
                            COMPANY_CODE: createdCompanyCode
                        };

                        sessionList.push(sessionElement);

                        binderString += `<tr id="session-table-row-${sessionElement.rowId}">
                                                    <td>
                                                        <input type="text" class="form-control" id="SESSION_NAME-${sessionElement.rowId}" value="${sessionElement.SESSION_NAME}"/>
                                                    </td>
                                                    <td>
                                                        <input type="datetime" class="form-control" id="SESSION_START_TIME-${sessionElement.rowId}" value="${sessionElement.SESSION_START_TIME}"/>
                                                    </td>
                                                    <td style="width:100px;">
                                                        <input type="datetime" class="form-control" id="SESSION_END_TIME-${sessionElement.rowId}" value="${sessionElement.SESSION_END_TIME}"/>
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
                                                        <input type="datetime" class="form-control" id="QUEUE_OPEN_TIME-${sessionElement.rowId}" value="${sessionElement.QUEUE_OPEN_TIME}"/>
                                                    </td>
                                                </tr>`;
                    }
                }



                //$("#booking-session-table tbody").empty();
            }

            $("#booking-session-table tbody").append(binderString);
        }

        $scope.init();
    });

}(FormGeneratorApp));