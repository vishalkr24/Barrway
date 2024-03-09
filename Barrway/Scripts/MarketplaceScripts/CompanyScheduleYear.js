var CalendarFormId = "2305", ySelection = "", xSelection = "", COMPANY_CODE, CALENDAR_CODE, formDetailsDataInfo, counterLoader, xaxisFormList, formAllDatafields, listTabulator, calendarDetails;
var calendarObject = {};
$(document).ready(async function () {

    $("#nv-company-schedule").addClass("active");


    getLOCDataByCalendar();

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

        //formDataList
        activityResults = activityConfig.formDataList;

        $('#calendar-service-Location').change(async function () {
            var param = { "action": 29, "formTableColumnData": "", "formTableColumnName": "", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 };
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = calendarObject.getView();
            param.filter = changeStateOfCalenderYearView(view);
            param.filter.value += " and f.resources = " + $("#calendar-service-Location option:selected").val() + " ";
            var filterredFormDataTemp = await reBindCalender(param);
            var eventBasicData = window["EventBasicDetail"];
            var eventData = filterredFormDataTemp.data;
            refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);

        });



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
    if (checkCookie('calendar-activeView') !== '') {
        $("#tabs").tabs("option", "active", parseInt(checkCookie('calendar-activeView')));
    } else {
        $("#tabs").tabs("option", "active", 2);
    }
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

function showCalendar(companyCode) {

    var calendarId = $("#calendar-selector option:selected").val();

    /* window.location.replace("/Marketplace/CompanySchedule?CompanyCode=" + companyCode + "&CalendarCode=" + calendarId);*/
    window.location.replace("/Company/Calander/" + companyCode + "/" + calendarId);
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
    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: new Date(),
        eventMouseover: function (event, jsEvent, view) {
            if (view.name !== 'agendaDay') {
                ////console.log(event);
                $(jsEvent.target).attr('title', event.title);
            }
        },
        //lazyFetching: true,
        now: new Date(),
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        eventLimit: 4, // allow "more" link when too many events            
        loading: function (bool) {
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            if (bool) {
                showLoader(".calendar .fc-view-container");
            }
            else {
                $(".calendar .fc-view-container").unblock();
            }
            //$('#loading').toggle(bool);
        },
        eventRender: function (event, element) {
            //if (countLoader == 0) {
            //    showLoader();
            //    countLoader++;
            //}
            var $scope = angular.element($("#calendar")).scope();
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_tab == "agenda-view") {
                // $scope.$parent.$parent.IND_loading = true;
                //if ($scope.counterLoader == undefined)
                //showLoader();
                counterLoader = 1;
            }
            var rowTooltipDisplay = "";
            var rowTooltipTitleDisplay = "";
            var rowRecord = "";
            var _associatedTitles = event.customTitle;
            var _associatedFormIDs = event.customForms;
            var _allSelectables = xaxisFormList; // x options has all selectable options .
            var _ySelected = window["ySelected"]; // get y selected option.
            var _xSelected = window["xSelected"];
            var _lablesToShow = []; var _colorToShow = [];
            var _tempTitle = "";
            var _tempTitleSecond = "";
            var _mainTempHtml = "";
            var eventData = {
                Id: event.Id,
                Images: event.files,
                title: "Text",
                start: event.start != null && event.start != undefined && event.start != '' ? customDate(event.start.format()) : '',
                end: event.end != null && event.end != undefined && event.end != '' ? customDate(event.end.format()) : '',
                allDay: event.allDay,
                service: event.service,
                description: event.description,
                resources: event.resources,
                activities: event.activities,
                activityName: event.activityName,
                formGroupKey: event.formGroupKey
            };
            eventData.title = _tempTitle;
            eventData.Images = event.files;
            if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                var _arrTitles = _associatedTitles.split(',');
                var _arrColor = [];
                var _arrFormIDs = _associatedFormIDs.split(",");

                ////getting index of x selected form  from  associated formIDs arr
                //var _xPos = _arrFormIDs.indexOf(_xSelected.toString());
                ////swapping position of x occurance  with 0 index;
                //if (_xPos !== undefined && _xPos !== null && _xPos !== -1) {
                //    var _temp = "";
                //    //for titles
                //    _temp = _arrTitles[0];
                //    _arrTitles[0] = _arrTitles[_xPos];
                //    _arrTitles[_xPos] = _temp;
                //    //for color
                //    if (_arrColor.length > 0) {
                //        _temp = _arrColor[0];
                //        _arrColor[0] = _arrColor[_xPos];
                //        _arrColor[_xPos] = _temp;
                //    }
                //    //for formIDs
                //    _temp = _arrFormIDs[0];
                //    _arrFormIDs[0] = _arrFormIDs[_xPos];
                //    _arrFormIDs[_xPos] = _temp;
                //}
                //var eventTemp = angular.copy(event);
                if (!eventData.allDay) {
                    eventData.start = eventData.start != null && eventData.start != undefined && eventData.start != '' ? eventData.start : '';
                    if (eventData.end != "" && eventData.end != null) {
                        eventData.end = eventData.end != null && eventData.end != undefined && eventData.end != '' ? eventData.end : '';
                        rowTooltipDisplay += DateWithDayName(eventData, true) + " <br/> "
                        rowTooltipDisplay += TimeFormatCalender(eventData, true) + " "
                    } else {
                        rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                    }
                }
                else {
                    rowTooltipDisplay += moment(eventData.start).format("YYYY-MM-DD") + " "
                }
                //element.find('.fc-content').remove();
                //if (eventData.description != "" && eventData.description != null) {
                //    _tempTitle += "<label class='pr-2'>" + eventData.description + "</label>";
                //}
                var tempHtml = "";

                if (eventData.title != null && eventData.title.length > 0)
                    rowRecord += "<div class='title " + _tempTitleSecond + "'>" + eventData.title + "</div>";
                if (!eventData.allDay) {
                    if (eventData.start != null && eventData.start.length > 0)
                        rowRecord += "<div class='" + eventData.start + "'>" + DateWithDayName(eventData, true) + "</div>";
                    rowRecord += "<div>" + TimeFormatCalender(eventData, true) + "</div>";
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='customLocationTitle' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div> ";
                            if (current_tab != "agenda-view") {
                                _mainTempHtml += tempHtml;
                            }
                        }
                        //var tempHtml = "";
                        tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''>" + TimeFormatCalender(eventData, true) + "</small></div>" + _mainTempHtml;
                        // element.prepend(tempHtml);
                        if (current_tab != "agenda-view") {
                            _mainTempHtml = tempHtml;
                        }

                    } else {
                        if (current_subtab != undefined) {
                            if ((current_tab == "agenda-view" || current_tab == "timeline-resource-view") && (current_subtab.contains("fc-month-button") || current_subtab.contains("fc-timelineYear-button") || current_subtab.contains("fc-timelineMonth-button"))) {
                                var tempHtml = "";
                                tempHtml = "<div class='fc-content'><span class='text-dark small' title=''>" + TimeFormatCalender(eventData, true) + "</span></div>" + tempHtml;
                                if (current_tab != "agenda-view") {
                                    _mainTempHtml += tempHtml;
                                }
                            }
                        }

                    }
                }
                else {
                    if (current_tab == "list-view") {
                        var _associatedFormIDsTemp = _associatedFormIDs.split(",");
                        var _associatedTitlestemp = _associatedTitles.split(",").map(function (item) {
                            return item.trim();
                        });
                        var _associatedCustomFormIdsTemp = event.customFormIds.split(",");
                        var exists = _.findIndex(_associatedFormIDsTemp, function (item) { return item == ySelection.toString() });
                        var lblColor = undefined;
                        var customLocationTitle = "";
                        if (exists >= 0) {
                            customLocationTitle = _associatedTitlestemp[exists];
                            var tempColor = "";
                            var colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: ySelection });
                            var currentId = _associatedCustomFormIdsTemp[exists].toString();
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: currentId });
                                if (colorRow != undefined) {
                                    tempColor = colorRow[colorExists.colorField];
                                }
                            }
                            lblColor = tempColor;
                        }
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content' id='dd' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div > ";
                            if (current_tab != "agenda-view") {
                                _mainTempHtml += tempHtml;
                            }
                        }
                    }
                    rowRecord += "<div class='" + moment(eventData.start).format("YYYY-MM-DD") + "'>" + moment(eventData.start).format("MMMM D, YYYY (dddd)") + "</div>";
                }
                let isBookingEvent = true;
                //if (_arrFormIDs.length == 4) {

                //}
                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";
                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #B9E8EB ;color: #222;" data-bs-original-title="" title="">';
                var agendaTempHtmlSub = '';
                var titleCounter = 0;
                _.each(_arrFormIDs, function (dataRow, position) {
                    if (dataRow !== _ySelected.toString()) {

                        var lblColor = "";
                        _lablesToShow.push(dataRow.toString());
                        var _arrRowData = _arrTitles[position];
                        currentId = listids[position].toString().trim();
                        var tempColor = "";
                        var colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: parseInt(dataRow.toString().trim()) });
                        if (colorExists != undefined) {
                            var colorRow = _.findWhere(colorExists.formDataList, { id: currentId.toString() });
                            if (colorRow != undefined) {
                                tempColor = colorRow[colorExists.colorField];
                            }
                            lblColor = tempColor;
                        }
                        _arrRowData = _arrRowData.split('-');
                        var slipTitle = "";
                        if (_arrRowData.length == 1)
                            slipTitle = _arrRowData[0];
                        else if (_arrRowData.length > 1)
                            slipTitle = _arrRowData[0] + " - " + _arrRowData[1];

                        if (colorExists != undefined) {
                            if (colorExists.isVisible)
                                rowTooltipTitleDisplay += slipTitle + " <br/> ";
                            else {
                                if (!colorExists.isVisible && listids.length == 2)
                                    rowTooltipTitleDisplay += slipTitle + "  <br/> ";
                            }
                            if (current_tab != "agenda-view") {
                                if (colorExists.isVisible)
                                    tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"
                                else
                                    if (!colorExists.isVisible && listids.length == 2)
                                        tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"


                            }
                            else {
                                if (titleCounter == 1 && listids.length == 3) {
                                    if (colorExists.isVisible) {
                                        if (tempHtml.length > 0)
                                            agendaTempHtml += "	<span>-</span>  ";

                                        agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    }
                                    else {
                                        if (!colorExists.isVisible && listids.length == 2) {
                                            if (tempHtml.length > 0)
                                                agendaTempHtml += "	<span>-</span>  ";

                                            agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                        }
                                    }
                                    agendaTempHtml += "	<span class='fc-customtime' >" + formatAMPM(eventData.start) + "</span> ";
                                }
                                else {
                                    if (colorExists.isVisible)
                                        agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    else {
                                        if (!colorExists.isVisible && listids.length == 2)
                                            agendaTempHtml += "	<span class='fc-title' style='borderRadius: 3;'>" + slipTitle + "</span> ";
                                    }
                                    titleCounter += 1;
                                    if (listids.length == 2) {
                                        agendaTempHtml += "	<span class='fc-customtime' >" + formatAMPM(eventData.start) + "</span> ";
                                    }
                                }

                                //if (titleCounter == 1 && listids.length == 3) {
                                //    agendaTempHtml += "	<span style='color: #fff;background: #000;'>and</span>  ";
                                //    agendaTempHtml += "	<span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span> ";
                                //}
                                //else {
                                //    agendaTempHtml += "	<span class='fc-title' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'>" + slipTitle + "</span> ";
                                //    titleCounter += 1;
                                //}

                            }
                        }
                    }

                });
                agendaTempHtml += '</div>';

                if (current_tab != "agenda-view") {
                    _mainTempHtml += tempHtml;
                }
                else {
                    _mainTempHtml += agendaTempHtml;
                }

            }
            //if (formDetailsDataInfo.otherFormIsShow != null && formDetailsDataInfo.otherFormIsShow == true) {
            //    if (event.customFourthTitle != null && event.customFourthTitle != "") {
            //        var tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''> " + event.customFourthTitle + "</small></div> ";
            //        if (current_tab != "agenda-view") {
            //            _mainTempHtml += tempHtml;
            //        }
            //        rowTooltipDisplay += event.customFourthTitle + " <br/> "
            //    }
            //}
            // For Tag view  //
            //static tagify
            rowRecord += '<div>  <input value="' + eventData.Id + '" id="tag-inputHidden" type="hidden"> ';
            //dynamic tagify
            _.each([], function (item) {
                var taglist = [];
                var tempTag = eventData[item.name];
                if (tempTag != undefined && tempTag != null && tempTag != "") {
                    taglist = tempTag.replace(/"/g, "'");
                }
                rowRecord += '<input value="' + item.name + '" id="tag-inputHidden' + eventData.Id + '" type="hidden"> <input value="' + taglist + '" id="tag-inputHidden' + item.name + '" type="hidden"><input id="tag-input' + item.name + '" type="text"  value="' + taglist + '" placeholder="Add tags">';
            });
            rowRecord += '</div>';
            counterLoader = undefined;
            var tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div></div>";
            var basicDetails = window["EventBasicDetail"];
            var actionRow = "";
            actionRow += "<div id='eventCopy' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-copy'></i></a></div>" + "<div id='eventEdit' class='mr-10 cursor-pointer' data-formId='" + basicDetails.formId + "' data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "'><a> <i class='fa fa-pencil'></i></a></div>" + "<div id='eventDelete' data-formId='" + basicDetails.formId + "'    data-formGroupKey='" + eventData.formGroupKey + "' data-eventId='" + event.Id + "' class='delete-event cursor-pointer'><i class='fa fa-trash'></i></div>" + "<a class='btn close-event cursor-pointer' title='close'  data-dismiss='modal' aria-label='Close'> <i class='fa fa-times'></i></a>";
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div></div>";
            var tempHtmlTable = "";
            if (listTabulator.length > 0) {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div> <div id="tabuListLink" class="edit-event-student mr-0 ml-1 cursor-pointer d-inline-block"  title="Edit"><i class="fa fa-pencil"></i></div> </div>  </div>   <ul id="tabuListUl">  </ul></div>`;
            }
            else {
                tempHtmlTable = `<div class="div-flex div-list">
                            <div class="d-flex justify-content-between align-items-center p-0">
                                <h5 class="list-title mb-0" id="tabuList"></h5>
                                <div class="d-block">
                                    <div id="addTransactionRecord" class="edit-event-student cursor-pointer d-inline-block"><i class="fa fa-plus"></i></div>  </div>  </div>   <ul id="tabuListUl">  </ul></div>`

            }
            element.append(_mainTempHtml)
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.css({
                background: "rgb(255, 255, 255)",
                /*borderColor: "#aaa",*/
                padding: 0,
                border: "none",
                borderRadius: 5,

                "z-index": 1
            }).droppable({
                drop: function (event, ui) {
                    console.log(event);
                    console.log(ui);
                },
                activate: function (event, ui) {
                    console.log(event);
                }
            })
                .empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);
        },
        eventClick: async function (calEvent, jsEvent, view) {
            debugger;
            if (calendarDetails.CALENDAR_CATEGORY_ID == "4" && calendarDetails.CALENDAR_TYPE == "3") {
                return;
            }
            if (Check_IS_SERVICE_TYPE(calendarDetails)) {
                //customEventDetailsServiceModelPopUp.modal('show');
                //customEventDetailsServiceModelPopUp.css({ "z-index": "9999" });
                await rendarPopupCalendar(calEvent.start);
            } else {
                customEventDetailsModelPopUp.modal('show');
                customEventDetailsModelPopUp.css({ "z-index": "9999" });
            }

            var $scope = angular.element($("#calendar")).scope();
            $scope.selectEventDetails = calEvent;
            if (calEvent.formID == undefined) {
                $scope.selectEventDetails.formID = CalendarFormId;
            }
            $scope.selectEventDetails.resourceFormId = ySelection;
            $scope.selectEventDetails.ActivityFormId = xSelection;
            $scope.selectEventDetails.start = $scope.selectEventDetails.start != null && $scope.selectEventDetails.start != undefined && $scope.selectEventDetails.start != '' ? customDate($scope.selectEventDetails.start.format()) : ''
            $scope.selectEventDetails.end = $scope.selectEventDetails.end != null && $scope.selectEventDetails.end != undefined && $scope.selectEventDetails.end != '' ? customDate($scope.selectEventDetails.end.format()) : ''
            $scope.selectEventDetails.customDate = DateWithDayName($scope.selectEventDetails, true);
            if (!$scope.selectEventDetails.allDay) {
                $scope.selectEventDetails.customTime = TimeFormatCalender($scope.selectEventDetails, true);
            }
            else {
                $scope.selectEventDetails.customDate = moment($scope.selectEventDetails.start).format("YYYY-MM-DD");
            }

            $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');

            var listFormDropdown = _.filter($scope.selectEventDetails.customFormsSplit, function (item) { return item != ySelection.toString(); });

            if (listFormDropdown.length > 0) {
                debugger;
                //var listActivities = _.filter(xaxisFormList, function (item) { return item.activitiesForm != ySelection; });
                var listActivities = xaxisFormList;
                $scope.selectEventDetails.dropdownList = [];
                _.each(listActivities, function (item, key) {
                    var tempDrop = {};
                    var indexForm = _.findIndex($scope.selectEventDetails.customFormsSplit, function (itemForm) { return itemForm.trim() == item.activitiesForm.toString() });
                    if (indexForm != -1) {
                        tempDrop.formId = item.activitiesForm.toString();
                        tempDrop.Id = $scope.selectEventDetails.customFormIdsSplit[indexForm];
                        tempDrop.formTitle = $scope.selectEventDetails.customTitleSplit[indexForm];
                        tempDrop.dropdownListData = item;
                        tempDrop.customClass = "false";
                        $scope.selectEventDetails.dropdownList.push(tempDrop);
                    }
                    //else {
                    //    tempDrop.formId = item.activitiesForm.toString();
                    //    tempDrop.Id = "0";
                    //    tempDrop.formTitle = item.title;
                    //    tempDrop.dropdownListData = item;
                    //    tempDrop.customClass = "true";
                    //}

                });
            }

            $('.close-event').on('click', function () {
                $("body .popover").addClass('isPopoverLoaded');
                $("body .popover").popover('hide');
                $("#tabuListUl").empty();
                var $scope = angular.element($("#calendar")).scope();
                $('.temp').find('.titleContainer').removeClass('d-none');
                $('.popoverSelect').addClass('d-none');

            });
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
            var selectedId = $("#newtag-inputHidden").val();
            if (selectedId != "") {
                var param = {};
                param.selectedId = selectedId;
                getTabulatorListFromEvents(param);
            }
            $(document).on('click', function (e) {
                if ($('.favicon-loader-overlay.active').length) {
                }
                else {
                    if (!$(e.target).closest('.popover.show').length && !$(e.target).closest('.fc-content').length) {
                        //$(document).find('.popover.show').remove()
                        //$("body .popover").addClass('isPopoverLoaded');
                        //$("body .popover").popover('hide');
                        //$("#tabuListUl").empty();
                        //var $scope = angular.element($("#calendar")).scope();
                        //$('.temp').find('.titleContainer').removeClass('d-none');
                        //$('.popoverSelect').addClass('d-none');
                    }
                }
            });



        },
        eventAfterAllRender: function (event, element, view) {

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');

            if (current_tab == "agenda-view") {
                var $scope = angular.element($("#calendar")).scope();
                //$scope.$parent.$parent.IND_loading = false;
                setTimeout(function () {
                    $.unblockUI();
                }, 1000);
            } else {
                $.unblockUI();
            }
            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip({ html: true });
                $('.fc-timeline-event').bstooltip({ html: true });
                $('.fc-list-item').bstooltip({ html: true });
                $('.fc-day-grid-event').bstooltip({ html: true });
                $('.fc-time-grid-event').bstooltip({ html: true });
                //setTimeout(function () {
                //    $('#agenda-view div.calendar').fullCalendar('render');
                //    $('#timeline-resource-view div.calendar').fullCalendar('render');
                //    $('#vertical-resource-view div.calendar').fullCalendar('render');
                //}, 150);
            }, 150);
        },

        //  eventDragStop: function (event, jsEvent, ui, view) {
        //      console.log($(jsEvent.target).closest('tr').attr('data-resource-id'));
        //}



    }

    var calendarEl = document.querySelector("#year-view div.calendar");

    calendarObject = new FullCalendar.Calendar(calendarEl, {
        initialView: 'multiMonthYear',
        events: function (cal_obj, callback) {
            debugger;
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
            param.filter.field = "start";
            param.filter.value += " and f.resources = " + $("#calendar-service-Location option:selected").val() + " ";
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;


            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
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
        select: function (cal_obj) {
            debugger;
            let currentDate = new Date();
            let startDate = cal_obj.start;
            let temp = new Date(startDate);
            let tempEndDate = "";

            if (currentDate.getDate() > temp.getDate()) {
                return;
            }

            var $scope = angular.element($("#calendar")).scope();

            // check calendar is room rental type
            if (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") {
                $scope.selectEventDetails = {};

                $scope.selectEventDetails.start = moment(startDate).format("YYYY-MM-DD").toString();
                $scope.selectEventDetails.resources = $("#calendar-service-Location option:selected").val();
                $scope.selectEventDetails.COMPANY_CODE = calendarDetails.COMPANY_CODE;
                $scope.selectEventDetails.CALENDAR_CODE = calendarDetails.CALENDAR_CODE;

                $("#selectedLocationName").text($("#calendar-service-Location option:selected").text());

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


        }
    });

    calendarObject.render();
    
    // tag added callback
    function onAddTag(e) {
        var id = $("#newtag-inputHidden").val();
        var fieldName = $("#newtag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.formId = $scope.currentFormId;
        param.Id = id;
        $scope.updateRowDataRecord(param);
    }
    // tag remvoed callback
    function onRemoveTag(e) {
        var id = $("#newtag-inputHidden").val();
        var fieldName = $("#newtag-inputHidden" + id).val();
        var $scope = angular.element($("#calendar")).scope();
        var param = {};
        var list = [];
        param.fieldName = fieldName;
        _.each(e.detail.tagify.value, function (item) {
            list.push('"' + item.value + '"');
        });
        param.fieldDataText = "[" + list.join(',') + "]";
        param.Id = id;
        param.formId = $scope.currentFormId;
        $scope.updateRowDataRecord(param);
    }
    function onTagEdit(e) {
        //console.log("onTagEdit: ", e.detail);
    }
    // invalid tag added callback
    function onInvalidTag(e) {
        //console.log("onInvalidTag: ", e.detail);
    }

    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }


    function calculateDate(startDate, counter, type) {
        debugger;

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

var getTabulatorListFromEvents = async function (param) {

    var userDetail = GetUserDetails();
    var $scope = angular.element($("#calendar")).scope();
    var newParam = {};
    newParam.action = 11;
    newParam.formTableColumnNameList = "";
    newParam.formTableColumnData = "";
    if (listTabulator.length > 0) {
        var temp = listTabulator[0];
        newParam.searchTextData = temp.searchTextData;
        newParam.fieldLabel = temp.label;
        newParam.title = temp.label;
        newParam.fieldName = temp.name;
        newParam.formId = temp.reference_form;
        newParam.otherreference_form = temp.otherreference_form;
    }
    if (param.selectedId != "") {
        var list = window["EventBasicDetail"];
        var eventlist = window["CalendarEventList"];
        var rowId = parseInt(param.selectedId);
        var exists = _.findWhere(eventlist, {
            Id: rowId
        });
        if (!DataService.isEmpty(exists)) {
            //  if (newParam.formId == exists.resFormID) {
            newParam.formGroupKey = exists.formGroupKey;
            var rowResource = _.findWhere(list.resourceData, {
                id: exists.resources
            });
            if (!DataService.isEmpty(rowResource)) {
                _.each(rowResource, function (item, key) {
                    if (key != "id" && key != "title") {
                        newParam.formTableColumnNameList += key + ","
                        newParam.formTableColumnData += key + " like '" + item + "' and ";
                    }
                });
            }
            //}
        }
        newParam.selectedId = param.selectedId;
    }
    if (listTabulator.length > 0) {
        newParam.formTableColumnName = listTabulator[0].searchTextData;

    }

    newParam.formTableColumnData = newParam.formTableColumnData.substring(0, newParam.formTableColumnData.length - 4);
    newParam.formTableColumnNameList = newParam.formTableColumnNameList.substring(0, newParam.formTableColumnNameList.length - 1);

    //$rootScope.$emit("ShowLoading");
    newParam.created_by = userDetail.Id;
    newParam.update_by = userDetail.Id;
    $scope.tabuListLink = newParam;
    $scope.selectedTabulatorList = [];

    $("#strongFormName").remove();


    /* get Student List from one to many controls based*/
    var paramTemp = {};
    paramTemp.action = 4;
    $scope.formGroupKey = $scope.selectEventDetails.formGroupKey;
    if (!DataService.isEmpty($scope.tabuListLink.formId))
        paramTemp.formId = $scope.tabuListLink.formId;
    else
        paramTemp.formId = formDetailsDataInfo.otherformid;
    paramTemp.Id = param.selectedId;
    paramTemp.formGroupKey = $scope.formGroupKey;
    if (paramTemp.formId == "0" || paramTemp.formId == 0 || paramTemp.formId == "" || paramTemp.formId == undefined || paramTemp.formId == null) {
        paramTemp.formId = 0;
        //return false;
    }
    await loadEventRecordDetails(paramTemp);
    // $scope.manageOneToManyControl(paramTemp);


    //$rootScope.safeApply();

};
async function getReferralFormFieldsAndData(param) {

    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/getReferralFormFieldsAndData",
            data: JSON.stringify(param),
            contentType: "application/json",
            success: function (response) {

                hideLoader();
                resolve(response);
            }, error: function (err) {


            },
        });

    });
}

async function loadEventRecordDetails(paramTemp) {

    showLoader();
    $("#tabuListUl").empty();
    var $scope = angular.element($("#calendar")).scope();
    if (!DataService.isEmpty(paramTemp.formId) || paramTemp.formId == 0) {
        var param = {};
        param = paramTemp;
        param.action = 10;
        param.formId = (paramTemp.formId == 0 ? CalendarFormId : paramTemp.formId).toString();
        param.parentID = CalendarFormId;
        param.fieldName = "";
        var response = await getReferralFormFieldsAndData(param);

        console.log(response, "response");
        $scope.eventData = response;
        console.log('Transaction table', $scope.eventData)
        if (!DataService.isEmpty($scope.otherformDetails)) {
            if (!DataService.isEmpty($scope.otherformDetails.formId)) {
                var exist = _.findWhere($scope.eventData.formDataHeaders, { "Referral_Forms": $scope.otherformDetails.formId.toString() });
                if (!DataService.isEmpty(exist)) {
                    var exist1 = _.findWhere($scope.eventData.formDataHeaders, { "columnType": "text" });
                    if (!DataService.isEmpty(exist1)) {
                        $scope.selectedKeyFieldSecond = exist1.field;
                    }
                    $scope.selectedKeyField = exist.field;
                }
            }
            else {

            }
        }
        //else {
        //    $scope.selectedKeyField = $scope.formDetailsDataInfo.otherFormFieldName;
        //}

        $scope.eventDataWithoutGroupBy = $scope.eventData.formDataListNew;

        $scope.eventDataWithoutGroupByMinRecord = [];
        $scope.eventDataWithoutGroupByMinRecordForWaiting = [];

        var courseExists = _.findWhere(xaxisFormList, { resourceActivityForm: $scope.courseFormId });
        if (!DataService.isEmpty(courseExists)) {

            var courseFormEntry = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: $scope.courseFormId });
            if (!DataService.isEmpty(courseFormEntry)) {
                var courseFormEntryExists = _.findWhere(courseExists.formDataList, { id: courseFormEntry.referrenceId });
                if (!DataService.isEmpty(courseFormEntryExists)) {

                    $scope.selectEventDetails.DESCRIPTION = courseFormEntryExists.DESCRIPTION;
                    var maxrecordList = 0;
                    var maxrecordWaitingList = 0;
                    _.each(courseFormEntryExists, function (item, keyItem) {
                        if (keyItem.contains("MAXIMUM_NO_OF_PARTICIPANTS")) {
                            maxrecordList = item;
                        }
                        if (keyItem.contains("maxwaitingstudent")) {
                            maxrecordWaitingList = item;
                        }
                    });
                    if (DataService.isEmpty(maxrecordList)) {
                        $scope.eventDataWithoutGroupByMinRecord = $scope.eventDataWithoutGroupBy;
                        $scope.eventDataWithoutGroupByMinRecordForWaiting = [];
                    }
                    if (DataService.isEmpty(maxrecordWaitingList)) {
                        $scope.eventDataWithoutGroupByMinRecordForWaiting = [];
                    }
                    $("#labelWaiting").empty();
                    if (!DataService.isEmpty(maxrecordList) && !DataService.isEmpty(maxrecordWaitingList)) {
                        $scope.eventDataWithoutGroupByMinRecord = $scope.eventDataWithoutGroupBy.slice(0, maxrecordList);
                        $scope.eventDataWithoutGroupByMinRecordForWaiting = $scope.eventDataWithoutGroupBy.slice(maxrecordList, (maxrecordList + maxrecordWaitingList));
                        if ($scope.eventDataWithoutGroupByMinRecordForWaiting.length > 0)
                            $("#labelWaiting").append('<strong> Wait list</strong>');
                    }
                }

            }
            else {
                $scope.eventDataWithoutGroupByMinRecord = $scope.eventDataWithoutGroupBy;
                $("#labelWaiting").empty();
            }
        }
        $("#tabuListUl").empty();
        $("#newtabuListUl").empty();
        $("#newtabuListUlWaiting").empty();

        if (param.parentID != param.formId && checkAllowParticipantsCount()) {
            if ($scope.eventDataWithoutGroupBy) {
                if ($scope.eventDataWithoutGroupBy.length > 0) {
                    $("#tabuList").empty();
                    $("#newtabuList").empty();
                    $("#tabuList").append('<strong id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + (maxrecordList > 0 ? '/' + maxrecordList : "") + ' ' + $scope.otherformDetails.title + ' in this Slot</strong>');
                    $("#newtabuList").append('<strong id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + (maxrecordList > 0 ? '/' + maxrecordList : "") + ' ' + $scope.otherformDetails.title + ' in this Slot</strong>');
                }
                else {
                    $("#tabuList").empty();
                    $("#newtabuList").empty();
                    if (!DataService.isEmpty($scope.otherformDetails)) {
                        if (!DataService.isEmpty($scope.otherformDetails.title)) {
                            $("#tabuList").append('<strong id="strongFormName"> 0 ' + (maxrecordList > 0 ? '/' + maxrecordList : '') + ' ' + $scope.otherformDetails.title + ' in this Slot </strong>');
                            $("#newtabuList").append('<strong id="strongFormName"> 0 ' + (maxrecordList > 0 ? '/' + maxrecordList : '') + ' ' + $scope.otherformDetails.title + ' in this Slot </strong>');
                        }
                    }
                }
            } else {
                $("#labelWaiting").empty();
            }
        }
        else {
            $("#addTransactionRecord").remove();
            $("#newaddTransactionRecord").remove();
            $('#newtabuList').hide();
        }
        // $("#tabuListLink");
        $scope.rootScopeSafe();
        removeTitleNew();
        hideLoader();



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
    debugger;
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


function getServiceProviderData() {
    $.ajax({
        url: "/Calendar/GetServiceProviderMasterList/",
        async: false,
        type: "POST",
        data: {
            data: {},
            companyCode: COMPANY_CODE,
            calendarCode: CALENDAR_CODE
        },
        success: function (response) {
            Service_ProviderList = response.data;
            var serviceProvider = $("#calendar-service-Provider").empty();
            serviceProvider.append($('<option>', {
                value: "",
                text: "All Service provider"
            }));

            $.each(Service_ProviderList, function (index, item) {
                serviceProvider.append($('<option>', {
                    value: item.FIRST_NAME,
                    text: item.FIRST_NAME + " " + item.LAST_NAME
                }));
            });



        },
        error: function (errorResponse) {
            data = null;
        }
    });

}

function getLOCDataByCalendar() {

    $.ajax({
        url: "/Marketplace/GetLocationMasterList",
        async: false,
        type: "POST",
        data: {
            data: {
                filters: [{
                    field: "CALENDAR_CODE",
                    type: "=",
                    value: CALENDAR_CODE
                }]
            },
            companyCode: COMPANY_CODE
        },
        success: function (response) {
            data = response;

            console.log(data, "data data data");


            Service_Location_List = response.data;
            var Location = $("#calendar-service-Location").empty();


            $.each(Service_Location_List, function (index, item) {
                Location.append(`<option value="${item.Id}">${item.LOCATION_ADDRESS}</option>`);
            });



        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}