(function () {
    'use strict';

    //records controller
    FormGeneratorApp.controller('CalenderRecordsController', function ($scope, $rootScope, $http, $location, $window, mainService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService) {

        var tabulatorChildren = {};
        var tabulator = '';
        $scope.init = function () {
            $scope.formDetailsDataTemp = {};
            $scope.formDetailsDataInfo = {};
            $scope.displayInTabData = {};
            $scope.dataArrayTemp = [];
            $scope.formGroupFilesList = [];
            $scope.formDetails = {};
            $scope.label = {};
            $scope.activityFormId = 0;
            $scope.formfieldsData = [];
            $scope.ResourcefieldsData = [];
            $scope.ActivityFieldsData = [];
            window["formGroupKeyList"] = null;

            bootbox.hideAll();
            var formId = $stateParams.formId;
            $scope.id = $stateParams.formId;
            $scope.currentFormId = $stateParams.formId;


            $scope.userDetail = mainService.loginDetails();
            window["EventBasicDetail"] = $scope.manageWindowParams();
            $scope.checkIfToggle();
            $timeout(function () {
                $scope.bindDraggable();
            }, 200);

            $timeout(function () {
                $scope.getFormDetails();
            }, 800);

            // $scope.toggle();


            $scope.formDataTabulatorTemp = {};
            $scope.formDataTabulatorTempWithoutGroupBy = {};


            $scope.calenderSettingsFormDetailsDataList = [];

        };


        $scope.getCalenderSettingsFormDetailsData = function () {
            var param = {};
            param.action = 4;
            param.formId = $scope.formDetailsDataInfo.formId;
            if (!DataService.isEmpty($scope.formDetailsDataInfo.isMultipleCalenderSettings))
                if ($scope.formDetailsDataInfo.isMultipleCalenderSettings) {
                    $rootScope.$emit("ShowLoading");
                    mainService.getCalenderSettingsFormData("getCalenderSettingsFormData", param)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                $scope.calenderSettingsFormDetailsDataList = response.data;
                                if ($scope.calenderSettingsFormDetailsDataList.length == 2)
                                    $scope.is2D = true;
                                $rootScope.$emit("HideLoading");
                            }
                            $rootScope.$emit("HideLoading");
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }
        };

        $scope.loadFormRoles = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.ManageFormRoles("ManageFormRoles", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 5) {
                            if (response.data.length > 0) {
                                var exists = response.data[0];

                                //console.log('roles are above');
                                //console.log(exists);
                                $rootScope.currentUserFormRole = exists.role;
                                $timeout(function () {
                                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();

                                }, 150);
                            }
                        }
                        //else
                        //    notifierService.notifyMessage('error', 'failed', exists.Message); 
                    }
                    $rootScope.$emit("HideLoading");

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.manageWindowParams = function () {
            var data = {};
            data.action = 1;
            data.formId = $stateParams.formId;
            data.formGroupKey = create_UUID();
            data.userId = $scope.userDetail.Id;
            data.created_by = $scope.userDetail.Id;
            data.update_by = $scope.userDetail.Id;
            data.formData = [];
            data.resourceData = [];
            data.resColumns = [];
            data.activityData = [];
            data.activityColumn = [];
            return data;

        }
        $scope.getFormDetails = function () {
            var param = {};
            param.action = 4;
            param.formId = $scope.id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)                            
                        // $rootScope.$emit("HideLoading"); 
                        //console.log('details are this: ');
                        var formDataTemp = response.data[0];
                        //console.log(formDataTemp);
                        $scope.formDetailsDataInfo = formDataTemp;
                        var paramRoles = {};
                        paramRoles.action = 5;
                        paramRoles.formId = $scope.formDetailsDataInfo.formId;
                        paramRoles.userId = $scope.userDetail.Id;
                        paramRoles.created_by = $scope.formDetailsDataInfo.created_by;
                        $scope.loadFormRoles(paramRoles);
                        $scope.getCalenderSettingsFormDetailsData();
                        $timeout(function () {
                            $scope.isAllowOwnUser = false;
                            $scope.isAllowOtherUser = false;
                            if (!DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity)) {
                                if (!Array.isArray($scope.formDetailsDataInfo.recordAccessSecurity))
                                    $scope.formDetailsDataInfo.recordAccessSecurity = JSON.parse($scope.formDetailsDataInfo.recordAccessSecurity);

                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.view === true) ||
                                    ($scope.formDetailsDataInfo.recordAccessSecurity.other.view === true)) {

                                    if ($scope.formDetailsDataInfo.recordAccessSecurity.own.view)
                                        $scope.isAllowOwnUser = true;
                                    if ($scope.formDetailsDataInfo.recordAccessSecurity.other.view)
                                        $scope.isAllowOtherUser = true;


                                }
                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.edit === true && $scope.formDetailsDataInfo.created_by === $scope.userDetail.Id) ||
                                    ($scope.formDetailsDataInfo.created_by != $scope.userDetail.Id && $scope.formDetailsDataInfo.recordAccessSecurity.other.edit === true
                                    )) {
                                    $scope.isAllowEdit = true;
                                }
                                else {
                                    $scope.isAllowEdit = false;
                                }
                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.delete === true && $scope.formDetailsDataInfo.created_by === $scope.userDetail.Id) ||
                                    ($scope.formDetailsDataInfo.created_by != $scope.userDetail.Id && $scope.formDetailsDataInfo.recordAccessSecurity.other.delete === true
                                    )) {
                                    $scope.isAllowDelete = true;
                                }
                                else {
                                    $scope.isAllowDelete = false;
                                }

                                if (!DataService.isEmpty($scope.formDetailsDataInfo.formSettings)) {
                                    if (!Array.isArray($scope.formDetailsDataInfo.formSettings))
                                        $scope.formDetailsDataInfo.formSettings = JSON.parse($scope.formDetailsDataInfo.formSettings);

                                }
                                else {
                                    $scope.formDetailsDataInfo.formSettings = { "tabulator": { "format": "columns", "theme": "tabulator.min.css" } };

                                }
                                var paramTemp = {};
                                //   if ($scope.formDetailsDataInfo.IsFilterCriteria) {
                                //   paramTemp.action = 9;
                                //    var query = "";
                                //if (!DataService.isEmpty($scope.formDetailsDataInfo.recordFilters)) {
                                //    var columListFilterCriteria = JSON.parse($scope.formDetailsDataInfo.recordFilters);
                                //    angular.forEach(columListFilterCriteria, function (item) {
                                //        var exists = _.findWhere($scope.filterFieldsList, { field: item.field });
                                //        if (!DataService.isEmpty(exists))
                                //            query += item.query + " And";
                                //    });
                                //    query = query.substring(0, query.length - 3);
                                //    if (!DataService.isEmpty(query))
                                //        paramTemp.formTableColumnData = query;
                                //    else
                                //        paramTemp.action = 2;
                                //}
                                //}
                                //else
                                paramTemp.action = 2;
                                if ($scope.isAllowOwnUser == true && $scope.isAllowOtherUser == false) {
                                    paramTemp.action = 10;
                                    paramTemp.UserId = $scope.userDetail.Id;
                                }
                                else if ($scope.isAllowOwnUser == false && $scope.isAllowOtherUser == true) {
                                    paramTemp.action = 11;
                                    paramTemp.UserId = $scope.userDetail.Id;
                                }
                                paramTemp.formId = $scope.currentFormId;
                            }


                        }, 150);
                        //console.log('$scope.formDetailsDataInfo');
                        //console.log($scope.formDetailsDataInfo);
                        $rootScope.$emit("HideLoading");

                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 12) % 12 | 0;
                dt = Math.floor(dt / 12);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(12);
            });
            return uuid;
        }
        $scope.exportAll = function (type) {
            var data = "";

            var fileNameDownload = angular.copy($scope.formDetailsDataInfo.title);
            fileNameDownload = fileNameDownload.split(" ").join("");
            var dataformatFile = moment(new Date());
            fileNameDownload = fileNameDownload + "_" + dataformatFile.format("DD_MM_YYYY") + "_" + dataformatFile.format("HH:MM:SS");
            switch (type) {
                case 1:

                    tabulator.download("json", fileNameDownload + ".json");
                    break;
                case 2:
                    tabulator.download("xlsx", fileNameDownload + ".xlsx", { sheetName: "sheet1" });
                    break;
                case 3:
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: "," });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "portrait", //set page orientation to portrait
                        title: $scope.formDetailsDataInfo.title //add title to report
                        //autoTable: { //advanced table styling
                        //    styles: {
                        //        fillColor: [100, 255, 255]
                        //    },
                        //    columnStyles: {
                        //        id: { fillColor: 255 }
                        //    },
                        //    margin: { top: 60 },
                        //},
                        //documentProcessing: function (doc) {
                        //    //carry out an action on the doc object
                        //}
                    });
                    break;
                case 5:
                    data = 1;
                    if ($scope.selectedDeletedRecordList.length == 1) {
                        var temp = $scope.selectedDeletedRecordList[0];
                        var path = mainService.getCurrentEndPointUrl() + "/downloadExcel?formId=" + (!DataService.isEmpty(temp.formId) ? temp.formId : temp.formID) + "&formgroupkey='" + (!DataService.isEmpty(temp.formgroupkey) ? temp.formgroupkey : temp.formGroupKey) + "'&id=" + temp.Id + "&uid=" + $scope.userDetail.uid + "";

                        var filename = $scope.formDetailsDataInfo.xlsFile;
                        if (!DataService.isEmpty(filename)) {
                            downloadFileFunc(filename, path);
                        } else {
                            notifierService.notifyMessage('error', 'Download Excel', 'Excel File doesnot exists!');
                        }

                    } else {
                        notifierService.notifyMessage('error', 'Download Excel', 'Select atleast one record only');
                    }

                    break;
                default:
                    data = "";
                    break;
            }
        };

        $scope.entryPage = function (formId, isEdit, formGroupKey, rowId) {
            var reference_form = "2196";
            var params = windowParams();
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            $scope.isEdit = isEdit;
            if ($scope.isEdit) {
                newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1', 'example', params, true);
            }
            else {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            }
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        var paramTemp = {};
                        paramTemp.action = 2;
                        paramTemp.formId = formId;
                        $scope.GetFormRecordListDynamimc(paramTemp);
                    }, 150);
                    // $scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
                    //alert('closed: ' + reference_form);
                    // tabulators["tabulator_1574079483837"].setData("http://192.168.1.141:91/form-generator/public/get-linked-records/" + reference_form + "/0");
                }
            }, 500);
        };

        var tabulator = {};

        function showFooter(type) {

            if (!DataService.isEmpty(type.column_calculation))
                return type.column_calculation;
            else
                return "";
        }

        function bindTColumnHeader(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {

                    var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multiple == true) {
                                finalArray.push({
                                    title: item.label, formatter: multilFiles, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {

                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.label, formatter: arrowImage, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: "input"
                                });
                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab))
                                finalArray.push({ title: item.label, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input" });
                            else {

                                $scope.displayInTabData = item;

                            }
                        }
                    }
                });
                isTabulator = _.findWhere(pageData, { type: "tabulator" });
            });
            finalArray.unshift({ title: "formId", visible: false });
            finalArray.unshift({ title: "Id", visible: false });
            finalArray.unshift({ title: "formGroupKey", visible: false });
            if (isEdit)
                finalArray.unshift({
                    title: "Edit", formatter: arrowEdit, headerSort: false, align: "center", cellClick: function (e, cell) {
                        $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                    }
                });
            if (isExpend && !DataService.isEmpty(isTabulator))
                finalArray.unshift({
                    title: " ", field: "subItems", formatter: arrowIcon, width: 35, headerSort: false, align: "center", cellClick: function (e, cell) {
                        var formGroupKey = cell.getRow().getData().formGroupKey;
                        if ($(cell.getElement()).is('.active')) {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                            $(cell.getElement()).removeClass('active');
                        } else {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                            $(cell.getElement()).addClass('active');

                            var table = tabulatorChildren[formGroupKey];
                            table.setData([]);
                        }
                        var columnData = $scope.formDataTabulatorTemp[formGroupKey];
                        var tabulatorDataFilter = {};
                        if (angular.isDefined(columnData))
                            tabulatorDataFilter = _.findWhere(columnData, { "fieldType": "tabulator" }).fieldDataText;
                        tabulatorDataFilter = JSON.parse(tabulatorDataFilter);
                        tabulatorChildren[formGroupKey].setColumns(bindTColumnHeader(tabulatorDataFilter, false, false));
                        //tabulatorChildren[formGroupKey].setData(bindTRowsData(tabulatorDataFilter));
                        var tabulatorGroup = $.cookie("form-" + formGroupKey);
                        if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                            tabulatorChildren[formGroupKey].setGroupBy(tabulatorGroup);
                            tabulatorChildren[formGroupKey].setSort(tabulatorGroup, "asc");
                        }
                    }
                });
            return finalArray;
        }
        //bind draggable activities
        $scope.bindDraggable = function () {
            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;
            var basicDetails = window["EventBasicDetail"];
            mainService.manageForm("ManageForm", param1)
                .then(function (response) {

                    var formdata = response.data.formDetails;

                    //console.log(formdata);
                    basicDetails.formData = formdata[0];   // calender  form Data
                    window["EventBasicDetail"] = basicDetails;
                    $scope.ResourcefieldsData = response.data.resourceFields;  //all resource fields
                    $scope.ActivityFieldsData = response.data.activityFields;  // all activity fields 
                    //console.log($scope.ResourcefieldsData);
                    if (formdata != null && angular.isDefined(formdata)) {
                        $scope.formfieldsData = response.data.formFieldsData;

                        if (formdata.length > 0) {
                            var param = {};
                            param.action = 1;
                            param.formId = formdata[0].activitiesForm;
                            param.isActivityDraggable = 1;

                            $scope.activityFormId = formdata[0].activitiesForm;
                            if (formdata[0].colorField != 'no color')
                                param.fieldName = formdata[0].activities + "," + formdata[0].colorField;
                            else
                                param.fieldName = formdata[0].activities

                            if (formdata[0].durationField != 'no duration' && formdata[0].durationField != '')
                                param.fieldName += ',' + formdata[0].durationField;

                            $scope.label.fieldLabel = formdata[0].fieldLabel;

                            //console.log(formdata[0]);
                            //console.log('fields');
                            //console.log(formdata[0].activities + "," + formdata[0].colorField);
                            if ((formdata[0].activitiesForm != 0 && formdata[0].activitiesForm != null) && (formdata[0].activities != '' && formdata[0].activities != null)) {

                                mainService.getReferralFormFields("getReferralFormFields", param)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            //console.log('entries are');
                                            //console.log(response.data)
                                            if (response.data.length > 0) {

                                                $scope.formDetails = response.data;
                                                $scope.formDetails = _.without($scope.formDetails, _.findWhere($scope.formDetails, { value: "0" }));

                                                //console.log('draggeble data');
                                                //console.log($scope.formDetails);

                                                $timeout(function () {
                                                    $('.external-events-list .fc-event').each(function () {

                                                        $(this).data('event', {

                                                            title: $.trim($(this).text()), // use the element's text as the event title
                                                            color: $.trim($(this).data('color')),
                                                            duration: $.trim($(this).data('duration')),
                                                            stick: false, // maintain when user navigates (see docs on the renderEvent method)
                                                            id: $.trim($(this).data('id')),
                                                        });




                                                        $(this).draggable({
                                                            zIndex: 999,
                                                            revert: true,      // will cause the event to go back to its
                                                            containment: ".table-responsive", scroll: true,
                                                            revertDuration: 0,  //  original position after the drag
                                                            stop: function () {
                                                                //console.log($(this));
                                                                // is the "remove after drop" checkbox checked?
                                                                if ($('#drop-remove').is(':checked')) {
                                                                    // if so, remove the element from the "Draggable Events" list
                                                                    $(this).remove();
                                                                }
                                                            }
                                                        });

                                                    })
                                                }, 250);



                                            }




                                        }
                                    });
                            }



                            $timeout(function () {
                                $scope.getCalenderRecords();
                            }, 150);
                        }

                    }
                });











        }
        $scope.checkIfToggle = function () {
            //var toggleStatus = CookiesPersistenceService.getCookieData("Calender-Toggle");
            //if (angular.isDefined(toggleStatus)) {
            //    if (toggleStatus == 1) {
            //        $state.go('calenderToggle', { formId: $scope.id, toggle: 'calenderToggle' });

            //    }
            //}
        }
        $scope.toggle = function () {
            //var param = {};
            //param.action = 24;
            //param.formID = $scope.id;
            //mainService.calenderToggle("ManageForm", param)
            //    .then(function (response) {
            //        console.log('toggle details are this');
            //        console.log(response.data);
            //    });
            //var records = $scope.getCalenderRecords($scope.id);

            // var CalenderRecords = window["CalendarEventList"];
            //CookiesPersistenceService.setCookieWithExpiry("Calender-Toggle", 1);
            //$state.go('calenderToggle', { formId: $scope.id, toggle: 'calenderToggle' });

            $state.go('CalenderRecords', { formId: $stateParams.formId });


            //var toggleData = {};
            //angular.forEach(CalenderRecords, function (value, key) {
            //    var rowData = value;
            //    angular.forEach(rowData, function (value1, key1) {

            //    });
            //}); 
            //console.log(CalenderRecords);

        }
        //$scope.setActiveView = function () {
        //    var activeView = CookiesPersistenceService.getCookieData("calendar - activeView");


        //}
        $scope.filterInputControls = function (formFieldsList) {
            var columnString = '';
            if (formFieldsList.length > 0) {

                for (var i = 0; i < formFieldsList.length; i++) {
                    var temp = JSON.parse(formFieldsList[i].fieldValidationRule);

                    if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map" && temp.type != "hidden") {
                        // allInputControls.push({ Type: formFieldsList[i].fieldName })
                        if (angular.equals(columnString, ''))
                            columnString = formFieldsList[i].fieldName;
                        else
                            columnString += ',' + formFieldsList[i].fieldName;
                    }

                }
            }
            return columnString;
        }

        //get all events (calender records based on calender's  formID)
        $scope.getCalenderRecords = function (formId) {
            var data = $scope.formfieldsData;
            var ResourceInputFields = $scope.filterInputControls($scope.ResourcefieldsData); // comma seperated resource fields
            var ActivityInputFields = $scope.filterInputControls($scope.ActivityFieldsData); // comma seperated Activity fields
            if (data != null && angular.isDefined(data)) {
                //console.log(' calender all columns :'); console.log(data);
                if (data.length > 0) {

                    var fields = '';  // filtered input columns for calender
                    for (var count = 0; count < data.length; count++) {

                        var column = '';// alert(response.data[count].fieldName);
                        if (data[count].fieldName == "title") { column = data[count].fieldName }
                        if (data[count].fieldName == "start") { column = data[count].fieldName }
                        if (data[count].fieldName == "end") { column = data[count].fieldName }
                        if (data[count].fieldName == "service") { column = data[count].fieldName }
                        if (data[count].fieldName == "color") { column = data[count].fieldName }
                        if (data[count].fieldName == "allDay") { column = data[count].fieldName }
                        if (data[count].fieldName == "description") { column = data[count].fieldName }

                        if (data[count].fieldName == "resources") { column = data[count].fieldName }
                        if (data[count].fieldName == "activities") { column = data[count].fieldName }
                        if (data[count].fieldSubtype == "file") { column = data[count].fieldName }
                        if (fields.length == 0 && column.length > 0) {// if 
                            if (column == 'end') {
                                column = "[" + column + "]";
                            }
                            fields = column
                        }
                        else {

                            if (column.length > 0) {
                                if (column == 'end') {
                                    column = "[" + column + "]";
                                }
                                fields = fields + "," + column
                            }
                        }

                    }

                    //console.log(fields);   // all selected columns.
                    var basicdetails = window["EventBasicDetail"];
                    //console.log('basic details ');
                    //console.log(basicdetails.formData.resourceForm);

                    var param = {};
                    param.action = 1;
                    param.formId = $stateParams.formId;   // calender formID
                    param.fieldName = fields; // selected field's (columns).
                    param.ResourceFields = ResourceInputFields;
                    param.ActivityFields = ActivityInputFields;

                    param.isCalender = 1;
                    param.isEvent = 1;
                    param.resourceFormId = basicdetails.formData.resourceForm;
                    param.ActivityFormId = basicdetails.formData.activitiesForm;
                    param.resEntryColumn = basicdetails.formData.minorGroup;
                    param.activityEntryColumn = basicdetails.formData.activities;
                    $timeout(function () {
                        mainService.getReferralFormFields("getReferralFormFields", param)// getting all records for calender with specific  columns   are (param.fieldName). (based on formID)
                            .then(function (response) {
                                var eventData = response.data.events;
                                var resourceData = response.data.resourceDetails;
                                var activityData = response.data.activityDetails;
                                var activityEvents = response.data.activityEvents;

                                //console.log('event Data '); //console.log(eventData);
                                if (eventData != null && angular.isDefined(eventData)) {

                                    if (eventData.length > 0) {
                                        //console.log('#calenderData ( All calender records ): ');
                                        //console.log(eventData);

                                        eventData = _.without(eventData, _.findWhere(eventData, { value: "0" })); // removing '--select--'.
                                        resourceData = _.without(resourceData, _.findWhere(resourceData, { value: "0" })); // resource data 
                                        activityData = _.without(activityData, _.findWhere(activityData, { value: "0" })); // resource data 
                                        activityEvents = _.without(activityEvents, _.findWhere(activityEvents, { value: "0" })); // resource data 

                                        window["CalendarEventList"] = eventData;// setting window variable with all calender records as 'event list '.
                                        window["ActivityEventList"] = activityEvents;
                                        var resourceColumns = $scope.getResourceColumns(resourceData, ResourceInputFields, 'resource');
                                        var resourceFormData = $scope.arrangeData(resourceData, resourceColumns, 'resource');

                                        var activityColumns = $scope.getResourceColumns(activityData, ActivityInputFields, 'activity');
                                        var activityFormData = $scope.arrangeData(activityData, activityColumns, 'activity');


                                        basicdetails.resourceData = resourceFormData;
                                        basicdetails.resColumns = resourceColumns;
                                        basicdetails.activityData = activityFormData;
                                        basicdetails.activityColumn = activityColumns;
                                        console.log('loadCalendar1')
                                        window["EventBasicDetail"] = basicdetails;
                                        loadCalendar('BasicView', eventData, resourceFormData, resourceColumns, activityFormData, activityColumns, activityEvents);// loading calender .
                                        //  loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                                    }




                                }
                            });
                    }, 200);
                }

            }
        }

        $scope.getResourceColumns = function (data, inputfields, reqType) {

            var resourceColumns = [];
            var ResourceInputFields = [];
            var fields = inputfields.split(',');
            var basicDetails = window["EventBasicDetail"];
            //console.log('basic details are ');
            //console.log(basicDetails);
            var groupingColumn = '';
            if (reqType == "resource") {
                groupingColumn = basicDetails.formData.majorGroup;
                ResourceInputFields = $scope.ResourcefieldsData;
            }
            else if (reqType == "activity") {
                groupingColumn = basicDetails.formData.activities;
                ResourceInputFields = $scope.ActivityFieldsData;
            }



            for (var count = 0; count < fields.length; count++) {
                //console.log('outer val' + fields[count]);

                for (var innerCount = 0; innerCount < ResourceInputFields.length; innerCount++) {

                    var temp = ResourceInputFields[innerCount];
                    //console.log('inner val' + temp);

                    if (fields[count] == temp.fieldName) {
                        var row = {};
                        if (angular.equals(temp.fieldName, "Id")) {
                            temp.fieldName = "id";

                        }
                        if (temp.fieldName == basicDetails.formData.majorGroup) {


                            // if majorGroupColumn Found.
                            row = {
                                "labelText": temp.fieldLabel.replace(" ", ""),
                                "field": temp.fieldName,
                                "group": true

                            };
                        }
                        else {

                            row = {
                                "labelText": temp.fieldLabel.replace(" ", ""),
                                "field": temp.fieldName,

                            };
                        }
                        resourceColumns.push(row);
                        break;
                    }


                }



            }
            //console.log(resourceColumns);
            return resourceColumns;
        }

        $scope.arrangeData = function (data, resourceColumns, reqType) {

            var resourceData = [];
            var basicDetails = window["EventBasicDetail"];
            var columnTitle = '';
            if (reqType == "resource")
                columnTitle = basicDetails.formData.minorGroup;
            else if (reqType == "activity")
                columnTitle = basicDetails.formData.activities;
            if (angular.isDefined(data)) {
                for (var count = 0; count < data.length; count++) {
                    var row = {};
                    var resColumns1 = [];
                    if (reqType == "resource")
                        resColumns1 = data[count].resColumns;
                    else
                        resColumns1 = data[count].actColumns;
                    if (angular.isDefined(resColumns1) && resColumns1 != null) {
                        for (var innerLoop = 0; innerLoop < resColumns1.length; innerLoop++) {
                            var columnName = resColumns1[innerLoop].columnName;
                            if (angular.equals(columnName, "Id"))
                                columnName = "id";

                            if (resColumns1[innerLoop].columnName == columnTitle) {
                                row.title = resColumns1[innerLoop].columnValue;
                                row[columnName] = resColumns1[innerLoop].columnValue;
                            }
                            else {
                                row[columnName] = resColumns1[innerLoop].columnValue;

                            }
                        }
                        var row1 = row;
                        resourceData.push(row1);
                    }
                }
            }
            return resourceData;
        }

        $scope.openTabulator = function () {

            if ($scope.activityFormId != 0)
                $state.go('records', { formId: $scope.activityFormId });

        }

        $scope.editFormRedirect = function () {

            $state.go('formEdit', { formId: $stateParams.formId });
        }
        $scope.selectedTabFilter = function (filterValue, selectedId) {
            $rootScope.$emit("ShowLoading");
            var filterData = angular.copy($scope.formDetailsDataTemp);
            var groupBy = _.groupBy(filterData, "formGroupKey");
            $('#page-tabs li').removeClass('ui-tabs-active ui-state-active');
            $("#tab-" + selectedId).addClass('ui-tabs-active ui-state-active');
            //if (DataService.isEmpty(filterValue.isDefault)) {

            //    //var vvvv = _.flatten( _.values(groupBy));
            //    var filterDataNew = _.filter(filterData, function (item, key) {
            //        var valueData = (!DataService.isEmpty(item.fieldDataText)) ? item.fieldDataText.replace('\"', '\'') : item.fieldDataText;
            //        return valueData == filterValue.value;
            //    });
            //    filterDataNew = _.uniq(filterDataNew, "formGroupKey");
            //    var filterGroupByData = [];
            //    angular.forEach(filterDataNew, function (item) {

            //        var temp = _.filter(groupBy, function (itemData, key) {
            //            return key == item.formGroupKey;
            //        });
            //        filterGroupByData.push(_.flatten(temp));
            //    });
            //    filterGroupByData = _.groupBy(_.flatten(filterGroupByData), "formGroupKey");
            //    tabulator.setData(bindTRowsData(filterGroupByData));
            //} else {
            //    tabulator.setData(bindTRowsData(groupBy));
            //}
            var temp = [];
            var filterDataNew = _.filter(filterData, function (item, key) {
                var filterNest = _.filter(item, function (itemNest, keyNest) {
                    if (angular.isDefined(itemNest) && $scope.displayInTabData.name == keyNest)
                        return itemNest.toString() == filterValue.value;
                });
                if (!DataService.isEmpty(filterNest))
                    temp.push(item)
            });
            tabulator.setData(temp);
            $rootScope.$emit("HideLoading");
        }


        function bindTabulatorColumnsHeader(formDetails, tabularId, formId) {
            $timeout(function () {

                tabulator.setColumns(bindTColumnHeader(formDetails, true, true));
                // var param = {};
                // param.action = 1;
                //$scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
            }, 250);
        }

        function bindTRowsData(groupByData) {
            var dataArray = [];
            angular.forEach(groupByData, function (item, grp) {
                var list = '';
                list += '{"';
                angular.forEach(item, function (itemData, key) {
                    //console.log(itemData)
                    var valueData = itemData.fieldDataText;
                    valueData = (!DataService.isEmpty(itemData.fieldDataText)) ? itemData.fieldDataText.replace('\"', '\'') : itemData.fieldDataText;
                    if (angular.isDefined(itemData.fieldType))
                        if (itemData.fieldType != "tabulator") {
                            if (itemData.fieldType == "file") {
                                if (!DataService.isEmpty(itemData.fieldDataMultimedia))
                                    list += '' + itemData.fieldType + '":"' + itemData.fieldDataMultimedia + '","';
                                else
                                    list += '' + itemData.fieldType + '":"' + itemData.fieldDataText + '","';
                                list += '' + itemData.fieldName + '":"' + itemData.fieldDataText + '","';
                            }
                            else {
                                if (itemData.fieldType != "header")
                                    list += '' + itemData.fieldName + '":"' + valueData + '","';
                            }
                        }
                });
                list += 'formGroupKey":"' + grp + '"';
                //list = list.substring(0, list.length - 2);
                list += "}";
                var parseData = JSON.parse(list);
                //angular.forEach(parseData, function (itemdata) {
                //    if (isNumeric(itemdata))
                //        itemdata = parseInt(itemdata);
                //})
                dataArray.push(parseData);
            });



            return dataArray;
        }
        function isNumeric(num) {
            return !isNaN(num)
        }

        $scope.loadEntryDataIntoTabulatorOnetoMany = function (paramData, formId) {
            $scope.formDataForOneParam = {}
            $scope.formDataForOneParam = paramData;
            $scope.formDataForOneParam.formId = formId;
            $scope.formDataForOneParam.created_by = $scope.userDetail.Id;
            $scope.formDataForOneParam.update_by = $scope.userDetail.Id;
            mainService.formDataForOne("FormDataForOne", $scope.formDataForOneParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if ($scope.formDataForOneParam.action == 1) {
                            var rowDataTabulator = [];
                            $scope.formDataTabulatorTempWithoutGroupBy = response.data;
                            var groupBy = response.data;
                            groupBy = _.groupBy(groupBy, "formGroupKey");
                            $scope.formDataTabulatorTemp = angular.copy(groupBy);
                            //console.log(groupBy);
                            //list = list.substring(0, list.length - 1);
                            //var formData = JSON.stringify(dataArray);
                            //formData = JSON.parse(formData);
                            ////console.log(formData);                   
                            //tabulator.setData(bindTRowsData(groupBy));

                            var ddd = tabulator;
                            //console.log(ddd);
                            if (!DataService.isEmpty($scope.displayInTabData.Referral_Forms)) {
                                $timeout(function () {
                                    var param = {};
                                    param.action = 1;
                                    param.formId = $scope.displayInTabData.Referral_Forms;
                                    param.fieldName = $scope.displayInTabData.Referral_Form_Fields;
                                    mainService.getReferralFormFields("getReferralFormFields", param)
                                        .then(function (response) {
                                            //console.log(response);
                                            $scope.tabList = response.data;
                                            $scope.tabList = _.without($scope.tabList, _.findWhere($scope.tabList, { value: "0" }));
                                            //$scope.tabList.unshift({
                                            //    "label": "All", "value": "All","isDefault":true
                                            //});
                                            $timeout(function () {
                                                if ($("#page-tabs").length) {
                                                    $("#page-tabs").tabs({
                                                        create: function (event, ui) {

                                                        },
                                                        activate: function (event, ui) {

                                                        }
                                                    });
                                                    $("#tab-0").addClass('ui-tabs-active ui-state-active');
                                                }
                                            }, 150);
                                        }, function (err) {
                                            $rootScope.$emit("HideLoading");
                                            console.log("some error occured." + err);
                                        });
                                }, 450);
                            }

                        }
                        else if ($scope.formDataForOneParam.action == 3) {
                            var exists = _.findWhere(response.data, { res: 1 });
                            if (angular.isDefined(exists)) {
                                notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                            } else {
                                exists = _.findWhere(response.data, { res: -1 });
                                notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                            }
                            // var param = {};
                            // param.action = 1;
                            // $scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.init();

        function getAllFiles(formGroupKey, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param.action = 4;
            param.formGroupKey = formGroupKey;
            mainService.formDataForOne("FormDataForOne", param)
                .then(function (response) {
                    // console.log('run')
                    //console.log(response.data)
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.formGroupFilesList = response.data;
                        var newObj = response.data;
                        newObj = _.findWhere(newObj, { fieldName: fieldNameParam });
                        if (newObj.fieldType == 'file' && newObj.fieldDataMultimedia != null) {
                            var images = newObj.fieldDataMultimedia;
                            images = images.split(',');
                            //   console.log(images)
                            var newHtml = '';
                            $.each(images, function (i, val) {
                                //console.log(val)
                                var ext = val.substr(val.lastIndexOf('.') + 1);
                                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                                    newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>';
                                } else if (ext == "xls" || ext == "xlsx") {
                                    var nameddd = val.substring(val.lastIndexOf('/') + 1);
                                    newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>";
                                } else {
                                    var nameddd = val.substring(val.lastIndexOf('/') + 1);
                                    newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>";
                                }
                            });
                            $('#galleryModal .modal-body').html(newHtml);
                        } else {
                            $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
                        }
                        //$rootScope.$emit("HideLoading");
                        //$.each(newObj, function (key, value) {
                        //    if (value.fieldType == 'file' && value.fieldDataMultimedia != null) {
                        //    //    console.log(value.fieldDataMultimedia)
                        //        var images = value.fieldDataMultimedia;
                        //        images = images.split(',');
                        //     //   console.log(images)
                        //        var newHtml = '';
                        //        $.each(images, function (i, val) {
                        //            console.log(val)
                        //            newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image" src="' + val + '" alt="" height="150"> </a>';
                        //        });
                        //        $('#galleryModal .modal-body').html(newHtml);
                        //    }
                        //})
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        function getAllFiles1(formData, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param = formData;
            var images = param;
            if (!DataService.isEmpty(images)) {
                images = images.split(',');
                //   console.log(images)
                var newHtml = '';
                $.each(images, function (i, val) {
                    //console.log(val)
                    val = val.replace('~', '');
                    var ext = val.substr(val.lastIndexOf('.') + 1);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>';
                    } else if (ext == "xls" || ext == "xlsx") {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>";
                    } else {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>";
                    }
                });
                $('#galleryModal .modal-body').html(newHtml);
            } else {
                $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
            }

        }

        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            dataParam.name = $scope.userDetail.name;
            dataParam.userId = $scope.userDetail.Id;
            dataParam.topicId = $scope.formDetailsDataInfo.topicId;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {
                                notifierService.notifyMessage('success', 'FormRecord', exists.Message);
                                angular.forEach(window["formGroupKeyList"], function (item) {
                                    var idx = _.findIndex($scope.formDetailsDataTemp, { Id: item });
                                    $scope.formDetailsDataTemp.splice(idx, 1);
                                });
                                $timeout(function () {
                                    //tabulator.setData($scope.formDetailsDataTemp);
                                    bindtabulatorOnly($scope.formDetailsDataInfo.formSettings.tabulator.format, $scope.formDetailsDataTemp)
                                    //  bindtabulatorOnly($scope.formDetailsDataInfo.formSettings.tabulator.format);
                                }, 150);

                                //window["formGroupKeyList"] = null;
                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $("button#entry-form-action").on("click", function (e) {
            e.preventDefault();
            console.log('id=' + $stateParams.formId);
            $state.go('saveFormEntryData', { 'formId': $stateParams.formId });
        });





    });
}(FormGeneratorApp));