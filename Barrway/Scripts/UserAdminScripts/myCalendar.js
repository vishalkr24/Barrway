var CalendarFormId = "2305", ySelection = "", xSelection = "", COMPANY_CODE, CALENDAR_CODE, formDetailsDataInfo, counterLoader, xaxisFormList, formAllDatafields, listTabulator, calendarDetails, IsCustomFilter, IsCustomInFilter;

$(document).on("change", "#company-filter-selector", function () {

    if ($("#company-filter-selector").val() != "-1") {
        localStorage.setItem("publicUserSelectedCompany", $("#company-filter-selector").val())
    }

    $('.calendar').fullCalendar('destroy');
    usercalendarLoad();
})

debugger;

async function usercalendarLoad() {

    COMPANY_CODE = $("#company-filter-selector option:selected").val();
     IsCustomFilter = true;
    IsCustomInFilter = false;
    
    if (COMPANY_CODE == "-1") {
        var options = $('select option');
        var values = options.map(function () {
            var value = $(this).val();
            if (value !== '-1') {
                return "'" + value + "'";
            }
        }).get().join(',');
        COMPANY_CODE = values;
        IsCustomFilter = false;
        IsCustomInFilter = true;
    }
    
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

    calendarDetails = (await getCalendarDetails(calenderSettings[0].formDataList[0].CALENDAR_CODE)).Data;
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


        var serviceSelect = $('#calendar-service');
        serviceSelect.empty();
        serviceSelect.append($('<option>', {
            value: "",
            text: "All service"
        }));

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
            tabsActive();
            
            marcketplaceCalendar("", [], resResults, resColumns, activityResults, activityColumns, []);


        }


    }


};



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
    showLoader();
    param.IsCustomFilter = IsCustomFilter;
    param.IsCustomInFilter = IsCustomInFilter;
    param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
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

            $(target + ' div.calendar').fullCalendar('rerenderEvents');
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
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "FormAPI/getCalenderSettingsFormData",
            data: JSON.stringify({ "action": 4, "formId": CalendarFormId, "IsCustomFilter": IsCustomFilter, IsCustomInFilter:IsCustomInFilter, "CustomFilters": [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }] }),
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
                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";
                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #ddd;color: #000;" data-original-title="" title="">';
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
            element.append(_mainTempHtml)
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
            element.css({
                background: "rgb(255, 255, 255)",
                borderColor: "#aaa",
                padding: 2,
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
            //$scope.selectEventDetails.customFormIdsSplit
            //$scope.selectEventDetails.customFormsSplit
            $scope.selectEventDetails.customTitleSplit = $scope.selectEventDetails.customTitle.split(',');

            var listFormDropdown = _.filter($scope.selectEventDetails.customFormsSplit, function (item) { return item != ySelection.toString(); });
            if (listFormDropdown.length > 0) {
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

                    } else {
                        tempDrop.formId = item.activitiesForm.toString();
                        tempDrop.Id = "0";
                        tempDrop.formTitle = item.title;
                        tempDrop.dropdownListData = item;
                        tempDrop.customClass = "true";
                    }
                    $scope.selectEventDetails.dropdownList.push(tempDrop);
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

    },


        // List View
        myOptions = {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'listDay,listWeek,listMonth,listYear'
            },
            // customize the button names,
            // otherwise they'd all just say "list"
            views: {
                listDay: { buttonText: 'day' },
                listWeek: { buttonText: 'week' },
                listMonth: { buttonText: 'month' },
                listYear: { buttonText: 'year' }
            },
            defaultView: 'listDay',
            defaultDate: new Date(),
            // events: calenderData,
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
                param.filter = changeStateOfCalender(view, start, end);
                param.filter.field = "start";
                param.COMPANY_CODE = COMPANY_CODE;
                param.IsPublicUser = true;
                param.IsCustomFilter = IsCustomFilter;
                param.IsCustomInFilter = IsCustomInFilter;
                param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
                //showLoader();
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
                                $('#list-view div.calendar').fullCalendar('removeEvents');
                            }
                            assignEvents(calenderData);
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
            allDaySlot: true
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

            var $scope = angular.element($("#calendar")).scope();
            var param = {};
            param.action = 1;
            param.formId = CalendarFormId;

            param.isCalender = 1;
            param.isEvent = 1;

            param.resourceFormId = ySelection;
            param.ActivityFormId = xSelection;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#agenda-view div.calendar').fullCalendar('getView');
            param.filter = {};
            start = $('#agenda-view div.calendar').fullCalendar('getDate');
            param.filter = changeStateOfCalender(view, start, end);
            param.filter.field = "start";
            param.COMPANY_CODE = COMPANY_CODE;
            param.IsCustomFilter = IsCustomFilter;
            param.IsCustomInFilter = IsCustomInFilter;
            param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
            param.IsPublicUser = true;
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
        if (formDetailsDataInfo != null)
            if (formDetailsDataInfo.calenderSettingsList != null)
                if (formDetailsDataInfo.calenderSettingsList.length > 0) {
                    var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
                    if (exists != undefined) {
                        if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                            var minTime = exists.minTime.trim().replace(' ', ':');
                            var maxTime = exists.maxTime.trim().replace(' ', ':');

                            if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                                minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                            }

                            if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                                maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
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
            if (!checkUserRoleRights()) {
                swal({
                    title: 'Form Entry',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }
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
            left: 'myCustomButton prev,next today',
            center: 'title',
            right: 'timelineDay,timelineMonth'
        },
        customButtons: {
            myCustomButton: {
                text: "Export To Excel",
                click: function () {
                    alert('Export To Excel')
                    var resourceFormId = window["ySelected"];
                    var formId = CalendarFormId;
                    var userId = userDetail.Id;
                    var typeView = 0;
                    var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
                    if (current_subtab.contains('fc-timelineMonth-button'))
                        typeView = 1;
                    else if (current_subtab.contains('fc-timelineYear-button'))
                        typeView = 2;
                    var dates = GetCalendarDateRange();
                    var currentDate = moment(dates.start).format("YYYY-MM-DD");
                    var newpath = $scope.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
                    window.location.href = $scope.EndPointUrl + '/downloadCalenderExcel?formId=' + formId + '&resourceFormId=' + resourceFormId + '&userId=' + userId + '&typeView=' + typeView + '&currentDate=' + currentDate + '';
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
            param.IsCustomFilter = IsCustomFilter;
            param.IsCustomInFilter = IsCustomInFilter;
            param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
            param.IsPublicUser = true;
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
        selectable: false,
        select: function (startDate, endDate, jsEvent, view, resource) {





        }
    };
    countLoader = 0;
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


                            if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                                minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                            }

                            if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                                maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
                            }

                            //$('#timeline-resource-view div.calendar').fullCalendar('option', 'minTime', minTime + ":00");
                            //$('#timeline-resource-view div.calendar').fullCalendar('option', 'maxTime', maxTime + ":00");
                        }
                    }
                }
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
    /// vertical resource view.

    var myOptions2 = {
        //defaultDate: '2017-12-07',
        scrollTime: '00:00', // undo default 6am scrollTime    
        header: {
            left: 'myCustomButton prev,next today',
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
            param.IsCustomFilter = IsCustomFilter;
            param.IsCustomInFilter = IsCustomInFilter;
            param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
            param.IsPublicUser = true;
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
        select: function (startDate, endDate, jsEvent, view, resource) {





        }
    };
    if (formDetailsDataInfo.calenderSettingsList?.length > 0) {
        var exists = _.findWhere(formDetailsDataInfo.calenderSettingsList, { resourceForm: ySelection });
        if (exists != undefined) {
            if (exists.minTime != "" && exists.minTime != null && exists.minTime != undefined && exists.maxTime != null && exists.maxTime != undefined && exists.maxTime != "") {
                var minTime = exists.minTime.trim().replace(' ', ':');
                var maxTime = exists.maxTime.trim().replace(' ', ':');


                if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                    minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                }

                if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                    maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
                }

                //myOptions2.minTime = minTime + ":00";
               // myOptions2.maxTime = maxTime + ":00";
            }
        }
    }
    countLoader = 0;
    calendarOptions = $.extend({}, defaultOptions, resourceOptions, myOptions2);
    $('#vertical-resource-view div.calendar').fullCalendar(calendarOptions);
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

        if (param.parentID != param.formId) {

            if (!DataService.isEmpty($scope.eventDataWithoutGroupBy)) {
                if ($scope.eventDataWithoutGroupBy.length > 0) {
                    $("#tabuList").empty();
                    $("#newtabuList").empty();
                    $("#tabuList").append('<strong id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + ' ' + $scope.otherformDetails.title + ' in this Slot</strong>');
                    $("#newtabuList").append('<strong id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + ' ' + $scope.otherformDetails.title + ' in this Slot</strong>');
                }
                else {
                    $("#tabuList").empty();
                    $("#newtabuList").empty();
                    if (!DataService.isEmpty($scope.otherformDetails)) {
                        if (!DataService.isEmpty($scope.otherformDetails.title)) {
                            $("#tabuList").append('<strong id="strongFormName"> 0 ' + $scope.otherformDetails.title + ' in this Slot </strong>');
                            $("#newtabuList").append('<strong id="strongFormName"> 0 ' + $scope.otherformDetails.title + ' in this Slot </strong>');
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
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "MarketPlace/GetCalendarDetails/" + id,
            contentType: "application/json",
            success: function (response) {
                hideLoader();
                resolve(response);
            }
        });

    });

}


async function rendarPopupCalendar(assignDate) {
    var customEventDetailsServiceModelPopUp = angular.element("#customEventDetailsServiceModelPopUp");
    var defaultOptions2 = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        theme: true,
        themeSystem: 'jquery-ui',
        //  themeSystem:'bootstrap4',
        nowIndicator: true,
        slotDuration: '00:15:00',
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
                formGroupKey: event.formGroupKey
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
                //var newLabelList = _.filter(_associatedFormIDsTemp, function (item) { return item != $scope.ySelection.toString() });
                listids = event.customFormIds.split(',');
                var currentId = 0;
                tempHtml = "";
                var agendaTempHtml = '<div class="fc-content" style="padding: 2px 1px;border-radius: 3px;background: #ddd;color: #000;" data-original-title="" title="">';
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
            element.append(_mainTempHtml)
            tableTempHtml = "<div class='event-detail div-flex'><div class='div-flex'>" + rowRecord + "</div><div class='btn-box'>" + actionRow + "</div><div class='div-flex div-list-bar'></div>" + tempHtmlTable + "</div>";
            let $fcContent = element.find(".fc-content").detach(),
                $resize = element.find(".fc-resizer").detach();
            element.attr('title', rowTooltipTitleDisplay + "  " + rowTooltipDisplay);
            element.attr('data-html', 'true');
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
            param.IsCustomFilter = IsCustomFilter;
            param.IsCustomInFilter = IsCustomInFilter;
            param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": COMPANY_CODE }];
            param.IsPublicUser = true;
            var postUrl = BASE_URL + "/FormAPI/getReferralFormFields";


            postAsync(postUrl, param).then(function (response) {

                var calenderData = changeResourceIDByYSelection((response.events != undefined) ? response.events : response.events);
                if (calenderData != undefined) {
                    if (formDetailsDataInfo.searchByDate != undefined) {
                        $('#vertical-resource-view div.calendar').fullCalendar('removeEvents');
                    }
                    calenderData.forEach(e => {
                        if (e.EVENT_TYPE && e.EVENT_TYPE.toUpperCase() == "SCHEDULE") {
                            e.rendering = "background";
                        }
                    });

                    callback(calenderData);
                }
                else
                    callback([]);
            });
        },
        selectable: true,
        select: function (start, end, cell) {
            $scope.BookingSession.start = start;
            $scope.BookingSession.end = end;

            var events = window["eventListTemp2"];

            var exist = events.filter(x => moment(start.format()).local() >= moment(x.start).local() && moment(end.format()).local() <= moment(x.end).local() && x.customTitle.split(',').length > 2);
            var existTeacher = events.filter(x => moment(start.format()).local() >= moment(x.start).local() && moment(end.format()).local() <= moment(x.end).local() && x.customTitle.split(',').length == 2);
            if (exist.length > 0) {
                alert('Not available slots!');
                return;
            }
            if (existTeacher.length == 0) {
                alert('Not available slots!');
                return;
            }
            if (!$scope.IsScreeningBooking) {
                var sessionList = $scope.SessionData.filter(x => x.PK_ID == $scope.BookingSession.PACKAGE_ID && x.PKS_STATUS != "Rejected");
                sessionList = sessionList.sort((a, b) => (a.PKS_SEQ_NUMBER > b.PKS_SEQ_NUMBER) ? 1 : ((b.PKS_SEQ_NUMBER > a.PKS_SEQ_NUMBER) ? -1 : 0));
                var currentSession = $scope.SessionData.find(x => x.PKS_ID == $scope.BookingSession.SESSION_ID);
                if (sessionList.find(x => x.PKS_SEQ_NUMBER > currentSession.PKS_SEQ_NUMBER && moment(x.CLR_START).local() <= moment(start.format()).local())) {

                    alert('please check session booking Sequnce');
                    return;
                }

                if (sessionList.find(x => x.PKS_SEQ_NUMBER < currentSession.PKS_SEQ_NUMBER && moment(x.CLR_START).local() >= moment(start.format()).local())) {
                    alert('please check session booking Sequnce');
                    return;
                }
            }
            $('#btnbook').click();

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


                if (calendarDetails.controlSheet.DISPLAY_START_TIME != "" && calendarDetails.controlSheet.DISPLAY_START_TIME != "null" && calendarDetails.controlSheet.DISPLAY_START_TIME != null) {
                    minTime = calendarDetails.controlSheet.DISPLAY_START_TIME;
                }

                if (calendarDetails.controlSheet.DISPLAY_END_TIME != "" && calendarDetails.controlSheet.DISPLAY_END_TIME != "null" && calendarDetails.controlSheet.DISPLAY_END_TIME != null) {
                    maxTime = calendarDetails.controlSheet.DISPLAY_END_TIME;
                }

                myOptions2.minTime = minTime + ":00";
                myOptions2.maxTime = maxTime + ":00";
            }
        }
    }
    var calendarOptions = $.extend({}, defaultOptions2, myOptions2);
    $('#agenda-view2 div.calendar').fullCalendar('destroy');
    setTimeout(function () {
        $('#agenda-view2 div.calendar').fullCalendar(calendarOptions);
    }, 500);

    $('#customEventDetailsServiceModelPopUp').on('shown.bs.modal', function () {
        //$("#agenda-view2 div.calendar").fullCalendar('render');
    });

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