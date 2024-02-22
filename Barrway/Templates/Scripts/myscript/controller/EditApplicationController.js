(function () {
    'use strict';

    FormGeneratorApp.controller('EditApplicationController', function ($scope, $http, $interpolate, $rootScope, $timeout, $ngBootbox, $location, $window, mainService, $state, $stateParams, DataService, notifierService, tabulatorConfiguratorSettings, translationService) {
         
        var tabulator = '';
        function cellFormatterBackgroundColor(cell) {
            $scope.cellFormatterBackgroundColorCustom(cell, $scope.tabulatorConfiguratorSettings);
            if (!DataService.isEmpty(cell.getValue()))
                return cell.getValue();
        }

        //custom formatter definition
        var actionIcon = function (cell, formatterParams) {
            cellFormatterBackgroundColor(cell)
            if (formatterParams.type === 1)
                return '<img src="assets/images/settings.png" width="20">';
            else
                return '<i class="fa fa-cogs" aria-hidden="true"></i>';
        };

        var langId = "1";
        if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
            langId = localStorage.getItem("globalLangForm");
        }
        else if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != 'null') {
            langId = localStorage.getItem("globalLang");
        }
        else {
            langId = "1";
        }

        var formTypes = ['', getStringFromMultiligualText("Personal|個人的|个人的", langId), getStringFromMultiligualText("Private|私人的|私人的", langId), getStringFromMultiligualText("Public|民眾|上市", langId), getStringFromMultiligualText("Open|打開|打开", langId)];
        var formStatus = ['', getStringFromMultiligualText("Draft|草稿|草稿", langId), getStringFromMultiligualText("Active|積極的|积极的", langId), getStringFromMultiligualText("Inactive|無效|无效", langId), getStringFromMultiligualText("Template|模板|模板", langId)];
        //var formTypes = ['', 'Personal', 'Private', 'Public', 'Open'];
        //var formStatus = ['', 'Draft', 'Active', 'Inactive', 'Template'];
        var formLink = function (cell, formatterParams, onRendered) { //plain text value
            cellFormatterBackgroundColor(cell)
            return "<a>" + cell.getRow().getData().title + "</a>";
        };
        var datetimeFormatter = function (cell) {
            cellFormatterBackgroundColor(cell)
            var _date = cell.getRow().getData().lastActivityDate;
            var returnDate = "";
            if (_date == null || (typeof _date === 'undefined')) { returnDate = ''; }
            else
                returnDate = customDate(_date);


            return returnDate;

        }

        $scope.manageApplication = function (param) {
            mainService.manageApplication("ManageApplication", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data);
                        if (param.action == 6) {
                            if (response.data.length > 0) {
                                $scope.applicationData = response.data[0];
                                $scope.applicationData.status = $scope.applicationData.status.toString();
                                if (DataService.isEmpty($scope.applicationData.publicTemplate)) {
                                    $scope.applicationData.publicTemplate = "No"
                                }
                                if (DataService.isEmpty($scope.applicationData.protectedApplication)) {
                                    $scope.applicationData.protectedApplication = "No"
                                }
                                $scope.applicationDataTemp = angular.copy($scope.applicationData);
                                if (!DataService.isEmpty($state.current.ncyBreadcrumb)) {
                                    $state.current.ncyBreadcrumb.label = $scope.applicationDataTemp.applicationTitle;
                                    var parseLabel = $interpolate($state.current.ncyBreadcrumb.label);
                                    $state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
                                }
                                $rootScope.safeApply();
                            }
                        } else {
                            if (response.data.length > 0) {
                                notifierService.notifyMessage('success', 'Folder', response.data[0].Message);
                            }
                        }
                    }
                }, function (err) {
                    console.log("some error occured." + err);
                });
        }
        $scope.manageTopic = function (param) {
            mainService.manageTopic("ManageTopic", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 4 || param.action == 5) {
                            if (response.data.length > 0) {
                                $scope.topicList = response.data;
                            }
                        } else {
                            if (response.data.length > 0) {
                                var exists = {};
                                exists = response.data[0];
                                var temp = {};
                                temp.topicId = exists.topicId;
                                temp.topicTitle = param.topicTitle;
                                $scope.topicList.push(temp);
                                $scope.topicParamForForm.topicName = temp.topicTitle;
                                $scope.topicParamForForm.topicId = temp.topicId.toString();
                                if (exists.res == 1)
                                    notifierService.notifyMessage('success', 'Topic', exists.Message);
                                else
                                    notifierService.notifyMessage('error', 'Topic', exists.Message);
                                //$('#addFormModal').modal('hide');
                            }
                        }
                    }
                }, function (err) {
                    console.log("some error occured." + err);
                });
        }
        var dialogOpenAddTopic = "";
        $scope.openAddTopic = function () {
            $scope.topicParam = {};
            dialogOpenAddTopic = $ngBootbox.customDialog({
                templateUrl: 'addTopicModal.html',
                title: getStringFromMultiligualText("Add New Topic|添加新主題|添加新主题", langId),
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons
            });
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 250);
        };
        $scope.onTopicSubmit = function () {

            $scope.topicParam.action = 1;
            $scope.topicParam.created_by = $scope.userDetail.Id;
            $scope.topicParam.update_by = $scope.userDetail.Id;
            $scope.topicParam.applicationId = $scope.topicParamForForm.applicationId;
            $scope.topicParam.max_records = 1000000;
            $scope.manageTopic($scope.topicParam);
            $('#addTopicModal').modal('hide');
            $(".modal-backdrop").remove();
        };
        $scope.onSubmit = function () {
            if ($scope.myForm.$valid) {
                console.log($scope.applicationData)
                $scope.applicationData.action = 2;
                $scope.applicationData.created_by = $scope.userDetail.Id;
                $scope.applicationData.updated_by = $scope.userDetail.Id;
                mainService.manageApplication("ManageApplication", $scope.applicationData)
                    .then(function (response) {

                        if (response.data != null && angular.isDefined(response.data)) {
                            if (response.data.length > 0) {
                                //alert(response.data[0].Message);
                                notifierService.notifyMessage('success', 'Folder', response.data[0].Message);
                            }
                        }
                    }, function (err) {

                        console.log("some error occured." + err);

                    });
            }
        };
        $scope.saveFormModel = function () {
            var id = parseInt($scope.topicParamForForm.topicId)
            var tempTopic = _.findWhere($scope.topicList, { topicId: id });
            $scope.topicParamForForm.topicName = tempTopic.topicTitle;
            localStorage.setItem("formModel", JSON.stringify($scope.topicParamForForm));
            $('#addTopicModal').modal('hide');
            $(".modal-backdrop").remove();
            if ($scope.currentFormType == 0 || $scope.currentFormType == 1)
                $state.go("form", { "topicId": $scope.topicParamForForm.topicId }, { reload: true, inherit: false });
            else if ($scope.currentFormType == 2)
                $state.go("queue", { "topicId": $scope.topicParamForForm.topicId }, { reload: true, inherit: false });
        };

        /*Tabulator Configration Popup functions*/
        $scope.saveTabulatorLayout = function (type, isForm) {

            $scope.tabulatorLayoutId = type;
            $ngBootbox.customDialog({
                templateUrl: 'tabulatorConfigurationsModelPopup.html',
                scope: $scope,
                title: getStringFromMultiligualText("Tabulator Layout Configurations|製表符佈局配置|制表符布局配置", langId),
                size: "large",
                className: 'modal2Xlarge',
                closeButton: false
            });

            $timeout(function () {
                $scope.$broadcast("updateTabulatorId", $scope.tabulatorLayoutId, tabulator, $scope.tabulatorHeaders);
            }, 420);
        };
        /*generate tabulatorheaders*/
        function bindTabulatorHeaders(type) {
             
            if (!DataService.isEmpty($scope.tabulatorConfiguratorSettings.configSettings)) {
                var tabuSettings = $scope.tabulatorConfiguratorSettings.configSettings;
                $scope.paginationSizeFormRecords = $scope.tabulatorConfiguratorSettings.recordsPerPage;
                $scope.paginationSizeFormRecords = $scope.tabulatorConfiguratorSettings.recordsPerPage;
                var list = JSON.parse(tabuSettings);
                _.each(list, function (item, key) {
                     
                    if (item.field == "parentActions") {
                        item.formatter = actionIcon;
                        item.cellClick = function (e, cell) {
                            var rowData = cell.getRow().getData();
                            var topicId = rowData.topicId;
                            var formId = rowData.formId;
                            var applicationId = rowData.applicationId;
                            var appRole = typeof rowData.appRole !== 'undefined' ? rowData.appRole : 3;

                            var formName = removeHtmlFromString(rowData.title),
                                topicName = rowData.topicTitle,
                                isAccessible = rowData.isAccessible;

                            var formEditUrl = "#/form/edit/" + formId;
                            var formDeleteUrl = "/subforms/delete/" + formId;
                            var formFilterUrl = "/subforms/filter-criteria/" + formId;
                            var formRoleUrl = "/user-forms/roles/" + formId;

                            var formSummaryUrl = "/summary/" + formId;
                            var formClearUrl = "/clear_records/" + formId;
                            var formEntryUrl = "/savedata/" + formId;
                            var formRecordUrl = "/form/records/" + formId;
                            $scope.formOptionDetails = rowData;
                            $scope.formOptionDetails.pathType = $state.current.name;
                            $scope.formOptionDetails.isAllFormCustomDialog = true;
                            var tempTitle = $scope.formOptionDetails.title + ' ( ' + $scope.formOptionDetails.topicTitle + ' ) ';
                            var dialog = $ngBootbox.customDialog({
                                templateUrl: 'allFormCustomDialog.html',
                                title: tempTitle,
                                scope: $scope,
                                size: 'large'
                                //  buttons: $scope.customDialogButtons
                            });
                            if (appRole == 3) {
                                var actions = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<a class="float-buttons wv-btn wv-success btn-md entry-button" href="' + formEntryUrl + '"><i class="fa fa-plus" aria-hidden="true"></i> Entry</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-info btn-md" href="' + formRecordUrl + '"><i class="fa fa-list-ol" aria-hidden="true"></i> Records</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formSummaryUrl + '"><i class="fa fa-th-list" aria-hidden="true"></i> Summary</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_form\',\'{{$url}}\')" class="float-buttons wv-btn wv-first" title="Copy Form"><i class="fa fa-copy"></i> Copy Form</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                    '<div class="form-group custom-checkbox more_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-more-settings" id="more_setup" name="more_setup">&nbsp;<label for="more_setup">Administrator Settings</label></div>' +
                                    '<div class="form-group">' +
                                    '<a class="float-buttons wv-btn wv-first btn-md" href="' + formEditUrl + '"><i class="fa fa-edit" aria-hidden="true"></i> Edit Form</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formFilterUrl + '"><i class="fa fa-filter" aria-hidden="true"></i> Filter Criteria</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formRoleUrl + '"><i class="fa fa-user-tag" aria-hidden="true"></i> Form Roles</a>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formClear(\'' + formClearUrl + '\');"><i class="fa fa-eraser" aria-hidden="true"></i> Clear Records</button>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formDel(\'' + formDeleteUrl + '\');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Form</button></div>' +
                                    '<div class="form-group custom-checkbox advance_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-advance-settings" id="advance_setup" name="advance_setup">&nbsp;<label for="advance_setup">Advance Settings</label></div>' +
                                    '<div class="form-group">' +
                                    '<a href="" class="float-buttons wv-btn wv-first btn-md"><i class="fa fa-edit" aria-hidden="true"></i> Edit Topic</a>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" title="Delete Menu" onClick="return topicDel(' + topicId + ');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Topic</button>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-info group-actions" title="Quick Edit"><i class="fa fa-pen"></i> Quick Edit Form</a>&nbsp;&nbsp;' +
                                    '<br/><a href="" class="float-buttons wv-btn wv-warning" title="Export to JSON"><i class="fa fa-download"></i> Export to JSON</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Full)"><i class="fa fa-download"></i> Export to Excel (Full)</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Basic)"><i class="fa fa-download"></i> Export to Excel (Basic)</a>&nbsp;&nbsp;' +
                                    '</div></div></div></div></div>';
                            } else {
                                var actions = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<a class="float-buttons wv-btn wv-success btn-md entry-button" href="' + formEntryUrl + '"><i class="fa fa-plus" aria-hidden="true"></i> Entry</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-info btn-md" href="' + formRecordUrl + '"><i class="fa fa-list-ol" aria-hidden="true"></i> Records</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formSummaryUrl + '"><i class="fa fa-th-list" aria-hidden="true"></i> Summary</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_form\',\'{{$url}}\')" class="float-buttons wv-btn wv-first" title="Copy Form"><i class="fa fa-copy"></i> Copy Form</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Form"><i class="fa fa-download"></i> Export to Form</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Full)"><i class="fa fa-download"></i> Export to Excel (Full)</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Basic)"><i class="fa fa-download"></i> Export to Excel (Basic)</a>&nbsp;&nbsp;' +
                                    '</div></div></div>';
                            }

                            $("div.form-group.more_setup-wrap", '.card-blue').nextUntil("div.form-group.advance_setup-wrap").hide();
                            $("div.form-group.advance_setup-wrap", '.card-blue').nextAll("div.form-group").hide();
                        };

                    }
                    else if (item.field == "title") {
                        item.formatter = formLink;
                        item.cellClick = function (e, cell) {
                            if (!cell.getRow().getData().otherApp) {
                                var rowData = cell.getRow().getData();
                                var formId = cell.getRow().getData().formId;
                                var topicId = cell.getRow().getData().topicId;
                                // window.location.href = "application/edit/" + applicationId;
                                if (rowData.currentFormType == 0)
                                    $state.go('records', { formId: formId });
                                else if (rowData.currentFormType == 1)
                                    $state.go('CalenderRecords', { formId: formId });
                                else
                                    $state.go('queueRecords', { topicId: topicId });
                            }
                        }

                    }

                    else if (item.field == "lastActivityDate") {
                        item.formatter = datetimeFormatter;
                    }
                    else {
                        item.formatter = cellFormatterBackgroundColor;
                    }
                    if (!DataService.isEmpty(item.dropdownValue)) {
                        item.headerFilter = "select";
                        item.dropdownValue = item.dropdownValue.replace(/'/g, '"');
                        var valuesData = (!DataService.isEmpty(JSONTryParse(item.dropdownValue)) ? JSONTryParse(item.dropdownValue) : true);
                        item.headerFilterParams = { values: valuesData };
                    }
                });
                $scope.tabulatorHeaders = list;


            }
            else {
                $scope.tabulatorHeaders = [ //set column definitions for imported table data
                    {
                        title: "Actions|動作|动作", field: "parentActions", formatter: actionIcon,
                        visible: true,
                        formatterParams: { type: 2 }, width: 70, frozen: true, headerSort: false, align: "center",
                        cellClick: function (e, cell) {
                            var rowData = cell.getRow().getData();
                            var topicId = rowData.topicId;
                            var formId = rowData.formId;
                            var applicationId = rowData.applicationId;
                            var appRole = typeof rowData.appRole !== 'undefined' ? rowData.appRole : 3;

                            var formName = removeHtmlFromString(rowData.title),
                                topicName = rowData.topicTitle,
                                isAccessible = rowData.isAccessible;

                            var formEditUrl = "#/form/edit/" + formId;
                            var formDeleteUrl = "/subforms/delete/" + formId;
                            var formFilterUrl = "/subforms/filter-criteria/" + formId;
                            var formRoleUrl = "/user-forms/roles/" + formId;

                            var formSummaryUrl = "/summary/" + formId;
                            var formClearUrl = "/clear_records/" + formId;
                            var formEntryUrl = "/savedata/" + formId;
                            var formRecordUrl = "/form/records/" + formId;
                            $scope.formOptionDetails = rowData;
                            $scope.formOptionDetails.pathType = $state.current.name;
                            $scope.formOptionDetails.isAllFormCustomDialog = true;
                            var tempTitle = $scope.formOptionDetails.title + ' ( ' + $scope.formOptionDetails.topicTitle + ' ) ';
                            var dialog = $ngBootbox.customDialog({
                                templateUrl: 'allFormCustomDialog.html',
                                title: tempTitle,
                                scope: $scope,
                                size: 'large'
                                //  buttons: $scope.customDialogButtons
                            });
                            if (appRole == 3) {
                                var actions = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<a class="float-buttons wv-btn wv-success btn-md entry-button" href="' + formEntryUrl + '"><i class="fa fa-plus" aria-hidden="true"></i> Entry</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-info btn-md" href="' + formRecordUrl + '"><i class="fa fa-list-ol" aria-hidden="true"></i> Records</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formSummaryUrl + '"><i class="fa fa-th-list" aria-hidden="true"></i> Summary</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_form\',\'{{$url}}\')" class="float-buttons wv-btn wv-first" title="Copy Form"><i class="fa fa-copy"></i> Copy Form</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                    '<div class="form-group custom-checkbox more_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-more-settings" id="more_setup" name="more_setup">&nbsp;<label for="more_setup">Administrator Settings</label></div>' +
                                    '<div class="form-group">' +
                                    '<a class="float-buttons wv-btn wv-first btn-md" href="' + formEditUrl + '"><i class="fa fa-edit" aria-hidden="true"></i> Edit Form</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formFilterUrl + '"><i class="fa fa-filter" aria-hidden="true"></i> Filter Criteria</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formRoleUrl + '"><i class="fa fa-user-tag" aria-hidden="true"></i> Form Roles</a>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formClear(\'' + formClearUrl + '\');"><i class="fa fa-eraser" aria-hidden="true"></i> Clear Records</button>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formDel(\'' + formDeleteUrl + '\');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Form</button></div>' +
                                    '<div class="form-group custom-checkbox advance_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-advance-settings" id="advance_setup" name="advance_setup">&nbsp;<label for="advance_setup">Advance Settings</label></div>' +
                                    '<div class="form-group">' +
                                    '<a href="" class="float-buttons wv-btn wv-first btn-md"><i class="fa fa-edit" aria-hidden="true"></i> Edit Topic</a>&nbsp;&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-danger btn-md" title="Delete Menu" onClick="return topicDel(' + topicId + ');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Topic</button>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-info group-actions" title="Quick Edit"><i class="fa fa-pen"></i> Quick Edit Form</a>&nbsp;&nbsp;' +
                                    '<br/><a href="" class="float-buttons wv-btn wv-warning" title="Export to JSON"><i class="fa fa-download"></i> Export to JSON</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Full)"><i class="fa fa-download"></i> Export to Excel (Full)</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Basic)"><i class="fa fa-download"></i> Export to Excel (Basic)</a>&nbsp;&nbsp;' +
                                    '</div></div></div></div></div>';
                            } else {
                                var actions = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<a class="float-buttons wv-btn wv-success btn-md entry-button" href="' + formEntryUrl + '"><i class="fa fa-plus" aria-hidden="true"></i> Entry</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-info btn-md" href="' + formRecordUrl + '"><i class="fa fa-list-ol" aria-hidden="true"></i> Records</a>&nbsp;&nbsp;' +
                                    '<a class="float-buttons wv-btn wv-second btn-md" href="' + formSummaryUrl + '"><i class="fa fa-th-list" aria-hidden="true"></i> Summary</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_form\',\'{{$url}}\')" class="float-buttons wv-btn wv-first" title="Copy Form"><i class="fa fa-copy"></i> Copy Form</a>&nbsp;&nbsp;' +
                                    '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Form"><i class="fa fa-download"></i> Export to Form</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Full)"><i class="fa fa-download"></i> Export to Excel (Full)</a>&nbsp;&nbsp;' +
                                    '<a href="" class="float-buttons wv-btn wv-warning" title="Export to Excel (Basic)"><i class="fa fa-download"></i> Export to Excel (Basic)</a>&nbsp;&nbsp;' +
                                    '</div></div></div>';
                            }

                            $("div.form-group.more_setup-wrap", '.card-blue').nextUntil("div.form-group.advance_setup-wrap").hide();
                            $("div.form-group.advance_setup-wrap", '.card-blue').nextAll("div.form-group").hide();
                        }
                    },

                    {
                        title: "Form Name|表單名稱|表单名称", field: 'title', headerFilter: true,
                        formatter: formLink, align: "left", width: 120, visible: true, frozen: false,
                        cellClick: function (e, cell) {
                            if (!cell.getRow().getData().otherApp) {
                                var rowData = cell.getRow().getData();
                                var formId = cell.getRow().getData().formId;
                                var topicId = cell.getRow().getData().topicId;
                                // window.location.href = "application/edit/" + applicationId;
                                if (rowData.currentFormType == 0)
                                    $state.go('records', { formId: formId });
                                else if (rowData.currentFormType == 1)
                                    $state.go('CalenderRecords', { formId: formId });
                                else
                                    $state.go('queueRecords', { topicId: topicId });
                            }
                        }
                    },
                    { title: "Topic Name|主題名稱|主题名称", field: 'topicTitle', headerFilter: true, width: 120, visible: true, frozen: false, },
                    { title: "Form Tags|表單標籤|表单标签", field: 'formTag', headerFilter: true, width: 120, visible: true, frozen: false, },
                    { title: "Form Type|表單類型|表单类型", field: 'formTypeText', headerFilter: "select", headerFilterParams: { values: formTypes }, width: 120, visible: true, frozen: false, },
                    { title: "Last Activity|上次活動|上次活动", field: "lastActivityDate", formatter: datetimeFormatter, sorter: "datetime", headerFilter: true, sorter: 'datetime', sorterParams: { format: "YYYY/MM/DD HH:mm", alignEmptyValues: "bottom" }, alignEmptyValues: "bottom", width: 120, visible: true, frozen: false },
                    { title: "Number of Records|記錄數|记录数", field: "total_records", headerFilter: true, sorter: "number", align: 'right', width: 120, visible: true, frozen: false },
                    { title: "Form Status|表單狀態|表单状态", field: 'statusText', headerFilter: "select", headerFilterParams: { values: formStatus }, width: 120, visible: true, frozen: false },
                    { title: "App ID|應用編號|应用编号", field: 'applicationId', visible: false, width: 120, frozen: false },
                    { title: "Topic ID|主題編號|主题编号", field: 'topicId', visible: false, width: 120, frozen: false },
                    { title: "Form ID|表格編號|表格编号", field: 'formId', visible: false, width: 120, frozen: false }
                ];
            }
            if (type == 0) {
                if (!DataService.isEmpty($scope.tabulatorConfiguratorSettings.groupBy))
                    $scope.tabulatorConfig.groupBy = $scope.tabulatorConfiguratorSettings.groupBy;
                _.each($scope.tabulatorHeaders, function (item) {
                    if (item.field != "rowHandle" && item.field != "subItems" && item.field != "parentActions" && item.visible != false) {
                        //console.log(item.title, "item");
                        //item.title = "Name";
                        $scope.filterFieldsList.push(item);
                    }
                });
            } else {

            }

            $timeout(function () {
                if ($("#forms-table").length)
                    tabulator = initTabulator('forms-table', {
                        groupBy: $scope.tabulatorConfig.groupBy != "" ? $scope.tabulatorConfig.groupBy : null,
                        height: '560px',
                        initialSort: [
                            { column: "lastActivityDate", dir: "desc" }
                        ],
                        persistenceID: "editApplication",
                        persistentLayout: true,
                        responsiveLayout: true,
                        persistenceMode: true,                        
                        persistence: {
                            sort: false, //persist column sorting
                            filter: false, //persist filter sorting
                            columns: false, //persist columns
                        },  
                        layout: "fitDataFill",
                        footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                        dataLoaded: function (data) {
                            //data - all data loaded into the table
                            var count = 0;
                            if (data.length > 0)
                                count = data[0].totalRecords;
                            $('#forms-table .tabulator-footer #no-of-forms').text("Total Forms: " + count);
                        },
                        dataFiltered: function (filters, rows) {
                            //filters - array of filters currently applied
                            //rows - array of row components that pass the filters
                            $('#forms-table .tabulator-footer #no-of-forms').text("Total Forms: " + rows.length);
                        },


                        persistenceWriterFunc: function (id, type, data) {
                            //id - tables persistence id
                            //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
                            //data - array or object of data
                            //console.log(id, type, data);
                            localStorage.setItem(id + "-" + type, JSON.stringify(data));
                        },
                        persistenceReaderFunc: function (id, type) {
                            //id - tables persistence id
                            //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")

                            var data = localStorage.getItem(id + "-" + type);
                            var dataParse = JSON.parse(data);
                            if (!DataService.isEmpty(data) && type == "columns") {
                                _.each($scope.tabulatorHeaders, function (item) {
                                    var exists = _.findWhere(dataParse, {
                                        field: item.field
                                    });
                                    if (!DataService.isEmpty(exists)) {
                                        exists.visible = item.visible;
                                    }
                                })
                            }

                            return data ? dataParse : false;
                        },
                        initialSort: [
                            { column: "lastActivityDate", dir: "desc" }
                        ],
                        //set column definitions for imported table data
                        columns: $scope.tabulatorHeaders,
                        ajaxProgressiveLoad: "scroll",
                        ajaxProgressiveLoadScrollMargin: 25,
                        ajaxConfig: "POST",
                        ajaxContentType: "json",
                        ajaxURL: $scope.currentUrl + "/GetFormList",
                        ajaxParams: { action: 31, Id: $scope.userDetail.Id, userId: $scope.userDetail.Id, created_by: $scope.userDetail.Id, applicationId: $scope.applicationParameter.applicationId },
                        ajaxFiltering: true,
                        ajaxSorting: true,
                        ajaxLoader: true,
                        persistentLayout: true,
                        ajaxRequesting: function (url, params) {
                            $('#forms-table').block({ message: '<h4>Getting Forms...</h4>' });
                            var called = true;
                            var temp = _.filter(params.filters, function (fltr) {
                                return typeof fltr.value == "object"
                            });
                            if (!DataService.isEmpty(temp)) {
                                if (typeof temp[0].value == "object")
                                    called = false;
                            }
                            return called; //abort ajax request

                        },
                        ajaxResponse: function (url, params, response) {
                            //url - the URL of the request
                            //params - the parameters passed with the request
                            //response - the JSON object returned in the body of the response.
                            $('#forms-table').unblock();
                            return response; //return the tableData property of a response json object
                        },
                        paginationSize: $scope.paginationSizeFormRecords


                    });
            }, 150);

        };
        $scope.onGroupByChange = function (data) {
            bindTabulatorHeaders(1);
        };


        $scope.init = function () {
            var webActions = '<div class="pull-right text-right rightbtn">\n\
                            <a href="#/" class="btn btn-primary pull-left redirectMenuPage" title="Home"><i class="fa fa-home"></i></a>\n\
                            <a href="#/chat/summary" class="btn btn-primary pull-left chatSummary" title="Chat"><i class="fa fa-commenting"></i ></a >\n\  \n\ </div > ';
            $(".card-header").append(webActions);
            bootbox.hideAll();
            $scope.isEdit = false;
            $scope.applicationData = {};
            $scope.topicList = [];
            $scope.topicParamForForm = {};
            $scope.topicParam = {};
            $scope.applicationParameter = {};
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



            $scope.setLanguage = function () {
                if (!DataService.isEmpty($scope.importFormSettings.language) && $scope.importFormSettings.language != null) {
                    if (localStorage.getItem("globalLang") == null) {
                        localStorage.setItem("globalLang", $scope.importFormSettings.language);
                    } else {
                        if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != 'null') {
                            if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                                $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                            } else {
                                $scope.importFormSettings.language = localStorage.getItem("globalLang");
                            }
                        }
                    }
                } else {

                    if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                        $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                    }
                    else {
                        $scope.importFormSettings.language = 1;
                    }

                }
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



            $scope.accessList = [
                { name: getStringFromMultiligualText("Yes|是的|是的", langId), value: true, ischecked: false },
                { name: getStringFromMultiligualText("No|不|不", langId), value: false, ischecked: true }
            ];
            $scope.statusList = [
                { name: getStringFromMultiligualText("Draft|草稿|草稿", langId), value: 1, ischecked: true },
                { name: getStringFromMultiligualText("Active|積極的|积极的", langId), value: 2, ischecked: false },
                { name: getStringFromMultiligualText("InActive|不活躍|不活动", langId), value: 3, ischecked: false },
                { name: getStringFromMultiligualText("Template|模板|模板", langId), value: 4, ischecked: false }
            ];
            $scope.applicationData.status = 1;
            var param1 = $stateParams.appId;

            if (angular.isDefined(param1)) {
                $scope.applicationParameter.applicationId = parseInt(param1);
                $scope.topicParamForForm.applicationId = $scope.applicationParameter.applicationId;
                $scope.applicationParameter.action = 6;
                $scope.manageApplication($scope.applicationParameter);
                $scope.isEdit = true;
            }

            $scope.topicParamForForm.action = 5;
            $scope.manageTopic($scope.topicParamForForm);
            $scope.userDetail = mainService.loginDetails();


            $scope.tabulatorConfiguratorSettings = {};
            $scope.paginationSizeFormRecords = 20;
            if (!DataService.isEmpty(tabulatorConfiguratorSettings.data)) {
                if (tabulatorConfiguratorSettings.data.length > 0) {
                    $scope.tabulatorConfiguratorSettings = tabulatorConfiguratorSettings.data[0];
                }
            }
            $scope.tabulatorConfig = {};
            //console.log(tabulatorConfiguratorSettings)
            $scope.tabulatorHeaders = [];
            $scope.filterFieldsList = [];
            /**
              * Define Tabulator Headers       
              */
            bindTabulatorHeaders(0);

            //setTabulatorHeaderFilter(tabulator);
        };
        $scope.init();
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.addFormQueue = function (type) {
            $scope.currentFormType = 0;
            var title = getStringFromMultiligualText("Add Form|添加表格|添加表单", langId);
            if (type == 1) {
                $scope.currentFormType = 0;
            }
            else {
                $scope.currentFormType = 2;
                title = getStringFromMultiligualText("Add Queue|添加隊列|添加队列", langId);
            }
            var dialog = $ngBootbox.customDialog({
                templateUrl: 'addForm_QueueModel.html',
                title: title,
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons
            });
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 250);

        }
        $scope.openAddNewForm = function () {
            // $state.go('form', { topicId: 100 }, { reload: true, inherit: false});
        }
        function formFunction(applicationId, topicId, formId, type, url = '') {
            if (type === "copy_application") {
                bootbox.dialog({
                    onEscape: true,
                    title: getStringFromMultiligualText("Copy Folder|複製文件夾|复制文件夹", langId),
                    message: '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<form class="form-horizontal" id="quickFrm" action="{{url("getSave")}}">' +
                        '<input type="hidden" name="form_type" value="copy_application" /><input type="hidden" name="form_id" value="' + applicationId + '" />' +
                        '<div class="form-group"><label class="control-label col-sm-4">Folder name :</label><div class="col-sm-6"><input type="text" name="form_name" id="frmName" class="form-control"></div></div>' +
                        '<div class="form-group"><div class="col-sm-offset-4 col-sm-8">' +
                        '<button class="float-buttons wv-btn wv-first">Save</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></div></form>' +
                        '</div></div>'
                });
            }
            if (type === "copy_form") {
                var redirect = "{{url('getSave')}}";
                $.ajax({
                    type: "post",
                    url: url,
                    success: function (data) {
                        data = JSON.parse(data);
                        if (data) {
                            bootbox.dialog({
                                onEscape: true,
                                //title: "Copy Form",
                                message: '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<ul class="nav nav-tabs" role="tablist">' +
                                    '<li class="nav-item active"><a class="nav-link" data-toggle="tab" href="#home" role="tab">Quick Form</a></li>' +
                                    '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#profile" role="tab">Advance Form</a></li>' +
                                    '</ul><div class="tab-content">' +
                                    '<div class="tab-pane active" id="home" role="tabpanel">' +
                                    '<form class="form-horizontal" id="quickFrm" action="' + redirect + '">' +
                                    '<div class="col-sm-12 form-group"><input type="hidden" name="btnType" value="copy_btn" /><input type="hidden" name="copyformId" value="' + formId + '" />' +
                                    '<div class="col-sm-4"><label class="control-label">Enter Form Name :</label><input type="hidden" name="form_type" value="quick" /></div>' +
                                    '<div class="col-sm-8"><input type="text" name="form_name" id="frmName" class="form-control"></div></div>' +
                                    '<div class="col-sm-12 form-group">' +
                                    '<div class="col-sm-4"></div>' +
                                    '<div class="col-sm-8"><label><input type="checkbox" name="check_value" checked/> Put the Form in \"General Folder\"</label></div></div>' +
                                    '<div class="col-sm-offset-4 col-sm-8 navbar-btn btn-sm">' +
                                    '<button class="float-buttons wv-btn wv-first">Create</button> &nbsp;' +
                                    '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></form></div>' +
                                    '<div class="tab-pane" id="profile" role="tabpanel">' +
                                    '<form class="form-horizontal" id="advancedForm" action="' + redirect + '">' +
                                    '<div class="col-sm-12 form-group"><input type="hidden" name="form_type" value="advanced" />' +
                                    '<div class="col-sm-4"><input type="hidden" name="btnType" value="copy_btn" /><input type="hidden" name="copyformId" value="' + formId + '" />' +
                                    '<label class="control-label">Enter Form Name :</label></div>' +
                                    '<div class="col-sm-8">' +
                                    '<input type="text" class="form-control" name="form_name" id="frmName" /></div></div>' +
                                    '<div class="col-sm-12 form-group">' +
                                    '<div class="col-sm-4"><label class="control-label">Select Folder :</label></div>' +
                                    '<div class="col-sm-8">' + data.appOption + '</div></div>' +
                                    '<div class="col-sm-12 form-group">' +
                                    '<div class="col-sm-4"></div>' +
                                    '<div class="col-sm-8"><a href="javascript:;" onclick="app_link()"><i class="fa fa-plus"></i> Add Folder</a></div></div>' +
                                    '<div class="col-sm-12 form-group">' +
                                    '<div class="col-sm-4"><label class="control-label">Select Topic :</label></div>' +
                                    '<div class="col-sm-8">' + data.topicOption + '</div></div>' +
                                    '<div class="col-sm-12 form-group">' +
                                    '<div class="col-sm-4"></div>' +
                                    '<div class="col-sm-8"><a href="javascript:;" onclick="topic_link(\'advancedForm\')"><i class="fa fa-plus"></i> Add Topic</a></div></div>' +
                                    '<div class="col-sm-offset-4 col-sm-8 navbar-btn btn-sm"><button class="float-buttons wv-btn wv-first">Create</button>&nbsp;' +
                                    '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div>' +
                                    '</form></div></div></div></div>'
                            });
                        }
                    },
                    error: function (error) { console.log(error); }
                });
            }

        };
        function getFunction(url, applicationId, method) {
            method = (method !== undefined ? method : 'default');

            if (method === 'add-form')
                addForm(url, applicationId);
            if (method === 'add-queue')
                addQueue(url, applicationId);
            else if (method === "copy-application") {
                bootbox.dialog({
                    onEscape: true,
                    title: getStringFromMultiligualText("Copy Folder|複製文件夾|复制文件夹", langId),
                    message: '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<form class="form-horizontal" id="quickFrm" action="{{url("getSave")}}">' +
                        '<input type="hidden" name="form_type" value="copy_application" /><input type="hidden" name="form_id" value="' + applicationId + '" />' +
                        '<div class="form-group"><label class="control-label col-sm-4">Folder Name :</label><div class="col-sm-6"><input type="text" name="form_name" class="form-control"></div></div>' +
                        '<div class="form-group"><label class="control-label col-sm-4">Folder Tag :</label><div class="col-sm-6"><input type="text" name="app_tag" class="form-control"></div></div>' +
                        '<div class="form-group"><div class="col-sm-offset-4 col-sm-8">' +
                        '<button class="float-buttons wv-btn wv-first">Save</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></div></form>' +
                        '</div></div>'
                });
            }
            else if (method === 'delete-app') {
                if (confirm('Are you sure you want to delete it?')) {
                    window.location.href = url + "/" + applicationId;
                }
            }
            else if (method === "app-roles") {
                window.location.href = url + "/" + applicationId;
                return false;
            }
            return false;
        };
    });
}(FormGeneratorApp));