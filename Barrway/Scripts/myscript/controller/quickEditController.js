(function () {
    'use strict';
    FormGeneratorApp.controller('quickEditController', function ($scope, $filter, $ngBootbox, $rootScope, $http, $location, $window, $state, $timeout, mainService, DataService, notifierService, $stateParams) {

        var exampleTabulator = '';
        var attributesTabulator = '';
        var selectEditor = '';
        var colorEditor = '';
        var _commonAttr = '';

        var arrowIcon = function (cell, formatterParams) {

            if (cell.getData().type == "radio-group" || cell.getData().type == "select" || cell.getData().type == "checkbox-group")
                return "<button class='btn btn-primary' type='button' onclick=\"angular.element(this).scope().editOption(\'" + cell.getData().name + "\')\">Edit Options</button>";
            // return JSON.stringify(cell.getData().values);
        };

        $scope.editOption = function (name) {
            // alert(name)

            var data = exampleTabulator.getData();
            $scope.editDetailsOfFields = _.findWhere(data, { name: name });
            if (!DataService.isEmpty($scope.editDetailsOfFields)) {
                console.log($scope.editDetailsOfFields);
                $scope.optionList = [];
                $scope.optionList = $scope.editDetailsOfFields.values;
                $timeout(function () {
                    $("#editOptionModal").modal('show');
                }, 150);
            }
        };

        $scope.addItem = function () {
            $scope.optionList.push({ label: "", value: "" });

            $rootScope.safeApply();
        };

        $scope.removeItem = function (item, idx) {
            if (!DataService.isEmpty(item)) {
                $scope.optionList.splice(idx, 1);
                console.log($scope.editDetailsOfFields.values)
                console.log(exampleTabulator.getData())
            }
        };

        $scope.saveItem = function () {
            var filterData = _.filter($scope.optionList, function (item) { return !(DataService.isEmpty(item.value)) });
            console.log($scope.editDetailsOfFields.values)
            console.log(exampleTabulator.getData())
            if (!DataService.isEmpty(filterData)) {
                $scope.editDetailsOfFields.values = filterData;
                var temp = exampleTabulator.getData();
                var indx = temp.findIndex(x => x.name === $scope.editDetailsOfFields.name);
                temp[indx].values = $scope.editDetailsOfFields.values;
                exampleTabulator.setData(temp);
            }
            $("#editOptionModal").modal('hide');

        };

        $scope.init = function () {
            $scope.userDetail = mainService.loginDetails();
            $rootScope.IND_loading = false;
            bootbox.hideAll();
            $scope.currentFormId = $stateParams.formId;
            $timeout(function () {

                if (angular.isDefined($stateParams.formId)) {

                    $scope.getFormSettings($stateParams.formId);

                    selectEditor = function (cell, onRendered, success) {
                        var editor = '', type = '', options = '';
                        var type = 'text';
                        var field1 = cell.getField();
                        //var options = (typeof typeUserAttrs[type][field1] !== "undefined") ? typeUserAttrs[type][field1].options : "";
                        var options = "";
                        if (typeof options !== "undefined" || options !== "") {
                            var str = '<option value=""></option>';
                            $.each(options, function (i, s) {
                                str += '<option value="' + i + '">' + s + '</option>';
                            });
                        }
                        editor = $('<select name="' + cell.getField() + '">' + str + '</select>');

                        editor.css({
                            "padding": "3px",
                            "width": "100%",
                            "box-sizing": "border-box"
                        });
                        if (typeof cell.getValue() !== "undefined")
                            editor.val($(document).find('select[name="' + cell.getField() + '"] option:contains(' + cell.getValue() + ')').val());
                        else
                            editor.val("");
                        onRendered(function () {
                            editor.focus();
                        });

                        editor.on("change blur", function (e) {
                            success($('select[name="' + cell.getField() + '"] option:selected').text());
                        });
                        return editor[0];
                    };
                    colorEditor = function (cell, onRendered, success) {
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
                    _commonAttr = [
                        { "attribute": "required", "value": "Required", page: "Basic" },
                        { "attribute": "description", "value": "Help Text", page: "Basic" },
                        { "attribute": "placeholder", "value": "Placeholder", page: "Basic" },
                        { "attribute": "options", "value": "Options", page: "Basic" },
                        { "attribute": "alignment", "value": "Heading Alignment", page: "Format Setting" },
                        { "attribute": "justify", "value": "Heading Justification", page: "Format Setting" },
                        { "attribute": "label_width", "value": "Heading Width (In %)", page: "Format Setting" },
                        { "attribute": "width", "value": "Field Width (In %)", page: "Format Setting" },
                        { "attribute": "column", "value": "Columns", page: "Format Setting" },
                        { "attribute": "column_width", "value": "Column Width (In %)", page: "Format Setting" },
                        { "attribute": "background_color", "value": "Background Color", page: "Format Setting" },
                        { "attribute": "border", "value": "Border", page: "Format Setting" },
                        { "attribute": "border_top", "value": "Border Top", page: "Format Setting" },
                        { "attribute": "border_right", "value": "Border Right", page: "Format Setting" },
                        { "attribute": "border_bottom", "value": "Border Bottom", page: "Format Setting" },
                        { "attribute": "border_left", "value": "Border Left", page: "Format Setting" },
                        { "attribute": "Hide_show", "value": "Hide", page: "Advance Setting" },
                        { "attribute": "Display_Only", "value": "Display Only", page: "Advance Setting" },
                        { "attribute": "List_column1", "value": "List Field Table Layout", page: "Advance Setting" },
                        { "attribute": "List_column2", "value": "List Field Page Layout", page: "Advance Setting" },
                        { "attribute": "className", "value": "Class", page: "Advance Setting" }
                    ];

                    attributesTabulator = initTabulator("common-attributes", {
                        height: "70%",
                        minHeight: "400px",
                        selectable: true,
                        groupBy: "page",
                        columns: [
                            { title: "attribute", field: "attribute", align: "center", visible: false },
                            { title: "Common Attribute", field: "value", headerFilter: true, width: "100%", headerSort: false },
                            { title: "page", field: "page", visible: false }
                        ],
                        rowSelectionChanged: function (data, rows) {
                            if (data.length) {
                                $('a#create_custom').removeClass('disabled');
                            } else {
                                $('a#create_custom').addClass('disabled');
                            }
                            if (data.length) {
                                var tableColumns = [
                                    { title: "Name", field: "name", headerFilter: true, minWidth: 180, headerSort: false, visible: false },
                                    //{ title: "type", field: "type", visible: false },
                                    { title: "page", field: "page", visible: false },
                                    { title: "Field Type", field: "type", headerFilter: true, minWidth: 180, headerSort: false, formatter: "html", editor: false },
                                    { title: "Label", field: "label", headerFilter: true, formatter: "html", editor: true }
                                ];

                                $.each(data, function (i, s) {
                                    if (s.attribute === "background_color") {
                                        tableColumns.push({ title: s.value, field: s.attribute, editor: colorEditor });
                                    } else if ($.inArray(s.attribute, ["List_column1", "List_column2", "border_top", "border_right", "border_bottom", "border_left", "Hide_show", "Display_Only", "column", "alignment", "justify"]) >= 0) {
                                        tableColumns.push({ title: s.value, formatter: "html", field: s.attribute, editor: selectEditor, headerFilter: true });
                                    }
                                    else if (s.attribute === "required") {
                                        tableColumns.push({ title: s.value, field: s.attribute, formatter: "tick", editor: true, align: "center" });
                                    }
                                    else if (s.attribute === "options") {
                                        tableColumns.push({ title: s.value, field: s.attribute, formatter: arrowIcon, editor: true });
                                    }
                                    else {
                                        tableColumns.push({ title: s.value, field: s.attribute, editor: true, headerFilter: true });
                                    }
                                });
                                exampleTabulator.setColumns(tableColumns)
                                exampleTabulator.redraw();
                            }
                        },

                        rowDeselected: function (data, row) {
                            console.log(data.getData(), 'row deselected');
                            exampleTabulator.deleteColumn(data.getData().attribute);
                        }
                    });
                    attributesTabulator.setData(_commonAttr);

                    var i = 0;
                    if ($("#example-table").length)
                        exampleTabulator = initTabulator("example-table", {
                            height: "70%",
                            minHeight: "400px",
                            groupBy: "page",
                            groupStartOpen: function (value, count, data, group) {
                                i++;
                                return (i === 1 ? true : false);
                            },
                            columns: [
                                { title: "Name", field: "name", headerFilter: true, minWidth: 180, headerSort: false, visible: false },
                                //{ title: "type", field: "type", visible: false },
                                { title: "page", field: "page", visible: false },
                                { title: "Field Type", field: "type", headerFilter: true, minWidth: 180, headerSort: false, formatter: "html", editor: false },
                                { title: "Label", field: "label", headerFilter: true, formatter: "html", editor: true, minWidth: 180, headerSort: false }
                            ]


                        });

                }



            }, 450);

            $scope.optionList = [];


        };

        $(document).on('click', '#create_custom', function () {
            $('a.updateForm').removeClass('hidden');
            if ($("#example-table").html().length > 0) {
                // removeFields();
            }

            var selectedRows = attributesTabulator.getSelectedRows();

            var tableColumns = [
                { title: "Name", field: "name", headerFilter: true, minWidth: 180, headerSort: false, visible: false },
                //{ title: "type", field: "type", visible: false },
                { title: "page", field: "page", visible: false },
                { title: "Field Type", field: "type", headerFilter: true, minWidth: 180, headerSort: false, formatter: "html", editor: false },
                { title: "Label", field: "label", headerFilter: true, formatter: "html", editor: true }
            ];

            $.each(selectedRows, function (i, s) {
                if (s.getData().attribute === "background_color") {
                    tableColumns.push({ title: s.getData().value, field: s.getData().attribute, editor: colorEditor });
                } else if ($.inArray(s.getData().attribute, ["List_column1", "List_column2", "border_top", "border_right", "border_bottom", "border_left", "Hide_show", "Display_Only", "column", "alignment", "justify"]) >= 0) {
                    tableColumns.push({ title: s.getData().value, formatter: "html", field: s.getData().attribute, editor: selectEditor, headerFilter: true });
                }
                else if (s.getData().attribute === "required") {
                    tableColumns.push({ title: s.getData().value, field: s.getData().attribute, formatter: "tick", editor: true, align: "center" });
                }
                else if (s.getData().attribute === "options") {
                    tableColumns.push({ title: s.getData().value, field: s.getData().attribute, formatter: arrowIcon, editor: true });
                }
                else {
                    tableColumns.push({ title: s.getData().value, field: s.getData().attribute, editor: true, headerFilter: true });
                }
            });
            exampleTabulator.setColumns(tableColumns)
            exampleTabulator.redraw();
        });
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
                        //window["worksheets"] = result;

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
                            $rootScope.$emit("HideLoading");
                            if (frmDataCheck.GracePeriodActive == 0) {
                                notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', frmDataCheck.Message, 'topic');
                                return false;
                            }
                            else if (frmDataCheck.GracePeriodActive == 2) {
                                notifierService.notifySweetAlertMessageForRole('warning', 'Subscription Plan', "Retention period expired , kindly re-subscribe plan!", 'topic');
                                return false;
                            }

                        }
                        if (response.data.length > 0) {

                            $scope.importFormSettings = response.data[0];
                            console.log($scope.importFormSettings);

                            $scope.importFormSettings.formName = $scope.importFormSettings.title;

                            if (angular.isDefined($scope.importFormSettings.formType))
                                $scope.importFormSettings.formType = $scope.importFormSettings.formType.toString();
                            if (angular.isDefined($scope.importFormSettings.groupID))
                                $scope.importFormSettings.groupID = $scope.importFormSettings.groupID.toString();
                            if (angular.isDefined($scope.importFormSettings.status))
                                $scope.importFormSettings.status = $scope.importFormSettings.status.toString();
                            if (!DataService.isEmpty($scope.importFormSettings.xlsxFileName))
                                $scope.getWorkSheetList($scope.importFormSettings.xlsFile);
                            else {

                            }
                            var formData = JSON.parse($scope.importFormSettings.fields);
                            var formDataTemp = [];
                            $timeout(function () {
                                _.each(formData, function (pagesData, key) {
                                    if (!Array.isArray(pagesData))
                                        formData[key] = JSON.parse(pagesData);
                                    _.each(formData[key], function (item) {
                                        //if (angular.isDefined(item.values)) {
                                        //    if (!Array.isArray(item.values) && item.values.length > 0){
                                        //        item.values = JSON.parse(item.values);
                                        //        item.values = JSON.parse(item.values);
                                        //        }
                                        //    if (!Array.isArray(item.values) && item.values.length > 0)
                                        //        item.values = JSON.parse(item.values);

                                        //}
                                        item.page = key;
                                        formDataTemp.push(item);
                                    });
                                });
                                console.log(formData);
                                console.log(formDataTemp);
                                formDataTemp = $filter('orderBy')(formDataTemp, 'page', false);
                                exampleTabulator.setData(formDataTemp);
                            }, 150);



                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };

        $scope.init();

        $scope.getData = function () {
            $ngBootbox.confirm('Are you sure you want to save these changes?')
                .then(function () {
                    //  console.log('Confirmed!' + $scope.applicationId);
                    var dataForm = exampleTabulator.getData(true);
                    //$rootScope.$emit("ShowLoading");
                    dataForm = _.groupBy(dataForm, "page");
                    dataForm = JSON.stringify(dataForm);
                    var param = {};
                    param = $scope.importFormSettings;
                    param.fields = dataForm;
                    param.html = dataForm;
                    param.action = 2;
                    param.created_by = $scope.userDetail.Id;
                    param.updated_by = $scope.userDetail.Id;
                    //console.log(JSON.stringify( dataForm))
                    mainService.manageForm("ManageForm", param)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                if (response.data.length > 0) {
                                    notifierService.notifyMessage('success', 'Form Setting', response.data[0].Message);
                                }
                            }
                            $rootScope.$emit("HideLoading");
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }, function () {
                    console.log('Confirm dismissed!');
                });
        }

        $scope.removeFields = function (val) {
            var dat = exampleTabulator.getColumns();
            $.each(dat, function (i, s) {
                if ($.inArray(s.getField().trim(), ["name", "type", "page", "label"]) < 0) {
                    exampleTabulator.deleteColumn(s.getField());
                }
            })
            if (typeof val !== "undefined") {
                $('a#create_custom').addClass('disabled');
                $('a.updateForm').addClass('hidden');
                attributesTabulator.deselectRow()
            }
        }


    });
}(FormGeneratorApp));