var CalendarFormId = "2305", ySelection = "", xSelection = "", COMPANY_CODE, CALENDAR_CODE, formDetailsDataInfo, counterLoader, xaxisFormList, formAllDatafields, listTabulator, calendarDetails;
var calendarObject = {};
$(document).ready(async function () {

    $("#nv-company-schedule").addClass("active");
    $("#txtCommonCurrentCompanyCode").val($("#txtCurrentCompanyCode").val());

    var formdetail = await getFormDetails();
    formDetailsDataInfo = formdetail[0];
    
    var formFields = [];
    var formData = JSON.parse(formDetailsDataInfo.fields);
    _.map(formData, function (pagesData, key) {
        if (!Array.isArray(pagesData))
            formData[key] = JSON.parse(pagesData);
        _.map(formData[key], function (item) {
            formFields.push(item);
        });

    });
    //var formFields = formData;
    formAllDatafields = formFields;
    listTabulator = _.where(formAllDatafields, { type: "tabulator" });



    var resResults = [];
    var resColumns = [];
    var activityResults = [];
    var activityColumns = [];
    var activities = [];
    window["EventBasicDetail"] = manageWindowParams();

    var calenderSettings = await getCalenderSettings();


    calendarDetails = (await getCalendarDetails(CALENDAR_CODE)).Data;
    var IS_APPOINTMENT_BOOKING_CLR = calendarDetails["CALENDAR_CATEGORY_ID"] == "2";


    console.log(calendarDetails, "calendarDetails");
    if (calenderSettings.length > 0) {

        var caledarConfig = calenderSettings;

        var resourceConfig = caledarConfig.find(x => x.resourceForm != 0 && x.IsDefault);
        var activityConfig = caledarConfig.find(x => x.activitiesForm != 0 && x.IsDefault);
        ySelection = resourceConfig.resourceForm;
        xSelection = activityConfig.activitiesForm;
        var $scope = angular.element($("#calendar")).scope();

        $scope.otherFormId = 0;
        $scope.otherFormId = formDetailsDataInfo.otherformid;

        if ($scope.otherFormId != 0) {
            $scope.otherformDetails = await ManageFormApp($scope.otherFormId);
        }


        var allForm = await GetFormList();

        if (!DataService.isEmpty(allForm)) {
            $scope.allFormsList = allForm;
            if ($scope.allFormsList.length > 0) {
                var exists = _.filter($scope.allFormsList, function (item) {
                    return (!DataService.isEmpty(item.formTag) ? (item.formTag.toLowerCase().contains("course")
                        || item.formTag.toLowerCase().contains("slot"))
                        : false);
                });
                if (exists.length > 0) {
                    $scope.isCourseForm = true;
                    $scope.courseFormId = exists[0].formId;
                }
            }
        }

        $scope.ySelection = ySelection;
        $scope.xSelection = xSelection;
        window["ySelected"] = ySelection;
        window["xSelected"] = xSelection;

        xaxisFormList = [];
        angular.forEach(calenderSettings, function (dataRow, position) {
            //console.log(dataRow);
            if (dataRow.activitiesForm !== 0)
                xaxisFormList.push(dataRow);
        });

        activityResults = activityConfig.formDataList;
        if (activityResults.length) {
            _.each(activityResults, function (item, key) {
                var ac_column = "";
                var exists = _.findWhere(calenderSettings, { resourceForm: xSelection });
                if (!DataService.isEmpty(exists)) {
                    if (DataService.isEmpty(item.title)) {
                        item.title = "";
                        _.each(exists.majorGroupParse, function (gItem, gKey) {
                            if (gKey == 0)
                                item.title += item[gItem] + " - ";
                            return true;
                        });
                        item.title += item[exists.minorGroup];
                    }
                } else {
                    var found = activities.filter(function (aitem) { return aitem.activitiesForm === xSelection; });
                    ac_column = found[0].activities;
                    for (var p in item) {
                        if (p == ac_column) {
                            item.title = p;
                        }
                    }
                    //var settitle = item.ac_column;
                    item.title = item[ac_column];
                }


            })
        }

        resResults = resourceConfig.formDataList;
        if (resResults.length) {
            _.each(resResults, function (item, key) {
                var ac_column = "";
                item.title = "";
                var exists = _.findWhere(calenderSettings, { resourceForm: ySelection });
                if (!DataService.isEmpty(exists)) {
                    if (DataService.isEmpty(item.title)) {
                        item.title = "";
                        _.each(exists.majorGroupParse, function (gItem, gKey) {
                            if (gKey == 0)
                                item.title += item[gItem] + " - ";
                            return true;
                        });
                        item.title += item[exists.minorGroup];
                    }
                }
            })
        }

        //calendar location bind
        getLocationMaster(calenderSettings);

        var eventBasicData = window["EventBasicDetail"];

        var param = {};
        param.action = 9;
        param.formId = CalendarFormId;
        param.resourceForm = resourceConfig.resourceForm;
        param.activitiesForm = activityConfig.activitiesForm;

        var response2 = await getAxisColumns(param);
        if (response2) {
            var _resFields = response2.resfields;
            var _actFields = response2.activityFields;
            var _colGroupingData = response2.colGrouping;
            window["colGrouping"] = _colGroupingData;
            _.each(_resFields, function (row, position) {
                var _Arr = {};
                _Arr["field"] = row.fieldName;
                _Arr["labelText"] = row.fieldLabel;
                resColumns.push(_Arr);
            });
            _.each(_actFields, function (row, position) {
                var _Arr = {};
                _Arr["field"] = row.fieldName;
                _Arr["labelText"] = row.fieldLabel;

                activityColumns.push(_Arr);
            });

            eventBasicData.resourceData = resResults;
            eventBasicData.resColumns = resColumns;

            eventBasicData.activityData = activityResults;
            eventBasicData.activityColumn = activityColumns;

            window["EventBasicDetail"] = eventBasicData;
            tabsActive();
            marcketplaceCalendar("", [], resResults, resColumns, activityResults, activityColumns, []);


        }


        $('.calendar-service-Location').change(function () {
            calendarObject.refetchEvents();
        });
    }

});
function changeStateOfCalenderController(view) {
    var temp = {};
    temp.field = "start";
    if (view.type.toLowerCase().contains("month")) {
        temp.value = " datepart(mm,[start]) =month('" + view.intervalStart.format("YYYY-MM-DD") + "')   and datepart(yyyy, [start]) = year('" + view.intervalStart.format("YYYY-MM-DD") + "') ";
    }
    else if (view.type.toLowerCase().contains("year")) {
        temp.value = " datepart(yyyy, [start]) = year('" + view.intervalStart.format("YYYY-MM-DD") + "') ";
    }
    else if (view.type.toLowerCase().contains("week") || view.type.toLowerCase().contains("twodays") || view.type.toLowerCase().contains("threedays")) {
        temp.value = " CAST([start] as date) between CAST('" + view.intervalStart.format("YYYY-MM-DD") + "' as date) and CAST('" + view.intervalEnd.format("YYYY-MM-DD") + "' as date)  ";
    }
    else if (view.type.toLowerCase().contains("day")) {
        temp.value = " CAST([start] as date) =CAST('" + view.intervalStart.format("YYYY-MM-DD") + "' as date) ";
    }
    return temp;
}


async function reBindCalender(param) {

    var CalanderCode = CALENDAR_CODE;
    param.IsCustomFilter = true;
    param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }, { "FieldName": "CALENDAR_CODE", "Value": CalanderCode }];
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/GetFormRecordList",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });
}

function tabsActive() {
    $("#tabs").tabs({
        create: function (event, ui) {
            //console.info(ui.tab.data('value'))
        },
        activate: function (event, ui) {
            //console.info($(ui.newTab).find('a').attr('href'));//ui.oldTab.data('value')
            var target = $(ui.newTab).find('a').attr('href');
            // $(target + ' div.calendar').fullCalendar('render');
            //$(target + ' div.calendar').fullCalendar('refetchEvents');
            $('body .popover').remove();
            $.cookie("calendar-activeView", $('a[href="' + target + '"]').parent().index(), { expires: 365, path: '/' });

            //$(target + ' div.calendar').fullCalendar('rerenderEvents');
        }
    });
    $("#tabs").show();
    $("#tabs").tabs("option", "active", 0);
}

async function getFormDetails() {
    showLoader();
    return new Promise(resolve => {
        var param = {};
        param.action = 4;
        param.formId = CalendarFormId;
        var userDetail = GetUserDetails();
        param.created_by = userDetail.Id;
        param.update_by = userDetail.Id;

        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/ManageForm",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });
}


async function getCalenderSettings() {
    showLoader();
    var CalanderCode = CALENDAR_CODE;
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/getCalenderSettingsFormData",
            data: JSON.stringify({ "action": 4, "formId": CalendarFormId, "IsCustomFilter": true, "CustomFilters": [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }, { "FieldName": "CALENDAR_CODE", "Value": CalanderCode }] }),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);

            }
        });

    });
}

async function getAxisColumns(param) {
    showLoader();
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/getAxisColumns",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });
}

function GetUserDetails() {

    return JSON.parse(localStorage.getItem("detail"));
};

var manageWindowParams = function () {
    var userDetail = GetUserDetails();
    var data = {};
    data.action = 1;
    data.formId = CalendarFormId;
    data.formGroupKey = create_UUID();
    data.userId = userDetail.Id;
    data.created_by = userDetail.Id;
    data.update_by = userDetail.Id;
    data.formData = [];
    data.resourceData = [];
    data.resColumns = [];
    data.activityData = [];
    data.activityColumn = [];
    return data;
}

function marcketplaceCalendar(calenderType, calenderData, resourceData, resColumns, activityFormData, activityColumn, activityEvents) {
    try {
        if (calenderData.length > 0)
            showLoader();
        else
            $.unblockUI();
    }
    catch (e) {
        $.unblockUI();
    }
    calenderData = changeResourceIDByYSelection((calenderData.data != undefined) ? calenderData.data : calenderData);
    window["eventListTemp"] = calenderData;
    var $scope = angular.element($("#calendar")).scope();



    var basicDetails = window["EventBasicDetail"];

    var GroupingData = window["colGrouping"];
    var $scope = angular.element($("#calendar")).scope();

    var resourceColumn = '';
    var majorGroup = "";
    var minorGroup = "";
    var dialog = "";
    if (typeof GroupingData !== "undefined") {
        majorGroup = GroupingData[0].majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = GroupingData[0].minorGroup;
        resourceColumn = GroupingData[0].minorGroup;
        window["currResColumn"] = resourceColumn;
        window["currMajorColumn"] = GroupingData[0].activitiesCategory;
    }
    else {
        majorGroup = basicDetails.formData.majorGroup;
        if (majorGroup != undefined) {
            majorGroup = majorGroup.replace('[', '').trim();
            majorGroup = majorGroup.replace(']', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
            majorGroup = majorGroup.replace('"', '').trim();
        }
        minorGroup = basicDetails.formData.minorGroup;
        resourceColumn = basicDetails.formData.minorGroup;
        window["currResColumn"] = resourceColumn;
    }

    if (basicDetails.formData.eventOverlap !== null) {
        if (basicDetails.formData.eventOverlap == 1)
            eventOverlap = true;
        else
            eventOverlap = false;
    }

    if (basicDetails.formData.activitiesOverlap !== null) {
        if (basicDetails.formData.activitiesOverlap == 1)
            activitiesOverlap = true;
        else
            activitiesOverlap = false;
    }

    if (localStorage.detail != undefined && localStorage.detail != "")
        userid = JSON.parse(localStorage.detail).Id;
    var activitiesCategory = basicDetails.formData.activitiesCategory;
    if (activitiesCategory == '' || activitiesCategory == null)
        activitiesCategory = '0';
    var calendarOptions = '';
    var resourceOrder = majorGroup + ',' + minorGroup;
    // managing resource ordering  data .
    var _ColumnResults = [];
    var _orderedArr = resourceOrder.split(',');
    $.each(_orderedArr, function (index, value1) {
        $.each(resColumns, function (index, value2) {
            if (value2.field == value1)
                _ColumnResults.push(value2);
        });
    });
    resColumns = _ColumnResults;


    var customEventDetailsModelPopUp = angular.element("#customEventDetailsModelPopUp");
    var customEventDetailsServiceModelPopUp = angular.element("#customEventDetailsServiceModelPopUp");
    var createCustomEventDetailsModelPopUp = angular.element("#createCustomEventDetailsModelPopUp");

    function assignEvents(eventsData) {
        window["CalendarEventList"] = angular.copy(eventsData);
    }

    var calendarEl = document.querySelector("#year-view div.calendar");

    calendarObject = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear',
        events: function (cal_obj, callback) {
            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            param.filter = {};
            param.filter = changeStateOfCalenderYearView(cal_obj, cal_obj.start, cal_obj.end);
            //param.filter.field = "start";
            //param.filter.value += " and f.resources = " + $(".calendar-service-Location option:selected").val() + " ";
            param = addParamsforLocationfilter(param);
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;
            

            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/GetFormRecordList",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.data != undefined) ? response.data : response.data);
                    calenderData.forEach(x => x.title = ' ');
                    if (calenderData != undefined) {

                        assignEvents(calenderData);
                        callback(calenderData);
                        window["eventListTemp"] = calenderData;
                        window["CalendarEventListTimeLine"] = calenderData;
                    }
                    else
                        callback([]);
                },
                beforeSend: function () {
                    //showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },
        selectable: (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") ? true : false,
        select: function (info) {



            var selectedStartDate = info.start;
            var selectedEndDate = info.end || info.start; // If end date is not provided (e.g., single day selection), use start date

            // Check if any part of the event overlaps with the selected date range
            var events = calendarObject.getEvents();
            var overlappingEvents = events.filter(function (event) {
                return (event.start < selectedEndDate && event.end > selectedStartDate);
            });

            if (overlappingEvents.length > 0) {
                // If events overlap with the selected date range, prevent unselect
                calendarObject.unselect(false);
                //alert('Events exist during this date range!');
                return;
            }
            //else {
            //    // If no events overlap, continue with unselect action
            //    //calendar.unselect();
            //}

            //let currentDate = new Date();
            let startDate = info.start;
            //let temp = new Date(startDate);
            //let tempEndDate = "";

            //if (currentDate.getDate() > temp.getDate()) {
            //    return;
            //}

            var $scope = angular.element($("#calendar")).scope();

            // check calendar is room rental type
            if (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") {
                $scope.selectEventDetails = {};

                $scope.selectEventDetails.start = moment(startDate).format("YYYY-MM-DD").toString();
                $scope.selectEventDetails.resources = $(".calendar-service-Location option:selected").val();
                $scope.selectEventDetails.COMPANY_CODE = calendarDetails.COMPANY_CODE;
                $scope.selectEventDetails.CALENDAR_CODE = calendarDetails.CALENDAR_CODE;

                $("#selectedLocationName").text($(".calendar-service-Location option:selected").text());

                $("#startEndDate").text("");

                $("#date-counter").on("change paste keypress click", function () {
                    tempEndDate = calculateDate(startDate, this.value, $("input[name=date-calc-type]:checked").val());
                    $("#startEndDate").empty();
                    $("#startEndDate").append(moment(startDate).format("DD MMMM YYYY").toString() + " <span style='font-weight: 500;'>to</span> " + moment(tempEndDate).format("DD MMMM YYYY").toString());
                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                })

                $("input[name=date-calc-type]").on("change paste", function () {
                    tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());
                    if (tempEndDate == "Invalid date") {
                        tempEndDate = "--";
                    }

                    $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

                    $("#startEndDate").empty();
                    $("#startEndDate").append(moment(startDate).format("DD MMMM YYYY").toString() + " <span style='font-weight: 500;'>to</span> " + moment(tempEndDate).format("DD MMMM YYYY").toString());
                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                })

                tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());

                if (tempEndDate == "Invalid date") {
                    tempEndDate = "--";
                }

                $("#startEndDate").empty();
                $("#startEndDate").append(moment(startDate).format("DD MMMM YYYY").toString() + " <span style='font-weight: 500;'>to</span> " + moment(tempEndDate).format("DD MMMM YYYY").toString());
                $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();

                $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

                $("#dateRangePickerModel").modal("show");

                $("#date-counter").focus();
            }


        },
        eventContent: function (info) {
           // return { html: '<div class="fc-content">' + formatAMPM((customDate(info.event.start.toString()))) + '</div>' };
            return { html: '<div class="fc-content">&nbsp;</div>' };
            
        },
        selectAllow: function (info) {
            // Disallow selection of past dates
            return info.start >= new Date(); // Only allow dates from today onwards
        }
    });

    calendarObject.render();
   


    function calculateDate(startDate, counter, type) {

        let dateObject = moment(moment(startDate).format("YYYY-MM-DD"))

        switch (type) {
            case "day":
                counter = (counter < 1) ? 0 : counter - 1;
                dateObject.add(counter, 'days');
                break;
            case "month":
                dateObject.add(counter, 'months');
                break;
            case "year":
                dateObject.add(counter, 'years');
                break;
            default:
                break;
        }

        return moment(dateObject).format("YYYY-MM-DD");
    }

    if ($scope != undefined)
        if ($scope.isFilterApply) {
            var uniqEvents = _.uniq(calenderData, "resourceId");
            var tempFormData = [];
            _.each(resourceData, function (item) {
                var exists = _.findWhere(uniqEvents, { resourceId: item.id });
                if (exists != undefined) {
                    tempFormData.push(item);
                }
            });
            resourceData = tempFormData;
        }


    setTimeout(function () {
        $.unblockUI();
    }, 500);


    //tabsActive();
}

function getQueryParamValue(parameterName) {
    // Get the URL of the current page
    const url = window.location.href;

    // Create a URLSearchParams object with the query string
    const searchParams = new URLSearchParams(new URL(url).search);

    // Get the value of the specified parameter
    const paramValue = searchParams.get(parameterName);

    return paramValue;
}

var DataService = {
    isEmpty: function (data) {
        if (angular.isUndefined(data) || data == '' || data == null || data == 'Undefined')
            return true;
        else
            return false;
    }
};


async function ManageFormApp(otherFormId) {
    var otherRefParam = {};
    otherRefParam.action = 4;
    otherRefParam.formId = otherFormId;
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/ManageFormApp",
            data: JSON.stringify(otherRefParam),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });
}

async function GetFormList() {
    var param = { "action": 21, "applicationId": 351 }
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/GetFormList",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });

}

async function getCalendarDetails(id) {
    //debugger;
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "MarketPlace/GetCalendarDetails/" + id,
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
                console.log(response, "response");
            }
        });

    });

}

var othercalendar;
async function rendarPopupCalendar(assignDate) {
    var customEventDetailsServiceModelPopUp = angular.element("#customEventDetailsServiceModelPopUp");

    customEventDetailsServiceModelPopUp.modal('show');
    customEventDetailsServiceModelPopUp.css({ "z-index": "9999" });

}


function bookingService(star, end, bgevent) {
    var data = {
        "start": star,
        "end": end,
        "companyCode": COMPANY_CODE,
        "calendarCode": CALENDAR_CODE,
        "resourceFormId": ySelection.toString(),
        "resourceTitle": getTitle(bgevent, "resource"),
        "resourceId": getresourceId(bgevent),
        "activityId": getactivityId(bgevent),
        "activityFormId": xSelection.toString(),
        "activityTitle": getTitle(bgevent, "activity"),
        "otherActivityformId": getOtherActivityFormId(bgevent),
        "otherActivityId": getOtherActivityId(bgevent),
        "eventId": bgevent.Id,
        "isSlotBooking": checkFixedSessionCalendar()
    };
    //debugger;
    showLoader();
    postAsync(BASE_URL + "UserAdmin/BookingService", data).then(function (response) {
        hideLoader();
        angular.element("#customEventDetailsModelPopUp").modal('hide');
        swal({
            icon: (response.Status) ? "success" : "warning",
            title: response.Message,
            buttons: {
                confirm: "Okay!"
            }
        })
    })
}



function checkFixedSessionCalendar() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    let type = calendarDetails["CALENDAR_TYPE"];
    return setup["Step2"]["Steps"]["Step" + type]["IS_SLOT_BOOKING"] == true;
}

function checkAllowParticipantsCount() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    return setup["Is_Showing_List_Participants"] == true;
}

function getTitle(bgevent, type) {

    if (type == "resource") {
        let customFormsSplit = bgevent.customForms.split(',');
        let customTitleSplit = bgevent.customTitle.split(',');
        let index = customFormsSplit.findIndex(x => x == ySelection);
        if (index != -1 && customTitleSplit.length > index) {
            return customTitleSplit[index];
        }
        return "";
    }
    if (type == "activity") {
        let customFormsSplit = bgevent.customForms.split(',');
        let customTitleSplit = bgevent.customTitle.split(',');
        let index = customFormsSplit.findIndex(x => x == xSelection);
        if (index != -1 && customTitleSplit.length > index) {
            return customTitleSplit[index];
        }
        return "";
    }
}

function getresourceId(bgevent) {
    let customFormsSplit = bgevent.customForms.split(',');
    let customFormIdsSplit = bgevent.customFormIds.split(',');
    let index = customFormsSplit.findIndex(x => x == ySelection);
    if (index != -1 && customFormIdsSplit.length > index) {
        return customFormIdsSplit[index];
    }
    return "";
}
function getactivityId(bgevent) {
    let customFormsSplit = bgevent.customForms.split(',');
    let customFormIdsSplit = bgevent.customFormIds.split(',');
    let index = customFormsSplit.findIndex(x => x == xSelection);
    if (index != -1 && customFormIdsSplit.length > index) {
        return customFormIdsSplit[index];
    }
    return "";
}

function getOtherActivityFormId(bgevent) {
    let customFormsSplit = bgevent.customForms.split(',');
    let index = customFormsSplit.findIndex(x => x != ySelection && x != xSelection);
    if (index != -1) {
        return customFormsSplit[index];
    }
    return "";
}
function getOtherActivityId(bgevent) {
    let customFormsSplit = bgevent.customForms.split(',');
    let customFormIdsSplit = bgevent.customFormIds.split(',');
    let index = customFormsSplit.findIndex(x => x == getOtherActivityFormId(bgevent));
    if (index != -1 && customFormIdsSplit.length > index) {
        return customFormIdsSplit[index];
    }
    return "";
}

function postAsync(url, data) {
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });
}



function addParamsforLocationfilter(params) {
    var newparam = {};
    newparam.action = 29;
    let selected_location = $('.calendar-service-Location option:selected').val();
    if (selected_location != '') {
        newparam.formTableColumnData = `(   (   LOCATION_MASTER_1936.Id = '${selected_location}'    )        ) `;
    } else {
        var optionValues = $('.calendar-service-Location option').map(function () {
            return $(this).val();
        }).get().filter(function (value) {
            return value !== '';
        }).join(",");
        newparam.formTableColumnData = `(   (   LOCATION_MASTER_1936.Id in (${optionValues})    )        ) `;
    }
    newparam.formTableColumnName = ` left join LOCATION_MASTER_1936 on LOCATION_MASTER_1936.formId=f1.referrenceFormId and LOCATION_MASTER_1936.Id=f1.referrenceId `;
    newparam.formTableName = "CALENDAR_FORM_1935";
    newparam.formId = 2305;
    newparam.created_by = 30314;
    newparam.update_by = 30314;
    newparam.filter = params.filter;
    return newparam;
}