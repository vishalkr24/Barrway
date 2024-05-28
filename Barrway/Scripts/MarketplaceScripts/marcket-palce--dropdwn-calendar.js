function calendarDropDwnEvent() {
    $('.calendar-service').change(async function () {
        $('.calendar-service').val($(this).val());
        if ($(this).val() != '') {
            var searchSrevice = $('.calendar-service option:selected').first().text();
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

    //$('.calendar-service-Location').change(async function () {
    //    $('.calendar-service-Location').val($(this).val());
    //    $("#list-view div.calendar").fullCalendar('refetchEvents');
    //    $("#timeline-resource-view div.calendar").fullCalendar('refetchEvents');
    //    $("#agenda-view div.calendar").fullCalendar('refetchEvents');
    //});

    $('.calendar-service-Location').change(async function () {
        $('.calendar-service-Location').val($(this).val());
        if ($(this).val() != '') {
            var searchSrevice = $('.calendar-service-Location option:selected').first().text();
            var param = { "action": 29, "formTableColumnData": `   (   (   LOCATION_MASTER_1936.LOCATION_ADDRESS like N'${searchSrevice}'    )        )   `, "formTableColumnName": "    left join LOCATION_MASTER_1936 on LOCATION_MASTER_1936.formId=f1.referrenceFormId and LOCATION_MASTER_1936.Id=f1.referrenceId  ", "formId": 2305, "FormTableName": "CALENDAR_FORM_1935", "created_by": 30314, "update_by": 30314 }
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

    $('.calendar-service-Provider').change(async function () {
        $('.calendar-service-Provider').val($(this).val());
        if ($(this).val() != '') {
            var searchSrevice = $('.calendar-service-Provider option:selected').first().attr('data-filter');
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
}



function getServiceProviderData(calenderSettings) {
    Service_ProviderList = calenderSettings.find(x => x.resourceForm == 2304).formDataList;;
    var serviceProvider = $(".calendar-service-Provider").empty();
    serviceProvider.append($('<option>', {
        value: "",
        text: "All service provider"
    }));
    if (Service_ProviderList.length > 0) {
        $(".div-calendar-service-Provider").show();
    }
    $.each(Service_ProviderList, function (index, item) {
        serviceProvider.append($('<option>', {
            value: item.id,
            text: item.FIRST_NAME + " " + item.LAST_NAME
        }).attr('data-filter', item.FIRST_NAME));
    });
}

function getLocationMaster(calenderSettings) {
    Service_Location_List = calenderSettings.find(x => x.resourceForm == 2306).formDataList;;
    Service_Location_List = _.sortBy(Service_Location_List, "SEQ");
    if (Service_Location_List.length > 0) {
        $(".div-calendar-service-Location").show();
    }
    var Location = $(".calendar-service-Location").empty();
    Location.append($('<option>', {
        value: "",
        text: "All location"
    }));
    $.each(Service_Location_List, function (index, item) {
        Location.append($(`<option value="${item.id}">${item.LOCATION_ADDRESS}</option>`));
    });
}

function getServiceMaster(activityConfig) {
    activityResults = activityConfig.formDataList;
    var serviceSelect = $('.calendar-service');
    serviceSelect.empty();
    serviceSelect.append($('<option>', {
        value: "",
        text: "All service"
    }));
    if (activityResults.length > 0) {
        $(".div-calendar-service").show();
    }

    $.each(activityResults, function (index, item) {
        serviceSelect.append($('<option>', {
            value: item.id,
            text: item[activityConfig.activities]
        }));
    });
}


function showCalendar(companyCode, ele) {
    $('.calendar-selector').val($(ele).val());
    var calendarId = $(".calendar-selector option:selected").val();
    window.location.replace("/Company/Calander/" + companyCode + "/" + calendarId);
}