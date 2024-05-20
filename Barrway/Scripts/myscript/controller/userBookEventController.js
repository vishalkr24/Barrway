var dataModelList = [];
var dataList = [];
var CALENDAR_CODE = "";
var COMPANY_CODE = "";

(function () {
    'use strict';
    
    FormGeneratorApp.controller('UserBookEventController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $scope.rootScopeSafe = function () {
            $rootScope.safeApply();
        };

        $scope.eventType = "";
        $scope.htmlContentData = '';

        $scope.EventId = $stateParams.Id;

        adminService.postAsync('/UserAdmin/GetSingleEventDetailsWithFlags/', { EventId: $scope.EventId }).then(function (res) {
            //debugger;
            if (res.data.Status) {
                $scope.selectEventDetails = res.data.Data[0];
                CALENDAR_CODE = $scope.selectEventDetails.CALENDAR_CODE;
                var calendarDetails = getCalendarDetailsLocal($scope.selectEventDetails.CALENDAR_CODE).Data;
                $scope.calendarDetails = calendarDetails;
                var calenderSettings = getCalenderSettingsLocal($scope.selectEventDetails.CALENDAR_CODE);
                if (Check_IS_SERVICE_TYPE(calendarDetails)) {
                    // not working only made for OTA
                    rendarPopupCalendar($scope.selectEventDetails.start);
                } else {

                    if ($scope.selectEventDetails.IS_COURSE_EVENT == 'Y') {

                        $.ajax({
                            url: "/Marketplace/GetCourseEvents",
                            type: "GET",
                            data: {
                                ServiceId: $scope.selectEventDetails.activities
                            },
                            success: function (response) {
                                if (response.Status) {
                                    response.Data.forEach(x => {
                                        x.Value.forEach(y => {
                                            y.start = moment(y.start).format("hh:mm a")
                                            y.end = moment(y.end).format("hh:mm a")
                                        });
                                    });

                                    $scope.courseEventsList = response.Data;

                                    //setTimeout(function () {
                                    //    let height = document.getElementById("event_N").scrollHeight;
                                    //    document.getElementById("events-list-container").scrollTop = height + 300;
                                    //}, 500);

                                    //CourseDetailsModal.modal('show');
                                    //CourseDetailsModal.css({ "z-index": "9999" });
                                    $scope.eventType = "COURSE";
                                } else {

                                }
                            },
                            error: function (error) {

                            }
                        })



                    } else {
                        $scope.eventType = "EVENT";
                        //customEventDetailsModelPopUp.modal('show');
                        //customEventDetailsModelPopUp.css({ "z-index": "9999" });
                    }


                }

                if ($scope.selectEventDetails.DOWNLOAD_FILE_LIST && $scope.selectEventDetails.DOWNLOAD_FILE_LIST != '' && $scope.selectEventDetails.DOWNLOAD_FILE_LIST != ' ' && $scope.selectEventDetails.DOWNLOAD_FILE_LIST != 'null' && IsJsonString($scope.selectEventDetails.DOWNLOAD_FILE_LIST)) {
                    $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES = JSON.parse($scope.selectEventDetails.DOWNLOAD_FILE_LIST);
                }
                
                var enrollUser = getUserEnrollDetails($scope.selectEventDetails.Id);

                let is_enroll = false;
                let enrolled_data = {};
                if (enrollUser.Status) {
                    is_enroll = true;
                    enrolled_data = enrollUser.Data;
                    $scope.selectEventDetails.TRANSACTION_ID = enrolled_data.TRANSACTION_ID;
                    $scope.selectEventDetails.ASSESSMENT_FILES = enrolled_data.ASSESSMENT_FILES;
                    $scope.selectEventDetails.ASSESSMENT_FILES_LIST = enrolled_data.ASSESSMENT_FILES_LIST;
                    if (IsJsonString(enrolled_data.ASSESSMENT_FILES_LIST)) {
                        $scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA = JSON.parse(enrolled_data.ASSESSMENT_FILES_LIST);
                    }
                }

                if (!(moment().local().diff(moment($scope.selectEventDetails.start).format(), 'minute') <= 0)) {
                    $scope.selectEventDetails.isEnroll = false;
                } else {
                    $scope.selectEventDetails.isEnroll = true;
                }
                if ($scope.selectEventDetails.formID == undefined) {
                    $scope.selectEventDetails.formID = CalendarFormId;
                }
                $scope.selectEventDetails.resourceFormId = 2305;
                $scope.selectEventDetails.ActivityFormId = 2303;
                $scope.selectEventDetails.start = $scope.selectEventDetails.start != null && $scope.selectEventDetails.start != undefined && $scope.selectEventDetails.start != '' ? customDate(moment($scope.selectEventDetails.start).format()) : ''
                $scope.selectEventDetails.end = $scope.selectEventDetails.end != null && $scope.selectEventDetails.end != undefined && $scope.selectEventDetails.end != '' ? customDate(moment($scope.selectEventDetails.end).format()) : ''
                $scope.selectEventDetails.customDate = DateWithDayName($scope.selectEventDetails, true);

                $scope.selectEventDetails.customTime = moment($scope.selectEventDetails.start).format("hh:mm a") + " to " + moment($scope.selectEventDetails.end).format("hh:mm a")

                //if (!$scope.selectEventDetails.allDay) {
                //    $scope.selectEventDetails.customTime = TimeFormatCalender($scope.selectEventDetails, true);
                //}
                //else {
                //    /*$scope.selectEventDetails.customDate = moment($scope.selectEventDetails.start).format("DD-MM-YYYY");*/
                //}

                $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');
                $scope.selectEventDetails.customFormsSplit = $scope.selectEventDetails.customForms.split(',');
                $scope.selectEventDetails.customFormIdsSplit = $scope.selectEventDetails.customFormIds.split(',');

                var listFormDropdown = $scope.selectEventDetails.customFormsSplit;
                var xaxisFormList = [];

                angular.forEach(calenderSettings, function (dataRow, position) {
                    //console.log(dataRow);
                    if (dataRow.activitiesForm !== 0)
                        xaxisFormList.push(dataRow);
                });

                if (listFormDropdown.length > 0) {
                    //var listActivities = _.filter(xaxisFormList, function (item) { return item.activitiesForm != ySelection; });
                    var listActivities = xaxisFormList;
                    $scope.selectEventDetails.dropdownList = [];
                    _.each(listActivities, function (item, key) {
                        var tempDrop = {};
                        //debugger;
                        var indexForm = _.findIndex($scope.selectEventDetails.customFormsSplit, function (itemForm) { return itemForm.trim() == item.activitiesForm.toString() });
                        if (indexForm != -1) {
                            tempDrop.formId = item.activitiesForm.toString();
                            tempDrop.Id = $scope.selectEventDetails.customFormIdsSplit[indexForm];
                            tempDrop.formTitle = $scope.selectEventDetails.customTitleSplit[indexForm];
                            tempDrop.dropdownListData = item;
                            tempDrop.customClass = "false";
                            $scope.selectEventDetails.dropdownList.push(tempDrop);
                        }

                    });
                }

                setTimeout(function () {

                    removeTitleNew();

                    _.each($scope.totalSelectListTagify, function (item, key) {
                        var param = {};

                        // init Tagify script on the above inputs     
                        var input = document.getElementById('newtag-input' + item.name);
                        input.value = [];
                        item.tagify = {};
                        if (input != null) {
                            var tempWhiteControl = $scope.selectEventDetails[item.name];
                            var tempWhiteList = [];
                            var tempWh2 = [];
                            if (tempWhiteControl != undefined && tempWhiteControl != "") {
                                tempWhiteList = tempWhiteControl;
                                tempWhiteList = tempWhiteList.replace(/'/g, '"');
                                tempWhiteList = JSON.parse(tempWhiteList);
                                var newList = [];
                                if (tempWhiteList.length > 0) {
                                    if (tempWhiteList[0].value != undefined) {
                                        _.each(tempWhiteList, function (itemtag) {
                                            newList.push(itemtag.value);
                                        });
                                    } else {
                                        newList = tempWhiteList;
                                    }
                                }
                                tempWhiteList = newList.join();
                                tempWh2 = tempWhiteList.split(",");
                                input.value = tempWhiteList;
                                var tmp = [tempWhiteList];
                            }

                            item.tagify = new Tagify(input, {
                                whitelist: tempWh2,
                                maxTags: 10,
                                dropdown: {
                                    maxItems: 20,           // <- mixumum allowed rendered suggestions
                                    classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
                                    enabled: 0,             // <- show suggestions on focus
                                    closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
                                }
                            });
                            if (item.tagify.on != undefined) {
                                item.tagify.on('add', onAddTag)
                                item.tagify.on('invalid', onInvalidTag)
                                item.tagify.on('remove', onRemoveTag)
                                item.tagify.on('edit', onTagEdit)
                            }
                        }
                    });
                }, 200);
                $scope.rootScopeSafe();

                $scope.renderAdditionalDetailsForm();

            }

        }, function (err) {
        });


        

        $scope.userDetail = mainService.loginDetails();

        $scope.IsEventBackground = false;
        $scope.bgEventDetails = {};
        
        $scope.AttendSession = function (eventId, type) {
            //debugger;
            $("#customEventDetailsModelPopUp").modal("hide")
            if (type == "QR") {
                $scope.generateQRCode(eventId);
            } else {
                openWebCam(eventId);
            }

        }

        $scope.generateQRCode = function (TId) {
            $.ajax({
                url: "/Useradmin/GenerateAttendanceQR?TransactionId=" + TId,
                type: "Get",
                success: function (response) {
                    //debugger;
                    if (response != null) {
                        if (response.Status) {
                            $("#GeneratedQRCodeModal img").attr("src", response.Data.QRImageURL.replace("~", ".."));
                            $("#GeneratedQRCodeModal").modal("show");
                        } else {
                            alert("Failed to generate QR Code");
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }
            })

        }

        function openWebCam(eventId) {

            const scannerUser = new Html5QrcodeScanner("qr-scanner", {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 20,
            });
            scannerUser.render(successUser, errorUser);

            $("#html5-qrcode-button-camera-permission").addClass("btn btn-primary");
            $("#html5-qrcode-anchor-scan-type-change").addClass("btn btn-danger");
            $("#html5-qrcode-anchor-scan-type-change").empty();
            $("#html5-qrcode-anchor-scan-type-change").append(`Upload image to scan`);
            setTimeout(function () {
                $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
            }, 1000);

            $("#html5-qrcode-button-camera-start").on("click", function () {
                setTimeout(function () {
                    $("#html5-qrcode-button-camera-stop").addClass("btn btn-danger");
                }, 500);
            })

            $("#html5-qrcode-button-camera-stop").on("click", function () {
                setTimeout(function () {
                    $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
                }, 500);
            })

            $('#WebCamModal').on('hidden.bs.modal', function () {
                scannerUser.clear();
            });

            function successUser(result) {

                if (result.includes("Public/MarkPresent")) {
                    if (eventId == result.split('=')[1]) {
                        $.ajax({
                            url: result,
                            type: "get",
                            success: function (response) {
                                //debugger;
                                if (response.Status) {
                                    swal({
                                        icon: "success",
                                        title: "Success",
                                        text: "Attendance marked"
                                    }).then(function () {
                                        $('#WebCamModal').modal("hide");
                                        window.location.reload();
                                    });
                                } else {
                                    swal({
                                        icon: "error",
                                        title: "Error",
                                        text: response.Message
                                    });
                                }
                            },
                            error: function (err) {
                                alert("Request not allowed");
                            }
                        })
                    } else {
                        swal({
                            icon: "error",
                            title: "Invalid QR",
                            text: "QR Code does not belong to the event selected. Please scan or select the right QR Code."
                        });
                    }

                } else {
                    swal({
                        icon: "error",
                        title: "Invalid QR",
                        text: "Please scan or select a valid QR Code"
                    });
                }
                $("#html5-qrcode-button-camera-stop").trigger("click");
            }

            function errorUser(err) {

            }

            $("#WebCamModal").modal("show");
        };

        $scope.enrollPublicUser = function () {


            console.log($scope.selectEventDetails);
            showLoader();

            var eventData = $scope.selectEventDetails;
            $.ajax({
                url: "/UserAdmin/CheckAdditionalFormDetails",
                method: "GET",
                data: {
                    CalendarCode: eventData.CALENDAR_CODE
                },
                success: function (response) {
                    if (response.Status) {
                        var obj = {
                            USER_ID: "",
                            RESOURCE_NAME: eventData.customTitleSplit[0],
                            ACTIVITY_NAME: eventData.customTitleSplit[1],
                            FormGroupKey: $scope.selectEventDetails.formGroupKey,
                            participant: {
                                DESCRIPTION: String(eventData.description),
                                COMPANY_CODE: eventData.COMPANY_CODE,
                                CALENDAR_CODE: eventData.CALENDAR_CODE
                            },
                            transaction: {
                                SLOT: eventData.Id,
                                RESOURCE: eventData.resourceId,
                                ACTIVITY: eventData.activities,
                                STUDENT: "",
                                REMARKS: "",
                                FEES: "",
                                ATTENDANCE: "NOT-MARKED",
                                COMPANY_CODE: eventData.COMPANY_CODE,
                                CALENDAR_CODE: eventData.CALENDAR_CODE
                            }
                        }

                        $.ajax({
                            url: "/UserAdmin/EnrollPublicUserForCalendar",
                            type: "POST",
                            data: obj,
                            success: function (data) {
                                hideLoader();
                                if (!data.Status) {
                                    if (data.Message == "ALREADY-ENROLLED") {
                                        swal({
                                            title: "Can't Enroll Again!",
                                            text: "You are already enrolled in this event.",
                                            icon: "error",
                                            button: "Okay"
                                        });
                                        //swal({ type: 'error', showCloseButton: true, html: "You are already enrolled in this calendar." });
                                    } else if (data.Message == "LIMIT-ERROR") {
                                        swal({
                                            title: "Failed to Enroll!",
                                            text: "Maximum no. of participants already enrolled in this activity.",
                                            icon: "error",
                                            button: "Okay"
                                        });
                                    } else {
                                        swal({
                                            title: "Warning!",
                                            text: data.Message,
                                            icon: "error",
                                            button: "Okay"
                                        });
                                    }
                                } else {
                                    swal({
                                        title: "Congratulations!",
                                        text: "Enrolled Successfully!",
                                        icon: "success",
                                        button: "Okay"
                                    }).then(function (boolValue) {
                                        window.location.reload();
                                    });

                                }

                            },
                            error: function () {
                                swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                            }
                        })
                    }
                    //else {
                        
                    //}
                },
                error: function (error) {
                    console.error(error);
                }
            });

        }

        $scope.enrollCourse = function () {
            showLoader();
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
                                cancel: "Leave it",
                                confirm: "Login"
                            }
                        }).then(function (value) {
                            if (value) {
                                window.location.href = '/Account/BusinessLogin?returnUrl=' + window.location.href + '';
                            }
                        });
                    } else {
                        var eventData = $scope.selectEventDetails;
                        $.ajax({
                            url: "/Useradmin/GetCurrentPackageDetails",
                            type: "GET",
                            data: {
                                CompanyCode: eventData.COMPANY_CODE,
                                CalendarCode: eventData.CALENDAR_CODE,
                                ServiceId: eventData.activities
                            },
                            async: false,
                            success: function (response) {


                                //debugger;
                                const wrapper = document.createElement('div');
                                wrapper.innerHTML = `
                                                                                                                                                        <div>${eventData.customTitleSplit[2]}</div><br />
                                                                                                                                                        <div>${eventData.customTitleSplit[1]}</div>
                                                                                                                                                        <div>${eventData.customTitleSplit[0]}</div>
                                                                                                                                                        ${((response.Data != null) ? `<div>${response.Data} credits</div>` : "")}<br />
                                                                                                                                                        <h4 style="color:red">${response.Message}</h4>`;

                                let buttonsWrap = {
                                    cancel: "Cancel",
                                    individualButton: {
                                        text: "Buy Individually",
                                        value: "other"
                                    },
                                    confirm: (response.Status) ? "Use Credits" : "Buy Package"
                                }

                                if (response.Data == 0) {
                                    buttonsWrap = {
                                        cancel: "Cancel",
                                        confirm: "Yes"
                                    }
                                }

                                swal({
                                    title: "You are going to book",
                                    content: wrapper,
                                    buttons: buttonsWrap

                                }).then(function (check) {
                                    //debugger;
                                    if (check == true) {
                                        showLoader();
                                        if (response.Status) {
                                            $.ajax({
                                                url: "/UserAdmin/CheckAdditionalFormDetails",
                                                method: "GET",
                                                data: {
                                                    CalendarCode: eventData.CALENDAR_CODE
                                                },
                                                success: function (response) {
                                                    if (response.Status) {
                                                        //debugger;
                                                        var obj = {
                                                            USER_ID: "",
                                                            RESOURCE_NAME: eventData.customTitleSplit[0],
                                                            ACTIVITY_NAME: eventData.customTitleSplit[1],
                                                            FormGroupKey: $scope.selectEventDetails.formGroupKey,
                                                            participant: {
                                                                DESCRIPTION: String(eventData.description),
                                                                COMPANY_CODE: eventData.COMPANY_CODE,
                                                                CALENDAR_CODE: eventData.CALENDAR_CODE
                                                            },
                                                            transaction: {
                                                                SLOT: eventData.Id,
                                                                RESOURCE: eventData.resourceId,
                                                                ACTIVITY: eventData.activities,
                                                                STUDENT: "",
                                                                REMARKS: "",
                                                                FEES: "",
                                                                ATTENDANCE: "NOT-MARKED",
                                                                COMPANY_CODE: eventData.COMPANY_CODE,
                                                                CALENDAR_CODE: eventData.CALENDAR_CODE
                                                            }
                                                        }

                                                        $.ajax({
                                                            url: "/UserAdmin/EnrollCourse",
                                                            type: "POST",
                                                            data: obj,
                                                            success: function (data) {
                                                                hideLoader();
                                                                if (!data.Status) {
                                                                    if (data.Message == "ALREADY-ENROLLED") {
                                                                        swal({
                                                                            title: "Can't Enroll Again!",
                                                                            text: "You are already enrolled in this course.",
                                                                            icon: "error",
                                                                            button: "Okay"
                                                                        });
                                                                        //swal({ type: 'error', showCloseButton: true, html: "You are already enrolled in this calendar." });
                                                                    } else if (data.Message == "LIMIT-ERROR") {
                                                                        swal({
                                                                            title: "Failed to Enroll!",
                                                                            text: "Maximum no. of participants already enrolled in this course.",
                                                                            icon: "error",
                                                                            button: "Okay"
                                                                        });
                                                                    } else {
                                                                        swal({
                                                                            title: "Warning!",
                                                                            text: data.Message,
                                                                            icon: "error",
                                                                            button: "Okay"
                                                                        });
                                                                    }
                                                                } else {
                                                                    swal({
                                                                        title: "Congratulations!",
                                                                        text: "Enrolled Successfully!",
                                                                        icon: "success",
                                                                        button: "Okay"
                                                                    }).then(function (boolValue) {
                                                                        window.location.reload();
                                                                    });

                                                                }

                                                            },
                                                            error: function () {
                                                                swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                                                            }
                                                        })
                                                    } else {
                                                        $scope.renderAdditionalDetailsForm();
                                                    }
                                                },
                                                error: function (error) {
                                                    console.error(error);
                                                }
                                            });
                                        } else {
                                            window.location.replace("/company/package/" + localStorage.getItem("COMPANY_CODE") + "/" + localStorage.getItem("CALENDAR_CODE"));
                                        }

                                    } else if (check === "other") {
                                        //debugger;
                                        buyCourse(eventData.activities);
                                    }
                                });

                            }
                        })
                    }

                },
                error: function () {

                }
            })
        }

        $scope.cancelPublicUserBooking = function () {
            var eventData = $scope.selectEventDetails;

            swal({
                title: "Are you sure to cancel the selected booking?",
                buttons: {
                    cancel: "No",
                    confirm: "Yes"
                }

            }).then(function (response) {
                //debugger;
                if (response) {
                    showLoader();

                    var obj = {
                        USER_ID: "",
                        RESOURCE_NAME: eventData.customTitleSplit[0],
                        ACTIVITY_NAME: eventData.customTitleSplit[1],
                        FormGroupKey: $scope.selectEventDetails.formGroupKey,
                        participant: {
                            COMPANY_CODE: eventData.COMPANY_CODE,
                            CALENDAR_CODE: eventData.CALENDAR_CODE
                        },
                        transaction: {
                            SLOT: eventData.Id,
                            RESOURCE: eventData.resourceId,
                            ACTIVITY: eventData.activities,
                            STUDENT: "",
                            REMARKS: "",
                            FEES: "",
                            ATTENDANCE: "NOT-MARKED",
                            COMPANY_CODE: eventData.COMPANY_CODE,
                            CALENDAR_CODE: eventData.CALENDAR_CODE
                        }
                    }

                    $.ajax({
                        url: "/UserAdmin/CancelPublicUserBooking",
                        type: "POST",
                        data: obj,
                        success: function (data) {
                            hideLoader();

                            swal({
                                title: (data.Status) ? "Success" : "Error",
                                text: data.Message,
                                icon: (data.Status) ? "success" : "error",
                                button: "Okay"
                            }).then(function () {
                                if (data.Status) {
                                    window.location.reload();
                                }
                            });

                        },
                        error: function () {
                            hideLoader();
                            swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                        }
                    })
                } else {
                    hideLoader();
                }
            });


        }

        $scope.reviewSession = function () {
            var eventData = $scope.selectEventDetails;

            $.ajax({
                url: "/UserAdmin/GetSingleEventDetails",
                type: "GET",
                data: {
                    EventId: eventData.Id,
                    Type: 2
                },
                success: function (response) {
                    //debugger;
                    $("#customEventDetailsModelPopUp").modal("hide");
                    $("#customEventDetailsServiceModelPopUp").modal("hide");
                    $("#ViewBookingModal .modal-body").html(response);
                    $("#ViewBookingModal").modal("show");
                },
                error: function (error) {

                }
            });

        }

        $scope.renderAdditionalDetailsForm = function () {
            $.ajax({
                url: "/FormAPI/ManageForm",
                method: "POST",
                async: false,
                data: {
                    data: {
                        action: 7,
                        formId: $scope.calendarDetails.ADDITIONAL_FORM_ID
                    }
                },
                success: function (response) {

                    if (response.length > 0) {

                        var data = JSON.parse(response[0].fields);
                        $scope.importFormSettings = response[0];

                            let dataModel = {
                                Id: 1,
                                CALENDAR_CODE: $scope.calendarDetails.CALENDAR_CODE,
                                COMPANY_CODE: $scope.calendarDetails.COMPANY_CODE,
                                Is_New: true
                            };

                        $scope.htmlContentData = $scope.importFormSettings.formContentHTMLTemp;




                        setTimeout(function () {
                            customEntryElementsValidation();
                            var dataModelList = $('#customFormNew').serializeArray().map(x => x.name);
                            dataModelList.forEach(x => {
                                if (x == "COMPANY_CODE" || x == "CALENDAR_CODE" || x == "RECORD_ID") {
                                    $(`#customFormNew .border-${x}`).hide();
                                }
                                if (dataModel[x]) {
                                    $(`#customFormNew input[name=${x}]`).val(dataModel[x]);
                                }
                            });

                        }, 500);
                        


                        //if (data["Page 1"] != null && data["Page 1"] != undefined) {
                        //    var data2 = JSON.parse(data["Page 1"]);
                        //    //debugger;
                        //    let containerClass = "";

                        //    dataModelList = [];
                        //    data2.forEach(x => {

                        //        dataModelList.push({
                        //            label: x["label"],
                        //            containerClass: "col-md-" + parseInt((12 / parseInt(100 / parseInt(x["column_width"])))),
                        //            name: x["name"],
                        //            type: x["type"],
                        //            required: x["required"],
                        //            description: x["description"],
                        //            values: (x["type"] == "radio-group" || x["type"] == "select" || x["type"] == "checkbox-group") ? x["values"] : null
                        //        });

                        //    });

                        //    let dataModel = {
                        //        Id: 1,
                        //        CALENDAR_CODE: $scope.calendarDetails.CALENDAR_CODE,
                        //        COMPANY_CODE: $scope.calendarDetails.COMPANY_CODE,
                        //        Is_New: true
                        //    };

                        //    $("#service-div").empty();
                        //    $("#service-div").append(`<form class="form" id="service-elem"> <div class="row mt-3"></div></form>`)

                        //    $("#service-div #service-elem .row").append(response[0].formContentHTMLTemp);

                        //    $('#service-div #service-elem').on("submit", function (evt) {
                        //        //debugger;
                        //        try {
                        //            if ($('#service-div #service-elem').valid()) {
                        //                evt.preventDefault();
                        //                $scope.createDynamicFormEntry();
                        //            } else {
                        //                evt.preventDefault();
                        //            }
                        //        } catch (err) {
                        //            evt.preventDefault();
                        //        }
                        //    })

                        //    dataModelList.forEach(x => {
                        //        if (x.name == "COMPANY_CODE" || x.name == "CALENDAR_CODE" || x.name == "RECORD_ID") {
                        //            //$("#service-div #service-elem-" + dataModel.Id + " .row ").
                        //            $(`#service-div .border-${x.name}`).hide();
                        //        } else {
                        //            if (x.name.includes('button')) {
                        //                $(`#service-div .border-${x.name}0`).addClass("col-sm-2");
                        //                $(`#service-div .border-${x.name}00`).addClass("col-sm-2");
                        //            }
                        //            dataModel[x.name] = "";
                        //        }

                        //        $(`#service-div input[name=${x.name}]`).val(dataModel[x.name]);
                        //    });

                        //    dataList = [];
                        //    dataList.push(dataModel);
                        //    setTimeout(function () {
                        //        dataModelList.forEach(x => {
                        //            if (x.type == "file") {

                        //            } else {
                        //                $(`#service-div input[name^=${x.name}]`).bind("keyup change paste", function () {
                        //                    dataList[0][x.name] = this.value;
                        //                })

                        //                $(`#service-div select[name^=${x.name}]`).bind("keyup change paste", function () {
                        //                    dataList[0][x.name] = this.value;
                        //                })

                        //                $(`#service-div textarea[name^=${x.name}]`).bind("keyup change paste", function () {
                        //                    dataList[0][x.name] = this.value;
                        //                })
                        //            }

                        //            if (x.type == "select") {
                        //                dataList[0][x.name] = this.value;
                        //            }

                        //        });
                        //    }, 500);


                        //    var element = document.querySelector('#service-div');
                        //    element.scrollTop = element.scrollHeight;

                        //    $("#customEventDetailsModelPopUp").modal("hide");
                        //    $("#customEventDetailsServiceModelPopUp").modal("hide");
                        //    //$("#AdditionalDetailsFormModal").modal("show");
                        //    hideLoader();
                        //}

                    }


                },
                error: function (error) {

                }
            })
        }

        $scope.existButtonFunc = function () {
            $("#AdditionalDetailsFormModal").modal("hide");
            $("#AdditionalDetailsFormModal #service-div").empty();
        }

        $scope.fileUploadDataEntry = function (id, uploaderType) {


            var oFReader = new FileReader();
            var files = document.getElementById(id).files;
            $scope.uploadFileOnly(files, id, uploaderType);

        };

        $scope.uploadFileOnly = function (element, id, uploadType) {

            if (angular.isDefined(element)) {
                var fileData = element;
                var fd = new FormData();
                var reqType = "form";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                var appIdParam = $scope.importFormSettings.applicationId;
                var appTitleParam = $scope.importFormSettings.applicationTitle;
                var formIdParam = $scope.importFormSettings.formId;
                var formTitleParam = $scope.importFormSettings.title;
                var counterfile = 0;
                angular.forEach(fileData, function (value, key) {
                    //console.log(value);
                    counterfile++;
                    var NamingIndex = "file1";
                    fd.append(NamingIndex, value);
                });
                //fd.append('file', fileData);

                //console.log(fd);
                mainService.uploadFile("UploadFile", fd, reqType, uid, appIdParam, appTitleParam, formIdParam, formTitleParam, false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                if (response.data.code == 200) {


                                    var oFReader = new FileReader();
                                    var files = document.getElementById(id).files;
                                    //alert(uploaderType);

                                    if (files.length > 1) {
                                        getMultipleFiles(id);
                                    }
                                    else if (files.length == 1) {
                                        getSingleFile(id, uploadType);
                                    };

                                    var urlStr = response.data.fileUrl;
                                    //if()
                                    if (uploadType == "multi") {
                                        setHiddenField(id, urlStr);
                                        //debugger;
                                        $('#customFormNew input[name="' + id + '"]').val(urlStr);
                                        //dataList[0][id] = urlStr
                                    }
                                    else {
                                        $("input:hidden[name=" + id + "]").val(urlStr);
                                        //debugger;
                                        //dataList[0][id] = urlStr
                                    }
                                    console.log("uploaded Successfully");
                                } else {
                                    document.getElementById(id).value = null;
                                    notifierService.notifySweetAlertMessage('error', 'File', response.data.message);
                                }
                                $rootScope.$emit("HideLoading");
                            }

                        }
                    }
                        , function (err) {
                            console.log("some error occured." + err);
                            $rootScope.$emit("HideLoading");
                        });
            }
        };

        $scope.createDynamicFormEntry = function () {
            var eventData = $scope.selectEventDetails;


            var formDatas = [];
            
            var obj = {};
            dataList.forEach(x => {
                obj[x.name] = x.value;
            });
            formDatas.push(obj);



            $.ajax({
                url: "/UserAdmin/CreateDynamicFormEntry",
                method: "POST",
                data: {
                    data: formDatas,
                    formId: $scope.calendarDetails.ADDITIONAL_FORM_ID,
                    CalendarCode: $scope.calendarDetails.CALENDAR_CODE
                },
                success: function (response) {
                    $rootScope.$emit("HideLoading");
                   
                    // after success response
                    //debugger;
                    if (response.Status) {

                        swal({
                            icon: "success",
                            title: "Great!",
                            text: "Form saved successfully!",
                            buttons: {
                                confirm: "Okay"
                            }
                        }).then(function (value) {
                            if ($scope.IsEventBackground) {
                                invokeBookingService($scope.bgEventDetails.start, $scope.bgEventDetails.end, $scope.bgEventDetails.bgevent);
                            } else {
                                var obj = {
                                    USER_ID: "",
                                    RESOURCE_NAME: eventData.customTitleSplit[0],
                                    ACTIVITY_NAME: eventData.customTitleSplit[1],
                                    FormGroupKey: $scope.selectEventDetails.formGroupKey,
                                    participant: {
                                        DESCRIPTION: String(eventData.description),
                                        COMPANY_CODE: eventData.COMPANY_CODE,
                                        CALENDAR_CODE: eventData.CALENDAR_CODE
                                    },
                                    transaction: {
                                        SLOT: eventData.Id,
                                        RESOURCE: eventData.resourceId,
                                        ACTIVITY: eventData.activities,
                                        STUDENT: "",
                                        REMARKS: "",
                                        FEES: "",
                                        ATTENDANCE: "NOT-MARKED",
                                        COMPANY_CODE: eventData.COMPANY_CODE,
                                        CALENDAR_CODE: eventData.CALENDAR_CODE
                                    }
                                }

                                $.ajax({
                                    url: "/UserAdmin/EnrollPublicUserForCalendar",
                                    type: "POST",
                                    data: obj,
                                    success: function (data) {
                                        hideLoader();
                                        if (!data.Status) {
                                            if (data.Message == "ALREADY-ENROLLED") {
                                                swal({
                                                    title: "Can't Enroll Again!",
                                                    text: "You are already enrolled in this event.",
                                                    icon: "error",
                                                    button: "Okay"
                                                }).then(function (boolValue) {
                                                    window.location.href = '/useradmin/index';
                                                });
                                                //swal({ type: 'error', showCloseButton: true, html: "You are already enrolled in this calendar." });
                                            } else if (data.Message == "LIMIT-ERROR") {
                                                swal({
                                                    title: "Failed to Enroll!",
                                                    text: "Maximum no. of participants already enrolled in this activity.",
                                                    icon: "error",
                                                    button: "Okay"
                                                }).then(function (boolValue) {
                                                    window.location.href = '/useradmin/index';
                                                });
                                            } else {
                                                swal({
                                                    title: "Warning!",
                                                    text: data.Message,
                                                    icon: "error",
                                                    button: "Okay"
                                                }).then(function (boolValue) {
                                                    window.location.href = '/useradmin/index';
                                                });;
                                            }
                                        } else {
                                            swal({
                                                title: "Congratulations!",
                                                text: "Enrolled Successfully!",
                                                icon: "success",
                                                button: "Okay"
                                            }).then(function (boolValue) {
                                                window.location.href = '/useradmin/index';
                                            });
                                        }

                                        $("#AdditionalDetailsFormModal").modal("hide");
                                        $("#AdditionalDetailsFormModal #service-div").empty();
                                    },
                                    error: function () {
                                        swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                                    }
                                })
                            }

                        });



                    } else {
                        swal({
                            icon: "error",
                            title: "Error",
                            text: response.Message
                        });
                    }

                    $rootScope.safeApply();

                },
                error: function (er) {
                    swal({
                        icon: "error",
                        title: "Error",
                        text: "Some internal error"
                    });
                    //debugger;
                    $rootScope.$emit("HideLoading");
                }
            });

        }

        $scope.enrollPublicUserForRental = function () {

            showLoader();
            //debugger;
            try {
                let test1 = moment($scope.selectEventDetails.start);
                let test2 = moment($scope.selectEventDetails.end)
                if (!test1.isValid() || !test2.isValid()) {
                    alert('Please select date range');
                    hideLoader();
                    return;
                }
            } catch (ex) {
                alert('Please select date range');
                hideLoader();
                return;
            }

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
                        }).then(function (value) {
                            if (value) {
                                window.location.href = '/Account/BusinessLogin?returnUrl=' + window.location.href + '';
                            }
                        });
                    } else {
                        showLoader();

                        let eventData = $scope.selectEventDetails;

                        var obj = {
                            start: eventData.start,
                            end: eventData.end,
                            resources: eventData.resources,
                            activities: "",
                            description: "",
                            allDay: "false",
                            color: "",
                            CALENDAR_CODE: eventData.CALENDAR_CODE,
                            COMPANY_CODE: eventData.COMPANY_CODE
                        }

                        $.ajax({
                            url: "/UserAdmin/CreateRoomBookingSlot",
                            type: "POST",
                            data: obj,
                            success: function (data) {
                                hideLoader();
                                if (!data.Status) {
                                    swal({
                                        title: "Failed to book",
                                        text: data.Message,
                                        icon: "error",
                                        button: "Okay"
                                    });
                                } else {
                                    swal({
                                        title: "Congratulations!",
                                        text: data.Message,
                                        icon: "success",
                                        button: "Okay"
                                    }).then(function (boolValue) {
                                        window.location.reload();
                                    });

                                }

                            },
                            error: function () {
                                swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                            }
                        })
                    }

                },
                error: function () {

                }
            })


        }


        $scope.validateForm = function (_fileInput, isrequired = false) {
            $('#fileSuccess').html('');
            var fileInput = document.getElementById(_fileInput);
            var fileError = document.getElementById("fileError2");
            var EventUploadBtn = $("#EventUploadBtn2");
            var allowedExtensions = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            var maxSize = 5 * 1024 * 1024; // 5MB
            if (fileInput.files.length === 0 && isrequired) {
                fileError.textContent = 'Please select a file.';
                EventUploadBtn.attr("disabled", "disabled");
                EventUploadBtn.addClass("disabled");
                return false;
            }

            for (var i = 0; i < fileInput.files.length; i++) {
                if (!allowedExtensions.includes(fileInput.files[i].type)) {
                    fileError.textContent = 'Invalid file type. Allowed types are: image, PDF, Word document, Excel.';
                    EventUploadBtn.attr("disabled", "disabled");
                    EventUploadBtn.addClass("disabled");
                    return false;
                }

                var fileSize = fileInput.files[i].size; // in bytes


                if (fileSize > maxSize) {
                    fileError.textContent = 'File size exceeds the maximum limit of 5MB.';
                    return;
                }
            }

            EventUploadBtn.removeAttr("disabled");
            EventUploadBtn.removeClass("disabled");
            fileError.textContent = '';
            return true;
        }


        $scope.uploadFiles = function () {

            let inputfileName = "SELECT_DOWNLOADABLE_ATTACHMENT";

            var fileInput = $('#' + inputfileName)[0].files;




            if ($scope.validateForm(inputfileName, true)) {
                var formData = new FormData();
                $.each(fileInput, function (key, value) {
                    formData.append('files', value);
                });

                // You can add additional form fields here if needed
                formData.append('clrcode', CALENDAR_CODE);
                formData.append('eventid', $scope.selectEventDetails.Id);


                // AJAX post request
                $.ajax({
                    url: BASE_URL + 'UserAdmin/UploadAssestementAttachment',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.Status) {
                            $('#fileSuccess').html('File Uploaded Successfully');
                            $scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA = response.Data;
                            $rootScope.safeApply();
                            let filepaths = response.Data.map(x => x.path).join(",");
                            $scope.selectEventDetails.ASSESSMENT_FILES = filepaths;
                            $scope.selectEventDetails.ASSESSMENT_FILES_LIST = JSON.stringify(response.Data);
                            $('#' + inputfileName).val(null);
                            var EventUploadBtn = $('#EventUploadBtn,#EventUploadBtn2');
                            EventUploadBtn.attr("disabled", "disabled");
                            EventUploadBtn.addClass("disabled");
                        } else {
                            alert(response.Message);
                        }
                        // Handle successful upload
                    },
                    error: function (xhr, status, error) {
                        console.error('Upload failed: ' + error);
                        // Handle upload failure
                    }
                });
            }
        }


        $scope.selectedEventRemoveFiles = function (index) {

            if (!confirm("Are you sure delete this file?")) {
                return;
            }
            if ($scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA.length > index) {
                let filepath = $scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA[index].path;
                $scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA.splice(index, 1);
                $scope.selectEventDetails.ASSESSMENT_FILES_LIST = JSON.stringify($scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA);
                $scope.selectEventDetails.ASSESSMENT_FILES = $scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA.map(x => x.path).join(",");
                let eventId = $scope.selectEventDetails.Id;
                let transactionid = $scope.selectEventDetails.TRANSACTION_ID;
                uploadfilesDelete(filepath, transactionid, $scope.selectEventDetails.ASSESSMENT_FILES, JSON.stringify($scope.selectEventDetails.ASSESSMENT_FILES_LIST_DATA));
            }
        }
        function uploadfilesDelete(filePath, transactionid = '', downloadable_attachment = '', download_file_list = '') {
            var formData = new FormData();
            formData.append("filePath", filePath);
            formData.append("transactionid", transactionid);
            formData.append("downloadable_attachment", downloadable_attachment);
            formData.append("download_file_list", download_file_list);

            $.ajax({
                url: BASE_URL + 'UserAdmin/DeleteAssestementUploadFiles',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.Status) {
                        $(".calendar").fullCalendar('refetchEvents');
                        $('#fileSuccess').html('File Deleted Successfully');
                    } else {
                        alert(response.Message);
                    }
                    // Handle successful upload
                },
                error: function (xhr, status, error) {
                    console.error('delete failed: ' + error);
                    // Handle upload failure
                }
            });

        }

        function customEntryElementsValidation() {
            // imageless captcha varification
            var $submit = $('#customFormNew').find('button.btn[type="submit"]');
            // $submit.attr('disabled', 'disabled'); $submit.addClass('disabled');
            $(document).on('keyup', 'input.cp_text',
                function () {
                    imagelessCaptchaVerification($(this), $submit);
                });
            var newWindow = null, validationCount = 0, validattfrm = '';
            $(document).on('click', '.btn-edit', function (e) {
                //$('.btn-edit').click(function (e){
                e.preventDefault();
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea').removeAttr('readonly');
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea,.date').removeClass('editable-area')
                $('#FormBody .form-group select').removeAttr(('disabled'));
                $('#FormBody .form-group .date input[type=text]').removeClass('disabled');
                $('#FormBody .form-group  input[type=email]').removeAttr('disabled');
                $('#FormBody .form-group  input[type=password]').removeAttr('disabled');
                $('#btn_save').attr('value', '@Resources.Resource.Submit');
                $('#btn_save').removeClass('btn-edit').addClass('btn-success');
            });
            $(document).on('click', '#btn_exit', function (e) {
                var IsPopUp = $("#hfIsPopUp").val();
                if (IsPopUp == 1) {
                    window.close();
                }
                else {
                    //var FormId = $("#hfFormId").val();
                    var url = '@Url.Action("FormMasterTabulator", "FormMaster", new {FormId = "__FormId__"})';
                    window.location.href = url.replace('__FormId__', 4040).replace("&amp;", "&");
                }
            });
            var uploadPath = "", popupTabulator, tabulators;
            $(document).on('click', '.btn-success', function (e) {
                //$('#btn_save').click(function (e) {
                if (getParameterByName('optid') != null) {
                    e.preventDefault();
                    if ($(this).attr('value') == '@Resources.Resource.Edit')
                        return false;
                    updateFormData();
                }
                else {

                    var arrCtrl = [];
                    var arrRelationCtrl = [];
                    var objCtrl = {};
                    //Push FormName To Array
                    objCtrl["Name"] = "TableName";
                    objCtrl["Value"] = $("#lblFormName").val();
                    arrCtrl.push(objCtrl);
                    //For main Form Controls
                    $("#customForm :input").each(function () {
                        var objCtrl = {};

                        if ($(this).attr('type') == 'text' || $(this).is("textarea") || $(this).attr('type') == 'email' || $(this).attr('type') == 'password') {
                            objCtrl["Name"] = $(this).attr('name');
                            if ($(this).parent().hasClass('date')) {
                                objCtrl["DataType"] = "Date";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            else {
                                objCtrl["DataType"] = "Text";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'number') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                            objCtrl["DataType"] = "Number";
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'date') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? Date.parse($(this).val(), "yyyy-MM-dd HH:mm:ss") : '');
                            objCtrl["DataType"] = "Date";
                            arrCtrl.push(objCtrl);
                            // alert(objCtrl["Value"]);
                        }
                        else if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = $(this).prop("checked");
                            objCtrl["DataType"] = "Bool";
                            arrCtrl.push(objCtrl);
                        }
                    });
                    $("#customForm").find('select').not('#ddlLanguage').each(function () {
                        var objCtrl = {};
                        objCtrl["Name"] = $(this).attr('name');
                        objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                        objCtrl["DataType"] = "Text";
                        arrCtrl.push(objCtrl);
                    });
                    //For Tabulator

                    $('.tab-content .tab-pane .tabulator').each(function () {
                        var tableIds = [];
                        //console.log($(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').length)
                        $(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').each(function () {
                            tableIds.push({ "Name": 'TableId', "Value": $.trim($(this).text()), "DataType": 'Number' });
                        })
                        //var id = $(this).attr('id');
                        //console.log(id)
                        //var lbl = $('label[for="' + id + '"]').clone(true);
                        //lbl.find('a').remove();
                        //var tabulatorName = lbl.text().split(' ');
                        //var TabulatorId = $.trim(tabulatorName[0]);
                        //tabulators[TabulatorId] = tableIds;
                        ////For Persistent Column Layout
                        //var columnLayout = localStorage.getItem('tabulator-' + TabulatorId.toLowerCase());// +$.toString(TabulatorId).toLocaleLowerCase()// $("#" + TabulatorId).tabulator("getColumnLayout");
                        //var columnSort = localStorage.getItem('tabulator-' + TabulatorId.toLowerCase() + "-sort");
                        //$.cookie(TabulatorId.toLowerCase() + "_ColumnLayout", columnLayout);
                        //$.cookie(TabulatorId.toLowerCase() + "_ColumnSort", columnSort);
                    })
                    if (tabulators != undefined)
                        arrRelationCtrl.push(tabulators);
                    $("#hfJsonContent").val(JSON.stringify(arrCtrl));
                    $("#hfJsonRelationContent").val(JSON.stringify(arrRelationCtrl));
                }
            });
            var checkValue = setInterval(function () {
                if (newWindow != null) {
                    if (newWindow.closed) {
                        newWindow = null;
                        location.reload(true);
                        reloadTabulator();


                    }
                }
            }, 1000);
            $('button[type="submit"], button[type="submitexcel"]').unbind("click");
            $('button[type="submit"], button[type="submitexcel"]').on('click', function (elementButton) {


                let $this = $(this),
                    currentType = $this.attr('type');
                localStorage.setItem("submitType", currentType);
                if (validationCount == 0) {
                    validattfrm = $('#customFormNew').formValidation({
                        framework: 'bootstrap',
                        excluded: [':disabled'],
                        icon: {
                            valid: '',
                            invalid: '',
                            validating: 'fa fa-sync fa-pulse'
                        }
                    })
                        .on('success.form.fv', function (e, data) {
                            e.preventDefault();

                            var invalid = 0;
                            if ($("input.cp_text").length) {
                                var $submit = $('#customFormNew').find('button.btn[type="submit"]');
                                $("input.cp_text").each(function () {
                                    let status = imagelessCaptchaVerification($(this), $submit);
                                    invalid = invalid + status;
                                });

                                if (invalid > 0) {
                                    return false;
                                } else {
                                    angular.element(this).scope().onEntryFormSubmit();
                                }
                            }
                            else {

                                if (localStorage.getItem("submitType") != null) {
                                    currentType = localStorage.getItem("submitType")
                                }
                                if (currentType == "submitexcel") {

                                    textBoxLoader(true);
                                    if ($scope.formFieldExcelParam.listOfInput.length > 0) {
                                        angular.forEach($scope.formFieldExcelParam.listOfOutput, function (item) {
                                            $("#" + item.id).val(item.value);
                                            $("#" + item.id).addClass("loader");
                                        })
                                        updateExcel(false);
                                    }
                                    $this.closest('form').find('button[type="submit"]').removeAttr('disabled');
                                    $this.closest('form').find('button[type="submit"]').removeClass('disabled');

                                }
                                else {
                                    $scope.onEntryFormSubmit();
                                }
                                localStorage.removeItem("submitType")
                            }
                        });

                    validationCount = 1;
                }
            });
        };


        $scope.onEntryFormSubmit = function (formFields) {
            modifyFormData();
        }


        function modifyFormData() {
            var isCapchaVerified = window["capcha"];
            if (!DataService.isEmpty(isCapchaVerified))
                if (!isCapchaVerified) {
                    notifierService.notifySweetAlertMessage('error', '', 'capcha is not verified');
                    $rootScope.$emit("HideLoading");
                    return;
                }
            if ($scope.myForm.$invalid) return false;
            var temp = $("#customFormNew").serializeArray();
            var names = {};
            names = (function () {
                var n = [],
                    l = temp.length - 1;
                for (; l >= 0; l--) {
                    n.push(temp[l].name);
                }
                return n;
            })();
            var isDropdownCalenderControl = "";
            var referrrenceFormGroupKey = "";
            var listOfHidden = $("input[type='hidden']");
            _.each(listOfHidden, function (item) {
                if (item.id.contains('isDropdownCalender')) {
                    isDropdownCalenderControl = item.value;
                }
            });
            if (isDropdownCalenderControl != "") {
                var exists = _.findWhere(temp, { name: isDropdownCalenderControl });
                if (!DataService.isEmpty(exists)) {
                    referrrenceFormGroupKey = $("#" + exists.name + " option[value='" + exists.value + "']").data("formgroupkey");
                    if (referrrenceFormGroupKey == undefined)
                        referrrenceFormGroupKey = "";
                }
            }
            var chkListTemp = [];
            $('#customFormNew').find($('input[type="checkbox"]:not(:checked)')).each(function () {
                if ($.inArray(this.name, names) === -1) {
                    //temp.push({ name: this.name, value: '' });
                    chkListTemp.push({ name: this.name, value: '' });
                }
            });
            if (chkListTemp.length > 0) {
                chkListTemp = _.uniq(chkListTemp, "name");
                _.each(chkListTemp, function (itcheck, keyck) {
                    temp.push({ name: itcheck.name, value: '' });
                });
            }
            var frm = $('#customFormNew').find(":input:not(:hidden)").serialize();
            // console.log(temp);
            var param = {};
            if (!$scope.isEdit) {
                param.action = 1;
                param.formGroupKey = uuidv4();
                if (referrrenceFormGroupKey != "") {
                    param.formGroupKey = referrrenceFormGroupKey;
                }
                temp.push({ "formGroupKey": $scope.freshEntryformGroupKey, "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
            }
            else {
                param.action = 2;
                param.formGroupKey = $scope.formGroupKey;
                param.Id = $scope.rowId;
                if (referrrenceFormGroupKey != "") {
                    param.formGroupKey = referrrenceFormGroupKey;
                }
                temp.push({ "formGroupKey": $scope.formGroupKey, "name": "formGroupKey", "value": $scope.formGroupKey });
            }

            var listAllFields = [];
            angular.forEach($scope.formFields, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {
                    listAllFields.push(item);
                });
            });


            var compareableControls = _.filter(listAllFields, function (item) {
                return !DataService.isEmpty(item.compare_value_with_control)
                    && !DataService.isEmpty(item.compare_operation)
            });
            if (compareableControls.length > 0) {
                var temp1 = angular.copy(temp);
                var compareResult = compareValues(compareableControls, temp1, listAllFields);
                if (compareResult.length > 2) {
                    notifierService.notifySweetAlertMessage('error', 'Compare Field', compareResult);
                    return false;
                }

            }

            $timeout(function () {

                $rootScope.$emit("ShowLoading");
                var checkboxGroup = [];
                var namecheckbox = "";
                var removeIndexGroup = [];
                var groupByData = _.groupBy(temp, "name");
                var newList = [];
                angular.forEach(groupByData, function (item, key) {
                    //console.log(item)
                    //console.log(key)
                    if (item.length == 1) {
                        if (key.contains("[]") && item[0].value == "") {
                        } else {
                            newList.push({ "name": key, "value": item[0].value });
                        }
                        var exists = _.findWhere(listAllFields, { name: key });
                        if (!DataService.isEmpty(exists)) {
                            if (!DataService.isEmpty(exists.Referral_Form_Fields)) {
                                var exists1 = {};
                                exists1 = _.findWhere(temp, {
                                    name: exists.Referral_Form_Fields + "_hidden"
                                });
                                var exists2 = {}
                                exists2 = _.findIndex(newList, {
                                    name: key
                                });
                                if (!DataService.isEmpty(exists1))
                                    if (!DataService.isEmpty(exists2)) {
                                        newList[exists2].value = exists1.value;
                                        $scope.strReferenceForm = exists.Referral_Forms;
                                    }
                            }
                        }
                    }
                    else if (item.length > 1) {
                        var tmp = _.map(item, function (t) { return t.value }).join(',');
                        newList.push({ "name": key, "value": tmp });
                    }
                });

                //param.formfieldDataListTemp = JSON.stringify(newList);
                dataList = newList;
                $scope.createDynamicFormEntry();
            }, 180);
        }

    }).filter('safeHtml', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

    
}(FormGeneratorApp));

function setFavoritesData(pageId) {
    angular.element("#company-filter-selector").scope().setFavoritesData(pageId);
}

function setWalletData(pageId) {
    angular.element("#company-filter-selector").scope().setWalletData(pageId);
}

function getCalenderSettingsLocal(companyCode) {
    var data = null;
    $.ajax({
        type: "POST",
        url: BASE_URL + "FormAPI/getCalenderSettingsFormData",
        data: JSON.stringify({ "action": 4, "IsPublicUser": true, "formId": 2305, "IsCustomFilter": true, IsCustomInFilter: false, "CustomFilters": [{ "FieldName": "COMPANY_CODE", "Value": companyCode }] }),
        contentType: "application/json",
        async: false,
        success: function (response) {

            data = response;

        }
    });
    return data;
}

function getCalendarDetailsLocal(id) {
    var data = null;
    $.ajax({
        type: "POST",
        url: BASE_URL + "MarketPlace/GetCalendarDetails/" + id,
        contentType: "application/json",
        async: false,
        success: function (response) {
            data = response;
        }
    });
    return data;
}

function validateDynamicForm() {
    let finalResult = true;

    requiredList = dataModelList.filter(x => x.required);
    if (requiredList != null) {
        if (requiredList.length > 0) {
            requiredList.forEach(x => {
                if (dataList[0][x.name] == "") {
                    finalResult = false;
                    $("#service-div input[name=" + x.name + "]").addClass("error")
                } else {
                    $("#service-div input[name=" + x.name + "]").removeClass("error");
                }
            })

        }
    }

    if (!finalResult) {
        swal({
            icon: "warning",
            title: "Alert",
            text: "Please fill the mandatory fields of form to proceed."
        }).then(function (res) {
            var element = document.querySelector('#service-div');
            element.scrollTop = element.scrollHeight;
        });
    }

    return finalResult;
}

function getSingleFile(id, uploaderType) {
    //$('#' + id).parents('.form-group').find('.attachments span.file-attachments').remove();
    var oFReader = new FileReader();
    var files = document.getElementById(id).files[0];
    oFReader.readAsDataURL(files);
    if (files.type.match('image.*')) {
        oFReader.onload = function (oFREvent) {
            if (uploaderType == "multi") {
                getMultipleFiles(id);
            }
            else {
                document.getElementById("uploadPreview_" + id).src = oFREvent.target.result;
                $("#uploadPreview_" + id).parent().removeClass("hidden");
                $("#uploadPreview_" + id).parent().find('.file-title').html(files.name);
            }

        };
    } else {
        if (uploaderType == "multi") {
            getMultipleFiles(id);
        }
        else {
            $('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().addClass('hidden');
            var fileAttachments = $('#' + id).parents('.form-group').find('.attachments .file-attachments');
            fileAttachments.find('p').append(files.name);
            fileAttachments.removeClass("hidden");
        }


    }
}

function getMultipleFiles(id) {
    var files = document.querySelector('#' + id).files;
    function readAndPreview(file) {
        var div = $('<div />', { class: 'figure' });
        div.appendTo($('#shw_profile_' + id + ' > div.fileData'));
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var img = $('<img />', {
                    class: 'scaled',
                    height: '100',
                    src: this.result,
                    alt: file.name
                });
                img.appendTo(div);

                var p = $('<p />').html(file.name);
                p.appendTo(div);

                var span = $('<span />').attr('class', 'img-wrapclose img-close multiple-files').html('×');
                span.appendTo(div);
            }, false);
            reader.readAsDataURL(file);
        } else {
            div.append('<i class="far fa-file-alt fa-2x"></i>');

            var p = $('<p />').attr('class', 'file-attachments').html(file.name);
            p.appendTo(div);

            div.append('<span class="img-wrapclose file-close multiple-files">×</span>');
        }
    }
    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}

function setHiddenField(uploaderId, url) {
    var value = $("input:hidden[name=" + uploaderId + "]").val();

    if (value == 'null' || value == "" || typeof value === "undefined") {
        // alert('isnull');
        $("input:hidden[name=" + uploaderId + "]").attr('value', url);

    }
    else {

        var Arr = url.split(',');

        angular.forEach(Arr, function (item, key) {
            if (value.indexOf(item) > -1) {

            }
            else {
                value += ',' + item;
            }

        });


        $("input:hidden[name=" + uploaderId + "]").attr('value', value);


    }



    //$("input:hidden[name=" + id + "]").attr('value', "");


}

function getUserEnrollDetails(id) {
    var data = null;
    $.ajax({
        type: "GET",
        url: BASE_URL + "UserAdmin/GetEnrollUserDetails/" + id,
        contentType: "application/json",
        async: false,
        beforeSend: function () {
            showLoader();
        },
        success: function (response) {
            hideLoader();
            data = response;

        }
    });
    return data;
}