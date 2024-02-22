(function () {
    'use strict';
    FormGeneratorApp.controller('FormRecordsController', function ($scope, $compile, $rootScope, $ngBootbox, $http, $location, $window, mainService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, translationService) {

        var tabulatorChildren = {};       
        //var isSubscription = $scope.isSubscription($scope.formDetailsDataInfo.formId, "checkIfRequested");;
        $scope.init = function () {

            $scope.userDetails = mainService.loginDetails();
            $scope.InformationLink = {};
            $scope.formDetailsDataTemp = {};
            $scope.formDetailsDataInfo = {};
            $scope.displayInTabData = {};
            $scope.dataArrayTemp = [];
            $scope.formGroupFilesList = [];
            $scope.formDetails = {};
            $scope.isAllowToggle = {};
            $scope.pdfParam = {};
            $scope.formrole = '0';
            $scope.subscription = {};
            $scope.subscription.isAllowToLoad = true;
            $scope.isShowAdvanceSearch = false;
            $scope.limit = 5;
            //$scope.selectedLanguage = 'en';
            window["formGroupKeyList"] = null;
            $scope.selectedDeletedRecordList = [];
            $ngBootbox.hideAll();
            var formId = $stateParams.formId;
            // $rootScope.$emit("ShowLoading");
            $scope.userDetail = mainService.loginDetails();
            $scope.user = {};
            $scope.user = $scope.userDetail;
            window["isFormValidated"] = false;
            $timeout(function () {
                if (angular.isDefined(formId)) {
                    $scope.currentFormId = formId;

                    var param = {};
                    param.action = 4;
                    param.formId = formId;
                    var tabularId = "form-records";
                    $scope.getFormDetails(param, tabularId);
                }
            }, 150);
            $scope.showToggleButton();
            $scope.formDataTabulatorTemp = {};
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.filterFieldsList = [];
            $scope.filterBy = {};
            $scope.sourceformId = "";
            $scope.importDataFileParam = {};
            $scope.importDataFileParam.fileType = "csv";
            $scope.importDataFileParam.typeOfAction = "Append";
            $scope.formAllDatafields = [];
            $scope.paginationSizeFormRecords = 300;
            $scope.getLanguage();
            //Deisy 06102020  
            $scope.ApplyMultilingualText();
            
           
           
           $scope.importFormSettings = { language: 1 };

            
            localStorage.removeItem("newWindow");

            $scope.isInvoiceForm = false;
            $scope.calenderFormId = 0;

            $scope.allFormsList = [];
            $scope.isTransactionForm = false;
            $scope.printType = 0;
            pageActionsToggleer();

            $scope.filerCriteriaFormDetails = {};
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



        };
        
        /*Tabulator Configration Popup functions*/
        $scope.saveTabulatorLayout = function (type, isForm) {
             
            $scope.tabulatorLayoutId = "tabulator-persisrecords" + $scope.currentFormId;
            if (!DataService.isEmpty(tabulator)) {
                //$ngBootbox.customDialog({
                //    templateUrl: 'tabulatorConfigurationsModelPopup.html',
                //    scope: $scope,
                //    title: 'Tabulator Layout Configrations',
                //    size: "large",
                //    className: 'modal2Xlarge'
                //});
                $scope.tabulatorConfigurations($scope.currentFormId);

            }

        };
        $scope.tabulatorConfigurations = function (formId) {

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
            $ngBootbox.customDialog({
                templateUrl: 'tabulatorConfigurationsModelPopup.html',
                scope: $scope,
                title: getStringFromMultiligualText("Tabulator Layout Configrations|製表符佈局配置|制表符布局配置", langId),
                size: "large",
                className: 'modal2Xlarge',
                closeButton: false
            });
            $timeout(function () {
                 
                $scope.$broadcast("updateTabulatorId", $scope.tabulatorLayoutId, tabulator, $scope.formAllDatafields);
            }, 420);

        };
        $scope.loadFormRoles = function (param) {
            $rootScope.$emit("ShowLoading");
            $scope.summaryAccess = false;
            mainService.ManageFormRoles("ManageFormRoles", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 5) {
                            if (response.data.length > 0) {
                                var exists = response.data[0];
                                $rootScope.currentUserFormRole = exists.role;



                                $scope.summaryAccess = $scope.allowViewSumm.includes(exists.role);
                                // console.log($scope.currentUserFormRole, $scope.summaryAccess);
                                $timeout(function () {
                                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();
                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.formTag)) {
                                        if ($scope.formDetailsDataInfo.formTag.toLowerCase().contains("course")) {
                                            if ($rootScope.currentUserFormRole != 2 && $rootScope.currentUserFormRole != 3) {
                                                $scope.allowAddDelete = false;
                                            } else {
                                                $scope.allowAddDelete = true;
                                            }
                                        }
                                    }
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
        //custom formatter definition
        $scope.validateUserAcess = function (formDetail) {
            var formPassword = formDetail.form_password;
            if (formPassword == null || formPassword == "undefined")
                formPassword = '';
            var formID = formDetail.formId;
            var qrString = $location.search();
            var editable = mainService.loginDetails();
            var formsObj = editable.varifiedForms;
            var isExists = false;
            if (angular.isDefined(formsObj)) {
                var keepGoing = true;
                angular.forEach(formsObj, function (value, key) {
                    if (keepGoing) {
                        isExists = formID in value;
                        if (isExists) {
                            if (value[formID].toString() == formPassword.toString()) {
                                isExists = true;
                                keepGoing = false;
                            }
                            else
                                isExists = false;


                        }
                    }


                });
            }

            //if page load on QR check=anonymous   request   if ( request==QR req  && login details not exists)
            //password protection will be disable in case of QR request.

            if (angular.isDefined(qrString.check)) {
                isExists = true;
            }
            if (angular.isDefined(qrString.check) && !angular.isDefined($scope.userDetail.Id)) {
                isExists = true;
                isAnonymous(qrString);

            }
            else if (!angular.isDefined(qrString.check) && formPassword != null && formPassword != '' && isExists == false) {

                $scope.promptProtectedPassword(formPassword, formsObj, formID, mainService.getBaseUrl());

            }


            if (formPassword == null || formPassword == "undefined" || formPassword == '')
                return true;
            else
                return isExists;





            //if no QR request  and form has protected password + formId doest not exists in details cookies persistance .
            //else if (!angular.isDefined(qrString.check) && formPassword != null && isExists == false) {
            //    var enteredPassword = '';// prompt('please enter form password.');
            //    var onload = false;
            //    $scope.promptProtectedPassword(formPassword, formIdString, formID);
            //    //if (enteredPassword != null && enteredPassword !== "undefined") {
            //    //if (enteredPassword == formPassword) {
            //    //    // $scope.setProtected(formDetail.formID, editable);
            //    //    if (formIdString == null || formIdString == '' || formIdString == "undefined") {
            //    //        editable.varifiedForms = formID;
            //    //        localStorage.setItem('detail', JSON.stringify(editable));
            //    //    }
            //    //    else {
            //    //        formIdString += ',' + formID;
            //    //        editable.varifiedForms = formIdString;
            //    //        localStorage.setItem('detail', JSON.stringify(editable));
            //    //    }



            //    //}
            //    //else {
            //    //while (enteredPassword != formPassword) {
            //    //    if (enteredPassword == formPassword.toString()) {
            //    //        // alert('matched');
            //    //        if (formIdString == null || formIdString == '' || formIdString == "undefined") {
            //    //            editable.varifiedForms = formID;
            //    //            localStorage.setItem('detail', JSON.stringify(editable));
            //    //        }
            //    //        else {
            //    //            formIdString += ',' + formID;
            //    //            editable.varifiedForms = formIdString;
            //    //            localStorage.setItem('detail', JSON.stringify(editable));
            //    //        }


            //    //        // add validationFlag=1 in details cookie


            //    //        break;
            //    //        // alert('matched')
            //    //    }
            //    //    else {

            //    //        if (onload)
            //    //            alert('not matched');
            //    //        onload = true;
            //    //        enteredPassword = prompt('please enter form password.');

            //    //    }
            //    //}

            //    //}



            //    //}

            //}
        }
        $scope.promptProtectedPassword = function (formPassword, formString, formID, baseUrl) {
            bootbox.dialog({
                onEscape: function () {
                    //  alert(baseUrl + "#/forms");
                    var url = (document.referrer !== "") ? document.referrer : baseUrl + "#/forms";
                    window.location.href = url;
                },
                title: "Enter Form Password",
                message: '<div id="menuId" class="clearfix form-group">' +
                    '<div class="col-sm-12 form-group">' +
                    '<div class="col-sm-4">' +
                    '<input type="hidden" value="' + formID + '" id="hdnfFomId">' +
                    'Enter Password ' +
                    '</div>' +
                    '<div class="col-sm-4">' +
                    '<input type="password" data-id="' + formPassword + '" id="check_form_password" min="5" max="20" class="form-control"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-sm-12 form-group">' +
                    '<div class="col-sm-4"></div><div class="col-sm-6">' +
                    "<button type='button'  class='btn btn-primary' onclick=checkPass()>Submit</button>" +
                    '</div>' +
                    '</div>' +
                    '</div>'
            });


            var validationCheck = window["isFormValidated"];

        }
        $scope.GetFormRecordListDynamimc = function (param) {
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            newParam.topicId = $scope.formDetailsDataInfo.topicId;
            //mainService.getFormRecordList("GetFormRecordList", newParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            console.log(response.data)
            //            var formDataTemp = response.data;
            //            $scope.formDetailsDataTemp = formDataTemp;
            //            var formDataFields = [];
            //            _.each(formDataTemp, function (pagesData, key) {
            //                formDataFields.push({ key });
            //            });
            //            var totalKeysExist = _.filter($scope.formDetailsDataTemp, function (item) { return !DataService.isEmpty(item.totalKeys) });
            //            var indx = _.indexOf($scope.formDetailsDataTemp, function (item) { return !DataService.isEmpty(item.totalKeys) });
            //            if (!DataService.isEmpty(totalKeysExist)) {
            //                $scope.formDetailsDataTemp.splice(indx, 0);
            //                var tempKeys = totalKeysExist[0];
            //                if (!DataService.isEmpty(tempKeys)) {
            //                    tempKeys = tempKeys.totalKeys.substring(0, tempKeys.totalKeys.length - 1);
            //                    tempKeys = tempKeys.split(',');
            //                    var uniQue = [];
            //                    _.each(tempKeys, function (ite) {
            //                        var alext = _.filter(uniQue, function (uitem) { return uitem == ite });
            //                        if (DataService.isEmpty(alext)) {
            //                            uniQue.push(ite);
            //                        }
            //                    });

            //                    //$scope.formDetailsDataTemp = _.uniq($scope.formDetailsDataTemp, v => [uniQue.toString()].join());

            //                }
            //            }
            bindtabulatorOnly("columns", "true");
            $timeout(function () {
                //tabulator.setData($scope.formDetailsDataTemp);                   
                if (!DataService.isEmpty($scope.displayInTabData.Referral_Forms)) {
                    $timeout(function () {
                        var param = {};
                        param.action = 1;
                        param.formId = $scope.displayInTabData.Referral_Forms;

                        if (param.formId != "0") {
                            param.fieldName = $scope.displayInTabData.Referral_Form_Fields;
                            mainService.getReferralFormFields("getReferralFormFields", param)
                                .then(function (response) {
                                    // console.log(response);
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
                        }
                    }, 450);
                }
            }, 150);
            $rootScope.$emit("HideLoading");
            $('.form-builder-loader').hide();

            //   $rootScope.$emit("HideLoading");
            // }
            // $rootScope.$emit("HideLoading");
            // $('.form-builder-loader').hide();
            //}, function (err) {
            //    $('.form-builder-loader').hide();
            //    $rootScope.$emit("HideLoading");
            //    console.log("some error occured." + err);
            //});
        }
        function cellFormatterBackgroundColor(cell) {
            $scope.cellFormatterBackgroundColorCustom(cell, $scope.tabulatorConfiguratorSettings);
            if (!DataService.isEmpty(cell.getValue()))
                return cell.getValue();
        };
        var arrowIcon = function (cell, formatterParams) {
            cellFormatterBackgroundColor(cell);
            return "<i class='fa fa-chevron-right'></i>";
        };
        var arrowEdit = function (cell, formatterParams) {

            if (cell._cell.row.type == "row") {
                cellFormatterBackgroundColor(cell);
                return '<img src="fg-assets/images/settings.png" width="20">';
                //return "<i class='fa fa-pencil fa-lg'></i>"
                //return "<img src='assets/images/pencil.png' width='20'>";
            } else {
                return "";
            }

        };
        function isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        var arrowDataFormat = function (cell, formatterParams) {
            
            var exists;
            _.each($scope.formDatafields, function (page, key) {
                exists = _.findWhere(page, { name: cell.getColumn().getField() });
            });
            cellFormatterBackgroundColor(cell);
            var data = cell.getValue();
            if (!DataService.isEmpty(exists)) {
                if (!DataService.isEmpty(exists.Use_as_tags) && exists.Use_as_tags == "Yes") {
                    if (!DataService.isEmpty(data)) {
                        if (data.contains("[") && data.contains("{")) {
                            if (data.length > 2) {
                                if (isJsonString(data)) {
                                    data = JSON.parse(data);
                                }
                                data = {};
                                var list = "";
                                _.each(data, function (itelist) {
                                    list += itelist.value + ",";
                                });
                                list = (list.length > 1) ? list.substring(0, list.length - 1) : list;
                                return list;
                            }
                        } else {
                            return !DataService.isEmpty(data) ? data : "";
                        }
                    }

                }
                else {
                    if (data == 0)
                        return data;
                    else if (data == null || data == "" || (typeof data === 'undefined')) {
                        return '';
                    }
                    else {
                        if (data == "1111111" || data == "11111111" || data == "111111111") {
                            return !DataService.isEmpty(data) ? data : "";
                        }
                        var chk = moment(data, moment.ISO_8601, true).isValid();
                        if (chk == true) {
                            var returnVal = $scope.ToCustomDateTime(data);
                            return returnVal;
                        }
                        else {
                            return !DataService.isEmpty(data) ? data : ""
                        }

                    }
                    return !DataService.isEmpty(data) ? data : "";
                }
            } else {
                var chk = moment(data, moment.ISO_8601, true).isValid();

                if (chk == true) {

                    if (cell.getColumn().getField() == "created_at" || cell.getColumn().getField() == "updated_at") {

                        var returnVal = moment.utc(data).local().format("YYYY-MM-DD HH:mm");

                        return returnVal;
                    } else {
                        return !DataService.isEmpty(data) ? data : ""
                    }
                }
                else {
                    return !DataService.isEmpty(data) ? data : ""
                }
            }
        };

        $scope.ToCustomDate = function (date) {
            var dateTime = new Date(date);
            //dateTime = moment(dateTime).format("DD-MM-YYYY");
            dateTime = moment(dateTime).format("YYYY-MM-DD");
            return dateTime;
        };

        var datetimeFormatter = function (cell) {
            cellFormatterBackgroundColor(cell);
            var _date = cell.getValue();
            var returnDate = "";
            if (_date == null || (typeof _date === 'undefined')) { returnDate = ''; }
            else {
                //returnDate = customDate(_date);
                returnDate = $scope.ToCustomDateTime(_date);
            }

            return returnDate;

        }
        var checkboxGroupFormatter = function (cell) {
            cellFormatterBackgroundColor(cell);
            var _data = cell.getValue();
            var returnResult = "";
            if (_data == null || _data == "" || (typeof _data === 'undefined')) { returnResult = ''; }
            else {
                if (_data.toLowerCase() == "true" && _data.length == 4) {
                    returnResult = "Yes";
                }
                else if (_data.toLowerCase() == "false" && _data.length == 5) {
                    returnResult = "No";
                }
                else {
                    returnResult = _data;
                }
                //returnResult = (_data.toLowerCase() && _data.length == 4) == "true" ? "Yes" :
                //(_data.toLowerCase() && _data.length == 5) == "false" ? "No" : _data;
            }
            return returnResult;
        }
        var CBval = ['No', 'Yes'];
        var CBEditor = function (cell, onRendered, success, cancel) {
            if ($scope.CB_Edit == true && $scope.CB_toggle == true) {
                var editor1 = $("<select id='dllCheckbox'>");
                $.each(CBval, function (value, text) {
                    editor1.append($('<option>').attr({
                        'value': parseInt(value)
                    }).append(text)
                    );
                });
                editor1.css({ "padding": "3px", "width": "100%", "box-sizing": "border-box" });
                //Set value of editor to the current value of the cell
                editor1.val(editor1.find('option:contains(' + cell.getValue() + ')').val());
                //when the value has been set, trigger the cell to update
                editor1.on("change blur", function (e) {
                    //setDropdownHeaderFilter(cell.getField(), editor1.val());
                    //success(editor1.find('option:selected').text());
                    var input = []; var json = {}; var columnName = cell.getColumn().getField();
                    json[columnName] = (columnName === "status" ? formStatus.indexOf(cell.getValue()) : cell.getValue());
                    input['url'] = "{{url('')}}";
                    input['data'] = { 'table': 'form', 'update': json, 'where': { Id: cell.getRow().getData().Id } };

                    if (input['data'].update[columnName]) { //ajax_call(input); 

                        //param.formTableName =$scope.formDetailsDataInfo.FormTableName;
                        if (columnName != "updated_at" && columnName != "created_at") {
                            var param = {};
                            var formId = cell.getData().formID;
                            param.fieldName = columnName;
                            param.formId = formId;
                            $scope.dllCheckbox = $('#dllCheckbox option:selected').val() == "1" ? true : false;
                            //param.fieldDataText = cell.getValue();
                            param.fieldDataText = $scope.dllCheckbox;
                            param.Id = cell.getRow().getData().Id;
                            $scope.updateRowDataRecord(param);
                        }
                    }
                    else {
                        cell.restoreOldValue();
                    }
                });
                return editor1[0];

            }
            else {
                return;
            }

            //return the editor element
        };
        $scope.ToCustomDateTime = function (date) {
            
            var dateTime = new Date(date);
            dateTime = moment(date).format("YYYY-MM-DD HH:mm");
            return dateTime;
        }

        $scope.ToLocalDateTime = function (date) {
            var dateTime = new Date(date);
            dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm");
            //var dt_format = moment.utc(dateTime).local().format("DD-MM-YYYY HH:mm");
            return dateTime;
        }


        var datetimeFormatterTime = function (cell) {
            cellFormatterBackgroundColor(cell);
            var _date = cell.getValue();
            var returnDate = "";
            if (_date == null || (typeof _date === 'undefined')) { returnDate = ''; }
            else {
                //returnDate = customDate(_date);
                returnDate = $scope.ToCustomDateTime(_date);
            }
            //var field = cell.getField();
            //if ((field == "updated_at" || field == "created_at") && returnDate != "Invalid date")
            //{
            // if (field == "updated_at")
            //cell.setValue("updated_at", returnDate);
            //else
            // cell.setValue("created_at", returnDate);
            //}
            return returnDate;

        }
        var convertFormatter = function (cell) {
            cellFormatterBackgroundColor(cell);
            var cellVal = cell.getValue();
            var returnVal = "";
            if (cellVal == null || (typeof cellVal === 'undefined')) {
                returnVal = '';
            }

            else {
                if (moment(cellVal, moment.ISO_8601, true).isValid()) {
                    returnVal = $scope.ToCustomDateTime(_date);
                }
                else {
                    returnVal = cellVal
                }
            }
            //var field = cell.getField();
            //if ((field == "updated_at" || field == "created_at") && returnDate != "Invalid date")
            //{
            // if (field == "updated_at")
            //cell.setValue("updated_at", returnDate);
            //else
            // cell.setValue("created_at", returnDate);
            //}
            return returnVal;

        }
        var arrowImage = function (cell, formatterParams) {
            cellFormatterBackgroundColor(cell);
            var filename = cell.getValue();
            if (angular.isDefined(filename) && !DataService.isEmpty(filename) && filename != "null")
                filename = filename.replace('~', '');
            if (!DataService.isEmpty(filename) && filename != "null") {
                if (filename.includes(";base64")) {
                    return "<img src='" + filename + "' width='150'>";
                }
                else {
                    var pathImage = "";
                    if (filename.contains("http")) {
                        pathImage = filename;
                    } else {
                        pathImage = mainService.getBaseUrl() + filename;
                    }
                    var ext = filename.substr(filename.lastIndexOf('.') + 1);
                    ext = (!DataService.isEmpty(ext) ? ext.toLowerCase() : ext);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        return "<img src='" + pathImage + "' width='150'>";
                    }
                    else {
                        var nameddd = filename.substring(filename.lastIndexOf('/') + 1);
                        return "<a href=" + pathImage + " title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a>";
                    }
                }

            }
            else
                return "<img src='' width='150'>";
        };
        function getRandom(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        var isAnonymous = function (searchVal) {
            //console.log(searchVal.check);
            var signUpString = "signUp";

            // var signUp = window.location.href + '?quickReg=signUp'
            if (searchVal.check == "anonymous") {
                $scope.QRstring = true;
                bootbox.dialog({
                    message: "<p>Do you want to join geligulu or stay at anonymous ?</p>",
                    buttons: {
                        join: {
                            label: "Join Geligulu",
                            className: 'btn-danger',
                            callback: function () {
                                bootbox.dialog({
                                    title: "Quick signup",
                                    message:
                                        '<div class="card panel-default">' +
                                        '<div class="row">' +
                                        '<div class="col-sm-12">' +
                                        '<form id="quickSignUp" >' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">User Name</label></div>' +
                                        '<div class="col-sm-6">' +
                                        // '<input type="hidden" name="return_url" value="' + window.location.href.split("?")[0] + '" />' +
                                        '<input type="text" class="form-control" id="username" placeholder="Please enter user name" name="username" required="required" >' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-4"></div>' +
                                        '<div class="col-sm-6">' +
                                        '<span id="errormsg_name"></span></div></div>' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">Password</label></div>' +
                                        '<div class="col-sm-6">' +
                                        '<input type="password" maxlength="100" id="password" minlength="6" required="required" class="form-control" placeholder="Enter Password" autocomplete="off" name="password" >' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">Confirm Password</label></div>' +
                                        '<div class="col-sm-6">' +
                                        '<input type="password" maxlength="100" minlength="6" required="required" class="form-control" placeholder="Enter Confirm Password" autocomplete="off" name="re-password"  id="re-password">' +
                                        '</div>' +
                                        '</div>' +
                                        '<button class="btn btn-primary" type="button" id="signUp" onclick="quickSignUp(this.id)" id="save_link">Sign Up</button>&nbsp;' +
                                        //                                                '<button class="btn btn-default" data-dismiss="modal">Cancel</button>'+
                                        '</form></div></div></div>',
                                    closeButton: false
                                })
                            }
                        },
                        anonymous: {
                            label: "Stay Anonymous",
                            className: 'btn-warning',
                            callback: function () {
                                var csrf_token = getRandom(10);  // document.getElementById('csrf_token').innerHTML;
                                var random_name = getRandom(5); //"{{substr(md5(microtime()),rand(0,26),6)}}";
                                var f = document.createElement("form");
                                // f.setAttribute('method', "get");
                                f.setAttribute('id', "redirect_form");
                                f.setAttribute('class', "hidden");
                                //  f.setAttribute('action', window.location.href+'?quickReg=anonymous');
                                //for hidden token
                                var a = document.createElement("input");
                                a.setAttribute('type', "hidden");
                                a.setAttribute('name', "_token");
                                a.setAttribute('value', csrf_token);
                                var b = document.createElement("input");
                                b.setAttribute('type', "text");
                                b.setAttribute('name', "name");
                                b.setAttribute('id', "txtAnonymousUserId");
                                b.setAttribute('value', random_name);
                                var c = document.createElement("input");
                                c.setAttribute('type', "text");
                                c.setAttribute('name', "password");
                                c.setAttribute('id', "txtAnonymousPassword");
                                c.setAttribute('value', '123456');
                                //var d = document.createElement("input");
                                //d.setAttribute('type', "text");
                                //d.setAttribute('name', "return_url");
                                //d.setAttribute('value', window.location.href.split("?")[0]);
                                var e = document.createElement("input");
                                e.setAttribute('type', "text");
                                e.setAttribute('name', "type");
                                e.setAttribute('value', 'anonymous');
                                f.appendChild(a); f.appendChild(b); f.appendChild(c);// f.appendChild(d);
                                f.appendChild(e);
                                document.body.appendChild(f);
                                //console.log(f);
                                quickSignUp('anonymous');
                                // f.submit();
                                return false;
                            }
                        },
                        ok: {
                            label: "Login",
                            className: 'btn-info',
                            callback: function () {
                                //                                        window.open("{{url('auth/login')}}","_self");
                                bootbox.dialog({
                                    title: "Quick login",
                                    message:
                                        '<div class="card panel-default">' +
                                        '<div class="row">' +
                                        '<div class="col-sm-12">' +
                                        '<form id="quickLogin1" >' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">User Name / Email</label></div>' +
                                        '<div class="col-sm-6">' +
                                        // '<input type="hidden" name="return_url" value="' + window.location.href.split("?")[0] + '" />' +
                                        '<input type="text" class="form-control" id="loginUserName" placeholder="Please enter user name" name="email" required="required" >' +
                                        '</div>' +
                                        '</div>' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-4"></div>' +
                                        '<div class="col-sm-6">' +
                                        '<span id="errormsg_name"></span></div></div>' +
                                        '<div class="col-sm-12 form-group row">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">Password</label></div>' +
                                        '<div class="col-sm-6">' +
                                        '<input type="password" maxlength="100" minlength="6" id="loginPassword" required="required" class="form-control" placeholder="Enter Password" autocomplete="off" name="password" >' +
                                        '</div>' +
                                        '</div>' +
                                        '<button class="btn btn-primary" type="button" onclick="quickLogin()" id="save_link1">Log In</button>&nbsp;' +
                                        //                                                '<button class="btn btn-default" data-dismiss="modal">Cancel</button>'+
                                        '</form></div></div></div>',
                                    closeButton: false
                                })
                            }
                        }
                    },
                    closeButton: false
                });
            }

        }
        var multilFiles = function (cell, formatterParams) {
            var temp = !DataService.isEmpty(cell.getValue()) ? cell.getValue() : "";
            var images = [];
            images = temp.split(',');
            if (images.length > 1)
                return '<button type="button" class="btn btn-xs btn-default" data-toggle="modal" data-target="#galleryModal"  title="Show all files" data-formGroupKey="' + cell.getData().formGroupKey + '"> Show all files</button> ';
            else
                return arrowImage(cell, formatterParams);
        }
        $scope.popUpIfNotApproved = function () {
            $('#form-records').hide();
            swal({
                title: '',
                text: "Request is pending to approve",
                type: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                cancelButtonText: 'No'
            }).then(function (isConfirm) {
                var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.formDetailsDataInfo.applicationId + "";
                window.location.href = url;
            });

        };
        $scope.popUpIfNotReq = function (formIdParam) {
            $('#form-records').hide();
            swal({
                title: '',
                text: "Subscribe this form",
                type: 'warning',
                showCancelButton: true,

                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Subscribe',
                cancelButtonText: 'Cancel'
            }).then(function (isConfirm) {
                if (isConfirm.dismiss == "cancel") {
                    // alert('canceled');
                    //$scope.formDetailsDataInfo.formId
                    //console.log($scope.formDetailsDataInfo.applicationId);
                    var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.formDetailsDataInfo.applicationId + "";
                    window.location.href = url;
                }
                else {
                    // console.log(isConfirm);

                    var url = mainService.getBaseUrl() + "#/form/saveEntry/" + formIdParam + "?popup=1";
                    window.location.href = url;
                }
            }
            );

        };
        $scope.Toggle = function () {
            // CookiesPersistenceService.setCookieWithExpiry("Calender-Toggle", 0);
            //$state.go('CalenderRecords', { formId: $stateParams.formId });
            var id = localStorage.getItem("ToggleCalenderId");
            window.location.href = mainService.getBaseUrl() + '#/form/calender/' + id;;
            // window.location.href ="http://localhost:51990/#/form/calender/52533";

        };
        $scope.showToggleButton = function () {
            var QueryString = $location.search();

            if (angular.isDefined(QueryString.toggle)) {
                $scope.isAllowToggle.show = true;
            }
            else
                $scope.isAllowToggle.show = false;
        };
        $scope.isSubscription = function (formIdParam, checkType) {
            // get subscription form's entry. and check if apply for subscription.
            if (angular.isDefined(formIdParam)) {
                var param = {};
                param.action = 26;

                param.formId = formIdParam;
                param.userid = $scope.userDetail.Id;
                var returnObj = false;


                mainService.manageSubscription("ManageSubscription", param)
                    .then(function (response) {
                        var data = response.data.data;
                        if (typeof data === "undefined") {
                            returnObj = false;
                            $scope.subscription.isAllowToLoad = false;

                            return returnObj;
                        }
                        else {
                            if (data.length > 0) {
                                var fieldTocheck = data[0].columnToCheck;
                                if (fieldTocheck == 2) {

                                    returnObj = true;
                                    $scope.subscription.isAllowToLoad = true;
                                    return returnObj;
                                }
                                else {

                                    returnObj = false;
                                    $scope.subscription.isAllowToLoad = false;

                                    $scope.popUpIfNotApproved();
                                    return returnObj;

                                }


                            }
                            else {
                                returnObj = false;
                                $scope.popUpIfNotReq(response.data.subscriptionId);
                                return returnObj;

                            }
                        }
                        //console.log(data);


                    }, function (err) {

                        $rootScope.$emit("HideLoading");
                        //window["subscriptionData"] = null;
                        console.log("some error occured." + err);
                        return false;
                    });
            }
            else
                return false;

            // console.log('returnObj is' + returnObj);

        };
       
        $scope.getFormDetails = function (param, tabularId) {
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.language = $scope.formSelectedLanguageId;
            param.currentstage = 0;
            $scope.allowViewSumm = "";
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        
                        $scope.allowViewSumm = response.data[0].allowViewSummary;
                        if (DataService.isEmpty($scope.allowViewSumm))
                            $scope.allowViewSumm = "";
                        $scope.QRstring = false;
                        $scope.basicCalendar_active = false;
                        $scope.allowAddDelete = true;
                        if (response.data[0].GracePeriodActive == 1) {
                            $scope.allowAddDelete = false;
                        }
                        var frmData = response.data[0];
                        
                        $scope.screenSize = frmData.screenMode;
                        var KanbanData = JSON.parse(frmData.fields);
                        if ((frmData.toDate_field != null && frmData.fromDate_field != null) && (frmData.toDate_field != '' && frmData.fromDate_field != ''))
                        //if (frmData.basicCalendar_active == 1 && frmData.toDate_field!=null && frmData.fromDate_field!=null)
                        {
                            $scope.basicCalendar_active = true;
                        }

                        var qrString = $location.search();
                        $scope.formentries = response.data[0];
                        var subscriptionFormID = frmData.subscriptionFormID;
                        
                       
                        var formDataTemp = response.data[0];
                        

                        $scope.formDetailsDataInfo = formDataTemp;
                        if (!DataService.isEmpty($scope.formDetailsDataInfo.scheduler_referrence_formId) && $scope.formDetailsDataInfo.scheduler_referrence_formId != 0) {
                            $scope.isSchedulerForm = true;
                        }

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



                        $rootScope.applicationId = $scope.formDetailsDataInfo.applicationId;
                        if (!DataService.isEmpty($scope.formDetailsDataInfo.formTag)) {
                            if ($scope.formDetailsDataInfo.formTag.contains("invoice"))
                                $scope.isInvoiceForm = true;
                            if ($scope.formDetailsDataInfo.formTag.toLowerCase().contains("transaction"))
                                $scope.isTransactionForm = true;
                        }
                        if ($scope.formDetailsDataInfo.isCalenderQueue > 0) {
                            $scope.$emit("loadSideBar", $scope.formDetailsDataInfo.applicationId, 1);

                            $timeout(function () {
                                $(".sidebar-strip").css("display", "flex");
                                if ($("section.sidebar-strip:visible").length) {
                                    $("section.sidebar-strip").children('.side-nav').mCustomScrollbar();
                                }
                                $rootScope.isHomePage = false;
                                $rootScope.isOtherPage = true;
                                $rootScope.isRecordPage = true;
                                $rootScope.safeApply();
                            }, 150);
                        }
                        var paramRoles = {};
                        paramRoles.action = 5;
                        paramRoles.formId = $scope.formDetailsDataInfo.formId;
                        paramRoles.userId = $scope.userDetail.Id;
                        paramRoles.created_by = $scope.formDetailsDataInfo.created_by;
                        //$scope.loadFormRoles(paramRoles);
                        $scope.setInformationLink();
                        $scope.formDatafields = JSON.parse(formDataTemp.fields);
                        _.each($scope.formDatafields, function (pagesData, key) {
                            if (!Array.isArray(pagesData))
                                $scope.formDatafields[key] = JSON.parse(pagesData);
                            _.each($scope.formDatafields[key], function (item) {
                                $scope.formAllDatafields.push(item);
                                if (angular.isDefined(item.values)) {
                                    if (!Array.isArray(item.values))
                                        item.values = JSON.parse(JSON.parse(item.values));
                                }
                            });
                        });

                        bindtabulatorOnly("columns", true);

                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.toggle = function () {
            localStorage.setItem("Calender-Toggle", 1);
            $state.go('CalenderRecords', { formId: $stateParams.formId });
        };
        $scope.saveFormEntryData = function () {
            //customForms&customFormIds&parentFormId   
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
                "formId": $scope.currentFormId, "popup": 1, "customForms": formList, "customFormIds": formlistIds
            });
        };        
        $scope.uploaddownloadPopup = function () {
            var title = "";

            title = "Upload/Download"
            $scope.currentFormType = 0;

            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons 
            });
        };
        $scope.getApprovalColumn = function (formIdParam) {
            // get subscription form's entry. and check if apply for subscription.
            var param = {};
            param.action = 27;
            param.formId = formIdParam;
            param.userid = $scope.userDetail.Id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    var data = response.data[0];
                    if (data != null && angular.isDefined(data)) {
                        if (data.length > 0) {
                            return data.fieldName;
                        }
                        else
                            return null;
                    }
                    else
                        return null;
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };
        $scope.isApproved = function (formIdParam, entryColumnNameParam) {
            // get subscription form's entry. and check if apply for subscription.
            var param = {};
            param.action = 28;
            param.formId = formIdParam;
            param.userid = $scope.userDetail.Id;
            param.entryColumn = entryColumnNameParam;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    var data = response.data[0];
                    if (data != null && angular.isDefined(data)) {
                        return data.entryColumnNameParam;
                    }
                    else
                        return null;
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };
        $scope.showAllRecords = function () {
            $timeout(function () {
                var paramTemp = {};
                paramTemp.action = 2;
                paramTemp.formId = $scope.currentFormId;
                $scope.GetFormRecordListDynamimc(paramTemp);
            }, 150);
        };
        $scope.chatRoom = function (roomid) {
            localStorage.setItem('chatRoom', roomid);
            localStorage.setItem('chatRoomForm', $stateParams.formId);
            $state.go("chat");
            //var param={};
            //param.formId=$stateParams.formId;
            //param.roomid=roomid;
            //$rootScope.$broadcast("CallParentMethod", param);
            //console.log(param);
        }
        function filterReadableTableData(temp, name) {
            var data = temp;;
            var properties = data.split(';');
            var obj = {};
            var objList = [];
            var columnName = "";
            properties.forEach(function (property, index) {
                property = property.replace(/{/g, '').replace(/}/g, '').replace(/'/g, '').replace(/"/g, '');
                var tup = property.split(':');
                if (tup.length == 3) {
                    columnName = tup[0].trim();
                    var prm = name + '[' + tup[0].trim() + ']' + '[' + tup[1].trim() + ']';
                    if (tup[2].contains(prm)) {
                        obj[prm] = tup[2].replace(prm, ':').trim();
                        objList.push(obj)
                    }
                    else {
                        if (tup[2].contains('[') && tup[2].contains(']') && tup[2].contains('_')) {
                            var slist = tup[2].split('_');
                            for (var i = 0; i < slist.length; i++) {
                                var nTableValue = slist[i];
                                if (!DataService.isEmpty(nTableValue))
                                    nTableValue = nTableValue.replace('[', '').replace(']', '').trim();
                                obj[prm + '[' + (i + 1) + ']'] = nTableValue;

                                objList.push(obj)
                            }
                        } else {
                            obj[prm] = tup[2];
                            objList.push(obj)
                        }
                    }
                }
                else if (tup.length == 2 && index > 0) {
                    var prm = name + '[' + columnName.trim() + ']' + '[' + tup[0].trim() + ']';
                    if (tup[1].contains(prm)) {
                        obj[prm] = tup[1].replace(prm, ':').trim();
                        objList.push(obj)
                    } else {
                        obj[prm] = tup[1];
                        objList.push(obj);
                    }
                }
            });
            return objList.length > 0 ? objList[0] : [];
        };

        $scope.executeButton = function (eventData) {
            console.log(eventData);

            if (window["formGroupKeyList"].length > 0) {
                var deletedList = window["formGroupKeyList"];
                var param = {};

                param.formId = $scope.currentFormId;
                param.name = $scope.userDetail.name;
                param.userId = $scope.userDetail.Id;
                var newDeletedList = [];

                var dataParam = {};
                $rootScope.$emit("ShowLoading");

                var listAllFields = [];
                angular.forEach($scope.formFields, function (pageData, pageKey) {
                    angular.forEach(pageData, function (item, key) {
                        listAllFields.push(item);
                    });
                });
                var newformGroupKeyExecutedList = [];
                var singleRecord = {};
                singleRecord = angular.copy($scope.selectedDeletedRecordList[0]);
                angular.forEach($scope.selectedDeletedRecordList, function (item) {
                    var formfieldDataListTemp = [];
                    var formfieldDataListTempParse = angular.copy(item);
                    if (angular.isDefined(formfieldDataListTempParse)) {
                        angular.forEach(formfieldDataListTempParse, function (itemParse, keyParse) {
                            if (keyParse.contains("_Id")) {
                                var spltKey = keyParse.split("_Id");
                                var name_id = spltKey[0];
                                var _indx = _.findIndex(formfieldDataListTemp, { name: name_id });
                                if (_indx != -1) {
                                    formfieldDataListTemp[_indx].value = itemParse;
                                } else {
                                    spltKey[0] = spltKey[0].replace(/'/g, " ");
                                    spltKey[0] = spltKey[0].replace(/"/g, " ");
                                    if (!DataService.isEmpty(itemParse)) {
                                        if (typeof itemParse == 'string') {
                                            itemParse = itemParse.replace(/'/g, " ");
                                            itemParse = itemParse.replace(/"/g, " ");
                                        }
                                    }
                                    formfieldDataListTemp.push({ "name": spltKey[0], value: itemParse });
                                }
                            } else {
                                keyParse = keyParse.replace(/'/g, " ");
                                keyParse = keyParse.replace(/"/g, " ");
                                if (!DataService.isEmpty(itemParse)) {
                                    if (typeof itemParse == 'string') {
                                        itemParse = itemParse.replace(/'/g, " ");
                                        itemParse = itemParse.replace(/"/g, " ");
                                    }
                                }
                                formfieldDataListTemp.push({ "name": keyParse, value: itemParse });
                            }
                        });

                        var _indxTable = _.filter(formfieldDataListTempParse, function (item, key) { return key == "table_transaction"; });
                        if (_indxTable.length > 0) {
                            var tableData = _indxTable[0].replace(/'/g, " ");
                            tableData = tableData.replace(/"/g, " ");
                            var temp = filterReadableTableData(tableData, "table_transaction");
                            angular.forEach(temp, function (item, key) {
                                formfieldDataListTemp.push({ "name": key, value: item.trim() });
                            });
                        }
                        var _indxTable1 = _.findIndex(formfieldDataListTemp, { name: "table_transaction" });
                        if (_indxTable1 != -1) {
                            formfieldDataListTemp.splice(_indxTable1, 1);
                            var _indxTable2 = _.filter(formfieldDataListTempParse, function (item, key) { return key == "table_scheduling"; });
                            _indxTable1 = _.findIndex(formfieldDataListTemp, { name: "table_scheduling" });
                            var temp1 = filterReadableTableData(_indxTable2[0], "table_scheduling");
                            angular.forEach(temp1, function (item, key) {
                                formfieldDataListTemp.push({ "name": key, value: item.trim() });
                            });
                            formfieldDataListTemp.splice(_indxTable1, 1);
                        }
                        newformGroupKeyExecutedList.push(angular.copy(formfieldDataListTemp));
                    }
                });
                dataParam = singleRecord;
                dataParam.action = 2;
                dataParam.name = $scope.userDetail.name;
                dataParam.userId = $scope.userDetail.Id;
                dataParam.formId = $scope.currentFormId;
                dataParam.topicId = $scope.formDetailsDataInfo.topicId;
                dataParam.formfieldDataListTempList = [];
                angular.forEach(newformGroupKeyExecutedList, function (firstRecord) {
                    dataParam.formfieldDataListTempList.push(angular.copy(JSON.stringify(firstRecord)));
                });
                mainService.executeSchedularFormEntry("ExecuteSchedularFormEntry", dataParam)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (!DataService.isEmpty(response.data.Message)) {
                                var exists = response.data;
                                if (exists.res == 1) {
                                    notifierService.notifyMessage('success', 'FormRecord', exists.Message);
                                }
                            }
                        }
                        $rootScope.$emit("HideLoading");
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });

            }
            else {
                notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
            }
        };
        $scope.deleteRecords = function () {
            var isDelete = false;
            if (window["formGroupKeyList"].length > 0) {
                var deletedList = window["formGroupKeyList"];
                var param = {};
                param.action = 3;
                param.formId = $scope.currentFormId;
                param.name = $scope.userDetail.name;
                param.userId = $scope.userDetail.Id;
                var newDeletedList = [];
                var newformGroupKeyDeletedList = [];
                angular.forEach($scope.selectedDeletedRecordList, function (item) {
                    newDeletedList.push(item.Id);
                    newformGroupKeyDeletedList.push(item.formGroupKey);
                });

                if (newDeletedList.length > 0) {
                    param.formGroupKeyList = newDeletedList.join();
                    window["formGroupKeyList"] = newDeletedList;
                    param.formfieldDataListTemp = newformGroupKeyDeletedList.join();
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);
                    if (confirm('Are you sure to delete selected Record?')) {
                        GeneratedFormDataDelete(param);
                    }
                } else if (isDelete == true && newDeletedList.length == 0) {
                    $timeout(function () {
                        notifierService.notifyMessage('error', 'Delete Time', 'Delete Time is exceed');
                    }, 200);
                }

            }
            else {
                //  alert('Please select atleast one record.')
                notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
            }
        };

        $scope.OpenlocationOnGoogleMap = function () {
            if (window["formGroupKeyList"].length > 0) {
                var latlong = $scope.selectedDeletedRecordList;
                var Mapdatarr = [];
                 
                var Dependentcolumns = $scope.MapMarkerControlDescriptionDeppendFields;

                if (Dependentcolumns == undefined) {
                    Dependentcolumns = " ";
                }

                for (let i = 0; i < latlong.length; i++) {
                     
                    var DependentcolumnsArr = Dependentcolumns.split(",");
                    var colsdata = ""
                    var k = 0;
                    for (let j = 0; j < DependentcolumnsArr.length; j++) {

                        if (k == 0) {
                            colsdata += latlong[i][DependentcolumnsArr[j]];
                        }
                        else {
                            colsdata +=" "+ latlong[i][DependentcolumnsArr[j]];
                        }
                        
                        k++;

                    }
                    console.log(colsdata,"datacols");
                     

                    Mapdatarr.push({
                        Latitude: latlong[i].Latitude,
                        Longitude: latlong[i].Longitude,
                        Desc: colsdata, //latlong[i][DependentcolumnsArr[0]], //+ " " + latlong[i][DependentcolumnsArr[1]],
                           
                        });
                    }
                    
                    localStorage.setItem("GooglemapLatlongMapData", JSON.stringify(Mapdatarr));
                    //var data = MapService.get();
                    //console.log(data,"data"); 
                    $window.open('#/GoogleMap/' + $scope.currentFormId, '_blank');
                }
                else {                    
                    notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
                }
            
        };

        function checkDeleteEditAccessRight(type, recordData) {
            var result = true;
            var exists = _.findWhere($scope.filerCriteriaFormDetails.ownRoleAccess, { role: $rootScope.currentUserFormRole });
            var existsOther = _.findWhere($scope.filerCriteriaFormDetails.otherRoleAccess, { role: $rootScope.currentUserFormRole });
            if (!DataService.isEmpty(exists)) {
                if (type == 1) {
                    var existsOwn = _.where($scope.selectedDeletedRecordList, { userID: $scope.userDetails.Id });
                    if (existsOwn.length != $scope.selectedDeletedRecordList.length) {
                        if (!DataService.isEmpty(existsOther)) {
                            if (!existsOther.access.delete) {
                                result = false;
                            }
                            if (existsOwn.length > 0)
                                if (!exists.access.delete) {
                                    result = false;
                                }
                        }
                    }
                    else {
                        if (!exists.access.delete) {
                            result = false;
                        }
                    }

                }
                else if (type == 0) {
                    if (recordData.userID != $scope.userDetails.Id) {
                        if (!DataService.isEmpty(existsOther)) {
                            if (!existsOther.access.edit) {
                                result = false;
                            }
                        }
                    }
                    else {
                        if (!exists.access.edit) {
                            result = false;
                        }
                    }
                }
                else if (type == 2) {
                    if (recordData.userID != $scope.userDetails.Id) {
                        if (!DataService.isEmpty(existsOther)) {
                            if (!existsOther.access.view) {
                                result = false;
                            }
                        }
                    }
                    else {
                        if (!exists.access.view) {
                            result = false;
                        }
                    }
                }
            }
            else {
            }
            return result;
        };
        function downloadFileFunc(file, path) {
            window.location.href = path;
        };
        var fileFormatter = function (columns, data, options, setFileContents) {
            //columns - column definition array for table (with columns in current visible order);
            //data - currently displayed table data
            //options - the options object passed from the download function
            //setFileContents - function to call to pass the formatted data to the downloader

            //create a list of all name fields
            var names = [];

            data.forEach(function (row) {
                names.push(row.name);
            });

            //trigger file download, passing the formatted data and mime type
            setFileContents(names.join(", "), "");
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
                    //tabulator.download(fileFormatter, "test.txt");
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: ",", bom: true });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "portrait", //set page orientation to portrait
                        title: $scope.formDetailsDataInfo.title //add title to report
                        , bom: true
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
                case 6:
                    var temp = {};
                    temp.formId = $scope.currentFormId;
                    var path = API_URL + "api/FormAPI/downloadFiles/" + (!DataService.isEmpty(temp.formId) ? temp.formId : temp.formID) + "/4";
                    downloadFileFunc("", path);
                    break;
                case 7:
                    var temp = {};
                    temp.formId = $scope.currentFormId;
                    var path = mainService.getCurrentEndPointUrl() + "/downloadFiles/" + (!DataService.isEmpty(temp.formId) ? temp.formId : temp.formID) + "/5";
                    downloadFileFunc("", path);
                    break;
                default:
                    data = "";
                    break;
            }
        };
        $scope.loadMore = function () {
            $scope.limit += 5;
        };
        var newWindow = {};
        $scope.entryPage = function (formId, isEdit, formGroupKey, rowId, rowData) {
            var reference_form = "2196";
            var params = setWindowScreenSize($scope.screenSize);

            var baseUrl = mainService.getOtherBaseUrl();
            $scope.isEdit = isEdit;
            var fullPath = "";
            var qrString = $location.search();
            if ($scope.isEdit) {
                if (angular.isDefined(qrString.check) && angular.isDefined($scope.userDetail.reqType)) {
                    fullPath = baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1&isAnonymous=1';
                }
                else {
                    fullPath = baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1';
                    if ($scope.formDetailsDataInfo.currentFormType == 1) {
                        var customForms = rowData.customForms;
                        var customFormIds = rowData.customFormIds;
                        customForms = customForms.split(",");
                        customFormIds = customFormIds.split(",");
                        var customFormsTemp = [];
                        var customFormIdsTemp = [];
                        _.each(customForms, function (item) {
                            customFormsTemp.push(item.trim());
                        });
                        _.each(customFormIds, function (item) {
                            customFormIdsTemp.push(item.trim());
                        });
                        customForms = customFormsTemp;
                        customFormIds = customFormIdsTemp;
                        if ($scope.formDetailsDataInfo.calenderSettingsList.length > 0) {
                            var temp = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                                return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                            });
                            _.each(temp, function (item) {
                                var exists = [];
                                exists = _.filter(customForms, function (filteritem) { return filteritem.trim() == item.resourceForm.toString() });
                                if (exists.length == 0) {
                                    customForms.push(item.resourceForm.toString());
                                }
                            });
                            if (customForms.length > customFormIds.length) {
                                for (var i = customFormIds.length; i < customForms.length; i++) {
                                    customFormIds.push("0");
                                }
                            }
                            customFormIds = customFormIds.join(',');
                            customForms = customForms.join(',');
                        }
                        //$state.go("saveFormEventData", {
                        //    "formId": $scope.currentFormId, "popup": 1, "customForms": formList, "customFormIds": formlistIds
                        //});
                        fullPath = baseUrl + "#/form/editEvent/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1&customForms=' + customForms + '&customFormIds=' + customFormIds + '';

                    }
                }
            }
            else {
                fullPath = baseUrl + "#/form/saveEntry/" + formId + '?popup=1';
                if ($scope.formDetailsDataInfo.currentFormType == 1) {
                    var customForms = rowData.customForms;
                    var customFormIds = rowData.customFormIds;
                    fullPath = baseUrl + "#/form/saveEvent/" + formId + '?popup=1&customForms=' + customForms + '&customFormIds=' + customFormIds + '';

                }
            }
            window.location.href = fullPath;
            //localStorage.setItem("newWindow", fullPath);
            //newWindow = window.open(fullPath, 'example', params, true);
            //newWindow.focus();
            //var timer = setInterval(function () {
            //    if (newWindow.closed) {

            //        var qrString = $location.search();
            //        //console.log(qrString);
            //        var reqType = JSON.parse(localStorage.getItem('detail')).reqType;
            //        if (angular.isDefined(qrString.check) && angular.isDefined(reqType)) {




            //            var tempUserId = JSON.parse(localStorage.getItem('detail')).name;
            //            var date = new Date();
            //            date.setTime(date.getTime() + (30 * 1000)); // expires in 30 seconds.
            //            $.cookie('tempUserId', tempUserId, { expires: date });
            //            localStorage.removeItem('detail');// removing login detais from local storage
            //            $state.go("login", { reload: true, inherit: false });
            //        }


            //        clearInterval(timer);
            //        $scope.freshEntryformGroupKey = create_UUID();
            //        $("#formGroupKey").val($scope.freshEntryformGroupKey);
            //        localStorage.setItem("formGroupKey" + $scope.currentFormId, $scope.freshEntryformGroupKey);
            //        $timeout(function () {
            //            var paramTemp = {};
            //            paramTemp.action = 2;
            //            paramTemp.formId = formId;
            //            $scope.GetFormRecordListDynamimc(paramTemp);
            //        }, 150);



            //        // $scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
            //        //alert('closed: ' + reference_form);
            //        // tabulators["tabulator_1574079483837"].setData("http://192.168.1.141:91/form-generator/public/get-linked-records/" + reference_form + "/0");
            //    }
            //}, 500);
        };
        $scope.$on("getFormList", function (event, data) {
            if (!DataService.isEmpty(data)) {
                $scope.allFormsList = data;
                if ($scope.allFormsList.length > 0) {
                    var exists = _.filter($scope.allFormsList, function (item) {
                        return (!DataService.isEmpty(item.formTag) ? item.formTag.toLowerCase().contains("transaction") : false);
                    });
                    if (exists.length > 0) {
                        if (exists[0].formId == $scope.formDetailsDataInfo.formId)
                            $scope.isTransactionForm = true;
                    }
                    if ($scope.isTransactionForm) {
                        var exists1 = _.findWhere($scope.allFormsList, { currentFormType: 1 });
                        if (!DataService.isEmpty(exists1)) {
                            $scope.calenderFormId = exists1.formId;
                            if ($scope.calenderFormId != 0) {
                                var exists = _.filter($scope.formAllDatafields, function (item) {
                                    return !DataService.isEmpty(item.Referral_Forms) ? item.Referral_Forms == $scope.calenderFormId.toString() : false;
                                });
                                if (exists.length > 0) {
                                    $scope.formDetailsDataInfo.Referral_Form_Fields_Multiple = exists[0].Referral_Form_Fields_Multiple;
                                    $scope.formDetailsDataInfo.Referral_Form_Fields_Multiple_name = exists[0].name;

                                }
                            }
                        }
                    }
                }
            }
        });
        function convertDateString(stringData) {
            var result = stringData.substring(0, 10);
            var dateParts = result.split("-");
            var dateObject = new Date(dateParts[1] + "-" + dateParts[0] + "-" + dateParts[2]);
            var temp = moment(dateObject).format("MM-DD-YYYY");
            return temp;
        }
        function getAllYear() {
            var currentYear = new Date().getFullYear(),
                years = [];
            var startYear = 2010;
            for (var i = startYear; i <= currentYear; i++) {
                years.push({ year: (startYear++).toString() });
            }
            return years;
        }
        $scope.generateInvoiceFunc = function () {
            $scope.generateInvoiceParam = {};
            $scope.generateInvoiceParam.created_by = $scope.userDetail.Id;
            $scope.generateInvoiceParam.update_by = $scope.userDetail.Id;
            $scope.generateInvoiceParam.yearList = [];
            $scope.generateInvoiceParam.yearList = getAllYear();
            $scope.generateInvoiceParam.yearList = _.sortBy($scope.generateInvoiceParam.yearList, function (num) {
                return num;
            }).reverse();
            $scope.generateInvoiceParam.isExistingRecord = 0;
            $timeout(function () {
                $ngBootbox.customDialog({
                    templateUrl: 'generateInvoice.html',
                    scope: $scope,
                    title: 'Generate Invoice',
                    size: "large"
                });
            }, 100);

            var param = {};
            param.action = 2;
            param.fieldName = "";
            if ($scope.allFormsList.length > 0) {
                var exists = _.filter($scope.allFormsList, function (item) {
                    return (!DataService.isEmpty(item.formTag) ? item.formTag.toLowerCase().contains("student") : false);
                });
                if (exists.length > 0) {
                    param.formId = exists[0].formId;
                    var existsFieldname = _.findWhere($scope.formAllDatafields, { Referral_Forms: param.formId.toString() });
                    if (!DataService.isEmpty(existsFieldname)) {
                        param.fieldName = existsFieldname.Referral_Form_Fields;
                        $scope.otherFormFieldName = param.fieldName;
                    }
                }
            }


            //if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName)) {
            //    var list = JSON.parse($scope.formDetailsDataInfo.otherFormFieldName);
            //    if (list.length>0){
            //        param.fieldName =  list[0];
            //        $scope.otherFormFieldName = param.fieldName;
            //        }
            //}
            $scope.otherFormList = [];
            //$rootScope.$emit("ShowLoading");
            //mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
            //    .then(function (response) {
            //        console.log(response);
            //        $scope.allReferrenceData = response.data;
            //        // $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
            //        $scope.otherFormList = $scope.allReferrenceData.formDataListNew;
            //        $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
            //        $timeout(function () {
            //            $("#studentlist").selectpicker({
            //                liveSearch: true
            //            });
            //        }, 150);
            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });



        };
        $scope.confirmExistingRecord = function (type) {
            $scope.generateInvoiceParam.isExistingRecord = type;
        };
        $scope.confirmToGenerateExistingRecord = function () {
            //alert('')
            $scope.generateInvoiceParam.replaceExistingRecord = false;
            $scope.generateInvoiceParam.replaceExistingRecord = $scope.generateInvoiceParam.isExistingRecord == 2 ? true : false;
            $scope.generateInvoiceParam.action = 4;
            if (!DataService.isEmpty($scope.generateInvoiceList.listOfRecords) && !DataService.isEmpty($scope.generateInvoiceList)) {
                var listOfRecords = angular.copy($scope.generateInvoiceList.listOfRecords);
                _.each(listOfRecords, function (item) {
                    item.isExistingRecords = item.isExistingRecords == "Yes" ? 1 : 0;
                });
                $scope.generateInvoiceParam.listOfRecords = listOfRecords;
            }
            $rootScope.$emit("ShowLoading");
            mainService.GeneratingInvoice("GeneratingInvoice", $scope.generateInvoiceParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        var invoiceList = response.data;
                        bindtabulatorOnly("columns", $scope.formDetailsDataTemp);
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
            $ngBootbox.hideAll();
        };
        $scope.generateInvoice = function () {
            //console.log($scope.generateInvoiceParam);
            $scope.generateInvoiceList = [];
            $scope.generateInvoiceParam.action = 2;
            $scope.generateInvoiceParam.paymentPeriod1 = $scope.generateInvoiceParam.paymentMonth + "-" + $scope.generateInvoiceParam.paymentYear;
            $scope.generateInvoiceParam.paymentPeriod = $scope.generateInvoiceParam.paymentMonth + "-01-" + $scope.generateInvoiceParam.paymentYear;

            if ($scope.generateInvoiceParam.paymentPeriod.length == 10) {
                $scope.generateInvoiceParam.studentlist = [];
                if (!DataService.isEmpty($scope.generateInvoiceParam.startStudentId) && !DataService.isEmpty($scope.generateInvoiceParam.endStudentId))
                    for (var i = $scope.generateInvoiceParam.startStudentId; i <= $scope.generateInvoiceParam.endStudentId; i++) {
                        $scope.generateInvoiceParam.studentlist.push(i);
                    }

                $scope.generateInvoiceParam.list = JSON.stringify(angular.copy($scope.generateInvoiceParam.studentlist));

                var exists = _.filter($scope.allFormsList, function (item) {
                    return (!DataService.isEmpty(item.formTag) ? item.formTag.toLowerCase().contains("student") : false);
                });

                if (exists.length > 0) {
                    var param = {};
                    param.formId = exists[0].formId;
                    var existsFieldname = _.findWhere($scope.formAllDatafields, { Referral_Forms: param.formId.toString() });
                    $scope.formDetailsDataInfo.otherformid = existsFieldname.Referral_Forms;;

                }

                $scope.generateInvoiceParam.formId = $scope.formDetailsDataInfo.formId;
                $scope.generateInvoiceParam.otherreferrenceFormId = $scope.formDetailsDataInfo.otherformid;
                $scope.generateInvoiceParam.primaryFormId = $scope.formDetailsDataInfo.primaryFormId;
                $ngBootbox.customDialog({
                    templateUrl: 'confirmGenerateInvoice.html',
                    scope: $scope,
                    title: 'Generate Invoice',
                    size: "large"
                });
                $timeout(function () {
                    $("#studentlist1").selectpicker({
                        liveSearch: true
                    });
                    window["generate-form-table"] = initTabulator("generate-form-table", {
                        selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                    });

                    var temp = [];
                    temp.push({
                        title: "Id", formatterParams: { height: 50, width: 50 }, headerSort: false,
                        align: "center", field: "studentId", align: "left", headerFilter: false
                    });
                    temp.push({
                        title: "Name", formatterParams: { height: 50, width: 50 }, headerSort: false,
                        align: "center", field: "name", align: "left", headerFilter: false
                    });

                    temp.push({
                        title: "TotalAmount", formatterParams: { height: 50, width: 50 }, headerSort: false,
                        align: "center", field: "totalAmount", align: "left", headerFilter: false
                    });
                    temp.push({
                        title: "Has Existing Record", formatterParams: { height: 50, width: 50 }, headerSort: false,
                        align: "center", field: "isExistingRecords", align: "left", headerFilter: false
                    });
                    window["generate-form-table"].setColumns(temp);

                }, 100);

                $rootScope.$emit("ShowLoading");
                $timeout(function () {
                    mainService.GeneratingInvoice("GeneratingInvoice", $scope.generateInvoiceParam)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                $scope.generateInvoiceList = response.data;


                                window["generate-form-table"].setHeight("450px");
                                _.each($scope.generateInvoiceList.listOfRecords, function (item) {
                                    item.isExistingRecords = item.isExistingRecords == 0 ? "No" : "Yes";
                                });
                                if ($scope.generateInvoiceList.listOfRecords.length > 0) {
                                    var exists = _.findWhere($scope.generateInvoiceList.listOfRecords, {
                                        isExistingRecords: "Yes"
                                    });
                                    if (!DataService.isEmpty(exists)) {
                                        $scope.generateInvoiceParam.isExistingRecord = 0;
                                    }
                                    else {
                                        $scope.generateInvoiceParam.isExistingRecord = 1;
                                    }
                                } else {
                                    $scope.generateInvoiceParam.isExistingRecord = 3;
                                }

                                window["generate-form-table"].setData($scope.generateInvoiceList.listOfRecords);
                            }
                            $rootScope.$emit("HideLoading");
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }, 450);

            } else {
                notifierService.notifyMessage('error', 'Payment Date', 'Payment Period Should be selected.');
            }
        };
        $scope.generatePrintInvoiceFunc = function (type) {
            $scope.generateInvoiceData = [];
            $scope.generateInvoiceDataCourseList = [];
            $scope.printType = type;
            var tempId = "";
            if ($scope.allFormsList.length > 0) {
                var exists = _.filter($scope.allFormsList, function (item) {
                    return (!DataService.isEmpty(item.formTag) ? item.formTag.toLowerCase().contains("student") : false);
                });
                if (exists.length > 0) {
                    var param = {};
                    param.formId = exists[0].formId;
                    var existsFieldname = _.findWhere($scope.formAllDatafields, { Referral_Forms: param.formId.toString() });
                    if (!DataService.isEmpty(existsFieldname)) {
                        param.fieldName = existsFieldname.Referral_Form_Fields;
                        $scope.otherFormFieldName = existsFieldname.name;
                        $scope.otherreferrenceFormId = existsFieldname.Referral_Forms;
                        $scope.primaryFormId = exists[0].formId;
                        tempId = $scope.otherFormFieldName + "_Id";
                    }
                }
            }
            if (type == 1) {
                var existsData = {};
                //if ($scope.generateInvoiceParam.studentlist.length>0){
                //  var selectedId = $scope.generateInvoiceParam.studentlist[0];
                //var tempTabulator = tabulator.getData();
                //if (tempTabulator.length > 0) {
                // _.each(tempTabulator, function (item) {
                // if (!DataService.isEmpty(item[tempId])) {
                //  if (selectedId == item[tempId]) {
                //  $scope.generateInvoiceParam.studentId = item[tempId];
                // existsData = item;
                //  }
                // }
                // });
                $timeout(function () {
                    //$ngBootbox.customDialog({
                    //    templateUrl: 'printInvoice.html',
                    //    scope: $scope,
                    //    title: 'Invoice',
                    //    className: 'modal2Xlarge',
                    //    size: "large"
                    //});

                    //$scope.generateInvoiceParam = {};
                    if (DataService.isEmpty($scope.generateInvoiceParam))
                        $scope.generateInvoiceParam = {};
                    $scope.generateInvoiceParam.action = 5;
                    $scope.generateInvoiceParam.list = [];


                    $scope.generateInvoiceParam.paymentPeriod1 = $scope.generateInvoiceParam.paymentMonth + "-" + $scope.generateInvoiceParam.paymentYear;
                    $scope.generateInvoiceParam.paymentPeriod = $scope.generateInvoiceParam.paymentMonth + "-01-" + $scope.generateInvoiceParam.paymentYear;

                    if ($scope.generateInvoiceParam.paymentPeriod.length == 10) {
                        $scope.generateInvoiceParam.studentlist = [];
                        if (!DataService.isEmpty($scope.generateInvoiceParam.startStudentId) && !DataService.isEmpty($scope.generateInvoiceParam.endStudentId))
                            for (var i = $scope.generateInvoiceParam.startStudentId; i <= $scope.generateInvoiceParam.endStudentId; i++) {
                                $scope.generateInvoiceParam.studentlist.push(i);
                            }
                    }
                    $scope.generateInvoiceParam.list = JSON.stringify(angular.copy($scope.generateInvoiceParam.studentlist));
                    $scope.generateInvoiceParam.paymentPeriodList = [];
                    $scope.generateInvoiceParam.paymentPeriodList.push($scope.generateInvoiceParam.paymentPeriod);
                    $scope.generateInvoiceParam.paymentPeriodList = JSON.stringify($scope.generateInvoiceParam.paymentPeriodList);
                    //$scope.generateInvoiceParam.paymentPeriodCustom = convertDateString(existsData.created_at);
                    //$scope.generateInvoiceParam.paymentPeriod = convertDateString(existsData.created_at);
                    //$scope.generateInvoiceParam.studentId = existsData[$scope.otherFormFieldName + "_Id"];

                    //$scope.generateInvoiceParam.studentName = existsData[$scope.otherFormFieldName];
                    //var controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_noticedate")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.noticeDate = moment(controlExists[0]).format("DD-MM-YYYY");
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_paymentnumber")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.paymentNumber = controlExists[0];
                    //}

                    // controlExists = _.filter(exists, function (item, key) {
                    //     return key.contains("_total_amount")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.noticeDate = controlExists[0];
                    //}

                    //$scope.generateInvoiceParam.list.push($scope.generateInvoiceParam.studentId);
                    //$scope.generateInvoiceParam.list = JSON.stringify($scope.generateInvoiceParam.list);

                    $scope.generateInvoiceParam.formId = $scope.formDetailsDataInfo.formId;
                    CookiesPersistenceService.setCookieData("generateInvoiceParam", JSON.stringify($scope.generateInvoiceParam));
                    $state.go("printInvoice", { studentId: 0, type: 0 });
                    //$rootScope.$emit("ShowLoading");
                    //mainService.GeneratingInvoice("GeneratingInvoice", $scope.generateInvoiceParam)
                    //    .then(function (response) {
                    //        if (response.data != null && angular.isDefined(response.data)) {
                    //            $scope.generateInvoiceData = response.data;
                    //            $scope.generateInvoiceDataCourseList = angular.copy($scope.generateInvoiceData.listOfRecords);
                    //            $scope.generateInvoiceDataCourseList = _.groupBy($scope.generateInvoiceDataCourseList, "courseName");

                    //            $scope.generateInvoiceDataCourseListSubTotal = [];
                    //            $scope.generateInvoiceParam.totalAmount = 0;
                    //            _.each($scope.generateInvoiceDataCourseList, function (itemData, key) {
                    //                var subTotal = 0;
                    //                _.each(itemData, function (item, keyItem) {
                    //                    subTotal += !DataService.isEmpty(item.fees_1) ? parseInt(item.fees_1) : item.fees_1;
                    //                    item.startDate = DateWithDayName(item.start, false);
                    //                    item.startTime = TimeFormatCalender(item.start, false);
                    //                });
                    //                $scope.generateInvoiceParam.totalAmount += subTotal;
                    //                $scope.generateInvoiceDataCourseListSubTotal.push(subTotal);
                    //            });


                    //        }
                    //        $rootScope.$emit("HideLoading");
                    //    }, function (err) {
                    //        $rootScope.$emit("HideLoading");
                    //        console.log("some error occured." + err);
                    //    });

                }, 100);
                //}

                //else {
                //    // notifierService.notifyMessage('error', 'Student', 'Please select atleast one record.');
                //}

            }
            else {
                //$scope.generateInvoiceParam.studentlist
                if (window["formGroupKeyList"].length > 0) {
                    if (window["formGroupKeyList"].length > 0) {
                        $scope.generateInvoiceParam = {};
                        $scope.generateInvoiceParam.yearList = [];
                        $scope.generateInvoiceParam.yearList = getAllYear();
                        $scope.generateInvoiceParam.yearList = _.sortBy($scope.generateInvoiceParam.yearList, function (num) {
                            return num;
                        }).reverse();
                        $scope.submitPeriodForPrint();
                        //$ngBootbox.customDialog({
                        //    templateUrl: 'printInvoicePeriod.html',
                        //    scope: $scope,
                        //    title: 'Invoice',

                        //    size: "large"
                        //});

                    } else {
                        notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
                    }
                } else {
                    notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
                }
            }
        };
        $scope.generatePrintReciptFunc = function (type) {
            var tempId = "";
            $scope.printType = type;
            if ($scope.allFormsList.length > 0) {
                var exists = _.filter($scope.allFormsList, function (item) {
                    return (!DataService.isEmpty(item.formTag) ? item.formTag.toLowerCase().contains("student") : false);
                });
                if (exists.length > 0) {
                    var param = {};
                    param.formId = exists[0].formId;
                    var existsFieldname = _.findWhere($scope.formAllDatafields, { Referral_Forms: param.formId.toString() });
                    if (!DataService.isEmpty(existsFieldname)) {
                        param.fieldName = existsFieldname.Referral_Form_Fields;
                        $scope.otherreferrenceFormId = existsFieldname.Referral_Forms;
                        $scope.primaryFormId = exists[0].formId;
                        /* $scope.generateInvoiceParam.primaryFormId = exists[0].formId;*/
                        $scope.otherFormFieldName = existsFieldname.name;
                        tempId = $scope.otherFormFieldName + "_Id";
                    }
                }
            }
            if (type == 1) {
                var existsData = {};
                // if (!DataService.isEmpty($scope.generateInvoiceParam.studentlist)){
                // if ($scope.generateInvoiceParam.studentlist.length > 0) {
                //var selectedId = $scope.generateInvoiceParam.studentlist[0];
                //var tempTabulator = tabulator.getData();
                // if (tempTabulator.length > 0) {
                //   _.each(tempTabulator, function (item) {                           
                // if (!DataService.isEmpty(item[tempId]))
                // {                               
                //  if (selectedId == item[tempId]) {
                // $scope.generateInvoiceParam.studentId = item[tempId];
                // existsData = item;
                //}                              
                //}                           
                ///});
                $timeout(function () {
                    //$ngBootbox.customDialog({
                    //    templateUrl: 'printInvoice.html',
                    //    scope: $scope,
                    //    title: 'Invoice',
                    //    className: 'modal2Xlarge',
                    //    size: "large"
                    //});

                    // $scope.generateInvoiceParam = {};
                    if (DataService.isEmpty($scope.generateInvoiceParam))
                        $scope.generateInvoiceParam = {};
                    $scope.generateInvoiceParam.action = 5;
                    $scope.generateInvoiceParam.list = [];

                    $scope.generateInvoiceParam.paymentPeriod1 = $scope.generateInvoiceParam.paymentMonth + "-" + $scope.generateInvoiceParam.paymentYear;
                    $scope.generateInvoiceParam.paymentPeriod = $scope.generateInvoiceParam.paymentMonth + "-01-" + $scope.generateInvoiceParam.paymentYear;

                    if ($scope.generateInvoiceParam.paymentPeriod.length == 10) {
                        $scope.generateInvoiceParam.studentlist = [];
                        if (!DataService.isEmpty($scope.generateInvoiceParam.startStudentId) && !DataService.isEmpty($scope.generateInvoiceParam.endStudentId))
                            for (var i = $scope.generateInvoiceParam.startStudentId; i <= $scope.generateInvoiceParam.endStudentId; i++) {
                                $scope.generateInvoiceParam.studentlist.push(i);
                            }
                    }
                    $scope.generateInvoiceParam.list = JSON.stringify(angular.copy($scope.generateInvoiceParam.studentlist));
                    $scope.generateInvoiceParam.paymentPeriodList = [];
                    $scope.generateInvoiceParam.paymentPeriodList.push($scope.generateInvoiceParam.paymentPeriod);
                    $scope.generateInvoiceParam.paymentPeriodList = JSON.stringify($scope.generateInvoiceParam.paymentPeriodList);
                    //$scope.generateInvoiceParam.paymentPeriodCustom = convertDateString(existsData.created_at);
                    //$scope.generateInvoiceParam.paymentPeriod = convertDateString(existsData.created_at);
                    //$scope.generateInvoiceParam.studentId = existsData[$scope.otherFormFieldName + "_Id"];

                    //$scope.generateInvoiceParam.studentName = existsData[$scope.otherFormFieldName];
                    //var controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_noticedate")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.noticeDate = moment(controlExists[0]).format("DD-MM-YYYY");
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_paymentnumber")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.paymentNumber = controlExists[0];
                    //}                         

                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_adjustmentamount")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.adjustmentAmount = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_netamount")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.netamount = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_actualReceived")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.actualReceived = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_balance")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.balance = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_paymentdetailstable")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.paymentMethodList=[];
                    //    var tempTable={};
                    //    $scope.generateInvoiceParam.paymentList=[];
                    //    $scope.generateInvoiceParam.paymentList.push("By Paypal");
                    //    $scope.generateInvoiceParam.paymentList.push("By Cash");
                    //    $scope.generateInvoiceParam.paymentList.push("By Cheque");
                    //    $scope.generateInvoiceParam.paymentList.push("By Bank");
                    //    var tableData = controlExists[0];
                    //    if (!DataService.isEmpty(tableData)) {

                    //    }
                    //    //$scope.generateInvoiceParam.paymentMethod = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_staff")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.staff = controlExists[0];
                    //}
                    //controlExists = _.filter(existsData, function (item, key) {
                    //    return key.contains("_remarks")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.remarks = controlExists[0];
                    //}

                    // $scope.generateInvoiceParam.differenceAmount = $scope.generateInvoiceParam.totalAmount = $scope.generateInvoiceParam.totalAmount;

                    // $scope.generateInvoiceParam.list.push($scope.generateInvoiceParam.studentId);
                    //$scope.generateInvoiceParam.list = JSON.stringify($scope.generateInvoiceParam.list);
                    var exists = _.filter($scope.formAllDatafields,
                        function (item) { return item.name.contains("_paymentdetailstable") });
                    if (exists.length > 0) {
                        //var temp = filterReadableTableData(tableData, exists[0].name);
                        var tableDetails = exists[0];
                        CookiesPersistenceService.setCookieData("_paymentdetailstable", JSON.stringify(tableDetails));
                    }
                    $scope.generateInvoiceParam.formId = $scope.formDetailsDataInfo.formId;
                    CookiesPersistenceService.setCookieData("generateInvoiceParam", JSON.stringify($scope.generateInvoiceParam));
                    $state.go("printInvoice", { studentId: 0, type: 1 });
                    //$rootScope.$emit("ShowLoading");
                    //mainService.GeneratingInvoice("GeneratingInvoice", $scope.generateInvoiceParam)
                    //    .then(function (response) {
                    //        if (response.data != null && angular.isDefined(response.data)) {
                    //            $scope.generateInvoiceData = response.data;
                    //            $scope.generateInvoiceDataCourseList = angular.copy($scope.generateInvoiceData.listOfRecords);
                    //            $scope.generateInvoiceDataCourseList = _.groupBy($scope.generateInvoiceDataCourseList, "courseName");

                    //            $scope.generateInvoiceDataCourseListSubTotal = [];
                    //            $scope.generateInvoiceParam.totalAmount = 0;
                    //            _.each($scope.generateInvoiceDataCourseList, function (itemData, key) {
                    //                var subTotal = 0;
                    //                _.each(itemData, function (item, keyItem) {
                    //                    subTotal += !DataService.isEmpty(item.fees_1) ? parseInt(item.fees_1) : item.fees_1;
                    //                    item.startDate = DateWithDayName(item.start, false);
                    //                    item.startTime = TimeFormatCalender(item.start, false);
                    //                });
                    //                $scope.generateInvoiceParam.totalAmount += subTotal;
                    //                $scope.generateInvoiceDataCourseListSubTotal.push(subTotal);
                    //            });


                    //        }
                    //        $rootScope.$emit("HideLoading");
                    //    }, function (err) {
                    //        $rootScope.$emit("HideLoading");
                    //        console.log("some error occured." + err);
                    //    });

                }, 100);
                // }
                //}
                //else {
                //    notifierService.notifyMessage('error', 'Student', 'Please select atleast one record.');
                //}
                //} else {
                //    notifierService.notifyMessage('error', 'Student', 'Please select atleast one record.');
                //}
            }
            else {

                //generateInvoiceParam.studentlist
                if (window["formGroupKeyList"].length > 0) {
                    if (window["formGroupKeyList"].length > 0) {
                        $timeout(function () {
                            $scope.generateInvoiceParam = {};
                            $scope.generateInvoiceParam.yearList = [];
                            $scope.generateInvoiceParam.yearList = getAllYear();
                            $scope.generateInvoiceParam.yearList = _.sortBy($scope.generateInvoiceParam.yearList, function (num) {
                                return num;
                            }).reverse();
                            $scope.submitPeriodForPrint();
                            //$ngBootbox.customDialog({
                            //    templateUrl: 'printInvoicePeriod.html',
                            //    scope: $scope,
                            //    title: 'Receipt',                              
                            //    size: "large"
                            //});

                            //$scope.generateInvoiceParam = {};

                        }, 100);

                    } else {
                        notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
                    }

                }
                else {
                    notifierService.notifyMessage('error', 'Form Records', 'Please select atleast one record.');
                }
            }
        };
        $scope.submitPeriodForPrint = function () {
            if ($scope.printType == 2) {
                $timeout(function () {

                    if (DataService.isEmpty($scope.generateInvoiceParam))
                        $scope.generateInvoiceParam = {};
                    $scope.generateInvoiceParam.action = 5;
                    $scope.generateInvoiceParam.list = [];
                    $scope.generateInvoiceParam.paymentPeriod1 = $scope.generateInvoiceParam.paymentMonth + "-" + $scope.generateInvoiceParam.paymentYear;
                    $scope.generateInvoiceParam.paymentPeriod = $scope.generateInvoiceParam.paymentMonth + "-01-" + $scope.generateInvoiceParam.paymentYear;

                    $scope.generateInvoiceParam.otherreferrenceFormId = $scope.otherreferrenceFormId;
                    $scope.generateInvoiceParam.primaryFormId = $scope.primaryFormId;

                    $scope.generateInvoiceParam.paymentPeriodList = [];
                    _.each($scope.selectedDeletedRecordList, function (item) {
                        var studentId = item[$scope.otherFormFieldName + "_Id"];
                        var existsID = _.find($scope.generateInvoiceParam.list
                            , function (dataItem) {
                                return dataItem == studentId;
                            });


                        if (DataService.isEmpty(existsID))
                            $scope.generateInvoiceParam.list.push(studentId);
                        var controlExists = _.filter(item, function (item, key) {
                            return key.contains("_paymentPeriod")
                        });
                        if (controlExists.length > 0) {
                            var existsPeriod = _.find($scope.generateInvoiceParam.paymentPeriodList
                                , function (dataItem) {
                                    return dataItem == controlExists[0];
                                });
                            if (DataService.isEmpty(existsPeriod))
                                $scope.generateInvoiceParam.paymentPeriodList.push(controlExists[0]);
                        }

                    });
                    $scope.generateInvoiceParam.paymentPeriodList = JSON.stringify($scope.generateInvoiceParam.paymentPeriodList);
                    //$scope.generateInvoiceParam.paymentPeriodCustom = convertDateString(exists.created_at);
                    //$scope.generateInvoiceParam.paymentPeriod = convertDateString(exists.created_at);
                    //$scope.generateInvoiceParam.studentId = exists[$scope.otherFormFieldName + "_Id"];

                    //$scope.generateInvoiceParam.studentName = exists[$scope.otherFormFieldName];

                    //var controlExists = _.filter(exists, function (item, key) {
                    //    return key.contains("_noticedate")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.noticeDate = moment(controlExists[0]).format("DD-MM-YYYY");
                    //}
                    //controlExists = _.filter(exists, function (item, key) {
                    //    return key.contains("_paymentnumber")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.paymentNumber = controlExists[0];
                    //}

                    // controlExists = _.filter(exists, function (item, key) {
                    //     return key.contains("_total_amount")
                    //});
                    //if (controlExists.length > 0) {
                    //    $scope.generateInvoiceParam.noticeDate = controlExists[0];
                    //}

                    //$scope.generateInvoiceParam.list.push($scope.generateInvoiceParam.studentId);
                    $scope.generateInvoiceParam.list = JSON.stringify($scope.generateInvoiceParam.list);

                    $scope.generateInvoiceParam.formId = $scope.formDetailsDataInfo.formId;
                    CookiesPersistenceService.setCookieData("generateInvoiceParam", JSON.stringify($scope.generateInvoiceParam));
                    $state.go("printInvoice", { studentId: 0, type: 0 });


                }, 100);
            }
            else if ($scope.printType == 3) {

                if (DataService.isEmpty($scope.generateInvoiceParam))
                    $scope.generateInvoiceParam = {};
                $scope.generateInvoiceParam.action = 5;
                $scope.generateInvoiceParam.list = [];
                //var exists = $scope.selectedDeletedRecordList[0];

                $scope.generateInvoiceParam.otherreferrenceFormId = $scope.otherreferrenceFormId;
                $scope.generateInvoiceParam.primaryFormId = $scope.primaryFormId;

                //$scope.generateInvoiceParam.paymentPeriodCustom = convertDateString(exists.created_at);
                //$scope.generateInvoiceParam.paymentPeriod = convertDateString(exists.created_at);
                $scope.generateInvoiceParam.paymentPeriod1 = $scope.generateInvoiceParam.paymentMonth + "-" + $scope.generateInvoiceParam.paymentYear;
                $scope.generateInvoiceParam.paymentPeriod = $scope.generateInvoiceParam.paymentMonth + "-01-" + $scope.generateInvoiceParam.paymentYear;

                //$scope.generateInvoiceParam.studentId = exists[$scope.otherFormFieldName + "_Id"];

                //$scope.generateInvoiceParam.studentName = exists[$scope.otherFormFieldName];
                //var controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_noticedate")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.noticeDate = moment(controlExists[0]).format("DD-MM-YYYY");
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_paymentnumber")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.paymentNumber = controlExists[0];
                //}

                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_adjustmentamount")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.adjustmentAmount = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_netamount")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.netamount = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_actualReceived")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.actualReceived = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_balance")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.balance = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //     return key.contains("_paymentdetailstable")
                // });
                // if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.paymentMethodList = [];
                //    var tempTable = {};
                //    $scope.generateInvoiceParam.paymentList = [];
                //    $scope.generateInvoiceParam.paymentList.push("By Paypal");
                //    $scope.generateInvoiceParam.paymentList.push("By Cash");
                //    $scope.generateInvoiceParam.paymentList.push("By Cheque");
                //    $scope.generateInvoiceParam.paymentList.push("By Bank");
                //   var tableData = controlExists[0];
                //  if (!DataService.isEmpty(tableData)) {
                //     tableData = tableData.replace(/'/g, " ");
                //   tableData = tableData.replace(/"/g, " ");
                var exists = _.filter($scope.formAllDatafields,
                    function (item) { return item.name.contains("_paymentdetailstable") });
                if (exists.length > 0) {
                    //var temp = filterReadableTableData(tableData, exists[0].name);
                    var tableDetails = exists[0];
                    CookiesPersistenceService.setCookieData("_paymentdetailstable", JSON.stringify(tableDetails));
                }

                // }
                //    // $scope.generateInvoiceParam.paymentMethod = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_staff")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.staff = controlExists[0];
                //}
                //controlExists = _.filter(exists, function (item, key) {
                //    return key.contains("_remarks")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.remarks = controlExists[0];
                //}
                // controlExists = _.filter(exists, function (item, key) {
                //     return key.contains("_total_amount")
                //});
                //if (controlExists.length > 0) {
                //    $scope.generateInvoiceParam.noticeDate = controlExists[0];
                //}
                $scope.generateInvoiceParam.paymentPeriodList = [];
                $scope.generateInvoiceParam.differenceAmount = $scope.generateInvoiceParam.totalAmount = $scope.generateInvoiceParam.totalAmount;
                _.each($scope.selectedDeletedRecordList, function (item) {
                    var studentId = item[$scope.otherFormFieldName + "_Id"];
                    $scope.generateInvoiceParam.list.push(studentId);
                    var controlExists = _.filter(item, function (item, key) {
                        return key.contains("_paymentPeriod")
                    });
                    if (controlExists.length > 0) {
                        $scope.generateInvoiceParam.paymentPeriodList.push(controlExists[0]);
                    }
                });
                $scope.generateInvoiceParam.paymentPeriodList = JSON.stringify($scope.generateInvoiceParam.paymentPeriodList);
                //$scope.generateInvoiceParam.list.push($scope.generateInvoiceParam.studentId);
                $scope.generateInvoiceParam.list = JSON.stringify($scope.generateInvoiceParam.list);

                $scope.generateInvoiceParam.formId = $scope.formDetailsDataInfo.formId;
                CookiesPersistenceService.setCookieData("generateInvoiceParam", JSON.stringify($scope.generateInvoiceParam));
                $state.go("printInvoice", { studentId: 0, type: 1 });
            }



        };
        $scope.HTMLclick = function () {
            var data = document.getElementById('printInvoiceHtml');

            html2canvas(data).then(canvas => {
                // Few necessary setting options  
                var imgWidth = 208;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;




                const contentDataURL = canvas.toDataURL('image/png')
                let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
                var position = 0;
                pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight;
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save('MYPdf.pdf'); // Generated PDF   
            });
            //var pdf = new jsPDF('p', 'mm', 'a4');  
            //pdf.addHTML(data, 0, 0,  { pagesplit: true }, function () {
            //    pdf.save('myfilename' + '.pdf');
            //});

        };
        var tabulator = {};
        function showFooter(type) {

            if (!DataService.isEmpty(type.column_calculation))
                return type.column_calculation;
            else
                return "";
        }
        var customHeaderFilter = function (rowValue, rowData) {
            //headerValue - the value of the header filter element
            //rowValue - the value of the column in this row
            //rowData - the data for the row being filtered
            //filterParams - params object passed to the headerFilterFuncParams property

            return "<select><option>Yes</option><option>No</option></select>"; //must return a boolean, true if it passes the filter.
        }
        var checkValidity = function (param) {
            mainService.checkEditDeleteValidity("checkEditDeleteValidity", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {

                        return response.data.data
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                    var res = -1;
                    return res;
                });
        }
        var radioEditor = function (cell, onRendered, success) {
            var role = cell.getRow().getData();
            var dropdown = "<select id='radioGroup'>"
            var options = "<option value='0' id='val_'></option>"
            angular.forEach($scope.optionValues, function (item) {
                options = options + `<option value='${item.value}' id='val_${item.value}'>${item.label}</option>`;

            });
            var editor3 = $(dropdown + options + "</select>");
            editor3.css({ "padding": "6px", "width": "100%", "box-sizing": "border-box" });
            editor3.val((cell.getValue()) ? cell.getValue().trim() : '');
            onRendered(function () { editor3.focus(); });
            editor3.on("change blur", function (e) {
                $scope.dllGroup = $('#radioGroup option:selected').attr('id');
                success(editor3.val());
            });
            return editor3[0];

        };
        var selectEditor = function (cell, onRendered, success) {
            var dropdown = "<select id='selectGroup'>"
            var options = "<option value='0' id='valS_'></option>"
            angular.forEach($scope.optionValuesSelect, function (item) {

                options = options + `<option value='${item.value}' id='valS_${item.value}'>${item.label}</option>`;

            });
            var editorSelect = $(dropdown + options + "</select>");
            editorSelect.css({ "padding": "6px", "width": "100%", "box-sizing": "border-box" });
            editorSelect.val((cell.getValue()) ? cell.getValue().trim() : '');
            onRendered(function () { editorSelect.focus(); });
            editorSelect.on("change blur", function (e) {
                $scope.dllGroup = $('#selectGroup option:selected').attr('id');
                success(editorSelect.val());
            });
            return editorSelect[0];

        };
        var renderHtml = function (cell, formatterParams) {
            var exists;
            _.each($scope.formDatafields, function (page, key) {
                exists = _.findWhere(page, { name: cell.getColumn().getField() });
            });
            cellFormatterBackgroundColor(cell);
            var data = cell.getValue();
            //console.log(data, jQuery(data).text(), 'tinymce');
            if (!DataService.isEmpty(exists)) {
                if (data == null || data == "" || (typeof data === 'undefined')) {
                    return '';
                }
                else {
                    let tmp = document.createElement("DIV");
                    tmp.innerHTML = data;
                    return !DataService.isEmpty(data) ? jQuery(data).text() : ""

                }
                return !DataService.isEmpty(data) ? jQuery(data).text() : "";
            } else {
                return !DataService.isEmpty(data) ? jQuery(data).text() : "";
            }
        };
        function bindTColumnHeader(formDetails, isExpend, isEdit) {            
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

            var checkboxFormatter = function (cell, formatterParams, onRendered) { //plain text value
                cellFormatterBackgroundColor(cell)
                var t_data = cell.getRow().getData();
                if (t_data[$scope.c_field] == "1" || t_data[$scope.c_field] == "true" || t_data[$scope.c_field] == true) {
                    return "Yes";
                }
                else if (t_data[$scope.c_field] == "0" || t_data[$scope.c_field] == "flase" || t_data[$scope.c_field] == false) {
                    return "No";
                }
                else if (t_data[$scope.c_field] == null) {
                    return "No";
                }
                else {
                    return "" + t_data[$scope.c_field] + "";
                }
            };
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {
                    // 
                    var translateLabel = "";
                    if (!DataService.isEmpty(item.label))
                        translateLabel = getStringFromMultiligualText(item.label, langId);
                    var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                    var subtype = _.find(item, function (itemitem, keykey) { return keykey == "subtype" });
                    var types = _.find(item, function (itemitem, keykey) { return keykey == "types" });
                    var Inline_Edit = false;
                    //item.label = item.name;
                    //if (type == "checkbox-group") {
                    //    console.log("checkbox-group");
                    //    finalArray.push({ title: translateLabel, width: 140, titleDownload: translateLabel, formatter: "tickcross", field: item.name, headerFilter: "input", columnType: customColumnTypeFunc(item, type) });
                    //}
                    Inline_Edit = (!DataService.isEmpty(item.Inline_Edit) && item.Inline_Edit == "Yes") ? (type == "text" ? "input" : type) : Inline_Edit;
                    if (item.name != "activities" && item.name != "resources") {
                        if (item.List_column1 == "Yes")
                            if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                                || type == "autocomplete" || type == "select" || type == "checkbox-group" || type == "signature" || type == "tinyMCE-content") {
                                if (type == "file") {
                                    if (type == "file" && item.multiple == true) {
                                        finalArray.push({
                                            title: translateLabel, width: 140, formatter: multilFiles, headerSort: false, columnType: customColumnTypeFunc(item, type), titleDownload: translateLabel, field: item.name, type: type, cellClick: function (e, cell) {
                                                var fileValue = cell.getValue().replace('~', '');
                                                getAllFiles1(cell.getValue(), cell.getField());
                                                //console.log('cell-clicked')
                                            }
                                        });
                                    }
                                    else {
                                        finalArray.push({
                                            title: translateLabel, width: 140, formatter: arrowImage, titleDownload: translateLabel, formatterParams: { height: 50, width: 50 }, headerSort: false, field: item.name, type: type, headerFilter: "input", columnType: customColumnTypeFunc(item, type)
                                        });
                                    }
                                }
                                else {
                                    if (type == "text" && subtype == "color") {
                                        if (DataService.isEmpty(item.Display_tab)) {
                                            $scope.filterFieldsList.push({ title: translateLabel, field: item.name, headerFilter: "input" });
                                            finalArray.push({
                                                title: translateLabel, width: 140, titleDownload: translateLabel, formatter: 'color', bottomCalc: showFooter(item), field: item.name, type: type, columnType: customColumnTypeFunc(item, type), editor: Inline_Edit, cellEdited: function (cell) {
                                                    alert("cell" + cell)
                                                }
                                            });
                                        }
                                        else {
                                            $scope.displayInTabData = item;
                                        }
                                    }

                                    else if (type == "checkbox-group") {
                                        $scope.CB_Edit = (!DataService.isEmpty(item.Inline_Edit));
                                        $scope.CB_toggle = item.toggle;
                                        finalArray.push({
                                            title: translateLabel, columnType: "text", align: "center", field: item.name, type: "Text", align: "left", formatter: arrowDataFormat, headerFilter: "input", editor: Inline_Edit, cellEdited: function (cell) { alert("cell" + cell) }
                                        });
                                    }


                                    //else if (type == "checkbox-group") {
                                    //    $scope.CB_Edit = (!DataService.isEmpty(item.Inline_Edit));
                                    //    $scope.CB_toggle = item.toggle;
                                    //    finalArray.push({
                                    //        title: translateLabel, columnType: type, align: "center", field: item.name, type: type, align: "left", formatter: checkboxGroupFormatter, headerFilter: "select", headerFilterParams: { values: ['', 'Yes', 'No'] }, editor: CBEditor
                                    //    });
                                    //}


                                    else if (type == "radio-group") {
                                        //$scope.CB_Edit = (!DataService.isEmpty(item.Inline_Edit));
                                        //$scope.CB_toggle = item.toggle;

                                        if (DataService.isEmpty(item.Display_tab)) {
                                            if (!DataService.isEmpty(item.Inline_Edit)) {
                                                if (item.Inline_Edit == "Yes") {
                                                    finalArray.push({
                                                        title: translateLabel, columnType: type, align: "center", field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: "input", editor: radioEditor, bottomCalc: showFooter(item), headerFilterParams: { values: true }, cellEdited: function (cell) { console.log("cell" + cell) }
                                                    });



                                                }
                                                else {
                                                    finalArray.push({
                                                        title: translateLabel, columnType: type, align: "center", field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: "input", headerFilterParams: { values: true }
                                                    });


                                                }
                                            }
                                            else {
                                                finalArray.push({
                                                    title: translateLabel, columnType: type, align: "center", field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: "input", editor: Inline_Edit, cellEdited: function (cell) { alert("cell" + cell) }
                                                });


                                            }

                                        } else {
                                            $scope.displayInTabData = item;
                                        }



                                    }

                                    //else if (type == "radio-group") {
                                    //    //console.log(item,'item')
                                    //    $scope.optionValues = item.values;
                                    //    if (DataService.isEmpty(item.Display_tab)) {
                                    //        if (!DataService.isEmpty(item.Inline_Edit)) {
                                    //            if (item.Inline_Edit == "Yes") {
                                    //                finalArray.push({
                                    //                    title: translateLabel, columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", editor: radioEditor, bottomCalc: showFooter(item), headerFilterParams: { values: true }

                                    //                    , cellEdited: function (cell) {
                                    //                        //console.log("cell" + cell)
                                    //                    }
                                    //                });



                                    //            } else {
                                    //                finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                    //            }

                                    //        }
                                    //        else {
                                    //            finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                    //        }

                                    //    }
                                    //    else {

                                    //        $scope.displayInTabData = item;

                                    //    }
                                    //}
                                    else if (type == "select") {
                                        $scope.optionValuesSelect = item.values;                                       
                                        //const filterListvalues = [{ label: "Lucknow", value: "1" }, { label: "Banarash", value: "2" }, { label: "Alahabad", value: "3" }, { label: "Kanpur", value: "4" }, { label: "Mathura", value: "5" }, { label: "Ayodhya", value: "6" }, { label: "Gorakhpur", value: "7" }, { label: "Noida", value: "9" }, { label: "SaharanPur", value: "10" }];
                                        //const filterListvalues = [{ label: "Lucknow", value: "Lucknow" }, { label: "Banarash", value: "Banarash" }, { label: "Alahabad", value: "Alahabad" }, { label: "Kanpur", value: "Kanpur" }];


                                        var headerfilterType;
                                        if (item.Use_as_select2 == "Yes" || item.Use_as_tags == "Yes") {
                                            headerfilterType = "input";
                                        }
                                        else {
                                            headerfilterType = "input";
                                            //headerfilterType = "select";
                                        }
                                        if (DataService.isEmpty(item.Display_tab)) {
                                            if (!DataService.isEmpty(item.Inline_Edit)) {
                                                if (item.Inline_Edit == "Yes") {
                                                    finalArray.push({
                                                        title: translateLabel, columnType: type, field: item.name, align: "left", headerFilter: headerfilterType, formatter: arrowDataFormat, editor: selectEditor, bottomCalc: showFooter(item), headerFilterParams: { values: true }

                                                        , cellEdited: function (cell) {
                                                            console.log("cell" + cell)
                                                        }
                                                    });
                                                }
                                                else {
                                                    if ($scope.isTransactionForm || (item.Referral_Forms != "" && item.Referral_Forms != undefined)) {
                                                        finalArray.push({ title: translateLabel, formatter: arrowDataFormat, bottomCalc: showFooter(item), columnType: type, field: item.name, align: "left", headerFilter: "input" });
                                                    } else
                                                        finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, formatter: arrowDataFormat, field: item.name, align: "left", headerFilter: headerfilterType, headerFilterParams: { values: true } });
                                                }
                                            }
                                            else {
                                                if ($scope.isTransactionForm || (item.Referral_Forms != "" && item.Referral_Forms != undefined)) {
                                                    finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "input" });
                                                } else
                                                    finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: headerfilterType, headerFilterParams: { values: true } });
                                            }
                                        }
                                        else {
                                            $scope.displayInTabData = item;
                                        }
                                    }
                                    else if (type == "signature") {
                                        finalArray.push({ title: translateLabel, width: 140, titleDownload: translateLabel, formatter: arrowImage, field: item.name, type: type, headerFilter: "input", columnType: customColumnTypeFunc(item, type) });
                                    }
                                    else if (type == "textarea" && subtype == "tinymce") {
                                        finalArray.push({
                                            title: translateLabel, width: 140, titleDownload: translateLabel, formatter: "html", field: item.name, type: type, headerFilter: "input", columnType: customColumnTypeFunc(item, type)
                                        });
                                    }
                                    else if (type == "date" && types == "date_picker") {
                                        finalArray.push({
                                            title: translateLabel, titleDownload: translateLabel, width: 140, formatter: datetimeFormatter, field: item.name, type: type, headerFilter: "input", columnType: customColumnTypeFunc(item, type), editor: Inline_Edit, cellEdited: function (cell) {
                                                alert("cell" + cell)
                                            }
                                        });
                                    }
                                    else if (type == "date" && types == "datetime_picker") {
                                        finalArray.push({
                                            title: translateLabel, titleDownload: translateLabel, formatter: datetimeFormatterTime, width: 140, field: item.name, type: type, headerFilter: "input", columnType: customColumnTypeFunc(item, type), editor: Inline_Edit, cellEdited: function (cell) {
                                                alert("cell" + cell)
                                            }
                                        });
                                    }
                                    else if (type == "number") {
                                        //console.log(item, "gg");
                                        if (DataService.isEmpty(item.Display_tab)) {
                                            $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, width: 140, headerFilter: "input" });
                                            if (item.column_format == "progress") {
                                                //item.progress_color
                                                finalArray.push({
                                                    title: translateLabel, formatter: "progress", formatterParams: { color: [item.progress_color] }, titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else if (item.column_format == "tick") {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "tick", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else if (item.column_format == "money") {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "money", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else if (item.column_format == "tickCross") {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "tickCross", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else if (item.column_format == "star") {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "star", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else if (item.column_format == "plaintext") {
                                                console.log(item.number_decimal, "Decimal");

                                                if (item.number_decimal != undefined && item.number_decimal > 0) {
                                                    finalArray.push({
                                                        title: translateLabel, formatter: "text", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                    });
                                                }
                                                else {
                                                    finalArray.push({
                                                        title: translateLabel, formatter: "text", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                    });
                                                }
                                            }


                                            else {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "number", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, type: type, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                        }
                                        else {
                                            $scope.displayInTabData = item;
                                        }


                                    }
                                    else {
                                        if (DataService.isEmpty(item.Display_tab)) {
                                            $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, width: 140, headerFilter: "input" });
                                            finalArray.push({
                                                title: translateLabel, formatter: arrowDataFormat, titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, type: type, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else {
                                            $scope.displayInTabData = item;
                                        }
                                    }
                                }
                            }
                    }

                });

                isTabulator = _.findWhere(pageData, { type: "tabulator" });
            });

            if ($scope.formDetailsDataInfo.currentFormType == 1) {
                var temp = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                    return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                });
                for (var i = 0; i < temp.length; i++) {
                    var existsField = _.findWhere(finalArray, { field: "referrences_" + temp[i].resourceForm });
                    if (DataService.isEmpty(existsField)) {
                        finalArray.unshift({
                            title: " " + temp[i].formTitle + " ", formatter: arrowDataFormat,
                            width: 200,
                            field: "referrences_" + temp[i].resourceForm, headerFilter: "input",
                            editor: false, headerSort: false, headerFilter: true
                        });
                    }
                }
            }
            else {
                if (!DataService.isEmpty($scope.formDetailsDataInfo.calenderSettingsList))
                    if ($scope.formDetailsDataInfo.calenderSettingsList.length > 0) {
                        var temp = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                            return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                        });
                        for (var i = 0; i < temp.length; i++) {
                            var existsField = _.findWhere(finalArray, { field: "referrences_" + temp[i].resourceForm });
                            if (DataService.isEmpty(existsField)) {
                                finalArray.unshift({
                                    title: " " + temp[i].formTitle + " ", formatter: arrowDataFormat,
                                    width: 200,
                                    field: "referrences_" + temp[i].resourceForm, headerFilter: "input",
                                    editor: false, headerSort: false, headerFilter: true
                                });
                            }
                        }
                    }
            }

            finalArray.push({ title: "formId", visible: false, field: "formId" });
            finalArray.push({ title: "Id", visible: false, field: "Id" });
            finalArray.push({ title: "formGroupKey", visible: false });
            if ($scope.approvalbtns != undefined && $scope.approvalbtns.length > 0) {
                finalArray.push({
                    title: "Approval Status", field: "ApprovalStatus", width: 250, headerSort: true, sorter: "string", formatter: 'textarea', headerFilter: "input",
                    sorterParams: { alignEmptyValues: "bottom" }, rowHandle: true,
                });
            }



            // if ($scope.PPControl==true)
            //{
            //    finalArray.push({
            //        title: "Approval Status", field: "ApprovalStatus", width: 250, headerSort: true, sorter: "string", formatter: 'textarea', headerFilter: "input",
            //        sorterParams: { alignEmptyValues: "bottom" }, rowHandle: true,
            //    });
            //}
            if ($scope.PPControl == true) {
                finalArray.push({

                    title: "Payment Status", field: "PaymentStatus", width: 250, headerSort: true, sorter: "string", formatter: 'textarea', headerFilter: "input",
                    sorterParams: { alignEmptyValues: "bottom" }, rowHandle: true,
                });
            }

            if (isEdit) {

                if (!$scope.isTransactionForm) {
                    finalArray.unshift({
                        title: getStringFromMultiligualText("Edit|編輯|编辑", langId), download: false, rowEdit: true, align: "center", formatter: arrowEdit, width: 60, headerSort: false,

                        cellClick: function (e, cell) {
                            $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id, cell.getRow().getData());
                        }
                    });
                }

                finalArray.unshift({
                    title: getStringFromMultiligualText("Move Row|移動行|移动行", langId), download: false, rowHandle: true, formatter: "handle", headerSort: false, width: 70
                });

            }
            if (isExpend && !DataService.isEmpty(isTabulator))
                finalArray.unshift({
                    title: " ", download: false, field: "subItems", formatter: arrowIcon, width: 35, headerSort: false, cellClick: function (e, cell) {
                        var formGroupKey = cell.getRow().getData().formGroupKey;
                        var Id = cell.getRow().getData().Id;

                        if ($(cell.getElement()).is('.active')) {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                            $(cell.getElement()).removeClass('active');
                        } else {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                            $(cell.getElement()).addClass('active');

                            //var table = tabulatorChildren[formGroupKey];
                            //table.setData([]);
                        }
                        $scope.tabulatorOneToManyListTemp = tabulatorChildren[formGroupKey];
                        var tabulatorListOneToMany = _.where($scope.formAllDatafields, { type: "tabulator" });
                        _.each(tabulatorListOneToMany, function (tabu, keyTabu) {
                            var exists = tabulatorChildren[formGroupKey][tabu.name];
                            var param = {};
                            param.tabularId = tabu.name;
                            param.formId = tabu.reference_form;
                            param.created_by = $scope.userDetail.Id;
                            param.update_by = $scope.userDetail.Id;
                            param.action = 10;
                            param.formGroupKey = formGroupKey;
                            param.formId = param.formId == 0 ? $scope.currentFormId : param.formId;
                            param.parentID = $scope.currentFormId;
                            param.fieldName = name;
                            param.Id = Id;
                            $rootScope.$emit("ShowLoading");
                            mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                                .then(function (response) {
                                    $scope.allReferrenceData = response.data;
                                    $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                                    var finalArray = [];
                                    tabulatorChildren[formGroupKey][tabu.name].setColumns(bindTabulatorColumnsHeader($scope.allReferrenceData.formDataHeaders, "", param.formId, ""));

                                    $scope.formDetailsDataTemp = angular.copy($scope.allReferrenceData.formDataListNew);

                                    var Referral_FormsTemp = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId.toString() });

                                    if (!DataService.isEmpty(Referral_FormsTemp)) {
                                        _.each($scope.formDetailsDataTemp, function (item) {
                                            if (!DataService.isEmpty(Referral_FormsTemp.Referral_Form_Fields_value)) {
                                                var splitData = item[Referral_FormsTemp.field];
                                                if (!DataService.isEmpty(splitData)) {
                                                    if (splitData.contains("#jMS#")) {
                                                        splitData = splitData.split("#jMS#");
                                                        var datetimeStartEnd = "";
                                                        _.each(splitData, function (spItem) {
                                                            datetimeStartEnd += $scope.ToCustomDateTime(spItem) + " to ";
                                                        });
                                                        datetimeStartEnd = datetimeStartEnd.substring(0, datetimeStartEnd.length - 3);
                                                        item[Referral_FormsTemp.field] = datetimeStartEnd;
                                                    }
                                                }
                                            }

                                        });
                                    }

                                    tabulatorChildren[formGroupKey][tabu.name].setData($scope.formDetailsDataTemp);

                                    $rootScope.$emit("HideLoading");
                                }, function (err) {
                                    $rootScope.$emit("HideLoading");
                                    console.log("some error occured." + err);
                                });


                            //mainService.manageForm("ManageForm", param)
                            //    .then(function (response) {
                            //        if (response.data != null && angular.isDefined(response.data)) {
                            //            //console.log(response.data)                            
                            //            // $rootScope.$emit("HideLoading");   
                            //            var formDataTemp = response.data[0];
                            //            //console.log(formDataTemp);
                            //            //$scope.formDetailsDataInfo = formDataTemp;
                            //            var formDatafields = JSON.parse(formDataTemp.fields);
                            //            _.each(formDatafields, function (pagesData, key) {
                            //                if (!Array.isArray(pagesData))
                            //                    formDatafields[key] = JSON.parse(pagesData);
                            //                _.each(formDatafields[key], function (item) {
                            //                    if (angular.isDefined(item.values)) {
                            //                        if (!Array.isArray(item.values))
                            //                            item.values = JSON.parse(JSON.parse(item.values));
                            //                    }
                            //                });
                            //            });

                            //            //bindTabulatorColumnsHeader(formDatafields, tabularId, param.formId);
                            //            tabulatorChildren[formGroupKey][tabu.name].setColumns(bindTColumnHeader(formDatafields, false, false));
                            //            $timeout(function () {
                            //                var paramTemp = {};
                            //                paramTemp.action = 4;
                            //                paramTemp.formId = param.formId;
                            //                $rootScope.$emit("ShowLoading");
                            //                paramTemp.created_by = $scope.userDetail.Id;
                            //                paramTemp.update_by = $scope.userDetail.Id;
                            //                paramTemp.topicId = $scope.formDetailsDataInfo.topicId;
                            //                paramTemp.formGroupKey = formGroupKey;
                            //                var newParam = angular.copy(paramTemp);
                            //                $rootScope.$emit("ShowLoading");
                            //                mainService.manageTabOneToMany("ManageTabOneToMany", newParam)
                            //                    .then(function (response) {
                            //                        if (response.data != null && angular.isDefined(response.data)) {
                            //                            //console.log(response.data)
                            //                            var tempTabulatorData = response.data;
                            //                            if (newParam.action == 4) {
                            //                                var dataArray = [];
                            //                                var oneToManyTempData = [];
                            //                                if (!DataService.isEmpty(tempTabulatorData)) {
                            //                                    angular.forEach(tempTabulatorData, function (item) {
                            //                                        if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                            //                                            var tempData = JSON.parse(item.formfieldDataListTemp)
                            //                                            if (!DataService.isEmpty(tempData)) {
                            //                                                if (tempData.length > 1) {
                            //                                                    tempData.push({
                            //                                                        "name": "AutoId", "value": item.AutoId
                            //                                                    });
                            //                                                    oneToManyTempData.push(tempData);
                            //                                                } else if (tempData.length == 1) {
                            //                                                    tempData[0].AutoId = item.AutoId;
                            //                                                    dataArray.push(tempData[0]);
                            //                                                }
                            //                                            }
                            //                                        }
                            //                                    });
                            //                                    if (!DataService.isEmpty(oneToManyTempData)) {

                            //                                        angular.forEach(oneToManyTempData, function (filterData) {
                            //                                            //var filterData = oneToManyTempData;

                            //                                            var list = '';
                            //                                            list += '{"';

                            //                                            angular.forEach(filterData, function (item) {
                            //                                                // item = JSON.parse(item);

                            //                                                //angular.forEach(item, function (itemData, key) {
                            //                                                //console.log(itemData)
                            //                                                list += '' + item.name + '":"' + item.value + '","';
                            //                                                list += 'RowID-' + item.name + '":"' + item.value + '","';
                            //                                                //});                            

                            //                                            });
                            //                                            list += 'formId":"' + newParam.formId + '"';
                            //                                            //list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                            //                                            list += "}"
                            //                                            //setTabulatorRowData(JSON.parse(list));
                            //                                            dataArray.push(JSON.parse(list));
                            //                                        });

                            //                                    }
                            //                                    $scope.formDetailsDataTemp = angular.copy(dataArray);
                            //                                    //tabulator.setData(dataArray);
                            //                                }
                            //                                //console.log(tempTabulatorData);
                            //                                tabulatorChildren[formGroupKey][tabu.name].setData(dataArray);
                            //                            }
                            //                        }
                            //                        $rootScope.$emit("HideLoading");
                            //                    }, function (err) {
                            //                        $rootScope.$emit("HideLoading");
                            //                        console.log("some error occured." + err);
                            //                    });
                            //            }, 150);
                            //        }
                            //    }, function (err) {
                            //        $rootScope.$emit("HideLoading");
                            //        console.log("some error occured." + err);
                            //    });

                        });

                        //var tabulatorDataFilter = {};
                        //if (angular.isDefined(columnData))
                        //    tabulatorDataFilter = _.findWhere(columnData, { "fieldType": "tabulator" }).fieldDataText;
                        //tabulatorDataFilter = JSON.parse(tabulatorDataFilter);

                        ////tabulatorChildren[formGroupKey].setData(bindTRowsData(tabulatorDataFilter));
                        //var tabulatorGroup = $.cookie("form-" + formGroupKey);
                        //if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                        //    tabulatorChildren[formGroupKey].setGroupBy(tabulatorGroup);
                        //    tabulatorChildren[formGroupKey].setSort(tabulatorGroup, "asc");
                        //}
                    }
                });

            

            finalArray.push({
                title: getStringFromMultiligualText("Created At|創建於|创建于", langId), formatter: arrowDataFormat, titleDownload: getStringFromMultiligualText("Created At|創建於|创建于", langId), width: 140, field: "created_at", headerFilter: "input"
            });

            finalArray.push({
                title: getStringFromMultiligualText("Updated At|更新於|更新于", langId), formatter: arrowDataFormat, titleDownload: getStringFromMultiligualText("Updated At|更新於|更新于", langId), width: 140, field: "updated_at", headerFilter: "input"
            });
            //console.log($scope.filterFieldsList)
            return finalArray;
            //console.log(finalArray,"finalArray");


        };
        function bindTColumnHeaderCustom(formDetails, isExpend, isEdit) {
             
            //console.log('form details are this ');
            //console.log(formDetails);
            /**/
            var langId = "1";
            if (localStorage.getItem("globalLang") != null) {
                langId = localStorage.getItem("globalLang");
            }
            var finalArray = [];
            var isTabulator = {};

            angular.forEach(formDetails, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {

                    var translateLabel = "";
                    if (item.title == "Move Row") {
                        item.name = "Move Row";
                    }
                    if (item.title == "formId") {
                        item.name = "formId";
                    }

                    item.height = $scope.formDetailsDataInfo.tabulatorHeaderDetails.headingHeight;
                    var exists = _.findWhere($scope.formDatafieldsTemp, { field: item.name });
                    if (!DataService.isEmpty(exists) && !DataService.isEmpty(exists.field)) {
                        if (item.name == "updated_at" || item.name == "created_at" || item.name == "formId") {
                            item.type = "text";
                        }


                        item.title = exists.title;
                        item.headerTooltip = exists.headerTooltip;
                        item.width = exists.width;
                        item.visible = exists.visible;
                        item.forecolor = exists.forecolor;
                        item.backgroundColor = exists.backgroundColor;
                        item.dropdownValue = exists.dropdownValue;
                    } else {

                    }
                    if (!DataService.isEmpty(item.title))
                        item.label = item.title;
                    if (!DataService.isEmpty(item.label))
                        translateLabel = getStringFromMultiligualText(item.label, langId);
                    var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                    var subtype = _.find(item, function (itemitem, keykey) { return keykey == "subtype" });
                    var types = _.find(item, function (itemitem, keykey) { return keykey == "types" });
                    //if (type == undefined && item.title !="Move Row") {
                    //     type ="text";
                    //}
                    var Inline_Edit = false;
                    Inline_Edit = (!DataService.isEmpty(item.Inline_Edit) && item.Inline_Edit == "Yes") ? (type == "text" ? "input" : type) : Inline_Edit;

                    var controlsDetails = item;
                    controlsDetails.title = translateLabel;
                    controlsDetails.field = item.name;

                    if (controlsDetails.field != "activities" && controlsDetails.field != "resources") {

                        if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                            || type == "autocomplete" || type == "checkbox-group" || type == "select" || type == "signature" || type == "tinyMCE-content") {
                            if (type == "file") {
                                if (type == "file" && item.multiple == true) {


                                    controlsDetails.formatter = multilFiles;
                                    controlsDetails.titleDownload = translateLabel;
                                    controlsDetails.cellClick = function (e, cell) {
                                        var fileValue = cell.getValue().replace('~', '');
                                        getAllFiles1(cell.getValue(), cell.getField());
                                        //console.log('cell-clicked')
                                    };

                                    finalArray.push(controlsDetails);

                                }
                                else {
                                    controlsDetails.formatter = arrowImage;
                                    controlsDetails.titleDownload = translateLabel;
                                    controlsDetails.formatterParams = { height: 50, width: 50 };
                                    controlsDetails.headerFilter = "input";
                                    controlsDetails.headerSort = false;
                                    finalArray.push(controlsDetails);
                                }
                            }
                            else {

                                if (type == "text" && subtype == "color") {

                                    if (DataService.isEmpty(item.Display_tab)) {

                                        $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, headerFilter: "input" });
                                        controlsDetails.formatter = 'color';
                                        controlsDetails.bottomCalc = showFooter(item);
                                        controlsDetails.editor = Inline_Edit;
                                        finalArray.push(controlsDetails);
                                    }
                                    else {

                                        $scope.displayInTabData = item;

                                    }
                                }
                                else if (type == "signature") {
                                    controlsDetails.formatter = arrowImage;
                                    controlsDetails.titleDownload = translateLabel;
                                    controlsDetails.headerFilter = "input";
                                    finalArray.push(controlsDetails);

                                }
                                else if (type == "textarea" && subtype == "tinymce") {
                                    $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, headerFilter: "input" });
                                    controlsDetails.formatter = renderHtml;
                                    controlsDetails.editor = Inline_Edit;
                                    finalArray.push(controlsDetails);
                                }
                                else if (type == "date" && types == "date_picker") {
                                    controlsDetails.formatter = datetimeFormatter;
                                    controlsDetails.titleDownload = translateLabel;
                                    controlsDetails.editor = Inline_Edit;
                                    controlsDetails.headerFilter = "input";
                                    finalArray.push(controlsDetails);

                                }
                                else if (type == "date" && types == "datetime_picker") {
                                    controlsDetails.formatter = datetimeFormatterTime;
                                    controlsDetails.titleDownload = translateLabel;
                                    controlsDetails.editor = Inline_Edit;
                                    controlsDetails.headerFilter = "input";
                                    finalArray.push(controlsDetails);

                                }
                                else if (type == "checkbox-group") {
                                    $scope.CB_Edit = Inline_Edit;
                                    $scope.CB_toggle = item.toggle;
                                    controlsDetails.formatter = checkboxGroupFormatter;
                                    controlsDetails.editor = CBEditor;
                                    controlsDetails.headerFilter = "select";
                                    finalArray.push(controlsDetails);
                                    //finalArray.push({
                                    //    title: translateLabel, columnType: type, align: "center", field: item.name, align: "left", formatter: checkboxGroupFormatter, headerFilter: "select", headerFilterParams: { values: ['', 'Yes', 'No'] }, editor: CBEditor
                                    //});
                                }
                                else if (type == "radio-group") {
                                    //console.log(item, 'item')
                                    $scope.optionValues = item.values;
                                    if (DataService.isEmpty(item.Display_tab)) {
                                        if (!DataService.isEmpty(item.Inline_Edit)) {
                                            if (item.Inline_Edit == "Yes") {
                                                finalArray.push({
                                                    title: translateLabel, columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", editor: radioEditor, bottomCalc: showFooter(item), headerFilterParams: { values: true }

                                                    , cellEdited: function (cell) {
                                                        console.log("cell" + cell)
                                                    }
                                                });



                                            } else {
                                                finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                            }

                                        }
                                        else {
                                            finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                        }

                                    }
                                    else {

                                        $scope.displayInTabData = item;

                                    }
                                }
                                else if (type == "select") {
                                    //console.log(item, 'select d')

                                    $scope.optionValuesSelect = item.values;
                                    var valuesData;
                                    if (!DataService.isEmpty(controlsDetails.dropdownValue)) {
                                        valuesData = (!DataService.isEmpty(JSONTryParse(controlsDetails.dropdownValue)) ? JSONTryParse(controlsDetails.dropdownValue) : true);
                                    }
                                    else {
                                        valuesData = true;
                                    }
                                    var headerfilterType;
                                    if (item.Use_as_select2 == "Yes" || item.Use_as_tags == "Yes") {
                                        headerfilterType = "input";
                                        valuesData = false;
                                    }
                                    else {
                                        headerfilterType = "input";
                                    }
                                    //controlsDetails.headerFilterParams = { values: valuesData };
                                    if (DataService.isEmpty(item.Display_tab)) {
                                        if (!DataService.isEmpty(item.Inline_Edit)) {
                                            if (item.Inline_Edit == "Yes") {
                                                finalArray.push({
                                                    title: translateLabel, columnType: type, field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: headerfilterType, editor: selectEditor, bottomCalc: showFooter(item), headerFilterParams: { values: true }

                                                    , cellEdited: function (cell) {
                                                        console.log("cell" + cell)
                                                    }
                                                });


                                            } else {
                                                //finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, formatter: arrowDataFormat, field: item.name, type: type, align: "left", headerFilter: headerfilterType, headerFilterParams: { values: valuesData } });

                                                if ($scope.isTransactionForm || (item.Referral_Forms != "" && item.Referral_Forms != undefined)) {
                                                    finalArray.push({ title: translateLabel, formatter: arrowDataFormat, bottomCalc: showFooter(item), columnType: type, field: item.name, align: "left", headerFilter: "input" });
                                                } else
                                                    finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, formatter: arrowDataFormat, field: item.name, align: "left", headerFilter: headerfilterType, headerFilterParams: { values: true } });



                                            }

                                        }
                                        else {
                                            //finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, formatter: arrowDataFormat, field: item.name, type: type, align: "left", headerFilter: "select", headerFilterParams: { values: valuesData } });

                                            if ($scope.isTransactionForm || (item.Referral_Forms != "" && item.Referral_Forms != undefined)) {
                                                finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", headerFilter: "input" });
                                            } else
                                                finalArray.push({ title: translateLabel, bottomCalc: showFooter(item), columnType: type, field: item.name, type: type, align: "left", formatter: arrowDataFormat, headerFilter: headerfilterType, headerFilterParams: { values: true } });


                                        }

                                    }
                                    else {

                                        $scope.displayInTabData = item;

                                    }
                                }


                                //else if (type == "number") {
                                //    if (DataService.isEmpty(item.Display_tab)) {
                                //        $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, width: 140, headerFilter: "input" });
                                //        if (item.column_format == "progress") {
                                //            //item.progress_color
                                //            finalArray.push({
                                //                title: translateLabel, formatter: "progress", formatterParams: { color: [item.progress_color] }, titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, type: type, headerFilter: "input", editor: Inline_Edit
                                //            });
                                //        }
                                //        else {
                                //            finalArray.push({
                                //                title: translateLabel, formatter: "number", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, type: type, headerFilter: "input", editor: Inline_Edit
                                //            });
                                //        }
                                //    }
                                //    else {
                                //        $scope.displayInTabData = item;
                                //    }


                                //}

                                else if (type == "number") {

                                    if (DataService.isEmpty(item.Display_tab)) {
                                        $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, width: 140, headerFilter: "input" });
                                        if (item.column_format == "progress") {
                                            //item.progress_color
                                            finalArray.push({
                                                title: translateLabel, formatter: "progress", formatterParams: { color: [item.progress_color] }, titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else if (item.column_format == "tick") {
                                            //item.progress_color
                                            finalArray.push({
                                                title: translateLabel, formatter: "tick", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else if (item.column_format == "money") {
                                            //item.progress_color
                                            finalArray.push({
                                                title: translateLabel, formatter: "money", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else if (item.column_format == "tickCross") {
                                            //item.progress_color
                                            finalArray.push({
                                                title: translateLabel, formatter: "tickCross", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else if (item.column_format == "star") {
                                            //item.progress_color
                                            finalArray.push({
                                                title: translateLabel, formatter: "star", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                        else if (item.column_format == "plaintext") {
                                            console.log(item.number_decimal, "Decimal");

                                            if (item.number_decimal != undefined && item.number_decimal > 0) {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "text", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                            else {
                                                finalArray.push({
                                                    title: translateLabel, formatter: "text", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, headerFilter: "input", editor: Inline_Edit
                                                });
                                            }
                                        }


                                        else {
                                            finalArray.push({
                                                title: translateLabel, formatter: "number", titleDownload: translateLabel, width: 140, bottomCalc: showFooter(item), field: item.name, type: type, headerFilter: "input", editor: Inline_Edit
                                            });
                                        }
                                    }
                                    else {
                                        $scope.displayInTabData = item;
                                    }


                                }





                                else {
                                    if (DataService.isEmpty(item.Display_tab)) {
                                        $scope.filterFieldsList.push({ title: translateLabel, field: item.name, type: type, width: 140, headerFilter: "input" });

                                        controlsDetails.formatter = arrowDataFormat;
                                        controlsDetails.titleDownload = translateLabel;
                                        controlsDetails.editor = Inline_Edit;
                                        controlsDetails.headerFilter = "input";
                                        controlsDetails.bottomCalc = showFooter(item);
                                        if (!DataService.isEmpty(controlsDetails.dropdownValue)) {
                                            controlsDetails.align = "center";
                                            controlsDetails.editor = Inline_Edit;
                                            controlsDetails.editorParams = { values: true };
                                            controlsDetails.headerFilter = "select";
                                            controlsDetails.dropdownValue = controlsDetails.dropdownValue.replace(/'/g, '"');
                                            var valuesData = (!DataService.isEmpty(JSONTryParse(controlsDetails.dropdownValue)) ? JSONTryParse(controlsDetails.dropdownValue) : true);
                                            controlsDetails.headerFilterParams = { values: valuesData };
                                        }
                                        finalArray.push(controlsDetails);
                                    }
                                    else {

                                        $scope.displayInTabData = item;

                                    }
                                }



                            }
                        }
                        //console.log(finalArray,"finalArray");

                        if (item.rowHandle) {
                            controlsDetails.download = false;
                            finalArray.push(controlsDetails);
                        }

                        if (isEdit) {
                            if (item.rowEdit) {

                                controlsDetails.download = false;
                                controlsDetails.align = "center";
                                controlsDetails.formatter = arrowEdit;
                                controlsDetails.cellClick =
                                    function (e, cell) {
                                        if (checkDeleteEditAccessRight(0)) {
                                            var created_at = cell.getRow().getData().created_at;

                                            if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.own))
                                                $scope.formDetailsDataInfo.recordAccessSecurity.own = {};
                                            if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.other))
                                                $scope.formDetailsDataInfo.recordAccessSecurity.other = {};


                                            if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time) || $scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time == 0 && cell.getRow().getData().userID == $scope.userDetail.Id) {
                                                $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                            }
                                            else if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time) || $scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time == 0 && cell.getRow().getData().userID != $scope.userDetail.Id) {
                                                $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                            }
                                            else {
                                                if (cell.getRow().getData().userID == $scope.userDetail.Id) {
                                                    var editime = $scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time;
                                                    //created_at = new Date(created_at);
                                                    //var timeRangeToEdit = add_minutes(created_at, editime);
                                                    //var differenceTime = diff_minutes(new Date(), timeRangeToEdit);
                                                    //if (differenceTime <= editime && cell.getRow().getData().userID == $scope.userDetail.Id)
                                                    //    $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                                    //else {
                                                    //    $timeout(function () {
                                                    //        notifierService.notifyMessage('error', 'Edit Time', 'Edit Time is exceed');
                                                    //    }, 200);
                                                    //}
                                                    var VParam = {};
                                                    VParam.created_at = created_at;
                                                    VParam.availableMinute = editime;
                                                    mainService.checkEditDeleteValidity("checkEditDeleteValidity", VParam)
                                                        .then(function (response) {
                                                            if (response.data != null && angular.isDefined(response.data)) {
                                                                var isValid = response.data.data;
                                                                if (isValid == 1) {
                                                                    $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                                                }
                                                                else {
                                                                    notifierService.notifyMessage('error', 'Edit Time', 'Edit Time is exceed');
                                                                }
                                                            }
                                                        }, function (err) {
                                                            $rootScope.$emit("HideLoading");
                                                            console.log("some error occured." + err);
                                                        });

                                                }
                                                else if (cell.getRow().getData().userID != $scope.userDetail.Id) {
                                                    var editime = $scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time;
                                                    //created_at = new Date(created_at);
                                                    //var timeRangeToEdit = add_minutes(created_at, editime);
                                                    //var differenceTime = diff_minutes(new Date(), timeRangeToEdit);
                                                    //if (differenceTime <= editime && cell.getRow().getData().userID != $scope.userDetail.Id)
                                                    //    $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                                    //else {
                                                    //    $timeout(function () {
                                                    //        notifierService.notifyMessage('error', 'Edit Time', 'Edit Time is exceed');
                                                    //    }, 200);
                                                    //}
                                                    var VParam = {};
                                                    VParam.created_at = created_at;
                                                    VParam.availableMinute = editime;
                                                    mainService.checkEditDeleteValidity("checkEditDeleteValidity", VParam)
                                                        .then(function (response) {
                                                            if (response.data != null && angular.isDefined(response.data)) {
                                                                var isValid = response.data.data;
                                                                if (isValid == 1) {
                                                                    $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                                                                }
                                                                else {
                                                                    notifierService.notifyMessage('error', 'Edit Time', 'Edit Time is exceed');
                                                                }
                                                            }
                                                        }, function (err) {
                                                            $rootScope.$emit("HideLoading");
                                                            console.log("some error occured." + err);
                                                        });
                                                }
                                            }

                                        }
                                        else {
                                            notifierService.notifyMessage('error', 'Edit Access', 'You have not accessed to Edit this form record.');
                                        }
                                    }
                                finalArray.push(controlsDetails);
                            }
                            //isEdit=false;
                        }
                    } else {

                    }
                    if (item.field == "Id" || item.title == "Id") {
                        var idExists = _.findWhere(finalArray, { field: "Id" });
                        if (DataService.isEmpty(idExists)) {
                            if (item.visible)
                                finalArray.push({ title: "Id", visible: true, field: "Id" });
                            else
                                finalArray.push({ title: "Id", visible: false, field: "Id" });
                        }

                    }
                    if (item.formId == "formId") {
                        if (item.visible)
                            finalArray.push({ title: "formId", visible: true, field: "formId" });
                        else
                            finalArray.push({ title: "formId", visible: false, field: "formId" });

                    }

                });
                isTabulator = _.where(pageData, { type: "tabulator" });
            });
            // finalArray.push({ title: "formId", visible: false, field: "formId" });

            finalArray.push({ title: "formGroupKey", visible: false });




            if (isExpend && !DataService.isEmpty(isTabulator)) {
                $.each(isTabulator, function (i, isTabulatorItem) {

                    finalArray.unshift({
                        title: isTabulatorItem.label, download: false, field: isTabulatorItem.field, formatter: arrowIcon, width: 35, headerSort: false, cellClick: function (e, cell) {
                            var formGroupKey = cell.getRow().getData().formGroupKey;
                            var rowId = cell.getRow().getData().Id;
                            if ($(cell.getElement()).is('.active')) {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                                $(cell.getElement()).removeClass('active');
                            } else {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                                $(cell.getElement()).addClass('active');

                                var table = tabulatorChildren[formGroupKey][Object.keys(tabulatorChildren[formGroupKey])[0]];
                                table.setData([]);


                            }
                            var columnData = $scope.formDataTabulatorTemp[formGroupKey];
                            var param = {};
                            param.formId = isTabulatorItem.reference_form;
                            param.created_by = $scope.userDetail.Id;
                            param.update_by = $scope.userDetail.Id;
                            param.action = 10;
                            param.Id = rowId;
                            param.formGroupKey = formGroupKey;
                            param.formId = param.formId == 0 ? $scope.currentFormId : param.formId;
                            param.parentID = $scope.currentFormId;
                            param.fieldName = name;
                            $rootScope.$emit("ShowLoading");
                            mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                                .then(function (response) {
                                    $scope.allReferrenceData = response.data;
                                    $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                                    var finalArray = [];
                                    tabulatorChildren[formGroupKey][Object.keys(tabulatorChildren[formGroupKey])[0]].setColumns(bindTabulatorColumnsHeader($scope.allReferrenceData.formDataHeaders, "", param.formId, ""));

                                    $scope.formDetailsDataTemp = angular.copy($scope.allReferrenceData.formDataListNew);
                                    tabulatorChildren[formGroupKey][Object.keys(tabulatorChildren[formGroupKey])[0]].setData($scope.allReferrenceData.formDataListNew);
                                    $rootScope.$emit("HideLoading");
                                }, function (err) {
                                    $rootScope.$emit("HideLoading");
                                    console.log("some error occured." + err);
                                });
                        }
                    });

                });

            }

            if (isEdit) {

                let controlsDetails = {};
                controlsDetails.title = "Edit";
                controlsDetails.download = false;
                controlsDetails.align = "center";
                controlsDetails.formatter = arrowEdit;
                controlsDetails.headerSort = false;
                controlsDetails.cellClick =
                    function (e, cell) {
                        $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                    }
                finalArray.unshift(controlsDetails);

            }


            //finalArray.push({
            //    title: "Created At", formatter: arrowDataFormat, titleDownload: "Created At", width: 140, field: "created_at", headerFilter: "input"
            //});
            //finalArray.push({
            //    title: "Updated At", formatter: arrowDataFormat, titleDownload: "Updated At", width: 140, field: "updated_at", headerFilter: "input"
            //});
            //console.log($scope.filterFieldsList)           
            return finalArray;
            //  console.log(formDetails);

        };
        function bindTabulatorColumnsHeader(formDetails, tabularId, formId, fieldName) {
            //
            // angular.forEach(formDetails, function (pageData, pageKey) {
            var finalArray = [];
            angular.forEach(formDetails, function (item, key) {
                // var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                var type = item.columnType;
                item.name = item.field;
                item.label = item.title;

                if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                    || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                    if (type == "file") {
                        if (type == "file" && item.multiple == true) {
                            finalArray.push({
                                title: item.label, formatter: multilFiles, width: 200, headerFilter: false, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {
                                    getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                }
                            });
                        }
                        else {
                            finalArray.push({
                                title: item.label, formatter: arrowImage, width: 200, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: false
                            });
                        }
                    }
                    else {
                        if (DataService.isEmpty(item.Display_tab)) {
                            if (!DataService.isEmpty(item.Inline_Edit) && item.Inline_Edit == "Yes") {
                                finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: false, visible: false });
                                finalArray.push({
                                    title: item.label, bottomCalc: showFooter(item), width: 200, field: "RowID-" + item.name, align: "left", headerFilter: false, editor: "input", cellEdited: function (cell) {
                                        console.log("cell" + cell)
                                    }
                                });
                            }
                            else {
                                finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: false });
                            }
                        }
                        else {
                            $scope.displayInTabData = item;
                        }
                    }
                }
            });
            return finalArray;
        }
        function customColumnTypeFunc(field, type) {
            //var type="string";
            return type;
        };
        $scope.onFilterFieldByChange = function () {

            $scope.searchByFilter($scope.filterBy.filterByValue);

        };
        $scope.onGroupByChange = function (data) {
            localStorage.setItem("records_" + $stateParams.formId, data.groupByRecord);
            if (!DataService.isEmpty(data.groupByRecord)) {
                tabulator.setGroupBy(data.groupByRecord);
            }
            else
                tabulator.setGroupBy(null);
        };
        $scope.clearFilter = function () {
            $scope.filterBy = {};
            tabulator.setGroupBy(null);
            $window.location.reload();
        };
        $scope.searchByFilter = function (nval) {

            if (!DataService.isEmpty($scope.filterBy.fieldByRecord) && !DataService.isEmpty(nval)) {
                var filterData = angular.copy(tabulator.getData());
                //filterData = filterTypeBased(tabulator.getData(), nval);
                bindtabulatorOnly("columns", nval);
                // tabulator.setData(filterData);
            } else {
                bindtabulatorOnly("columns", "bind");
                //tabulator.setData($scope.formDetailsDataTemp);
            }
        };
        function isNumeric(num) {
            return !isNaN(num)
        }
        function filterTypeBased(data, nval) {
            return _.filter(data,
                function (item) {
                    var valueCheck = isNumeric(nval) ? parseInt(nval) : nval;
                    if ($scope.filterBy.filterByType == "=")
                        return item[$scope.filterBy.fieldByRecord] == valueCheck
                    else if ($scope.filterBy.filterByType == "<")
                        return item[$scope.filterBy.fieldByRecord] < valueCheck;
                    else if ($scope.filterBy.filterByType == "<=")
                        return item[$scope.filterBy.fieldByRecord] <= valueCheck;
                    else if ($scope.filterBy.filterByType == ">")
                        return item[$scope.filterBy.fieldByRecord] > valueCheck;
                    else if ($scope.filterBy.filterByType == "=>")
                        return item[$scope.filterBy.fieldByRecord] <= valueCheck;
                    else if ($scope.filterBy.filterByType == "!=")
                        return item[$scope.filterBy.fieldByRecord] != valueCheck;
                    else if ($scope.filterBy.filterByType == "like")
                        return item[$scope.filterBy.fieldByRecord].includes(valueCheck);
                    else
                        return true;
                }
            );
        }
        $scope.$watch('filterBy.filterByValue', function (nval, oval) {

            if (oval !== nval) {
                $scope.searchByFilter(nval);
            }
        });
        $scope.bindDraggable = function () {
            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;;

            mainService.manageForm("ManageForm", param1)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log('data  is'); //console.log(response.data[0]);
                        if (response.data.length > 0) {
                            var param = {};
                            param.action = 1;
                            param.formId = response.data[0].activitiesForm;
                            param.fieldName = response.data[0].activities;
                            if ((response.data[0].activitiesForm != 0 && response.data[0].activitiesForm != null) && (response.data[0].activities != '' && response.data[0].activities != null)) {

                                mainService.getReferralFormFields("getReferralFormFields", param)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            //console.log('entries are');
                                            //console.log(response.data)
                                            if (response.data.length > 0) {
                                                $scope.formDetails = response.data;

                                            }

                                        }
                                    });
                            }





                        }

                    }
                });


        }
        $scope.selectedTabFilter = function (filterValue, selectedId) {
            $rootScope.$emit("ShowLoading");
            var filterData = angular.copy($scope.formDetailsDataTemp);
            var groupBy = _.groupBy(filterData, "formGroupKey");
            $('#page-tabs li').removeClass('ui-tabs-active ui-state-active');
            $("#tab-" + selectedId).addClass('ui-tabs-active ui-state-active');

            $scope.filterBy.filterByType = "like";
            $scope.filterBy.filterByValue = filterValue.label;
            $scope.filterBy.fieldByRecord = $scope.displayInTabData.name;
            $scope.searchByFilter($scope.filterBy.filterByValue);
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
            //var temp = [];
            //var filterDataNew = _.filter(filterData, function (item, key) {
            //  var filterNest = _.filter(item, function (itemNest, keyNest) {
            // if (angular.isDefined(itemNest) && $scope.displayInTabData.name == keyNest)
            //    return itemNest.toString() == filterValue.value;
            //});
            // if (!DataService.isEmpty(filterNest))
            //    temp.push(item)
            // });
            //tabulator.setData(temp);
            $rootScope.$emit("HideLoading");
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
                            //console.log(formData);                   
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
        function bindtabulatorOnly(type, data) {
            
            var details = JSON.parse(localStorage.getItem("detail"));
            var languageIdForm = localStorage.getItem("globalLangForm");
            var languageId = localStorage.getItem("globalLang");
            //localStorage.clear();
            localStorage.setItem("detail", JSON.stringify(details));
            localStorage.setItem("globalLang", languageId);
            localStorage.setItem("globalLangForm", languageIdForm);

            $scope.filterFieldsList = [];
            var headers = [];
            debugger;
            //headers = bindTColumnHeaderCustom($scope.formDatafields, true, true);
            /*Bind Header from tabulator settings*/
            if (localStorage.getItem("records_" + $stateParams.formId)) {
                $scope.filterBy.groupByRecord = localStorage.getItem("records_" + $stateParams.formId);
            }
            if (!DataService.isEmpty($scope.formDetailsDataInfo.tabulatorHeaderDetails)) {
                if (!DataService.isEmpty($scope.formDetailsDataInfo.tabulatorHeaderDetails.groupBy)) {
                    $scope.filterBy.groupByRecord = $scope.formDetailsDataInfo.tabulatorHeaderDetails.groupBy;
                }

                var tabuSettings = $scope.formDetailsDataInfo.tabulatorHeaderDetails.configSettings;
                $scope.paginationSizeFormRecords = $scope.formDetailsDataInfo.tabulatorHeaderDetails.recordsPerPage;
                $scope.filterBy.headingHeight = $scope.formDetailsDataInfo.tabulatorHeaderDetails.headingHeight;
                var list = JSON.parse(tabuSettings);
                list = _.uniq(list, "field");
                var temp = [];
                list = _.filter(list, function (item) { return item.visible == true || item.visible == false });
                $scope.formDatafieldsTemp = {};
                $scope.formDatafieldsTemp = angular.copy(list);

                _.each($scope.formDatafieldsTemp, function (item, key) {
                    var exists;
                    if (item.rowHandle) {
                        exists = _.findWhere($scope.formDatafieldsTemp, { rowHandle: item.rowHandle });
                        if (DataService.isEmpty(exists))
                            $scope.formDatafieldsTemp.splice(key, 0, item);


                    }

                    else if (item.rowEdit) {
                        exists = _.findWhere($scope.formDatafieldsTemp, { rowEdit: item.rowEdit });
                        if (DataService.isEmpty(exists))
                            $scope.formDatafieldsTemp.splice(key, 0, item);
                    }
                    else if (item.field == "Id") {
                        var idExists = _.findWhere($scope.formDatafieldsTemp, { field: item.field });
                        if (DataService.isEmpty(idExists)) {
                            $scope.formDatafieldsTemp.push(item);
                        }
                    }

                })
                temp.push($scope.formDatafieldsTemp);
                headers = bindTColumnHeaderCustom(temp, true, true);
                
            }
            else {
                headers = bindTColumnHeader($scope.formDatafields, true, true);
            }
            debugger;
            headers = removeColumns($scope.currentFormId, headers);
            headers = addNewColumns($scope.currentFormId, headers);
            
            $timeout(function () {
                if (!DataService.isEmpty(data))

                    tabulator = initTabulator('form-records', {
                        placeholder: "No Data.",
                        groupBy: (!DataService.isEmpty($scope.filterBy.groupByRecord)) ? $scope.filterBy.groupByRecord : null,
                        selectable: true,
                        movableRows: true,
                        tooltips: function (cell) {
                            return cell.getValue();
                        },
                        height: "650px",
                        layout: "fitDataFill",
                        // layout: "fitColumns",
                        responsiveLayout: false,
                        initialSort: [
                            { column: "formRecordOrder", dir: "asc" }
                        ],
                        groupToggleElement: "header",
                        persistenceID: "persisrecords",
                        persistenceMode: true,
                        persistentLayout: true,
                        persistence: {
                            sort: true, //persist column sorting
                            filter: true, //persist filter sorting
                            columns: false, //persist columns
                        },
                        persistenceWriterFunc: function (id, type, data) {
                            localStorage.setItem(id + "-" + type, JSON.stringify(data));
                        },
                        persistenceReaderFunc: function (id, type) {
                            var data = localStorage.getItem(id + "-" + type);
                            var dataParse = JSON.parse(data);
                            if (!DataService.isEmpty(data) && type == "columns") {
                                _.each(headers, function (item) {
                                    var exists = _.findWhere(dataParse, {
                                        field: item.field
                                    });
                                    if (!DataService.isEmpty(exists)) {
                                        exists.visible = item.visible;
                                    }
                                })
                            }
                            else if (type == "page") {
                                if (!DataService.isEmpty(data) && $scope.paginationSizeFormRecords != 0)
                                    dataParse.paginationSize = $scope.paginationSizeFormRecords;
                            }
                            return data ? dataParse : false;
                        },
                        groupStartOpen: false,
                        columns: headers,
                        cellEdited: function (cell) {
                            //This callback is called any time a cell is edited
                            if (checkDeleteEditAccessRight(0)) {
                                var input = []; var json = {}; var columnName = cell.getColumn().getField();
                                json[columnName] = (columnName === "status" ? formStatus.indexOf(cell.getValue()) : cell.getValue());
                                input['url'] = "{{url('')}}";
                                input['data'] = { 'table': 'form', 'update': json, 'where': { Id: cell.getRow().getData().Id } };

                                if (input['data'].update[columnName]) { //ajax_call(input); 

                                    //param.formTableName =$scope.formDetailsDataInfo.FormTableName;
                                    if (columnName != "updated_at" && columnName != "created_at") {
                                        var param = {};
                                        var formId = cell.getData().formID;
                                        param.fieldName = columnName;
                                        param.formId = formId;
                                        param.fieldDataText = cell.getValue();
                                        param.Id = cell.getRow().getData().Id;
                                        $scope.updateRowDataRecord(param);
                                    }
                                }
                                else { cell.restoreOldValue(); }
                            }
                        },
                        rowSelectionChanged: function (data, rows) {


                            var formGroupKeyList = [];
                            $scope.selectedDeletedRecordList = [];
                            data.forEach(function (item, key) {
                                formGroupKeyList.push(item.Id);
                                $scope.selectedDeletedRecordList.push(item);
                            });
                            window["formGroupKeyList"] = formGroupKeyList;

                            $rootScope.safeApply();
                        },
                        rowFormatter: function (row) {
                            if (type == "columns") {
                                var formGroupKey = row.getData().formGroupKey;
                                var falal = $scope.formDataTabulatorTemp;
                                var tabulatorListOneToMany = _.where($scope.formAllDatafields, { type: "tabulator" });
                                tabulatorChildren[formGroupKey] = [];
                                //define a table layout structure and set width of row
                                if (tabulatorListOneToMany.length > 0) {
                                    tabulatorListOneToMany = [tabulatorListOneToMany[0]];
                                }

                                _.each(tabulatorListOneToMany, function (item) {
                                    var table = $("<table>", { 'class': 'table table-bordered', 'id': 'form-' + formGroupKey + item.name });
                                    //append newly formatted contents to the row
                                    $(row.getElement()).append($('<div>', { 'class': 'table-wrapper', "style": "padding-left: 3%" }).append(table));
                                    if ($("#form-" + formGroupKey + item.name).length) {
                                        var childTabulator = new Tabulator("#form-" + formGroupKey + item.name, {
                                            //height:'50%',
                                            layout: "fitDataFill",
                                            placeholder: "No Data.",
                                            //selectable:1,

                                            tooltipsHeader: true,
                                            responsiveLayout: true,
                                            //persistentLayout: true,
                                            //persistenceID: "E2",
                                            groupStartOpen: false,
                                            groupToggleElement: "header",
                                            pagination: "local",
                                            paginationSize: 10,
                                            columns: [
                                                //set column definitions for imported table data                 
                                            ]
                                        });

                                        tabulatorChildren[formGroupKey][item.name] = childTabulator;
                                        tabulatorChildren[formGroupKey][item.name].setData([]);
                                        $(".table-wrapper").hide();
                                    }

                                });

                            }
                            else {
                                var element = $(row.getElement()),
                                    // data = row.getData(),
                                    width = element.outerWidth(),
                                    table;

                                //clear current row data
                                element.empty();

                                //define a table layout structure and set width of row
                                table = $("<table style='width:" + (width - 18) + "px;'><tr></tr></table>");

                                $timeout(function () {
                                    //add row data on right hand side
                                    var imageFound = 0, rowRecord = "";
                                    var columns = tabulator.columnManager.columns;
                                    var data = row.getData()
                                    $.each(columns, function (field, value) {
                                        if (!DataService.isEmpty(value.getField())) {
                                            //console.log(data[value.getField()])
                                            var str = data[value.getField()];
                                            //console.log(str);
                                            if (!DataService.isEmpty(str))
                                                if (/\.(jpe?g|png|gif)$/i.test(str.toString())) {
                                                    // Image found
                                                    imageFound++;
                                                    if (str === 'string' && str.startsWith("uploads"))
                                                        var img = "<img class='img-responsive' src='" + data[field] + "'/>";
                                                    else
                                                        var img = "<img class='img-responsive' src='" + str + "'/>";

                                                    $("tr", table).append("<td class='media'>" + img + "</td>");
                                                } else {
                                                    // No image found
                                                    //var class_value = value.toLowerCase().replace(' ','_');
                                                    rowRecord += "<div class='" + value.definition.title + "'><strong>" + value.definition.title + ":</strong> " + str + "</div>";
                                                    /*if (/\.(pdf)$/i.test(data[field])) { // pdf files
                                                        var link = "<a target='_blank' href='{{url('/file-view/')}}?file=" + data[field] + "'><b>" + data[field] + "</b></a>";
                                                        rowRecord += "<div class='"+field+"'><strong>" + value + ":</strong> " + link + "</div>";
                                                    }
                                                    else{
                                                        if(typeof data[field] === "string" && data[field].startsWith("uploads")) {
                                                            var link = "<a href='{{asset('/')}}" + data[field] + "'><b>" + data[field] + "</b></a>";
                                                            rowRecord += "<div class='"+field+"'><strong>" + value + ":</strong> " + link + "</div>";
                                                        }
                                                        else   
                                                            rowRecord += "<div class='"+field+"'><strong>" + value + ":</strong> " + data[field] + "</div>";
                                                    }*/
                                                }
                                        }
                                    });

                                    if (imageFound == 0) {
                                        $("tr", table).append("<td class='media'></td>");
                                    }
                                    $("tr", table).append("<td>" + rowRecord + "</td>");
                                    $("tr", table).append("<td align='right'><a class='btn btn-info' onclick=\"angular.element(this).scope().entryPage(" + data.formID + ", true,\'" + data.formGroupKey + "\', \'" + data.Id + "\')\"> Edit </a></td>");

                                    //var data = row.getData();
                                    //if (data.Id) {
                                    //    if (data.Id.length == 16 && data.userID == 0) {
                                    //        $("tr", table).css({ "background-color": "#FFCCCC", "border-bottom": "1px solid #e5e5e5" });
                                    //    }
                                    //}
                                    //append newly formatted contents to the row
                                    element.append(table);
                                }, 150);
                            }




                        },
                        rowMoved: function (row) {
                            var rowIndex = row.getPosition();
                            rowIndex += 1;
                            var formId = row.getData().formID;
                            var Id = row.getData().Id;
                            var param = {};
                            param.formRecordOrder = rowIndex;
                            param.formId = formId;
                            param.Id = Id;
                            $scope.updateQueueRecord(param);
                        },
                        footerElement: "<div style='text-align:left;width: auto;margin-left: 14px;' id='no-of-forms'></div>",
                        dataLoaded: function (data) {
                            //data - all data loaded into the table  
                            
                            var count = 0;
                            if (data.length > 0)
                                if ($scope.isAllowOwnUser == true && $scope.isAllowOtherUser == false) {
                                    count = data[0].total_records;
                                }
                                else {
                                    count = data.length; //data[0].total_records;
                                }

                            $('#form-records  #no-of-forms').text("Total: " + count + " Entries");
                        },
                        /// pagination: "local",              
                        ajaxFiltering: true,
                        ajaxSorting: true,
                        ajaxLoader: true,
                        ajaxURL: GetFormRecordsUrl($scope.currentFormId),
                        ajaxConfig: "POST", //ajax HTTP request type
                        ajaxContentType: "json",
                        ajaxParams: {
                            action: 32, formId: $scope.currentFormId, created_by: $scope.userDetail.Id, update_by: $scope.userDetail.Id, topicId: $scope.formDetailsDataInfo.topicId,
                            currentFormType: $scope.formDetailsDataInfo.currentFormType,
                            companyCode: localStorage.getItem("COMPANY_CODE"), calendarCode: localStorage.getItem("CALENDAR_CODE"),
                            "IsCustomFilter": true,
                            "CustomFilters": [{ "FieldName": "COMPANY_CODE", "Value": localStorage.getItem("COMPANY_CODE") }, { "FieldName": "CALENDAR_CODE", "Value": localStorage.getItem("CALENDAR_CODE") }]
                        }, //ajax parameters
                        ajaxProgressiveLoad: "scroll",
                        ajaxProgressiveLoadScrollMargin: 75,
                        ajaxRequesting: function (url, params) {

                            var called = true;
                            if ($scope.filterBy.filterByValue) {
                                params.filter = {};
                                params.filter.field = $scope.filterBy.fieldByRecord;
                                params.filter.type = $scope.filterBy.filterByType;
                                params.filter.value = $scope.filterBy.filterByValue;
                            }
                            else {
                                params.filter = {};
                                if ($scope.filterBy.filterByType == 'Blank') {
                                    params.filter.field = $scope.filterBy.fieldByRecord;
                                    params.filter.type = $scope.filterBy.filterByType;
                                    params.filter.value = '';

                                }
                                if ($scope.filterBy.filterByType == 'NotBlank') {
                                    params.filter.field = $scope.filterBy.fieldByRecord;
                                    params.filter.type = $scope.filterBy.filterByType;
                                    params.filter.value = '';

                                }
                            }





                            var temp = _.filter(params.filters, function (fltr) {
                                var exists = _.findWhere($scope.formAllDatafields, { name: fltr.field });
                                if (!DataService.isEmpty(exists)) {
                                    //if (exists.type == "checkbox-group") {
                                    //    fltr.value = fltr.value == "Yes" ? "true" : "false";
                                    //}
                                }
                                return typeof fltr.value == "object"
                            });
                            if (params.sorters?.length == 0) {
                                params.sorters.push({ field: "formRecordOrder", dir: "asc" });
                            }
                            if (!DataService.isEmpty(temp)) {
                                if (typeof temp[0].value == "object")
                                    called = false;
                            }
                            if (called)
                                $('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                            return called; //abort ajax request

                        },
                        ajaxResponse: function (url, params, response) {
                            //url - the URL of the request
                            //params - the parameters passed with the request
                            //response - the JSON object returned in the body of the response.
                            debugger;
                            $('#form-records').unblock();
                            $.unblockUI();
                            var result = angular.copy(response.data);
                            _.each(result, function (item) {
                                //console.log(result,"result");
                                if ($scope.isTransactionForm) {
                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.Referral_Form_Fields_Multiple_name)) {
                                        var splitData = item[$scope.formDetailsDataInfo.Referral_Form_Fields_Multiple_name];
                                        if (!DataService.isEmpty(splitData)) {
                                            if (splitData.contains("#jMS#")) {
                                                splitData = splitData.split("#jMS#");
                                                var datetimeStartEnd = "";
                                                _.each(splitData, function (spItem) {
                                                    datetimeStartEnd += $scope.ToCustomDateTime(spItem) + " to ";
                                                });
                                                datetimeStartEnd = datetimeStartEnd.substring(0, datetimeStartEnd.length - 3);
                                                item[$scope.formDetailsDataInfo.Referral_Form_Fields_Multiple_name] = datetimeStartEnd;
                                            }
                                        }
                                    }
                                }
                                item.created_at = $scope.ToCustomDateTime(item.created_at);
                                item.updated_at = $scope.ToCustomDateTime(item.updated_at);
                            });
                            var temp = _.filter(result, function (item) { return (checkDeleteEditAccessRight(2, item)) });

                            response.data = temp;
                            if (!DataService.isEmpty(response.data)) {
                                return response;
                            }
                            else {
                                if ($scope.currentFormId == "2306" || $scope.currentFormId == "2304" || $scope.currentFormId == "2303" ) {
                                    window.location.href = "/calendar/index#/form/saveEntry/" + $scope.currentFormId;
                                    return null;
                                }
                                
                                return response;
                            }

                        },
                        paginationSize: $scope.paginationSizeFormRecords,

                    });

                $('.form-builder-loader').hide();
                var columnLayout = localStorage.getItem("tabulator-persisrecords-columns");
                if (columnLayout != null) {
                    columnLayout = JSON.parse(columnLayout);
                }
            }, 100);

        };
        $scope.updateRowDataRecord = function (param) {
            var newParam = {};
            newParam = angular.copy(param);
            newParam.action = 8;
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.updateFormRecord("UpdateFormRecord", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var dataTemp = response.data;
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.updateQueueRecord = function (param) {
            var newParam = {};
            newParam = angular.copy(param);
            newParam.action = 7;
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;

            mainService.updateFormRecord("UpdateFormRecord", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var dataTemp = response.data;

                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
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
                    //console.log(val);
                    val = val.replace('~', '');
                    var ext = val.substr(val.lastIndexOf('.') + 1);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150"  width="150"> </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                    } else if (ext == "xls" || ext == "xlsx") {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    } else {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
                });
                $('#galleryModal .modal-body').html(newHtml);
            } else {
                $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
            }

            $rootScope.$emit("HideLoading");

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
                                //angular.forEach(window["formGroupKeyList"], function (item) {
                                //    var idx = _.findIndex($scope.formDetailsDataTemp, { Id: item });
                                //    $scope.formDetailsDataTemp.splice(idx, 1);
                                //});
                                $timeout(function () {
                                    //tabulator.setData($scope.formDetailsDataTemp);
                                    bindtabulatorOnly("columns", $scope.formDetailsDataTemp);
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
        $scope.updateToggle = function () {
            //var isCalenderToggle = $stateParams.toggle;
            //if (angular.isDefined(isCalenderToggle)) {
            //    $scope.Toggle();
            //}
            $scope.formDetailsDataInfo.formSettings.tabulator.format =
                $scope.formDetailsDataInfo.formSettings.tabulator.format == "columns" ? "rows" : "columns";

            var param = {};
            //param = angular.copy($scope.formDetailsDataInfo);
            param.formSettings =
                JSON.stringify($scope.formDetailsDataInfo.formSettings);
            param.formId = $scope.formDetailsDataInfo.formId;
            param.action = 22;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            //notifierService.notifyMessage('success', 'Form Setting', response.data[0].Message);
                            //if (!DataService.isEmpty($scope.formDetailsDataInfo.formSettings))
                            //    if (!Array.isArray($scope.formDetailsDataInfo.formSettings))
                            //        $scope.formDetailsDataInfo.formSettings = JSON.parse($scope.formDetailsDataInfo.formSettings)

                            bindtabulatorOnly("columns", $scope.formDetailsDataTemp);
                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.importDataFile = function () {

            var files = document.getElementById("csvFile").files;
            if (!hasExtension('csvFile', ['.csv', '.xls', '.xlsx'])) {
                // ... block upload           
                notifierService.notifyMessage('error', 'Files', "file format should be .csv or .xls or .xlsx");
            } else {
                files.filename = files[0].name;
                if (files.filename.split('.').pop() != "csv" && $scope.importDataFileParam.fileType == "csv") {
                    notifierService.notifyMessage('error', 'Files', "Please select csv file");
                    return false;
                }
                else if (files.filename.split('.').pop() != "xls" && files.filename.split('.').pop() != "xlsx" && $scope.importDataFileParam.fileType == "xlsx") {
                    notifierService.notifyMessage('error', 'Files', "Please select xls or xlsx file");
                    return false;
                }
                $ngBootbox.hideAll();
                var fd = new FormData();
                //fd.append('file', files);
                angular.forEach(files, function (value, key) {
                    fd.append(key, value);
                });
                var reqType = "form";
                var uid = $scope.userDetail.Id;
                var isImportData = false;
                $rootScope.$emit("ShowLoading");
                var actionType = $scope.importDataFileParam.typeOfAction;
                //console.log($scope.importDataFileParam);
                mainService.uploadFile("UploadDataFile", fd, reqType, uid, "", "", $scope.currentFormId, "", isImportData, uid, actionType)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                if (response.data.length > 0) {
                                    notifierService.notifyMessage('success', 'FormRecord', "Record Imported Successfully");
                                    var formDetailsDataTemp = [];
                                    angular.forEach(response.data, function (item) {
                                        formDetailsDataTemp.push(item);
                                    });
                                    bindtabulatorOnly("columns", formDetailsDataTemp);

                                }
                            }
                        }
                        $rootScope.$emit("HideLoading");
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
            }
            //   console.log(files);
            //  alert('Hi');
        };
        $scope.importDataFilePop = function () {
            var dialog = $ngBootbox.customDialog({
                templateUrl: 'importFormData.html',
                scope: $scope,
                title: 'Import Dataset',
                size: "large"
                //  buttons: $scope.customDialogButtons
            });
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 250);

        };
        $scope.importDataFromForm = function () {
            $scope.importFormSearchList = [];
            var dialog = $ngBootbox.customDialog({
                templateUrl: 'formImportModal.html',
                scope: $scope,
                title: 'Import Form',
                size: "large"
                //  buttons: $scope.customDialogButtons
            });

            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();

                var options = {
                    url: function (phrase) {
                        return mainService.getCurrentEndPointUrl() + "/GetFormList";
                    },

                    getValue: "title",

                    template: {
                        type: "description",
                        fields: {
                            description: "formTag"
                        }
                    },

                    ajaxSettings: {
                        dataType: "json",
                        method: "POST",
                        data: {}
                    },

                    preparePostData: function (data) {
                        data.action = 16;
                        data.created_by = $scope.userDetail.Id;
                        data.title = $("#import-form-fields #sourceformName").val();
                        return data;
                    },

                    requestDelay: 400,

                    list: {
                        maxNumberOfElements: 10,
                        sort: {
                            enabled: true
                        },
                        match: {
                            enabled: true
                        },
                        onChooseEvent: function () {
                            var selectedItemValue = $("#import-form-fields #sourceformName").getSelectedItemData().formId;
                            $scope.sourceformId = selectedItemValue;
                            $("#import-form-fields #sourceformID").val(selectedItemValue).trigger("change");
                        }
                    }
                };
                $("#import-form-fields #sourceformName").easyAutocomplete(options);
            }, 250);

        };
        $scope.importDataFromFormSave = function () {
            // alert('Hi');
            // console.log($scope.sourceformId);
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.sourceFormId = $scope.sourceformId;
            param.formId = $scope.currentFormId;
            param.created_by = $scope.userDetail.Id;
            param.action = 2;
            mainService.importFormData("ImportFormData", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data)) {
                            if (response.data.length > 0) {
                                notifierService.notifyMessage('success', 'FormRecord', "Record Imported Successfully");
                                var formDetailsDataTempList = [];
                                angular.forEach(response.data, function (item) {
                                    formDetailsDataTempList.push(item);
                                });
                                bindtabulatorOnly("columns", formDetailsDataTempList);
                                $ngBootbox.hideAll();

                            }
                        }
                    } else {
                        notifierService.notifyMessage('error', 'FormRecord', "Record Field doesnot match.");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.searchPdf = function (searchParam) {
            // alert($scope.pdfParam.text);
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.userId = $scope.userDetail.Id;    // user's id.
            param.uid = $scope.userDetail.uid;     // user's uid.
            param.isPdfSearch = true;
            param.baseUrl = mainService.getBaseUrl();   // site's base url.
            param.searchType = searchParam;
            param.formId = $stateParams.formId;
            param.textToSearh = $scope.pdfParam.formKeyword;
            param.applicationId = $scope.formDetailsDataInfo.applicationId;
            mainService.manageApplication("ManageApplication", param)
                .then(function (response) {
                    var data = response.data;
                    if (data != null && angular.isDefined(data)) {
                        var files = data.matchedFiles;
                        //console.log(data);

                        if (angular.isDefined(files) && files.length > 0) {
                            loadPdfList(files, param.textToSearh, mainService.getBaseUrl());
                        }
                        else
                            alert(data.Message);


                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        function loadPdfList(response, keyword, baseUrl) {
            var loaderImg = baseUrl + "fg-assets/images/loader.gif'";
            var $modalBody = $('#searchModal .modal-body > div#search-results');
            $modalBody.empty();

            $("#searchModal .modal-body").block({ message: '<img src="' + loaderImg + '" width="50" />', css: { position: 'relative', width: '100%' } });
            $('#searchModal .modal-title').html('Showing results for: <strong>' + keyword + '</strong>');
            $('#searchModal').modal('show');

            //$.getJSON(ajaxUrl, function (response) {
            //console.log(response)
            if (response.length) {
                var numFiles = 0;
                $.each(response, function (key, value) {
                    var rowdata = value;
                    //console.log(rowdata);
                    var url = baseUrl + '/Templates/forms/pdfviewer.html?url=' + rowdata.matchedUrl + "&key=" + keyword + "&docType=pdf";
                    var matchFounds = rowdata.matchedFound;
                    var fileName = rowdata.name;
                    var formDetail = rowdata.formDetail[0];
                    var totalRec = 0;
                    $.each(matchFounds, function (key1, value1) {
                        var arr = value1;
                        //console.log(arr);
                        $.each(arr, function (index, val) {
                            totalRec = totalRec + parseInt(val);
                        });


                    });
                    //  console.log(rowdata);
                    var record = fileName + '  ' + '<b>(' + totalRec + ' matches)</b>';
                    $modalBody.append(
                        '<a class="list-group-item" target="_blank" href="' + url + '">' + record + ' </a>'/*<b>(' + totalRec.toString() + ' matches)</b>*/
                    );
                    numFiles++;
                });
                if (numFiles === 0) {
                    $("#searchModal .modal-body").unblock();
                    $modalBody.append(
                        '<a class="list-group-item" href="javascript:;">No attachment found.</a>'
                    );
                }
                else {
                    $("#searchModal .modal-body").unblock();

                }


            }
            else {
                alert('No attachments were found.');
                $("#searchModal .modal-body").unblock();
            }
            //});
        };
        $scope.setInformationLink = function () {

            var InfoFormId = $scope.formDetailsDataInfo.informationFormID;
            var isAllowShow = $scope.formDetailsDataInfo.InformationOnly;

            var baseurl = mainService.getBaseUrl();
            var link = "";
            if (!DataService.isEmpty(InfoFormId)) {
                link = baseurl + "/#/form/show/" + InfoFormId.toString();
            }
            else
                link = "#";

            $scope.InformationLink.url = link;
            if (!DataService.isEmpty(isAllowShow) && !DataService.isEmpty(isAllowShow)) {
                $scope.InformationLink.isAllow = isAllowShow.toString();
            }

            //console.log('dsdsd' + $scope.InformationLink.url);

        };
        $scope.gotoInformationPage = function () {
             
            var url = $scope.InformationLink.url;
            var setPreviousPage = window.location.href;
            CookiesPersistenceService.setCookieData("informationBackLink", setPreviousPage);
            var param = {};
            param.action = 4;
            param.formId = $scope.formDetailsDataInfo.informationFormID;
            $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    var data = response.data[0];
                    var linkMode = data.informationFormLinkMode;
                    if (angular.isDefined(linkMode)) {
                        if (linkMode == '0') {
                            window.open(url, '_blank');
                        }
                        else if (linkMode == '1') {
                            window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1000,height=1000");

                        }
                        else if (linkMode == '2') {
                            // alert('mode is 2');
                            window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=1000,height=1000");

                        }





                    }
                    //console.log(data);
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
            $rootScope.$emit("HideLoading");




        };
        //Start Scope object to open or close Chat-Box      
        $scope.classM = "";
        $scope.class = "hide";
        $scope.changeClass = function () {
            if ($scope.class === "hide")
                $scope.class = "";
            else
                $scope.class = "hide";

            if ($scope.classM === "hide")
                $scope.classM = "";
            else
                $scope.classM = "hide";
        };
        
        //filter
        $scope.filterPath = function (path) {
            var filename = path.replace(/^.*[\\\/]/, '')
            return filename;
        };
        $scope.imgError = function (img) {
            img.error = "";
            img.src = "newAssets/images/user_geligulu.png";
        }
        $scope.scroll = function () {
            $scope.last = $scope.roomChatDetails.chatHistory[$scope.roomChatDetails.chatHistory.length - 1];
            let listHeight = $('#chat_list').outerHeight(),
                //$chatList = $('.chatListContainer ').find('.chats-list');
                $chatList = $('.chatListContainer ');
            $chatList.animate({ scrollTop: listHeight }, 1500)
        }
       
        $scope.gotoAnchor = function (x) {
            var newHash = 'div_' + x;
            var objDiv = document.getElementById(newHash);
            if (!DataService.isEmpty(objDiv))
                objDiv.scrollIntoView(false);
            else {
            }

        };
        //Send Private Alert, is commented because of bug
       
     
        $scope.changeClassPrivate = function () {
            if ($scope.classPrivate === "hide")
                $scope.classPrivate = "";
            else
                $scope.classPrivate = "hide";

            if ($scope.classMPrivate === "hide")
                $scope.classMPrivate = "";
            else
                $scope.classMPrivate = "hide";
        };
        $scope.CheckApproval = function () {
            $rootScope.$emit("ShowLoading");
            var approvalobj = $scope.approvalbtns;//$scope.approvalbtns
            var recordids = "";
            var selectedRows = tabulator.getSelectedRows();
            $(tabulator.getSelectedRows()).each(function (i, row) {
                // //console.log(row.getData().Id, 'row');
                recordids = recordids + row.getData().Id + ","
            });
            //console.log(recordids, 'recordids');
            if (approvalobj.length != 0 && recordids != "" && $(tabulator.getSelectedRows()).length == 1) {
                //var retVal = confirm("You are about to start " + approvalobj[0].awst_workflow_name);
                $rootScope.$emit("HideLoading");
                swal({
                    title: 'Approval',
                    text: "You are about to start " + approvalobj[0].awst_workflow_name,
                    //type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then(function (isConfirm) {
                    if (isConfirm.value == true) {
                        var param = {};
                        param.selectedRecords = recordids;
                        param.formId = $stateParams.formId;
                        param.created_by = $scope.userDetail.Id;
                        param.userId = $scope.userDetail.Id;
                        param.functioncode = "Submit";
                        $rootScope.$emit("ShowLoading");
                        mainService.manageApprovalHistory("ManageApprovalHistory", param)
                            .then(function (response) {
                                if (response.data != null && angular.isDefined(response.data)) {
                                    //console.log(response.data[0], 'A.history');
                                    $scope.approvalHist = response.data[0];
                                    var frmData = response.data;
                                    var resub_allow = "";
                                    var already_appr = "";
                                    var appr_inpro = "";
                                    $(frmData).each(function (i, val) {
                                        if ((frmData[i].awhd_original_status).toLowerCase() == "return") {
                                            resub_allow = resub_allow + frmData[i].app_master_TransactionId + ",";
                                        }
                                        else if ((frmData[i].awhm_workflow_name).toLowerCase() == "completed" && (frmData[i].awhd_original_status).toLowerCase() != "return") {
                                            already_appr = already_appr + frmData[i].app_master_TransactionId + ",";
                                        }
                                        else if ((frmData[i].awhm_workflow_name).toLowerCase() != "completed" && (frmData[i].awhd_original_status).toLowerCase() != "return") {
                                            appr_inpro = appr_inpro + frmData[i].app_master_TransactionId + ",";
                                        }
                                    });


                                    var y = recordids.split(',');
                                    var removeItem = already_appr.split(',');
                                    var removeapp = appr_inpro.split(',');
                                    for (var i = 0; i < y.length; i++) {
                                        //delete approved item
                                        for (var j = 0; j < removeItem.length; j++) {
                                            y =
                                                jQuery.grep(y, function (value) {
                                                    return value != removeItem[j];

                                                });
                                        }

                                        //delete in-progress item
                                        for (var k = 0; k < removeapp.length; k++) {
                                            y =
                                                jQuery.grep(y, function (value) {
                                                    return value != removeapp[k];

                                                });
                                        }

                                    }
                                    param.selectedRecords = y.join(",");
                                    //console.log(param.selectedRecords, 'filtered array')

                                    if (param.selectedRecords != "") {
                                        //var retVal = confirm("Rows with Id: " + param.selectedRecords + " are allowed to submit");
                                        //var retVal = confirm("Selected row is valid for approval,do you want to continue?");
                                        $rootScope.$emit("HideLoading");
                                        swal({
                                            title: 'Approval',
                                            text: "Selected row is valid for approval,do you want to continue?",
                                            type: 'success',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes',
                                            cancelButtonText: 'No'
                                        }).
                                            then(function (isConfirm) {

                                                if (isConfirm.value == true) {
                                                    $rootScope.$emit("ShowLoading");
                                                    mainService.submitForApproval("submitForApproval", param)
                                                        .then(function (response) {
                                                            //console.log(response);
                                                            if (response.data != null && angular.isDefined(response.data)) {
                                                                $rootScope.$emit("HideLoading");
                                                                //notifierService.notifySweetAlertMessage('success', 'Approval', response);
                                                            }
                                                        }, function (err) {
                                                            $rootScope.$emit("HideLoading");
                                                            console.log("some error occured." + err);
                                                        });
                                                }
                                                else {
                                                    $rootScope.$emit("HideLoading");
                                                    return false;
                                                }
                                            })

                                    }

                                    else {
                                        $rootScope.$emit("HideLoading");
                                        notifierService.notifySweetAlertMessage('error', 'Approval', "Selected record is not valid for approval submission");
                                    }
                                }
                            },
                                function (err) {
                                    $rootScope.$emit("HideLoading");
                                    console.log("some error occured." + err);
                                });
                    }
                    else {
                        $rootScope.$emit("HideLoading");
                        return false;
                    }
                });

            }
            else {
                $rootScope.$emit("HideLoading");
                notifierService.notifyMessage('warning', 'Folder', 'Please select one row.');
            }

            return false;
        };
        $scope.showAdvancedSearch = function () {
            $scope.isShowAdvanceSearch = !$scope.isShowAdvanceSearch;
        };

        $scope.selectFormLanguage = function (languageId) {
            if (localStorage.getItem("globalLang") == null) {
                localStorage.setItem("globalLang", languageId);
                localStorage.setItem("globalLangForm", languageId);
                window.location.reload();
            } else {
                if (localStorage.getItem("globalLang") != null && languageId != localStorage.getItem("globalLang") || languageId != localStorage.getItem("globalLangForm")) {
                    localStorage.setItem("globalLang", languageId);
                    localStorage.setItem("globalLangForm", languageId);
                    window.location.reload();
                }
            }
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

        $scope.bindtabulatorOnly = bindtabulatorOnly;
    });
}(FormGeneratorApp));