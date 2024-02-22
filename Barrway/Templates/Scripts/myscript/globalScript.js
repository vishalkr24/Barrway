(function ($) {
    $.fn.serializeFiles = function () {
        var form = $(this),
            formData = new FormData(),
            formParams = form.serializeArray();
        $.each(form.find('input[type="file"]'), function (i, tag) {
            $.each($(tag)[0].files, function (i, file) {
                formData.append(tag.name, file);
            });
        });
        $.each(formParams, function (i, val) {
            formData.append(val.name, val.value);
        });
        return formData;
    };
})(jQuery);
//----------------------------
function pageActionsToggleer() {
    $('.pageActions').toggleClass('active');
    $('.pageActionsToggleer').toggleClass('active');
}
function createClass(name, rules) {
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if (!(style.sheet || {}).insertRule)
        (style.styleSheet || style.sheet).addRule(name, rules);
    else
        style.sheet.insertRule(name + "{" + rules + "}", 0);
}

function loadcssjsfile(filename, filetype, id) {
    if (filetype == "js") {
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
        fileref.setAttribute("id", id);
    }
    else if (filetype == "css") {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
        fileref.setAttribute("id", id)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function JSONTryParse(jsonString) {
    var json;
    try {
        json = JSON.parse(jsonString);
    } catch (exception) {
        json = null;
    }
    return json;
};

function generateColumnFieldCustom(settings, index, name, value, cord, display_only, worksheet, fieldClass, isSubheading, pageKey, strName) {
    if (worksheet === undefined || typeof worksheet == "undefined" || worksheet == "") {
        worksheet = "";
    }
    var result = {};
    if (typeof settings === 'undefined') {
        result['result'] = '&nbsp;';
        result['width'] = '';
        return result;
    }
    var params = deparam(settings);
    var dynamicClass = strName;
    var fieldType = params['column-' + index + '[inputType]'] ? params['column-' + index + '[inputType]'] : '';
    var field = "";
    var attributeType = "";
    attributeType = params['column-' + index + '[' + fieldType + '][type]'] ? params['column-' + index + '[' + fieldType + '][type]'] : ''
    var referrenceData = "";
    referrenceData = params['column-' + index + '[' + fieldType + '][Referrence][data]'] ? params['column-' + index + '[' + fieldType + '][Referrence][data]'] : ''
    var min = params['column-' + index + '[' + fieldType + '][min]'],
        max = params['column-' + index + '[' + fieldType + '][max]'],
        coordinate = '',
        typeClass = params['column-' + index + '[' + fieldType + '][type]'],
        required = typeof params['column-' + index + '[' + fieldType + '][required]'] !== 'undefined' ? 'required' : '',
        controlId = "",
        XCoordinate = "",
        YCoordinate = "",
        validationId = "";
    y = (cord); 
    if (params['column-' + index + '[' + fieldType + '][coordinate]']) {
        coordinate = params['column-' + index + '[' + fieldType + '][coordinate]'];
    } else {
        if (params['column-' + index + '[' + fieldType + '][XCoordinate]'] && params['column-' + index + '[' + fieldType + '][YCoordinate]']) {
            coordinate = (params['column-' + index + '[' + fieldType + '][XCoordinate]'] + params['column-' + index + '[' + fieldType + '][YCoordinate]']).toUpperCase();
        }
    }
    XCoordinate = params['column-' + index + '[' + fieldType + '][XCoordinate]'];
    YCoordinate = params['column-' + index + '[' + fieldType + '][YCoordinate]'];
    controlId = name + "-column-" + index;
    var xlsCode = (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "");
    validationId = name;
    var width = params['column-' + index + '[width]'];
    if (attributeType == "output") {
        var exists = _.findWhere(window["listOfOutput"], { id: validationId });
        if (angular.isUndefined(exists)) {
            var xcelParamOut = {};
            xcelParamOut.id = validationId;
            xcelParamOut.sheetName = worksheet;
            xcelParamOut.type = attributeType;           
            xcelParamOut.columnNo = index;
            xcelParamOut.xlsCode = xlsCode;          
            xcelParamOut.isRead = true;
            xcelParamOut.isWrite = false;
            window["listOfOutput"].push(xcelParamOut);
        }
    }
    var functionInput = "";
    if (xlsCode.length > 1 && worksheet.length > 1)
        functionInput = 'onchange="angular.element(this).scope().onBlurInputTable(\'' + xlsCode + ',' + worksheet + ',' + name + ',' + validationId + ',' + typeClass + ',' + pageKey + ', ' + index + ', ' + cord + '\')"';
    switch (fieldType) {
        case 'text':
            var step = params['column-' + index + '[' + fieldType + '][step]'];
            field = '<input type="text" ' + display_only + ' class="form-control ' + dynamicClass + '  ' + controlId + ' ' + (typeClass != "" ?
                (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + xlsCode + '" ' + (typeClass == "output" ? "readonly " : " ") +
                ' data-xlsxfield="' + xlsCode + '" data-worksheet="' + worksheet + '" name="'
                + validationId + '" value="' + value + '" minlength="' + min + '" maxlength="' + max + '" ' + required + ' id="' + validationId + '" ' + functionInput + ' >';         
            break;
        case 'number':
            var step = params['column-' + index + '[' + fieldType + '][step]'];
            field = '<input type="number" ' + display_only + ' id="' + validationId + '" class="form-control ' + dynamicClass + ' ' + fieldClass + ' ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + xlsCode + '" ' + (typeClass == "output" ? "readonly " : " ") + ' data-xlsxfield="' + xlsCode + '" data-worksheet="' + worksheet + '" name="' + validationId + '" value="' + value + '" min="' + min + '" max="' + max + '" step="' + step + '" ' + required + ' ' + functionInput + ' >';         
            break;
        case 'date':            
            field = '<input type="date" ' + display_only + (typeClass == "output" ? "readonly " : " ") + ' id="' + validationId + '" class="form-control ' + dynamicClass + ' ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + '" data-xlsxfield="' + xlsCode + '" data-worksheet="' + worksheet + '" name="' + validationId + '" value="' + value + '" ' + required + '  ' + functionInput + ' >';
            break;
        case 'time':            
            field = '<input type="time" ' + display_only + (typeClass == "output" ? "readonly " : " ") + ' id="' + validationId + '" class="form-control ' + dynamicClass + ' ' + (typeClass != "" ? (typeClass == "input" ? "inputClass " : "disabledOutput ") : "") + '" data-xlsxfield="' + xlsCode + '" data-worksheet="' + worksheet + '" name="' + validationId + '" value="' + value + '" ' + required + '  ' + functionInput + ' >';
            break;
        case 'checkbo':
            var str = params['column-' + index + '[' + fieldType + '][option]'];
            if (str.length > 0) {
                var opt = extraDeparam(str);
                if (opt !== undefined) {
                    var options = opt['column-' + index][fieldType]['option'];
                    if (options.length > 0) {
                        $(options).each(function (i, s) {
                            var random_id = Math.floor(Math.random() * 90000) + 10000;
                            var innerValue = s.replace(/\s/g, '_');
                            field += '<div class="' + (name ? "checkbox-inline" : "") + '"><label for="' + random_id + '"' + (display_only == 'disabled' ? "style='pointer-events: none;'" : '') + '><input type="checkbox" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + validationId + '[]" value="' + innerValue + '" ' + required + ' id="' + random_id + '" ' + ($.inArray(innerValue, value) >= 0 ? "checked" : "") + '>' + s + '</label></div>';
                        })
                    }
                }
            }
            break;
        case 'radiobo':
            var str = params['column-' + index + '[' + fieldType + '][option]'];           
            if (str.length > 0) {
                var opt = extraDeparam(str);
                if (opt !== undefined) {
                    var options = opt['column-' + index][fieldType]['option'];
                    if (options.length > 0) {
                        $(options).each(function (i, s) {
                            var random_id = Math.floor(Math.random() * 90000) + 10000;
                            var innerValue = s.replace(/\s/g, '_');
                            field += '<div class="' + (name ? "radio-inline" : "") + '"><label for="' + random_id + '"' + (display_only == 'disabled' ? "style='pointer-events: none;'" : '') + '><input type="radio" data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '" name="' + validationId + '" value="' + innerValue + '" ' + required + ' id="' + random_id + '" ' + (value == innerValue ? 'checked' : '') + '>' + s + '</label></div>';
                        })
                    }
                }
            }
            break;
        case 'select':
            var str = params['column-' + index + '[' + fieldType + '][option]'];
            var select2 = params['column-' + index + '[' + fieldType + '][Select2]'];
            if (referrenceData != "") {
                var deparm = extraDeparam(referrenceData);                
                field += bindReferrenceTableDropdown(deparm, strName, name, required, display_only, coordinate, worksheet, value,select2);
            }
            else {
                if (str.length > 0) {
                    var opt = extraDeparam(str);
                    if (opt !== undefined) {
                        var options = opt['column-' + index][fieldType]['option'];
                        field += '<select name="' + name + '" ' + required + ' class="form-control" ' + display_only + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '">';
                        $(options).each(function (i, s) {
                            if (options.length > 0) {
                                var innerValue = s.replace(/\s/g, '_');
                                field += '<option  value="' + innerValue + '" ' + (value == innerValue ? 'selected' : '') + '> ' + s;
                            }
                        });                        
                        if (select2 == "Yes") {
                            $("select[name='" + name + "']").selectpicker({
                                liveSearch: true,
                                container: 'body'
                            });
                            $("select[name='" + name + "']").selectpicker("refresh")
                        }
                    }
                }
            }
            break;
        default:
            field = '&nbsp;';
            break;
    }
    result['result'] = field;
    result['width'] = width;
    return result;
}

var apiCalled = false;
var apiCalledformId = 0;
var formList = [];
function bindReferrenceTableDropdown(postData, strName, name, required, display_only, coordinate, worksheet, value,select2) {
    var param = {};
    var customField = "";
    param.action = 3;
    param.fieldName = " ";
    if (postData != "") {
        if (postData.Form_Fields_Value != "") {
            if (postData.Form_Fields_Value != "Id")
                param.fieldName += " " + postData.Form_Fields + " , "
        } 
        if (postData.Form_Fields != "") {
            param.fieldName += " " + postData.Form_Fields+"  "
        }
        var customClass = "";
        if (select2 == "Yes") {
            customClass = "customClass "
        }
        if (postData.Forms != "") {          
            param.formId = postData.Forms;
            if (localStorage.getItem(strName + "_" + param.formId) == null) {
                apiCalled = false;
                localStorage.setItem(strName + "_" + param.formId, param.formId);
                
                customField += '<select name="' + name + '" ' + required + '  class="referrence_' + param.formId + ' form-control ' + customClass + '" ' + display_only + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '">';
                if (apiCalledformId != param.formId) {
                    apiCalled = false;
                }
                if (!apiCalled && apiCalledformId != param.formId) {
                    apiCalled = true;
                    apiCalledformId = param.formId;
                    var selectedField = angular.copy(param.fieldName);
                    param.formId = parseInt(param.formId);
                    var exists = _.findWhere(formList, { formId: apiCalledformId });
                    if (exists == null || exists == undefined) {
                        formList.push({ formId: apiCalledformId });
                        if (param.fieldName.contains(',')) {
                            var fieldList = param.fieldName.split(',');
                            if (fieldList[0].trim() == fieldList[1].trim()) {
                                param.fieldName = fieldList[0];
                            }
                        }
                        $.ajax({
                            type: "post",
                            url: "api/FormAPI/getReferralFormFields",
                            data: JSON.stringify(param),
                            dataType: 'json',
                            contentType: "application/json",
                            success: function (response) {
                                if (selectedField.contains(',')) {
                                    var fieldList = selectedField.split(',');
                                    _.each($(".referrence_" + param.formId + ""), function (item) {
                                        var auxArr = [];
                                        _.each(response, function (itemData, key) {
                                            auxArr[key] = "<option value='" + itemData.value + "'>" + itemData.label + "</option>";
                                        });
                                        $(item).append(auxArr.join(''));
                                    });
                                }
                                else {
                                    _.each($(".referrence_" + param.formId + ""), function (item) {
                                        var auxArr = [];
                                        _.each(response, function (itemData, key) {
                                            auxArr[key] = "<option value='" + itemData.Id + "'>" + itemData.label + "</option>";
                                        });
                                        $(item).append(auxArr.join(''));
                                    });
                                }
                                setTimeout(function () {
                                    if (select2 == "Yes") {
                                        $("." + customClass).selectpicker({
                                            liveSearch: true,
                                            container: 'body'
                                        });
                                        $("." + customClass).selectpicker("refresh")

                                    }
                                }, 200);



                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    }
                    //$.post("api/FormAPI/getReferralFormFields",  param, function (response) {
                    //    if (param.fieldName.contains(',')) {
                    //        var fieldList = param.fieldName.split(',');
                    //        _.each($(".referrence_" + param.formId + ""), function (item) {
                    //            var auxArr = [];
                    //            _.each(response, function (itemData, key) {
                    //                auxArr[key] = "<option value='" + itemData[fieldList[0]] + "'>" + itemData.label + "</option>";
                    //            });
                    //            $(item).append(auxArr.join(''));
                    //        });
                    //    }
                    //    else {
                    //        _.each($(".referrence_" + param.formId + ""), function (item) {
                    //            var auxArr = [];
                    //            _.each(response, function (itemData, key) {
                    //                auxArr[key] = "<option value='" + itemData.Id + "'>" + itemData.label + "</option>";
                    //            });
                    //            $(item).append(auxArr.join(''));
                    //        });
                    //    }
                    //    setTimeout(function () {
                    //        if (select2 == "Yes") {
                    //            $("." + customClass).selectpicker({
                    //                liveSearch: true                                  
                    //            });
                    //            $("." + customClass).selectpicker("refresh")
                               
                    //        }
                    //    }, 200);
                    //});
                }
            }
            else {
                param.formId = localStorage.getItem(strName + "_" + param.formId);   
                customField += '<select name="' + name + '" ' + required + '  class="referrence_' + param.formId + ' form-control ' + customClass + '" ' + display_only + ' data-xlsxfield="' + (coordinate != "" && coordinate != undefined ? (coordinate.replace(/[0-9]/g, '') + (parseInt(coordinate.match(/\d+/)[0]) + (y))) : "") + '" data-worksheet="' + worksheet + '">';
                if (apiCalledformId != param.formId) {
                    apiCalled = false;
                }
                if (!apiCalled && apiCalledformId != param.formId) {
                    apiCalled = true;             
                    apiCalledformId = param.formId;                  
                    param.formId = parseInt(param.formId);
                    var exists = _.findWhere(formList, { formId: apiCalledformId });
                    var selectedField = angular.copy(param.fieldName);
                    if (exists == null || exists == undefined) {
                        formList.push({ formId: apiCalledformId });
                        if (param.fieldName.contains(',')) {
                            var fieldList = param.fieldName.split(',');
                            if (fieldList[0].trim() == fieldList[1].trim()) {
                                param.fieldName = fieldList[0];
                            }
                        }
                        $.ajax({
                            type: "post",
                            url: "api/FormAPI/getReferralFormFields",
                            data: JSON.stringify(param),
                            dataType: 'json',
                            contentType: "application/json",
                            success: function (response) {
                                if (selectedField.contains(',')) {
                                    var fieldList = selectedField.split(',');
                                    _.each($(".referrence_" + param.formId + ""), function (item) {
                                        var auxArr = [];
                                        _.each(response, function (itemData, key) {
                                            auxArr[key] = "<option value='" + itemData.value + "'>" + itemData.label + "</option>";
                                        });
                                        $(item).append(auxArr.join(''));
                                    });
                                } else {
                                    _.each($(".referrence_" + param.formId + ""), function (item) {
                                        var auxArr = [];
                                        _.each(response, function (itemData, key) {
                                            auxArr[key] = "<option value='" + itemData.Id + "'>" + itemData.label + "</option>";
                                        });
                                        $(item).append(auxArr.join(''));
                                    });
                                }
                                apiCalled = true;

                                  setTimeout(function () {
                        if (select2 == "Yes") {
                            $("." + customClass).selectpicker({
                                liveSearch: true,
                                container: 'body'
                            });
                            $("." + customClass).selectpicker("refresh")

                            $("." + customClass).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                                $(e.currentTarget).selectpicker("toggle");
                            });
                        }
                    }, 200);


                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    }
                  

                    //$.post("api/FormAPI/getReferralFormFields",param, function (response) {
                    //    if (param.fieldName.contains(',')) {
                    //        var fieldList = param.fieldName.split(',');                          
                    //        _.each($(".referrence_" + param.formId + ""), function (item) {
                    //            var auxArr = [];
                    //            _.each(response, function (itemData, key) {
                    //                auxArr[key] = "<option value='" + itemData[fieldList[0]] + "'>" + itemData.label + "</option>";
                    //            });
                    //            $(item).append(auxArr.join(''));
                    //        });
                    //    } else {            
                    //        _.each($(".referrence_" + param.formId + ""), function (item) {
                    //            var auxArr = [];
                    //            _.each(response, function (itemData,key) {                                
                    //                auxArr[key] = "<option value='" + itemData.Id + "'>" + itemData.label + "</option>";
                    //            });
                    //            $(item).append(auxArr.join(''));
                    //        });
                    //    }
                    //    apiCalled = true;    
                    //    setTimeout(function () {
                    //        if (select2 == "Yes") {
                    //            $("." + customClass).selectpicker({
                    //                liveSearch: true
                                    
                    //            });
                    //            $("." + customClass).selectpicker("refresh")
                    //        }
                    //    }, 200);
                    //});
                }
            }
        }
    }    
    return customField;
}
function addNewForm(url, value, diff, page) {
    var shw = ((diff == "check") ? '<input type="hidden" name="diff_type" value="check" />' : "");
    $.ajax({
        type: "post",
        url: url,
        data: { action: value },
        success: function (data) {
            if (typeof data != 'object')
                var data = JSON.parse(data);
            if (data) {
                $('#pageActionModal').modal('hide');
                bootbox.dialog({
                    className: 'add-new-form-modal',
                    message: '<div class="container pad-0">' +
                        '<div class="panel-blue pad-0">' +
                        '<div class="panel-body">' +
                        '<div class="row">' +
                        '<div class="col-sm-6">' +
                        '<ul class="nav nav-tabs" role="tablist">' +
                        '<li class="nav-item active"><a class="nav-link" data-toggle="tab" href="#home" role="tab">Quick ' + (diff == "check" ? "Queue" : "Form") + '</a></li>' +
                        '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#profile" role="tab">Advance ' + (diff == "check" ? "Queue" : "Form") + '</a></li>' +
                        '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#excel" role="tab">Create ' + (diff == "check" ? "Queue" : "Form") + ' with Excel</a></li>' +
                        '</ul>' + ((page != "show") ? '<div class="shortcut_option pull-right"><a href="javascript:;" id="redirectMenuPageNew" data-type="popup" class="btn btn-success pull-left" title="Create Menu Link"><i class="fa fa-bars"></i></a></div>' : "") + '<div class="tab-content">' +
                        '<span id="menuName" class="hidden">Add Form</span><span id="menuDescription" class="hidden">Add Form popup description</span>' +
                        //basic Form
                        '<div class="tab-pane active" id="home" role="tabpanel">' +
                        '<form class="form-horizontal" id="quickForm" action="https://geligulu.com/form-generator/public/index.php/getSave"><input type="hidden" name="form_type" value="quick" />' + shw + '' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"><label class="control-label">Enter ' + (diff == "check" ? "Queue" : "Form") + ' Name :</label></div>' +
                        '<div class="col-sm-8"><input type="text" name="form_name" id="frmName" class="form-control"></div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"></div>' +
                        '<div class="col-sm-8"><div class="custom-checkbox"><input type="checkbox" id="addFormNQueueChk" name="check_value" checked/> <label for="addFormNQueueChk">Put this ' + (diff == "check" ? "Queue" : "Form") + ' in \"General Folder\"</label></div></div></div>' +
                        '<div class="col-sm-12 navbar-btn btn-sm text-center">' +
                        '<button class="float-buttons wv-btn wv-first">Create ' + (diff == "check" ? "Queue" : "Form") + '</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></form></div>' +
                        //advanced Form
                        '<div class="tab-pane" id="profile" role="tabpanel">' +
                        '<form class="form-horizontal" id="advancedForm" action="https://geligulu.com/form-generator/public/index.php/getSave">' +
                        '<div class="col-sm-12 form-group"><input type="hidden" name="form_type" value="advanced" />' + shw +
                        '<div class="col-sm-4">' +
                        '<label class="control-label">Enter ' + (diff == "check" ? "Queue" : "Form") + ' Name :</label></div>' +
                        '<div class="col-sm-8">' +
                        '<input type="text" class="form-control" name="form_name" id="frmName" /></div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"><label class="control-label">Select Folder :</label></div>' +
                        '<div class="col-sm-8">' + data.appOption + '</div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"></div>' +
                        '<div class="col-sm-8"><a href="javascript:;" onclick="app_link()"><i class="fa fa-plus"></i> Add New Folder</a></div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"><label class="control-label">Select Topic :</label></div>' +
                        '<div class="col-sm-8">' + data.topicOption + '</div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"></div>' +
                        '<div class="col-sm-8"><a href="javascript:;" onclick="topic_link(\'advancedForm\')"><i class="fa fa-plus"></i> Add New Topic</a></div></div>' +
                        '<div class="col-sm-12 navbar-btn btn-sm text-center"><button class="float-buttons wv-btn wv-first">Create ' + (diff == "check" ? "Queue" : "Form") + '</button>&nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div>' +
                        '</form></div>' +
                        //import form form excel
                        '<div class="tab-pane" id="excel" role="tabpanel">' +
                        '<form class="form-horizontal" id="excelForm" action="https://geligulu.com/form-generator/public/index.php/forms/createFormWithExcel" method="post" enctype="multipart/form-data">' +
                        '<input type="hidden" name="_token" value="mvkG5VvJXq24dNllxEZeKN9ZRfzv0kLdz9eM5IVn">' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4">' +
                        '<label class="control-label">Enter ' + (diff == "check" ? "Queue" : "Form") + ' Name :</label></div>' +
                        '<div class="col-sm-8">' +
                        '<input type="text" class="form-control" name="form_name" id="frmName" required /></div></div>' +
                        '<div class="col-sm-12 form-group">' + shw +
                        '<div class="col-sm-4">' +
                        '<label class="control-label">Select excel file:</label></div>' +
                        '<div class="col-sm-8">' +
                        '<input type="file" id="changeFile" name="changeFiles" class="form-control" name="formControls" required accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  onchange="checkfile(this);"><p class="text-left">(*.xlsx or *.xls files only)</p>' +
                        '</div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"><label class="control-label">Select Folder :</label></div>' +
                        '<div class="col-sm-8">' + data.appOption + '</div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"></div>' +
                        '<div class="col-sm-8"><a href="javascript:;" onclick="app_link()"><i class="fa fa-plus"></i> Add New Folder</a></div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"><label class="control-label">Select Topic :</label></div>' +
                        '<div class="col-sm-8">' + data.topicOption + '</div></div>' +
                        '<div class="col-sm-12 form-group">' +
                        '<div class="col-sm-4"></div>' +
                        '<div class="col-sm-8"><a href="javascript:;" onclick="topic_link(\'excelForm\')"><i class="fa fa-plus"></i> Add New Topic</a></div></div>' +
                        '<div class="col-sm-12 navbar-btn btn-sm text-center"><button class="float-buttons wv-btn wv-first">Create ' + (diff == "check" ? "Queue" : "Form") + '</button>&nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div>' +
                        '</form></div>' +
                        //end
                        '</div></div></div></div></div></div>'
                });
            }
            Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
function add_minutes(dt, minutes) {
    return new Date(dt.getTime() + minutes * 60000);
}
/*Set Language form and global*/

function getStringFromMultiligualText(labelText, globalLanguage) {
    var returnVal = "";
    var strArrLabel = [];
    if (labelText != "" && labelText !=null) {
        if (labelText.indexOf('|') > 0) {
            strArrLabel = labelText.split('|');
        } else {
            strArrLabel.push(labelText);
        }
    }
    if (globalLanguage != "" && globalLanguage != "0" && labelText != "") {
        var globalLanguageParam = 0;
        globalLanguageParam = parseInt(globalLanguage.trim());
        if (globalLanguageParam > 0) {
            if (globalLanguageParam <= strArrLabel.length) {
                returnVal = strArrLabel[globalLanguageParam - 1];
            } else {
                for (var i = globalLanguageParam - 1 - strArrLabel.length; i >= 0; i--)
                {
                    strArrLabel.push(labelText);
                }
                returnVal = strArrLabel[globalLanguageParam - 1];
            }
        }
    }
    return returnVal;
}

/*Custom date format with day name Jan 18, 2020, wednesday*/

function DateWithDayName(custom_date, isDateDiff) { 
    var currentDate, customdate,endDate;
    if (isDateDiff) {
        if (custom_date.start) {
            var spltDate = custom_date.start.split(' ');
            if (spltDate.length>0)
                currentDate = new Date(spltDate[0]);
            spltDate = custom_date.end.split(' ');
            if (spltDate.length > 0)
                endDate = new Date(spltDate[0]);
        }    
        var a = currentDate.getTime();
        var b = endDate.getTime();
        var dayDiff = Math.abs(b - a);
        var diffDays = Math.ceil(dayDiff / (1000 * 3600));
        if (diffDays==0)
            customdate = moment(currentDate).format('MMMM D, YYYY (dddd)');    
        else if(diffDays > 0)
        customdate = moment(currentDate).format('D') + " - " + moment(endDate).format('D') + ", " + moment(endDate).format('MMMM, YYYY');    
    }
    else {
        currentDate = new Date(custom_date);
        customdate = moment(currentDate).format('MMMM D YYYY, dddd');     
    }
    return customdate;
}

function TimeFormatCalender(custom_date, isTimeDiff) {
    var currentDate, customdate, endDate;
    if (isTimeDiff) {
        currentDate = new Date(custom_date.start);
        endDate = new Date(custom_date.end);         
        customdate = moment(currentDate).format('h:mm a') + " - " + moment(endDate).format('h:mm a');     

    }
    else {
        currentDate = new Date(custom_date);
        customdate = moment(currentDate).format('h:mm a');
    }
    return customdate;
}

function moveArrayIndex(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

function formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //var strTime = hours + ':' + minutes + ' ' + ampm;
    var strTime = hours +'' + ampm;
    return strTime;
}


