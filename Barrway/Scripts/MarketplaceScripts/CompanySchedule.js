var CalendarFormId = "2305", ySelection = "", xSelection = "", COMPANY_CODE, CALENDAR_CODE, formDetailsDataInfo, counterLoader, xaxisFormList, formAllDatafields, listTabulator, calendarDetails, is5CType = false, tempEndDate, calenderSettings;
$(document).ready(async function () {

    $("#startListViewDate").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $("#endListViewDate").datepicker({
        dateFormat: 'dd/mm/yy'
    });

    $("#nv-company-schedule").addClass("active");
    /*COMPANY_CODE = getQueryParamValue("CompanyCode");*/
    /* CALENDAR_CODE = getQueryParamValue("CalendarCode");*/

    console.log(COMPANY_CODE, "COMPANY_CODE");
    console.log(CALENDAR_CODE, "CALENDAR_CODE");

   
    ////debugger;

    //getServiceList(COMPANY_CODE, CALENDAR_CODE);

    /* $('#calendar-selector').val(CALENDAR_CODE);*/

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
    activityResults = [];
    var activityColumns = [];
    var activities = [];
    window["EventBasicDetail"] = manageWindowParams();

    calenderSettings = await getCalenderSettings();
    
    calendarDetails = (await getCalendarDetails(CALENDAR_CODE)).Data;

    getServiceProviderData();

    getLocationMaster();
    

    var SelectedCalendarViews = (calendarDetails["REQUIRED_CALENDAR_VIEWS"].includes(",")) ? calendarDetails["REQUIRED_CALENDAR_VIEWS"].split(',') : [calendarDetails["REQUIRED_CALENDAR_VIEWS"]];

    SelectedCalendarViews.forEach(x => {
        switch (x) {
            case 'LIST VIEW':
                $("#list-view-nav").show();
                break;
            case 'AGENDA VIEW':
                $("#agenda-view-nav").show();
                break;
            case 'TIMELINE VIEW':
                $("#timeline-view-nav").show();
                break;
            case 'VERTICAL VIEW':
                $("#vertical-view-nav").show();
                break;
            default:
                $("#timeline-view-nav").show();
                break;
        }
    });

    switch (calendarDetails["DEFAULT_CALENDAR_VIEW"]) {
        case 'LIST VIEW':
            $("#list-view-nav a").trigger("click");
            break;
        case 'AGENDA VIEW':
            $("#agenda-view-nav a").trigger("click");
            break;
        case 'TIMELINE VIEW':
            $("#timeline-view-nav a").trigger("click");
            break;
        case 'VERTICAL VIEW':
            $("#vertical-view-nav a").trigger("click");
            break;
        default:
            $("#timeline-view-nav a").trigger("click");
            break;
    }
    

    if (calendarDetails["CALENDAR_CATEGORY_ID"] == "4" && calendarDetails["CALENDAR_TYPE"] == "3") {
        is5CType = true;
        $("#year-view-nav").show();
    } else {
        is5CType = false;
        $("#year-view-nav").hide();
        /*$("#tabs li[data-value='External Events'] a").trigger("click");*/
    }
    var resourceKey = { "LOCATION": "2306", "SERVICE PROVIDER": "2304" };
    var resourceFormId = "2306";
    let DEFAULT_RESOURCE = calendarDetails["DEFAULT_RESOURCE"];
    if (DEFAULT_RESOURCE && DEFAULT_RESOURCE != "" && DEFAULT_RESOURCE != "null" && resourceKey[DEFAULT_RESOURCE]) {
        resourceFormId = resourceKey[DEFAULT_RESOURCE];
    }
    if (calenderSettings.length > 0) {
        var caledarConfig = calenderSettings;
        var resourceConfig = caledarConfig.find(x => x.resourceForm != 0 && x.resourceForm == resourceFormId);
        var activityConfig = caledarConfig.find(x => x.activitiesForm != 0 && x.IsDefault);
        ySelection = resourceConfig.resourceForm;
        xSelection = activityConfig.activitiesForm;
        var $scope = angular.element($("#calendar")).scope();

        $scope.resourceConfig = resourceConfig;
        $scope.activityConfig = activityConfig;

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


        var serviceSelect = $('#calendar-service');
        serviceSelect.empty();
        serviceSelect.append($('<option>', {
            value: "",
            text: "All service"
        }));
        if(activityResults.length > 0) {
            $("#div-calendar-service").show();
        }

        $.each(activityResults, function (index, item) {
            serviceSelect.append($('<option>', {
                value: item.id,
                text: item[activityConfig.activities]
            }));
        });


        $('#calendar-service').change(async function () {
            if ($(this).val() != '') {
                var searchSrevice = $('#calendar-service option:selected').text();
                var param = { "action": 29, "formTableColumnData": `   (   (   SERVICE_MASTER_1933.ACTIVITY_NAME like N'${searchSrevice}'    )        )   `, "formTableColumnName": "    left join SERVICE_MASTER_1933 on SERVICE_MASTER_1933.formId=f1.referrenceFormId and SERVICE_MASTER_1933.Id=f1.referrenceId  ", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 }
                console.log(param, "param");
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
                param.filter = changeStateOfCalenderController(view);
                var filterredFormDataTemp = await reBindCalender(param);
                var eventBasicData = window["EventBasicDetail"];
                var eventData = filterredFormDataTemp.data;
                refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);


            } else {
                var param = { "action": 29, "formTableColumnData": "", "formTableColumnName": "", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 };
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
                param.filter = changeStateOfCalenderController(view);
                var filterredFormDataTemp = await reBindCalender(param);
                var eventBasicData = window["EventBasicDetail"];
                var eventData = filterredFormDataTemp.data;
                refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);

            };
        });

        $('#calendar-service-Location').change(async function () {
            $("#list-view div.calendar").fullCalendar('refetchEvents');
            $("#timeline-resource-view div.calendar").fullCalendar('refetchEvents');
            $("#agenda-view div.calendar").fullCalendar('refetchEvents');
        });




        $('#calendar-service-Provider').change(async function () {
            if ($(this).val() != '') {
                var searchSrevice = $('#calendar-service-Provider option:selected').val();
                var param = { "action": 29, "formTableColumnData": `   (   (   SERVICE_PROVIDER_MASTER_1934.FIRST_NAME like N'${searchSrevice}'    )        )   `, "formTableColumnName": "    left join SERVICE_PROVIDER_MASTER_1934 on SERVICE_PROVIDER_MASTER_1934.formId=f1.referrenceFormId and SERVICE_PROVIDER_MASTER_1934.Id=f1.referrenceId  ", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 }
                console.log(param, "param");
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
                param.filter = changeStateOfCalenderController(view);
                var filterredFormDataTemp = await reBindCalender(param);
                var eventBasicData = window["EventBasicDetail"];
                var eventData = filterredFormDataTemp.data;
                refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);


            } else {
                var param = { "action": 29, "formTableColumnData": "", "formTableColumnName": "", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 };
                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
                param.filter = changeStateOfCalenderController(view);
                var filterredFormDataTemp = await reBindCalender(param);
                var eventBasicData = window["EventBasicDetail"];
                var eventData = filterredFormDataTemp.data;
                refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);

            };
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

            let urlSplit = window.location.href.split('/');
            let lastParam = urlSplit[urlSplit.length - 1];
            if (!lastParam.includes('#')) {
                lastParam = '#' + lastParam;
            }

            if ($('a[href="' + lastParam + '"]').length > 0) {
                tabsActive($('a[href="' + lastParam + '"]').parent().index());
            } else {
                tabsActive();
            }


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

function tabsActive(param = 0) {

    $("#tabs").tabs({
        create: function (event, ui) {
            //console.info(ui.tab.data('value'))
        },
        activate: function (event, ui) {
            ////debugger;
            //console.info($(ui.newTab).find('a').attr('href'));//ui.oldTab.data('value')
            var target = $(ui.newTab).find('a').attr('href');
            // $(target + ' div.calendar').fullCalendar('render');
            //$(target + ' div.calendar').fullCalendar('refetchEvents');
            $('body .popover').remove();
            $.cookie("calendar-activeView", $('a[href="' + target + '"]').parent().index(), { expires: 365, path: '/' });
            window.location.href = target;
            $(target + ' div.calendar').fullCalendar('rerenderEvents');
        }
    });
    $("#tabs").show();
    if (param == 0) {
        if (checkCookie('calendar-activeView') !== '') {
            $("#tabs").tabs("option", "active", parseInt(checkCookie('calendar-activeView')));
        } else {
            $("#tabs").tabs("option", "active", 2);
        }
    } else {
        $("#tabs").tabs("option", "active", param);
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
     let slotDuration = "00:15:00";
     debugger;
     if (calendarDetails.INTERVAL_TIME && !isNaN(calendarDetails.INTERVAL_TIME)) {
        slotDuration = "00:" + calendarDetails.INTERVAL_TIME + ":00";
        calendarDetails.INTERVAL_TIME=slotDuration;
    } else {
        calendarDetails.INTERVAL_TIME = slotDuration;
    }

    var defaultOptions = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: slotDuration,
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
            let datepicker_ele = $('button.fc-datePickerButton-button span');
            let datepicker_ele2 = $('button.fc-datePickerButton2-button span');
            let datepicker_ele3 = $('button.fc-datePickerButton3-button span');

            var classNames = datepicker_ele.attr("class");
            var classNames2 = datepicker_ele2.attr("class");
            var classNames3 = datepicker_ele3.attr("class");

            datepicker_ele.removeClass(classNames);
            datepicker_ele.addClass("fa fa-calendar");

            datepicker_ele2.removeClass(classNames2);
            datepicker_ele2.addClass("fa fa-calendar");

            datepicker_ele3.removeClass(classNames3);
            datepicker_ele3.addClass("fa fa-calendar");

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

                let isServiceAndServiceProvider = false;
                let isNotService = false;
                var serviceColor = "";
                if (_arrFormIDs.includes("2303") && _arrFormIDs.includes("2304")) {
                    isServiceAndServiceProvider = true;
                }
                if (!_arrFormIDs.includes("2303") && _arrFormIDs.includes("2304")) {
                    isNotService = true;
                }

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

                        if (isServiceAndServiceProvider || isNotService) {
                            let formid = isServiceAndServiceProvider ? 2303 : (isNotService ? 2304 : 0);
                            let _index = _arrFormIDs.findIndex(x => x == formid);
                            let _currentId = _associatedCustomFormIdsTemp[_index].toString().trim();

                            let colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: formid });
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: _currentId.toString() });
                                if (colorRow != undefined) {
                                    serviceColor = colorRow[colorExists.colorField];
                                }
                            }
                        }
                        //if (serviceColor && serviceColor != "") {
                        //    lblColor = serviceColor;
                        //    lblColor = "#3FBFC7";
                        //    serviceColor = "#3FBFC7";
                        //} else {
                        //    lblColor = "#7d606c";
                        //    serviceColor = "#7d606c";
                        //}

                            lblColor = "#3FBFC7";
                            serviceColor = "#3FBFC7";
                        if (customLocationTitle != "" && customLocationTitle != null && customLocationTitle != undefined) {
                            var tempHtml = "<div class='fc-content'><div class='fc-content' id='customLocationTitle' style = 'background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title' title='' > " + customLocationTitle + "</span></div> ";
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
                        if (isServiceAndServiceProvider || isNotService) {
                            let formid = isServiceAndServiceProvider ? 2303 : (isNotService ? 2304 : 0);
                            let _index = _arrFormIDs.findIndex(x => x == formid);
                            let _currentId = _associatedCustomFormIdsTemp[_index].toString().trim();

                            let colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: formid });
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: _currentId.toString() });
                                if (colorRow != undefined) {
                                    serviceColor = colorRow[colorExists.colorField];
                                }
                            }
                        }
                        //if (serviceColor && serviceColor != "") {
                        //    lblColor = serviceColor;
                        //} else {
                        //    lblColor = "#7d606c";
                        //    serviceColor = "#7d606c";
                        //}

                        lblColor = "#3FBFC7";
                        serviceColor = "#3FBFC7";

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
                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #3FBFC7;color: #000;" data-bs-original-title="" title="">';
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
                        if (isServiceAndServiceProvider || isNotService) {
                            let formid = isServiceAndServiceProvider ? 2303 : (isNotService ? 2304 : 0);
                            let _index = _arrFormIDs.findIndex(x => x == formid);
                            let _currentId = listids[_index].toString().trim();

                            let colorExists = _.findWhere(xaxisFormList, { resourceActivityForm: formid  });
                            if (colorExists != undefined) {
                                var colorRow = _.findWhere(colorExists.formDataList, { id: _currentId.toString() });
                                if (colorRow != undefined) {
                                    serviceColor = colorRow[colorExists.colorField];
                                }
                            }
                        }
                        if (serviceColor && serviceColor != "") {
                            lblColor = serviceColor;
                        } else {
                            lblColor = "#7d606c";
                            serviceColor = "#7d606c";
                        }
                        if (current_tab == "list-view") {
                            lblColor = "#3FBFC7";
                            serviceColor = "#3FBFC7";
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
            if (!checkShowTitle()) {
                element.append(_mainTempHtml)
                element.find(".fc-content[id]").remove();
                element.find("a[data-bs-original-title]").attr('data-bs-original-title', '');
                if (current_tab == "timeline-resource-view") {
                    element.find("a").closest("div.fc-event-container").css("height", "100%");
                    element.find("a").css({ "height": "60%" });
                    element.css({ "background": "#3FBFC7" });
                } else if (current_tab == "agenda-view") {
                    element.find("span.fc-title").html("&nbsp;");
                    element.css({ "background": "#3FBFC7" });
                } else {
                    element.css({ "background": "#3FBFC7" });
                }


            } else {
                element.append(_mainTempHtml);
                tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
                let $fcContent = element.find(".fc-content").detach();
                //$resize = element.find(".fc-resizer").detach();
                element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
                element.attr('data-html', 'true');
                element.css({
                    background: (serviceColor && serviceColor != "" ? serviceColor : "rgb(255, 255, 255)"),
                    /*borderColor: "#aaa",*/
                    padding: 0,
                    border: "none",
                    borderRadius: 5,
                    "z-index": 1
                });
                if (current_tab == "list-view") {
                    element.empty().
                    //    append("<div class='list-content'></div>").find(".list-content").css({
                    //background: (serviceColor && serviceColor != "" ? serviceColor : "rgb(255, 255, 255)")
                    //    }).
                        append($fcContent.css({
                        //borderRadius: 3,
                            "margin-left": 0,
                            "margin-right": 0
                    }));
                } else {
                    element.empty().append($fcContent.css({
                        borderRadius: 3,
                    }));
                }
                
            }

        },
        eventClick: async function (calEvent, jsEvent, view) {


            $('#fileSuccess').html('');
            $('#fileError2').html('');
            var $scope = angular.element($("#calendar")).scope();
            ////debugger;
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

           
            if (calEvent.DOWNLOAD_FILE_LIST && calEvent.DOWNLOAD_FILE_LIST != '' && calEvent.DOWNLOAD_FILE_LIST != 'null' && IsJsonString(calEvent.DOWNLOAD_FILE_LIST)) {
                calEvent.DOWNLOADABLE_ATTACHMENT_FILES = JSON.parse(calEvent.DOWNLOAD_FILE_LIST);
            }
            $scope.selectEventDetails = calEvent;

            var enrollUser = await getUserEnrollDetails(calEvent.Id);

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

            //$scope.selectEventDetails.user_enroll = is_enroll;

            //if (calEvent.DOWNLOADABLE_ATTACHMENT && calEvent.DOWNLOADABLE_ATTACHMENT != '' && calEvent.DOWNLOADABLE_ATTACHMENT != 'null') {
            //    $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES = calEvent.DOWNLOADABLE_ATTACHMENT.split(',');
            //}

            if (!(moment().local().diff(calEvent.start.format(), 'minute') <= 0)) {
                $scope.selectEventDetails.isEnroll = false;
            } else {
                $scope.selectEventDetails.isEnroll = true;
            }
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
                ////debugger;
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
                setTimeout(function () {
                    $('#agenda-view div.calendar').fullCalendar('render');
                    $('#timeline-resource-view div.calendar').fullCalendar('render');
                    $('#vertical-resource-view div.calendar').fullCalendar('render');
                }, 150);
            }, 150);
        },

        //  eventDragStop: function (event, jsEvent, ui, view) {
        //      console.log($(jsEvent.target).closest('tr').attr('data-resource-id'));
        //}

    };




    // List View

    if (is5CType) {
        var listViewViews = {
            listYear: { buttonText: 'year' }
        }
    } else {
        var listViewViews = {
            listDay: { buttonText: 'day' },
            listWeek: { buttonText: 'week' },
            listMonth: { buttonText: 'month' },
            listYear: { buttonText: 'year' }
        }
    }

    myOptions = {
        header: {
            left: 'prev,next datePickerButton3',
            center: 'title',
            right: (is5CType) ? 'listYear' : 'listDay,listWeek,listMonth,listYear'
        },
        views: listViewViews,
        defaultView: (is5CType) ? 'listYear' : 'listWeek',
        defaultDate: new Date(),
        events: function (start, end, timezone, callback) {

            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#list-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, ((is5CType) ? (moment(new Date()).year() < start.year()) ? start : moment(new Date()) : start ), end);
            param.filter.field = "start";
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;
            ////debugger;
            if (is5CType) {
                param.IsListView = true;
                param.startDate = moment(start).format("YYYY-MM-DD");
                param.endDate = moment(end).format("YYYY-MM-DD");
                param.resourceId = $("#calendar-service-Location option:selected").val();
            }

            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/" + ((is5CType) ? "getReferralFormFieldsListView" : "getReferralFormFields"),
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //$.unblockUI();
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined) {
                        if (formDetailsDataInfo.searchByDate != undefined) {
                            $('#list-view div.calendar').fullCalendar('removeEvents');
                        }
                        if (is5CType) {
                            window["CalendarListViewEventList"] = calenderData;
                        } else {
                            assignEvents(calenderData);
                        }

                        callback(calenderData);
                    }
                    else
                        callback([]);
                },
                beforeSend: function () {
                    // showLoader();
                },
                complete: function () {
                    var _ScrollOffset = window["scrollOffset"];
                    window.scrollTo(0, _ScrollOffset);
                    $.unblockUI();
                    // $("#" + current_tab + " div.calendar").unblock();
                }
            });
        },

        eventAfterAllRender: function (view) {
            ////debugger;
            if (is5CType) {
                let eventsList = window["CalendarListViewEventList"];
                var eventHTML = `<div class="event-list-5C">
                                <div class="C-element">
                                    No Slots Available
                                </div>
                             </div>`;

                if (eventsList != undefined) {
                    if (eventsList.length > 0) {
                        eventHTML = `<div class="fc-list-heading"><div class="ui-widget-header" style="padding: 8px 14px;" colspan="3<a href="javascript:void(0)" class="fc-list-heading-main">Available Slots</a></div></div>`;
                        eventsList.forEach(event => {
                            eventHTML += `<div class="event-list-5C" style="cursor: pointer;" onclick="bookListViewSlot('${moment(event.start).format('DD/MM/YYYY')}', '${((event.IsLastEvent) ? moment(event.start).format('DD/MM/YYYY') : moment(event.end).format('DD/MM/YYYY'))}', '${event.resources}', '${event.title}')">
                                <div class="C-element" style="font-size: 13px; width: auto;">
                                    ${moment(event.start).format('DD MMMM YYYY')} - ${((event.IsLastEvent) ? "" : moment(event.end).format('DD MMMM YYYY'))}
                                </div>
                                <strong class="C-element C-resource" style="background-color: ${((event.color != undefined && event.color != null && event.color != "") ? event.color : "rgb(125, 96, 108)")};">${event.title}</strong>
                             </div>`;
                        })
                    }
                }

                $("#list-view div.calendar .fc-list-table").empty();
                $("#list-view div.calendar .fc-list-table").append(eventHTML);
            }

        },
        allDaySlot: (is5CType) ? false : true,
        customButtons: {
            datePickerButton3: {
                themeIcon: 'custom-datepicker',
                click: function () {

                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                    var $btnCustom = $('.fc-datePickerButton3-button'); // name of custom  button in the generated code
                    $btnCustom.after('<input type="hidden" id="hiddenDate3" class="datepicker"/>');

                    $("#hiddenDate3").datepicker({
                        showOn: "button",
                        dateFormat: "yy-mm-dd",
                        onSelect: function (dateText, inst) {
                            $("#" + current_tab + " .calendar").fullCalendar('gotoDate', dateText);
                            //$('.calendar').fullCalendar('gotoDate', dateText);
                        },
                        defaultDate: $("#" + current_tab + " .calendar").fullCalendar('getDate').format("YYYY-MM-DD"),
                        changeMonth: true,
                        changeYear: true
                    });

                    var $btnDatepicker = $(".ui-datepicker-trigger"); // name of the generated datepicker UI 
                    //Below are required for manipulating dynamically created datepicker on custom button click
                    $("#hiddenDate3").show().focus().hide();
                    $btnDatepicker.trigger("click"); //dynamically generated button for datepicker when clicked on input textbox
                    $btnDatepicker.hide();
                    $btnDatepicker.remove();
                    $("input.datepicker").not("#hiddenDate3").remove();//dynamically appended every time on custom button click

                }
            }
        }
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#list-view div.calendar').fullCalendar(calendarOptions);

    // Agenda View
    myOptions = {
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
        },
        defaultView: 'month',
        //events: [],  
        events: function (start, end, timezone, callback) {
            //debugger;
            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;
            ////////debugger;
            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#agenda-view div.calendar').fullCalendar('getView');
            param.filter = {};
            start = $('#agenda-view div.calendar').fullCalendar('getDate');
            param.filter = changeStateOfCalender(view, start, end,1);
            param.filter.field = "start";
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;
            if ($("#calendar-service-Location option:selected").val() != "" && $("#calendar-service-Location option:selected").val() != "0") {
                param.filter.value += " and resources = '" + $("#calendar-service-Location option:selected").val() + "' ";
            }
            console.log(param.filter);
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
                        if (formDetailsDataInfo.searchByDate != undefined) {
                            $('#agenda-view div.calendar').fullCalendar('removeEvents');
                        }
                        assignEvents(angular.copy(calenderData));
                        callback(calenderData);
                        window["eventListTemp"] = calenderData;
                        window["eventListTempAgenda"] = calenderData;

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
        scrollTime: '00:00',

        allDaySlot: true,
        selectable: false,
        selectHelper: true,
        select: function (start, end) {

        },
        droppable: false, // this allows things to be dropped onto the calendar
    };
    var calendarOptions = $.extend({}, defaultOptions, myOptions);
    $('#agenda-view div.calendar').fullCalendar(calendarOptions);

    if (ySelection != 0) {
        //////debugger
        if (formDetailsDataInfo != null)
            if (formDetailsDataInfo.calenderSettingsList != null)
                if (formDetailsDataInfo.calenderSettingsList.length > 0) {
                    var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
                    if (exists != undefined) {
                        if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                            var minTime = exists.minTime.trim().replace(' ', ':');
                            var maxTime = exists.maxTime.trim().replace(' ', ':');

                            if (calendarDetails.DISPLAY_MIN_TIME != "" && calendarDetails.DISPLAY_MIN_TIME != "null" && calendarDetails.DISPLAY_MIN_TIME != null) {
                                minTime = moment(calendarDetails.DISPLAY_MIN_TIME, "hh:mm A").format("HH:mm");
                            }

                            if (calendarDetails.DISPLAY_MAX_TIME != "" && calendarDetails.DISPLAY_MAX_TIME != "null" && calendarDetails.DISPLAY_MAX_TIME != null) {
                                maxTime = moment(calendarDetails.DISPLAY_MAX_TIME, "hh:mm A").format("HH:mm");
                            }

                            $('#agenda-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                            $('#agenda-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                        }
                    }
                }
    }

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
    // timeLine resource view

    var resourceOptions = {
        selectable: false,
        selectHelper: true,
        select: function (start, end, jsEvent, view, resource) {
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var resource = $("#" + current_tab + " .calendar").fullCalendar('getResourceById', resource.id);
            if (dialog.length > 2) {
                dialog.find("form #tab_start").val(start.format());
                dialog.find("form #tab_end").val(end.format());
                if (typeof resource.eventColor != 'undefined')
                    dialog.find("form #tab_color").val('#' + resource.eventColor).change();
                dialog.find("form #allDay").val('false');
                dialog.find("form #resourceId").val(resource.id);
                if (typeof resource[resourceColumn] != 'undefined') {
                    resourceValue = resource[resourceColumn];
                    dialog.find("form #resources").val(resourceValue);
                    dialog.find("form #tab_title").val(' in ' + resourceValue);
                }
                dialog.dialog("open");
            }
            $("#" + current_tab + " .calendar").fullCalendar('unselect');
        },
        droppable: false, // this allows things to be dropped onto the calendar
    };
    function GetCalendarDateRange() {
        var calendar = $('#timeline-resource-view div.calendar').fullCalendar('getCalendar');
        var view = calendar.view;
        var start = view.start._d;
        var end = view.end._d;
        var dates = { start: start, end: end };
        return dates;
    }

    var myOptions1 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
            left: 'prev,next today datePickerButton',
            center: 'title',
            right: 'timelineDay,timelineWeek,timelineMonth,timelineYear'
        },
        customButtons: {
            datePickerButton: {
                themeIcon: 'custom-datepicker',
                click: function () {

                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                    var $btnCustom = $('.fc-datePickerButton-button'); // name of custom  button in the generated code
                    $btnCustom.after('<input type="hidden" id="hiddenDate" class="datepicker"/>');

                    $("#hiddenDate").datepicker({
                        showOn: "button",
                        dateFormat: "yy-mm-dd",
                        onSelect: function (dateText, inst) {
                            $("#" + current_tab + " .calendar").fullCalendar('gotoDate', dateText);
                            //$('.calendar').fullCalendar('gotoDate', dateText);
                        },
                        defaultDate: $("#" + current_tab + " .calendar").fullCalendar('getDate').format("YYYY-MM-DD"),
                        changeMonth: true,
                        changeYear: true
                    });

                    var $btnDatepicker = $(".ui-datepicker-trigger"); // name of the generated datepicker UI 
                    //Below are required for manipulating dynamically created datepicker on custom button click
                    $("#hiddenDate").show().focus().hide();
                    $btnDatepicker.trigger("click"); //dynamically generated button for datepicker when clicked on input textbox
                    $btnDatepicker.hide();
                    $btnDatepicker.remove();
                    $("input.datepicker").not("#hiddenDate").remove();//dynamically appended every time on custom button click

                }
            }
        },
        defaultView: 'timelineMonth',
        views: {
            timelineThreeDays: {
                type: 'timeline',
                duration: { days: 3 }
            },
            timelineMonth: { buttonText: 'month' },
            timelineWeek: { buttonText: 'week' },
            timelineDay: { buttonText: 'day' },
        },

        resourceAreaWidth: '25%',
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
            timeGrid: {
                dayMaxEventRows: 2 // adjust to 6 only for timeGridWeek/timeGridDay
            }
        },
        //events: [],
        events: function (start, end, timezone, callback) {

            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#timeline-resource-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;
            if ($("#calendar-service-Location option:selected").val() != "" && $("#calendar-service-Location option:selected").val() != "0") {
                param.filter.value += " and resources = '" + $("#calendar-service-Location option:selected").val() + "' ";
            }
            $.ajax({
                method: 'POST',
                url: BASE_URL + "/FormAPI/getReferralFormFields",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(param),
                success: function (response) {
                    //debugger;
                    var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                    if (calenderData != undefined) {
                        if (formDetailsDataInfo.searchByDate != undefined) {
                            $('#timeline-resource-view div.calendar').fullCalendar('removeEvents');
                        }
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
        // resourceLabelText: "Client",

        resourceOrder: resourceOrder,
        resourceColumns: resColumns,
        resources: resourceData,
        height: 'auto', // will activate stickyHeaderDates automatically!
        allDaySlot: true,
        resourceRender: function (resourceObj, labelTds, bodyTds) {
            var cellText = '';
            for (i = 0; i < labelTds.length; i++) {
                var labelTd = $(labelTds[i]);
                var cellText = labelTd.find('.fc-cell-text').text();
                var result1 = cellText.indexOf("img-responsive");
                if (result1 >= 0) {
                    labelTd.find('.fc-cell-text').html(cellText);
                }
                var result2 = cellText.indexOf("file-download");
                if (result2 >= 0) {
                    labelTd.find('.fc-cell-text').html(cellText);
                }
            }
        },
        selectable: (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") ? true : false,
        select: function (startDate, endDate, jsEvent, view, resource) {

            //debugger;
            var selectedStartDate = startDate;
            var selectedEndDate = endDate || startDate; // If end date is not provided (e.g., single day selection), use start date

            // Check if any part of the event overlaps with the selected date range
            var events = $('#timeline-resource-view div.calendar').fullCalendar('clientEvents');
            var overlappingEvents = events.filter(function (event) {
                return (event.start < selectedEndDate && event.end > selectedStartDate);
            });
            overlappingEvents = overlappingEvents.filter(x => x.resourceId == resource.id);

            if (overlappingEvents.length > 0) {
                // If events overlap with the selected date range, prevent unselect
                $('#calendar').fullCalendar('unselect');
                return;
                //alert('Events exist during this date range!');
            }


            //let currentDate = new Date();
            //let temp = new Date(startDate);
            //let tempEndDate = "";

            //if (currentDate.getDate() > temp.getDate()) {
            //    return;
            //}

            var $scope = angular.element($("#calendar")).scope();

            // check calendar is room rental type
            if (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") {
                $scope.selectEventDetails = {};

                $scope.selectEventDetails.start = startDate.format("YYYY-MM-DD").toString();
                $scope.selectEventDetails.resources = resource.id;
                $scope.selectEventDetails.COMPANY_CODE = calendarDetails.COMPANY_CODE;
                $scope.selectEventDetails.CALENDAR_CODE = calendarDetails.CALENDAR_CODE;

                $("#selectedLocationName").text(resource.LOCATION_ADDRESS);

                $("#date-counter").on("change paste keypress click", function () {
                    tempEndDate = calculateDate(startDate, this.value, $("input[name=date-calc-type]:checked").val());

                    $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY"));
                    $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));

                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                })

                $("input[name=date-calc-type]").on("change paste", function () {
                    $("#date-counter").val("1");

                    tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());
                    if (tempEndDate == "Invalid date") {
                        tempEndDate = "--";
                    }

                    $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

                    $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY"));
                    $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));

                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                });

                $("#endListViewDate").on("change", function () {

                    tempEndDate = moment(this.value, "DD/MM/YYYY");

                    $("input[name=date-calc-type][value=day]").prop("checked", true);
                    $(".navigation-element").removeClass("btn-primary");
                    setTimeout(function () {
                        $(document.getElementsByClassName("navigation-element")[0]).addClass("btn-primary");
                    }, 100);

                    if (tempEndDate.diff(startDate, "days") < 0) {
                        tempEndDate = moment(startDate.format("DD/MM/YYYY"), "DD/MM/YYYY")
                        this.value = tempEndDate.format("DD/MM/YYYY");
                    }

                    if (tempEndDate == "Invalid date") {
                        tempEndDate = "--";
                    }

                    $("#date-counter").val(tempEndDate.diff(startDate, "days") + 1);

                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                })

                $("#startListViewDate").on("change", function () {

                    startDate = moment(this.value, "DD/MM/YYYY");
                    
                    //if (moment(tempEndDate).diff(startDate, "days") < 0) {
                    //    startDate = moment(moment(tempEndDate).format("DD/MM/YYYY"), "DD/MM/YYYY")
                    //    this.value = startDate.format("DD/MM/YYYY");
                    //}

                    tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());

                    if (startDate == "Invalid date") {
                        startDate = "--";
                    }

                    $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY").toString());
                    $scope.selectEventDetails.start = moment(startDate).format("YYYY-MM-DD").toString();
                    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
                })

                tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());

                if (tempEndDate == "Invalid date") {
                    tempEndDate = "--";
                }

                $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY"));
                $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));

                $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();

                $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

                $("#dateRangePickerModel").modal("show");

                $("#date-counter").focus();
            }


        }
    };
    countLoader = 0;
    if (calendarDetails.CALENDAR_TYPE == "3" && calendarDetails.CALENDAR_CATEGORY_ID == "4") {
        myOptions1.selectAllow = function (selectInfo) {
            // Disallow selection of past dates
            return selectInfo.start.isSameOrAfter(moment(), 'day');
        }
    }
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions1);

    $('#timeline-resource-view div.calendar').fullCalendar(calendarOptions);

    if (ySelection != 0) {
        if (formDetailsDataInfo != null)
            if (formDetailsDataInfo.calenderSettingsList != null)
                if (formDetailsDataInfo.calenderSettingsList.length > 0) {
                    var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
                    if (exists != undefined) {
                        if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                            var minTime = exists.minTime.trim().replace(' ', ':');
                            var maxTime = exists.maxTime.trim().replace(' ', ':');

                            if (calendarDetails.DISPLAY_MIN_TIME != "" && calendarDetails.DISPLAY_MIN_TIME != "null" && calendarDetails.DISPLAY_MIN_TIME != null) {
                                minTime = moment(calendarDetails.DISPLAY_MIN_TIME, "hh:mm A").format("HH:mm");
                            }

                            if (calendarDetails.DISPLAY_MAX_TIME != "" && calendarDetails.DISPLAY_MAX_TIME != "null" && calendarDetails.DISPLAY_MAX_TIME != null) {
                                maxTime = moment(calendarDetails.DISPLAY_MAX_TIME, "hh:mm A").format("HH:mm");
                            }

                            $('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                            $('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                        }
                    }
                }
    }
    if ($scope != undefined) {
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
    }
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'prev,next today datePickerButton2',
            center: 'title',
            right: 'agendaDay,agendaTwoDays,agendaThreeDays,agendaWeek'
        },
        views: {
            agendaTwoDays: {
                type: 'agenda',
                duration: { days: 2 },
                // views that are more than a day will NOT do this behavior by default
                // so, we need to explicitly enable it
                groupByResource: true,

                // uncomment this line to group by day FIRST with resources underneath
                //groupByDateAndResource: true
            },
            agendaThreeDays: {
                type: 'agenda',
                duration: { days: 3 },
                groupByResource: true,
            },
            agendaWeek: {
                type: 'agenda',
                duration: { days: 7 },
                groupByResource: true,
            }
        },
        dayMinWidth: 150, // will cause horizontal scrollbars      
        columnWidth: 150,
        eventMinWidth: 100,
        defaultView: 'agendaDay',
        //events: [],
        aspectRation: 1.35,
        events: function (start, end, timezone, callback) {
            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;
            param.isCalender = 1;
            param.isEvent = 1;
            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#vertical-resource-view div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
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
                        if (formDetailsDataInfo.searchByDate != undefined) {
                            $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
                        }
                        assignEvents(calenderData);
                        callback(calenderData);
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
        resources: resourceData,
        allDaySlot: true,
        selectable: false,
        customButtons: {
            datePickerButton2: {
                themeIcon: 'custom-datepicker',
                click: function () {
                    var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                    var $btnCustom = $('.fc-datePickerButton2-button'); // name of custom  button in the generated code
                    $btnCustom.after('<input type="hidden" id="hiddenDate2" class="datepicker"/>');

                    $("#hiddenDate2").datepicker({
                        showOn: "button",
                        dateFormat: "yy-mm-dd",
                        onSelect: function (dateText, inst) {
                            $("#" + current_tab + " .calendar").fullCalendar('gotoDate', dateText);
                            //$('.calendar').fullCalendar('gotoDate', dateText);
                        },
                        defaultDate: $("#" + current_tab + " .calendar").fullCalendar('getDate').format("YYYY-MM-DD"),
                        changeMonth: true,
                        changeYear: true
                    });

                    var $btnDatepicker = $(".ui-datepicker-trigger"); // name of the generated datepicker UI 
                    //Below are required for manipulating dynamically created datepicker on custom button click
                    $("#hiddenDate2").show().focus().hide();
                    $btnDatepicker.trigger("click"); //dynamically generated button for datepicker when clicked on input textbox
                    $btnDatepicker.hide();
                    $btnDatepicker.remove();
                    //debugger;
                    $("input.datepicker").not("#hiddenDate2").remove();//dynamically appended every time on custom button click

                }
            }
        },
    };
    if (formDetailsDataInfo.calenderSettingsList?.length > 0) {
        var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
        if (exists != undefined) {
            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                var minTime = exists.minTime.trim().replace(' ', ':');
                var maxTime = exists.maxTime.trim().replace(' ', ':');

                if (calendarDetails.DISPLAY_MIN_TIME != "" && calendarDetails.DISPLAY_MIN_TIME != "null" && calendarDetails.DISPLAY_MIN_TIME != null) {
                    minTime = moment(calendarDetails.DISPLAY_MIN_TIME, "hh:mm A").format("HH:mm");
                }

                if (calendarDetails.DISPLAY_MAX_TIME != "" && calendarDetails.DISPLAY_MAX_TIME != "null" && calendarDetails.DISPLAY_MAX_TIME != null) {
                    maxTime = moment(calendarDetails.DISPLAY_MAX_TIME, "hh:mm A").format("HH:mm");
                }

                myOptions2.minTime = minTime + ":00";
                myOptions2.maxTime = maxTime + ":00";

            }
        }
    }
    countLoader = 0;
     calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
     console.log(JSON.stringify(calendarOptions));
     $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);
     
    
    setTimeout(function () {
        $.unblockUI();
    }, 500);
    //tabsActive();
}

function calculateDate(startDate, counter, type) {
    ////debugger;
    let temp = new Date(startDate);
    let dateObject = moment(moment(temp).format("YYYY-MM-DD"))

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


function bookListViewSlot(startDate, endDate, resource, title) {
    ////debugger;

    $("#dateRangePickerModel").modal("show");

    var startDate = moment(startDate, "DD/MM/YYYY");
    var tempEndDate = moment(endDate, "DD/MM/YYYY");

    $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));
    $("#endListViewDate").val(tempEndDate.format("DD/MM/YYYY"));


    $("#date-counter").on("change paste keyup click", function () {
        ////debugger;
        tempEndDate = calculateDate(startDate, this.value, $("input[name=date-calc-type]:checked").val());

        $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
        $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY"));
        $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));
    })

    $("#endListViewDate").on("change", function () {

        tempEndDate = moment(this.value, "DD/MM/YYYY");

        $("input[name=date-calc-type][value=day]").prop("checked", true);
        $(".navigation-element").removeClass("btn-primary");
        setTimeout(function () {
            $(document.getElementsByClassName("navigation-element")[0]).addClass("btn-primary");
        }, 100);

        if (tempEndDate.diff(startDate, "days") < 0) {
            tempEndDate = moment(startDate.format("DD/MM/YYYY"), "DD/MM/YYYY")
            this.value = tempEndDate.format("DD/MM/YYYY");
        }

        if (tempEndDate == "Invalid date") {
            tempEndDate = "--";
        }

        $("#date-counter").val(tempEndDate.diff(startDate, "days") + 1);

        $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
    })

    $("#startListViewDate").on("change", function () {

        startDate = moment(this.value, "DD/MM/YYYY");
        
        //if (moment(tempEndDate).diff(startDate, "days") < 0) {
        //    startDate = moment(moment(tempEndDate).format("DD/MM/YYYY"), "DD/MM/YYYY")
        //    this.value = startDate.format("DD/MM/YYYY");
        //}

        tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());

        if (startDate == "Invalid date") {
            startDate = "--";
        }

        $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY").toString());
        $scope.selectEventDetails.start = moment(startDate).format("YYYY-MM-DD").toString();
        $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
    })

    $("input[name=date-calc-type]").on("change paste", function () {
        $("#date-counter").val("1");

        tempEndDate = calculateDate(startDate, $("#date-counter").val(), $("input[name=date-calc-type]:checked").val());
        if (tempEndDate == "Invalid date") {
            tempEndDate = "--";
        }

        $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

        $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
        $("#endListViewDate").val(moment(tempEndDate).format("DD/MM/YYYY"));
        $("#startListViewDate").val(startDate.format("DD/MM/YYYY"));
    })

    var $scope = angular.element($("#calendar")).scope();

    $scope.selectEventDetails = {};
    $scope.selectEventDetails.start = startDate.format("YYYY-MM-DD").toString();
    $scope.selectEventDetails.end = moment(tempEndDate).format("YYYY-MM-DD").toString();
    $scope.selectEventDetails.resources = resource;
    $scope.selectEventDetails.COMPANY_CODE = calendarDetails.COMPANY_CODE;
    $scope.selectEventDetails.CALENDAR_CODE = calendarDetails.CALENDAR_CODE;

    $("#selectedLocationName").text(title);

    $("#date-counter").val(tempEndDate.diff(startDate, "days") + 1);
    $("input[name=date-calc-type][value=day]").prop("checked", true);
    $(".navigation-element").removeClass("btn-primary");
    setTimeout(function () {
        $(document.getElementsByClassName("navigation-element")[0]).addClass("btn-primary");
    }, 100);


    $("#txt-calc-type").text($("input[name=date-calc-type]:checked").val() + "s.")

    $("#date-counter").focus();
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

        ////debugger;
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
            $('#newtabuList').empty();
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
    //////debugger;
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

async function getUserEnrollDetails(id) {
    
    return new Promise(resolve => {
        $.ajax({
            type: "GET",
            url: BASE_URL + "UserAdmin/GetEnrollUserDetails/" + id,
            contentType: "application/json",
            beforeSend: function () {
                 showLoader();
            },
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
    var defaultOptions2 = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: calendarDetails.INTERVAL_TIME,
        eventOrderStrict: true,
        // defaultTimedEventDuration: defaultDuration,
        //aspectRatio: 1.5,
        defaultDate: moment(assignDate.format()).format('YYYY-MM-DD'),
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
            //var current_tab = $('#tabs .ui-tabs-panel:eq(' + $( "#tabs" ).tabs( "option", "active" ) + ')').attr('id');
            if (bool) {
                showLoader("#agenda-view2 div.calendar .fc-view-container");
            }
            else {
                $("#agenda-view2 div.calendar .fc-view-container").unblock();
            }
        },
        eventRender: function (event, element) {



            var $scope = angular.element($("#calendar")).scope();
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            if (current_tab == "agenda-view") {
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
                formGroupKey: event.formGroupKey,
                EVENT_TYPE: event.EVENT_TYPE,
                IS_PUBLIC_USER_EVENT: event.IS_PUBLIC_USER_EVENT
            };
            eventData.title = _tempTitle;
            eventData.Images = event.files;
            if (typeof _associatedTitles !== "undefined" && _associatedTitles !== null && _associatedTitles !== "") {
                var _arrTitles = _associatedTitles.split(',');
                var _arrColor = [];
                var _arrFormIDs = _associatedFormIDs.split(",");


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
                //////debugger;
                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";

                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #3FBFC7;color: #000;" data-bs-original-title="" title="">';
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
                                if (colorExists.isVisible) {
                                    if (eventData.IS_PUBLIC_USER_EVENT) {
                                        if (dataRow == 2312) {
                                            tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"
                                        }

                                    } else {
                                        tempHtml += "<div class='fc-content' id='" + event.Id + "_" + position + "_" + currentId + "' style='background:" + (lblColor == undefined || lblColor == "" ? "#7d606c" : lblColor) + ";borderRadius: 3;'><span class='fc-title'>" + slipTitle + "</span></div>"
                                    }
                                }
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
            if (formDetailsDataInfo.otherFormIsShow != null && formDetailsDataInfo.otherFormIsShow == true) {
                if (event.customFourthTitle != null && event.customFourthTitle != "") {
                    var tempHtml = "<div class='fc-content fcTime' id='" + event.Id + "_Time'><small class='time' title=''> " + event.customFourthTitle + "</small></div> ";
                    if (current_tab != "agenda-view") {
                        _mainTempHtml += tempHtml;
                    }
                    rowTooltipDisplay += event.customFourthTitle + " <br/> "
                }
            }
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
            if (eventData.Id == undefined) {
                console.log(agendaTempHtml);
            } else {
                if (eventData.EVENT_TYPE == "SCHEDULE" && !eventData.IS_PUBLIC_USER_EVENT) {
                    element.addClass("available-fc-bgevent");
                } else if (eventData.EVENT_TYPE == "BOOKING" && !eventData.IS_PUBLIC_USER_EVENT) {
                    element.addClass("booking-fc-bgevent");
                } else {
                    element.append(_mainTempHtml);
                    element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
                    element.attr('data-html', 'true');
                }
            }

            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();





            element.css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
                borderRadius: 5,
                "z-index": 1
            })
                //    .droppable({
                //    drop: function (event, ui) {
                //        console.log(event);
                //        console.log(ui);
                //    },
                //    activate: function (event, ui) {
                //        console.log(event);
                //    }
                //})
                .empty().append($fcContent.css({
                    borderRadius: 3,
                }), $resize);
        },
        eventAfterAllRender: function (event, element, view) {

            setTimeout(function () {
                jQuery.curCSS = function (element, prop, val) {
                    return jQuery(element).css(prop, val);
                };
                $('.fc-content').bstooltip({ html: true });
                $('.available-fc-bgevent').bstooltip({ html: true });
                $('.fc-timeline-event').bstooltip({ html: true });
                $('.fc-list-item').bstooltip({ html: true });
                $('.fc-day-grid-event').bstooltip({ html: true });
                $('.fc-time-grid-event').bstooltip({ html: true });

                setTimeout(function () {
                    $('#agenda-view2 div.calendar').fullCalendar('render');
                }, 150);
            }, 150);


        }
    };


    var myOptions2 = {
        allDaySlot: false,
        header: {
            left: 'prev,next,today',
            center: 'title',
            right: 'agendaWeek'
        },
        defaultView: 'agendaWeek',
        views: {
            agendaWeek: { buttonText: 'week' },
        },
        //events: [],  
        events: function (start, end, timezone, callback) {

            //var $scopeVar = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var view = $('#agenda-view2 div.calendar').fullCalendar('getView');
            param.filter = {};
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
            param.startDate = moment(start.format()).format("YYYY-MM-DD HH:mm:ss");
            param.endDate = moment(end.format()).format("YYYY-MM-DD HH:mm:ss");
            param.COMPANY_CODE = COMPANY_CODE;
            param.CALENDAR_CODE = CALENDAR_CODE;


            var postUrl = BASE_URL + "/FormAPI/getReferralFormFieldsService";


            postAsync(postUrl, param).then(function (response) {


                var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                calenderData.forEach(x => {
                    if (x.customFormIds.split(',').length == 4) {
                        x["rendering"] = "";
                    }
                });
                let $scopeVar = angular.element($("#calendar")).scope();
                var selectResourceId = $scopeVar.selectEventDetails.resourceId;
                var _calenderData = [];
                calenderData.forEach(x => {


                    if (x.resourceId && x.resourceId != 0 && x.resourceId != null && x.resourceId != "" && selectResourceId == x.resourceId) {
                        _calenderData.push(x);
                    } else if (x.id == 0) {
                        _calenderData.push(x);
                    } else if (x.id != 0 && x.customForms) {
                        ////debugger;
                        let customFormsIds = x.customForms.split(',');
                        let index = customFormsIds.findIndex(y => y == "2306");
                        if (index != - 1) {
                            let splitcustomFormIds = x.customFormIds.split(',');
                            if (splitcustomFormIds.length > index) {
                                if (selectResourceId == splitcustomFormIds[index]) {
                                    _calenderData.push(x);
                                } else {
                                    _calenderData.push({
                                        "id": 0,
                                        "start": x.start,
                                        "end": x.end,
                                        "title": "",
                                        "rendering": "background",
                                        "color": "#ddd",
                                        "customForms": "2306",
                                        "customTitle": "Barrway",
                                        "customFormIds": "1"
                                    });
                                }
                            }
                        }
                    } else {
                        _calenderData.push(x);
                    }

                });

                //calenderData = calenderData.filter(x => $scopeVar.selectEventDetails.resourceId == x.resourceId || x.id==0);


                if (_calenderData != undefined) {
                    if (formDetailsDataInfo.searchByDate != undefined) {
                        $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
                    }
                    window["eventListTemp2"] = _calenderData;
                    callback(_calenderData);
                }
                else
                    callback([]);
            });
        },
        selectable: true,
        select: function (start, end, cell) {
            //////debugger;

            var $scope = angular.element($("#calendar")).scope();
            $scope.BookingService = {};
            $scope.BookingService.start = start;
            $scope.BookingService.end = end;
            ////debugger;
            var events = window["eventListTemp2"];

            var exist = events.filter(x => moment(start.format()).local() >= moment(x.start).local() && moment(end.format()).local() <= moment(x.end).local() && x.EVENT_TYPE == "SCHEDULE");
            if (exist.length == 0) {
                swal({
                    title: "Slot Unavailable!",
                    text: "The slot you have selected is not available, Kindly select another slot.",
                    icon: "warning",
                    buttons: {
                        confirm: "Okay"
                    }
                });

                //alert('Not available slots!');
                return;
            }
            var bgevent = exist[0];
            //console.log(bgevent.activities);
            //console.log($scope.activityConfig.formDataList[0].DURATION_FIELD);

            //checkServiceDuration,checkServiceDurationDrag

            if (checkServiceDuration() && !checkServiceDurationDrag()) {
                let activity_data = $scope.activityConfig.formDataList.find(x => x.id == bgevent.activities);
                let duration = activity_data.DURATION_FIELD;
                end = moment(start).add(duration, 'minutes').format("YYYY-MM-DD HH:mm");
                start = moment(start).format("YYYY-MM-DD HH:mm");
            } else if (checkServiceDuration() && checkServiceDurationDrag()) {
                end = moment(end).format("YYYY-MM-DD HH:mm");
                start = moment(start).format("YYYY-MM-DD HH:mm");
            } else if (checkFixedSessionCalendar()) {
                end = moment(bgevent.end).format("YYYY-MM-DD HH:mm");
                start = moment(start).format("YYYY-MM-DD HH:mm");
            } else {
                end = moment(start).add("60", 'minutes').format("YYYY-MM-DD HH:mm");
                start = moment(start).format("YYYY-MM-DD HH:mm");
            }



            $.ajax({
                url: "/Account/CheckPublicUserLogin",
                type: "POST",
                success: function (response) {

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
                        var eventData = $scope.selectEventDetails;
                        $.ajax({
                            url: "/Useradmin/GetCurrentPackageDetails",
                            type: "GET",
                            data: {
                                CompanyCode: eventData.COMPANY_CODE,
                                CalendarCode: eventData.CALENDAR_CODE,
                                ServiceId: eventData.activities,
                                start: start,
                                end: end
                            },
                            async: false,
                            success: function (response) {

                                if (response.Status) {
                                    var customTitleSplit = bgevent.customTitle.split(',');

                                    const wrapper = document.createElement('div');
                                    wrapper.innerHTML = `<div>
                                        ${moment(start).format("DD-MM-YYYY")}
                                    </div>
                                    <div>
                                        ${moment(start).format("hh:mm a")} to ${moment(end).format("hh:mm a")}
                                    </div>
                                    ${(customTitleSplit.length > 2) ? `<div>${customTitleSplit[2]}</div><br />` : ''}
                                    <div>${customTitleSplit[1]}</div>
                                    <div>${customTitleSplit[0]}</div><br />
                                    <h4 style="color:red">${response.Message}</h4>`;

                                    swal({
                                        title: "You are going to book",
                                        content: wrapper,
                                        buttons: {
                                            cancel: "Cancel",
                                            confirm: "Confirm"
                                        }
                                    }).then(function (response) {
                                        if (response) {
                                            bookingService(start, end, bgevent);
                                        } else {

                                        }
                                    });
                                } else {
                                    swal({
                                        icon: "error",
                                        title: "Warning!",
                                        text: response.Message,
                                        buttons: {
                                            confirm: "Okay"
                                        }

                                    })
                                }


                            }
                        });



                    }
                }
            });

        },
        selectAllow: function (select) {
            return moment().local().diff(select.start.format(), 'minute') <= 0
        }
    };
    customEventDetailsServiceModelPopUp.modal('show');
    customEventDetailsServiceModelPopUp.css({ "z-index": "9999" });

    if (formDetailsDataInfo.calenderSettingsList?.length > 0) {
        var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
        if (exists != undefined) {
            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                var minTime = exists.minTime.trim().replace(' ', ':');
                var maxTime = exists.maxTime.trim().replace(' ', ':');
                
                if (calendarDetails.DISPLAY_MIN_TIME && calendarDetails.DISPLAY_MIN_TIME != "" && calendarDetails.DISPLAY_MIN_TIME != "null" && calendarDetails.DISPLAY_MIN_TIME != null) {
                    minTime = moment(calendarDetails.DISPLAY_MIN_TIME, "hh:mm A").format("HH:mm");
                }

                if (calendarDetails.DISPLAY_MAX_TIME && calendarDetails.DISPLAY_MAX_TIME != "" && calendarDetails.DISPLAY_MAX_TIME != "null" && calendarDetails.DISPLAY_MAX_TIME != null) {
                    maxTime = moment(calendarDetails.DISPLAY_MAX_TIME, "hh:mm A").format("HH:mm");
                }
                myOptions2.minTime = minTime + ":00";
                myOptions2.maxTime = maxTime + ":00";

            }
        }
    }
    var calendarOptions = $.extend({}, defaultOptions2, myOptions2);
    $('#agenda-view2 div.calendar').fullCalendar('destroy');
    setTimeout(function () {
        othercalendar = $('#agenda-view2 div.calendar').fullCalendar(calendarOptions);
    }, 500);

    $('#customEventDetailsServiceModelPopUp').on('shown.bs.modal', function () {
        //$("#agenda-view2 div.calendar").fullCalendar('render');
    });

}


function bookingService(star, end, bgevent) {
    $.ajax({
        url: "/UserAdmin/CheckAdditionalFormDetails",
        method: "GET",
        data: {
            CalendarCode: CALENDAR_CODE
        },
        success: function (response) {
            if (response.Status) {
                invokeBookingService(star, end, bgevent);
            } else {
                angular.element($("#AdditionalDetailsFormModal")).scope().bgEventDetails = {
                    start: star,
                    end: end,
                    bgevent: bgevent
                };
                angular.element($("#AdditionalDetailsFormModal")).scope().IsEventBackground = true;
                angular.element($("#AdditionalDetailsFormModal")).scope().renderAdditionalDetailsForm();
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
    
}

function invokeBookingService(star, end, bgevent) {
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
    //////debugger;
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
        }).then(function () {
            $("#AdditionalDetailsFormModal").modal("hide");
            $("#AdditionalDetailsFormModal #service-div").empty();
        });
        //alert(response.Message);
        $('#agenda-view2 div.calendar').fullCalendar('removeEvents');
        $('#agenda-view2 div.calendar').fullCalendar('refetchEvents');
    })
}


function checkFixedSessionCalendar() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    let type = calendarDetails["CALENDAR_TYPE"];
    return setup["Step2"]["Steps"]["Step" + type]["IS_SLOT_BOOKING"] == true;
}

function checkServiceDuration() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    let type = calendarDetails["CALENDAR_TYPE"];
    return setup["Step2"]["Steps"]["Step" + type]["SERVICE_DURATION"] == true;
}

function checkServiceDurationDrag() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    let type = calendarDetails["CALENDAR_TYPE"];
    return setup["Step2"]["Steps"]["Step" + type]["SERVICE_DURATION_DRAG"] == true;
}

function checkAllowParticipantsCount() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    return setup["Is_Showing_List_Participants"] == true;
}

function checkShowTitle() {
    let setup = JSON.parse(calendarDetails["setup_matrix"]);
    let type = calendarDetails["CALENDAR_TYPE"];
    return setup["Step2"]["Steps"]["Step" + type]["IS_SHOWING_EVENT_TITLE"] == true;
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
    //$.ajax({
    //    url: "/Marketplace/GetServiceProviderMasterList/",
    //    async: false,
    //    type: "POST",
    //    data: {
    //        data: {},
    //        companyCode: COMPANY_CODE,
    //        calendarCode: CALENDAR_CODE
    //    },
    //    success: function (response) {
    //        Service_ProviderList = response.data;
    //        var serviceProvider = $("#calendar-service-Provider").empty();
    //        serviceProvider.append($('<option>', {
    //            value: "",
    //            text: "All Service provider"
    //        }));
    //        if (Service_ProviderList.length > 0) {
    //            $("#div-calendar-service-Provider").show();
    //        }

    //        $.each(Service_ProviderList, function (index, item) {
    //            serviceProvider.append($('<option>', {
    //                value: item.FIRST_NAME,
    //                text: item.FIRST_NAME + " " + item.LAST_NAME
    //            }));
    //        });



    //    },
    //    error: function (errorResponse) {
    //        data = null;
    //    }
    //});

    Service_ProviderList = calenderSettings.find(x => x.resourceForm == 2304).formDataList;;
    var serviceProvider = $("#calendar-service-Provider").empty();
    serviceProvider.append($('<option>', {
        value: "",
        text: "All Service provider"
    }));
    if (Service_ProviderList.length > 0) {
        $("#div-calendar-service-Provider").show();
    }

    $.each(Service_ProviderList, function (index, item) {
        serviceProvider.append($('<option>', {
            value: item.FIRST_NAME,
            text: item.FIRST_NAME + " " + item.LAST_NAME
        }));
    });

}

function getLocationMaster() {
    //////debugger;
    //$.ajax({
    //    url: "/Marketplace/GetLocationMasterList/",
    //    async: false,
    //    type: "POST",
    //    data: {
    //        data: {
    //            filters: [{
    //                field: "CALENDAR_CODE",
    //                type: "=",
    //                value: CALENDAR_CODE
    //            }]
    //        },
    //        companyCode: COMPANY_CODE
    //    },
    //    success: function (response) {
    //        data = response;
    //        ////debugger;
    //        console.log(data, "data data data");


    //        Service_Location_List = response.data;

    //        if (Service_Location_List.length > 0) {
    //            $("#div-calendar-service-Location").show();
    //        }

    //        var Location = $("#calendar-service-Location").empty();
    //        Location.append($('<option>', {
    //            value: "",
    //            text: "All location"
    //        }));

    //        $.each(Service_Location_List, function (index, item) {
    //            Location.append($(`<option value="${item.Id}">${item.LOCATION_ADDRESS}</option>`));
    //        });



    //    },
    //    error: function (errorResponse) {
    //        data = null;
    //    }
    //});
    //return data;

    Service_Location_List = calenderSettings.find(x => x.resourceForm == 2306).formDataList;;

    if (Service_Location_List.length > 0) {
        $("#div-calendar-service-Location").show();
    }

    var Location = $("#calendar-service-Location").empty();
    Location.append($('<option>', {
        value: "",
        text: "All location"
    }));

    $.each(Service_Location_List, function (index, item) {
        Location.append($(`<option value="${item.Id}">${item.LOCATION_ADDRESS}</option>`));
    });
}

function GetAdvancaePopupForMasterData(formid,title) {

    var data = { action: 7, formid: formid };


    var excludeFields = [{formid: 2303, fields: ["REST_PERIOD_BETWEEN_SESSION", "IS_SERVICE_PAID", "NEED_ONLINE_PAYMENT", "SERVICE_PAY_PER"]}];

    showLoader();
    $.ajax({
        type: "POST",
        url: BASE_URL + "FormAPI/ManageForm",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
            hideLoader();
            var data = JSON.parse(response[0].fields);
            if (data["Page 1"] != null && data["Page 1"] != undefined) {
                var data2 = JSON.parse(data["Page 1"]);
                var fields = [];
                if (data2 != null && data2 != undefined) {
                    fields = data2.filter(x => x["required"] != undefined && x["required"] == true).map(x => { return { name: x.name,label: x.label }; });
                }
                console.log(JSON.stringify(fields));
                $('#info-master-div').html('');
                if (fields.length > 0) {
                    //info-master-modal,info-master-div,Service_Location_List,Service_ProviderList,activityResults
                    $("#info-master-modal").modal('show');
                    $("#info-master-modal .modal-title").html(title);

                    let formDataList = calenderSettings.find(x => x.resourceForm == formid).formDataList;
                    let modalContent = '';
                    formDataList.forEach(x => {
                        modalContent += '<div>';
                        fields.forEach(y => {
                            if (!excludeFields.find(z => z.formid == formid && z.fields.find(f => f == y.name))) {
                                if ((x[y.name] != undefined && x[y.name] != '' && x[y.name] != 'null') || x[y.name]=="0")
                                modalContent += `<p><b>${y.label}:</b>  ${x[y.name]}</p>`;
                            }
                        });
                        modalContent += '</div><hr/>';
                    });

                    $('#info-master-div').html(modalContent);

                }
            }
        }
    });
}