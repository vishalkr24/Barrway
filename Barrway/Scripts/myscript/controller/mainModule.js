var FormGeneratorApp = angular.module('FormGeneratorApp', ["ui.router", "ngCookies", "ngBootbox", "ngResource", 'toaster', 'ui.bootstrap', 'ui.router.state', 'ncy-angular-breadcrumb', 'angular.filter']);

FormGeneratorApp.run(function ($rootScope, $templateCache, notifierService, $q, $ngBootbox, $timeout, $location, toaster, $filter, $transitions, $state, $breadcrumb, mainService, adminService) {
    $rootScope.isPreviewPage = false;
    $rootScope.isStateLoading = false;
    $rootScope.isLoginPage = false;
    $rootScope.isOtherPage = true;

    $rootScope.ConnectionStarted = false;
    var canceller = $q.defer();

    $transitions.onStart({}, function (transition) {
        if (transition.from().name == "queue_view") {
            $.connection.hub.stop();
        }
        
    });

    $transitions.onSuccess({}, function (transition) {
        $(".lbl-calendar-name").text($(".dropdown-me-2 .lbl-calendar-name").text())
        $(".lbl-company-name").text(localStorage.getItem("COMPANY_NAME_ENGLISH"));
    });

    

    $rootScope.$on("ShowLoading", function (event, message, progress) {
        $rootScope.IND_loading = true;
        $rootScope.IND_loadingMessage = message;
        $rootScope.IND_loadingProgress = progress;
    });
    $rootScope.$on('HideLoading', function (error) {
        $rootScope.IND_loading = false;
        //if (error != undefined) {
        //    $.unblockUI();
        //    notifierService.notifyMessage('error', 'Services', error.Message);
        //}
    });
    $rootScope.isActive = function (stateName) {
        return $state.includes(stateName);
    }
    $rootScope.getLastStepLabel = function () {
        return 'Angular-Breadcrumb';
    }
    $rootScope.isRecordPage = false;
    $rootScope.formrecordPage = false;
    $rootScope.isHomePage = false;

    $rootScope.HandleError = function (error, message) {
        $rootScope.$emit('HideLoading');
        if (error != undefined && error.statusText != undefined && error.statusText.length > 0) {
            message = error.statusText;
        }
        toaster.pop('error', "Error", message);
    };
    $rootScope.ToCustomDateTime = function (date) {
        var dateTime = new Date(date);
        dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm");
        return dateTime;
    }
    $rootScope.ToJsonDate = function (date) {
        if (date != null) {
            var date1 = new Date();
            date = new Date(date);
            return '\/Date(' + moment((date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " +0000", "MM-DD-YYYY Z").valueOf() + ')\/';
        }
    };
    $rootScope.ToJsonDate2 = function (date, format) {
        return moment(date).format(format);
    };
    $rootScope.ToTimeFormat = function (date) {
        if (date != null) {
            var tokens = date.split(/[A-Z]+/);
            var hours = tokens[1];
            if (hours.length == 1) {
                hours = "0" + hours;
            } else if (hours.length == 0) {
                hours = "00";
            }
            var minutes = tokens[2];
            if (minutes.length == 1) {
                minutes = "0" + minutes;
            } else if (minutes.length == 0) {
                minutes = "00";
            }
            return hours + ":" + minutes;
        }
    };
    $rootScope.ToTimeFormatSeconds = function (date) {
        if (date != null) {
            var tokens = date.split(/[A-Z]+/);
            var hours = tokens[1];
            if (hours.length == 1) {
                hours = "0" + hours;
            } else if (hours.length == 0) {
                hours = "00";
            }
            var minutes = tokens[2];
            if (minutes.length == 1) {
                minutes = "0" + minutes;
            } else if (minutes.length == 0) {
                minutes = "00";
            }
            var hoursSe = parseInt(hours) * 60 * 60;
            var minutesSe = parseInt(minutes) * 60;
            return hoursSe + minutesSe;
        }
    };
    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };


   
});




FormGeneratorApp.controller('DashboardController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    checkLogin();

    if (getUserRole() == "SUPERADMIN_USER") {
        $(".hide-for-superadmin").hide();
        $(".show-for-superadmin").show();
    }
    
    if (window.location.href.includes("UserAdmin") || window.location.href.includes("Useradmin") || window.location.href.includes("useradmin")) {
        $state.go("user_dashboard");
    } else if (window.location.href.includes("SuperAdmin") || window.location.href.includes("Superadmin") || window.location.href.includes("superadmin")) {
        
        $state.go("superadmin_dashboard");
    } else {
        $("#nav-calendar-dashboard").addClass("active");

        setTimeout(function () {
            setCompanyDetails();
            setSelectedCalendar();
            $scope.ManageCalendarMaster();
            setCalendarDashboardData();
        }, 800);
    }



});
FormGeneratorApp.controller('CommonCustomDialogController', function ($scope, $ngBootbox, DataService, notifierService, $rootScope, $state, $rootScope, $timeout, $http, $location, $window, mainService, $filter) {
    $scope.init = function () {
        $scope.applicationData = {};
        $scope.topicParam = {};
        $scope.topicList = [];
        $scope.popUpData = {};
        $scope.applicationCopyTemp = {};
        $timeout(function () {
            Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
            Waves.attach('.flat-buttons', ['waves-button']);
            Waves.init();
            $scope.$emit("loadSpecialAccess", {});
        }, 150);
        $scope.formDetail = {};
        $scope.formDetail.fileData = "";
        //$scope.getApplicationList();
        //$scope.getFormList();
        $scope.topicList = {};
        $scope.NewAppParam = {};
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
        $scope.importFormSettings = {};
        $scope.currentUserFormRole = "";
        $scope.userDetail = mainService.loginDetails();
        if (!DataService.isEmpty($scope.formOptionDetails))
            if (!DataService.isEmpty($scope.formOptionDetails.isAllFormCustomDialog) && $scope.formOptionDetails.isAllFormCustomDialog == true) {
                var paramRoles = {};
                paramRoles.action = 5;
                paramRoles.formId = $scope.formOptionDetails.formId;
                paramRoles.userId = $scope.userDetail.Id;
                paramRoles.created_by = $scope.formOptionDetails.created_by;
                $scope.loadFormRoles(paramRoles);
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
                            $scope.currentUserFormRole = exists.role;
                            $timeout(function () {
                                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                Waves.attach('.flat-buttons', ['waves-button']);
                                Waves.init();
                            }, 150);
                        }
                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };

    $scope.quickFormCreate = function () {
        var param = {};
        param = $scope.formDetail;
        var dataRedirect = {};
        dataRedirect = $scope.formDetail;
        localStorage.setItem("formModel", JSON.stringify(dataRedirect));
        param.action = 11;
        param.applicationTitle = param.formName;
        param.created_by = $scope.userDetail.Id;
        param.update_by = $scope.userDetail.Id;
        param.status = 2;
        mainService.manageApplication("ManageApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (response.data.length > 0) {
                        var exists = {};
                        exists = response.data[0];
                        if (exists.res == 1) {
                            exists.formName = param.formName;
                            localStorage.setItem("formModel", JSON.stringify(exists));
                            notifierService.notifyMessage('success', 'Folder', exists.Message);
                            if ($scope.currentFormType == 0 || $scope.currentFormType == 1)
                                $state.go("form", { "topicId": exists.topicId }, { reload: true, inherit: false });
                            else if ($scope.currentFormType == 2)
                                $state.go("queue", { "topicId": exists.topicId }, { reload: true, inherit: false });
                            else if ($scope.currentFormType == 3)
                                $state.go("form", { "topicId": exists.topicId }, { reload: true, inherit: false });
                        }
                        else
                            notifierService.notifyMessage('error', 'Folder', exists.Message);
                    }
                }
            }, function (err) {
                console.log("some error occured." + err);
            });
    };

    $scope.quickFormExisting = function () {
        var paramf = {};
        var newparam = {};
        if (DataService.isEmpty($scope.formDetail.formName)) {
            notifierService.notifyMessage('error', 'Fields', "Please fill fields");
            return false;
        }
        paramf = $scope.formDetail;
        paramf.action = 37;
        paramf.formId = $scope.formDetail.formId;
        var param = {};
        param = $scope.formDetail;
        var dataRedirect = {};
        dataRedirect = $scope.formDetail;
        localStorage.setItem("formModel", JSON.stringify(dataRedirect));
        param.action = 15;
        param.formId = $scope.formDetail.formId;
        param.applicationTitle = param.formName;
        param.created_by = $scope.userDetail.Id;
        param.update_by = $scope.userDetail.Id;
        param.status = 2;
        $rootScope.$emit("ShowLoading");
        mainService.manageApplication("ManageApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (response.data.length > 0) {
                        var exists = {};
                        exists = response.data[0];
                        if (exists.res == 1) {
                            exists.formName = param.formName;
                            localStorage.setItem("formModel", JSON.stringify(exists));
                            notifierService.notifyMessage('success', 'Folder', exists.Message);
                            if (exists.currentFormType == 0 || exists.currentFormType == 1)
                                $state.go("formEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                            else if (exists.currentFormType == 2)
                                $state.go("queueEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                        }
                        else
                            notifierService.notifyMessage('error', 'Folder', exists.Message);
                    }
                    $rootScope.$emit("HideLoading");
                }
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.quickFormCopy = function () {
        var param = {};
        param = $scope.formDetail;
        var dataRedirect = {};
        dataRedirect = $scope.formDetail;
        localStorage.setItem("formModel", JSON.stringify(dataRedirect));
        param.action = 15;
        param.applicationTitle = param.formName;
        param.formId = $scope.formOptionDetails.formId;
        param.created_by = $scope.userDetail.Id;
        param.update_by = $scope.userDetail.Id;
        param.status = 2;
        $rootScope.$emit("ShowLoading");
        mainService.manageApplication("ManageApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (response.data.length > 0) {
                        var exists = {};
                        exists = response.data[0];
                        if (exists.res == 1) {
                            exists.formName = param.formName;
                            localStorage.setItem("formModel", JSON.stringify(exists));
                            notifierService.notifyMessage('success', 'Folder', exists.Message);
                            if (exists.currentFormType == 0 || exists.currentFormType == 1)
                                $state.go("formEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                            else if (exists.currentFormType == 2)
                                $state.go("queueEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                        }
                        else
                            notifierService.notifyMessage('error', 'Folder', exists.Message);
                    }
                    $rootScope.$emit("HideLoading");
                }
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.showNewAppDialog = function () {
        $scope.NewAppParam = {};
        $scope.title = 'Add New Folder';
        $ngBootbox.customDialog({
            templateUrl: 'addNewApplication.html',
            scope: $scope,
            size: "large"
        });
        $timeout(function () {
            Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
            Waves.attach('.flat-buttons', ['waves-button']);
            Waves.init();
        }, 250);
    };
    $scope.submitNewApplication = function () {
        var param = {};
        param = $scope.NewAppParam;
        param.action = 1;
        param.created_by = $scope.userDetail.Id;
        param.update_by = $scope.userDetail.Id;
        param.status = 2;
        mainService.manageApplication("ManageApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (response.data.length > 0) {
                        var exists = {};
                        exists = response.data[0];
                        var temp = {};
                        temp.applicationId = exists.applicationId;
                        temp.applicationTitle = $scope.NewAppParam.applicationTitle;
                        console.log(temp);
                        $scope.applicationList.push(temp);
                        $timeout(function () {
                            $('.selectapp').selectpicker({
                                liveSearch: true,
                                container: 'body'
                            });
                            $(".selectapp ").selectpicker("refresh");
                        }, 100);
                        $scope.formDetail.applicationId = temp.applicationId;
                        if (exists.res == 1)
                            notifierService.notifyMessage('success', 'Folder', exists.Message);
                        else
                            notifierService.notifyMessage('error', 'Folder', exists.Message);
                    }
                }
            }, function (err) {
                console.log("some error occured." + err);
            });
    };
    $scope.submitNewTopic = function () {
        if (!DataService.isEmpty($scope.formDetail.applicationId) && $scope.formDetail.applicationId != 0) {
            $scope.topicParam.action = 1;
            $scope.topicParam.max_records = 1000000;
            $scope.topicParam.created_by = $scope.userDetail.Id;
            $scope.topicParam.update_by = $scope.userDetail.Id;
            $scope.topicParam.applicationId = $scope.formDetail.applicationId;
            mainService.manageTopic("ManageTopic", $scope.topicParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            var exists = {};
                            exists = response.data[0];
                            var temp = {};
                            temp.topicId = exists.topicId;
                            temp.topicTitle = $scope.topicParam.topicTitle;
                            $scope.topicList.push(temp);
                            $timeout(function () {
                                $scope.formDetail.topicId = "0";
                                $('.selecttopic').selectpicker({
                                    liveSearch: true,
                                    container: 'body'
                                });
                                $(".selecttopic").selectpicker("refresh")
                            }, 100);
                            if (exists.res == 1)
                                notifierService.notifyMessage('success', 'Topic', exists.Message);
                            else
                                notifierService.notifyMessage('error', 'Topic', exists.Message);
                        }
                    }
                    else { $scope.topicList = null; }
                }, function (err) {
                    console.log("some error occured." + err);
                });
        }
        else
            $ngBootbox.alert('Please select an application!')
    };
    $scope.showAddTopicDialog = function () {
        if (!DataService.isEmpty($scope.formDetail.applicationId) && $scope.formDetail.applicationId != 0) {
            $scope.topicParam = {};
            $scope.addTopicTitle = 'Add New Topic',
                $ngBootbox.customDialog({
                    templateUrl: 'addTopic.html',
                    scope: $scope,
                    size: "large"
                });
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 250);
        }
        else {
            $ngBootbox.alert('Please select an application!')
        }
    };
    $scope.submitAdvanceForm = function () {
        $ngBootbox.hideAll();
        var dataRedirect = {};
        dataRedirect = $scope.formDetail;
        localStorage.setItem("formModel", JSON.stringify(dataRedirect));
        $('#addFormModal').modal('hide');
        $(".modal-backdrop").remove();
        if ($scope.currentFormType == 0 || $scope.currentFormType == 1) {
            if ($scope.currentFormType == 0)
                $state.go("form", { "topicId": $scope.formDetail.topicId, "popup": $scope.currentFormType }, { reload: true, inherit: false });
            else
                $state.go("calenderform", { "topicId": $scope.formDetail.topicId, "popup": $scope.currentFormType }, { reload: true, inherit: false });
        }
        else if ($scope.currentFormType == 2)
            $state.go("queue", { "topicId": $scope.formDetail.topicId }, { reload: true, inherit: false });
    };
    $scope.submitAdvanceFormCopy = function () {
        $ngBootbox.hideAll();
        var dataRedirect = {};
        dataRedirect = $scope.formDetail;
        $rootScope.$emit("ShowLoading");
        var param = {};
        param = $scope.formDetail;
        param.newTopicId = param.topicId;
        param.newApplicationId = param.applicationId;
        param.action = 16;
        param.formId = $scope.formOptionDetails.formId;
        $scope.currentFormType = $scope.formOptionDetails.currentFormType;
        param.applicationTitle = param.formName;
        param.created_by = $scope.userDetail.Id;
        param.updated_by = $scope.userDetail.Id;
        mainService.copyApplication("copyApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data)) {
                        var exists = response.data;
                        if (exists.res == 1) {
                            notifierService.notifyMessage('success', 'Copy Form', exists.Message);
                            $ngBootbox.hideAll();
                            if ($scope.currentFormType == 0 || $scope.currentFormType == 1)
                                $state.go("formEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                            else if ($scope.currentFormType == 2)
                                $state.go("queueEdit", { "formId": exists.formId }, { reload: true, inherit: false });
                        }
                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.submitExcelForm = function () {
        var dataRedirect = $scope.formDetail;
        $scope.saveFormProperties();
    };
    $scope.saveFormProperties = function () {
        if (!DataService.isEmpty($scope.fieldsTemp)) {
            $rootScope.$emit("ShowLoading");
            $scope.importFormSettings.fields = JSON.stringify($scope.fieldsTemp);
            $scope.importFormSettings.html = JSON.stringify($scope.fieldsTemp);
            $scope.importFormSettings.topicId = $scope.formDetail.topicId;
            $scope.importFormSettings.applicationId = $scope.formDetail.applicationId;
            var param = {};
            param = $scope.importFormSettings;
            param.action = 1;
            $scope.importFormSettings.status = 1;
            $scope.importFormSettings.template = true;
            $scope.importFormSettings.title = $scope.formDetail.formName;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.currentFormType = 0;
            dynamicTableCreation($scope.importFormSettings);
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            notifierService.notifyMessage('success', 'Form Setting', response.data[0].Message);
                            $timeout(function () {
                                if ($scope.currentFormType == 0 || $scope.currentFormType == 1)
                                    $state.go('formEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                else if ($scope.currentFormType == 2)
                                    $state.go('queueEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                $rootScope.$emit("HideLoading");
                            }, 450);
                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        } else {
            notifierService.notifyMessage('error', 'Excel File', 'Select Excel file');
        }
    };
    function dynamicTableCreation(dataParam) {
        var paramTable = {};
        paramTable = angular.copy(dataParam);
        paramTable.action = 1;
        paramTable.fields = generateQuery(dataParam);
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
    function generateQuery(dataFields) {
        var result = "";
        var temp = angular.copy(dataFields);
        if (!DataService.isEmpty(temp.fields)) {
            var pagelist = JSON.parse(temp.fields);
            angular.forEach(pagelist, function (itemPage, keyPage) {
                if (!Array.isArray(itemPage))
                    itemPage = JSON.parse(itemPage);
                angular.forEach(itemPage, function (item, key) {
                    if (item.type != "header" && item.type != "line" && item.type != "button") {
                        if (item.type == "textarea") {
                            if (!DataService.isEmpty(item.name))
                                result += " " + replaceColumn(item.name) + " nvarchar(max) null,"
                            else {
                                result += " " + replaceColumn(item.id) + " nvarchar(max) null,"
                                item.name = item.id;
                            }
                        }
                        else {
                            if (!DataService.isEmpty(item.name))
                                result += " " + replaceColumn(item.name) + " nvarchar(500) null,"
                            else {
                                result += " " + replaceColumn(item.id) + " nvarchar(500) null,"
                                item.name = item.id;
                            }
                        }
                    }
                });
            });
        }
        return result;
    }

    $scope.changeAppddl = function (applicationId) {
        var appData = {};
        appData.action = 5;
        $scope.formDetail.topicId = "0";
        appData.applicationId = applicationId;
        $scope.getTopicList(appData);
    };
    $scope.getApplicationList = function () {
        var param = {};
        param.action = 18;
        param.created_by = $scope.userDetail.Id;
        $rootScope.$emit("ShowLoading");
        mainService.manageApplication("ManageApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    $scope.applicationList = response.data;
                    $scope.applicationList = $filter('orderBy')($scope.applicationList, 'applicationTitle', false);
                    $scope.formDetail.applicationId = "0";
                    $scope.formDetail.topicId = "0";
                    $timeout(function () {
                        $scope.formDetail.topicId = "0";
                        $('.selectapp').selectpicker({
                            liveSearch: true,
                            container: 'body'
                        });
                        $(".selectapp ").selectpicker("refresh");
                    }, 100);
                    $rootScope.safeApply();
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.getFormList = function () {
        var param = {};
        param.action = 36;
        mainService.manageForm("ManageForm", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    $scope.formList = response.data;
                    $scope.formList = $filter('orderBy')($scope.formList, 'title', false);
                    $timeout(function () {
                        $('.selectform').selectpicker({
                            liveSearch: true,
                            container: 'body'
                        });
                        $(".selectform").selectpicker("refresh")
                    }, 100);
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };

    $scope.getTopicList = function (appData) {
        $rootScope.$emit("ShowLoading");
        mainService.manageTopic("ManageTopic", appData)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    $scope.topicList = response.data;
                    $scope.topicList = $filter('orderBy')($scope.topicList, 'topicTitle', false);
                    $timeout(function () {
                        $scope.formDetail.topicId = "0";
                        $('.selecttopic').selectpicker({
                            liveSearch: true,
                            container: 'body'
                        });
                        $(".selecttopic").selectpicker("refresh")
                    }, 100);
                    $rootScope.safeApply();
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.fileChange = function (element) {
        $scope.fileData = element.files[0];
        var fd = new FormData();
        fd.append('file', $scope.fileData);
        var reqType = "form";
        var uid = $scope.userDetail.uid;
        var userId = $scope.userDetail.Id;
        var appIdParam = "";
        var appTitleParam = "";
        var formIdParam = "";
        var formTitleParam = "";
        $rootScope.$emit("ShowLoading");
        mainService.uploadFile("UploadDataFile", fd, reqType, uid, appIdParam, appTitleParam, formIdParam, formTitleParam, true, userId)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data[0])) {
                            $scope.fieldsListTemp = [];
                            $scope.fieldsListMain = [];
                            $scope.fieldsTemp = response.data;
                            $scope.fieldsListTemp = [];
                            $scope.fieldsListTempFull = [];
                            var Column_Name = "";
                            var isBasicSettingsExcel = _.filter($scope.fieldsTemp, function (item) {
                                return item.Basic_Settings != null
                            });
                            var newCopy = angular.copy($scope.fieldsTemp);
                            if (!DataService.isEmpty(isBasicSettingsExcel)) {
                                _.map($scope.fieldsTemp, function (pagesData, key) {
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
                                                    val1 = val1.toLocaleLowerCase() == "false" ? false : true;
                                                    item = val1;
                                                }
                                                obj[rekey] = item;
                                            }
                                        }
                                        if ("Column_Name" == key) {
                                            obj["name"] = item;
                                            obj["id"] = item;
                                        }
                                        if ("Sub_Type" == key) {
                                            obj["subtype"] = item;
                                        }
                                    });
                                    $scope.fieldsListTemp.push(obj);
                                });
                                var temp = {};
                                temp["Page 1"] = angular.copy($scope.fieldsListTemp);
                                $scope.fieldsTemp = angular.copy(temp);
                            }
                        }
                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    }
    $rootScope.$on("openCustonDialog", function (event, data, type) {
        console.log(data);
    });
    $scope.test = function () {
        notifierService.notifyMessage('error', 'CUstom', 'CUstom');
    };
    $scope.deleteTopic = function () {
        swal({
            title: 'Are you sure want to delete this topic?',
            text: "It will automatically delete all related forms.",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it',
            position: 'top'
        }).then((result) => {
            if (result.value) {
                commonManageDeletion(4);
            }
        });
    };
    $scope.deleteForm = function () {
        swal({
            title: 'Are you sure want to delete this form?',
            text: "It will automatically delete all related informations.",
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it',
            position: 'top'
        }).then((result) => {
            if (result.value) {
                //FormDeletion(6)
                commonManageDeletion(3);
            }
        });
    };
    $scope.clearRecords = function () {
        $ngBootbox.confirm('Are you sure you want to delete Records?')
            .then(function () {
                commonManageDeletion(2);
            }, function () {
                console.log('Confirm dismissed!');
            });
    };

    function commonManageDeletion(action) {
        $rootScope.$emit("ShowLoading");
        var param = {};
        param = $scope.formOptionDetails;
        param.action = action;
        param.created_by = $scope.userDetail.Id;
        param.updated_by = $scope.userDetail.Id;
        mainService.manageDeletion("ManageDeletion", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data)) {
                        var exists = response.data;
                        console.log(exists, "result");
                        if (exists.res == 1) {
                            notifierService.notifyMessage('success', 'Deleted Records', exists.Message);
                            //$ngBootbox.hideAll();
                            //$state.reload();

                            setTimeout(function () {

                                swal({
                                    title: "This form's topic is attached only one form Do you want to delete topic Too?",
                                    text: "Note It will automatically delete all topic related forms.",
                                    type: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it',
                                    position: 'top'
                                }).then((result) => {
                                    if (result.value) {
                                        TopicDeletion(4);
                                    }
                                    else {
                                        $ngBootbox.hideAll();
                                        $state.reload();
                                    }
                                });

                            }, 800);



                        }
                        if (exists.res == 2 && action == "3") {
                            notifierService.notifyMessage('success', 'Deleted Records', exists.Message);
                            $ngBootbox.hideAll();
                            $state.reload();

                            setTimeout(function () {

                                swal({
                                    title: "This form's topic is attached to many forms Do you want to delete topic Too?",
                                    text: "Note It will automatically delete all topic related forms.",
                                    type: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, delete it',
                                    position: 'top'
                                }).then((result) => {
                                    if (result.value) {
                                        TopicDeletion(4);
                                    }
                                });



                            }, 800);





                        }

                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };



    //function FormDeletion(action) {
    //    $rootScope.$emit("ShowLoading");
    //    var param = {};
    //    param = $scope.formOptionDetails;
    //    param.action = action;
    //    param.created_by = $scope.userDetail.Id;
    //    param.updated_by = $scope.userDetail.Id;
    //    mainService.manageDeletion("ManageDeletion", param)
    //        .then(function (response) {
    //            if (response.data != null && angular.isDefined(response.data)) {
    //                if (angular.isDefined(response.data)) {
    //                    var exists = response.data;
    //                    console.log(exists, "result");
    //                    if (exists.res == 1) {
    //                        swal({
    //                            title: 'This topic is attached to multiple forms Do you want to delete topic Too????',
    //                            text: "Note It will automatically delete all topic related forms.",
    //                            type: 'question',
    //                            showCancelButton: true,
    //                            confirmButtonColor: '#3085d6',
    //                            cancelButtonColor: '#d33',
    //                            confirmButtonText: 'Yes',                               
    //                            cancelButtonText: 'No',
    //                            position: 'top'
    //                        }).then((result) => {
    //                            if (result.value) {
    //                                //topic delete function
    //                                alert("delete topic too");
    //                            }
    //                            else {
    //                                alert("Only form delete");
    //                            }
    //                        });
    //                    }
    //                    if (exists.res == 2 && action == "3") {

    //                        swal({
    //                            title: 'Do you want to delete topic Too?',
    //                            text: "Note It will automatically delete all topic related forms.",
    //                            type: 'question',
    //                            showCancelButton: true,
    //                            confirmButtonColor: '#3085d6',
    //                            cancelButtonColor: '#d33',
    //                            confirmButtonText: 'Yes, delete it',
    //                            position: 'top'
    //                        }).then((result) => {
    //                            if (result.value) {
    //                                //topic delete function
    //                                alert("delete topic too");
    //                            }
    //                            else {
    //                                alert("Only form delete");
    //                            }
    //                        });

    //                    }

    //                }
    //            }
    //            $rootScope.$emit("HideLoading");
    //        }, function (err) {
    //            $rootScope.$emit("HideLoading");
    //            console.log("some error occured." + err);
    //        });
    //};

    function TopicDeletion(action) {
        $rootScope.$emit("ShowLoading");
        var param = {};
        param = $scope.formOptionDetails;
        param.action = action;
        param.created_by = $scope.userDetail.Id;
        param.updated_by = $scope.userDetail.Id;
        param.DeleteTopic = "True";
        mainService.manageDeletion("ManageDeletion", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data)) {
                        var exists = response.data;
                        if (exists.res == 1) {
                            notifierService.notifyMessage('success', 'Deleted Records', exists.Message);
                            $ngBootbox.hideAll();
                            $state.reload();
                        }
                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };


    var dialog = '';
    $scope.copyApplication = function (method) {
        $scope.applicationId = $scope.formOptionDetails.applicationId;
        if (method === "copy-application") {
            dialog = $ngBootbox.customDialog({
                templateUrl: 'copyApplication.html',
                scope: $scope,
                title: 'Copy Folder',
                size: "large"
            });
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 250);
        }
        return false;
    };

    $scope.copyFormDetail = function (formdetails) {
        $scope.currentFormType = formdetails.currentFormType;
        $ngBootbox.hideAll();
        $ngBootbox.customDialog({
            templateUrl: 'advanceQuickAddFormsCopy.html',
            scope: $scope,
            size: "large"
        });
        $timeout(function () {
            Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
            Waves.attach('.flat-buttons', ['waves-button']);
            Waves.init();
        }, 250);
    };
    $scope.editTopic = function () {
        localStorage.setItem("editTopic", $scope.formOptionDetails.formId);
    };
    $scope.copyApplicationFunc = function () {
        $rootScope.$emit("ShowLoading");
        var param = {};
        param = $scope.applicationCopyTemp;
        param.action = 11;
        param.created_by = $scope.userDetail.Id;
        param.updated_by = $scope.userDetail.Id;
        param.applicationId = $scope.applicationId;
        mainService.copyApplication("copyApplication", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    if (angular.isDefined(response.data)) {
                        var exists = response.data;
                        if (exists.res == 1) {
                            notifierService.notifyMessage('success', 'Copy Folder', exists.Message);
                            $ngBootbox.hideAll();
                        }
                    }
                }
                $rootScope.$emit("HideLoading");
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });
    };
    $scope.closeNOw = function () {
        $ngBootbox.hideAll();
    };

    $scope.openCalenderEntryPage = function (formid) {
        $rootScope.$emit("ShowLoading");
        var param = {};
        param.formId = formid;
        param.created_by = $scope.userDetail.Id;
        param.update_by = $scope.userDetail.Id;
        param.action = 4;
        mainService.manageForm("ManageForm", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    var formDataTemp = response.data[0];
                    $scope.formDetailsDataInfo = formDataTemp;
                    var formList = "";
                    var formlistIds = [];
                    var list = [];
                    if ($scope.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var temp = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                            return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                        });
                        _.each(temp, function (item) {
                            list.push(item.resourceForm);
                            formlistIds.push(0);
                        });
                        formList = list.join(',');
                        formlistIds = formlistIds.join(',');
                    }
                    $state.go("saveFormEventData", {
                        "formId": param.formId, "popup": 1, "customForms": formList, "customFormIds": formlistIds
                    });
                    $rootScope.$emit("HideLoading");
                }
            }, function (err) {
                $rootScope.$emit("HideLoading");
                console.log("some error occured." + err);
            });



    };

    $scope.init();
});
FormGeneratorApp.controller('tabulatorConfigurationsController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, CookiesPersistenceService, notifierService, translationService) {
    var tabulator = '';
    var optionColorPicker = function (cell, onRendered, success) {
        var editor, type = '', options = '';
        editor = $('<input class="form-control colorpicker-element" placeholder="pick color" type="text" value="' + cell.getValue() + '">');
        editor.css({
            "padding": "6px",
            "width": "100%",
            "box-sizing": "border-box"
        });
        if (typeof cell.getValue() !== "undefined")
            editor.val(cell.getValue());
        else
            editor.val("");
        editor.colorpicker();
        onRendered(function () {
            editor.focus();
        });
        editor.on("change blur", function (e) {
            $('.colorpicker.colorpicker-visible').remove();
            success(editor.val());
        });
        return editor[0];
    };

    $scope.init = function () {

        $scope.importFormSettings = { language: 1 };
        $scope.getLanguage();
        $scope.ApplyMultilingualText();
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

        };


        var langId = "1";
        if (!DataService.isEmpty($scope.importFormSettings.language) && $scope.importFormSettings.language != null) {
            if (localStorage.getItem("globalLang") == null) {
                localStorage.setItem("globalLang", $scope.importFormSettings.language);
            } else {
                if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != 'null') {
                    if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                        $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                        langId = localStorage.getItem("globalLangForm");
                    } else {
                        $scope.importFormSettings.language = localStorage.getItem("globalLang");
                        langId = localStorage.getItem("globalLang");
                    }
                }
            }
        } else {

            if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                langId = localStorage.getItem("globalLangForm");
            }
            else {
                $scope.importFormSettings.language = 1;
            }

        }




        $scope.tabulatorConfig = {};
        $scope.tabulatorConfig.saveText = getStringFromMultiligualText("Save|節省|节省", langId);
        $scope.tabulatorList = [];
        $scope.groupingListTemp = [];
        $scope.groupingList = [];
        var customheaders = [
            { field: getStringFromMultiligualText("row Handle|行句柄|行句柄", langId), rowHandle: true, formatter: "handle", headerSort: false, frozen: true, width: 35, minWidth: 30 },
            { title: getStringFromMultiligualText("Field ID|字段編號|字段编号", langId), field: "field", headerSort: false, visible: false },
            { title: getStringFromMultiligualText("Field Name|字段名稱|字段名称", langId), field: "title", headerSort: false, editor: true },
            { title: getStringFromMultiligualText("Heading Tooltip|標題工具提示|标题工具提示", langId), field: "headerTooltip", editor: true, headerSort: false, visible: true, value: true },
            { title: getStringFromMultiligualText("Column Pixel|列像素|列像素", langId), field: "width", headerSort: false, editor: true, validator: ["min:1", "numeric"] },
            { title: getStringFromMultiligualText("Display Column|顯示列|显示列", langId), field: "visible", editor: true, headerSort: false, formatter: "tick" },
            { title: getStringFromMultiligualText("Foreground Color|前景色|前景色", langId), field: "forecolor", editor: optionColorPicker, headerSort: false, value: true },
            { title: getStringFromMultiligualText("Background Color|背景顏色|背景颜色", langId), field: "backgroundColor", editor: optionColorPicker, headerSort: false, value: true },
            { title: getStringFromMultiligualText("Dropdown Values|下拉值|下拉值", langId), field: "dropdownValue", editor: true, headerSort: false, value: true }
        ];
        tabulator = initTabulator("tabulatorConfigSection", {
            // selectable: true,
            selectable: 1,
            movableRows: true,
            placeholder: getStringFromMultiligualText("No records|沒有記錄|没有记录", langId) + "....",
            height: "500px",
            layout: "fitDataFill",
            persistentLayout: true,
            persistenceID: "tabulatorConfig",
            persistenceMode: true,
            persistence: {
                sort: true, //persist column sorting
                filter: true, //persist filter sorting
                page: true, //persist page
                columns: true, //persist columns
            },
            columns: customheaders,
            cellEdited: function (cell) {
                //This callback is called any time a cell is edited
                var input = []; var json = {}; var columnName = cell.getColumn().getField();
            }
        });
        $scope.tabuDetails = {};
        $scope.formDatafields = {};
    };
    $scope.$on("updateTabulatorId", function (event, data, tabuDetails, formDatafields) {
        $scope.init();
        $scope.tabulatorLayoutId = data;
        var param = {};
        param.action = 5;
        param.TabulatorID = $scope.tabulatorLayoutId;
        $scope.manageTabulator(param);
        $scope.tabuDetails = tabuDetails;
        $scope.formDatafields = formDatafields;
        $timeout(function () {
            filterTabu(tabuDetails, formDatafields, 1);
        }, 250);
    });
    function filterTabu(tabuDetails, formDatafields, type) {
        var list = [];
        var getColumnLayout = [];
        if (!DataService.isEmpty(tabuDetails) && type == 1)
            getColumnLayout = tabuDetails.getColumnLayout();
        else if (type == 2) {
            var list = JSON.parse(tabuDetails.configSettings);
            getColumnLayout = list;
        }
        var rowHandle = false;
        getColumnLayout = _.uniq(getColumnLayout, "field");
        _.each(getColumnLayout, function (item) {
            var exists = {};
            if (DataService.isEmpty(item.field) && item.rowHandle == true)
                exists = _.findWhere(formDatafields, { rowHandle: item.rowHandle });
            else if (DataService.isEmpty(item.field) && item.rowEdit == true)
                exists = _.findWhere(formDatafields, { rowEdit: item.rowEdit });
            else
                exists = _.findWhere(formDatafields, { field: item.field });
            if (item.visible != false) {
                var temp = {};
                temp = item;
                if (!DataService.isEmpty(exists)) {
                    temp.title = exists.title;
                    temp.type = exists.type;
                    temp.types = exists.types;
                    temp.subtype = exists.subtype;
                    temp.headerSort = exists.headerSort;
                    temp.hozAlign = exists.hozAlign;
                    temp.align = exists.align;
                    temp.headerFilter = exists.headerFilter;
                }
                temp.label = item.title;
                temp.foregroundcolor = item.forecolor;
                temp.background_color = item.backgroundColor;
                temp.values = item.dropdownValue;
                temp.name = temp.field;
                temp.visible = true;
                if (!DataService.isEmpty(item.field) && item.field != "parentActions" && item.field != "rowHandle" && item.field != "subItems") {
                    if (!item.field.contains("rowHandle"))
                        $scope.groupingListTemp.push(temp);
                }

                if (!DataService.isEmpty(item.headerTooltip)) {
                    temp.hozAlign = "center";
                    temp.headerTooltip = item.headerTooltip;
                }
                else {
                    if (!DataService.isEmpty(exists))
                        temp.headerTooltip = exists.headerTooltip;
                }
                if (DataService.isEmpty(temp.background_color)) {
                    if (!DataService.isEmpty(exists)) {
                        temp.backgroundColor = exists.backgroundColor;
                        temp.forecolor = exists.forecolor;
                        temp.values = exists.dropdownValue;
                    }
                }
                list.push(temp);
            }
            else {
                if (!DataService.isEmpty(exists)) {
                    //item.title = exists.title;
                    list.push(item);
                }
                else if (DataService.isEmpty(exists)) {
                    if (!DataService.isEmpty(item.field)) {
                        list.push(item);
                    }
                }
            }
        });
        if ($scope.groupingListTemp.length > 0) {
            $scope.groupingList = angular.copy($scope.groupingListTemp);
        }
        tabulator.setData(list);
    }
    $scope.saveConfig = function () {

        if (!DataService.isEmpty($scope.tabulatorConfig.Id)) {
            $scope.tabulatorConfig.action = 2;
        } else {
            $scope.tabulatorConfig.action = 1;
        }
        $scope.tabulatorConfig.tabulatorID = $scope.tabulatorLayoutId;
        $scope.tabulatorConfig.userID = $scope.userDetail.Id;
        $scope.tabulatorConfig.configSettings = tabulator.getData();

        if (DataService.isEmpty($scope.tabulatorConfig.recordsPerPage) || $scope.tabulatorConfig.recordsPerPage == 0) {
            $scope.tabulatorConfig.recordsPerPage = 10;
        }
        if (!DataService.isEmpty($scope.tabulatorConfig.configSettings)) {
            _.each($scope.tabulatorConfig.configSettings, function (item, key) {
                item.frozen = false;
                if (DataService.isEmpty(item.visible))
                    item.visible = false;
                if ($scope.tabulatorConfig.frozenColumn > 0) {
                    if (key < $scope.tabulatorConfig.frozenColumn) {
                        item.frozen = true;
                        item.align = "left";
                    } else {
                        item.frozen = false;
                    }
                }
            });
            $scope.tabulatorConfig.configSettings = JSON.stringify($scope.tabulatorConfig.configSettings);
        }
        $scope.manageTabulator($scope.tabulatorConfig);
    };
    var dialogChild = '';
    $scope.openListConfig = function () {
        $scope.$emit("updateTabulatorIdChild", $scope.tabulatorLayoutId);
        dialogChild = $ngBootbox.customDialog({
            templateUrl: 'tabulatorConfigurationsListModelPopup.html',
            scope: $scope,
            title: 'Tabulator Config List',
            size: "large",
            show: true,
            backdrop: false,
            closeButton: false,
            animate: true,
            className: 'modal2Xlarge',
            buttons: {
                warning: {
                    label: "Cancel",
                    className: "btn-warning",
                    callback: function () {
                        setTimeout(function () {
                            $('body').addClass("modal-open");
                        }, 750);
                    }
                }
            }
        });
    };

    $scope.$on("editTabulatorConfigSettings", function (event, data, type) {
        if (type == 2) {
            var temp = data;
            $scope.tabulatorConfig = temp;
            $scope.tabulatorConfig.type = "Edit Setting";
            $scope.tabulatorConfig.saveText = "Update";
            $timeout(function () {
                filterTabu($scope.tabulatorConfig, $scope.formDatafields, 2);
            }, 180);
        } else if (type == 3) {
            var temp = $scope.tabulatorList[0];
            if (temp.Id == $scope.tabulatorConfig.Id) {
                $scope.clearForNewConfig();
            }
        }
        else if (type == 6) {
            $scope.tabulatorConfig = data;
            $scope.tabulatorConfig.type = "Edit Setting";
            $scope.tabulatorConfig.saveText = "Update";
            $timeout(function () {
                filterTabu($scope.tabulatorConfig, $scope.formDatafields, 2);
            }, 180);
        }
    });


    function reload() {
        localStorage.removeItem("tabulator-persisrecords-columns");
        localStorage.removeItem("tabulator-" + $scope.tabulatorConfig.tabulatorID + "-columns");
        $timeout(function () {
            location.reload();
        }, 500);
    }

    $scope.$on("resetPersistence", function (event, data) {
        reload();
    });

    $scope.manageTabulator = function (param) {

        mainService.manageTabulatorConfig("manageTabulatorConfig", param)
            .then(function (response) {
                if (response.data != null && angular.isDefined(response.data)) {
                    $scope.tabulatorList = response.data;
                    if (param.action == 1 || param.action == 2) {
                        notifierService.notifyMessage('success', 'Tabulator Config', response.data[0].message);
                        var temp = $scope.tabulatorList[0];
                        $scope.tabulatorConfig = temp;
                        $scope.tabulatorConfig.type = "Edit Setting";
                        $scope.tabulatorConfig.saveText = "Update";
                        reload();
                    }
                    else {
                        if ($scope.tabulatorList.length > 0) {
                            var temp = $scope.tabulatorList[0];
                            $scope.tabulatorConfig = temp;
                            $scope.tabulatorConfig.type = "Edit Setting";
                            $scope.tabulatorConfig.saveText = "Update";
                        } else {
                            $scope.tabulatorConfig = {};
                            $scope.tabulatorConfig.tabulatorID = $scope.tabulatorLayoutId;
                            $scope.tabulatorConfig.userID = $scope.userDetail.Id;
                            $scope.tabulatorConfig.recordsPerPage = 20;
                            $scope.tabulatorConfig.frozenColumn = 0;
                            $scope.tabulatorConfig.headingHeight = 0;
                            $scope.tabulatorConfig.type = "New Setting";
                            $scope.tabulatorConfig.saveText = "Save as New";
                        }
                    }

                }
            }, function (err) {
                console.log("some error occured." + err);
            });
    }
    $scope.closeConfig = function () {
        $ngBootbox.hideAll();
    };
    $scope.resetConfig = function () {
        $ngBootbox.hideAll();
        reload();
    };
    $scope.clearForNewConfig = function () {
        $scope.tabulatorConfig = {};
        $scope.tabulatorConfig.saveText = "Save as New";
        $scope.tabulatorConfig.recordsPerPage = 0;
        $scope.tabulatorConfig.frozenColumn = 0;
        $scope.tabulatorConfig.headingHeight = 0;
        filterTabu($scope.tabuDetails, $scope.formDatafields, 1);
    }
});
FormGeneratorApp.filter('to_trustedControl', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);





