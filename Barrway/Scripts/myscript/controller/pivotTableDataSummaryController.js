(function () {
    'use strict';

    FormGeneratorApp.controller('pivotTableDataSummaryController', function ($scope, $rootScope, $http, $state, $timeout, $location, $window, DataService, notifierService, mainService, $ngBootbox, $stateParams) {

        $scope.init = function () {
            $ngBootbox.hideAll();
            $scope.userDetail = mainService.loginDetails();
            $scope.currentFormId = $stateParams.formId;
            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            $scope.loadPivatTable();
            $scope.formSummaryParam = {};
            $scope.currentconfig_id = 0;
            $scope.formSummaryConfigList = [];
            $scope.expandFieldList = [];
            $scope.expandFieldListTable = [];
            $scope.expandFieldListTableList = [];
            $scope.configExpandBy = {};
            $scope.configExpandBy.tableField = "0";
            $scope.configExpandBy.columnField = "0";
            $scope.expandFieldListTableListControls = {};
            $scope.langId = "1";
            if (localStorage.getItem("globalLang") != null) {
                $scope.langId = localStorage.getItem("globalLang");
            }
        };


        $scope.loadPivatTable = function () {
            //showLoader("#output");
            /* $rootScope.$emit("ShowLoading");*/
            var param = {};
            param.action = 1;
            param.UserId = $scope.userDetail.Id;
            param.formId = $scope.currentFormId;
             
            mainService.getFormSummary("getFormSummary", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                         
                        if (response.data.UserId > 0) {
                            $scope.formSummaryDetails = response.data;
                            $scope.formDetailsDataInfo = $scope.formSummaryDetails.formDetails;
                            if ($scope.formDetailsDataInfo.res == 5001) {
                                notifierService.notifyMessage('warning', 'Form Access Rights', $scope.formDetailsDataInfo.Message);
                                return false;
                            }
                            if ($scope.formDetailsDataInfo.res > 0) {

                                var tempFieldsData = angular.copy(response.data.formFieldsList);


                                var expandFieldList = _.filter(tempFieldsData, function (item) {
                                    var fieldTemp = JSON.parse(item.fieldValidationRule);
                                    if (!DataService.isEmpty(fieldTemp.multiple) && fieldTemp.multiple == true && item.fieldType)
                                        return item.fieldType == "select";
                                    else
                                        return item.fieldType == "checkbox-group";
                                });
                                $scope.expandFieldList = angular.copy(expandFieldList);
                                _.each($scope.expandFieldList, function (item) {
                                    var translateLabel = getStringFromMultiligualText(item.fieldLabel, $scope.langId);
                                    translateLabel = translateLabel.replace(/[&]nbsp[;]/gi, " ");
                                    item.fieldLabel = translateLabel;
                                });


                                var result = _.filter(tempFieldsData, function (item) {
                                    return item.fieldType != "file" && item.fieldType != "paragraph" && item.fieldType != "table" && item.fieldSubtype != "last position"
                                        && item.fieldSubtype != "current position" && item.fieldTypes != "waiting_records";
                                });

                                $scope.expandFieldListTable = _.filter(tempFieldsData, function (item) {
                                    return item.fieldType == "table";
                                });

                                _.each($scope.expandFieldListTable, function (item) {
                                     
                                    var translateLabel = getStringFromMultiligualText(item.fieldLabel, $scope.langId);
                                    translateLabel = translateLabel.replace(/[&]nbsp[;]/gi, " ");
                                    item.fieldLabel = translateLabel;
                                });
                                if ($scope.expandFieldListTable.length > 0) {
                                    var tableControlList = [];
                                    _.map($scope.expandFieldListTable, function (item, key) {
                                         

                                        item.fieldValidationRuleJson = JSON.parse(item.fieldValidationRule);
                                        var tableHeads = '', multipleHeads, headArray = [];
                                        if (item.fieldValidationRuleJson.columnHeadings && item.fieldValidationRuleJson.columnHeadings.trim() !== '') {
                                            var headings = item.fieldValidationRuleJson.columnHeadings.trim();
                                            headArray = headings.split('|');
                                        } else {
                                            headArray = [];
                                        }
                                        multipleHeads = checkForMultipleHeaders(headArray);
                                        var columnRows = (multipleHeads > 0) ? 2 : 1;
                                        var resultstring, tableColumns = (multipleHeads > 0) ? 0 : parseInt(item.fieldValidationRuleJson.columns);
                                        var numRows = parseInt(item.fieldValidationRuleJson.rows);
                                        for (var i = 0; i < numRows; i++) {
                                            for (var j = 0; j < tableColumns; j++) {
                                                var dat = $scope.getControlFromTable(item.fieldValidationRuleJson.columnInputs, j + 1, i + 1, item.fieldValidationRuleJson.name, headArray[j]);
                                                if (!DataService.isEmpty(dat.list)) {
                                                    item.label = getStringFromMultiligualText(dat.label, $scope.langId);
                                                    item.columnField = dat.name;
                                                }
                                                tableControlList.push(dat);
                                            }
                                        }
                                        item.tableFieldList = tableControlList;
                                    });

                                }
                                $scope.tempFieldsData = result;
                                bindPivotWithData();

                                //$scope.loadcusPivatTable();
                            } else {
                                notifierService.notifyMessage('warning', 'Form Summary', $scope.formDetailsDataInfo.Message);

                                $state.go("Home", { reload: true, inherit: false });
                            }
                            $rootScope.$emit("HideLoading");

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        function filterReadableTableData(temp, name) {
            var data = temp;;
            var properties = data.split(';');
            var obj = {};
            var objList = [];
            var columnName = "";;
            properties.forEach(function (property, index) {
                property = property.replace(/{/g, '').replace(/}/g, '');
                var tup = property.split(':');
                if (tup.length == 3) {
                    columnName = tup[0].trim();
                    var prm = name + '[' + tup[0].trim() + ']' + '[' + tup[1].trim() + ']';
                    obj[prm] = tup[2];
                    objList.push(obj)
                }
                else if (tup.length == 2 && index > 0) {
                    var prm = name + '[' + columnName.trim() + ']' + '[' + tup[0].trim() + ']';
                    obj[prm] = tup[1];
                    objList.push(obj)
                }
            });
            return objList.length > 0 ? objList[0] : [];
        };


        function bindPivotWithData() {

            var tempData = [];
            if (!DataService.isEmpty($scope.formSummaryDetails)) {
                if (!DataService.isEmpty($scope.formSummaryDetails.formDataListNew)) {
                    if ($scope.formSummaryDetails.formDataListNew.length > 0) {
                        angular.forEach($scope.formSummaryDetails.formDataListNew, function (item, key) {
                            var list = [];
                            var listParam = {};
                            var configExpandByList = {};
                            var configExpandByListField = {};
                            var parseJsonData = {};
                            angular.forEach(item, function (itemData, keyData) {

                                var exists = _.findWhere($scope.tempFieldsData, { fieldName: keyData });
                                var existsTable = _.findWhere($scope.expandFieldListTable, { fieldName: keyData });
                                if (!DataService.isEmpty(exists)) {
                                    var translateLabel = getStringFromMultiligualText(exists.fieldName, $scope.langId);
                                    if (!DataService.isEmpty($scope.configExpandBy.expandColumn)) {
                                        if (exists.fieldName == $scope.configExpandBy.expandColumn) {
                                            configExpandByList[key] = [];
                                            if (!DataService.isEmpty(itemData))
                                                if (itemData.contains(',')) {
                                                    var splitData = itemData.split(',');

                                                    angular.forEach(splitData, function (t) {
                                                        configExpandByList[key].push(t)
                                                    });
                                                } else {
                                                    configExpandByList[key].push(itemData)
                                                }
                                            configExpandByListField[key] = translateLabel;
                                        }
                                        else {
                                            listParam[translateLabel] = itemData;
                                        }
                                    }
                                    else {
                                        listParam[translateLabel] = itemData;
                                    }
                                }
                                else if (!DataService.isEmpty(existsTable)) {
                                    if (existsTable.fieldName == $scope.configExpandBy.tableField) {
                                        var tableData = itemData.replace(/'/g, " ");
                                        tableData = tableData.replace(/"/g, " ");
                                        var temp = filterReadableTableData(tableData, existsTable.fieldName);
                                        parseJsonData = temp;
                                    }
                                }
                            });
                            item.parseJsonData = parseJsonData;
                            if (!DataService.isEmpty(configExpandByList)) {
                                if (!DataService.isEmpty(configExpandByList[key]) && configExpandByList[key].length > 0) {
                                    angular.forEach(configExpandByList[key], function (listitem) {
                                        var temp = angular.copy(listParam);
                                        temp[configExpandByListField[key]] = listitem;
                                        list.push(temp)
                                    });
                                } else
                                    list.push(listParam);
                            } else {
                                list.push(listParam);
                            }
                            item.list = list;
                            if (list.length > 0) {
                                _.each(list, function (newli) {
                                    tempData.push(newli);
                                });
                            }
                        });
                    }
                    else {
                        var listParam = {};
                        angular.forEach($scope.tempFieldsData, function (itemData, keyData) {
                            var translateLabel = getStringFromMultiligualText(itemData.fieldLabel, $scope.langId);
                            translateLabel = translateLabel != null ? translateLabel.replace(/[&]nbsp[;]/gi, " ") : null;
                            listParam[translateLabel] = "";
                        });
                        tempData.push(listParam);
                    }
                }
                else {
                    var listParam = {};
                    angular.forEach($scope.tempFieldsData, function (itemData, keyData) {
                        var translateLabel = getStringFromMultiligualText(itemData.fieldLabel, $scope.langId);
                        translateLabel = translateLabel != null ? translateLabel.replace(/[&]nbsp[;]/gi, " ") : null;
                        listParam[translateLabel] = "";
                    });
                    tempData.push(listParam);

                }

                $scope.defaultFields = tempData;

                $timeout(function () {
                    BindDataInPivotTable(tempData);
                }, 500);



                $rootScope.$emit("HideLoading");

            }

        };


        //bind pivot tabledata function
        function BindDataInPivotTable(data) {
             

            var derivers = $.pivotUtilities.derivers;

            var renderers = $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.c3_renderers,
                $.pivotUtilities.d3_renderers,
                $.pivotUtilities.export_renderers
            );

            if ($.cookie("pivotConfig") != null && $.cookie("pivotConfig") != undefined) {
                $("#output").pivotUI(data, JSON.parse($.cookie("pivotConfig")), true);
            }
            else {
                $("#output").pivotUI(data, {
                    renderers: renderers,
                    //derivedAttributes: {"Age Bin": derivers.bin("Age", 10),"Gender Imbalance": function (mp) {return mp["Gender"] == "Male" ? 1 : -1;}
                    //},
                    //cols: ["Age Bin"], rows: ["Gender"],

                    //cols: ["Age"],
                    //rows: ["Gender"],
                    rendererName: "Table"
                });

            }


            

            //$("#save").on("click", function () {
            //    var config = $("#output").data("pivotUIOptions");
            //    var config_copy = JSON.parse(JSON.stringify(config));
            //    //delete some values which will not serialize to JSON
            //    delete config_copy["aggregators"];
            //    delete config_copy["renderers"];
            //    $.cookie("pivotConfig", JSON.stringify(config_copy));
            //});

            //$("#restore").on("click", function () {
            //    $("#output").pivotUI(data, JSON.parse($.cookie("pivotConfig")), true);
            //});

        }

        // Expand checkboxes of the form
        //$('#expandForm').on('submit', function (event) {
        //    event.preventDefault();

        //    showLoader("#output");
        //    $.post($(this).attr('action'), $(this).serializeArray(), function (response) {
        //        initPivot(response);
        //        $("#output").unblock();
        //    });
        //});
        //// Show table data of the form
        //$('#tableExpansion').on('submit', function (event) {
        //    event.preventDefault();

        //    showLoader("#output");
        //    $.post($(this).attr('action'), $(this).serializeArray(), function (response) {
        //        initPivot(response);
        //        $("#output").unblock();
        //    });
        //});

        $("#saveconfiguration").on("click", function () {
            var config = $("#output").data("pivotUIOptions");
            var config_copy = JSON.parse(JSON.stringify(config));
            //delete some values which will not serialize to JSON
            delete config_copy["aggregators"];
            delete config_copy["renderers"];
            $.cookie("pivotConfig", JSON.stringify(config_copy));
        });

        //$("#restore").on("click", function () {

        //    var data = $scope.defaultFields;

        //    $("#output").pivotUI(data, JSON.parse($.cookie("pivotConfig")), true);
        //});


        // Create new configuration
        $(document).on("click", "#create-config", function () {
             
            $scope.currentconfig_id = 0;
            $scope.formSummaryParam = {};
            $scope.configExpandBy.expandColumn = "0";
            $scope.configExpandBy.tableField = "0";
            $scope.configExpandBy.columnField = "0";
            $scope.selectedFormSummaryParam = {};
            //bindPivotWithData();
            showLoader("#output");
            $timeout(function () {
                $("#pivotResult").empty();
                loadPivotKanban($scope.defaultFields);
                $scope.currentconfig_id = 0;
                tableConfigTabulator.deselectRow();
            }, 750);
            // Show default configuration
            $('#expandForm, #tableExpansion').trigger('reset');

        });
        // Open modal to save the configuration
        $(document).on("click", "#save-config-as", function () {
            $scope.formSummaryParam = {};
            var pivotConfigSettings = $$($scope.pivotID).getStructure();
            console.log(JSON.stringify(pivotConfigSettings))

            if (pivotConfigSettings.rows.length == 0) {
                alert("Create a valid table configuration.");
            }
            else {

                $scope.formSummaryParam.pivotConfigSettings = JSON.stringify(pivotConfigSettings);
                $scope.formSummaryParam.configExpandBy = JSON.stringify($scope.configExpandBy);
                $("#createConfigModal").modal("show");
            }
            $("#pageActionModal").modal('hide');
        });
        // Save currently working configuration changes
        $(document).on("click", ".save-config", function () {
            showLoader("#output");

            var pivotConfigSettings = $$($scope.pivotID).getStructure();
            var config_copy = JSON.parse(JSON.stringify(config));
            //delete some values which will not serialize to JSON
            delete config_copy["aggregators"];
            delete config_copy["renderers"];


            if (pivotConfigSettings.rows.length == 0) {
                alert("Create a valid pivot table configuration.");

                return;
            } else {
                var expandedBY = '';
                if ($('#expandForm').length) {
                    // Expand Form exists
                    var expandColumn = $('[name=expandColumn]').val(),
                        expandColumnName = $('[name=expandColumn] option:selected').text().trim();

                    expandedBY = JSON.stringify({ expandColumn: expandColumn, expandColumnName: expandColumnName });
                }
                if ($('#tableExpansion').length) {
                    // Expand Form exists
                    var tableField = $('[name=tableField]').val(),
                        tableFieldName = $('[name=tableField] option:selected').text().trim(),
                        expandColumn = $('[name=columnField]').val(),
                        expandColumnName = $('[name=columnField] option:selected').text().trim();

                    expandedBY = JSON.stringify({ tableField: tableField, tableFieldName: tableFieldName, expandColumn: expandColumn, expandColumnName: expandColumnName });
                }

                var param = {};
                if ($scope.configExpandBy.expandColumn != "0") {
                    $scope.selectedFormSummaryParam.configExpandBy = JSON.stringify($scope.configExpandBy);
                } else {
                    $scope.selectedFormSummaryParam.configExpandBy = "";
                }
                $scope.selectedFormSummaryParam.pivotConfigSettings = JSON.stringify(pivotConfigSettings);
                param.pivotConfigSettings = $scope.selectedFormSummaryParam.pivotConfigSettings;
                param = $scope.selectedFormSummaryParam;
                param.action = 2;
                param.formId = $scope.currentFormId;
                param.topicId = $scope.formSummaryDetails.topicId;


            }

        });
        // Delete any configuration
        $(document).on("click", ".delete-config", function () {
            var config_id = $(this).attr("data-config-id"), config_name = $(this).attr("data-config-name"), $button = $(this);

            swal({
                title: "Are you sure to delete " + config_name + "?",
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                    showLoader("#output");

                    var param = {};
                    param.action = 3;
                    param.Id = config_id;

                    $scope.configExpandBy.expandColumn = "0";
                    $scope.configExpandBy.tableField = "0";
                    $scope.configExpandBy.columnField = "0";


                }
            });
        });
        $scope.getControlFromTable = function (data, index, row, name, label) {
             
            var fieldList = {}
            fieldList.label = label;
            var params = deparam(data);
            var fieldType = params['column-' + index + '[inputType]'] ? params['column-' + index + '[inputType]'] : '';
            var attributeType = "";
            attributeType = params['column-' + index + '[' + fieldType + '][type]'] ? params['column-' + index + '[' + fieldType + '][type]'] : ''
            var validationId = name + "[column-" + index + "][row-" + row + "]";
            var field = '';
            switch (fieldType) {
                case 'text':
                    var step = params['column-' + index + '[' + fieldType + '][step]'];
                    fieldList.type = fieldType;
                    fieldList.name = validationId;
                    break;

                case 'number':
                    var step = params['column-' + index + '[' + fieldType + '][step]'];
                    fieldList.type = fieldType;
                    fieldList.name = validationId;
                    break;

                case 'date':
                    fieldList.type = fieldType;
                    fieldList.name = validationId;
                    break;

                case 'checkbo':
                    var str = params['column-' + index + '[' + fieldType + '][option]'];
                    var list = [];
                    if (str.length > 0) {
                        var opt = extraDeparam(str);
                        if (opt !== undefined) {
                            var options = opt['column-' + index][fieldType]['option'];
                            if (options.length > 0) {
                                $(options).each(function (i, s) {
                                    var random_id = Math.floor(Math.random() * 90000) + 10000;
                                    var innerValue = s.replace(/\s/g, '_');
                                    list.push({ "name": s, "value": innerValue });

                                })
                            }
                        }
                    }
                    fieldList.type = fieldType;
                    fieldList.name = validationId;
                    fieldList.list = list;
                    break;

                case 'radiobo':
                    var str = params['column-' + index + '[' + fieldType + '][option]'];
                    var list = [];
                    if (str.length > 0) {
                        var opt = extraDeparam(str);
                        if (opt !== undefined) {
                            var options = opt['column-' + index][fieldType]['option'];
                            if (options.length > 0) {
                                $(options).each(function (i, s) {
                                    var random_id = Math.floor(Math.random() * 90000) + 10000;
                                    var innerValue = s.replace(/\s/g, '_');
                                    list.push({ "name": s, "value": innerValue });

                                })
                            }
                        }
                    }
                    fieldList.type = fieldType;
                    //fieldList.list = list;
                    fieldList.name = validationId;
                    break;

                case 'select':
                    var str = params['column-' + index + '[' + fieldType + '][option]'];
                    var list = [];
                    if (str.length > 0) {
                        var opt = extraDeparam(str);
                        if (opt !== undefined) {
                            var options = opt['column-' + index][fieldType]['option'];

                            $(options).each(function (i, s) {
                                if (options.length > 0) {
                                    var innerValue = s.replace(/\s/g, '_');
                                    list.push({ "name": s, "value": innerValue });

                                }
                            });
                        }
                    }
                    fieldList.type = fieldType;

                    fieldList.name = validationId;
                    break;

                default:
                    field = '&nbsp;';
                    break;
            }

            return fieldList;



        };

        $scope.uploaddownloadPopup = function () {
            var title = "";
            title = "Pivot table configuration"
            $scope.currentFormType = 0;
            var dialog = $ngBootbox.customDialog({
                templateUrl: 'uploaddownload.html',
                title: title,
                scope: $scope,
                size: "large"
                // buttons: $scope.customDialogButtons 
            });

            createmultiselect();
        };


        $scope.loadPivatTablewithconfig = function () {
             
            var columnsArr = $("#PivotColumns").val();
            var RowsArr = $("#Pivotrows").val();

            var data = $scope.defaultFields;
            if (data != null) {

                var C_columns = "";
                var C_Rows = "";
                if (columnsArr != null) {
                    C_columns = columnsArr.toString();
                }
                if (columnsArr != null) {
                    C_Rows = RowsArr.toString();
                }


                $("#output").empty();

                var derivers = $.pivotUtilities.derivers;

                var renderers = $.extend(
                    $.pivotUtilities.renderers,
                    $.pivotUtilities.c3_renderers,
                    $.pivotUtilities.d3_renderers,
                    $.pivotUtilities.export_renderers
                );


                $("#output").pivotUI(data, {
                    renderers: renderers,
                    //derivedAttributes: {"Age Bin": derivers.bin("Age", 10),"Gender Imbalance": function (mp) {return mp["Gender"] == "Male" ? 1 : -1;}
                    //},
                    //cols: ["Age Bin"], rows: ["Gender"],

                    cols: [C_columns],
                    rows: [C_Rows],
                    rendererName: "Table"
                });
            }

        }




        $scope.init();

        function createmultiselect() {
            $timeout(function () {
                $(".chosen-select").chosen();
            }, 100);

        }

    });

}(FormGeneratorApp));