(function () {
    'use strict';
    /*18022021 saif calender controller */
    FormGeneratorApp.controller('FormEntryCalenderController', function ($scope, $rootScope, CookiesPersistenceService, $http, $state, $location, $window, $ngBootbox, $timeout, mainService, notifierService, $stateParams, DataService) {

        function showFooter(type) {
            if (!DataService.isEmpty(type.column_calculation))
                return type.column_calculation;
            else
                return "";
        }
        var arrowImage = function (cell, formatterParams) {
            var filename = cell.getValue();
            if (!DataService.isEmpty(filename) && filename != "null") {
                filename = filename.replace('~', '');
            }
            if (!DataService.isEmpty(filename) && filename != "null") {
                var ext = filename.substr(filename.lastIndexOf('.') + 1);
                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                    return "<img src='" + mainService.getBaseUrl() + filename + "' width='150'>";
                }
                else {
                    var nameddd = filename.substring(filename.lastIndexOf('/') + 1);
                    return "<a href=" + mainService.getBaseUrl() + filename + " title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a>";
                }
            }
            else
                return "<img src='' width='150'>";
        };
        var arrowDataFormat = function (cell, formatterParams) {
            var exists;
            var data = cell.getValue();
            if (!DataService.isEmpty(data)) {
                var splitData = data;
                if (splitData.contains("#jMS#")) {
                    splitData = splitData.split("#jMS#");
                    var datetimeStartEnd = "";
                    _.each(splitData, function (spItem) {
                        datetimeStartEnd += $rootScope.ToCustomDateTime(spItem) + " to ";
                    });
                    datetimeStartEnd = datetimeStartEnd.substring(0, datetimeStartEnd.length - 3);
                    data = datetimeStartEnd;
                }
                return data;
            } else {
                return !DataService.isEmpty(data) ? data : "";
            }
        };
        $scope.userDetails = mainService.loginDetails();
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
        };

        $scope.promptProtectedPassword = function (formPassword, formString, formID, baseUrl) {
            bootbox.dialog({
                onEscape: function () {
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
        };
        function getRandom(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        var isAnonymous = function (searchVal) {
            var signUpString = "signUp";
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
                                f.setAttribute('id', "redirect_form");
                                f.setAttribute('class', "hidden");
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
                                var e = document.createElement("input");
                                e.setAttribute('type', "text");
                                e.setAttribute('name', "type");
                                e.setAttribute('value', 'anonymous');
                                f.appendChild(a); f.appendChild(b); f.appendChild(c);
                                f.appendChild(e);
                                document.body.appendChild(f);
                                quickSignUp('anonymous');
                            }
                        },
                        ok: {
                            label: "Login",
                            className: 'btn-info',
                            callback: function () {
                                bootbox.dialog({
                                    title: "Quick login",
                                    message:
                                        '<div class="card panel-default">' +
                                        '<div class="row">' +
                                        '<div class="col-sm-12">' +
                                        '<form id="quickLogin1" >' +
                                        '<div class="col-sm-12 form-group row ">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">User Name / Email</label></div>' +
                                        '<div class="col-sm-6">' +
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
                                        '</form></div></div></div>',
                                    closeButton: false
                                })
                            }
                        }
                    },
                    closeButton: false
                });
            }
        };
        var multilFiles = function (cell, formatterParams) {
            var temp = !DataService.isEmpty(cell.getValue()) ? cell.getValue() : "";
            var images = [];
            images = temp.split(',');
            if (images.length > 1)
                return '<button type="button" class="btn btn-xs btn-default" data-toggle="modal" data-target="#galleryModal"  title="Show all files" data-formGroupKey="' + cell.getData().formGroupKey + '"> Show all files</button> ';
            else
                return arrowImage(cell, formatterParams);
        };
        function getAllFiles1(formData, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param = formData;
            var images = param;
            if (!DataService.isEmpty(images)) {
                images = images.split(',');
                var newHtml = '';
                $.each(images, function (i, val) {
                    val = val.replace('~', '');
                    var ext = val.substr(val.lastIndexOf('.') + 1);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>&nbsp';
                    } else if (ext == "xls" || ext == "xlsx") {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp";
                    } else {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp";
                    }
                });
                $('#galleryModal .modal-body').html(newHtml);
            } else {
                $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
            }
        };
        $scope.init = function () {


            $scope.autogeneratedFieldList = [];
            $scope.InformationLink = {};
            $scope.editRowTempData = {};
            $scope.formDetailsDataTemp = [];
            window["listOfOutput"] = [];
            $scope.keypressIdle = 1500;
            $scope.formFieldsParam = {};
            bootbox.hideAll();
            $scope.isSaveEvent = false;
            $scope.formFields = [];
            $scope.formDataList = {};
            $scope.subscription = {};
            $scope.subscription.isAllowToLoad = true;
            $scope.pageLength = 0;
            $scope.entryForOneToMany = false;
            $scope.htmlContentData = "";
            $scope.userDetail = mainService.loginDetails();
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.freshEntryformGroupKey = "";
            if (!DataService.isEmpty($stateParams.popup)) {
                $scope.entryForOneToMany = true;
                localStorage.removeItem("formOneData");
            }
            if (!DataService.isEmpty($stateParams.cname)) {
                $scope.defaultSelected = true;
            }
            if (!DataService.isEmpty($stateParams.start)) {
                $scope.default_sdate = true;
            }
            if (!DataService.isEmpty($stateParams.end)) {
                $scope.default_edate = true;
            }
            if (!DataService.isEmpty($stateParams.customForms)) {
                $scope.customForms = $stateParams.customForms;
                $scope.customFormIds = $stateParams.customFormIds;
            }
            if (!DataService.isEmpty($stateParams.parentFormId)) {
                $scope.eventId = $stateParams.eventId;
                $scope.parentFormId = $stateParams.parentFormId;
            }
            loadFormHtml();
            $scope.formFieldExcelParam = {};
            $scope.listOfOutput = [];
            $scope.formFieldExcelParam.listOfOutput = [];
            $scope.formFieldExcelParam.listOfInput = [];
            $scope.formFieldExcelParam.inputDataExcel = {};
            $scope.formDataInfo = {};
            $scope.time = {};
            $scope.userDetail = mainService.loginDetails();
            $timeout(function () {
                if ($("#form-table").length)
                    window["popupTabulator"] = initTabulator("form-table", {
                        selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                    });
            }, 450);
            window["uploadPath"] = mainService.getBaseUrl();
            $scope.listOfReferrenceFields = [];
            $scope.autoGeneratedId = "";
            $scope.languageList = [];
            $scope.formSelectedLanguageId = "1";
            $scope.getLanguage();
        };
        function defaultSelectedControl() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    var item = $(this).val();
                    if (!DataService.isEmpty(item))
                        if (item.toString() === value.toString()) {
                            $(this).prop("checked", true);
                        }
                });
                $("#customFormNew select[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    $(this).val(value);
                    $(this).prop("disabled", "disabled");
                });
            }, 450);
        };
        function defaultStartDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.start + "]").each(function () {
                    var value = $stateParams.svalue;
                    $(this).val(value);
                });
            }, 120);
        };
        function defaultEndDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.end + "]").each(function () {
                    var value = $stateParams.tvalue;
                    $(this).val(value);
                });
            }, 120);
        };
        function imagelessCaptchaVerification($elem, $submit) {
            var invalid = 0;
            var userAnswer = Number($elem.val());
            var answer = Number($elem.parent().data('answer'));
            if (userAnswer !== answer) {
                invalid = 1;
                $elem.parents('.form-group').addClass('has-error');
                $submit.addClass('disabled');
                $submit.attr('disabled', 'disabled');
            } else {
                $submit.removeClass('disabled');
                $submit.removeAttr('disabled');
                $elem.parents('.form-group').removeClass('has-error');
            }
            return invalid;
        };
        function updateFormData() {
            var obj = {};
            updatetable = $("#lblFormName").val().trim().replace('_EDIT', '');
            //For main Form Controls
            var objCtrl = {};
            $("#customForm :input").each(function () {
                if (($(this).prop('type') == 'text' || $(this).is("textarea") || $(this).prop('type') == 'email') || $(this).prop('type') == 'password' && !$(this).parent().hasClass('date')) {
                    var ctrlname = $(this).attr('name');
                    obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                }
                else if ($(this).prop('type') == 'number') {
                    var ctrlname = $(this).attr('name');
                    obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                }
                else if ($(this).parent().hasClass('date')) {
                    var ctrlname = $(this).attr('name');
                    if (jQuery.isEmptyObject($(this).val()) != true) {
                        showdate = new Date($(this).val().split('-')[0], $(this).val().split('-')[1] - 1, $(this).val().split('-')[2]);
                        obj[ctrlname] = showdate;
                    }
                    else {
                        obj[ctrlname] = new Date(1900, 0, 1);
                    }
                }
                else if ($(this).prop('type') == 'checkbox' || $(this).prop('type') == 'radio') {
                    var ctrlname = $(this).attr('name').replace('[]', '');
                    obj[ctrlname] = $(this).prop('checked');
                }
            });
            $("#customForm").find('select').not('#ddlLanguage').each(function () {
                var ctrlname = $(this).attr('name').replace('[]', '');
                obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
            });
            var ctrlname = 'TableId';
            obj[ctrlname] = $('#hfIsOptId').val().trim();
            var ctrlname = 'created_at';
            obj[ctrlname] = '';
            var ctrlname = 'updated_at';
            obj[ctrlname] = '';
            updateParameter = { 'tableData': JSON.stringify(obj), 'tableName': updatetable };
            $.ajax({
                type: "POST",
                url: '/FormMaster/updateTableData',
                data: updateParameter,
                async: false,
                success: function (data) {
                    if (data.trim() == 'success') {
                        alert("@Resources.Resource.Recordupdatedsuccessfully", "success");
                        var dialog = confirm("Do want to exit?");
                        var LanguageId = $("#ddlLanguage :selected").val();
                        var FormId = $("#hfFormId").val();
                        if (dialog == true) {
                            window.location.href = '/FormMaster/FormMasterTabulator?FormId=4040&LanguageId=' + LanguageId;// + '&optid=' + obj['TableId'];
                        }
                        else {
                            location.reload(true);
                        }
                        return false;
                    }
                    else
                        alert(data);
                }
            });
        };
        function customEntryElementsValidation() {
            // imageless captcha varification
            var $submit = $('#customFormNew').find('button.btn[type="submit"]');
            $(document).on('keyup', 'input.cp_text',
                function () {
                    imagelessCaptchaVerification($(this), $submit);
                });
            var newWindow = null, validationCount = 0, validattfrm = '';
            $(document).on('click', '.btn-edit', function (e) {
                e.preventDefault();
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea').removeAttr('readonly');
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea,.date').removeClass('editable-area')
                $('#FormBody .form-group select').removeAttr(('disabled'));
                $('#FormBody .form-group .date input[type=text]').removeClass('disabled');
                $('#FormBody .form-group  input[type=email]').removeAttr('disabled');
                $('#FormBody .form-group  input[type=password]').removeAttr('disabled');
                $('#btn_save').attr('value', '@Resources.Resource.Submit');
                $('#btn_save').removeClass('btn-edit').addClass('btn-success');
            });
            $(document).on('click', '#btn_exit', function (e) {
                var IsPopUp = $("#hfIsPopUp").val();
                if (IsPopUp == 1) {
                    window.close();
                }
                else {
                    var url = '@Url.Action("FormMasterTabulator", "FormMaster", new {FormId = "__FormId__"})';
                    window.location.href = url.replace('__FormId__', 4040).replace("&amp;", "&");
                }
            });
            var uploadPath = "", popupTabulator, tabulators;
            $(document).on('click', '.btn-success', function (e) {
                if (getParameterByName('optid') != null) {
                    e.preventDefault();
                    if ($(this).attr('value') == '@Resources.Resource.Edit')
                        return false;
                    updateFormData();
                }
                else {
                    console.log('validationCheck');
                    var arrCtrl = [];
                    var arrRelationCtrl = [];
                    var objCtrl = {};
                    //Push FormName To Array
                    objCtrl["Name"] = "TableName";
                    objCtrl["Value"] = $("#lblFormName").val();
                    arrCtrl.push(objCtrl);
                    //For main Form Controls
                    $("#customForm :input").each(function () {
                        var objCtrl = {};
                        if ($(this).attr('type') == 'text' || $(this).is("textarea") || $(this).attr('type') == 'email' || $(this).attr('type') == 'password') {
                            objCtrl["Name"] = $(this).attr('name');
                            if ($(this).parent().hasClass('date')) {
                                objCtrl["DataType"] = "Date";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            else {
                                objCtrl["DataType"] = "Text";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'number') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                            objCtrl["DataType"] = "Number";
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'date') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? Date.parse($(this).val(), "yyyy-MM-dd HH:mm:ss") : '');
                            objCtrl["DataType"] = "Date";
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = $(this).prop("checked");
                            objCtrl["DataType"] = "Bool";
                            arrCtrl.push(objCtrl);
                        }
                    });
                    $("#customForm").find('select').not('#ddlLanguage').each(function () {
                        var objCtrl = {};
                        objCtrl["Name"] = $(this).attr('name');
                        objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                        objCtrl["DataType"] = "Text";
                        arrCtrl.push(objCtrl);
                    });
                    //For Tabulator
                    $('.tab-content .tab-pane .tabulator').each(function () {
                        var tableIds = [];
                        $(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').each(function () {
                            tableIds.push({ "Name": 'TableId', "Value": $.trim($(this).text()), "DataType": 'Number' });
                        })
                    })
                    if (tabulators != undefined)
                        arrRelationCtrl.push(tabulators);
                    $("#hfJsonContent").val(JSON.stringify(arrCtrl));
                    $("#hfJsonRelationContent").val(JSON.stringify(arrRelationCtrl));
                }
            });
            var checkValue = setInterval(function () {
                if (newWindow != null) {
                    if (newWindow.closed) {
                        newWindow = null;
                        location.reload(true);
                        reloadTabulator();
                    }
                }
            }, 1000);
            $('button[type="submit"], button[type="submitexcel"]').unbind("click");
            $('button[type="submit"], button[type="submitexcel"]').on('click', function (elementButton) {
                let $this = $(this),
                    currentType = $this.attr('type');
                localStorage.setItem("submitType", currentType);
                if (validationCount == 0) {
                    validattfrm = $('#customFormNew').formValidation({
                        framework: 'bootstrap',
                        excluded: [':disabled'],
                        icon: {
                            valid: '',
                            invalid: '',
                            validating: 'fa fa-sync fa-pulse'
                        }
                    })
                        .on('success.form.fv', function (e, data) {
                            e.preventDefault();
                            // data.fv      --> The FormValidation instance
                            // data.element --> The field element                  
                            var invalid = 0;
                            if ($("input.cp_text").length) {
                                var $submit = $('#customFormNew').find('button.btn[type="submit"]');
                                $("input.cp_text").each(function () {
                                    let status = imagelessCaptchaVerification($(this), $submit);
                                    invalid = invalid + status;
                                });
                                if (invalid > 0) {
                                    return false;
                                } else {
                                    angular.element(this).scope().onEntryFormSubmit();
                                }
                            }
                            else {
                                if (localStorage.getItem("submitType") != null) {
                                    currentType = localStorage.getItem("submitType")
                                }
                                if (currentType == "submitexcel") {
                                    textBoxLoader(true);
                                    if ($scope.formFieldExcelParam.listOfInput.length > 0) {
                                        angular.forEach($scope.formFieldExcelParam.listOfOutput, function (item) {
                                            $("#" + item.id).val(item.value);
                                            $("#" + item.id).addClass("loader");
                                        })
                                        updateExcel(false);
                                    }
                                    $this.closest('form').find('button[type="submit"]').removeAttr('disabled');
                                    $this.closest('form').find('button[type="submit"]').removeClass('disabled');
                                }
                                else {
                                    $scope.onEntryFormSubmit();
                                }
                                localStorage.removeItem("submitType")
                            }
                        });
                    validationCount = 1;
                }
            });
        };
        /* Ajax request for populating the dropdowns */
        $(document).on("change", ".call_populate_fields", function () {
            populateFieldsNew($(this), mainService.getCurrentEndPointUrl() + "/getBindDropdown");
        });

        function deselecAll(form_id) {
            $("form select[data-referral-form-id='" + form_id + "']")
                .each(function (index) {
                    $(this).prop("selected", false);
                    $(this).val('0');
                });
        };

        function populateFieldsNew($this, ajaxUrl) {
            var form_id = $this.attr("data-referral-form-id"),
                field_name = $this.attr("data-referral-form-field-name"),
                dependent_fields = $this.attr("data-dependent_field_names"),
                input_value = $this.val(),
                input_id = $this.attr("id"),
                query = "";

            $("form select[data-referral-form-id='" + form_id + "']")
                .each(function (index) {
                    var svId = $(this).attr('id');
                    var svfield_name = $(this).attr('data-referral-form-field-name');
                    var svValue = $(this).val();
                    if (svId == input_id && index == 0) {
                        deselecAll(form_id);
                        $("#" + input_id).val(svValue);
                    }
                    if (svValue != 0 && dependent_fields !== '' && svValue != null)
                        query += svfield_name + " = '" + svValue + "' and "
                });
            query = query.substring(0, query.length - 4);
            if (dependent_fields !== '' && dependent_fields != undefined) {
                var dependent_fields_arr = dependent_fields.split(',');
                if (input_value !== '') {
                    $rootScope.$emit("ShowLoading");
                    $('.favicon-loader-overlay').addClass('active');
                    $rootScope.$emit("ShowLoading");
                    $.ajax({
                        url: ajaxUrl,
                        type: "GET",
                        data: { formId: form_id, selectedValue: input_value, field_name: field_name, dependent_fields: dependent_fields, query: query },
                        dataType: "json",
                        beforeSend: function () {
                        },
                        success: function (result) {
                            if (result) {
                                if (dependent_fields_arr != undefined) {
                                    $timeout(function () {
                                        dependent_fields_arr.forEach(function (dependent_field) {
                                            var referral_field_name = $('#' + dependent_field).attr('data-referral-form-field-name');
                                            $('#' + dependent_field + ' option').each(function () {
                                                var optionValue = $(this).attr('value');
                                                if (optionValue !== '' && optionValue != "0") {
                                                    var existData = _.filter(result, function (item) { return item[referral_field_name] == optionValue });
                                                    if (existData.length == 0) {
                                                        $(this).prop('disabled', true);
                                                        $(this).hide();
                                                    } else {
                                                        $(this).prop('disabled', false);
                                                        $(this).show();
                                                    }
                                                } else {
                                                    $(this).prop('disabled', false);
                                                    $(this).prop('selected', true);
                                                    $(this).show();
                                                }
                                            });
                                        });
                                    }, 150);
                                } else {
                                    $('#' + input_id + ' option').each(function () {
                                        var optionValue = $(this).attr('value');
                                        if (optionValue !== '') {
                                            var existData = _.filter(result, function (item) { return item[referral_field_name] == optionValue });
                                            if (existData.length == 0) {
                                                $(this).prop('disabled', true);
                                                $(this).hide();
                                            } else {
                                                $(this).prop('disabled', false);
                                                $(this).show();
                                            }
                                        }
                                    });
                                }
                            }
                            $rootScope.$emit("HideLoading");
                        },
                        complete: function () {
                            $('.favicon-loader-overlay').removeClass('active');
                            $rootScope.$emit("HideLoading");
                        }
                    });
                } else {
                }
            }
        };

        function loadFormHtml() {
            var formGroupKey = $stateParams.formGroupKey;
            var formId = $stateParams.formId;
            $scope.rowId = $stateParams.Id;
            $rootScope.$emit("ShowLoading");
            $timeout(function () {
                if (angular.isDefined(formId)) {
                    $scope.currentFormId = formId;
                    var param = {};
                    param.customForms = $scope.customForms;
                    param.customFormIds = $scope.customFormIds;
                    param.created_by = $scope.userDetail.Id;
                    param.formId = formId;
                    if (localStorage.getItem("globalLang") != null) {
                        if (localStorage.getItem("globalLangForm") != null) {
                            param.language = localStorage.getItem("globalLangForm");
                        } else {
                            param.language = localStorage.getItem("globalLang");
                        }
                    }
                    $scope.isEdit = false;
                    if ($stateParams.popup == 2) {
                        if (localStorage.getItem("formGroupKey" + formId) == null) {
                            $scope.freshEntryformGroupKey = create_UUID();
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        } else {
                            $scope.freshEntryformGroupKey = localStorage.getItem("formGroupKey" + formId);
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        }
                    }
                    if (angular.isDefined(formGroupKey)) {
                        if (!DataService.isEmpty($stateParams.eventId)) {
                            $scope.isSaveEvent = true;
                            param.action = 7;
                            $scope.isEdit = false;
                            param.formGroupKey = formGroupKey;
                            $scope.getFormSettings(param);
                        }
                        else {
                            $scope.isEdit = true;
                            param.action = 6;
                            param.formGroupKey = formGroupKey;
                            param.Id = $scope.rowId;
                            $scope.formGroupKey = param.formGroupKey;
                            $scope.getFormSettings(param);
                            $("#formGroupKey").val($scope.formGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.formGroupKey);
                        }
                    } else {
                        param.action = 7;
                        $scope.isEdit = false;
                        $scope.isSaveEvent = true;
                        $scope.freshEntryformGroupKey = create_UUID();
                        if (localStorage.getItem("formGroupKey" + formId) == null) {
                            $scope.freshEntryformGroupKey = create_UUID();
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        } else {
                            $scope.freshEntryformGroupKey = localStorage.getItem("formGroupKey" + formId);
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        }
                        $scope.getFormSettings(param);
                    }
                }
            }, 450);
        };

        function makeIncrementedAutoId(autoIdParam, item) {
            var autoId = "";
            var incrementedData = 0;
            autoId = $("input[name=" + autoIdParam + "]").val();
            if (!DataService.isEmpty(autoId)) {
                var splitData = autoId.split(item.value);
                if (splitData.length > 0) {
                    if (splitData.length > 1)
                        var incremt = splitData[1];
                    var incremntlength = incremt.length;
                    incrementedData = parseInt(incremt);
                    incrementedData++;
                    var newIncremntLenght = incrementedData.toString().length;
                    var zeroAdd = "";
                    for (var i = 0; i < incremntlength - newIncremntLenght; i++) {
                        zeroAdd += "0";
                    }
                    incrementedData = zeroAdd + incrementedData.toString();
                    var newAutoId = item.value + incrementedData;
                    if (!$scope.isEdit) {
                        $("input[name=" + autoIdParam + "]").val(newAutoId);
                        $scope.autoGeneratedIdTemp.autoGeneratedIdTemp = newAutoId;
                        $scope.autoGeneratedIdTemp.oldId = item.value + incremt.toString();
                    }
                    return incrementedData;
                }
            }
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
                        $scope.languageList = response.data;
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.refreshButtonFunc = function () {
            var param = {};
            param.action = 1;
            param.formId = $scope.currentFormId;
            var sessionName = CookiesPersistenceService.getCookieData("MyQueue_100");
            angular.forEach($scope.autogeneratedFieldList, function (item) {
                if (item.type == "autogenerated-field") {
                    param.autoGeneratedId = item.value;
                    param.autoGeneratedFieldName = item.name;
                    if (!DataService.isEmpty(item.lower_range)) {
                        param.autoGeneratedId += item.lower_range.toString();
                    }
                    else if (!DataService.isEmpty(item.upper_range)) {
                    }
                }
                else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                    item.subtype == "queue server" || item.subtype == "queue session")) {
                    if (item.subtype == "current position") {
                        param.currentpositionFieldName = item.name;
                    }
                    else if (item.subtype == "last position") {
                        param.lastpositionFieldName = item.name;
                    }
                    else if (item.subtype == "queue session") {
                        if (!DataService.isEmpty(sessionName)) {
                            $("#" + item.name).val(sessionName);
                        }
                    }
                }
                else if (!DataService.isEmpty(item.types) && item.types == "waiting_records")
                    param.waitingrecordsFieldName = item.name;
                else if (!DataService.isEmpty(item.types) && item.types == "status")
                    param.fieldName = item.name;
            });
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.getPositions("getPositions", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.totalWaitingRecord = response.data.waitingrecords;
                        $("#" + response.data.waitingrecordsFieldName).val(response.data.waitingrecords)
                        if (!DataService.isEmpty(response.data.currentposition)) {
                            if (!$scope.isEdit)
                                $("#" + response.data.currentpositionFieldName).val(response.data.currentposition)
                            $scope.autoGeneratedIdTemp = _.findWhere($scope.autogeneratedFieldList, {
                                type: "autogenerated-field"
                            });
                            $scope.autoGeneratedIdTemp.currentposition = response.data.currentposition;
                            if (!DataService.isEmpty($scope.autoGeneratedIdTemp)) {
                                if (!$scope.isEdit) {
                                    $("input[name=" + $scope.autoGeneratedIdTemp.name + "]").val(response.data.lastposition)
                                    $scope.autoGeneratedIdTemp.oldId = angular.copy(response.data.lastposition);
                                }
                                makeIncrementedAutoId($scope.autoGeneratedIdTemp.name, $scope.autoGeneratedIdTemp);
                            }
                            angular.forEach($scope.autogeneratedFieldList, function (item) {
                                if (item.type == "autogenerated-field") {
                                    param.autoGeneratedFieldName = item.name;
                                    if (!DataService.isEmpty(item.lower_range)) {
                                    }
                                    else if (!DataService.isEmpty(item.upper_range)) {
                                    }
                                }
                                else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                                    item.subtype == "queue server" || item.subtype == "queue session")) {
                                    if (item.subtype == "current position") {
                                        param.currentpositionFieldName = item.name;
                                    }
                                    else if (item.subtype == "last position") {
                                        var startQueue = $scope.autoGeneratedIdTemp.lower_range;
                                        var incremntlength = startQueue.length;
                                        var incrementedData = parseInt(startQueue);
                                        var newIncremntLenght = incrementedData.toString().length;
                                        var zeroAdd = "";
                                        for (var i = 0; i < incremntlength - response.data.total_records.toString().length; i++) {
                                            zeroAdd += "0";
                                        }
                                        if (!DataService.isEmpty($scope.totalWaitingRecord) && $scope.totalWaitingRecord > 1) {
                                            param.lastpositionFieldName = item.name;
                                            $("#" + response.data.lastpositionFieldName).val(response.data.lastposition.toString())
                                        }
                                        else {
                                            param.lastpositionFieldName = item.name;
                                            $("#" + response.data.lastpositionFieldName).val($scope.autoGeneratedIdTemp.value + zeroAdd + response.data.total_records.toString())
                                        }
                                    }
                                }
                            });
                        } else {
                            $("#" + response.data.currentpositionFieldName).val(response.data.autoGeneratedId)
                            $("#" + response.data.lastpositionFieldName).val("--")
                            $("input[name=" + response.data.autoGeneratedFieldName + "]").val(response.data.autoGeneratedId);
                        }
                        if ($scope.isEdit) {
                            $("#" + $scope.autoGeneratedId).prop("type", "text");
                            $("#" + $scope.autoGeneratedId).parent().css("display", "block");
                        }
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.navigateButtonFunc = function (type, controlId) {
            var currentTab = 0;
            var activate = false,
                tabLinks = $('.nav nav-tabs li'),
                tabContent = $('div.tab-content');
            var ulList = $(".tab-nav-bar li");
            currentTab = ulList.parent().children('.active').index();
            _.each(ulList, function (item) {
                if (item.className.contains("_page" + controlId)) {
                    ulList.removeClass("active")
                    item.className += " active";
                    return true;
                }
            });
            if (type == "next" || type == "previous") {
                ulList.removeClass("active");
                tabContent.children("div").removeClass("in active");
            } else {

            }
            setTimeout(function () {
                if (type == "next") {
                    var tabs = ulList;
                    var c = ulList.length;
                    currentTab = currentTab == (c - 1) ? currentTab : (currentTab + 1);
                    ulList.eq(currentTab).children().click();
                    ulList.eq(currentTab).addClass("active");
                    tabContent.children("div").eq(currentTab).addClass("in active");
                    $("input.previous").show();
                    if (currentTab == (c - 1)) {
                        $("input." + type).hide();
                    } else {
                        $("input." + type).show();
                    }
                }
                else if (type == "previous") {
                    var tabs = ulList;
                    var c = ulList.length;
                    currentTab = currentTab == 0 ? currentTab : (currentTab - 1);
                    ulList.eq(currentTab).children().click();
                    ulList.eq(currentTab).addClass("active");
                    tabContent.children("div").eq(currentTab).addClass("in active");
                    if (currentTab == 0) {
                        $("input.next").show();
                        $("input." + type).hide();
                    }
                    if (currentTab < (c - 1) && currentTab != 0) {
                        $("input.next").show();
                    }
                }
                else if (type == "default") {
                    currentTab = ulList.parent().children('.active').index();
                    if (currentTab == ulList.length - 1) {
                        $("input.previous").show();
                        $("input.next").hide();
                    } else if (currentTab == 0) {
                        $("input.previous").hide();
                        $("input.next").show();
                    } else {
                        $("input.previous").show();
                        $("input.next").show();
                    }
                }
            }, 150);
            $rootScope.safeApply();
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
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                        return false;
                    });
            }
            else
                return false;
        };
        $scope.popUpIfNotApproved = function () {
            $('#tabs').hide();
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
                var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.importFormSettings.applicationId + "";
                window.location.href = url;
            });
        };
        $scope.popUpIfNotReq = function (formIdParam) {
            $('#tabs').hide();
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
                if (!isConfirm) {
                    var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.importFormSettings.applicationId + "";
                    window.location.href = url;
                }
                else {
                    var url = mainService.getBaseUrl() + "#/form/saveEntry/" + formIdParam + "?popup=1";
                    window.location.href = url;
                }
            }
            );
        };
        $scope.ExcecuteMacro = function (m_nm) {
            $scope.macro_nm = m_nm;
            updateExcel(true);
        }
        $scope.getFormSettings = function (param) {
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.urlroute = window.location.href;
            $rootScope.isEntryNotAllow = false;
            $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        var str1 = JSON.parse(response.data[0].fields);
                        var obj = Object.values(str1);
                        var ary = [];
                        if (!Array.isArray(obj)) {
                            ary = JSON.parse(Object.values(obj)[0])
                        } else {
                            if (!Array.isArray(obj[0])) {
                                ary = JSON.parse(Object.values(obj)[0]);
                            } else {
                                ary = Object.values(obj)[0];
                            }
                        }
                        var checkcontrol = ary.filter(x => x.type == "PayPal");
                        $scope.PPControl = false;
                        for (var i = 0; i < ary.length; i++) {
                            if (ary[i].type === "PayPal") {
                                $scope.PPControl = true;
                                $rootScope.amount = ary[i].amount;
                                $rootScope.paypal_id = ary[i].PAYPAL_ID;
                                $rootScope.paypal_currency = ary[i].PAYPAL_CURRENCY;
                            }
                        }
                        $scope.mapControl = false;
                        for (var i = 0; i < ary.length; i++) {
                            if (ary[i].type === "map") {
                                $scope.mapControl = true;
                            }
                        }
                        if (!DataService.isEmpty(response.data[0].macroList)) {
                            console.log(response.data[0].macroList, 'macros')
                            $scope.macros = (response.data[0].macroList).split(',');
                        }
                        if (response.data.length > 0) {
                            $scope.importFormSettings = response.data[0];
                            var frmData = response.data[0];
                            var qrString = $location.search();
                            $scope.QRstring = false;
                            // if form type !=open
                            if (angular.isDefined(qrString.check) && frmData.formType !== 3) {
                                //clear the login storage .. and redirect to login page .
                                //localStorage.removeItem('detail');
                                //alert("not an open form.");
                                //$state.go("login", { reload: true, inherit: false });
                                $scope.QRstring = true;
                                setTimeout(function () {
                                    bootbox.hideAll();
                                }, 500);
                                //localStorage.setItem("absURL", "");
                                var userlog = localStorage.getItem("detail");
                                swal({
                                    text: 'Not an open form!',
                                    type: 'warning',
                                    //showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    //cancelButtonColor: '#d33',
                                    confirmButtonText: 'Ok',
                                    // cancelButtonText: '@Resources.Resource.No'
                                }).then(function () {
                                    if (typeof userlog == undefined || userlog == "" || userlog == null) {
                                        localStorage.removeItem('detail');
                                        bootbox.hideAll();
                                        localStorage.setItem("absURL", "");
                                        var url = mainService.getBaseUrl() + "#/login";
                                        window.location.href = url;
                                    }
                                    else {
                                        bootbox.hideAll();
                                        var url = mainService.getBaseUrl() + "#/home";
                                        window.location.href = url;
                                    }
                                });
                            }



                            if ($scope.defaultSelected) {
                                defaultSelectedControl();
                            }
                            if ($scope.default_sdate) {
                                defaultStartDate();
                            }
                            if ($scope.default_edate) {
                                defaultEndDate();
                            }
                            if ($scope.importFormSettings.currentFormType == 1) {
                                $scope.bindResActivities();
                            }
                            if (!DataService.isEmpty($scope.importFormSettings.language)) {
                                if (localStorage.getItem("globalLang") == null) {
                                    localStorage.setItem("globalLang", $scope.importFormSettings.language);
                                } else {
                                    if (localStorage.getItem("globalLang") != null) {
                                        if (localStorage.getItem("globalLangForm") != null) {
                                            $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                                        } else {
                                            $scope.importFormSettings.language = localStorage.getItem("globalLang");
                                        }
                                    }
                                }
                            } else {

                                if (localStorage.getItem("globalLangForm") != null) {
                                    $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                                } else {
                                    $scope.importFormSettings.language = localStorage.getItem("globalLang");
                                }
                            }
                            if ($scope.importFormSettings.res == 1 || ($scope.isEdit == true || $scope.isSaveEvent == true)) {
                                var frmData = response.data[0];
                                var qrString = $location.search();
                                $scope.QRstring = false;
                                // if form type !=open
                                if (angular.isDefined(qrString.check) && frmData.formType !== 3) {
                                    //clear the login storage .. and redirect to login page .                              
                                    $scope.QRstring = true;
                                    setTimeout(function () {
                                        bootbox.hideAll();
                                    }, 500);
                                    var userlog = localStorage.getItem("detail");
                                    swal({
                                        text: 'Not an open form!',
                                        type: 'warning',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'Ok',
                                    }).then(function () {
                                        if (typeof userlog == undefined || userlog == "" || userlog == null) {
                                            localStorage.removeItem('detail');
                                            bootbox.hideAll();
                                            localStorage.setItem("absURL", "");
                                            var url = mainService.getBaseUrl() + "#/login";
                                            window.location.href = url;
                                        }
                                        else {
                                            bootbox.hideAll();
                                            var url = mainService.getBaseUrl() + "#/home";
                                            window.location.href = url;
                                        }
                                    });
                                }
                                var isVarified = $scope.validateUserAcess($scope.importFormSettings);
                                var isSubscriptionVarified = true;
                                var subscriptionFormID = frmData.subscriptionFormID;
                                if (angular.isDefined(subscriptionFormID)) {
                                    if (subscriptionFormID != 0) {
                                        setTimeout(function () {
                                            isSubscriptionVarified = $scope.isSubscription($scope.importFormSettings.formId, "checkIfRequested");
                                        }, 1000);
                                    }
                                }
                                if (isVarified == true && $scope.QRstring == false) {
                                    if (isSubscriptionVarified) {
                                        $scope.htmlContentData = $scope.importFormSettings.formContentHTMLTemp;
                                        var temp = [];
                                        temp.push({});
                                        if (!DataService.isEmpty($scope.importFormSettings.recordAccessSecurity)) {
                                            if (!Array.isArray($scope.importFormSettings.recordAccessSecurity))
                                                $scope.importFormSettings.recordAccessSecurity = JSON.parse($scope.importFormSettings.recordAccessSecurity);
                                        }
                                        $timeout(function () {
                                            var formData = JSON.parse($scope.importFormSettings.fields);
                                            _.map(formData, function (pagesData, key) {
                                                if (!Array.isArray(pagesData))
                                                    formData[key] = JSON.parse(pagesData);
                                                _.map(formData[key], function (item) {
                                                    if (item.type == "tabulator") {
                                                        $scope.formDetailsDataTemp.push({
                                                            type: item.type, name: item.name, reference_form: item.reference_form, data: {}
                                                        });
                                                        $scope.bindCustomTabulator(item);
                                                    }
                                                    else if (item.type == "autogenerated-field" || !DataService.isEmpty(item.subtype) || !DataService.isEmpty(item.types)) {
                                                        if (item.type == "autogenerated-field") {
                                                            $scope.autogeneratedFieldList.push(item);
                                                            $scope.autoGeneratedId = item.name;
                                                        }
                                                        else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                                                            item.subtype == "queue server" || item.subtype == "queue session"))
                                                            $scope.autogeneratedFieldList.push(item);
                                                        else if (!DataService.isEmpty(item.types) && item.types == "waiting_records")
                                                            $scope.autogeneratedFieldList.push(item);
                                                        else if (!DataService.isEmpty(item.types) && item.types == "status")
                                                            $scope.autogeneratedFieldList.push(item);
                                                    }
                                                    if (!DataService.isEmpty(item.update_operation) && param.action == 6) {
                                                        if ($scope.formDataList.length > 0) {
                                                            var dataTemp = _.filter($scope.formDataList[0], function (itemData, keyColumn) {
                                                                return keyColumn == item.name;
                                                            });
                                                            if (dataTemp.length > 0)
                                                                temp[0].oldValue = angular.copy(dataTemp[0]);
                                                            dataTemp = $scope.formDataList[0];
                                                            temp[0].name = item.name;
                                                            temp[0].MasterFormRow = dataTemp.MasterFormRow;
                                                            temp[0].MasterFormID = dataTemp.MasterFormID;
                                                            temp[0].update_operation = item.update_operation;
                                                            temp[0].Update_Form_Field = item.Update_Form_Field;
                                                            temp[0].Default_Value = item.Default_Value;
                                                            temp[0].Default_Value_Field = item.Default_Value_Field;
                                                            $scope.listOfReferrenceFields.push(temp[0]);
                                                        }
                                                    }
                                                    if (angular.isDefined(item.values))
                                                        if (!Array.isArray(item.values))
                                                            item.values = JSON.parse(item.values);
                                                });
                                                $scope.pageLength++;
                                            });
                                            $scope.formFields.formId = param.formId;
                                            $scope.formFields = formData;
                                            $scope.navigateButtonFunc("default", "default");
                                        }, 150);
                                        if (!DataService.isEmpty($scope.importFormSettings.FormDataToOneListDynamic)) {
                                            if ($scope.importFormSettings.FormDataToOneListDynamic.length > 0) {
                                                $scope.formDataList = angular.copy($scope.importFormSettings.FormDataToOneListDynamic);
                                                $scope.formDataInfo = $scope.formDataList[0];
                                            }
                                        }
                                        loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform");
                                        $rootScope.safeApply();
                                        if (param.action == 6) {
                                            if ($stateParams.popup == 3) {
                                                param.action = 5;
                                                param.AutoId = $stateParams.Id;
                                                $scope.GetTabOneToManyDynamimc(param, param.action);
                                            }
                                            $timeout(function () {
                                                $timeout(function () {
                                                    if ($scope.importFormSettings.currentFormType == 2) {
                                                        $scope.refreshButtonFunc();
                                                    }
                                                }, 500)
                                                $scope.bindUpdateControlsNew();
                                                $("a[data-target='#tabulatorModal']").hide();
                                            }, 450);
                                        } else {
                                            $timeout(function () {
                                                if ($scope.importFormSettings.currentFormType == 2) {
                                                    $scope.refreshButtonFunc();
                                                }
                                            }, 500);
                                        }
                                    }
                                }
                            }
                            else {
                                if ($scope.isSaveEvent == false) {
                                    notifierService.notifySweetAlertMessage('error', 'FormEntry', $scope.importFormSettings.Message);
                                    $rootScope.isEntryNotAllow = true;
                                    $timeout(function () {
                                        $window.history.back();
                                    }, 950);
                                }
                            }
                            $rootScope.$emit("HideLoading");
                            $scope.setInformationLink();
                        }
                        $timeout(function () {
                            customEntryElementsValidation();
                            if (!DataService.isEmpty(localStorage.getItem("newWindow"))) {
                                $rootScope.isPreviewPage = true;
                                $rootScope.isHomePage = true;
                            }
                        }, 400);
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        if ($scope.mapControl == true) {
            console.log('hi I am map');
        }

        $scope.bindOneToManyControl = function (paramTemp, tabularId, name) {
            var param = {};
            param = paramTemp;
            param.action = 10;
            param.formGroupKey = $stateParams.formGroupKey;
            param.Id = $stateParams.Id;
            param.tabularId = tabularId;
            param.formId = paramTemp.formId == 0 ? $scope.currentFormId : paramTemp.formId;
            param.parentID = $scope.currentFormId;
            param.fieldName = name;
            mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                .then(function (response) {

                    $scope.allReferrenceData = response.data;
                    $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;

                    var finalArray = [];
                    bindTabulatorColumnsHeader($scope.allReferrenceData.formDataHeaders, param.tabularId, param.formId, param.fieldName);
                    //var temp = bindTColumnHeader($scope.allReferrenceData.formDataHeaders);
                    //temp.unshift(
                    //    {
                    //        title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                    //            cell.getRow().toggleSelect();
                    //        }
                    //    }
                    //)

                    //window["popupTabulator"].setColumns(temp);
                    window["tabulators"][param.tabularId].setData($scope.allReferrenceData.formDataListNew);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.bindUpdateControlsNew = function () {
            var isCheckBoxGroup = false;
            $scope.formFieldsAll = [];
            _.each($scope.formFields, function (page) {
                _.each(page, function (control) {
                    $scope.formFieldsAll.push(control);
                });
            });
            var tempDataForEdit = {};
            if (!DataService.isEmpty($scope.formDataList) && $scope.formDataList.length > 0)
                if ($scope.formDataList.length == 1) {
                    tempDataForEdit = $scope.formDataList[0];
                    angular.forEach(tempDataForEdit, function (item, key) {
                        var controlExists = _.findWhere($scope.formFieldsAll, { "name": key });
                        if (!DataService.isEmpty(controlExists)) {
                            if (controlExists.type == "checkbox-group") {
                                isCheckBoxGroup = true;
                                if (item != null && item.length > 0) {
                                    if ($("#customFormNew :input[name=" + key + "]").length > 1) {
                                        var list = item.split(',');
                                        $("#customFormNew :input[name=" + key + "]").each(function () {
                                            var value = $(this).val();
                                            var index = _.indexOf(list, value);
                                            if (index >= 0) {
                                                $(this).prop("checked", true);
                                                $(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                $(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        if (item == "true")
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        else
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
                                    }
                                }

                            }
                            else if (controlExists.type == "map") {
                                console.log(key, item, 'Hi i am map control')
                                $("#customFormNew :input[name=" + key + "]").val(item)
                                if (item != null && item.length > 0) {
                                    localStorage.setItem('maploaded', "1");
                                }
                            }
                            else if (controlExists.type == "radio-group") {
                                $("#customFormNew :input[name=" + key + "]").each(function () {
                                    var value = $(this).val();
                                    if (!DataService.isEmpty(item))
                                        if (item.toString() === value.toString()) {
                                            $(this).prop("checked", true);
                                        }
                                });
                            }
                            else if (controlExists.type == "file") {
                                if (!DataService.isEmpty(item) && item != "null") {
                                    if (key.includes("filedefault")) {
                                        $("#customFormNew :input[name=" + key + "]").val(item)
                                    } else {
                                        previewUploader(key, item);
                                    }
                                }
                                else {
                                    if (!DataService.isEmpty(item) && item != "null") {
                                        previewUploader(key, item);
                                        $("#customFormNew :input[name=" + key + "]").val(item)
                                    }
                                }
                            }
                            else if (controlExists.type == "signature") {
                                $("#customFormNew :input[name=" + key + "]").val(item);
                                if ($("#" + key + "_pad").length)
                                    $("#" + key + "_pad").signature('draw', item);
                            }
                            else if (controlExists.type == "tinyMCE-content") {
                                tinymce.get("editor_" + key).setContent(item);
                            }
                            else if (controlExists.type == "table") {
                                if (!DataService.isEmpty(item)) {
                                    $timeout(function () {
                                        var tableDatatemp = item;
                                        populateTableData(key, tableDatatemp, controlExists);
                                    }, 450);
                                }
                            }
                            else if (controlExists.type == "date") {
                                var customdate = new Date();
                                if (controlExists.types == "date_picker") {
                                    var binddate = new Date(item);
                                    customdate = moment(binddate).format("YYYY-MM-DD");
                                }
                                else if (controlExists.types == "time_picker") {
                                    customdate = item;
                                }
                                else if (controlExists.types == "datetime_picker") {
                                    var binddate = new Date(item);
                                    customdate = moment(binddate).format("YYYY-MM-DD HH:mm");
                                }
                                $("#customFormNew :input[name=" + key + "]").val(customdate);
                            }
                            else if (controlExists.type == "select") {
                                if (!DataService.isEmpty(item)) {
                                    $("#customFormNew select[name=" + key + "]").val(item);
                                } else {
                                    if (item == "")
                                        item = "0";
                                    if (item != null)
                                        $("#customFormNew select[name=" + key + "]").val(item);
                                }


                            }
                            else
                                $("#customFormNew :input[name=" + key + "]").val(item)
                        }
                    });
                }
                else {
                    tempDataForEdit = $scope.formDataList
                    angular.forEach(tempDataForEdit, function (item) {
                        if (!DataService.isEmpty(item.name)) {
                            var controlExists = _.findWhere($scope.formFieldsAll, { "name": item.name });
                            if (!DataService.isEmpty(controlExists)) {
                                if (controlExists.type == "checkbox-group") {
                                    isCheckBoxGroup = true;
                                    if ($("#customFormNew :input[name=" + item.name + "]").length > 1) {
                                        var list = item.value.split(',');
                                        $("#customFormNew :input[name=" + item.name + "]").each(function () {
                                            var value = $(this).val();
                                            var index = _.indexOf(list, value);
                                            if (index >= 0) {
                                                $(this).prop("checked", true);
                                                $(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                $(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        if (item == "true")
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        else
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
                                    }
                                }
                                else if (controlExists.type == "radio-group") {
                                    $("#customFormNew :input[name=" + item.name + "]").each(function () {
                                        var value = $(this).val();
                                        if (angular.isDefined(item.value))
                                            if (item.toString() === value.toString()) {
                                                $(this).prop("checked", true);
                                            }
                                    });
                                }
                                else if (controlExists.type == "map") {
                                    console.log(key, item, 'Hi i am map control')
                                    $("#customFormNew :input[name=" + key + "]").val(item)
                                    if (item != null && item.length > 0) {
                                        localStorage.setItem('maploaded', "1");
                                    }
                                }
                                else if (controlExists.type == "file") {
                                    if (!DataService.isEmpty(item.value) && item.value != "null") {
                                        if (item.name.includes("filedefault")) {
                                            $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                        } else {
                                            previewSingleImage(item.name, item.value)
                                        }
                                    }
                                    else {
                                        if (!DataService.isEmpty(item) && item != "null") {
                                            if (!DataService.isEmpty(item.value)) {
                                                if (item.value != "null") {
                                                    previewSingleImage(item.name, item.value)
                                                    $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                    $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                            }
                        }
                    });
                }
        };
        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        function populateTableData(tableName, item) {
            var totalRows = 0;
            var tableData = item.replace(/'/g, " ");
            tableData = tableData.replace(/"/g, " ");
            var temp = filterReadableTableData(tableData, tableName);
            if (!DataService.isEmpty(temp)) {
                var parseJson = temp;
                var size = Object.size(parseJson);
                for (var i = 1; i <= size; i++) {
                    var controlId = tableName + "[column-1][row-" + i + "]";
                    var exists = parseJson[controlId];
                    if (exists == null || angular.isUndefined(exists)) {
                        totalRows = i;
                        break;
                    } else {
                        if (i > 1)
                            $("#" + tableName + " a.irow").click();
                    }
                }
            }
            var totalColumns = 0;
            _.each($scope.formFields, function (pageControlList) {
                var exist = _.findWhere(pageControlList, { name: tableName });
                if (!DataService.isEmpty(exist)) {
                    totalColumns = exist.columns.length > 0 ? parseInt(exist.columns) : 0;
                }
            });
            totalColumns += 1;
            var listRows = [];
            _.each(temp, function (item, keyItem) {
                var controlId = keyItem;
                if (!DataService.isEmpty(temp)) {
                    var parseJsonData = temp;
                    var controlData = parseJsonData[controlId];
                    var controls = $("table tr td input[name='" + controlId + "']");
                    if (controls.length > 0) {
                        var type = $("table tr td input[name='" + controlId + "']").attr('type');
                        if (type != "number" && !DataService.isEmpty(type)) {
                            if (type == "date" && !DataService.isEmpty(type)) {
                                controlData = new Date(controlData);
                                var controlDataDate = moment(controlData).format('YYYY-MM-DD');
                                controls.val(controlDataDate);
                            } else if (type == "radio" && !DataService.isEmpty(type)) {
                                controls.each(function () {
                                    var value = $(this).val();
                                    if (angular.isDefined(controlData))
                                        if (controlData.trim().toString() === value.trim().toString()) {
                                            $(this).prop("checked", true);
                                        }
                                });
                            }
                            else {
                                controls.val(controlData);
                            }
                        }
                        else if (type == "number" && !DataService.isEmpty(type)) {
                            controlData = parseInt(controlData);
                            controls.val(controlData);
                        }
                        else {
                            var controlsGrouplist = $("table tr td input[name='" + controlId + "[]']").attr('type');
                            if (!DataService.isEmpty(controlsGrouplist)) {
                                var parentLabel = $("table tr td input[name='" + controlId + "[]']");
                                if (controlsGrouplist == "checkbox") {
                                    controlData = controlData.replace('[', '').replace(']', '');
                                    if (controlData.includes(',')) {
                                        var splitData = controlData.split(',');
                                        _.each(splitData, function (t) {
                                            var exists = _.filter(parentLabel, function (item) { return item.value.trim() == t.trim() });
                                            if (!DataService.isEmpty(exists))
                                                exists[0].parentElement.click();
                                        });
                                    } else {
                                        var exists = _.findWhere(parentLabel, { value: splitData });
                                        if (!DataService.isEmpty(exists))
                                            exists.parentElement.click();
                                    }
                                }
                            } else {
                                $("table tr td select[name='" + controlId + "'] > option[value=" + controlData + "]").prop("selected", true);
                            }
                        }
                    }
                    else {
                    }
                }
            });
        };
        function filterReadableTableData(temp, name) {
            var data = temp;;
            var properties = data.split(';');
            var obj = {};
            var objList = [];
            var columnName = "";
            properties.forEach(function (property, index) {
                property = property.replace(/{/g, '').replace(/}/g, '');
                var tup = property.split(':');
                if (tup.length == 3) {
                    columnName = tup[0].trim();
                    var prm = name + '[' + tup[0].trim() + ']' + '[' + tup[1].trim() + ']';
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
                else if (tup.length == 2 && index > 0) {
                    var prm = name + '[' + columnName.trim() + ']' + '[' + tup[0].trim() + ']';
                    obj[prm] = tup[1];
                    objList.push(obj)
                }
            });
            return objList.length > 0 ? objList[0] : [];
        }
        $scope.bindUpdateControls = function () {
            var isCheckBoxGroup = false;
            angular.forEach($scope.formDataList, function (item) {
                if (item.fieldName.includes("checkboxGroup")) {
                    isCheckBoxGroup = true;
                    var list = item.fieldDataText.split(',');
                    $("#customFormNew :input[name=" + item.fieldName + "]").each(function () {
                        var value = $(this).val();
                        var index = _.indexOf(list, value);
                        if (index >= 0)
                            $(this).prop("checked", true);
                        else
                            $(this).prop("checked", false);
                    });
                }
                else if (item.fieldName.includes("radioGroup")) {
                    $("#customFormNew :input[name=" + item.fieldName + "]").each(function () {
                        var value = $(this).val();
                        if (angular.isDefined(item.fieldDataText))
                            if (item.fieldDataText.toString() === value.toString()) {
                                $(this).prop("checked", true);
                            }
                    });
                }
                else if (item.fieldName.includes("file")) {
                    if (!DataService.isEmpty(item.fieldDataMultimedia) && item.fieldDataMultimedia != "null") {
                        getMultipleFiles(item.fieldName);
                    }
                    else {
                        if (!DataService.isEmpty(item.fieldDataText) && item.fieldDataText != "null") {
                            previewSingleImage(item.fieldName, item.fieldDataText)
                        }
                    }
                }
                else
                    $("#customFormNew :input[name=" + item.fieldName + "]").val(item.fieldDataText)
            });

            if (!isCheckBoxGroup) {
                $("#customFormNew :input:checkbox").each(function () {
                    $(this).prop("checked", false);
                });
            }
        };
        function filename(path) {
            path = path.substring(path.lastIndexOf("/") + 1);
            return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
        }
        function previewSingleImage(id, path) {
            $("input:hidden[name=" + id + "]").attr('value', path);
            path = path.replace('~', '');
            var preview_element = document.getElementById("uploadPreview_" + id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                if (path.includes('.xls') || path.includes('.xlsx') || path.includes('.pdf')) {
                }
                else {
                }
                document.getElementById("uploadPreview_" + id).src = path;
                $("#uploadPreview_" + id).removeClass("hidden");
                $("#uploadPreview_" + id).find('.file-title').html('');
            }
        }
        function previewUploader(id, path) {
            $("input:hidden[name=" + id + "]").attr('value', path);
            path = path.replace('~', '');
            var preview_element = document.getElementById("uploadPreview_" + id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                if (path.includes('.xls') || path.includes('.docx') || path.includes('.doc') || path.includes('.xlsx') || path.includes('.pdf')) {
                    $('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().addClass('hidden');
                    var fileAttachments = $('#' + id).parents('.form-group').find('.attachments .file-attachments');
                    var nameddd = path.substring(path.lastIndexOf('/') + 1);
                    fileAttachments.find('p').append(nameddd);
                    fileAttachments.removeClass("hidden");
                }
                else {
                    var pathImage = "";
                    if (path.contains("http")) {
                        pathImage = path;
                    } else {
                        pathImage = mainService.getBaseUrl() + path;
                    }
                    document.getElementById("uploadPreview_" + id).src = pathImage;
                    $("#uploadPreview_" + id).parent().removeClass("hidden");
                    var nameddd = path.substring(path.lastIndexOf('/') + 1);
                    $("#uploadPreview_" + id).parent().find('.file-title').html(nameddd);
                }
            }
            else {
                // for multi file uploader ....
                preview_element = document.getElementById("shw_profile" + id);
                path = path.split(',');
                angular.forEach(path, function (valuePath, key) {
                    valuePath = valuePath.replace('~', '');
                    var nameddd = valuePath.substring(valuePath.lastIndexOf('/') + 1);
                    var div = $('<div />', { class: 'figure' });
                    div.appendTo($('#shw_profile_' + id + ' > div.fileData'));
                    var extention = valuePath.substr(valuePath.lastIndexOf('.') + 1);
                    console.log(valuePath, 'previewSingleImage');
                    if (extention == "jpg" || extention == "gif" || extention == "png" || extention == "jpeg") {
                        var img = $('<img />', {
                            class: 'scaled',
                            height: '100',
                            src: valuePath.toString(),
                            alt: nameddd
                        });
                        img.appendTo(div);
                        var p = $('<p />').html(nameddd);
                        p.appendTo(div);
                        var span = $('<span />').attr('class', 'img-wrapclose img-close multiple-files').html('×');
                        span.appendTo(div);
                    } else {
                        div.append('<i class="far fa-file-alt fa-2x"></i>');
                        var p = $('<p />').attr('class', 'file-attachments').html(nameddd);
                        p.appendTo(div);
                        div.append('<span class="img-wrapclose file-close multiple-files">×</span>');
                    }
                });
            }
        }
        $scope.bindCustomTabulator = function (param) {
            var paramData = param;
            var controlHtml = "";
            if (paramData.type == "tabulator") {
                createTabulatorOneToMany(paramData);
            }
        }
        $scope.bindResActivities = function () {
            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;;
            mainService.manageForm("ManageForm", param1)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            var param = {};
                            param.action = 1;
                            param.formId = response.data[0].activitiesForm;
                            if (response.data[0].colorField != 'no color')
                                param.fieldName = response.data[0].activities + "," + response.data[0].colorField;
                            else
                                param.fieldName = response.data[0].activities
                            if ((response.data[0].activitiesForm != 0 && response.data[0].activitiesForm != null) && (response.data[0].activities != '' && response.data[0].activities != null)) {
                                mainService.getReferralFormFields("getReferralFormFields", param)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            if (response.data.length > 0) {
                                                $scope.formDetails = response.data;
                                                $scope.formDetails = _.without($scope.formDetails, _.findWhere($scope.formDetails, { value: "0" }));
                                                $timeout(function () {
                                                    $('.external-events-list .fc-event').each(function () {
                                                        $(this).data('event', {
                                                            title: $.trim($(this).text()), // use the element's text as the event title
                                                            color: $.trim($(this).data('color')),
                                                            duration: $.trim($(this).data('duration')),
                                                            stick: false // maintain when user navigates (see docs on the renderEvent method)
                                                        });
                                                        $(this).draggable({
                                                            zIndex: 999,
                                                            revert: true,      // will cause the event to go back to its
                                                            containment: ".table-responsive", scroll: true,
                                                            revertDuration: 0,  //  original position after the drag
                                                            stop: function () {
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
                        }
                    }
                });
        }
        $scope.existButtonFunc = function () {
            var isInformationOnly = $scope.importFormSettings.InformationOnly;
            if (angular.isDefined($scope.formGroupKey)) {
                if (window.opener && window.opener !== window) {
                    window.close();
                }
                else {
                    window.history.back();
                }
            }
            else if (angular.isDefined(isInformationOnly)) {
                if (isInformationOnly == "tru") {
                    var previousPage = CookiesPersistenceService.getCookieData("informationBackLink");
                    if (angular.isDefined(previousPage)) {
                        window.location = previousPage;
                    }
                }
                else if (isInformationOnly == null && $scope.formGroupKey == undefined && $stateParams.popup != undefined) {
                    window.close();
                }
                else {
                    $rootScope.isFormDirty = $scope.myForm.$dirty;
                    window.history.back();
                }
            }
            else {
                window.history.back();
            }
        }
        function customClass(item) {
            var cssClass = "";
            switch (item.column) {
                case "1":
                    cssClass = "col-sm-12";
                    break;
                default:
                    cssClass = "col-sm-" + item.column;
                    break;
            }
            var newClass = "border-" + item.name;
            var cssItem = "";
            if (item.border) {
                cssItem += (item.border_top == "Yes") ? "border-top: " + item.border + "px solid !important;" : "border-top: 0px solid !important;"
                cssItem += (item.border_right == "Yes") ? "border-right: " + item.border + "px solid !important;" : "border-right: 0px solid !important;"
                cssItem += (item.border_bottom == "Yes") ? "border-bottom: " + item.border + "px solid !important;" : "border-bottom: 0px solid !important;"
                cssItem += (item.border_left == "Yes") ? "border-left: " + item.border + "px solid !important;" : "border-left: 0px solid !important;"
                cssItem += (item.background_color != "") ? "background-color: " + item.background_color + "  !important; " : "background-color: transparent  !important;"
            }
            if (angular.isDefined(item.column_width)) {
                cssItem += "width:" + item.column_width + "% !important";
            }
            var divWidth = "";
            if (!DataService.isEmpty(item.width)) {
                divWidth = " .innerDivWidth-" + item.name + "{ width: " + item.width + "% !important; } ";
            }
            if (item.type == "button") {
                item.className += " borderButton-" + item.name;
            }
            $("<style type='text/css'> ." + newClass + "{ " + cssItem + "}" + divWidth + "  </style> ").appendTo("head");
            return newClass + ' ' + cssClass + ' borderSet';
        }
        var check = null;
        var map = '';
        function makeHtmlAttributeFormat(fieldsData, itemkey, pageKey, dataValue) {
            var excelIntegrateData = "";
            var tempData = fieldsData;
            var finalArray = " ";
            var type = _.find(fieldsData, function (item, key) { return key == "type" });
            if (type == "button") {
                if (type == "button" && fieldsData.subtype == "exit") {
                    finalArray += "<button  onclick='angular.element(this).scope().existButtonFunc()'"
                } else {
                    finalArray += "<button"
                }
            }
            else if (type == "select") {
                finalArray += "<select id='" + fieldsData.name + "'"
            }
            else if (type == "radio-group" || type == "map" || type == "textarea" || type == "text-with-input" || type == "signature"
                || type == "paragraph" || type == "number" || type == "hidden" || type == "text" || type == "file" || type == "date"
                || type == "autocomplete" || type == "Line" || type == "hyperlink" || type == "checkbox-group") {
                if (type == "autocomplete") {
                    finalArray += "<div class='easy-autocomplete'>"
                    finalArray += "<input type='text' autocomplete='off' id='" + fieldsData.name + "'"
                }
                else if (type == "Line") {
                    finalArray += "<hr "
                }
                else if (type == "hyperlink") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='" + fieldsData.href + "' /> <a id='" + fieldsData.name + "'"
                }
                else if (type == "checkbox-group") {
                    finalArray += "<input type='checkbox' id='" + fieldsData.name + "'"
                }
                else if (type == "radio-group") {
                    finalArray += "<input type='radio'  id='" + fieldsData.name + "'"
                }
                else if (type == "date" || type == "text-with-input") {
                    if (type == "text-with-input") {
                        finalArray += "<div class='col-sm-12 no-pad' ><input type='text' class='editable-area inputClass' id='" + fieldsData.name + "'";
                    }
                    else {
                        finalArray += "<input type='text' id='" + fieldsData.name + "'";
                    }
                }
                else if (type == "file") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='null' /> <input type='" + type + "' id='" + fieldsData.name + "'  onchange='angular.element(this).scope().fileUploadDataEntry(\"" + fieldsData.name + "\")'";
                }
                else if (type == "hidden") {
                    finalArray += "<input type='" + type + "' id='" + fieldsData.name + "'";
                }
                else if (type == "map") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='null'  /><div id='" + fieldsData.name + "' style='width: 100%;height: 300px;position: relative;overflow: hidden;'";
                }
                else if (type == "number") {
                    finalArray += "<input type='" + type + "' id='" + fieldsData.name + "'";
                }
                else if (type == "paragraph" || type == "textarea") {
                    if (type == "textarea") {
                        if (fieldsData.subtype == "textarea") {
                            finalArray += "<" + fieldsData.subtype + "  id='" + fieldsData.name + "'";
                        } else {
                            finalArray += "<" + type + "  id='" + fieldsData.name + "'";
                        }

                    } else {
                        finalArray += "<" + fieldsData.subtype + "  id='" + fieldsData.name + "'";
                    }
                }
                else if (type == "signature") {
                    finalArray += "<div id='" + fieldsData.name + "_pad' style='width: " + fieldsData.pad_width + "px; height: " + fieldsData.pad_width + "px;'  class='kbw-signature'> <textarea  id='" + fieldsData.name + "' class='hidden'";
                }
                else if (type == "text") {
                    if (fieldsData.subtype == "tel" || fieldsData.subtype == "password" || fieldsData.subtype == "email" || fieldsData.subtype == "color")
                        finalArray += "<input id='" + fieldsData.name + "' type='" + fieldsData.subtype + "' "
                    else
                        finalArray += "<input id='" + fieldsData.name + "'"
                }
            }
            else if (type == "tinyMCE-content") {
                finalArray += "<div class='col-sm-12'> <textarea id='" + fieldsData.name + "'"
            }
            else if (type == "captcha") {
                if (fieldsData.subtype == "cp_motion") {
                    finalArray += "<div class='col-sm-12' id='mc-div'><canvas id='mc-canvas-" + fieldsData.name + "' class='mc-canvas'>  Your browser doesn't support the canvas element-please visit in a modern browser. </canvas><input type='hidden' id='mc-action-" + fieldsData.name + "'"
                }
                else if (fieldsData.subtype == "cp_google") {
                    finalArray += "<div id='recaptcha' class='g-recaptcha' data-sitekey='6LdpzrEUAAAAABg4FKEvEyuQg64Cz8I1ZbtdZd_M' data-size='invisible'"
                }
                else if (fieldsData.subtype == "cp_text") {
                    finalArray += "<div class='col-sm-12'><input class='form-control " + fieldsData.subtype + "' type='text' id='" + fieldsData.name + "-answer'"
                }
                else if (fieldsData.subtype == "cp_math") {
                    finalArray += "<div><label id='captchaText' class='control-label mr-5'></label><input id='captchaInput' aria-label='Captcha Input' class='form-control captchaInput' type='number' required='required'"
                }
            }
            else if (type == "banner") {
                finalArray += "<div class='col-sm-12'> <img id='" + fieldsData.name + "' src='" + fieldsData.value + "' "
            }
            else {
                finalArray += "<input id='" + fieldsData.name + "'"
            }
            _.each(tempData, function (item, key) {
                if (key != "values" && key != "role" && key != "type" && key != "className" && key != "required")
                    finalArray += " " + key + "='" + item + "'"
                if (key == "className")
                    finalArray += " class='" + item + "'"
                if (item == "radio-group" && key == "type")
                    finalArray += " type = 'radio'"
                if (type == "text" && key == "type")
                    finalArray += " " + key + "='" + item + "'"
                if (type == "file")
                    finalArray += " " + key + "='" + item + "'"
                if (key == "required")
                    finalArray += " " + key
                if (key == "attributeType")
                    if (item == "output") {
                        excelIntegrateData += item + "=" + fieldsData.XCoordinate + fieldsData.YCoordinate + "_" + fieldsData.worksheet;
                        finalArray += "data-fv-field='" + fieldsData.name + "'  data-xlsxfield='" + fieldsData.XCoordinate + fieldsData.YCoordinate + "' readonly  "
                    }
                    else if (item == "input") {
                        finalArray += " onchange='angular.element(this).scope().onBlurInput(\"" + fieldsData.name + "," + pageKey + "\")'"
                    }
            });
            if (!DataService.isEmpty(dataValue)) {
                finalArray += "value='" + dataValue + "'";
            }
            if (type == "button") {
                if (type == "button" && fieldsData.subtype == "exit") {
                    return finalArray += "type='button' >" + fieldsData.label + "</button>"
                }
                else {
                    return finalArray += " type='" + fieldsData.subtype + "' >" + fieldsData.label + "</button>"
                }
            }
            else if (type == "Line") {
                return finalArray + "/>";
            }
            else if (type == "hyperlink") {
                return finalArray += ">" + fieldsData.label + "</a>"
            }
            else if (type == "paragraph" || type == "textarea") {
                if (type == "textarea") {
                    if (fieldsData.subtype == "textarea") {
                        if (!DataService.isEmpty(dataValue)) {
                            return finalArray += ">" + dataValue + "</" + fieldsData.subtype + ">"
                        }
                        else {
                            return finalArray += "></" + fieldsData.subtype + ">"
                        }

                    } else {
                        return finalArray += "></" + type + ">"
                    }
                }
                else {
                    return finalArray += ">" + fieldsData.label + "</" + fieldsData.subtype + ">"
                }
            }
            else if (type == "date" || type == "text-with-input") {
                if (type == "text-with-input")
                    return finalArray += "></div>"
                var classtemp = "glyphicon glyphicon-";
                classtemp += fieldsData.types == "time_picker" ? "time" : "calendar";
                return finalArray += "><span class='input-group-addon'><span class='" + classtemp + "' ></span></span></div>"
            }
            else if (type == "map") {
                return finalArray + "></div>";
            }
            else if (type == "signature") {
                return finalArray += ">" + fieldsData.label + "</textarea></div>"
            }
            else if (type == "tinyMCE-content") {
                if (!DataService.isEmpty(dataValue)) {
                    return finalArray += ">" + dataValue + "</textarea></div>"
                }
                else {
                    return finalArray += "></textarea></div>"
                }
            }
            else if (type == "captcha") {
                return finalArray += "></div>"
            }
            else if (type == "banner") {
                return finalArray += "></div>"
            }
            else if (type == "checkbox-group" || type == "radio-group") {
                return finalArray;
            }
            else {
                return finalArray + ">";
            }
        }
        $scope.onBlurInputTable = function (data) {
            var temp = data.split(',')
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            // var XCoordinate = temp[0];
            //var YCoordinate = temp[1];
            var xlsCode = temp[0];
            var worksheet = temp[1];
            var nameTable = temp[2];
            var controlId = temp[3];
            var attributeType = temp[4];
            var pagename = temp[5];
            var columnIndex = parseInt(temp[6]);
            var rowIndex = parseInt(temp[7]);
            // var textvalue = $("#" + nameTable).find("td input").val();

            var textvalue = "";
            $("input").each(function () {
                if ($(this).attr("id") == controlId) {
                    textvalue = $(this).val();
                    return false;
                }
            });
            //var pagename = temp[1];
            var controlData = $scope.formFields[pagename];
            // //console.log(controlData)
            ////console.log(data)
            //var inputvalue = temp[5];
            //var dd = $("#" + inputvalue).val();
            //temp[5] = dd;
            //var param = temp.join();

            var xcelParam = {};
            var isInput = false;
            // var controlData = _.findWhere($scope.formFields, { name: nameTable });
            xcelParam.id = controlId;
            xcelParam.sheetName = worksheet;
            xcelParam.xlsCode = xlsCode;
            // xcelParam.columnName = XCoordinate;
            // xcelParam.rowName = YCoordinate;
            xcelParam.formGroupKey = newformGroupKey;
            xcelParam.type = attributeType;
            xcelParam.isRead = false;
            xcelParam.isWrite = true;
            xcelParam.value = textvalue;
            var outputListData = {};
            // deparam(settings);

            //$scope.formFieldExcelParam.listOfOutput = _.where($scope.listOfOutput, { rowNo: rowIndex });
            //angular.forEach(controlData, function (citem) {
            //    if (angular.isDefined(citem.attributeType)) {
            //        if (citem.attributeType == "output") {
            //            var xcelParamOut = {};
            //            xcelParamOut.id = citem.name;
            //            xcelParamOut.sheetName = citem.worksheet;
            //            xcelParamOut.columnName = citem.XCoordinate;
            //            xcelParamOut.rowName = citem.YCoordinate;
            //            xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
            //            xcelParamOut.type = citem.attributeType;
            //            xcelParamOut.formGroupKey = newformGroupKey;
            //            xcelParamOut.isRead = true;
            //            xcelParamOut.isWrite = false;
            //            $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
            //        }
            //    }
            //});
            _.extend(window["listOfOutput"], { formGroupKey: newformGroupKey });
            $scope.formFieldExcelParam.listOfOutput = window["listOfOutput"];
            angular.forEach($scope.formFields, function (pageData, pageKey) {
                angular.forEach(pageData, function (citem, key) {
                    if (angular.isDefined(citem.attributeType)) {
                        if (citem.attributeType == "output") {
                            var exists = _.findWhere($scope.formFieldExcelParam.listOfOutput, { id: citem.name });
                            if (DataService.isEmpty(exists)) {
                                var xcelParamOut = {};
                                xcelParamOut.id = citem.name;
                                //$("#" + xcelParamOut.id).addClass("loader");
                                xcelParamOut.sheetName = citem.worksheet;
                                xcelParamOut.columnName = citem.XCoordinate;
                                xcelParamOut.rowName = citem.YCoordinate;
                                xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
                                xcelParamOut.type = citem.attributeType;
                                xcelParamOut.formGroupKey = newformGroupKey;
                                xcelParamOut.isRead = true;
                                xcelParamOut.isWrite = false;
                                $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
                            }
                        }
                    }
                });
            });


            $scope.formFieldExcelParam.filePath = $scope.importFormSettings.xlsFile;
            $scope.formFieldExcelParam.fileName = $scope.importFormSettings.xlsxFileName;

            $scope.formFieldExcelParam.inputDataExcel = xcelParam;

            $scope.formFieldExcelParam.listOfInput.push(xcelParam);
            if ($scope.formFieldExcelParam.listOfInput.length == 0) {
                _.each($scope.formFieldExcelParam.inputDataExcel, function (item) {
                    $scope.formFieldExcelParam.listOfInput.push(item);
                });
            }
            clearTimeout(check);
            check = setTimeout(function () {
                //updateExcel(false);
            }, 4000);
            /// $timeout(function () {
            //mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (response.data.listOfOutput.length > 0) {
            //                //console.log(response.data)
            //                angular.forEach(response.data.listOfOutput, function (item) {
            //                    $("input").each(function () {
            //                        if ($(this).attr("id") == item.id) {
            //                            $(this).val(item.value);

            //                            return false;
            //                        }
            //                    });
            //                });
            //                textBoxLoader(false);
            //                // $rootScope.$emit("HideLoading");
            //            }
            //        }
            //    }, function (err) {
            //        textBoxLoader(false);
            //        $rootScope.$emit("HideLoading");
            //        //console.log("some error occured." + err);
            //    });
            //}, 3000);



        }

        function textBoxLoader(type) {
            if (type) {
                $(".disabledOutput").each(function () {
                    $(this).addClass("loader");
                    // return false;
                });
            } else {
                $(".disabledOutput").each(function () {
                    $(this).removeClass("loader");
                    //return false;
                });
            }
        }
        $scope.addListOutPutControls = function (data, index, row, worksheet, name) {
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            var params = deparam(data);
            var fieldType = params['column-' + index + '[inputType]'] ? params['column-' + index + '[inputType]'] : '';
            var attributeType = "";
            attributeType = params['column-' + index + '[' + fieldType + '][type]'] ? params['column-' + index + '[' + fieldType + '][type]'] : ''
            var XCoordinate = params['column-' + index + '[' + fieldType + '][XCoordinate]'];
            var YCoordinate = params['column-' + index + '[' + fieldType + '][YCoordinate]'];
            var validationId = name + "[column-" + index + "][row-" + row + "]";
            var coordinate = "";
            if (params['column-' + index + '[' + fieldType + '][coordinate]']) {
                coordinate = params['column-' + index + '[' + fieldType + '][coordinate]'];
            } else {
                if (params['column-' + index + '[' + fieldType + '][XCoordinate]'] && params['column-' + index + '[' + fieldType + '][YCoordinate]']) {
                    coordinate = (params['column-' + index + '[' + fieldType + '][XCoordinate]'] + params['column-' + index + '[' + fieldType + '][YCoordinate]']).toUpperCase();
                }
            }
            var xlsCode = (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "");

            if (attributeType == "output") {
                var exists = _.findWhere($scope.listOfOutput, { id: validationId });
                if (angular.isUndefined(exists)) {
                    var xcelParamOut = {};
                    xcelParamOut.id = validationId;
                    xcelParamOut.sheetName = worksheet;
                    //xcelParamOut.columnName = XCoordinate;
                    //xcelParamOut.rowName = YCoordinate;
                    xcelParamOut.type = attributeType;
                    xcelParamOut.formGroupKey = newformGroupKey;
                    xcelParamOut.columnNo = index;
                    xcelParamOut.xlsCode = xlsCode;
                    xcelParamOut.rowNo = row;
                    xcelParamOut.isRead = true;
                    xcelParamOut.isWrite = false;
                    $scope.listOfOutput.push(xcelParamOut);
                }
            }
        };
        $scope.onUniqueCheck = function (data) {
            var temp = data.split(',');
            var controlId = temp[0];
            var textvalue = $("#" + temp[0]).val();
            var param = {};
            param.action = 2;
            param.formId = temp[1]
            param.fieldName = controlId;
            param.fieldDataText = textvalue;
            param.formTableColumnName = param.fieldName.includes('-') ? '[' + param.fieldName + ']' : param.fieldName;
            param.formTableColumnData = textvalue;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.validateUniqueness("ValidateUniqueness", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.res == 1) {

                        } else {
                            $("#" + temp[0]).val("");
                            notifierService.notifyMessage('error', 'FormEntry', response.data.Message);
                        }
                    }

                }, function (err) {
                    console.log("some error occured." + err);
                });

        };

        function restrictKeyboardInput() {
            var key = e.keyCode ? e.keyCode : e.which;

            if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
                (key == 65 && (e.ctrlKey || e.metaKey)) ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
                (key >= 96 && key <= 105)
            )) e.preventDefault();
        }


        $scope.onBlurInput = function (data) {
            //$rootScope.$emit("ShowLoading");

            $scope.formFieldExcelParam.listOfOutput = [];
            var temp = data.split(',')
            var controlId = temp[0];
            var textvalue = $("#" + temp[0]).val();
            var pagename = temp[1];
            var controlData = $scope.formFields[pagename];
            //console.log(controlData)
            //console.log(data)
            //var inputvalue = temp[5];
            //var dd = $("#" + inputvalue).val();
            //temp[5] = dd;
            //var param = temp.join();
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            var xcelParam = {};
            var isInput = false;
            xcelParam = _.findWhere(controlData, { name: controlId });
            xcelParam.id = xcelParam.name;
            xcelParam.sheetName = xcelParam.worksheet;
            xcelParam.columnName = xcelParam.XCoordinate;
            xcelParam.rowName = xcelParam.YCoordinate;
            xcelParam.xlsCode = xcelParam.XCoordinate + xcelParam.YCoordinate;
            xcelParam.type = xcelParam.attributeType;
            xcelParam.formGroupKey = newformGroupKey;
            xcelParam.isRead = false;
            xcelParam.isWrite = true;
            xcelParam.value = textvalue;

            angular.forEach(controlData, function (citem) {
                if (angular.isDefined(citem.attributeType)) {
                    if (citem.attributeType == "output") {
                        var xcelParamOut = {};
                        xcelParamOut.id = citem.name;
                        //$("#" + xcelParamOut.id).addClass("loader");
                        xcelParamOut.sheetName = citem.worksheet;
                        xcelParamOut.columnName = citem.XCoordinate;
                        xcelParamOut.rowName = citem.YCoordinate;
                        xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
                        xcelParamOut.type = citem.attributeType;
                        xcelParamOut.formGroupKey = newformGroupKey;
                        xcelParamOut.isRead = true;
                        xcelParamOut.isWrite = false;
                        $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
                    }
                }

            });

            $scope.formFieldExcelParam.filePath = $scope.importFormSettings.xlsFile;
            $scope.formFieldExcelParam.fileName = $scope.importFormSettings.xlsxFileName;

            $scope.formFieldExcelParam.inputDataExcel = xcelParam;
            $scope.formFieldExcelParam.listOfInput.push(xcelParam);
            if ($scope.formFieldExcelParam.listOfInput.length == 0) {
                _.each($scope.formFieldExcelParam.inputDataExcel, function (item) {
                    $scope.formFieldExcelParam.listOfInput.push(item);
                });
            }
            clearTimeout(check);
            check = setTimeout(function () {
                //updateExcel(true);
            }, 3000);
            /// $timeout(function () {
            //mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (response.data.listOfOutput.length > 0) {
            //                console.log(response.data)
            //                angular.forEach(response.data.listOfOutput, function (item) {
            //                    $("#" + item.id).val(item.value);
            //                    $("#" + item.id).removeClass("loader");
            //                })
            //                //$rootScope.$emit("HideLoading");

            //            }
            //        }
            //    }, function (err) {

            //            $("body").removeClass("loader");
            //        //$rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });
            //}, 3000);

        }

        function updateExcel(type) {

            $("input.inputClass").prop("disabled", true);
            $rootScope.$emit("ShowLoading");
            var reqType = "form";
            $scope.formFieldExcelParam.uid = $scope.userDetail.uid
            $scope.formFieldExcelParam.formId = $stateParams.formId;
            $scope.formFieldExcelParam.reqType = reqType;
            $scope.formFieldExcelParam.userId = $scope.userDetail.Id;
            $scope.formFieldExcelParam.macroname = $scope.macro_nm;
            //console.log($scope.formFieldExcelParam,'sona excel file')
            //return false;
            mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data.listOfOutput)) {
                            if (response.data.listOfOutput.length > 0) {
                                //console.log(response.data)
                                if (type) {
                                    angular.forEach(response.data.listOfOutput, function (item) {
                                        $("#" + item.id).val(item.value);
                                        $("#" + item.id).removeClass("loader");
                                    })
                                } else {
                                    angular.forEach(response.data.listOfOutput, function (item) {
                                        $("input").each(function () {
                                            if ($(this).attr("id") == item.id) {
                                                $(this).val(item.value);
                                                $("#" + item.id).removeClass("loader");
                                                return false;
                                            }
                                        });
                                    });
                                }
                                textBoxLoader(false);
                                //$rootScope.$emit("HideLoading");

                            }
                            $scope.formFieldExcelParam.listOfInput = [];
                            $scope.formFieldExcelParam.inputDataExcel = {};
                        }
                    }
                    $("input.inputClass").prop("disabled", false);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $scope.formFieldExcelParam.listOfInput = [];
                    $scope.formFieldExcelParam.inputDataExcel = {};
                    textBoxLoader(false);
                    $("body").removeClass("loader");
                    $rootScope.$emit("HideLoading");
                    $("input.inputClass").prop("disabled", false);
                    //$rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        function createCaptchaControl(item) {
            if (item.subtype == "cp_math") {
                var mathCaptcha = {
                    label: "captchaText",
                    maxNumber: 2

                }
                $('#customFormNew').captcha({
                    label: mathCaptcha.label,
                    maxNumber: parseInt(mathCaptcha.maxNumber)
                });


            }
            else if (item.subtype == "cp_text") {

                // create instance
                var numDigits = parseInt(3);
                var useDecimal = 0;


                var decimalChance = useDecimal;

                var imgLess = new imagelessCaptcha(numDigits, useDecimal, decimalChance);
                var question = imgLess.formPhrase();
                var answer = imgLess.getInt();
                // put question into form
                // $timeout(function () {
                item.labelHtml = "<label id='" + item.name + "'-question' class='form-label' for='" + item.name + "'-answer'> " + question + " </label>";
                // $("#" + item.name + "-question").text(question);
                $("#" + item.name + "-answer").parent().attr('data-answer', answer);
                // }, 150);



            }
            else if (item.subtype == "cp_motion") {
                var motionCaptcha = {
                    actionId: "#mc-action-" + item.name,     // The ID of the input containing the form action
                    divId: "#mc-div",               // If you use an ID other than '#mc' for the placeholder, pass it in here
                    canvasId: "#mc-canvas-" + item.name,     // The ID of the MotionCAPTCHA canvas element
                    canvasTextColor: "'#111'",
                    // These messages are displayed inside the canvas after a user finishes drawing:
                    errorMsg: "Please try again.",
                    successMsg: "Verified!",
                }
                $('#customFormNew').motionCaptcha(motionCaptcha);

            }
            else if (item.subtype == "cp_google") {
                grecaptcha.execute();
            }
        };

        function createQuillTextArea(item) {
            var Delta = Quill.import('delta');
            //var Display_Only = "{!! (isset($fields['Display_Only']) && str_contains($fields['Display_Only'], $userRole) !== false) ? 1 : 0 !!}";
            var toolbarOptions = [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }]
                /*[{'direction': 'rtl'}],
                 [{'color': []}, {'background': []}],
                 [{'align': []}],
                 ['link', 'image', 'video'],
                 ['clean']*/
            ];
            var options = {
                //debug: 'info',
                modules: {
                    toolbar: toolbarOptions
                },
                //scrollingContainer: "#scrolling_{!! $fields['name'] or '' !!}",
                //placeholder: "{!! $placeholderValue or '' !!}",
                theme: 'snow',
                //readOnly: (Display_Only == 1) ? true : false
            };
            var editor = new Quill("#" + item.name, options);
            var change = new Delta();
        }

        function createTabulatorOneToMany(fieldData) {
            if (angular.isDefined(fieldData.reference_form)) {
                var param = {};
                param.action = 4;
                param.formId = fieldData.reference_form;
                var tabularId = "formGeneratorTabulator" + fieldData.name;
                if (!DataService.isEmpty(param.formId) && param.formId != "0" && param.formId != 0) {
                    //$scope.getFormDetails(param, tabularId, fieldData.name);
                    $scope.bindOneToManyControl(param, tabularId, fieldData.name);
                }
            }
            //return '<div class="form-group col-sm-12 borderSet">  <label class="col-sm-12" for=' + tabularId + '>  Untitled name(newform)  <a class= "btn btn-danger pull-right delete-tabulator-row-hard" data-tabulator="' + tabularId + '" data-reference-form-id="' + + fieldData.reference_form + '" onclick="angular.element(this).scope().deleteRecordsIntoOneMany()"><i class="fa fa-trash"></i> Delete records</a>' +
            //    '<a id="btnAddRecord_tabulator_"' + tabularId + '" class="btn btn-primary pull-right mr-5" onclick="angular.element(this).scope().insertRecordsIntoOneMany(' + param.formId + ')" ><i class="fa fa-plus"></i> Insert new record</a></label >' +
            //    '<div class="clearfix"></div><div class="col-sm-12"><input type="hidden" name="linked_record_key" value="linked_record_key"> <input type="hidden" name="reference_form" value="' + fieldData.reference_form + '"> <input type="hidden" name="oneToMany-' + fieldData.reference_form + '" value="' + param.formId + '">  <input type="hidden" name="one_to_many_form" value="' + $scope.currentFormId + '">' +
            //    '<div class="table-responsive"><div id=' + tabularId + '></div></div> </div></div>';
        }

        $scope.insertRecordsIntoOneMany = function (formId, fieldName) {
            var temp = {};
            temp.formId = formId;
            temp.fieldName = fieldName;
            temp.formGroupKey = $scope.freshEntryformGroupKey;
            temp.MasterFormID = $scope.currentFormId;
            localStorage.setItem("insertReferrence", JSON.stringify(temp));
            $scope.entryPage(formId, false, $scope.freshEntryformGroupKey, fieldName, false, true);
        };
        $scope.entryPage = function (formId, isEdit, formGroupKey, fieldName, isTab, isLocally, tabularId) {
            var reference_form = "2196";
            //var params = windowParams();
            var params = setWindowScreenSize($scope.importFormSettings.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            $scope.isEdit = isEdit;
            if ($scope.isEdit && isLocally != true) {
                newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + '/0?popup=1', 'example', params, true);
            }
            else if (angular.isDefined(isTab) && isTab == true) {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
            }
            else if (angular.isDefined(isLocally) && isLocally == true) {
                console.log(isLocally, 'isLocally')
                if (localStorage.getItem("tabulatorOnetomany-" + formId) == null) {
                    if ($scope.isEdit) {
                        if ($scope.importFormSettings.currentFormType == 1) {
                            var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId.toString() });
                            if (!DataService.isEmpty(exists)) {
                                // : formGroupKey /: Id ?
                                newWindow = window.open(baseUrl + "#/form/editEvent/" + formId + "/" + formGroupKey + "/" + fieldName + '?popup=1&cname=' + exists.field + '&value=' + $stateParams.Id + '', 'example1', params, true);
                            }
                        }
                        else {
                            newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + fieldName + "?popup=3", 'example', params, true);
                        }
                    }
                    else {
                        if ($scope.importFormSettings.currentFormType == 1) {
                            var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId.toString() });

                            if (!DataService.isEmpty(exists)) {
                                newWindow = window.open(baseUrl + "#/form/saveEvent/" + formId + '?popup=1&parentFormId=' + $scope.currentFormId + '&cname=' + exists.field + '&value=' + $stateParams.Id + '', 'example1', params, true);
                            }
                        } else {
                            newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
                        }
                    }
                } else {
                    var url = "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + fieldName + "?popup=3";
                    newWindow = window.open(baseUrl + url, 'example', params, true);
                }
            }
            else {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            }
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    var param = {};
                    param.action = 4;
                    param.fieldName = fieldName;
                    if (!DataService.isEmpty(tabularId))
                        param.tabularId = "formGeneratorTabulator" + tabularId;
                    else
                        param.tabularId = "formGeneratorTabulator" + fieldName;

                    if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    else
                        param.formGroupKey = $scope.formGroupKey;
                    param.formId = formId;
                    //var dataSubForm = localStorage.getItem("formOneData");
                    //$scope.GetTabOneToManyDynamimc(param, param.action)
                    $scope.bindOneToManyControl(param, param.tabularId, fieldName);
                    if (param.action == 4)
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                    setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);
                    //var tempTabulatorData = localStorage.getItem("tabulatorOnetomany-" + formId);
                    //console.log(tempTabulatorData);
                    //$scope.bindOnetoManyTabulator(tempTabulatorData, fieldName);
                    //  if (!DataService.isEmpty(dataSubForm)) {
                    // var groupBy = JSON.parse(dataSubForm);
                    //$timeout(function () {
                    //    var paramTemp = {};
                    //    paramTemp.action = 2;
                    //    paramTemp.formId = formId;
                    //    paramTemp.tabularId = fieldName;
                    //    $scope.GetFormRecordListDynamimc(paramTemp);
                    //}, 150);
                    //var dataArray = [];
                    //angular.forEach(groupBy, function (item) {
                    //    item = JSON.parse(item);
                    //    var list = '';
                    //    list += '{"';
                    //    angular.forEach(item, function (itemData, key) {
                    //        //console.log(itemData)
                    //        list += '' + itemData.name.trim() + '":"' + itemData.value.trim() + '","';
                    //    });

                    //    list += 'formGroupKey":"' + item[item.length - 1].value.trim() + '"';
                    //    list += "}"
                    //    dataArray.push(JSON.parse(list));
                    //});
                    //var formData = JSON.stringify(dataArray);

                    //tabulator.setData([]);
                    // $("input:hidden[name=oneToMany-" + formId + "]").attr('value', formData);
                    // localStorage.removeItem("formOneData");
                    //}
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
                    if (localStorage.getItem("formGroupKey") != "") {
                        var keydata = localStorage.getItem("formGroupKey")
                        $("input:hidden[name=linked_record_key]").attr('value', keydata);
                    }
                    //alert('closed: ' + reference_form);
                    // tabulators["tabulator_1574079483837"].setData("http://192.168.1.141:91/form-generator/public/get-linked-records/" + reference_form + "/0");
                }

            }, 500);
        };



        $scope.bindOnetoManyTabulator = function (dataLocal, fieldName) {
            var temp = JSON.parse(dataLocal);
            if (!DataService.isEmpty(temp)) {
                var filterData = JSON.parse(temp.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';

                angular.forEach(filterData, function (item) {
                    // item = JSON.parse(item);

                    //angular.forEach(item, function (itemData, key) {
                    //console.log(itemData)
                    list += '' + item.name.trim() + '":"' + item.value.trim() + '","';
                    //});                            

                });
                list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                list += "}"
                dataArray.push(JSON.parse(list));

                tabulator.setData(dataArray);
            }
        }


        $scope.deleteRecordsIntoOneMany = function (formid, fieldName) {

            if (confirm('Are you sure to delete selected Record?')) {
                var deletedList = window["formGroupKeyList"]
                var param = {};
                param.action = 3;
                param.formId = formid;
                if (angular.isDefined(deletedList)) {
                    param.formGroupKeyList = deletedList.join();
                    param.AutoIdList = window["AutoIdList"]
                    param.fieldName = fieldName;
                    $scope.GetTabOneToManyDynamimc(param, param.action);
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);
                    // GeneratedFormDataDelete(param);
                }
            }
        }
        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            //dataParam.topicId = $scope.formDetailsDataInfo.topicId;
            //mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (!DataService.isEmpty(response.data.Message)) {
            //                var exists = response.data;
            //                var temp = {};
            //                if (exists.res == 1) {
            //                    notifierService.notifyMessage('success', 'FormRecord', exists.Message);
            //                    angular.forEach(window["formGroupKeyList"], function (item) {
            //                        temp = _.findWhere($scope.formDetailsDataTemp, { reference_form: dataParam.formId.toString() })
            //                        var idx = _.findIndex(temp.data, { Id: item });
            //                        if (angular.isDefined(temp.data))
            //                            temp.data.splice(idx, 1);
            //                    });
            //                    $timeout(function () {
            //                        if (DataService.isEmpty(temp.data))
            //                            temp.data = [];
            //                        tabulator.setData(temp.data);
            //                    }, 150);
            //                    //window["formGroupKeyList"] = null;
            //                }
            //            }
            //        }
            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });
        }

        $scope.loadEntryDataIntoTabulatorOnetoMany = function (paramData, formId, fieldName) {
            $scope.formDataForOneParam = {}
            $scope.formDataForOneParam = paramData;
            $scope.formDataForOneParam.formId = $scope.currentFormId;
            $scope.formDataForOneParam.referenceForm = formId;
            $scope.formDataForOneParam.created_by = $scope.userDetail.Id;
            $scope.formDataForOneParam.update_by = $scope.userDetail.Id;
            mainService.formDataForOne("FormDataForOne", $scope.formDataForOneParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if ($scope.formDataForOneParam.action == 1) {
                            var rowDataTabulator = [];
                            var groupBy = response.data;
                            groupBy = _.groupBy(groupBy, "formGroupKey");
                            var dataArray = [];
                            angular.forEach(groupBy, function (item, grp) {
                                var list = '';
                                list += '{"';
                                angular.forEach(item, function (itemData, key) {
                                    //console.log(itemData)
                                    list += '' + itemData.fieldName.trim() + '":"' + itemData.fieldDataText.trim() + '","';
                                });
                                list += 'formGroupKey":"' + grp.trim() + '"';
                                //list = list.substring(0, list.length - 2);
                                list += "}"
                                dataArray.push(JSON.parse(list));

                            });
                            //list = list.substring(0, list.length - 1);
                            var formData = JSON.stringify(dataArray);
                            //formData = JSON.parse(formData);
                            //console.log(formData);                   
                            tabulator.setData(dataArray);


                            $("input:hidden[name=oneToMany-" + formId + "]").attr('value', formData);

                        }
                        else if ($scope.formDataForOneParam.action == 5) {
                            if (response.data.length > 0) {
                                var formTabulatorOne = response.data[0];
                                var tableData = JSON.parse(formTabulatorOne.fieldDataText);
                                var colList = [];
                                var rowList = [];
                                angular.forEach(tableData, function (item, col) {
                                    angular.forEach(item, function (itemdata, colData) {
                                        //console.log(itemdata)
                                    });
                                });
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
                            var param = {};
                            param.action = 1;
                            $scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        var arrowIcon = function (cell, formatterParams) {
            return "<i class='fa fa-pencil fa-lg';></i>"
            //return "<img src='assets/images/pencil.png' width='20'>";
        };

        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 12) % 12 | 0;
                dt = Math.floor(dt / 12);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(12);
            });
            return uuid;
        }

        $scope.getFormDetails = function (param, tabularId, fieldName) {
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)                            
                        // $rootScope.$emit("HideLoading");   
                        var langId = "1";
                        if (localStorage.getItem("globalLang") != null) {
                            langId = localStorage.getItem("globalLang");
                        }

                        var formDataTemp = response.data[0]
                        var formDatafields = JSON.parse(formDataTemp.fields);
                        _.each(formDatafields, function (item, key) {
                            if (item.length > 1)
                                if (!Array.isArray(item))
                                    formDatafields[key] = JSON.parse(item);
                            _.each(formDatafields[key], function (itemControl, keyControl) {
                                var translateLabel = "";
                                if (!DataService.isEmpty(itemControl.label))
                                    translateLabel = getStringFromMultiligualText(itemControl.label, langId);
                                if (!DataService.isEmpty(translateLabel))
                                    itemControl.label = translateLabel;
                            });
                        });
                        //console.log(formDatafields);

                        var finalArray = [];
                        bindTabulatorColumnsHeader(formDatafields, tabularId, param.formId, fieldName);
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.fileUploadDataEntry = function (id, uploaderType) {
            var oFReader = new FileReader();
            var files = document.getElementById(id).files;
            //alert(uploaderType);
            if (files.length > 1) {

                getMultipleFiles(id);

            }
            else if (files.length == 1) {

                getSingleFile(id, uploaderType);

                //if (files[0].type.match('image.*')) {
                //    oFReader.readAsDataURL(files[0]);
                //    oFReader.onload = function (oFREvent) {
                //        console.log(oFREvent.target.result);
                //        var preview_element = document.getElementById("uploadPreview_" + id);
                //        if (angular.isDefined(preview_element) && preview_element !== null) {
                //            document.getElementById("uploadPreview_" + id).src = oFREvent.target.result;
                //            $("#uploadPreview_" + id).parent().removeClass("hidden");
                //            $("#uploadPreview_" + id).parent().parent().find('.file-title').html('');
                //        }


                //    }
                //} else {
                //    $('#uploadPreview_' + id).removeAttr('src'); 
                //    $('#uploadPreview_' + id).parent().addClass('hidden');
                //    var fileAttachments = $('#' + id).parent().parent().find('.attachments .file-attachments');
                //    fileAttachments.find('p').append('<b>' + files.name + '</b>');
                //    fileAttachments.removeClass("hidden");
                //    $("input:hidden[name=" + id + "]").attr('value', oFREvent.target.result);
                //}


            };
            $scope.uploadFileOnly(files, id, uploaderType);

        };

        $scope.uploadFileOnly = function (element, id, uploadType) {
            if (angular.isDefined(element)) {
                var fileData = element;
                var fd = new FormData();
                var reqType = "form";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                var appIdParam = $scope.importFormSettings.applicationId;
                var appTitleParam = $scope.importFormSettings.applicationTitle;
                var formIdParam = $scope.importFormSettings.formId;
                var formTitleParam = $scope.importFormSettings.title;
                var counterfile = 0;
                angular.forEach(fileData, function (value, key) {
                    //console.log(value);
                    counterfile++;
                    var NamingIndex = "file" + counterfile.toString();
                    fd.append(NamingIndex, value);
                });
                //fd.append('file', fileData);

                //console.log(fd);
                mainService.uploadFile("UploadFile", fd, reqType, uid, appIdParam, appTitleParam, formIdParam, formTitleParam, false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                if (response.data.code == 200) {
                                    var urlStr = response.data.fileUrl;
                                    //if()
                                    if (uploadType == "multi")
                                        setHiddenField(id, urlStr);
                                    else {
                                        $("input:hidden[name=" + id + "]").val(urlStr);
                                    }
                                    console.log("uploaded Successfully");
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
        };

        function setHiddenField(uploaderId, url) {
            var value = $("input:hidden[name=" + uploaderId + "]").val();

            if (value == 'null' || value == "" || typeof value === "undefined") {
                // alert('isnull');
                $("input:hidden[name=" + uploaderId + "]").attr('value', url);

            }
            else {

                var Arr = url.split(',');

                angular.forEach(Arr, function (item, key) {
                    if (value.indexOf(item) > -1) {

                    }
                    else {
                        value += ',' + item;
                    }

                });


                $("input:hidden[name=" + uploaderId + "]").attr('value', value);


            }



            //$("input:hidden[name=" + id + "]").attr('value', "");


        }

        var finalArray = [];
        var popupTabulator = {};
        var tabulator = {};
        var tempTabulatorList = {};
        function editCheckRow(e, cell) {
            console.log('cell-editCheckRow')
        }

        function bindTabulatorColumnsHeader(formDetails, tabularId, formId, fieldName) {
            finalArray = [];
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                item.name = item.field;
                item.label = item.title;
                if (item.List_column1 == "Yes") {
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multiple == true) {
                                finalArray.push({
                                    title: item.label, formatter: multilFiles, width: 200, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {
                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.label, formatter: arrowImage, width: 200, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: "input"
                                });
                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit) && item.Inline_Edit == "Yes") {
                                    finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input", visible: false });
                                    finalArray.push({
                                        title: item.label, bottomCalc: showFooter(item), width: 200, field: "RowID-" + item.name, align: "left", headerFilter: "input", editor: "input", cellEdited: function (cell) {
                                            console.log("cell" + cell)
                                        }
                                    });
                                }
                                else {
                                    finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input" });
                                }
                            }
                            else {
                                $scope.displayInTabData = item;
                            }
                        }
                    }
                }
            });

            finalArray.unshift({
                title: "formId", field: "formId", visible: false
            });
            finalArray.unshift({ title: "Id", field: "Id", visible: false });
            finalArray.unshift({ title: "AutoId", field: "AutoId", visible: false });
            finalArray.unshift({
                title: "Edit", bottomCalc: showFooter({}), width: 80, field: "editRow", formatter: arrowIcon, headerSort: false, align: "center", cellClick: function (e, cell) {
                    var autoid = (!DataService.isEmpty(cell.getRow().getData().AutoId)) ? parseInt(cell.getRow().getData().AutoId) : 0;
                    if (autoid != 0)
                        $scope.entryPage(formId, true, cell.getRow().getData().formGroupKey, autoid, false, true, fieldName);
                    else
                        $scope.entryPage(formId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id, false, true, fieldName);
                }
            });

            //   $timeout(function () {
            if ($("#" + tabularId).length) {
                tempTabulatorList[tabularId] = new initTabulator(tabularId, {
                    placeholder: "No Data.",
                    height: "300px",
                    layout: "fitColumns",
                    selectable: true,
                    movableRows: true,
                    responsiveLayout: false,

                    cellEdited: function (cell) {
                        //This callback is called any time a cell is edited
                        var input = []; var json = {}; var columnName = cell.getColumn().getField();
                        json[columnName] = (columnName === "status" ? formStatus.indexOf(cell.getValue()) : cell.getValue());
                        //input['url'] = "{{url('update_custom')}}";
                        input['data'] = { 'table': 'application', 'update': json, 'where': { applicationId: cell.getRow().getData().applicationId } };

                        //if (input['data'].update[columnName]) { ajax_call(input); }
                        if (input['data'].update[columnName]) {
                            //ajax_call(input);
                            var temp = {};
                            temp.columnName = columnName;
                            temp.columnValue = cell.getValue();
                            temp.action = 5;
                            temp.AutoId = cell.getData().AutoId;
                            temp.formGroupKey = cell.getData().formGroupKey;
                            $scope.editRowWiseOneToMany(temp, 5);
                        }
                        else { cell.restoreOldValue(); }
                    },
                    rowSelectionChanged: function (data, rows) {
                        var formGroupKeyList = [];
                        data.forEach(function (item, key) {
                            formGroupKeyList.push(item.formGroupKey);
                        });
                        window["formGroupKeyList"] = formGroupKeyList;
                        var AutoIdList = [];
                        data.forEach(function (item, key) {
                            AutoIdList.push(item.Id);
                        });
                        window["AutoIdList"] = AutoIdList;
                    },
                    ////ajaxFiltering: true,
                    ////ajaxProgressiveLoad: "scroll",
                    //paginationSize: 50
                });
                tempTabulatorList[tabularId].setColumns(finalArray);
                $timeout(function () {
                    $rootScope.safeApply();
                    // tempTabulatorList[tabularId].redraw();
                }, 10);

                finalArray = [];
                //$timeout(function () {            
                window["tabulators"] = tempTabulatorList;

                //}, 250);
                //  $timeout(function () {
                var paramTemp = {};
                paramTemp.action = 4;
                paramTemp.formId = formId;
                paramTemp.tabularId = tabularId;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    paramTemp.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    paramTemp.formGroupKey = $scope.formGroupKey;

                //$scope.GetFormRecordListDynamimc(paramTemp);
                //$scope.GetTabOneToManyDynamimc(paramTemp, paramTemp.action);
                //var tempTabulatorData = localStorage.getItem("tabulatorOnetomany-" + paramTemp.formId);
                //console.log(tempTabulatorData);             
                // if (!DataService.isEmpty(tempTabulatorData)) {
                //$scope.bindOnetoManyTabulator(tempTabulatorData, tabularId);
                window.addEventListener('resize', function () {
                    tempTabulatorList[tabularId].redraw();
                });
                setTimeout(function () { setTabulatorCalc(tabularId); }, 250);
            }
            // }, 150);

            //var paramNew = {};
            //paramNew.action = 5;
            //$scope.loadEntryDataIntoTabulatorOnetoMany(paramNew, formId, fieldName);

            //}, 250);


        };

        $scope.GetFormRecordListDynamimc = function (param) {
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.getFormRecordList("GetFormRecordList", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        console.log(response.data)
                        var formDataTemp = response.data;
                        var exists = _.findWhere($scope.formDetailsDataTemp, { name: param.tabularId });
                        exists.data = formDataTemp;
                        var formDataFields = [];
                        _.each(formDataTemp, function (pagesData, key) {
                            formDataFields.push({ key });
                        });
                        $timeout(function () {
                            tabulator.setData(exists.data);
                        }, 150);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.GetTabOneToManyDynamimc = function (param, type) {
            if (!$scope.isEdit && type == 1) {
                param.action = 1;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
                if (!DataService.isEmpty(localStorage.getItem("insertReferrence"))) {
                    var temp = {};
                    temp = JSON.parse(localStorage.getItem("insertReferrence"));
                    if (!DataService.isEmpty(temp.formGroupKey))
                        param.formGroupKey = temp.formGroupKey;
                    else
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    param.MasterFormID = temp.MasterFormID;
                }
            }
            else if (type == 2 && $scope.isEdit == true) {
                param.action = 2;
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 3) {
                param.action = 3;
            }
            else if (type == 4) {
                //param.action = 2;

                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;

            }
            else if (type == 5 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 7 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            var formId = $stateParams.formId;
            param.formId = formId;
            var oneToManyParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            oneToManyParam.created_by = $scope.userDetail.Id;
            oneToManyParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (DataService.isEmpty(oneToManyParam.tabularId))
                            oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        //console.log(response.data)
                        var tempTabulatorData = response.data;
                        if (oneToManyParam.action == 4) {
                            var currentFormId = parseInt(oneToManyParam.formId);
                            if (tempTabulatorData.length > 0) {
                                if (tempTabulatorData[0].formId == currentFormId) {
                                    var dataArray = [];
                                    var oneToManyTempData = [];
                                    if (!DataService.isEmpty(tempTabulatorData)) {
                                        angular.forEach(tempTabulatorData, function (item) {
                                            if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                                var tempData = JSON.parse(item.formfieldDataListTemp)
                                                if (!DataService.isEmpty(tempData)) {
                                                    if (tempData.length > 1) {
                                                        _.map(tempData, function (tempitem) {
                                                            return _.extend(tempitem, {
                                                                "AutoId": item.AutoId
                                                            });
                                                        });
                                                        //tempData.push({
                                                        //    "name": "AutoId", "value": item.AutoId
                                                        //});
                                                        //oneToManyTempData=tempData;
                                                        oneToManyTempData.push(tempData);
                                                    } else if (tempData.length == 1) {
                                                        tempData[0].AutoId = item.AutoId;
                                                        dataArray.push(tempData[0]);
                                                    }
                                                }
                                            }
                                        });
                                        if (!DataService.isEmpty(oneToManyTempData)) {

                                            angular.forEach(oneToManyTempData, function (filterData) {
                                                //var filterData = oneToManyTempData;

                                                var list = '';
                                                list += '{"';

                                                angular.forEach(filterData, function (item, key) {
                                                    // item = JSON.parse(item);

                                                    if (item.constructor == Object) {
                                                        list = '';
                                                        list += '{"';
                                                        angular.forEach(item, function (itemData, keyData) {
                                                            list += '' + keyData + '":"' + itemData + '","';
                                                            list += 'RowID-' + keyData + '":"' + itemData + '","';
                                                        });
                                                        list += 'formId":"' + oneToManyParam.formId + '"';
                                                        //list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                                                        list += "}"
                                                        //setTabulatorRowData(JSON.parse(list));
                                                        dataArray.push(JSON.parse(list));
                                                    } else {
                                                        //angular.forEach(item, function (itemData, key) {
                                                        //console.log(itemData)
                                                        if (item.hasOwnProperty('name')) {
                                                            list += '' + item.name + '":"' + item.value + '","';
                                                            list += 'RowID-' + item.name + '":"' + item.value + '","';
                                                        } else {
                                                            list += '' + key + '":"' + item + '","';
                                                            list += 'RowID-' + key + '":"' + item + '","';
                                                        }
                                                    }
                                                    //});                            

                                                });

                                            });

                                        }
                                        $scope.formDetailsDataTemp = angular.copy(dataArray);
                                        tempTabulatorList[oneToManyParam.tabularId].setData(dataArray);
                                    }
                                    console.log(tempTabulatorData);
                                } else {
                                    var dataArray = [];
                                    var oneToManyTempData = [];
                                    if (!DataService.isEmpty(tempTabulatorData)) {
                                        angular.forEach(tempTabulatorData, function (item) {
                                            if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                                var tempData = JSON.parse(item.formfieldDataListTemp)
                                                if (!DataService.isEmpty(tempData)) {
                                                    if (tempData.length > 1) {
                                                        //tempData.push({
                                                        //    "name": "AutoId", "value": item.AutoId,
                                                        //    "name": "formGroupKey", "value": item.formGroupKey
                                                        //});
                                                        _.map(tempData, function (tempitem) {
                                                            return _.extend(tempitem, {
                                                                "AutoId": item.AutoId
                                                            });
                                                        });
                                                        oneToManyTempData = tempData;
                                                        //oneToManyTempData.push(tempData);
                                                    } else if (tempData.length == 1) {
                                                        tempData[0].AutoId = item.AutoId;
                                                        tempData[0].formGroupKey = item.formGroupKey;
                                                        dataArray.push(tempData[0]);
                                                    }
                                                }
                                            }
                                        });
                                        if (!DataService.isEmpty(oneToManyTempData)) {

                                            angular.forEach(oneToManyTempData, function (filterData) {
                                                //var filterData = oneToManyTempData;

                                                var list = '';
                                                list += '{"';

                                                angular.forEach(filterData, function (item, key) {
                                                    // item = JSON.parse(item);

                                                    //angular.forEach(item, function (itemData, key) {
                                                    //console.log(itemData)
                                                    if (!DataService.isEmpty(item.name)) {
                                                        list += '' + item.name + '":"' + item.value + '","';
                                                        list += 'RowID-' + item.name + '":"' + item.value + '","';
                                                    } else {
                                                        list += '' + key + '":"' + item + '","';
                                                        list += 'RowID-' + key + '":"' + item + '","';
                                                    }
                                                    //});                            

                                                });
                                                list += 'formId":"' + oneToManyParam.formId + '"';
                                                //list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                                                list += "}"
                                                //setTabulatorRowData(JSON.parse(list));
                                                dataArray.push(JSON.parse(list));
                                            });

                                        }
                                        $scope.formDetailsDataTemp = angular.copy(dataArray);
                                        tempTabulatorList[oneToManyParam.tabularId].setData(dataArray);
                                    }
                                    console.log(tempTabulatorData);
                                }
                            }
                        }
                        else if (oneToManyParam.action == 5 && $stateParams.popup == 3) {
                            var tempParam = response.data;
                            if (tempParam.length > 0) {
                                var tempData = JSON.parse(tempParam[0].formfieldDataListTemp);
                                $scope.formDataInfo = tempParam[0];

                                var timeampm = $scope.formDataInfo.created_at.substring($scope.formDataInfo.created_at.length - 2, $scope.formDataInfo.created_at.length)
                                var datetime = $scope.formDataInfo.created_at.substring(0, $scope.formDataInfo.created_at.length - 2)
                                $scope.formDataInfo.created_at = datetime + " " + timeampm;
                                if (DataService.isEmpty($scope.formDataInfo.updated_at))
                                    $scope.formDataInfo.updated_at = $scope.formDataInfo.created_at;
                                $scope.formDataList = tempData;
                            }
                            $scope.bindUpdateControlsNew();
                        }
                        else if (oneToManyParam.action == 1 && $stateParams.popup == 2) {
                            //var exists = tempTabulatorData[0];
                            notifierService.notifyMessage('success', 'FormEntry', response.data[0].Message);
                        }
                        else if (oneToManyParam.action == 2) {
                            //var exists = tempTabulatorData[0];
                            //notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                        }
                        else if (oneToManyParam.action == 3) {
                            var exists = tempTabulatorData[0];
                            var temp = {};
                            // temp = $scope.formDetailsDataTemp;
                            temp = $scope.formDataTabulatorTempWithoutGroupBy;
                            angular.forEach(window["AutoIdList"], function (item) {
                                //temp = _.findWhere($scope.formDetailsDataTemp, { AutoId: item })
                                var idx = _.findIndex(temp, { Id: item });
                                if (angular.isDefined(temp))
                                    temp.splice(idx, 1);
                            });
                            $timeout(function () {
                                if (DataService.isEmpty(temp))
                                    temp = [];

                                tempTabulatorList[param.tabularId].setData(temp);
                            }, 150);

                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                        }
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (oneToManyParam.action != 4)
                            if (!DataService.isEmpty(param.tabularId))
                                setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);
                        //var formDataTemp = response.data;
                        //var exists = _.findWhere($scope.formDetailsDataTemp, { name: param.tabularId });
                        //exists.data = formDataTemp;
                        //var formDataFields = [];
                        //_.each(formDataTemp, function (pagesData, key) {
                        //    formDataFields.push({ key });
                        //});
                        //$timeout(function () {
                        //    tabulator.setData(exists.data);
                        //}, 150);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.editRowWiseOneToMany = function (param, type) {
            if (type == 5) {
                param.action = 5;
                if (!DataService.isEmpty(param.formGroupKey))
                    if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    else
                        param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 2) {
                param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        console.log(response.data)
                        var tempData = response.data;
                        if (newParam.action == 5) {

                            $scope.editRowTempData = tempData;
                            if (!DataService.isEmpty(tempData))
                                tempData = tempData[0];
                            $scope.editRowTempData = tempData;
                            var formfieldDataListTemp = tempData.formfieldDataListTemp;
                            if (!DataService.isEmpty(formfieldDataListTemp)) {
                                var formfieldDataListTemp1 = JSON.parse(formfieldDataListTemp);
                                var col = newParam.columnName.replace('RowID-', '');
                                _.each(formfieldDataListTemp1, function (item, key) {
                                    _.each(item, function (itemData, keyData) {
                                        if (!DataService.isEmpty(itemData.name)) {
                                            if (itemData.name == col || itemData.name == newParam.columnName) {
                                                itemData.value = newParam.columnValue;
                                            }
                                        }
                                        else {
                                            if (itemData == col || itemData == newParam.columnName) {
                                                item["value"] = newParam.columnValue;
                                            } else if (!DataService.isEmpty(itemData)) {
                                                if (itemData == col) {
                                                    item[keyData] = newParam.columnValue;
                                                }
                                            }
                                        }
                                    });
                                });
                                $scope.editRowTempData.formfieldDataListTemp = JSON.stringify(formfieldDataListTemp1);
                                $scope.editRowTempData.action = 2;
                                $scope.editRowWiseOneToMany($scope.editRowTempData, 2);
                                //var temp = _.filter(formfieldDataListTemp, function (item, key) {
                                //    return item[newParam.columnName] == newParam.columnName;
                                //});
                            }
                        }
                        else if (newParam.action == 2) {
                            var exists = tempData[0];
                            notifierService.notifyMessage('success', 'FormEntry Updated', exists.Message);

                        }
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        function setTabulatorRowData(list) {
            angular.forEach(list, function (item, key) {
                $("#formGeneratorTabulatortabulator-1512043722039").find(".tabulator-cell[tabulator-field='RowID-" + key + "']").val(item);
            });
        }

        function createTableandColumn(fieldData, pageKey) {
            var Display_Only = (typeof fieldData.Display_Only !== 'undefined' && fieldData.Display_Only !== 'No') ? 'disabled' : '';
            var width = (typeof fieldData.width !== 'undefined') ? fieldData.width + 'px' : '100%';
            var $table = $("<table>", { 'class': fieldData.className, 'name': fieldData.name, 'style': 'border-collapse: collapse; border-style: solid;width: ' + width, 'border': fieldData.border });
            var $thead = $("<thead>");
            $table.append($thead);
            // columns
            var tableHeads = '', multipleHeads;
            if (fieldData.columnHeadings && fieldData.columnHeadings.trim() !== '') {
                var headings = fieldData.columnHeadings.trim();
                var headArray = headings.split('|');
            } else {
                var headArray = [];
            }
            multipleHeads = checkForMultipleHeaders(headArray);
            var columnRows = (multipleHeads > 0) ? 2 : 1;
            var resultstring, tableColumns = (multipleHeads > 0) ? 0 : parseInt(fieldData.columns);
            for (var i = 0; i < columnRows; i++) {
                resultstring = '';
                resultstring += '<tr>';
                for (var j = 0; j < fieldData.columns; j++) {
                    if (multipleHeads > 0 && i === 1) {
                        // second row of column
                        tableHeads = getSubHeading(headArray[j]);
                        if (tableHeads['multiple']) {
                            tableHeads['subheadings'].forEach(function (subheading) {
                                resultstring += '<th>' + subheading + '</th>';
                            });
                            tableColumns += tableHeads['subheadings'].length;
                        }
                    } else {
                        // first row of column
                        if (headArray.length > 0 && headArray[j]) {
                            tableHeads = getSubHeading(headArray[j]);
                            if (!tableHeads['multiple']) {
                                if (multipleHeads > 0) {
                                    resultstring += '<th rowspan="2">' + tableHeads['heading'] + '</th>';
                                    tableColumns++;
                                }
                                else {
                                    resultstring += '<th>' + tableHeads['heading'] + '</th>';
                                }
                            } else {
                                resultstring += '<th colspan="' + tableHeads['subheadings'].length + '">' + tableHeads['heading'] + '</th>';
                            }
                        }
                    }
                }
                resultstring += '</tr>';
                $thead.append(resultstring);
            }

            // rows
            var $tbody = $("<tbody>");
            $table.append($tbody);
            var numRows = parseInt(fieldData.rows);
            if (fieldData.rowHeadings && fieldData.rowHeadings.trim() !== '') {
                var headings = fieldData.rowHeadings.trim();
                var rowHeadArray = headings.split('|');
            } else {
                var rowHeadArray = [];
            }
            for (var i = 0; i < numRows; i++) {
                // columns
                resultstring = '';
                resultstring += '<tr>';
                for (var j = 0; j < tableColumns; j++) {
                    if (j === 0 && rowHeadArray.length > 0 && rowHeadArray[i]) {
                        resultstring += '<td>' + rowHeadArray[i].trim() + '</td>';
                    } else {
                        if (typeof headArray[j] !== 'undefined') {
                            tableHeads = getSubHeading(headArray[j]);
                            if (tableHeads['multiple']) {
                                for (var k = 1; k <= tableHeads['subheadings'].length; k++) {
                                    $scope.addListOutPutControls(fieldData.columnInputs, j + 1, i, fieldData.worksheet, fieldData.name);
                                    var field = generateColumnFieldCustom(fieldData.columnInputs, j + 1, fieldData.name, '', i, Display_Only, fieldData.worksheet, '', true, pageKey);
                                    resultstring += '<td>' + field.result + '</td>';
                                }
                            } else {
                                var field = generateColumnFieldCustom(fieldData.columnInputs, j + 1, fieldData.name, '', i, Display_Only, fieldData.worksheet, '', false, pageKey);
                                $scope.addListOutPutControls(fieldData.columnInputs, j + 1, i, fieldData.worksheet, fieldData.name);
                                var widthClass = (Math.round((field.width * 12) / 100));
                                var putClassCol = (widthClass != '0' || widthClass !== 'undefined') ? "col-sm-" + widthClass : "";
                                resultstring += '<td class="' + putClassCol + '">' + field.result + '</td>';
                                //                            resultstring += '<td>' + field.result + '</td>';
                            }
                        }
                    }
                }
                resultstring += '</tr>';
                $tbody.append(resultstring);
            }
            return '<div class="table-responsive">' + $table[0].outerHTML + '</div>';
        };

        $scope.onEntryFormSubmit = function (formFields) {
            if (!DataService.isEmpty(selectedRecordOneToMany) && selectedRecordOneToMany.length > 0) {
                $scope.listOfReferrenceFields = [];
                angular.forEach($scope.formFields, function (pageData, key) {
                    var temp = _.filter(pageData, function (item) {
                        return !DataService.isEmpty(item.update_operation);
                    });
                    if (!DataService.isEmpty(temp)) {
                        temp[0].Id = selectedRecordOneToMany[0].Id;
                        temp[0].formID = selectedRecordOneToMany[0].formID;
                        temp[0].MasterFormRow = selectedRecordOneToMany[0].Id;
                        temp[0].MasterFormID = selectedRecordOneToMany[0].formID;
                        temp[0].formGroupKey = selectedRecordOneToMany[0].formGroupKey;
                        temp[0].oldValue = selectedRecordOneToMany[0][temp[0].Update_Form_Field];
                        $scope.listOfReferrenceFields.push(temp[0]);
                        //selectedRecordOneToMany
                    }
                });
            } else {

            }
            //console.log("listOfReferrenceFields" + $scope.listOfReferrenceFields);

            modifyFormData();

        }

        function modifyFormData() {
            $rootScope.$emit("ShowLoading");
            if ($scope.myForm.$invalid) return false;
            var temp = $("#customFormNew").serializeArray();
            //console.log(temp, 'temp');
            var frm = $('#customFormNew').find(":input:not(:hidden)").serialize();

            // console.log(temp);
            var param = {};
            if (!$scope.isEdit) {
                param.action = 1;
                param.formGroupKey = $scope.freshEntryformGroupKey;
                if ($scope.isSaveEvent) {
                    if (!DataService.isEmpty($stateParams.formGroupKey)) {
                        param.formGroupKey = $stateParams.formGroupKey;
                    } else {
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    }
                    if (!DataService.isEmpty($scope.formGroupKey))
                        param.formGroupKey = $scope.formGroupKey;
                    temp.push({ "formGroupKey": param.formGroupKey, "name": "formGroupKey", "value": param.formGroupKey });
                }
                else {
                    temp.push({ "formGroupKey": $scope.freshEntryformGroupKey, "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
                }
            }
            else {
                param.action = 2;
                param.formGroupKey = $scope.formGroupKey;

                param.Id = $scope.rowId;
                temp.push({ "formGroupKey": $scope.formGroupKey, "name": "formGroupKey", "value": $scope.formGroupKey });
            }
            if (!DataService.isEmpty($stateParams.parentFormId)) {
                // $scope.eventId = $stateParams.eventId;
                //$scope.parentFormId = $stateParams.parentFormId;          
                $scope.parentFormListControls = [];
                _.each($scope.formFields, function (pageControlList) {
                    var exists = _.where(pageControlList, { Referral_Forms: $stateParams.parentFormId });
                    if (!DataService.isEmpty(exists) && exists.length > 0) {
                        _.each(exists, function (item) {
                            $scope.parentFormListControls.push(item);
                        });
                    }
                });

                if ($scope.defaultSelected) {
                    if (localStorage.getItem("formGroupKey" + $stateParams.parentFormId) != null) {
                        var formgroup = localStorage.getItem("formGroupKey" + $stateParams.parentFormId);
                        var index = _.findIndex(temp, { formGroupKey: param.formGroupKey });
                        temp[index].formGroupKey = formgroup;
                        param.formGroupKey = formgroup;
                    }
                }

            }

            var isDropdownCalenderControl = "";
            var referrrenceFormGroupKey = "";
            var listOfHidden = $("input[type='hidden']");
            _.each(listOfHidden, function (item) {
                if (item.id.contains('isDropdownCalender')) {
                    isDropdownCalenderControl = item.value;
                }
            });
            if (isDropdownCalenderControl != "") {
                var exists = _.findWhere(temp, {
                    name: "isDropdownCalender_" + isDropdownCalenderControl
                });
                if (!DataService.isEmpty(exists)) {
                    temp.push({
                        name: isDropdownCalenderControl, value: $("#" + isDropdownCalenderControl).val()
                    });
                }
            }

            var checkboxGroup = [];
            var namecheckbox = "";
            var removeIndexGroup = [];
            var groupByData = _.groupBy(temp, "name");
            var newList = [];
            var counter = 0;
            angular.forEach(groupByData, function (item, key) {
                //console.log(item)
                //console.log(key)
                if (item.length == 1) {
                    if (key.contains("[]") && item[0].value == "") {
                    } else {
                        newList.push({ "name": key, "value": item[0].value });
                    }
                    //if (item[0].name.includes("map")) {

                    //    var items = localStorage.getItem("mapData");
                    //    item[0].value = items;
                    //    newList.push({ "name": key, "value": item[0].value });
                    //} else {
                    //    newList.push({ "name": key, "value": item[0].value });
                    //}
                }
                else if (item.length > 1) {
                    var tmp = _.map(item, function (t) { return t.value }).join(',');
                    newList.push({ "name": key, "value": tmp });
                }
                var controlExists = _.findWhere($scope.parentFormListControls, { name: key });
                if (!DataService.isEmpty(controlExists)) {
                    if (!DataService.isEmpty($scope.eventId)) {
                        newList[counter].value = $scope.eventId;
                    }
                }
                counter++;
            });




            // console.log(newList)
            //_.each(temp, function (item, index) {
            //    if (angular.isDefined(item)) {
            //        if (item.name.includes("map")) {
            //            var items = localStorage.getItem("mapData");
            //            item.value = items;
            //        }
            //        else if (item.name.includes("checkboxGroup")) {
            //            namecheckbox = item.name;
            //            checkboxGroup.push(item.value);
            //            removeIndexGroup.push(index);
            //        }

            //        //item.value = escape(item.value);
            //    }
            //});
            //var tempData = [];
            //if (removeIndexGroup.length > 1) {
            //    angular.forEach(temp, function (item, index) {
            //        if (angular.isDefined(item))
            //            if (namecheckbox != item.name)
            //                tempData.push(item);
            //    });
            //    temp = tempData;
            //}
            //if (namecheckbox != "" && removeIndexGroup.length > 1)
            //    temp.splice(removeIndexGroup[0], 0, { name: namecheckbox, value: checkboxGroup.toString() });




            var allDayExists = _.findWhere(newList, { name: "allDay" });
            if (!DataService.isEmpty(allDayExists)) {
                if (allDayExists.value == "true") {
                    var startIndex = _.findIndex(newList, { name: "start" });
                    var endIndex = _.findIndex(newList, { name: "end" });

                    var startCustom = moment(newList[startIndex].value).format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00 ");
                    var endCustom = moment(newList[startIndex].value).format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    newList[startIndex].value = startCustom.format();
                    newList[endIndex].value = endCustom.format();
                }
            }

            param.formfieldDataListTemp = JSON.stringify(newList);
            if ($scope.listOfReferrenceFields.length > 0) {
                param.formReferrenceFieldsList = JSON.stringify($scope.listOfReferrenceFields);
                param.MasterFormId = $scope.listOfReferrenceFields[0].MasterFormID;
                param.MasterFormRow = $scope.listOfReferrenceFields[0].MasterFormRow;
            }

            if (angular.isDefined($scope.importFormSettings.recordAccessSecurity)) {
                if (!DataService.isEmpty($scope.importFormSettings.recordAccessSecurity.max_one_record_per_user))
                    param.IsMaxOneRecordPerUser = $scope.importFormSettings.recordAccessSecurity.max_one_record_per_user;
                else
                    param.IsMaxOneRecordPerUser = false;
            }

            param.formId = $scope.importFormSettings.formId;
            param.topicId = $scope.importFormSettings.topicId;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.importFormSettings.created_by;
            param.updated_at = $scope.importFormSettings.updated_at;
            param.currentFormType = $scope.importFormSettings.currentFormType;
            param.name = $scope.userDetail.name;
            if (param.action == 2) {
                param.userId = $scope.formDataInfo.userID;
                param.created_by = $scope.formDataInfo.created_by;
                param.updated_at = $scope.formDataInfo.updated_at;
            }
            if ($stateParams.popup == 2) {
                //var exists = localStorage.getItem("tabulatorOnetomany-" + param.formId);
                //if (angular.isDefined(exists) && exists != null && exists != "") {
                //    var temp = JSON.stringify(param);
                //    temp.push(param);
                //    localStorage.setItem("tabulatorOnetomany-" + param.formId, JSON.stringify(temp));
                //} else {
                //    localStorage.setItem("tabulatorOnetomany-" + param.formId, JSON.stringify(param));
                //}      
                GeneratedFormData(param);

                var tempData = JSON.parse(param.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';
                angular.forEach(tempData, function (item) {
                    if (item.constructor == Object) {

                        list += '' + item.name + '":"' + item.value + '","';
                        list += 'RowID-' + item.name + '":"' + item.value + '","';

                    }
                });
                list = list.substring(0, list.length - 2);
                list += "}"
                dataArray.push(JSON.parse(list));
                param.formfieldDataListTemp = JSON.stringify(dataArray);
                // $scope.GetTabOneToManyDynamimc(param, param.action);




                //notifierService.notifyMessage('success', 'FormEntry', 'Data Saved');

                //$timeout(function () {
                //    $("#customFormNew")[0].reset();
                //    //$scope.freshEntryformGroupKey = create_UUID();
                //    $("#formGroupKey").val($scope.freshEntryformGroupKey);
                //}, 500);
            }
            else if ($stateParams.popup == 3) {
                param.action = 2;
                var tempData = JSON.parse(param.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';
                angular.forEach(tempData, function (item) {
                    if (item.constructor == Object) {

                        list += '' + item.name + '":"' + item.value + '","';
                        list += 'RowID-' + item.name + '":"' + item.value + '","';

                    }
                });
                list = list.substring(0, list.length - 2);
                list += "}"
                dataArray.push(JSON.parse(list));
                param.formfieldDataListTemp = JSON.stringify(dataArray);
                $scope.GetTabOneToManyDynamimc(param, param.action);
                //notifierService.notifyMessage('success', 'FormEntry', 'Data Updated');
            }
            else {
                //if (!DataService.isEmpty($scope.eventId)) {
                //    alert('save edit event')
                //    $rootScope.$emit("HideLoading");
                //    return false;
                //}
                GeneratedFormData(param);
            }
            //param.FormFieldListTemp = formFields;

            //mainService.manageFormData("FormData", param)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (!DataService.isEmpty(response.data.Message)) {
            //                var exists = response.data;
            //                if (exists.res == 1) {
            //                    notifierService.notifyMessage('success', 'FormEntry', exists.Message);
            //                    $("#customFormNew")[0].reset();
            //                    $scope.freshEntryformGroupKey = create_UUID();
            //                    $("#formGroupKey").val($scope.freshEntryformGroupKey);
            //                    $state.reload();
            //                } else {
            //                    notifierService.notifyMessage('error', 'FormEntry', exists.Message);
            //                    $("#customFormNew")[0].reset();
            //                    $scope.freshEntryformGroupKey = create_UUID();
            //                    $("#formGroupKey").val($scope.freshEntryformGroupKey)
            //                }
            //                if (angular.isDefined(tabulator))
            //                    tabulator.clearData();
            //                //console.log(response.data[0]);

            //                //console.log(formData);                     
            //            }
            //        }
            //    }, function (err) {
            //        console.log("some error occured." + err);
            //    });
            // alert('hi')
        }

        $scope.insertNewRecordQueue = function () {
            $timeout(function () {
                // $scope.refreshButtonFunc();
                window.location.reload();
            }, 300);
        };

        function GeneratedFormData(dataParam) {
            //console.log('check if PP control + add redirect URL on success submit')
            $rootScope.$emit("ShowLoading");
            //if (!DataService.isEmpty(dataParam.updated_at)) {
            //    dataParam.updated_at = new Date(dataParam.updated_at);
            //}
            //console.log(dataParam,'dataParam');
            //return false;
            dataParam.resourceFormId = $scope.ySelection;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {

                                /* 
             whatsapp notification sms func by SR078
             */
                                var Wparam = {};
                                if ($scope.isEdit == false) {
                                    Wparam.crudNotify = 1;
                                }
                                else {
                                    Wparam.crudNotify = 2;
                                }
                                Wparam.link = mainService.getBaseUrl() + "#/form/records/" + $scope.importFormSettings.formId;//$scope.importFormSettings.formRecordUrl;
                                Wparam.userID = $scope.userDetail.Id;
                                Wparam.formId = $scope.importFormSettings.formId;
                                Wparam.action = 1;
                                Wparam.record_id = response.data.Id;
                                //console.log(Wparam,'Wparam');
                                mainService.manageCRUDWhatsAppN("ManageCRUDWhatsAppN", Wparam)
                                    .then(function (responseW) {
                                        var data = responseW.data;
                                        console.log(responseW.data, 'responseW.data;');
                                        if (data != null && angular.isDefined(data)) {
                                            console.log('success');

                                        }
                                    });

                                $scope.currentDateTime = new Date();
                                $timeout(function () {
                                    if ($stateParams.popup == 1) {
                                        $scope.freshEntryformGroupKey = create_UUID();
                                        $("#formGroupKey").val($scope.freshEntryformGroupKey);
                                        localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                        if ($scope.importFormSettings.currentFormType == 2) {
                                            if (!$scope.isEdit) {
                                                $scope.refreshButtonFunc();
                                                $timeout(function () {
                                                    var dialog = $ngBootbox.customDialog({
                                                        templateUrl: 'autogenerateModelUp.html',
                                                        scope: $scope,
                                                        title: 'Ticket Number',
                                                        size: "large"
                                                        //  buttons: $scope.customDialogButtons
                                                    });
                                                    $timeout(function () {
                                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                                        Waves.attach('.flat-buttons', ['waves-button']);
                                                        Waves.init();
                                                    }, 250);
                                                }, 600);
                                                $timeout(function () {

                                                }, 300);
                                            }
                                        }
                                        if ($scope.isEdit) {
                                            $timeout(function () {
                                                window.history.back();
                                            }, 1050);
                                        }
                                    }
                                    else if (angular.isUndefined($stateParams.popup)) {
                                        $scope.freshEntryformGroupKey = create_UUID();
                                        $("#formGroupKey").val($scope.freshEntryformGroupKey);
                                        localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                        if ($scope.importFormSettings.currentFormType == 2) {
                                            if (!$scope.isEdit) {
                                                $scope.refreshButtonFunc();
                                                $timeout(function () {
                                                    var dialog = $ngBootbox.customDialog({
                                                        templateUrl: 'autogenerateModelUp.html',
                                                        scope: $scope,
                                                        title: 'Ticket Number',
                                                        size: "large"
                                                        //  buttons: $scope.customDialogButtons
                                                    });
                                                    $timeout(function () {
                                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                                        Waves.attach('.flat-buttons', ['waves-button']);
                                                        Waves.init();
                                                    }, 250);
                                                }, 500);
                                            }
                                        }
                                    }
                                    if ($scope.entryForOneToMany) {
                                        //var existsData = localStorage.getItem("formOneData")
                                        //var temp = _.findWhere($scope.formDetailsDataTemp, { reference_form: exists.formId.toString() })
                                        //if (!DataService.isEmpty(existsData)) {
                                        //    var newData = [];
                                        //    newData = JSON.parse(existsData);
                                        //    newData.push(temp.data);
                                        //    var newexists = JSON.stringify(newData);
                                        //    localStorage.setItem("formOneData", newexists);
                                        //}
                                        //else {
                                        //    var newData = [];
                                        //    newData.push(temp.data);
                                        //    var newexists = JSON.stringify(newData);
                                        //    localStorage.setItem("formOneData", newexists);
                                        //}
                                    }
                                    $("#customFormNew")[0].reset();
                                    $timeout(function () {
                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                        Waves.attach('.flat-buttons', ['waves-button']);
                                        Waves.init();
                                    }, 250);
                                }, 1000);







                                //var qrString = $location.search();

                                //console.log(qrString);
                                //if (angular.isDefined(qrString.isAnonymous)) {
                                //    localStorage.removeItem('detail');
                                //    $state.go("login", { reload: true, inherit: false });
                                //}
                                //else
                                if ($scope.importFormSettings.currentFormType != 2 && $scope.PPControl == true) {
                                    //go to paypal URL
                                    // $scope.amt = $scope.amount;
                                    var checkcontrol = Object.values($scope.formFields)[0].filter(x => x.type == "PayPal");

                                    if (!DataService.isEmpty(checkcontrol)) {
                                        if (checkcontrol.length > 0) {
                                            var refControl = checkcontrol[0].customAmountReferenceControlId;
                                            $rootScope.customControl = checkcontrol[0];
                                            if (checkcontrol[0].customAmount == "Yes") {
                                                var formDataTemp = $("#customFormNew").serializeArray();
                                                if (!DataService.isEmpty(refControl)) {
                                                    var exists = _.findWhere(formDataTemp, { "name": refControl });
                                                    if (!DataService.isEmpty(exists)) {
                                                        if (exists.value != "0")
                                                            $scope.amount = exists.value;
                                                        $rootScope.amount = $scope.amount;

                                                    }
                                                }
                                            }
                                        }
                                    }

                                    $scope.rec_id = response.data.Id;
                                    console.log(response.data.Id)
                                    if (!$scope.isEdit) {
                                        $timeout(function () {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'payment.html',
                                                scope: $scope,
                                                title: 'Payment',
                                                size: "large"
                                                //  buttons: $scope.customDialogButtons
                                            });
                                        }, 200);
                                    }
                                    else {

                                        if (!DataService.isEmpty($scope.formDataInfo.PaymentStatus) && $scope.formDataInfo.PaymentStatus == "1") {

                                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                                            $timeout(function () {
                                                location.reload();
                                            }, 1000);
                                        }
                                        else {
                                            $scope.rec_id = response.data.Id;
                                            $timeout(function () {
                                                var dialog = $ngBootbox.customDialog({
                                                    templateUrl: 'payment.html',
                                                    scope: $scope,
                                                    title: 'Payment',
                                                    size: "large"
                                                    //  buttons: $scope.customDialogButtons
                                                });
                                            }, 200);
                                        }

                                    }

                                    // console.log('sona 23 nov', response.data.Id);

                                    // return false;
                                    // $state.go('application');

                                }
                                else if ($scope.importFormSettings.currentFormType != 2 && $scope.PPControl == false) {
                                    //notifierService.notifySweetAlertMessage('success', 'FormEntry', exists.Message);
                                    notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                                    /*update calender referrence*/

                                    if (!DataService.isEmpty($scope.customForms)) {
                                        var calenderRefParam = {};
                                        calenderRefParam.customForms = $scope.customForms;
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        if (calenderRefParam.customForms.contains(',')) {
                                            var listFormTemp = [];
                                            var listFormTempIds = [];
                                            var listForm = calenderRefParam.customForms.split(',');
                                            _.each(listForm, function (item) {
                                                listFormTemp.push(item.trim());
                                            });

                                            var listFormIds = calenderRefParam.customFormIds.split(',');
                                            _.each(listFormIds, function (item) {
                                                listFormTempIds.push(item.trim());
                                            });
                                            if (!DataService.isEmpty(dataParam.formfieldDataListTemp)) {
                                                var formDataJsonParse = JSON.parse(dataParam.formfieldDataListTemp);
                                                _.each(listFormTemp, function (item, key) {
                                                    var existsResources = _.findWhere(formDataJsonParse, { "name": "resources_" + item });
                                                    if (!DataService.isEmpty(existsResources)) {
                                                        listFormTempIds[key] = existsResources.value.trim();
                                                    }
                                                    var existsActivities = _.findWhere(formDataJsonParse, { "name": "activities_" + item });
                                                    if (!DataService.isEmpty(existsActivities)) {
                                                        listFormTempIds[key] = existsActivities.value.trim();
                                                    }
                                                });
                                                $scope.customFormIds = listFormTempIds.join(',');
                                                calenderRefParam.customForms = listFormTemp.join(',');
                                                //$stateParams.customFormIds = $scope.customFormIds;
                                                //console.log(formDataJsonParse)
                                            }
                                        }
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        if ($scope.isEdit == true)
                                            calenderRefParam.action = 6;
                                        else
                                            calenderRefParam.action = 11;
                                        calenderRefParam.formId = $scope.importFormSettings.formId;
                                        calenderRefParam.formGroupKey = exists.formGroupKey;
                                        $scope.updateCalenderReferrence(calenderRefParam)
                                    }
                                    else {
                                        if ($scope.isSaveEvent) {
                                            window.close();
                                        }
                                    }
                                    if (!DataService.isEmpty(localStorage.getItem("newWindow"))) {
                                        window.close();
                                    }


                                }
                            }
                            else {
                                if (exists.res == -1) {
                                    swal({
                                        //title: "Are you sure to refresh this page?",
                                        title: exists.Message,
                                        //text: exists.Message,
                                        type: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, Refresh it!'
                                    }).then((result) => {
                                        if (result.value) {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    notifierService.notifyMessage('error', 'FormEntry', exists.Message);
                                    $("#customFormNew")[0].reset();
                                    $scope.freshEntryformGroupKey = create_UUID();
                                    $("#formGroupKey").val($scope.freshEntryformGroupKey)
                                    localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                }

                            }
                            //if (angular.isDefined(tabulator))
                            // tabulator.clearData();
                            //console.log(response.data[0]);

                            //console.log(formData);                     
                        }


                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        //payment click 
        $scope.proceedtoPay = function (formid, rec_id, amt, pid, pcurrency) {
            //console.log($scope.userDetails,'$scope.userDetails')
            //return false;
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.action = 9;

            param.Id = rec_id;
            param.userId = $scope.userDetails.Id;
            param.amount = amt;
            param.PAYPAL_ID = pid;
            param.currency = pcurrency;
            param.formId = formid;
            $timeout(function () {

                var formData = new FormData();
                formData.append("USER", "madhvendra009_api2.gmail.com");
                formData.append("PWD", "79WCDCBJE5YUE26R");
                formData.append("SIGNATURE", "AFcWxV21C7fd0v3bYYYRCpSSRl31AoZmYBDy.dNhd4Sa2J7R1LUHAP4N");
                formData.append("VERSION", "123.0");
                formData.append("PAYMENTREQUEST_0_PAYMENTACTION", "Sale");
                formData.append("PAYMENTREQUEST_0_AMT", amt);
                formData.append("PAYMENTINFO_0_CURRENCYCODE", pcurrency)
                formData.append("RETURNURL", "http://localhost:50892/#/form/records/" + formid);//url
                formData.append("CANCELURL", "http://localhost:50892/#/orderHistory");
                formData.append("METHOD", "SetExpressCheckOut");
                //param.METHOD = "GetExpressCheckoutDetails";
                $rootScope.$emit("ShowLoading");

                if (parseFloat(param.amount) != 0) {
                    $state.go("ppPaymentProcess", { "formid": formid, "recId": param.Id }, { reload: true, inherit: false });

                    //$scope.updatePaymentDetails(param);
                }
                else {
                    $rootScope.$emit("HideLoading");
                    notifierService.notifyMessage('success', 'Payment', 'no amount to pay');
                    //location.reload();
                }




            }, 150);
            //swal({
            //    title: "are you sure ? you want to choose this plan?",
            //    text: "Existing Plan will be changed after Successful Process.",
            //    type: 'warning',
            //    showCancelButton: true,
            //    confirmButtonColor: '#3085d6',
            //    cancelButtonColor: '#d33',
            //    confirmButtonText: 'Proceed Now'
            //}).then((result) => {
            //    if (result.value) 
            //    {

            //    }
            // });
        };

        //end of payment click
        $scope.selectedTabFilterCalender = function (selectedId) {
            $('#page-tabs li').removeClass('ui-tabs-active ui-state-active');
            $("#tab-" + selectedId).addClass('ui-tabs-active ui-state-active');
        }

        $scope.selectedTabFilter = function (filterValue, selectedId) {
            $scope.displayInTabData = _.findWhere($scope.allReferrenceData.formDataHeaders, { "Display_tab": true });
            var filterData = angular.copy($scope.formDataTabulatorTempWithoutGroupBy);
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
            //    window["popupTabulator"].setData(bindTRowsData(filterGroupByData));
            //}
            //else {
            //    window["popupTabulator"].setData(bindTRowsData(groupBy));
            //}

            var temp = [];
            var filterDataNew = _.filter(filterData, function (item, key) {
                var filterNest = _.filter(item, function (itemNest, keyNest) {
                    // if (angular.isDefined(itemNest) && $scope.displayInTabData.field == keyNest)
                    itemNest = (!DataService.isEmpty(itemNest)) ? itemNest : "";
                    return itemNest.toString() == filterValue.value;
                });
                if (!DataService.isEmpty(filterNest))
                    temp.push(item)
            });
            window["popupTabulator"].setData(temp);
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
                dataArray.push(JSON.parse(list));
            });



            return dataArray;
        }

        $('#tabulatorModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var form_id = button.attr('data-referral-form-id');
            var modal = $(this);
            var $formIdField = button.attr('data-referral-form-field-id');

            //var lastFormId = $formIdField.val();
            // one to many form control
            if (button.attr('data-one-to-many')) {
                $(this).find("input[name='modal-one-to-many']").val("1");
                $(this).find("input[name='tabulator-id']").val(button.attr('data-tabulator'));
                $(this).find("input[name='modal-field-map']").val(button.attr('data-field-map'));
            }


            if (!DataService.isEmpty(form_id)) {
                $timeout(function () {
                    var param = {};
                    param.action = 2;
                    param.formId = form_id;
                    param.fieldName = $formIdField;
                    mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                        .then(function (response) {
                            console.log(response);
                            $scope.allReferrenceData = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
                            //$scope.tabList.unshift({
                            //    "label": "All", "value": "All","isDefault":true
                            //});
                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                            $timeout(function () {
                                if (!DataService.isEmpty($scope.formDataTabulatorTempWithoutGroupBy))
                                    if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                        $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");

                                var temp = bindTColumnHeader($scope.allReferrenceData.formDataHeaders);
                                temp.unshift(
                                    {
                                        title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                                            cell.getRow().toggleSelect();
                                        }
                                    }
                                )

                                window["popupTabulator"].setColumns(temp);

                                $scope.selectedTabFilter($scope.tabList[0], 0);
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
            //modal.find('.modal-body').block({ message: '<img src="' + loader + '" />', css: { position: 'relative', width: '100%' } });
            //if(form_id != lastFormId){
            //$.getJSON("dddddd/create-form-tabulator-tabs/" + form_id, function (data) {
            //    var hideColumn = "";
            //    if (modal.find('#tabs').tabs("instance")) {
            //        modal.find('#tabs').tabs("destroy");
            //    }

            //    //if (data.template !== "") {
            //    //    hideColumn = data.column;
            //    //    $.each(data.fields, function (key, value) {
            //    //        $("#form-table").tabulator("removeFilter", hideColumn, '=', value);
            //    //    });

            //    //    modal.find('#tabs')
            //    //        .html(data.template)
            //    //        .tabs({
            //    //            create: function (event, ui) {
            //    //                $("#form-table").tabulator("addFilter", hideColumn, '=', ui.tab.data('value'));
            //    //            },
            //    //            activate: function (event, ui) {
            //    //                //$("#form-table").tabulator("setData","{{ url('formDataList') }}/" + form_id);
            //    //                $("#form-table").tabulator("removeFilter", hideColumn, '=', ui.oldTab.data('value'));
            //    //                $("#form-table").tabulator("addFilter", hideColumn, '=', ui.newTab.data('value'));
            //    //            }
            //    //        });
            //    //}
            //});
            //$.getJSON("dddd/create-form-tabulator/" + form_id, function (data) {
            //    //modal.find('.modal-body').unblock();
            //    modal.find('.modal-title').text(data.formTitle);
            //    //$("#form-table").tabulator("setHeight", "450px");

            //    $.each(data.formDataHeaders, function (index, column) {
            //        if (data.formDataHeaders[index]['columnType'] === 'file') {
            //            data.formDataHeaders[index]['formatter'] = imageFormatter;
            //        }
            //    });
            //    $("#form-table").tabulator("setColumns", data.formDataHeaders) //overwrite existing columns with new columns definition array
            //    //$("#form-table").tabulator("hideColumn", hideColumn);
            //    //$("#form-table").tabulator("setData", "tempURLlink/form-generator/public/formDataList/" + form_id + "/popup");
            //    $formIdField.val(form_id);
            //    // Set filters
            //    var userRole = data.userRole, recordFilters = data.recordFilters;
            //    //if (userRole == 0) {
            //    //    $.each(recordFilters, function (key, value) {
            //    //        if (typeof (value['filter-type']) !== 'undefined') {
            //    //            if (value['filter-type'] !== '' && value['value'] !== '') {
            //    //                //console.log(key, value);
            //    //                if (value['filter-type'] == "between") {
            //    //                    $("#form-records").tabulator("addFilter", betweenFilter, [key, value['value'], value['second']]);
            //    //                } else if (value['filter-type'] == "between_today_and_date" || value['filter-type'] == "between_date_and_today") {
            //    //                    $("#form-records").tabulator("addFilter", betweenDateFilter, [key, value['filter-type'], "<?php echo date('Y-m-d'); ?>", value['value']]);
            //    //                } else {
            //    //                    $("#form-records").tabulator("addFilter", key, value['filter-type'], value['value']);
            //    //                }
            //    //            } else if (value['filter-type'] == "before_today" || value['filter-type'] == "after_today") {
            //    //                $("#form-records").tabulator("addFilter", todayFilter, [key, value['filter-type'], "<?php echo date('Y-m-d'); ?>"]);
            //    //            }
            //    //        } else {
            //    //            $("#form-records").tabulator("addFilter", radioFilter, [key, value]);
            //    //        }
            //    //    });
            //    //}
            //});
            //}else{
            //$("#form-table").tabulator("setData","{{ url('formDataList') }}/" + form_id);
            //}
            //modal.find('.modal-body input').val(recipient)
        });

        function bindTColumnHeader(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                // angular.forEach(pageData, function (item, key) {
                /// var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                    || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                    if (type == "file") {
                        if (type == "file" && item.multipleFiles == true) {
                            finalArray.push({
                                title: item.title, formatter: multilFiles, headerSort: false, align: "center", field: item.field, align: "left", cellClick: function (e, cell) {

                                    getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                }
                            });
                        }
                        else {
                            finalArray.push({
                                title: item.title, formatter: arrowImage, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left", headerFilter: "input"
                            });
                        }
                    }
                    else {
                        if (DataService.isEmpty(item.Display_tab))
                            finalArray.push({ title: item.title, bottomCalc: showFooter(item), field: item.field, align: "left", headerFilter: "input" });
                        else {

                            $scope.displayInTabData = item;

                        }
                    }
                }
                //});                
            });
            finalArray.unshift({ title: "formId", visible: false });
            finalArray.unshift({ title: "Id", visible: false });
            finalArray.unshift({ title: "formGroupKey", visible: false });
            return finalArray;
        }
        $scope.setInformationLink = function () {

            var InfoFormId = $scope.importFormSettings.informationFormID;
            var isAllowShow = $scope.importFormSettings.InformationOnly;
            var baseurl = mainService.getBaseUrl();
            var link = "";
            if (angular.isDefined(InfoFormId)) {
                link = baseurl + "/#/form/show/" + InfoFormId.toString();
            }
            else
                link = "#";

            $scope.InformationLink.url = link;
            if (angular.isDefined(isAllowShow) && !DataService.isEmpty(isAllowShow)) {
                $scope.InformationLink.isAllow = isAllowShow.toString();
            }

            console.log('dsdsd' + $scope.InformationLink.url);

        };
        $scope.gotoInformationPage = function () {
            var url = $scope.InformationLink.url;
            var setPreviousPage = window.location.href;
            CookiesPersistenceService.setCookieData("informationBackLink", setPreviousPage);
            var param = {};
            param.action = 4;
            param.formId = $scope.importFormSettings.informationFormID;

            if (!DataService.isEmpty(param.formId) && param.formId != "0" && param.formId != 0) {
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
                        console.log(data);
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
                $rootScope.$emit("HideLoading");
            }






        };

        $scope.updateCalenderReferrence = function (param) {
            var oneToManyParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            oneToManyParam.created_by = $scope.userDetail.Id;
            oneToManyParam.update_by = $scope.userDetail.Id;
            mainService.manageCalenderReferrenceNew("ManageCalenderReferrenceNew", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $timeout(function () {
                            location.reload();
                            window.close();
                        }, 1000);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.init();

    });
    FormGeneratorApp.controller('FormEntryCalenderEmbedController', function ($scope, $rootScope, CookiesPersistenceService, $http, $state, $location, $window, $ngBootbox, $timeout, mainService, notifierService, $stateParams, DataService) {

        function showFooter(type) {
            if (!DataService.isEmpty(type.column_calculation))
                return type.column_calculation;
            else
                return "";
        }
        var arrowImage = function (cell, formatterParams) {
            var filename = cell.getValue();
            if (!DataService.isEmpty(filename) && filename != "null") {
                filename = filename.replace('~', '');
            }
            if (!DataService.isEmpty(filename) && filename != "null") {
                var ext = filename.substr(filename.lastIndexOf('.') + 1);
                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                    return "<img src='" + mainService.getBaseUrl() + filename + "' width='150'>";
                }
                else {
                    var nameddd = filename.substring(filename.lastIndexOf('/') + 1);
                    return "<a href=" + mainService.getBaseUrl() + filename + " title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a>";
                }
            }
            else
                return "<img src='' width='150'>";
        };
        var arrowDataFormat = function (cell, formatterParams) {
            var exists;
            var data = cell.getValue();
            if (!DataService.isEmpty(data)) {
                var splitData = data;
                if (splitData.contains("#jMS#")) {
                    splitData = splitData.split("#jMS#");
                    var datetimeStartEnd = "";
                    _.each(splitData, function (spItem) {
                        datetimeStartEnd += $rootScope.ToCustomDateTime(spItem) + " to ";
                    });
                    datetimeStartEnd = datetimeStartEnd.substring(0, datetimeStartEnd.length - 3);
                    data = datetimeStartEnd;
                }
                return data;
            } else {
                return !DataService.isEmpty(data) ? data : "";
            }
        };
        $scope.userDetails = mainService.loginDetails();
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
        };

        $scope.promptProtectedPassword = function (formPassword, formString, formID, baseUrl) {
            bootbox.dialog({
                onEscape: function () {
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
        };
        function getRandom(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };
        var isAnonymous = function (searchVal) {
            var signUpString = "signUp";
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
                                f.setAttribute('id', "redirect_form");
                                f.setAttribute('class', "hidden");
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
                                var e = document.createElement("input");
                                e.setAttribute('type', "text");
                                e.setAttribute('name', "type");
                                e.setAttribute('value', 'anonymous');
                                f.appendChild(a); f.appendChild(b); f.appendChild(c);
                                f.appendChild(e);
                                document.body.appendChild(f);
                                quickSignUp('anonymous');
                            }
                        },
                        ok: {
                            label: "Login",
                            className: 'btn-info',
                            callback: function () {
                                bootbox.dialog({
                                    title: "Quick login",
                                    message:
                                        '<div class="card panel-default">' +
                                        '<div class="row">' +
                                        '<div class="col-sm-12">' +
                                        '<form id="quickLogin1" >' +
                                        '<div class="col-sm-12 form-group row ">' +
                                        '<div class="col-sm-6">' +
                                        '<label class="col-form-label">User Name / Email</label></div>' +
                                        '<div class="col-sm-6">' +
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
                                        '</form></div></div></div>',
                                    closeButton: false
                                })
                            }
                        }
                    },
                    closeButton: false
                });
            }
        };
        var multilFiles = function (cell, formatterParams) {
            var temp = !DataService.isEmpty(cell.getValue()) ? cell.getValue() : "";
            var images = [];
            images = temp.split(',');
            if (images.length > 1)
                return '<button type="button" class="btn btn-xs btn-default" data-toggle="modal" data-target="#galleryModal"  title="Show all files" data-formGroupKey="' + cell.getData().formGroupKey + '"> Show all files</button> ';
            else
                return arrowImage(cell, formatterParams);
        };
        function getAllFiles1(formData, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param = formData;
            var images = param;
            if (!DataService.isEmpty(images)) {
                images = images.split(',');
                var newHtml = '';
                $.each(images, function (i, val) {
                    val = val.replace('~', '');
                    var ext = val.substr(val.lastIndexOf('.') + 1);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>&nbsp';
                    } else if (ext == "xls" || ext == "xlsx") {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp";
                    } else {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>&nbsp";
                    }
                });
                $('#galleryModal .modal-body').html(newHtml);
            } else {
                $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
            }
        };
        $scope.init = function () {
            $scope.isEmbedUrl = false;
            $scope.userDetail = mainService.loginDetails();
            if (DataService.isEmpty($scope.userDetail)) {
                $scope.embedInit();
            }
            else {
                if ($scope.userDetail.reqType == "anonymous") {
                    $scope.isEmbedUrl = true;
                    $scope.$emit("afterAnonymousRegistration");
                } else {
                    $scope.embedInit();
                }
            }
        };


        $scope.$on("afterAnonymousRegistration", function (event, data) {
            $scope.autogeneratedFieldList = [];
            $scope.InformationLink = {};
            $scope.editRowTempData = {};
            $scope.formDetailsDataTemp = [];
            window["listOfOutput"] = [];
            $scope.keypressIdle = 1500;
            $scope.formFieldsParam = {};
            bootbox.hideAll();
            $scope.isSaveEvent = false;
            $scope.formFields = [];
            $scope.formDataList = {};
            $scope.subscription = {};
            $scope.subscription.isAllowToLoad = true;
            $scope.pageLength = 0;
            $scope.entryForOneToMany = false;
            $scope.htmlContentData = "";
            $scope.userDetail = mainService.loginDetails();
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.freshEntryformGroupKey = "";
            if (!DataService.isEmpty($stateParams.popup)) {
                $scope.entryForOneToMany = true;
                localStorage.removeItem("formOneData");
            }
            if (!DataService.isEmpty($stateParams.cname)) {
                $scope.defaultSelected = true;
            }
            if (!DataService.isEmpty($stateParams.start)) {
                $scope.default_sdate = true;
            }
            if (!DataService.isEmpty($stateParams.end)) {
                $scope.default_edate = true;
            }
            if (!DataService.isEmpty($stateParams.customForms)) {
                $scope.customForms = $stateParams.customForms;
                $scope.customFormIds = $stateParams.customFormIds;
            }
            if (!DataService.isEmpty($stateParams.parentFormId)) {
                $scope.eventId = $stateParams.eventId;
                $scope.parentFormId = $stateParams.parentFormId;
            }
            loadFormHtml();
            $scope.formFieldExcelParam = {};
            $scope.listOfOutput = [];
            $scope.formFieldExcelParam.listOfOutput = [];
            $scope.formFieldExcelParam.listOfInput = [];
            $scope.formFieldExcelParam.inputDataExcel = {};
            $scope.formDataInfo = {};
            $scope.time = {};
            $scope.userDetail = mainService.loginDetails();
            $timeout(function () {
                if ($("#form-table").length)
                    window["popupTabulator"] = initTabulator("form-table", {
                        selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                    });
            }, 450);
            window["uploadPath"] = mainService.getBaseUrl();
            $scope.listOfReferrenceFields = [];
            $scope.autoGeneratedId = "";
            $scope.languageList = [];
            $scope.formSelectedLanguageId = "1";
            $scope.getLanguage();
        });

        $scope.embedInit = function () {
            if (DataService.isEmpty($scope.userDetail)) {
                $scope.isEmbedUrl = true;
                anonymousRegistration();
            }
            else {
                if ($scope.userDetail.reqType == "anonymous") {
                    $scope.isEmbedUrl = true;
                } else {
                    $scope.isEmbedUrl = true;
                    anonymousRegistration();
                }
            }
        };

        function anonymousRegistration() {
            var csrf_token = getRandom(10);
            var random_name = getRandom(5);
            var f = document.createElement("form");
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
            var e = document.createElement("input");
            e.setAttribute('type', "text");
            e.setAttribute('name', "type");
            e.setAttribute('value', 'anonymous');
            f.appendChild(a); f.appendChild(b); f.appendChild(c);
            f.appendChild(e);
            document.body.appendChild(f);
            quickSignUp('anonymous');
        }


        function defaultSelectedControl() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    var item = $(this).val();
                    if (!DataService.isEmpty(item))
                        if (item.toString() === value.toString()) {
                            $(this).prop("checked", true);
                        }
                });
                $("#customFormNew select[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    $(this).val(value);
                    $(this).prop("disabled", "disabled");
                });
            }, 450);
        };
        function defaultStartDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.start + "]").each(function () {
                    var value = $stateParams.svalue;
                    $(this).val(value);
                });
            }, 120);
        };
        function defaultEndDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.end + "]").each(function () {
                    var value = $stateParams.tvalue;
                    $(this).val(value);
                });
            }, 120);
        };
        function imagelessCaptchaVerification($elem, $submit) {
            var invalid = 0;
            var userAnswer = Number($elem.val());
            var answer = Number($elem.parent().data('answer'));
            if (userAnswer !== answer) {
                invalid = 1;
                $elem.parents('.form-group').addClass('has-error');
                $submit.addClass('disabled');
                $submit.attr('disabled', 'disabled');
            } else {
                $submit.removeClass('disabled');
                $submit.removeAttr('disabled');
                $elem.parents('.form-group').removeClass('has-error');
            }
            return invalid;
        };
        function updateFormData() {
            var obj = {};
            updatetable = $("#lblFormName").val().trim().replace('_EDIT', '');
            //For main Form Controls
            var objCtrl = {};
            $("#customForm :input").each(function () {
                if (($(this).prop('type') == 'text' || $(this).is("textarea") || $(this).prop('type') == 'email') || $(this).prop('type') == 'password' && !$(this).parent().hasClass('date')) {
                    var ctrlname = $(this).attr('name');
                    obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                }
                else if ($(this).prop('type') == 'number') {
                    var ctrlname = $(this).attr('name');
                    obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                }
                else if ($(this).parent().hasClass('date')) {
                    var ctrlname = $(this).attr('name');
                    if (jQuery.isEmptyObject($(this).val()) != true) {
                        showdate = new Date($(this).val().split('-')[0], $(this).val().split('-')[1] - 1, $(this).val().split('-')[2]);
                        obj[ctrlname] = showdate;
                    }
                    else {
                        obj[ctrlname] = new Date(1900, 0, 1);
                    }
                }
                else if ($(this).prop('type') == 'checkbox' || $(this).prop('type') == 'radio') {
                    var ctrlname = $(this).attr('name').replace('[]', '');
                    obj[ctrlname] = $(this).prop('checked');
                }
            });
            $("#customForm").find('select').not('#ddlLanguage').each(function () {
                var ctrlname = $(this).attr('name').replace('[]', '');
                obj[ctrlname] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
            });
            var ctrlname = 'TableId';
            obj[ctrlname] = $('#hfIsOptId').val().trim();
            var ctrlname = 'created_at';
            obj[ctrlname] = '';
            var ctrlname = 'updated_at';
            obj[ctrlname] = '';
            updateParameter = { 'tableData': JSON.stringify(obj), 'tableName': updatetable };
            $.ajax({
                type: "POST",
                url: '/FormMaster/updateTableData',
                data: updateParameter,
                async: false,
                success: function (data) {
                    if (data.trim() == 'success') {
                        alert("@Resources.Resource.Recordupdatedsuccessfully", "success");
                        var dialog = confirm("Do want to exit?");
                        var LanguageId = $("#ddlLanguage :selected").val();
                        var FormId = $("#hfFormId").val();
                        if (dialog == true) {
                            window.location.href = '/FormMaster/FormMasterTabulator?FormId=4040&LanguageId=' + LanguageId;// + '&optid=' + obj['TableId'];
                        }
                        else {
                            location.reload(true);
                        }
                        return false;
                    }
                    else
                        alert(data);
                }
            });
        };
        function customEntryElementsValidation() {
            // imageless captcha varification
            var $submit = $('#customFormNew').find('button.btn[type="submit"]');
            $(document).on('keyup', 'input.cp_text',
                function () {
                    imagelessCaptchaVerification($(this), $submit);
                });
            var newWindow = null, validationCount = 0, validattfrm = '';
            $(document).on('click', '.btn-edit', function (e) {
                e.preventDefault();
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea').removeAttr('readonly');
                $('#FormBody .form-group select,input[type=text],input[type=number],textarea,.date').removeClass('editable-area')
                $('#FormBody .form-group select').removeAttr(('disabled'));
                $('#FormBody .form-group .date input[type=text]').removeClass('disabled');
                $('#FormBody .form-group  input[type=email]').removeAttr('disabled');
                $('#FormBody .form-group  input[type=password]').removeAttr('disabled');
                $('#btn_save').attr('value', '@Resources.Resource.Submit');
                $('#btn_save').removeClass('btn-edit').addClass('btn-success');
            });
            $(document).on('click', '#btn_exit', function (e) {
                var IsPopUp = $("#hfIsPopUp").val();
                if (IsPopUp == 1) {
                    window.close();
                }
                else {
                    var url = '@Url.Action("FormMasterTabulator", "FormMaster", new {FormId = "__FormId__"})';
                    window.location.href = url.replace('__FormId__', 4040).replace("&amp;", "&");
                }
            });
            var uploadPath = "", popupTabulator, tabulators;
            $(document).on('click', '.btn-success', function (e) {
                if (getParameterByName('optid') != null) {
                    e.preventDefault();
                    if ($(this).attr('value') == '@Resources.Resource.Edit')
                        return false;
                    updateFormData();
                }
                else {
                    console.log('validationCheck');
                    var arrCtrl = [];
                    var arrRelationCtrl = [];
                    var objCtrl = {};
                    //Push FormName To Array
                    objCtrl["Name"] = "TableName";
                    objCtrl["Value"] = $("#lblFormName").val();
                    arrCtrl.push(objCtrl);
                    //For main Form Controls
                    $("#customForm :input").each(function () {
                        var objCtrl = {};
                        if ($(this).attr('type') == 'text' || $(this).is("textarea") || $(this).attr('type') == 'email' || $(this).attr('type') == 'password') {
                            objCtrl["Name"] = $(this).attr('name');
                            if ($(this).parent().hasClass('date')) {
                                objCtrl["DataType"] = "Date";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            else {
                                objCtrl["DataType"] = "Text";
                                objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '');
                            }
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'number') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                            objCtrl["DataType"] = "Number";
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'date') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? Date.parse($(this).val(), "yyyy-MM-dd HH:mm:ss") : '');
                            objCtrl["DataType"] = "Date";
                            arrCtrl.push(objCtrl);
                        }
                        else if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                            objCtrl["Name"] = $(this).attr('name');
                            objCtrl["Value"] = $(this).prop("checked");
                            objCtrl["DataType"] = "Bool";
                            arrCtrl.push(objCtrl);
                        }
                    });
                    $("#customForm").find('select').not('#ddlLanguage').each(function () {
                        var objCtrl = {};
                        objCtrl["Name"] = $(this).attr('name');
                        objCtrl["Value"] = (jQuery.isEmptyObject($(this).val()) != true ? $(this).val() : '0');
                        objCtrl["DataType"] = "Text";
                        arrCtrl.push(objCtrl);
                    });
                    //For Tabulator
                    $('.tab-content .tab-pane .tabulator').each(function () {
                        var tableIds = [];
                        $(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').each(function () {
                            tableIds.push({ "Name": 'TableId', "Value": $.trim($(this).text()), "DataType": 'Number' });
                        })
                    })
                    if (tabulators != undefined)
                        arrRelationCtrl.push(tabulators);
                    $("#hfJsonContent").val(JSON.stringify(arrCtrl));
                    $("#hfJsonRelationContent").val(JSON.stringify(arrRelationCtrl));
                }
            });
            var checkValue = setInterval(function () {
                if (newWindow != null) {
                    if (newWindow.closed) {
                        newWindow = null;
                        location.reload(true);
                        reloadTabulator();
                    }
                }
            }, 1000);
            $('button[type="submit"], button[type="submitexcel"]').unbind("click");
            $('button[type="submit"], button[type="submitexcel"]').on('click', function (elementButton) {
                let $this = $(this),
                    currentType = $this.attr('type');
                localStorage.setItem("submitType", currentType);
                if (validationCount == 0) {
                    validattfrm = $('#customFormNew').formValidation({
                        framework: 'bootstrap',
                        excluded: [':disabled'],
                        icon: {
                            valid: '',
                            invalid: '',
                            validating: 'fa fa-sync fa-pulse'
                        }
                    })
                        .on('success.form.fv', function (e, data) {
                            e.preventDefault();
                            // data.fv      --> The FormValidation instance
                            // data.element --> The field element                  
                            var invalid = 0;
                            if ($("input.cp_text").length) {
                                var $submit = $('#customFormNew').find('button.btn[type="submit"]');
                                $("input.cp_text").each(function () {
                                    let status = imagelessCaptchaVerification($(this), $submit);
                                    invalid = invalid + status;
                                });
                                if (invalid > 0) {
                                    return false;
                                } else {
                                    angular.element(this).scope().onEntryFormSubmit();
                                }
                            }
                            else {
                                if (localStorage.getItem("submitType") != null) {
                                    currentType = localStorage.getItem("submitType")
                                }
                                if (currentType == "submitexcel") {
                                    textBoxLoader(true);
                                    if ($scope.formFieldExcelParam.listOfInput.length > 0) {
                                        angular.forEach($scope.formFieldExcelParam.listOfOutput, function (item) {
                                            $("#" + item.id).val(item.value);
                                            $("#" + item.id).addClass("loader");
                                        })
                                        updateExcel(false);
                                    }
                                    $this.closest('form').find('button[type="submit"]').removeAttr('disabled');
                                    $this.closest('form').find('button[type="submit"]').removeClass('disabled');
                                }
                                else {
                                    $scope.onEntryFormSubmit();
                                }
                                localStorage.removeItem("submitType")
                            }
                        });
                    validationCount = 1;
                }
            });
        };
        /* Ajax request for populating the dropdowns */
        $(document).on("change", ".call_populate_fields", function () {
            populateFieldsNew($(this), mainService.getCurrentEndPointUrl() + "/getBindDropdown");
        });

        function deselecAll(form_id) {
            $("form select[data-referral-form-id='" + form_id + "']")
                .each(function (index) {
                    $(this).prop("selected", false);
                    $(this).val('0');
                });
        };

        function populateFieldsNew($this, ajaxUrl) {
            var form_id = $this.attr("data-referral-form-id"),
                field_name = $this.attr("data-referral-form-field-name"),
                dependent_fields = $this.attr("data-dependent_field_names"),
                input_value = $this.val(),
                input_id = $this.attr("id"),
                query = "";

            $("form select[data-referral-form-id='" + form_id + "']")
                .each(function (index) {
                    var svId = $(this).attr('id');
                    var svfield_name = $(this).attr('data-referral-form-field-name');
                    var svValue = $(this).val();
                    if (svId == input_id && index == 0) {
                        deselecAll(form_id);
                        $("#" + input_id).val(svValue);
                    }
                    if (svValue != 0 && dependent_fields !== '' && svValue != null)
                        query += svfield_name + " = '" + svValue + "' and "
                });
            query = query.substring(0, query.length - 4);
            if (dependent_fields !== '' && dependent_fields != undefined) {
                var dependent_fields_arr = dependent_fields.split(',');
                if (input_value !== '') {
                    $rootScope.$emit("ShowLoading");
                    $('.favicon-loader-overlay').addClass('active');
                    $rootScope.$emit("ShowLoading");
                    $.ajax({
                        url: ajaxUrl,
                        type: "GET",
                        data: { formId: form_id, selectedValue: input_value, field_name: field_name, dependent_fields: dependent_fields, query: query },
                        dataType: "json",
                        beforeSend: function () {
                        },
                        success: function (result) {
                            if (result) {
                                if (dependent_fields_arr != undefined) {
                                    $timeout(function () {
                                        dependent_fields_arr.forEach(function (dependent_field) {
                                            var referral_field_name = $('#' + dependent_field).attr('data-referral-form-field-name');
                                            $('#' + dependent_field + ' option').each(function () {
                                                var optionValue = $(this).attr('value');
                                                if (optionValue !== '' && optionValue != "0") {
                                                    var existData = _.filter(result, function (item) { return item[referral_field_name] == optionValue });
                                                    if (existData.length == 0) {
                                                        $(this).prop('disabled', true);
                                                        $(this).hide();
                                                    } else {
                                                        $(this).prop('disabled', false);
                                                        $(this).show();
                                                    }
                                                } else {
                                                    $(this).prop('disabled', false);
                                                    $(this).prop('selected', true);
                                                    $(this).show();
                                                }
                                            });
                                        });
                                    }, 150);
                                } else {
                                    $('#' + input_id + ' option').each(function () {
                                        var optionValue = $(this).attr('value');
                                        if (optionValue !== '') {
                                            var existData = _.filter(result, function (item) { return item[referral_field_name] == optionValue });
                                            if (existData.length == 0) {
                                                $(this).prop('disabled', true);
                                                $(this).hide();
                                            } else {
                                                $(this).prop('disabled', false);
                                                $(this).show();
                                            }
                                        }
                                    });
                                }
                            }
                            $rootScope.$emit("HideLoading");
                        },
                        complete: function () {
                            $('.favicon-loader-overlay').removeClass('active');
                            $rootScope.$emit("HideLoading");
                        }
                    });
                } else {
                }
            }
        };

        function loadFormHtml() {
            var formGroupKey = $stateParams.formGroupKey;
            var formId = $stateParams.formId;
            $scope.rowId = $stateParams.Id;
            $rootScope.$emit("ShowLoading");
            $timeout(function () {
                if (angular.isDefined(formId)) {
                    $scope.currentFormId = formId;
                    var param = {};
                    param.customForms = $scope.customForms;
                    param.customFormIds = $scope.customFormIds;
                    param.created_by = $scope.userDetail.Id;
                    param.formId = formId;
                    if (localStorage.getItem("globalLang") != null) {
                        if (localStorage.getItem("globalLangForm") != null) {
                            param.language = localStorage.getItem("globalLangForm");
                        } else {
                            param.language = localStorage.getItem("globalLang");
                        }
                    }
                    $scope.isEdit = false;
                    if ($stateParams.popup == 2) {
                        if (localStorage.getItem("formGroupKey" + formId) == null) {
                            $scope.freshEntryformGroupKey = create_UUID();
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        } else {
                            $scope.freshEntryformGroupKey = localStorage.getItem("formGroupKey" + formId);
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        }
                    }
                    if (angular.isDefined(formGroupKey)) {
                        if (!DataService.isEmpty($stateParams.eventId)) {
                            $scope.isSaveEvent = true;
                            param.action = 7;
                            $scope.isEdit = false;
                            param.formGroupKey = formGroupKey;
                            $scope.getFormSettings(param);
                        }
                        else {
                            $scope.isEdit = true;
                            param.action = 6;
                            param.formGroupKey = formGroupKey;
                            param.Id = $scope.rowId;
                            $scope.formGroupKey = param.formGroupKey;
                            $scope.getFormSettings(param);
                            $("#formGroupKey").val($scope.formGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.formGroupKey);
                        }
                    } else {
                        param.action = 7;
                        $scope.isEdit = false;
                        $scope.isSaveEvent = true;
                        $scope.freshEntryformGroupKey = create_UUID();
                        if (localStorage.getItem("formGroupKey" + formId) == null) {
                            $scope.freshEntryformGroupKey = create_UUID();
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        } else {
                            $scope.freshEntryformGroupKey = localStorage.getItem("formGroupKey" + formId);
                            $("#formGroupKey").val($scope.freshEntryformGroupKey);
                            localStorage.setItem("formGroupKey" + formId, $scope.freshEntryformGroupKey);
                        }
                        $scope.getFormSettings(param);
                    }
                }
            }, 450);
        };

        function makeIncrementedAutoId(autoIdParam, item) {
            var autoId = "";
            var incrementedData = 0;
            autoId = $("input[name=" + autoIdParam + "]").val();
            if (!DataService.isEmpty(autoId)) {
                var splitData = autoId.split(item.value);
                if (splitData.length > 0) {
                    if (splitData.length > 1)
                        var incremt = splitData[1];
                    var incremntlength = incremt.length;
                    incrementedData = parseInt(incremt);
                    incrementedData++;
                    var newIncremntLenght = incrementedData.toString().length;
                    var zeroAdd = "";
                    for (var i = 0; i < incremntlength - newIncremntLenght; i++) {
                        zeroAdd += "0";
                    }
                    incrementedData = zeroAdd + incrementedData.toString();
                    var newAutoId = item.value + incrementedData;
                    if (!$scope.isEdit) {
                        $("input[name=" + autoIdParam + "]").val(newAutoId);
                        $scope.autoGeneratedIdTemp.autoGeneratedIdTemp = newAutoId;
                        $scope.autoGeneratedIdTemp.oldId = item.value + incremt.toString();
                    }
                    return incrementedData;
                }
            }
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
                        $scope.languageList = response.data;
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.refreshButtonFunc = function () {
            var param = {};
            param.action = 1;
            param.formId = $scope.currentFormId;
            var sessionName = CookiesPersistenceService.getCookieData("MyQueue_100");
            angular.forEach($scope.autogeneratedFieldList, function (item) {
                if (item.type == "autogenerated-field") {
                    param.autoGeneratedId = item.value;
                    param.autoGeneratedFieldName = item.name;
                    if (!DataService.isEmpty(item.lower_range)) {
                        param.autoGeneratedId += item.lower_range.toString();
                    }
                    else if (!DataService.isEmpty(item.upper_range)) {
                    }
                }
                else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                    item.subtype == "queue server" || item.subtype == "queue session")) {
                    if (item.subtype == "current position") {
                        param.currentpositionFieldName = item.name;
                    }
                    else if (item.subtype == "last position") {
                        param.lastpositionFieldName = item.name;
                    }
                    else if (item.subtype == "queue session") {
                        if (!DataService.isEmpty(sessionName)) {
                            $("#" + item.name).val(sessionName);
                        }
                    }
                }
                else if (!DataService.isEmpty(item.types) && item.types == "waiting_records")
                    param.waitingrecordsFieldName = item.name;
                else if (!DataService.isEmpty(item.types) && item.types == "status")
                    param.fieldName = item.name;
            });
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.getPositions("getPositions", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.totalWaitingRecord = response.data.waitingrecords;
                        $("#" + response.data.waitingrecordsFieldName).val(response.data.waitingrecords)
                        if (!DataService.isEmpty(response.data.currentposition)) {
                            if (!$scope.isEdit)
                                $("#" + response.data.currentpositionFieldName).val(response.data.currentposition)
                            $scope.autoGeneratedIdTemp = _.findWhere($scope.autogeneratedFieldList, {
                                type: "autogenerated-field"
                            });
                            $scope.autoGeneratedIdTemp.currentposition = response.data.currentposition;
                            if (!DataService.isEmpty($scope.autoGeneratedIdTemp)) {
                                if (!$scope.isEdit) {
                                    $("input[name=" + $scope.autoGeneratedIdTemp.name + "]").val(response.data.lastposition)
                                    $scope.autoGeneratedIdTemp.oldId = angular.copy(response.data.lastposition);
                                }
                                makeIncrementedAutoId($scope.autoGeneratedIdTemp.name, $scope.autoGeneratedIdTemp);
                            }
                            angular.forEach($scope.autogeneratedFieldList, function (item) {
                                if (item.type == "autogenerated-field") {
                                    param.autoGeneratedFieldName = item.name;
                                    if (!DataService.isEmpty(item.lower_range)) {
                                    }
                                    else if (!DataService.isEmpty(item.upper_range)) {
                                    }
                                }
                                else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                                    item.subtype == "queue server" || item.subtype == "queue session")) {
                                    if (item.subtype == "current position") {
                                        param.currentpositionFieldName = item.name;
                                    }
                                    else if (item.subtype == "last position") {
                                        var startQueue = $scope.autoGeneratedIdTemp.lower_range;
                                        var incremntlength = startQueue.length;
                                        var incrementedData = parseInt(startQueue);
                                        var newIncremntLenght = incrementedData.toString().length;
                                        var zeroAdd = "";
                                        for (var i = 0; i < incremntlength - response.data.total_records.toString().length; i++) {
                                            zeroAdd += "0";
                                        }
                                        if (!DataService.isEmpty($scope.totalWaitingRecord) && $scope.totalWaitingRecord > 1) {
                                            param.lastpositionFieldName = item.name;
                                            $("#" + response.data.lastpositionFieldName).val(response.data.lastposition.toString())
                                        }
                                        else {
                                            param.lastpositionFieldName = item.name;
                                            $("#" + response.data.lastpositionFieldName).val($scope.autoGeneratedIdTemp.value + zeroAdd + response.data.total_records.toString())
                                        }
                                    }
                                }
                            });
                        } else {
                            $("#" + response.data.currentpositionFieldName).val(response.data.autoGeneratedId)
                            $("#" + response.data.lastpositionFieldName).val("--")
                            $("input[name=" + response.data.autoGeneratedFieldName + "]").val(response.data.autoGeneratedId);
                        }
                        if ($scope.isEdit) {
                            $("#" + $scope.autoGeneratedId).prop("type", "text");
                            $("#" + $scope.autoGeneratedId).parent().css("display", "block");
                        }
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.navigateButtonFunc = function (type, controlId) {
            var currentTab = 0;
            var activate = false,
                tabLinks = $('.nav nav-tabs li'),
                tabContent = $('div.tab-content');
            var ulList = $(".tab-nav-bar li");
            currentTab = ulList.parent().children('.active').index();
            _.each(ulList, function (item) {
                if (item.className.contains("_page" + controlId)) {
                    ulList.removeClass("active")
                    item.className += " active";
                    return true;
                }
            });
            if (type == "next" || type == "previous") {
                ulList.removeClass("active");
                tabContent.children("div").removeClass("in active");
            } else {

            }
            setTimeout(function () {
                if (type == "next") {
                    var tabs = ulList;
                    var c = ulList.length;
                    currentTab = currentTab == (c - 1) ? currentTab : (currentTab + 1);
                    ulList.eq(currentTab).children().click();
                    ulList.eq(currentTab).addClass("active");
                    tabContent.children("div").eq(currentTab).addClass("in active");
                    $("input.previous").show();
                    if (currentTab == (c - 1)) {
                        $("input." + type).hide();
                    } else {
                        $("input." + type).show();
                    }
                }
                else if (type == "previous") {
                    var tabs = ulList;
                    var c = ulList.length;
                    currentTab = currentTab == 0 ? currentTab : (currentTab - 1);
                    ulList.eq(currentTab).children().click();
                    ulList.eq(currentTab).addClass("active");
                    tabContent.children("div").eq(currentTab).addClass("in active");
                    if (currentTab == 0) {
                        $("input.next").show();
                        $("input." + type).hide();
                    }
                    if (currentTab < (c - 1) && currentTab != 0) {
                        $("input.next").show();
                    }
                }
                else if (type == "default") {
                    currentTab = ulList.parent().children('.active').index();
                    if (currentTab == ulList.length - 1) {
                        $("input.previous").show();
                        $("input.next").hide();
                    } else if (currentTab == 0) {
                        $("input.previous").hide();
                        $("input.next").show();
                    } else {
                        $("input.previous").show();
                        $("input.next").show();
                    }
                }
            }, 150);
            $rootScope.safeApply();
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
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                        return false;
                    });
            }
            else
                return false;
        };
        $scope.popUpIfNotApproved = function () {
            $('#tabs').hide();
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
                var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.importFormSettings.applicationId + "";
                window.location.href = url;
            });
        };
        $scope.popUpIfNotReq = function (formIdParam) {
            $('#tabs').hide();
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
                    var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.importFormSettings.applicationId + "";
                    window.location.href = url;
                }
                else {
                    var url = mainService.getBaseUrl() + "#/form/saveEntry/" + formIdParam + "?popup=1";
                    window.location.href = url;
                }
            }
            );
        };
        $scope.ExcecuteMacro = function (m_nm) {
            $scope.macro_nm = m_nm;
            updateExcel(true);
        }
        $scope.getFormSettings = function (param) {
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            param.urlroute = window.location.href;
            $rootScope.isEntryNotAllow = false;
            $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {


                        var frmDataCheck = response.data;
                        if (frmDataCheck.PlanExpired == 1) {
                            //notifierService.notifySweetAlertMessage('warning', 'Subscription Plan', frmDataCheck.Message);
                            if (frmDataCheck.GracePeriodActive == 0) {
                                $rootScope.$emit("HideLoading");
                                if (!$scope.isEmbedUrl)
                                    notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', frmDataCheck.Message, 'topic');
                                else
                                    notifierService.notifyMessage('warning', 'Subscription Plan', frmDataCheck.Message);
                                return false;
                            }
                            else if (frmDataCheck.GracePeriodActive == 2) {
                                $rootScope.$emit("HideLoading");
                                if (!$scope.isEmbedUrl)
                                    notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention Period is over, kindly re-subscribe to perform entry", 'topic');
                                else
                                    notifierService.notifyMessage('warning', 'Subscription Plan', "Retention Period is over, kindly re-subscribe to perform entry");
                                return false;
                            }
                        }
                        var formdata = response.data[0];
                        if ($scope.isEdit == false && formdata.PlanExpired == 1 && formdata.GracePeriodActive == 1) {
                            $rootScope.$emit("HideLoading");
                            if (!$scope.isEmbedUrl)
                                notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention Period is active, form entries not allowed", 'topic');
                            else
                                notifierService.notifyMessage('warning', 'Subscription Plan', "Retention Period is active, form entries not allowedy");
                            return false;
                        }
                        if (formdata.res == 5001) {
                            $rootScope.$emit("HideLoading");
                            if (!$scope.isEmbedUrl)
                                notifierService.notifySweetAlertMessageForRole('warning', 'Form Access Rights', "You do not have the access right to this page. You will proceed to Home page", 'Home');
                            else
                                notifierService.notifyMessage('warning', 'Form Access Rights', "You do not have the access right to this page. You will proceed to Home page");
                            return false;
                        }





                        var str1 = JSON.parse(response.data[0].fields);
                        var obj = Object.values(str1);
                        var ary = [];
                        if (!Array.isArray(obj)) {
                            ary = JSON.parse(Object.values(obj)[0])
                        } else {
                            if (!Array.isArray(obj[0])) {
                                ary = JSON.parse(Object.values(obj)[0]);
                            } else {
                                ary = Object.values(obj)[0];
                            }
                        }
                        var checkcontrol = ary.filter(x => x.type == "PayPal");
                        $scope.PPControl = false;
                        for (var i = 0; i < ary.length; i++) {
                            if (ary[i].type === "PayPal") {
                                $scope.PPControl = true;
                                $rootScope.amount = ary[i].amount;
                                $rootScope.paypal_id = ary[i].PAYPAL_ID;
                                $rootScope.paypal_currency = ary[i].PAYPAL_CURRENCY;
                            }
                        }
                        $scope.mapControl = false;
                        for (var i = 0; i < ary.length; i++) {
                            if (ary[i].type === "map") {
                                $scope.mapControl = true;
                            }
                        }
                        if (!DataService.isEmpty(response.data[0].macroList)) {
                            console.log(response.data[0].macroList, 'macros')
                            $scope.macros = (response.data[0].macroList).split(',');
                        }
                        if (response.data.length > 0) {
                            $scope.importFormSettings = response.data[0];
                            var frmData = response.data[0];
                            var qrString = $location.search();
                            $scope.QRstring = false;
                            // if form type !=open
                            if (angular.isDefined(qrString.check) && frmData.formType !== 3) {
                                //clear the login storage .. and redirect to login page .
                                //localStorage.removeItem('detail');
                                //alert("not an open form.");
                                //$state.go("login", { reload: true, inherit: false });
                                $scope.QRstring = true;
                                setTimeout(function () {
                                    bootbox.hideAll();
                                }, 500);
                                //localStorage.setItem("absURL", "");
                                var userlog = localStorage.getItem("detail");
                                swal({
                                    text: 'Not an open form!',
                                    type: 'warning',
                                    //showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    //cancelButtonColor: '#d33',
                                    confirmButtonText: 'Ok',
                                    // cancelButtonText: '@Resources.Resource.No'
                                }).then(function () {
                                    if (typeof userlog == undefined || userlog == "" || userlog == null) {
                                        localStorage.removeItem('detail');
                                        bootbox.hideAll();
                                        localStorage.setItem("absURL", "");
                                        var url = mainService.getBaseUrl() + "#/login";
                                        window.location.href = url;
                                    }
                                    else {
                                        bootbox.hideAll();
                                        var url = mainService.getBaseUrl() + "#/home";
                                        window.location.href = url;
                                    }
                                });
                            }



                            if ($scope.defaultSelected) {
                                defaultSelectedControl();
                            }
                            if ($scope.default_sdate) {
                                defaultStartDate();
                            }
                            if ($scope.default_edate) {
                                defaultEndDate();
                            }
                            if ($scope.importFormSettings.currentFormType == 1) {
                                $scope.bindResActivities();
                            }
                            if (!DataService.isEmpty($scope.importFormSettings.language)) {
                                if (localStorage.getItem("globalLang") == null) {
                                    localStorage.setItem("globalLang", $scope.importFormSettings.language);
                                } else {
                                    if (localStorage.getItem("globalLang") != null) {
                                        if (localStorage.getItem("globalLangForm") != null) {
                                            $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                                        } else {
                                            $scope.importFormSettings.language = localStorage.getItem("globalLang");
                                        }
                                    }
                                }
                            } else {

                                if (localStorage.getItem("globalLangForm") != null) {
                                    $scope.importFormSettings.language = localStorage.getItem("globalLangForm");
                                } else {
                                    $scope.importFormSettings.language = localStorage.getItem("globalLang");
                                }
                            }
                            if ($scope.importFormSettings.res == 1 || ($scope.isEdit == true || $scope.isSaveEvent == true)) {
                                var frmData = response.data[0];
                                var qrString = $location.search();
                                $scope.QRstring = false;
                                // if form type !=open
                                if (angular.isDefined(qrString.check) && frmData.formType !== 3) {
                                    //clear the login storage .. and redirect to login page .                              
                                    $scope.QRstring = true;
                                    setTimeout(function () {
                                        bootbox.hideAll();
                                    }, 500);
                                    var userlog = localStorage.getItem("detail");
                                    swal({
                                        text: 'Not an open form!',
                                        type: 'warning',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: 'Ok',
                                    }).then(function () {
                                        if (typeof userlog == undefined || userlog == "" || userlog == null) {
                                            localStorage.removeItem('detail');
                                            bootbox.hideAll();
                                            localStorage.setItem("absURL", "");
                                            var url = mainService.getBaseUrl() + "#/login";
                                            window.location.href = url;
                                        }
                                        else {
                                            bootbox.hideAll();
                                            var url = mainService.getBaseUrl() + "#/home";
                                            window.location.href = url;
                                        }
                                    });
                                }
                                var isVarified = $scope.validateUserAcess($scope.importFormSettings);
                                var isSubscriptionVarified = true;
                                var subscriptionFormID = frmData.subscriptionFormID;
                                if (angular.isDefined(subscriptionFormID)) {
                                    if (subscriptionFormID != 0) {
                                        setTimeout(function () {
                                            isSubscriptionVarified = $scope.isSubscription($scope.importFormSettings.formId, "checkIfRequested");
                                        }, 1000);
                                    }
                                }
                                if (isVarified == true && $scope.QRstring == false) {
                                    if (isSubscriptionVarified) {
                                        $scope.htmlContentData = $scope.importFormSettings.formContentHTMLTemp;
                                        var temp = [];
                                        temp.push({});
                                        if (!DataService.isEmpty($scope.importFormSettings.recordAccessSecurity)) {
                                            if (!Array.isArray($scope.importFormSettings.recordAccessSecurity))
                                                $scope.importFormSettings.recordAccessSecurity = JSON.parse($scope.importFormSettings.recordAccessSecurity);
                                        }
                                        $timeout(function () {
                                            var formData = JSON.parse($scope.importFormSettings.fields);
                                            _.map(formData, function (pagesData, key) {
                                                if (!Array.isArray(pagesData))
                                                    formData[key] = JSON.parse(pagesData);
                                                _.map(formData[key], function (item) {
                                                    if (item.type == "tabulator") {
                                                        $scope.formDetailsDataTemp.push({
                                                            type: item.type, name: item.name, reference_form: item.reference_form, data: {}
                                                        });
                                                        $scope.bindCustomTabulator(item);
                                                    }
                                                    else if (item.type == "autogenerated-field" || !DataService.isEmpty(item.subtype) || !DataService.isEmpty(item.types)) {
                                                        if (item.type == "autogenerated-field") {
                                                            $scope.autogeneratedFieldList.push(item);
                                                            $scope.autoGeneratedId = item.name;
                                                        }
                                                        else if (!DataService.isEmpty(item.subtype) && (item.subtype == "current position" || item.subtype == "last position" ||
                                                            item.subtype == "queue server" || item.subtype == "queue session"))
                                                            $scope.autogeneratedFieldList.push(item);
                                                        else if (!DataService.isEmpty(item.types) && item.types == "waiting_records")
                                                            $scope.autogeneratedFieldList.push(item);
                                                        else if (!DataService.isEmpty(item.types) && item.types == "status")
                                                            $scope.autogeneratedFieldList.push(item);
                                                    }
                                                    if (!DataService.isEmpty(item.update_operation) && param.action == 6) {
                                                        if ($scope.formDataList.length > 0) {
                                                            var dataTemp = _.filter($scope.formDataList[0], function (itemData, keyColumn) {
                                                                return keyColumn == item.name;
                                                            });
                                                            if (dataTemp.length > 0)
                                                                temp[0].oldValue = angular.copy(dataTemp[0]);
                                                            dataTemp = $scope.formDataList[0];
                                                            temp[0].name = item.name;
                                                            temp[0].MasterFormRow = dataTemp.MasterFormRow;
                                                            temp[0].MasterFormID = dataTemp.MasterFormID;
                                                            temp[0].update_operation = item.update_operation;
                                                            temp[0].Update_Form_Field = item.Update_Form_Field;
                                                            temp[0].Default_Value = item.Default_Value;
                                                            temp[0].Default_Value_Field = item.Default_Value_Field;
                                                            $scope.listOfReferrenceFields.push(temp[0]);
                                                        }
                                                    }
                                                    if (angular.isDefined(item.values))
                                                        if (!Array.isArray(item.values))
                                                            item.values = JSON.parse(item.values);
                                                });
                                                $scope.pageLength++;
                                            });
                                            $scope.formFields.formId = param.formId;
                                            $scope.formFields = formData;
                                            $scope.navigateButtonFunc("default", "default");
                                        }, 150);
                                        if (!DataService.isEmpty($scope.importFormSettings.FormDataToOneListDynamic)) {
                                            if ($scope.importFormSettings.FormDataToOneListDynamic.length > 0) {
                                                $scope.formDataList = angular.copy($scope.importFormSettings.FormDataToOneListDynamic);
                                                $scope.formDataInfo = $scope.formDataList[0];
                                            }
                                        }
                                        loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform");
                                        $rootScope.safeApply();
                                        if (param.action == 6) {
                                            if ($stateParams.popup == 3) {
                                                param.action = 5;
                                                param.AutoId = $stateParams.Id;
                                                $scope.GetTabOneToManyDynamimc(param, param.action);
                                            }
                                            $timeout(function () {
                                                $timeout(function () {
                                                    if ($scope.importFormSettings.currentFormType == 2) {
                                                        $scope.refreshButtonFunc();
                                                    }
                                                }, 500)
                                                $scope.bindUpdateControlsNew();
                                                $("a[data-target='#tabulatorModal']").hide();
                                            }, 450);
                                        } else {
                                            $timeout(function () {
                                                if ($scope.importFormSettings.currentFormType == 2) {
                                                    $scope.refreshButtonFunc();
                                                }
                                            }, 500);
                                        }
                                    }
                                }
                            }
                            else {
                                if ($scope.isSaveEvent == false) {
                                    notifierService.notifySweetAlertMessage('error', 'FormEntry', $scope.importFormSettings.Message);
                                    $rootScope.isEntryNotAllow = true;
                                    $timeout(function () {
                                        $window.history.back();
                                    }, 950);
                                }
                            }
                            $rootScope.$emit("HideLoading");
                            $scope.setInformationLink();
                        }
                        $timeout(function () {
                            customEntryElementsValidation();
                            if (!DataService.isEmpty(localStorage.getItem("newWindow"))) {
                                $rootScope.isPreviewPage = true;
                                $rootScope.isHomePage = true;
                            }
                        }, 400);
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        if ($scope.mapControl == true) {
            console.log('hi I am map');
        }

        $scope.bindOneToManyControl = function (paramTemp, tabularId, name) {
            var param = {};
            param = paramTemp;
            param.action = 10;
            param.formGroupKey = $stateParams.formGroupKey;
            param.Id = $stateParams.Id;
            param.tabularId = tabularId;
            param.formId = paramTemp.formId == 0 ? $scope.currentFormId : paramTemp.formId;
            param.parentID = $scope.currentFormId;
            param.fieldName = name;
            mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                .then(function (response) {

                    $scope.allReferrenceData = response.data;
                    $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;

                    var finalArray = [];
                    bindTabulatorColumnsHeader($scope.allReferrenceData.formDataHeaders, param.tabularId, param.formId, param.fieldName);
                    //var temp = bindTColumnHeader($scope.allReferrenceData.formDataHeaders);
                    //temp.unshift(
                    //    {
                    //        title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                    //            cell.getRow().toggleSelect();
                    //        }
                    //    }
                    //)

                    //window["popupTabulator"].setColumns(temp);
                    window["tabulators"][param.tabularId].setData($scope.allReferrenceData.formDataListNew);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.bindUpdateControlsNew = function () {
            var isCheckBoxGroup = false;
            $scope.formFieldsAll = [];
            _.each($scope.formFields, function (page) {
                _.each(page, function (control) {
                    $scope.formFieldsAll.push(control);
                });
            });
            var tempDataForEdit = {};
            if (!DataService.isEmpty($scope.formDataList) && $scope.formDataList.length > 0)
                if ($scope.formDataList.length == 1) {
                    tempDataForEdit = $scope.formDataList[0];
                    angular.forEach(tempDataForEdit, function (item, key) {
                        var controlExists = _.findWhere($scope.formFieldsAll, { "name": key });
                        if (!DataService.isEmpty(controlExists)) {
                            if (controlExists.type == "checkbox-group") {
                                isCheckBoxGroup = true;
                                if (item != null && item.length > 0) {
                                    if ($("#customFormNew :input[name=" + key + "]").length > 1) {
                                        var list = item.split(',');
                                        $("#customFormNew :input[name=" + key + "]").each(function () {
                                            var value = $(this).val();
                                            var index = _.indexOf(list, value);
                                            if (index >= 0) {
                                                $(this).prop("checked", true);
                                                $(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                $(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        if (item == "true")
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        else
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
                                    }
                                }

                            }
                            else if (controlExists.type == "map") {
                                console.log(key, item, 'Hi i am map control')
                                $("#customFormNew :input[name=" + key + "]").val(item)
                                if (item != null && item.length > 0) {
                                    localStorage.setItem('maploaded', "1");
                                }
                            }
                            else if (controlExists.type == "radio-group") {
                                $("#customFormNew :input[name=" + key + "]").each(function () {
                                    var value = $(this).val();
                                    if (!DataService.isEmpty(item))
                                        if (item.toString() === value.toString()) {
                                            $(this).prop("checked", true);
                                        }
                                });
                            }
                            else if (controlExists.type == "file") {
                                if (!DataService.isEmpty(item) && item != "null") {
                                    if (key.includes("filedefault")) {
                                        $("#customFormNew :input[name=" + key + "]").val(item)
                                    } else {
                                        previewUploader(key, item);
                                    }
                                }
                                else {
                                    if (!DataService.isEmpty(item) && item != "null") {
                                        previewUploader(key, item);
                                        $("#customFormNew :input[name=" + key + "]").val(item)
                                    }
                                }
                            }
                            else if (controlExists.type == "signature") {
                                $("#customFormNew :input[name=" + key + "]").val(item);
                                if ($("#" + key + "_pad").length)
                                    $("#" + key + "_pad").signature('draw', item);
                            }
                            else if (controlExists.type == "tinyMCE-content") {
                                tinymce.get("editor_" + key).setContent(item);
                            }
                            else if (controlExists.type == "table") {
                                if (!DataService.isEmpty(item)) {
                                    $timeout(function () {
                                        var tableDatatemp = item;
                                        populateTableData(key, tableDatatemp, controlExists);
                                    }, 450);
                                }
                            }
                            else if (controlExists.type == "date") {
                                var customdate = new Date();
                                if (controlExists.types == "date_picker") {
                                    var binddate = new Date(item);
                                    customdate = moment(binddate).format("YYYY-MM-DD");
                                }
                                else if (controlExists.types == "time_picker") {
                                    customdate = item;
                                }
                                else if (controlExists.types == "datetime_picker") {
                                    var binddate = new Date(item);
                                    customdate = moment(binddate).format("YYYY-MM-DD hh:mm");
                                }
                                $("#customFormNew :input[name=" + key + "]").val(customdate);
                            }
                            else if (controlExists.type == "select") {
                                if (!DataService.isEmpty(item)) {
                                    $("#customFormNew select[name=" + key + "]").val(item);
                                } else {
                                    if (item == "")
                                        item = "0";
                                    if (item != null)
                                        $("#customFormNew select[name=" + key + "]").val(item);
                                }


                            }
                            else
                                $("#customFormNew :input[name=" + key + "]").val(item)
                        }
                    });
                }
                else {
                    tempDataForEdit = $scope.formDataList
                    angular.forEach(tempDataForEdit, function (item) {
                        if (!DataService.isEmpty(item.name)) {
                            var controlExists = _.findWhere($scope.formFieldsAll, { "name": item.name });
                            if (!DataService.isEmpty(controlExists)) {
                                if (controlExists.type == "checkbox-group") {
                                    isCheckBoxGroup = true;
                                    if ($("#customFormNew :input[name=" + item.name + "]").length > 1) {
                                        var list = item.value.split(',');
                                        $("#customFormNew :input[name=" + item.name + "]").each(function () {
                                            var value = $(this).val();
                                            var index = _.indexOf(list, value);
                                            if (index >= 0) {
                                                $(this).prop("checked", true);
                                                $(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                $(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        if (item == "true")
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        else
                                            $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
                                    }
                                }
                                else if (controlExists.type == "radio-group") {
                                    $("#customFormNew :input[name=" + item.name + "]").each(function () {
                                        var value = $(this).val();
                                        if (angular.isDefined(item.value))
                                            if (item.toString() === value.toString()) {
                                                $(this).prop("checked", true);
                                            }
                                    });
                                }
                                else if (controlExists.type == "map") {
                                    console.log(key, item, 'Hi i am map control')
                                    $("#customFormNew :input[name=" + key + "]").val(item)
                                    if (item != null && item.length > 0) {
                                        localStorage.setItem('maploaded', "1");
                                    }
                                }
                                else if (controlExists.type == "file") {
                                    if (!DataService.isEmpty(item.value) && item.value != "null") {
                                        if (item.name.includes("filedefault")) {
                                            $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                        } else {
                                            previewSingleImage(item.name, item.value)
                                        }
                                    }
                                    else {
                                        if (!DataService.isEmpty(item) && item != "null") {
                                            if (!DataService.isEmpty(item.value)) {
                                                if (item.value != "null") {
                                                    previewSingleImage(item.name, item.value)
                                                    $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                    $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                            }
                        }
                    });
                }
        };
        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };
        function populateTableData(tableName, item) {
            var totalRows = 0;
            var tableData = item.replace(/'/g, " ");
            tableData = tableData.replace(/"/g, " ");
            var temp = filterReadableTableData(tableData, tableName);
            if (!DataService.isEmpty(temp)) {
                var parseJson = temp;
                var size = Object.size(parseJson);
                for (var i = 1; i <= size; i++) {
                    var controlId = tableName + "[column-1][row-" + i + "]";
                    var exists = parseJson[controlId];
                    if (exists == null || angular.isUndefined(exists)) {
                        totalRows = i;
                        break;
                    } else {
                        if (i > 1)
                            $("#" + tableName + " a.irow").click();
                    }
                }
            }
            var totalColumns = 0;
            _.each($scope.formFields, function (pageControlList) {
                var exist = _.findWhere(pageControlList, { name: tableName });
                if (!DataService.isEmpty(exist)) {
                    totalColumns = exist.columns.length > 0 ? parseInt(exist.columns) : 0;
                }
            });
            totalColumns += 1;
            var listRows = [];
            _.each(temp, function (item, keyItem) {
                var controlId = keyItem;
                if (!DataService.isEmpty(temp)) {
                    var parseJsonData = temp;
                    var controlData = parseJsonData[controlId];
                    var controls = $("table tr td input[name='" + controlId + "']");
                    if (controls.length > 0) {
                        var type = $("table tr td input[name='" + controlId + "']").attr('type');
                        if (type != "number" && !DataService.isEmpty(type)) {
                            if (type == "date" && !DataService.isEmpty(type)) {
                                controlData = new Date(controlData);
                                var controlDataDate = moment(controlData).format('YYYY-MM-DD');
                                controls.val(controlDataDate);
                            } else if (type == "radio" && !DataService.isEmpty(type)) {
                                controls.each(function () {
                                    var value = $(this).val();
                                    if (angular.isDefined(controlData))
                                        if (controlData.trim().toString() === value.trim().toString()) {
                                            $(this).prop("checked", true);
                                        }
                                });
                            }
                            else {
                                controls.val(controlData);
                            }
                        }
                        else if (type == "number" && !DataService.isEmpty(type)) {
                            controlData = parseInt(controlData);
                            controls.val(controlData);
                        }
                        else {
                            var controlsGrouplist = $("table tr td input[name='" + controlId + "[]']").attr('type');
                            if (!DataService.isEmpty(controlsGrouplist)) {
                                var parentLabel = $("table tr td input[name='" + controlId + "[]']");
                                if (controlsGrouplist == "checkbox") {
                                    controlData = controlData.replace('[', '').replace(']', '');
                                    if (controlData.includes(',')) {
                                        var splitData = controlData.split(',');
                                        _.each(splitData, function (t) {
                                            var exists = _.filter(parentLabel, function (item) { return item.value.trim() == t.trim() });
                                            if (!DataService.isEmpty(exists))
                                                exists[0].parentElement.click();
                                        });
                                    } else {
                                        var exists = _.findWhere(parentLabel, { value: splitData });
                                        if (!DataService.isEmpty(exists))
                                            exists.parentElement.click();
                                    }
                                }
                            } else {
                                $("table tr td select[name='" + controlId + "'] > option[value=" + controlData + "]").prop("selected", true);
                            }
                        }
                    }
                    else {
                    }
                }
            });
        };
        function filterReadableTableData(temp, name) {
            var data = temp;;
            var properties = data.split(';');
            var obj = {};
            var objList = [];
            var columnName = "";
            properties.forEach(function (property, index) {
                property = property.replace(/{/g, '').replace(/}/g, '');
                var tup = property.split(':');
                if (tup.length == 3) {
                    columnName = tup[0].trim();
                    var prm = name + '[' + tup[0].trim() + ']' + '[' + tup[1].trim() + ']';
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
                else if (tup.length == 2 && index > 0) {
                    var prm = name + '[' + columnName.trim() + ']' + '[' + tup[0].trim() + ']';
                    obj[prm] = tup[1];
                    objList.push(obj)
                }
            });
            return objList.length > 0 ? objList[0] : [];
        }
        $scope.bindUpdateControls = function () {
            var isCheckBoxGroup = false;
            angular.forEach($scope.formDataList, function (item) {
                if (item.fieldName.includes("checkboxGroup")) {
                    isCheckBoxGroup = true;
                    var list = item.fieldDataText.split(',');
                    $("#customFormNew :input[name=" + item.fieldName + "]").each(function () {
                        var value = $(this).val();
                        var index = _.indexOf(list, value);
                        if (index >= 0)
                            $(this).prop("checked", true);
                        else
                            $(this).prop("checked", false);
                    });
                }
                else if (item.fieldName.includes("radioGroup")) {
                    $("#customFormNew :input[name=" + item.fieldName + "]").each(function () {
                        var value = $(this).val();
                        if (angular.isDefined(item.fieldDataText))
                            if (item.fieldDataText.toString() === value.toString()) {
                                $(this).prop("checked", true);
                            }
                    });
                }
                else if (item.fieldName.includes("file")) {
                    if (!DataService.isEmpty(item.fieldDataMultimedia) && item.fieldDataMultimedia != "null") {
                        getMultipleFiles(item.fieldName);
                    }
                    else {
                        if (!DataService.isEmpty(item.fieldDataText) && item.fieldDataText != "null") {
                            previewSingleImage(item.fieldName, item.fieldDataText)
                        }
                    }
                }
                else
                    $("#customFormNew :input[name=" + item.fieldName + "]").val(item.fieldDataText)
            });

            if (!isCheckBoxGroup) {
                $("#customFormNew :input:checkbox").each(function () {
                    $(this).prop("checked", false);
                });
            }
        };
        function filename(path) {
            path = path.substring(path.lastIndexOf("/") + 1);
            return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
        }
        function previewSingleImage(id, path) {
            $("input:hidden[name=" + id + "]").attr('value', path);
            path = path.replace('~', '');
            var preview_element = document.getElementById("uploadPreview_" + id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                if (path.includes('.xls') || path.includes('.xlsx') || path.includes('.pdf')) {
                }
                else {
                }
                document.getElementById("uploadPreview_" + id).src = path;
                $("#uploadPreview_" + id).removeClass("hidden");
                $("#uploadPreview_" + id).find('.file-title').html('');
            }
        }
        function previewUploader(id, path) {
            $("input:hidden[name=" + id + "]").attr('value', path);
            path = path.replace('~', '');
            var preview_element = document.getElementById("uploadPreview_" + id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                if (path.includes('.xls') || path.includes('.docx') || path.includes('.doc') || path.includes('.xlsx') || path.includes('.pdf')) {
                    $('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().addClass('hidden');
                    var fileAttachments = $('#' + id).parents('.form-group').find('.attachments .file-attachments');
                    var nameddd = path.substring(path.lastIndexOf('/') + 1);
                    fileAttachments.find('p').append(nameddd);
                    fileAttachments.removeClass("hidden");
                }
                else {
                    var pathImage = "";
                    if (path.contains("http")) {
                        pathImage = path;
                    } else {
                        pathImage = mainService.getBaseUrl() + path;
                    }
                    document.getElementById("uploadPreview_" + id).src = pathImage;
                    $("#uploadPreview_" + id).parent().removeClass("hidden");
                    var nameddd = path.substring(path.lastIndexOf('/') + 1);
                    $("#uploadPreview_" + id).parent().find('.file-title').html(nameddd);
                }
            }
            else {
                // for multi file uploader ....
                preview_element = document.getElementById("shw_profile" + id);
                path = path.split(',');
                angular.forEach(path, function (valuePath, key) {
                    valuePath = valuePath.replace('~', '');
                    var nameddd = valuePath.substring(valuePath.lastIndexOf('/') + 1);
                    var div = $('<div />', { class: 'figure' });
                    div.appendTo($('#shw_profile_' + id + ' > div.fileData'));
                    var extention = valuePath.substr(valuePath.lastIndexOf('.') + 1);
                    console.log(valuePath, 'previewSingleImage');
                    if (extention == "jpg" || extention == "gif" || extention == "png" || extention == "jpeg") {
                        var img = $('<img />', {
                            class: 'scaled',
                            height: '100',
                            src: valuePath.toString(),
                            alt: nameddd
                        });
                        img.appendTo(div);
                        var p = $('<p />').html(nameddd);
                        p.appendTo(div);
                        var span = $('<span />').attr('class', 'img-wrapclose img-close multiple-files').html('×');
                        span.appendTo(div);
                    } else {
                        div.append('<i class="far fa-file-alt fa-2x"></i>');
                        var p = $('<p />').attr('class', 'file-attachments').html(nameddd);
                        p.appendTo(div);
                        div.append('<span class="img-wrapclose file-close multiple-files">×</span>');
                    }
                });
            }
        }
        $scope.bindCustomTabulator = function (param) {
            var paramData = param;
            var controlHtml = "";
            if (paramData.type == "tabulator") {
                createTabulatorOneToMany(paramData);
            }
        }
        $scope.bindResActivities = function () {
            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;;
            mainService.manageForm("ManageForm", param1)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.length > 0) {
                            var param = {};
                            param.action = 1;
                            param.formId = response.data[0].activitiesForm;
                            if (response.data[0].colorField != 'no color')
                                param.fieldName = response.data[0].activities + "," + response.data[0].colorField;
                            else
                                param.fieldName = response.data[0].activities
                            if ((response.data[0].activitiesForm != 0 && response.data[0].activitiesForm != null) && (response.data[0].activities != '' && response.data[0].activities != null)) {
                                mainService.getReferralFormFields("getReferralFormFields", param)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            if (response.data.length > 0) {
                                                $scope.formDetails = response.data;
                                                $scope.formDetails = _.without($scope.formDetails, _.findWhere($scope.formDetails, { value: "0" }));
                                                $timeout(function () {
                                                    $('.external-events-list .fc-event').each(function () {
                                                        $(this).data('event', {
                                                            title: $.trim($(this).text()), // use the element's text as the event title
                                                            color: $.trim($(this).data('color')),
                                                            duration: $.trim($(this).data('duration')),
                                                            stick: false // maintain when user navigates (see docs on the renderEvent method)
                                                        });
                                                        $(this).draggable({
                                                            zIndex: 999,
                                                            revert: true,      // will cause the event to go back to its
                                                            containment: ".table-responsive", scroll: true,
                                                            revertDuration: 0,  //  original position after the drag
                                                            stop: function () {
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
                        }
                    }
                });
        }
        $scope.existButtonFunc = function () {
            var isInformationOnly = $scope.importFormSettings.InformationOnly;
            if (angular.isDefined($scope.formGroupKey)) {
                if (window.opener && window.opener !== window) {
                    window.close();
                }
                else {
                    //window.history.back();
                }
            }
            else if (angular.isDefined(isInformationOnly)) {
                if (isInformationOnly == "tru") {
                    var previousPage = CookiesPersistenceService.getCookieData("informationBackLink");
                    if (angular.isDefined(previousPage)) {
                        window.location = previousPage;
                    }
                }
                else if (isInformationOnly == null && $scope.formGroupKey == undefined && $stateParams.popup != undefined) {
                    window.close();
                }
                else {
                    $rootScope.isFormDirty = $scope.myForm.$dirty;
                    //window.history.back();
                }
            }
            else {
                //window.history.back();
            }
        }
        function customClass(item) {
            var cssClass = "";
            switch (item.column) {
                case "1":
                    cssClass = "col-sm-12";
                    break;
                default:
                    cssClass = "col-sm-" + item.column;
                    break;
            }
            var newClass = "border-" + item.name;
            var cssItem = "";
            if (item.border) {
                cssItem += (item.border_top == "Yes") ? "border-top: " + item.border + "px solid !important;" : "border-top: 0px solid !important;"
                cssItem += (item.border_right == "Yes") ? "border-right: " + item.border + "px solid !important;" : "border-right: 0px solid !important;"
                cssItem += (item.border_bottom == "Yes") ? "border-bottom: " + item.border + "px solid !important;" : "border-bottom: 0px solid !important;"
                cssItem += (item.border_left == "Yes") ? "border-left: " + item.border + "px solid !important;" : "border-left: 0px solid !important;"
                cssItem += (item.background_color != "") ? "background-color: " + item.background_color + "  !important; " : "background-color: transparent  !important;"
            }
            if (angular.isDefined(item.column_width)) {
                cssItem += "width:" + item.column_width + "% !important";
            }
            var divWidth = "";
            if (!DataService.isEmpty(item.width)) {
                divWidth = " .innerDivWidth-" + item.name + "{ width: " + item.width + "% !important; } ";
            }
            if (item.type == "button") {
                item.className += " borderButton-" + item.name;
            }
            $("<style type='text/css'> ." + newClass + "{ " + cssItem + "}" + divWidth + "  </style> ").appendTo("head");
            return newClass + ' ' + cssClass + ' borderSet';
        }
        var check = null;
        var map = '';
        function makeHtmlAttributeFormat(fieldsData, itemkey, pageKey, dataValue) {
            var excelIntegrateData = "";
            var tempData = fieldsData;
            var finalArray = " ";
            var type = _.find(fieldsData, function (item, key) { return key == "type" });
            if (type == "button") {
                if (type == "button" && fieldsData.subtype == "exit") {
                    finalArray += "<button  onclick='angular.element(this).scope().existButtonFunc()'"
                } else {
                    finalArray += "<button"
                }
            }
            else if (type == "select") {
                finalArray += "<select id='" + fieldsData.name + "'"
            }
            else if (type == "radio-group" || type == "map" || type == "textarea" || type == "text-with-input" || type == "signature"
                || type == "paragraph" || type == "number" || type == "hidden" || type == "text" || type == "file" || type == "date"
                || type == "autocomplete" || type == "Line" || type == "hyperlink" || type == "checkbox-group") {
                if (type == "autocomplete") {
                    finalArray += "<div class='easy-autocomplete'>"
                    finalArray += "<input type='text' autocomplete='off' id='" + fieldsData.name + "'"
                }
                else if (type == "Line") {
                    finalArray += "<hr "
                }
                else if (type == "hyperlink") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='" + fieldsData.href + "' /> <a id='" + fieldsData.name + "'"
                }
                else if (type == "checkbox-group") {
                    finalArray += "<input type='checkbox' id='" + fieldsData.name + "'"
                }
                else if (type == "radio-group") {
                    finalArray += "<input type='radio'  id='" + fieldsData.name + "'"
                }
                else if (type == "date" || type == "text-with-input") {
                    if (type == "text-with-input") {
                        finalArray += "<div class='col-sm-12 no-pad' ><input type='text' class='editable-area inputClass' id='" + fieldsData.name + "'";
                    }
                    else {
                        finalArray += "<input type='text' id='" + fieldsData.name + "'";
                    }
                }
                else if (type == "file") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='null' /> <input type='" + type + "' id='" + fieldsData.name + "'  onchange='angular.element(this).scope().fileUploadDataEntry(\"" + fieldsData.name + "\")'";
                }
                else if (type == "hidden") {
                    finalArray += "<input type='" + type + "' id='" + fieldsData.name + "'";
                }
                else if (type == "map") {
                    finalArray += "<input type='hidden' name='" + fieldsData.name + "' value='null'  /><div id='" + fieldsData.name + "' style='width: 100%;height: 300px;position: relative;overflow: hidden;'";
                }
                else if (type == "number") {
                    finalArray += "<input type='" + type + "' id='" + fieldsData.name + "'";
                }
                else if (type == "paragraph" || type == "textarea") {
                    if (type == "textarea") {
                        if (fieldsData.subtype == "textarea") {
                            finalArray += "<" + fieldsData.subtype + "  id='" + fieldsData.name + "'";
                        } else {
                            finalArray += "<" + type + "  id='" + fieldsData.name + "'";
                        }

                    } else {
                        finalArray += "<" + fieldsData.subtype + "  id='" + fieldsData.name + "'";
                    }
                }
                else if (type == "signature") {
                    finalArray += "<div id='" + fieldsData.name + "_pad' style='width: " + fieldsData.pad_width + "px; height: " + fieldsData.pad_width + "px;'  class='kbw-signature'> <textarea  id='" + fieldsData.name + "' class='hidden'";
                }
                else if (type == "text") {
                    if (fieldsData.subtype == "tel" || fieldsData.subtype == "password" || fieldsData.subtype == "email" || fieldsData.subtype == "color")
                        finalArray += "<input id='" + fieldsData.name + "' type='" + fieldsData.subtype + "' "
                    else
                        finalArray += "<input id='" + fieldsData.name + "'"
                }
            }
            else if (type == "tinyMCE-content") {
                finalArray += "<div class='col-sm-12'> <textarea id='" + fieldsData.name + "'"
            }
            else if (type == "captcha") {
                if (fieldsData.subtype == "cp_motion") {
                    finalArray += "<div class='col-sm-12' id='mc-div'><canvas id='mc-canvas-" + fieldsData.name + "' class='mc-canvas'>  Your browser doesn't support the canvas element-please visit in a modern browser. </canvas><input type='hidden' id='mc-action-" + fieldsData.name + "'"
                }
                else if (fieldsData.subtype == "cp_google") {
                    finalArray += "<div id='recaptcha' class='g-recaptcha' data-sitekey='6LdpzrEUAAAAABg4FKEvEyuQg64Cz8I1ZbtdZd_M' data-size='invisible'"
                }
                else if (fieldsData.subtype == "cp_text") {
                    finalArray += "<div class='col-sm-12'><input class='form-control " + fieldsData.subtype + "' type='text' id='" + fieldsData.name + "-answer'"
                }
                else if (fieldsData.subtype == "cp_math") {
                    finalArray += "<div><label id='captchaText' class='control-label mr-5'></label><input id='captchaInput' aria-label='Captcha Input' class='form-control captchaInput' type='number' required='required'"
                }
            }
            else if (type == "banner") {
                finalArray += "<div class='col-sm-12'> <img id='" + fieldsData.name + "' src='" + fieldsData.value + "' "
            }
            else {
                finalArray += "<input id='" + fieldsData.name + "'"
            }
            _.each(tempData, function (item, key) {
                if (key != "values" && key != "role" && key != "type" && key != "className" && key != "required")
                    finalArray += " " + key + "='" + item + "'"
                if (key == "className")
                    finalArray += " class='" + item + "'"
                if (item == "radio-group" && key == "type")
                    finalArray += " type = 'radio'"
                if (type == "text" && key == "type")
                    finalArray += " " + key + "='" + item + "'"
                if (type == "file")
                    finalArray += " " + key + "='" + item + "'"
                if (key == "required")
                    finalArray += " " + key
                if (key == "attributeType")
                    if (item == "output") {
                        excelIntegrateData += item + "=" + fieldsData.XCoordinate + fieldsData.YCoordinate + "_" + fieldsData.worksheet;
                        finalArray += "data-fv-field='" + fieldsData.name + "'  data-xlsxfield='" + fieldsData.XCoordinate + fieldsData.YCoordinate + "' readonly  "
                    }
                    else if (item == "input") {
                        finalArray += " onchange='angular.element(this).scope().onBlurInput(\"" + fieldsData.name + "," + pageKey + "\")'"
                    }
            });
            if (!DataService.isEmpty(dataValue)) {
                finalArray += "value='" + dataValue + "'";
            }
            if (type == "button") {
                if (type == "button" && fieldsData.subtype == "exit") {
                    return finalArray += "type='button' >" + fieldsData.label + "</button>"
                }
                else {
                    return finalArray += " type='" + fieldsData.subtype + "' >" + fieldsData.label + "</button>"
                }
            }
            else if (type == "Line") {
                return finalArray + "/>";
            }
            else if (type == "hyperlink") {
                return finalArray += ">" + fieldsData.label + "</a>"
            }
            else if (type == "paragraph" || type == "textarea") {
                if (type == "textarea") {
                    if (fieldsData.subtype == "textarea") {
                        if (!DataService.isEmpty(dataValue)) {
                            return finalArray += ">" + dataValue + "</" + fieldsData.subtype + ">"
                        }
                        else {
                            return finalArray += "></" + fieldsData.subtype + ">"
                        }

                    } else {
                        return finalArray += "></" + type + ">"
                    }
                }
                else {
                    return finalArray += ">" + fieldsData.label + "</" + fieldsData.subtype + ">"
                }
            }
            else if (type == "date" || type == "text-with-input") {
                if (type == "text-with-input")
                    return finalArray += "></div>"
                var classtemp = "glyphicon glyphicon-";
                classtemp += fieldsData.types == "time_picker" ? "time" : "calendar";
                return finalArray += "><span class='input-group-addon'><span class='" + classtemp + "' ></span></span></div>"
            }
            else if (type == "map") {
                return finalArray + "></div>";
            }
            else if (type == "signature") {
                return finalArray += ">" + fieldsData.label + "</textarea></div>"
            }
            else if (type == "tinyMCE-content") {
                if (!DataService.isEmpty(dataValue)) {
                    return finalArray += ">" + dataValue + "</textarea></div>"
                }
                else {
                    return finalArray += "></textarea></div>"
                }
            }
            else if (type == "captcha") {
                return finalArray += "></div>"
            }
            else if (type == "banner") {
                return finalArray += "></div>"
            }
            else if (type == "checkbox-group" || type == "radio-group") {
                return finalArray;
            }
            else {
                return finalArray + ">";
            }
        }
        $scope.onBlurInputTable = function (data) {
            var temp = data.split(',')
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            // var XCoordinate = temp[0];
            //var YCoordinate = temp[1];
            var xlsCode = temp[0];
            var worksheet = temp[1];
            var nameTable = temp[2];
            var controlId = temp[3];
            var attributeType = temp[4];
            var pagename = temp[5];
            var columnIndex = parseInt(temp[6]);
            var rowIndex = parseInt(temp[7]);
            // var textvalue = $("#" + nameTable).find("td input").val();

            var textvalue = "";
            $("input").each(function () {
                if ($(this).attr("id") == controlId) {
                    textvalue = $(this).val();
                    return false;
                }
            });
            //var pagename = temp[1];
            var controlData = $scope.formFields[pagename];
            // //console.log(controlData)
            ////console.log(data)
            //var inputvalue = temp[5];
            //var dd = $("#" + inputvalue).val();
            //temp[5] = dd;
            //var param = temp.join();

            var xcelParam = {};
            var isInput = false;
            // var controlData = _.findWhere($scope.formFields, { name: nameTable });
            xcelParam.id = controlId;
            xcelParam.sheetName = worksheet;
            xcelParam.xlsCode = xlsCode;
            // xcelParam.columnName = XCoordinate;
            // xcelParam.rowName = YCoordinate;
            xcelParam.formGroupKey = newformGroupKey;
            xcelParam.type = attributeType;
            xcelParam.isRead = false;
            xcelParam.isWrite = true;
            xcelParam.value = textvalue;
            var outputListData = {};
            // deparam(settings);

            //$scope.formFieldExcelParam.listOfOutput = _.where($scope.listOfOutput, { rowNo: rowIndex });
            //angular.forEach(controlData, function (citem) {
            //    if (angular.isDefined(citem.attributeType)) {
            //        if (citem.attributeType == "output") {
            //            var xcelParamOut = {};
            //            xcelParamOut.id = citem.name;
            //            xcelParamOut.sheetName = citem.worksheet;
            //            xcelParamOut.columnName = citem.XCoordinate;
            //            xcelParamOut.rowName = citem.YCoordinate;
            //            xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
            //            xcelParamOut.type = citem.attributeType;
            //            xcelParamOut.formGroupKey = newformGroupKey;
            //            xcelParamOut.isRead = true;
            //            xcelParamOut.isWrite = false;
            //            $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
            //        }
            //    }
            //});
            _.extend(window["listOfOutput"], { formGroupKey: newformGroupKey });
            $scope.formFieldExcelParam.listOfOutput = window["listOfOutput"];
            angular.forEach($scope.formFields, function (pageData, pageKey) {
                angular.forEach(pageData, function (citem, key) {
                    if (angular.isDefined(citem.attributeType)) {
                        if (citem.attributeType == "output") {
                            var exists = _.findWhere($scope.formFieldExcelParam.listOfOutput, { id: citem.name });
                            if (DataService.isEmpty(exists)) {
                                var xcelParamOut = {};
                                xcelParamOut.id = citem.name;
                                //$("#" + xcelParamOut.id).addClass("loader");
                                xcelParamOut.sheetName = citem.worksheet;
                                xcelParamOut.columnName = citem.XCoordinate;
                                xcelParamOut.rowName = citem.YCoordinate;
                                xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
                                xcelParamOut.type = citem.attributeType;
                                xcelParamOut.formGroupKey = newformGroupKey;
                                xcelParamOut.isRead = true;
                                xcelParamOut.isWrite = false;
                                $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
                            }
                        }
                    }
                });
            });


            $scope.formFieldExcelParam.filePath = $scope.importFormSettings.xlsFile;
            $scope.formFieldExcelParam.fileName = $scope.importFormSettings.xlsxFileName;

            $scope.formFieldExcelParam.inputDataExcel = xcelParam;

            $scope.formFieldExcelParam.listOfInput.push(xcelParam);
            if ($scope.formFieldExcelParam.listOfInput.length == 0) {
                _.each($scope.formFieldExcelParam.inputDataExcel, function (item) {
                    $scope.formFieldExcelParam.listOfInput.push(item);
                });
            }
            clearTimeout(check);
            check = setTimeout(function () {
                //updateExcel(false);
            }, 4000);
            /// $timeout(function () {
            //mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (response.data.listOfOutput.length > 0) {
            //                //console.log(response.data)
            //                angular.forEach(response.data.listOfOutput, function (item) {
            //                    $("input").each(function () {
            //                        if ($(this).attr("id") == item.id) {
            //                            $(this).val(item.value);

            //                            return false;
            //                        }
            //                    });
            //                });
            //                textBoxLoader(false);
            //                // $rootScope.$emit("HideLoading");
            //            }
            //        }
            //    }, function (err) {
            //        textBoxLoader(false);
            //        $rootScope.$emit("HideLoading");
            //        //console.log("some error occured." + err);
            //    });
            //}, 3000);



        }

        function textBoxLoader(type) {
            if (type) {
                $(".disabledOutput").each(function () {
                    $(this).addClass("loader");
                    // return false;
                });
            } else {
                $(".disabledOutput").each(function () {
                    $(this).removeClass("loader");
                    //return false;
                });
            }
        }
        $scope.addListOutPutControls = function (data, index, row, worksheet, name) {
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            var params = deparam(data);
            var fieldType = params['column-' + index + '[inputType]'] ? params['column-' + index + '[inputType]'] : '';
            var attributeType = "";
            attributeType = params['column-' + index + '[' + fieldType + '][type]'] ? params['column-' + index + '[' + fieldType + '][type]'] : ''
            var XCoordinate = params['column-' + index + '[' + fieldType + '][XCoordinate]'];
            var YCoordinate = params['column-' + index + '[' + fieldType + '][YCoordinate]'];
            var validationId = name + "[column-" + index + "][row-" + row + "]";
            var coordinate = "";
            if (params['column-' + index + '[' + fieldType + '][coordinate]']) {
                coordinate = params['column-' + index + '[' + fieldType + '][coordinate]'];
            } else {
                if (params['column-' + index + '[' + fieldType + '][XCoordinate]'] && params['column-' + index + '[' + fieldType + '][YCoordinate]']) {
                    coordinate = (params['column-' + index + '[' + fieldType + '][XCoordinate]'] + params['column-' + index + '[' + fieldType + '][YCoordinate]']).toUpperCase();
                }
            }
            var xlsCode = (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "");

            if (attributeType == "output") {
                var exists = _.findWhere($scope.listOfOutput, { id: validationId });
                if (angular.isUndefined(exists)) {
                    var xcelParamOut = {};
                    xcelParamOut.id = validationId;
                    xcelParamOut.sheetName = worksheet;
                    //xcelParamOut.columnName = XCoordinate;
                    //xcelParamOut.rowName = YCoordinate;
                    xcelParamOut.type = attributeType;
                    xcelParamOut.formGroupKey = newformGroupKey;
                    xcelParamOut.columnNo = index;
                    xcelParamOut.xlsCode = xlsCode;
                    xcelParamOut.rowNo = row;
                    xcelParamOut.isRead = true;
                    xcelParamOut.isWrite = false;
                    $scope.listOfOutput.push(xcelParamOut);
                }
            }
        };
        $scope.onUniqueCheck = function (data) {
            var temp = data.split(',');
            var controlId = temp[0];
            var textvalue = $("#" + temp[0]).val();
            var param = {};
            param.action = 2;
            param.formId = temp[1]
            param.fieldName = controlId;
            param.fieldDataText = textvalue;
            param.formTableColumnName = param.fieldName.includes('-') ? '[' + param.fieldName + ']' : param.fieldName;
            param.formTableColumnData = textvalue;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.validateUniqueness("ValidateUniqueness", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (response.data.res == 1) {

                        } else {
                            $("#" + temp[0]).val("");
                            notifierService.notifyMessage('error', 'FormEntry', response.data.Message);
                        }
                    }

                }, function (err) {
                    console.log("some error occured." + err);
                });

        };

        function restrictKeyboardInput() {
            var key = e.keyCode ? e.keyCode : e.which;

            if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
                (key == 65 && (e.ctrlKey || e.metaKey)) ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
                (key >= 96 && key <= 105)
            )) e.preventDefault();
        }


        $scope.onBlurInput = function (data) {
            //$rootScope.$emit("ShowLoading");

            $scope.formFieldExcelParam.listOfOutput = [];
            var temp = data.split(',')
            var controlId = temp[0];
            var textvalue = $("#" + temp[0]).val();
            var pagename = temp[1];
            var controlData = $scope.formFields[pagename];
            //console.log(controlData)
            //console.log(data)
            //var inputvalue = temp[5];
            //var dd = $("#" + inputvalue).val();
            //temp[5] = dd;
            //var param = temp.join();
            var newformGroupKey = DataService.isEmpty($scope.freshEntryformGroupKey) ? $scope.formGroupKey : $scope.freshEntryformGroupKey;
            var xcelParam = {};
            var isInput = false;
            xcelParam = _.findWhere(controlData, { name: controlId });
            xcelParam.id = xcelParam.name;
            xcelParam.sheetName = xcelParam.worksheet;
            xcelParam.columnName = xcelParam.XCoordinate;
            xcelParam.rowName = xcelParam.YCoordinate;
            xcelParam.xlsCode = xcelParam.XCoordinate + xcelParam.YCoordinate;
            xcelParam.type = xcelParam.attributeType;
            xcelParam.formGroupKey = newformGroupKey;
            xcelParam.isRead = false;
            xcelParam.isWrite = true;
            xcelParam.value = textvalue;

            angular.forEach(controlData, function (citem) {
                if (angular.isDefined(citem.attributeType)) {
                    if (citem.attributeType == "output") {
                        var xcelParamOut = {};
                        xcelParamOut.id = citem.name;
                        //$("#" + xcelParamOut.id).addClass("loader");
                        xcelParamOut.sheetName = citem.worksheet;
                        xcelParamOut.columnName = citem.XCoordinate;
                        xcelParamOut.rowName = citem.YCoordinate;
                        xcelParamOut.xlsCode = citem.XCoordinate + citem.YCoordinate;
                        xcelParamOut.type = citem.attributeType;
                        xcelParamOut.formGroupKey = newformGroupKey;
                        xcelParamOut.isRead = true;
                        xcelParamOut.isWrite = false;
                        $scope.formFieldExcelParam.listOfOutput.push(xcelParamOut);
                    }
                }

            });

            $scope.formFieldExcelParam.filePath = $scope.importFormSettings.xlsFile;
            $scope.formFieldExcelParam.fileName = $scope.importFormSettings.xlsxFileName;

            $scope.formFieldExcelParam.inputDataExcel = xcelParam;
            $scope.formFieldExcelParam.listOfInput.push(xcelParam);
            if ($scope.formFieldExcelParam.listOfInput.length == 0) {
                _.each($scope.formFieldExcelParam.inputDataExcel, function (item) {
                    $scope.formFieldExcelParam.listOfInput.push(item);
                });
            }
            clearTimeout(check);
            check = setTimeout(function () {
                //updateExcel(true);
            }, 3000);
            /// $timeout(function () {
            //mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (response.data.listOfOutput.length > 0) {
            //                console.log(response.data)
            //                angular.forEach(response.data.listOfOutput, function (item) {
            //                    $("#" + item.id).val(item.value);
            //                    $("#" + item.id).removeClass("loader");
            //                })
            //                //$rootScope.$emit("HideLoading");

            //            }
            //        }
            //    }, function (err) {

            //            $("body").removeClass("loader");
            //        //$rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });
            //}, 3000);

        }

        function updateExcel(type) {

            $("input.inputClass").prop("disabled", true);
            $rootScope.$emit("ShowLoading");
            var reqType = "form";
            $scope.formFieldExcelParam.uid = $scope.userDetail.uid
            $scope.formFieldExcelParam.formId = $stateParams.formId;
            $scope.formFieldExcelParam.reqType = reqType;
            $scope.formFieldExcelParam.userId = $scope.userDetail.Id;
            $scope.formFieldExcelParam.macroname = $scope.macro_nm;
            //console.log($scope.formFieldExcelParam,'sona excel file')
            //return false;
            mainService.manageXlDataNew("manageXlDatNew", $scope.formFieldExcelParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (angular.isDefined(response.data.listOfOutput)) {
                            if (response.data.listOfOutput.length > 0) {
                                //console.log(response.data)
                                if (type) {
                                    angular.forEach(response.data.listOfOutput, function (item) {
                                        $("#" + item.id).val(item.value);
                                        $("#" + item.id).removeClass("loader");
                                    })
                                } else {
                                    angular.forEach(response.data.listOfOutput, function (item) {
                                        $("input").each(function () {
                                            if ($(this).attr("id") == item.id) {
                                                $(this).val(item.value);
                                                $("#" + item.id).removeClass("loader");
                                                return false;
                                            }
                                        });
                                    });
                                }
                                textBoxLoader(false);
                                //$rootScope.$emit("HideLoading");

                            }
                            $scope.formFieldExcelParam.listOfInput = [];
                            $scope.formFieldExcelParam.inputDataExcel = {};
                        }
                    }
                    $("input.inputClass").prop("disabled", false);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $scope.formFieldExcelParam.listOfInput = [];
                    $scope.formFieldExcelParam.inputDataExcel = {};
                    textBoxLoader(false);
                    $("body").removeClass("loader");
                    $rootScope.$emit("HideLoading");
                    $("input.inputClass").prop("disabled", false);
                    //$rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        function createCaptchaControl(item) {
            if (item.subtype == "cp_math") {
                var mathCaptcha = {
                    label: "captchaText",
                    maxNumber: 2

                }
                $('#customFormNew').captcha({
                    label: mathCaptcha.label,
                    maxNumber: parseInt(mathCaptcha.maxNumber)
                });


            }
            else if (item.subtype == "cp_text") {

                // create instance
                var numDigits = parseInt(3);
                var useDecimal = 0;


                var decimalChance = useDecimal;

                var imgLess = new imagelessCaptcha(numDigits, useDecimal, decimalChance);
                var question = imgLess.formPhrase();
                var answer = imgLess.getInt();
                // put question into form
                // $timeout(function () {
                item.labelHtml = "<label id='" + item.name + "'-question' class='form-label' for='" + item.name + "'-answer'> " + question + " </label>";
                // $("#" + item.name + "-question").text(question);
                $("#" + item.name + "-answer").parent().attr('data-answer', answer);
                // }, 150);



            }
            else if (item.subtype == "cp_motion") {
                var motionCaptcha = {
                    actionId: "#mc-action-" + item.name,     // The ID of the input containing the form action
                    divId: "#mc-div",               // If you use an ID other than '#mc' for the placeholder, pass it in here
                    canvasId: "#mc-canvas-" + item.name,     // The ID of the MotionCAPTCHA canvas element
                    canvasTextColor: "'#111'",
                    // These messages are displayed inside the canvas after a user finishes drawing:
                    errorMsg: "Please try again.",
                    successMsg: "Verified!",
                }
                $('#customFormNew').motionCaptcha(motionCaptcha);

            }
            else if (item.subtype == "cp_google") {
                grecaptcha.execute();
            }
        };

        function createQuillTextArea(item) {
            var Delta = Quill.import('delta');
            //var Display_Only = "{!! (isset($fields['Display_Only']) && str_contains($fields['Display_Only'], $userRole) !== false) ? 1 : 0 !!}";
            var toolbarOptions = [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }]
                /*[{'direction': 'rtl'}],
                 [{'color': []}, {'background': []}],
                 [{'align': []}],
                 ['link', 'image', 'video'],
                 ['clean']*/
            ];
            var options = {
                //debug: 'info',
                modules: {
                    toolbar: toolbarOptions
                },
                //scrollingContainer: "#scrolling_{!! $fields['name'] or '' !!}",
                //placeholder: "{!! $placeholderValue or '' !!}",
                theme: 'snow',
                //readOnly: (Display_Only == 1) ? true : false
            };
            var editor = new Quill("#" + item.name, options);
            var change = new Delta();
        }

        function createTabulatorOneToMany(fieldData) {
            if (angular.isDefined(fieldData.reference_form)) {
                var param = {};
                param.action = 4;
                param.formId = fieldData.reference_form;
                var tabularId = "formGeneratorTabulator" + fieldData.name;
                if (!DataService.isEmpty(param.formId) && param.formId != "0" && param.formId != 0) {
                    //$scope.getFormDetails(param, tabularId, fieldData.name);
                    $scope.bindOneToManyControl(param, tabularId, fieldData.name);
                }
            }
            //return '<div class="form-group col-sm-12 borderSet">  <label class="col-sm-12" for=' + tabularId + '>  Untitled name(newform)  <a class= "btn btn-danger pull-right delete-tabulator-row-hard" data-tabulator="' + tabularId + '" data-reference-form-id="' + + fieldData.reference_form + '" onclick="angular.element(this).scope().deleteRecordsIntoOneMany()"><i class="fa fa-trash"></i> Delete records</a>' +
            //    '<a id="btnAddRecord_tabulator_"' + tabularId + '" class="btn btn-primary pull-right mr-5" onclick="angular.element(this).scope().insertRecordsIntoOneMany(' + param.formId + ')" ><i class="fa fa-plus"></i> Insert new record</a></label >' +
            //    '<div class="clearfix"></div><div class="col-sm-12"><input type="hidden" name="linked_record_key" value="linked_record_key"> <input type="hidden" name="reference_form" value="' + fieldData.reference_form + '"> <input type="hidden" name="oneToMany-' + fieldData.reference_form + '" value="' + param.formId + '">  <input type="hidden" name="one_to_many_form" value="' + $scope.currentFormId + '">' +
            //    '<div class="table-responsive"><div id=' + tabularId + '></div></div> </div></div>';
        }

        $scope.insertRecordsIntoOneMany = function (formId, fieldName) {
            var temp = {};
            temp.formId = formId;
            temp.fieldName = fieldName;
            temp.formGroupKey = $scope.freshEntryformGroupKey;
            temp.MasterFormID = $scope.currentFormId;
            localStorage.setItem("insertReferrence", JSON.stringify(temp));
            $scope.entryPage(formId, false, $scope.freshEntryformGroupKey, fieldName, false, true);
        };
        $scope.entryPage = function (formId, isEdit, formGroupKey, fieldName, isTab, isLocally, tabularId) {
            var reference_form = "2196";
            //var params = windowParams();
            var params = setWindowScreenSize($scope.importFormSettings.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            $scope.isEdit = isEdit;
            if ($scope.isEdit && isLocally != true) {
                newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + '/0?popup=1', 'example', params, true);
            }
            else if (angular.isDefined(isTab) && isTab == true) {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
            }
            else if (angular.isDefined(isLocally) && isLocally == true) {
                console.log(isLocally, 'isLocally')
                if (localStorage.getItem("tabulatorOnetomany-" + formId) == null) {
                    if ($scope.isEdit) {
                        if ($scope.importFormSettings.currentFormType == 1) {
                            var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId.toString() });
                            if (!DataService.isEmpty(exists)) {
                                // : formGroupKey /: Id ?
                                newWindow = window.open(baseUrl + "#/form/editEvent/" + formId + "/" + formGroupKey + "/" + fieldName + '?popup=1&cname=' + exists.field + '&value=' + $stateParams.Id + '', 'example1', params, true);
                            }
                        }
                        else {
                            newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + fieldName + "?popup=3", 'example', params, true);
                        }
                    }
                    else {
                        if ($scope.importFormSettings.currentFormType == 1) {
                            var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId.toString() });

                            if (!DataService.isEmpty(exists)) {
                                newWindow = window.open(baseUrl + "#/form/saveEvent/" + formId + '?popup=1&parentFormId=' + $scope.currentFormId + '&cname=' + exists.field + '&value=' + $stateParams.Id + '', 'example1', params, true);
                            }
                        } else {
                            newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
                        }
                    }
                } else {
                    var url = "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + fieldName + "?popup=3";
                    newWindow = window.open(baseUrl + url, 'example', params, true);
                }
            }
            else {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            }
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    var param = {};
                    param.action = 4;
                    param.fieldName = fieldName;
                    if (!DataService.isEmpty(tabularId))
                        param.tabularId = "formGeneratorTabulator" + tabularId;
                    else
                        param.tabularId = "formGeneratorTabulator" + fieldName;

                    if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    else
                        param.formGroupKey = $scope.formGroupKey;
                    param.formId = formId;
                    //var dataSubForm = localStorage.getItem("formOneData");
                    //$scope.GetTabOneToManyDynamimc(param, param.action)
                    $scope.bindOneToManyControl(param, param.tabularId, fieldName);
                    if (param.action == 4)
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                    setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);
                    //var tempTabulatorData = localStorage.getItem("tabulatorOnetomany-" + formId);
                    //console.log(tempTabulatorData);
                    //$scope.bindOnetoManyTabulator(tempTabulatorData, fieldName);
                    //  if (!DataService.isEmpty(dataSubForm)) {
                    // var groupBy = JSON.parse(dataSubForm);
                    //$timeout(function () {
                    //    var paramTemp = {};
                    //    paramTemp.action = 2;
                    //    paramTemp.formId = formId;
                    //    paramTemp.tabularId = fieldName;
                    //    $scope.GetFormRecordListDynamimc(paramTemp);
                    //}, 150);
                    //var dataArray = [];
                    //angular.forEach(groupBy, function (item) {
                    //    item = JSON.parse(item);
                    //    var list = '';
                    //    list += '{"';
                    //    angular.forEach(item, function (itemData, key) {
                    //        //console.log(itemData)
                    //        list += '' + itemData.name.trim() + '":"' + itemData.value.trim() + '","';
                    //    });

                    //    list += 'formGroupKey":"' + item[item.length - 1].value.trim() + '"';
                    //    list += "}"
                    //    dataArray.push(JSON.parse(list));
                    //});
                    //var formData = JSON.stringify(dataArray);

                    //tabulator.setData([]);
                    // $("input:hidden[name=oneToMany-" + formId + "]").attr('value', formData);
                    // localStorage.removeItem("formOneData");
                    //}
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
                    if (localStorage.getItem("formGroupKey") != "") {
                        var keydata = localStorage.getItem("formGroupKey")
                        $("input:hidden[name=linked_record_key]").attr('value', keydata);
                    }
                    //alert('closed: ' + reference_form);
                    // tabulators["tabulator_1574079483837"].setData("http://192.168.1.141:91/form-generator/public/get-linked-records/" + reference_form + "/0");
                }

            }, 500);
        };



        $scope.bindOnetoManyTabulator = function (dataLocal, fieldName) {
            var temp = JSON.parse(dataLocal);
            if (!DataService.isEmpty(temp)) {
                var filterData = JSON.parse(temp.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';

                angular.forEach(filterData, function (item) {
                    // item = JSON.parse(item);

                    //angular.forEach(item, function (itemData, key) {
                    //console.log(itemData)
                    list += '' + item.name.trim() + '":"' + item.value.trim() + '","';
                    //});                            

                });
                list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                list += "}"
                dataArray.push(JSON.parse(list));

                tabulator.setData(dataArray);
            }
        }


        $scope.deleteRecordsIntoOneMany = function (formid, fieldName) {

            if (confirm('Are you sure to delete selected Record?')) {
                var deletedList = window["formGroupKeyList"]
                var param = {};
                param.action = 3;
                param.formId = formid;
                if (angular.isDefined(deletedList)) {
                    param.formGroupKeyList = deletedList.join();
                    param.AutoIdList = window["AutoIdList"]
                    param.fieldName = fieldName;
                    $scope.GetTabOneToManyDynamimc(param, param.action);
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);
                    // GeneratedFormDataDelete(param);
                }
            }
        }
        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            //dataParam.topicId = $scope.formDetailsDataInfo.topicId;
            //mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (!DataService.isEmpty(response.data.Message)) {
            //                var exists = response.data;
            //                var temp = {};
            //                if (exists.res == 1) {
            //                    notifierService.notifyMessage('success', 'FormRecord', exists.Message);
            //                    angular.forEach(window["formGroupKeyList"], function (item) {
            //                        temp = _.findWhere($scope.formDetailsDataTemp, { reference_form: dataParam.formId.toString() })
            //                        var idx = _.findIndex(temp.data, { Id: item });
            //                        if (angular.isDefined(temp.data))
            //                            temp.data.splice(idx, 1);
            //                    });
            //                    $timeout(function () {
            //                        if (DataService.isEmpty(temp.data))
            //                            temp.data = [];
            //                        tabulator.setData(temp.data);
            //                    }, 150);
            //                    //window["formGroupKeyList"] = null;
            //                }
            //            }
            //        }
            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });
        }

        $scope.loadEntryDataIntoTabulatorOnetoMany = function (paramData, formId, fieldName) {
            $scope.formDataForOneParam = {}
            $scope.formDataForOneParam = paramData;
            $scope.formDataForOneParam.formId = $scope.currentFormId;
            $scope.formDataForOneParam.referenceForm = formId;
            $scope.formDataForOneParam.created_by = $scope.userDetail.Id;
            $scope.formDataForOneParam.update_by = $scope.userDetail.Id;
            mainService.formDataForOne("FormDataForOne", $scope.formDataForOneParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if ($scope.formDataForOneParam.action == 1) {
                            var rowDataTabulator = [];
                            var groupBy = response.data;
                            groupBy = _.groupBy(groupBy, "formGroupKey");
                            var dataArray = [];
                            angular.forEach(groupBy, function (item, grp) {
                                var list = '';
                                list += '{"';
                                angular.forEach(item, function (itemData, key) {
                                    //console.log(itemData)
                                    list += '' + itemData.fieldName.trim() + '":"' + itemData.fieldDataText.trim() + '","';
                                });
                                list += 'formGroupKey":"' + grp.trim() + '"';
                                //list = list.substring(0, list.length - 2);
                                list += "}"
                                dataArray.push(JSON.parse(list));

                            });
                            //list = list.substring(0, list.length - 1);
                            var formData = JSON.stringify(dataArray);
                            //formData = JSON.parse(formData);
                            //console.log(formData);                   
                            tabulator.setData(dataArray);


                            $("input:hidden[name=oneToMany-" + formId + "]").attr('value', formData);

                        }
                        else if ($scope.formDataForOneParam.action == 5) {
                            if (response.data.length > 0) {
                                var formTabulatorOne = response.data[0];
                                var tableData = JSON.parse(formTabulatorOne.fieldDataText);
                                var colList = [];
                                var rowList = [];
                                angular.forEach(tableData, function (item, col) {
                                    angular.forEach(item, function (itemdata, colData) {
                                        //console.log(itemdata)
                                    });
                                });
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
                            var param = {};
                            param.action = 1;
                            $scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        var arrowIcon = function (cell, formatterParams) {
            return "<i class='fa fa-pencil fa-lg';></i>"
            //return "<img src='assets/images/pencil.png' width='20'>";
        };

        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 12) % 12 | 0;
                dt = Math.floor(dt / 12);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(12);
            });
            return uuid;
        }

        $scope.getFormDetails = function (param, tabularId, fieldName) {
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)                            
                        // $rootScope.$emit("HideLoading");   
                        var langId = "1";
                        if (localStorage.getItem("globalLang") != null) {
                            langId = localStorage.getItem("globalLang");
                        }

                        var formDataTemp = response.data[0]
                        var formDatafields = JSON.parse(formDataTemp.fields);
                        _.each(formDatafields, function (item, key) {
                            if (item.length > 1)
                                if (!Array.isArray(item))
                                    formDatafields[key] = JSON.parse(item);
                            _.each(formDatafields[key], function (itemControl, keyControl) {
                                var translateLabel = "";
                                if (!DataService.isEmpty(itemControl.label))
                                    translateLabel = getStringFromMultiligualText(itemControl.label, langId);
                                if (!DataService.isEmpty(translateLabel))
                                    itemControl.label = translateLabel;
                            });
                        });
                        //console.log(formDatafields);

                        var finalArray = [];
                        bindTabulatorColumnsHeader(formDatafields, tabularId, param.formId, fieldName);
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.fileUploadDataEntry = function (id, uploaderType) {
            var oFReader = new FileReader();
            var files = document.getElementById(id).files;
            //alert(uploaderType);

            if (files.length > 1) {

                getMultipleFiles(id);

            }
            else if (files.length == 1) {

                getSingleFile(id, uploaderType);

                //if (files[0].type.match('image.*')) {
                //    oFReader.readAsDataURL(files[0]);
                //    oFReader.onload = function (oFREvent) {
                //        console.log(oFREvent.target.result);
                //        var preview_element = document.getElementById("uploadPreview_" + id);
                //        if (angular.isDefined(preview_element) && preview_element !== null) {
                //            document.getElementById("uploadPreview_" + id).src = oFREvent.target.result;
                //            $("#uploadPreview_" + id).parent().removeClass("hidden");
                //            $("#uploadPreview_" + id).parent().parent().find('.file-title').html('');
                //        }


                //    }
                //} else {
                //    $('#uploadPreview_' + id).removeAttr('src'); 
                //    $('#uploadPreview_' + id).parent().addClass('hidden');
                //    var fileAttachments = $('#' + id).parent().parent().find('.attachments .file-attachments');
                //    fileAttachments.find('p').append('<b>' + files.name + '</b>');
                //    fileAttachments.removeClass("hidden");
                //    $("input:hidden[name=" + id + "]").attr('value', oFREvent.target.result);
                //}


            };
            $scope.uploadFileOnly(files, id, uploaderType);

        };

        $scope.uploadFileOnly = function (element, id, uploadType) {
            if (angular.isDefined(element)) {
                var fileData = element;
                var fd = new FormData();
                var reqType = "form";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                var appIdParam = $scope.importFormSettings.applicationId;
                var appTitleParam = $scope.importFormSettings.applicationTitle;
                var formIdParam = $scope.importFormSettings.formId;
                var formTitleParam = $scope.importFormSettings.title;
                var counterfile = 0;
                angular.forEach(fileData, function (value, key) {
                    //console.log(value);
                    counterfile++;
                    var NamingIndex = "file" + counterfile.toString();
                    fd.append(NamingIndex, value);
                });
                //fd.append('file', fileData);

                //console.log(fd);               
                mainService.uploadFile("UploadFile", fd, reqType, uid, appIdParam, appTitleParam, formIdParam, formTitleParam, false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                if (response.data.code == 200) {
                                    var urlStr = response.data.fileUrl;
                                    //if()
                                    if (uploadType == "multi")
                                        setHiddenField(id, urlStr);
                                    else {
                                        $("input:hidden[name=" + id + "]").val(urlStr);
                                    }
                                    console.log("uploaded Successfully");
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
        };

        function setHiddenField(uploaderId, url) {
            var value = $("input:hidden[name=" + uploaderId + "]").val();

            if (value == 'null' || value == "" || typeof value === "undefined") {
                // alert('isnull');
                $("input:hidden[name=" + uploaderId + "]").attr('value', url);

            }
            else {

                var Arr = url.split(',');

                angular.forEach(Arr, function (item, key) {
                    if (value.indexOf(item) > -1) {

                    }
                    else {
                        value += ',' + item;
                    }

                });


                $("input:hidden[name=" + uploaderId + "]").attr('value', value);


            }



            //$("input:hidden[name=" + id + "]").attr('value', "");


        }

        var finalArray = [];
        var popupTabulator = {};
        var tabulator = {};
        var tempTabulatorList = {};
        function editCheckRow(e, cell) {
            console.log('cell-editCheckRow')
        }

        function bindTabulatorColumnsHeader(formDetails, tabularId, formId, fieldName) {
            finalArray = [];
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                item.name = item.field;
                item.label = item.title;
                if (item.List_column1 == "Yes") {
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multiple == true) {
                                finalArray.push({
                                    title: item.label, formatter: multilFiles, width: 200, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {
                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.label, formatter: arrowImage, width: 200, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: "input"
                                });
                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit) && item.Inline_Edit == "Yes") {
                                    finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input", visible: false });
                                    finalArray.push({
                                        title: item.label, bottomCalc: showFooter(item), width: 200, field: "RowID-" + item.name, align: "left", headerFilter: "input", editor: "input", cellEdited: function (cell) {
                                            console.log("cell" + cell)
                                        }
                                    });
                                }
                                else {
                                    finalArray.push({ title: item.label, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input" });
                                }
                            }
                            else {
                                $scope.displayInTabData = item;
                            }
                        }
                    }
                }
            });

            finalArray.unshift({
                title: "formId", field: "formId", visible: false
            });
            finalArray.unshift({ title: "Id", field: "Id", visible: false });
            finalArray.unshift({ title: "AutoId", field: "AutoId", visible: false });
            finalArray.unshift({
                title: "Edit", bottomCalc: showFooter({}), width: 80, field: "editRow", formatter: arrowIcon, headerSort: false, align: "center", cellClick: function (e, cell) {
                    var autoid = (!DataService.isEmpty(cell.getRow().getData().AutoId)) ? parseInt(cell.getRow().getData().AutoId) : 0;
                    if (autoid != 0)
                        $scope.entryPage(formId, true, cell.getRow().getData().formGroupKey, autoid, false, true, fieldName);
                    else
                        $scope.entryPage(formId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id, false, true, fieldName);
                }
            });

            //   $timeout(function () {
            if ($("#" + tabularId).length) {
                tempTabulatorList[tabularId] = new initTabulator(tabularId, {
                    placeholder: "No Data.",
                    height: "300px",
                    layout: "fitColumns",
                    selectable: true,
                    movableRows: true,
                    responsiveLayout: false,

                    cellEdited: function (cell) {
                        //This callback is called any time a cell is edited
                        var input = []; var json = {}; var columnName = cell.getColumn().getField();
                        json[columnName] = (columnName === "status" ? formStatus.indexOf(cell.getValue()) : cell.getValue());
                        //input['url'] = "{{url('update_custom')}}";
                        input['data'] = { 'table': 'application', 'update': json, 'where': { applicationId: cell.getRow().getData().applicationId } };

                        //if (input['data'].update[columnName]) { ajax_call(input); }
                        if (input['data'].update[columnName]) {
                            //ajax_call(input);
                            var temp = {};
                            temp.columnName = columnName;
                            temp.columnValue = cell.getValue();
                            temp.action = 5;
                            temp.AutoId = cell.getData().AutoId;
                            temp.formGroupKey = cell.getData().formGroupKey;
                            $scope.editRowWiseOneToMany(temp, 5);
                        }
                        else { cell.restoreOldValue(); }
                    },
                    rowSelectionChanged: function (data, rows) {
                        var formGroupKeyList = [];
                        data.forEach(function (item, key) {
                            formGroupKeyList.push(item.formGroupKey);
                        });
                        window["formGroupKeyList"] = formGroupKeyList;
                        var AutoIdList = [];
                        data.forEach(function (item, key) {
                            AutoIdList.push(item.Id);
                        });
                        window["AutoIdList"] = AutoIdList;
                    },
                    ////ajaxFiltering: true,
                    ////ajaxProgressiveLoad: "scroll",
                    //paginationSize: 50
                });
                tempTabulatorList[tabularId].setColumns(finalArray);
                $timeout(function () {
                    $rootScope.safeApply();
                    // tempTabulatorList[tabularId].redraw();
                }, 10);

                finalArray = [];
                //$timeout(function () {            
                window["tabulators"] = tempTabulatorList;

                //}, 250);
                //  $timeout(function () {
                var paramTemp = {};
                paramTemp.action = 4;
                paramTemp.formId = formId;
                paramTemp.tabularId = tabularId;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    paramTemp.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    paramTemp.formGroupKey = $scope.formGroupKey;

                //$scope.GetFormRecordListDynamimc(paramTemp);
                //$scope.GetTabOneToManyDynamimc(paramTemp, paramTemp.action);
                //var tempTabulatorData = localStorage.getItem("tabulatorOnetomany-" + paramTemp.formId);
                //console.log(tempTabulatorData);             
                // if (!DataService.isEmpty(tempTabulatorData)) {
                //$scope.bindOnetoManyTabulator(tempTabulatorData, tabularId);
                window.addEventListener('resize', function () {
                    tempTabulatorList[tabularId].redraw();
                });
                setTimeout(function () { setTabulatorCalc(tabularId); }, 250);
            }
            // }, 150);

            //var paramNew = {};
            //paramNew.action = 5;
            //$scope.loadEntryDataIntoTabulatorOnetoMany(paramNew, formId, fieldName);

            //}, 250);


        };

        $scope.GetFormRecordListDynamimc = function (param) {
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.getFormRecordList("GetFormRecordList", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        console.log(response.data)
                        var formDataTemp = response.data;
                        var exists = _.findWhere($scope.formDetailsDataTemp, { name: param.tabularId });
                        exists.data = formDataTemp;
                        var formDataFields = [];
                        _.each(formDataTemp, function (pagesData, key) {
                            formDataFields.push({ key });
                        });
                        $timeout(function () {
                            tabulator.setData(exists.data);
                        }, 150);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.GetTabOneToManyDynamimc = function (param, type) {
            if (!$scope.isEdit && type == 1) {
                param.action = 1;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
                if (!DataService.isEmpty(localStorage.getItem("insertReferrence"))) {
                    var temp = {};
                    temp = JSON.parse(localStorage.getItem("insertReferrence"));
                    if (!DataService.isEmpty(temp.formGroupKey))
                        param.formGroupKey = temp.formGroupKey;
                    else
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    param.MasterFormID = temp.MasterFormID;
                }
            }
            else if (type == 2 && $scope.isEdit == true) {
                param.action = 2;
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 3) {
                param.action = 3;
            }
            else if (type == 4) {
                //param.action = 2;

                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;

            }
            else if (type == 5 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 7 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            var formId = $stateParams.formId;
            param.formId = formId;
            var oneToManyParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            oneToManyParam.created_by = $scope.userDetail.Id;
            oneToManyParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (DataService.isEmpty(oneToManyParam.tabularId))
                            oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        //console.log(response.data)
                        var tempTabulatorData = response.data;
                        if (oneToManyParam.action == 4) {
                            var currentFormId = parseInt(oneToManyParam.formId);
                            if (tempTabulatorData.length > 0) {
                                if (tempTabulatorData[0].formId == currentFormId) {
                                    var dataArray = [];
                                    var oneToManyTempData = [];
                                    if (!DataService.isEmpty(tempTabulatorData)) {
                                        angular.forEach(tempTabulatorData, function (item) {
                                            if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                                var tempData = JSON.parse(item.formfieldDataListTemp)
                                                if (!DataService.isEmpty(tempData)) {
                                                    if (tempData.length > 1) {
                                                        _.map(tempData, function (tempitem) {
                                                            return _.extend(tempitem, {
                                                                "AutoId": item.AutoId
                                                            });
                                                        });
                                                        //tempData.push({
                                                        //    "name": "AutoId", "value": item.AutoId
                                                        //});
                                                        //oneToManyTempData=tempData;
                                                        oneToManyTempData.push(tempData);
                                                    } else if (tempData.length == 1) {
                                                        tempData[0].AutoId = item.AutoId;
                                                        dataArray.push(tempData[0]);
                                                    }
                                                }
                                            }
                                        });
                                        if (!DataService.isEmpty(oneToManyTempData)) {

                                            angular.forEach(oneToManyTempData, function (filterData) {
                                                //var filterData = oneToManyTempData;

                                                var list = '';
                                                list += '{"';

                                                angular.forEach(filterData, function (item, key) {
                                                    // item = JSON.parse(item);

                                                    if (item.constructor == Object) {
                                                        list = '';
                                                        list += '{"';
                                                        angular.forEach(item, function (itemData, keyData) {
                                                            list += '' + keyData + '":"' + itemData + '","';
                                                            list += 'RowID-' + keyData + '":"' + itemData + '","';
                                                        });
                                                        list += 'formId":"' + oneToManyParam.formId + '"';
                                                        //list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                                                        list += "}"
                                                        //setTabulatorRowData(JSON.parse(list));
                                                        dataArray.push(JSON.parse(list));
                                                    } else {
                                                        //angular.forEach(item, function (itemData, key) {
                                                        //console.log(itemData)
                                                        if (item.hasOwnProperty('name')) {
                                                            list += '' + item.name + '":"' + item.value + '","';
                                                            list += 'RowID-' + item.name + '":"' + item.value + '","';
                                                        } else {
                                                            list += '' + key + '":"' + item + '","';
                                                            list += 'RowID-' + key + '":"' + item + '","';
                                                        }
                                                    }
                                                    //});                            

                                                });

                                            });

                                        }
                                        $scope.formDetailsDataTemp = angular.copy(dataArray);
                                        tempTabulatorList[oneToManyParam.tabularId].setData(dataArray);
                                    }
                                    console.log(tempTabulatorData);
                                } else {
                                    var dataArray = [];
                                    var oneToManyTempData = [];
                                    if (!DataService.isEmpty(tempTabulatorData)) {
                                        angular.forEach(tempTabulatorData, function (item) {
                                            if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                                var tempData = JSON.parse(item.formfieldDataListTemp)
                                                if (!DataService.isEmpty(tempData)) {
                                                    if (tempData.length > 1) {
                                                        //tempData.push({
                                                        //    "name": "AutoId", "value": item.AutoId,
                                                        //    "name": "formGroupKey", "value": item.formGroupKey
                                                        //});
                                                        _.map(tempData, function (tempitem) {
                                                            return _.extend(tempitem, {
                                                                "AutoId": item.AutoId
                                                            });
                                                        });
                                                        oneToManyTempData = tempData;
                                                        //oneToManyTempData.push(tempData);
                                                    } else if (tempData.length == 1) {
                                                        tempData[0].AutoId = item.AutoId;
                                                        tempData[0].formGroupKey = item.formGroupKey;
                                                        dataArray.push(tempData[0]);
                                                    }
                                                }
                                            }
                                        });
                                        if (!DataService.isEmpty(oneToManyTempData)) {

                                            angular.forEach(oneToManyTempData, function (filterData) {
                                                //var filterData = oneToManyTempData;

                                                var list = '';
                                                list += '{"';

                                                angular.forEach(filterData, function (item, key) {
                                                    // item = JSON.parse(item);

                                                    //angular.forEach(item, function (itemData, key) {
                                                    //console.log(itemData)
                                                    if (!DataService.isEmpty(item.name)) {
                                                        list += '' + item.name + '":"' + item.value + '","';
                                                        list += 'RowID-' + item.name + '":"' + item.value + '","';
                                                    } else {
                                                        list += '' + key + '":"' + item + '","';
                                                        list += 'RowID-' + key + '":"' + item + '","';
                                                    }
                                                    //});                            

                                                });
                                                list += 'formId":"' + oneToManyParam.formId + '"';
                                                //list += 'formId":"' + temp.formId + '","Id":"' + (!DataService.isEmpty(temp.Id) ? temp.Id : 0) + '"';
                                                list += "}"
                                                //setTabulatorRowData(JSON.parse(list));
                                                dataArray.push(JSON.parse(list));
                                            });

                                        }
                                        $scope.formDetailsDataTemp = angular.copy(dataArray);
                                        tempTabulatorList[oneToManyParam.tabularId].setData(dataArray);
                                    }
                                    console.log(tempTabulatorData);
                                }
                            }
                        }
                        else if (oneToManyParam.action == 5 && $stateParams.popup == 3) {
                            var tempParam = response.data;
                            if (tempParam.length > 0) {
                                var tempData = JSON.parse(tempParam[0].formfieldDataListTemp);
                                $scope.formDataInfo = tempParam[0];

                                var timeampm = $scope.formDataInfo.created_at.substring($scope.formDataInfo.created_at.length - 2, $scope.formDataInfo.created_at.length)
                                var datetime = $scope.formDataInfo.created_at.substring(0, $scope.formDataInfo.created_at.length - 2)
                                $scope.formDataInfo.created_at = datetime + " " + timeampm;
                                if (DataService.isEmpty($scope.formDataInfo.updated_at))
                                    $scope.formDataInfo.updated_at = $scope.formDataInfo.created_at;
                                $scope.formDataList = tempData;
                            }
                            $scope.bindUpdateControlsNew();
                        }
                        else if (oneToManyParam.action == 1 && $stateParams.popup == 2) {
                            //var exists = tempTabulatorData[0];
                            notifierService.notifyMessage('success', 'FormEntry', response.data[0].Message);
                        }
                        else if (oneToManyParam.action == 2) {
                            //var exists = tempTabulatorData[0];
                            //notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                        }
                        else if (oneToManyParam.action == 3) {
                            var exists = tempTabulatorData[0];
                            var temp = {};
                            // temp = $scope.formDetailsDataTemp;
                            temp = $scope.formDataTabulatorTempWithoutGroupBy;
                            angular.forEach(window["AutoIdList"], function (item) {
                                //temp = _.findWhere($scope.formDetailsDataTemp, { AutoId: item })
                                var idx = _.findIndex(temp, { Id: item });
                                if (angular.isDefined(temp))
                                    temp.splice(idx, 1);
                            });
                            $timeout(function () {
                                if (DataService.isEmpty(temp))
                                    temp = [];

                                tempTabulatorList[param.tabularId].setData(temp);
                            }, 150);

                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                        }
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (oneToManyParam.action != 4)
                            if (!DataService.isEmpty(param.tabularId))
                                setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);
                        //var formDataTemp = response.data;
                        //var exists = _.findWhere($scope.formDetailsDataTemp, { name: param.tabularId });
                        //exists.data = formDataTemp;
                        //var formDataFields = [];
                        //_.each(formDataTemp, function (pagesData, key) {
                        //    formDataFields.push({ key });
                        //});
                        //$timeout(function () {
                        //    tabulator.setData(exists.data);
                        //}, 150);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.editRowWiseOneToMany = function (param, type) {
            if (type == 5) {
                param.action = 5;
                if (!DataService.isEmpty(param.formGroupKey))
                    if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    else
                        param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 2) {
                param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        console.log(response.data)
                        var tempData = response.data;
                        if (newParam.action == 5) {

                            $scope.editRowTempData = tempData;
                            if (!DataService.isEmpty(tempData))
                                tempData = tempData[0];
                            $scope.editRowTempData = tempData;
                            var formfieldDataListTemp = tempData.formfieldDataListTemp;
                            if (!DataService.isEmpty(formfieldDataListTemp)) {
                                var formfieldDataListTemp1 = JSON.parse(formfieldDataListTemp);
                                var col = newParam.columnName.replace('RowID-', '');
                                _.each(formfieldDataListTemp1, function (item, key) {
                                    _.each(item, function (itemData, keyData) {
                                        if (!DataService.isEmpty(itemData.name)) {
                                            if (itemData.name == col || itemData.name == newParam.columnName) {
                                                itemData.value = newParam.columnValue;
                                            }
                                        }
                                        else {
                                            if (itemData == col || itemData == newParam.columnName) {
                                                item["value"] = newParam.columnValue;
                                            } else if (!DataService.isEmpty(itemData)) {
                                                if (itemData == col) {
                                                    item[keyData] = newParam.columnValue;
                                                }
                                            }
                                        }
                                    });
                                });
                                $scope.editRowTempData.formfieldDataListTemp = JSON.stringify(formfieldDataListTemp1);
                                $scope.editRowTempData.action = 2;
                                $scope.editRowWiseOneToMany($scope.editRowTempData, 2);
                                //var temp = _.filter(formfieldDataListTemp, function (item, key) {
                                //    return item[newParam.columnName] == newParam.columnName;
                                //});
                            }
                        }
                        else if (newParam.action == 2) {
                            var exists = tempData[0];
                            notifierService.notifyMessage('success', 'FormEntry Updated', exists.Message);

                        }
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        function setTabulatorRowData(list) {
            angular.forEach(list, function (item, key) {
                $("#formGeneratorTabulatortabulator-1512043722039").find(".tabulator-cell[tabulator-field='RowID-" + key + "']").val(item);
            });
        }

        function createTableandColumn(fieldData, pageKey) {
            var Display_Only = (typeof fieldData.Display_Only !== 'undefined' && fieldData.Display_Only !== 'No') ? 'disabled' : '';
            var width = (typeof fieldData.width !== 'undefined') ? fieldData.width + 'px' : '100%';
            var $table = $("<table>", { 'class': fieldData.className, 'name': fieldData.name, 'style': 'border-collapse: collapse; border-style: solid;width: ' + width, 'border': fieldData.border });
            var $thead = $("<thead>");
            $table.append($thead);
            // columns
            var tableHeads = '', multipleHeads;
            if (fieldData.columnHeadings && fieldData.columnHeadings.trim() !== '') {
                var headings = fieldData.columnHeadings.trim();
                var headArray = headings.split('|');
            } else {
                var headArray = [];
            }
            multipleHeads = checkForMultipleHeaders(headArray);
            var columnRows = (multipleHeads > 0) ? 2 : 1;
            var resultstring, tableColumns = (multipleHeads > 0) ? 0 : parseInt(fieldData.columns);
            for (var i = 0; i < columnRows; i++) {
                resultstring = '';
                resultstring += '<tr>';
                for (var j = 0; j < fieldData.columns; j++) {
                    if (multipleHeads > 0 && i === 1) {
                        // second row of column
                        tableHeads = getSubHeading(headArray[j]);
                        if (tableHeads['multiple']) {
                            tableHeads['subheadings'].forEach(function (subheading) {
                                resultstring += '<th>' + subheading + '</th>';
                            });
                            tableColumns += tableHeads['subheadings'].length;
                        }
                    } else {
                        // first row of column
                        if (headArray.length > 0 && headArray[j]) {
                            tableHeads = getSubHeading(headArray[j]);
                            if (!tableHeads['multiple']) {
                                if (multipleHeads > 0) {
                                    resultstring += '<th rowspan="2">' + tableHeads['heading'] + '</th>';
                                    tableColumns++;
                                }
                                else {
                                    resultstring += '<th>' + tableHeads['heading'] + '</th>';
                                }
                            } else {
                                resultstring += '<th colspan="' + tableHeads['subheadings'].length + '">' + tableHeads['heading'] + '</th>';
                            }
                        }
                    }
                }
                resultstring += '</tr>';
                $thead.append(resultstring);
            }

            // rows
            var $tbody = $("<tbody>");
            $table.append($tbody);
            var numRows = parseInt(fieldData.rows);
            if (fieldData.rowHeadings && fieldData.rowHeadings.trim() !== '') {
                var headings = fieldData.rowHeadings.trim();
                var rowHeadArray = headings.split('|');
            } else {
                var rowHeadArray = [];
            }
            for (var i = 0; i < numRows; i++) {
                // columns
                resultstring = '';
                resultstring += '<tr>';
                for (var j = 0; j < tableColumns; j++) {
                    if (j === 0 && rowHeadArray.length > 0 && rowHeadArray[i]) {
                        resultstring += '<td>' + rowHeadArray[i].trim() + '</td>';
                    } else {
                        if (typeof headArray[j] !== 'undefined') {
                            tableHeads = getSubHeading(headArray[j]);
                            if (tableHeads['multiple']) {
                                for (var k = 1; k <= tableHeads['subheadings'].length; k++) {
                                    $scope.addListOutPutControls(fieldData.columnInputs, j + 1, i, fieldData.worksheet, fieldData.name);
                                    var field = generateColumnFieldCustom(fieldData.columnInputs, j + 1, fieldData.name, '', i, Display_Only, fieldData.worksheet, '', true, pageKey);
                                    resultstring += '<td>' + field.result + '</td>';
                                }
                            } else {
                                var field = generateColumnFieldCustom(fieldData.columnInputs, j + 1, fieldData.name, '', i, Display_Only, fieldData.worksheet, '', false, pageKey);
                                $scope.addListOutPutControls(fieldData.columnInputs, j + 1, i, fieldData.worksheet, fieldData.name);
                                var widthClass = (Math.round((field.width * 12) / 100));
                                var putClassCol = (widthClass != '0' || widthClass !== 'undefined') ? "col-sm-" + widthClass : "";
                                resultstring += '<td class="' + putClassCol + '">' + field.result + '</td>';
                                //                            resultstring += '<td>' + field.result + '</td>';
                            }
                        }
                    }
                }
                resultstring += '</tr>';
                $tbody.append(resultstring);
            }
            return '<div class="table-responsive">' + $table[0].outerHTML + '</div>';
        };

        $scope.onEntryFormSubmit = function (formFields) {
            if (!DataService.isEmpty(selectedRecordOneToMany) && selectedRecordOneToMany.length > 0) {
                $scope.listOfReferrenceFields = [];
                angular.forEach($scope.formFields, function (pageData, key) {
                    var temp = _.filter(pageData, function (item) {
                        return !DataService.isEmpty(item.update_operation);
                    });
                    if (!DataService.isEmpty(temp)) {
                        temp[0].Id = selectedRecordOneToMany[0].Id;
                        temp[0].formID = selectedRecordOneToMany[0].formID;
                        temp[0].MasterFormRow = selectedRecordOneToMany[0].Id;
                        temp[0].MasterFormID = selectedRecordOneToMany[0].formID;
                        temp[0].formGroupKey = selectedRecordOneToMany[0].formGroupKey;
                        temp[0].oldValue = selectedRecordOneToMany[0][temp[0].Update_Form_Field];
                        $scope.listOfReferrenceFields.push(temp[0]);
                        //selectedRecordOneToMany
                    }
                });
            } else {

            }
            //console.log("listOfReferrenceFields" + $scope.listOfReferrenceFields);

            modifyFormData();

        }

        function modifyFormData() {
            $rootScope.$emit("ShowLoading");
            if ($scope.myForm.$invalid) return false;
            var temp = $("#customFormNew").serializeArray();
            //console.log(temp, 'temp');
            var frm = $('#customFormNew').find(":input:not(:hidden)").serialize();

            // console.log(temp);
            var param = {};
            if (!$scope.isEdit) {
                param.action = 1;
                param.formGroupKey = $scope.freshEntryformGroupKey;
                if ($scope.isSaveEvent) {
                    if (!DataService.isEmpty($stateParams.formGroupKey)) {
                        param.formGroupKey = $stateParams.formGroupKey;
                    } else {
                        param.formGroupKey = $scope.freshEntryformGroupKey;
                    }
                    if (!DataService.isEmpty($scope.formGroupKey))
                        param.formGroupKey = $scope.formGroupKey;
                    temp.push({ "formGroupKey": param.formGroupKey, "name": "formGroupKey", "value": param.formGroupKey });
                }
                else {
                    temp.push({ "formGroupKey": $scope.freshEntryformGroupKey, "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
                }
            }
            else {
                param.action = 2;
                param.formGroupKey = $scope.formGroupKey;

                param.Id = $scope.rowId;
                temp.push({ "formGroupKey": $scope.formGroupKey, "name": "formGroupKey", "value": $scope.formGroupKey });
            }
            if (!DataService.isEmpty($stateParams.parentFormId)) {
                // $scope.eventId = $stateParams.eventId;
                //$scope.parentFormId = $stateParams.parentFormId;          
                $scope.parentFormListControls = [];
                _.each($scope.formFields, function (pageControlList) {
                    var exists = _.where(pageControlList, { Referral_Forms: $stateParams.parentFormId });
                    if (!DataService.isEmpty(exists) && exists.length > 0) {
                        _.each(exists, function (item) {
                            $scope.parentFormListControls.push(item);
                        });
                    }
                });

                if ($scope.defaultSelected) {
                    if (localStorage.getItem("formGroupKey" + $stateParams.parentFormId) != null) {
                        var formgroup = localStorage.getItem("formGroupKey" + $stateParams.parentFormId);
                        var index = _.findIndex(temp, { formGroupKey: param.formGroupKey });
                        temp[index].formGroupKey = formgroup;
                        param.formGroupKey = formgroup;
                    }
                }

            }

            var isDropdownCalenderControl = "";
            var referrrenceFormGroupKey = "";
            var listOfHidden = $("input[type='hidden']");
            _.each(listOfHidden, function (item) {
                if (item.id.contains('isDropdownCalender')) {
                    isDropdownCalenderControl = item.value;
                }
            });
            if (isDropdownCalenderControl != "") {
                var exists = _.findWhere(temp, {
                    name: "isDropdownCalender_" + isDropdownCalenderControl
                });
                if (!DataService.isEmpty(exists)) {
                    temp.push({
                        name: isDropdownCalenderControl, value: $("#" + isDropdownCalenderControl).val()
                    });
                }
            }

            var checkboxGroup = [];
            var namecheckbox = "";
            var removeIndexGroup = [];
            var groupByData = _.groupBy(temp, "name");
            var newList = [];
            var counter = 0;
            angular.forEach(groupByData, function (item, key) {
                //console.log(item)
                //console.log(key)
                if (item.length == 1) {
                    if (key.contains("[]") && item[0].value == "") {
                    } else {
                        newList.push({ "name": key, "value": item[0].value });
                    }
                    //if (item[0].name.includes("map")) {

                    //    var items = localStorage.getItem("mapData");
                    //    item[0].value = items;
                    //    newList.push({ "name": key, "value": item[0].value });
                    //} else {
                    //    newList.push({ "name": key, "value": item[0].value });
                    //}
                }
                else if (item.length > 1) {
                    var tmp = _.map(item, function (t) { return t.value }).join(',');
                    newList.push({ "name": key, "value": tmp });
                }
                var controlExists = _.findWhere($scope.parentFormListControls, { name: key });
                if (!DataService.isEmpty(controlExists)) {
                    if (!DataService.isEmpty($scope.eventId)) {
                        newList[counter].value = $scope.eventId;
                    }
                }
                counter++;
            });




            // console.log(newList)
            //_.each(temp, function (item, index) {
            //    if (angular.isDefined(item)) {
            //        if (item.name.includes("map")) {
            //            var items = localStorage.getItem("mapData");
            //            item.value = items;
            //        }
            //        else if (item.name.includes("checkboxGroup")) {
            //            namecheckbox = item.name;
            //            checkboxGroup.push(item.value);
            //            removeIndexGroup.push(index);
            //        }

            //        //item.value = escape(item.value);
            //    }
            //});
            //var tempData = [];
            //if (removeIndexGroup.length > 1) {
            //    angular.forEach(temp, function (item, index) {
            //        if (angular.isDefined(item))
            //            if (namecheckbox != item.name)
            //                tempData.push(item);
            //    });
            //    temp = tempData;
            //}
            //if (namecheckbox != "" && removeIndexGroup.length > 1)
            //    temp.splice(removeIndexGroup[0], 0, { name: namecheckbox, value: checkboxGroup.toString() });




            var allDayExists = _.findWhere(newList, { name: "allDay" });
            if (!DataService.isEmpty(allDayExists)) {
                if (allDayExists.value == "true") {
                    var startIndex = _.findIndex(newList, { name: "start" });
                    var endIndex = _.findIndex(newList, { name: "end" });

                    var startCustom = moment(newList[startIndex].value).format("YYYY-MM-DD");
                    startCustom = moment(startCustom + " 00:00:00 ");
                    var endCustom = moment(newList[startIndex].value).format("YYYY-MM-DD");
                    let initialdate = endCustom;
                    let start_time = '23:59:59';
                    endCustom = moment(initialdate + " " + start_time);
                    newList[startIndex].value = startCustom.format();
                    newList[endIndex].value = endCustom.format();
                }
            }

            param.formfieldDataListTemp = JSON.stringify(newList);
            if ($scope.listOfReferrenceFields.length > 0) {
                param.formReferrenceFieldsList = JSON.stringify($scope.listOfReferrenceFields);
                param.MasterFormId = $scope.listOfReferrenceFields[0].MasterFormID;
                param.MasterFormRow = $scope.listOfReferrenceFields[0].MasterFormRow;
            }

            if (angular.isDefined($scope.importFormSettings.recordAccessSecurity)) {
                if (!DataService.isEmpty($scope.importFormSettings.recordAccessSecurity.max_one_record_per_user))
                    param.IsMaxOneRecordPerUser = $scope.importFormSettings.recordAccessSecurity.max_one_record_per_user;
                else
                    param.IsMaxOneRecordPerUser = false;
            }

            param.formId = $scope.importFormSettings.formId;
            param.topicId = $scope.importFormSettings.topicId;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.importFormSettings.created_by;
            param.updated_at = $scope.importFormSettings.updated_at;
            param.currentFormType = $scope.importFormSettings.currentFormType;
            param.name = $scope.userDetail.name;
            if (param.action == 2) {
                param.userId = $scope.formDataInfo.userID;
                param.created_by = $scope.formDataInfo.created_by;
                param.updated_at = $scope.formDataInfo.updated_at;
            }
            if ($stateParams.popup == 2) {
                //var exists = localStorage.getItem("tabulatorOnetomany-" + param.formId);
                //if (angular.isDefined(exists) && exists != null && exists != "") {
                //    var temp = JSON.stringify(param);
                //    temp.push(param);
                //    localStorage.setItem("tabulatorOnetomany-" + param.formId, JSON.stringify(temp));
                //} else {
                //    localStorage.setItem("tabulatorOnetomany-" + param.formId, JSON.stringify(param));
                //}      
                GeneratedFormData(param);

                var tempData = JSON.parse(param.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';
                angular.forEach(tempData, function (item) {
                    if (item.constructor == Object) {

                        list += '' + item.name + '":"' + item.value + '","';
                        list += 'RowID-' + item.name + '":"' + item.value + '","';

                    }
                });
                list = list.substring(0, list.length - 2);
                list += "}"
                dataArray.push(JSON.parse(list));
                param.formfieldDataListTemp = JSON.stringify(dataArray);
                // $scope.GetTabOneToManyDynamimc(param, param.action);




                //notifierService.notifyMessage('success', 'FormEntry', 'Data Saved');

                //$timeout(function () {
                //    $("#customFormNew")[0].reset();
                //    //$scope.freshEntryformGroupKey = create_UUID();
                //    $("#formGroupKey").val($scope.freshEntryformGroupKey);
                //}, 500);
            }
            else if ($stateParams.popup == 3) {
                param.action = 2;
                var tempData = JSON.parse(param.formfieldDataListTemp);
                var dataArray = [];
                var list = '';
                list += '{"';
                angular.forEach(tempData, function (item) {
                    if (item.constructor == Object) {

                        list += '' + item.name + '":"' + item.value + '","';
                        list += 'RowID-' + item.name + '":"' + item.value + '","';

                    }
                });
                list = list.substring(0, list.length - 2);
                list += "}"
                dataArray.push(JSON.parse(list));
                param.formfieldDataListTemp = JSON.stringify(dataArray);
                $scope.GetTabOneToManyDynamimc(param, param.action);
                //notifierService.notifyMessage('success', 'FormEntry', 'Data Updated');
            }
            else {
                //if (!DataService.isEmpty($scope.eventId)) {
                //    alert('save edit event')
                //    $rootScope.$emit("HideLoading");
                //    return false;
                //}
                GeneratedFormData(param);
            }
            //param.FormFieldListTemp = formFields;

            //mainService.manageFormData("FormData", param)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            if (!DataService.isEmpty(response.data.Message)) {
            //                var exists = response.data;
            //                if (exists.res == 1) {
            //                    notifierService.notifyMessage('success', 'FormEntry', exists.Message);
            //                    $("#customFormNew")[0].reset();
            //                    $scope.freshEntryformGroupKey = create_UUID();
            //                    $("#formGroupKey").val($scope.freshEntryformGroupKey);
            //                    $state.reload();
            //                } else {
            //                    notifierService.notifyMessage('error', 'FormEntry', exists.Message);
            //                    $("#customFormNew")[0].reset();
            //                    $scope.freshEntryformGroupKey = create_UUID();
            //                    $("#formGroupKey").val($scope.freshEntryformGroupKey)
            //                }
            //                if (angular.isDefined(tabulator))
            //                    tabulator.clearData();
            //                //console.log(response.data[0]);

            //                //console.log(formData);                     
            //            }
            //        }
            //    }, function (err) {
            //        console.log("some error occured." + err);
            //    });
            // alert('hi')
        }

        $scope.insertNewRecordQueue = function () {
            $timeout(function () {
                // $scope.refreshButtonFunc();
                window.location.reload();
            }, 300);
        };

        function GeneratedFormData(dataParam) {
            //console.log('check if PP control + add redirect URL on success submit')
            $rootScope.$emit("ShowLoading");
            //if (!DataService.isEmpty(dataParam.updated_at)) {
            //    dataParam.updated_at = new Date(dataParam.updated_at);
            //}
            //console.log(dataParam,'dataParam');
            //return false;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {

                                /* 
             whatsapp notification sms func by SR078
             */
                                var Wparam = {};
                                if ($scope.isEdit == false) {
                                    Wparam.crudNotify = 1;
                                }
                                else {
                                    Wparam.crudNotify = 2;
                                }
                                Wparam.link = mainService.getBaseUrl() + "#/form/records/" + $scope.importFormSettings.formId;//$scope.importFormSettings.formRecordUrl;
                                Wparam.userID = $scope.userDetail.Id;
                                Wparam.formId = $scope.importFormSettings.formId;
                                Wparam.action = 1;
                                Wparam.record_id = response.data.Id;
                                //console.log(Wparam,'Wparam');
                                mainService.manageCRUDWhatsAppN("ManageCRUDWhatsAppN", Wparam)
                                    .then(function (responseW) {
                                        var data = responseW.data;
                                        console.log(responseW.data, 'responseW.data;');
                                        if (data != null && angular.isDefined(data)) {
                                            console.log('success');

                                        }
                                    });

                                $scope.currentDateTime = new Date();
                                $timeout(function () {
                                    if ($stateParams.popup == 1) {
                                        $scope.freshEntryformGroupKey = create_UUID();
                                        $("#formGroupKey").val($scope.freshEntryformGroupKey);
                                        localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                        if ($scope.importFormSettings.currentFormType == 2) {
                                            if (!$scope.isEdit) {
                                                $scope.refreshButtonFunc();
                                                $timeout(function () {
                                                    var dialog = $ngBootbox.customDialog({
                                                        templateUrl: 'autogenerateModelUp.html',
                                                        scope: $scope,
                                                        title: 'Ticket Number',
                                                        size: "large"
                                                        //  buttons: $scope.customDialogButtons
                                                    });
                                                    $timeout(function () {
                                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                                        Waves.attach('.flat-buttons', ['waves-button']);
                                                        Waves.init();
                                                    }, 250);
                                                }, 600);
                                                $timeout(function () {

                                                }, 300);
                                            }
                                        }
                                        if ($scope.isEdit) {
                                            $timeout(function () {
                                                window.history.back();
                                            }, 1050);
                                        }
                                    }
                                    else if (angular.isUndefined($stateParams.popup)) {
                                        $scope.freshEntryformGroupKey = create_UUID();
                                        $("#formGroupKey").val($scope.freshEntryformGroupKey);
                                        localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                        if ($scope.importFormSettings.currentFormType == 2) {
                                            if (!$scope.isEdit) {
                                                $scope.refreshButtonFunc();
                                                $timeout(function () {
                                                    var dialog = $ngBootbox.customDialog({
                                                        templateUrl: 'autogenerateModelUp.html',
                                                        scope: $scope,
                                                        title: 'Ticket Number',
                                                        size: "large"
                                                        //  buttons: $scope.customDialogButtons
                                                    });
                                                    $timeout(function () {
                                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                                        Waves.attach('.flat-buttons', ['waves-button']);
                                                        Waves.init();
                                                    }, 250);
                                                }, 500);
                                            }
                                        }
                                    }
                                    if ($scope.entryForOneToMany) {
                                        //var existsData = localStorage.getItem("formOneData")
                                        //var temp = _.findWhere($scope.formDetailsDataTemp, { reference_form: exists.formId.toString() })
                                        //if (!DataService.isEmpty(existsData)) {
                                        //    var newData = [];
                                        //    newData = JSON.parse(existsData);
                                        //    newData.push(temp.data);
                                        //    var newexists = JSON.stringify(newData);
                                        //    localStorage.setItem("formOneData", newexists);
                                        //}
                                        //else {
                                        //    var newData = [];
                                        //    newData.push(temp.data);
                                        //    var newexists = JSON.stringify(newData);
                                        //    localStorage.setItem("formOneData", newexists);
                                        //}
                                    }
                                    $("#customFormNew")[0].reset();
                                    $timeout(function () {
                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                        Waves.attach('.flat-buttons', ['waves-button']);
                                        Waves.init();
                                    }, 250);
                                }, 1000);







                                //var qrString = $location.search();

                                //console.log(qrString);
                                //if (angular.isDefined(qrString.isAnonymous)) {
                                //    localStorage.removeItem('detail');
                                //    $state.go("login", { reload: true, inherit: false });
                                //}
                                //else
                                if ($scope.importFormSettings.currentFormType != 2 && $scope.PPControl == true) {
                                    //go to paypal URL
                                    // $scope.amt = $scope.amount;
                                    var checkcontrol = Object.values($scope.formFields)[0].filter(x => x.type == "PayPal");

                                    if (!DataService.isEmpty(checkcontrol)) {
                                        if (checkcontrol.length > 0) {
                                            var refControl = checkcontrol[0].customAmountReferenceControlId;
                                            $rootScope.customControl = checkcontrol[0];
                                            if (checkcontrol[0].customAmount == "Yes") {
                                                var formDataTemp = $("#customFormNew").serializeArray();
                                                if (!DataService.isEmpty(refControl)) {
                                                    var exists = _.findWhere(formDataTemp, { "name": refControl });
                                                    if (!DataService.isEmpty(exists)) {
                                                        if (exists.value != "0")
                                                            $scope.amount = exists.value;
                                                        $rootScope.amount = $scope.amount;

                                                    }
                                                }
                                            }
                                        }
                                    }

                                    $scope.rec_id = response.data.Id;
                                    console.log(response.data.Id)
                                    if (!$scope.isEdit) {
                                        $timeout(function () {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'payment.html',
                                                scope: $scope,
                                                title: 'Payment',
                                                size: "large"
                                                //  buttons: $scope.customDialogButtons
                                            });
                                        }, 200);
                                    }
                                    else {

                                        if (!DataService.isEmpty($scope.formDataInfo.PaymentStatus) && $scope.formDataInfo.PaymentStatus == "1") {

                                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                                            $timeout(function () {
                                                location.reload();
                                            }, 1000);
                                        }
                                        else {
                                            $scope.rec_id = response.data.Id;
                                            $timeout(function () {
                                                var dialog = $ngBootbox.customDialog({
                                                    templateUrl: 'payment.html',
                                                    scope: $scope,
                                                    title: 'Payment',
                                                    size: "large"
                                                    //  buttons: $scope.customDialogButtons
                                                });
                                            }, 200);
                                        }

                                    }

                                    // console.log('sona 23 nov', response.data.Id);

                                    // return false;
                                    // $state.go('application');

                                }
                                else if ($scope.importFormSettings.currentFormType != 2 && $scope.PPControl == false) {
                                    //notifierService.notifySweetAlertMessage('success', 'FormEntry', exists.Message);
                                    notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                                    /*update calender referrence*/

                                    if (!DataService.isEmpty($scope.customForms)) {
                                        var calenderRefParam = {};
                                        calenderRefParam.customForms = $scope.customForms;
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        if (calenderRefParam.customForms.contains(',')) {
                                            var listFormTemp = [];
                                            var listFormTempIds = [];
                                            var listForm = calenderRefParam.customForms.split(',');
                                            _.each(listForm, function (item) {
                                                listFormTemp.push(item.trim());
                                            });

                                            var listFormIds = calenderRefParam.customFormIds.split(',');
                                            _.each(listFormIds, function (item) {
                                                listFormTempIds.push(item.trim());
                                            });
                                            if (!DataService.isEmpty(dataParam.formfieldDataListTemp)) {
                                                var formDataJsonParse = JSON.parse(dataParam.formfieldDataListTemp);
                                                _.each(listFormTemp, function (item, key) {
                                                    var existsResources = _.findWhere(formDataJsonParse, { "name": "resources_" + item });
                                                    if (!DataService.isEmpty(existsResources)) {
                                                        listFormTempIds[key] = existsResources.value.trim();
                                                    }
                                                    var existsActivities = _.findWhere(formDataJsonParse, { "name": "activities_" + item });
                                                    if (!DataService.isEmpty(existsActivities)) {
                                                        listFormTempIds[key] = existsActivities.value.trim();
                                                    }
                                                });
                                                $scope.customFormIds = listFormTempIds.join(',');
                                                calenderRefParam.customForms = listFormTemp.join(',');
                                                //$stateParams.customFormIds = $scope.customFormIds;
                                                //console.log(formDataJsonParse)
                                            }
                                        }
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        if ($scope.isEdit == true)
                                            calenderRefParam.action = 6;
                                        else
                                            calenderRefParam.action = 11;
                                        calenderRefParam.formId = $scope.importFormSettings.formId;
                                        calenderRefParam.formGroupKey = exists.formGroupKey;
                                        $scope.updateCalenderReferrence(calenderRefParam)
                                    }
                                    else {
                                        if ($scope.isSaveEvent) {
                                            window.close();
                                        }
                                    }
                                    if (!DataService.isEmpty(localStorage.getItem("newWindow"))) {
                                        window.close();
                                    }


                                }
                            }
                            else {
                                if (exists.res == -1) {
                                    swal({
                                        //title: "Are you sure to refresh this page?",
                                        title: exists.Message,
                                        //text: exists.Message,
                                        type: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, Refresh it!'
                                    }).then((result) => {
                                        if (result.value) {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    notifierService.notifyMessage('error', 'FormEntry', exists.Message);
                                    $("#customFormNew")[0].reset();
                                    $scope.freshEntryformGroupKey = create_UUID();
                                    $("#formGroupKey").val($scope.freshEntryformGroupKey)
                                    localStorage.setItem("formGroupKey" + dataParam.formId, $scope.freshEntryformGroupKey);
                                }

                            }
                            //if (angular.isDefined(tabulator))
                            // tabulator.clearData();
                            //console.log(response.data[0]);

                            //console.log(formData);                     
                        }


                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        //payment click 
        $scope.proceedtoPay = function (formid, rec_id, amt, pid, pcurrency) {
            //console.log($scope.userDetails,'$scope.userDetails')
            //return false;
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.action = 9;

            param.Id = rec_id;
            param.userId = $scope.userDetails.Id;
            param.amount = amt;
            param.PAYPAL_ID = pid;
            param.currency = pcurrency;
            param.formId = formid;
            $timeout(function () {

                var formData = new FormData();
                formData.append("USER", "madhvendra009_api2.gmail.com");
                formData.append("PWD", "79WCDCBJE5YUE26R");
                formData.append("SIGNATURE", "AFcWxV21C7fd0v3bYYYRCpSSRl31AoZmYBDy.dNhd4Sa2J7R1LUHAP4N");
                formData.append("VERSION", "123.0");
                formData.append("PAYMENTREQUEST_0_PAYMENTACTION", "Sale");
                formData.append("PAYMENTREQUEST_0_AMT", amt);
                formData.append("PAYMENTINFO_0_CURRENCYCODE", pcurrency)
                formData.append("RETURNURL", "http://localhost:50892/#/form/records/" + formid);//url
                formData.append("CANCELURL", "http://localhost:50892/#/orderHistory");
                formData.append("METHOD", "SetExpressCheckOut");
                //param.METHOD = "GetExpressCheckoutDetails";
                $rootScope.$emit("ShowLoading");

                if (parseFloat(param.amount) != 0) {
                    $state.go("ppPaymentProcess", { "formid": formid, "recId": param.Id }, { reload: true, inherit: false });

                    //$scope.updatePaymentDetails(param);
                }
                else {
                    $rootScope.$emit("HideLoading");
                    notifierService.notifyMessage('success', 'Payment', 'no amount to pay');
                    //location.reload();
                }




            }, 150);
            //swal({
            //    title: "are you sure ? you want to choose this plan?",
            //    text: "Existing Plan will be changed after Successful Process.",
            //    type: 'warning',
            //    showCancelButton: true,
            //    confirmButtonColor: '#3085d6',
            //    cancelButtonColor: '#d33',
            //    confirmButtonText: 'Proceed Now'
            //}).then((result) => {
            //    if (result.value) 
            //    {

            //    }
            // });
        };

        //end of payment click
        $scope.selectedTabFilterCalender = function (selectedId) {
            $('#page-tabs li').removeClass('ui-tabs-active ui-state-active');
            $("#tab-" + selectedId).addClass('ui-tabs-active ui-state-active');
        }

        $scope.selectedTabFilter = function (filterValue, selectedId) {
            $scope.displayInTabData = _.findWhere($scope.allReferrenceData.formDataHeaders, { "Display_tab": true });
            var filterData = angular.copy($scope.formDataTabulatorTempWithoutGroupBy);
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
            //    window["popupTabulator"].setData(bindTRowsData(filterGroupByData));
            //}
            //else {
            //    window["popupTabulator"].setData(bindTRowsData(groupBy));
            //}

            var temp = [];
            var filterDataNew = _.filter(filterData, function (item, key) {
                var filterNest = _.filter(item, function (itemNest, keyNest) {
                    // if (angular.isDefined(itemNest) && $scope.displayInTabData.field == keyNest)
                    itemNest = (!DataService.isEmpty(itemNest)) ? itemNest : "";
                    return itemNest.toString() == filterValue.value;
                });
                if (!DataService.isEmpty(filterNest))
                    temp.push(item)
            });
            window["popupTabulator"].setData(temp);
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
                dataArray.push(JSON.parse(list));
            });



            return dataArray;
        }

        $('#tabulatorModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var form_id = button.attr('data-referral-form-id');
            var modal = $(this);
            var $formIdField = button.attr('data-referral-form-field-id');

            //var lastFormId = $formIdField.val();
            // one to many form control
            if (button.attr('data-one-to-many')) {
                $(this).find("input[name='modal-one-to-many']").val("1");
                $(this).find("input[name='tabulator-id']").val(button.attr('data-tabulator'));
                $(this).find("input[name='modal-field-map']").val(button.attr('data-field-map'));
            }


            if (!DataService.isEmpty(form_id)) {
                $timeout(function () {
                    var param = {};
                    param.action = 2;
                    param.formId = form_id;
                    param.fieldName = $formIdField;
                    mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                        .then(function (response) {
                            console.log(response);
                            $scope.allReferrenceData = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
                            //$scope.tabList.unshift({
                            //    "label": "All", "value": "All","isDefault":true
                            //});
                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                            $timeout(function () {
                                if (!DataService.isEmpty($scope.formDataTabulatorTempWithoutGroupBy))
                                    if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                        $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");

                                var temp = bindTColumnHeader($scope.allReferrenceData.formDataHeaders);
                                temp.unshift(
                                    {
                                        title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                                            cell.getRow().toggleSelect();
                                        }
                                    }
                                )

                                window["popupTabulator"].setColumns(temp);

                                $scope.selectedTabFilter($scope.tabList[0], 0);
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
            //modal.find('.modal-body').block({ message: '<img src="' + loader + '" />', css: { position: 'relative', width: '100%' } });
            //if(form_id != lastFormId){
            //$.getJSON("dddddd/create-form-tabulator-tabs/" + form_id, function (data) {
            //    var hideColumn = "";
            //    if (modal.find('#tabs').tabs("instance")) {
            //        modal.find('#tabs').tabs("destroy");
            //    }

            //    //if (data.template !== "") {
            //    //    hideColumn = data.column;
            //    //    $.each(data.fields, function (key, value) {
            //    //        $("#form-table").tabulator("removeFilter", hideColumn, '=', value);
            //    //    });

            //    //    modal.find('#tabs')
            //    //        .html(data.template)
            //    //        .tabs({
            //    //            create: function (event, ui) {
            //    //                $("#form-table").tabulator("addFilter", hideColumn, '=', ui.tab.data('value'));
            //    //            },
            //    //            activate: function (event, ui) {
            //    //                //$("#form-table").tabulator("setData","{{ url('formDataList') }}/" + form_id);
            //    //                $("#form-table").tabulator("removeFilter", hideColumn, '=', ui.oldTab.data('value'));
            //    //                $("#form-table").tabulator("addFilter", hideColumn, '=', ui.newTab.data('value'));
            //    //            }
            //    //        });
            //    //}
            //});
            //$.getJSON("dddd/create-form-tabulator/" + form_id, function (data) {
            //    //modal.find('.modal-body').unblock();
            //    modal.find('.modal-title').text(data.formTitle);
            //    //$("#form-table").tabulator("setHeight", "450px");

            //    $.each(data.formDataHeaders, function (index, column) {
            //        if (data.formDataHeaders[index]['columnType'] === 'file') {
            //            data.formDataHeaders[index]['formatter'] = imageFormatter;
            //        }
            //    });
            //    $("#form-table").tabulator("setColumns", data.formDataHeaders) //overwrite existing columns with new columns definition array
            //    //$("#form-table").tabulator("hideColumn", hideColumn);
            //    //$("#form-table").tabulator("setData", "tempURLlink/form-generator/public/formDataList/" + form_id + "/popup");
            //    $formIdField.val(form_id);
            //    // Set filters
            //    var userRole = data.userRole, recordFilters = data.recordFilters;
            //    //if (userRole == 0) {
            //    //    $.each(recordFilters, function (key, value) {
            //    //        if (typeof (value['filter-type']) !== 'undefined') {
            //    //            if (value['filter-type'] !== '' && value['value'] !== '') {
            //    //                //console.log(key, value);
            //    //                if (value['filter-type'] == "between") {
            //    //                    $("#form-records").tabulator("addFilter", betweenFilter, [key, value['value'], value['second']]);
            //    //                } else if (value['filter-type'] == "between_today_and_date" || value['filter-type'] == "between_date_and_today") {
            //    //                    $("#form-records").tabulator("addFilter", betweenDateFilter, [key, value['filter-type'], "<?php echo date('Y-m-d'); ?>", value['value']]);
            //    //                } else {
            //    //                    $("#form-records").tabulator("addFilter", key, value['filter-type'], value['value']);
            //    //                }
            //    //            } else if (value['filter-type'] == "before_today" || value['filter-type'] == "after_today") {
            //    //                $("#form-records").tabulator("addFilter", todayFilter, [key, value['filter-type'], "<?php echo date('Y-m-d'); ?>"]);
            //    //            }
            //    //        } else {
            //    //            $("#form-records").tabulator("addFilter", radioFilter, [key, value]);
            //    //        }
            //    //    });
            //    //}
            //});
            //}else{
            //$("#form-table").tabulator("setData","{{ url('formDataList') }}/" + form_id);
            //}
            //modal.find('.modal-body input').val(recipient)
        });

        function bindTColumnHeader(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                // angular.forEach(pageData, function (item, key) {
                /// var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                    || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                    if (type == "file") {
                        if (type == "file" && item.multipleFiles == true) {
                            finalArray.push({
                                title: item.title, formatter: multilFiles, headerSort: false, align: "center", field: item.field, align: "left", cellClick: function (e, cell) {

                                    getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                }
                            });
                        }
                        else {
                            finalArray.push({
                                title: item.title, formatter: arrowImage, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left", headerFilter: "input"
                            });
                        }
                    }
                    else {
                        if (DataService.isEmpty(item.Display_tab))
                            finalArray.push({ title: item.title, bottomCalc: showFooter(item), field: item.field, align: "left", headerFilter: "input" });
                        else {

                            $scope.displayInTabData = item;

                        }
                    }
                }
                //});                
            });
            finalArray.unshift({ title: "formId", visible: false });
            finalArray.unshift({ title: "Id", visible: false });
            finalArray.unshift({ title: "formGroupKey", visible: false });
            return finalArray;
        }
        $scope.setInformationLink = function () {

            var InfoFormId = $scope.importFormSettings.informationFormID;
            var isAllowShow = $scope.importFormSettings.InformationOnly;
            var baseurl = mainService.getBaseUrl();
            var link = "";
            if (angular.isDefined(InfoFormId)) {
                link = baseurl + "/#/form/show/" + InfoFormId.toString();
            }
            else
                link = "#";

            $scope.InformationLink.url = link;
            if (angular.isDefined(isAllowShow) && !DataService.isEmpty(isAllowShow)) {
                $scope.InformationLink.isAllow = isAllowShow.toString();
            }

            console.log('dsdsd' + $scope.InformationLink.url);

        };
        $scope.gotoInformationPage = function () {
            var url = $scope.InformationLink.url;
            var setPreviousPage = window.location.href;
            CookiesPersistenceService.setCookieData("informationBackLink", setPreviousPage);
            var param = {};
            param.action = 4;
            param.formId = $scope.importFormSettings.informationFormID;

            if (!DataService.isEmpty(param.formId) && param.formId != "0" && param.formId != 0) {
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
                        console.log(data);
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
                $rootScope.$emit("HideLoading");
            }






        };

        $scope.updateCalenderReferrence = function (param) {
            var oneToManyParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            oneToManyParam.created_by = $scope.userDetail.Id;
            oneToManyParam.update_by = $scope.userDetail.Id;
            mainService.manageCalenderReferrenceNew("ManageCalenderReferrenceNew", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $timeout(function () {
                            location.reload();
                            window.close();
                        }, 1000);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.init();

    });

    FormGeneratorApp.controller('NewDemoCalenderRecordsControllerTemp', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        var tabulatorChildren = {};
        //var tabulator = '';
        var arrowImage = function (cell, formatterParams) {

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
        var multilFiles = function (cell, formatterParams) {
            var temp = !DataService.isEmpty(cell.getValue()) ? cell.getValue() : "";
            var images = [];
            images = temp.split(',');
            if (images.length > 1)
                return '<button type="button" class="btn btn-xs btn-default" data-toggle="modal" data-target="#galleryModal"  title="Show all files" data-formGroupKey="' + cell.getData().formGroupKey + '"> Show all files</button> ';
            else
                return arrowImage(cell, formatterParams);
        };
        $scope.init = function () {

            $scope.IS_EXIST_PRE_DEFINED_ACTIVITIES = false;
            showLoader();
            $scope.global = $rootScope;
            $scope.filterPopupPlaceHolder = {};
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
            $scope.selectedAxis = {};
            $scope.resultBasket = [];
            $scope.is2D = false;
            $scope.isShowAdvance = false;
            window["formGroupKeyList"] = null;

            bootbox.hideAll();
            //debugger;
            var formId = $stateParams.formId;
            $scope.id = $stateParams.formId;
            $scope.currentFormId = $stateParams.formId;
            $scope.userDetail = mainService.loginDetails();
            window["EventBasicDetail"] = $scope.manageWindowParams();
            $scope.checkIfToggle();
            $scope.getFormDetails();
            $scope.importFormSettings = { language: 1 };
            $scope.getLanguage();
            //Deisy 06102020  
            $scope.ApplyMultilingualText();
            //$timeout(function () {

            //}, 200);

            $timeout(function () {
                //$scope.bindDraggable(0, 0); 
                showLoader();
            }, 800);

            // $scope.toggle();

            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            $scope.formDataTabulatorTemp = {};
            $scope.totalSelectListTagify = [];
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.calenderSettingsFormDetailsDataList = [];
            $scope.xaxisFormList = [];
            $scope.yaxisFormList = [];
            $scope.Xdraggables = {};
            $scope.uiConfig = {};
            //$scope.changeTo="";
            var formId = $stateParams.formId;
            $scope.id = $stateParams.formId;
            $scope.getCalenderSettingsFormDetailsData(formId);
            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            $scope.BaseUrl = mainService.getBaseUrl();
            $scope.EndPointUrl = mainService.getCurrentEndPointUrl();
            /*Temp list of Event for Filter*/
            $scope.eventListTemp = [];
            /*Selected Tree CheckBoxes to filter Events*/
            $scope.selectedTreeList = [];
            $scope.listTabulator = [];
            $scope.basicViewCalenderDataTemp = {};

            /*Check Default X_Yselection*/
            $scope.isDefaultXYSelection = true;

            $timeout(function () {
                if ($("#form-table").length) {
                    window["popupTabulator"] = initTabulator("form-table", {
                        selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                    });
                }
            }, 450);

            $scope.tabuListLink = {};
            $scope.tabuListLink.searchTextData = "";
            $scope.isFilterApply = false;

            $scope.isCourseForm = false;
            $scope.courseFormId = 0;
            $scope.bindDatepicker();
            $scope.selectEventDetails = {};
            $scope.isYSelectionSelected = false;
            $scope.createEventDetails = {};
        };

        $scope.GenerateEventQR = function (eventId) {
            $.ajax({
                url: "/Calendar/GenerateEventQR",
                type: "Get",
                data: {
                    eventId: eventId
                },
                success: function (response) {
                    debugger;
                    if (response != null) {
                        if (response.Status) {
                            $("#GeneratedQRCodeModal img").attr("src", response.Data.QRImageURL.replace("~", ".."));
                            $("#GeneratedQRCodeModal #btn-print-qr").attr("href", response.Data.QRImageURL.replace("~", ".."));
                            $("#customEventDetailsModelPopUp").modal("hide");
                            $("#GeneratedQRCodeModal").modal("show");
                        } else {
                            alert("Failed to generate QR Code");
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }
            })

        }

        $scope.ScanStudentQR = function () {
            debugger;
            $scope.selectEventDetails;

            const scanner = new Html5QrcodeScanner("qr-scanner", {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 20,
            });
            scanner.render(success, error);

            $("#customEventDetailsModelPopUp").modal("hide");
            $("#html5-qrcode-button-camera-permission").addClass("btn btn-primary");
            $("#html5-qrcode-anchor-scan-type-change").addClass("btn btn-danger");
            $("#html5-qrcode-anchor-scan-type-change").empty();
            $("#html5-qrcode-anchor-scan-type-change").append(`Upload image to scan`);
            setTimeout(function () {
                $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
            }, 1000);

            $("#html5-qrcode-button-camera-start").on("click", function () {
                setTimeout(function () {
                    $("#html5-qrcode-button-camera-stop").addClass("btn btn-danger");
                }, 500);
            })

            $("#html5-qrcode-button-camera-stop").on("click", function () {
                setTimeout(function () {
                    $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
                }, 500);
            })

            $('#WebCamModal').on('hidden.bs.modal', function () {
                scanner.clear();
            });

            function success(result) {

                if (result.includes("Public/MarkPresentByCompany")) {
                    $.ajax({
                        url: result,
                        type: "get",
                        data: {
                            EventId: $scope.selectEventDetails.Id
                        },
                        success: function (response) {
                            if (response.Status) {
                                swal({
                                    icon: "success",
                                    title: "Success",
                                    text: "Attendance marked!"
                                });
                            } else {
                                swal({
                                    icon: "error",
                                    title: "Error",
                                    text: response.Message
                                });
                            }
                        },
                        error: function (err) {
                            alert("Request not allowed");
                        }
                    })

                    $("#html5-qrcode-button-camera-stop").trigger("click");

                }

            }

            function error(err) {

            }

            $("#WebCamModal").modal("show");

        }

        $scope.validateForm = function (_fileInput, isrequired = false, isEvent = false) {
            var fileInput = document.getElementById(_fileInput);
            var fileError = document.getElementById((isEvent ? "fileError2" : "fileError"));
            var EventUploadBtn = $((isEvent ? "#EventUploadBtn2" : "#EventUploadBtn"));
            var allowedExtensions = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            var maxSize = 5 * 1024 * 1024; // 5MB
            if (fileInput.files.length === 0 && isrequired) {
                fileError.textContent = 'Please select a file.';
                EventUploadBtn.attr("disabled", "disabled");
                EventUploadBtn.addClass("disabled");
                return false;
            }

            for (var i = 0; i < fileInput.files.length; i++) {
                if (!allowedExtensions.includes(fileInput.files[i].type)) {
                    fileError.textContent = 'Invalid file type. Allowed types are: image, PDF, Word document, Excel.';
                    EventUploadBtn.attr("disabled", "disabled");
                    EventUploadBtn.addClass("disabled");
                    return false;
                }

                var fileSize = fileInput.files[i].size; // in bytes


                if (fileSize > maxSize) {
                    fileError.textContent = 'File size exceeds the maximum limit of 5MB.';
                    return;
                }
            }

            EventUploadBtn.removeAttr("disabled");
            EventUploadBtn.removeClass("disabled");
            fileError.textContent = '';
            return true;
        }


        $scope.uploadFiles = function (isEvent = false) {

            let inputfileName = isEvent ? "SELECT_DOWNLOADABLE_ATTACHMENT" : "DOWNLOADABLE_ATTACHMENT";

            var fileInput = $('#' + inputfileName)[0].files;




            if ($scope.validateForm(inputfileName, true, isEvent)) {
                var formData = new FormData();
                $.each(fileInput, function (key, value) {
                    formData.append('files', value);
                });

                // You can add additional form fields here if needed
                formData.append('clrcode', localStorage.getItem("CALENDAR_CODE"));
                if (isEvent) {
                    formData.append('eventid', $scope.selectEventDetails.Id);
                } else {
                    formData.append('eventid', '');
                }


                // AJAX post request
                $.ajax({
                    url: BASE_URL + 'UserAdmin/UploadDownloadAttachment',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.Status) {
                            notifierService.notifyMessage('success', 'Calender', 'File Uploaded Successfully');
                            if (!isEvent) {
                                $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES = response.Data;
                                $rootScope.safeApply();
                                let filepaths = response.Data.map(x => x.path).join(",");
                                $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT = filepaths;
                                $scope.createEventDetails.DOWNLOAD_FILE_LIST = JSON.stringify(response.Data);
                            } else {

                                $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES = response.Data;
                                $rootScope.safeApply();
                                let filepaths = response.Data.map(x => x.path).join(",");
                                $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT = filepaths;
                                $scope.selectEventDetails.DOWNLOAD_FILE_LIST = JSON.stringify(response.Data);
                            }



                            $('#' + inputfileName).val(null);
                            var EventUploadBtn = $('#EventUploadBtn,#EventUploadBtn2');
                            EventUploadBtn.attr("disabled", "disabled");
                            EventUploadBtn.addClass("disabled");
                        } else {
                            alert(response.Message);
                        }
                        // Handle successful upload
                    },
                    error: function (xhr, status, error) {
                        console.error('Upload failed: ' + error);
                        // Handle upload failure
                    }
                });
            }
        }

        function uploadfilesDelete(filePath, eventid = '', downloadable_attachment = '', download_file_list = '') {
            var formData = new FormData();
            formData.append("filePath", filePath);
            formData.append("eventid", eventid);
            formData.append("downloadable_attachment", downloadable_attachment);
            formData.append("download_file_list", download_file_list);

            $.ajax({
                url: BASE_URL + 'UserAdmin/DeleteEventUploadFiles',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.Status) {
                        $(".calendar").fullCalendar('refetchEvents');
                        notifierService.notifyMessage('success', 'Calender', 'File Deleted Successfully');
                    } else {
                        alert(response.Message);
                    }
                    // Handle successful upload
                },
                error: function (xhr, status, error) {
                    console.error('delete failed: ' + error);
                    // Handle upload failure
                }
            });

        }


        $scope.calendarOtherFieldChange = function (ele) {
            let eventId = $scope.selectEventDetails.Id;
            let value = $(ele).val();

            var formData = new FormData();
            formData.append("field", $(ele).data("field"));
            formData.append("value", value);
            formData.append("eventid", eventId);
            updateOtherFields(formData);
        }

        function updateOtherFields(formData) {

            $.ajax({
                url: BASE_URL + 'UserAdmin/UpdateEventOtherField',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.Status) {
                        $(".calendar").fullCalendar('refetchEvents');
                        notifierService.notifyMessage('success', 'Calender', 'Update Successfully');
                    } else {
                        alert(response.Message);
                    }
                    // Handle successful upload
                },
                error: function (xhr, status, error) {
                    console.error('delete failed: ' + error);
                    // Handle upload failure
                }
            });

        }


        $scope.changeUploadFileType = function (isEvent) {
            if (isEvent) {
                let DOWNLOADABLE_ATTACHMENT_FILES = $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES;
                let eventId = $scope.selectEventDetails.Id;
                let DOWNLOAD_FILE_LIST = JSON.stringify(DOWNLOADABLE_ATTACHMENT_FILES);
                $scope.selectEventDetails.DOWNLOAD_FILE_LIST = DOWNLOAD_FILE_LIST;
                var formData = new FormData();
                formData.append("field", "DOWNLOAD_FILE_LIST");
                formData.append("value", DOWNLOAD_FILE_LIST);
                formData.append("eventid", eventId);
                updateOtherFields(formData);
            } else {
                let DOWNLOADABLE_ATTACHMENT_FILES = $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES;
                let DOWNLOAD_FILE_LIST = JSON.stringify(DOWNLOADABLE_ATTACHMENT_FILES);
                $scope.createEventDetails.DOWNLOAD_FILE_LIST = DOWNLOAD_FILE_LIST;
            }
        }


        $scope.removeFiles = function (index) {

            if (!confirm("Are you sure delete this file?")) {
                return;
            }
            if ($scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.length > index) {
                let filepath = $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES[index].path;
                $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.splice(index, 1);
                $scope.createEventDetails.DOWNLOAD_FILE_LIST = JSON.stringify($scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES);
                $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT = $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.map(x => x.path).join(",");
                uploadfilesDelete(filepath);
            }
        }

        $scope.selectedEventRemoveFiles = function (index) {

            if (!confirm("Are you sure delete this file?")) {
                return;
            }
            if ($scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.length > index) {
                let filepath = $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES[index].path;
                $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.splice(index, 1);
                $scope.selectEventDetails.DOWNLOAD_FILE_LIST = JSON.stringify($scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES);
                $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT = $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES.map(x => x.path).join(",");
                let eventId = $scope.selectEventDetails.Id;
                uploadfilesDelete(filepath, eventId, $scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT, JSON.stringify($scope.selectEventDetails.DOWNLOADABLE_ATTACHMENT_FILES));
            }
        }


        $scope.changeStartEndTime = function (type, isEvent = false) {

            if (!isEvent) {
                if ('start') {
                    $scope.createEventDetails.startTime = $('#createEventDetails_startTime').val();
                    $scope.createEventDetails.startTimeFormat = moment($scope.createEventDetails.startTime, "HH:mm").format("hh:mm A");
                    $scope.createEventDetails.start = moment($scope.createEventDetails.start, 'YYYY/MM/DD HH:mm').format("YYYY/MM/DD " + $scope.createEventDetails.startTime);
                }
                if ('end') {
                    $scope.createEventDetails.endTime = $('#createEventDetails_endTime').val();
                    $scope.createEventDetails.endTimeFormat = moment($scope.createEventDetails.endTime, "HH:mm").format("hh:mm A");
                    $scope.createEventDetails.end = moment($scope.createEventDetails.end, 'YYYY/MM/DD HH:mm').format("YYYY/MM/DD " + $scope.createEventDetails.endTime);
                }
                $scope.validateStartandTime();
                $scope.rootScopeSafe();
            }
            else {
                if ('start') {
                    $scope.selectEventDetails.startTime = $('#selectEventDetails_startTime').val();
                    $scope.selectEventDetails.startTimeFormat = moment($scope.selectEventDetails.startTime, "HH:mm").format("hh:mm A");
                    $scope.selectEventDetails.start = moment($scope.selectEventDetails.start, 'YYYY/MM/DD HH:mm').format("YYYY/MM/DD " + $scope.selectEventDetails.startTime);
                }
                if ('end') {
                    $scope.selectEventDetails.endTime = $('#selectEventDetails_endTime').val();
                    $scope.selectEventDetails.endTimeFormat = moment($scope.selectEventDetails.endTime, "HH:mm").format("hh:mm A");
                    $scope.selectEventDetails.end = moment($scope.selectEventDetails.end, 'YYYY/MM/DD HH:mm').format("YYYY/MM/DD " + $scope.selectEventDetails.endTime);
                }
                $scope.validateStartandTime(true);
                $scope.rootScopeSafe();
            }
        }

        $scope.validateStartandTime = function (isEvent) {
            if (!isEvent) {
                var date1 = moment($scope.createEventDetails.start, 'YYYY/MM/DD HH:mm');
                var date2 = moment($scope.createEventDetails.end, 'YYYY/MM/DD HH:mm');

                // Comparing the dates
                if (date1.isBefore(date2)) {
                    $scope.timeerrmsg = '';
                    return true;
                    //console.log("start is before end");
                } else if (date1.isAfter(date2)) {
                    $scope.timeerrmsg = "start time is after end time";
                    return false;
                } else {
                    $scope.timeerrmsg = "start time is equal to end time";
                    return false;
                }
            } else {

                var date1 = moment($scope.selectEventDetails.start, 'YYYY/MM/DD HH:mm');
                var date2 = moment($scope.selectEventDetails.end, 'YYYY/MM/DD HH:mm');

                // Comparing the dates
                if (date1.isBefore(date2)) {
                    $scope.timeerrmsg = '';
                    return true;
                    //console.log("start is before end");
                } else if (date1.isAfter(date2)) {
                    $scope.timeerrmsg = "start time is after end time";
                    return false;
                } else {
                    $scope.timeerrmsg = "start time is equal to end time";
                    return false;
                }
            }

        }

        $scope.UpdateEventTime = function () {
            if ($scope.validateStartandTime(true)) {
                let start = moment($scope.selectEventDetails.start, "YYYY/MM/DD HH:mm").format("YYYY-MM-DDTHH:mm:ss");
                let end = moment($scope.selectEventDetails.end, "YYYY/MM/DD HH:mm").format("YYYY-MM-DDTHH:mm:ss");
                let data = { eventId: $scope.selectEventDetails.Id, data: [{ "field": "start", value: start }, { "field": "end", value: end }] };

                $.ajax({
                    method: 'POST',
                    url: BASE_URL + "UserAdmin/UpdateEventFieldsData",
                    dataType: 'json',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (response) {
                        $("#customEventDetailsModelPopUp").modal("hide");
                        if (response.Status) {
                            $(".calendar").fullCalendar('refetchEvents');
                            notifierService.notifyMessage('success', 'Calender', "Update Successfully");
                        } else {
                            notifierService.notifyMessage('error', 'Calender', response.Message);
                        }
                    },
                    beforeSend: function () {
                        showLoader();
                    },
                    complete: function () {
                        var _ScrollOffset = window["scrollOffset"];
                        window.scrollTo(0, _ScrollOffset);
                        $.unblockUI();
                    }
                });

            }
        }


        function GeneratedFormData(dataParam) {
            $scope.customForms = [];
            $scope.customFormIds = [];
            var temp = [];
            var param = {};
            param.action = 1;
            param.formGroupKey = $scope.freshEntryformGroupKey;
            temp.push({ "formGroupKey": $scope.freshEntryformGroupKey, "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
            temp.push({ "name": "start", "value": dataParam.start });
            temp.push({ "name": "end", "value": dataParam.end });
            if (!DataService.isEmpty(dataParam.description))
                // temp.push({ "name": "description", "value": "" });
                temp.push({ "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
            temp.push({ "name": "resources", "value": dataParam.resourceId.id });
            $scope.customFormIds.push(dataParam.resourceId.id)

            temp.push({ "name": "resources_" + dataParam.resourceFormId + "", "value": dataParam.resourceId.id });
            $scope.customForms.push(dataParam.resourceFormId)
            temp.push({ "name": "allDay", "value": "false" });
            $scope.isSelectedDropdown = false;;
            if (dataParam.dropdownList.length > 0) {
                _.each(dataParam.dropdownList, function (item) {
                    if (!DataService.isEmpty(item.selectionDropdown) && item.selectionDropdown != "0") {
                        temp.push({ "name": "activities_" + item.formId + "", "value": item.selectionDropdown });
                        $scope.isSelectedDropdown = true;
                        $scope.customForms.push(item.formId)
                        $scope.customFormIds.push(item.selectionDropdown)
                    }
                });
                if ($scope.customForms.length > 1) {
                    temp.push({ "name": "activities", "value": $scope.customFormIds[1] });
                    param.ActivityFormId = $scope.customForms[1];
                }
            }
            if (!$scope.isSelectedDropdown) {
                notifierService.notifyMessage('error', 'FormEntry', 'Select atleast one Activity dropdown.');
                return 0;
            }
            $scope.customForms = $scope.customForms.join(',');
            if (!DataService.isEmpty($scope.totalSelectListTagify)) {
                _.each($scope.totalSelectListTagify, function (item, key) {
                    var list = [];
                    _.each($scope.createEventDetails[item.name].tagify.value, function (itemTag) {
                        list.push('"' + itemTag.value + '"');
                    });
                    param.fieldDataText = "[" + list.join(',') + "]";
                    temp.push({ "name": item.name, "value": param.fieldDataText });
                });
            }
            temp.push({ "name": "description", "value": $scope.createEventDetails.description });

            /*Company Code and Calendar Code add */

            temp.push({ "name": "COMPANY_CODE", "value": localStorage.getItem("COMPANY_CODE") });
            temp.push({ "name": "CALENDAR_CODE", "value": localStorage.getItem("CALENDAR_CODE") });
            temp.push({ "name": "DOWNLOADABLE_ATTACHMENT", "value": $scope.createEventDetails.DOWNLOADABLE_ATTACHMENT });
            temp.push({ "name": "IS_UPLOAD_REQUIRED", "value": $scope.createEventDetails.IS_UPLOAD_REQUIRED });
            temp.push({ "name": "UPLOAD_TIME", "value": $scope.createEventDetails.UPLOAD_TIME });
            temp.push({ "name": "DOWNLOAD_FILE_LIST", "value": $scope.createEventDetails.DOWNLOAD_FILE_LIST });


            param.formfieldDataListTemp = JSON.stringify(temp);
            if (angular.isDefined($scope.formDetailsDataInfo.recordAccessSecurity)) {
                if (!DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.max_one_record_per_user))
                    param.IsMaxOneRecordPerUser = $scope.formDetailsDataInfo.recordAccessSecurity.max_one_record_per_user;
                else
                    param.IsMaxOneRecordPerUser = false;
            }
            param.formId = $scope.formDetailsDataInfo.formId;
            param.topicId = $scope.formDetailsDataInfo.topicId;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.formDetailsDataInfo.created_by;
            param.updated_at = $scope.formDetailsDataInfo.updated_at;
            param.currentFormType = $scope.formDetailsDataInfo.currentFormType;
            param.resourceFormId = $scope.ySelection;
            param.name = $scope.userDetail.name;
            $rootScope.$emit("ShowLoading");
            mainService.manageGeneratedFormData("GeneratedFormData", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {






                                var Wparam = {};
                                if ($scope.isEdit == false) {
                                    Wparam.crudNotify = 1;
                                }
                                else {
                                    Wparam.crudNotify = 2;
                                }
                                Wparam.link = mainService.getBaseUrl() + "#/form/records/" + $scope.formDetailsDataInfo.formId;
                                Wparam.userID = $scope.userDetail.Id;
                                Wparam.formId = $scope.formDetailsDataInfo.formId;
                                Wparam.action = 1;
                                Wparam.record_id = response.data.Id;
                                //mainService.manageCRUDWhatsAppN("ManageCRUDWhatsAppN", Wparam)
                                //    .then(function (responseW) {
                                //        var data = responseW.data;
                                //        console.log(responseW.data, 'responseW.data;');
                                //        if (data != null && angular.isDefined(data)) {
                                //            console.log('success');
                                //        }
                                //    });
                                $scope.currentDateTime = new Date();
                                if ($scope.formDetailsDataInfo.currentFormType != 2) {

                                    notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                                    /*update calender referrence*/
                                    if (!DataService.isEmpty($scope.customForms)) {
                                        var calenderRefParam = {};
                                        calenderRefParam.customForms = $scope.customForms;
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        if (calenderRefParam.customForms.contains(',')) {
                                            var listFormTemp = [];
                                            var listFormTempIds = [];
                                            var listForm = calenderRefParam.customForms.split(',');
                                            _.each(listForm, function (item) {
                                                listFormTemp.push(item.trim());
                                            });

                                            if (!DataService.isEmpty(param.formfieldDataListTemp)) {
                                                var formDataJsonParse = JSON.parse(param.formfieldDataListTemp);
                                                _.each(listFormTemp, function (item, key) {
                                                    var existsResources = _.findWhere(formDataJsonParse, { "name": "resources_" + item });
                                                    if (!DataService.isEmpty(existsResources)) {
                                                        listFormTempIds[key] = existsResources.value.trim();
                                                    }
                                                    var existsActivities = _.findWhere(formDataJsonParse, { "name": "activities_" + item });
                                                    if (!DataService.isEmpty(existsActivities)) {
                                                        listFormTempIds[key] = existsActivities.value.trim();
                                                    }
                                                });
                                                $scope.customFormIds = listFormTempIds.join(',');
                                                calenderRefParam.customForms = listFormTemp.join(',');

                                            }
                                        }
                                        calenderRefParam.customFormIds = $scope.customFormIds;
                                        calenderRefParam.action = 11;
                                        calenderRefParam.formId = $scope.formDetailsDataInfo.formId;
                                        calenderRefParam.formGroupKey = exists.formGroupKey;
                                        var eventBasicData = window["EventBasicDetail"];
                                        var CalendarEventList = window["CalendarEventList"];
                                        refreshEventResourcesActivityNew('deleteEvent', [], eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                                        $scope.updateCalenderReferrence(calenderRefParam).then(function (response) {

                                            if ($scope.formDetailsDataInfo.otherformid != 0 && $scope.otherformSelectionDropdown && $scope.otherformSelectionDropdown != "") {

                                                var formID = $scope.formDetailsDataInfo.otherformid;
                                                var selectedRows = $scope.OtherFormDrpDwnList.filter(x => x.Id == $scope.otherformSelectionDropdown);
                                                ////console.log(selectedRows);
                                                var existsCourse = {};
                                                var fees_1 = 0;
                                                if (selectedRows.length > 0) {
                                                    var selectedData = selectedRows;
                                                    if ($scope.isCourseForm == true && $scope.courseFormId != 0) {
                                                        var existsCourse1 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.courseFormId });
                                                        if (!DataService.isEmpty(existsCourse1)) {
                                                            var feesExists = _.findWhere(existsCourse1.formDataList, { id: temp.find(x => x.name == "activities_" + $scope.courseFormId)?.value });
                                                            if (!DataService.isEmpty(feesExists))
                                                                fees_1 = feesExists.fees_1;
                                                        }
                                                    }

                                                    var recordArr = [];
                                                    selectedData.forEach(function (data) {
                                                        var record = data;
                                                        // record['Id'] = data.Id;
                                                        record['Id'] = data.Id;
                                                        if (fees_1 != 0) {
                                                            record[$scope.courseFormId + "_FeesId"] = temp.find(x => x.name == "activities_" + $scope.courseFormId)?.value;
                                                            record[$scope.courseFormId + "_Fees_1"] = fees_1;
                                                        }
                                                        record[data.formID + "_RowId"] = data.Id;
                                                        record[$scope.formDetailsDataInfo.formId + "_RowId"] = exists.Id;
                                                        record['formGroupKey'] = null;
                                                        record['formId'] = data.formID;
                                                        record['userID'] = data.userID;
                                                        record['AutoId'] = data.AutoID;
                                                        record['created_at'] = formatTime();
                                                        record['updated_at'] = formatTime();
                                                        record['edit_row'] = "<i class='fa fa-pencil fa-lg';></i>";
                                                        //record['edit_row'] = "<img src='" + ASSET_URL + "assets/images/pencil.png' width='15'>";
                                                        recordArr.push(record);
                                                    });
                                                    //savePopUpRecords(recordArr);
                                                    var recordArrTemp = recordArr[0];
                                                    var param = {};
                                                    param = recordArrTemp;
                                                    param.formfieldDataListTemp = JSON.stringify(recordArr);
                                                    param.action = 1;
                                                    param.formId = $scope.listTabulator[0].reference_form;
                                                    param.formGroupKey = exists.formGroupKey;
                                                    $scope.formGroupKey = param.formGroupKey = exists.formGroupKey;
                                                    $scope.manageCalenderReferrenceControl(param);
                                                }
                                            }

                                        });
                                    }
                                }
                            }
                            else {
                                swal({
                                    icon: "error",
                                    title: "Error",
                                    text: exists.Message
                                });
                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
            // $rootScope.$emit("HideLoading");
        }

        $scope.updateCalenderReferrence = function (param) {
            var oneToManyParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            oneToManyParam.created_by = $scope.userDetail.Id;
            oneToManyParam.update_by = $scope.userDetail.Id;
            return mainService.manageCalenderReferrenceNew("ManageCalenderReferrenceNew", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $timeout(function () {
                            //location.reload();
                            //window.close();
                            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                            if ($scope.otherformSelectionDropdown && $scope.otherformSelectionDropdown != "") {

                            } else {
                                $('div .calendar').fullCalendar('refetchEvents');
                            }

                            //notifierService.notifyMessage('success', 'Calender', 'Event created Successfully');
                            $("#createCustomEventDetailsModelPopUp").modal("hide");

                        }, 500);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.createNewEvent = function () {
            //debugger;
            //console.log($scope.createEventDetails);
            if ($scope.currentUserFormRole == 0 || $scope.currentUserFormRole == 1) {
                swal({
                    title: 'Add / Edit Access',
                    text: "User can't access it",
                    type: 'error'
                });
                return false;
            }
            console.log($scope.createEventDetails);
            if ($scope.validateStartandTime()) {
                GeneratedFormData($scope.createEventDetails);
            } else {
                $scope.rootScopeSafe();
            }
        };

        $scope.createNewEventWithoutPredefinedActivity = function () {
            if (DataService.isEmpty($scope.createEventDetails.activityTitle)) {
                alert('Please enter activity name');
                return;
            }
            var activityForm = $scope.allFormsList.find(x => x.formTag?.toLowerCase().contains("#course"));
            //debugger;

            var param = {};
            param.action = 1;
            param.IsMaxOneRecordPerUser = false;
            param.formGroupKey = create_UUID();
            param.formId = activityForm.formId;
            param.userId = $scope.userDetail.Id;
            param.created_by = $scope.formDetailsDataInfo.created_by;
            param.updated_at = $scope.formDetailsDataInfo.updated_at;
            param.currentFormType = activityForm.currentFormType;
            param.name = $scope.userDetail.name;
            var temp = [];
            temp.push({ "name": "ACTIVITY_NAME", "value": $scope.createEventDetails.activityTitle });
            temp.push({ "name": "COMPANY_CODE", "value": localStorage.getItem("COMPANY_CODE") });
            temp.push({ "name": "CALENDAR_CODE", "value": localStorage.getItem("CALENDAR_CODE") });
            param.formfieldDataListTemp = JSON.stringify(temp);
            $rootScope.$emit("ShowLoading");
            adminService.postAsync("Calendar/AddServiceMaster", param).then(function (res) {

                var result = res.data;
                if (result.res != 0) {

                    //_.each(dataParam.dropdownList, function (item) {
                    //    if (!DataService.isEmpty(item.selectionDropdown) && item.selectionDropdown != "0") {
                    //        temp.push({ "name": "activities_" + item.formId + "", "value": item.selectionDropdown });
                    //        $scope.isSelectedDropdown = true;
                    //        $scope.customForms.push(item.formId)
                    //        $scope.customFormIds.push(item.selectionDropdown)
                    //    }
                    var index = $scope.createEventDetails.dropdownList.findIndex(x => x.formId == activityForm.formId);

                    if (index != -1) {
                        $scope.createEventDetails.dropdownList[index].selectionDropdown = result.Id.toString();
                    }
                    _.each($scope.createEventDetails.dropdownList, function (item, i) {
                        if (i != index) {
                            item.selectionDropdown = "";
                        }
                    })
                    GeneratedFormData($scope.createEventDetails);

                } else {
                    alert(result.Message);
                }
            });
        };
        $scope.bindDatepicker = function () {
            $("#datecontrol").datetimepicker({
                "format": 'yyyy-mm-dd',
                "assumeNearbyYear": true,
                "autoclose": true,
                "todayBtn": true,
                'showTimepicker': false,
                "todayHighlight": true,
                "minView": 2,
                "viewMode": 'days',
                "pickerPosition": 'bottom-left'
            }).on('changeDate', function (e) {
                var value = $("#datecontrol").data("datetimepicker").getDate();
                $scope.setvalue = $("#datecontrol").data("datetimepicker").getDate();
                $scope.formDetailsDataInfo.searchByDate = moment($scope.setvalue, "YYYY-MM-DD").format("YYYY-MM-DD");


            });
        }
        var finalArray = [];
        var popupTabulator = {};
        var tabulator = {};
        $scope.clickonTree = function (formId, key) {
            alert(formId)
        };
        function generateUniqueNumber() {
            return (new Date).getTime() + Math.floor(Math.random() * 899999 + 100000);
        };
        var out = [];
        $scope.getCalenderSettingsFormDetailsData = function (formId) {
            var param = {};
            param.action = 4;
            param.formId = formId;
            param.IsCustomFilter = true;
            var cusTomFilter = [];
            cusTomFilter.push({ "FieldName": "COMPANY_CODE", "Value": localStorage.getItem("COMPANY_CODE") });
            cusTomFilter.push({ "FieldName": "CALENDAR_CODE", "Value": localStorage.getItem("CALENDAR_CODE") });
            param.CustomFilters = cusTomFilter;
            $rootScope.$emit("ShowLoading");
            mainService.getCalenderSettingsFormData("getCalenderSettingsFormData", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.calenderSettingsFormDetailsDataList = response.data;
                        //loadcssjsfile("Content/sidebar/js/sidebar-script.js", "js", "sidebarform");
                        $scope.multiDcalendar = false;
                        if (response.data.length <= 2) {
                            $scope.multiDcalendar = false;
                            // console.log($scope.multiDcalendar,'1D data ');
                        }
                        else {
                            $scope.multiDcalendar = true;
                            // console.log($scope.multiDcalendar,'ND data ');
                        }
                        // $scope.xaxisFormList = angular.copy($scope.calenderSettingsFormDetailsDataList);
                        loadLeftSideMenu(param);
                        // $rootScope.$emit("HideLoading");
                    }


                    //else {
                    //$timeout(function(){
                    //console.log('actived')
                    //    console.log( $scope.calenderSettingsFormDetailsDataList);
                    //    },850);
                    //}

                    // $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };
        function manageSelectedTree(data, type) {
            //delete for 2
            if (type == 2) {
                if (data.node.parent == "#") {
                    var item = _.findWhere($scope.selectedTreeList, { parent: data.node.id });
                    if (!DataService.isEmpty(item)) {
                        var indx = _.indexOf($scope.selectedTreeList, item);
                        if (indx != -1) {
                            $scope.selectedTreeList.splice(indx, 1);
                        }
                    }
                }
                else {
                    var item = _.findWhere($scope.selectedTreeList, { id: data.node.id });
                    if (!DataService.isEmpty(item)) {
                        var indx = _.indexOf($scope.selectedTreeList, item);
                        if (indx != -1) {
                            $scope.selectedTreeList.splice(indx, 1);
                        }
                    }
                }
            } else {
                data.node.groupById = data.node.id;
                var exists = _.filter($scope.selectedTreeList, function (item) {
                    return item.original.formId == data.node.original.formId;
                });
                if (exists.length > 0 && $scope.selectedTreeList.length > 0) {
                    $scope.selectedTreeList.push(data.node);
                    if (data.node.parents.length > 1) {
                        _.each(data.node.parents, function (itemIds) {
                            if (itemIds != "#") {
                                var exists = _.findWhere(data.instance._model.data, { id: itemIds })
                                if (!DataService.isEmpty(exists)) {
                                    exists.groupById = data.node.groupById;
                                    $scope.selectedTreeList.push(exists);
                                }
                            }
                        });
                    }
                }
                else if ($scope.selectedTreeList.length == 0) {
                    $scope.selectedTreeList.push(data.node);
                    if (data.node.parents.length > 1) {
                        _.each(data.node.parents, function (itemIds) {
                            if (itemIds != "#") {
                                var exists = _.findWhere(data.instance._model.data, { id: itemIds })
                                if (!DataService.isEmpty(exists)) {
                                    exists.groupById = data.node.groupById;
                                    $scope.selectedTreeList.push(exists);
                                }
                            }
                        });
                    }
                }
                else {
                    notifierService.notifyMessage('info', 'Event', 'Multiple form filter are not allowed');
                    $("#" + data.node.id + "_anchor").removeClass("jstree-clicked")
                    _.each(data.node.parents, function (itemIds) {
                        if (itemIds != "#") {
                            $("#" + itemIds + "_anchor").removeClass("jstree-clicked");
                            $("#" + itemIds + "_anchor").removeClass("jstree-anchor");
                        }
                    });
                    return false;
                }
            }
        };
        function loadLeftSideMenu(param) {
            $scope.yaxisFormList = angular.copy($scope.calenderSettingsFormDetailsDataList);
            $scope.yaxisFormList = _.filter($scope.yaxisFormList, function (item) { return item.resourceForm != 0 });
            $scope.yaxisFormListCopy = angular.copy($scope.yaxisFormList);


            angular.forEach($scope.calenderSettingsFormDetailsDataList, function (dataRow, position) {
                //console.log(dataRow);
                if (dataRow.activitiesForm !== 0)
                    $scope.xaxisFormList.push(dataRow);
            });
            var exists = _.findWhere($scope.xaxisFormList, { IsDefault: true });
            if (!DataService.isEmpty(exists)) {
                $scope.xSelection = exists.resourceActivityForm;
                $scope.xSelectionChange($scope.xSelection);
            }
            _.each($scope.calenderSettingsFormDetailsDataList, function (listSettings, setKey) {
                listSettings.majorGroupParseList = "";
                listSettings.formDataListTempList = [];
                var temp = {};
                temp = { "id": setKey.toString(), "parent": "#", "text": listSettings.title };
                listSettings.formDataListTempList.push(temp);
                var mainCount = 0;
                if (!DataService.isEmpty(listSettings.majorGroup)) {
                    if (!Array.isArray(listSettings.majorGroup)) {
                        //listSettings.majorGroup = listSettings.majorGroup.replace('\\"', '').replace('\\"', '').replace("[", "").replace("]", "");
                        listSettings.majorGroupParse = JSON.parse(listSettings.majorGroup);
                        if (Array.isArray(listSettings.majorGroup)) {
                            listSettings.majorGroupParseList = '[' + listSettings.majorGroupParse.join(',') + ']';
                        }
                        else {
                            listSettings.majorGroupParseList = '[' + listSettings.majorGroupParse + ']';
                            //listSettings.majorGroupParse = JSON.parse(listSettings.majorGroupParseList);    
                        }
                    }
                    listSettings.groupByList = {};
                    listSettings.resNew = [];
                    if (listSettings.formDataList.length > 0) {
                        _.each(listSettings.formDataList, function (t) {
                            t.title = t[listSettings.minorGroup];
                        });
                    }
                }
                else {
                    if (listSettings.formDataList.length > 0) {
                        _.each(listSettings.formDataList, function (t) {
                            t.title = t[listSettings.activitiesCategory];
                        });
                    }
                }
                listSettings.res = [];
                _.each(listSettings.majorGroupParse, function (item, itemKey) {
                    listSettings.groupByList = [];
                    if (itemKey == 0) {
                        var uniqData = _.uniq(listSettings.formDataList, item);
                        _.each(uniqData, function (unItem, key) {
                            temp = { "id": key + item, "parent": setKey.toString(), "text": unItem[item] };
                            listSettings.formDataListTempList.push(temp);
                        });
                    }
                });
                //console.log(listSettings.formDataListTempList);
                listSettings.selectedTreeNode = [];
                listSettings.nestedListTree = [];
                $timeout(function () {
                    $("#tree-" + setKey + "").jstree(

                        {

                            "core":
                            {
                                "html_titles": true, "load_open": true,
                                "check_callback": true,
                                "themes": {
                                    "icons": false,
                                    "stripes": true,
                                    "responsive": true,
                                    "dots": false,
                                },
                                'data': function (node, cb, data) {


                                    var urlTemp = "";
                                    if (node.id === '#') {
                                        var newFilter = "&companyCode=" + localStorage.getItem("COMPANY_CODE") + "&calendarCode=" + localStorage.getItem("CALENDAR_CODE");
                                        urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection="a"&selectedRoot=0&query=null' + node.id + newFilter;
                                    }
                                    else {
                                        $rootScope.$emit("ShowLoading");
                                        var selectedRoot = "";
                                        var previousSelection = "xyz";
                                        var exists = _.findWhere(node, { "id": node.id });
                                        if (DataService.isEmpty(exists))
                                            listSettings.selectedTreeNode.push(node);
                                        if (node.id != "#")
                                            if (listSettings.nestedListTree.length < listSettings.majorGroupParse.length) {
                                                if (listSettings.nestedListTree.length != 0) {
                                                    var indx = _.indexOf(listSettings.majorGroupParse, listSettings.nestedListTree[listSettings.nestedListTree.length - 1].nextField);
                                                    if (indx != -1) {
                                                        var field = listSettings.majorGroupParse[indx + 1];
                                                        selectedRoot = field;
                                                        var exists = _.findWhere(listSettings.nestedListTree, { nextField: field });
                                                        if (DataService.isEmpty(exists)) {
                                                            var queryText = field + " like '@" + node.text + "@'";
                                                            listSettings.nestedListTree.push({
                                                                text: node.text, data: field, nextField: field, query: queryText,
                                                                formId: listSettings.formId,
                                                                FormTableName: listSettings.FormTableName
                                                            });
                                                        }
                                                    }
                                                }
                                                else {
                                                    var queryText = node.original.index + " like '" + node.text + "' ";
                                                    selectedRoot = node.original.index;
                                                    listSettings.nestedListTree.push({
                                                        text: node.text, data: node.original.index, nextField: node.original.index, query: queryText
                                                        , formId: listSettings.resourceActivityForm,
                                                        FormTableName: listSettings.FormTableName
                                                    });
                                                }


                                            }
                                        //previousSelection=node.parent;
                                        var query = " ";
                                        if (node.original.index) {
                                            //var exists = _.findWhere(listSettings.nestedListTree, { nextField: node.original.index});                                                   

                                            out = _.uniq(out, "id");
                                            var ddd = $("#tree-" + setKey + "").jstree(true)._model.data;
                                            listSettings.selectListTree = angular.copy(getNestedChildrenNew(ddd, node.parent, node.id));
                                            out = _.uniq(out, "id");
                                            var persistwithoutlist = [];
                                            persistwithoutlist = _.without(out, _.findWhere(out, { id: "#" }));
                                            if (persistwithoutlist.length > 0) {


                                                var exists = _.findWhere(persistwithoutlist, { parent: node.parent });
                                                if (!DataService.isEmpty(exists)) {
                                                    var exists = _.without(persistwithoutlist, _.findWhere(persistwithoutlist, { id: node.parent }));
                                                    _.each(exists, function (ite) {
                                                        var innndx = _.indexOf(persistwithoutlist, ite);
                                                        if (innndx != -1)
                                                            persistwithoutlist.splice(innndx, 1);
                                                    });
                                                }
                                                else {

                                                    var exists = _.without(persistwithoutlist, _.findWhere(persistwithoutlist, { id: node.parent }));
                                                    _.each(exists, function (ite) {
                                                        var innndx = _.indexOf(persistwithoutlist, ite);
                                                        if (innndx != -1)
                                                            persistwithoutlist.splice(innndx, 1);
                                                    });
                                                }
                                            }
                                            persistwithoutlist.push(node);
                                            listSettings.nestedListTree = [];
                                            _.each(persistwithoutlist, function (item) {
                                                if (item.id != "#") {
                                                    var queryText = item.data + " like '" + item.text + "' ";
                                                    listSettings.nestedListTree.push({ query: queryText });
                                                }
                                            });


                                            //if (out.length > 0 && out.length>listSettings.nestedListTree.length)
                                            //listSettings.nestedListTree = persistwithoutlist;
                                            //_.each(persistwithoutlist, function (item,key) {
                                            //    var innndx = _.indexOf(out, item);
                                            //    if (innndx!=-1)
                                            //        out.splice(innndx, 1);
                                            //});   


                                            //if (!DataService.isEmpty(exists)) {

                                            //    exists.text = node.original.text;
                                            //    exists.query = exists.nextField + " like '%" + node.original.text + "%' ";
                                            //}
                                        }
                                        else {
                                            //var exists = listSettings.nestedListTree[listSettings.nestedListTree.length-1];  
                                            //if (!DataService.isEmpty(exists)) {
                                            //    exists.text = node.text;
                                            //    exists.query = exists.nextField + " like '%" + node.original.text + "%' ";
                                            //}                                                    
                                        }

                                        //listSettings.selectListTree=[];

                                        _.each(listSettings.nestedListTree, function (item) {

                                            query += item.query + " and ";
                                        });

                                        query = (query.length > 2) ? query.substring(0, query.length - 4) : query;
                                        query = query.trim();

                                        urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection=' + previousSelection + '&selectedRoot=' + selectedRoot + '&query=' + query + '';
                                    }

                                    $.ajax({
                                        "url": urlTemp,
                                        "data": { "id": node.id, companyCode: localStorage.getItem("COMPANY_CODE"), calendarCode: localStorage.getItem("CALENDAR_CODE") },
                                        //"data": { "id": node.id },
                                        "success": function (data) {
                                            //console.log(data);
                                            //if (node.id === '#')
                                            //    cb(data);
                                            //else {
                                            var listJson = [];
                                            if (listSettings.formDataList.length > 0) {
                                                //var count = 0; _.each(listSettings.formDataList[0], function (t) { count++; });
                                                // for (var i = 0; i < count; i++) 
                                                //{                                                                 //}


                                                if (node.id == "#") {
                                                    // var index = node.id.split('_');
                                                    // if (parseInt(index[1]) <= listSettings.majorGroupParse.length) {
                                                    if (!DataService.isEmpty(listSettings.majorGroupParse[0])) {
                                                        var grbp = listSettings.majorGroupParse[0];
                                                        listSettings.groupByList[0] = _.groupBy(listSettings.formDataListGroupBy, grbp);
                                                        _.each(listSettings.groupByList[0], function (t, k) {
                                                            var queryText = "";
                                                            if (node.id != "#")
                                                                queryText = grbp + " like '" + node.text + "' ";
                                                            else
                                                                queryText = grbp + " like '" + k + "' ";
                                                            listJson.push({
                                                                text: k, children: true, parent: node.parent, data: grbp, index: grbp, query: queryText, formId: listSettings.resourceActivityForm,
                                                                FormTableName: listSettings.FormTableName
                                                            });
                                                        });
                                                    } else {
                                                        var grbp = listSettings.minorGroup;
                                                        listSettings.limitVal = 5;
                                                        listSettings.lastNodeData = angular.copy(data);
                                                        listSettings.groupByList[0] = _.groupBy(listSettings.formDataListGroupBy, grbp);
                                                        var gindx = 0;
                                                        _.each(listSettings.groupByList[0], function (t, k) {
                                                            if (gindx < listSettings.limitVal) {
                                                                var queryText = "";
                                                                if (node.id != "#")
                                                                    queryText = grbp + " like '" + node.text + "' ";
                                                                else
                                                                    queryText = grbp + " like '" + k + "' ";
                                                                listJson.push({
                                                                    text: k, children: false, parent: node.parent, data: grbp, index: grbp, query: queryText, formId: listSettings.resourceActivityForm,
                                                                    FormTableName: listSettings.FormTableName
                                                                });
                                                            }
                                                            gindx++;
                                                        });
                                                        debugger;
                                                        if (data.length > listSettings.limitVal) {
                                                            listSettings.generateUniqueModel = generateUniqueNumber();
                                                            listJson.push({ children: false, class: "no_checkbox", id: 'more-button-' + listSettings.generateUniqueModel + '', 'data-formId': listSettings.resourceForm, text: '<a class="morebutton"  id="more-button-' + listSettings.generateUniqueModel + '" data-formId="' + listSettings.resourceForm + '"  ><i class="fa fa-plus"></i> ' + (data.length - listSettings.limitVal) + ' more</a>' });
                                                            $timeout(function () {
                                                                $("#treeIndex").val(setKey)
                                                                listSettings.lastNodeDataList = [];
                                                                debugger;
                                                                _.each(listSettings.lastNodeData, function (itemList, keyl) {
                                                                    var fieldKeyData = itemList[grbp];
                                                                    var que = grbp + " like '" + fieldKeyData + "' ";
                                                                    var firstchr = (!DataService.isEmpty(fieldKeyData)) ? fieldKeyData.charAt(0).toUpperCase() : "";
                                                                    listSettings.lastNodeDataList.push({
                                                                        text: fieldKeyData, children: false, index: grbp, query: que, data: grbp, firstChar: firstchr, formId: listSettings.resourceActivityForm,
                                                                        FormTableName: listSettings.FormTableName
                                                                    });
                                                                });
                                                                listSettings.lastNodeDataList = $filter('orderBy')(listSettings.lastNodeDataList, 'firstChar', false);
                                                                $scope.lastNodeDataList = _.groupBy($scope.lastNodeDataList, "firstChar");
                                                                $("*[id*=more-button]").on('click', function (event) {
                                                                    var title = $(this).closest('.card-header').text().trim().toLowerCase();
                                                                    var selectFormId = 0;
                                                                    if (!DataService.isEmpty($(event.currentTarget).data().formid))
                                                                        selectFormId = $(event.currentTarget).data().formid;
                                                                    else
                                                                        selectFormId = $(event.currentTarget).find('.morebutton').data().formid;
                                                                    listSettings.selectFormId = selectFormId;
                                                                    $scope.nodechildModelSearch = "";
                                                                    debugger;
                                                                    $scope.getSelectedModelPopData(listSettings);
                                                                });


                                                                $timeout(function () {
                                                                    $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').closest(".jstree-anchor").removeClass('jstree-anchor');
                                                                    $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').remove();
                                                                }, 100);
                                                            }, 450);

                                                        }
                                                    }
                                                    //listSettings.nestedListTree.push({ text: node.text, nextField: listSettings.majorGroupParse[0]});
                                                    //}
                                                } else {


                                                    //if (node.parent.length == listSettings.majorGroupParse.length + 1) {
                                                    if (listSettings.majorGroupParse.length > listSettings.nestedListTree.length) {
                                                        _.each(data, function (itemList, keyl) {
                                                            _.each(itemList, function (t, key) {
                                                                if (!DataService.isEmpty(t))
                                                                    if (t.toString().toLowerCase() == node.text.toLowerCase()) {
                                                                        var indx = _.indexOf(listSettings.majorGroupParse, key);
                                                                        if (indx != -1) {
                                                                            if (listSettings.majorGroupParse.length > (indx + 1)) {
                                                                                var nestedKey = listSettings.majorGroupParse[indx + 1];
                                                                                var que = nestedKey + " like '" + itemList[listSettings.majorGroupParse[indx + 1]] + "' ";
                                                                                listJson.push({
                                                                                    text: itemList[listSettings.majorGroupParse[indx + 1]], parent: node.parent, children: true, index: key, query: que, data: nestedKey, formId: listSettings.resourceActivityForm,
                                                                                    FormTableName: listSettings.FormTableName
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                            });
                                                        });
                                                    } else {
                                                        if (listSettings.majorGroup != "[]") {
                                                            if (!DataService.isEmpty(listSettings.minorGroup))
                                                                if (listSettings.minorGroup.length > 0) {
                                                                    listSettings.lastNodeData = angular.copy(data);
                                                                    listSettings.limitVal = 2;
                                                                    var limitedList = [];
                                                                    if (data.length > listSettings.limitVal) {
                                                                        _.each(data, function (itemList, keyl) {
                                                                            if (keyl < 2)
                                                                                limitedList.push(itemList);
                                                                        });



                                                                    } else {
                                                                        limitedList = data;
                                                                    }
                                                                    _.each(limitedList, function (itemList, keyl) {
                                                                        var que = listSettings.minorGroup + " like '" + itemList[listSettings.minorGroup] + "' ";
                                                                        listJson.push({
                                                                            text: itemList[listSettings.minorGroup], children: false, index: listSettings.minorGroup, query: que, data: listSettings.minorGroup, formId: listSettings.resourceActivityForm,
                                                                            FormTableName: listSettings.FormTableName
                                                                        });

                                                                        //listJson.push({ children: false, id: 'x', text: '<button>hello</button>' });
                                                                    });
                                                                    if (data.length > listSettings.limitVal) {
                                                                        listSettings.generateUniqueModel = generateUniqueNumber();
                                                                        listJson.push({ children: false, class: "no_checkbox", id: 'more-button-' + listSettings.generateUniqueModel + '', text: '<a id="more-button-' + listSettings.generateUniqueModel + '" ><i class="fa fa-plus"></i> ' + (data.length - listSettings.limitVal) + ' more</a>' });
                                                                        $timeout(function () {
                                                                            $("#treeIndex").val(setKey)
                                                                            listSettings.lastNodeDataList = [];
                                                                            _.each(listSettings.lastNodeData, function (itemList, keyl) {
                                                                                var fieldKeyData = itemList[listSettings.minorGroup];
                                                                                var que = listSettings.minorGroup + " like '" + fieldKeyData + "' ";
                                                                                var firstchr = fieldKeyData.charAt(0).toUpperCase();
                                                                                listSettings.lastNodeDataList.push({
                                                                                    text: fieldKeyData, children: false, index: listSettings.minorGroup, query: que, data: listSettings.minorGroup, firstChar: firstchr, formId: listSettings.resourceActivityForm,
                                                                                    FormTableName: listSettings.FormTableName
                                                                                });
                                                                            });
                                                                            listSettings.lastNodeDataList = $filter('orderBy')(listSettings.lastNodeDataList, 'firstChar', false);
                                                                            //$scope.lastNodeDataList = _.groupBy($scope.lastNodeDataList,"firstChar");
                                                                            $("*[id*=more-button]").on('click', function () {
                                                                                var title = $(this).closest('.card-header').text().trim().toLowerCase();
                                                                                $scope.getSelectedModelPopData(listSettings);
                                                                            });
                                                                            $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').closest(".jstree-anchor").removeClass('jstree-anchor');
                                                                            $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').remove();
                                                                        }, 450);

                                                                    }
                                                                }

                                                        }

                                                    }


                                                    //} else {
                                                    //    _.each(node.parent, function (pid, pkey) {
                                                    //        if (pid != "#") {

                                                    //        }
                                                    //    });
                                                    //}




                                                }

                                            }
                                            var listJson = _.uniq(listJson, "text");
                                            cb(listJson);
                                            $timeout(function () {
                                                $scope.addSelectedTree(setKey, node)
                                            }, 650);
                                            //if (!node.id.contains("more-button"))
                                            //   $scope.applyCheckBoxesChanges(data, data.selected);
                                            $rootScope.$emit("HideLoading");
                                        }
                                        //cb([{ "id": 1, "text": "Updated Root node", }, { "id": 2, "text": "Updated Child node 1", "parent": 1, "children": true }]);
                                        // }
                                    });

                                    //                                              'url': function (node) {
                                    //                                                  var urlTemp="";
                                    //                                                   if(node.id === '#'){
                                    //                                                       urlTemp = $scope.currentUrl + '/getJSONjsTree?root=0&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection="a"&selectedRoot=0' + node.id;
                                    //                                                      }else{
                                    //                                                       var previousSelection="xyz";
                                    //                                                       listSettings.selectedTreeNode.push(node);
                                    //                                                       //previousSelection=node.parent;
                                    //urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection=' + previousSelection+'&selectedRoot=' + node.text;
                                    //                                                      }
                                    //                                                  return urlTemp;
                                    //}
                                    //,
                                    //'data': function (node) {
                                    //    return { 'id': node.id };
                                    //}
                                }
                            },
                            "checkbox": {
                                "keep_selected_style": false,
                                "tie_selection": true

                            },
                            "plugins": ["wholerow", "checkbox", "search", "unique", "dnd"],
                            "search": {
                                "case_sensitive": false,
                                "show_only_matches": true,
                                search_callback: function (searchString, node) {
                                    return true;
                                }
                            }
                            //                        'core': {
                            //                            'data': listSettings.formDataListTempList,
                            //                            callback: {
                            //                                onopen: function (node, tree_obj) {
                            //                                    if (tree_obj.children(node).length == 0) {

                            //                                    }
                            //                       return true;
                            //                                }                                        
                            //}
                            //                        }


                        })
                        .on("changed.jstree", function (e, data) {
                            var i, j, r = [];
                            for (i = 0, j = data.selected.length; i < j; i++) {
                                r.push(data.instance.get_node(data.selected[i]).text);
                            }

                            if (!DataService.isEmpty(data.action) && data.action == "select_node") {
                                //$scope.selectedTreeList.push(data.node)
                                manageSelectedTree(data, 1);

                            } else {
                                if (data.action == "deselect_all") {
                                    $scope.selectedTreeList = [];
                                } else {
                                    var item = _.findWhere($scope.selectedTreeList, { id: data.node.id });
                                    if (!DataService.isEmpty(item)) {
                                        var indx = _.indexOf($scope.selectedTreeList, item);
                                        if (indx != -1) {
                                            $scope.selectedTreeList.splice(indx, 1);
                                            // reBindCalender();
                                        }
                                    } else {
                                        manageSelectedTree(data, 2);
                                    }
                                }

                            }

                            var tempListSelected = $("#tree-" + setKey + "").jstree(true).get_selected();
                            var exi = "";
                            if (tempListSelected.length > 0)
                                _.each(tempListSelected, function (item) {
                                    if (!item.contains("more")) {
                                        exi = _.filter(listSettings.selectedTreeNode, function (fil) { return fil == item });
                                        if (DataService.isEmpty(exi))
                                            listSettings.selectedTreeNode.push(item);
                                    }
                                    exi = "";
                                });
                            else
                                listSettings.selectedTreeNode = [];
                            //console.log(listSettings.selectedTreeNode)
                            $rootScope.safeApply();
                            //  if (!data.node.id.contains("more-button"))
                            //$scope.applyCheckBoxesChanges(data, data.selected);

                        })
                        .on("click", ".jstree-icon", function () {
                            $("*[id*=more-button]").find('> a > .jstree-checkbox').closest(".jstree-anchor").removeClass('jstree-anchor');
                            //$('*[id*=more-button]').contents().unwrap();
                            $("*[id*=more-button]").find('> a > .jstree-checkbox').remove();
                            $("*[id*=more-button]").on('click', function () {
                                var title = $(this).closest('.card-header').text().trim().toLowerCase();
                                var id = $("#treeIndex").val();

                                $scope.getSelectedModelPopData($scope.calenderSettingsFormDetailsDataList[id]);
                            });
                            //if (this.parents('.jstree-open').length) {
                            //    console.log('jstree-icon')
                            //}

                        });


                    var to = false;
                    $("#search-input-" + setKey + "").keyup(function () {
                        if (to) { clearTimeout(to); }
                        to = setTimeout(function () {
                            var v = $("#search-input-" + setKey + "").val();
                            $("#tree-" + setKey + "").jstree(true).search(v);
                        }, 250);
                    });


                    $rootScope.safeApply();

                }, 250);
            });
            $timeout(function () {
                $('.sidebar .card-header .arrow').on('click', function () {
                    $(this).closest('.card').find('.card-body').slideToggle();
                    $(this).toggleClass('bottom');
                });
                //$('.search-icon').on('click', function () {
                //    var $this = $(this);
                //    $(this).closest('.card').find('.search-filter').slideToggle(function () {
                //        if ($(this).is(':visible')) {
                //            $this.find('i').addClass('fa-times').removeClass('fa-search')
                //        } else {
                //            $this.find('i').addClass('fa-search').removeClass('fa-times')
                //        }
                //    });
                //});
                //$("*[id*=more-button]").on('click', function (event) {
                //    var title = $(this).closest('.card-header').text().trim().toLowerCase();
                //    var selectFormId = $(event.currentTarget).data().formid;
                //    var param = {};
                //    param.selectFormId = selectFormId;
                //    $scope.nodechildModelSearch = "";
                //    $scope.getSelectedModelPopData(param);
                //});

            }, 150);
            //$scope.bindDraggable($scope.xSelection, $scope.ySelection);
        };
        $scope.lastNodeDataList = [];
        $scope.getSelectedModelPopData = function (listSettings) {
            $scope.getSelectedModelPopSelectFormId = 0;
            if (!DataService.isEmpty(listSettings) && !DataService.isEmpty(listSettings.selectFormId)) {
                $scope.getSelectedModelPopSelectFormId = listSettings.selectFormId;
                listSettings = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: listSettings.selectFormId });
                $scope.filterPopupPlaceHolder.title = listSettings.title;
                _.map(listSettings.lastNodeDataList, function (itemmap) {
                    return _.extend(itemmap, { checked: false });
                });
                _.each($scope.selectedTreeList, function (item) {
                    var exists = _.findWhere(listSettings.lastNodeDataList, { text: item.text });
                    if (!DataService.isEmpty(exists))
                        exists.checked = true;
                    else {
                        exists = {};
                        exists.checked = false;
                    }
                });
                $rootScope.safeApply();
                $timeout(function () {
                    $scope.lastNodeDataList = listSettings.lastNodeDataList;
                    $rootScope.safeApply();
                    $('#filterModal').modal('show');
                }, 100);
            }

        };
        $scope.searchSelectedActivityBoxes = function (selectedData) {
            if (!DataService.isEmpty(selectedData.activitySearchTextData)) {
                var list = JSON.parse(selectedData.activitySearchTextData)
                var temp = angular.copy($scope.Xdraggables.draggableSlipsTemp);
                var newList = _.filter(temp, function (a) {
                    return _.find(list, function (b) {
                        return a.value.toLowerCase().contains(b.value.toLowerCase());
                    });
                });
                $scope.Xdraggables.draggableSlips = newList;
                $timeout(function () {
                    $('.toggle-course-master').show("slow");
                    $('.course-click').addClass('right');
                }, 100);
            }
            else {
                $scope.Xdraggables.draggableSlips = angular.copy($scope.Xdraggables.draggableSlipsTemp);
            }
            $timeout(function () {
                $('.external-events-list .fc-event').each(function () {

                    $(this).data('event', {

                        title: $.trim($(this).text()), // use the element's text as the event title
                        color: $.trim($(this).data('color')),
                        duration: $.trim($(this).data('duration')),
                        stick: false, // maintain when user navigates (see docs on the renderEvent method)
                        id: $.trim($(this).data('id')),
                        formid: $.trim($(this).data('formid')),
                        activityfield: $.trim($(this).data('activityfield')),
                        colorfield: $.trim($(this).data('colorfield')),
                        categoryfield: $.trim($(this).data('categoryfield')),
                        servicefield: $.trim($(this).data('servicefield')),
                        dropin: $.trim($(this).data('dropin')),
                        dimensiontype: $.trim($(this).data('dimensiontype')),
                        groupingvaluesact: $.trim($(this).data('groupingvaluesact')),
                        groupingfieldsres: $.trim($(this).data('groupingfieldsres')),



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
            }, 500);
        };
        /*  Donot remove this function , filtering for event on the basis of selected activity  */
        $scope.searchTabulatorDataInEventByResources = function (selectedData) {
            //alert('searchTabulatorDataInEventByResources')

            reBindCalender();
        };
        $scope.searchTabulatorDataInEvent = function (selectedData) {
            var selectedDataTemp = selectedData;
            reBindCalender();
            //var newParam = {};
            //newParam.action = 30;
            //newParam.formId = $scope.formDetailsDataInfo.formId;
            //newParam.FormTableName = $scope.formDetailsDataInfo.FormTableName;
            //newParam.formTableColumnData = selectedDataTemp.searchTextData;
            //$rootScope.$emit("ShowLoading");
            //newParam.created_by = $scope.userDetail.Id;
            //newParam.update_by = $scope.userDetail.Id;
            //mainService.getFormRecordList("GetFormRecordList", newParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {                   
            //            var temp = response.data;
            //            $('.calendar').fullCalendar('destroy');
            //            var eventBasicData = window["EventBasicDetail"];
            //            //window["EventBasicDetail"] = temp;
            //            console.log('loadCalendar2')
            //           loadCalendar('BasicView', temp, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, temp);
            //            $rootScope.safeApply();
            //        }
            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });

            //console.log(selectedData)
            //$("#tabuListUl").empty();
            //if ($scope.eventDataWithoutGroupBy.length > 0) {
            //    $("#tabuList").empty();
            //    angular.forEach($scope.eventDataWithoutGroupBy, function (filterData) {
            //        if (!DataService.isEmpty($scope.tabuListLink.searchTextData) && filterData[$scope.selectedKeyField].toLowerCase().indexOf($scope.tabuListLink.searchTextData.toLowerCase()) != -1) {
            //            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (Std ID:' + filterData.Id + ')</span></li>');
            //        }
            //        if (DataService.isEmpty($scope.tabuListLink.searchTextData)) {
            //            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (Std ID:' + filterData.Id + ') </span></li>');
            //        }

            //    });
            //    $("#tabuList").append('<strong id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + ' Students in this lesson</strong>');
            //} else {
            //    $("#tabuList").empty();
            //    $("#tabuList").append('<strong id="strongFormName">0 Students in this lesson</strong>');
            //}
        };
        $scope.openPopupOverFormEntry = function (temp) {
            //console.log('openFormEntry');
            var formId = $scope.formDetailsDataInfo.otherformid;
            //var params = windowParams();
            var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getEditbaseUrl();
            var formGroupKey = temp.formgroupkey;
            var eventId = temp.entryid;
            //url: '/form/editEntry/:formId/:formGroupKey/:Id?popup',
            newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + '/' + formGroupKey + '/' + eventId + '?popup=1', 'example', params, true);
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        var paramTemp = {};
                        paramTemp.action = 10;
                        paramTemp.formGroupKey = formGroupKey;
                        paramTemp.formId = formId;
                        if ($scope.formDetailsDataInfo.currentFormType == 1) {
                            paramTemp.formId = $scope.tabuListLink.formId;
                            paramTemp.Id = $scope.selectEventDetails.Id;
                        }
                        loadEventRecordDetails(paramTemp);
                    }, 150);
                }
            }, 500);
        };

        $scope.DeletestudentFormEntry = function (temp) {
            var formId = temp.formid;
            var formGroupKey = temp.formgroupkey;
            var eventId = temp.entryid;

            var param = {};
            param.action = 3;
            param.formId = formId;
            param.name = $scope.userDetail.name;
            param.userId = $scope.userDetail.Id;
            var newDeletedList = [];
            var newformGroupKeyDeletedList = [];
            newDeletedList.push(eventId);
            newformGroupKeyDeletedList.push(formGroupKey);
            if (newDeletedList.length > 0) {
                param.formGroupKeyList = newDeletedList.join();
                window["formGroupKeyList"] = newDeletedList;
                param.formfieldDataListTemp = newformGroupKeyDeletedList.join();
                if (confirm('Are you sure to delete selected Record?')) {
                    StudentFormDataDelete(param);
                }
            }



        };

        function loadEventRecordDetails(paramTemp) {
            $rootScope.$emit("ShowLoading");
            $("#tabuListUl").empty();
            //$("#tabuListUl").parent().append(`<div class="spinner-border" role="status"> 
            //                        <span class="sr-only">Loading...</span>
            //                        </div>`);
            if (!DataService.isEmpty(paramTemp.formId) || paramTemp.formId == 0) {
                var param = {};
                param = paramTemp;
                param.action = 10;
                param.formId = paramTemp.formId == 0 ? $scope.currentFormId : paramTemp.formId;
                param.parentID = $scope.currentFormId;
                param.fieldName = "";
                mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                    .then(
                        function (response) {
                            console.log(response, "response");
                            $scope.eventData = response.data;
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

                            var courseExists = _.findWhere($scope.xaxisFormList, { resourceActivityForm: $scope.courseFormId });
                            if (!DataService.isEmpty(courseExists)) {
                                var courseFormEntry = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: $scope.courseFormId });
                                if (!DataService.isEmpty(courseFormEntry)) {
                                    var courseFormEntryExists = _.findWhere(courseExists.formDataList, { id: courseFormEntry.referrenceId });
                                    if (!DataService.isEmpty(courseFormEntryExists)) {
                                        var maxrecordList = 0;
                                        var maxrecordWaitingList = 0;
                                        _.each(courseFormEntryExists, function (item, keyItem) {
                                            if (keyItem.contains("maxstudent")) {
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

                            var existsOneToMany = _.findWhere($scope.listTabulator, { fieldName: $scope.tabuListLink.fieldName });
                            $("#tabuListUl").empty();
                            $("#newtabuListUl").empty();
                            $("#newtabuListUlWaiting").empty();

                            if (param.parentID != param.formId) {

                                if (!DataService.isEmpty($scope.eventDataWithoutGroupBy)) {
                                    if ($scope.eventDataWithoutGroupBy.length > 0) {
                                        $("#tabuList").empty();
                                        $("#newtabuList").empty();
                                        var _newtabuListUlHtml = "";
                                        var _newtabuListUlHtmlWaiting = "";
                                        _.each($scope.eventDataWithoutGroupByMinRecord, function (filterData) {
                                            var sIdEvent = filterData.studentId;
                                            if (DataService.isEmpty(filterData.studentId))
                                                sIdEvent = filterData[$scope.selectedKeyField + "_Id"];
                                            if (!DataService.isEmpty(existsOneToMany)) {
                                                if (!DataService.isEmpty($scope.selectedKeyField)) {

                                                    if (!DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                        var tempdata = filterData[$scope.selectedKeyFieldSecond];


                                                        if (!DataService.isEmpty(tempdata)) {

                                                            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' | ' + tempdata + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' | ' + tempdata + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        }
                                                        else {
                                                            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        }
                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                        _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                    }
                                                }
                                                else {
                                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName))
                                                        $scope.selectedKeyField = $scope.formDetailsDataInfo.otherFormFieldName;
                                                    if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                        var tempJson = JSON.parse($scope.selectedKeyField);
                                                        if (tempJson.length > 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                            $scope.selectedKeyFieldSecond = tempJson[1];
                                                        } else if (tempJson.length == 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                        } else {
                                                            $scope.selectedKeyField = "";
                                                        }
                                                        if (!DataService.isEmpty($scope.selectedKeyField) && !DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' | ' + filterData[$scope.selectedKeyFieldSecond] + ' ( ID:' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' | ' + filterData[$scope.selectedKeyFieldSecond] + ' ( ID:' + sIdEvent + ') </span></li>';
                                                        } else if (!DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                            $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        } else {
                                                            $("#tabuListUl").append('<li><span> (ID: ' + sIdEventd + ')</span></li>');
                                                            _newtabuListUlHtml += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                        }

                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span> (ID: ' + sIdEvent + ')</span></li>');
                                                        _newtabuListUlHtml += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                    }
                                                }
                                            } else {
                                                if (!DataService.isEmpty($scope.selectedKeyField)) {

                                                    var formId = $scope.eventData.formDetails.formId;
                                                    //console.log(filterData,"filterData");
                                                    $("#tabuListUl").append('<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData[$scope.selectedKeyField + "_Id"] + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>');
                                                    _newtabuListUlHtml += '<li><span>' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData[$scope.selectedKeyField + "_Id"] + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span> <span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' data-formId="' + formId + '" id="transList_' + filterData.Id + '" class="Deletelist cursor-pointer"> <i class="fa fa-trash"></i></span>   </li>';
                                                }
                                                else {
                                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName))
                                                        $scope.selectedKeyField = $scope.formDetailsDataInfo.otherFormFieldName;
                                                    if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                        var tempJson = JSON.parse($scope.selectedKeyField);
                                                        if (tempJson.length > 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                            $scope.selectedKeyFieldSecond = tempJson[1];
                                                        } else if (tempJson.length == 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                        } else {
                                                            $scope.selectedKeyField = "";
                                                        }

                                                        $("#tabuListUl").append('<li><span>  ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>');
                                                        _newtabuListUlHtml += '<li><span>  ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>';

                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span> (ID: ' + sIdEvent + ')</span></li>');
                                                        _newtabuListUlHtml += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                    }
                                                }
                                            }
                                        });
                                        _.each($scope.eventDataWithoutGroupByMinRecordForWaiting, function (filterData, waitingIndex) {
                                            var sIdEvent = filterData.studentId;
                                            if (DataService.isEmpty(filterData.studentId))
                                                sIdEvent = filterData[$scope.selectedKeyField + "_Id"];
                                            waitingIndex = waitingIndex + 1;
                                            if (!DataService.isEmpty(existsOneToMany)) {
                                                if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                    if (!DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                        var tempdata = filterData[$scope.selectedKeyFieldSecond];
                                                        if (!DataService.isEmpty(tempdata)) {
                                                            $("#tabuListUl").append('<li><span> W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' | ' + tempdata + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' | ' + tempdata + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        }
                                                        else {
                                                            $("#tabuListUl").append('<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        }
                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                        _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                    }
                                                }
                                                else {
                                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName))
                                                        $scope.selectedKeyField = $scope.formDetailsDataInfo.otherFormFieldName;
                                                    if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                        var tempJson = JSON.parse($scope.selectedKeyField);
                                                        if (tempJson.length > 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                            $scope.selectedKeyFieldSecond = tempJson[1];
                                                        } else if (tempJson.length == 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                        } else {
                                                            $scope.selectedKeyField = "";
                                                        }
                                                        if (!DataService.isEmpty($scope.selectedKeyField) && !DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                            $("#tabuListUl").append('<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' | ' + filterData[$scope.selectedKeyFieldSecond] + ' ( ID:' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' | ' + filterData[$scope.selectedKeyFieldSecond] + ' ( ID:' + sIdEvent + ') </span></li>';
                                                        } else if (!DataService.isEmpty($scope.selectedKeyFieldSecond)) {
                                                            $("#tabuListUl").append('<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>');
                                                            _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span></li>';
                                                        } else {
                                                            $("#tabuListUl").append('<li><span> (ID: ' + sIdEvent + ')</span></li>');
                                                            _newtabuListUlHtmlWaiting += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                        }

                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span> (ID: ' + sIdEvent + ')</span></li>');
                                                        _newtabuListUlHtmlWaiting += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                    }
                                                }
                                            } else {
                                                if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                    $("#tabuListUl").append('<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>');
                                                    _newtabuListUlHtmlWaiting += '<li><span>W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>';
                                                }
                                                else {
                                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName))
                                                        $scope.selectedKeyField = $scope.formDetailsDataInfo.otherFormFieldName;
                                                    if (!DataService.isEmpty($scope.selectedKeyField)) {
                                                        var tempJson = JSON.parse($scope.selectedKeyField);
                                                        if (tempJson.length > 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                            $scope.selectedKeyFieldSecond = tempJson[1];
                                                        } else if (tempJson.length == 1) {
                                                            $scope.selectedKeyField = tempJson[0];
                                                        } else {
                                                            $scope.selectedKeyField = "";
                                                        }
                                                        $("#tabuListUl").append('<li><span>  W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>');
                                                        _newtabuListUlHtmlWaiting += '<li><span> W' + waitingIndex + '. ' + filterData[$scope.selectedKeyField] + ' (ID: ' + sIdEvent + ') </span><span data-entryId=' + filterData.Id + ' data-formGroupKey=' + filterData.formGroupKey + ' id="transList_' + filterData.Id + '" class="editlist cursor-pointer"> <i class="fa fa-pencil"></i></span></li>';

                                                    }
                                                    else {
                                                        $("#tabuListUl").append('<li><span> (ID: ' + sIdEvent + ')</span></li>');
                                                        _newtabuListUlHtmlWaiting += '<li><span> (ID: ' + sIdEvent + ')</span></li>';
                                                    }
                                                }
                                            }
                                        });
                                        $("#newtabuListUl").append(_newtabuListUlHtml);
                                        $("#newtabuListUlWaiting").append(_newtabuListUlHtmlWaiting);
                                        $("#tabuList").append('<span id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + ' ' + $scope.otherformDetails.title.toLowerCase() + '</span>');
                                        $("#newtabuList").append('<span id="strongFormName">' + $scope.eventDataWithoutGroupBy.length + ' ' + $scope.otherformDetails.title.toLowerCase() + '</span>');
                                    }
                                    else {
                                        $("#tabuList").empty();
                                        $("#newtabuList").empty();
                                        if (!DataService.isEmpty($scope.otherformDetails)) {
                                            if (!DataService.isEmpty($scope.otherformDetails.title)) {
                                                $("#tabuList").append('<span id="strongFormName"> 0 ' + $scope.otherformDetails.title.toLowerCase() + '</span>');
                                                $("#newtabuList").append('<span id="strongFormName"> 0 ' + $scope.otherformDetails.title.toLowerCase() + '</span>');
                                            }
                                        }
                                    }
                                } else {
                                    $("#labelWaiting").empty();
                                }
                                $timeout(function () {
                                    $("#tabuListUl").parent().find('.spinner-border').remove();
                                    $("#newtabuListUl").parent().find('.spinner-border').remove();
                                    $("#newtabuListUlWaiting").parent().find('.spinner-border').remove();
                                    $(".selectCustom").chosen();
                                    $(".editlist").on("click", function (event) {
                                        //alert()
                                        //console.log(event)                               
                                        $scope.openPopupOverFormEntry($(event.currentTarget).data());
                                    });
                                    $(".Deletelist").on("click", function (event) {
                                        $scope.DeletestudentFormEntry($(event.currentTarget).data());
                                    });

                                }, 150);

                                if ($(".event-detail .temp span").hasClass("titleContainer")) {
                                    if (!DataService.isEmpty($scope.otherformDetails)) {
                                        $("#tabuListLink").on("click", function () {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'tabulatorModal.html',
                                                scope: $scope,
                                                title: ' ' + $scope.otherformDetails.title,
                                                size: "large"
                                            });
                                            loadEventTabulator();
                                            $("body .popover").removeClass('isPopoverLoaded');
                                        });
                                        $("#newtabuListLink").unbind("click");
                                        $("#newtabuListLink").on("click", function () {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'tabulatorModal.html',
                                                scope: $scope,
                                                title: ' ' + $scope.otherformDetails.title,
                                                size: "large"
                                            });
                                            loadEventTabulator();
                                            $("body .popover").removeClass('isPopoverLoaded');
                                        });
                                    } else {
                                        $("#tabuListLink").hide();
                                        $("#tabuListLink").removeClass("d-inline-block");
                                        $("#newtabuListLink").hide();
                                        $("#newtabuListLink").removeClass("d-inline-block");
                                        $("#newaddTransactionRecord").hide();
                                        $("#newaddTransactionRecord").removeClass("d-inline-block");
                                    }
                                    $("#newaddTransactionRecord").unbind("click");
                                    $("#addTransactionRecord").on("click", function () {
                                        if ($scope.listTabulator.length > 0 && $scope.formDetailsDataInfo.otherformid != "") {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'addTransactionRecordTabulatorModal.html',
                                                scope: $scope,
                                                title: ' ' + $scope.otherformDetails.title + ' in this Slot',
                                                size: "large"
                                            });
                                            loadStudentTabulator();
                                        }
                                        else {
                                            $scope.openFormEntryForCalenderOtherFormBased(param);
                                        }
                                        //$("body .popover").removeClass('isPopoverLoaded');
                                    });
                                    $("#newaddTransactionRecord").on("click", function () {
                                        if ($scope.listTabulator.length > 0 && $scope.formDetailsDataInfo.otherformid != "") {
                                            var dialog = $ngBootbox.customDialog({
                                                templateUrl: 'addTransactionRecordTabulatorModal.html',
                                                scope: $scope,
                                                title: ' ' + $scope.otherformDetails.title + ' in this Slot',
                                                size: "large"
                                            });
                                            loadStudentTabulator();
                                        }
                                        else {
                                            $scope.openFormEntryForCalenderOtherFormBased(param);
                                        }
                                        //$("body .popover").removeClass('isPopoverLoaded');
                                    });
                                }
                            }
                            else {
                                $("#addTransactionRecord").remove();
                                $("#newaddTransactionRecord").remove();
                            }
                            // $("#tabuListLink");
                            $rootScope.safeApply();
                            removeTitleNew();
                            $rootScope.$emit("HideLoading");

                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                //var eventParam = angular.copy(param);
                //eventParam.action=20;
                //eventParam.formId=$scope.currentFormId;
                //mainService.getEventDetails("getEventDetails", eventParam)
                //    .then(function (response) {
                //        //console.log(response);
                //        $scope.currentEventDataPopupOver = response.data;
                //        $scope.$apply();
                //        $rootScope.$emit("HideLoading");
                //    }, function (err) {
                //        $rootScope.$emit("HideLoading");
                //        console.log("some error occured." + err);
                //    });
            }
        };
        function reBindCalenderEvents(param, type) {
            var CalendarEventList = window["CalendarEventList"];
            //var ActivityEventList = window["ActivityEventList"];
            //console.log('before deletion ');
            // console.log(CalendarEventList);
            if (type == 1) {
                var exists = _.findWhere(CalendarEventList, { formGroupKey: param.formGroupKey });
                if (!DataService.isEmpty(exists)) {
                    var temp = angular.copy(exists);
                    var formIdIndex = -1;
                    if (!DataService.isEmpty(param.referrenceFormId)) {
                        temp.customFormIds = !DataService.isEmpty(temp.customFormIds) ? temp.customFormIds.split(',') : temp.customFormIds;
                        temp.customForms = !DataService.isEmpty(temp.customForms) ? temp.customForms.split(',') : temp.customForms;
                        temp.customTitle = !DataService.isEmpty(temp.customTitle) ? temp.customTitle.split(',') : temp.customTitle;
                        _.each(temp.customForms, function (item, key) {
                            if (item.toString().trim() == param.referrenceFormId.toString()) {
                                formIdIndex = key;
                            }
                        });
                        if (formIdIndex != -1) {
                            temp.customFormIds[formIdIndex] = param.referrenceId.toString().trim();
                            temp.customTitle[formIdIndex] = param.innerText.toString().trim();
                            temp.customFormIds = temp.customFormIds.join();
                            temp.customTitle = temp.customTitle.join();
                            temp.customForms = temp.customForms.join();
                            var idx = _.findIndex(CalendarEventList, { formGroupKey: param.formGroupKey });
                            CalendarEventList[idx] = temp;
                        }
                        if (param.res == 1 && formIdIndex == -1) {
                            temp.customFormIds.push(param.referrenceId.toString().trim());
                            temp.customForms.push(param.referrenceFormId.toString().trim());
                            temp.customTitle.push(param.innerText.toString().trim());
                            temp.customFormIds = temp.customFormIds.join();
                            temp.customTitle = temp.customTitle.join();
                            temp.customForms = temp.customForms.join();
                            var idx = _.findIndex(CalendarEventList, { formGroupKey: param.formGroupKey });
                            CalendarEventList[idx] = temp;
                        }
                    }
                    else {
                        temp.customFourthTitle = !DataService.isEmpty(param.customFourthTitle) ? param.customFourthTitle : temp.customFourthTitle;
                        var idx = _.findIndex(CalendarEventList, { formGroupKey: param.formGroupKey });
                        CalendarEventList[idx] = temp;
                    }
                }
            }
            else {
                if (param.res != -1) {
                    var exists = _.findWhere(CalendarEventList, { formGroupKey: param.formGroupKey });
                    if (!DataService.isEmpty(exists)) {
                        var temp = angular.copy(exists);
                        temp.customFormIds = temp.customFormIds.contains(',') ? temp.customFormIds.split(',') : temp.customFormIds;
                        temp.customForms = temp.customForms.contains(',') ? temp.customForms.split(',') : temp.customForms;
                        temp.customTitle = temp.customTitle.contains(',') ? temp.customTitle.split(',') : temp.customTitle;
                        var formIdIndex = -1;
                        _.each(temp.customForms, function (item, key) {
                            if (item.toString().trim() == param.referrenceFormId.toString()) {
                                formIdIndex = key;
                            }
                        });
                        if (formIdIndex != -1) {
                            temp.customForms.splice(formIdIndex, 1);
                            temp.customTitle.splice(formIdIndex, 1);
                            temp.customFormIds.splice(formIdIndex, 1);
                            temp.customFormIds = temp.customFormIds.join();
                            temp.customTitle = temp.customTitle.join();
                            temp.customForms = temp.customForms.join();
                            var idx = _.findIndex(CalendarEventList, { formGroupKey: param.formGroupKey });
                            CalendarEventList[idx] = temp;
                        }
                    }
                } else {
                    notifierService.notifyMessage('info', 'Event', param.Message);
                }
            }

            //CalendarEventList = $.grep(CalendarEventList, function (e) {
            //    return e.Id != Id;
            //});

            //ActivityEventList = $.grep(ActivityEventList, function (e) {
            //    return e.Id != Id;
            //});
            var eventBasicData = window["EventBasicDetail"];
            window["CalendarEventList"] = CalendarEventList;
            //window["ActivityEventList"] = ActivityEventList;
            //console.log('after  deletion ');
            //console.log(CalendarEventList);
            //$('.calendar').fullCalendar('destroy');
            //  loadCalendar('BasicView', CalendarEventList);
            refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
        };
        $scope.deleteDimensionClick = function (item, itemData, event) {
            var param = {};
            param.formGroupKey = item.formGroupKey.toString();
            param.referrenceFormId = parseInt(itemData.formId.toString().trim());
            if (itemData.Id.toString() == "0")
                param.referrenceId = itemData.selectionDropdown.toString();
            else
                param.referrenceId = itemData.Id.toString();
            //$(event.parentElement.parentElement).find('.titleContainer').text('')
            param.Id = item.Id;
            $scope.deleteDimensionCalenderEvent(param, item);
        };
        $scope.deleteDimensionCalenderEvent = function (param, event) {
            var eventParam = angular.copy(param);

            var exists = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: eventParam.referrenceFormId });
            if (!DataService.isEmpty(exists)) {
                eventParam.Id = exists.Id;
            }
            eventParam.action = 9;
            //eventParam.formGroupKey = $scope.tabuListLink.formGroupKey;
            $rootScope.$emit("ShowLoading");
            mainService.getEventDetails("getEventDetails", eventParam)
                .then(function (response) {
                    //console.log(response);
                    var temp = response.data;
                    if (temp.length > 0) {
                        eventParam.res = temp[0].res;
                        eventParam.Message = temp[0].Message;
                        if (eventParam.res == -1) {
                            notifierService.notifyMessage('info', 'Event', eventParam.Message);
                            $rootScope.$emit("HideLoading");
                            return false;
                        }

                    }
                    if (eventParam.res == 1) {
                        var formIdIndex = -1;
                        formIdIndex = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == eventParam.referrenceFormId.toString() });
                        if (formIdIndex != -1) {
                            event.customFormsSplit.splice(formIdIndex, 1);
                            event.customTitleSplit.splice(formIdIndex, 1);
                            event.customFormIdsSplit.splice(formIdIndex, 1);
                            event.customFormIds = event.customFormIdsSplit.join();
                            event.customTitle = event.customTitleSplit.join();
                            event.customForms = event.customFormsSplit.join();
                            var existsIndex = _.findIndex(event.dropdownList, { formId: eventParam.referrenceFormId.toString() });
                            if (existsIndex != -1) {
                                event.dropdownList[existsIndex].selectionDropdown = "0";
                                event.dropdownList[existsIndex].customClass = "true";
                                var listActivities = _.findWhere($scope.xaxisFormList, { activitiesForm: parseInt(eventParam.referrenceFormId) });
                                if (!DataService.isEmpty(listActivities)) {
                                    event.dropdownList[existsIndex].formTitle = listActivities.title;
                                }
                            }
                        }

                        $scope.selectEventDetails = event;
                        $('.calendar').fullCalendar('updateEvent', $scope.selectEventDetails);
                        $timeout(function () {
                            removeTitleNew();
                        }, 280);
                    }
                    //reBindCalenderEvents(eventParam, 2);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.updateDimensionCalenderEventClick = function (d, selectionDropdown, selectEventDetails, event) {
            var param = {};
            param.formGroupKey = selectEventDetails.formGroupKey;
            param.referrenceFormId = d.formId;
            param.referrenceId = selectionDropdown;
            param.Id = selectEventDetails.Id;
            param.title = "";
            var exists = _.findWhere(d.dropdownListData.formDataList, { id: selectionDropdown });
            if (!DataService.isEmpty(exists)) {
                param.title = exists.title;
                d.Id = selectionDropdown;
            }
            //$(event.parentElement.parentElement).find('.title1').text(event.selectedOptions[0].innerText);
            //var $scope = angular.element($("#calendar")).scope();
            // param.innerText = event.selectedOptions[0].innerText;
            $scope.updateDimensionCalenderEvent(param, selectEventDetails);

        };
        $scope.updateDimensionCalenderEvent = function (param, event) {
            var eventParam = angular.copy(param);

            var exists = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: parseInt(eventParam.referrenceFormId) });
            if (!DataService.isEmpty(exists)) {
                eventParam.Id = exists.Id;
            }
            eventParam.action = 7;
            eventParam.start = event.start;
            eventParam.end = event.end;
            eventParam.formId = $scope.currentFormId;
            eventParam.created_by = $scope.userDetail.Id;
            eventParam.update_by = $scope.userDetail.Id;
            //eventParam.formGroupKey = $scope.tabuListLink.formGroupKey;
            $rootScope.$emit("ShowLoading");
            mainService.getEventDetails("getEventDetails", eventParam)
                .then(function (response) {
                    //console.log(response);
                    var temp = response.data;
                    if (temp.length > 0) {
                        eventParam.res = temp[0].res;
                        eventParam.Message = temp[0].Message;
                        if (eventParam.res == -1) {
                            notifierService.notifyMessage('info', 'Event', eventParam.Message);
                            $rootScope.$emit("HideLoading");
                            return false;
                        }
                    }
                    if (eventParam.res == 1) {
                        var formIdIndex = -1;
                        formIdIndex = _.findIndex(event.customFormsSplit, function (formIdString) { return formIdString.toString().trim() == eventParam.referrenceFormId.toString() });
                        if (formIdIndex != -1) {
                            event.customTitleSplit[formIdIndex] = eventParam.title;
                            event.customFormIdsSplit[formIdIndex] = eventParam.referrenceId;
                            event.customFormIds = event.customFormIdsSplit.join();
                            event.customTitle = event.customTitleSplit.join();
                            event.customForms = event.customFormsSplit.join();
                            var existsindx = _.findIndex(event.dropdownList, { formId: eventParam.referrenceFormId });
                            if (existsindx != -1) {
                                event.dropdownList[existsindx].formTitle = eventParam.title;
                                event.dropdownList[existsindx].customClass = "false";
                            }

                        } else {
                            var listActivities = _.findWhere($scope.xaxisFormList, { activitiesForm: parseInt(eventParam.referrenceFormId) });
                            if (!DataService.isEmpty(listActivities)) {
                                var existsindx = _.findIndex(event.dropdownList, { formId: eventParam.referrenceFormId });
                                if (existsindx != -1) {
                                    event.dropdownList[existsindx].formTitle = eventParam.title;
                                    event.dropdownList[existsindx].customClass = "false";
                                }
                            }
                            event.customFormsSplit.push(eventParam.referrenceFormId.toString());
                            event.customTitleSplit.push(eventParam.title);
                            event.customFormIdsSplit.push(eventParam.referrenceId);
                            event.customFormIds = event.customFormIdsSplit.join();
                            event.customTitle = event.customTitleSplit.join();
                            event.customForms = event.customFormsSplit.join();
                        }
                        $scope.selectEventDetails = event;
                        var eventData = window["CalendarEventList"];
                        var eIndex = eventData.findIndex(x => x.Id == event.Id);
                        if (eIndex != -1) {
                            eventData[eIndex] = event;
                            window["CalendarEventList"] = eventData;
                        }


                        $('.calendar').fullCalendar('updateEvent', $scope.selectEventDetails);
                        $('.closeSelect').click();
                        $timeout(function () {
                            removeTitleNew();
                        }, 280);
                    }


                    //reBindCalenderEvents(eventParam, 1);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.getTabulatorListFromEvents = function (param) {
            var newParam = {};
            newParam.action = 11;
            newParam.formTableColumnNameList = "";
            newParam.formTableColumnData = "";
            if ($scope.listTabulator.length > 0) {
                var temp = $scope.listTabulator[0];
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
            if ($scope.listTabulator.length > 0) {
                newParam.formTableColumnName = $scope.listTabulator[0].searchTextData;

            }

            newParam.formTableColumnData = newParam.formTableColumnData.substring(0, newParam.formTableColumnData.length - 4);
            newParam.formTableColumnNameList = newParam.formTableColumnNameList.substring(0, newParam.formTableColumnNameList.length - 1);

            //$rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            $scope.tabuListLink = newParam;
            $scope.selectedTabulatorList = [];

            $("#strongFormName").remove();


            /* get Student List from one to many controls based*/
            var paramTemp = {};
            paramTemp.action = 4;
            $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
            if (!DataService.isEmpty($scope.tabuListLink.formId))
                paramTemp.formId = $scope.tabuListLink.formId;
            else
                paramTemp.formId = $scope.formDetailsDataInfo.otherformid;
            paramTemp.Id = param.selectedId;
            paramTemp.formGroupKey = $scope.formGroupKey;
            paramTemp.formGroupKey = $scope.tabuListLink.formGroupKey;
            if (paramTemp.formId == "0" || paramTemp.formId == 0 || paramTemp.formId == "" || paramTemp.formId == undefined || paramTemp.formId == null) {
                paramTemp.formId = 0;
                //return false;
            }
            loadEventRecordDetails(paramTemp);
            // $scope.manageOneToManyControl(paramTemp);


            $rootScope.safeApply();

            // one to many form control           

            //$scope.manageOneToManyControl(paramTemp);
            //$scope.GetTabOneToManyDynamimc(paramTemp, paramTemp.action);

            //mainService.getFormRecordList("GetFormRecordList", newParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            console.log(response.data)
            //            var formDataTemp = response.data;
            //            $scope.listTabulator[0].formData = formDataTemp;
            //            $scope.listTabulator[0].fieldValidationRuleParse = JSON.parse(temp.fieldValidationRule);
            //            $scope.listTabulator[0].reference_form = newParam.formId;
            //            $scope.listTabulator[0].formDataTemp = angular.copy(formDataTemp);

            //            if (!DataService.isEmpty(formDataTemp)) {
            //                $("#tabuList").empty();
            //                $("#tabuList").append('<strong>' + $scope.listTabulator[0].fieldLabel + '</strong>');
            //                $("#tabuListUl").empty();
            //                _.each($scope.listTabulator[0].formData, function (item) {
            //                    $("#tabuListUl").append('<li><a>' + item.dname + '</a></li>');
            //                });
            //                $("#tabuList").append("<a class='btn btn-primary edit-event' id='tabuListLink' style=' float: right;' title='Edit'> Edit</i></a>");
            //                var newWindow = mainService.getBaseUrl() + "#/form/saveEntry/" + newParam.formId + "?popup=1";



            //                //$("#tabuListLink").attr("href", newWindow);


            //            } else {
            //                $("#tabuListLink").hide();
            //                $("#tabuList").hide();
            //                $("#tabuListUl").hide();
            //            }

            //            $rootScope.safeApply();
            //        }

            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $("#tabuListLink").hide();
            //        $rootScope.$emit("HideLoading");
            //        //console.log("some error occured." + err);
            //    });
        };
        $scope.openFormEntry = function (temp) {
            //console.log('openFormEntry');
            var formId = temp.formId;
            //var params = windowParams();
            var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        loadEventTabulator();
                    }, 150);
                }
            }, 500);
        };
        $scope.openFormEntryForCalenderOtherFormBased = function (temp) {
            //console.log('openFormEntry');
            var formId = temp.formId;
            var formGroupKey = temp.formGroupKey;
            var parentID = temp.parentID;
            //var params = windowParams();
            var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            var eventId = $scope.tabuListLink.selectedId;
            var customForms = ''
            var customFormIds = ''
            var type = '';
            newWindow = window.open(baseUrl + "#/form/saveEvent/" + formId + "/" + formGroupKey + "/" + eventId + '?popup=1&type=' + type + '&customForms=' + customForms + '&customFormIds=' + customFormIds + '&parentFormId=' + parentID + '', 'example', params, true);
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        var paramTemp = {};
                        paramTemp.action = 10;
                        paramTemp.formGroupKey = formGroupKey;
                        paramTemp.formId = formId;
                        loadEventRecordDetails(paramTemp)
                    }, 150);
                }
            }, 500);
        };
        function loadEventTabulator() {
            window["tabulators"] = {};
            var form_id = $scope.tabuListLink.formId;
            loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform")
            $rootScope.safeApply();
            $rootScope.$emit("ShowLoading");
            // one to many form control           
            if (!DataService.isEmpty(form_id)) {
                $timeout(function () {
                    if ($("#form-table").length) {
                        window["popupTabulator"] = initTabulator("form-table", {
                            selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1,
                            cellEdited: function (cell) {
                                //This callback is called any time a cell is edited
                                var columnName = cell.getColumn().getField();
                                var param = {};
                                var formId = $scope.tabuListLink.formId;
                                param.fieldName = columnName;
                                param.formId = formId;
                                param.fieldDataText = "" + cell.getValue().toString() + "";
                                param.Id = cell.getRow().getData().Id;
                                $scope.updateRowDataRecord(param);



                            }

                        });

                        saveEventModelpopTabulator();
                    }
                    var param = {};
                    param.action = 10;
                    param.formId = form_id;
                    param.formGroupKey = $scope.tabuListLink.formGroupKey;
                    param.Id = $scope.tabuListLink.selectedId;
                    param.parentID = $scope.currentFormId;
                    param.fieldName = "";
                    mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                        .then(function (response) {
                            $scope.allReferrenceData = response.data;

                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
                            var isCalender = false;
                            if (!DataService.isEmpty($scope.allReferrenceData.formDataHeaders)) {
                                var firstName = $scope.allReferrenceData.formDataHeaders[0];
                                $scope.allReferrenceData.groupColumns.name = firstName.field;
                                var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: $scope.currentFormId });
                                if (!DataService.isEmpty(exists)) {
                                    isCalender = true;
                                    $scope.allReferrenceData.Referral_Form_Fields_Multiple_name = exists.field;
                                }
                            }

                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;

                            if (isCalender) {
                                _.each($scope.formDataTabulatorTempWithoutGroupBy, function (item) {

                                    if (!DataService.isEmpty($scope.allReferrenceData.Referral_Form_Fields_Multiple_name)) {
                                        var splitData = item[$scope.allReferrenceData.Referral_Form_Fields_Multiple_name];
                                        if (splitData.contains("#jMS#")) {
                                            splitData = splitData.split("#jMS#");
                                            var datetimeStartEnd = "";
                                            _.each(splitData, function (spItem) {
                                                datetimeStartEnd += $rootScope.ToCustomDateTime(spItem) + " to ";
                                            });
                                            datetimeStartEnd = datetimeStartEnd.substring(0, datetimeStartEnd.length - 3);
                                            item[$scope.allReferrenceData.Referral_Form_Fields_Multiple_name] = datetimeStartEnd;
                                        }
                                    }
                                });
                            }

                            $timeout(function () {
                                if (!DataService.isEmpty($scope.formDataTabulatorTempWithoutGroupBy))
                                    if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                        $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");
                                window["popupTabulator"].setColumns(bindTColumnHeaderTabulator($scope.allReferrenceData.formDataHeaders));
                                if (!DataService.isEmpty($scope.formDataTabulatorTempWithoutGroupBy))
                                    window["popupTabulator"].setData($scope.formDataTabulatorTempWithoutGroupBy);

                                getSelectedRows();


                                $("input[name='modal-one-to-many']").val("1");
                                var modal_field_map = "{";
                                _.each($scope.allReferrenceData.groupColumns, function (item, key) {
                                    if (key != "name")
                                        modal_field_map += "'" + key + "':'" + key + "',";
                                    else
                                        modal_field_map += "'" + key + "':'" + item + "',";
                                });
                                modal_field_map = modal_field_map.substring(0, modal_field_map.length - 1);
                                modal_field_map += "}"
                                modal_field_map = modal_field_map.replace(/'/g, '"');
                                $("input[name='modal-field-map']").val(modal_field_map);
                                $("input[name='tabulator-id']").val($scope.tabuListLink.fieldName);
                                window["tabulators"]["formGeneratorTabulator" + $scope.tabuListLink.fieldName] = window["popupTabulator"];
                                $rootScope.$emit("HideLoading");
                            }, 150);
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }, 450);
            }
        };
        function onAddTag(e) {
            //console.log("onAddTag: ", e.detail.data["Id"]);
            var indx = window["popupTabulatorstudent"].getRows()
                .findIndex(row => row.getData().Id.toString() == e.detail.data["Id"])
            //window["popupTabulatorstudent"].selectRow(e.detail.data["Id"]);
            // $scope.tagify.off('add', onAddTag);
            var temp = {};
            temp.Id = e.detail.data["Id"];
            temp.value = e.detail.data["value"];
            const index = $scope.selectedRecords.map(function (e) { return e.Id; }).indexOf(temp.Id);
            if (index < 0) {
                $scope.selectedRecords.push(temp);
                $scope.tagify.addTags([temp]);
                window["popupTabulatorstudent"].getRows()[indx].toggleSelect();

            }

        };
        function onRemoveTag(e) {
            console.log("onRemoveTag:", e.detail);
            var temp = e.detail.data;
            const index = $scope.selectedRecords.map(function (e) { return e.Id; }).indexOf(temp.Id);
            if (index >= 0) {
                $scope.selectedRecords.splice(index, 0);
            }
            var indx = window["popupTabulatorstudent"].getRows()
                .findIndex(row => row.getData().Id.toString() == e.detail.data["Id"])
            window["popupTabulatorstudent"].getRows()[indx].toggleSelect()

        };
        function onInput(e) {
            $scope.tagify.settings.whitelist.length = 0; // reset current whitelist
            $scope.tagify.loading(true) // show the loader animation

            // get new whitelist from a delayed mocked request (Promise)
            $scope.mockAjax()
                .then(function (result) {
                    // replace tagify "whitelist" array values with new values
                    // and add back the ones already choses as Tags
                    $scope.tagify.settings.whitelist.push(...result, ...$scope.tagify.value)

                    $scope.tagify
                        .loading(false)
                        // render the suggestions dropdown.
                        .dropdown.show.call($scope.tagify, e.detail.value);
                })
                .catch(err => $scope.tagify.dropdown.hide.call($scope.tagify))
        };
        $('body').on('click', '.tagify__tag__removeBtn', function () {
            var id = $(this).closest('tag').attr('id');
            if (!DataService.isEmpty(window["popupTabulatorstudent"])) {
                var indx = window["popupTabulatorstudent"].getRows()
                    .findIndex(row => row.getData().Id.toString() == id);
                //console.log(indx, id);
                window["popupTabulatorstudent"].getRows()[indx].toggleSelect();
            }
        });
        function loadStudentTabulator() {

            if (!DataService.isEmpty($scope.otherformDetails)) {
                var form_id = $scope.otherformDetails.formId;
                $scope.selectedRecords = [];

                loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform")
                $rootScope.safeApply();
                $rootScope.$emit("ShowLoading");
                // one to many form control           
                if (!DataService.isEmpty(form_id)) {
                    $timeout(function () {
                        if ($("#form-tableStudent").length) {
                            // var tags = [];
                            $scope.input = document.querySelector('input[name=selectedrec]');

                            $scope.whitelist = [];
                            $scope.tagify = new Tagify($scope.input,
                                {
                                    skipInvalid: true,
                                    duplicates: false,
                                    editTags: false
                                });
                            // var tagify = new Tagify($scope.input, {
                            //     tagTextProp: 'value',
                            //     duplicates: false,
                            //     editTags: false,
                            //     enforceWhitelist: true,
                            //     searchKeys: ['value'],
                            //     skipInvalid: true,
                            //     whitelist: $scope.input.value.trim().split(/\s*,\s*/)//,
                            // });
                            $scope.tagify
                                .on('input', onInput)
                                //    .on('remove', onRemoveTag)
                                .on('add', onAddTag);

                            $scope.mockAjax = (function mockAjax() {
                                var timeout;
                                return function (duration) {
                                    clearTimeout(timeout); // abort last request
                                    return new Promise(function (resolve, reject) {
                                        timeout = setTimeout(resolve, duration || 700, $scope.whitelist)
                                    })
                                }
                            })()
                            window["popupTabulatorstudent"] = initTabulator("form-tableStudent", {
                                selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1,
                                //rowClick: function (e, row) {
                                //    //$(e.target).closest('.tabulator-table').find('.tabulator-row').is('.tabulator-selected');

                                //    //console.log(e, 'event');
                                //    //console.log(row, 'row');
                                //    $scope.selectedRecords = row.getData().text_1596623826409;
                                //    var n = row.getData().text_1596623826409;

                                //    tags.push(n);
                                //    selectedRecords.push(n);
                                //    $scope.selectedRecords = selectedRecords;
                                //    tagify.addTags(tags);

                                //},
                                rowSelected: function (row) {
                                    var fieldName = $('#form-tableStudent').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field')

                                    var obj = row.getData();
                                    var n = obj[fieldName];
                                    $scope.tags = [];
                                    $scope.tags.push(n);
                                    var temp = {};
                                    temp.Id = obj["Id"];
                                    temp.value = obj[fieldName];
                                    const index = $scope.selectedRecords.map(function (e) { return e.Id; }).indexOf(temp.Id);
                                    if (index < 0) {
                                        $scope.selectedRecords.push(temp);
                                        $scope.tagify.addTags([temp]);
                                    }


                                },
                                rowDeselected: function (row) {
                                    var fieldName = $('#form-tableStudent').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field')
                                    var obj = row.getData();
                                    // const index = $scope.selectedRecords.indexOf(obj[fieldName]);
                                    var temp = {};
                                    temp.Id = obj["Id"];
                                    temp.value = obj[fieldName];
                                    const index = $scope.selectedRecords.map(function (e) { return e.Id; }).indexOf(temp.Id);

                                    if (index > -1) {
                                        $scope.selectedRecords.splice(index, 1);
                                        $scope.tagify.removeTag(temp.value);
                                    }
                                },
                            });

                            saveEventStudentModelpopTabulator();
                        }

                        var param = {};
                        param.action = 2;
                        param.formId = form_id;
                        param.primaryFormId = $scope.tabuListLink.formId;
                        //param.formGroupKey = $scope.tabuListLink.formGroupKey;
                        param.fieldName = "";
                        param.IsCustomFilter = true;
                        param.CustomFilters = [{ "FieldName": "COMPANY_CODE", "Value": localStorage.getItem("COMPANY_CODE") }, { "FieldName": "CALENDAR_CODE", "Value": localStorage.getItem("CALENDAR_CODE") }];

                        mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                            .then(function (response) {
                                //console.log(response);
                                $scope.allReferrenceData = response.data;
                                $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
                                if (!DataService.isEmpty($scope.allReferrenceData.formDataHeaders)) {
                                    var firstName = $scope.allReferrenceData.formDataHeaders[0];
                                    $scope.allReferrenceData.groupColumns.name = firstName.field;
                                }
                                $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                                //console.log($scope.formDataTabulatorTempWithoutGroupBy, 'allReferrenceData')
                                //console.log($scope.allReferrenceData.formDataHeaders, 'Header')

                                $("#addTransactionRecordTabulatorModal input[name=formID]").val(param.formId);
                                //if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                // $("#addTransactionRecordTabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulatorstudent"].setHeight("450px");
                                window["popupTabulatorstudent"].setColumns(bindTColumnHeaderTabulator($scope.allReferrenceData.formDataHeaders));
                                window["popupTabulatorstudent"].setData($scope.formDataTabulatorTempWithoutGroupBy);
                                var rows = window["popupTabulatorstudent"].getRows();
                                var fieldName = $('#form-tableStudent').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field');
                                _.each(rows, function (row) {
                                    //console.log(row.getData(), 'itm')
                                    var obj = row.getData();
                                    var temp = {};
                                    temp.Id = obj["Id"];
                                    temp.value = obj[fieldName];

                                    $scope.whitelist.push(temp);
                                });

                                $("input[name='modal-one-to-many']").val("1");
                                var modal_field_map = "{";
                                _.each($scope.allReferrenceData.groupColumns, function (item, key) {
                                    if (key != "name")
                                        modal_field_map += "'" + key + "':'" + key + "',";
                                    else
                                        modal_field_map += "'" + key + "':'" + item + "',";
                                });
                                modal_field_map = modal_field_map.substring(0, modal_field_map.length - 1);
                                modal_field_map += "}";
                                modal_field_map = modal_field_map.replace(/'/g, '"');
                                $("input[name='modal-field-map']").val(modal_field_map);
                                $("input[name='tabulator-id']").val($scope.tabuListLink.fieldName);
                                //window["tabulators"]["formGeneratorTabulator" + $scope.tabuListLink.fieldName] = window["popupTabulator"];





                                $rootScope.$emit("HideLoading");


                            },
                                function (err) {
                                    $rootScope.$emit("HideLoading");
                                    console.log("some error occured." + err);
                                });
                        $timeout(function () {
                            var paramNew = {};
                            paramNew.action = 2;
                            paramNew.formId = form_id;
                            paramNew.primaryFormId = $scope.tabuListLink.formId;
                            paramNew.formGroupKey = $scope.tabuListLink.formGroupKey;
                            $.getJSON($scope.currentUrl + "/getReferralFormFieldsAndDataGET?actionid=2&formID=" + paramNew.primaryFormId + "&formGroupKey=" + paramNew.formGroupKey + "", function (data) {
                                var selectedData = data;
                                //console.log(selectedData);
                                var exist = _.findWhere(selectedData.formDataHeaders, { "Referral_Forms": $scope.otherformDetails.formId.toString() });
                                if (!DataService.isEmpty(exist)) {
                                    $scope.selectedKeyField = exist.field;
                                    $scope.selectedTabulatorListStudent = selectedData.formDataListNew;
                                }
                                $timeout(function () {
                                    getSelectedStudentRows();
                                }, 150);
                            });
                        }, 150);


                    }, 450);
                }
            }
        };
        function saveEventStudentModelpopTabulator() {
            /* Save Selected Student*/

            $("#get-tabulator-valuescalender").click(function () {
                var formID = $("#addTransactionRecordTabulatorModal input[name=formID]").val();
                var oneToMany = $("#addTransactionRecordTabulatorModal input[name='modal-one-to-many']").val();
                $rootScope.onetomany = $("#addTransactionRecordTabulatorModal input[name='modal-one-to-many']").val();
                var selectedRows = window["popupTabulatorstudent"].getSelectedRows();

                ////console.log(selectedRows);
                var existsCourse = {};
                var fees_1 = 0;
                if (selectedRows.length > 0) {
                    var selectedData = window["popupTabulatorstudent"].getSelectedData();
                    selectedRecordOneToMany = selectedData;
                    if ($scope.isCourseForm == true && $scope.courseFormId != 0) {
                        existsCourse = _.findWhere($scope.eventData.currentEventCalenderReferrenceList, { referrenceFormId: $scope.courseFormId });
                        if (!DataService.isEmpty(existsCourse)) {
                            var existsCourse1 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.courseFormId });
                            if (!DataService.isEmpty(existsCourse1)) {
                                var feesExists = _.findWhere(existsCourse1.formDataList, { id: existsCourse.referrenceId });
                                if (!DataService.isEmpty(feesExists))
                                    fees_1 = feesExists.fees_1;
                            }
                        }
                        else {

                        }
                    }

                    ////console.log(selectedData);
                    if (oneToMany === '1') {
                        var tabulatorId = $("#addTransactionRecordTabulatorModal input[name='tabulator-id']").val();
                        var fieldMap = $("#addTransactionRecordTabulatorModal input[name='modal-field-map']").val();
                        if (fieldMap != "" && fieldMap.length > 0)
                            fieldMap = JSON.parse(fieldMap);
                        ////console.log(fieldMap);
                        var newTabulator = "formGeneratorTabulator" + tabulatorId;
                        var cols = getTabulatorColDefs(window["popupTabulatorstudent"], 1);
                        ////console.log(cols);
                        var recordArr = [];
                        selectedData.forEach(function (data) {
                            var record = {};
                            for (var i = 0; i < cols.length; i++) {
                                // master column
                                var master_column = 'RowID-' + cols[i];
                                if ($.inArray(master_column, cols) !== -1) {
                                    record[master_column] = data.id;
                                }
                                if (typeof fieldMap[cols[i]] !== 'undefined') {
                                    record[cols[i]] = data[fieldMap[cols[i]]];
                                }
                                else {
                                    record[cols[i]] = (typeof record[cols[i]] === 'undefined') ? "" : record[cols[i]];
                                }
                                record[cols[i]] = record[cols[i]];
                            }
                            //record['id'] = makeid(16);   
                            if (!DataService.isEmpty(fieldMap["name"]))
                                record['name'] = data[fieldMap["name"]];
                            // record['Id'] = data.Id;
                            record['Id'] = data.Id;
                            if (fees_1 != 0) {
                                record[$scope.courseFormId + "_FeesId"] = existsCourse.referrenceId;
                                record[$scope.courseFormId + "_Fees_1"] = fees_1;
                            }
                            record[data.formID + "_RowId"] = data.Id;
                            record[$scope.formDetailsDataInfo.formId + "_RowId"] = $scope.tabuListLink.selectedId;
                            record['formGroupKey'] = localStorage.getItem("formGroupKey");
                            record['formId'] = data.formID;
                            record['userID'] = data.userID;
                            record['AutoId'] = data.AutoID;
                            record['created_at'] = formatTime();
                            record['updated_at'] = formatTime();
                            record['edit_row'] = "<i class='fa fa-pencil fa-lg';></i>";
                            //record['edit_row'] = "<img src='" + ASSET_URL + "assets/images/pencil.png' width='15'>";
                            recordArr.push(record);
                        });
                        //savePopUpRecords(recordArr);
                        var recordArrTemp = recordArr[0];
                        //var exists = localStorage.getItem("tabulatorOnetomany-" + recordArrTemp.formID);
                        //if (angular.isDefined(exists) && exists != null && exists!="") {
                        //    var temp = JSON.parse(exists);
                        //    temp.push(recordArr);
                        //    localStorage.setItem("tabulatorOnetomany-" + recordArrTemp.formID, JSON.stringify(temp));
                        //} else {
                        //    localStorage.setItem("tabulatorOnetomany-" + recordArrTemp.formID, JSON.stringify(recordArr));
                        //}
                        var param = {};
                        param = recordArrTemp;
                        param.formfieldDataListTemp = JSON.stringify(recordArr);
                        param.action = 1;
                        param.tabularId = newTabulator;
                        param.formId = $scope.tabuListLink.formId;
                        param.formGroupKey = $scope.tabuListLink.formGroupKey;
                        $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
                        $scope.manageCalenderReferrenceControl(param);
                        //$scope.GetTabOneToManyDynamimc(param, param.action);
                        ////console.log(recordArr);

                    } else {
                        var recordArr = getTabulatorColDefs(window["popupTabulatorstudent"], 2);
                        selectedData.forEach(function (data) {
                            $.each(data, function (key, value) {
                                if (key === 'id') {
                                    recordArr[key] = value;
                                } else {
                                    if (typeof recordArr[key] !== 'undefined') {
                                        if (typeof recordArr[key]['data'] === 'undefined') {
                                            recordArr[key]['data'] = [];
                                            recordArr[key]['data'].push(value);
                                        } else {
                                            recordArr[key]['data'].push(value);
                                        }
                                    }
                                }
                            });
                        });
                        var records = {};
                        for (var field in recordArr) {
                            if (selectedRows.length > 1) {
                                if ($.inArray(recordArr[field].type, ['text', 'autocomplete', 'date', 'select', 'radio-group', 'checkbox-group', 'file']) !== -1) {
                                    records[field] = recordArr[field].data.join(' | ');
                                }
                                else if (recordArr[field].type === 'textarea') {
                                    records[field] = recordArr[field].data.join('\n\n');
                                }
                                else if (recordArr[field].type === 'number') {
                                    records[field] = recordArr[field].data.reduce(getSum);
                                }
                            } else {
                                if (field != "undefined")
                                    if (typeof recordArr[field] === 'string') {
                                        records[field] = recordArr[field];
                                    }
                                    else {
                                        records[field] = recordArr[field].data[0];
                                    }
                            }
                        }
                        selectedRecordOneToMany
                        ////console.log(records);
                        $.each(records, function (i, value) {
                            if ($("input#RowID-" + i).length) {
                                $("input#RowID-" + i).val($.trim(records['id']));
                            }
                            $("input[data-derived='" + i + "']").val(value).change();
                            $("input[data-referral-form-field-name='" + i + "']").val(value);
                            $('#customFormNew').formValidation('revalidateField', $("input[data-derived='" + i + "']").attr('name'));
                            $('#customFormNew').formValidation('revalidateField', $("input[data-referral-form-field-name='" + i + "']").attr('name'));
                            if ($("div#" + i).length) {
                                file_default_value(i, value, uploadPath);
                            }
                            set_reference_field(formID, i, value);
                        });
                    }
                    //$("body .popover").addClass('isPopoverLoaded');
                    // $('#addTransactionRecordTabulatorModal').modal('hide');
                }
                else {


                    alert("Please select some records in tabulator!!");
                }
            });
        };
        function getSelectedRows() {
            if (!DataService.isEmpty($scope.selectedTabulatorList)) {
                _.each($scope.selectedTabulatorList, function (item) {
                    window["popupTabulator"].getRows()
                        .filter(row => row.getData().Id == item.Id)
                        .forEach(row => row.select());
                });
            }
        };
        function getSelectedStudentRows() {
            // $scope.whitelist = [];
            var rows = window["popupTabulatorstudent"].getRows();
            var fieldName = $('#form-tableStudent').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field');

            //_.each(rows, function (row) {
            //    console.log(row.getData(), 'itm')
            //    var obj = row.getData();
            //    var temp = {};
            //    temp.Id = obj["Id"];
            //    temp.value = obj[fieldName];
            //    $scope.whitelist.push(temp);
            //});
            if (!DataService.isEmpty($scope.selectedTabulatorListStudent)) {
                _.each($scope.selectedTabulatorListStudent, function (item) {
                    window["popupTabulatorstudent"].getRows()
                        .filter(row => row.getData().Id.toString() == item[$scope.selectedKeyField])
                        .forEach(row => row.toggleSelect());
                });
            }
        };
        function saveEventModelpopTabulator() {
            /* Save Selected Student*/

            $("#get-tabulator-valuescalender").click(function () {
                $rootScope.$emit("ShowLoading");
                var formID = $("#tabulatorModal input[name=formID]").val();
                var oneToMany = $("#tabulatorModal input[name='modal-one-to-many']").val();
                $rootScope.onetomany = $("#tabulatorModal input[name='modal-one-to-many']").val();
                var selectedRows = window["popupTabulator"].getSelectedRows();
                console.log(selectedRows, 'selectedRows');
                if (selectedRows.length > 0) {
                    var selectedData = window["popupTabulator"].getSelectedData();
                    selectedRecordOneToMany = selectedData;
                    ////console.log(selectedData);
                    if (oneToMany === '1') {
                        var tabulatorId = $("#tabulatorModal input[name='tabulator-id']").val();
                        var fieldMap = $("#tabulatorModal input[name='modal-field-map']").val();
                        if (fieldMap != "" && fieldMap.length > 0)
                            fieldMap = JSON.parse(fieldMap);
                        ////console.log(fieldMap);
                        var newTabulator = "formGeneratorTabulator" + tabulatorId;
                        var cols = getTabulatorColDefs(window["popupTabulator"], 1);
                        ////console.log(cols);
                        var recordArr = [];
                        selectedData.forEach(function (data) {
                            var record = {};
                            for (var i = 0; i < cols.length; i++) {
                                // master column
                                var master_column = 'RowID-' + cols[i];
                                if ($.inArray(master_column, cols) !== -1) {
                                    record[master_column] = data.id;
                                }

                                if (typeof fieldMap[cols[i]] !== 'undefined') {
                                    record[cols[i]] = data[fieldMap[cols[i]]];
                                } else {
                                    record[cols[i]] = (typeof record[cols[i]] === 'undefined') ? "" : record[cols[i]];
                                }
                                record[cols[i]] = record[cols[i]];
                            }

                            //record['id'] = makeid(16);   
                            if (!DataService.isEmpty(fieldMap["name"]))
                                record['name'] = data[fieldMap["name"]];
                            record['Id'] = data.Id;
                            record['formGroupKey'] = localStorage.getItem("formGroupKey");
                            record['formId'] = data.formID;
                            record['userID'] = data.userID;
                            record['AutoId'] = data.AutoID;
                            record['created_at'] = formatTime();
                            record['updated_at'] = formatTime();
                            record['edit_row'] = "<i class='fa fa-pencil fa-lg';></i>";
                            //record['edit_row'] = "<img src='" + ASSET_URL + "assets/images/pencil.png' width='15'>";
                            recordArr.push(record);
                        });
                        //savePopUpRecords(recordArr);
                        var recordArrTemp = recordArr[0];
                        //var exists = localStorage.getItem("tabulatorOnetomany-" + recordArrTemp.formID);
                        //if (angular.isDefined(exists) && exists != null && exists!="") {
                        //    var temp = JSON.parse(exists);
                        //    temp.push(recordArr);
                        //    localStorage.setItem("tabulatorOnetomany-" + recordArrTemp.formID, JSON.stringify(temp));
                        //} else {
                        //    localStorage.setItem("tabulatorOnetomany-" + recordArrTemp.formID, JSON.stringify(recordArr));
                        //}
                        var param = {};
                        param = recordArrTemp;
                        param.formfieldDataListTemp = JSON.stringify(recordArr);
                        param.action = 1;
                        param.tabularId = newTabulator;
                        $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
                        $scope.manageCalenderReferrenceControl(param);
                        //$scope.GetTabOneToManyDynamimc(param, param.action);
                        ////console.log(recordArr);

                    } else {
                        var recordArr = getTabulatorColDefs(window["popupTabulator"], 2);
                        selectedData.forEach(function (data) {
                            $.each(data, function (key, value) {
                                if (key === 'id') {
                                    recordArr[key] = value;
                                } else {
                                    if (typeof recordArr[key] !== 'undefined') {
                                        if (typeof recordArr[key]['data'] === 'undefined') {
                                            recordArr[key]['data'] = [];
                                            recordArr[key]['data'].push(value);
                                        } else {
                                            recordArr[key]['data'].push(value);
                                        }
                                    }
                                }
                            });
                        });

                        var records = {};
                        for (var field in recordArr) {
                            if (selectedRows.length > 1) {
                                if ($.inArray(recordArr[field].type, ['text', 'autocomplete', 'date', 'select', 'radio-group', 'checkbox-group', 'file']) !== -1) {
                                    records[field] = recordArr[field].data.join(' | ');
                                }
                                else if (recordArr[field].type === 'textarea') {
                                    records[field] = recordArr[field].data.join('\n\n');
                                }
                                else if (recordArr[field].type === 'number') {
                                    records[field] = recordArr[field].data.reduce(getSum);
                                }
                            } else {
                                if (field != "undefined")
                                    if (typeof recordArr[field] === 'string') {
                                        records[field] = recordArr[field];
                                    } else {
                                        records[field] = recordArr[field].data[0];
                                    }
                            }
                        }
                        selectedRecordOneToMany
                        ////console.log(records);
                        $.each(records, function (i, value) {
                            if ($("input#RowID-" + i).length) {
                                $("input#RowID-" + i).val($.trim(records['id']));
                            }
                            $("input[data-derived='" + i + "']").val(value).change();
                            $("input[data-referral-form-field-name='" + i + "']").val(value);
                            $('#customFormNew').formValidation('revalidateField', $("input[data-derived='" + i + "']").attr('name'));
                            $('#customFormNew').formValidation('revalidateField', $("input[data-referral-form-field-name='" + i + "']").attr('name'));
                            if ($("div#" + i).length) {
                                file_default_value(i, value, uploadPath);
                            }
                            set_reference_field(formID, i, value);
                        });
                    }

                    $('#tabulatorModal').modal('hide');
                } else {
                    alert("Please select some records in tabulator!!");
                }
            });
        };
        $scope.GetTabOneToManyDynamimc = function (param, type) {
            if (!$scope.isEdit && type == 1) {
                param.action = 1;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 2) {
                param.action = 2;
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 3) {
                param.action = 3;
            }
            else if (type == 4) {
                //param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 5 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.AutoId = $stateParams.Id;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 7 && $scope.isEdit == true) {
                //var temp = $("#customFormNew").serializeArray();
                param.action = 2;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", newParam)
                .then(function (response) {
                    $rootScope.$emit("HideLoading");
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var tempTabulatorData = response.data;
                        if (newParam.action == 4 || newParam.action == 1) {

                            var dataArray = [];
                            var oneToManyTempData = [];
                            if (!DataService.isEmpty(tempTabulatorData)) {
                                angular.forEach(tempTabulatorData, function (item) {
                                    if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                        var tempData = JSON.parse(item.formfieldDataListTemp)
                                        if (!DataService.isEmpty(tempData)) {
                                            if (tempData.length > 1) {
                                                //tempData.push({
                                                //    "name": "AutoId", "value": item.AutoId
                                                //});
                                                oneToManyTempData = tempData;
                                            } else if (tempData.length == 1) {
                                                //tempData[0].AutoId = item.AutoId;
                                                dataArray.push(tempData[0]);
                                                oneToManyTempData = tempData;
                                            }
                                        }
                                    }
                                });
                                if (!DataService.isEmpty(oneToManyTempData)) {
                                    $("#tabuListUl").empty();
                                    angular.forEach(oneToManyTempData, function (filterData) {
                                        //angular.forEach(filterData, function (item) {    
                                        if (!DataService.isEmpty($scope.tabuListLink.searchTextData) && filterData.name.toLowerCase().indexOf($scope.tabuListLink.searchTextData.toLowerCase()) != -1) {
                                            $("#tabuListUl").append('<li><span>' + filterData.name + ' (ID: ' + filterData.Id + ')</span></li>');
                                        }
                                        if (DataService.isEmpty($scope.tabuListLink.searchTextData)) {
                                            $("#tabuListUl").append('<li><span>' + filterData.name + ' (ID: ' + filterData.Id + ') </span></li>');
                                        }
                                        // });                                      
                                    });
                                    $("#tabuList").empty();
                                    $("#tabuList").append('<strong id="strongFormName">' + oneToManyTempData.length + ' Students in this lesson</strong>');
                                } else {
                                    $("#tabuList").empty();
                                    $("#tabuList").append('<strong id="strongFormName">0 Students in this lesson</strong>');
                                }



                                $scope.selectedTabulatorList = angular.copy(oneToManyTempData);
                                // $scope.formDetailsDataTemp = angular.copy(dataArray);
                                $timeout(function () {
                                    $("#tabuListUl").css("display", "block");
                                }, 100);
                            }
                            else {
                                $("#tabuList").append('<strong id="strongFormName">0 Students in this lesson</strong>');
                            }
                            //console.log(tempTabulatorData);
                            if (!$("body .popover").hasClass("isPopoverLoaded")) {
                                $("#tabuListLink").on("click", function () {
                                    var dialog = $ngBootbox.customDialog({
                                        templateUrl: 'tabulatorModal.html',
                                        scope: $scope,
                                        title: 'Student',
                                        size: "large"
                                    });
                                    loadEventTabulator();
                                    $("body .popover").removeClass('isPopoverLoaded');
                                });
                            }
                        }
                        else if (newParam.action == 5 && $stateParams.popup == 3) {
                            var tempParam = response.data;
                            if (tempParam.length > 0) {
                                var tempData = JSON.parse(tempParam[0].formfieldDataListTemp);
                                $scope.formDataList = tempData;
                            }
                            $scope.bindUpdateControlsNew();
                        }
                        else if (newParam.action == 2) {
                            //var exists = tempTabulatorData[0];
                            //notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                        }
                        else if (newParam.action == 3) {
                            var exists = tempTabulatorData[0];
                            var temp = {};
                            temp = $scope.formDetailsDataTemp;
                            angular.forEach(window["AutoIdList"], function (item) {
                                //temp = _.findWhere($scope.formDetailsDataTemp, { AutoId: item })
                                var idx = _.findIndex(temp, { Id: item });
                                if (angular.isDefined(temp))
                                    temp.splice(idx, 1);
                            });
                            $timeout(function () {
                                if (DataService.isEmpty(temp))
                                    temp = [];
                                tabulator.setData(temp);
                            }, 150);

                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                        }
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (newParam.action != 4)
                            if (!DataService.isEmpty(param.tabularId))
                                setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);


                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.selectAll = function () {
            window["popupTabulator"].selectRow();
            console.log(window["popupTabulator"].getSelectedRows());
            console.log(window["popupTabulator"].getSelectedData());
            //var columnName = cell.getColumn().getField();
            //var param = {};
            //var formId = $scope.tabuListLink.formId;
            //param.fieldName = columnName;
            //param.formId = formId;
            //param.fieldDataText = "" + cell.getValue().toString() + "";
            //param.Id = cell.getRow().getData().Id;
            //$scope.updateRowDataRecord(param);
        };
        $scope.deSelectAll = function () {
            window["popupTabulator"].deselectRow();
        };
        var radioEditor = function (cell, onRendered, success) {
            var role = cell.getRow().getData();
            //console.log(role, 'role');
            var dropdown = "<select id='radioGroup'>"
            var options = "<option value='0' id='val_'></option>"
            //options = options + `<option value='nnn' id='Yes01'>Yes</option>`;
            angular.forEach($scope.optionValues, function (item) {
                options = options + `<option value='${item.value}' id='val_${item.value}'>${item.label}</option>`;

            });
            var editor3 = $(dropdown + options + "</select>");
            editor3.css({ "padding": "6px", "width": "100%", "box-sizing": "border-box" });
            //Set value of editor to the current value of the cell
            editor3.val((cell.getValue()) ? cell.getValue().trim() : '');
            //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
            onRendered(function () { editor3.focus(); });
            //when the value has been set, trigger the cell to update
            editor3.on("change blur", function (e) {
                $scope.dllGroup = $('#radioGroup option:selected').attr('id');
                success(editor3.val());
            });
            //return the editor element
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
        function bindTColumnHeaderTabulator(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            //console.log(formDetails, 'formDetails')
            finalArray.push({
                title: "Id", visible: false, field: "Id"
            });
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                // angular.forEach(pageData, function (item, key) {
                /// var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });

                if (item.List_column1 == "Yes") {
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multipleFiles == true) {
                                finalArray.push({
                                    title: item.title, formatter: multilFiles, headerSort: false, columnType: type, align: "center", field: item.field, align: "left", cellClick: function (e, cell) {

                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.title, formatter: arrowImage, columnType: type, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left", headerFilter: "input"
                                });
                            }
                        }
                        else if (type == "checkbox-group") {
                            //finalArray.push({
                            //    title: item.title, width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", field: item.field,hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                            //        cell.getRow().toggleSelect();
                            //    }
                            //});
                            finalArray.push({
                                title: item.title, columnType: type, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left", editor: true, formatter: "tickCross"
                            });
                        }
                        else if (type == "radio-group") {
                            $scope.optionValues = item.values;
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit)) {
                                    if (item.Inline_Edit == "True") {
                                        finalArray.push({
                                            title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", editor: radioEditor, headerFilterParams: { values: true }

                                            , cellEdited: function (cell) {
                                                console.log("cell" + cell)
                                            }
                                        });



                                    } else {
                                        finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                    }

                                }
                                else {
                                    finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                }

                            }
                            else {

                                $scope.displayInTabData = item;

                            }
                        }
                        else if (type == "select") {
                            $scope.optionValuesSelect = item.values;
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit)) {
                                    if (item.Inline_Edit == "True") {
                                        finalArray.push({
                                            title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", editor: selectEditor, headerFilterParams: { values: true }

                                            , cellEdited: function (cell) {
                                                console.log("cell" + cell)
                                            }
                                        });



                                    } else {
                                        finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                    }

                                }
                                else {
                                    finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "select", headerFilterParams: { values: true } });

                                }

                            }
                            else {

                                $scope.displayInTabData = item;

                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit)) {
                                    if (item.Inline_Edit == "True") {
                                        finalArray.push({
                                            title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "input",
                                            editor: "input",
                                            cellEdited: function (cell) {
                                                console.log("cell" + cell)
                                            }
                                        });



                                    } else {
                                        finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "input" });
                                    }

                                } else {
                                    finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "input" });
                                }

                            }
                            else {

                                $scope.displayInTabData = item;

                            }
                        }
                    }
                }
                //});                
            });

            finalArray.unshift({ title: "formId", visible: false });

            //finalArray.unshift({ title: "Id", field:"Id", visible: false });
            finalArray.unshift({ title: "formGroupKey", visible: false });
            return finalArray;
        };
        $scope.rootScopeSafe = function () {
            $rootScope.safeApply();
        };
        $scope.$watchCollection("selectedTreeList", function (newVal, oldVal) {
            // console.log(newVal);
            // if (newVal.length > 0) {
            if (!DataService.isEmpty(newVal))
                if (newVal.length != oldVal.length)
                    reBindCalender();
            //}
            //else {
            //    if (!DataService.isEmpty($scope.basicViewCalenderDataTemp)) {
            //        $('.calendar').fullCalendar('destroy');
            //        var eventBasicData = window["EventBasicDetail"];
            //        window["EventBasicDetail"] = eventBasicData;
            //        if (!DataService.isEmpty($scope.basicViewCalenderDataTemp.eventData))
            //            loadCalendar('BasicView', $scope.basicViewCalenderDataTemp.eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.basicViewCalenderDataTemp.activityEvents);
            //        $rootScope.safeApply();
            //    }
            //}
        });
        function seperateTitleQuery(item, newFilteredEventList) {
            var queryText = " ";
            var newFilteredEventListgroupBy = _.groupBy(newFilteredEventList, "formId");
            var tempArr = [];
            var count = 0;
            _.each(newFilteredEventListgroupBy, function (itemG, key) {
                tempArr[count] = [];
                var newFilteredEventListgroupBySub = _.groupBy(itemG, "groupById");
                queryText += " (  ";
                _.each(newFilteredEventListgroupBySub, function (itemSub, keyItemSub) {
                    // tempArr[count].push(item.text);  
                    queryText += " (  ";
                    _.each(itemSub, function (item) {
                        // tempArr[count].push(item.query);
                        if (keyItemSub != "undefined")
                            queryText += " " + item.FormTableName + "." + item.query + "  and ";
                        else
                            queryText += " " + item.FormTableName + "." + item.query + "  or ";

                    });
                    queryText = queryText.substring(0, queryText.length - 4);
                    queryText += " )      ";
                    queryText += " or  ";
                });
                count++;
                queryText = queryText.substring(0, queryText.length - 4);
                queryText += " )      ";
                queryText += " and  ";
            });
            queryText = queryText.substring(0, queryText.length - 4);
            //var filterList = cartesianList(tempArr);
            //_.each(filterList, function (itemUniq) {
            //    queryText += " ( ";
            //    if (itemUniq.length > 1) {
            //        _.each(itemUniq, function (itemFilter) {
            //            queryText += " " + itemFilter + "  or  ";
            //        });
            //        queryText = queryText.substring(0, queryText.length - 5);
            //    } else {
            //        _.each(itemUniq, function (itemFilter) {
            //            queryText += " " + itemFilter + "  ";
            //        });
            //    }
            //    queryText += " )      ";
            //    queryText += " and  ";
            //});



            //queryText = queryText.substring(0, queryText.length - 4);
            return queryText;
        };
        function reBindCalender() {
            //debugger;
            $scope.basicViewCalenderDataTemp.newFilteredEventList = [];
            var whereClouse = " ";
            var joinClouse = "";
            joinClouse += "";
            var FormTableNameTemp = "";
            _.each($scope.selectedTreeList, function (item) {
                if (!DataService.isEmpty(item.original)) {
                    FormTableNameTemp = item.original.FormTableName;

                }
                else {
                    FormTableNameTemp = item.FormTableName;
                }
                var exists = _.findWhere($scope.basicViewCalenderDataTemp.newFilteredEventList, { FormTableName: FormTableNameTemp });
                if (DataService.isEmpty(exists)) {
                    joinClouse += " ";
                    joinClouse += "   left join " + FormTableNameTemp + " on " + FormTableNameTemp + ".formId=f1.referrenceFormId and " + FormTableNameTemp + ".Id=f1.referrenceId  "

                }
                if (!DataService.isEmpty(item.original)) {
                    var exists = _.filter($scope.basicViewCalenderDataTemp.newFilteredEventList, function (itemFilter) {
                        return itemFilter.index == item.index && itemFilter.text == item.text;
                    });
                    if (DataService.isEmpty(exists) && exists.length == 0) {
                        var tempData = item.original;
                        tempData.groupById = item.groupById;
                        $scope.basicViewCalenderDataTemp.newFilteredEventList.push(tempData);
                    }
                }
                else {
                    var exists = _.filter($scope.basicViewCalenderDataTemp.newFilteredEventList, function (itemFilter) {
                        return itemFilter.index == item.index && itemFilter.text == item.text;
                    });
                    if (DataService.isEmpty(exists) && exists.length == 0)
                        $scope.basicViewCalenderDataTemp.newFilteredEventList.push(item);
                }
                //if (!DataService.isEmpty(item.original))
                //    $scope.basicViewCalenderDataTemp.newFilteredEventList.push(item.original);
                //else
                //    $scope.basicViewCalenderDataTemp.newFilteredEventList.push(item);
            });
            var newParam = {};
            newParam.action = 29;
            /*Seaching For selected Resources*/
            if (!DataService.isEmpty($scope.selectedAxis.resourceSearchTextData)) {
                if (!DataService.isEmpty($scope.xSelection)) {
                    newParam.resourceSearchTextData = $scope.selectedAxis.resourceSearchTextData;
                    var dataResource = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.xSelection });
                    if (!DataService.isEmpty(dataResource)) {
                        newParam.resourceSearchTextJoin = dataResource.FormTableName;
                        var list = [];
                        if (dataResource.majorGroupParse > 0) {
                            _.each(dataResource.majorGroupParse, function (item) {
                                list.push(item);
                            });
                            if (!DataService.isEmpty(dataResource.minorGroup)) {
                                list.push(dataResource.minorGroup)
                            }
                        } else {
                            if (!DataService.isEmpty(dataResource.minorGroup)) {
                                list.push(dataResource.minorGroup);
                            }
                        }
                        newParam.resourceSearchTextWhereClouse = JSON.stringify(list);
                    }
                }
            }
            var selectedSearch = seperateTitleQuery({}, $scope.basicViewCalenderDataTemp.newFilteredEventList);
            if (selectedSearch.trim().length > 4)
                whereClouse += selectedSearch;
            whereClouse = whereClouse.substring(0, whereClouse.length - 5);


            newParam.formTableColumnData = whereClouse;
            newParam.formTableColumnName = joinClouse;
            newParam.formId = $scope.formDetailsDataInfo.formId;
            newParam.FormTableName = $scope.formDetailsDataInfo.FormTableName;
            if (!DataService.isEmpty($scope.otherformDetails))
                if (!DataService.isEmpty($scope.otherformDetails.searchTextData)) {
                    if ($scope.otherformDetails.searchTextData.length > 0)
                        newParam.Query = $scope.otherformDetails.searchTextData;
                }
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            if ($scope.selectedTreeList.length > 0)
                $scope.isFilterApply = true;
            else
                $scope.isFilterApply = false;

            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
            newParam.filter = changeStateOfCalenderController(view);
            mainService.getFormRecordList("GetFormRecordList", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        $scope.filterredFormDataTemp = response.data;
                        var eventBasicData = window["EventBasicDetail"];
                        window["EventBasicDetail"] = eventBasicData;
                        //console.log('loadCalendar2')
                        if (!DataService.isEmpty($scope.filterredFormDataTemp.data)) {
                            $scope.filterredFormDataTemp = $scope.filterredFormDataTemp.data;
                        }
                        if (newParam.action == 29) {
                            refreshEventResourcesActivityNew('deleteEvent', $scope.filterredFormDataTemp, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.filterredFormDataTemp);
                        }
                        // $('.calendar').fullCalendar('destroy');
                        // loadCalendar('BasicView', $scope.filterredFormDataTemp, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.filterredFormDataTemp);

                        //$timeout(function(){
                        //    var allCalender = $('div.calendar');
                        //    _.each(allCalender, function (item) {
                        //        $(item).fullCalendar('rerenderEvents');
                        //        $(item).fullCalendar('refetchEvents');
                        //        $(item).fullCalendar('updateEvent', $scope.filterredFormDataTemp.data);
                        //    });
                        //},150);

                        $rootScope.safeApply();
                        $("body .popover").addClass('isPopoverLoaded');
                        $("body .popover").popover('hide');
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.updateRowDataRecord = function (param) {
            var newParam = {};
            newParam = angular.copy(param);
            newParam.action = 8;
            //newParam.formId = $scope.currentFormId;
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.updateFormRecord("UpdateFormRecord", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var dataTemp = response.data;
                        // { "fieldName": "select_1599550423757", "fieldDataText": "[\"new\",\"addnew\",\"updated\"]", "formId": "208125", "Id": "93", "action": 8, "created_by": 30314, "update_by": 30314 }
                        var CalendarEventList = window["CalendarEventList"];
                        var eventBasicData = window["EventBasicDetail"];
                        var exists = _.findWhere(CalendarEventList, { Id: parseInt(newParam.Id) });
                        if (!DataService.isEmpty(exists)) {
                            exists[newParam.fieldName] = newParam.fieldDataText;
                            var idx = _.findIndex(CalendarEventList, { formGroupKey: exists.formGroupKey });
                            CalendarEventList[idx] = exists;
                        }
                        window["CalendarEventList"] = CalendarEventList;
                        refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        /*Load Selected tree*/
        $scope.addSelectedTree = function (key, node) {
            if (node.id != "#") {

                if ($("#tree-" + key + "").jstree(true)._model != null && node.state.selected) {
                    var treeData = $("#tree-" + key + "").jstree(true)._model.data;
                    var item = _.where(treeData, { parent: node.id });
                    if (!DataService.isEmpty(item) && item.length > 0) {
                        _.each(item, function (ite) {
                            if (ite.id.contains("more-button") != true)
                                $scope.selectedTreeList.push(ite);
                        });
                        $rootScope.safeApply();
                    }
                }

            }
        };
        $scope.applyCheckBoxesChanges = function (data, type) {
            if (type) {
                var item = _.findWhere($scope.selectedTreeList, { text: data.text });
                if (DataService.isEmpty(item)) {
                    if (!DataService.isEmpty(item))
                        if (item.id.contains("more-button") != true)
                            $scope.selectedTreeList.push(data);
                        else
                            $scope.selectedTreeList.push(data);
                    else
                        $scope.selectedTreeList.push(data);
                }
                else {
                    if (item.id.contains("more-button") != true)
                        $scope.selectedTreeList.push(data);
                }
            } else {
                var item = _.findWhere($scope.selectedTreeList, { text: data.text });
                if (!DataService.isEmpty(item)) {
                    var indx = _.indexOf($scope.selectedTreeList, item);
                    if (indx != -1)
                        $scope.selectedTreeList.splice(indx, 1);
                }
            }
            $rootScope.safeApply();
            _.each($scope.calenderSettingsFormDetailsDataList, function (listSettings, setKey) {
                if ($("#tree-" + setKey + "").jstree(true)._model != null) {
                    var ddd = $("#tree-" + setKey + "").jstree(true)._model.data;
                    //console.log(listSettings.selectedTreeNode)
                }
            });

        };
        function getChildList(treeNodeList, listindex, selected) {
            var temp = [];
            var list = $scope.calenderSettingsFormDetailsDataList[listindex];
            var exist = list.formDataList;
            var existslist = _.findWhere(treeNodeList._model.data, { id: treeNodeList._data.core.focused });

            return exist;
        };
        function findTextList(formDataList, selectText, parentId) {
            var temp = [];
            _.each(formDataList, function (item, key) {
                _.each(item, function (item1) {
                    if (item1.toLowerCase() == selectText.toLowerCase()) {
                        //var temp1 = { "id": key, "parent": parentId.toString(), "text":  };
                        temp.push()
                    }
                });
            });

            return temp;
        };
        function getNestedChildrenNew(arr, parent, current, list) {
            var count = arr.length;
            // if (parent!="#"){
            var parentExists = _.findWhere(arr, { id: parent });
            if (!DataService.isEmpty(parentExists)) {
                //var parentExistsChild = _.findWhere(arr, { id: current });
                //if (!DataService.isEmpty(parentExists)) {
                //    var alext = _.findWhere(out, { id: current });
                //    if (DataService.isEmpty(alext))
                //    //out.push(parentExistsChild)
                //}               
                var alext1 = _.findWhere(out, { id: parent });
                if (DataService.isEmpty(alext1))
                    out.push(parentExists);
                getNestedChildrenNew(arr, parentExists.parent, parentExists.id);
            }
            // }
        };
        function getNestedChildren(arr, parent) {
            var out = []
            var key = keyList[idex];
            for (var i = 0; i < count; i++) {
                if (arr[i][key] == parent) {

                    if (len > idex + 1)
                        var children = getNestedChildren(arr, arr[i][keyList[idex + 1]], keyList, idex + 1, len)
                    if (children) {
                        arr[i].children = children
                    }

                    out.push(arr[i])
                }
            }

            return out
        };
        $scope.customGroupfilter = function (item) {
            return true;
        };
        $scope.filterList = function (text, list) {
            var temp = [];
            _.each(list, function (item) {
                _.each(item, function (item1, key1) {
                    if (!DataService.isEmpty(item1))
                        if (item1.toLowerCase() == text.toLowerCase())
                            temp.push(item);
                });
            });
            return temp;
        };
        $scope.expendGroup = function (keyitem, itemdata, maillist, list) {
            // alert(itemdata)
            maillist[keyitem].isClick = true;
            if (maillist[keyitem].selected) {
                maillist[keyitem].nestedHtml = "";
                var indx = _.indexOf(list.majorGroupParse, list.groupBy);
                if (indx != -1) {
                    maillist[keyitem].nestedHtmlList = $scope.filterList(maillist[keyitem].selectedValue, list.formDataList);
                    maillist[keyitem].nestedHtmlListGroupby = _.groupBy(maillist[keyitem].nestedHtmlList, list.majorGroupParse[indx + 1]);

                    _.each(maillist[keyitem].nestedHtmlListGroupby, function (item, key) {
                        maillist[keyitem].nestedHtml += "<div>  <br />  <input type='checkbox' ng-model='value.selected' ng-change='value.selectedValue = keyitem; expendGroup(keyitem, value, nlist, list)' /> <b>" + key + " -- {{value.isClick}}</b>  <br /></div>";
                    })
                }
            }
            $timeout(function () {
                $rootScope.safeApply();
            }, 150);
            //console.log(itemdata);

            //_.each(maillist.majorGroupParse,function(item,key){
            //    if (key != 0) {
            //        maillist.ulliHtml="";
            //        var listGroup = _.groupBy(maillist.formDataListGroupBy, item);
            //        _.each(listGroup, function (itemgroup, keyg) {
            //            maillist.ulliHtml += "<ul>  " + keyg;


            //            maillist.ulliHtml += "</ul>";
            //        });
            //    }
            //});


        };
        $scope.xSelectionChange = function (formId) {

            //console.log($scope.xaxisFormList);
            //filter activity draggables based on x id .
            //var allData = $scope.calenderSettingsFormDetailsDataList;
            showLoader();
            $rootScope.$emit("ShowLoading");
            $scope.selectedAxis.xSelected = formId;
            var dataTitle = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: formId });
            window["xTitle"] = dataTitle.title.toString();
            window["xSelected"] = angular.copy($scope.selectedAxis.xSelected);
            /*y Axis Selection*/
            if (formId != 0) {
                //$scope.yaxisFormList = _.filter($scope.yaxisFormListCopy, function (item) { return item.resourceActivityForm != formId });
                if ($scope.yaxisFormList.length > 0 && $scope.isDefaultXYSelection == true) {
                    var exists1 = _.findWhere($scope.yaxisFormList, { IsDefault: true });
                    if (!DataService.isEmpty(exists1)) {
                        $scope.ySelection = exists1.resourceActivityForm;
                        $scope.ySelectionChange($scope.ySelection);
                    }
                    else {
                        $scope.ySelection = $scope.yaxisFormList[0].resourceActivityForm;
                        $scope.ySelectionChange($scope.ySelection);
                    }
                    $scope.isDefaultXYSelection = false;
                }
                else if ($scope.ySelection == formId) {
                    $scope.ySelection = $scope.yaxisFormList[0].resourceActivityForm;
                    if ($scope.ySelection == formId)
                        $scope.ySelection = $scope.yaxisFormList[1].resourceActivityForm;
                    if ($scope.ySelection == formId)
                        $scope.ySelection = $scope.yaxisFormList[2].resourceActivityForm;
                    $scope.ySelectionChange($scope.ySelection);
                    //$scope.filterEvents("xddl");
                }
                else {
                    $rootScope.$emit("HideLoading");
                }
            }
            $scope.arrangeDraggables(formId);
            $.unblockUI();

            //$rootScope.$emit("HideLoading");
            $("body .popover").addClass('isPopoverLoaded');
            $("body .popover").popover('hide');

            $timeout(function () {
                //var input = document.querySelector('input[name=resourcekeywordSearch]');
                // initialize Tagify on the above input node reference
                //if (!DataService.isEmpty(input))
                //new Tagify(input)
                //$("#resourcekeywordSearch").siblings().find("span")[0].dataset.placeholder = $scope.selectedAxis.selectedFormName;

                var input = document.querySelector('input[name=activitykeywordSearch]');
                // initialize Tagify on the above input node reference
                if (!DataService.isEmpty(input))
                    new Tagify(input)
                $("#activitykeywordSearch").siblings().find("span")[0].dataset.placeholder = $scope.selectedAxis.selectedFormName;

                $rootScope.safeApply();

            }, 1000);

        };
        $scope.ySelectionChange = function (formId) {
            try {
                //debugger;
                // alert(formId);
                showLoader();
                if ($scope.xSelection == formId) {
                    $rootScope.$emit("ShowLoading");
                    $scope.xSelection = $scope.xaxisFormList[0].resourceActivityForm;
                    if ($scope.xSelection == formId)
                        $scope.xSelection = $scope.xaxisFormList[1].resourceActivityForm;
                    if ($scope.xSelection == formId)
                        $scope.xSelection = $scope.xaxisFormList[2].resourceActivityForm;
                    $scope.xSelectionChange($scope.xSelection);
                }

                $rootScope.$emit("ShowLoading");
                $scope.selectedAxis.ySelected = formId;
                var resTitle = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: formId });
                window["yTitle"] = resTitle.title.toString();
                window["ySelected"] = angular.copy($scope.selectedAxis.ySelected);

                if ($scope.selectedAxis.xSelected !== null && typeof $scope.selectedAxis.xSelected !== "undefined") {
                    $scope.arrangeDraggables($scope.selectedAxis.xSelected);
                }


                $scope.filterEvents("Yddl");

                if ($scope.selectedTreeList.length > 0) {
                    reBindCalender();
                }
            }
            catch (e) {
                console.log(e);
            }
            $("body .popover").addClass('isPopoverLoaded');
            $("body .popover").popover('hide');
        };
        $scope.arrangeDraggables = function (formId) {

            try {
                //var is2D = false;
                var formData = _.findWhere($scope.xaxisFormList, { activitiesForm: formId });

                //resData  with same formId.  for getting resColum(minor Group) textField.
                var resData = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: $scope.ySelection });
                var resData2 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: formId });
                var resData3 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
                //checking if  2D.
                if ($scope.calenderSettingsFormDetailsDataList.length == 2 && (resData == undefined || resData2 == undefined)) {
                    $scope.is2D = true;
                    resData = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: formId });
                    resData2 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
                }

                if (!DataService.isEmpty(formData))
                    $scope.selectedAxis.selectedFormName = formData.title;
                $scope.Xdraggables.draggableSlips = [];
                var draggables = [];
                // angular.forEach(allData, function (dataRow, position) {
                //console.log(dataRow);
                //   if (dataRow.activitiesForm == formId) {
                var activityField = formData.activities;
                var activityCategory = formData.activitiesCategory;
                var durationField = formData.durationField;
                var colorField = formData.colorField;

                var minorGroupAsRes = resData2.minorGroup;
                var majorGroup = resData2.majorGroup;
                if (majorGroup != undefined) {
                    majorGroup = majorGroup.replace('[', '').trim();
                    majorGroup = majorGroup.replace(']', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                }
                majorGroup = majorGroup.split(',');


                //major/ minor  group resource

                var resMinor = resData3.minorGroup;
                var resMajorGroup = resData3.majorGroup;
                if (resMajorGroup != undefined) {
                    resMajorGroup = resMajorGroup.replace('[', '').trim();
                    resMajorGroup = resMajorGroup.replace(']', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                }
                resMajorGroup = resMajorGroup.split(',');



                angular.forEach(formData.formDataList, function (entryRow, Key) {
                    var _arr = {};
                    _arr.Id = entryRow["id"];
                    _arr.durationField = entryRow[durationField];
                    _arr.formId = formId;
                    _arr.color = entryRow[colorField];
                    _arr.category = activityCategory;
                    _arr.servicefield = activityCategory;
                    _arr.value = entryRow[activityField];


                    //for create drop 
                    // we need y selection fields to create background  entry.
                    if (!$scope.is2D) {

                        _arr.activityField = resData.activities;
                        _arr.categoryField = majorGroup[majorGroup.length - 1] //resData.activitiesCategory;
                        _arr.colorField = resData.colorField;
                        _arr.dropIn = entryRow[resData2.minorGroup];
                        if (majorGroup[0].toString() != "") {
                            if (!DataService.isEmpty(entryRow[minorGroupAsRes]))
                                _arr.displayValue = entryRow[majorGroup[0]].toString() + " - " + entryRow[minorGroupAsRes].toString();
                            else
                                _arr.displayValue = entryRow[majorGroup[0]].toString();
                        }
                        else
                            _arr.displayValue = (!DataService.isEmpty(entryRow[minorGroupAsRes])) ?
                                entryRow[minorGroupAsRes].toString() : "";
                        _arr.dimensionType = "ND";

                        //all values of grouping from same resource form . (applicable --->from activity to resource )
                        //start
                        var groupingValuesActivity = "";
                        if (majorGroup !== undefined && majorGroup.length > 0) {
                            angular.forEach(majorGroup, function (value1, pos) {
                                if (groupingValuesActivity == "") {
                                    if (value1 != "")
                                        groupingValuesActivity = entryRow[resData2.minorGroup].toString() + " - " + entryRow[value1].toString();
                                    else
                                        groupingValuesActivity = entryRow[resData2.minorGroup].toString();
                                }
                                else
                                    groupingValuesActivity += " - " + entryRow[value1].toString();

                            })
                        }
                        _arr.groupingValuesActivity = groupingValuesActivity;
                        // end

                        //all grouping fields for background label creating from resource to activity(applicable ---> from resource to activity).
                        var groupingFieldsRes = "";
                        if (resMajorGroup !== undefined && resMajorGroup.length > 0) {
                            angular.forEach(resMajorGroup, function (value1, pos) {
                                if (groupingFieldsRes == "")
                                    groupingFieldsRes = resMinor + " - " + value1.toString();
                                else
                                    groupingFieldsRes += " - " + value1.toString();

                            })
                        }
                        _arr.groupingFieldsRes = groupingFieldsRes;



                    }
                    else {//for 2D
                        // rgb(192, 192, 192)
                        _arr.activityField = "";
                        _arr.categoryField = "" //resData.activitiesCategory;
                        _arr.colorField = "";
                        _arr.dropIn = "";
                        _arr.dimensionType = "2D";
                        _arr.displayValue = entryRow[activityField].toString();

                    }


                    draggables.push(_arr);
                    //console.log(entryRow[activityField]);
                });
                // }
                //});;
                draggables = $filter('orderBy')(draggables, 'displayValue', false);
                //draggables = _.uniq(draggables, "durationField");
                //console.log('drag data is : ')
                //console.log(draggables);
                $scope.Xdraggables.draggableSlips = draggables;
                $scope.Xdraggables.draggableSlipsTemp = angular.copy(draggables);
                //$scope.filterEvents("xddl");
                $timeout(function () {
                    $('.external-events-list .fc-event').each(function () {

                        $(this).data('event', {

                            title: $.trim($(this).text()), // use the element's text as the event title
                            color: $.trim($(this).data('color')),
                            duration: $.trim($(this).data('duration')),
                            stick: false, // maintain when user navigates (see docs on the renderEvent method)
                            id: $.trim($(this).data('id')),
                            formid: $.trim($(this).data('formid')),
                            activityfield: $.trim($(this).data('activityfield')),
                            colorfield: $.trim($(this).data('colorfield')),
                            categoryfield: $.trim($(this).data('categoryfield')),
                            servicefield: $.trim($(this).data('servicefield')),
                            dropin: $.trim($(this).data('dropin')),
                            dimensiontype: $.trim($(this).data('dimensiontype')),
                            groupingvaluesact: $.trim($(this).data('groupingvaluesact')),
                            groupingfieldsres: $.trim($(this).data('groupingfieldsres')),



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
                }, 500);


            }
            catch (e) {
                console.log(e);
            }
        };
        $scope.filterEvents = function (reqFrom) {
            // $scope.bindDraggable($scope.selectedAxis.xSelected,$scope.selectedAxis.ySelected);
            //if(reqFrom=="Yddl")
            //{
            // $rootScope.$emit("ShowLoading");
            var _allEvents = window["CalendarEventList"];
            //console.log(_allEvents);
            $scope.resultBasket = [];
            var resResults = [];
            var resColumns = [];
            var activityResults = [];
            var activityColumns = [];
            var activities = [];
            var _AllFilterData = $scope.calenderSettingsFormDetailsDataList;
            //console.log(_AllFilterData, '_AllFilterData');
            _.each(_AllFilterData, function (row, position) {


                if (row.activitiesForm != 0) {
                    var _Arr = {};
                    _Arr["activitiesForm"] = row.activitiesForm;
                    _Arr["activities"] = row.activities;
                    activities.push(_Arr);
                }

            });
            //  if (typeof _allEvents !== "undefined") {
            var param = {};
            param.action = 9;
            param.formId = $stateParams.formId;
            param.resourceForm = $scope.selectedAxis.ySelected
            param.activitiesForm = $scope.selectedAxis.xSelected
            $rootScope.$emit("ShowLoading");
            mainService.getCalenderSettingsFormData("getAxisColumns", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data, 'getAxisColumns');
                        var _resFields = response.data.resfields;
                        var _actFields = response.data.activityFields;
                        var _colGroupingData = response.data.colGrouping;
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
                        $scope.ResourcefieldsData = response.data.resfields;  //all resource fields
                        $scope.ActivityFieldsData = response.data.activityFields;  // all activity fields                     

                        var resourceData = response.data.resourceDetails;

                        resourceData = _.without(resourceData, _.findWhere(resourceData, { value: "0" })); // resource data 
                        var ResourceInputFields = $scope.filterInputControls($scope.ResourcefieldsData);

                        var resourceColumns = $scope.getResourceColumns(resourceData, ResourceInputFields, 'resource');
                        var resourceFormData = $scope.arrangeData(resourceData, resourceColumns, 'resource');
                        resourceFormData = $filter('orderBy')(resourceFormData, 'title', false);

                        //console.log(resColumns);
                        //console.log(activityColumns);
                        //filter resData
                        _.each(_AllFilterData, function (dataRow, position) {
                            //console.log(dataRow);
                            if (dataRow.resourceForm == $scope.selectedAxis.ySelected && dataRow.resourceForm !== 0) {
                                resResults = dataRow.formDataList;
                            }
                            if (dataRow.activitiesForm == $scope.selectedAxis.xSelected && dataRow.activitiesForm !== 0) {
                                activityResults = dataRow.formDataList;
                            }
                        });
                        //if (!$scope.is2D) {
                        //    angular.forEach(_allEvents, function (dataRow, position) {
                        //        ////console.log(dataRow);
                        //        //if (dataRow.actFormID == $scope.selectedAxis.xSelected || (dataRow.actFormID !== $scope.selectedAxis.ySelected)) {
                        //        //    $scope.resultBasket.push(dataRow);
                        //        //}
                        //        var rowRecord = dataRow;
                        //        var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                        //        var seperatedIdsParam = dataRow.seperatedIds;
                        //        var seperatedTitleParam = dataRow.seperatedTitles;
                        //        var commaIDs = seperatedIdsParam.split(',');
                        //        var commaVals = seperatedFormIDsParam.split(',');
                        //        var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                        //        var ySelected = window["ySelected"];
                        //        angular.forEach(commaVals, function (idVal, pos) {
                        //            //console.log(commaVals + "," + commaIDs[pos].toString())
                        //            if (idVal == ySelected.toString()) {
                        //                dataRow.resFormID = idVal;
                        //                dataRow.resources = commaIDs[pos];
                        //                dataRow.resourceId = commaIDs[pos];
                        //                dataRow.title = "";
                        //            }

                        //        })



                        //    });
                        //}
                        // if ($scope.isYSelectionSelected==false)
                        $('.calendar').fullCalendar('destroy');
                        var eventBasicData = window["EventBasicDetail"];

                        if (resResults.length) {
                            _.each(resResults, function (item, key) {
                                var ac_column = "";
                                item.title = "";
                                var exists = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
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

                        eventBasicData.resourceData = resResults;
                        eventBasicData.resColumns = resColumns;
                        //console.log(activityColumns, 'activityColumns')
                        if (activityResults.length) {
                            _.each(activityResults, function (item, key) {
                                var ac_column = "";
                                var exists = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: response.data.activityFields[0].formId });
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
                                    var found = activities.filter(function (aitem) { return aitem.activitiesForm === response.data.activityFields[0].formId; });
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
                        eventBasicData.activityData = activityResults;
                        eventBasicData.activityColumn = activityColumns;

                        window["EventBasicDetail"] = eventBasicData;
                        if (!DataService.isEmpty(_allEvents))
                            window["CalendarEventList"] = _allEvents;
                        else
                            window["CalendarEventList"] = [];
                        //console.log('loadCalendar3')
                        //console.log('kjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
                        //console.log(_allEvents);
                        if (DataService.isEmpty(_allEvents))
                            _allEvents = [];

                        $scope.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");
                        adminService.postAsync('/MarketPlace/GetCalendarDetails/' + $scope.CALENDAR_CODE, {}).then(function (res) {
                            if (res.data.Status) {
                                $scope.calendarMaster = res.data.Data;
                                if (!Check_EXIST_PRE_DEFINED_ACTIVITIES($scope.calendarMaster)) {
                                    $scope.IS_EXIST_PRE_DEFINED_ACTIVITIES = false;
                                } else {
                                    $scope.IS_EXIST_PRE_DEFINED_ACTIVITIES = true;
                                }
                                loadCalendarWithEventFunction("", _allEvents, resResults, resColumns, activityResults, activityColumns, _allEvents);
                            } else {
                                alert('Please choose/create a calendar');
                            }
                        }, function (err) {

                        });


                        //refreshEventResourcesActivityNew("updateResource", _allEvents, resResults, resColumns, activityResults, activityColumns, _allEvents);
                        //$('#basic-view div.calendar').fullCalendar('refetchEvents');

                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
            // }
            // else {
            //var param = {};
            //param.action = 9;
            //param.formId = $stateParams.formId;
            //param.resourceForm = $scope.selectedAxis.ySelected;
            //param.activitiesForm = $scope.selectedAxis.xSelected;
            //$rootScope.$emit("ShowLoading");
            //mainService.getCalenderSettingsFormData("getAxisColumns", param)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            //console.log(response.data);
            //            var _resFields = response.data.resfields;
            //            var _actFields = response.data.activityFields;
            //            var _colGroupingData = response.data.colGrouping;
            //            window["colGrouping"] = _colGroupingData;
            //            $rootScope.$emit("HideLoading");
            //        }
            //        $rootScope.$emit("HideLoading");
            //    },
            //    function (err) {
            //        $rootScope.$emit("HideLoading");
            //        console.log("some error occured." + err);
            //    });
            //}
            //}
        }
        $scope.resetFilter = function () {
            $scope.isFilterApply = false;
            if (DataService.isEmpty($scope.otherformDetails))
                $scope.otherformDetails = {};
            $scope.otherformDetails.searchTextData = "";
            _.each($scope.calenderSettingsFormDetailsDataList, function (listSettings, setKey) {
                if (listSettings.majorGroupParseList.length > 0)
                    $("#tree-" + setKey).jstree(true).uncheck_all();
            });
            reBindCalender();
        };
        function loadStudentSearch() {

            $scope.totalSelectList = _.where($scope.formAllDatafields, { type: "select" });
            if ($scope.totalSelectList.length > 0) {
                var exists = _.filter($scope.totalSelectList, function (item) {
                    return item.Use_as_tags == "Yes";
                });
                $scope.totalSelectListTagify = exists;
            }

            $scope.listTabulator = _.where($scope.formAllDatafields, { type: "tabulator" });
            $scope.otherFormId = 0;
            $scope.otherFormId = $scope.formDetailsDataInfo.otherformid;

            if ($scope.otherFormId != 0) {


                var params = { action: 32, formId: $scope.otherFormId };
                params.companyCode = localStorage.getItem("COMPANY_CODE");
                params.calendarCode = localStorage.getItem("CALENDAR_CODE");
                params.page = 1;
                params.size = 100000;
                adminService.postAsync("Calendar/GetParticipantMasterList", params).then(function (response) {
                    $scope.OtherFormDrpDwnList = response.data.data;
                    //otherFormFieldName
                    $scope.OtherFormOrderByFieldname = "";
                    try {
                        var fieldList = JSON.parse($scope.formDetailsDataInfo.otherFormFieldName);
                        $scope.OtherFormOrderByFieldname = fieldList[0];
                    } catch (ex) {
                        $scope.OtherFormOrderByFieldname = $scope.formDetailsDataInfo.otherFormFieldName;
                    }


                });



                var otherRefParam = {};
                otherRefParam.action = 4;
                otherRefParam.formId = $scope.otherFormId;
                mainService.manageForm("ManageFormApp", otherRefParam)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            //var temp = response.data;    

                            $scope.otherformDetails = {};
                            //$scope.otherformDetails.formId = otherRefParam.formId;
                            $scope.otherformDetails = response.data;
                            $timeout(function () {
                                var input = document.querySelector('input[name=keywordSearch]');
                                // initialize Tagify on the above input node reference
                                if (!DataService.isEmpty(input))
                                    new Tagify(input)
                            }, 1000);
                        }
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });




            }
        }
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
                                $scope.currentUserFormRole = exists.role;
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
            // $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        // $rootScope.$emit("HideLoading"); 
                        //console.log('details are this: ');
                        var frmDataCheck = response.data;
                        if (frmDataCheck.PlanExpired == 1 && frmDataCheck.GracePeriodActive == 0) {
                            //notifierService.notifySweetAlertMessage('warning', 'Subscription Plan', frmDataCheck.Message);
                            notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', frmDataCheck.Message, 'topic');
                            return false;
                        }
                        else if (frmDataCheck.PlanExpired == 1 && frmDataCheck.GracePeriodActive == 2) {
                            //notifierService.notifySweetAlertMessage('warning', 'Subscription Plan', frmDataCheck.Message);
                            notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention Period is over,kindly re-subscribe plan!", 'topic');
                            return false;
                        }




                        var formDataTemp = response.data[0];
                        //console.log(formDataTemp);
                        $scope.formDetailsDataInfo = formDataTemp;
                        if ($scope.formDetailsDataInfo.res == 5001) {
                            // notifierService.notifyMessage('warning', 'Form Access Rights', $scope.formDetailsDataInfo.Message);
                            notifierService.notifySweetAlertMessageForRole('warning', 'Form Access Rights', "You do not have the access right to this page. You will proceed to Home page", 'Home');
                            //$timeout(function () {
                            //    $state.go("Home");
                            //}, 750);
                            return false;
                        }
                        var EventBasicDetail = window["EventBasicDetail"];
                        EventBasicDetail.formData = $scope.formDetailsDataInfo;
                        window["EventBasicDetail"] = EventBasicDetail;
                        var KanbanData = JSON.parse(formDataTemp.fields);
                        $scope.Is_Kanban_Status = false;
                        $rootScope.applicationId = $scope.formDetailsDataInfo.applicationId;
                        _.each(KanbanData, function (pagesData, key) {
                            if (!Array.isArray(pagesData))
                                KanbanData[key] = JSON.parse(pagesData);
                            _.each(KanbanData[key], function (item) {
                                if ((item.Use_As_Kanban != undefined && item.Use_As_Kanban == "Yes") || (item.types != undefined && item.types == "Is_Kanban_Status")) {

                                    $scope.Is_Kanban_Status = true;

                                }
                            });
                            //console.log($scope.Is_Kanban_Status, 'KS')
                        });
                        if ($scope.formDetailsDataInfo.isCalenderQueue > 0) {
                            $scope.$emit("loadSideBar", $scope.formDetailsDataInfo.applicationId, 1);
                            $rootScope.isHomePage = false;
                            $rootScope.isOtherPage = true;
                            $rootScope.isRecordPage = true;
                            $timeout(function () {
                                $(".sidebar-strip").css("display", "flex");
                                if ($("section.sidebar-strip:visible").length) {
                                    $("section.sidebar-strip").children('.side-nav').mCustomScrollbar();
                                }
                            }, 150);
                        }
                        var paramRoles = {};
                        paramRoles.action = 5;
                        paramRoles.formId = $scope.formDetailsDataInfo.formId;
                        paramRoles.userId = $scope.userDetail.Id;
                        paramRoles.created_by = $scope.formDetailsDataInfo.created_by;
                        $scope.loadFormRoles(paramRoles);
                        //$scope.getCalenderSettingsFormDetailsData();
                        $timeout(function () {
                            if ($("section.sidebar-strip:visible").length) {
                                $("section.sidebar-strip").children('.side-nav').mCustomScrollbar();
                            }
                            $scope.isAllowOwnUser = false;
                            $scope.isAllowOtherUser = false;

                            if (!DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity)) {
                                if (!Array.isArray($scope.formDetailsDataInfo.recordAccessSecurity) && DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.max_one_record_per_user))
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

                                if ($scope.formDetailsDataInfo.IsFilterCriteria) {
                                    paramTemp.action = 9;
                                    var query = "";
                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.recordFilters)) {
                                        var columListFilterCriteria = JSON.parse($scope.formDetailsDataInfo.recordFilters);
                                        angular.forEach(columListFilterCriteria, function (item) {
                                            var exists = _.findWhere($scope.filterFieldsList, { field: item.field });
                                            if (!DataService.isEmpty(exists))
                                                query += item.query + " And";
                                        });
                                        query = query.substring(0, query.length - 3);
                                        if (!DataService.isEmpty(query))
                                            paramTemp.formTableColumnData = query;
                                        else
                                            paramTemp.action = 2;
                                    }
                                }
                                else
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
                            var formFields = [];
                            var formData = JSON.parse($scope.formDetailsDataInfo.fields);
                            _.map(formData, function (pagesData, key) {
                                if (!Array.isArray(pagesData))
                                    formData[key] = JSON.parse(pagesData);
                                _.map(formData[key], function (item) {
                                    formFields.push(item);
                                });

                            });
                            $scope.formFields = formData;
                            $scope.formAllDatafields = formFields;
                            loadStudentSearch();

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
            //var params = windowParams();
            var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
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
        $scope.bindDraggable = function (xSelected, ySelected) {

            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;
            param1.activitiesForm = xSelected;
            param1.resourceForm = ySelected;
            var basicDetails = window["EventBasicDetail"];
            //$rootScope.$emit("ShowLoading");
            mainService.manageDraggableForm("ManageDraggableForm", param1)
                .then(function (response) {

                    var formdata = response.data.formDetails;

                    //console.log(formdata);
                    basicDetails.formData = formdata[0];   // calender  form Data
                    window["EventBasicDetail"] = basicDetails;
                    //window["ySelected"] = basicDetails.formData.resourceForm;
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


                            }



                            $timeout(function () {
                                $scope.getCalenderRecords();
                            }, 150);
                        }


                        $scope.totalSelectList = _.where($scope.formfieldsData, { fieldType: "select" });
                        if ($scope.totalSelectList.length > 0) {
                            var exists = _.filter($scope.totalSelectList, function (item) {
                                return item.fieldValidationRule.contains("Use_as_tags") == true;
                            });
                            $scope.totalSelectListTagify = exists;
                        }


                        $scope.listTabulator = _.where($scope.formfieldsData, { fieldType: "tabulator" });
                        $scope.otherFormId = 0;
                        $scope.otherFormId = $scope.formDetailsDataInfo.otherformid;
                        //if ($scope.listTabulator.length > 0) {

                        //    _.each($scope.listTabulator, function (item) {
                        //        item.fieldLabel = item.fieldLabel.split('(');
                        //        if (item.fieldLabel.length > 0) {
                        //            item.fieldLabel = item.fieldLabel[0];
                        //        }
                        //        if ($scope.otherFormId =="") {
                        //            var ruleParse = JSON.parse(item.fieldValidationRule);
                        //            if (!DataService.isEmpty(ruleParse.otherreference_form)) {
                        //                $scope.otherFormId = ruleParse.otherreference_form;
                        //            }
                        //        }
                        //    });

                        if ($scope.otherFormId != 0) {
                            var otherRefParam = {};
                            otherRefParam.action = 4;
                            otherRefParam.formId = $scope.otherFormId;
                            mainService.manageForm("ManageFormApp", otherRefParam)
                                .then(function (response) {
                                    if (response.data != null && angular.isDefined(response.data)) {
                                        //var temp = response.data;    

                                        $scope.otherformDetails = {};
                                        //$scope.otherformDetails.formId = otherRefParam.formId;
                                        $scope.otherformDetails = response.data;
                                        $timeout(function () {
                                            var input = document.querySelector('input[name=keywordSearch]');
                                            // initialize Tagify on the above input node reference
                                            if (!DataService.isEmpty(input))
                                                new Tagify(input)
                                        }, 1000);
                                    }
                                }, function (err) {
                                    $rootScope.$emit("HideLoading");
                                    console.log("some error occured." + err);
                                });




                        }
                        //}

                    }
                });



            $rootScope.$emit("HideLoading");
        }
        $scope.checkIfToggle = function () {
            var toggleStatus = CookiesPersistenceService.getCookieData("Calender-Toggle");
            if (angular.isDefined(toggleStatus)) {
                if (toggleStatus == 1) {
                    $state.go('calenderToggle', { formId: $scope.id, toggle: 'calenderToggle' });

                }
            }
        }
        $scope.toggle = function () {
            localStorage.setItem("Calender-Toggle", 0);
            $state.go('records', { formId: $scope.id });
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
            showLoader();
            if (DataService.isEmpty($scope.userDetail.Id)) {
                $.unblockUI();
                return true;
            }
            var data = $scope.formfieldsData;
            var ResourceInputFields = $scope.filterInputControls($scope.ResourcefieldsData); // comma seperated resource fields
            var ActivityInputFields = $scope.filterInputControls($scope.ActivityFieldsData); // comma seperated Activity fields
            if (data != null && angular.isDefined(data)) {
                //console.log(' calender all  columns :'); //console.log(data);
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
                    fields += ",resFormID,actFormID,parentID, seperatedFormIDs,seperatedTitles,seperatedIds,seperatedResFormIDs,seperatedResEntryIDs,seperatedResColValues,seperatedColorValues"
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

                    param.resourceFormId = $scope.ySelection;
                    param.ActivityFormId = $scope.xSelection;

                    param.resEntryColumn = basicdetails.formData.minorGroup;
                    param.activityEntryColumn = basicdetails.formData.activities;
                    $timeout(function () {
                        //var temp = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                        //    return item.resourceForm != 0 && item.IsDefault == true;
                        //});
                        //if (!DataService.isEmpty(temp)) {
                        //    param.resourceFormId = temp[0].IsDefault ? temp[0].resourceForm : temp[0].resourceForm;
                        //    temp[0].majorGroupParse = JSON.parse(temp[0].majorGroup);
                        //    param.ResourceFields = temp[0].majorGroupParse.join(',');
                        //    param.ResourceFields +=","+temp[0].minorGroup.toString();
                        //}
                        //var temp1 = _.filter($scope.formDetailsDataInfo.calenderSettingsList, function (item) {
                        //    return item.activitiesForm != 0 && item.IsDefault == true;
                        //});
                        //if (!DataService.isEmpty(temp1)) {
                        //    param.ActivityFormId = temp1[0].IsDefault ? temp1[0].activitiesForm : temp1[0].activitiesForm;
                        //    //param.ResourceFields = temp[0].activities.join(',');
                        //}
                        param.filter = {};
                        param.filter.field = "start";
                        param.filter.type = "day";


                        $rootScope.$emit("ShowLoading");

                        mainService.getReferralFormFields("getReferralFormFields", param)
                            .then(function (response) {
                                var eventData = response.data.events;
                                var resourceData = response.data.resourceDetails;
                                var activityData = response.data.activityDetails;
                                var activityEvents = response.data.activityEvents;

                                //console.log('event Data '); //console.log(eventData);
                                if (eventData != null && angular.isDefined(eventData)) {

                                    /// if (eventData.length > 0) {
                                    //console.log('#calenderData ( All calender records ): ');
                                    //console.log(eventData);

                                    eventData = _.without(eventData, _.findWhere(eventData, { value: "0" })); // removing '--select--'.
                                    resourceData = _.without(resourceData, _.findWhere(resourceData, { value: "0" })); // resource data 
                                    activityData = _.without(activityData, _.findWhere(activityData, { value: "0" })); // resource data 
                                    activityEvents = _.without(activityEvents, _.findWhere(activityEvents, { value: "0" })); // resource data 

                                    //_.each(activityEvents,function(item){
                                    //if(!DataService.isEmpty(item.start)){
                                    //    var dateTime = new Date(item.start);
                                    //    //dateTime = moment(dateTime).format("DD-MM-YYYY HH:MM");
                                    //    item.start = dateTime;
                                    //    dateTime = new Date(item.end);
                                    //   // dateTime = moment(dateTime).format("DD-MM-YYYY HH:MM");
                                    //    item.end = dateTime;
                                    //    }
                                    //});


                                    window["CalendarEventList"] = eventData;// setting window variable with all calender records as 'event list '.
                                    window["ActivityEventList"] = activityEvents;
                                    var resourceColumns = $scope.getResourceColumns(resourceData, ResourceInputFields, 'resource');
                                    var resourceFormData = $scope.arrangeData(resourceData, resourceColumns, 'resource');
                                    resourceFormData = $filter('orderBy')(resourceFormData, 'title', false);
                                    var activityColumns = $scope.getResourceColumns(activityData, ActivityInputFields, 'activity');
                                    var activityFormData = $scope.arrangeData(activityData, activityColumns, 'activity');
                                    activityFormData = $filter('orderBy')(activityFormData, 'title', false);

                                    basicdetails.resourceData = resourceFormData;
                                    basicdetails.resColumns = resourceColumns;
                                    basicdetails.activityData = activityFormData;
                                    basicdetails.activityColumn = activityColumns;
                                    basicdetails.eventData = eventData;

                                    window["EventBasicDetail"] = basicdetails;

                                    $scope.basicViewCalenderDataTemp.eventData = eventData;
                                    $scope.basicViewCalenderDataTemp.resourceFormData = resourceFormData;
                                    $scope.basicViewCalenderDataTemp.resourceColumns = resourceColumns;
                                    $scope.basicViewCalenderDataTemp.activityFormData = activityFormData;
                                    $scope.basicViewCalenderDataTemp.activityColumns = activityColumns;
                                    $scope.basicViewCalenderDataTemp.activityEvents = activityEvents;

                                    if (resourceFormData.length) {
                                        angular.forEach(resourceFormData, function (item, key) {
                                            var ac_column = "";
                                            item.title = "";
                                            var exists = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
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
                                    if (activityFormData.length) {
                                        angular.forEach(activityFormData, function (item, key) {
                                            var ac_column = "";
                                            item.title = "";
                                            var exists = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.xSelection });
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
                                    //loadCalendarWithEventFunction("", eventData, resourceFormData, resourceColumns, activityFormData, activityColumns, activityEvents);
                                    //$('.calendar').fullCalendar('destroy');
                                    //console.log('loadCalendar4')
                                    // if (!DataService.isEmpty($scope.userDetail.Id))
                                    //loadCalendar('BasicView', eventData, resourceFormData, resourceColumns, activityFormData, activityColumns, activityEvents);
                                    // else
                                    //  $.unblockUI();
                                    // $timeout(


                                    //function () {
                                    //    $('.fc-right > .fc-button-group > .ui-button.ui-state-default').click(function () {
                                    //        $timeout(function () {
                                    //            changeCalenderByDayByMonthByYear("viewchange");
                                    //        }, 150);
                                    //    });

                                    //    $('.fc-prev-button span,.fc-left > .fc-button-group > .fc-prev-button').click(function () {
                                    //        $timeout(function () {
                                    //            changeCalenderByDayByMonthByYear("previous");
                                    //        }, 150);
                                    //    });
                                    //    $('.fc-next-button span,.fc-left > .fc-button-group > .fc-prev-button').click(function () {
                                    //        $timeout(function () {
                                    //            changeCalenderByDayByMonthByYear("next");
                                    //        }, 150);
                                    //    });
                                    //    $('.fc-left > .fc-today-button').click(function () {
                                    //        $timeout(function () {
                                    //            changeCalenderByDayByMonthByYear("today");
                                    //        }, 150);
                                    //    });

                                    //    //                                            var yformid = 0;
                                    //    //;                                            var exists = _.findWhere($scope.yaxisFormListCopy, { IsDefault: true });
                                    //    //                                            if (!DataService.isEmpty(exists)) {
                                    //    //                                                yformid = exists.resourceActivityForm;                                            
                                    //    //                                            } else {
                                    //    //                                                if ($scope.yaxisFormListCopy.length > 0)
                                    //    //                                                    yformid = $scope.yaxisFormListCopy[0].resourceActivityForm;
                                    //    //                                            }
                                    //    //                                            $scope.ySelectionChange(yformid);
                                    //    //console.log($scope.calenderSettingsFormDetailsDataList);
                                    //}, 100);

                                    // loading calender .
                                    //  loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                                    //}




                                }
                                else {
                                    $.unblockUI();
                                }
                                $rootScope.$emit("HideLoading");
                            });




                    }, 200);
                }

            }
        }
        adminService.postAsync("FormAPI/GetFormList", { "action": 21, "applicationId": 351 }).then(function (res) {
            var data = res.data;
            if (!DataService.isEmpty(data)) {
                $scope.allFormsList = data;
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

        });

        $scope.filterBySelectedDate = function () {
            changeCalenderByDayByMonthByYear("selectedDate");
        };

        function changeCalenderByDayByMonthByYear(type) {
            $rootScope.$emit("ShowLoading");
            var param = {};
            param.type = type;
            var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
            var current_subtab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').find('.ui-state-active').attr('class');
            var view = $('#' + current_tab + ' div.calendar').fullCalendar('getView');
            //type previous
            if (type == "previous") {
                //var action = "prevMonth";          
                //var strView = view.name;
                //var prevDate = view.start;
                //var prevMonthDate = view.start;
                //// alert(prevMonthDate);
                //var d = new Date(prevMonthDate);
                //var str = $.datepicker.formatDate('mm/dd/yy', d);
                //var MonthType = 'PrevMonth';
                param.filter = changeStateOfCalenderController(view);
            }
            else if (type == "next") {
                param.filter = changeStateOfCalenderController(view);
            }
            else if (type == "viewchange") {
                param.filter = changeStateOfCalenderController(view);
            }
            else if (type == "today") {
                param.filter = changeStateOfCalenderController(view);
            }
            else if (type == "selectedDate") {
                param.filter = {};
                param.filter.field = "start";

                if (!DataService.isEmpty($scope.formDetailsDataInfo.searchByDate)) {
                    param.filter.value = " CAST([start] as date) =CAST('" + $scope.formDetailsDataInfo.searchByDate + "' as date) ";
                }
                else {
                    param.filter.value = " CAST([start] as date) =CAST('" + view.intervalStart.format("YYYY-MM-DD") + "' as date) ";
                    param.filter.type = "day";

                }
            }


            param.action = 1;
            param.formId = $stateParams.formId;   // calender formID
            param.isCalender = 1;

            /*Seaching For selected Resources*/
            if (!DataService.isEmpty($scope.selectedAxis.resourceSearchTextData)) {
                if (!DataService.isEmpty($scope.xSelection)) {
                    param.resourceSearchTextData = $scope.selectedAxis.resourceSearchTextData;
                    var dataResource = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.xSelection });
                    if (!DataService.isEmpty(dataResource)) {
                        param.resourceSearchTextJoin = dataResource.FormTableName;
                        var list = [];
                        if (dataResource.majorGroupParse > 0) {
                            _.each(dataResource.majorGroupParse, function (item) {
                                list.push(item);
                            });
                            if (!DataService.isEmpty(dataResource.minorGroup)) {
                                list.push(dataResource.minorGroup)
                            }
                        } else {
                            if (!DataService.isEmpty(dataResource.minorGroup)) {
                                list.push(dataResource.minorGroup);
                            }
                        }
                        param.resourceSearchTextWhereClouse = JSON.stringify(list);
                    }
                }
            }
            if (!DataService.isEmpty($scope.otherformDetails))
                if (!DataService.isEmpty($scope.otherformDetails.searchTextData)) {
                    if ($scope.otherformDetails.searchTextData.length > 0)
                        param.Query = $scope.otherformDetails.searchTextData;
                }

            mainService.getReferralFormFields("getReferralFormFields", param)// getting all records for calender with specific  columns   are (param.fieldName). (based on formID)
                .then(function (response) {
                    var eventData = response.data.events;
                    if (eventData != null && angular.isDefined(eventData)) {
                        eventData = _.without(eventData, _.findWhere(eventData, { value: "0" }));
                        window["CalendarEventList"] = eventData;
                        var eventBasicData = window["EventBasicDetail"];
                        window["EventBasicDetail"] = eventBasicData;
                        refreshEventResourcesActivityNew('deleteEvent', eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, eventData);

                        $timeout(function () {
                            changeViewStateOfCalender(view, param);
                        }, 150);

                        $.unblockUI();

                    }
                    else {
                        $.unblockUI();
                    }
                    $rootScope.$emit("HideLoading");
                });



        }

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

        function changeViewStateOfCalender(view, data) {
            var temp = {};
            temp.field = "start";

            if (data.type == "selectedDate") {
                $('#list-view div.calendar').fullCalendar('gotoDate', $scope.formDetailsDataInfo.searchByDate);
                $('#agenda-view div.calendar').fullCalendar('gotoDate', $scope.formDetailsDataInfo.searchByDate);
                $('#timeline-resource-view div.calendar').fullCalendar('gotoDate', $scope.formDetailsDataInfo.searchByDate);
                $('#vertical-resource-view div.calendar').fullCalendar('gotoDate', $scope.formDetailsDataInfo.searchByDate);
            }
            else if (view.type.toLowerCase().contains("month")) {
                temp.startDate = moment(view.start._d, "YYYY-MM-DD").format("YYYY-MM-DD");
                $('#list-view div.calendar').fullCalendar('changeView', 'listMonth');
                $('#agenda-view div.calendar').fullCalendar('changeView', 'month');
                $('#timeline-resource-view div.calendar').fullCalendar('changeView', 'timelineMonth');
                $('#vertical-resource-view div.calendar').fullCalendar('changeView', 'agendaDay');


            }
            else if (view.type.toLowerCase().contains("year")) {
            }
            else if (view.type.toLowerCase().contains("week") || view.type.toLowerCase().contains("twodays") || view.type.toLowerCase().contains("threedays")) {
                temp.startDate = moment(view.start._d, "YYYY-MM-DD").format("YYYY-MM-DD");
                if (view.type.toLowerCase().contains("week")) {
                    $('#vertical-resource-view div.calendar').fullCalendar('changeView', 'agendaWeek');
                    $('#list-view div.calendar').fullCalendar('changeView', "listWeek");
                    $('#timeline-resource-view div.calendar').fullCalendar('gotoDate', temp.startDate);
                    $('#vertical-resource-view div.calendar').fullCalendar('gotoDate', temp.startDate);
                }
            }
            else if (view.type.toLowerCase().contains("day")) {
                temp.startDate = moment(view.start._d, "YYYY-MM-DD").format("YYYY-MM-DD");
                $('#list-view div.calendar').fullCalendar('gotoDate', temp.startDate);
                $('#agenda-view div.calendar').fullCalendar('gotoDate', temp.startDate);
                $('#timeline-resource-view div.calendar').fullCalendar('gotoDate', temp.startDate);
                $('#vertical-resource-view div.calendar').fullCalendar('gotoDate', temp.startDate);
            }
            else {

            }
        };

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
            $rootScope.$emit("ShowLoading");
            var resourceData = [];
            var basicDetails = window["EventBasicDetail"];
            var columnTitle = '';
            if (reqType == "resource") {
                columnTitle = basicDetails.formData.minorGroup;
                if (!DataService.isEmpty(basicDetails.formData.majorGroup))
                    basicDetails.formData.majorGroupParse = JSON.parse(basicDetails.formData.majorGroup);
            }
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

                            if (reqType == "resource") {
                                var exists = _.filter(basicDetails.formData.majorGroupParse, function (item) { return item == columnName });
                                if (!DataService.isEmpty(exists) && exists.length > 0) {
                                    if (DataService.isEmpty(row.title)) {
                                        row.title = "";
                                    }
                                    row.title += resColumns1[innerLoop].columnValue + " - ";
                                }
                            }
                            if (resColumns1[innerLoop].columnName == columnTitle) {
                                if (DataService.isEmpty(row.title)) {
                                    row.title = "";
                                }
                                row.title += resColumns1[innerLoop].columnValue;
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
            $rootScope.$emit("HideLoading");
            return resourceData;
        }
        $scope.arrangeDataNew = function (data, resourceColumns, reqType, formIdTemp) {
            $rootScope.$emit("ShowLoading");
            var resourceData = [];
            var basicDetails = window["EventBasicDetail"];
            var columnTitle = '';
            var calSettings = {}
            if (reqType == "resource") {
                columnTitle = basicDetails.formData.minorGroup;
                calSettings = _.findWhere($scope.formDetailsDataInfo.calenderSettingsList, { resourceForm: formIdTemp });


            }
            else if (reqType == "activity") {
                columnTitle = basicDetails.formData.activities;
                calSettings = _.findWhere($scope.formDetailsDataInfo.calenderSettingsList, { activitiesForm: formIdTemp });

            }
            if (angular.isDefined(data)) {
                for (var count = 0; count < data.length; count++) {
                    var row = {};
                    row = data[count];
                    row.title = "";
                    var resColumns1 = [];
                    if (!DataService.isEmpty(calSettings)) {
                        if (reqType == "resource") {
                            _.each(calSettings.majorGroupParse, function (item) {
                                var list = _.findWhere(data[count].resColumns, { columnName: item });
                                if (!DataService.isEmpty(list)) {
                                    row.title += "" + list.columnValue + " - ";
                                }
                            });
                            row.title = row.title.substring(0, row.title.length - 2);
                        } else if (reqType == "activity") {

                            var list = _.findWhere(data[count].actColumns, { columnName: calSettings.activities });
                            if (!DataService.isEmpty(list)) {
                                row.title += "" + list.columnValue + " - ";
                            }
                            row.title = row.title.substring(0, row.title.length - 2);
                        }
                    }
                    var row1 = row;
                    resourceData.push(row1);
                }
            }
            $rootScope.$emit("HideLoading");
            return resourceData;
        }
        $scope.openTabulator = function (formId) {
            if (formId != 0)
                $state.go('records', { formId: formId });
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
                    ////console.log(itemData)
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
                            ////console.log(ddd);
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
                    $rootScope.$emit("HideLoading", err);
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

        function StudentFormDataDelete(dataParam) {
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

                                $timeout(function () {
                                    location.reload();
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
            //console.log('id=' + $stateParams.formId);
            $state.go('saveFormEntryData', { 'formId': $stateParams.formId });
        });
        $('#tabulatorModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var form_id = button.attr('data-referral-form-id');
            var modal = $(this);
            var $formIdField = button.attr('data-referral-form-field-id');
            // one to many form control
            if (button.attr('data-one-to-many')) {
                $(this).find("input[name='modal-one-to-many']").val("1");
                $(this).find("input[name='tabulator-id']").val(button.attr('data-tabulator'));
                $(this).find("input[name='modal-field-map']").val(button.attr('data-field-map'));
            }
            if (!DataService.isEmpty(form_id)) {
                $timeout(function () {
                    var param = {};
                    param.action = 2;
                    param.formId = form_id;
                    param.fieldName = $formIdField;
                    mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                        .then(function (response) {
                            //console.log(response);
                            $scope.allReferrenceData = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));

                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                            $timeout(function () {
                                if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                    $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");
                                window["popupTabulator"].setColumns(bindTColumnHeader($scope.allReferrenceData.formDataHeaders));

                                $scope.selectedTabFilter($scope.tabList[0], 0);
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

        });
        $scope.copyCalenderEventFunction = function (paramData) {
            var newParam = {};
            newParam = paramData;
            if (DataService.isEmpty(newParam.formId))
                newParam.formId = $scope.id;
            newParam.created_by = $scope.userDetail.Id;
            newParam.updated_by = $scope.userDetail.Id;
            newParam.newFormGroupKey = create_UUID();
            $rootScope.$emit("ShowLoading");
            mainService.copyCalenderEvent("copyCalenderEvent", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        var tempTabulatorData = response.data;
                        //console.log(tempTabulatorData);
                        if (newParam.action == 10) {
                            if (!DataService.isEmpty(tempTabulatorData))
                                if (!DataService.isEmpty(tempTabulatorData.formDataListNew))
                                    if (tempTabulatorData.formDataListNew.length > 0) {
                                        var CalendarEventList = window["CalendarEventList"];
                                        // var ActivityEventList = window["ActivityEventList"];
                                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                                        CalendarEventList = $('#' + current_tab + ' div.calendar').fullCalendar('clientEvents');
                                        var eventBasicData = window["EventBasicDetail"];
                                        var newCopyEvent = tempTabulatorData.formDataListNew[0];
                                        var exists = _.findWhere(CalendarEventList, { Id: newParam.Id });
                                        if (!DataService.isEmpty(exists)) {
                                            newCopyEvent.customTitle = exists.customTitle;
                                            newCopyEvent.customForms = exists.customForms;
                                            newCopyEvent.customFormIds = exists.customFormIds;
                                        }
                                        CalendarEventList.push(newCopyEvent);
                                        window["CalendarEventList"] = CalendarEventList;
                                        var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                                        $(current_tab + ' div.calendar').fullCalendar('refetchEvents');
                                        //loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, ActivityEventList);
                                        refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                                        notifierService.notifyMessage('success', 'Calender', 'Event Copied Successfully');
                                        $("body .popover").addClass('isPopoverLoaded');
                                        $("body .popover").popover('hide');
                                        $("#tabuListUl").empty();
                                        var $scope = angular.element($("#calendar")).scope();
                                        $('.temp').find('.titleContainer').removeClass('d-none');
                                        $('.popoverSelect').addClass('d-none');
                                        $("#customEventDetailsModelPopUp").modal("hide");
                                        //refreshEventResourcesActivityNew('BasicView', $scope.filterredFormDataTemp, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.filterredFormDataTemp);
                                    }
                        }
                        $rootScope.$emit("HideLoading");
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.manageCalenderReferrenceControl = function (paramData) {
            var newParam = {};
            newParam = paramData;
            if (DataService.isEmpty(newParam.formId))
                newParam.formId = $scope.id;
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.manageCalenderReferrenceNew("ManageCalenderReferrenceNew", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //var temp = response.data;    
                        var tempTabulatorData = response.data;
                        if (newParam.action == 4 || newParam.action == 1) {

                            if ($scope.otherformSelectionDropdown && $scope.otherformSelectionDropdown != "") {
                                var current_tab = $('#tabs .ui-tabs-panel:eq(' + $("#tabs").tabs("option", "active") + ')').attr('id');
                                $('div.calendar').fullCalendar('refetchEvents');
                                $scope.otherformSelectionDropdown = "";

                                //if (!DataService.isEmpty($scope.formDetailsDataInfo.otherformid)) {
                                //    if (!DataService.isEmpty(newParam.formfieldDataListTemp)) {
                                //        var studentList = JSON.parse(newParam.formfieldDataListTemp);
                                //        if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName)) {
                                //            var studentNameField = JSON.parse($scope.formDetailsDataInfo.otherFormFieldName)
                                //            studentNameField = studentNameField[0];
                                //            _.each(studentList, function (item) {
                                //                customFourthTitle += item[studentNameField] + " , ";
                                //            });
                                //            if (customFourthTitle.length > 0) {
                                //                customFourthTitle = customFourthTitle.substring(0, customFourthTitle.length - 2);
                                //            }
                                //        }
                                //    }
                                //}
                                //newParam.customFourthTitle = customFourthTitle;
                                //reBindCalenderEvents(newParam, 1);
                                $rootScope.$emit("HideLoading");

                                return;
                            }

                            var dataArray = [];
                            var oneToManyTempData = [];
                            newParam.formGroupKey = $scope.tabuListLink.formGroupKey;
                            newParam.Id = $scope.tabuListLink.selectedId;
                            loadEventRecordDetails(newParam);
                            //console.log(tempTabulatorData);
                            var customFourthTitle = "";
                            if (tempTabulatorData.length > 0) {
                                if (tempTabulatorData[0].res == 1) {
                                    if (!DataService.isEmpty($scope.formDetailsDataInfo.otherformid)) {
                                        if (!DataService.isEmpty(newParam.formfieldDataListTemp)) {
                                            var studentList = JSON.parse(newParam.formfieldDataListTemp);
                                            if (!DataService.isEmpty($scope.formDetailsDataInfo.otherFormFieldName)) {
                                                var studentNameField = JSON.parse($scope.formDetailsDataInfo.otherFormFieldName)
                                                studentNameField = studentNameField[0];
                                                _.each(studentList, function (item) {
                                                    customFourthTitle += item[studentNameField] + " , ";
                                                });
                                                if (customFourthTitle.length > 0) {
                                                    customFourthTitle = customFourthTitle.substring(0, customFourthTitle.length - 2);
                                                }
                                            }
                                        }
                                    }
                                    newParam.customFourthTitle = customFourthTitle;
                                    reBindCalenderEvents(newParam, 1);
                                }
                            }


                            if (!$("body .popover").hasClass("isPopoverLoaded")) {
                                $("#tabuListLink").on("click", function () {
                                    var dialog = $ngBootbox.customDialog({
                                        templateUrl: 'tabulatorModal.html',
                                        scope: $scope,
                                        title: 'Student',
                                        size: "large"
                                    });
                                    loadEventTabulator();
                                    // $("body .popover").removeClass('isPopoverLoaded');
                                });
                                $("#addTransactionRecord").on("click", function () {
                                    var dialog = $ngBootbox.customDialog({
                                        templateUrl: 'addTransactionRecordTabulatorModal.html',
                                        scope: $scope,
                                        title: 'Student',
                                        size: "large"
                                    });
                                    loadStudentTabulator();
                                    //$("body .popover").removeClass('isPopoverLoaded');
                                });
                            }




                        }
                        //$rootScope.$emit("HideLoading");
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        function userAccessRightsDelete() {
            var result = false;
            var scope = angular.element($("#calendar")).scope();
            var formDetailsInfo = scope.formDetailsDataInfo;
            var userId = json.parse(localStorage.getItem('detail').Id);
            if (userId.toString() === formDetailsInfo.created_by.toString()) {
                var _own = formDetailsDataInfo.recordAccessSecurity.own;
                if (_own.delete == true)
                    result = true;

            }
            else {
                var _other = formDetailsDataInfo.recordAccessSecurity.other;
                if (_other.delete == true)
                    result = true;
            }

            return result;

        }
        $(document).on('click', '#eventEdit', function (event) {
            //alert('eventEdit')

            var $scope = angular.element($("#calendar")).scope();
            if ($scope.currentUserFormRole == 0 || $scope.currentUserFormRole == 1) {
                swal({
                    title: 'Add / Edit Access',
                    text: "User can't access it",
                    type: 'error'
                });
                return false;
            }
            var formId = $(event.currentTarget).attr('data-formid');
            var formGroupKey = $(event.currentTarget).attr('data-formgroupkey');
            var rowId = $(event.currentTarget).attr('data-eventid');
            var eventData = $scope.selectEventDetails;
            var customFormIds = [];
            var customForms = [];
            if (eventData.customFormIds.contains(',')) {
                var customTemp = eventData.customFormIds.split(',');
                _.each(customTemp, function (item) {
                    customFormIds.push(item.trim());
                });


                var customTemp1 = eventData.customForms.split(',');
                _.each(customTemp1, function (item) {
                    var form = item.trim();
                    customForms.push(form);
                });
                _.each($scope.xaxisFormList, function (item) {
                    var exists = [];
                    exists = _.filter(customForms, function (filteritem) { return filteritem == item.resourceActivityForm.toString() });
                    if (exists.length == 0) {
                        customForms.push(item.resourceActivityForm.toString());
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
            $("body .popover").removeClass('isPopoverLoaded');

            //var params = windowParams();
            var params = setWindowScreenSize($scope.formDetailsDataInfo.screenMode);
            var newWindow = {};
            var baseUrl = mainService.getEditbaseUrl();
            newWindow = window.open(baseUrl + "#/form/editEvent/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1&customForms=' + customForms + '&customFormIds=' + customFormIds + '', 'example', params, true);
            newWindow.focus();
            localStorage.setItem("newWindow", newWindow);
            var $scope = angular.element($("#calendar")).scope();



            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    var $scope = angular.element($("#calendar")).scope();
                    $scope.resetFilter();
                    $("body .popover").addClass('isPopoverLoaded');
                    $("body .popover").popover('hide');
                    $("#tabuListUl").empty();
                    var $scope = angular.element($("#calendar")).scope();
                    $('.temp').find('.titleContainer').removeClass('d-none');
                    $('.popoverSelect').addClass('d-none');
                    window["newWindow"] = "";
                    $("#customEventDetailsModelPopUp").modal("hide");
                    //location.reload();
                }
            }, 500);
        });
        $(document).on('click', '.delete-event', function (event) {

            window["scrollOffset"] = $(window).scrollTop();
            if (!(userAccessRightsDelete)) {
                swal({
                    title: 'Form Edit',
                    text: 'You are not allowed to do this operation. Form Based Roles',
                    type: 'error'
                });
                return false;
            }

            event.preventDefault();
            //console.log(event);
            var $button = $(this);
            var eventBasicData = window["EventBasicDetail"];




            var $scope = angular.element($("#calendar")).scope();
            if ($scope.currentUserFormRole == 0 || $scope.currentUserFormRole == 1) {
                swal({
                    title: 'Add / Edit Access',
                    text: "User can't access it",
                    type: 'error'
                });
                return false;
            }
            /// var confirm = window.confirm("Are you sure to delete?");
            //if (confirm) {
            swal({
                title: "Are you sure to delete?",
                type: 'warning',
                buttons: {
                    confirm: 'Yes, delete it!',
                    cancel: 'cancel'
                }
            }).then((result) => {
                if (result) {


                    var param = {};
                    //if ($scope.listTabulator.length > 0) {
                    //    var temp = $scope.listTabulator[0];
                    //    param.formId = temp.reference_form;
                    param.isInternalDrop = true;
                    //} else {
                    //    param.formId = $scope.formDetailsDataInfo.otherformid;
                    //    param.isInternalDrop = false;
                    //}
                    var Id = $scope.selectEventDetails.Id;
                    param.formId = $scope.currentFormId;
                    param.formGroupKey = $scope.selectEventDetails.formGroupKey;
                    param.parentID = $scope.currentFormId;
                    setTimeout(function () {
                        debugger;
                        $.ajax({
                            method: 'POST',
                            url: BASE_URL + "FormAPI/EditEventData",
                            dataType: 'json',
                            contentType: "application/json",
                            data: "{'action':3,'Id':" + parseInt(Id) +
                                ",'formId':" + param.formId +
                                ",'parentID':" + param.parentID +
                                ",'formGroupKey':'" + param.formGroupKey +
                                "','isInternalDrop':" + param.isInternalDrop +
                                ",'topicId':" + eventBasicData.formData.topicId +
                                "}",
                            success: function (response) {
                                if (response.res > 0) {
                                    eventBasicData.formGroupKey = create_UUID();
                                    window["EventBasicDetail"] = eventBasicData;

                                    var CalendarEventList = window["CalendarEventList"];



                                    CalendarEventList = $.grep(CalendarEventList, function (e) {
                                        return e.Id != Id;
                                    });

                                    window["CalendarEventList"] = CalendarEventList;

                                    //console.log('after  deletion ');
                                    refreshEventResourcesActivityNew('deleteEvent', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, []);
                                    $button.parents('.popover').remove();
                                    notifierService.notifyMessage('success', 'Calender', 'Event Deleted Successfully');
                                    $("#customEventDetailsModelPopUp").modal("hide");
                                    ///$.jGrowl(response.Message, { position: 'center' });

                                } else
                                    console.log(response);

                            },

                            beforeSend: function () {
                                showLoader();
                            },

                            complete: function () {

                                var _ScrollOffset = window["scrollOffset"];
                                window.scrollTo(0, _ScrollOffset);
                                $.unblockUI();
                            }
                        });
                    }, 150);
                }
            });
            //}
        });
        $(document).on('click', '.edit-event  ', function (event) {
            event.preventDefault();
            console.log(event);
            var $button = $(this);
            $button.parents('.popover').remove();
        });

        // Initialize jquery ui tabs
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

        var dialog = $("#dialog").dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            draggable: false,
            show: { effect: "clip", duration: 250 },
            hide: { effect: "explode", duration: 500 },
            buttons: {
                Add: function () {
                    addEvent(form);
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            },
            close: function () {
                form[0].reset();
            }
        });
        // AddTab form: calls addTab function on submit and closes the dialog
        var form = dialog.find("form").on("submit", function (event) {
            //addEvent();
            dialog.dialog("close");
            event.preventDefault();
        });

        // Datetime picker in create event dialoge
        $("#tab_start, #tab_end").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            minView: 0,
            maxView: 1,
            startView: 1,
            autoclose: true,
            //todayBtn: true,
            //todayHighlight: true,
            minuteStep: 10,
            //pickerPosition: "bottom-left"
        }).on('changeDate', function (e) {

        });
        // Color picker in create event dialoge
        $("#tab_color").colorpicker({ format: "rgba" });
        // setTimeout(  timeout() , 5000);

        var loader = "";
        $('#galleryModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            //var form_id = button.attr('data-formID'),
            //    form_name = button.attr('data-fieldName'),
            var files = button.attr('data-files');

            var modal = $(this);
            var _images = files.split(','); var ImgString = '';
            if (_images.length > 0) {
                for (var count = 0; count < _images.length; count++) {

                    //  ImgString += "<div class='" + _images[count].toString() + "'><img height='150' src='" + _images[count].toString() + "'></div>";

                    ImgString += "<a class='example-image-link' u-sref='" + _images[count].toString() + "' data-lightbox='example-set' title='tick-877.jpg'><img class='example-image' src='" + _images[count].toString() + "' alt='tick-877.jpg' height='150'></a>";


                }
            }


            modal.find('.modal-title').html("File Uploads:");
            modal.find('.modal-body').html("");
            modal.find('.modal-body').block({ message: '<img src="' + loader + '" />', css: { position: 'relative', width: '100%', border: 'none' } });
            modal.find('.modal-body').unblock();
            modal.find('.modal-body').html(ImgString);
            //$.post("{{ url('subforms/getAllFiles') }}", { formID: form_id, fieldName: form_name, formGroupKey: form_key }, function (data) {
            //    modal.find('.modal-body').unblock();
            //    modal.find('.modal-body').html(data);
            //});
        });
        function quickSignUp(reqType) {


            var userName = $('#name').val();
            var password = $('#password').val();
            var confirmPass = $('#re-password').val();

            var anonymousUserId = $('#txtAnonymousUserId').val();
            var anonymousPassword = $('#txtAnonymousPassword').val();
            var param = {};
            param.uid = (new Date().getTime()).toString(36);
            param.isQuickSignUp = true;
            param.action = 7;
            if (reqType == "signUp") {
                param.fullName = 'name title';
                param.name = userName;
                param.newPassword = password;
                param.confirmPassword = confirmPass;
            }
            else if (reqType == "anonymous") {
                param.fullName = 'Anonymous User';
                param.name = anonymousUserId;
                param.newPassword = anonymousPassword;
                param.confirmPassword = anonymousPassword;
            }

            $.ajax({
                type: "POST",
                url: "api/FormAPI/profile",
                data: JSON.stringify(param),
                contentType: "application/json",
                datatype: "json",
                success: function (data) {
                    var respData = data;
                    if (respData.res == 1) {
                        if (reqType == "signUp")
                            alert(respData.Message);
                        if (reqType == "anonymous") {
                            respData.reqType = "anonymous";
                        }
                        localStorage.setItem("detail", JSON.stringify(respData));
                        location.reload(true);
                    }
                    else {
                        alert(data.Message);
                    }
                }
            });

        }
        function quickLogin() {
            var param = {};
            param.action = 1;
            param.name = $('#loginUserName').val();
            param.username = $('#loginUserName').val();
            param.email = $('#loginUserName').val();
            param.phoneNumber = $('#loginUserName').val();
            param.password = $('#loginPassword').val();
            $.ajax({
                type: "POST",
                url: "api/FormAPI/Login",
                data: JSON.stringify(param),
                contentType: "application/json",
                datatype: "json",
                success: function (data) {
                    console.log(data);
                    if (data.res == 1) {
                        alert(data.Message);
                        localStorage.setItem("detail", JSON.stringify(data));
                        location.reload(true);
                    }
                    else {
                        alert(data.Message);
                    }
                }
            });
        }
        $scope.showAdvanced = function () {

            $scope.isShowAdvance = !$scope.isShowAdvance;
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





        $scope.init();
    }).filter('safeHtml', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });;

    FormGeneratorApp.controller('UserAdminCalendarController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        $scope.rootScopeSafe = function () {
            $rootScope.safeApply();
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

        adminService.postAsync('/UserAdmin/GetAllEnrolledCompaniesData/').then(function (res) {

            $scope.CompanyList = res.data.data.Data;

            setTimeout(function () {
                $scope.manageSelectedCompany();
                usercalendarLoad();
            }, 500)

        }, function (err) {

        });

        $scope.cancelPublicUserBooking = function () {
            var eventData = $scope.selectEventDetails;

            swal({
                title: "Are you sure to cancel the selected booking?",
                buttons: {
                    cancel: "No",
                    confirm: "Yes"
                }

            }).then(function (response) {
                debugger;
                if (response) {
                    showLoader();

                    var obj = {
                        USER_ID: "",
                        RESOURCE_NAME: eventData.customTitleSplit[0],
                        ACTIVITY_NAME: eventData.customTitleSplit[1],
                        FormGroupKey: $scope.selectEventDetails.formGroupKey,
                        participant: {
                            DESCRIPTION: String(eventData.description),
                            COMPANY_CODE: eventData.COMPANY_CODE,
                            CALENDAR_CODE: eventData.CALENDAR_CODE
                        },
                        transaction: {
                            SLOT: eventData.Id,
                            RESOURCE: eventData.resourceId,
                            ACTIVITY: eventData.activities,
                            STUDENT: "",
                            REMARKS: "",
                            FEES: "",
                            ATTENDANCE: "NOT-MARKED",
                            COMPANY_CODE: eventData.COMPANY_CODE,
                            CALENDAR_CODE: eventData.CALENDAR_CODE
                        }
                    }

                    $.ajax({
                        url: "/UserAdmin/CancelPublicUserBooking",
                        type: "POST",
                        data: obj,
                        success: function (data) {
                            hideLoader();

                            swal({
                                title: (data.Status) ? "Success" : "Error",
                                text: data.Message,
                                icon: (data.Status) ? "success" : "error",
                                button: "Okay"
                            }).then(function () {
                                if (data.Status) {
                                    window.location.reload();
                                }
                            });

                        },
                        error: function () {
                            hideLoader();
                            swal({ type: 'error', showCloseButton: true, html: "something went wrong!" });
                        }
                    })
                } else {
                    hideLoader();
                }
            });


        }

        $scope.reviewSession = function () {
            var eventData = $scope.selectEventDetails;

            $.ajax({
                url: "/UserAdmin/GetSingleEventDetails",
                type: "GET",
                data: {
                    EventId: eventData.Id,
                    Type: 2
                },
                success: function (response) {
                    debugger;
                    $("#customEventDetailsModelPopUp").modal("hide");
                    $("#customEventDetailsServiceModelPopUp").modal("hide");
                    $("#ViewBookingModal .modal-body").html(response);
                    $("#ViewBookingModal").modal("show");
                },
                error: function (error) {

                }
            });

        }

        //$scope.getCalendarData = function () {

        //    adminService.postAsync('/UserAdmin/GetAllEnrolledCalendarsData/', { CompanyCode: $("#company-filter-selector option:selected").val() }).then(function (res) {

        //        $scope.selectedCalendarData = res.data.data.Data;
        //        console.log($scope.selectedCalendarData);

        //    }, function (err) {

        //    });

        //}

        $scope.manageSelectedCompany = function () {
            //debugger;
            if (localStorage.getItem("publicUserSelectedCompany") != null && localStorage.getItem("publicUserSelectedCompany") != undefined && localStorage.getItem("publicUserSelectedCompany") != "null") {
                $("#company-filter-selector").val(localStorage.getItem("publicUserSelectedCompany"));
            } else {
                $("#company-filter-selector").val("-1");
            }
        }

    }).filter('safeHtml', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    });

    FormGeneratorApp.controller('UserDashboardController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {

        $("#user-nav-dashboard").addClass("active")

        adminService.postAsync('/UserAdmin/GetRecentlyBookedCalendars/').then(function (res) {

            console.log(res.data.data.Data)

            for (var i = 0; i < res.data.data.Data.length; i++) {
                res.data.data.Data[i].SlotCreated = moment(res.data.data.Data[i].SlotCreated).format("YYYY-MM-DD HH:mm");
                res.data.data.Data[i].COMPANY_LOGO_PATH = res.data.data.Data[i].COMPANY_LOGO_PATH.replace('~', '..')
            }

            $scope.CalendarCompanyList = res.data.data.Data;

        }, function (err) {

        });


        $scope.GoToCalendar = function (companyCode, listId = 1) {//list id 2 is for the company event list data on right hand side of the screen, and list id 1 is for left/ recently booked calendars company data... used for mapping companyId with companyCode
            var companyCode = "";

            if (listId == 1) {
                for (var i = 0; i < $scope.CalendarCompanyList.length; i++) {
                    if ($scope.CalendarCompanyList[i].COMPANY_CODE == companyId) {
                        companyCode = $scope.CalendarCompanyList[i].COMPANY_CODE;
                    }
                }
            } else if (listId == 2) {
                console.log($scope.CalendarCompanyList2);
                for (var i = 0; i < $scope.CalendarCompanyList2.length; i++) {
                    if ($scope.CalendarCompanyList2[i].COMPANY_ID == companyId) {
                        companyCode = $scope.CalendarCompanyList2[i].COMPANY_CODE;
                    }
                }
            }



            localStorage.setItem("publicUserSelectedCompany", companyCode);
            $state.go("my_calendar", { "formId": 2305 });
        }


        $scope.GoToCalendar = function (companyCode, calendarCode, redirectType = 1) {//list id 2 is for redirect to useradmin calendar, and list id 1 is for marketplace calendar

            if (redirectType == 1) {
                window.location.href = "/company/calander/" + companyCode + "/" + calendarCode;
            } else {
                localStorage.setItem("publicUserSelectedCompany", companyCode);
                $state.go("my_calendar", { "formId": 2305 });
            }


        }


        $scope.getMyUpcomingBookings = function () {
            adminService.postAsync('/UserAdmin/GetMyUpcomingBookings/', {}).then(function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    var splitTime = res.data[i].start.split('T');
                    res.data[i].COMPANY_LOGO_PATH = res.data[i].COMPANY_LOGO_PATH.replace('~', '..')
                    res.data[i].start = splitTime[0] + " " + splitTime[1].substring(0, 5)
                    res.data[i].title = res.data[i].customTitle;
                }

                $scope.bookingEventData = res.data;
                $scope.CalendarCompanyList2 = res.data;

            }, function (err) {

            });
        }

        $scope.getMyUpcomingBookings();

        $scope.AttendSession = function (eventId, type) {
            debugger;
            $scope.currentTransaction = $scope.bookingEventData.find(x => x.Id == eventId);

            if (type == "QR") {
                $scope.generateQRCode($scope.currentTransaction.TransactionId);
            } else {
                openWebCam($scope.currentTransaction.Id);
            }

        }

        $scope.generateQRCode = function (TId) {
            $.ajax({
                url: "/Useradmin/GenerateAttendanceQR?TransactionId=" + TId,
                type: "Get",
                success: function (response) {
                    debugger;
                    if (response != null) {
                        if (response.Status) {
                            $("#GeneratedQRCodeModal img").attr("src", response.Data.QRImageURL.replace("~", ".."));
                            $("#GeneratedQRCodeModal").modal("show");
                        } else {
                            alert("Failed to generate QR Code");
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }
            })

        }

        $scope.markPresent = function () {

            adminService.postAsync('/Calendar/UpdateTransactionAttendance/', { TransactionId: $scope.currentTransaction.Id, IsPresent: true }).then(function (res) {

                $scope.CalendarMasterList(false);
                $scope.closeAttendanceModel();

            }, function (err) {

            });
        }

        loadcalendar();

        //$scope.startDate = moment(new Date());

        //$scope.getBookingDataForDate($scope.startDate.startOf('month').local().format('YYYY-MM-DD'), $scope.startDate.endOf('month').add('months', 1).local().format('YYYY-MM-DD'));


        function loadcalendar(events) {
            var cal0 = $('#calendar0');
            var cal1 = $('#calendar1');
            var cur, d;
            cal0.fullCalendar({
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                header: {
                    left: 'title',
                    center: '',
                    right: 'prev,next'
                    /*right: ''*/
                },
                defaultDate: moment(new Date()).local().format('YYYY-MM-DD'),
                //events: events,

                events: function (start, end, timezone, callback) {
                    var param = {};
                    param.StartDate = start;
                    param.EndDate = end;
                    $.ajax({
                        method: 'POST',
                        url: BASE_URL + "/UserAdmin/GetFullCalendarEvents/",
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(param),
                        success: function (response) {

                            var calenderData = changeResourceIDByYSelection((response != undefined) ? response : response);
                            if (calenderData != undefined) {

                                for (var i = 0; i < response.length; i++) {
                                    var splitTime = response[i].start.split('T');
                                    response[i].COMPANY_LOGO_PATH = response[i].COMPANY_LOGO_PATH.replace('~', '..')
                                    response[i].start = splitTime[0] + " " + splitTime[1].substring(0, 5)
                                    response[i].title = response[i].customTitle;
                                }

                                /*$scope.getBookingDataForDate(start, end);*/

                                callback(calenderData);
                                window["eventListTemp"] = calenderData;
                                window["eventListTempAgenda"] = calenderData;

                            }
                            else
                                callback([]);
                        },
                        complete: function () {
                            var _ScrollOffset = window["scrollOffset"];
                            window.scrollTo(0, _ScrollOffset);
                            $.unblockUI();

                        }
                    });
                },

                viewRender: function (view, element) {
                    cur = view.intervalStart;
                    d = moment(cur).add('months', 1);
                    cal1.fullCalendar('gotoDate', d);
                },
                eventRender: function (event, element) {
                    event.title = event.customTitle;
                    element.attr('title', event.tooltip);
                    element.css({
                        'background': '#3b5885',
                        'border-color': 'rgb(170, 170, 170)',
                        'padding': '2px',
                        'border-radius': '5px'
                    });

                },
                eventMouseover: function (calEvent, jsEvent) {
                    var tooltip = '<div class="tooltipevent" style="width:130px;height:130px;background:#000;position:absolute;z-index:10001;color:#fff;padding:4px"> Title: ' + calEvent.customTitle + '</div>'; var $tool = $(tooltip).appendTo('body');
                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $tool.fadeIn('500');
                        $tool.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tool.css('top', e.pageY + 10);
                        $tool.css('left', e.pageX + 20);
                    });
                },
                eventMouseout: function (calEvent, jsEvent) {
                    $(this).css('z-index', 8);
                    $('.tooltipevent').remove();
                }
            });
            cal1.fullCalendar({
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                header: {
                    left: 'title',
                    center: '',
                    right: ''
                    /*right: 'prev,next today'*/
                },
                defaultDate: moment(new Date()).local().add(1, 'months').format('YYYY-MM-DD'),
                /*events: events,*/
                events: function (start, end, timezone, callback) {
                    var param = {};
                    param.StartDate = start;
                    param.EndDate = end;
                    $.ajax({
                        method: 'POST',
                        url: BASE_URL + "/UserAdmin/GetFullCalendarEvents/",
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(param),
                        success: function (response) {

                            var calenderData = changeResourceIDByYSelection((response != undefined) ? response : response);
                            if (calenderData != undefined) {

                                callback(calenderData);
                                window["eventListTemp"] = calenderData;
                                window["eventListTempAgenda"] = calenderData;

                            }
                            else
                                callback([]);
                        },
                        complete: function () {
                            var _ScrollOffset = window["scrollOffset"];
                            window.scrollTo(0, _ScrollOffset);
                            $.unblockUI();

                        }
                    });
                },
                eventRender: function (event, element) {
                    event.title = event.customTitle;
                    element.attr('title', event.tooltip);
                    element.css({
                        'background': '#3b5885',
                        'border-color': 'rgb(170, 170, 170)',
                        'padding': '2px',
                        'border-radius': '5px'
                    });
                },
                eventMouseover: function (calEvent, jsEvent) {
                    var tooltip = '<div class="tooltipevent" style="width:130px;height:130px;background:#000;position:absolute;z-index:10001;color:#fff;padding:4px"> Title: ' + calEvent.customTitle + '</div>'; var $tool = $(tooltip).appendTo('body');
                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $tool.fadeIn('500');
                        $tool.fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $tool.css('top', e.pageY + 10);
                        $tool.css('left', e.pageX + 20);
                    });
                },
                eventMouseout: function (calEvent, jsEvent) {
                    $(this).css('z-index', 8);
                    $('.tooltipevent').remove();
                }
            });
        }


    })

    FormGeneratorApp.controller('BusinessUserMasterController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $scope.CalendarMasterList = function () {
            var columns = [
                { title: 'Username', field: 'USER_ID', headerFilter: "input" },
                { title: 'Email', field: 'USER_EMAIL', headerFilter: "input" },
                { title: 'Phone', field: 'USER_PHONE', headerFilter: "input" },
                { title: 'Role', field: 'SUB_ROLE', headerFilter: "input" },
                {
                    title: 'Created at', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                        return moment(cell.getData().TO_TIME).format("YYYY-MM-DD HH:mm")
                    }
                }
            ];

            setTimeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
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
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: "/BusinessAdmin/GetSingleBusinessUserMaster",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: { //ajax parameters

                    },
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                        //if (called)
                        //$('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        //$('#form-records').unblock();
                        //$.unblockUI();
                        if (response.data) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: 50,

                };
                var tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };

        $scope.CalendarMasterList();



    });

    FormGeneratorApp.controller('ClientPaymentHistoryController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $scope.CalendarMasterList = function () {
            var columns = [
                {
                    title: 'Action', field: '', formatter: function (cell, formatter) {
                        return `<a target="_blank" href="/Calendar/PaymentReceipt?Id=${cell.getData().Id}"><button class="btn btn-primary">Receipt</button></a>`;
                    }
                },
                { title: 'Client name', field: 'FIRST_NAME', headerFilter: "input" },
                { title: 'Payment Id', field: 'ORDER_NO', headerFilter: "input" },
                { title: 'Calendar', field: 'CALENDAR_NAME', headerFilter: "input" },

                {
                    title: 'Type', field: 'TRANSACTION_TYPE', headerFilter: "input", formatter: function (cell, formatter) {
                        return (cell.getData().TRANSACTION_TYPE == "Purchase") ? "Package" : "Session"
                    }
                },
                {
                    title: 'Plan name', field: 'PACKAGE_NAME', headerFilter: "input", formatter: function (cell, formatter) {
                        return (cell.getData().TRANSACTION_TYPE == "Purchase") ? cell.getData().PACKAGE_NAME : "--"
                    }
                },
                {
                    title: 'Paid Date', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                        return moment(cell.getData().TO_TIME).format("YYYY-MM-DD HH:mm")
                    }
                },
                { title: 'Method', field: 'METHOD', headerFilter: "input" },
                {
                    title: 'Client Paid', field: 'AMOUNT', headerFilter: "input", formatter: function (cell, formatter) {
                        //debugger;
                        if (cell.getData().TRANSACTION_TYPE == "Purchase") {
                            var amount = cell.getData().AMOUNT;
                            return "HK$" + amount;
                        } else if (cell.getData().TRANSACTION_TYPE == "Booking") {
                            return "B$" + parseInt(cell.getData().AMOUNT)
                        } else {
                            return "--"
                        }
                    }
                },
                { title: 'Status', field: 'STATUS', headerFilter: "input" },
            ];

            setTimeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitDataFill",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
                        columns: false, //persist columns
                    },
                    persistenceWriterFunc: function (id, type, data) {
                        localStorage.setItem(id + "-" + type, JSON.stringify(data));
                    },
                    persistenceReaderFunc: function (id, type) {
                        //id - tables persistence id
                        //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
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
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: "/Calendar/GetClientPaymentHistory",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: { //ajax parameters
                        companyCode: localStorage.getItem("COMPANY_CODE"),
                        calendarCode: localStorage.getItem("CALENDAR_CODE")
                    },
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                        //if (called)
                        //$('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        //url - the URL of the request
                        //params - the parameters passed with the request
                        //response - the JSON object returned in the body of the response.
                        //$('#form-records').unblock();
                        //$.unblockUI();
                        if (response.data) {
                            return response;
                        }
                        else {
                            return response;
                        }

                    },
                    paginationSize: 50,

                };
                var tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 150);

        };

        $scope.CalendarMasterList();
    });

    FormGeneratorApp.controller('CustomTransactionController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $scope.AttendanceRecord = [];
        $scope.isBulkMarkable = false;
        $scope.CalendarMasterList = function (isBulkMarkable = false) {

            $scope.AttendanceRecord = [];
            $scope.isBulkMarkable = isBulkMarkable;
            $scope.bindtabulatorOnly("columns", "true");

        };

        //$scope.CalendarMasterList();

        $scope.updateAttendanceRecord = function (recordId, IsPresent = false) {
            //debugger;
            for (var i = 0; i < $scope.AttendanceRecord.length; i++) {
                if ($scope.AttendanceRecord[i].Id == recordId) {
                    $scope.AttendanceRecord[i].Attendance = (IsPresent) ? "Present" : "Absent";
                    $scope.AttendanceRecord[i].IsUpdated = true;
                    break;
                }
            }
        }

        $scope.CreateBulkAttendance = function () {

            $("#mark-attendance-btn-area").addClass("custom-hide");
            $("#mark-attendance-submit-area").removeClass("custom-hide");

            $scope.CalendarMasterList(true);
        }

        $scope.CancelBulkAttendance = function () {
            $("#mark-attendance-btn-area").removeClass("custom-hide");
            $("#mark-attendance-submit-area").addClass("custom-hide");

            $scope.CalendarMasterList(false);
        }

        $scope.SubmitBulkAttendance = function () {

            //debugger;
            adminService.postAsync('/Calendar/UpdateBulkTransactionAttendance/', { AttendanceJsonString: JSON.stringify($scope.AttendanceRecord) }).then(function (res) {

                if (res.data.Status) {

                    swal({
                        title: "Success!",
                        text: res.data.Message,
                        icon: "success",
                        confirmButtonText: 'Okay'
                    }).then((result) => {
                        //debugger;
                        $scope.CancelBulkAttendance();
                    });

                } else {
                    alert("something went wrong!");
                }

            }, function (err) {

            });
        }

        $scope.MarkAttendance = function (transactionId) {

            adminService.postAsync('/Calendar/GetSingleTransactionMaster/', { TransactionId: transactionId }).then(function (res) {
                console.log(res.data.data);

                var slotSplit = res.data.data[0].SLOT.split('to');

                var slotStartTime = slotSplit[0].split('T')[1].substring(0, 5)
                var slotEndTime = slotSplit[1].split('T')[1].substring(0, 5)

                res.data.data[0].SLOT = slotStartTime + " to " + slotEndTime;

                $scope.currentTransaction = res.data.data[0];

                $scope.currentTransactionAttendance = (res.data.data[0].ATTENDANCE == "Yes") ? "Present" : (res.data.data[0].ATTENDANCE == "No") ? "Absent" : "Unmarked";

                $scope.currentTransactionDate = slotSplit[0].split('T')[0]

                $("#markAttendanceModel").modal("show");

            }, function (err) {

            });

        }

        $scope.closeAttendanceModel = function () {
            $scope.currentTransaction = null;
            $scope.currentTransactionDate = null;
            $scope.currentTransactionAttendance = null;
            $("#markAttendanceModel").modal("hide");
        }

        $scope.markPresent = function () {

            adminService.postAsync('/Calendar/UpdateTransactionAttendance/', { TransactionId: $scope.currentTransaction.Id, IsPresent: true }).then(function (res) {

                $scope.CalendarMasterList(false);
                $scope.closeAttendanceModel();

            }, function (err) {

            });
        }

        $scope.markAbsent = function () {

            adminService.postAsync('/Calendar/UpdateTransactionAttendance/', { TransactionId: $scope.currentTransaction.Id, IsPresent: false }).then(function (res) {

                $scope.CalendarMasterList(false);
                $scope.closeAttendanceModel();

            }, function (err) {

            });

        }
    });


    FormGeneratorApp.controller('UserBookingsController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $("#user-nav-mybookings").addClass("active")

        $scope.ViewEvent = function (eventId, type) {
            $.ajax({
                url: "/UserAdmin/GetSingleEventDetails",
                type: "GET",
                data: {
                    EventId: eventId,
                    Type: type
                },
                success: function (response) {
                    debugger;
                    $("#ViewBookingModal .modal-body").html(response);
                    $("#ViewBookingModal").modal("show");
                },
                error: function (error) {

                }
            });
        }

        $scope.BindMyBookings = function (type) {
            // type 1 is for upcoming and 2 for past bookings

            if (type == 1) {

                $("#nav-link-upcoming").addClass("active");
                $("#nav-link-past").removeClass("active");
                $("#upcomingBookings").show();
                $("#pastBookings").hide();
            } else {

                $("#nav-link-upcoming").removeClass("active");
                $("#nav-link-past").addClass("active");
                $("#upcomingBookings").hide();
                $("#pastBookings").show();
            }

            var columns = [
                {
                    title: 'Action', field: '', headerFilter: "input", formatter: function (cell, formatter) {
                        if (type == 1) {
                            return `<button onclick="angular.element(this).scope().ViewEvent(${cell.getData().Id}, ${type})" class="btn btn-primary" style="border-radius: 50px;">View Event</button>`;
                        } else {
                            if (cell.getData().SESSION_REVIEWED == "N") {
                                return `<button onclick="angular.element(this).scope().ViewEvent(${cell.getData().Id}, ${type})" class="btn btn-danger" style="border-radius: 50px;">Rate Event</button>`;
                            } else {
                                return `<button onclick="angular.element(this).scope().ViewEvent(${cell.getData().Id}, ${type})" class="btn btn-danger" style="border-radius: 50px;">View Rating</button>`;
                            }
                            
                        }
                    }
                },
                { title: 'Company Name', field: 'COMPANY_NAME_ENGLISH', headerFilter: "input" },
                { title: 'Calendar Name', field: 'CALENDAR_NAME', headerFilter: "input" },
                { title: 'Service Name', field: 'SERVICE_TITLE', headerFilter: "input" },
                { title: 'Service Provider', field: 'SERVICE_PROVIDER_TITLE', headerFilter: "input" },
                { title: 'Location', field: 'LOCATION_TITLE', headerFilter: "input" },

                {
                    title: 'From time', field: 'start', headerFilter: "input", formatter: function (cell, formatter) {
                        return moment(cell.getData().start).format("YYYY-MM-DD hh:mm a")
                    }
                },
                {
                    title: 'To time', field: 'end', headerFilter: "input", formatter: function (cell, formatter) {
                        return moment(cell.getData().end).format("YYYY-MM-DD hh:mm a")
                    }
                },
                { title: 'Attendance', field: 'ATTENDANCE', headerFilter: "input" },
            ];

            setTimeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitData",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    columns: columns,
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        var count = data.length;
                        $('#' + ((type == 1) ? 'form-records' : 'form-records-2') + ' .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");

                        if (type == 1) {

                        } else {

                        }



                    },
                    pagination: "local",
                    ajaxURL: "/UserAdmin/GetMyBookings",
                    ajaxConfig: "POST",
                    ajaxFiltering: false,
                    ajaxSorting: false,
                    ajaxLoader: true,
                    ajaxParams: {
                        Type: type
                    },
                    ajaxResponse: function (url, params, response) {
                        return response;
                    },
                    ajaxRequesting: function (url, params) {
                        var called = true;

                        return called; //abort ajax request
                    },
                    paginationSize: 50
                };
                var tabulator = initTabulator(((type == 1) ? 'form-records' : 'form-records-2'), options);
                $('.form-builder-loader').hide();
            }, 150);

        };

        $scope.BindMyBookings(1);
    })

    FormGeneratorApp.controller('UserBCoinController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        $scope.CalendarMasterList = function (groupBy) {

            var columns = [
                {
                    title: 'Date', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                        return moment(cell.getData().created_at).format("YYYY-MM-DD")
                    }
                },
                { title: 'Company Name', field: 'COMPANY_NAME_ENGLISH', headerFilter: "input" },
                { title: 'Calendar', field: 'CALENDAR_NAME', headerFilter: "input" },
                {
                    title: 'Coin', field: 'COIN', headerFilter: "input", formatter: function (cell, formatter) {

                        if (cell.getData().CREDIT_COIN == 0 || cell.getData().CREDIT_COIN == "0" || cell.getData().CREDIT_COIN == "") {
                            return `<span style="color:#e2476c;">-${cell.getData().DEBIT_COIN}</span>`;
                        } else {
                            return `<span style="color:green;">+${cell.getData().CREDIT_COIN}</span>`;
                        }

                    }
                },
                { title: 'Type', field: 'TRANSACTION_TYPE', headerFilter: "input" }
            ];

            setTimeout(function () {
                var options = {
                    placeholder: "No Data.",
                    tooltips: function (cell) {
                        return cell.getValue();
                    },
                    height: "530px",
                    layout: "fitColumns",
                    responsiveLayout: false,
                    initialSort: [
                        { column: "created_at", dir: "desc" }
                    ],
                    persistenceID: "persisrecords",
                    persistenceMode: true,
                    persistentLayout: true,
                    persistence: {
                        sort: false, //persist column sorting
                        filter: false, //persist filter sorting
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
                    columns: columns,
                    groupBy: groupBy,
                    groupHeader: function (value, count, data, group) {
                        //value - the value all members of this group share
                        //count - the number of rows in this group
                        //data - an array of all the row data objects in this group
                        //group - the group component for the group
                        //debugger;
                        var creditValue = 0;
                        var debitValue = 0;
                        for (var i = 0; i < data.length; i++) {
                            creditValue += parseInt(data[i].CREDIT_COIN);
                            debitValue += parseInt(data[i].DEBIT_COIN)
                        }

                        return value + `<span style='margin-left:10px;'>(${count} transactions)</span>` + "<span style='margin-left:24px;'>Balance B$" + (creditValue - debitValue).toFixed(2) + "</span>";
                    },
                    footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                    dataLoaded: function (data) {
                        //data - all data loaded into the table                        
                        var count = 0;
                        if (data.length > 0)
                            count = data[0].total_records;
                        $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");
                    },
                    /// pagination: "local",              
                    ajaxFiltering: true,
                    ajaxSorting: true,
                    ajaxLoader: true,
                    ajaxURL: "/UserAdmin/GetUserBCoinMaster",
                    ajaxConfig: "POST", //ajax HTTP request type
                    ajaxContentType: "json",
                    ajaxParams: {},
                    ajaxProgressiveLoad: "scroll",
                    ajaxProgressiveLoadScrollMargin: 75,
                    ajaxRequesting: function (url, params) {

                        var called = true;
                        if (params.sorters.length == 0) {
                            params.sorters.push({ field: "created_at", dir: "desc" });
                        }
                        //if (called)
                        //$('#form-records').block({ message: '<h4>Getting Form Records...</h4>' });
                        return called; //abort ajax request
                    },
                    ajaxResponse: function (url, params, response) {
                        if (response.data) {
                            return response;
                        }
                        else {
                            return response;
                        }
                    },
                    paginationSize: 500000,

                };
                var tabulator = initTabulator('form-records', options);
                $('.form-builder-loader').hide();
            }, 50);

        };

        $scope.CalendarMasterList('COMPANY_NAME_ENGLISH');

        var tempArr = [];

        tempArr.push({
            field: "CALENDAR_NAME",
            title: "Calendar Name",
            selected: false
        })

        tempArr.push({
            field: "COMPANY_NAME_ENGLISH",
            title: "Company Name",
            selected: true
        })

        $scope.filterFieldsList = tempArr;

        $(document).on("change", "#grouping-field", function () {
            $scope.CalendarMasterList($(this).val());
        })

    })


    FormGeneratorApp.controller('UserProfileController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $('#DATE_OF_BIRTH').datepicker({
            format: 'DD/MM/YYYY',
            changeMonth: true, // Enable the months dropdown
            changeYear: true, // Enable the years dropdown
            yearRange: '-100:+0' // Specify the range of selectable years (-100 to current year)
        });
        $("#DATE_OF_BIRTH").datepicker("option", "dateFormat", "dd-mm-yy");
        $("#user-nav-myprofile").addClass("active")
        adminService.postAsync('/UserAdmin/GetSingleUserByUserId/', { UserId: $("#userIdHidden").val() }).then(function (res) {

            if (res.data.data.Status) {
                //debugger;
                res.data.data.Data.PROFILE_PHOTO_PATH = res.data.data.Data.PROFILE_PHOTO_PATH.replace("~", "..");

                const dateStr = res.data.data.Data.DATE_OF_BIRTH;
                const timestamp = moment(dateStr).valueOf();
                const formattedDate = moment(timestamp).format("DD-MM-YYYY");
                res.data.data.Data.DATE_OF_BIRTH = formattedDate;
                //res.data.data.Data.DATE_OF_BIRTH =  res.data.data.Data.DATE_OF_BIRTH.substring(0, 10);
                $("#DATE_OF_BIRTH").val(formattedDate);
                $('#countryCode').val(res.data.data.Data.Country_Code).trigger('change');

                $("#gender-" + res.data.data.Data.GENDER.toLowerCase()).attr("checked", true);

                $scope.userData = res.data.data.Data;
            }

        }, function (err) {

        });

        $scope.updateUserProfilePic = function (file) {

            var fileData = new FormData();

            fileData.append(file.name, file);

            $.ajax({
                url: '/UserAdmin/UpdateUserProfilePhoto',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    console.log(result)

                    if (result.Status) {
                        $("#PROFILE_PHOTO_IMG").attr("src", result.Data.replaceAll("~", ".."));
                        $("#PROFILE_PHOTO_ERROR").hide();
                    } else {
                        $("#PROFILE_PHOTO_ERROR").show();
                    }

                },
                error: function (err) {
                    alert(err.statusText);
                }
            });


        }

        $scope.saveUserProfileData = function () {

            var postData = {
                FIRST_NAME: $("#FIRST_NAME").val(),
                LAST_NAME: $("#LAST_NAME").val(),
                CHINESE_NAME: $("#CHINESE_NAME").val(),
                NICK_NAME: $("#NICK_NAME").val(),
                USER_ID: $("#USER_ID").val(),
                USER_PASSWORD: $("#USER_PASSWORD").val(),
                USER_EMAIL: $("#USER_EMAIL").val(),
                Country_Code: $("#countryCode").val(),
                USER_PHONE: $("#USER_PHONE").val(),
                GENDER: $("input[name=gender-selector]:checked").val(),
                DATE_OF_BIRTH: $("#DATE_OF_BIRTH").val(),
            }

            if (validateMyProfileForm(postData)) {

                $.ajax({
                    url: '/UserAdmin/UpdateUserProfileData',
                    type: "POST",
                    data: postData,
                    success: function (result) {
                        console.log(result)

                        if (result.Status) {
                            if (result.Message == "Success") {

                                swal({
                                    title: "Saved Successfully!",
                                    text: "Details Saved Successfully!!",
                                    icon: "success",
                                    button: "Okay"
                                });
                            } else if (result.Message == "Error") {
                                var errors = result.Data;

                                for (var i = 0; i < errors.length; i++) {
                                    $("#" + errors[i].key + "_ERROR").show();
                                    $("#" + errors[i].key + "_ERROR").text(errors[i].message);

                                }
                            }
                        }

                    },
                    error: function (err) {
                        alert(err.statusText);
                    }
                });

            } else {

            }

        }

        function validateMyProfileForm(data) {

            var check = true;

            if (data.FIRST_NAME == "") {
                check = false;
                $("#FIRST_NAME_ERROR").show();
            } else {
                $("#FIRST_NAME_ERROR").hide();
            }

            if (data.USER_ID == "") {
                check = false;
                $("#USER_ID_ERROR").show();
            } else {
                $("#USER_ID_ERROR").hide();
            }

            if (data.USER_PASSWORD.length < 6 || data.USER_PASSWORD.length > 12) {
                check = false;
                $("#USER_PASSWORD_ERROR").show();
            } else {
                $("#USER_PASSWORD_ERROR").hide();
            }

            if (data.NICK_NAME == "") {
                check = false;
                $("#NICK_NAME_ERROR").show();
            } else {
                $("#NICK_NAME_ERROR").hide();
            }

            if (data.USER_EMAIL.length < 3) {
                check = false;
                $("#USER_EMAIL_ERROR").text("Enter a valid Email Id");
                $("#USER_EMAIL_ERROR").show();
            } else {
                $("#USER_EMAIL_ERROR").hide();
            }

            return check;

        }

    })

    FormGeneratorApp.controller('UserMyFavoriteController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();
        $("#user-nav-myfavorite").addClass("active")

        $scope.setFavoritesData = function (pageNumber, IsInnitial = false) {
            //debugger;
            var CompanyCode = null;

            if ($("#company-filter-selector option:selected").val() != "-1") {
                CompanyCode = $("#company-filter-selector option:selected").val();
            }

            $.ajax({
                url: "/UserAdmin/GetMyFavoriteCalendars",
                type: "GET",
                data: {
                    page: pageNumber,
                    size: 8,
                    page_records: 0,
                    res: 0,
                    COMPANY_CODE: CompanyCode
                },
                success: function (response) {

                    if (IsInnitial) {
                        $scope.CompanyListFilter = response.data[1];

                        $("#company-filter-selector").empty();
                        $("#company-filter-selector").append(`<option selected value="-1">All Companies</option>`);

                        for (var i = 0; i < $scope.CompanyListFilter.length; i++) {
                            var company = $scope.CompanyListFilter[i];
                            $("#company-filter-selector").append(`<option value="${company.COMPANY_CODE}">${company.COMPANY_NAME_ENGLISH}</option>`);
                        }
                    }


                    var nextPage = 0;

                    if (pageNumber == response.last_page) {
                        nextPage = response.last_page;
                    } else {
                        nextPage = pageNumber + 1;
                    }

                    var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;

                    $(".pagination").empty();
                    $(".pagination").append(`<button class="btn" onclick="setFavoritesData(1)"><img src="../assets/marketplace/image/p1.png" /></button>`);
                    $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setFavoritesData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)})"><img src="../assets/marketplace/image/p12.png" /></button>`);

                    for (var i = 1; i <= hardBindLimit; i++) {
                        if (i == pageNumber) {
                            $(".pagination").append(`<a href="javascript:void(0)" style="line-height:1.3;" onclick="setFavoritesData(${i})" class="page-link page-link--current">${i}</a>`);
                        } else {
                            $(".pagination").append(`<a href="javascript:void(0)" style="line-height:1.3;" onclick="setFavoritesData(${i})" class="page-link">${i}</a>`);
                        }

                    }

                    $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setFavoritesData(${nextPage})"><img src="../assets/marketplace/image/p11.png" /></button>`);
                    $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="setFavoritesData(${response.last_page})"><img src="../assets/marketplace/image/p2.png" /></button>`);

                    $("#row1").empty();
                    $("#row2").empty();



                    for (var i = 0; i < response.data[0].length; i++) {
                        response.data[0][i].CALENDAR_PHOTO_PATH = response.data[0][i].CALENDAR_PHOTO_PATH.replace('~', '..')
                    }

                    for (var i = 0; i < response.data[0].length; i++) {

                        var tagQuery = "";
                        if (response.data[0][i].TAGS != null) {
                            if (response.data[0][i].TAGS.includes(",")) {
                                var tempTagData = response.data[0][i].TAGS.split(',');

                                for (var j = 0; j < tempTagData.length; j++) {
                                    if (j == tempTagData.length - 1) {
                                        tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}</a>`
                                    } else {
                                        tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}, </a>`
                                    }

                                }

                            } else {
                                tagQuery += `<a href="/Marketplace/Tag?tag=${response.data[0][i].TAGS}">${response.data[0][i].TAGS}</a>`
                            }
                        }


                        var company = response.data[0][i];

                        if (i < 4) {
                            $("#row1").append(`<div class="wrap">
                                                    <div class="wrap-im">
                                                        <img src="${company.CALENDAR_PHOTO_PATH}" style="max-height:120px;" onerror="this.src = '../assets/marketplace/image/pro.png'">
                                                    </div>

                                                    <div class="wrap-con">
                                                        <p><b>${company.COMPANY_NAME_ENGLISH}</b></p>
                                                        <P class="font-2">${company.CALENDAR_NAME}</P>
                                                        <p>Service ${company.CALENDAR_SUB_CATEGORY_NAME}</p>
                                                        /*<p><button class="book" onclick="location.href='/Marketplace/CompanySchedule?CompanyCode=${company.COMPANY_CODE}&CalendarCode=${company.CALENDAR_CODE}'">Book</button></p>*/
                                                        <p><button class="book" onclick="location.href='/Marketplace/Calander/${company.COMPANY_CODE}'">Book</button></p>
                                                    </div>
                                                </div>`);
                        } else {
                            $("#row2").append(`<div class="wrap">
                                                    <div class="wrap-im">
                                                        <img src="${company.CALENDAR_PHOTO_PATH}" style="max-height:120px;" onerror="this.src = '../assets/marketplace/image/pro.png'">
                                                    </div>
                                                    <div class="wrap-con">
                                                        <p><b>${company.COMPANY_NAME_ENGLISH}</b></p>
                                                        <P class="font-2">${company.CALENDAR_NAME}</P>
                                                        <p>Service ${company.CALENDAR_SUB_CATEGORY_NAME}</p>
                                                        /*<p><button class="book" onclick="location.href='/Marketplace/CompanySchedule?CompanyCode=${company.COMPANY_CODE}&CalendarCode=${company.CALENDAR_CODE}'">Book</button></p>*/
                                                        <p><button class="book" onclick="location.href='/Marketplace/Calander/${company.COMPANY_CODE}'">Book</button></p>
                                                    </div>
                                                </div>`);
                        }

                    }

                },
                error: function (errorResponse) {
                    alert();
                }
            })

        }

        $scope.setFavoritesData(1, true);
    })

}(FormGeneratorApp));

function setFavoritesData(pageId) {
    angular.element("#company-filter-selector").scope().setFavoritesData(pageId);
}