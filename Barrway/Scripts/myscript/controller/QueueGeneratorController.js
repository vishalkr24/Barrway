(function () {
    'use strict';

    //create form

    FormGeneratorApp.controller('QueueGeneratorController', function ($scope, $rootScope, $http, $location, $window, $state, $timeout, mainService, DataService, notifierService, $stateParams, $filter) {

        var $tabs = '';
        var $fbPages = '';
        $scope.init = function () {
            $scope.userDetail = mainService.loginDetails();
            $rootScope.IND_loading = false;
            bootbox.hideAll();
            $(".fb-editor").empty();
            $scope.applicationFormList = {};
            $scope.importFormSettings = {};
            $scope.importFormSettings.maxRecord = 10000;
            $scope.importFormSettings.max_records = 1000000;
            $scope.importFormSettings.primaryFormId = "0";
            $scope.importFormSettings.status = "2"
            $scope.importFormSettings.formType = "0"
            $scope.sheetListData = [];
            $scope.fieldsTemp = [];
            $scope.groupList = [];

            $scope.fieldsList = "";
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
            $scope.getGroups();
            $scope.isEditForm = false;
            $scope.topicId = $stateParams.topicId;

            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            window["bannerUploadUrl"] = $scope.currentUrl + "/uploadFile";
            window["bannerDeleteUrl"] = $scope.currentUrl + "/DeleteFile";
            window["ASSET_URL"] = mainService.getBaseUrl();
            $("body").removeClass("modal-open");
            $rootScope.$emit("ShowLoading");
            //loadcssjsfile("assets/js/code/init-form-builder.js", "js", "form-builder");
            loadcssjsfile("newAssets/formbuilder/js/init-form-builder.js", "js", "form-builder");
            $scope.isCreateNew = false;
            $timeout(function () {
                if (angular.isDefined($scope.topicId)) {
                    $scope.isEditForm = false;
                    $scope.isCreateNew = true;
                    $("#queue_settingsModal").modal('show');
                    $timeout(function () {
                        $scope.formBind({}, 1);
                    }, 450);
                    var title = localStorage.getItem("formModel");
                    if (!DataService.isEmpty(title)) {
                        title = JSON.parse(title);
                        $scope.importFormSettings.title = title.formName;
                        $state.current.ncyBreadcrumb.label = "Create Form";
                        $state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
                        $rootScope.safeApply();
                    }
                    var param = {};
                    param.action = 15;
                    param.topicId = $stateParams.topicId;
                    // $scope.GetResourceForms(param, 'topicId');
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


            }, 450);

            $scope.languageList = [];
            $scope.getLanguage();
            $scope.primaryQueueFormList = [];
            $scope.columnList = [];
            $scope.filerCriteriaFormDetails = {};
            $scope.filerCriteriaFormDetails.allowViewSummary = [];
            $scope.filerCriteriaFormDetails.allowChat = [];
            $scope.filerCriteriaFormDetails.allowNotification = [];
            $scope.filerCriteriaFormDetails.allowEmailNotification = [];
            $scope.filerCriteriaFormDetails.notificationDetails = true;
        };

        //share link via whatsapp by SR078 in Basic controller
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
        $scope.GetResourceForms = function (param, type) {

            mainService.manageGroups("getResourceForms", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {

                        if (response.data.length > 0) {

                            $scope.applicationFormList = response.data;
                            $scope.primaryQueueFormList = [];
                            if ($scope.applicationFormList.length > 0) {
                                $scope.primaryQueueFormList = [];
                                var tempList = _.filter($scope.applicationFormList, function (item) {
                                    return item.isPrimaryForm == true && item.currentFormType == 2
                                });
                                $scope.primaryQueueFormList = tempList;
                            }


                        }

                    }
                });
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
                                $scope.groupList = $filter('orderBy')($scope.groupList, 'groupName', false);
                                $timeout(function () {
                                    $('.selectgroup').selectpicker({
                                        liveSearch: true,
                                        container: 'body'
                                    });
                                    $(".selectgroup ").selectpicker("refresh")
                                }, 100);
                            }
                        }
                    }
                });
        };


        $scope.getReferenceFormList = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.getReferenceFormList("getReferenceFormList", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.applicationFormList = response.data;

                        if ($scope.applicationFormList.formNameList.length > 0) {
                            $scope.primaryQueueFormList = [];
                            var tempList = _.filter($scope.applicationFormList.formNameList, function (item) {
                                return item.isPrimaryForm == true && item.currentFormType == 2
                            });
                            $scope.primaryQueueFormList = tempList;
                            $scope.importFormSettings.primaryFormId = $scope.importFormSettings.primaryFormId.toString();
                        }
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
                                if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map")
                                    resultFields[temp.name] = temp.label;
                            }
                        }
                        angular.forEach(formNameList, function (item, key) {
                            var fieldlistTemp = _.where(formFieldsList, { formId: item.formId });
                            var tempData = {};
                            for (var i = 0; i < fieldlistTemp.length; i++) {
                                var temp = JSON.parse(fieldlistTemp[i].fieldValidationRule);
                                if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map")
                                    tempData[temp.name] = temp.label;
                            }
                            tempData["Id"] = "Id";
                            resultFormsFields[item.formId] = tempData;
                        });
                        window["Referral_Forms"] = result;
                        window["Referral_Fields"] = resultFields;
                        window["Referral_Forms_Fields"] = resultFormsFields,
                            $rootScope.$emit("HideLoading");
                        $timeout(function () {
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


        $scope.formGenetatorData = {};

        $scope.fileData = {};
        var fbOptions = {};
        var files = {};
        $scope.importFile = function (file) {


        }
        var fbInstances = [], fbInstancePages = [];

        $scope.formBind = function (formFieldsData, type) {



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
            //            $("#Max_records").val(json.Max_records);
            //            $("#updateID").val(json.updateID);
            //        }

            var inputSets = [];
            //inputSets.push(approvalField);
            //inputSets.push(calendarControl);
            //inputSets.push(navigationControl);
            $timeout(function () {
                controlOrder.unshift('navigation-controls');
                controlOrder.unshift('full-calendar');
                controlOrder.unshift('approval-field');
                var topicControls = "";
                $.each(topicControls, function (key, data) {
                    controlOrder.unshift(data.name);
                });
                if (type == 1) { }
                else {
                    fbInstances = [], fbInstancePages = [];
                }
                var $fbEditor = $(".fb-editor")
                var $formBuilder = $("#form-builder-pages").parents("div.tab-content")
                var $formBuilderTabs = $("#form-builder-pages").parents(".card-body").find('ul.nav-tabs')
                var $formContainer = $("#fb-rendered-form");



                var formFields = type == 1 ? {
                    "Page 1": defaultQueueFields()
                } : formFieldsData;

                var subFormFields = Object.keys(formFields).map(function (k) { return formFields[k]; });
                fbInstancePages = Object.keys(formFields).map(function (k) { return k; });
                $fbPages = $(document.getElementById("form-builder-pages"));
                var addPageTab = document.getElementById("add-page-tab");


                var fbExtraOptions = {
                    subtypes: {
                        text: ['phone pad', 'phone pad pop-up', 'formula', 'current position', 'last position', 'queue server', 'queue session'],
                        button: ['refresh', 'exit'],
                        file: ['file', 'camera']
                    },
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
                fbOptions['defaultFields'] = fbInstancePages.length > 0 ? convertSupportableNewJSONFormat(subFormFields[0]) : defaultQueueFields();
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
                                            //instance.actions.setData(JSON.stringify(convertSupportableNewJSONFormat(subFormFields[i])));
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
                }, 500);
            }, 10);

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

                            if (angular.isDefined(response.data[0])) {
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

                                }
                                else {

                                    $scope.fieldsTemp = response.data;


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
        //$scope.fileChange = function (element) {
        //    $scope.fileData = element.files[0];
        //    var fd = new FormData();
        //    fd.append('file', $scope.fileData);

        //    mainService.uploadFile("UploadDataFile", fd)
        //        .then(function (response) {
        //            if (response.data != null && angular.isDefined(response.data)) {
        //                if (angular.isDefined(response.data)) {

        //                    if (!angular.isDefined(response.data[0])) {
        //                        console.log(response.data);
        //                        $(".fb-editor").empty();
        //                        $scope.fieldsListTemp = [];
        //                        $scope.fieldsListMain = [];
        //                        //$scope.fieldsListTemp = response.data;
        //                        if ($scope.importFormSettings.fileType == "Yes") {
        //                            $scope.fieldsTemp = response.data;
        //                            _.map($scope.fieldsTemp, function (pagesData) {
        //                                _.map(pagesData, function (item) {
        //                                    if (angular.isDefined(item.Basic_Settings)) {
        //                                        item.Advanced_Settings = angular.isDefined(item.Advanced_Settings) ? JSON.parse(item.Advanced_Settings) : null;
        //                                        item.Basic_Settings = angular.isDefined(item.Basic_Settings) ? JSON.parse(item.Basic_Settings) : null;
        //                                        item.Format_Settings = angular.isDefined(item.Format_Settings) ? JSON.parse(item.Format_Settings) : null;
        //                                        item.More_Settings = angular.isDefined(item.More_Settings) ? JSON.parse(item.More_Settings) : null;
        //                                    } else {

        //                                    }
        //                                    return item;
        //                                });
        //                            });
        //                            // $scope.fieldsListTemp = response.data;


        //                            var newCopy = angular.copy($scope.fieldsTemp);
        //                            _.each(newCopy, function (newCopy1, keyTable) {
        //                                $scope.fieldsListTemp = [];
        //                                _.each(newCopy1, function (item, key) {
        //                                    $scope.fieldsList = '{"';
        //                                    _.each(item, function (v, k) {
        //                                        //console.log(k)
        //                                        //console.log(v)
        //                                        var temp = 0;
        //                                        var keyssss = "";
        //                                        if (angular.isObject(v)) {

        //                                            _.each(v, function (nvalue, nkey) {
        //                                                var newvalue = "";
        //                                                var exists = _.find($scope.fieldsTypeData, function (ite, kkkk) {

        //                                                    if (_.values(ite)[0] == nkey.trim()) {
        //                                                        temp = kkkk + 1;
        //                                                        newvalue = _.values(ite)[0];
        //                                                        if (temp > 0) {
        //                                                            keyssss = Object.keys(ite)[0];
        //                                                        }
        //                                                        return true;
        //                                                    }
        //                                                    else {
        //                                                        return false
        //                                                    }
        //                                                });
        //                                                if (keyssss.length > 0 && nvalue != null) {
        //                                                    if (keyssss.trim() == "values") {
        //                                                        var newType = 'values":' + JSON.stringify(nvalue.trim()) + ',"';
        //                                                        $scope.isValue = true;
        //                                                        $scope.fieldsList += newType;
        //                                                    } else {
        //                                                        var dddd = '' + keyssss.trim() + '":"' + nvalue.trim() + '","';
        //                                                        $scope.fieldsList += dddd;
        //                                                        $scope.isValue = false;
        //                                                    }
        //                                                }
        //                                                else {
        //                                                    if (angular.isDefined(nvalue) && nvalue != null) {
        //                                                        onsole.log('nvalue:' + nvalue)
        //                                                        var dddd = 'id":"' + nvalue.trim() + '","';
        //                                                        $scope.fieldsList += dddd;
        //                                                    }
        //                                                }
        //                                            });

        //                                        }
        //                                        else {

        //                                            var exists = _.find($scope.fieldsTypeData, function (ite, kkkk) {
        //                                                var column = k.trim();
        //                                                column = column.replace('_', ' ');
        //                                                if (_.values(ite)[0] == column) {
        //                                                    temp = kkkk + 1;
        //                                                    if (temp > 0) {
        //                                                        keyssss = Object.keys(ite)[0];
        //                                                    }
        //                                                    return true;
        //                                                }
        //                                                else {
        //                                                    return false
        //                                                }
        //                                            });
        //                                            // console.log(temp)
        //                                            if (keyssss.length > 0 && v != null) {
        //                                                if (keyssss.trim().toLowerCase() === "required" && v.trim().toLowerCase() == "false") { }
        //                                                else {
        //                                                    var dddd = "";
        //                                                    if (angular.isDefined(keyssss.trim()) && keyssss.trim() != null && keyssss.length > 0) {
        //                                                        dddd = '' + keyssss.trim() + '":"' + v.trim() + '","';
        //                                                    }
        //                                                    if (keyssss.trim() == "subtype") {
        //                                                        var newType = 'types":"' + v.trim() + '","';
        //                                                        $scope.fieldsList += newType;
        //                                                    }
        //                                                    if (keyssss.trim() == "values") {
        //                                                        dddd = 'values":' + JSON.stringify(v.trim()) + ',"';

        //                                                    }
        //                                                    $scope.fieldsList += dddd;
        //                                                }

        //                                            }
        //                                            else {
        //                                                if (angular.isDefined(v) && v != null) {
        //                                                    var dddd = 'id":"' + v.trim() + '","';
        //                                                    $scope.fieldsList += dddd;
        //                                                } else {
        //                                                    if (angular.isDefined(keyssss.trim()) && keyssss.trim() != null && keyssss.length > 0) {
        //                                                        var dddd = '' + keyssss.trim() + '":"","';
        //                                                        $scope.fieldsList += dddd;
        //                                                    }
        //                                                }
        //                                            }

        //                                        }


        //                                    });
        //                                    $scope.fieldsList = $scope.fieldsList.substring(0, $scope.fieldsList.length - 2)
        //                                    $scope.fieldsList += '}';
        //                                    var parseData = JSON.parse(JSON.parse(JSON.stringify($scope.fieldsList)));
        //                                    if (angular.isDefined(parseData))
        //                                        _.each(parseData, function (nvalue, nkey) {
        //                                            if (nkey.trim() == "values" && angular.isObject(nvalue)) {
        //                                                parseData[nkey] = JSON.parse(nvalue)
        //                                            }
        //                                            else if (nkey.trim() == "values" && nvalue.length > 5) {
        //                                                var temp = JSON.parse(nvalue);
        //                                                if (angular.isObject(temp))
        //                                                    parseData[nkey] = temp;
        //                                            }
        //                                        });
        //                                    $scope.fieldsListTemp.push(parseData);

        //                                    //console.log($scope.fieldsListTemp);
        //                                });
        //                                $scope.fieldsTemp[keyTable] = $scope.fieldsListTemp;
        //                                // $scope.fieldsListMain = $scope.fieldsListMain.concat({ [keyTable]: $scope.fieldsListTemp });
        //                                // $scope.fieldsListMain.push(([keyTable]: $scope.fieldsListTemp ));
        //                            });
        //                            console.log($scope.fieldsTemp);
        //                            //console.log($scope.fieldsListTemp);
        //                            //var testing = {};
        //                            //testing = { "Testing 1": $scope.fieldsListTemp }
        //                            console.log($scope.fieldsListTemp)

        //                            // $scope.formBind($scope.fieldsTemp, 2);
        //                        }
        //                        else {

        //                            $scope.fieldsTemp = response.data;

        //                            //$scope.isEditForm = false;
        //                            //$timeout(function () {
        //                            //    $scope.saveFormProperties(null, null, JSON.stringify($scope.fieldsTemp));
        //                            //}, 500);
        //                            // $scope.formBind(response.data, 2);
        //                        }
        //                        // $('#controlImportModal').modal('hide');
        //                    }

        //                }
        //            }
        //        }, function (err) {
        //            console.log("some error occured." + err);
        //        });
        //}

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
                data = JSON.stringify(data)
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

        $scope.uploadFileOnly = function (element, filename) {

            if (angular.isDefined(element)) {
                var fileData = element[0];
                var fd = new FormData();
                fd.append('file', fileData, filename);
                var userId = $scope.userDetail.Id;
                var uid = $scope.userDetail.uid;
                mainService.uploadFile("UploadFile", fd, "", uid, "", "", "", "", false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                $("input:hidden[name=" + id + "]").attr('value', "");
                                if (response.data.code == 200) {
                                    //console.log("uploaded Successfully")
                                    $("input:hidden[name=" + id + "]").attr('value', response.data.fileUrl);
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
            $('img#uploadPreview').attr('src', '');
            $("img#uploadPreview").parent().addClass("hidden");
            $("input#formBackground").val('');
            $scope.importFormSettings.formBackground = "";
            $scope.importFormSettings.formBackgroundFileData = [];
        });






        $scope.saveFormProperties = function (inst, pages, fieldsData) {
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
            }
            //saveFormProperties1();
            var param = {};
            param = $scope.importFormSettings;
            if ($scope.isEditForm || $scope.isEditTopic) {
                param.action = 2;
                if ($scope.isEditTopic) {
                    var paramTopicSettings = {};
                    paramTopicSettings.action = 2;
                    paramTopicSettings = $scope.importFormSettings;
                    $timeout($scope.manageTopic(paramTopicSettings), 150);

                }
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
                        "other": { "edit_time": null, "view": true, "edit": true, "delete": true, "delete_time": null }
                    }
                    param.recordAccessSecurity = JSON.stringify(param.recordAccessSecurity);

                    param.allowViewSummary = ["0", "1", "2", "3"];
                    param.allowChat = ["0", "1", "2", "3"];
                    param.allowNotification = ["0", "1", "2", "3"];
                    param.allowEmailNotification = ["0", "1", "2", "3"];
                    param.allowViewSummary = JSON.stringify(param.allowViewSummary);
                    param.allowChat = JSON.stringify(param.allowChat);
                    param.allowNotification = JSON.stringify(param.allowNotification);
                    param.allowEmailNotification = JSON.stringify(param.allowEmailNotification);
                }

                if ($scope.isEditForm && DataService.isEmpty(inst) && $scope.isEditTopic) {
                    param.action = 2;
                    param.recordAccessSecurity = $scope.importFormSettings.recordAccessSecurity;
                    param.allowViewSummary = $scope.importFormSettings.allowViewSummary;
                    param.allowChat = $scope.importFormSettings.allowChat;
                    param.allowNotification = $scope.importFormSettings.allowNotification;
                    param.allowEmailNotification = $scope.importFormSettings.allowEmailNotification;
                }



                $scope.importFormSettings.status = 1;
                $scope.importFormSettings.template = true;

            }
            $scope.importFormSettings.formName = $scope.importFormSettings.title;
            if (angular.isDefined($scope.importFormSettings.xlsfilesFileData)) {
                var exten = getExt($scope.importFormSettings.xlsfilesFileData[0].name);
                $scope.importFormSettings.xlsFile = $scope.importFormSettings.xlsxFileName + "." + exten;
                $scope.uploadFileOnly($scope.importFormSettings.xlsfilesFileData, $scope.importFormSettings.xlsFile);
            }
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.currentFormType = 2;
            if (!DataService.isEmpty($scope.importFormSettings.topicTitle))
                $scope.importFormSettings.topicName = $scope.importFormSettings.topicTitle;
            dynamicTableCreation($scope.importFormSettings);
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            notifierService.notifyMessage('success', 'Form Setting', response.data[0].Message);
                            $scope.uploadFileOnly($scope.importFormSettings.formBackgroundFileData, "");
                            $timeout(function () {
                                $("#queue_settingsModal").modal("hide");
                                $(".modal-backdrop").removeClass("in");
                                $("div").removeClass("modal-backdrop");
                                $rootScope.$emit("HideLoading");
                                if ($scope.isEditForm) {
                                    $state.go('queueEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                }
                                else if ($scope.isEditTopic) {
                                    $state.go('queueTopicEdit', { 'edittopicId': response.data[0].topicId }, { reload: true, inherit: false });
                                } else {
                                    $state.go('queueEdit', { 'formId': response.data[0].formId }, { reload: true, inherit: false });
                                }
                            }, 450);
                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };

        $scope.manageTopic = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.manageTopic("ManageTopic", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            var exists = {};
                            exists = response.data[0];
                            /// if (exists.res == 1)
                            //   notifierService.notifyMessage('success', 'Topic', exists.Message);
                            //  else
                            //  notifierService.notifyMessage('error', 'Topic', exists.Message);
                            //$('#addFormModal').modal('hide');
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
                            if (item.type == "textarea" || item.type == "signature" || item.type == "table") {
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
                                    columnName = " " + replaceColumn(item.name) + " FLOAT  ,"
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
                                columnName = " kanban_order    FLOAT ,"
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

        /*Access control settings for Queue
         modified by SR078 on 16Dec2020*/
        $scope.getFormSettings = function (formId) {
            debbugger;
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.action = 4;
            param.formId = formId;

            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            $scope.importFormSettings = response.data[0];

                            $scope.importFormSettings.entryUrl = mainService.getBaseUrl() + "/#/form/saveEntry/" + $scope.importFormSettings.formId + "?check=anonymous";

                            $scope.importFormSettings.formName = $scope.importFormSettings.title;
                            if (!DataService.isEmpty($state.current.ncyBreadcrumb)) {
                                if ($scope.isEditTopic)
                                    $state.current.ncyBreadcrumb.label = "Edit Topic - " + $scope.importFormSettings.title;
                                else
                                    $state.current.ncyBreadcrumb.label = "Edit Queue - " + $scope.importFormSettings.title;
                                $state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
                            }
                            $rootScope.safeApply();
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
                            if (!DataService.isEmpty($scope.importFormSettings.xlsxFileName))
                                $scope.getWorkSheetList($scope.importFormSettings.xlsFile);
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
                            }

                            /*record access controls*/
                            if (response.data.length > 0) {
                                $scope.filerCriteriaFormDetails = response.data[0];


                                if (DataService.isEmpty($scope.filerCriteriaFormDetails.notificationDetails)) {
                                    $scope.filerCriteriaFormDetails.notificationDetails = true;
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
                                    $scope.filerCriteriaFormDetails.formSettings = { "tabulator": { "format": "columns", "theme": "tabulator.min.css" } };
                                }
                                $scope.filerCriteriaFormDetails.formTabulatorTheme = $scope.filerCriteriaFormDetails.formSettings.tabulator.theme;

                                if (!DataService.isEmpty($scope.filerCriteriaFormDetails.recordAccessSecurity)) {
                                    if (!Array.isArray($scope.filerCriteriaFormDetails.recordAccessSecurity)) {
                                        $scope.filerCriteriaFormDetails.recordAccessSecurity = JSON.parse($scope.filerCriteriaFormDetails.recordAccessSecurity);
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
                                    }
                                }
                                else {

                                    $scope.filerCriteriaFormDetails.recordAccessSecurity = {
                                        "max_one_record_per_user": false,
                                        "insert": {
                                            "roles": ["0", "1", "2", "3"],
                                        },
                                        "own": { "view": "true", "edit": "true", "delete": "true", "edit_time": "", "delete_time": "" },
                                        "other": { "view": "true", "edit": "true", "delete": "true", "edit_time": "", "delete_time": "" }

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

            mainService.getWorkSheetList("GetFileSheetNames", filename)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        $scope.sheetListData = response.data;

                        var result = {};

                        for (var i = 0; i < $scope.sheetListData.length; i++) {
                            result[$scope.sheetListData[i].value] = $scope.sheetListData[i].value;
                        }
                        //window["worksheets"] = result;

                        window.worksheets = result;
                        window.worksheets = result;
                        localStorage.setItem("worksheets", JSON.stringify(result));
                        $timeout(function () {
                            //  loadFormCustom();
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


        $('#formProperties').on('submit', function (event) {
            $rootScope.$emit("ShowLoading");
            //  event.stopPropagation(); // Stop stuff happening
            event.preventDefault(); // Totally stop stuff happening

            //var allData = fbInstances.map(function (fb) {
            //    return fb.formData;
            //});

            //var formField = {};
            //$.each(fbInstancePages, function (i, value) {
            //    formField[fbInstancePages[i]] = allData[i];
            //});

            //var formHtml = $("#fb-rendered-form > form").html();
            ///*var formData = $(this).serializeArray();
            //formData.push({name: 'formField', value: JSON.stringify(formField)});
            //formData.push({name: 'formHtml', value: formHtml});*/

            //var data = new FormData(this);
            //data.append('formField', JSON.stringify(formField));
            //data.append('formHtml', formHtml);
            //$.each(files, function (key, value) {
            //    data.append('formBackground', value);
            //});
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
                //$scope.saveFormProperties(fbInstances, fbInstancePages, JSON.stringify(formField));
                save_form_editor(fbInstances, fbInstancePages);
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
                        //console.log('This was logged in the callback: ' + pageName);
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
            //alert('Element')

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
                    // Page name
                    //var pageName = prompt("Please enter page name", tabName);

                    if (pageName === null || pageName === "") {
                        pageName = tabName;
                    }
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
        $("select[name=resourceForm]").on("change", function () {
            var formId = $(this).val();

            var params = { formId: formId };
            populateDropdowns("{{ url('subforms/populateOptions') }}", params, 1, '', '', '', '', '', '');
        });
        $("select[name=activitiesForm]").on("change", function () {
            var formId = $(this).val();

            var params = { formId: formId };
            populateDropdowns("{{ url('subforms/populateOptions') }}", params, 2, '', '', '', '', '', '');
        });

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


            var baseUrl = mainService.getBaseUrl();
            window.open(baseUrl + "#/form/preview/" + $stateParams.formId, '_blank');
            //$state.go('previewForm', { 'formId': $scope.importFormSettings.formId });

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
            //console.log(data); // 'Data to send'
            //e.preventDefault();
            //var $parent = $("a.cut-button").parents('li')
            //var fieldIndex = _.findIndex($parent, { id: c });
            var activeTab = $tabs.tabs('option', 'active')
            var formData = fbInstances[activeTab].actions.getData()
            var fieldData = formData[fieldIndex];
            cutArray.push(fieldData);
            // console.log(cutArray);
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
            var allData = fbInstances.map(function (fb) {
                return fb.formData;
            });

            var formField = {};
            $.each(fbInstancePages, function (i, value) {
                //formField[fbInstancePages[i]] = allData[i];
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
        function defaultQueueFields() {
            return [
                {
                    "type": "header",
                    "subtype": "h1",
                    "label": "Header",
                    "page": "1",
                    "className": "header",
                    "name": "header_" + generateUniqueNumber()
                },
                {
                    "type": "paragraph",
                    "subtype": "p",
                    "label": "Paragraph",
                    "page": "1",
                    "className": "para",
                    "name": "paragraph_" + generateUniqueNumber()
                },
                {
                    "type": "button",
                    "subtype": "refresh",
                    "label": "Refresh Positions",
                    "className": "btn btn-info",
                    "name": "button_" + generateUniqueNumber(),
                    "style": "info"
                },
                {
                    "type": "number",
                    "label": "Waiting Tickets",
                    "min": "0",
                    "step": "1",
                    "types": "waiting_records",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column": "3",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "No",
                    "Display_Only": "0",
                    "Incremental": "No",
                    "Unique_Value": "No",
                    "List_column1": "No",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "number_" + generateUniqueNumber()
                },
                {
                    "type": "text",
                    "subtype": "current position",
                    "label": "Current Position",
                    "placeholder": "Current position of the queue",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "No",
                    "Display_Only": "0",
                    "Unique_Value": "No",
                    "List_column1": "No",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "text_" + generateUniqueNumber()
                },
                {
                    "type": "text",
                    "subtype": "last position",
                    "label": "Last Position",
                    "placeholder": "Last position of the queue",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "No",
                    "Display_Only": "0",
                    "Unique_Value": "No",
                    "List_column1": "No",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "text_" + generateUniqueNumber()
                },
                {
                    "type": "autogenerated-field",
                    "label": "Ticket Number",
                    "value": "A",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "0",
                    "Display_Only": "0",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "lower_range": "001",
                    "upper_range": "100",
                    "className": "form-control",
                    "name": "autogeneratedField_" + generateUniqueNumber()
                },
                {
                    "type": "radio-group",
                    "label": "Queue Status",
                    "inline": true,
                    "types": "status",
                    "Referral_Forms": "0",
                    "Referral_Form_Fields": "0",
                    "default_values": "No",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "0",
                    "Display_Only": "0",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "class": "radio",
                    "name": "radioGroup_" + generateUniqueNumber(),
                    "className": "radio",
                    "values": [
                        {
                            "label": "Waiting",
                            "value": "Waiting",
                            "selected": true
                        },
                        {
                            "label": "Calling",
                            "value": "Calling"
                        },
                        {
                            "label": "Pending",
                            "value": "Pending"
                        },
                        {
                            "label": "Served",
                            "value": "Served"
                        },
                        {
                            "label": "Deleted",
                            "value": "Deleted"
                        }
                    ]
                },
                {
                    "type": "checkbox-group",
                    "label": "Request",
                    "alignment": "top",
                    "justify": "left",
                    "column": "1",
                    "background_color": "rgba(0,0,0,0)",
                    "border": "0",
                    "List_column1": "Yes",
                    "List_column2": "Yes",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "className": "checkbox",
                    "name": "checktrue_" + generateUniqueNumber(),
                    "values": [{ "label": "Request fix date and time", "value": "true" }]
                },
                {
                    "type": "date",
                    "label": "Request for fix Date",
                    "types": "date_picker",
                    "alignment": "top",
                    "justify": "left",
                    "column": "1",
                    "background_color": "rgba(0,0,0,0)",
                    "border": "0",
                    "set_default": "No",
                    "List_column1": "Yes",
                    "List_column2": "Yes",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "className": "form-control",
                    "name": "fixeddate_" + generateUniqueNumber()
                },
                {
                    "type": "date",
                    "label": "Fixed Time",
                    "types": "time_picker",
                    "alignment": "top",
                    "justify": "left",
                    "column": "1",
                    "background_color": "rgba(0,0,0,0)",
                    "border": "0",
                    "set_default": "No",
                    "List_column1": "Yes",
                    "List_column2": "Yes",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "className": "form-control",
                    "name": "fixedtimedate_" + generateUniqueNumber()
                },
                {
                    "type": "text",
                    "subtype": "queue server",
                    "label": "Room",
                    "placeholder": "Enter the Room",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "10",
                    "Display_Only": "10",
                    "Unique_Value": "No",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "text_" + generateUniqueNumber()
                },
                {
                    "type": "text",
                    "subtype": "queue session",
                    "label": "Session Name",
                    "placeholder": "Enter the session name",
                    "Default_Value": "0",
                    "Default_Value_Field": "0",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "10",
                    "Display_Only": "10",
                    "Unique_Value": "No",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "className": "form-control",
                    "name": "text_" + generateUniqueNumber()
                },
                {
                    "type": "radio-group",
                    "label": "Session Status",
                    "inline": true,
                    "types": "session_status",
                    "Referral_Forms": "0",
                    "Referral_Form_Fields": "0",
                    "default_values": "No",
                    "column": "1",
                    "page": "1",
                    "alignment": "top",
                    "Hide_show": "10",
                    "Display_Only": "10",
                    "List_column1": "Yes",
                    "List_column2": "No",
                    "class": "radio",
                    "name": "radioGroup_" + generateUniqueNumber(),
                    "className": "radio",
                    "values": [
                        {
                            "label": "Current",
                            "value": "Current",
                            "selected": true
                        },
                        {
                            "label": "Archived",
                            "value": "Archived"
                        }
                    ]
                },
                {
                    "type": "select",
                    "label": "Type of Service",
                    "alignment": "top",
                    "justify": "left",
                    "column": "1",
                    "background_color": "rgba(0,0,0,0)",
                    "border": "0",
                    "populate_fields": "No",
                    "multiple_records": "No",
                    "List_column1": "Yes",
                    "List_column2": "Yes",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "className": "form-control",
                    "name": "typeofserviceselect_" + generateUniqueNumber(),
                    "values": [{ "label": "Doctor visit", "value": "Doctor visit", "selected": true },
                    { "label": "Acupuncture", "value": "Acupuncture" },
                    { "label": "Medicine prescription", "value": "Medicine prescription" },
                    { "label": "Consultation", "value": "Consultation" }]
                },
                {
                    "type": "textarea",
                    "label": "Remarks",
                    "subtype": "textarea",
                    "alignment": "top",
                    "justify": "left",
                    "column": "1",
                    "background_color": "rgba(0,0,0,0)",
                    "border": "0",
                    "rows": "5",
                    "column_format": "plaintext",
                    "List_column1": "Yes",
                    "List_column2": "Yes",
                    "Hide_show": "No",
                    "Display_Only": "No",
                    "className": "form-control",
                    "name": "remarktextarea_" + generateUniqueNumber()
                },
                {
                    "type": "button",
                    "subtype": "submit",
                    "label": "Submit",
                    "className": "btn btn-success",
                    "name": "button_" + generateUniqueNumber(),
                    "style": "success"
                },
                {
                    "type": "button",
                    "subtype": "exit",
                    "label": "Exit",
                    "className": "btn pull-right btn-default",
                    "name": "button_" + generateUniqueNumber(),
                    "style": "default"
                }
            ];
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
        $scope.clickBasicSettings = function () {
            $("select.selectgroup").selectpicker("refresh");
        };
        $scope.onSubmitAccessControls = function () {
            //console.log($scope.columnList);
            var param = {};
            $scope.filerCriteriaFormDetails.allowViewSummary = [];
            $scope.filerCriteriaFormDetails.allowChat = [];
            $scope.filerCriteriaFormDetails.allowNotification = [];
            $scope.filerCriteriaFormDetails.allowEmailNotification = [];
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
            $scope.filerCriteriaFormDetails.formSettings.tabulator.theme = $scope.filerCriteriaFormDetails.formTabulatorTheme;
            param = angular.copy($scope.filerCriteriaFormDetails);
            param.formSettings = JSON.stringify(param.formSettings);
            param.recordAccessSecurity = JSON.stringify(param.recordAccessSecurity);
            param.allowViewSummary = JSON.stringify(param.allowViewSummary);
            param.allowChat = JSON.stringify(param.allowChat);
            param.allowNotification = JSON.stringify(param.allowNotification);
            param.allowEmailNotification = JSON.stringify(param.allowEmailNotification);
            param.action = 22;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.recordFilters = "";

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
        };
        $scope.init();
    });
}(FormGeneratorApp));