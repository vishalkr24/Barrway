(function () {
    'use strict';
    FormGeneratorApp.controller('FormEntryController', function ($scope, $rootScope, CookiesPersistenceService, $http, $state, $location, $window, $ngBootbox, $timeout, mainService, notifierService, $stateParams, DataService, translationService) {

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
            ////////////
            //if page load on QR check=anonymous   request   if ( request==QR req  && login details not exists)      //password protection will be disable in case of QR request.
            ///////////

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
        };

        $scope.promptProtectedPassword = function (formPassword, formString, formID, baseUrl) {
            bootbox.dialog({
                onEscape: function () {
                    // alert(baseUrl + "#/forms");
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
                                        //'<button class="btn btn-default" data-dismiss="modal">Cancel</button>'+
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
                                //return false;
                            }
                        },
                        ok: {
                            label: "Login",
                            className: 'btn-info',
                            callback: function () {
                                //window.open("{{url('auth/login')}}","_self");
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
                                        //'<button class="btn btn-default" data-dismiss="modal">Cancel</button>'+
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
                //console.log(images)
                var newHtml = '';
                $.each(images, function (i, val) {
                    //console.log(val)
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
            $scope.formFields = [];
            $scope.formDataList = {};
            $scope.subscription = {};
            $scope.subscription.isAllowToLoad = true;
            $scope.pageLength = 0;
            $scope.entryForOneToMany = false;
            $scope.htmlContentData = "";
            $scope.userDetail = mainService.loginDetails();
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.IsFreePlan = 1;
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
                if ($('#paypalcheckoutjs').length == 0)
                    loadcssjsfile("https://www.paypalobjects.com/api/checkout.js", "js", "paypalcheckoutjs");
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
            $scope.ApplyMultilingualText();
            window["apiCalled"] = false;
            window["apiCalledformId"] = 0;
            window["formList"] = [];
            $scope.saveTabulatorViewNew = false;
            $scope.isOneToManyFormType = false;
        };

        $window.pickDefaultValues = function (eventData, id) {
            var $this = $(id)
            var form_id = $this.attr("data-referral-form-id"),field_name = $this.attr("data-referral-form-field-name"),input_value = $this.val();
            var param = {};
            param.action = 12;
            param.formId = form_id;
            param.Id = input_value;
            param.fieldName = field_name;
            param.fieldDataText = input_value;
            
            if (input_value != '') {
                $('div.fieldefault').html('');
                $.ajax({
                    url: mainService.getCurrentEndPointUrl() + "/getReferralFormFieldsAndData",
                    type: "POST", data: JSON.stringify(param), headers: { "Content-Type": "application/json" }, dataType: "json",
                    success: function (result) {

                        $.each(result.formDataListNew[0], function (i, value) {
                            if ($("input#RowID-" + i).length) {
                                $("input#RowID-" + i).val($.trim(result['id']));
                            }
                            if ($("input[data-derived='" + i + "']").is(':checkbox') || $("input[data-derived='" + i + "']").is(':radio')) {

                                $("input[data-derived='" + i + "']").prop('checked', false).change();
                                var values = value.split(','); values.forEach(function (value) {
                                    $("input[data-derived='" + i + "'][value='" + value + "']").prop('checked', true).change();
                                });
                            }
                            else {
                                $("input[data-derived='" + i + "']").val(value).change();
                            }
                            if ($("table[data-derived='" + i + "']").length) {
                                derive_table_values(i, value);
                            }
                            $('#customFormNew').formValidation('revalidateField', $("input[data-derived='" + i + "']").attr('name'));
                            if ($("div#" + i).length) {
                                file_default_value(i, value, uploadPath);
                            }
                        });
                        if (result.formDataListNew.length == 0) {
                            if (!DataService.isEmpty(eventData)) {
                                $("#" + field_name + "_hidden").val(eventData.value);
                            }
                        }
                    }
                });
            }
            else {
                $("input").each(function () {
                    if ($(this).attr('data-derived')) { $(this).val(''); }
                });
            }

        };
        function defaultSelectedControl() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    var item = $(this).val();
                    if (!DataService.isEmpty(item))
                        if (item.toString() === value.toString()) {
                            $(this).prop("checked", true);
                            $(this).prop('disabled', true);
                        }
                });
                $("#customFormNew select[name=" + $stateParams.cname + "]").each(function () {
                    var value = $stateParams.value;
                    var item = $(this).val();
                    if (!DataService.isEmpty(item)) {
                        $(this).prop("checked", true);
                        $(this).prop('disabled', true);
                    }

                });
            }, 120);
        };
        function defaultStartDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.start + "]").each(function () {
                    var value = $stateParams.svalue;
                    $(this).val(value);
                    //var item = $(this).val();
                    //if (!DataService.isEmpty(item))
                    //    if (item.toString() === value.toString()) {
                    //        $(this).val(value);
                    //    }
                });
            }, 120);
        };
        function defaultEndDate() {
            $timeout(function () {
                $("#customFormNew :input[name=" + $stateParams.end + "]").each(function () {
                    var value = $stateParams.tvalue;
                    $(this).val(value);
                    //var item = $(this).val();
                    //if (!DataService.isEmpty(item))
                    //    if (item.toString() === value.toString()) {
                    //        $(this).val(value);
                    //    }
                });
            }, 120);
        };
        function imagelessCaptchaVerification($elem, $submit) {
            var invalid = 0;
            //console.log($submit)
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
            //console.log(obj);
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

                            window.location.href = '/FormMaster/FormMasterTabulator?FormId=4040&LanguageId=' + LanguageId;
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
            // $submit.attr('disabled', 'disabled'); $submit.addClass('disabled');
            $(document).on('keyup', 'input.cp_text',
                function () {
                    imagelessCaptchaVerification($(this), $submit);
                });
            var newWindow = null, validationCount = 0, validattfrm = '';
            $(document).on('click', '.btn-edit', function (e) {
                //$('.btn-edit').click(function (e){
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
                    //var FormId = $("#hfFormId").val();
                    var url = '@Url.Action("FormMasterTabulator", "FormMaster", new {FormId = "__FormId__"})';
                    window.location.href = url.replace('__FormId__', 4040).replace("&amp;", "&");
                }
            });
            var uploadPath = "", popupTabulator, tabulators;
            $(document).on('click', '.btn-success', function (e) {
                //$('#btn_save').click(function (e) {
                if (getParameterByName('optid') != null) {
                    e.preventDefault();
                    if ($(this).attr('value') == '@Resources.Resource.Edit')
                        return false;
                    updateFormData();
                }
                else {

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
                            // alert(objCtrl["Value"]);
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
                        //console.log($(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').length)
                        $(this).find('.tabulator-tableHolder .tabulator-row [tabulator-field="tableid"]').each(function () {
                            tableIds.push({ "Name": 'TableId', "Value": $.trim($(this).text()), "DataType": 'Number' });
                        })
                        //var id = $(this).attr('id');
                        //console.log(id)
                        //var lbl = $('label[for="' + id + '"]').clone(true);
                        //lbl.find('a').remove();
                        //var tabulatorName = lbl.text().split(' ');
                        //var TabulatorId = $.trim(tabulatorName[0]);
                        //tabulators[TabulatorId] = tableIds;
                        ////For Persistent Column Layout
                        //var columnLayout = localStorage.getItem('tabulator-' + TabulatorId.toLowerCase());// +$.toString(TabulatorId).toLocaleLowerCase()// $("#" + TabulatorId).tabulator("getColumnLayout");
                        //var columnSort = localStorage.getItem('tabulator-' + TabulatorId.toLowerCase() + "-sort");
                        //$.cookie(TabulatorId.toLowerCase() + "_ColumnLayout", columnLayout);
                        //$.cookie(TabulatorId.toLowerCase() + "_ColumnSort", columnSort);
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
        /* Ajax request for getting the default values */
        $(document).on("change", ".call_default_values", function () {
            pickDefaultValues($(this));
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
                dependent_fields_value = $this.attr("data-referral-form-field-name-value"),
                dependent_fields_value_multiple = $this.attr("data-referral-form-field-name-value-multiple"),
                dependent_field_names_display = $this.attr("data-dependent_field_names_display"),
                dependent_field_names_in_table = $this.attr("data-dependent_field_names_in_table"),
                input_value = $this.val(),
                input_id = $this.attr("id"),
                query = "";

            $("form select[data-referral-form-id='" + form_id + "']")
                .each(function (index) {
                    var svId = $(this).attr('id');
                    var customField = "";
                    var svfield_name = $(this).attr('data-referral-form-field-name');
                    customField = svfield_name;
                    var svfield_nameId = $(this).attr('data-referral-form-field-name-value');
                    if (!DataService.isEmpty(svfield_nameId)) {
                        customField = svfield_nameId;
                    }
                    var svValue = $(this).val();
                    if (svId == input_id && index == 0) {
                        // $("option:selected").prop("selected", false);
                        //$(this).prop("selected", false);
                        deselecAll(form_id);
                        //setTimeout(function () {
                        $("#" + input_id).val(svValue);
                        //$("#" + input_id+" > option").each(function () {
                        //    if ($(this).val() == svValue)
                        //        $(this).prop("selected", true);
                        //});
                        //}, 500);
                    }
                    if (svValue != 0 && dependent_fields !== '' && svValue != null)
                        query += customField + " = '" + svValue + "' and "

                });
            query = query.substring(0, query.length - 4);

            if ((dependent_fields !== '' && dependent_fields != undefined) || (dependent_field_names_in_table !== '' && dependent_field_names_in_table != undefined)) {
                var dependent_fields_arr = undefined;
                var dependent_fields_in_table_arr = undefined;

                if (dependent_fields !== '' && dependent_fields != undefined)
                    dependent_fields_arr = dependent_fields.split(',');
                if (dependent_field_names_in_table !== '' && dependent_field_names_in_table != undefined)
                    dependent_fields_in_table_arr = dependent_field_names_in_table.split(',');


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
                            //dependent_fields_arr.forEach(function (dependent_field) {
                            //    $('#' + dependent_field).val('');
                            //    $('#' + dependent_field).attr('disabled', 'disabled');
                            //});
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
                                }
                                else {
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
                                if (dependent_fields_arr != undefined) {
                                    var resultTemp = {};
                                    if (result.length > 0) {
                                        resultTemp = result[0];
                                    }
                                    var displayList = [];
                                    var displayFieldNameTemp = "";
                                    if (dependent_field_names_display != undefined && dependent_field_names_display != '') {
                                        displayList = dependent_field_names_display.split(',');
                                    }
                                    if (displayList.length > 0) {
                                        displayFieldNameTemp = displayList[0];
                                    } else {
                                        displayFieldNameTemp = dependent_fields_value;
                                    }

                                    dependent_fields_in_table_arr.forEach(function (tables) {
                                        //table Field
                                        var fieldNameTemp = "";
                                        var tableId = tables;

                                        dependent_fields_arr.forEach(function (tableField) {

                                            if (tableField.contains("[")) {
                                                var list = [];
                                                list = tableField.split('[');
                                                if (list.length > 0) {
                                                    var columnNoTemp = list[1].replace(']', '');
                                                    var rowLength = $("#" + list[0] + " table tbody tr").length;
                                                    if (rowLength > 0) {
                                                        for (var i = 1; i <= rowLength; i++) {
                                                            $("#" + tableId + " table tbody *[id='" + tableId + "[" + columnNoTemp + "][row-" + i + "]']").val(resultTemp[displayFieldNameTemp]);
                                                        }
                                                    }
                                                }
                                            }
                                            else {
                                                $("#" + tableField + "").val(resultTemp[displayFieldNameTemp]);
                                            }
                                        });


                                    });






                                    //dependent_fields_in_table_arr.forEach(function (tableField) {
                                    //    //table Field
                                    //    var fieldNameTemp = "";
                                    //    if (tableField.contains("[")) {
                                    //        var list = [];
                                    //        list = tableField.split('[');
                                    //        if (list.length > 0) {
                                    //            var columnNoTemp = list[1].replace(']', '');
                                    //            var tableIdTemp = list[0];
                                    //            var rowLength = $("#" + list[0] + " table tbody tr").length;
                                    //            if (rowLength > 0) {
                                    //                for (var i = 1; i <= rowLength; i++) {
                                    //                    $("#" + tableIdTemp + " table tbody *[id='" + tableIdTemp + "[" + columnNoTemp + "][row-" + i + "]']").val(resultTemp[displayFieldNameTemp]);
                                    //                }
                                    //            }
                                    //        }
                                    //    }
                                    //    else {
                                    //        $("#" + tableField + "").val(resultTemp[displayFieldNameTemp]);
                                    //    }
                                    //});
                                }

                            }
                            $rootScope.$emit("HideLoading");
                        },
                        complete: function () {
                            $('.favicon-loader-overlay').removeClass('active');
                            $rootScope.$emit("HideLoading");
                            //dependent_fields_arr.forEach(function (dependent_field) {
                            //    $('#' + dependent_field).removeAttr('disabled');
                            //});
                        }
                    });
                } else {
                    //dependent_fields_arr.forEach(function (dependent_field) {
                    //    $('#' + dependent_field + ' option').each(function () {
                    //        $(this).prop('disabled', false);
                    //        $(this).show();
                    //    });
                    //});
                }

            }
            //if (inx < $("form select[data-referral-form-id='" + form_id + "']").length)
            //$("form select[data-referral-form-id='" + form_id + "']")
            //    .each(function () {
            //        var svId = $(this).attr('id');
            //        if (input_id == svId) {

            //        } else {
            //            populateFieldsNew($(this), ajaxUrl)
            //        }
            //        inx++;
            //    });
            //}
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

                    param.created_by = $scope.userDetail.Id;
                    param.formId = formId;
                    // $rootScope.isPreviewPage = true;
                    if (localStorage.getItem("globalLang") != null)
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
                        $scope.isEdit = true;
                        if (localStorage.getItem("globalLang") != null) {
                            if (localStorage.getItem("globalLangForm") != null) {
                                param.language = localStorage.getItem("globalLangForm");
                            } else {
                                param.language = localStorage.getItem("globalLang");
                            }
                        }
                        param.action = 6;
                        param.formGroupKey = formGroupKey;
                        param.Id = $scope.rowId;
                        if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != "null") {
                            if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                                param.language = localStorage.getItem("globalLangForm");
                            } else {
                                param.language = localStorage.getItem("globalLang");
                            }
                        }
                        else {
                            param.language = "2";
                        }
                        $scope.formGroupKey = param.formGroupKey;
                        $scope.getFormSettings(param);
                        $("#formGroupKey").val($scope.formGroupKey);
                        localStorage.setItem("formGroupKey" + formId, $scope.formGroupKey);

                    } else {
                        param.action = 7;
                        $scope.isEdit = false;
                        if (localStorage.getItem("globalLang") != null && localStorage.getItem("globalLang") != "null") {
                            if (localStorage.getItem("globalLangForm") != null && localStorage.getItem("globalLangForm") != 'null') {
                                param.language = localStorage.getItem("globalLangForm");
                            } else {
                                param.language = localStorage.getItem("globalLang");
                            }
                        }
                        else {
                            param.language = "2";
                        }
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
                    //$("#" + item.name).val(newAutoId);
                    if (!$scope.isEdit) {
                        $("input[name=" + autoIdParam + "]").val(newAutoId);
                        $scope.autoGeneratedIdTemp.autoGeneratedIdTemp = newAutoId;
                        $scope.autoGeneratedIdTemp.oldId = item.value + incremt.toString();
                    }

                    return incrementedData;

                }
            }
        };

        $scope.manageOneToManyReferrenceFunction = function (submitData, dataParam) {
            var param = {};
            param.isOneToManyType = false;
            param.isOneToManyFormType = $scope.isOneToManyFormType;
            param.action = 1;
            param.Id = submitData.Id
            param.formId = $scope.currentFormId;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            if (!DataService.isEmpty($scope.strReferenceForm))
                param.MasterformId = $scope.strReferenceForm;
            else
                param.MasterformId = $scope.currentFormId;
            param.formId = $scope.currentFormId;
            if (!$scope.isEdit) {
                param.action = 1;
                param.formGroupKey = $scope.freshEntryformGroupKey;
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
            else {
                param.action = 2;
                param.formGroupKey = $scope.formGroupKey;
            }
            var list = [];
            if (!$scope.isEdit) {
                if (!DataService.isEmpty(window["tabulators"])) {
                    if (!DataService.isEmpty(dataParam.tabularId))
                        $scope.currentTabulator = dataParam.tabularId;
                    param.formId = submitData.formId;
                    if (!DataService.isEmpty($scope.currentTabulator)) {

                        var compareableControls = _.filter($scope.allReferrenceData.formDataHeaders, function (item) {
                            return !DataService.isEmpty(item.compare_value_with_control)
                                && !DataService.isEmpty(item.compare_operation)
                        });
                        if (compareableControls.length > 0) {
                            var temp1 = angular.copy(JSON.parse(dataParam.formfieldDataListTemp));
                            var compareResult = compareValues(compareableControls, temp1, $scope.allReferrenceData.formDataHeaders);
                            if (compareResult.length > 2) {
                                notifierService.notifySweetAlertMessage('error', 'Compare Field', compareResult);
                                return false;
                            }

                        }


                        var selectedRecords = window["tabulators"][$scope.currentTabulator].getData();
                        _.each(selectedRecords, function (item) {
                            var temp = {};
                            temp.MasterformId = param.formId;
                            temp.formGroupKey = create_UUID();
                            temp.reference_formId = item.formId;
                            temp.reference_form_recId = item.Id;
                            list.push(temp);
                        });
                    }
                    if (DataService.isEmpty($scope.strReferenceForm)) {
                        var temp = dataParam;
                        var temp = {};
                        temp.MasterformId = param.formId;
                        param.MasterformId = $scope.formId;
                        temp.formGroupKey = param.formGroupKey;
                        temp.reference_formId = param.formId;
                        temp.reference_form_recId = param.Id;
                        list.push(temp);
                        param.isOneToManyType = true;
                    }
                    else {
                        //var temp = dataParam;
                        //var temp = {};
                        //temp.MasterformId = param.MasterFormID;
                        //param.MasterformId = param.MasterFormID;
                        //temp.formGroupKey = param.formGroupKey;
                        //temp.reference_formId = param.formId;
                        //temp.reference_form_recId = param.Id;
                        //list.push(temp);
                        //param.isOneToManyType = true;
                    }
                }
                else {
                    var temp = dataParam;
                    var temp = {};
                    temp.MasterformId = 0;
                    temp.formGroupKey = param.formGroupKey;
                    temp.reference_formId = param.formId;
                    temp.reference_form_recId = param.Id;
                    list.push(temp);
                    param.isOneToManyType = true;
                }
                param.OneToManyFormReferrenceList = [];
                param.OneToManyFormReferrenceList = list;
                if (submitData.isAutoCompleteSubmission == true) {
                    console.log(param);
                    $scope.freshEntryformGroupKey = create_UUID();
                    param.tabularId = submitData.tabularId;
                    param.fieldName = submitData.fieldName;
                    param.userId = $scope.userDetail.Id;
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                    param.formfieldDataListTemp = submitData.formfieldDataListTemp;
                    $scope.manageAutoCompleteOneToManyFunc(param);
                    //$scope.mainOneToManyReferrenceFunction(param);
                }
                else {
                    if (param.OneToManyFormReferrenceList.length == 0) {
                        var temp = dataParam;
                        var temp = {};
                        temp.MasterformId = param.MasterFormID;
                        param.MasterformId = param.MasterFormID;
                        temp.formGroupKey = param.formGroupKey;
                        temp.reference_formId = param.formId;
                        temp.reference_form_recId = param.Id;
                        list.push(temp);
                        param.isOneToManyType = true;
                        param.OneToManyFormReferrenceList = list;
                    }
                    $scope.mainOneToManyReferrenceFunction(param);
                }
            }
            else {
                if ($scope.saveTabulatorViewNew != true) {
                    if (!DataService.isEmpty(dataParam.listTemp)) {
                        var listTemp = JSON.parse(dataParam.listTemp);
                        _.each(listTemp, function (item) {
                            var temp = {};
                            temp.MasterformId = param.formId;
                            temp.formGroupKey = create_UUID();
                            temp.reference_formId = item.formId;
                            temp.reference_form_recId = item.Id;
                            list.push(temp);
                        });
                        param.OneToManyFormReferrenceList = [];
                        param.OneToManyFormReferrenceList = list;
                        $scope.mainOneToManyReferrenceFunction(param);
                    }
                }
            }
        };

        $scope.mainOneToManyReferrenceFunction = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.manageOneToManyReferrence("ManageOneToManyReferrence", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        var resultTemp = response.data[0];
                        if (param.action == 3) {
                            $scope.currentTabulator = "formGeneratorTabulator" + param.fieldName;
                            var selectedRecords = window["tabulators"][$scope.currentTabulator].getData();
                            if (resultTemp.OneToManyFormReferrenceList != null)
                                if (resultTemp.OneToManyFormReferrenceList.length > 0) {
                                    _.each(resultTemp.OneToManyFormReferrenceList, function (item) {
                                        var idx = _.findIndex(selectedRecords, { Id: item.Id });
                                        if (idx != -1)
                                            selectedRecords.splice(idx, 1);
                                    });
                                    window["tabulators"][$scope.currentTabulator].setData(selectedRecords);
                                    setTimeout(function () { setTabulatorCalc($scope.currentTabulator); }, 500);
                                }
                        }

                        if (param.isOneToManyFormType) {
                            param.tabularId = $scope.currentTabulator;
                            param.fieldName = $scope.currentTabulatorfieldName;
                            param.formId = angular.copy(param.MasterformId);
                            param.MasterformId = angular.copy($scope.currentFormId);
                            $scope.bindOneToManyControl(param, param.tabularId, param.fieldName);
                        }
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                },
                    function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
        };


        $scope.manageAutoCompleteOneToManyFunc = function (dataParam) {
            $scope.saveTabulatorView = true;
            var tempData = JSON.parse(dataParam.formfieldDataListTemp);
            var tempList = [];
            var dataArray = [];
            // var list = '';
            // list += '{"';
            _.each(tempData, function (itemData) {
                var tempList1 = [];
                _.each(itemData, function (item, key) {
                    tempList1.push({ name: key, value: item });
                });
                tempList.push(tempList1);
            });
            // list = list.substring(0, list.length - 2);
            // list += "}"
            // dataArray.push(JSON.parse(list));
            var formGroupKeyList = [];
            var formfieldDataListTempList = [];
            var listAllFields = [];
            listAllFields = $scope.allReferrenceData.formDataHeaders;
            _.each(tempList, function (tempListItem) {
                var groupByData = _.groupBy(tempListItem, "name");
                var newList = [];
                angular.forEach(groupByData, function (item, key) {

                    if (item.length == 1) {
                        if (key.contains("[]") && item[0].value == "") {
                        } else {
                            newList.push({ "name": key, "value": item[0].value });
                        }
                        var exists = _.findWhere(listAllFields, { name: key });
                        if (!DataService.isEmpty(exists)) {
                            if (!DataService.isEmpty(exists.Referral_Form_Fields)) {
                                var exists1 = _.findWhere(tempListItem, {
                                    name: exists.Referral_Form_Fields + "_hidden"
                                });
                                var exists2 = _.findIndex(newList, {
                                    name: key
                                });
                                if (!DataService.isEmpty(exists1))
                                    if (!DataService.isEmpty(exists2)) {
                                        newList[exists2].value = exists1.value;
                                        $scope.strReferenceForm = exists.Referral_Forms;
                                    }
                            }
                        }

                    }
                    else if (item.length > 1) {
                        var tmp = _.map(item, function (t) { return t.value }).join(',');
                        newList.push({ "name": key, "value": tmp });
                    }
                });
                var formGroupKeyTemp = _.findWhere(newList, { name: "formGroupKey" });
                if (!DataService.isEmpty(formGroupKeyTemp)) {
                    dataParam.formGroupKey = angular.copy(formGroupKeyTemp.value);
                    formGroupKeyList.push(dataParam.formGroupKey);
                }

                dataParam.formfieldDataListTemp = JSON.stringify(newList);
                formfieldDataListTempList.push(dataParam.formfieldDataListTemp);
            });

            $timeout(function () {
                $rootScope.$emit("ShowLoading");
                dataParam.isInternalDrop = false;
                dataParam.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
                dataParam.formfieldDataListTempList = formfieldDataListTempList;
                dataParam.formGroupKeyListTemp = formGroupKeyList;
                mainService.manageBulkGeneratedFormData("BulkGeneratedFormData", dataParam)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (!DataService.isEmpty(response.data.Message)) {
                                var param = {};
                                param.formId = 0;
                                param.action = 4;
                                param.tabularId = dataParam.tabularId;
                                param.fieldName = dataParam.fieldName;
                                param.formGroupKey = dataParam.formGroupKey;
                                param.formGroupKeyTemp = angular.copy(dataParam.formGroupKey);
                                param.isFormGroupKey = true;
                                var listAllFields = [];
                                angular.forEach($scope.formFields, function (pageData, pageKey) {
                                    angular.forEach(pageData, function (item, key) {
                                        listAllFields.push(item);
                                    });
                                });
                                //var exists = _.findWhere(listAllFields, { name: param.fieldName });
                                //if (!DataService.isEmpty(exists)) {
                                //    param.formId = exists.reference_form;
                                //}
                                param.formId = dataParam.formId;
                                $scope.bindOneToManyControl(param, param.tabularId, param.fieldName);

                                notifierService.notifyMessage('success', 'FormEntry', response.data.Message);
                                $rootScope.$emit("HideLoading");
                            }
                        }
                    });
            }, 180);

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
                        ////console.log(response.data);
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
        $scope.refreshButtonFunc = function () {
            var param = {};
            param.action = 1;
            param.formId = $scope.currentFormId;
            var sessionName = CookiesPersistenceService.getCookieData("MyQueue_100");
            //console.log($scope.formFields);
            angular.forEach($scope.autogeneratedFieldList, function (item) {

                if (item.type == "autogenerated-field") {
                    console.log(item, 'autoid');
                    param.autoGeneratedId = item.value;
                    param.autoGeneratedFieldName = item.name;
                    if (!DataService.isEmpty(item.lower_range)) {
                        //var startId = parseInt(item.lower_range);
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
                        // if ( response.data > 0) {
                        //console.log(response.data);
                        //$("#" + response.data.autoGeneratedFieldName).val(response.data.autoGeneratedId);

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
                                    //param.autoGeneratedId = item.value;
                                    console.log(item, 'autoGeneratedId');
                                    param.autoGeneratedFieldName = item.name;
                                    if (!DataService.isEmpty(item.lower_range)) {
                                        //var startId = parseInt(item.lower_range);
                                        // param.autoGeneratedId += item.lower_range.toString();                                   
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
                                            // $("#" + response.data.lastpositionFieldName).val($scope.autoGeneratedIdTemp.oldId)
                                        }
                                    }
                                }
                                // else if (!DataService.isEmpty(item.types) && item.types == "waiting_records")
                                //    param.waitingrecordsFieldName = item.name;
                                //  else if (!DataService.isEmpty(item.types) && item.types == "status")
                                //  param.fieldName = item.name;
                            });

                        } else {
                            $("#" + response.data.currentpositionFieldName).val(response.data.autoGeneratedId)
                            $("#" + response.data.lastpositionFieldName).val("--")
                            $("input[name=" + response.data.autoGeneratedFieldName + "]").val(response.data.autoGeneratedId);
                            // $("#" + response.data.autoGeneratedFieldName).val(response.data.autoGeneratedId)
                        }

                        if ($scope.isEdit) {
                            $("#" + $scope.autoGeneratedId).prop("type", "text");
                            $("#" + $scope.autoGeneratedId).parent().css("display", "block");
                        }
                        //else {

                        //    $("input[name=" + response.data.autoGeneratedFieldName + "]").val(response.data.autoGeneratedId);
                        //}

                        $rootScope.$emit("HideLoading");
                        //}
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.navigateButtonFunc = function (type, controlId) {
            var currentTab = 0;

            // alert(type);
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
            // tabContent.children("div").removeClass("active in");
            setTimeout(function () {

                if (type == "next") {
                    var tabs = ulList;
                    var c = ulList.length;

                    currentTab = currentTab == (c - 1) ? currentTab : (currentTab + 1);
                    //tabs.tabs('select', currentTab);
                    //tabLinks.eq(currentTab).trigger('click')
                    //ulList.eq(currentTab).addClass("active");
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
                    // ulList.eq(currentTab).addClass("active");
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
                    // alert('canceled');
                    //$scope.formDetailsDataInfo.formId
                    //console.log($scope.importFormSettings.applicationId);
                    var url = mainService.getBaseUrl() + "#/application/edit/" + $scope.importFormSettings.applicationId + "";
                    window.location.href = url;
                }
                else {
                    //console.log(isConfirm);

                    var url = mainService.getBaseUrl() + "#/form/saveEntry/" + formIdParam + "?popup=1";
                    window.location.href = url;
                }
            }
            );

        };
        $scope.ExcecuteMacro = function (m_nm) {
            $scope.macro_nm = m_nm;
            updateExcel(true);
            //console.log('Hi i am the clicked macro:', m_nm);
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
                        //console.log(frmDataCheck[0].fields, "frmDataCheck");
                        if (frmDataCheck.PlanExpired == 1) {
                            //notifierService.notifySweetAlertMessage('warning', 'Subscription Plan', frmDataCheck.Message);
                            if (frmDataCheck.GracePeriodActive == 0) {
                                $rootScope.$emit("HideLoading");
                                notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', frmDataCheck.Message, 'topic');
                                return false;
                            }
                            else if (frmDataCheck.GracePeriodActive == 2) {
                                $rootScope.$emit("HideLoading");
                                notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention Period is over, kindly re-subscribe to perform entry", 'topic');
                                return false;
                            }


                        }

                        var formdata = response.data[0];
                        $scope.formDetailsDataInfo = response.data[0];
                        if ($scope.isEdit == false && formdata.PlanExpired == 1 && formdata.GracePeriodActive == 1) {
                            $rootScope.$emit("HideLoading");
                            notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention Period is active, form entries not allowed", 'topic');

                            return false;
                        }
                        if (formdata.res == 5001) {
                            $rootScope.$emit("HideLoading");
                            notifierService.notifySweetAlertMessageForRole('warning', 'Form Access Rights', "You do not have the access right to this page. You will proceed to Home page", 'Home');
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
                        //console.log('converted array', ary, 'str', str1);
                        var checkcontrol = ary.filter(x => x.type == "PayPal");
                        $scope.PPControl = false;
                        for (var i = 0; i < ary.length; i++) {
                            if (ary[i].type === "PayPal") {
                                $scope.PPControl = true;
                                $rootScope.amount = ary[i].amount;
                                $rootScope.paypal_id = ary[i].PAYPAL_ID;
                                $rootScope.paypal_currency = ary[i].PAYPAL_CURRENCY;
                                //console.log('amt:', $rootScope.amount, $scope.PPControl);

                            }
                        }
                        //if (checkcontrol.length > 0) {
                        //    console.log('$scope.PPControl', checkcontrol.length);
                        //    //$scope.amount = JSON.parse(Object.values(obj)[0]).filter(x => x.type == "amount").val


                        //}
                        //var checkMapcontrol = JSON.parse(Object.values(obj)[0]).filter(x => x.type == "map");
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
                            $scope.IsFreePlan = $scope.importFormSettings.IsFreePlan;
                            //console.log($scope.importFormSettings.IsFreePlan, 'IsFreePlan')
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
                                } else {
                                    $scope.importFormSettings.language = localStorage.getItem("globalLang");
                                }

                            }
                            if ($scope.importFormSettings.res == 1 || $scope.isEdit == true) {
                                //console.log('imprrsasd');
                                //console.log($scope.importFormSettings);


                                var frmData = response.data[0];
                                //console.log(frmData, "FormData");
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
                                var isVarified = $scope.validateUserAcess($scope.importFormSettings);
                                var isSubscriptionVarified = true;
                                var subscriptionFormID = frmData.subscriptionFormID;
                                if (angular.isDefined(subscriptionFormID)) {
                                    //alert(subscriptionFormID);
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
                                                            , otherreference_form: item.otherreference_form
                                                        });
                                                        //var col = $("input[name=" + item.name + "]");
                                                        ////console.log(col);
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
                                                        //selectedRecordOneToMany
                                                    }

                                                    if (angular.isDefined(item.values))
                                                        if (!Array.isArray(item.values))
                                                            item.values = JSON.parse(item.values);

                                                });
                                                $scope.pageLength++;
                                            });
                                            //console.log(formData);

                                            $scope.formFields.formId = param.formId;
                                            $scope.formFields = formData;
                                            $scope.navigateButtonFunc("default", "default");

                                            NewformEntryfunctionality($scope.currentFormId, $scope.isEdit);
                                        }, 150);


                                        if (!DataService.isEmpty($scope.importFormSettings.FormDataToOneListDynamic)) {
                                            if ($scope.importFormSettings.FormDataToOneListDynamic.length > 0) {
                                                $scope.formDataList = angular.copy($scope.importFormSettings.FormDataToOneListDynamic);
                                                $scope.formDataInfo = $scope.formDataList[0];
                                            }
                                        }
                                        //if (!DataService.isEmpty($scope.importFormSettings.FormDataToOneList)) {
                                        //    if ($scope.importFormSettings.FormDataToOneList.length > 0) {
                                        //        $scope.formDataList = angular.copy($scope.importFormSettings.FormDataToOneList);
                                        //        $scope.formDataInfo = $scope.formDataList[0];
                                        //    }
                                        //}
                                        loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform");
                                        $rootScope.safeApply();
                                        if (param.action == 6) {
                                            if ($stateParams.popup == 3) {
                                                param.action = 5;
                                                param.AutoId = $stateParams.Id;
                                                $scope.GetTabOneToManyDynamimc(param, param.action);
                                                //notifierService.notifyMessage('success', 'FormEntry', 'Data Updated');
                                            }
                                            $timeout(function () {
                                                //$scope.bindUpdateControls();
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
                                // notifierService.notifySweetAlertMessage('error', 'FormEntry', $scope.importFormSettings.Message);
                                $rootScope.isEntryNotAllow = true;

                                var dialog = $ngBootbox.customDialog({
                                    templateUrl: 'AccessDenied.html',
                                    title: "Access Denied",
                                    scope: $scope,
                                    size: "medium",
                                    closeButton: false
                                    //  buttons: $scope.customDialogButtons
                                });
                                $timeout(function () {
                                    //Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    //Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();
                                }, 250);
                                //$timeout(function () {
                                //    $window.history.back();

                                //}, 950);
                            }
                            //$scope.bindFields();                          
                            //console.log('bindFields');
                            $rootScope.$emit("HideLoading");
                            $scope.setInformationLink();
                        }
                        $timeout(function () {
                            $(document).on('click', 'a.calculatePaymentSum', function (event) {
                                var ID = $(this).data();
                                $scope.calculatePaymentSum(ID.namecal);
                                event.preventDefault();
                                event.stopPropagation();
                            });
                            $(document).on('change', '.customClass', function () {
                                $(".customClass").selectpicker('refresh');
                            });
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
            //console.log('hi I am map');
        }
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
                            //console.log('controlExists 19301');
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
                                                //$(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                //$(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        //if (item == "true")
                                        //    $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        //else
                                        //    $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
                                    }
                                }

                            }
                            else if (controlExists.type == "map") {
                                //console.log(key, item, 'Hi i am map control')
                                $("#customFormNew :input[name=" + key + "]").val(item)
                                if (item != null && item.length > 0) {

                                    localStorage.setItem('maploaded', "1");
                                }

                                //if (item != null && item.length > 0) {
                                //    var list = item.split(',');

                                //    $("#customFormNew :input[name=" + key + "]").each(function () {
                                //        var value = $(this).val();
                                //        var index = _.indexOf(list, value);
                                //        if (index >= 0)
                                //            $(this).prop("checked", true);
                                //        else
                                //            $(this).prop("checked", false);
                                //    });
                                //}

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
                            //else if (key.includes("checkboxGroup")) {
                            //    if (!DataService.isEmpty(item) && item != "null") {
                            //        getMultipleFiles(key);
                            //        $("#customFormNew :input[name=" + key + "]").val(item)
                            //    }
                            //    else {
                            //        if (!DataService.isEmpty(item) && item != "null") {
                            //            previewSingleImage(key, item)
                            //            $("#customFormNew :input[name=" + key + "]").val(item)
                            //        }
                            //    }
                            //}
                            else if (controlExists.type == "file") {
                                //console.log(item);
                                if (!DataService.isEmpty(item) && item != "null") {

                                    //getMultipleFiles(key);
                                    if (key.includes("filedefault")) {
                                        $("#customFormNew :input[name=" + key + "]").val(item)
                                    } else {
                                        previewUploader(key, item);
                                    }
                                    //$("#customFormNew :input[name=" + key + "]").val(item)
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
                                tinymce.get("" + key).setContent(item);
                            }
                            else if (controlExists.type == "table") {
                                if (!DataService.isEmpty(item)) {
                                    $timeout(function () {
                                        var tableDatatemp = item;
                                        //populateTableData(key, tableDatatemp, controlExists);
                                        setTableData(key, tableDatatemp, controlExists);

                                    }, 450);
                                    //tableDatatemp = JSON.parse(item);
                                }
                            }
                            else if (controlExists.type == "date") {

                                //var customdate = binddate.getFullYear() + "-" + (binddate.getMonth() + 1) + "-" + binddate.getDate();

                                var customdate = new Date();
                                if (item == "Invalid date")
                                    item = customdate;
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
                            else if (controlExists.type == "number" && controlExists.types == "slider") {


                                $("#customFormNew :input[name=" + key + "]").val(item);
                                $("#customFormNew :input[name=" + key + "]").attr("data-slider-value", item);
                                $('#' + key).bootstrapSlider({
                                    formatter: function (value) {
                                        return 'Current value: ' + item;
                                    }
                                });
                                $('#' + key).bootstrapSlider('setValue', item);
                            }
                            else {
                                $("#customFormNew :input[name=" + key + "]").val(item);
                                var existsCon = _.findWhere($scope.formFieldsAll, { name: key });
                                if (!DataService.isEmpty(existsCon)) {
                                    if (!DataService.isEmpty(existsCon.Referral_Form_Fields_Value)) {
                                        $("#customFormNew :input[name=" + key + "]").val(tempDataForEdit[existsCon.name + "_" + existsCon.Referral_Form_Fields_Value]);
                                    }
                                }
                            }
                        }
                    });
                }
                else {
                    tempDataForEdit = $scope.formDataList
                    //console.log('temp to edit');

                    angular.forEach(tempDataForEdit, function (item) {

                        if (!DataService.isEmpty(item.name)) {
                            var controlExists = _.findWhere($scope.formFieldsAll, { "name": item.name });
                            if (!DataService.isEmpty(controlExists)) {
                                //console.log('controlExists 19441');
                                if (controlExists.type == "checkbox-group") {
                                    isCheckBoxGroup = true;
                                    if ($("#customFormNew :input[name=" + item.name + "]").length > 1) {
                                        var list = item.value.split(',');
                                        $("#customFormNew :input[name=" + item.name + "]").each(function () {
                                            var value = $(this).val();
                                            var index = _.indexOf(list, value);
                                            if (index >= 0) {
                                                $(this).prop("checked", true);
                                                //$(this).bootstrapToggle('on');
                                            }
                                            else {
                                                $(this).prop("checked", false);
                                                //$(this).bootstrapToggle('off');
                                            }
                                        });
                                    }
                                    else {
                                        $("#customFormNew :input[name=" + key + "]").val(item);
                                        //if (item == "true")
                                        //    $("#customFormNew :input[name=" + key + "]").bootstrapToggle('on');
                                        //else
                                        //    $("#customFormNew :input[name=" + key + "]").bootstrapToggle('off');
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
                                //else if (item.name.includes("checkboxGroup")) {
                                //    if (!DataService.isEmpty(item.value) && item.value != "null") {
                                //        getMultipleFiles(item.name);
                                //        $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                //    }
                                //    else {
                                //        if (!DataService.isEmpty(item.value) && item.value != "null") {
                                //            previewSingleImage(item.name, item.value)
                                //            $("#customFormNew :input[name=" + item.name + "]").val(item.value)
                                //        }
                                //    }
                                //} 
                                else if (controlExists.type == "map") {
                                    console.log(key, item, 'Hi i am map control')
                                    $("#customFormNew :input[name=" + key + "]").val(item)
                                    if (item != null && item.length > 0) {

                                        localStorage.setItem('maploaded', "1");
                                    }

                                    //if (item != null && item.length > 0) {
                                    //    var list = item.split(',');

                                    //    $("#customFormNew :input[name=" + key + "]").each(function () {
                                    //        var value = $(this).val();
                                    //        var index = _.indexOf(list, value);
                                    //        if (index >= 0)
                                    //            $(this).prop("checked", true);
                                    //        else
                                    //            $(this).prop("checked", false);
                                    //    });
                                    //}

                                }
                                else if (controlExists.type == "file") {
                                    //console.log(item);
                                    if (!DataService.isEmpty(item.value) && item.value != "null") {
                                        //getMultipleFiles(key);
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

            //if (!isCheckBoxGroup) {
            //    $("#customFormNew :input:checkbox").each(function () {
            //        $(this).prop("checked", false);
            //    });
            //}

        };
        Object.size = function (obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        function setTableData(tableName, item, controlExists) {
            const obj = JSON.parse(item);
            obj.forEach(myFunction);
            function myFunction(item) {
                var intpype = $("#" + tableName + " table tbody *[name='" + item.name + "']").attr('type');
                if (intpype == "checkbox") {
                    var itemvalueArr = item.value.split(",");
                    for (let i = 0; i < itemvalueArr.length; i++) {
                        var j = itemvalueArr[i];
                        $("input[name='" + item.name + "'").each(function () {
                            var Id = $(this).attr('id');
                            var value = $(this).attr('value');
                            if (value.trim() == j.trim()) {
                                $("#" + Id).prop('checked', true);
                            }
                        });
                    }
                }
                else if (intpype == "radio") {
                    $("input[name='" + item.name + "'").each(function () {
                        var Id = $(this).attr('id');
                        var value = $(this).attr('value');
                        if (value == item.value) {
                            $("#" + Id).prop('checked', true);
                        }
                    });

                    //var ItemId = $("#" + tableName + " table tbody *[value='" + item.value + "']").attr('id');
                    //if (ItemId != undefined) {                        
                    //    $("#" + ItemId).prop('checked', true);
                    //}
                }
                else {

                    $("#" + tableName + " table tbody *[name='" + item.name + "']").val(item.value);
                }



            }
        }



        function populateTableData(tableName, item, controlExists) {
            var totalRows = 0;
            var rows = parseInt(controlExists.rows);
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
                        if (i > 1 && i > rows)
                            $("#" + tableName + " a.irow").click();
                    }
                }
            }



            //  $timeout(function () {
            var totalColumns = 0;
            _.each($scope.formFields, function (pageControlList) {
                var exist = _.findWhere(pageControlList, { name: tableName });
                if (!DataService.isEmpty(exist)) {
                    totalColumns = exist.columns.length > 0 ? parseInt(exist.columns) : 0;
                }
            });
            totalColumns += 1;
            var listRows = [];
            // for (var i = 1; i < totalRows; i++) {

            // var listColumn = [];
            //  var list = [];
            //  var listParam = {};


            //for (var j = 1; j < totalColumns; j++) {
            $timeout(function () {
                _.each(temp, function (item, keyItem) {
                    var controlId = keyItem;
                    if (!DataService.isEmpty(temp)) {
                        var parseJsonData = temp;
                        var controlData = parseJsonData[controlId];
                        var controls = $("table tr td input[name='" + controlId + "']");
                        if (controls.length > 0) {
                            // $("#" + controlId).val(parseJsonData[controlId]);
                            var type = $("table tr td input[name='" + controlId + "']").attr('type');
                            if (type != "number" && !DataService.isEmpty(type)) {
                                if (type == "date" && !DataService.isEmpty(type)) {
                                    controlData = new Date(controlData);
                                    var controlDataDate = moment(controlData).format('YYYY-MM-DD');
                                    controls.val(controlDataDate);
                                }
                                else if (type == "radio" && !DataService.isEmpty(type)) {
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
                                        // parentLabel[3].parentElement.click()
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
                            var params = deparam(controlExists.columnInputs);
                            //column-1[select][Select2]
                            var indexName = controlId.slice(controlId.indexOf("["), controlId.indexOf("]") + 1).replace("[", "").replace("]", "") + "[select][Select2]";
                            if (params[indexName] != undefined && params[indexName] == "Yes" && $("*[name='" + controlId + "']").is("select")) {
                                $("*[name='" + controlId + "']").val(controlData.trim());
                                $("*[name='" + controlId + "']").selectpicker("refresh");

                            } else {
                                $("*[name='" + controlId + "']").val(controlData.trim());
                            }

                        }
                    }
                });
            }, 450);
            //}
            //}

            // }, 250);
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
            //console.log('path from + ' + path);
            path = path.replace('~', '');
            var preview_element = document.getElementById("uploadPreview_" + id);
            //console.log(id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                // alert();
                if (path.includes('.xls') || path.includes('.xlsx') || path.includes('.pdf')) {


                    //$('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().parent().addClass('hidden');
                    //var fileAttachments = $('#' + id).parent().parents('.form-group').find('.attachments .file-attachments');
                    //fileAttachments.find('p').append('<b>' + files.name + '</b>');
                    //fileAttachments.removeClass("hidden");
                    //$("input:hidden[name=" + id + "]").attr('value', "null");



                    //var filename1 = filename((mainService.getBaseUrl() + path));
                    //alert(filename1);
                    ////var b= (aaa.match(/[^.]+(\.[^?#]+)?/) || [])[0];

                    ////alert('dsdsd');
                    //var aEl = preview_element;
                    //var newEl = document.createElement("a");
                    //newEl.href = mainService.getBaseUrl() + path;
                    //newEl.innerHTML = filename1;
                    //aEl.parentNode.appendChild(newEl, aEl);
                    //el_down.innerHTML =
                    //    "<a href='http://localhost:55106//uploadImages/users/3f3dbb1e96966/form/384/22360/Newformexcel111.xls' title='Newformexcel111.xls' download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>Newformexcel111.xls</p></a>"; 

                    //  <a href="http://localhost:55106//uploadImages/users/3f3dbb1e96966/form/384/22360/Newformexcel111.xls" title="Newformexcel111.xls" download=""><p><i class="fa fa-file-excel-o fa-3x"></i><br>Newformexcel111.xls</p></a>
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
            //console.log('path from + ' + path);
            path = path.replace('~', '');

            var preview_element = document.getElementById("uploadPreview_" + id);
            //console.log(id);
            if (angular.isDefined(preview_element) && preview_element !== null) {
                // alert();
                if (path.includes('.xls') || path.includes('.docx') || path.includes('.doc') || path.includes('.xlsx') || path.includes('.pdf')) {

                    $('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().addClass('hidden');
                    var fileAttachments = $('#' + id).parents('.form-group').find('.attachments .file-attachments');
                    var nameddd = path.substring(path.lastIndexOf('/') + 1);
                    fileAttachments.find('p').append(nameddd);
                    fileAttachments.removeClass("hidden");

                    //$('#uploadPreview_' + id).removeAttr('src'); $('#uploadPreview_' + id).parent().parent().addClass('hidden');
                    //var fileAttachments = $('#' + id).parent().parents('.form-group').find('.attachments .file-attachments');
                    //fileAttachments.find('p').append('<b>' + files.name + '</b>');
                    //fileAttachments.removeClass("hidden");
                    //$("input:hidden[name=" + id + "]").attr('value', "null");



                    //var filename1 = filename((mainService.getBaseUrl() + path));
                    //alert(filename1);
                    ////var b= (aaa.match(/[^.]+(\.[^?#]+)?/) || [])[0];

                    ////alert('dsdsd');
                    //var aEl = preview_element;
                    //var newEl = document.createElement("a");
                    //newEl.href = mainService.getBaseUrl() + path;
                    //newEl.innerHTML = filename1;
                    //aEl.parentNode.appendChild(newEl, aEl);
                    //el_down.innerHTML =
                    //    "<a href='http://localhost:55106//uploadImages/users/3f3dbb1e96966/form/384/22360/Newformexcel111.xls' title='Newformexcel111.xls' download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>Newformexcel111.xls</p></a>"; 

                    //  <a href="http://localhost:55106//uploadImages/users/3f3dbb1e96966/form/384/22360/Newformexcel111.xls" title="Newformexcel111.xls" download=""><p><i class="fa fa-file-excel-o fa-3x"></i><br>Newformexcel111.xls</p></a>
                }
                else {
                    //document.getElementById("uploadPreview_" + id).src = mainService.getBaseUrl() + path;
                    //$("#uploadPreview_" + id).removeClass("hidden");
                    //$("#uploadPreview_" + id).find('.file-title').html('');
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
                    // readAndPreview(valuePath);
                    var div = $('<div />', { class: 'figure' });
                    div.appendTo($('#shw_profile_' + id + ' > div.fileData'));
                    var extention = valuePath.substr(valuePath.lastIndexOf('.') + 1);
                    console.log(valuePath, 'previewSingleImage');
                    if (extention == "jpg" || extention == "gif" || extention == "png" || extention == "jpeg") {

                        var img = $('<img />', {
                            class: 'scaled',
                            height: '100',
                            //src: mainService.getBaseUrl() + valuePath.toString(),
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
        $scope.bindFields = function () {
            angular.forEach($scope.formFields, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {
                    item.controlHtml = "";
                    var attributesData = "";


                    var labelCustom = '<label style="text-align: ' + item.justify + ' !important" class="innerLabelWidth-' + item.name + ' control-label no-pad pull-' + item.alignment + ' ">' + item.label + '</label>';
                    if (angular.isDefined(item.required)) {
                        labelCustom = '<label style="text-align: ' + item.justify + ' !important" class="innerLabelWidth-' + item.name + ' control-label no-pad pull-' + item.alignment + ' ">' + item.label + '<span class="asteriskField" style="display: inline"> *</span></label>';
                    }
                    item.custClass = customClass(item);
                    var dataExists = _.findWhere($scope.formDataList, { "fieldName": item.name });
                    if (!DataService.isEmpty(dataExists))
                        attributesData = makeHtmlAttributeFormat(item, key, pageKey, dataExists.fieldDataText);
                    else
                        attributesData = makeHtmlAttributeFormat(item, key, pageKey, null);
                    if (item.type == "text" || item.type == "button") {
                        if (item.type == "text") {
                            item.labelHtml = labelCustom;
                            item.controlHtml = attributesData;
                            controlBinder(item, item.subtype);
                            return true;
                        } else if (item.type == "button") {
                            var buttonclass = "";
                            if (item.type == "button" && !DataService.isEmpty(item.background_color)) {
                                buttonclass = "  .borderButton-" + item.name + " { border-radius: " + item.border_width + "% !important; border: 1px solid " + item.background_color + " !important; background-color: " + item.background_color + " !important; background-image: linear-gradient(to bottom," + item.background_color + "," + item.background_color + ") !important; border-color: " + item.background_color + " !important; background-color: " + item.background_color + " !important; background-image: -webkit-gradient(linear, left top, left bottom, from(" + item.background_color + "), to(" + item.background_color + ")) !important; background-image: -webkit-linear-gradient(top, " + item.background_color + ", " + item.background_color + ") !important; background-image: -moz-linear-gradient(top, " + item.background_color + ", " + item.background_color + ") !important;background-image: -ms-linear-gradient(top, " + item.background_color + ", " + item.background_color + ") !important; background-image: -o-linear-gradient(top, " + item.background_color + ", " + item.background_color + ") !important;background-image: linear-gradient(to bottom, " + item.background_color + ", " + item.background_color + ") !important;}";
                                $("<style type='text/css'>" + buttonclass + "  </style> ").appendTo("head");

                            }
                            item.controlHtml = attributesData;
                            return true;
                        }
                    }
                    else if (item.type == "radio-group" || item.type == "checkbox-group") {
                        item.labelHtml = labelCustom;
                        var options = "";
                        if (item.type == "radio-group") {
                            item.controlHtml = "<div class='radio-group'>"

                            angular.forEach(item.values, function (i) {

                                options += "<div class='clearfix'></div><div class='radio-inline'><label> " + attributesData + " value='" + i.value + "' >" + i.label + "</label></div>";
                                return options;
                            })
                        } else if (item.type == "checkbox-group") {
                            item.controlHtml = "<div class='clearfix'></div> "

                            angular.forEach(item.values, function (i) {

                                options += "<div class='checkbox'>  <label> " + attributesData + " value='" + i.value + "' >" + i.label + "</label></div>";
                                return options;
                            })
                        }
                        item.controlHtml += options;
                        $('#customForm').formValidation('revalidateField', "'" + item.name + "'");
                        return true;
                    }
                    else if (item.type == "autocomplete") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        //  item.controlHtml += "<div class='easy-autocomplete-container'><ul style='display: none;'>"
                        var options = [];
                        angular.forEach(item.values, function (i) {
                            options.push({ "name": i.label });
                            return options;
                        });
                        //item.controlHtml += options;
                        var options1 = {
                            data: options,
                            getValue: "name"
                        };
                        item.controlHtml += "</div>";
                        item.options1 = options1;
                        controlBinder(item, item.type);
                        //$timeout(function () {
                        //    $("#" + item.name).easyAutocomplete(options1);
                        //}, 150);
                        return true;
                    }
                    else if (item.type == "date") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = "<div class='clearfix'></div> <div class='input-group'>"
                        item.controlHtml += attributesData;
                        controlBinder(item, item.types);
                        //$timeout(function () {
                        //    if (item.types == "time_picker") {
                        //        $("#" + item.name).datetimepicker({
                        //            format: "hh:ii",
                        //            minView: 0,
                        //            maxView: 1,
                        //            startView: 1,
                        //            autoclose: true,
                        //            todayBtn: true,
                        //            todayHighlight: true,
                        //            //minuteStep: 10,
                        //            pickerPosition: "bottom-left"
                        //        }).on('changeDate', function (e) {
                        //            // Revalidate the date field
                        //            $('#customForm').formValidation('revalidateField', "{{$fields['name']}}");
                        //        });
                        //    }
                        //    else if (item.types == "datetime_picker") {
                        //        $("#" + item.name).datetimepicker({
                        //            format: "yyyy/mm/dd hh:ii",
                        //            startView: 2,
                        //            autoclose: true,
                        //            todayBtn: true,
                        //            todayHighlight: true,
                        //            //minuteStep: 10,
                        //            pickerPosition: "bottom-left"
                        //        }).on('changeDate', function (e) {
                        //            // Revalidate the date field
                        //            $('#customForm').formValidation('revalidateField', "{{$fields['name']}}");
                        //        });
                        //    }
                        //    else {
                        //        $("#" + item.name).datetimepicker({
                        //            format: "yyyy/mm/dd",
                        //            assumeNearbyYear: true,
                        //            autoclose: true,
                        //            todayBtn: true,
                        //            todayHighlight: true,
                        //            //weekStart: '1',
                        //            minView: 2,
                        //            viewMode: 'days',
                        //            pickerPosition: "bottom-left"
                        //        }).on('changeDate', function (e) {
                        //            // Revalidate the date field
                        //            $('#customForm').formValidation('revalidateField', "'" + item.name + "'");
                        //        });

                        //    }
                        //    if (angular.isDefined(item.set_default))
                        //        if (angular.isDefined(item.set_default == "Yes"))
                        //            $("#" + item.name).datetimepicker("setDate", new Date());
                        //    if (angular.isDefined(item.Min_Value))
                        //        $("#" + item.name).datetimepicker("setStartDate", "'" + item.Min_Value + "'");
                        //    if (angular.isDefined(item.Max_Value))
                        //        $("#" + item.name).datetimepicker("setEndDate", "'" + item.Max_Value + "'");
                        //}, 150);
                        return true;

                    }
                    else if (item.type == "header") {
                        item.labelHtml = "<div class='col-sm-12 borderSet'><" + item.subtype + ">" + item.label + "</" + item.subtype + "></div>";
                        return true;
                    }
                    else if (item.type == "file") {
                        item.labelHtml = labelCustom;
                        item.controlHtml += attributesData;
                        var path = mainService.getBaseUrl();
                        if (!DataService.isEmpty(dataExists)) {
                            var classHide = !DataService.isEmpty(dataExists.fieldDataText) ? "col-sm-4 pad-0" : "col-sm-4 hidden pad-0";
                            $("input:hidden[name=" + item.name + "]").attr('value', path + dataExists.fieldDataText);
                        } else {
                            $("input:hidden[name=" + item.name + "]").attr('value', path);
                        }
                        //console.log(path + dataExists.fieldDataText);
                        //console.log('item.type');
                        var xx = 1;
                        alert();
                        if (xx == 0) {
                            alert();
                            item.controlHtml += "<div class='col-sm-12 attachments'><div class='" + classHide + "' > <img class='img-responsive' id='uploadPreview_" + item.name + "' src='" + (!DataService.isEmpty(dataExists) ? path + dataExists.fieldDataText : '') + "' alt='Image Icon'> <span class='img-wrapclose img-close single-file'>×</span></div></div >"

                        }
                        return true;
                    }
                    else if (item.type == "hidden") {

                        item.controlHtml += attributesData;
                        return true;
                    }
                    else if (item.type == "map") {
                        item.labelHtml = "<label>" + item.label + "</label>";
                        item.controlHtml = attributesData;
                        if (!DataService.isEmpty(dataExists))
                            item.fieldDataText = dataExists.fieldDataText;
                        controlBinder(item, item.type);
                        //$timeout(function () {
                        //    var lat = parseFloat(item.Lat_Value);
                        //    var log = parseFloat(item.Log_Value);
                        //    var mapProp = {
                        //        center: new google.maps.LatLng(lat, log),
                        //        zoom: 5,
                        //    };
                        //    var map = new google.maps.Map(document.getElementById(item.name), mapProp);

                        //}, 250);
                        return true;
                    }
                    else if (item.type == "number") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        controlBinder(item, item.subtype);
                        //$timeout(function () {
                        //    if (item.types == "simple") {

                        //    } else if (item.types == "slider") {
                        //        var mySlider = $("#" + item.name).bootstrapSlider({
                        //            formatter: function (value) {
                        //                return 'Current value: ' + value;
                        //            }
                        //        });
                        //    } else if (item.types == "calculator") {

                        //    }
                        //    else if (item.types == "num_pad") {
                        //        $("#" + item.name).keyboard({ type: 'numpad' });
                        //    }
                        //    else if (item.types == "num_pad_popup") {
                        //        $("#" + item.name).keyboard({
                        //            type: 'numpad',

                        //            placement: 'auto bottom',
                        //            trigger: 'manual'
                        //        });
                        //    }
                        //    else if (item.types == "waiting_records") {

                        //    }


                        //}, 250);
                        return true;
                    }
                    else if (item.type == "paragraph") {
                        item.controlHtml = attributesData;
                        return true;
                    }
                    else if (item.type == "select") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;

                        var options = "";
                        angular.forEach(item.values, function (i) {

                            options += "<option value='" + i.value + "'>  <label> " + i.label + "</label></option>";
                            return options;
                        })
                        item.controlHtml += options + "</select>";
                        return true;
                    }
                    else if (item.type == "signature") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        if (!DataService.isEmpty(dataExists))
                            item.fieldDataText = dataExists.fieldDataText;
                        controlBinder(item, item.type);
                        //$timeout(function () {
                        //    var showGuideline = item.guideline;
                        //    $("#" + item.name+"_pad").signature({
                        //        guideline: showGuideline === 'Yes' ? true : false,
                        //        guidelineColor: item.guidelineColor,
                        //        background: item.background,
                        //        color: item.color,
                        //        thickness: item.thickness,
                        //        guidelineOffset: item.guidelineOffset,
                        //        guidelineIndent: item.guidelineIndent,
                        //        syncField: "#" + item.name,
                        //        syncFormat: "JPEG", // The output respresentation: 'JSON' (default), 'SVG', 'PNG', 'JPEG'
                        //    });
                        //    $("#clear"+ item.name).click(function () {
                        //        $("#"+item.name+"_pad").signature('clear');
                        //    });
                        //    var Sig_Display_Only = "";
                        //    if (Sig_Display_Only) {
                        //        $("#"+item.name+"_pad").signature('disable');
                        //    }
                        //}, 150);
                    }
                    else if (item.type == "textarea") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        if (item.subtype == "tinymce") {
                            controlBinder(item, item.subtype);
                        }
                        else if (item.subtype == "quill") {
                            controlBinder(item, item.subtype);
                        }
                    }
                    else if (item.type == "tinyMCE-content") {
                        item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        controlBinder(item, item.type);
                    }
                    else if (item.type == "captcha") {
                        if (item.subtype == "cp_text") {

                        } else {
                            if (item.subtype == "cp_math") { }
                            else {
                                item.labelHtml = labelCustom;
                            }
                        }
                        item.controlHtml = attributesData;
                        controlBinder(item, item.type);
                        return true;
                    }
                    else if (item.type == "social_follow") {
                        item.labelHtml = labelCustom;
                        var template = '';
                        var fieldData = item;
                        if (fieldData.facebook && fieldData.facebook !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.facebook + '" target="_blank"><div title="Follow on Facebook" class="sbuttons facebook">Facebook</div></a></li>';
                        }
                        if (fieldData.twitter && fieldData.twitter !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.twitter + '" target="_blank"><div title="Follow on Twitter" class="sbuttons twitter">Twitter</div></a></li>';
                        }
                        if (fieldData.linkedin && fieldData.linkedin !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.linkedin + '" target="_blank"><div title="Follow on LinkedIn" class="sbuttons linkedin">LinkedIn</div></a></li>';
                        }
                        if (fieldData.google && fieldData.google !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.google + '" target="_blank"><div title="Follow on Google+" class="sbuttons google">Google+</div></a></li>';
                        }
                        if (fieldData.instagram && fieldData.instagram !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.instagram + '" target="_blank"><div title="Follow on Instagram" class="sbuttons instagram">Instagram</div></a></li>';
                        }
                        if (fieldData.youtube && fieldData.youtube !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.youtube + '" target="_blank"><div title="Follow on Youtube" class="sbuttons youtube">Youtube</div></a></li>';
                        }
                        if (fieldData.vimeo && fieldData.vimeo !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.vimeo + '" target="_blank"><div title="Follow on Vimeo" class="sbuttons vimeo">Vimeo</div></a></li>';
                        }
                        if (fieldData.pinterest && fieldData.pinterest !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.pinterest + '" target="_blank"><div title="Follow on Pinterest" class="sbuttons pinterest">Pinterest</div></a></li>';
                        }
                        if (fieldData.flickr && fieldData.flickr !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.flickr + '" target="_blank"><div title="Follow on Flickr" class="sbuttons flickr">Flickr</div></a></li>';
                        }
                        if (fieldData.tumblr && fieldData.tumblr !== '') {
                            template += '<li class="social-list"><a href="' + fieldData.tumblr + '" target="_blank"><div title="Follow on Tumblr" class="sbuttons tumblr">Tumblr</div></a></li>';
                        }
                        var control = "";
                        if (template !== '') {

                            control = '<ul class="social-networks" style="float: ' + fieldData.align + '">' + template + '</ul>'

                        } else {
                            control = '<img class="field-iconImg" src="' + assetsImagePath + '/social_follow.png">'
                        }

                        item.controlHtml += "<div class='col-sm-12 pad-0'>" + control + "</div>";
                        return true;
                    }
                    else if (item.type == "banner") {
                        item.controlHtml = attributesData;
                        return true;
                    }
                    else if (item.type == "table") {
                        item.controlHtml = createTableandColumn(item, pageKey);
                        return true;
                    }
                    else if (item.type == "tabulator") {
                        item.controlHtml = createTabulatorOneToMany(item);
                        return true;
                    }
                    else {

                        if (item.type == "Line" || item.type == "hyperlink") {

                        }
                        else
                            item.labelHtml = labelCustom;
                        item.controlHtml = attributesData;
                        return true;
                    }
                });
            });
            //console.log($scope.formFields);
            loadcssjsfile("fg-assets/js/code/form-entry.js", "js", "entryform")
            $rootScope.safeApply();
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
                        //  console.log('data  is'); console.log(response.data[0]);
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
                                            //console.log('entries are');
                                            //console.log(response.data)
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
                                                                ////console.log($(this));
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
                    $window.close();
                }
                else {
                    $window.history.back();
                }
            }
            else if (angular.isDefined(isInformationOnly)) {
                if (isInformationOnly == "tru") {
                    var previousPage = CookiesPersistenceService.getCookieData("informationBackLink");
                    if (angular.isDefined(previousPage)) {
                        $window.location = previousPage;
                    }
                }
                else if (isInformationOnly == null && $scope.formGroupKey == undefined && $stateParams.popup != undefined) {
                    $window.close();
                }

                else {
                    $rootScope.isFormDirty = $scope.myForm.$dirty;
                    $window.history.back();
                }
            }
            else {
                $window.history.back();
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
            //console.log(fieldsData);
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
                    //console.log('datafields');
                    //console.log(fieldsData.name);

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

        /*For Invoice form only*/
        $scope.viewCourseDetails = function () {
            // alert('viewCourseDetails'); 
            $scope.generateInvoiceDataDetails = {};
            $scope.generateInvoiceParam = {};
            $scope.generateInvoiceParam.action = 5;
            $scope.generateInvoiceParam.list = [];
            $scope.generateInvoiceParam.paymentPeriodList = [];
            if (!DataService.isEmpty($scope.importFormSettings.otherformid)) {
                var existsList = _.findWhere($scope.formFieldsAll, { Referral_Forms: $scope.importFormSettings.otherformid.toString() });
                if (!DataService.isEmpty(existsList)) {
                    var data = $scope.formDataList[0];

                    var studentId = "0";
                    if (!DataService.isEmpty(existsList.Referral_Form_Fields_Value))
                        studentId = data[existsList.name + "_" + existsList.Referral_Form_Fields_Value];
                    var controlExists = _.filter(data, function (item, key) {
                        return key.contains("paymentPeriod")
                    });
                    if (controlExists.length > 0) {
                        $scope.generateInvoiceParam.paymentPeriodList.push(controlExists[0]);
                        $scope.generateInvoiceParam.list.push(studentId);
                        $scope.generateInvoiceParam.paymentPeriod = controlExists[0];
                    }
                    $ngBootbox.customDialog({
                        templateUrl: 'courseDetails.html',
                        scope: $scope,
                        title: ' Course Information ',
                        size: "large",
                        className: 'modal2Xlarge'
                    });
                    $scope.generateInvoiceParam.list = JSON.stringify($scope.generateInvoiceParam.list);
                    $scope.generateInvoiceParam.formId = $scope.currentFormId;
                    $scope.generateInvoiceParam.primaryFormId = $scope.currentFormId;
                    $scope.generateInvoiceParam.otherreferrenceFormId = existsList.Referral_Forms;
                    $scope.generateInvoiceParam.paymentPeriodList = JSON.stringify($scope.generateInvoiceParam.paymentPeriodList);
                    $scope.loadInvoiceDetails($scope.generateInvoiceParam);
                }
            }
        };

        $scope.calculatePaymentSum = function (strName) {

            var exists = _.findWhere($scope.formFieldsAll, { table_calculation: strName });
            if (!DataService.isEmpty(exists)) {
                if (!DataService.isEmpty(exists.table_calculation)) {
                    var serializeArrayList = $("#" + exists.table_calculation + " :input").serializeArray();
                    var fieldName = "";
                    if (exists.table_calculate_column != "" && exists.table_calculate_column != undefined) {
                        var column = parseInt(exists.table_calculate_column);
                        column = column + 1;
                        fieldName = exists.table_calculation + "[column-" + column + "]";
                    }
                    var sumPayment = 0;
                    _.each(serializeArrayList, function (item) {
                        if (item.name.contains(fieldName)) {
                            if (item.value == "" || item.value == undefined || item.value == null)
                                item.value = 0;
                            sumPayment += parseInt(item.value);
                        }
                    });
                    $("#" + exists.name).val(sumPayment);
                    $("#" + exists.name).change();
                }
            }

        }

        $scope.loadInvoiceDetails = function (paramData) {
            var param = {};
            param = paramData;
            $rootScope.$emit("ShowLoading");
            mainService.GeneratingInvoice("GeneratingInvoice", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.generateInvoiceData = response.data;
                        $scope.generateInvoiceDataDetails = {};
                        $scope.generateInvoiceDataDetails = angular.copy($scope.generateInvoiceData);
                        $scope.generateInvoiceDataMultipleStudentCourseList = angular.copy($scope.generateInvoiceData.listOfRecords);
                        var list = $scope.generateInvoiceDataMultipleStudentCourseList;
                        var name = "";
                        if (list.length > 0) {
                            $scope.generateInvoiceDataDetails.listCourse = _.groupBy(list, "courseName");
                            $scope.generateInvoiceDataDetails.generateInvoiceDataCourseListSubTotal = [];
                            $scope.generateInvoiceDataDetails.totalAmount = 0;
                            _.each($scope.generateInvoiceDataDetails.listCourse, function (itemData, keyData) {
                                var subTotal = 0;
                                _.each(itemData, function (item, keyItem) {
                                    subTotal += !DataService.isEmpty(item.fees_1) ? parseInt(item.fees_1) : item.fees_1;
                                    item.startDate = DateWithDayName(item.start, false);
                                    item.startTime = TimeFormatCalender(item.start, false);
                                    item.endTime = TimeFormatCalender(item.end, false);
                                    name = item.name;
                                });
                                $scope.generateInvoiceDataDetails.totalAmount += subTotal;
                                $scope.generateInvoiceDataDetails.generateInvoiceDataCourseListSubTotal.push(subTotal);
                            });


                        } else {
                            $scope.generateInvoiceDataDetails.listCourse = {};
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };


        //var timeout = null;

        $scope.onBlurInputTable = function (data) {
            //console.log($scope.formFields)
            //console.log("table");
            //textBoxLoader(true);
            //$rootScope.$emit("ShowLoading");
            // $scope.formFieldExcelParam.listOfOutput = [];          
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
                updateExcel(false);
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
            param.Id = $stateParams.Id;
            param.formGroupKey = $stateParams.formGroupKey;
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
                updateExcel(true);
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
                                        $("#" + item.id).keypress();
                                    })
                                } else {
                                    angular.forEach(response.data.listOfOutput, function (item) {
                                        $("input").each(function () {
                                            if ($(this).attr("id") == item.id) {
                                                $(this).val(item.value);
                                                $("#" + item.id).removeClass("loader");
                                                $("#" + item.id).keypress();
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

        function controlBinder(item, type) {
            $timeout(function () {

                switch (type) {
                    case "slider":
                        $("#" + item.name).bootstrapSlider({
                            formatter: function (value) {
                                console.log('slider');
                                return 'Current value: ' + value;
                            }
                        });
                        break;
                    case "num_pad":
                    case "phone pad":
                        $("#" + item.name).keyboard({ type: 'numpad' });
                        break;
                    case "num_pad_popup":
                    case "phone pad pop-up":
                        $("#" + item.name).keyboard({
                            type: 'numpad',

                            placement: 'auto bottom',
                            trigger: 'manual'
                        });
                        break;
                    case "signature":
                        var showGuideline = item.guideline;
                        $("#" + item.name + "_pad").signature({
                            guideline: showGuideline === 'Yes' ? true : false,
                            guidelineColor: item.guidelineColor,
                            background: item.background,
                            color: item.color,
                            thickness: item.thickness,
                            guidelineOffset: item.guidelineOffset,
                            guidelineIndent: item.guidelineIndent,
                            syncField: "#" + item.name,
                            syncFormat: "JPEG", // The output respresentation: 'JSON' (default), 'SVG', 'PNG', 'JPEG'
                        });
                        $("#clear" + item.name).click(function () {
                            $("#" + item.name + "_pad").signature('clear');
                        });
                        var Sig_Display_Only = "";
                        if (Sig_Display_Only) {
                            $("#" + item.name + "_pad").signature('disable');
                        }
                        // $("#" + item.name + "_pad").signature.fromDataURL(item.fieldDataText);
                        break;
                    case "map":

                        var lat = 80;
                        console.log(item, 'map val');
                        if (angular.isDefined(item.Lat_Value))
                            lat = parseFloat(item.Lat_Value);
                        var log = 20;
                        if (angular.isDefined(item.Log_Value))
                            log = parseFloat(item.Log_Value);
                        if (!DataService.isEmpty(item.fieldDataText)) {
                            var dddd = item.fieldDataText.split(',');
                            lat = dddd[0];
                            log = dddd[1]
                        }
                        var mapProp = {
                            center: new google.maps.LatLng(lat, log),
                            zoom: 5,
                        };
                        map = new google.maps.Map(document.getElementById(item.name), mapProp);
                        google.maps.event.addListener(map, "click", function (event) {
                            // get lat/lon of click
                            var clickLat = event.latLng.lat();
                            var clickLon = event.latLng.lng();

                            // show in input box                           
                            var mapData = clickLat.toFixed(5) + "," + clickLon.toFixed(5);
                            localStorage.setItem("mapData", mapData);


                        });
                        break;
                    case "time_picker":
                        $("#" + item.name).datetimepicker({
                            format: "hh:ii",
                            minView: 0,
                            maxView: 1,
                            startView: 1,
                            autoclose: true,
                            todayBtn: true,
                            todayHighlight: true,
                            //minuteStep: 10,
                            pickerPosition: "bottom-left"
                        }).on('changeDate', function (e) {
                            // Revalidate the date field
                            $('#customForm').formValidation('revalidateField', "'" + item.name + "'");
                        });
                        break;
                    case "date_picker":
                        $("#" + item.name).datetimepicker({
                            format: "yyyy/mm/dd",
                            assumeNearbyYear: true,
                            autoclose: true,
                            todayBtn: true,
                            todayHighlight: true,
                            //weekStart: '1',
                            minView: 2,
                            viewMode: 'days',
                            pickerPosition: "bottom-left"
                        }).on('changeDate', function (e) {
                            // Revalidate the date field
                            $('#customForm').formValidation('revalidateField', "'" + item.name + "'");
                        });
                        break;
                    case "datetime_picker":
                        $("#" + item.name).datetimepicker({
                            format: "yyyy/mm/dd hh:ii",
                            startView: 2,
                            autoclose: true,
                            todayBtn: true,
                            todayHighlight: true,
                            //minuteStep: 10,
                            pickerPosition: "bottom-left"
                        }).on('changeDate', function (e) {
                            // Revalidate the date field
                            $('#customForm').formValidation('revalidateField', "'" + item.name + "'");
                        });
                        break;
                    case "autocomplete":
                        $("#" + item.name).easyAutocomplete(item.options1);
                        break;
                    case "tinymce":
                    case "tinyMCE-content":
                        var targetArea = item.name;
                        tinymce.init({
                            selector: "#" + targetArea,
                            height: 300,
                            plugins: [
                                'advlist autolink lists link image media charmap print preview anchor textcolor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table contextmenu paste code help'
                            ],
                            toolbar: 'undo redo |  styleselect | bold italic |  fontsizeselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table | forecolor backcolor',
                            content_css: [
                                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                                '//cdn.tinymce.com/4/skins/lightgray/content.min.css'
                            ],
                            relative_urls: false,
                            remove_script_host: false,
                            convert_urls: true,
                            //image_advtab: true,
                            file_picker_types: 'image media',
                            media_alt_source: false,
                            automatic_uploads: true,
                            media_url_resolver: function (data, resolve) {
                                if (data.url.indexOf('YOUR_SPECIAL_VIDEO_URL') === -1) {
                                    var embedHtml = '<iframe src="' + data.url + '" width="400" height="400" class="uploadVideo"></iframe>';
                                    resolve({ html: embedHtml });
                                } else {
                                    resolve({ html: '' });
                                }
                            },
                            table_default_attributes: {
                                border: 1,
                                cellpadding: 4
                            },
                            table_default_styles: {
                                borderCollapse: "collapse",
                                borderStyle: "solid"
                            },
                            file_picker_callback: function (cb, value, meta) {
                                //console.log(meta);
                                var input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                if (meta.filetype === "media") {
                                    input.setAttribute('accept', 'video/*');
                                }
                                if (meta.filetype === "image") {
                                    input.setAttribute('accept', 'image/*');
                                }
                                input.onchange = function () {
                                    var file = this.files[0];
                                    var id = Math.round(Date.now() / 1000);
                                    var reader = new FileReader();

                                    reader.onload = function () {
                                        var base64 = reader.result.split(',')[1];
                                        $.ajax({
                                            url: BASE_URL + '/mediaUplaod',
                                            type: "POST",
                                            data: { id: id, image64: base64, type: meta.filetype, folder: 'forms' },
                                            beforeSend: function () { showSmallLoader('.mce-container.mce-floatpanel'); },
                                            success: function (data) {
                                                data = $.parseJSON(data);

                                                if (data.code === '1') {
                                                    if (meta.filetype === "image") {
                                                        cb(ASSET_URL + data.url, { alt: '', title: id + '.jpg' });
                                                    }
                                                    if (meta.filetype === "media") {
                                                        cb(ASSET_URL + data.url, { source2: 'alt.ogg', poster: 'image.jpg' });
                                                    }
                                                } else {
                                                    alert(data.msg);
                                                }
                                            },
                                            error: function (error) {
                                                console.log(error);
                                            },
                                            complete: function () { $('.mce-container.mce-floatpanel').unblock(); }
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                };
                                input.click();

                            },
                            init_instance_callback: function (editor) {
                                editor.on('Change', function (e) {
                                    var content = e.target.getContent();
                                    $("#" + targetArea).val(content).change();
                                });
                                editor.on('Blur', function (e) {
                                    var content = e.target.getContent();
                                    $("#" + targetArea).val(content).change();
                                });
                            }
                        });
                        break;
                    case "quill":
                        createQuillTextArea(item);
                        break;
                    case "captcha":
                        createCaptchaControl(item);
                        break;
                    default:
                        break;
                }
            }, 250);
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

        $scope.bindOneToManyControl = function (paramTemp, tabularId, name) {
            var param = {};
            param = paramTemp;
            param.action = 10;
            if (!$scope.isEdit) {
                param.formGroupKey = $scope.freshEntryformGroupKey;
            }
            else {
                param.formGroupKey = $scope.formGroupKey;
            }
            if (param.isFormGroupKey) {
                param.formGroupKey = angular.copy(param.formGroupKeyTemp);
            }
            //param.formGroupKey = $stateParams.formGroupKey;
            param.tabularId = tabularId;
            param.formId = paramTemp.formId == 0 ? $scope.currentFormId : paramTemp.formId;
            param.parentID = $scope.currentFormId;
            param.fieldName = name;
            param.Id = 0;
            
            if (!DataService.isEmpty($scope.rowId))
                param.Id = $scope.rowId;
            mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                .then(function (response) {

                    $scope.allReferrenceData = response.data;
                    $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;

                    var finalArray = [];
                    bindTabulatorColumnsHeader($scope.allReferrenceData.formDataHeaders, param.tabularId, param.formId, param.fieldName);


                    setTimeout(function () {
                        if (!DataService.isEmpty(window["tabulators"]))
                            window["tabulators"][param.tabularId].setData($scope.allReferrenceData.formDataListNew);
                        setTabulatorCalc(param.tabularId);
                    }, 500);
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        $scope.insertRecordsIntoOneMany = function (formId, fieldName) {
            var temp = {};
            temp.formId = formId;
            temp.fieldName = fieldName;
            temp.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
            temp.MasterFormID = $scope.currentFormId;
            $scope.strReferenceForm = formId;
            localStorage.setItem("insertReferrence", JSON.stringify(temp));
            var freshEntryformGroupKeyTemp = create_UUID();
            localStorage.setItem("formGroupKey" + formId, freshEntryformGroupKeyTemp);

            $scope.entryPage(formId, false, $scope.freshEntryformGroupKey, fieldName, false, true);
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

                            finalArray.push({
                                title: item.title, columnType: type, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left",
                            });
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


            finalArray.unshift({ title: "formGroupKey", visible: false });
            return finalArray;
        }

        function loadTransaction() {
            $("#get-tabulator-valuesOtherReferrences").click(function () {
                var formID = $("#addTransactionRecordTabulatorModal input[name=formID]").val();
                var oneToMany = $("#addTransactionRecordTabulatorModal input[name='modal-one-to-many']").val();
                $rootScope.onetomany = $("#addTransactionRecordTabulatorModal input[name='modal-one-to-many']").val();
                var selectedRows = window["popupTabulatorTransaction"].getSelectedRows();
                ////console.log(selectedRows);
                var existsTab = _.findWhere($scope.formDetailsDataTemp, { otherreference_form: formID });
                if (selectedRows.length > 0) {
                    var selectedData = window["popupTabulatorTransaction"].getSelectedData();
                    selectedRecordOneToMany = selectedData;
                    ////console.log(selectedData);
                    if (oneToMany === '1') {
                        var tabulatorId = $("#addTransactionRecordTabulatorModal input[name='tabulator-id']").val();
                        var fieldMap = $("#addTransactionRecordTabulatorModal input[name='modal-field-map']").val();
                        if (fieldMap != "" && fieldMap.length > 0)
                            fieldMap = JSON.parse(fieldMap);
                        ////console.log(fieldMap);
                        var newTabulator = "formGeneratorTabulator" + tabulatorId;
                        var cols = getTabulatorColDefs(window["popupTabulatorTransaction"], 1);
                        ////console.log(cols);
                        var listTemp = _.filter($scope.allReferrenceData.formDataHeaders, function (item) { return !DataService.isEmpty(item.Referral_Forms) });
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
                            //if (!DataService.isEmpty(existsTab)) {
                            //    var refform = _.findWhere($scope.allReferrenceData.formDataHeaders, { Referral_Forms: formID });
                            //    if (!DataService.isEmpty(refform)) {
                            //        record[refform.Referral_Form_Fields] = data[fieldMap[refform.Referral_Form_Fields].toLowerCase()];
                            //    }
                            //}


                            if (listTemp.length > 0) {
                                _.each(listTemp, function (itemTemp) {
                                    if ($scope.currentFormId == parseInt(itemTemp.Referral_Forms)) {
                                        if (!DataService.isEmpty($scope.formDataInfo[itemTemp.Referral_Form_Fields])) {
                                            record[itemTemp.Referral_Form_Fields] = $scope.formDataInfo[itemTemp.Referral_Form_Fields].toLowerCase();
                                            record[itemTemp.name] = $scope.formDataInfo[itemTemp.Referral_Form_Fields_value];
                                        }
                                    } else {
                                        if (!DataService.isEmpty(itemTemp.Referral_Form_Fields)) {
                                            record[itemTemp.Referral_Form_Fields] = data[fieldMap[itemTemp.Referral_Form_Fields].toLowerCase()];
                                            record[itemTemp.field] = angular.copy(data[fieldMap[itemTemp.Referral_Form_Fields].toLowerCase()]);
                                            record[itemTemp.field + "_" + itemTemp.Referral_Form_Fields_value] = data[itemTemp.Referral_Form_Fields_value];
                                            record[itemTemp.field + "_" + itemTemp.Referral_Forms] = data[itemTemp.Referral_Form_Fields_value];
                                        }
                                    }
                                });
                            }

                            // record['Id'] = data.Id;
                            record['Id'] = data.Id;
                            record[data.formID + "_RowId"] = data.Id;
                            //record[$scope.primaryFormId + "_RowId"] = $scope.tabuListLink.selectedId;

                            if ($scope.isEdit) {
                                record['formGroupKey'] = create_UUID();
                            } else {
                                record['formGroupKey'] = localStorage.getItem("formGroupKey");
                            }

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
                        param.listTemp = JSON.stringify(recordArr);
                        param.action = 1;
                        param.tabularId = newTabulator;
                        window[newTabulator + "Data"] = JSON.stringify(param);
                        var data = $scope.allReferrenceData.formDataHeaders;

                        //_.each(listTemp, function (item) {                       
                        //        var exists = _.where(recordArr, { formId: parseInt(item.Referral_Forms) })
                        //        if (exists != undefined && exists.length > 0) {
                        //            var fieldname = item.field;
                        //            _.map(recordArr, function (tempitem) {
                        //                tempitem[item.field] = angular.copy(tempitem[item.Referral_Form_Fields]);
                        //                tempitem[item.field + "_" + item.Referral_Forms] = tempitem[item.Referral_Form_Values]
                        //            });
                        //        }                            
                        //});

                        //angular.forEach($scope.allReferrenceData.formDataHeaders, function (item) {
                        //    if (!DataService.isEmpty(item.Referral_Forms)) {
                        //        var exists = _.where(recordArr, { formId: parseInt(item.Referral_Forms) })
                        //        if (exists != undefined && exists.length > 0) {
                        //            var fieldname = item.field;
                        //            _.map(recordArr, function (tempitem) {
                        //                tempitem[item.field] = angular.copy(tempitem[item.Referral_Form_Fields]);
                        //                tempitem[item.field + "_" + item.Referral_Forms] = tempitem[item.Referral_Form_Values]
                        //            });
                        //        }
                        //    }
                        //});
                        $scope.isOneToManyFormType = true;
                        if ($scope.isEdit) {
                            $scope.saveTabulatorView = false;
                            param.Id = $scope.rowId;
                            param.formId = $scope.currentFormId;
                            param.formGroupKey = $scope.formGroupKey;
                            $scope.manageOneToManyReferrenceFunction(param, param);

                        }
                        else {
                            var getDataTabulator = window["tabulators"][$scope.currentTabulator].getData();
                            if (!DataService.isEmpty(getDataTabulator)) {
                                _.each(getDataTabulator, function (item) {
                                    recordArr.push(item);
                                });
                            }
                            window["tabulators"][$scope.currentTabulator].setData(recordArr);

                            $scope.saveTabulatorView = true;

                            $scope.saveTabulatorViewNew = true;

                        }

                        //param.formId = $scope.tabuListLink.formId;
                        // param.formGroupKey = $scope.tabuListLink.formGroupKey;
                        // $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
                        //  $scope.manageCalenderReferrenceControl(param);
                        //$scope.GetTabOneToManyDynamimc(param, param.action);
                        ////console.log(recordArr);

                    }
                }
                else {
                    alert("Please select some records in tabulator!!");
                }
            });
        }

        $scope.insertRecordsIntoOtherReferrenceForm = function (formId, fieldName, strReferenceForm) {
            debuuger;
            var temp = {};
            temp.formId = formId;
            $scope.primaryFormId = temp.formId;
            temp.fieldName = fieldName;
            temp.formGroupKey = $scope.freshEntryformGroupKey;
            temp.MasterFormID = $scope.currentFormId;
            var param = {};
            param.action = 2;
            param.formId = formId;
            param.primaryFormId = $scope.currentFormId;
            //param.formGroupKey = $scope.tabuListLink.formGroupKey;
            param.fieldName = "";
            $scope.strReferenceForm = strReferenceForm;
            $ngBootbox.customDialog({
                templateUrl: 'addTransactionRecordTabulatorModal.html',
                scope: $scope,
                title: ' Transaction Details ',
                size: "large"
            });
            $scope.selectedRecords = [];
            $scope.currentTabulator = "formGeneratorTabulator" + fieldName;
            $scope.currentTabulatorfieldName = fieldName;
            $timeout(function () {
                loadTransaction();
                window["popupTabulatorTransaction"] = initTabulator("form-tableTransaction", {
                    selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1,
                    rowSelected: function (row) {
                        var fieldName = $('#form-tableTransaction').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field')

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
                            //$scope.tagify.addTags([temp]);
                        }
                    },
                    rowDeselected: function (row) {
                        var fieldName = $('#form-tableTransaction').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field')
                        var obj = row.getData();
                        // const index = $scope.selectedRecords.indexOf(obj[fieldName]);
                        var temp = {};
                        temp.Id = obj["Id"];
                        temp.value = obj[fieldName];
                        const index = $scope.selectedRecords.map(function (e) { return e.Id; }).indexOf(temp.Id);

                        if (index > -1) {
                            $scope.selectedRecords.splice(index, 1);
                            // $scope.tagify.removeTag(temp.value);
                        }
                    },
                });
                
                mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                    .then(function (response) {
                        //console.log(response);
                        $scope.allReferrenceData1 = response.data;
                        $scope.tabList = _.without($scope.allReferrenceData1.tablist, _.findWhere($scope.allReferrenceData1.tablist, { value: "0" }));
                        if (!DataService.isEmpty($scope.allReferrenceData1.formDataHeaders)) {
                            var firstName = $scope.allReferrenceData.formDataHeaders[0];
                            $scope.allReferrenceData.groupColumns.name = firstName.field;
                        }
                        $scope.formDataTabulatorTempWithoutGroupBy1 = $scope.allReferrenceData1.formDataListNew;
                        //console.log($scope.formDataTabulatorTempWithoutGroupBy1, 'allReferrenceData')
                        //console.log($scope.allReferrenceData1.formDataHeaders, 'Header')

                        $("#addTransactionRecordTabulatorModal input[name=formID]").val(param.formId);
                        //if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                        // $("#addTransactionRecordTabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                        window["popupTabulatorTransaction"].setHeight("450px");
                        window["popupTabulatorTransaction"].setColumns(bindTColumnHeaderTabulator($scope.allReferrenceData1.formDataHeaders));
                        window["popupTabulatorTransaction"].setData($scope.formDataTabulatorTempWithoutGroupBy1);
                        var rows = window["popupTabulatorTransaction"].getRows();
                        var fieldName = $('#form-tableTransaction').find('.tabulator-headers').children('.tabulator-col:visible').eq(0).attr('tabulator-field');
                        _.each(rows, function (row) {
                            // console.log(row.getData(), 'itm')
                            var obj = row.getData();
                            var temp = {};
                            temp.Id = obj["Id"];
                            temp.value = obj[fieldName];

                            // $scope.whitelist.push(temp);
                        });

                        $("input[name='modal-one-to-many']").val("1");
                        var modal_field_map = "{";
                        _.each($scope.allReferrenceData1.groupColumns, function (item, key) {
                            if (key != "name")
                                modal_field_map += "'" + key + "':'" + key + "',";
                            else if (key == "name")
                                modal_field_map += "'" + key + "':'" + key + "',";
                            else
                                modal_field_map += "'" + key + "':'" + item + "',";

                        });
                        modal_field_map = modal_field_map.substring(0, modal_field_map.length - 1);
                        modal_field_map += "}";
                        modal_field_map = modal_field_map.replace(/'/g, '"');
                        $("input[name='modal-field-map']").val(modal_field_map);
                        $("input[name='tabulator-id']").val(temp.fieldName);






                        $rootScope.$emit("HideLoading");


                    },
                        function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                localStorage.setItem("insertRecordsIntoOtherReferrenceForm", JSON.stringify(temp));
            }, 250);
        };

        $scope.entryPage = function (formId, isEdit, formGroupKey, fieldName, isTab, isLocally, tabularId, extraParam) {
            var reference_form = "2196";
            var params = windowParams();
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            var isEdit = isEdit;
            if (isEdit && isLocally != true) {

                newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + '/0?popup=1', 'example', params, true);
            }
            else if (angular.isDefined(isTab) && isTab == true) {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
            }
            else if (angular.isDefined(isLocally) && isLocally == true) {
                //console.log(isLocally, 'isLocally')
                if (localStorage.getItem("tabulatorOnetomany-" + formId) == null) {
                    if (isEdit)
                        newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + fieldName + "?popup=2" + extraParam, 'example', params, true);
                    else
                        newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=2', 'example', params, true);
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


                    param.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
                    //var dataSubForm = localStorage.getItem("formOneData");
                    //$scope.GetTabOneToManyDynamimc(param, param.action)
                    if (param.action == 4)
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;

                    param.formId = 0;
                    var listAllFields = [];
                    angular.forEach($scope.formFields, function (pageData, pageKey) {
                        angular.forEach(pageData, function (item, key) {
                            listAllFields.push(item);
                        });
                    });

                    if (DataService.isEmpty(tabularId))
                        tabularId = param.fieldName;
                    var exists = _.findWhere(listAllFields, { name: tabularId });
                    if (!DataService.isEmpty(exists)) {
                        param.formId = exists.reference_form;
                        fieldName = tabularId;
                    }
                    param.formGroupKeyTemp = angular.copy(param.formGroupKey);
                    param.isFormGroupKey = true;
                    $scope.bindOneToManyControl(param, param.tabularId, fieldName);
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
        };

        $scope.deleteRecordsIntoOneMany = function (formid, fieldName) {

            if (confirm('Are you sure to delete selected Record?')) {
                var deletedList = window["formGroupKeyList"]
                var param = {};
                param.action = 3;
                param.MasterformId = formid;
                if (angular.isDefined(deletedList)) {
                    param.formGroupKeyList = deletedList.join();
                    param.AutoIdList = window["AutoIdList"]
                    param.fieldName = fieldName;
                    param.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
                    var selectedTabulator = window["selectedTabulator"];
                    param.OneToManyFormReferrenceList = selectedTabulator;
                    $scope.mainOneToManyReferrenceFunction(param);
                    // $scope.GetTabOneToManyDynamimc(param, param.action);
                    //$scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);
                    // GeneratedFormDataDelete(param);
                }
            }
        };

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
        };

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
                        console.log(response.data)
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
            var fieldNameTemp = angular.copy(fieldName);
            // angular.forEach(formDetails, function (pageData, pageKey) {
            angular.forEach(formDetails, function (item, key) {
                // var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                var type = item.columnType;
                item.name = item.field;
                item.label = item.title;
                if (item.List_column1 == "Yes") {
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multiple == true) {
                                finalArray.push({
                                    title: item.label, visible: true, formatter: multilFiles, width: 200, headerFilter: false, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {
                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.label, visible: true, formatter: arrowImage, width: 200, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: false
                                });
                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab)) {
                                if (!DataService.isEmpty(item.Inline_Edit) && (item.Inline_Edit == "Yes" || item.Inline_Edit == "True")) {
                                    var rowFieldTemp = "RowID-" + item.name;
                                    finalArray.push({
                                        title: item.label, Referral_Form_Fields: item.Referral_Form_Fields,
                                        Referral_Form_Fields_value: item.Referral_Form_Fields_value,
                                        Referral_Forms: item.Referral_Forms, width: 200, field: rowFieldTemp, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: false, visible: false
                                    });
                                    finalArray.push({
                                        title: item.label, Referral_Form_Fields: item.Referral_Form_Fields,
                                        Referral_Form_Fields_value: item.Referral_Form_Fields_value,
                                        Referral_Forms: item.Referral_Forms, bottomCalc: showFooter(item), width: 200, field: item.name, align: "left", headerFilter: false, visible: true, editor: "input", cellEdited: function (cell) {
                                            console.log("cell" + cell)
                                        }
                                    });
                                }

                                else {
                                    finalArray.push({
                                        title: item.label, Referral_Form_Fields: item.Referral_Form_Fields,
                                        Referral_Form_Fields_value: item.Referral_Form_Fields_value,
                                        Referral_Forms: item.Referral_Forms, width: 200, bottomCalc: showFooter(item), field: item.name, align: "left", visible: true, headerFilter: false
                                    });
                                }
                            }
                            else {
                                $scope.displayInTabData = item;
                            }
                        }
                    }

                }                });
            finalArray.unshift({
                title: "formId", field: "formId", visible: false
            });
            finalArray.unshift({ title: "Id", field: "Id", visible: false });
            finalArray.unshift({ title: "AutoId", field: "AutoId", visible: false });
            finalArray.unshift({
                title: "Edit", bottomCalc: showFooter({}), field: "editRow", width: 60, formatter: arrowIcon, headerSort: false, align: "center", cellClick: function (e, cell) {
                    var id = (cell.getRow().getData().Id != "") ? parseInt(cell.getRow().getData().Id) : 0;
                    var formGroupKey = cell.getRow().getData().formGroupKey;
                    var extraParam = "";
                    if (!DataService.isEmpty(formGroupKey)) {
                        var exists = _.filter(window["tabulators"]["formGeneratorTabulator" + fieldNameTemp].getColumnDefinitions(),
                            function (item) { return !DataService.isEmpty(item.Referral_Forms) });

                        if (exists.length > 0) {
                            var existsControl = _.findWhere(exists, { Referral_Forms: $scope.currentFormId });
                            if (!DataService.isEmpty(existsControl)) {
                                var valueControl = cell.getRow().getData()[existsControl.field + "_" + existsControl.Referral_Form_Fields_value];
                                extraParam = '&cname=' + existsControl.field + '&value=' + valueControl;
                            }
                        }
                        $scope.entryPage(formId, true, formGroupKey, id, false, true, fieldNameTemp, extraParam);
                    }

                    else {
                        $timeout(function () {
                            notifierService.notifyMessage('error', 'Form Entry', 'Edit is not allowed because the record entry is not saved');
                        }, 100);
                    }

                }
            });

            //});

            // $timeout(function () {
            if ($("#" + tabularId).length) {
                tempTabulatorList[tabularId] = new initTabulator(tabularId, {
                    placeholder: "No Data.",
                    height: "300px",
                    layout: "fitColumns",
                    selectable: true,
                    movableRows: true,
                    responsiveLayout: false,
                    columns: finalArray,

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

                            var exists = _.findWhere($scope.allReferrenceData.formDataHeaders, { columnType: "autocomplete" });
                            if (!DataService.isEmpty(exists)) {
                                temp.parentColumnName = exists.Referral_Form_Fields_value;
                                if (!DataService.isEmpty(cell.getData()[exists.name + "_" + exists.Referral_Form_Fields_value])) {
                                    temp.parentColumnNameData = cell.getData()[exists.name + "_" + exists.Referral_Form_Fields_value];
                                }
                                temp.parentColumnFormId = exists.Referral_Forms;
                            }

                            temp.columnName = columnName;
                            temp.columnValue = cell.getValue();
                            temp.action = 7;
                            temp.AutoId = cell.getData().Id;
                            temp.formId = cell.getData().formId;
                            temp.formGroupKey = cell.getData().formGroupKey;
                            $scope.updateRowWiseOneToMany(temp, 7);
                        }
                        else { cell.restoreOldValue(); }
                    },
                    rowSelectionChanged: function (data, rows) {
                        var formGroupKeyList = [];
                        var selectRows = [];
                        data.forEach(function (item, key) {
                            formGroupKeyList.push(item.formGroupKey);
                            selectRows.push(item);
                        });
                        window["formGroupKeyList"] = formGroupKeyList;
                        window["selectedTabulator"] = selectRows;

                        //  var AutoIdList = [];
                        //data.forEach(function (item, key) {
                        //  AutoIdList.push(item.AutoId);
                        //});
                        //window["AutoIdList"] = AutoIdList;
                    },
                    ////ajaxFiltering: true,
                    ////ajaxProgressiveLoad: "scroll",
                    //paginationSize: 50
                });
                //
                tempTabulatorList[tabularId].setColumns(finalArray);

                $timeout(function () {

                    $rootScope.safeApply();
                    window["tabulators"] = tempTabulatorList;
                    //tempTabulatorList[tabularId].redraw();


                    finalArray = [];
                    //$timeout(function () {            


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
                    // $scope.GetTabOneToManyDynamimc(paramTemp, paramTemp.action);
                    //var tempTabulatorData = localStorage.getItem("tabulatorOnetomany-" + paramTemp.formId);
                    //console.log(tempTabulatorData);             
                    // if (!DataService.isEmpty(tempTabulatorData)) {
                    //$scope.bindOnetoManyTabulator(tempTabulatorData, tabularId);
                    //window.addEventListener('resize', function () {
                    //    tempTabulatorList[tabularId].redraw();
                    //});
                    setTimeout(function () { setTabulatorCalc(tabularId); }, 250);
                }, 10);
            }
            //}, 150);

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
            //console.log(JSON.stringify($scope.listOfReferrenceFields), oneToManyParam);
            //console.log(oneToManyParam, 'oneToManyParam');
            mainService.manageTabOneToMany("ManageTabOneToMany", oneToManyParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (DataService.isEmpty(oneToManyParam.tabularId))
                            oneToManyParam.tabularId = "formGeneratorTabulator" + param.fieldName;
                        console.log(response.data)
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


        $scope.updateRowWiseOneToMany = function (param, type) {
            if (type == 5 || type == 7) {
                param.action = type;
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

                        var tempData = response.data[0];
                        if (newParam.action == 7) {

                            notifierService.notifyMessage('success', 'FormEntry Updated', tempData.Message);
                        }

                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }

        $scope.editRowWiseOneToMany = function (param, type) {
            if (type == 5 || type == 7) {
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
            console.log(newParam, 'ffff');
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
            if ($scope.isEdit == true) {
                if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time) || $scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time == 0 && $scope.formDetailsDataInfo.userID == $scope.userDetail.Id) {
                    modifyFormData();
                }
                else if (DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time) || $scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time == 0 && $scope.formDetailsDataInfo.userID != $scope.userDetail.Id) {
                    modifyFormData();
                }
                else {
                    var VParam = {};
                    VParam.formId = $scope.currentFormId;
                    VParam.action = 1;
                    VParam.recordId = $scope.rowId;
                    if ($scope.formDetailsDataInfo.userID == $scope.userDetail.Id) {
                        var editime = $scope.formDetailsDataInfo.recordAccessSecurity.own.edit_time;
                        VParam.availableMinute = editime;
                    }
                    else if ($scope.formDetailsDataInfo.userID != $scope.userDetail.Id) {
                        var editime = $scope.formDetailsDataInfo.recordAccessSecurity.other.edit_time;
                        VParam.availableMinute = editime;
                    }
                    mainService.checkEditDeleteValidity("checkEditDeleteValidity", VParam)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                var isValid = response.data.data;
                                if (isValid == 1) {
                                    modifyFormData();
                                }
                                else {
                                    //notifierService.notifySweetAlertMessage('warning', 'Access validity', 'Time to update this record is expired');
                                    notifierService.notifyMessage('error', 'Access validity', 'Time to update this record is expired');
                                }
                            }
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }
            }
            else {
                if (!DataService.isEmpty($scope.importFormSettings.scheduler_referrence_formId)) {
                    modifyFormData();
                } else {
                    modifyFormData();
                }
            }


        }


        function compareValues(compareList, temp, listAllFields) {
            var result = "";
            var resultMain = "";
            _.each(compareList, function (item) {
                var exists = _.findWhere(listAllFields, { name: item.compare_value_with_control });
                if (!DataService.isEmpty(exists)) {
                    var val1 = 0;
                    var val2 = 0;
                    if (!DataService.isEmpty(temp[0].name)) {
                        var existsOne = _.findWhere(temp, { name: item.name });
                        var existsSecond = _.findWhere(temp, { name: exists.name });
                        if (DataService.isEmpty(existsOne.value))
                            existsOne.value = "0";
                        if (DataService.isEmpty(existsSecond.value))
                            existsSecond.value = "0";

                        val1 = parseInt(existsOne.value);
                        val2 = parseInt(existsSecond.value);
                        result += item.label + " Should be " + checkCompareOperation(item.compare_operation) + " " + exists.label + " ";
                        if (item.compare_operation.contains(">=")) {
                            if (val1 >= val2) {
                                result = "";
                            }
                        }
                        else if (item.compare_operation.contains("<=")) {
                            if (val1 <= val2) {
                                result = "";
                            }
                        }
                        else if (item.compare_operation.contains(">")) {
                            if (val1 > val2) {
                                result = "";
                            }
                        }
                        else if (item.compare_operation.contains("<")) {
                            if (val1 < val2) {
                                result = "";
                            }
                        }
                        else if (item.compare_operation.contains("=")) {
                            if (val1 = val2) {
                                result = "";
                            }
                        }

                    }
                    else {
                        _.each(temp, function (itemData) {
                            var existsOne = itemData[item.name]
                            var existsSecond = itemData[exists.name];
                            if (DataService.isEmpty(existsOne))
                                existsOne = "0";
                            if (DataService.isEmpty(existsSecond))
                                existsSecond = "0";
                            val1 = parseInt(existsOne);
                            val2 = parseInt(existsSecond);

                            result += item.label + " Should be " + checkCompareOperation(item.compare_operation) + " " + exists.label + " ";
                            if (item.compare_operation.contains(">=")) {
                                if (val1 >= val2) {
                                    result = "";
                                }
                            }
                            else if (item.compare_operation.contains("<=")) {
                                if (val1 <= val2) {
                                    result = "";
                                }
                            }
                            else if (item.compare_operation.contains(">")) {
                                if (val1 > val2) {
                                    result = "";
                                }
                            }
                            else if (item.compare_operation.contains("<")) {
                                if (val1 < val2) {
                                    result = "";
                                }
                            }
                            else if (item.compare_operation.contains("=")) {
                                if (val1 = val2) {
                                    result = "";
                                }
                            }
                        });

                    }
                    if (result != "")
                        resultMain += result;
                }
            });

            return resultMain;
        };
        function checkCompareOperation(operator) {
            var res = "";
            switch (operator) {
                case ">":
                    res = "greater than";
                    break;
                case ">=":
                    res = "should be greater than or equal to";
                    break;
                case "<":
                    res = "smaller than";
                    break;
                case "<=":
                    res = "should be smaller than or equal to";
                    break;
                case "=":
                    res = "equal to";
                    break;
            }
            return res;
        }

        function modifyFormData() {
            var isCapchaVerified = window["capcha"];
            if (!DataService.isEmpty(isCapchaVerified))
                if (!isCapchaVerified) {
                    notifierService.notifySweetAlertMessage('error', '', 'capcha is not verified');
                    $rootScope.$emit("HideLoading");
                    return;
                }
            if ($scope.myForm.$invalid) return false;
            var temp = $("#customFormNew").serializeArray();
            console.log(temp, 'temp');
            var names = {};
            names = (function () {
                var n = [],
                    l = temp.length - 1;
                for (; l >= 0; l--) {
                    n.push(temp[l].name);
                }
                return n;
            })();
            var isDropdownCalenderControl = "";
            var referrrenceFormGroupKey = "";
            var listOfHidden = $("input[type='hidden']");
            _.each(listOfHidden, function (item) {
                if (item.id.contains('isDropdownCalender')) {
                    isDropdownCalenderControl = item.value;
                }
            });
            if (isDropdownCalenderControl != "") {
                var exists = _.findWhere(temp, { name: isDropdownCalenderControl });
                if (!DataService.isEmpty(exists)) {
                    referrrenceFormGroupKey = $("#" + exists.name + " option[value='" + exists.value + "']").data("formgroupkey");
                    if (referrrenceFormGroupKey == undefined)
                        referrrenceFormGroupKey = "";
                }
            }
            var chkListTemp = [];
            $('#customFormNew').find($('input[type="checkbox"]:not(:checked)')).each(function () {
                if ($.inArray(this.name, names) === -1) {
                    //temp.push({ name: this.name, value: '' });
                    chkListTemp.push({ name: this.name, value: '' });
                }
            });
            if (chkListTemp.length > 0) {
                chkListTemp = _.uniq(chkListTemp, "name");
                _.each(chkListTemp, function (itcheck, keyck) {
                    temp.push({ name: itcheck.name, value: '' });
                });
            }
            var frm = $('#customFormNew').find(":input:not(:hidden)").serialize();
            // console.log(temp);
            var param = {};
            if (!$scope.isEdit) {
                param.action = 1;
                param.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
                if (referrrenceFormGroupKey != "") {
                    param.formGroupKey = referrrenceFormGroupKey;
                }
                temp.push({ "formGroupKey": $scope.freshEntryformGroupKey, "name": "formGroupKey", "value": $scope.freshEntryformGroupKey });
            }
            else {
                param.action = 2;
                param.formGroupKey = $scope.formGroupKey;
                param.Id = $scope.rowId;
                if (referrrenceFormGroupKey != "") {
                    param.formGroupKey = referrrenceFormGroupKey;
                }
                temp.push({ "formGroupKey": $scope.formGroupKey, "name": "formGroupKey", "value": $scope.formGroupKey });
            }

            var listAllFields = [];
            angular.forEach($scope.formFields, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {
                    listAllFields.push(item);
                });
            });


            var table_scheduling = _.findWhere(listAllFields, { name: "table_scheduling" });
            if (!DataService.isEmpty(table_scheduling)) {
                var table_schedulingColumns = 0;
                var table_schedulingRows = 0;
                table_schedulingColumns = parseInt(table_scheduling.columns);
                table_schedulingRows = parseInt(table_scheduling.rows);

                var counterTable = 0;
                for (var r = 1; r <= table_schedulingRows; r++) {
                    for (var c = 1; c <= table_schedulingColumns; c++) {
                        var tableId = table_scheduling.name + "[column-" + c + "][row-" + r + "]";
                        var existsTable = _.findWhere(temp, { name: tableId });
                        if (!DataService.isEmpty(existsTable)) {
                            if (!DataService.isEmpty(existsTable.value)) {
                                counterTable++;
                                break;
                            }
                        }
                    }
                }
                if (counterTable < 2) {
                    //notifierService.notifyMessage('error', 'Schedular', 'Single Start & End Time should be entered.');
                    notifierService.notifySweetAlertMessage('error', 'Schedular', 'Single Start & End Time should be entered.');
                    return false;
                }
            }


            var compareableControls = _.filter(listAllFields, function (item) {
                return !DataService.isEmpty(item.compare_value_with_control)
                    && !DataService.isEmpty(item.compare_operation)
            });
            if (compareableControls.length > 0) {
                var temp1 = angular.copy(temp);
                var compareResult = compareValues(compareableControls, temp1, listAllFields);
                if (compareResult.length > 2) {
                    notifierService.notifySweetAlertMessage('error', 'Compare Field', compareResult);
                    return false;
                }

            }

            $timeout(function () {

                $rootScope.$emit("ShowLoading");
                var checkboxGroup = [];
                var namecheckbox = "";
                var removeIndexGroup = [];
                var groupByData = _.groupBy(temp, "name");
                var newList = [];
                angular.forEach(groupByData, function (item, key) {
                    //console.log(item)
                    //console.log(key)
                    if (item.length == 1) {
                        if (key.contains("[]") && item[0].value == "") {
                        } else {
                            newList.push({ "name": key, "value": item[0].value });
                        }
                        var exists = _.findWhere(listAllFields, { name: key });
                        if (!DataService.isEmpty(exists)) {
                            if (!DataService.isEmpty(exists.Referral_Form_Fields)) {
                                var exists1 = {};
                                exists1 = _.findWhere(temp, {
                                    name: exists.Referral_Form_Fields + "_hidden"
                                });
                                var exists2 = {}
                                exists2 = _.findIndex(newList, {
                                    name: key
                                });
                                if (!DataService.isEmpty(exists1))
                                    if (!DataService.isEmpty(exists2)) {
                                        newList[exists2].value = exists1.value;
                                        $scope.strReferenceForm = exists.Referral_Forms;
                                    }
                            }
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





                if ($scope.listOfReferrenceFields.length > 0) {
                    param.formReferrenceFieldsList = JSON.stringify($scope.listOfReferrenceFields);
                    param.MasterFormId = $scope.listOfReferrenceFields[0].MasterFormID;
                    param.MasterFormRow = $scope.listOfReferrenceFields[0].MasterFormRow;
                }

                param.formfieldDataListTemp = JSON.stringify(newList);


                if (!DataService.isEmpty(localStorage.getItem("insertReferrence"))) {
                    var temp1 = {};
                    temp1 = JSON.parse(localStorage.getItem("insertReferrence"));
                    if (!DataService.isEmpty(temp1.formGroupKey)) {
                        if (temp1.formId == $scope.importFormSettings.formId) {
                            param.MasterFormID = temp1.MasterFormID;
                        }
                    }
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
                    $scope.saveTabulatorView = true;
                    var listMultipleParent = [];
                    var listMultiple = [];
                    if ($("#RowID_Multiple").val() != "" && $("#RowID_Multiple").val() != undefined) {
                        var listIds = $("#RowID_Multiple").val();
                        listIds = listIds.split(',');
                        _.each(listIds, function (itemId) {
                            var exists = _.findWhere($scope.formDataTabulatorTempWithoutGroupBy1, { Id: parseInt(itemId) });
                            if (!DataService.isEmpty(exists)) {
                                var listMultiple = [];
                                _.each(exists, function (fieldData, key) {
                                    var mulipletemp = {};
                                    var exists1 = _.findWhere(listAllFields, { Referral_Form_Fields_Value: key });
                                    if (!DataService.isEmpty(exists1)) {
                                        mulipletemp.name = exists1.name;
                                        mulipletemp.value = fieldData;
                                        listMultiple.push(mulipletemp);
                                    } else {
                                        var exists1 = _.findWhere(listAllFields, { Default_Value_Field: key });
                                        if (!DataService.isEmpty(exists1)) {
                                            mulipletemp.name = exists1.name;
                                            mulipletemp.value = fieldData;
                                            listMultiple.push(mulipletemp);
                                        }
                                    }
                                });
                                var calculateExists = _.findWhere(listAllFields, { types: "calculator" });
                                if (!DataService.isEmpty(calculateExists)) {
                                    var forValue = calculateExists.value;
                                    if (!DataService.isEmpty(forValue)) {
                                        var listCon = forValue.replace("{", " ").replace("}", " ");
                                        listCon = listCon.replace("{", " ").replace("}", " ");
                                        listCon = listCon.split('*').map(function (item) {
                                            return item.trim();
                                        });
                                        //newList
                                        if (listCon.length > 0) {
                                            var unitVal = 0;
                                            var qtyVal = 0;
                                            var unitPrice = _.findWhere(listAllFields, { name: listCon[0] });
                                            if (!DataService.isEmpty(unitPrice)) {
                                                unitVal = exists[unitPrice.Default_Value_Field];
                                            }
                                            var quantity = _.findWhere(newList, { name: listCon[1] });
                                            if (!DataService.isEmpty(quantity)) {
                                                qtyVal = quantity.value;
                                                var indx = _.findIndex(listMultiple, { name: listCon[1] });
                                                listMultiple[indx].value = qtyVal;
                                            }
                                            if (qtyVal != 0 && unitVal != 0) {
                                                var total = parseInt(qtyVal) * parseInt(unitVal);
                                                var indx = _.findIndex(listMultiple, { name: calculateExists.name });
                                                if (indx != -1)
                                                    listMultiple[indx].value = total;
                                                else {
                                                    var mulipletemp = {};
                                                    mulipletemp.name = calculateExists.name;
                                                    mulipletemp.value = total;
                                                    listMultiple.push(mulipletemp);
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            listMultipleParent.push(JSON.stringify(listMultiple));
                        });
                        var formfieldDataListTempList = [];
                        _.each(listMultipleParent, function (item) {
                            formfieldDataListTempList.push(item);
                        });
                        var formGroupKeyList = [];
                        _.each(listMultipleParent, function (item) {
                            formGroupKeyList.push(create_UUID());
                        });

                        $timeout(function () {
                            $rootScope.$emit("ShowLoading");
                            var dataParam = {};
                            dataParam = param;
                            dataParam.isInternalDrop = false;
                            dataParam.formGroupKey = angular.copy(localStorage.getItem("formGroupKey" + $scope.currentFormId));
                            if (!DataService.isEmpty(localStorage.getItem("insertReferrence"))) {
                                var temp = {};
                                temp = JSON.parse(localStorage.getItem("insertReferrence"));
                                if (temp.formId == parseInt($scope.currentFormId)) {
                                    if (!DataService.isEmpty(temp.formGroupKey))
                                        dataParam.formGroupKey = temp.formGroupKey;
                                    else
                                        dataParam.formGroupKey = $scope.freshEntryformGroupKey;
                                    dataParam.MasterFormID = temp.MasterFormID;
                                }
                            }

                            dataParam.formfieldDataListTempList = formfieldDataListTempList;
                            dataParam.formGroupKeyListTemp = formGroupKeyList;
                            mainService.manageBulkGeneratedFormData("BulkGeneratedFormData", dataParam)
                                .then(function (response) {
                                    if (response.data != null && angular.isDefined(response.data)) {
                                        if (!DataService.isEmpty(response.data.Message)) {
                                            var param = {};
                                            param.formId = 0;
                                            param.action = 4;
                                            //param.tabularId = dataParam.tabularId;
                                            //param.fieldName = dataParam.fieldName;
                                            //param.formGroupKey = dataParam.formGroupKey;
                                            //param.formGroupKeyTemp = angular.copy(dataParam.formGroupKey);
                                            //param.isFormGroupKey = true;
                                            //var listAllFields = [];
                                            //angular.forEach($scope.formFields, function (pageData, pageKey) {
                                            //    angular.forEach(pageData, function (item, key) {
                                            //        listAllFields.push(item);
                                            //    });
                                            //});
                                            //var exists = _.findWhere(listAllFields, { name: param.fieldName });
                                            //if (!DataService.isEmpty(exists)) {
                                            //    param.formId = exists.reference_form;
                                            //}
                                            //param.formId = dataParam.formId;
                                            //$scope.bindOneToManyControl(param, param.tabularId, param.fieldName);

                                            notifierService.notifyMessage('success', 'FormEntry', response.data.Message);
                                            $rootScope.$emit("HideLoading");
                                            window.close();
                                        }
                                    }
                                });
                        }, 180);



                        //$rootScope.$emit("HideLoading");
                    }
                    else {
                        var tempForm = JSON.parse(param.formfieldDataListTemp);
                        var list = _.filter(listAllFields, function (item) { return !DataService.isEmpty(item.Referral_Forms) });
                        if (list.length > 0) {
                            _.each(list, function (fdata) {
                                var exists = _.findWhere(tempForm, { name: fdata.name });
                                if (!DataService.isEmpty(exists)) {
                                    var exists1 = _.findWhere(tempForm, {
                                        name: fdata.Referral_Form_Fields + "_hidden"
                                    });
                                    if (!DataService.isEmpty(exists1)) {
                                        var indx = _.findIndex(tempForm, { name: fdata.name });
                                        if (indx != -1) {
                                            if (!DataService.isEmpty($scope.formDataInfo[fdata.name + "_" + fdata.Referral_Form_Fields_Value]))
                                                tempForm[indx].value = $scope.formDataInfo[fdata.name + "_" + fdata.Referral_Form_Fields_Value];
                                        }
                                        var indx1 = _.findIndex(tempForm, { name: exists1.name });
                                        if (indx1 != -1) {
                                            if (!DataService.isEmpty($scope.formDataInfo[fdata.name + "_" + fdata.Referral_Form_Fields_Value]))
                                                tempForm[indx1].value = $scope.formDataInfo[fdata.name + "_" + fdata.Referral_Form_Fields_Value];
                                        }
                                    }
                                }
                            });
                            param.formfieldDataListTemp = JSON.stringify(tempForm);
                        }


                        GeneratedFormData(param);
                    }


                    //$timeout(function () {
                    //    var tempData = JSON.parse(param.formfieldDataListTemp);
                    //    var dataArray = [];
                    //    var list = '';
                    //    list += '{"';
                    //    angular.forEach(tempData, function (item) {
                    //        if (item.constructor == Object) {
                    //            list += '' + item.name + '":"' + item.value + '","';
                    //            list += 'RowID-' + item.name + '":"' + item.value + '","';
                    //        }
                    //    });
                    //    list = list.substring(0, list.length - 2);
                    //    list += "}"
                    //    dataArray.push(JSON.parse(list));
                    //    param.formfieldDataListTemp = JSON.stringify(dataArray);
                    //    // $scope.GetTabOneToManyDynamimc(param, param.action);
                    //}, 500)
                    //notifierService.notifyMessage('success', 'FormEntry', 'Data Saved');

                    //$timeout(function () {
                    //    $("#customFormNew")[0].reset();
                    //    //$scope.freshEntryformGroupKey = create_UUID();
                    //    $("#formGroupKey").val($scope.freshEntryformGroupKey);
                    //}, 500);

                }
                else if ($stateParams.popup == 3) {
                    param.action = 2;
                    //GeneratedFormData(param);

                    $timeout(function () {
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

                        //$scope.GetTabOneToManyDynamimc(param, param.action);
                    }, 500)

                    //notifierService.notifyMessage('success', 'FormEntry', 'Data Updated');
                }
                else {
                    //console.log(param,'sona');
                    //return false;
                    if ($scope.saveTabulatorViewNew == false)
                        $scope.saveTabulatorView = false;
                    GeneratedFormData(param);
                }
            }, 180);
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
            $rootScope.$emit("ShowLoading");
            if (dataParam.created_at || dataParam.updated_at) {
                dataParam.created_at = moment(dataParam.created_at).format('YYYY-MM-DD HH:mm:ss');
                dataParam.updated_at = moment(dataParam.updated_at).format('YYYY-MM-DD HH:mm:ss');
            }

            var generatedFormDataLink = GetGeneratedFormDataUrl($scope.currentFormId, $scope.isEdit);

            mainService.manageGeneratedFormData(generatedFormDataLink, dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            //console.log(response.data);
                            //return false;
                            if (exists.res == 1) {
                                if ($scope.saveTabulatorView == true) {
                                    $scope.manageOneToManyReferrenceFunction(exists, dataParam);
                                }
                                /* 
             whatsapp notification sms func by SR078
             */
                                var Wparam = {};
                                var roles = [];
                                if (!DataService.isEmpty($scope.importFormSettings.NotifyOnAction) && $scope.importFormSettings.IsFreePlan == 0) {
                                    if (!DataService.isEmpty($scope.importFormSettings.allowWhatsappNotification)) {
                                        roles = JSON.parse($scope.importFormSettings.allowWhatsappNotification);
                                        Wparam.FormuserRoles = roles.join();
                                    }
                                    if ($scope.isEdit == false && $scope.importFormSettings.NotifyOnAction == 0) {
                                        Wparam.crudNotify = 1;
                                    }
                                    else if ($scope.isEdit == true && $scope.importFormSettings.NotifyOnAction == 1) {
                                        Wparam.crudNotify = 2;
                                    }
                                    else if ($scope.importFormSettings.NotifyOnAction == 2) {
                                        if ($scope.isEdit == false) {
                                            Wparam.crudNotify = 1;
                                        }
                                        else {
                                            Wparam.crudNotify = 2;
                                        }
                                    }
                                    else {
                                        Wparam.crudNotify = -1;
                                    }

                                    if (Wparam.crudNotify >= 0) {
                                        Wparam.rec_link = "Record: " + mainService.getBaseUrl() + "#/form/editEntry/" + $scope.importFormSettings.formId + "/" + response.data.formGroupKey + "/" + response.data.Id + "?popup=1";//$scope.importFormSettings.formRecordUrl;
                                        Wparam.link = "Table: " + mainService.getBaseUrl() + "#/form/records/" + $scope.importFormSettings.formId;//$scope.importFormSettings.formRecordUrl;
                                        Wparam.summary_link = "Summary: " + mainService.getBaseUrl() + "#/pivot/" + $scope.importFormSettings.formId;
                                        Wparam.userID = $scope.userDetail.Id;
                                        Wparam.formId = $scope.importFormSettings.formId;
                                        Wparam.folderTitle = $scope.importFormSettings.applicationTitle;
                                        Wparam.formTitle = $scope.importFormSettings.title;
                                        Wparam.action = 1;
                                        Wparam.record_id = response.data.Id;
                                        mainService.manageCRUDWhatsAppN("ManageCRUDWhatsAppN", Wparam)
                                            .then(function (responseW) {
                                                var data = responseW.data;
                                                console.log(responseW.data, 'responseW.data;');
                                                if (data != null && angular.isDefined(data)) {
                                                }
                                            });
                                    }
                                }


                                //email notification
                                var Eparam = {};
                                var Eroles = [];
                                if (!DataService.isEmpty($scope.importFormSettings.NotifyEmailOnAction)) {
                                    if (!DataService.isEmpty($scope.importFormSettings.allowEmailNotification)) {
                                        Eroles = JSON.parse($scope.importFormSettings.allowEmailNotification);
                                        Eparam.FormuserRoles = Eroles.join();
                                    }
                                    if ($scope.isEdit == false && $scope.importFormSettings.NotifyEmailOnAction == 0) {
                                        Eparam.crudNotify = 1;
                                    }
                                    else if ($scope.isEdit == true && $scope.importFormSettings.NotifyEmailOnAction == 1) {
                                        Eparam.crudNotify = 2;
                                    }
                                    else if ($scope.importFormSettings.NotifyEmailOnAction == 2) {
                                        if ($scope.isEdit == false) {
                                            Eparam.crudNotify = 1;
                                        }
                                        else {
                                            Eparam.crudNotify = 2;
                                        }
                                    }
                                    else {
                                        Eparam.crudNotify = -1;
                                    }

                                    if (Eroles.length > 0 && Eparam.crudNotify >= 0) {
                                        Eparam.userID = $scope.userDetail.Id;
                                        Eparam.formId = $scope.importFormSettings.formId;
                                        Eparam.record_id = response.data.Id;
                                        Eparam.SelectedformId = $scope.importFormSettings.formId;
                                        Eparam.folderTitle = $scope.importFormSettings.applicationTitle;
                                        Eparam.formTitle = $scope.importFormSettings.title;
                                        Eparam.groupId = $scope.importFormSettings.groupID;
                                        Eparam.rec_link = "Record: " + mainService.getBaseUrl() + "#/form/editEntry/" + $scope.importFormSettings.formId + "/" + response.data.formGroupKey + "/" + response.data.Id + "?popup=1";//$scope.importFormSettings.formRecordUrl;
                                        Eparam.link = "Table: " + mainService.getBaseUrl() + "#/form/records/" + $scope.importFormSettings.formId;//$scope.importFormSettings.formRecordUrl;
                                        Eparam.summary_link = "Summary: " + mainService.getBaseUrl() + "#/pivot/" + $scope.importFormSettings.formId;
                                        mainService.manageEmailNotification("ManageEmailNotification", Eparam)
                                            .then(function (responseW) {
                                                var data = responseW.data;
                                                if (data != null && angular.isDefined(data)) {
                                                }
                                            });
                                    }

                                }
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
                                        window.close();
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
                                        window.close();
                                    }
                                    // $("#customFormNew")[0].reset();
                                    $timeout(function () {
                                        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                        Waves.attach('.flat-buttons', ['waves-button']);
                                        Waves.init();
                                    }, 250);
                                }, 1000);
                                //var qrString = $location.search();
                                //console.log('ssssssssssssssssssssssssssssssssssss');
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
                                    $timeout(function () {
                                        //
                                        if ($scope.importFormSettings.recordAccessSecurity.max_one_record_per_user == true) {
                                            window.history.back();
                                        }
                                        else {
                                            location.reload();
                                        }

                                    }, 1000);
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
                                            // location.reload();
                                        }
                                    });
                                } else {
                                    notifierService.notifyMessage('error', 'FormEntry', exists.Message);
                                    //$("#customFormNew")[0].reset();
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
            $scope.displayInTabData = _.findWhere($scope.allReferrenceData1.formDataHeaders, { "Display_tab": true });
            var filterData = angular.copy($scope.formDataTabulatorTempWithoutGroupBy1);
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
            var exists1 = _.findWhere($scope.allReferrenceData1.formDataHeaders, { Hide_show: "YesWithEdit" });

            var filterDataNew = _.filter(filterData, function (item, key) {
                if (!DataService.isEmpty(exists1)) {
                    if (!DataService.isEmpty(item[exists1.field])) {
                        item[exists1.field] = "";
                    }
                }
                if (!DataService.isEmpty(filterValue)) {
                    var filterNest = _.filter(item, function (itemNest, keyNest) {
                        // if (angular.isDefined(itemNest) && $scope.displayInTabData.field == keyNest)
                        itemNest = (!DataService.isEmpty(itemNest)) ? itemNest : "";
                        return itemNest.toString() == filterValue.value;
                    });
                    if (!DataService.isEmpty(filterNest))
                        temp.push(item)
                }

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
        };

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
                            //console.log(response);
                            $scope.allReferrenceData1 = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData1.tablist, _.findWhere($scope.allReferrenceData1.tablist, { value: "0" }));
                            //$scope.tabList.unshift({
                            //    "label": "All", "value": "All","isDefault":true
                            //});
                            $scope.formDataTabulatorTempWithoutGroupBy1 = $scope.allReferrenceData1.formDataListNew;
                            $timeout(function () {
                                if (!DataService.isEmpty($scope.formDataTabulatorTempWithoutGroupBy1))
                                    if ($scope.formDataTabulatorTempWithoutGroupBy1.length > 0)
                                        $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy1[0].formId);
                                window["popupTabulator"].setHeight("450px");

                                var temp = bindTColumnHeader($scope.allReferrenceData1.formDataHeaders);
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
                                title: item.title, columnType: type, formatter: multilFiles, headerSort: false, align: "center", field: item.field, align: "left", cellClick: function (e, cell) {

                                    getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                }
                            });
                        }
                        else {
                            finalArray.push({
                                title: item.title, columnType: type, formatter: arrowImage, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.field, align: "left", headerFilter: "input"
                            });
                        }
                    }
                    else {
                        if (DataService.isEmpty(item.Display_tab)) {
                            if (item.Hide_show == "YesWithEdit") {
                                finalArray.push({
                                    title: item.title, columnType: type, bottomCalc: showFooter(item),
                                    field: item.field, align: "left", headerFilter: "input", editor: "input",
                                    cellEdited: function (cell) {
                                        console.log("cell" + cell)
                                    }
                                });
                            }
                            else
                                finalArray.push({ title: item.title, columnType: type, bottomCalc: showFooter(item), field: item.field, align: "left", headerFilter: "input" });
                        }
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
        };

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

            //console.log('dsdsd' + $scope.InformationLink.url);

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
                        console.log(data, 'data');
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
                $rootScope.$emit("HideLoading");
            }






        };

        $scope.ToLocalDateTime = function (date) {
            var dateTime = new Date(date);
            var FdateTime = moment(dateTime).format("YYYY-MM-DD HH:mm");
            var dt_format = moment.utc(FdateTime).local().format("YYYY-MM-DD HH:mm");
            return dt_format;
        }

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