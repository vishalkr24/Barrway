(function () {
    'use strict';

    //create form
    FormGeneratorApp.controller('FormGeneratorController', function ($scope, $ngBootbox, $interpolate, $rootScope, $http, $location, $window, $state, $timeout, mainService, DataService, notifierService, $stateParams, $filter, translationService) {
       
        var $tabs = '';
        var $fbPages = '';
        $scope.init = function () {
            $scope.isTimeRangeUsage = false;
            $scope.userDetail = mainService.loginDetails();
            $scope.AddClass($stateParams.tab);
            $rootScope.IND_loading = false;
            bootbox.hideAll();

            $scope.applicationFormList = {};
            $scope.applicationFormList.formFieldsList = {};
            $scope.importFormSettings = {};
            $scope.importFormSettings.maxRecord = 10000;
            $scope.importFormSettings.max_records = 1000000;
            $scope.importFormSettings.status = "2"
            $scope.importFormSettings.formType = "0"
            $scope.importFormSettings.scheduler_referrence_formId = 0;
            $scope.IsFreePlan = 1;

            $scope.importFormSettings = { language: 1 };
            $scope.getLanguage();
            $scope.ApplyMultilingualText();


            $scope.sheetListData = [];
            $scope.fieldsTemp = [];
            $scope.groupList = [];
            $scope.formrole = '0';
            $scope.listData = {};
            $scope.ResourceForms = [];
            $scope.ActivityForms = [];
            $scope.formFields = {};

            $scope.majorGroupControls = [];
            $scope.minorGroupControls = [];
            $scope.activityField = [];
            $scope.basicCalendar = [];
            $scope.activityCategory = [];
            $scope.durationField = [];
            $scope.radioGroup = [];
            $scope.informationForms = [];
            $scope.subscriptionForms = [];
            $scope.fieldsList = "";
            $scope.informationSettings = {};
            $scope.informationSettings.showHideInfo = true;
            $scope.informationSettings.showHideSubscription = true;
            $scope.isFormCalender = false;
            $scope.fieldsListTemp = [];
            $scope.fieldsTypeData = [
                { type: "Type" },
                { required: "Required" },
                { label: "Label" },
                { description: "Help Text" },
                { placeholder: "Placeholder" },
                { access: "Access" },
                { role: "Role" },
                { value: "Value" },
                { values: "Options" },
                { subtype: "Sub Type" },
                { UserField: "User Type" },
                { types: "Types" },
                { multiple: "Multiple Files" },
                { toggle: "Toggle" },
                { inline: "Inline" },
                { other: "Enable Other" },
                { image: "Image" },
                { style: "Style" },
                { reference_form: "Reference To Form" },
                { size: "Size Of Tabulator" },
                { columns: "Columns" },
                { columnHeadings: "Column Headings" },
                { rowHeadings: "Row Headings" },
                { columnInputs: "Column Inputs" },
                // format settings
                { alignment: "Heading Alignment" },
                { justify: "Heading Justification" },
                { label_width: "Heading Width" },
                { width: "Field Width" },
                { column: "Column" },
                { column_width: "Column Width" },
                { background_color: "Background Color" },
                { border: "Border" },
                { border_top: "Border Top" },
                { border_right: "Border Right" },
                { border_bottom: "Border Bottom" },
                { border_left: "Border Left" },
                { border_width: "Border Radius" },
                // more settings
                { maxlength: "Max Length" },
                { Min_Value: "Min Value" },
                { Max_Value: "Max Value" },
                { set_default: "Default Value" },
                { min: "Minimum Value" },
                { max: "Maximum Value" },
                { step: "Step" },
                { rows: "Rows" },
                { number_decimal: "Number of decimals" },
                { Start_Value: "Increment Start Value" },
                { End_Value: "Increment End Value" },
                { Unique_Value: "Unique Value" },
                { Incremental: "Auto Incremental" },
                { column_format: "Display Format" },
                { column_calculation: "Column Calculation" },
                { table_calculation: "Table Calculation" },
                { table_calculation_columns: "Table Columns" },
                { update_operation: "Update Formula" },
                { progress_color: "Colour of progress bar" },
                { prefix: "Prefix" },
                { suffix: "Suffix" },
                { align: "Align" },
                { Lat_Value: "Latitude" },
                { Log_Value: "Longitude" },
                { addRows: "Add Rows" },
                // advanced settings
                { Hide_show: "Hide" },
                { Display_Only: "Display Only" },
                { Default_Value: "Derived from Form" },
                { Default_Value_Field: "Derived from Field" },
                { Update_Form_Field: "Update Master Field" },
                { Inline_Edit: "Allow inline editing" },
                { List_column1: "List Field Table Layout" },
                { List_column2: "List Field Page Layout" },
                { Referral_Forms: "Referral To Form" },
                { Referral_Form_Fields: "Referral To Field" },
                { default_values: "Pick Default Values" },
                { populate_fields: "Populate other fields" },
                { dependent_field_names: "Dependent field" },
                { multiple_records: "Multiple records" },
                { Display_tab: "Display In Tab" },
                { worksheet: "Worksheet" },
                { XCoordinate: "Worksheet Column" },
                { YCoordinate: "Worksheet Row" },
                { attributeType: "Worksheet Field Type" },
                { className: "Class" },
                { name: "Name" },
                { UserName: "User Name" },
                { table_calculate_column: "Calculate column" }
            ];
            $scope.getGroups();
            var param1 = {};
            $scope.formCreated = false;
            if ($stateParams.topicId != null) {
                param1.action = 15;
                param1.topicId = $stateParams.topicId;

                $scope.GetResourceForms(param1, 'topicId');
                if (!DataService.isEmpty($stateParams.popup)) {
                    if ($stateParams.popup != "0")
                        $scope.isFormCalender = true;
                }
            }
            else {
                param1.action = 17;
                param1.formId = $stateParams.formId;
                $scope.GetResourceForms(param1, 'formId');
                $scope.formCreated = true;
            }
            $scope.tab = $stateParams.tab;
            $scope.isEditForm = false;
            $scope.InformaitionForms();
            // $scope.SendLinkOnWhatsApp();
            $scope.topicId = $stateParams.topicId;
            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            window["bannerUploadUrl"] = $scope.currentUrl + "/uploadFile?uid=" + $scope.userDetail.uid + "&reqType='extra'&userId=" + $scope.userDetail.Id;
            window["bannerDeleteUrl"] = $scope.currentUrl + "/DeleteFile?uid=" + $scope.userDetail.uid + "&reqType='extra'&userId=" + $scope.userDetail.Id;
            window["controlUploadUrl"] = $scope.currentUrl + "/UploadControlFile?uid=" + $scope.userDetail.uid + "&reqType='extra'&userId=" + $scope.userDetail.Id;

            window["ASSET_URL"] = mainService.getBaseUrl();

            $rootScope.$emit("ShowLoading");
            //loadcssjsfile("assets/js/code/init-form-builder.js", "js", "form-builder");
            loadcssjsfile("newAssets/formbuilder/js/init-form-builder.js", "js", "form-builder");
            $scope.isCreateNew = false;
            $timeout(function () {
                $(".fb-editor").empty();
                $("body").removeClass("modal-open");
                if (angular.isDefined($scope.topicId)) {
                    $scope.isEditForm = false;
                    $scope.isCreateNew = true;
                    //$("#form_settingsModal").modal('show');
                    $timeout(function () {
                        $scope.formBind({}, 1);
                    }, 700);
                    var title = localStorage.getItem("formModel");
                    if (!DataService.isEmpty(title)) {
                        title = JSON.parse(title);
                        $scope.importFormSettings.title = title.formName;
                        $state.current.ncyBreadcrumb.label = "Create Form";
                        $state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
                        $rootScope.safeApply();
                    }
                }
                else if (angular.isDefined($stateParams.formId)) {
                    $scope.isEditForm = true;
                    $scope.getFormSettings($stateParams.formId);

                }
                else if (angular.isDefined($stateParams.edittopicId)) {
                    //$scope.isEditForm = true;
                    $scope.isEditTopic = true;
                    var formid = localStorage.getItem("editTopic");
                    if (!DataService.isEmpty(formid)) {
                        $scope.getFormSettings(formid);
                    }
                }

                $scope.getFormGroupDetails();
            }, 450);
            $scope.languageList = [];
            $scope.getLanguage();

            $scope.defualtresourceTemp = {
                Id: 0,
                resourceForm: "0",
                eventOverlap: "0",
                majorGroup: "",
                minorGroup: "",
                checked: false
            };

            $scope.defaultactivityTemp = {
                Id: 0,
                activitiesForm: "0",
                activitiesOverlap: "0",
                activities: "",
                activitiesCategory: "",
                durationField: "",
                overlapField: "",
                colorField: "",
                checked: false
            };
            /*Multiple Form Calender Settings*/

            $scope.setDefaultResource = "false";
            $scope.setDefaultActivity = "false";



            $scope.columnList = [];
            $scope.filerCriteriaFormDetails = {};
            $scope.filerCriteriaFormDetails.allowViewSummary = [];
            $scope.filerCriteriaFormDetails.allowChat = [];
            $scope.filerCriteriaFormDetails.allowNotification = [];
            $scope.filerCriteriaFormDetails.allowEmailNotification = [];
            $scope.filerCriteriaFormDetails.allowWhatsappNotification = [];
            //$scope.filerCriteriaFormDetails.notificationDetails = true;
            $scope.filerCriteriaFormDetails.notificationDetails = 'true';
            loadDefaultOwnOtherAccessRights();

            $scope.ResourceFormsFields = [];
            $scope.importFormSettings.otherformfield = [];
            $scope.importFormSettings.otherformid = 0;
            $scope.fontawesomeListNew = [];
            /*get font awesome json list from file*/
            $http.get('newAssets/fontawesomejson/font-awesome-4.7.0.json').then(function (response) {
                $scope.fontawesomeList = response.data;
                $scope.fontawesomeListNew = $scope.fontawesomeList.fontlist470;
                $timeout(function () {
                    $('#selectFormIcon').selectpicker();
                }, 150);
            });

        };
        function loadDefaultOwnOtherAccessRights() {
            $scope.filerCriteriaFormDetails.ownRoleAccess = [
                {
                    "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                },
                {
                    "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                },
                {
                    "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                }
            ];
            $scope.filerCriteriaFormDetails.otherRoleAccess =
                [
                    {
                        "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                    },
                    {
                        "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                    },
                    {
                        "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                    }
                ];
        }
        $scope.AddClass = function (tab) {
            if (tab == 1) {
                $scope.tabid = 'form-settings';
                //$scope.getGroups();
                $('.selectgroup').selectpicker({
                    liveSearch: true,
                    container: 'body'
                });
                $(".selectgroup ").selectpicker("refresh")
            }
            else {
                $scope.tabid = 'all_controls';
            }
        }
        function loadDefaultCalenderSettings() {

            $timeout(function () {
                if (DataService.isEmpty($scope.importFormSettings.calenderSettingsList)) {
                    $scope.importFormSettings.resourceSettingsList = [];
                    $scope.importFormSettings.resourceSettingsList.push(angular.copy($scope.defualtresourceTemp));
                    var exists = _.findWhere($scope.importFormSettings.resourceSettingsList, { IsDefault: true });
                    if (!DataService.isEmpty(exists))
                        $scope.setDefaultResource = "true";
                    $scope.importFormSettings.activitiesSettingsList = [];
                    $scope.importFormSettings.activitiesSettingsList.push(angular.copy($scope.defaultactivityTemp));
                    //console.log($scope.importFormSettings.activitiesSettingsList);
                    var exists = _.findWhere($scope.importFormSettings.activitiesSettingsList, { IsDefault: true });
                    if (!DataService.isEmpty(exists))
                        $scope.setDefaultActivity = "true";
                }
                else {
                    var temp = _.filter($scope.importFormSettings.calenderSettingsList, function (item) {
                        return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                    });
                    _.each(temp, function (item) {
                        $timeout(function () {
                            $scope.getColumns(item, 'Resource');
                        }, 150);
                        item.resourceForm = item.resourceForm.toString();
                    });
                    $scope.importFormSettings.resourceSettingsList = [];
                    if (temp.length == 0) {
                        $scope.importFormSettings.resourceSettingsList.push(angular.copy($scope.defualtresourceTemp));
                    }
                    else {
                        $scope.importFormSettings.resourceSettingsList = temp;
                    }
                    var exists = _.findWhere($scope.importFormSettings.resourceSettingsList, { IsDefault: true });
                    if (!DataService.isEmpty(exists))
                        $scope.setDefaultResource = "true";
                    var temp = _.filter($scope.importFormSettings.calenderSettingsList, function (item) {
                        return item.activitiesForm != 0 && !DataService.isEmpty(item.activitiesForm)
                    });
                    _.each(temp, function (item) {
                        $timeout(function () {
                            $scope.getColumns(item, 'Activity');
                        }, 150);
                        item.activitiesForm = item.activitiesForm.toString();
                        item.isVisible = DataService.isEmpty(item.isVisible) ? item.isVisible.toString() : "true";
                    });
                    $scope.importFormSettings.activitiesSettingsList = [];
                    if (temp.length == 0) {
                        $scope.importFormSettings.activitiesSettingsList.push(angular.copy($scope.defaultactivityTemp));
                    }
                    else {
                        $scope.importFormSettings.activitiesSettingsList = temp;
                    }
                    // console.log($scope.importFormSettings.activitiesSettingsList);
                    var exists = _.findWhere($scope.importFormSettings.activitiesSettingsList, { IsDefault: true });
                    if (!DataService.isEmpty(exists))
                        $scope.setDefaultActivity = "true";
                }
                if ($scope.importFormSettings.resourceSettingsList.length > 0) {
                    $scope.isTimeRangeUsage = true;
                    $timeout(function () {
                        _.each($scope.importFormSettings.resourceSettingsList, function (item) {

                            $("#start_" + item.resourceForm).datetimepicker({
                                format: "hh ii",
                                minView: 0,
                                maxView: 1,
                                startView: 1,
                                pickDate: false,
                                autoclose: true,

                                minuteStep: 30,
                                pickerPosition: "bottom-left",
                                //getDate: function () {
                                //    var d = this.getUTCDate();
                                //    // fixed the bug : Cannot read property 'getTime' of null(…)
                                //    if (d == null) {
                                //        return null;
                                //    }
                                //    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
                                //}
                            }).on('changeDate', function (e) {
                                // Revalidate the date field
                                // alert(item.name)

                            });
                            $("#end_" + item.resourceForm).datetimepicker({
                                format: "hh ii",
                                minView: 0,
                                maxView: 1,
                                startView: 1,

                                pickDate: false,
                                autoclose: true,

                                minuteStep: 30,
                                pickerPosition: "bottom-left",
                                //getDate: function () {
                                //    var d = this.getUTCDate();
                                //    // fixed the bug : Cannot read property 'getTime' of null(…)
                                //    if (d == null) {
                                //        return null;
                                //    }
                                //    return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
                                //}
                            }).on('changeDate', function (e) {
                                // Revalidate the date field
                                // alert(item.name)
                            });

                        });
                        //$(".datetimepicker").find('thead th').remove();
                    }, 500);
                }
                $rootScope.safeApply();

            }, 150);
        }
        $scope.calenderTabClick = function () {

            _.map($scope.importFormSettings.calenderSettingsList, function (item, key) {
                if (!DataService.isEmpty(item.IsDefault)) {
                    item.newIsDefault = angular.copy(item.IsDefault.toString());
                    item.isDefaultChecked = angular.copy(item.IsDefault.toString());
                }
            });
            if (DataService.isEmpty($scope.importFormSettings.resourceSettingsList) && DataService.isEmpty($scope.importFormSettings.activitiesSettingsList))
                loadDefaultCalenderSettings();

        };
        $scope.add__Resource = function () {

            if ($scope.importFormSettings.resourceSettingsList.length > 0) {
                var exists = $scope.importFormSettings.resourceSettingsList[$scope.importFormSettings.resourceSettingsList.length - 1];
                var temp = angular.copy($scope.defualtresourceTemp);
                //temp.Id = angular.copy(exists.Id + 1);
                $scope.importFormSettings.resourceSettingsList.push(temp);
            }
            $rootScope.safeApply();
        };
        $scope.delete__Resource = function () {
            if ($scope.importFormSettings.resourceSettingsList.length == 1) {
                notifierService.notifyMessage('error', 'Form Setting Calender', "there must be one Resouce Setting");
                return true;
            }
            // else{
            var exists = _.where($scope.importFormSettings.resourceSettingsList, { checked: true });
            if (!DataService.isEmpty(exists)) {
                _.each(exists, function (item) {
                    if ($scope.importFormSettings.resourceSettingsList.length > 1) {
                        var indx = _.indexOf($scope.importFormSettings.resourceSettingsList, item);
                        $scope.importFormSettings.resourceSettingsList.splice(indx, 1);
                        if (item.Id != 0) {
                            var param = {};
                            param.Id = item.Id;
                            param.action = 3;
                            $scope.manageCalenderSettingsConfig(param);
                        }
                    }
                });
            }
            // }
        };
        $scope.add__Activities = function () {
            if ($scope.importFormSettings.activitiesSettingsList.length > 0) {
                var exists = $scope.importFormSettings.activitiesSettingsList[$scope.importFormSettings.activitiesSettingsList.length - 1];
                var temp = angular.copy($scope.defaultactivityTemp);
                //temp.Id = angular.copy(exists.Id + 1);
                $scope.importFormSettings.activitiesSettingsList.push(temp);
            }

            $rootScope.safeApply();
        };
        $scope.delete__Activities = function () {
            if ($scope.importFormSettings.activitiesSettingsList.length == 1) {
                notifierService.notifyMessage('error', 'Form Setting Calender', "there must be one Activities Setting");
                return true;
            }
            // else{
            var exists = _.where($scope.importFormSettings.activitiesSettingsList, { checked: true });
            if (!DataService.isEmpty(exists)) {
                _.each(exists, function (item) {
                    if ($scope.importFormSettings.activitiesSettingsList.length > 1) {
                        var indx = _.indexOf($scope.importFormSettings.activitiesSettingsList, item);
                        $scope.importFormSettings.activitiesSettingsList.splice(indx, 1);
                        if (item.Id != 0) {
                            var param = {};
                            param.Id = item.Id;
                            param.action = 3;
                            $scope.manageCalenderSettingsConfig(param);
                        }
                    }
                });
            }
            // }
        };
        $scope.manageCalenderSettingsConfig = function (data, setdefault) {
            var param = {};
            param = angular.copy(data);
            param.formId = $scope.importFormSettings.formId;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.ManageCalenderSettingsConfig("ManageCalenderSettingsConfig", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        // if ( response.data > 0) {
                        //console.log(response.data);
                        $scope.manageCalenderSettingsConfigData = response.data;
                        if (response.data.length > 0) {
                            var temp = response.data[0];
                            if (temp.res == 1 && param.action == 3) {
                                var item = _.findWhere($scope.importFormSettings.calenderSettingsList, { Id: temp.Id });
                                var indx = _.indexOf($scope.importFormSettings.calenderSettingsList, item);
                                $scope.importFormSettings.calenderSettingsList.splice(indx, 1);
                            } else {
                                setdefault.IsDefault = true;
                                notifierService.notifyMessage('success', 'Set Default', temp.Message);
                            }
                        }

                        $rootScope.$emit("HideLoading");
                        //}
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.setAsDefault = function (event, data, type) {

            var param = {};
            param.action = 6;
            if (type == 1) {
                param.resourceForm = data.resourceForm;
            } else if (type == 2) {
                param.activitiesForm = data.activitiesForm;
            }
            $scope.manageCalenderSettingsConfig(param, data);

        };
        $scope.getLanguage = function () {
            var param = {};
            param.action = 5;
            param.formId = $scope.currentFormId;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.ManageLanguages("ManageLanguages", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        // if ( response.data > 0) {
                        //console.log(response.data);
                        $scope.languageList = response.data;

                        $rootScope.$emit("HideLoading");
                        //}
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.setInfoddl = function () {
            var infoParam = $scope.importFormSettings.InformationOnly;
            var linkMode = $scope.importFormSettings.informationFormLinkMode;
            var subscribeParam = $scope.importFormSettings.subscriptionForm;
            //console.log($scope.importFormSettings, '$scope.importFormSettings');
            if (infoParam == "tru" || infoParam == "true") {
                $scope.importFormSettings.InformationOnly = "true"
            }
            else if (infoParam == "fal" || infoParam == "false") {
                $scope.importFormSettings.InformationOnly = "false";
            }

            //subscription only
            if (subscribeParam == "tru" || subscribeParam == "true") {
                $scope.importFormSettings.subscriptionForm = "true"
            }
            else if (subscribeParam == "fal" || subscribeParam == "false") {
                $scope.importFormSettings.subscriptionForm = "false";
            }


            setTimeout(function () {
                if (angular.isDefined(linkMode)) {
                    var ddlLInkMode = angular.element(document.querySelector("#informationFormLinkMode"));
                    if (linkMode == "0")
                        $("#informationFormLinkMode option[value='0']").prop('selected', true);
                    else if (linkMode == "1")
                        $("#informationFormLinkMode option[value='1']").prop('selected', true);
                    else if (linkMode == "2")
                        $("#informationFormLinkMode option[value='2']").prop('selected', true);



                }
            }, 1000);


        }
        $scope.changeEvent = function (ddlType, isAllow) {
            // alert();
            //console.log($scope.importFormSettings.InformationOnly);
            //var infoParam = $scope.importFormSettings.InformationOnly;
            //var subscriptionParam = $scope.importFormSettings.subscriptionForm;
            ////setTimeout(function () {
            //if (ddlType == "infoOnly") {
            //    console.log(isAllow);
            //    if (isAllow === 'true') {
            //        $('#divInformation').hide();

            //    }
            //    else {

            //        $('#divInformation').show();
            //    }

            //}

            //else if (ddlType =="subscriptionOnly")
            //        $('#divInformation').hide();

            //}, 500);

            // (infoParam)


            //var infoddl = angular.element(document.querySelector("#informationFormID"));
            //var subscriptionddl = angular.element(document.querySelector("#subscriptionFormID"));
            //if (ddlType == "infoOnly") {
            //    if (infoParam == true)
            //        $scope.informationSettings.showHideInfo = false;
            //    else
            //        $scope.informationSettings.showHideInfo = true;

            //    console.log('tttt'+$scope.informationSettings.showHideInfo);

            //}
            //else if (ddlType == "subscriptionOnly") {
            //    if (subscriptionParam)
            //        $scope.informationSettings.showHideSubscription = false;
            //    else
            //        $scope.informationSettings.showHideSubscription = true;

            //  //  alert($scope.informationSettings.showHideSubscription);

            //}

        }
        $scope.getGroups = function () {
            var param = {};
            param.action = 4;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageGroups("ManageGroups", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 4) {
                            if (response.data.length > 0) {
                                $scope.groupList = response.data;
                                $('.selectgroup').val($scope.importFormSettings.groupID)
                                $scope.groupList = $filter('orderBy')($scope.groupList, 'groupName', false);

                                $timeout(function () {
                                    $('.selectgroup').selectpicker({
                                        liveSearch: true,
                                        container: 'body'
                                    });
                                    $(".selectgroup ").selectpicker("refresh")
                                }, 200);
                            }
                        }
                    }
                });
        };

        $scope.getGroups = function () {
            var param = {};
            param.action = 4;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageGroups("ManageGroups", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 4) {
                            if (response.data.length > 0) {
                                $scope.groupList = response.data;
                                $('.selectgroup').val($scope.importFormSettings.groupID)
                                $scope.groupList = $filter('orderBy')($scope.groupList, 'groupName', false);

                                $timeout(function () {
                                    $('.selectgroup').selectpicker({
                                        liveSearch: true,
                                        container: 'body'
                                    });
                                    $(".selectgroup ").selectpicker("refresh")
                                }, 200);
                            }
                        }
                    }
                });
        };

        $scope.getSelectedResourceForms = function (selected) {
            $scope.importFormSettings.otherformid = selected;
            $scope.ResourceFormsFields = [];
            $scope.ResourceFormsFields = window["Referral_Forms_Fields"][$scope.importFormSettings.otherformid];
            var temp = [];
            $scope.ResourceFormsFields = _.each($scope.ResourceFormsFields, function (item, key) {
                if (!DataService.isEmpty(item)) {
                    temp.push({ "name": key, "value": item });
                }
            });
            $scope.ResourceFormsFields = temp;
            $timeout(function () {
                if (!DataService.isEmpty($scope.importFormSettings.otherFormFieldName)) {
                    if (!Array.isArray($scope.importFormSettings.otherFormFieldName))
                        $scope.importFormSettings.otherFormFieldName = JSON.parse($scope.importFormSettings.otherFormFieldName);
                }
                else {
                    $scope.importFormSettings.otherFormFieldName = "[]";
                }
            }, 450);

        }

        $scope.GetResourceForms = function (param1, type) {

            mainService.manageGroups("getResourceForms", param1)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {

                        if (response.data.length > 0) {

                            $scope.ResourceForms = response.data;  // forms will be same for resourceForm ddl and activity form ddl
                            //$timeout(function () {
                            //    $scope.importFormSettings.otherformid = 0;
                            //}, 150);
                            //console.log('resforms');
                            // console.log($scope.ResourceForms);
                            $scope.ActivityForms = response.data;

                        }

                    }
                });
        };
        $scope.InformaitionForms = function () {

            var param = {};
            param.userId = $scope.userDetail.Id;
            param.action = 24;
            mainService.manageForm("informationForms", param)
                .then(function (response) {
                    //console.log('infpr dat');
                    //console.log(response.data);
                    var data = response.data;
                    if (data != null && angular.isDefined(data)) {
                        $scope.informationForms = data.informationForms;
                        $scope.subscriptionForms = data.subscriptionForms;
                        //console.log('asdasdasdasdasdasd');
                        //console.log($scope.informationForms);
                        //console.log($scope.subscriptionForms);
                    }
                });
        };
        /* 
        share form link via whatsapp by SR078 formgeneratorcontroller
         */
        $scope.SendLinkOnWhatsApp = function (flink) {
            //console.log('hi');
            var param = {};
            param.link = flink;
            param.userID = $scope.userDetail.Id;
            param.formId = $scope.importFormSettings.formId;
            param.action = 1;
            mainService.manageWhatsAppMessaging("ManageWhatsAppMessaging", param)
                .then(function (response) {
                    var data = response.data;
                    //console.log(response.data, 'response.data;');
                    if (data != null && angular.isDefined(data)) {
                        if (data.res == "1") {
                            swal({
                                title: "Link shared successfully ",
                                text: "You can share another link",
                                showConfirmButton: false,

                            });
                        }
                        else if (data == "0") {
                            notifierService.notifyMessage('error', 'Form Entry', "No users to be notified");
                        }
                        else {
                            notifierService.notifyMessage('error', 'Form Entry', "some error");
                        }

                    }
                });
        };
        $scope.gotoSettings = function () {
            if ($stateParams.topicId != null) {
                $state.go('formSettings', { 'topicId': $stateParams.topicId }, { reload: true, inherit: false });
            }
            else {
                save_form_editor(fbInstances, fbInstancePages);
                $timeout(function () {
                    $state.go('formSettingsEdit', { 'formId': $stateParams.formId }, { reload: true, inherit: false });
                }, 150);
            }

        }
        $scope.getControls = function (data, type) {

            //var param = {};
            //param.action = 16;
            //param.formId = formIdParam;
            // param1.applicationId = param.applicationId;

            /*console.log($scope.filerCriteriaFormDetails.created_by, "FormDetais")*/

            if ($scope.filerCriteriaFormDetails.status == "2") {
                console.log(JSON.parse(localStorage.getItem("detail")), "session details");
                var UserId = JSON.parse(localStorage.getItem("detail")).Id;
                var CreatedBy = $scope.filerCriteriaFormDetails.created_by;
                if (UserId != CreatedBy) {
                    window.location.href = '/#/login';
                }


            }

            //mainService.manageGroups("getControls", param).then(function (response) {

            if (data != null && angular.isDefined(data)) {
                var formFieldsList = {}; var overlapFlag = 0;
                formFieldsList = data;
                if (type == "Resource") {
                    $scope.majorGroupControls = []; $scope.minorGroupControls = [];
                }
                if (type == "Activity") {
                    $scope.activityField = []; $scope.activityCategory = []; $scope.radioGroup = []; $scope.durationField = []; $scope.colorField = [];
                }

                // console.log(formFieldsList);

                if (formFieldsList.length > 0) {

                    for (var i = 0; i < formFieldsList.length; i++) {
                        var temp = JSON.parse(formFieldsList[i].fieldValidationRule);
                        //  console.log(temp);
                        if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map" && temp.type != "hidden") {
                            if (type == "Resource") {
                                $scope.majorGroupControls.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                $scope.minorGroupControls.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                            }
                            if (type == "Activity") {
                                $scope.activityField.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                $scope.activityCategory.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                $scope.durationField.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                $scope.colorField.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                if (formFieldsList[i].fieldType == "radio" || formFieldsList[i].fieldType == "radio-group") {
                                    $scope.radioGroup.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                }
                            }
                        }
                        if (formFieldsList[i].fieldType == "radio" || formFieldsList[i].fieldType == "radio-group") {
                            overlapFlag = 1;
                        }
                    }
                }


                if (overlapFlag == 1 && type == "Activity")
                    $("#overlapField").removeAttr("disabled");
                else {

                    $("#overlapField").prop('disabled', 'disabled');
                    $scope.radioGroup = [];
                }
                // console.log($scope.activityField);


                //if (formIdParam == 0 && type == "Activity") {

                //    $("#overlapField").prop('disabled', 'disabled');
                //    $("#activities").prop('disabled', 'disabled');

                //    $("#activities").prop('disabled', 'disabled');
                //    $("#activitiesCategory").prop('disabled', 'disabled');
                //    $("#durationField").prop('disabled', 'disabled');
                //}
                //else {
                //    $("#overlapField").removeAttr("disabled");
                //    $("#activities").removeAttr("disabled");

                //    $("#activities").removeAttr("disabled");
                //    $("#activitiesCategory").removeAttr("disabled");
                //    $("#durationField").removeAttr("disabled");
                //}
            }
            //});
        };
        $scope.getColumns = function (formData, type) {
            var param = {};
            param.action = 16;
            if (!DataService.isEmpty(formData.resourceForm) && formData.resourceForm != 0)
                param.formId = formData.resourceForm;
            else if (!DataService.isEmpty(formData.activitiesForm) && formData.activitiesForm != 0)
                param.formId = formData.activitiesForm;
            //param.applicationId = param.applicationId;

            mainService.manageGroups("Getcalenderdll", param).then(function (response) {
                var data = response.data;
                if (data != null && angular.isDefined(data)) {
                    var formFieldsList = {}; var overlapFlag = 0;
                    formFieldsList = data;
                    if (type == "Resource") {
                        formData.majorGroupControls = []; formData.minorGroupControls = [];
                    }
                    if (type == "Activity") {
                        formData.activityField = []; formData.activityCategory = []; formData.radioGroup = []; formData.durationFieldList = []; formData.colorFieldList = [];
                    }

                    // console.log(formFieldsList);

                    if (formFieldsList.length > 0) {

                        for (var i = 0; i < formFieldsList.length; i++) {
                            var temp = JSON.parse(formFieldsList[i].fieldValidationRule);
                            //  console.log(temp);
                            if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map" && temp.type != "hidden") {
                                if (type == "Resource") {
                                    formData.majorGroupControls.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    formData.minorGroupControls.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    if (formData.majorGroup.length > 0) {
                                        if (!Array.isArray(formData.majorGroup) && $scope.importFormSettings.isMultipleCalenderSettings)
                                            formData.majorGroup = JSON.parse(formData.majorGroup);
                                        else {
                                            if (formData.majorGroup.length > 0) {
                                                var temp = angular.copy(formData.majorGroup);
                                                temp = (temp.length > 0) ? temp.toString().replace('"', "").replace("[", "").replace("]", "").trim() : "";
                                                temp = (temp.length > 0) ? temp.toString().replace('"', "") : "";
                                                if (!Array.isArray(formData.majorGroup)) {
                                                    formData.majorGroup = [];
                                                    formData.majorGroup.push(temp);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (type == "Activity") {
                                    formData.activityField.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    formData.activityCategory.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    formData.durationFieldList.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    formData.colorFieldList.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    if (formFieldsList[i].fieldType == "radio" || formFieldsList[i].fieldType == "radio-group") {
                                        formData.radioGroup.push({ Type: formFieldsList[i].fieldName, Name: temp.label });
                                    }
                                }
                            }
                            if (formFieldsList[i].fieldType == "radio" || formFieldsList[i].fieldType == "radio-group") {
                                overlapFlag = 1;
                            }
                        }
                    }


                    if (overlapFlag == 1 && type == "Activity")
                        $("#overlapField").removeAttr("disabled");
                    else {
                        $("#overlapField").prop('disabled', 'disabled');
                        formData.radioGroup = [];
                    }
                    // console.log($scope.activityField);


                    //if (formIdParam == 0 && type == "Activity") {

                    //    $("#overlapField").prop('disabled', 'disabled');
                    //    $("#activities").prop('disabled', 'disabled');

                    //    $("#activities").prop('disabled', 'disabled');
                    //    $("#activitiesCategory").prop('disabled', 'disabled');
                    //    $("#durationField").prop('disabled', 'disabled');
                    //}
                    //else {
                    //    $("#overlapField").removeAttr("disabled");
                    //    $("#activities").removeAttr("disabled");

                    //    $("#activities").removeAttr("disabled");
                    //    $("#activitiesCategory").removeAttr("disabled");
                    //    $("#durationField").removeAttr("disabled");
                    //}
                }
            });
        };
        $scope.previewPage = function () {

        };
        $scope.getReferenceFormList = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.getReferenceFormList("getReferenceFormList", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.applicationFormList = response.data;
                        var result = {};
                        var resultFields = {};
                        var resultFormsFields = {};
                        var formNameList = {};
                        formNameList = $scope.applicationFormList.formNameList;
                        var formFieldsList = {};
                        formFieldsList = $scope.applicationFormList.formFieldsList;

                        if (formNameList.length > 0) {
                            result[0] = "-- Select a form --";
                            for (var i = 0; i < formNameList.length; i++) {
                                result[formNameList[i].formId] = formNameList[i].title;
                            }
                        }
                        if (formFieldsList.length > 0) {
                            resultFields[""] = "-- Select a field --";
                            resultFields["Id"] = "Id";
                            for (var i = 0; i < formFieldsList.length; i++) {
                                var temp = JSON.parse(formFieldsList[i].fieldValidationRule);
                                if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map" && temp.type != "tabulator")
                                    resultFields[temp.name] = temp.label;
                            }
                        }
                        angular.forEach(formNameList, function (item, key) {
                            var fieldlistTemp = _.where(formFieldsList, { formId: item.formId });
                            var tempData = {};
                            for (var i = 0; i < fieldlistTemp.length; i++) {
                                var temp = JSON.parse(fieldlistTemp[i].fieldValidationRule);
                                if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map") {
                                    tempData[temp.name] = temp.label;
                                }
                                if (temp.type == "date") {
                                    //console.log(temp);
                                    $scope.basicCalendar.push({ val: temp.name, Name: temp.label });
                                }

                            }
                            tempData["Id"] = "Id";
                            resultFormsFields[item.formId] = tempData;
                        });
                        window["Referral_Forms"] = result;
                        window["Referral_Fields"] = resultFields;
                        window["Referral_Forms_Fields"] = resultFormsFields
                        // $scope.getSelectedResourceForms($scope.importFormSettings.otherformid);

                        $rootScope.$emit("HideLoading");
                        $timeout(function () {
                            // Reference/Derived settings modal

                            loadFormCustom();
                        }, 250);
                    }
                }, function (err) {
                    $timeout(function () {
                        loadFormCustom();
                    }, 250);
                    console.log("some error occured." + err);
                    $rootScope.$emit("HideLoading");
                });
        };

        $scope.$watch('applicationFormList.formFieldsList', function (oldVal, newVal) {
            if (!DataService.isEmpty(newVal)) {
                if (oldVal != newVal) {
                    if (!DataService.isEmpty($scope.importFormSettings.otherformid))
                        $scope.getSelectedResourceForms($scope.importFormSettings.otherformid);
                }
            }
        });

        $scope.formGenetatorData = {};
        $scope.fileData = {};
        var fbOptions = {};
        var files = {};
        $scope.importFile = function (file) {


        }
        var fbInstances = [], fbInstancePages = [];
        var datefields = [];
        $scope.formBind = function (formFieldsData, type) {
           
            $timeout(function () {
                // Variable to store your files
                var files;
                // Add events
               
                var superformId = "";
                //        var formProperties = window.sessionStorage.getItem('subFormProperties');
                //        if(formProperties !=null){
                //            var json = JSON.parse(formProperties);
                //            $("#formTitle").val(json.formTitle);
                //            $("#formDescription").val(json.formDescription);
                //            $("#formType").val(json.formType);
                //            $("#InformationOnly").val(json.InformationOnly);
                //            $("#formTag").val(json.formTag);
                //            $("#Max_records").val(json.Max_records);createcontact
                //            $("#updateID").val(json.updateID);
                //        }

                var inputSets = [];
                if (!DataService.isEmpty(approvalField) && angular.isDefined(approvalField))
                    inputSets.unshift(approvalField);
                // $timeout(function () {
                if (!DataService.isEmpty(calendarControl) && angular.isDefined(calendarControl))
                    inputSets.unshift(calendarControl);

                if (!DataService.isEmpty(MapMarkerControl) && angular.isDefined(MapMarkerControl))
                    inputSets.unshift(MapMarkerControl);

                
                if (!DataService.isEmpty(navigationControl) && angular.isDefined(navigationControl))
                    inputSets.unshift(navigationControl);
                if (!DataService.isEmpty(controlOrder) && angular.isDefined(controlOrder)) {
                    controlOrder.unshift('navigation-controls');
                    controlOrder.unshift('full-calendar');
                    controlOrder.unshift('approval-field');
                }
                // }, 50);
                var topicControls = "";
                $.each(topicControls, function (key, data) {
                    controlOrder.unshift(data.name);
                });
                if (type == 1) { }
                else {
                    fbInstances = [], fbInstancePages = [];
                    fbOptions['defaultFields'] = [];
                }
                var $fbEditor = $(".fb-editor")
                var $formBuilder = $("#form-builder-pages").parents("div.tab-content")
                var $formBuilderTabs = $("#form-builder-pages").parents(".card-body").find('ul.nav-tabs')
                var $formContainer = $("#fb-rendered-form");



                var formFields = type == 1 ? {
                    "Page 1": ($scope.isFormCalender == false) ? defaultFormFields() : defaultCalenderFormFields()
                } : formFieldsData;

                var subFormFields = Object.keys(formFields).map(function (k) { return formFields[k]; });
                fbInstancePages = Object.keys(formFields).map(function (k) { return k; });
                $fbPages = $(document.getElementById("form-builder-pages"));
                var addPageTab = document.getElementById("add-page-tab");


                var fbExtraOptions = {
                    onSave: function (e, formData) {
                        save_form_editor(fbInstances, fbInstancePages);
                    },
                    controlOrder: controlOrder,
                    inputSets: inputSets,
                    /*actionButtons: [{
                        id: 'preview-form',
                        className: 'float-buttons wv-btn wv-success',
                        label: 'Preview',
                        type: 'button',
                        events: {
                            click: function() {
                                $formBuilder.toggle();
                                $formContainer.toggle();
                                $formBuilderTabs.toggle();
                                $('form', $formContainer).html('');
                                var formDataHtml = [];
                                for (var key in fbInstances) {
                                    if (fbInstances.hasOwnProperty(key)) {
                                        var JSON = $.parseJSON(fbInstances[key].formData);
        
                                        $.each(JSON, function(key, value){
                                            formDataHtml.push(value);
                                        });
                                    }
                                }
                                $('form', $formContainer).formRender({
                                    formData: formDataHtml
                                });
                            }
                        }
                    }]*/
                };
                //        formData = window.sessionStorage.getItem('subFormData');
                //
                //        if (formData) {
                //            fbOptions.formData = JSON.parse(formData);
                //        }

                fbOptions = $.extend({}, fbDefaultOptions, fbExtraOptions);
                var p1 = "Page 1";
                if (Object.keys(fbInstancePages).length === 0) {
                    fbInstancePages.push('Page 1');
                }
                subFormFields = convertOldJsonControlsToNewControlsFormat(subFormFields);
                //fbOptions['defaultFields'] = subFormFields;
                fbOptions['defaultFields'] = fbInstancePages.length > 0 ? convertSupportableNewJSONFormat(subFormFields[0]) : defaultFormFields();
                //console.log(subFormFields, 'formffff');

                //datefields.push('Page 1');
                fbInstances.push($fbEditor.formBuilder(fbOptions));
                //p1 = fbInstancePages.length > 0 ? fbInstancePages : p1;
                //fbInstancePages.push(p1);
                // fbInstances.push($fbEditor.formBuilder(fbOptions));



                $("ul#tabs li:eq(0) a").text(fbInstancePages[0]);
                // if (Object.keys(subFormFields).length === 0) {
                //    fbInstances.push($fbEditor.formBuilder(fbOptions));
                // } else {
                // fbInstances.push($fbEditor.formBuilder(fbOptions));

                //for (var i = 1; i < Object.keys(subFormFields).length; i++) {
                //    $("#add-page-tab").trigger('click');
                //}
                // }
                $('ul#tabs').css('display', 'block');
                ///bind all pages
                if (type == 1) {
                    fbOptions['defaultFields'] = [];
                }

                _.each(fbInstancePages, function (item, key) {
                    if (key != 0) {
                        var tabCount = document.getElementById("tabs").children.length
                        var tabId = "page-" + tabCount.toString()
                        var $newPageTemplate = $(document.getElementById("new-page"))
                        var $newPage = $newPageTemplate
                            .clone()
                            .attr("id", tabId)
                            .addClass("fb-editor")
                        var $newTab = $("#add-page-tab").clone().removeAttr("id")
                        var tabName = "Page " + tabCount;
                        // Page name
                        var pageName = item;
                        var $tabLink = $("a", $newTab)
                            .attr("href", "#" + tabId)
                            .text(pageName);
                        $newPage.insertBefore($newPageTemplate);
                        $newTab.insertBefore($("#add-page-tab"));
                        $fbPages.tabs("refresh");
                        $fbPages.tabs("option", "active", tabCount - 1);
                        fbOptions = $.extend({}, fbDefaultOptions, fbExtraOptions);
                        fbOptions['defaultFields'] = convertSupportableNewJSONFormat(subFormFields[key]);
                        fbInstances.push($newPage.formBuilder(fbOptions));
                    }
                });

                $timeout(function () {
                    try {
                        $timeout(function () {
                            fbInstances.forEach(function (instance, i) {
                                if (!DataService.isEmpty(instance))
                                    if (!DataService.isEmpty(instance.actions))
                                        if (!DataService.isEmpty(instance.actions.setData))
                                            // instance.actions.setData(JSON.stringify(convertSupportableNewJSONFormat(subFormFields[i])));
                                            // instance.actions.setData(JSON.stringify(tempControls))                                        
                                            $('.form-builder-loader').hide();
                                $tabs.tabs({ active: 0 });

                            });
                            // $tabs = $fbPages.tabs({}, { history: true });
                            $fbPages.tabs("refresh");
                            $tabs = $fbPages.tabs({
                                beforeActivate: function (event, ui) {
                                    if (ui.newPanel.selector === "#new-page") {
                                        return false;
                                    }
                                }
                            }, { history: true });
                            $tabs.find(".ui-tabs-nav").sortable({
                                items: "> li:not(#add-page-tab)",
                                axis: "x",
                                stop: function (event, ui) {
                                    $tabs.tabs("refresh");
                                    var tabsSequence = $tabs.tabs("instance").tabs;
                                    var result = sort_pages(tabsSequence, fbInstancePages, fbInstances);
                                    if (Object.keys(result).length) {
                                        fbInstancePages = result.pages;
                                        fbInstances = result.fb;
                                    }
                                }
                            });


                            createOptions($("#referenceModal form select.Forms"), Referral_Forms);
                            createOptions($("#referenceModal form select.Form_Fields, #referenceModal form select.Update_Form_Fields,#referenceModal form select.Form_Fields_Value,#referenceModal form select.Form_Fields_Multiple"), Referral_Fields);




                        }, 150);
                    } catch (err) {
                        console.warn("formData not available yet.");
                    }

                }, 450);
                loadcssjsfile("newAssets/formbuilder/js/init-form-builder.js", "js", "form-builder");

            }, 800);
        }
        $scope.fileChange = function (element) {
            $scope.fileData = element.files[0];
            var fd = new FormData();
            fd.append('file', $scope.fileData);
            var reqType = "form";
            var uid = $scope.userDetail.uid;
            var userId = $scope.userDetail.Id;
            var appIdParam = $scope.importFormSettings.applicationId;
            var appTitleParam = $scope.importFormSettings.applicationTitle;
            var formIdParam = $scope.importFormSettings.formId;
            var formTitleParam = $scope.importFormSettings.title;
            $rootScope.$emit("ShowLoading");
            mainService.uploadFile("UploadDataFile", fd, reqType, uid, appIdParam, appTitleParam, formIdParam, formTitleParam, true, userId)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data)) {

                            if (angular.isDefined(response.data)) {
                                // console.log(response.data);
                                // $(".fb-editor").empty();
                                $scope.fieldsListTemp = [];
                                $scope.fieldsListMain = [];
                                //$scope.fieldsListTemp = response.data;
                                if ($scope.importFormSettings.fileType == "Yes") {
                                    $scope.fieldsTemp = response.data;
                                    $scope.fieldsListTemp = [];
                                    $scope.fieldsListTempFull = [];
                                    var Column_Name = "";



                                    // $scope.fieldsListTemp = response.data;


                                    var isBasicSettingsExcel = _.filter($scope.fieldsTemp, function (item) {
                                        return item.Basic_Settings != null
                                    });
                                    var newCopy = angular.copy($scope.fieldsTemp);
                                    if (!DataService.isEmpty(isBasicSettingsExcel)) {
                                        _.map($scope.fieldsTemp, function (pagesData, key) {
                                            // _.map(pagesData, function (item) {
                                            // if (!DataService.isEmpty(item)){
                                            // if (key != 0) {
                                            if (!DataService.isEmpty(pagesData.Column_Name)) {
                                                $scope.fieldsListTempFull.push($scope.fieldsListTemp[Column_Name])
                                                Column_Name = pagesData.Column_Name;
                                                $scope.fieldsListTemp[Column_Name] = []
                                                var obj = {};
                                                obj["name"] = Column_Name;
                                                $scope.fieldsListTemp[Column_Name].push(obj);
                                                var obj = {};
                                                obj["id"] = Column_Name;
                                                $scope.fieldsListTemp[Column_Name].push(obj);
                                                var obj = {};
                                                obj["label"] = pagesData.Label;
                                                $scope.fieldsListTemp[Column_Name].push(obj);
                                                var obj = {};
                                                obj["required"] = pagesData.Required;
                                                $scope.fieldsListTemp[Column_Name].push(obj);

                                            }
                                            if (!DataService.isEmpty(pagesData.Advanced_Settings) || !DataService.isEmpty(pagesData.Basic_Settings) || !DataService.isEmpty(pagesData.Format_Settings) || !DataService.isEmpty(pagesData.More_Settings)) {
                                                if (!DataService.isEmpty(pagesData.Basic_Settings)) {
                                                    var temp = pagesData.Basic_Settings;
                                                    temp = temp.split('=');
                                                    if (temp.length > 0) {
                                                        var obj = {};
                                                        var keySettings = temp[0].trim();
                                                        var tempFilter = _.filter($scope.fieldsTypeData, function (fval, fkey) {
                                                            return _.values(fval)[0] == keySettings;
                                                        });
                                                        obj[_.keys(tempFilter[0])] = temp[1].trim();
                                                        $scope.fieldsListTemp[Column_Name].push(obj);
                                                    }
                                                }
                                                if (!DataService.isEmpty(pagesData.Advanced_Settings)) {

                                                    var temp = pagesData.Advanced_Settings;
                                                    temp = temp.split('=');
                                                    if (temp.length > 0) {
                                                        var obj = {};
                                                        var keySettings = temp[0].trim();
                                                        var tempFilter = _.filter($scope.fieldsTypeData, function (fval, fkey) {
                                                            return _.values(fval)[0] == keySettings;
                                                        });
                                                        obj[_.keys(tempFilter[0])] = temp[1].trim();
                                                        $scope.fieldsListTemp[Column_Name].push(obj);
                                                    }
                                                }
                                                if (!DataService.isEmpty(pagesData.Format_Settings)) {
                                                    var temp = pagesData.Format_Settings;
                                                    temp = temp.split('=');
                                                    if (temp.length > 0) {
                                                        var obj = {};
                                                        var keySettings = temp[0].trim();
                                                        var tempFilter = _.filter($scope.fieldsTypeData, function (fval, fkey) {
                                                            return _.values(fval)[0] == keySettings;
                                                        });
                                                        obj[_.keys(tempFilter[0])] = temp[1].trim();
                                                        $scope.fieldsListTemp[Column_Name].push(obj);
                                                    }

                                                }
                                                if (!DataService.isEmpty(pagesData.More_Settings)) {
                                                    var temp = pagesData.More_Settings;
                                                    temp = temp.split('=');
                                                    if (temp.length > 0) {
                                                        var obj = {};
                                                        var keySettings = temp[0].trim();
                                                        var tempFilter = _.filter($scope.fieldsTypeData, function (fval, fkey) {
                                                            return _.values(fval)[0] == keySettings;
                                                        });
                                                        obj[_.keys(tempFilter[0])] = temp[1].trim();
                                                        $scope.fieldsListTemp[Column_Name].push(obj);
                                                    }
                                                }
                                            }
                                            //  }
                                            // return item;
                                            // });
                                        });

                                        var temp = {};
                                        $scope.fieldsListTempNew = [];
                                        $scope.fieldsListTempFull = _.filter($scope.fieldsListTempFull, function (item) {
                                            return item != undefined;
                                        });
                                        _.each($scope.fieldsListTempFull, function (newCopy1, keyTable) {

                                            var controls = "{ "
                                            var obj = {};
                                            _.each(newCopy1, function (item, key) {
                                                var rekey = _.keys(item)[0];
                                                if (rekey == "required") {
                                                    var val1 = _.values(item)[0];
                                                    if (!DataService.isEmpty(val1))
                                                        obj[rekey] = val1.toLocaleLowerCase() == "false" ? false : true;
                                                }
                                                else {
                                                    obj[rekey] = _.values(item)[0];
                                                }

                                            });
                                            $scope.fieldsListTempNew.push(obj);
                                        });
                                        temp["Page 1"] = angular.copy($scope.fieldsListTempNew);
                                        $scope.fieldsTemp = angular.copy(temp);
                                    } else {
                                        _.each(newCopy, function (newCopy1, keyTable) {

                                            var controls = "{ "
                                            var obj = {};
                                            _.each(newCopy1, function (item, key) {
                                                var temp = _.filter($scope.fieldsTypeData, function (fval, fkey) {
                                                    return _.values(fval)[0] == key;
                                                });

                                                if (!DataService.isEmpty(temp)) {

                                                    if (!DataService.isEmpty(item)) {

                                                        if (key == "Options") {
                                                            if (!Array.isArray(item))
                                                                item = JSON.parse(item);
                                                        }
                                                        var rekey = _.keys(temp[0]);
                                                        if (rekey == "required") {
                                                            var val1 = item;
                                                            if (!DataService.isEmpty(val1))
                                                                val1 = val1.toLocaleLowerCase() == "false" ? false : true;
                                                            item = val1;
                                                        }
                                                        obj[rekey] = item;

                                                        // controls += _.keys(obj) + " :" + (_.values(obj)[0]) + " ,";
                                                        //$scope.fieldsListTemp[keyTable].push(obj);
                                                    }
                                                }
                                                if ("Column_Name" == key) {
                                                    obj["name"] = item;
                                                    obj["id"] = item;

                                                    // controls += _.keys(obj) + " :" + (_.values(obj)[0]) + " ,";
                                                    //$scope.fieldsListTemp[keyTable].push(obj);
                                                }
                                                if ("Sub_Type" == key) {
                                                    obj["subtype"] = item;
                                                    //   controls += _.keys(obj) + " :" +(_.values(obj)[0])+" ,";
                                                    //$scope.fieldsListTemp[keyTable].push(obj);
                                                }
                                                //console.log(temp);
                                            });
                                            //controls = controls.substring(0, controls.length - 2);                               
                                            // controls +=" } ";
                                            $scope.fieldsListTemp.push(obj);
                                        });
                                        var temp = {};
                                        temp["Page 1"] = angular.copy($scope.fieldsListTemp);
                                        $scope.fieldsTemp = angular.copy(temp);
                                    }

                                    //console.log($scope.fieldsListTemp);
                                    /* _.each(newCopy, function (newCopy1, keyTable) {
                                         
                                         _.each(newCopy1, function (item, key) {
                                             $scope.fieldsList = '{"';
                                             _.each(item, function (v, k) {
                                                 //console.log(k)
                                                 //console.log(v)
                                                 var temp = 0;
                                                 var keyssss = "";
                                                 if (angular.isObject(v)) {
 
                                                     _.each(v, function (nvalue, nkey) {
                                                         var newvalue = "";
                                                         var exists = _.find($scope.fieldsTypeData, function (ite, kkkk) {
 
                                                             if (_.values(ite)[0] == nkey.trim()) {
                                                                 temp = kkkk + 1;
                                                                 newvalue = _.values(ite)[0];
                                                                 if (temp > 0) {
                                                                     keyssss = Object.keys(ite)[0];
                                                                 }
                                                                 return true;
                                                             }
                                                             else {
                                                                 return false
                                                             }
                                                         });
                                                         if (keyssss.length > 0 && nvalue != null) {
                                                             if (keyssss.trim() == "values") {
                                                                 var newType = 'values":' + JSON.stringify(nvalue.trim()) + ',"';
                                                                 $scope.isValue = true;
                                                                 $scope.fieldsList += newType;
                                                             } else {
                                                                 var dddd = '' + keyssss.trim() + '":"' + nvalue.trim() + '","';
                                                                 $scope.fieldsList += dddd;
                                                                 $scope.isValue = false;
                                                             }
                                                         }
                                                         else {
                                                             if (angular.isDefined(nvalue) && nvalue != null) {
                                                                 onsole.log('nvalue:' + nvalue)
                                                                 var dddd = 'id":"' + nvalue.trim() + '","';
                                                                 $scope.fieldsList += dddd;
                                                             }
                                                         }
                                                     });
 
                                                 }
                                                 else {
 
                                                     var exists = _.find($scope.fieldsTypeData, function (ite, kkkk) {
                                                         //var column = k;
                                                         var column = k.trim();
                                                         column = column.replace('_', ' ');
                                                         if (_.values(ite)[0] == column) {
                                                             temp = kkkk + 1;
                                                             if (temp > 0) {
                                                                 keyssss = Object.keys(ite)[0];
                                                             }
                                                             return true;
                                                         }
                                                         else {
                                                             return false
                                                         }
                                                     });
                                                     // console.log(temp)
                                                     if (keyssss.length > 0 && v != null) {
                                                         if (keyssss.trim().toLowerCase() === "required" && v.trim().toLowerCase() == "false") { }
                                                         else {
                                                             var dddd = "";
                                                             if (angular.isDefined(keyssss.trim()) && keyssss.trim() != null && keyssss.length > 0) {
                                                                 dddd = '' + keyssss.trim() + '":"' + v.trim() + '","';
                                                             }
                                                             if (keyssss.trim() == "subtype") {
                                                                 var newType = 'types":"' + v.trim() + '","';
                                                                 $scope.fieldsList += newType;
                                                             }
                                                             if (keyssss.trim() == "values") {
                                                                 dddd = 'values":' + JSON.stringify(v.trim()) + ',"';
 
                                                             }
                                                             $scope.fieldsList += dddd;
                                                         }
 
                                                     }
                                                     else {
                                                         if (angular.isDefined(v) && v != null) {
                                                             var dddd = 'id":"' + v.trim() + '","';
                                                             $scope.fieldsList += dddd;
                                                         } else {
                                                             if (angular.isDefined(keyssss.trim()) && keyssss.trim() != null && keyssss.length > 0) {
                                                                 var dddd = '' + keyssss.trim() + '":"","';
                                                                 $scope.fieldsList += dddd;
                                                             }
                                                         }
                                                     }
 
                                                 }
 
 
                                             });
                                             $scope.fieldsList = $scope.fieldsList.substring(0, $scope.fieldsList.length - 2)
                                             $scope.fieldsList += '}';
                                             var parseData = JSON.parse(JSON.parse(JSON.stringify($scope.fieldsList)));
                                             if (angular.isDefined(parseData))
                                                 _.each(parseData, function (nvalue, nkey) {
                                                     if (nkey.trim() == "values" && angular.isObject(nvalue)) {
                                                         parseData[nkey] = JSON.parse(nvalue)
                                                     }
                                                     else if (nkey.trim() == "values" && nvalue.length > 5) {
                                                         var temp = JSON.parse(nvalue);
                                                         if (angular.isObject(temp))
                                                             parseData[nkey] = temp;
                                                     }
                                                 });
                                             $scope.fieldsListTemp.push(parseData);
 
                                             //console.log($scope.fieldsListTemp);
                                         });
                                         $scope.fieldsTemp[keyTable] = $scope.fieldsListTemp;
                                         // $scope.fieldsListMain = $scope.fieldsListMain.concat({ [keyTable]: $scope.fieldsListTemp });
                                         // $scope.fieldsListMain.push(([keyTable]: $scope.fieldsListTemp ));
                                     });*/
                                    //console.log($scope.fieldsTemp);
                                    //console.log($scope.fieldsListTemp);
                                    //var testing = {};
                                    //testing = { "Testing 1": $scope.fieldsListTemp }
                                    // console.log($scope.fieldsListTemp)

                                    // $scope.formBind($scope.fieldsTemp, 2);
                                }
                                else {

                                    $scope.fieldsTemp = response.data;

                                    //$scope.isEditForm = false;
                                    //$timeout(function () {
                                    //    $scope.saveFormProperties(null, null, JSON.stringify($scope.fieldsTemp));
                                    //}, 500);
                                    // $scope.formBind(response.data, 2);
                                }
                                // $('#controlImportModal').modal('hide');
                            }

                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        $scope.updateForm = function (importform) {
            var data = $scope.fieldsTemp;
            $timeout(function () {
                _.map(data, function (pagesData) {
                    _.map(pagesData, function (item) {
                        if (angular.isDefined(item.values))
                            item.values = JSON.stringify(item.values);
                    })
                });
                //var data = JSON.parse(JSON.stringify($scope.fieldsTemp))
                if ($scope.importFormSettings.fileType == "Yes")
                    data = JSON.stringify(data)
                if ($scope.importFormSettings.existingConfig != "Yes") {
                    if ($scope.importFormSettings.fileType != "Yes") {

                        var temp = JSON.parse($scope.fieldsTemp);
                        var temp1 = JSON.parse($scope.importFormSettings.fields);
                        angular.forEach(temp1, function (itemPage, page) {
                            if (!Array.isArray(itemPage))
                                itemPage = JSON.parse(itemPage);
                            angular.forEach(itemPage, function (item, key) {
                                if (!Array.isArray(temp[page]))
                                    temp[page] = JSON.parse(temp[page]);
                                temp[page].push(item);
                            });
                        });
                        data = JSON.stringify(temp);


                    }
                    else {
                        var temp = $scope.fieldsTemp;
                        var temp1 = JSON.parse($scope.importFormSettings.fields);
                        angular.forEach(temp1, function (itemPage, page) {
                            if (!Array.isArray(itemPage))
                                itemPage = JSON.parse(itemPage);
                            angular.forEach(itemPage, function (item, key) {
                                if (!Array.isArray(temp[page]))
                                    temp[page] = JSON.parse(temp[page]);
                                temp[page].push(item);
                            });
                        });
                        data = JSON.stringify(temp);
                    }
                }
                else {
                    var temp1 = {};
                    var temp = {};
                    if (typeof ($scope.fieldsTemp) == "string")
                        temp = JSON.parse($scope.fieldsTemp);
                    else
                        temp = $scope.fieldsTemp;
                    angular.forEach(temp, function (itemPage, page) {
                        if (!Array.isArray(itemPage))
                            itemPage = JSON.parse(itemPage);
                        angular.forEach(itemPage, function (item, key) {
                            if (!Array.isArray(temp[page]))
                                temp[page] = JSON.parse(temp[page]);
                            item.name = item.name.replace('-', '_');
                            if (DataService.isEmpty(item.className) || item.className == "") {
                                if (item.type == "autocomplete" || item.type == "date"
                                    || item.type == "number" || item.type == "select"
                                    || item.type == "text" || item.type == "textarea" || item.type == "text-with-input" || item.type == "file")
                                    item.className = "form-control";
                            }
                            temp[page][key] = item;
                        });
                    });
                    data = JSON.stringify(temp);
                }
                $scope.saveFormProperties(null, null, data);
                $('#controlImportModal').modal('hide');
            }, 500);
        }
        $('input#xlsFile').on('change', function (event) {
            var xlsfiles = event.target.files;
            $scope.importFormSettings.xlsfilesFileData = xlsfiles;
            //console.log(files);
            var oFReader = new FileReader();
            if (xlsfiles.length > 0) {
                $scope.importFormSettings.xlsFile = xlsfiles[0].name;
            } else {
                $scope.importFormSettings.xlsFile = "";
            }
        });
        $scope.uploadFileOnly = function (element, filename, response) {

            if (angular.isDefined(element)) {
                var fileData = element[0];
                var fd = new FormData();
                var reqType = "form";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                var formId = !DataService.isEmpty($stateParams.formId) ? $stateParams.formId.toString() : "0";
                if (!DataService.isEmpty(fileData)) {
                    fd.append('file', fileData, filename);
                    mainService.uploadFile("UploadFile", fd, reqType, uid, "", "", formId, "", false, userId)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                if (angular.isDefined(response.data)) {
                                    //$("input:hidden[name=" + id + "]").attr('value', "");
                                    if (response.data.code == 200) {
                                        //console.log("uploaded Successfully")
                                        $('#controlImportModal').modal('hide');
                                        // $("input:hidden[name=" + id + "]").attr('value', response.data.fileUrl);
                                    } else {
                                        notifierService.notifySweetAlertMessage('error', 'File', response.data.message);
                                    }
                                    $timeout(function () {
                                        $("#form_settingsModal").modal("hide");
                                        $(".modal-backdrop").removeClass("in");
                                        $("div").removeClass("modal-backdrop");
                                        $rootScope.$emit("HideLoading");
                                        if ($scope.isEditForm) {
                                            if (response.data.length > 0)
                                                $state.go('formEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });

                                        }
                                        else if ($scope.isEditTopic) {
                                            if (response.data.length > 0)
                                                $state.go('formTopicEdit', { 'edittopicId': response.data[0].topicId }, { reload: true, inherit: false });
                                        }
                                        else {
                                            if (response.data.length > 0)
                                                $state.go('formEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                        }
                                        $timeout(function () { window.location.reload(); }, 1000);

                                    }, 450);

                                    $rootScope.$emit("HideLoading");
                                }

                            }
                        }
                            , function (err) {
                                console.log("some error occured." + err);
                                $rootScope.$emit("HideLoading");
                            });
                }
            }
        }
        $scope.uploadFileOnlySpread = function (element, filename) {

            if (angular.isDefined(element)) {
                var fileData = element[0];
                var fd = new FormData();
                var reqType = "form";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                var formId = !DataService.isEmpty($stateParams.formId) ? $stateParams.formId.toString() : "0";
                fd.append('file', fileData, filename);
                mainService.uploadFile("UploadFile", fd, reqType, uid, "", "", formId, "", false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                //$("input:hidden[name=" + id + "]").attr('value', "");
                                if (response.data.code == 200) {
                                    //console.log("uploaded Successfully")
                                    $('#controlImportModal').modal('hide');
                                    // $("input:hidden[name=" + id + "]").attr('value', response.data.fileUrl);
                                } else {
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
        }

        function createFilePath(filename) {
            var path = "";
            path = mainService.getBaseUrl() + "uploadImages/users/" + $scope.userDetail.uid + "/form/" + $scope.importFormSettings.formId + "/" + filename;
            return path = "";
        };

        function bindBackgroundImage() {
            if (!DataService.isEmpty($scope.importFormSettings.formBackground)) {
                var path = mainService.getBaseUrl() + "uploadImages/users/" + $scope.userDetail.uid + "/form/" + $scope.importFormSettings.formId + "/" + $scope.importFormSettings.formBackground;
                $('img#uploadPreview').attr('src', path);
                $("img#uploadPreview").parent().removeClass("hidden");
            }
        }

        $('input#formBackground').on('change', prepareUpload);
        // Grab the files and set them to our variable
        function prepareUpload(event) {
            files = event.target.files;
            $scope.importFormSettings.formBackgroundFileData = files;
            //console.log(files);
            var oFReader = new FileReader();
            if (files.length > 0) {
                $scope.importFormSettings.formBackground = files[0].name;
            } else {
                $scope.importFormSettings.formBackground = "";
            }
            oFReader.readAsDataURL(files[0]);

            oFReader.onload = function (oFREvent) {
                document.getElementById("uploadPreview").src = oFREvent.target.result;
                $("#uploadPreview").parent().removeClass("hidden");
            };
        }
        $('body').on('click', '#removeBackground', function () {
            var isconfirm = confirm('Do you want to clear background?');
            if (isconfirm) {
                $('img#uploadPreview').attr('src', '');
                $("img#uploadPreview").parent().addClass("hidden");
                $("input#formBackground").val('');
                $scope.importFormSettings.formBackground = "";
                $scope.importFormSettings.formBackgroundFileData = [];
            }

        });
        $scope.saveFormProperties = function (inst, pages, fieldsData) {
            debugger;
            if (DataService.isEmpty($scope.importFormSettings.title)) {
                notifierService.notifyMessage('error', 'Form Setting ', "Form cannot be saved when form name is empty. Please go to Settings to input a form name.");
                $rootScope.$emit("HideLoading");
                return true;
            }
            if ($scope.importFormSettings.formType == "1" && ($scope.importFormSettings.groupID == undefined || $scope.importFormSettings.groupID == "" || $scope.importFormSettings.groupID == "0")) {

                notifierService.notifyMessage('error', 'Form Setting ', "Please select from group.");
                $rootScope.$emit("HideLoading");
                return false;
            }

            $rootScope.$emit("ShowLoading");
            if (angular.isDefined($scope.importFormSettings.screenModetype)) {
                var screen = [];
                if ($scope.importFormSettings.screenModetype == "custom") {
                    screen.push({ "screen": $scope.importFormSettings.screenModetype, "screenCustom": [{ "x": $scope.importFormSettings.screenX, "y": $scope.importFormSettings.screenY, "width": $scope.importFormSettings.screenWidth, "height": $scope.importFormSettings.screenHeight }] })
                } else {
                    screen.push({ "screen": $scope.importFormSettings.screenModetype, "screenCustom": [] })
                }
                $scope.importFormSettings.screenMode = JSON.stringify(screen);
            }
            $scope.importFormSettings.fields = fieldsData;

            $scope.importFormSettings.html = fieldsData;
            if (angular.isDefined($scope.topicId)) {
                $scope.importFormSettings.topicId = $scope.topicId;
                $scope.importFormSettings.max_records = 1000000;
            }

            //saveFormProperties1();
            var param = {};
            param = angular.copy($scope.importFormSettings);
            //console.log(param.informationFormLinkMode);

            if ($scope.isEditForm || $scope.isEditTopic) {
                param.action = 2;
                param.recordAccessSecurity = $scope.importFormSettings.recordAccessSecurity;
                param.recordAccessSecurity = JSON.stringify(param.recordAccessSecurity);
                if (Array.isArray(param.allowViewSummary))
                    param.allowViewSummary = JSON.stringify(param.allowViewSummary);
                if (Array.isArray(param.allowChat))
                    param.allowChat = JSON.stringify(param.allowChat);
                if (Array.isArray(param.allowNotification))
                    param.allowNotification = JSON.stringify(param.allowNotification);
                if (Array.isArray(param.allowEmailNotification))
                    param.allowEmailNotification = JSON.stringify(param.allowEmailNotification);
                if (Array.isArray(param.allowWhatsappNotification))
                    param.allowWhatsappNotification = JSON.stringify(param.allowWhatsappNotification);

            }
            else {
                var topicData = JSON.parse(localStorage.getItem("formModel"));
                if (angular.isDefined(topicData)) {
                    $scope.importFormSettings.topicId = topicData.topicId;
                    $scope.importFormSettings.applicationId = topicData.applicationId;
                    $scope.importFormSettings.topicName = topicData.topicName;
                    param.topicId = topicData.topicId;
                    param.applicationId = topicData.applicationId;
                    param.topicName = topicData.topicName;
                }


                param.action = 1;
                if (param.action == 1) {
                    param.recordAccessSecurity = {
                        "max_one_record_per_user": false,
                        "insert": {
                            "roles": ["0", "1", "2", "3"]
                        },
                        "own": { "view": true, "edit": true, "delete": true, "edit_time": null, "delete_time": null },
                        "other": { "edit_time": null, "view": true, "edit": true, "delete": true, "delete_time": null },
                        "ownRoleAccess":
                            [
                                {
                                    "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                                },
                                {
                                    "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                                },
                                {
                                    "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                                }
                            ],
                        "otherRoleAccess":
                            [
                                {
                                    "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                                },
                                {
                                    "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                                },
                                {
                                    "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                                }
                            ]
                    };
                    param.recordAccessSecurity = JSON.stringify(param.recordAccessSecurity);
                    param.allowViewSummary = ["0", "1", "2", "3"];
                    param.allowChat = ["0", "1", "2", "3"];
                    param.allowNotification = ["0", "1", "2", "3"];
                    param.allowEmailNotification = ["0", "1", "2", "3"];
                    param.allowWhatsappNotification = ["0", "1", "2", "3"]; 
                    param.allowViewSummary = JSON.stringify(param.allowViewSummary);
                    param.allowChat = JSON.stringify(param.allowChat);
                    param.allowNotification = JSON.stringify(param.allowNotification);
                    param.allowEmailNotification = JSON.stringify(param.allowEmailNotification);
                    param.allowWhatsappNotification = JSON.stringify(param.allowWhatsappNotification);


                }
                if ($scope.isEditForm && DataService.isEmpty(inst) && $scope.isEditTopic) {
                    param.action = 2;
                    param.recordAccessSecurity = $scope.importFormSettings.recordAccessSecurity;
                    param.allowViewSummary = $scope.importFormSettings.allowViewSummary;
                    param.allowChat = $scope.importFormSettings.allowChat;
                    param.allowNotification = $scope.importFormSettings.allowNotification;
                    param.allowEmailNotification = $scope.importFormSettings.allowEmailNotification;
                    param.allowWhatsappNotification = $scope.importFormSettings.allowWhatsappNotification;
                }
                $scope.importFormSettings.status = 1;
                $scope.importFormSettings.template = true;
            }
            $scope.importFormSettings.formName = $scope.importFormSettings.title;
            if (angular.isDefined($scope.importFormSettings.xlsfilesFileData)) {
                var exten = getExt($scope.importFormSettings.xlsfilesFileData[0].name);
                $scope.importFormSettings.xlsFile = $scope.importFormSettings.xlsxFileName + "." + exten;
                $scope.uploadFileOnlySpread($scope.importFormSettings.xlsfilesFileData, $scope.importFormSettings.xlsFile);
            }
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.currentFormType = 0;

            

            if ($scope.filerCriteriaFormDetails.formTabulatorTheme != '' &&  $scope.filerCriteriaFormDetails.MapMarkerControlDescriptionDeppendFields != '') {
                param.formSettings = { "tabulator": { "format": "columns", "theme": $scope.filerCriteriaFormDetails.formTabulatorTheme, "MapMarkerControlDescriptionDeppendFields": $scope.filerCriteriaFormDetails.MapMarkerControlDescriptionDeppendFields } } ;
            }
            else if ($scope.filerCriteriaFormDetails.formTabulatorTheme != '' && $scope.filerCriteriaFormDetails.MapMarkerControlDescriptionDeppendFields == '') {
                param.formSettings = { "tabulator": { "format": "columns", "theme": $scope.filerCriteriaFormDetails.formTabulatorTheme, "MapMarkerControlDescriptionDeppendFields":"" } };
            }           

            else {
                param.formSettings = { "tabulator": { "format": "columns", "theme": "tabulator.min.css","MapMarkerControlDescriptionDeppendFields":"" } };
            }
            param.formSettings = JSON.stringify(param.formSettings);

            param.calenderSettingsList = [];
            if (!DataService.isEmpty($scope.importFormSettings.resourceSettingsList))
                if ($scope.importFormSettings.resourceSettingsList.length > 0) {

                    if ($scope.importFormSettings.resourceSettingsList.length == 1) {
                        var formidTemp = $scope.importFormSettings.resourceSettingsList[0].resourceForm != "" ? parseInt($scope.importFormSettings.resourceSettingsList[0].resourceForm) : 0;
                        var exists = _.findWhere($scope.ResourceForms, { formId: formidTemp });
                        if (!DataService.isEmpty(exists)) {
                            $scope.importFormSettings.resourceForm = $scope.importFormSettings.resourceSettingsList[0].resourceForm;
                            $scope.importFormSettings.eventOverlap = $scope.importFormSettings.resourceSettingsList[0].eventOverlap;
                            if ($scope.importFormSettings.resourceSettingsList[0].majorGroup.length > 0) {
                                if ($scope.importFormSettings.resourceSettingsList[0].majorGroup.toString().contains('\\')) {
                                    // $scope.importFormSettings.majorGroup="";
                                } else
                                    $scope.importFormSettings.majorGroup = JSON.stringify($scope.importFormSettings.resourceSettingsList[0].majorGroup);
                            }
                            $scope.importFormSettings.minorGroup = $scope.importFormSettings.resourceSettingsList[0].minorGroup;
                        }
                        else {
                            $scope.importFormSettings.resourceForm = "0";
                            $scope.importFormSettings.resourceSettingsList.splice(0, 1);
                        } if ($scope.importFormSettings.resourceSettingsList.length > 0)
                            $scope.importFormSettings.resourceSettingsList[0].IsDefault = true;
                    }
                    else {
                        var defaultExist = _.findWhere($scope.importFormSettings.resourceSettingsList, { IsDefault: true });
                        if (!DataService.isEmpty(defaultExist)) {
                            $scope.importFormSettings.resourceForm = defaultExist.resourceForm;
                            $scope.importFormSettings.eventOverlap = defaultExist.eventOverlap;
                            if (defaultExist.majorGroup.length > 0) {
                                // $scope.importFormSettings.majorGroup = defaultExist.majorGroup[0];
                                $scope.importFormSettings.majorGroup = JSON.stringify(defaultExist.majorGroup);
                            }
                            $scope.importFormSettings.minorGroup = defaultExist.minorGroup;
                        } else {
                            if ($scope.importFormSettings.resourceSettingsList.length > 0)
                                $scope.importFormSettings.resourceSettingsList[0].IsDefault = true;
                        }
                    }
                    _.each($scope.importFormSettings.resourceSettingsList, function (item) {
                        if (item.majorGroup.length > 0) {
                            item.majorGroup = JSON.stringify(item.majorGroup);
                        }
                        else {
                            item.majorGroup = JSON.stringify(item.majorGroup);
                        }

                        //if (!DataService.isEmpty(item.minTime) && item.minTime != "Invalid date"){
                        //  item.minTime = moment(item.minTime).format("HH:mm");
                        //}            
                        //else{
                        //    if (DataService.isEmpty(item.minTime)){
                        //    }else
                        //    item.minTime="";

                        //    }
                        //if (!DataService.isEmpty(item.maxTime1) && item.maxTime1 != "Invalid date"){
                        //    item.maxTime = moment(item.maxTime1).format("HH:mm");
                        //}                    
                        //else{
                        //    if (DataService.isEmpty(item.maxTime1)) {
                        //    } else
                        //    item.maxTime = "";
                        //    }
                        //var t = "13:56";
                        //var cdt = moment(t, 'HH:mm');   
                        param.calenderSettingsList.push(item);
                    });
                }
            if (!DataService.isEmpty($scope.importFormSettings.activitiesSettingsList))
                if ($scope.importFormSettings.activitiesSettingsList.length > 0) {
                    if ($scope.importFormSettings.activitiesSettingsList.length == 1) {
                        var formidTemp = $scope.importFormSettings.activitiesSettingsList[0].activitiesForm != "" ? parseInt($scope.importFormSettings.activitiesSettingsList[0].activitiesForm) : 0;
                        var exists = _.findWhere($scope.ActivityForms, { formId: formidTemp });
                        if (!DataService.isEmpty(exists)) {
                            $scope.importFormSettings.activitiesForm = $scope.importFormSettings.activitiesSettingsList[0].activitiesForm;
                            $scope.importFormSettings.activitiesOverlap = $scope.importFormSettings.activitiesSettingsList[0].activitiesOverlap;
                            $scope.importFormSettings.activities = $scope.importFormSettings.activitiesSettingsList[0].activities;
                            $scope.importFormSettings.activitiesCategory = $scope.importFormSettings.activitiesSettingsList[0].activitiesCategory;
                            $scope.importFormSettings.durationField = $scope.importFormSettings.activitiesSettingsList[0].durationField;
                            $scope.importFormSettings.colorField = $scope.importFormSettings.activitiesSettingsList[0].colorField;
                            $scope.importFormSettings.overlapField = $scope.importFormSettings.activitiesSettingsList[0].overlapField;
                        }
                        else {
                            $scope.importFormSettings.activitiesForm = "0";
                            $scope.importFormSettings.activitiesSettingsList.splice(0, 1);
                        } if ($scope.importFormSettings.activitiesSettingsList.length > 0)
                            $scope.importFormSettings.activitiesSettingsList[0].IsDefault = true;
                    } else {
                        var defaultExist = _.findWhere($scope.importFormSettings.activitiesSettingsList, { IsDefault: true });
                        if (!DataService.isEmpty(defaultExist)) {
                            $scope.importFormSettings.activitiesForm = defaultExist.activitiesForm;
                            $scope.importFormSettings.activitiesOverlap = defaultExist.activitiesOverlap;
                            $scope.importFormSettings.activities = defaultExist.activities;
                            $scope.importFormSettings.activitiesCategory = defaultExist.activitiesCategory;
                            $scope.importFormSettings.durationField = defaultExist.durationField;
                            $scope.importFormSettings.colorField = defaultExist.colorField;
                            $scope.importFormSettings.overlapField = defaultExist.overlapField;
                        } else {
                            if ($scope.importFormSettings.activitiesSettingsList.length > 0)
                                $scope.importFormSettings.activitiesSettingsList[0].IsDefault = true;
                        }
                    }
                    _.each($scope.importFormSettings.activitiesSettingsList, function (item) {
                        //item.isVisible = !DataService.isEmpty(item.isVisible) ? item.isVisible=="1"?true:false:true;
                        param.calenderSettingsList.push(item);
                    });
                }
            param.isMultipleCalenderSettings = false;
            if (param.calenderSettingsList.length > 2) {
                param.isMultipleCalenderSettings = true;
            }

            if (!DataService.isEmpty($scope.importFormSettings.otherFormFieldName)) {
                if (!DataService.isEmpty($scope.importFormSettings.otherFormFieldName)) {
                    param.otherFormFieldName = JSON.stringify($scope.importFormSettings.otherFormFieldName);
                }
                else if ($scope.importFormSettings.otherFormFieldName.length == 0) {
                    param.otherFormFieldName = JSON.stringify($scope.importFormSettings.otherFormFieldName);
                }
            }
            else {
                param.otherFormFieldName = JSON.stringify([]);
            }

            if (!DataService.isEmpty($scope.importFormSettings.topicTitle))
                $scope.importFormSettings.topicName = $scope.importFormSettings.topicTitle;
            debugger;
            dynamicTableCreation(param);
            //console.log('hi blocked');
            //return false;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            notifierService.notifyMessage('success', 'Form Setting', response.data[0].Message);
                            if (angular.isDefined($scope.importFormSettings.formBackgroundFileData)) {
                                $scope.uploadFileOnly($scope.importFormSettings.formBackgroundFileData, $scope.importFormSettings.formBackground, response);
                            }
                            else {
                                $timeout(function () {
                                    $("#form_settingsModal").modal("hide");
                                    $(".modal-backdrop").removeClass("in");
                                    $("div").removeClass("modal-backdrop");
                                    $rootScope.$emit("HideLoading");
                                    if ($scope.isEditForm) {
                                        $state.go('formEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });

                                    }
                                    else if ($scope.isEditTopic) {

                                        $state.go('formTopicEdit', { 'edittopicId': response.data[0].topicId }, { reload: true, inherit: false });
                                    }
                                    else {
                                        $state.go('formEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                    }
                                    $timeout(function () { window.location.reload(); }, 1000);

                                }, 450);
                            }

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.updateTopic = function () {
            //console.log($scope.importFormSettings, 'topic');
            var paramTopicSettings = {};
            $scope.importFormSettings.action = 2;
            paramTopicSettings = $scope.importFormSettings;
            $scope.manageTopic(paramTopicSettings)

        }
        $scope.manageTopic = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.manageTopic("ManageTopic", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            var exists = {};
                            exists = response.data[0];
                            if (exists.res == 1)
                                notifierService.notifyMessage('success', 'topic', exists.Message);
                            else
                                notifierService.notifyMessage('error', 'topic', exists.Message);
                            $('#form_settingsModalTopic').modal('hide');
                        }
                    }
                    $rootScope.$emit("HideLoading");

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        function generateQuery(dataFields) {
            var result = "";
            var temp = angular.copy(dataFields);

            if (!DataService.isEmpty(temp.fields)) {
                var pagelist = JSON.parse(temp.fields);
                var tableColumnList = [];
                var isKanban = false;
                angular.forEach(pagelist, function (itemPage, keyPage) {
                    if (!Array.isArray(itemPage))
                        itemPage = JSON.parse(itemPage);
                    angular.forEach(itemPage, function (item, key) {
                        var columnName = "";
                        if (item.type != "header" && item.type != "line" && item.type != "button") {
                            if (item.type == "textarea" || item.type == "signature" || item.type == "table" || item.type == "tinyMCE-content") {
                                // result += " [" + item.name + "] nvarchar(max) null,"
                                columnName = " " + replaceColumn(item.name) + " nvarchar(max) null,";
                                var exists = _.findWhere(tableColumnList, { "name": replaceColumn(item.name) });
                                if (DataService.isEmpty(exists)) {
                                    tableColumnList.push({ "name": replaceColumn(item.name) });
                                    result += columnName;
                                }

                            }
                            else {
                                //result += " [" + item.name + "] nvarchar(500) null,"
                                if (item.type == "number") {

                                    columnName = " " + replaceColumn(item.name) + "    FLOAT ,"

                                    var exists = _.findWhere(tableColumnList, { "name": replaceColumn(item.name) });
                                    if (DataService.isEmpty(exists)) {
                                        tableColumnList.push({ "name": replaceColumn(item.name) });
                                        result += columnName;
                                    }
                                }
                                else if (item.type == "date") {
                                    columnName = " " + replaceColumn(item.name) + " nvarchar(100) null ,"
                                    var exists = _.findWhere(tableColumnList, { "name": replaceColumn(item.name) });
                                    if (DataService.isEmpty(exists)) {
                                        tableColumnList.push({ "name": replaceColumn(item.name) });
                                        result += columnName;
                                    }
                                }
                                else {
                                    columnName = " " + replaceColumn(item.name) + " nvarchar(500) null,"
                                    var exists = _.findWhere(tableColumnList, { "name": replaceColumn(item.name) });
                                    if (DataService.isEmpty(exists)) {
                                        tableColumnList.push({ "name": replaceColumn(item.name) });
                                        result += columnName;
                                    }
                                }
                            }
                            if (item.types == "Is_Kanban_Status" && isKanban == false) {
                                isKanban = true;
                                columnName = " kanban_order   FLOAT ,"
                                result += columnName;

                            }
                        }

                    });
                });
                // result = result.substring(0, result.length - 1);
                // result += ")";
                //result += " waitingStatus_Queue int default 1,"
            }
            return result;
        }
        function dynamicTableCreation(dataParam) {           
            var paramTable = {};
            paramTable = angular.copy(dataParam);
            paramTable.action = 1;
            if ($scope.isEditForm || $scope.isEditTopic) {
                paramTable.action = 2;
            }
            paramTable.fields = generateQuery(dataParam);
            if (!DataService.isEmpty(paramTable.calenderSettingsList)) {
                var tempList = [];
                var formResActID = 0;
                _.each(paramTable.calenderSettingsList, function (item, key) {
                    if (item.resourceForm != 0 && item.resourceForm != "0" && item.resourceForm != "") {
                        var exist = _.findWhere(tempList, item.resourceForm);
                        if (DataService.isEmpty(exist)) {
                            tempList.push(item.resourceForm)
                            formResActID = item.resourceForm;
                            if (!DataService.isEmpty(formResActID))
                                paramTable.fields += " resForm_" + formResActID + " nvarchar(100) null, ";

                        }
                    }
                    else if (item.activitiesForm != 0 && item.activitiesForm != "0" && item.activitiesForm != "") {
                        var exist = _.findWhere(tempList, item.activitiesForm);
                        if (DataService.isEmpty(exist)) {
                            tempList.push(item.activitiesForm)
                            formResActID = item.activitiesForm;
                            if (!DataService.isEmpty(formResActID))
                                paramTable.fields += " resForm_" + formResActID + " nvarchar(100) null, ";
                        }
                    }

                });
                if (formResActID != 0 && !DataService.isEmpty(formResActID)) {
                    paramTable.fields += " actFormID int null, parentID int null,seperatedFormIDs nvarchar(100) null,seperatedTitles  nvarchar(max) null,seperatedIds  nvarchar(100) null,seperatedResFormIDs  nvarchar(200) null,seperatedResEntryIDs  nvarchar(200) null,                    seperatedResColValues  nvarchar(200) null,                      seperatedColorValues  nvarchar(200) null,";
                }
            }
            //console.log(paramTable.html, '20NOV')
            var str1 = JSON.parse(paramTable.html);
            var obj = Object.values(str1);
            var a = JSON.parse(Object.values(obj)[0])
            //console.log(' asdgsdg', a, 'str', str1);
            var checkcontrol = JSON.parse(Object.values(obj)[0]).filter(x => x.type == "PayPal");
            paramTable.PPControl = false;
            if (checkcontrol.length > 0) {
                //console.log('checkcontrol', checkcontrol.length);
                paramTable.PPControl = true;
            }
            mainService.generateForm("GenerateForm", paramTable)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            notifierService.notifyMessage('success', 'Form Table Creations', response.data[0].Message);
                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        function saveFormProperties1() {
            //console.log(fbInstances)
            // console.log(fbInstancePages)
        }
        function getExt(filename) {
            var ext = filename.split('.').pop();
            if (ext == filename) return "";
            return ext;
        }
        $scope.removeExcel = function () {
            $scope.importFormSettings.xlsFile = "";
            $scope.importFormSettings.xlsxFileName = "";
            $scope.isSpeadSheetFileUrl = false;
        };
        $scope.getFormSettings = function (formId) {
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.action = 4;
            param.formId = formId;

            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {

                    if (response.data != null && angular.isDefined(response.data)) {
                        var frmDataCheck = response.data;
                        if (frmDataCheck.PlanExpired == 1) {
                            notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', frmDataCheck.Message, 'topic');
                            $rootScope.$emit("HideLoading");
                            return false;
                        }
                        if (response.data.length > 0) {
                            $scope.importFormSettings = response.data[0];
                            $scope.IsFreePlan = $scope.importFormSettings.IsFreePlan;
                            //console.log($scope.importFormSettings.IsFreePlan,'IsFreePlan');
                            //console.log($scope.importFormSettings.NotifyEmailOnAction,'NotifyEmailOnAction');
                            //console.log($scope.importFormSettings.NotifyOnAction,'NotifyOnAction');
                            if ($scope.importFormSettings.res == 5001) {
                                notifierService.notifyMessage('warning', 'Form Access Rights', $scope.importFormSettings.Message);
                                $timeout(function () {
                                    $state.go("Home");
                                }, 750);
                                return false;
                            }
                            $('#selectFormIcon').val($scope.importFormSettings.formIcon);
                            $('#selectFormIcon').selectpicker('refresh');
                            bindBackgroundImage();
                            //console.log($scope.importFormSettings, 'form settins')
                            $scope.calenderTabClick();

                            $scope.importFormSettings.entryUrl = mainService.getBaseUrl() + "/#/form/saveEntry/" + $scope.importFormSettings.formId + "?check=anonymous";

                            //$scope.getSelectedResourceForms($scope.importFormSettings.otherformid);
                            if ($scope.importFormSettings.calenderSettingsList == 0) {
                                if ($scope.importFormSettings.activitiesForm != 0) {
                                    var activityForm = {};
                                    activityForm.title = $scope.importFormSettings.activitiesFormName;
                                    activityForm.activitiesForm = $scope.importFormSettings.activitiesForm;
                                    activityForm.activitiesOverlap = $scope.importFormSettings.activitiesOverlap;
                                    activityForm.activities = $scope.importFormSettings.activities;
                                    activityForm.activitiesCategory = $scope.importFormSettings.activitiesCategory;
                                    activityForm.durationField = $scope.importFormSettings.durationField;
                                    activityForm.overlapField = $scope.importFormSettings.overlapField;
                                    activityForm.IsDefault = $scope.importFormSettings.IsDefault;
                                    $scope.importFormSettings.calenderSettingsList.push(activityForm);
                                }
                                if (($scope.importFormSettings.toDate_field != null && $scope.importFormSettings.fromDate_field != null) && ($scope.importFormSettings.toDate_field != '' && $scope.importFormSettings.fromDate_field != '')) {
                                    $scope.importFormSettings.basicCalendar_active = 'true';
                                }
                                else {
                                    $scope.importFormSettings.basicCalendar_active = 'false';
                                }
                                if ($scope.importFormSettings.resourceForm != 0) {
                                    var resourceForm = {};
                                    resourceForm.title = $scope.importFormSettings.resourceFormName;
                                    resourceForm.resourceForm = $scope.importFormSettings.resourceForm;
                                    resourceForm.eventOverlap = $scope.importFormSettings.eventOverlap;
                                    resourceForm.majorGroup = $scope.importFormSettings.majorGroup;
                                    resourceForm.minorGroup = $scope.importFormSettings.minorGroup;
                                    resourceForm.IsDefault = $scope.importFormSettings.IsDefault;
                                    $scope.importFormSettings.calenderSettingsList.push(resourceForm);
                                }

                            }
                            //console.log($scope.importFormSettings);
                            if (!DataService.isEmpty($state.current.ncyBreadcrumb)) {
                                if ($scope.isEditTopic)
                                    $state.current.ncyBreadcrumb.label = "Edit Topic - " + $scope.importFormSettings.title;
                                else
                                    $state.current.ncyBreadcrumb.label = "Edit Form - " + $scope.importFormSettings.title;
                                $state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
                            }
                            $rootScope.safeApply();
                            //$scope.importFormSettings.activitiesForm = parseInt($scope.importFormSettings.activitiesForm);
                            //$scope.importFormSettings.majorGroup = parseInt($scope.importFormSettings.majorGroup);
                            //$scope.importFormSettings.minorGroup = parseInt($scope.importFormSettings.minorGroup);
                            $scope.importFormSettings.formName = $scope.importFormSettings.title;
                            $scope.importFormSettings.screenModeTemp = JSON.parse($scope.importFormSettings.screenMode);
                            if (!DataService.isEmpty($scope.importFormSettings.screenModeTemp))
                                if ($scope.importFormSettings.screenModeTemp.length > 0) {
                                    $scope.importFormSettings.screenModetype = $scope.importFormSettings.screenModeTemp[0].screen;
                                    if ($scope.importFormSettings.screenModeTemp[0].screenCustom.length > 0) {
                                        $scope.importFormSettings.screenX = $scope.importFormSettings.screenModeTemp[0].screenCustom[0].x;
                                        $scope.importFormSettings.screenY = $scope.importFormSettings.screenModeTemp[0].screenCustom[0].y;
                                        $scope.importFormSettings.screenWidth = $scope.importFormSettings.screenModeTemp[0].screenCustom[0].width;
                                        $scope.importFormSettings.screenHeight = $scope.importFormSettings.screenModeTemp[0].screenCustom[0].height;
                                        $scope.screenChange();
                                    }
                                }
                            if (angular.isDefined($scope.importFormSettings.formType))
                                $scope.importFormSettings.formType = $scope.importFormSettings.formType.toString();
                            if (angular.isDefined($scope.importFormSettings.groupID))
                                $scope.importFormSettings.groupID = $scope.importFormSettings.groupID.toString();
                            if (angular.isDefined($scope.importFormSettings.status))
                                $scope.importFormSettings.status = $scope.importFormSettings.status.toString();
                            if (!DataService.isEmpty($scope.importFormSettings.xlsxFileName) || !DataService.isEmpty($scope.importFormSettings.xlsFile)) {
                                $scope.isSpeadSheetFileUrl = true;

                                var exten = getExt($scope.importFormSettings.xlsFile);
                                $scope.importFormSettings.xlsFile = $scope.importFormSettings.xlsxFileName + "." + exten;
                                $scope.getWorkSheetList($scope.importFormSettings.xlsFile);
                                $scope.speadSheetFileUrl = mainService.getBaseUrl() + "uploadImages/users/" + $scope.userDetail.uid + "/form/" + $scope.importFormSettings.formId + "/" + $scope.importFormSettings.xlsFile;

                            }
                            else {
                                //$timeout(function () {
                                //    loadFormCustom();
                                //}, 250);
                            }
                            if (angular.isDefined($scope.importFormSettings.applicationId)) {
                                var param = {};
                                param.action = 8;
                                param.applicationId = $scope.importFormSettings.applicationId;
                                $scope.getReferenceFormList(param);
                                //console.log($scope.basicCalendar, 'DDDDDD')
                                var param2 = {};
                                param2.activitiesForm = $scope.importFormSettings.activitiesForm;
                                param2.resourceForm = $scope.importFormSettings.resourceForm;
                                param2.action = 16;
                                mainService.manageGroups("getControls", param2).then(function (response) {
                                    if (response.data != null && angular.isDefined(response.data)) {
                                        var activityControls = response.data.activityControls;
                                        var resourceControls = response.data.resourceControls;
                                        $scope.getControls(activityControls, 'Activity');
                                        $scope.getControls(resourceControls, 'Resource');

                                    }
                                });
                                $scope.setInfoddl();
                                // $scope.GetResourceForms(param, 'applicationId')
                            }


                            /*record access controls*/
                            if (response.data.length > 0) {
                                $scope.filerCriteriaFormDetails = response.data[0];
                                loadDefaultOwnOtherAccessRights();

                                if (DataService.isEmpty($scope.filerCriteriaFormDetails.notificationDetails)) {
                                    $scope.filerCriteriaFormDetails.notificationDetails = true;//true;
                                }
                                else {
                                    $scope.filerCriteriaFormDetails.notificationDetails =
                                        ($scope.filerCriteriaFormDetails.notificationDetails == "true") ? true : false;
                                }
                                bindAllGeneralSetting();
                                //console.log($scope.filerCriteriaFormDetails);
                                $scope.filerCriteriaFormDetails.formName = $scope.filerCriteriaFormDetails.title;
                                $scope.filerCriteriaFormDetails.screenModeTemp = JSON.parse($scope.filerCriteriaFormDetails.screenMode);

                                if (!DataService.isEmpty($scope.filerCriteriaFormDetails.screenModeTemp))
                                    if ($scope.filerCriteriaFormDetails.screenModeTemp.length > 0) {
                                        $scope.filerCriteriaFormDetails.screenModetype = $scope.filerCriteriaFormDetails.screenModeTemp[0].screen;
                                        if ($scope.filerCriteriaFormDetails.screenModeTemp[0].screenCustom.length > 0) {
                                            $scope.filerCriteriaFormDetails.screenX = $scope.filerCriteriaFormDetails.screenModeTemp[0].screenCustom[0].x;
                                            $scope.filerCriteriaFormDetails.screenY = $scope.filerCriteriaFormDetails.screenModeTemp[0].screenCustom[0].y;
                                            $scope.filerCriteriaFormDetails.screenWidth = $scope.filerCriteriaFormDetails.screenModeTemp[0].screenCustom[0].width;
                                            $scope.filerCriteriaFormDetails.screenHeight = $scope.filerCriteriaFormDetails.screenModeTemp[0].screenCustom[0].height;

                                        }
                                    }
                                if (!DataService.isEmpty($scope.filerCriteriaFormDetails.formSettings)) {
                                    if (!Array.isArray($scope.filerCriteriaFormDetails.formSettings))
                                        $scope.filerCriteriaFormDetails.formSettings = JSON.parse($scope.filerCriteriaFormDetails.formSettings);
                                } else {
                                    $scope.filerCriteriaFormDetails.formSettings = { "tabulator": { "format": "columns", "theme": "tabulator.min.css","MapMarkerControlDescriptionDeppendFields":"" } };
                                }
                                $scope.filerCriteriaFormDetails.formTabulatorTheme = $scope.filerCriteriaFormDetails.formSettings.tabulator.theme;
                                $scope.filerCriteriaFormDetails.MapMarkerControlDescriptionDeppendFields = $scope.filerCriteriaFormDetails.formSettings.tabulator.MapMarkerControlDescriptionDeppendFields;


                                if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity)) {
                                    if (!Array.isArray($scope.filerCriteriaFormDetails.recordAccessSecurity)) {
                                        var isJson = IsJsonString($scope.filerCriteriaFormDetails.recordAccessSecurity);
                                        if (isJson)
                                            $scope.filerCriteriaFormDetails.recordAccessSecurity = JSON.parse($scope.filerCriteriaFormDetails.recordAccessSecurity);
                                        else {
                                            $scope.filerCriteriaFormDetails.recordAccessSecurity += "}}";
                                            $scope.filerCriteriaFormDetails.recordAccessSecurity = JSON.parse($scope.filerCriteriaFormDetails.recordAccessSecurity);
                                        }
                                        if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity.insert)) {
                                            $scope.filerCriteriaFormDetails.allowRoles = true;
                                            _.each($scope.filerCriteriaFormDetails.recordAccessSecurity.insert.roles, function (item) {
                                                if (item == "0")
                                                    $scope.filerCriteriaFormDetails.roles0 = true;
                                                if (item == "1")
                                                    $scope.filerCriteriaFormDetails.roles1 = true;
                                                if (item == "2")
                                                    $scope.filerCriteriaFormDetails.roles2 = true;
                                                if (item == "3")
                                                    $scope.filerCriteriaFormDetails.roles3 = true;
                                            });

                                        }

                                        if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity.ownRoleAccess)) {
                                            $scope.filerCriteriaFormDetails.ownRoleAccess = $scope.filerCriteriaFormDetails.recordAccessSecurity.ownRoleAccess;
                                        }
                                        if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity.otherRoleAccess)) {
                                            $scope.filerCriteriaFormDetails.otherRoleAccess = $scope.filerCriteriaFormDetails.recordAccessSecurity.otherRoleAccess;
                                        }
                                    }
                                }
                                else {

                                    $scope.filerCriteriaFormDetails.recordAccessSecurity = {
                                        "max_one_record_per_user": false,
                                        "insert": {
                                            "roles": ["0", "1", "2", "3"],
                                        },
                                        "own": { "view": "true", "edit": "true", "delete": "true", "edit_time": "", "delete_time": "" },
                                        "ownRoleAccess":
                                            [
                                                {
                                                    "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                                                },
                                                {
                                                    "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                                                },
                                                {
                                                    "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                                                }
                                            ],
                                        "other": { "view": "true", "edit": "true", "delete": "true", "edit_time": "", "delete_time": "" },
                                        "otherRoleAccess":
                                            [
                                                {
                                                    "role": 0, "name": "General User", "access": { "view": true, "edit": true, "delete": true }
                                                },
                                                {
                                                    "role": 1, "name": "Supervisor", "access": { "view": true, "edit": true, "delete": true }
                                                },
                                                {
                                                    "role": 2, "name": "Admin", "access": { "view": true, "edit": true, "delete": true }
                                                }
                                            ]


                                    };
                                    $scope.filerCriteriaFormDetails.allowRoles = true;
                                }
                            }



                        }
                    }
                    // $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };
        $scope.getWorkSheetList = function (filename) {
            var reqType = "form";
            var uid = $scope.userDetail.uid;
            var userId = $scope.userDetail.Id;
            var formId = !DataService.isEmpty($stateParams.formId) ? $stateParams.formId.toString() : "0";
            mainService.getWorkSheetList("GetFileSheetNames", filename, reqType, uid, formId, userId)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        $scope.sheetListData = response.data;

                        var result = {};

                        for (var i = 0; i < $scope.sheetListData.length; i++) {
                            result[$scope.sheetListData[i].value] = $scope.sheetListData[i].value;
                        }
                        window["worksheets"] = result;

                        window.worksheets = result;
                        localStorage.setItem("worksheets", JSON.stringify(result));

                        $timeout(function () {
                            //loadFormCustom();
                            //loadcssjsfile("assets/js/code/init-form-builder.js", "js", "form-builder");
                            loadcssjsfile("newAssets/formbuilder/js/init-form-builder.js", "js", "form-builder");
                        }, 190);
                        //loadFormCustom();


                    }
                }, function (err) {
                    //loadFormCustom();
                    console.log("some error occured." + err);
                });
        };
        function loadFormCustom() {
            //loadcssjsfile("assets/js/code/init-form-builder.js", "js", "form-builder");
            loadcssjsfile("newAssets/formbuilder/js/init-form-builder.js", "js", "form-builder");
            var formData = JSON.parse($scope.importFormSettings.fields);
            $timeout(function () {
                _.each(formData, function (pagesData, key) {
                    if (!Array.isArray(pagesData))
                        formData[key] = JSON.parse(pagesData);
                    _.each(formData[key], function (item) {
                        if (angular.isDefined(item.values)) {
                            if (!Array.isArray(item.values) && item.values.length > 0)
                                item.values = JSON.parse(item.values);
                            if (!Array.isArray(item.values) && item.values.length > 0)
                                item.values = JSON.parse(item.values);

                        }
                    });
                });

            }, 150);
            $timeout(function () {
                $scope.formBind(formData, 2);
            }, 250);
        }
        $scope.screenChange = function () {
            $('div#shwCustomScreen').addClass('hidden');
            if ($scope.importFormSettings.screenModetype == "custom") {
                $('div#shwCustomScreen').removeClass('hidden');
            }
        }
        $scope.getFormGroupDetails = function () {
            var param = {};
            param.action = 9;
            param.userId = $scope.userDetail.Id;
            param.SelectedformId = $stateParams.formId;
            mainService.manageGroupUsers("ManageUserGroup", param)
                .then(function (response) {
                    if (response.data.length) {
                        $scope.formrole = response.data[0].userRole;
                    }
                    //console.log($scope.formroles,'ManageUserGroup')

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);

                });
        }
        //$(document).on('click', 'input.table_referrence', function () {
        //    var $this = $(this);
        //    var name = $this.attr('name');
        //    $scope.referral_Forms= window["Referral_Forms"];
        //    $scope.referral_Fields=[];
        //    //$scope.referral_Fields = window["Referral_Fields"];   
        //   $ngBootbox.customDialog({
        //        templateUrl: 'tableReferrence.html',
        //        scope: $scope,
        //        title: 'Table Referrence',
        //        size: "large",
        //        className: 'modal2Xlarge',
        //        closeButton: false
        //    });  

        //    $timeout(function () {
        //        $('#tableReferrence form').on('submit', function (e) {
        //            e.preventDefault();
        //            var referenceInputs = $(this).serializeArray();
        //            console.log(referenceInputs);
        //            var controlDiv = $('#tableReferrence form input#controlDiv').val().trim();
        //            referenceInputs.forEach(function (field) {
        //                var value = field.value;
        //                if (field.value == '0') { value = ''; }
        //                $('#' + controlDiv).find('input[name="' + field.name + '"]').val(value).change();
        //                $('#' + controlDiv).find('input[name="' + field.name + '"]').parents('div.form-group').removeClass('hidden');
        //            });


        //            $('#tableReferrence').modal('hide');
        //        });

        //    },250);

        //});

        $scope.onchangeForms = function () {
            var $formField = $("#tableReferrence form select.Forms");

            var formId = $formField.val();
            $scope.referral_Fields = [];
            var disabled = (formId === '0') ? true : false;
            if (typeof Referral_Forms_Fields[formId] !== 'undefined') {
                var optData = Referral_Forms_Fields[formId];
                _.each(optData, function (item, key) {
                    $scope.referral_Fields.push({ key, value: item });
                });
                // $scope.referral_Fields = optData;
            }
        };



        $('#formProperties').on('submit', function (event) {

            $rootScope.$emit("ShowLoading");
            event.stopPropagation(); // Stop stuff happening
            event.preventDefault(); // Totally stop stuff happening

            var allData = fbInstances.map(function (fb) {
                return fb.formData;
            });

            var formField = {};
            $.each(fbInstancePages, function (i, value) {
                //formField[fbInstancePages[i]] = allData[i];
                formField[fbInstancePages[i]] = convertNewJsonControlsToOldControlsFormat(allData[i]);
            });

            var formHtml = $("#fb-rendered-form > form").html();
            /*var formData = $(this).serializeArray();
            formData.push({name: 'formField', value: JSON.stringify(formField)});
            formData.push({name: 'formHtml', value: formHtml});*/

            var data = new FormData(this);
            data.append('formField', JSON.stringify(formField));
            data.append('formHtml', formHtml);
            $.each(files, function (key, value) {
                data.append('formBackground', value);
            });
            //_.map(formField, function (pagesData) {
            //    _.map(pagesData, function (item) {
            //        item = JSON.stringify(item);
            //    })
            //});
            //_.each(formField, function (pagesData) {
            //    _.each(pagesData, function (item) {
            //        if (angular.isDefined(item.values))
            //            item.values = JSON.stringify(item.values);
            //    })
            //});
            //var data = JSON.parse(JSON.stringify($scope.fieldsTemp))
            //formField = JSON.stringify(formField)


            $timeout(function () {
                $scope.saveFormProperties(fbInstances, fbInstancePages, JSON.stringify(formField));
            }, 150);

            //console.log(data);

            //showLoader('#formProperties .tab-content');

            //$.ajax({
            //    type: "POST",
            //    url: "api/FormAPI/ManageApplication",
            //    data: $.param(formData),
            //    data: data,
            //    dataType: 'json',
            //    cache: false,
            //    processData: false, // Don't process the files
            //    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            //    /*success: function( lastInsetedID ) {
            //        if(lastInsetedID === ""){
            //            alert("Form settings could not be saved!");
            //        }else{
            //            //alert("Form settings saved successfully!");
            //            window.location.href = "<?= URL::to('subforms/edit'); ?>/"+lastInsetedID;
            //        }
            //    },*/
            //    success: function (response, textStatus, jqXHR) {
            //        if (response.code) {
            //            swal({
            //                type: 'success', html: response.message, timer: 5000, showConfirmButton: false, onClose: () => {
            //                    window.location.href = "/" + response.id;
            //                }
            //            });
            //        } else {
            //            alert(response.message);
            //        }
            //    },
            //    complete: function () { $("#formProperties .tab-content").unblock(); }
            //});
        });
        var $formContainer = $("#fb-rendered-form");
        //console.log(fbInstances);
        $('.edit-form', $formContainer).click(function () {
            $formBuilder.toggle();
            $formContainer.toggle();
            $formBuilderTabs.toggle();
        });
        /*$(document.getElementById("save-all")).click(function() {
            var allData = fbInstances.map(function(fb) {
                return fb.formData;
            });
            console.log(allData);
        });*/
        var $fbPages = $(document.getElementById("form-builder-pages"));
        var addPageTab = document.getElementById("add-page-tab");
        addPageTab.onclick = function () {
            var tabCount = document.getElementById("tabs").children.length;
            var e = this;
            var tabId = "page-" + tabCount.toString()
            var $newPageTemplate = $(document.getElementById("new-page"))
            var $newPage = $newPageTemplate
                .clone()
                .attr("id", tabId)
                .addClass("fb-editor")
            var $newTab = $(this).clone().removeAttr("id");

            if ((fbInstancePages[tabCount - 1] !== undefined)) {
                var $tabLink = $("a", $newTab)
                    .attr("href", "#" + tabId)
                    .text(fbInstancePages[tabCount - 1]);
                promptBox($newPage, $newPageTemplate, $newTab, $fbPages, fbOptions, fbInstances, tabCount, e);
                //$newTab = $( tabTemplate.replace( /#\{href\}/g, "#" + tabId ).replace( /#\{label\}/g, fbInstancePages[tabCount-1] ) );
            } else {
                var tabName = "Page " + tabCount;
                $fbPages.tabs("option", "active", tabCount - 2);

                var locale = {
                    OK: 'Ok',
                    CONFIRM: 'Ok',
                    CANCEL: 'Cancel'
                };

                bootbox.addLocale('custom', locale);

                bootbox.prompt({
                    title: "Please enter page name?",
                    locale: 'custom',
                    callback: function (pageName) {
                        //  console.log('This was logged in the callback: ' + pageName);
                        // Page name
                        //var pageName = prompt("Please enter page name", tabName);

                        if (pageName === null || pageName === "") {
                            //pageName = tabName;
                            $fbPages.tabs("refresh");
                            $fbPages.tabs("option", "active", tabCount - 2);
                            //return false;
                        } else {
                            var $tabLink = $("a", $newTab)
                                .attr("href", "#" + tabId)
                                .text(pageName);

                            fbInstancePages.push(pageName);

                            promptBox($newPage, $newPageTemplate, $newTab, $fbPages, fbOptions, fbInstances, tabCount, e);

                        }

                    }
                })

                //$newTab = $( tabTemplate.replace( /#\{href\}/g, "#" + tabId ).replace( /#\{label\}/g, tabName ) );



            }


        };
        var promptBox = function ($newPage, $newPageTemplate, $newTab, $fbPages, fbOptions, fbInstances, tabCount, e) {
            $newPage.insertBefore($newPageTemplate);
            $newTab.insertBefore(e);
            $fbPages.tabs("refresh");
            $fbPages.tabs("option", "active", tabCount - 1);//console.log(tabCount - 1);
            fbOptions['defaultFields'] = [];
            fbInstances.push($newPage.formBuilder(fbOptions));
        }
        $tabs = $fbPages.tabs({
            beforeActivate: function (event, ui) {
                if (ui.newPanel.selector === "#new-page") {
                    return false;
                }
            }
        });
        $tabs.find(".ui-tabs-nav").sortable({
            items: "> li:not(#add-page-tab)",
            axis: "x",
            stop: function (event, ui) {
                $tabs.tabs("refresh");
                var tabsSequence = $tabs.tabs("instance").tabs;
                var result = sort_pages(tabsSequence, fbInstancePages, fbInstances);
                if (Object.keys(result).length) {
                    fbInstancePages = result.pages;
                    fbInstances = result.fb;
                }
            }
        });
        // Rename page name
        $("a[href='#edit-page']").on("click", function (e) {
            e.preventDefault();

            var activeTab = $tabs.tabs('option', 'active');

            var tabName = fbInstancePages[activeTab];
            var locale = {
                OK: 'Ok',
                CONFIRM: 'Ok',
                CANCEL: 'Cancel'
            };

            bootbox.addLocale('custom', locale);

            bootbox.prompt({
                title: "Please enter this page name?",
                locale: 'custom',
                callback: function (pageName) {
                    // console.log('This was logged in the callback: ' + pageName);
                    // Page name
                    //var pageName = prompt("Please enter page name", tabName);

                    // Page name
                    //var pageName = prompt("Please enter page name", tabName);

                    if (pageName === null || pageName === "") {
                        pageName = tabName;
                    }
                    //update tab name in approval by SR078 on 21Dec2020
                    var param = {};
                    param.tabdatainjson = "";
                    param.old_tabName = tabName;
                    param.awbd_tabName = pageName;
                    param.awst_document_type = $stateParams.formId;
                    mainService.renameTabInApproval("RenameinApproval", param)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {

                            }
                        }, function (err) {

                            console.log("some error occured." + err);
                        });
                    //end of service
                    $("ul#tabs li:eq(" + activeTab + ") a").text(pageName);
                    fbInstancePages[activeTab] = pageName;

                }
            })

            //console.log(fbInstancePages);
        });
        if (window.location.search) {
            var splitName = (window.location.search.split('=')[1]) ? (window.location.search.split('=')[1]) : "Untitled name";
            $('#formTitle').val(decodeURIComponent(splitName));
        }
        //$("select[name=resourceForm]").on("change", function () {
        //    var formId = $(this).val();

        //    var params = { formId: formId };
        //    populateDropdowns("{{ url('subforms/populateOptions') }}", params, 1, '', '', '', '', '', '');
        //});
        //$("select[name=activitiesForm]").on("change", function () {
        //    var formId = $(this).val();

        //    var params = { formId: formId };
        //    populateDropdowns("{{ url('subforms/populateOptions') }}", params, 2, '', '', '', '', '', '');
        //});
        $("button#save-action").on("click", function (e) {

            e.preventDefault();
            save_form_editor(fbInstances, fbInstancePages);
        });
        $("button#preview-form-action").on("click", function (e) {
            e.preventDefault();
            $formBuilder.toggle();
            $formContainer.toggle();
            $formBuilderTabs.toggle();
            $('form', $formContainer).html('');
            var formDataHtml = [];
            for (var key in fbInstances) {
                if (fbInstances.hasOwnProperty(key)) {
                    var JSON = $.parseJSON(fbInstances[key].formData);

                    $.each(JSON, function (key, value) {
                        formDataHtml.push(value);
                    });
                }
            }
            $('form', $formContainer).formRender({
                formData: formDataHtml
            });
        });
        $("button#clear-action").on("click", function (e) {
            e.preventDefault();
            var isconfirm = confirm('Do you want to clear all fields?');
            if (isconfirm) {
                var activeTab = $tabs.tabs('option', 'active');
                //var tabName = fbInstancePages[activeTab];
                //console.log(tabName, fbInstances);
                if (!DataService.isEmpty(fbInstances[activeTab].actions))
                    fbInstances[activeTab].actions.clearFields();
                $('div > .ui-sortable').css("min-height", "1138px");
            }
        });
        $('#preview-form').on('click', function () {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            //form.setAttribute("action", "{{url('forms/preview')}}?show=1");
            form.setAttribute("target", "preview");
            form.setAttribute("style", "display: none;");

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "_token");
            hiddenField.setAttribute("value", "{{ csrf_token() }}");
            form.appendChild(hiddenField);

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", "formTitle");
            hiddenField.setAttribute("value", $.trim($('#form_settingsModal #formTitle').val()));
            form.appendChild(hiddenField);

            var allData = fbInstances.map(function (fb) {
                return fb.formData;
            });

            var formFields = {};
            $.each(fbInstancePages, function (i, value) {
                //formFields[fbInstancePages[i]] = allData[i];
                formFields[fbInstancePages[i]] = convertNewJsonControlsToOldControlsFormat(allData[i]);
            });
            var textareaField = document.createElement("textarea");
            textareaField.setAttribute("name", "formFields");
            textareaField.innerHTML = JSON.stringify(formFields);
            form.appendChild(textareaField);
            document.body.appendChild(form);

            //var params = windowParams();
            //var newWindow = window.open('', 'preview', params, true);
            //newWindow.focus();
            //window.open('', 'preview');

            //  $state.go('previewForm', { 'formId': $scope.importFormSettings.formId });
            // alert($stateParams.formId);
            // $state.go('previewForm', { formId: $stateParams.formId });
            var baseUrl = mainService.getBaseUrl();
            window.open(baseUrl + "#/form/preview/" + $stateParams.formId, '_blank');

            //form.submit();
        });
        // cut & paste the field from one page to other page
        var cutArray = [];
        $(document).on("click", "a.cut-button", function (e) {
            e.preventDefault();
            var $parent = $(this).parents('li')
            var fieldIndex = $parent.index()
            var activeTab = $tabs.tabs('option', 'active')
            var formData = fbInstances[activeTab].actions.getData()
            var fieldData = formData[fieldIndex];
            cutArray.push(fieldData);
            //console.log(cutArray);
            if (cutArray.length) {
                $("button#paste-action").removeAttr("disabled");
            }
            $(this).parent().find("a.del-button").trigger('click');
        });
        $scope.$on('customCutControl', function (event, data, e, c) {
            // console.log(data); // 'Data to send'
            //e.preventDefault();
            //var $parent = $("a.cut-button").parents('li')
            //var fieldIndex = _.findIndex($parent, { id: c });
            var activeTab = $tabs.tabs('option', 'active')
            var formData = fbInstances[activeTab].actions.getData()
            var fieldData = formData[fieldIndex];
            cutArray.push(fieldData);
            //console.log(cutArray);
            if (cutArray.length) {
                $("button#paste-action").removeAttr("disabled");
            }
        });
        $(document).on("click", "button#paste-action", function (e) {
            e.preventDefault();
            var activeTab = $tabs.tabs('option', 'active')
            var formData = fbInstances[activeTab].actions.getData()
            var fullData = formData.concat(cutArray);

            fbInstances[activeTab].actions.setData(JSON.stringify(fullData));
            cutArray.length = 0;
            if (!cutArray.length) {
                $("button#paste-action").attr("disabled", "disabled");
            }
        });
        function save_form_editor(fbInstances, fbInstancePages) {
            debugger;
            console.log(fbInstances, "fbInstances");
            console.log(fbInstancePages, "fbInstancePages");

            var allData = fbInstances.map(function (fb) {
                return fb.formData;
            });

            var formField = {};
            $.each(fbInstancePages, function (i, value) {
                // formField[fbInstancePages[i]] = allData[i];
                if (allData[i].length > 2)
                    formField[fbInstancePages[i]] = convertNewJsonControlsToOldControlsFormat(allData[i]);
            });

            var formHtml = $("#fb-rendered-form > form").html();
            var formData = $('#formProperties').serializeArray();
            formData.push({ name: 'formField', value: JSON.stringify(formField) });
            formData.push({ name: 'formHtml', value: formHtml });
            //console.log(formData);




            $scope.saveFormProperties(fbInstances, fbInstancePages, JSON.stringify(formField));
            //$.ajax({
            //    type: "POST",
            //    url: "",
            //    data: $.param(formData),
            //    beforeSend: function () { showLoader(); },
            //    success: function (response, textStatus, jqXHR) {
            //        if (response.code) {
            //            swal({
            //                type: 'success', html: response.message, timer: 5000, showConfirmButton: false, onClose: () => {
            //                    window.location.href = "<?= URL::to('subforms/edit'); ?>/" + response.id;
            //                }
            //            });
            //        } else {
            //            alert(response.message);
            //        }
            //    },
            //    complete: function () { $.unblockUI(); }
            //});
        }
        function generateUniqueNumber() {
            return (new Date).getTime() + Math.floor(Math.random() * 899999 + 100000);
        };
        function defaultFormFields() {
            return [
                {
                    "type": "header",
                    "subtype": "h1",
                    "label": "Header",
                    "align": "left",
                    "className": "header",
                    "name": "header_" + generateUniqueNumber()
                },
                {
                    "type": "text",
                    "label": "Text Field",
                    "subtype": "text",
                    "column": "1",
                    "alignment": "top",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "Unique_Value": "No",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column_format": "plaintext",
                    "Inline_Edit": "No",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "text_" + generateUniqueNumber()
                },
                {
                    "type": "button",
                    "subtype": "submit",
                    "label": "Submit",
                    "className": "float-buttons wv-btn wv-success",
                    "name": "button_" + generateUniqueNumber(),
                    "style": "success"
                },
                {
                    "type": "button",
                    "subtype": "exit",
                    "label": "Exit",
                    "className": "float-buttons wv-btn wv-second",
                    "name": "button_" + generateUniqueNumber(),
                    "style": "default"
                }
            ];
        };
        function defaultCalenderFormFields() {
            return [{ "type": "hidden", "name": "hidden-fullcalendar", "value": "1", "className": "form-control" },
            { "type": "hidden", "name": "resformId", "value": "1", "className": "form-control" },
            { "type": "hidden", "name": "activityFormID", "value": "1", "className": "form-control" },
            { "type": "hidden", "name": "parentEventId", "value": "1", "className": "form-control" },
            //{ "type": "hidden", "name": "eventTagsList", "value": "1", "className": "form-control" },
            { "type": "hidden", "name": "resourcesTitle", "value": "", "className": "form-control" },
            { "type": "text", "required": true, "label": "Title", "subtype": "text", "column": "5", "name": "title", "className": "form-control" },
            { "type": "date", "required": true, "label": "Start", "types": "datetime_picker", "name": "start", "className": "form-control" },
            { "type": "date", "required": true, "label": "End", "types": "datetime_picker", "name": "end", "className": "form-control" },
            { "type": "text", "subtype": "color", "label": "Color", "value": "#3b91ad", "column_format": "color", "name": "color", "className": "form-control" },
            { "type": "radio-group", "label": "All Day", "inline": true, "name": "allDay", "values": [{ "label": "Yes", "value": "true" }, { "label": "No", "value": "false", "selected": true }], "className": "form-control" },
            { "type": "select", "label": "Resources", "placeholder": "Select any resource from list below", "column": "3", "name": "resources", "values": [], "className": "form-control" },
            { "type": "select", "label": "Activities", "placeholder": "Select any activity from list below", "name": "activities", "values": [], "className": "form-control" },
            { "type": "text", "label": "Service", "subtype": "text", "name": "service", "className": "form-control" },
            { "type": "textarea", "label": "Description", "subtype": "textarea", "rows": "3", "name": "description", "className": "form-control" },
            { "type": "button", "subtype": "submit", "label": "Create", "alignment": "left", "className": "btn btn-success", "style": "success", "name": "button_" + generateUniqueNumber() },
            { "type": "button", "subtype": "exit", "label": "Cancel", "alignment": "left", "className": "btn btn-default", "style": "default", "name": "button_" + generateUniqueNumber() }];
        };
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $("button#entry-form-action").on("click", function (e) {
            e.preventDefault();
            $state.go('saveFormEntryData', { 'formId': $scope.importFormSettings.formId });
        });
        function bindAllGeneralSetting() {
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.allowViewSummary)) {
                if (!Array.isArray($scope.filerCriteriaFormDetails.allowViewSummary)) {
                    $scope.filerCriteriaFormDetails.allowSummary = JSON.parse($scope.filerCriteriaFormDetails.allowViewSummary);
                    var allowSummary = angular.copy($scope.filerCriteriaFormDetails.allowSummary);
                    $scope.filerCriteriaFormDetails.allowSummary = true;
                    _.each(allowSummary, function (item) {
                        if (item == "0")
                            $scope.filerCriteriaFormDetails.allowSummary0 = true;
                        if (item == "1")
                            $scope.filerCriteriaFormDetails.allowSummary1 = true;
                        if (item == "2")
                            $scope.filerCriteriaFormDetails.allowSummary2 = true;
                        if (item == "3")
                            $scope.filerCriteriaFormDetails.allowSummary3 = true;
                    });
                }
            }
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.allowChat)) {
                if (!Array.isArray($scope.filerCriteriaFormDetails.allowChat)) {
                    $scope.filerCriteriaFormDetails.allowChat = JSON.parse($scope.filerCriteriaFormDetails.allowChat);
                    var allowChat = angular.copy($scope.filerCriteriaFormDetails.allowChat);
                    $scope.filerCriteriaFormDetails.allowChatting = true;
                    _.each(allowChat, function (item) {
                        if (item == "0")
                            $scope.filerCriteriaFormDetails.allowChatting0 = true;
                        if (item == "1")
                            $scope.filerCriteriaFormDetails.allowChatting1 = true;
                        if (item == "2")
                            $scope.filerCriteriaFormDetails.allowChatting2 = true;
                        if (item == "3")
                            $scope.filerCriteriaFormDetails.allowChatting3 = true;
                    });
                }
            }
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.allowNotification)) {
                if (!Array.isArray($scope.filerCriteriaFormDetails.allowNotification)) {
                    $scope.filerCriteriaFormDetails.allowNotify = JSON.parse($scope.filerCriteriaFormDetails.allowNotification);
                    var allowNotify = angular.copy($scope.filerCriteriaFormDetails.allowNotify);
                    $scope.filerCriteriaFormDetails.allowNotify = true;
                    _.each(allowNotify, function (item) {
                        if (item == "0")
                            $scope.filerCriteriaFormDetails.allowNotify0 = true;
                        if (item == "1")
                            $scope.filerCriteriaFormDetails.allowNotify1 = true;
                        if (item == "2")
                            $scope.filerCriteriaFormDetails.allowNotify2 = true;
                        if (item == "3")
                            $scope.filerCriteriaFormDetails.allowNotify3 = true;
                    });

                }
            }
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.NotifyEmailOnAction)) {
                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '0') {
                    $scope.importFormSettings.NotifyEmailOnAction0 = true;
                }
                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '1') {
                    $scope.importFormSettings.NotifyEmailOnAction1 = true;
                }

                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '2') {
                    $scope.importFormSettings.NotifyEmailOnAction0 = true;
                    $scope.importFormSettings.NotifyEmailOnAction1 = true;
                    //$scope.importFormSettings.NotifyEmailOnAction2 = true;
                }

            }

            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.NotifyOnAction)) {
                if ($scope.filerCriteriaFormDetails.NotifyOnAction == '0') {
                    $scope.importFormSettings.NotifyOnAction0 = true;
                }
                if ($scope.filerCriteriaFormDetails.NotifyOnAction == '1') {
                    $scope.importFormSettings.NotifyOnAction1 = true;
                }

                if ($scope.filerCriteriaFormDetails.NotifyOnAction == '2') {
                    $scope.importFormSettings.NotifyOnAction0 = true;
                    $scope.importFormSettings.NotifyOnAction1 = true;
                    //$scope.importFormSettings.NotifyEmailOnAction2 = true;
                }

            }




            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.NotifyEmailOnAction)) {
                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '0') {
                    $scope.importFormSettings.NotifyEmailOnAction0 = true;
                }
                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '1') {
                    $scope.importFormSettings.NotifyEmailOnAction1 = true;
                }

                if ($scope.filerCriteriaFormDetails.NotifyEmailOnAction == '2') {
                    $scope.importFormSettings.NotifyEmailOnAction0 = true;
                    $scope.importFormSettings.NotifyEmailOnAction1 = true;
                    //$scope.importFormSettings.NotifyEmailOnAction2 = true;
                }

            }



            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.allowEmailNotification)) {
                if (!Array.isArray($scope.filerCriteriaFormDetails.allowEmailNotification)) {
                    $scope.filerCriteriaFormDetails.allowEmailNotify = JSON.parse($scope.filerCriteriaFormDetails.allowEmailNotification);
                    var allowEmailNotify = angular.copy($scope.filerCriteriaFormDetails.allowEmailNotify);
                    $scope.filerCriteriaFormDetails.allowEmailNotify = true;
                    _.each(allowEmailNotify, function (item) {
                        if (item == "0")
                            $scope.filerCriteriaFormDetails.allowEmailNotify0 = true;
                        if (item == "1")
                            $scope.filerCriteriaFormDetails.allowEmailNotify1 = true;
                        if (item == "2")
                            $scope.filerCriteriaFormDetails.allowEmailNotify2 = true;
                        if (item == "3")
                            $scope.filerCriteriaFormDetails.allowEmailNotify3 = true;
                    });
                }
            }
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.allowWhatsappNotification)) {
                if (!Array.isArray($scope.filerCriteriaFormDetails.allowWhatsappNotification)) {
                    $scope.filerCriteriaFormDetails.allowWhatsappNotify = JSON.parse($scope.filerCriteriaFormDetails.allowWhatsappNotification);
                    var allowWhatsappNotify = angular.copy($scope.filerCriteriaFormDetails.allowWhatsappNotify);
                    $scope.filerCriteriaFormDetails.allowWhatsappNotify = true;
                    _.each(allowWhatsappNotify, function (item) {
                        if (item == "0")
                            $scope.filerCriteriaFormDetails.allowWhatsappNotify0 = true;
                        if (item == "1")
                            $scope.filerCriteriaFormDetails.allowWhatsappNotify1 = true;
                        if (item == "2")
                            $scope.filerCriteriaFormDetails.allowWhatsappNotify2 = true;
                        if (item == "3")
                            $scope.filerCriteriaFormDetails.allowWhatsappNotify3 = true;
                    });
                }
            }





        };
        $scope.onSubmitAccessControls = function () {          
            var param = {};
            $scope.filerCriteriaFormDetails.allowViewSummary = [];
            $scope.filerCriteriaFormDetails.allowChat = [];
            $scope.filerCriteriaFormDetails.allowNotification = [];
            $scope.filerCriteriaFormDetails.allowEmailNotification = [];
            $scope.filerCriteriaFormDetails.allowWhatsappNotification = [];
            $scope.filerCriteriaFormDetails.notificationDetails = '';
            var allowViewSummary = $("input[name='allowViewSummary[]']");
            _.each(allowViewSummary, function (item) {
                if (item.checked) {
                    $scope.filerCriteriaFormDetails.allowViewSummary.push(item.value);
                }
            });
            var allowChat = $("input[name='allowChat[]']");
            _.each(allowChat, function (item) {
                if (item.checked) {
                    $scope.filerCriteriaFormDetails.allowChat.push(item.value);
                }
            });
            var allowNotification = $("input[name='allowNotification[]']");
            _.each(allowNotification, function (item) {
                if (item.checked) {
                    $scope.filerCriteriaFormDetails.allowNotification.push(item.value);
                }
            });
            var allowEmailNotification = $("input[name='allowEmailNotification[]']");
            _.each(allowEmailNotification, function (item) {
                if (item.checked) {
                    $scope.filerCriteriaFormDetails.allowEmailNotification.push(item.value);
                }
            });
            var allowWhatsappNotification = $("input[name='allowWhatsappNotification[]']");
            _.each(allowWhatsappNotification, function (item) {
                if (item.checked) {
                    $scope.filerCriteriaFormDetails.allowWhatsappNotification.push(item.value);
                }
            });
            $scope.filerCriteriaFormDetails.allowViewSummary = $scope.filerCriteriaFormDetails.allowViewSummary
            var list = $("input[name='recordAccessSecurity[insert][roles][]']");
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity.insert)) {
                $scope.filerCriteriaFormDetails.recordAccessSecurity.insert.roles = [];
                _.each(list, function (item) {
                    if (item.checked) {
                        $scope.filerCriteriaFormDetails.recordAccessSecurity.insert.roles.push(item.value);
                    }
                });
                //$scope.filerCriteriaFormDetails.recordAccessSecurity.insert.roles = JSON.stringify($scope.filerCriteriaFormDetails.recordAccessSecurity.insert.roles);
            }
            param.topicId = $scope.importFormSettings.topicId;
            param.formId = $scope.importFormSettings.formId;
            param.applicationId = $scope.importFormSettings.applicationId;
            $scope.filerCriteriaFormDetails.formSettings.tabulator.theme = $scope.filerCriteriaFormDetails.formTabulatorTheme;
            // param = angular.copy($scope.filerCriteriaFormDetails);
            param.formSettings = JSON.stringify($scope.filerCriteriaFormDetails.formSettings);

            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.ownRoleAccess)) {
                $scope.filerCriteriaFormDetails.recordAccessSecurity.ownRoleAccess =$scope.filerCriteriaFormDetails.ownRoleAccess;
            }
            if (!DataService.isEmpty($scope.filerCriteriaFormDetails.otherRoleAccess)) {
                $scope.filerCriteriaFormDetails.recordAccessSecurity.otherRoleAccess =$scope.filerCriteriaFormDetails.otherRoleAccess;
            }

            param.recordAccessSecurity = JSON.stringify($scope.filerCriteriaFormDetails.recordAccessSecurity);

            param.allowViewSummary = JSON.stringify($scope.filerCriteriaFormDetails.allowViewSummary);
            param.allowChat = JSON.stringify($scope.filerCriteriaFormDetails.allowChat);
            param.allowNotification = JSON.stringify($scope.filerCriteriaFormDetails.allowNotification);
            param.allowEmailNotification = JSON.stringify($scope.filerCriteriaFormDetails.allowEmailNotification);
            param.allowWhatsappNotification = JSON.stringify($scope.filerCriteriaFormDetails.allowWhatsappNotification);
            if ($('#notificationDetail').is(':checked') == true) {
                param.notificationDetails = 'true';
                $scope.filerCriteriaFormDetails.notificationDetails = true;
            }
            else {
                param.notificationDetails = 'false';
                //filerCriteriaFormDetails.notificationDetails = false;
                $scope.filerCriteriaFormDetails.notificationDetails = false;
            }


            //param.notificationDetails = $('#notificationDetail').is(':checked');//filerCriteriaFormDetails.notificationDetails;
            //param.notificationDetail = $scope.importFormSettings.notificationDetail;


            $scope.importFormSettings.NotifyEmailOnAction = '';
            if ($('#radioGE1').is(":checked")) {
                $scope.importFormSettings.NotifyEmailOnAction = 0;
            }
            if ($('#radioGE2').is(":checked")) {
                $scope.importFormSettings.NotifyEmailOnAction = 1;
            }
            if ($('#radioGE2').is(":checked") && $('#radioGE1').is(":checked")) {
                $scope.importFormSettings.NotifyEmailOnAction = 2;
            }
            $scope.importFormSettings.NotifyOnAction = '';
            if ($('#radioG1').is(":checked")) {
                $scope.importFormSettings.NotifyOnAction = 0;
            }
            if ($('#radioG2').is(":checked")) {
                $scope.importFormSettings.NotifyOnAction = 1;
            }
            if ($('#radioG2').is(":checked") && $('#radioG1').is(":checked")) {
                $scope.importFormSettings.NotifyOnAction = 2;
            }

            param.action = 22;
            param.NotifyOnAction = $scope.importFormSettings.NotifyOnAction;
            param.NotifyEmailOnAction = $scope.importFormSettings.NotifyEmailOnAction;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.recordFilters = "";
            param.calenderSettingsList = null;
            //$scope.importFormSettings.notificationDetail="false";
            //console.log($scope.importFormSettings.notificationDetail,"notification");
            //console.log($scope.filerCriteriaFormDetails.allowChatting,"Import formsett");
            $scope.importFormSettings.otherFormFieldName = JSON.stringify($scope.importFormSettings.otherFormFieldName);


            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            notifierService.notifySweetAlertMessage('success', 'Access Control settings saved');
                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });



        };
        $scope.clickBasicSettings = function () {
            $("select.selectgroup").selectpicker("refresh");
        };

        $scope.getLanguage = function () {
            var param = {};
            param.action = 5;
            param.formId = $scope.currentFormId;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.ManageLanguages("ManageLanguages", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        // if ( response.data > 0) {
                        console.log(response.data, "ldata");
                        $scope.languageList = response.data;
                        $rootScope.$emit("HideLoading");
                        //}
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.ApplyMultilingualText = function () {
             
            var langId = '1';
            if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                langId = localStorage.getItem("globalLangForm");
                if (langId == '1') {
                    $scope.selectedLanguage = 'en';
                }
                else if (langId == '2') {
                    $scope.selectedLanguage = 'tc';
                }
                else if (langId == '3') {
                    $scope.selectedLanguage = 'ch';
                }
                else {
                    $scope.selectedLanguage = 'en';
                }

            }
            else if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != 'null') {
                if (langId == '1') {
                    $scope.selectedLanguage = 'en';
                }
                else if (langId == '2') {
                    $scope.selectedLanguage = 'tc';
                }
                else if (langId == '3') {
                    $scope.selectedLanguage = 'ch';
                }
                else {
                    $scope.selectedLanguage = 'en';
                }
            }
            else {
                $scope.selectedLanguage = 'en';
            }


            translationService.getTranslation($scope, $scope.selectedLanguage);
            //$scope.ApplyMultilingualText();
        };


        $scope.init();
    });
}(FormGeneratorApp));