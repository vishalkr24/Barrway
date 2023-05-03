(function () {
    'use strict';
    FormGeneratorApp.controller('ApplicationListController', function ($scope, $uibModal, CookiesPersistenceService, DataService, $ngBootbox, notifierService, $timeout, $rootScope, $http, $location, $window, $state, signalR, mainService, tabulatorConfiguratorSettings) {
        var status_value = 0, tabulator, tabulatorChildren = {};
        function cellFormatterBackgroundColor(cell) {
            $scope.cellFormatterBackgroundColorCustom(cell, $scope.tabulatorConfiguratorSettings);
            if (!DataService.isEmpty(cell.getValue()))
                return cell.getValue();
        }
        var formTypes = ['', 'Personal', 'Private', 'Public', 'Open'];//0,
        var formStatus = ['', 'Draft', 'Active', 'Inactive', 'Template'];
        //custom formatter definition
        var arrowIcon = function (cell, formatterParams) {
            //  return "<i class='glyphicon glyphicon-chevron-right'></i>";
            cellFormatterBackgroundColor(cell);
            return "<i class='fa fa-chevron-right'></i>";
        };
        //custom formatter definition
        var actionIcon = function (cell, formatterParams) {
            cellFormatterBackgroundColor(cell);
            if (formatterParams.type === 1)
                return '<img src="assets/images/settings.png" width="20">';
            else
                return '<i class="fa fa-cogs" aria-hidden="true"></i>';
        };
        var tabulator = $("input[name=tabulator]").val();
        var itemName = tabulator + 'Actions';
        var actionObj = JSON.parse(localStorage.getItem(itemName));
        var datetimeFormatter = function (cell) {
            cellFormatterBackgroundColor(cell);
            var _date = cell.getRow().getData().newcreated_at;
            var returnDate = "";
            if (_date == null || (typeof _date === 'undefined')) { returnDate = ''; }
            else {
                //returnDate = customDate(_date);
                returnDate = $rootScope.ToCustomDateTime(_date);
            }

            return returnDate;

        }
        var datetimeFormatterSub = function (cell) {
            cellFormatterBackgroundColor(cell);
            var _date = cell.getRow().getData().lastActivityDate;
            var returnDate = "";
            if (_date == null || (typeof _date === 'undefined')) { returnDate = ''; }
            else
                //  returnDate = customDate(_date);
                returnDate = $rootScope.ToCustomDateTime(_date);


            return returnDate;

        }
        //if (actionObj && actionObj['responsive']) {
        //    $(window).resize(function () {
        //        tabulator.redraw();
        //    });
        //}
        var printLink = function (cell, formatterParams, onRendered) { //plain text value
            cellFormatterBackgroundColor(cell);
            if ($scope.userDetail.Id == cell.getData().created_by)
                return "<a>" + cell.getRow().getData().applicationTitle + "</a>";
            else
                return "<span>" + cell.getRow().getData().applicationTitle + "</span>";
        };
        var formLink = function (cell, formatterParams, onRendered) { //plain text value
            cellFormatterBackgroundColor(cell);
            return "<a>" + cell.getRow().getData().title + "</a>";
        };
        $rootScope.$on("newTopic", function (event, data) {
            if (angular.isDefined(data)) {
                $scope.topicParam = {};
            }
        });
        /*Tabulator Configration Popup functions*/
        $scope.saveTabulatorLayout = function (type, isForm) {

            $scope.tabulatorLayoutId = type;
            dialog = $ngBootbox.customDialog({
                templateUrl: 'tabulatorConfigurationsModelPopup.html',
                scope: $scope,
                title: 'Tabulator Layout Configurations',
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
                            if ($scope.userDetail.Id == cell.getData().created_by) {
                                var applicationId = cell.getRow().getData().applicationId;
                                var applicationName = removeHtmlFromString(cell.getRow().getData().applicationTitle);
                                var applicationTag = removeHtmlFromString(cell.getRow().getData().applicationTag);
                                var applicationStatus = cell.getRow().getData().status;
                                var applicationCycle = cell.getRow().getData().cycle;
                                var applicationPrivacy = cell.getRow().getData().protected;
                                var applicationRole = typeof cell.getRow().getData().role != 'undefined' ? cell.getRow().getData().role : 3;
                                $scope.applicationData.created_by = cell.getData().created_by;
                                var prototypeActions = '';
                                var rowData = cell.getRow().getData();
                                var actionsPopup = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<form class="form-inline app-pdf-search mb-0" autocomplete="off">' +
                                    '<div class="input-group mb-10">' +
                                    '<input type="hidden" id="applicationId" class="form-control" value="' + applicationId + '">' +
                                    '<input type="text" id="keyword" class="form-control" placeholder="Search in pdfzxzx attachments...">' +
                                    '<span class="input-group-btn">' +
                                    '<button class="float-buttons wv-btn wv-second" type="submit"><i class="fa fa-search" aria-hidden="true"></i> Search</button>' +
                                    '</span>' +
                                    '</div>' +
                                    '<button type="button" onclick="groupBy(\'formTag\', ' + applicationId + ')" name="group-rows" class="float-buttons wv-btn wv-danger mb-10 formTag" style="vertical-align: top; "> <span class="show-rating"><i class="fa fa-object-group"></i> Group Forms by Tags</span> <span class="hide-rating"><i class="fa fa-object-ungroup"></i> Remove Group</span> </button>' +
                                    '<button type="button" class="float-buttons wv-btn wv-success btn-md mb-10" onClick="showAModal()"><i class="fa fa-plus"></i> Add Form</button>\n\
                                <a href="application/download/' + applicationId + '" class="float-buttons wv-btn wv-warning btn-md mb-10"><i class="fa fa-download"></i> Download attachments</a>';

                                if (applicationPrivacy == 'No') { actionsPopup += '<button type="button" class="float-buttons wv-btn wv-first btn-md mb-10" onClick="getFunction(\'getAppTopic', ' + applicationId + ', 'copy-application\')"><i class="fa fa-clone"></i> Copy Folder</button>'; }
                                if (applicationRole == 3) {
                                    actionsPopup += '<button type="button" class="float-buttons wv-btn wv-second btn-md mb-10" onClick="getFunction(application/roles', ' + applicationId + ', 'app-roles\')"><i class="fa fa-users"></i> Folder Roles</button>' +
                                        '<button type="button" class="float-buttons wv-btn wv-danger btn-md mb-10" onclick="getFunction(application/delete', ' + applicationId + ', 'delete-app\')"><i class="fa fa-trash"></i> Delete Folder</button>';
                                }
                                actionsPopup += prototypeActions + '</form>' +
                                    '</div></div></div></div>';
                                $scope.applicationData.applicationTitle = applicationName;
                                $scope.applicationData.applicationId = applicationId;
                                $scope.applicationData.applicationTag = applicationTag;
                                $scope.applicationCopyTemp = {};
                                $scope.applicationCopyTemp = rowData;
                                $scope.applicationId = applicationId;
                                $scope.currentFormType = (!DataService.isEmpty(rowData.currentFormType)) ? rowData.currentFormType : 0;
                                dialog = $ngBootbox.customDialog({
                                    templateUrl: 'applicationActions.html',
                                    scope: $scope,
                                    title: $scope.applicationData.applicationTitle + " - Actions",
                                    size: 'large'
                                });
                                var exists = _.findIndex($scope.groupBySetList, { applicationId: $scope.applicationId });
                                if (exists != -1)
                                    $scope.isGroupByFormTag = true;
                                else
                                    $scope.isGroupByFormTag = false;
                                $timeout(function () {
                                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();
                                }, 250);
                                var tabulatorGroup = $.cookie("application-" + applicationId);
                                tabulatorChildren[applicationId].setGroupBy(tabulatorGroup);
                                if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                                    $(".bootbox form.app-pdf-search button.formTag").addClass("col-hide");
                                    tabulatorChildren[applicationId].setSort(tabulatorGroup, "asc");
                                } else {
                                    $(".bootbox form.app-pdf-search button.formTag").removeClass("col-hide");
                                }
                            }
                        }
                    }
                    else if (item.field == "subItems") {
                        item.formatter = arrowIcon;
                        item.cellClick = function (e, cell) {
                            $scope.expendedapplicationData = cell.getData();
                            var applicationId = cell.getRow().getData().applicationId;
                            if ($(cell.getElement()).is('.active')) {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                                $(cell.getElement()).removeClass('active');
                            } else {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                                $(cell.getElement()).addClass('active');

                                var table = tabulatorChildren[applicationId];
                                table.setData([]);
                                //if (cell.getRow().getData().otherApp) {
                                //    table.setData("{{ url('otherAppRecords') }}/" + applicationId);
                                //} else {
                                //    table.setData("{{ url('appRecords') }}/" + applicationId);
                                //}
                                var paramForms = {};
                                paramForms.action = 1;
                                paramForms.applicationId = applicationId;
                                mainService.getFormList("GetFormList", paramForms)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            if (response.data.length > 0) {
                                                table.setData(response.data);
                                            }

                                        }
                                    }, function (err) {
                                        console.log("some error occured." + err);
                                    });
                            }

                            var tabulatorGroup = $.cookie("application-" + applicationId);
                            if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                                tabulatorChildren[applicationId].setGroupBy(tabulatorGroup);
                                tabulatorChildren[applicationId].setSort(tabulatorGroup, "asc");
                            }
                        }
                    }
                    else if (item.field == "applicationTitle") {
                        item.formatter = printLink;
                        item.cellClick = function (e, cell) {
                            if ($scope.userDetail.Id == cell.getData().created_by) {
                                var applicationId = cell.getRow().getData().applicationId;
                                // window.location.href = "application/edit/" + applicationId;
                                $state.go('editApplication', { appId: applicationId });
                            }
                            else {

                            }
                        }
                    }
                    else if (item.field == "newcreated_at") {
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
                $scope.tabulatorHeaders = [
                    {
                        title: "Actions", field: "parentActions", formatter: actionIcon, formatterParams: { type: 1 }, width: 70, frozen: true, headerSort: false, align: "center", cellClick: function (e, cell) {
                            if ($scope.userDetail.Id == cell.getData().created_by) {
                                var applicationId = cell.getRow().getData().applicationId;
                                var applicationName = removeHtmlFromString(cell.getRow().getData().applicationTitle);
                                var applicationTag = removeHtmlFromString(cell.getRow().getData().applicationTag);
                                var applicationStatus = cell.getRow().getData().status;
                                var applicationCycle = cell.getRow().getData().cycle;
                                var applicationPrivacy = cell.getRow().getData().protected;
                                var applicationRole = typeof cell.getRow().getData().role != 'undefined' ? cell.getRow().getData().role : 3;
                                $scope.applicationData.created_by = cell.getData().created_by;
                                var prototypeActions = '';
                                var rowData = cell.getRow().getData();
                                var actionsPopup = '<div class="card-blue">' +
                                    '<div class="row">' +
                                    '<div class="col-sm-12">' +
                                    '<form class="form-inline app-pdf-search mb-0" autocomplete="off">' +
                                    '<div class="input-group mb-10">' +
                                    '<input type="hidden" id="applicationId" class="form-control" value="' + applicationId + '">' +
                                    '<input type="text" id="keyword" class="form-control" placeholder="Search in pdf attachments...">' +
                                    '<span class="input-group-btn">' +
                                    '<button class="float-buttons wv-btn wv-second" type="submit"><i class="fa fa-search" aria-hidden="true"></i> Search</button>' +
                                    '</span>' +
                                    '</div>' +
                                    '<button type="button" onclick="groupBy(\'formTag\', ' + applicationId + ')" name="group-rows" class="float-buttons wv-btn wv-danger mb-10 formTag" style="vertical-align: top; "> <span class="show-rating"><i class="fa fa-object-group"></i> Group Forms by Tags</span> <span class="hide-rating"><i class="fa fa-object-ungroup"></i> Remove Group</span> </button>' +
                                    '<button type="button" class="float-buttons wv-btn wv-success btn-md mb-10" onClick="showAModal()"><i class="fa fa-plus"></i> Add Form</button>\n\
                                <a href="application/download/' + applicationId + '" class="float-buttons wv-btn wv-warning btn-md mb-10"><i class="fa fa-download"></i> Download attachments</a>';

                                if (applicationPrivacy == 'No') { actionsPopup += '<button type="button" class="float-buttons wv-btn wv-first btn-md mb-10" onClick="getFunction(\'getAppTopic', ' + applicationId + ', 'copy-application\')"><i class="fa fa-clone"></i> Copy Folder</button>'; }
                                if (applicationRole == 3) {
                                    actionsPopup += '<button type="button" class="float-buttons wv-btn wv-second btn-md mb-10" onClick="getFunction(application/roles', ' + applicationId + ', 'app-roles\')"><i class="fa fa-users"></i> Folder Roles</button>' +
                                        '<button type="button" class="float-buttons wv-btn wv-danger btn-md mb-10" onclick="getFunction(application/delete', ' + applicationId + ', 'delete-app\')"><i class="fa fa-trash"></i> Delete Folder</button>';
                                }
                                actionsPopup += prototypeActions + '</form>' +
                                    '</div></div></div></div>';
                                $scope.applicationData.applicationTitle = applicationName;
                                $scope.applicationData.applicationId = applicationId;
                                $scope.applicationData.applicationTag = applicationTag;
                                $scope.applicationCopyTemp = {};
                                $scope.applicationCopyTemp = rowData;
                                $scope.applicationId = applicationId;
                                $scope.currentFormType = (!DataService.isEmpty(rowData.currentFormType)) ? rowData.currentFormType : 0;
                                dialog = $ngBootbox.customDialog({
                                    templateUrl: 'applicationActions.html',
                                    scope: $scope,
                                    title: $scope.applicationData.applicationTitle + " - Actions",
                                    size: 'large'
                                });
                                var exists = _.findIndex($scope.groupBySetList, { applicationId: $scope.applicationId });
                                if (exists != -1)
                                    $scope.isGroupByFormTag = true;
                                else
                                    $scope.isGroupByFormTag = false;
                                $timeout(function () {
                                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();
                                }, 250);
                                var tabulatorGroup = $.cookie("application-" + applicationId);
                                tabulatorChildren[applicationId].setGroupBy(tabulatorGroup);
                                if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                                    $(".bootbox form.app-pdf-search button.formTag").addClass("col-hide");
                                    tabulatorChildren[applicationId].setSort(tabulatorGroup, "asc");
                                } else {
                                    $(".bootbox form.app-pdf-search button.formTag").removeClass("col-hide");
                                }
                            }
                        }
                    },
                    { title: "Move Row", field: "rowHandle", rowHandle: true, formatter: "handle", headerSort: false, width: 70 },
                    {
                        title: "Expand Row", field: "subItems", formatter: arrowIcon, width: 35, headerSort: false, align: "center",
                        cellClick: function (e, cell) {
                            $scope.expendedapplicationData = cell.getData();
                            var applicationId = cell.getRow().getData().applicationId;
                            if ($(cell.getElement()).is('.active')) {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                                $(cell.getElement()).removeClass('active');
                            } else {
                                $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                                $(cell.getElement()).addClass('active');

                                var table = tabulatorChildren[applicationId];
                                table.setData([]);
                                //if (cell.getRow().getData().otherApp) {
                                //    table.setData("{{ url('otherAppRecords') }}/" + applicationId);
                                //} else {
                                //    table.setData("{{ url('appRecords') }}/" + applicationId);
                                //}
                                var paramForms = {};
                                paramForms.action = 1;
                                paramForms.applicationId = applicationId;
                                mainService.getFormList("GetFormList", paramForms)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            if (response.data.length > 0) {
                                                table.setData(response.data);
                                            }

                                        }
                                    }, function (err) {
                                        console.log("some error occured." + err);
                                    });
                            }

                            var tabulatorGroup = $.cookie("application-" + applicationId);
                            if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                                tabulatorChildren[applicationId].setGroupBy(tabulatorGroup);
                                tabulatorChildren[applicationId].setSort(tabulatorGroup, "asc");
                            }
                        }
                    },
                    { title: "Folder Id", field: "applicationId", visible: false },
                    {
                        title: "Folder Title", field: "applicationTitle", headerFilterPlaceholder: " ", formatter: printLink, align: "left", headerFilter: true,
                        cellClick: function (e, cell) {
                            if ($scope.userDetail.Id == cell.getData().created_by) {
                                var applicationId = cell.getRow().getData().applicationId;
                                // window.location.href = "application/edit/" + applicationId;
                                $state.go('editApplication', { appId: applicationId });
                            }
                            else {

                            }
                        }
                    },
                    { title: "Folder Tag", editor: "textarea", field: "applicationTag", formatter: cellFormatterBackgroundColor, align: "left", headerFilter: "input", headerFilterPlaceholder: " " },
                    { title: "Public Template", field: "publicTemplateText", formatter: cellFormatterBackgroundColor, editor: "select", editorParams: { values: ['Yes', 'No'] }, headerFilter: "select", headerFilterParams: { values: ['', 'Yes', 'No'] } },
                    { title: "Status", field: "StatusName", editor: "select", formatter: cellFormatterBackgroundColor, editorParams: { values: ['Draft', 'Active', 'Inactive', 'Template'] }, headerFilter: "select", headerFilterParams: { values: formStatus } },
                    { title: "Created At", field: "newcreated_at", headerFilter: true, headerFilterPlaceholder: " ", formatter: datetimeFormatter, sorter: "datetime", sorterParams: { format: "YYYY/MM/DD HH:mm", alignEmptyValues: "bottom" }, alignEmptyValues: "bottom" }
                ];
            }
            if (type == 0) {
                if (localStorage.getItem("appl_list")) {
                    $scope.tabulatorConfig.groupBy = localStorage.getItem("appl_list");
                }
                if (!DataService.isEmpty($scope.tabulatorConfiguratorSettings.groupBy))
                    $scope.tabulatorConfig.groupBy = $scope.tabulatorConfiguratorSettings.groupBy;
                _.each($scope.tabulatorHeaders, function (item) {
                    if (item.field != "rowHandle" && item.field != "subItems" && item.field != "parentActions" && item.visible != false) {
                        $scope.filterFieldsList.push(item);
                    }
                });
            } else {

            }

            $timeout(function () {
                if ($("#application-table").length)
                    tabulator = initTabulator('application-table', {
                        groupBy: $scope.tabulatorConfig.groupBy != "" ? $scope.tabulatorConfig.groupBy : null,
                        placeholder: "No application.",
                        height: "511px",
                        layout: "fitDataFill",
                        selectable: true,
                        movableRows: true,
                        responsiveLayout: (actionObj ? actionObj['responsive'] : false),
                        persistenceID: "application",
                        persistentLayout: true,
                        persistenceMode: true,
                        persistence: {
                            sort: true, //persist column sorting
                            filter: true, //persist filter sorting
                            columns: true, //persist columns
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
                            { column: "applicationId", dir: "asc" }
                        ],
                        //index:"applicationId",
                        //Define Table Columns
                        columns: $scope.tabulatorHeaders,
                        cellEdited: function (cell) {
                            //This callback is called any time a cell is edited
                            var input = []; var json = {}; var columnName = cell.getColumn().getField();
                            json[columnName] = (columnName === "status" ? formStatus.indexOf(cell.getValue()) : cell.getValue());
                            input['url'] = "{{url('update_custom')}}";
                            input['data'] = { 'table': 'application', 'update': json, 'where': { applicationId: cell.getRow().getData().applicationId } };

                            if (input['data'].update[columnName]) {
                                // ajax_call(input);
                                var param = {};
                                param = cell.getRow().getData();
                                param.publicTemplate = param.publicTemplateText == "No" ? "No" : "Yes";
                                param.status = changeStatusName(param.StatusName);
                                $scope.onUpdateApplication(param);
                            }
                            else {
                                cell.restoreOldValue();
                            }
                        },
                        rowMoved: function (row) {
                            //row - row component
                            var tabulatorData = tabulator.getData();

                            var recordIDs = [];
                            tabulatorData.forEach(function (row) {
                                recordIDs.push(row.applicationId);
                            });
                            var rowIndex = row.getPosition();
                            rowIndex += 1;
                            var appid = row.getData().applicationId;
                            var param = {};
                            param.action = 3;
                            param.rowOrder = rowIndex;
                            param.applicationId = appid;
                            param.created_by = $scope.userDetail.Id;
                            $.ajax({
                                type: "POST",
                                url: $scope.currentUrl + "/ManageApplication",
                                data: param,
                                beforeSend: function () {
                                    // showLoader("#application-table");
                                    //console.log("its Moving");
                                },
                                complete: function () {
                                    //console.log("its Moved");
                                    // $("#application-table").unblock();
                                }
                            });
                        },
                        rowFormatter: function (row) {
                            var applicationId = row.getData().applicationId;
                            //define a table layout structure and set width of row
                            var table = $("<table>", { 'class': 'table table-bordered', 'id': 'application-' + applicationId });
                            //append newly formatted contents to the row
                            $(row.getElement()).append($('<div>', { 'class': 'table-wrapper', "style": "padding-left: 3%" }).append(table));

                            $timeout(function () {
                                ////console.log($("#application-" + applicationId))
                                if ($("#application-" + applicationId).length) {
                                    var childTabulator = initTabulator("application-" + applicationId, {
                                        height: '50%',
                                        pagination: "remote", //enable remote pagination
                                        layout: "fitDataFill",
                                        placeholder: "No form in this application...",
                                        //selectable:1,
                                        tooltips: true,
                                        tooltipsHeader: true,
                                        responsiveLayout: true,
                                        persistentLayout: true,
                                        persistenceID: "E2" + applicationId,
                                        persistence: {
                                            sort: true, //persist column sorting
                                            filter: true, //persist filter sorting
                                            columns: true, //persist columns
                                        },
                                        groupStartOpen: false,
                                        groupToggleElement: "header",
                                        pagination: "local",
                                        paginationSize: 10,
                                        columns: [ //set column definitions for imported table data
                                            {
                                                title: "Actions", field: "childActions", formatter: actionIcon, formatterParams: { type: 2 }, width: 70, headerSort: false, align: "center", cellClick: function (e, cell) {
                                                    if ($scope.userDetail.Id == $scope.expendedapplicationData.created_by) {
                                                        var rowData = cell.getRow().getData();
                                                        var topicId = rowData.topicId;
                                                        var formId = rowData.formId;
                                                        var appRole = typeof rowData.appRole != 'undefined' ? rowData.appRole : 3;

                                                        var formName = removeHtmlFromString(rowData.title),
                                                            topicName = rowData.topicTitle,
                                                            isAccessible = rowData.isAccessible;


                                                        var formEditUrl = "#/form/edit/" + formId;
                                                        var formDeleteUrl = "{{ url('subforms/delete') }}/" + formId;
                                                        var formFilterUrl = "{{ url('subforms/filter-criteria') }}/" + formId;
                                                        var formRoleUrl = "{{ url('user-forms/roles') }}/" + formId;

                                                        var formSummaryUrl = "{{ url('summary') }}/" + formId;
                                                        var formClearUrl = "{{ url('clear_records') }}/" + formId;
                                                        var formEntryUrl = "#/form/saveEntry/" + + formId;
                                                        var formRecordUrl = "#/form/records/" + + formId;
                                                        $scope.formOptionDetails = rowData;
                                                        $scope.formOptionDetails.pathType = $state.current.name;
                                                        $scope.formOptionDetails.isAllFormCustomDialog = true;
                                                        var tempTitle = $scope.formOptionDetails.title + ' ( ' + $scope.formOptionDetails.topicTitle + ' ) ';
                                                        var dialog = $ngBootbox.customDialog({
                                                            templateUrl: 'allFormCustomDialog.html',
                                                            title: tempTitle,
                                                            scope: $scope,
                                                            size: 'large',
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
                                                                '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\',\'\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                                                '<div class="form-group custom-checkbox more_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-more-settings" id="more_setup" name="more_setup">&nbsp;<label for="more_setup">Administrator Settings</label></div>' +

                                                                '<div class="form-group">' +
                                                                '<a class="float-buttons wv-btn wv-first btn-md" href="' + formEditUrl + '"><i class="fa fa-edit" aria-hidden="true"></i> Edit Form</a>&nbsp;&nbsp;' +
                                                                '<a class="float-buttons wv-btn wv-second btn-md" href="' + formFilterUrl + '"><i class="fa fa-filter" aria-hidden="true"></i> Filter Criteria</a>&nbsp;&nbsp;' +
                                                                '<a class="float-buttons wv-btn wv-second btn-md" href="' + formRoleUrl + '"><i class="fa fa-user-tag" aria-hidden="true"></i> Form Roles</a>&nbsp;&nbsp;' +
                                                                '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formClear(\'' + formClearUrl + '\');"><i class="fa fa-eraser" aria-hidden="true"></i> Clear Records</button>&nbsp;&nbsp;' +
                                                                '<button class="float-buttons wv-btn wv-danger btn-md" onClick="return formDel(\'' + formDeleteUrl + '\');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Form</button></div>' +
                                                                '<div class="form-group  custom-checkbox advance_setup-wrap mt-15 mb-10"><input type="checkbox" class="show-advance-settings" id="advance_setup" name="advance_setup">&nbsp;<label for="advance_setup">Advance Settings</label></div>' +
                                                                '<div class="form-group">' +
                                                                '<a href="" class="float-buttons wv-btn wv-first btn-md"><i class="fa fa-edit" aria-hidden="true"></i> Edit Topic</a>&nbsp;&nbsp;' +
                                                                '<button class="float-buttons wv-btn wv-danger btn-md" title="Delete Menu" onClick="return topicDel(' + topicId + ');"><i class="fa fa-trash" aria-hidden="true"></i> Delete Topic</button>&nbsp;&nbsp;' +
                                                                '<button class="float-buttons wv-btn wv-info btn-md" title="Quick Edit Form" onClick="getFunction( formId)"><i class="fa fa-pen"></i> Quick Edit Form</button>&nbsp;&nbsp;' +
                                                                '<br/><a href="forms/downloadformId" class="float-buttons wv-btn wv-warning" title="Export to JSON"><i class="fa fa-download"></i> Export to JSON</a>&nbsp;&nbsp;' +
                                                                '<a href="forms/exportFormExcel" class="float-buttons wv-btn wv-warning" title="Export to Excel (Full)"><i class="fa fa-download"></i> Export to Excel (Full)</a>&nbsp;&nbsp;' +
                                                                '<a href="forms/exportFormExcel?check=1" class="float-buttons wv-btn wv-warning" title="Export to Excel (Basic)"><i class="fa fa-download"></i> Export to Excel (Basic)</a>&nbsp;&nbsp;' +



                                                                '</div></div></div></div></div>';
                                                        } else {
                                                            var actions = '<div class="card-blue text-center">' +
                                                                '<div class="row">' +
                                                                '<div class="col-sm-12">' +
                                                                '<a class="float-buttons wv-btn wv-success btn-md entry-button" href="' + formEntryUrl + '"><i class="fa fa-plus" aria-hidden="true"></i> Entry</a>&nbsp;&nbsp;' +
                                                                '<a class="float-buttons wv-btn wv-info btn-md" href="' + formRecordUrl + '"><i class="fa fa-list-ol" aria-hidden="true"></i> Records</a>&nbsp;&nbsp;' +
                                                                '<a class="float-buttons wv-btn wv-second btn-md" href="' + formSummaryUrl + '"><i class="fa fa-th-list" aria-hidden="true"></i> Summary</a>&nbsp;&nbsp;' +
                                                                '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_form\',\'{{$url}}\')" class="float-buttons wv-btn wv-first" title="Copy Form"><i class="fa fa-copy"></i> Copy Form</a>&nbsp;&nbsp;' +
                                                                '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'copy_application\',\'\')" class="float-buttons wv-btn wv-first" title="Copy Folder"><i class="fa fa-copy"></i> Copy Folder</a>' +
                                                                '<a href="forms/download" class="float-buttons wv-btn wv-warning" title="Download"><i class="fa fa-download"></i> Download Form</a>&nbsp;&nbsp;' +
                                                                '<a href="forms/exportFormExcel" class="float-buttons wv-btn wv-warning" title="Export Form Excel"><i class="fa fa-download"></i> Export Form Excel</a>&nbsp;&nbsp;' +
                                                                '<a href="javascript:;" onClick="formFunction(' + applicationId + ',' + topicId + ',' + formId + ',\'import_form\',\'\')" class="float-buttons wv-btn wv-success" title="Import Form Excel"><i class="fa fa-upload"></i> Import Form Excel</a>&nbsp;&nbsp;' +
                                                                '</div></div></div>';
                                                        }


                                                        $("div.form-group.more_setup-wrap", '.card-blue').nextUntil("div.form-group.advance_setup-wrap").hide();
                                                        $("div.form-group.advance_setup-wrap", '.card-blue').nextAll("div.form-group").hide();
                                                    }
                                                }
                                            },
                                            { title: "App ID", field: 'applicationId', visible: false },
                                            { title: "Topic ID", field: 'topicId', visible: false },
                                            { title: "Form ID", field: 'formId', visible: false },

                                            //{title:"Topic Description", width:'33%'},
                                            {
                                                title: "Form Name", field: 'title', headerFilter: true, width: 180,
                                                formatter: formLink, align: "left",
                                                cellClick: function (e, cell) {
                                                    if (!cell.getRow().getData().otherApp) {
                                                        // window.location.href = "application/edit/" + applicationId;
                                                        //$state.go('records', { formId: formId });
                                                        var rowData = cell.getRow().getData();
                                                        var formId = cell.getRow().getData().formId;
                                                        var topicId = cell.getRow().getData().topicId;
                                                        if (rowData.currentFormType == 0)
                                                            $state.go('records', { formId: formId });
                                                        else if (rowData.currentFormType == 1)
                                                            $state.go('CalenderRecords', { formId: formId });
                                                        else
                                                            $state.go('queueRecords', { topicId: topicId });
                                                    }
                                                }
                                            },
                                            { title: "Topic Name", field: 'topicTitle', width: 180, headerFilter: true },
                                            { title: "Form Tags", field: 'formTag', width: 180, headerFilter: true, sorter: "string", sorterParams: { alignEmptyValues: "bottom" } },
                                            { title: "Form Type", field: 'formTypeText', width: 180, headerFilter: "select", headerFilterParams: { values: formTypes } },
                                            { title: "Form Status", field: 'statusText', width: 180, headerFilter: "select", headerFilterParams: { values: formStatus } },
                                            { title: "Last Activity", field: "lastActivityDate", width: 180, formatter: datetimeFormatterSub, headerFilter: true, sorter: 'datetime', sorterParams: { format: "YYYY/MM/DD HH:mm", alignEmptyValues: "bottom" } },
                                            { title: "Number of Records", field: "total_records", width: 180, headerFilter: true, sorter: "number", align: 'right' }
                                        ]
                                    });
                                    tabulatorChildren[applicationId] = childTabulator;
                                }
                            }, 500);
                            //tabulatorChildren[applicationId].setData([]);
                            $(".table-wrapper").hide();

                        },
                        ajaxFiltering: true,
                        ajaxSorting: true,
                        ajaxLoader: true,
                        ajaxURL: $scope.currentUrl + "/ManageApplication",
                        ajaxConfig: "POST", //ajax HTTP request type
                        ajaxContentType: "json",
                        ajaxParams: { action: 4, userId: $scope.userDetail.Id }, //ajax parameters
                        ajaxProgressiveLoad: "scroll",
                        ajaxProgressiveLoadScrollMargin: 25,
                        ajaxRequesting: function (url, params) {
                            $('#application-table').block({ message: '<h4>Getting Applications...</h4>' });
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
                            $('#application-table').unblock();
                            return response; //return the tableData property of a response json object
                        },
                        paginationSize: $scope.paginationSizeFormRecords,


                    });
            }, 150);

        };
        $scope.onGroupByChange = function (data) {
            localStorage.setItem("appl_list", data.groupBy);
            bindTabulatorHeaders(1);
        };
        $scope.getFunction = function (method) {
            //console.log('clicked');

            if (method === "copy-application") {
                dialog = $ngBootbox.customDialog({
                    templateUrl: 'copyApplication.html',
                    scope: $scope,
                    title: 'Copy Folder',
                    size: "large"
                    //  buttons: $scope.customDialogButtons
                });

                $timeout(function () {
                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                    Waves.attach('.flat-buttons', ['waves-button']);
                    Waves.init();
                }, 250);
            }

        };
        $scope.deleteApplication = function () {
            $ngBootbox.confirm('Are you sure you want to delete Folder?')
                .then(function () {
                    //  //console.log('Confirmed!' + $scope.applicationId);
                    $rootScope.$emit("ShowLoading");
                    var param = {};
                    param.action = 1;
                    param.created_by = $scope.userDetail.Id;
                    param.updated_by = $scope.userDetail.Id;
                    param.applicationId = $scope.applicationId;
                    mainService.manageDeletion("ManageDeletion", param)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                if (angular.isDefined(response.data)) {
                                    var exists = response.data;
                                    if (exists.res == 1) {
                                        notifierService.notifyMessage('success', 'Delete', exists.Message);
                                        $ngBootbox.hideAll();
                                        $scope.init();
                                    }
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
        };
        $scope.applicationRolesChange = function () {
            CookiesPersistenceService.setCookieWithExpiry("appcreatedBy", $scope.applicationData.created_by)
            CookiesPersistenceService.setCookieWithExpiry("appName", $scope.applicationData.applicationTitle)
            $state.go('applicationRoles', { appId: $scope.applicationId });
        };
        $scope.copyApplicationFunc = function () {


            //if (method === "copy-application") {
            //    dialog = $ngBootbox.customDialog({
            //        templateUrl: 'copyApplication.html',
            //        scope: $scope,
            //        title: 'Copy Folder'
            //        //  buttons: $scope.customDialogButtons
            //    });
            //    $timeout(function () {
            //        Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
            //        Waves.attach('.flat-buttons', ['waves-button']);
            //        Waves.init();
            //    }, 250);
            //}

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

                                //pageTabulator.setGroupBy(false);
                            }
                        }

                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        var dialog = '';
        $scope.onUpdateApplication = function (param) {
            $scope.applicationData = {};
            $scope.applicationData = param;
            //console.log($scope.applicationData)
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

        };
        $scope.manageTopic = function (param) {
            $rootScope.$emit("ShowLoading");
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
                                $rootScope.$emit("updateTopic", temp);
                                $scope.topicParamForForm.topicId = temp.topicId;
                                if (exists.res == 1)
                                    notifierService.notifyMessage('success', 'Topic', exists.Message);
                                else
                                    notifierService.notifyMessage('error', 'Topic', exists.Message);
                                //$('#addFormModal').modal('hide');
                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.onTopicSubmit = function () {
            $scope.topicParam.action = 1;
            $scope.topicParam.applicationId = $scope.applicationId;
            $scope.topicParam.max_records = 1000000;
            $scope.manageTopic($scope.topicParam);
            dialogOpenAddTopic.hide();
            $('#addTopicModal').modal('hide');
            $(".modal-backdrop").remove();
        };
        $scope.saveFormModel = function () {
            var id = parseInt($scope.topicParamForForm.topicId)
            var tempTopic = _.findWhere($scope.topicList, { topicId: id });
            $scope.topicParamForForm.topicName = tempTopic.topicTitle;
            $scope.topicParamForForm.applicationId = $scope.applicationId;

            localStorage.setItem("formModel", JSON.stringify($scope.topicParamForForm));
            $('#addTopicModal').modal('hide');
            $(".modal-backdrop").remove();

            if ($scope.currentFormType == 0 || $scope.currentFormType == 1)
                $state.go("form", { "topicId": $scope.topicParamForForm.topicId }, { reload: true, inherit: false });
            else if ($scope.currentFormType == 2)
                $state.go("queue", { "topicId": $scope.topicParamForForm.topicId }, { reload: true, inherit: false });
        };
        var dialogOpenAddTopic = "";
        $scope.openAddTopic = function () {
            $scope.topicParam = {};
            dialogOpenAddTopic = $ngBootbox.customDialog({
                templateUrl: 'addTopicModal.html',
                title: "Add New Topic",
                scope: $scope,
                size: "large"
                //  buttons: $scope.customDialogButtons
            });
            setTimeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 50)
        };
        $scope.showAModal = function () {

            //bootbox.hideAll();
            //var modalInstance = $uibModal.open({
            //    animation: true,
            //    ariaLabelledBy: 'modal-title',
            //    ariaDescribedBy: 'modal-body',
            //    templateUrl: 'appfunc.html',
            //    controller: 'ModelPopDemoController',
            //    controllerAs: 'pc',
            //    resolve: {
            //        applicationData: function () {
            //            return $scope.applicationData;
            //        }
            //    }
            //});
            //modalInstance.result.then(function () {
            //    // alert("now I'll close the modal");
            //});
            $scope.topicParam.action = 5;
            $scope.topicParam.applicationId = $scope.applicationId;
            $scope.manageTopic($scope.topicParam);
            dialog = $ngBootbox.customDialog({
                templateUrl: 'appfunc.html',
                scope: $scope,
                title: "Add Form",
                size: "large"
                //  buttons: $scope.customDialogButtons
            });
            setTimeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();
            }, 50)
        };
        var breadCrumb;
        //Functions
        //signalR.url("/signalr");
        signalR.url(mainService.getBaseUrl() + "signalr");
        signalR.setHubName("pushNotificationHub");
        signalR.connectToHub();
        $.connection.hub.logging = true;
        var connect = {};
        setTimeout(function () {
            signalR.connectToHub().connection.reconnecting();
            signalR.start(function () {
                signalR.server().send("test");
            });
        }, 250);
        signalR.client().broadcastPushNotification = function (userid, title, message) {
            $timeout(function () {
                notifierService.notifyMessage('warning', 'FormEntry' + userid + title, message)
            }, 250);
            // $scope.$apply();
            //$scope.messages.push(newChat);
        };
        $.connection.hub.start();
        $scope.init = function () {
            var webActions = '<div class="pull-right text-right rightbtn">\n\
                            <a href="#/" class="btn btn-primary pull-left redirectMenuPage" title="Home"><i class="fa fa-home"></i></a>\n\
                            <a href="#/chat/summary" class="btn btn-primary pull-left chatSummary" title="Chat"><i class="fa fa-commenting"></i ></a >\n\  \n\ </div > ';
            $(".card-header").append(webActions);
            $scope.groupBySetList = [];
            $scope.groupByList = [];

            $scope.expendedapplicationData = {};
            $scope.applicationData = {};
            $scope.topicList = [];
            $scope.topicParamForForm = {};
            $scope.topicParam = {};
            $scope.pdfParam = {};
            $scope.pdfParam.fileType = "1";
            $scope.currentUrl = mainService.getCurrentEndPointUrl();





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

            //tabulator.setData();
            //$rootScope.$emit("ShowLoading");
            //$.post($scope.currentUrl + "/ManageApplication",
            //    {
            //        "action": 4
            //    },
            //    function (data, status) {

            //        tabulator.setData(data);
            //        $rootScope.$emit("HideLoading");
            //    });
        };
        function changeStatusName(type) {
            var statusId = 0;
            switch (type) {
                case "Draft":
                    statusId = 1;
                    break;
                case "Active":
                    statusId = 2;
                    break;
                case "Inactive":
                    statusId = 3;
                    break;
                case "Template":
                    statusId = 4;
                    break;
                default:
                    statusId = 0;
                    break;
            }
            return statusId;
        };
        $scope.init();
        // $scope.FileTypeGlobal = function () {
        //// console.log(val);
        //    // var ddl = $('#filterType');
        //     var value = $('#filterType:selected').text();
        //     console.log(value)
        //     $scope.pdfParam.fileType = value;
        // }
        $scope.searchPdf = function (searchParam) {
            // alert($scope.pdfParam.text);
            var param = {};
            param.userId = $scope.userDetail.Id;    // user's id.
            param.uid = $scope.userDetail.uid;     // user's uid.
            param.isPdfSearch = true;
            param.baseUrl = mainService.getBaseUrl();   // site's base url.
            param.searchType = searchParam;
            //var searchTypeParam="pdf";
            //if ($scope.pdfParam.fileType==1)
            //    searchTypeParam = "pdf";
            //else if ($scope.pdfParam.fileType == 2)
            //    searchTypeParam = "docx";

            // filterTypeApp
            var type = 'pdf';
            //if (searchParam == "globalSearch")
            //    type= $("#filterType option:selected").text();
            //else if (searchParam == "appSearch")
            //    type= $("#filterTypeApp option:selected").text();
            //console.log(type);
            param.fileType = type;



            if (searchParam == "globalSearch") {// global search in all applications PDFs.
                param.textToSearh = $scope.pdfParam.globalKeyword;
            }
            else if (searchParam == "appSearch") {    // app search for specific application PDFs.
                param.applicationId = $scope.applicationId;
                param.textToSearh = $scope.pdfParam.appKeyword;
            }
            else if (searchParam == "downloadAttachments") {   // for download attchments. (all type of files)
                param.applicationId = $scope.applicationId;
            }
            $rootScope.$emit("ShowLoading");
            mainService.manageApplication("ManageApplication", param)
                .then(function (response) {
                    var data = response.data;
                    if (data != null && angular.isDefined(data)) {
                        var files = data.matchedFiles;
                        console.log(files);

                        if (angular.isDefined(files) && files.length > 0) {

                            //if searchParam==="downloadAttchment"
                            if (searchParam == "downloadAttachments") {

                                var zip = new JSZip();
                                var count = 0;
                                var zipFilename = $scope.applicationData.applicationTitle + "_" + $scope.applicationId.toString() + ".zip";
                                var urls = [];
                                $.each(files, function (key, value) {
                                    var arr = value;
                                    console.log(arr);
                                    urls.push(arr.matchedUrl);
                                });
                                console.log(urls);

                                urls.forEach(function (url) {
                                    var name1 = url.replace('//', '/');
                                    var arr = name1.split('/');
                                    var filename = arr[arr.length - 1];
                                    // loading a file and add it in a zip file
                                    JSZipUtils.getBinaryContent(url, function (err, data) {
                                        if (err) {
                                            throw err; // or handle the error
                                        }
                                        zip.file(filename, data, { binary: true });
                                        count++;
                                        if (count == urls.length) {
                                            zip.generateAsync({ type: 'blob' }).then(function (content) {
                                                saveAs(content, zipFilename);
                                            });
                                        }
                                    });
                                });



                            }
                            else {

                                loadPdfList(files, param.textToSearh, mainService.getBaseUrl(), type);
                            }
                        }
                        else
                            alert(data.Message);

                        $rootScope.$emit("HideLoading");
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        function loadPdfList(response, keyword, baseUrl, docType) {
            var loaderImg = baseUrl + "assets/images/loader.gif'";
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
                    console.log(rowdata);
                    var url = baseUrl + '/Templates/forms/pdfviewer.html?url=' + rowdata.matchedUrl + "&key=" + keyword + "&docType=" + docType;
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
                    var record = '';
                    try {

                        record = '<b>' + formDetail.formTitle + '(' + formDetail.appTitle + ',' + formDetail.topicTitle + ')</b>' + '   | ' + fileName + '  ' + '<b>(' + totalRec + ' matches)</b>';


                    }
                    catch (err) {
                        record = '' + '   | ' + fileName + '  ' + '<b>(' + totalRec + ' matches)</b>';

                    }

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
        function formFunction(applicationId, topicId, formId, type, url) {
            if (type === "copy_application") {
                bootbox.dialog({
                    onEscape: true,
                    title: "Copy Folder",
                    message: '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<form class="form-horizontal" id="quickFrm" action="{{url("getSave")}}" autocomplete="off">' +
                        '<input type="hidden" name="form_type" value="copy_application" /><input type="hidden" name="form_id" value="' + applicationId + '" />' +
                        '<div class="form-group"><label class="control-label col-sm-4">Folder name :</label><div class="col-sm-6"><input type="text" name="form_name" id="frmName" class="form-control"></div></div>' +
                        '<div class="form-group"><div class="col-sm-offset-4 col-sm-8">' +
                        '<button class="float-buttons wv-btn wv-first">Save</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></div></form>' +
                        '</div></div>'
                }).on('shown.bs.modal', function (e) {
                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                    Waves.attach('.flat-buttons', ['waves-button']);
                    Waves.init();
                });
                copy_application();
            }
            if (type == "import_form") {
                bootbox.dialog({
                    onEscape: true,
                    title: "Copy Folder",
                    message: '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<form class="form-horizontal" action="{{url("forms/importFormExcel")}}" method="post" enctype="multipart/form-data">' +
                        '<input type="hidden" name="_token" value=""><input type="hidden" name="form_id" value="' + formId + '" />' +
                        '<div class="form-group"><label class="control-label col-sm-4" for="formTitle">Select Form Control file:</label><div class="col-sm-8"><input type="file" id="changeFile" name="changeFiles" class="form-control" name="formControls" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  onchange="checkfile(this);"><p class="text-left">(*.xlsx or *.xls files only)</p></div></div>' +
                        '<div class="form-group"><div class="col-sm-offset-4 col-sm-8">' +
                        '<button class="float-buttons wv-btn wv-first">Save</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></div></form>' +
                        '</div></div>'
                }).on('shown.bs.modal', function (e) {
                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                    Waves.attach('.flat-buttons', ['waves-button']);
                    Waves.init();
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
                            }).on('shown.bs.modal', function (e) {
                                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                Waves.attach('.flat-buttons', ['waves-button']);
                                Waves.init();
                            });
                        }
                    },
                    error: function (error) { console.log(error); }
                });
            }
        };
        function getFunction(url, applicationId, method) {
            method = (method !== undefined ? method : 'default');
            /*var selectedRows = $("#application-table").tabulator("getSelectedRows");
            if(selectedRows.length>0){
                var applicationId = selectedRows[0].row.getData().applicationId;
    
                if(method === 'add-form')
                    addForm(url, applicationId);
                else if(method === 'delete-app'){
                    if(confirm('Are you sure you want to delete it?')){
                        window.location.href = url + "/" + applicationId;
                    }
                }
                return false;
            }else{
                alert('Please select any application in below list.');
            }*/
            if (method === 'add-form')
                addForm(url, applicationId);
            else if (method === "copy-application") {
                bootbox.dialog({
                    onEscape: true,
                    title: "Copy Folder",
                    message: '<div class="row">' +
                        '<div class="col-sm-12">' +
                        '<form class="form-horizontal" id="quickFrm" action="{{url("getSave")}}" autocomplete="off">' +
                        '<input type="hidden" name="form_type" value="copy_application" /><input type="hidden" name="form_id" value="' + applicationId + '" />' +
                        '<div class="form-group row"><label class="control-label col-xl-4">Folder Name :</label><div class="col-xl-8"><input type="text" name="form_name" class="form-control"></div></div>' +
                        '<div class="form-group row"><label class="control-label col-xl-4">Folder Tag :</label><div class="col-xl-8"><input type="text" name="app_tag" class="form-control"></div></div>' +
                        '<div class="form-group"><div class="offset-xl-4 col-xl-8">' +
                        '<button class="float-buttons wv-btn wv-first">Save</button> &nbsp;' +
                        '<button class="float-buttons wv-btn wv-second" data-dismiss="modal">Cancel</button></div></div></form>' +
                        '</div></div>'
                }).on('shown.bs.modal', function (e) {
                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                    Waves.attach('.flat-buttons', ['waves-button']);
                    Waves.init();
                });
                copy_application();
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
        //function pdfSearch(response, keyword, baseUrl) {
        //    var loaderImg = baseUrl+ "assets/images/loader.gif'";
        //    var $modalBody = $('#searchModal .modal-body > div#search-results');
        //    $modalBody.empty();
        //    $("#searchModal .modal-body").block({ message: '<img src="' + loaderImg + '" width="50" />', css: { position: 'relative', width: '100%' } });
        //    $('#searchModal .modal-title').html('Showing results for: <strong>' + keyword + '</strong>');
        //    $('#searchModal').modal('show');

        //    //$.getJSON(ajaxUrl, function (response) {
        //    //console.log(response)
        //    if (response.length) {
        //        var numFiles = 0;
        //        $.each(response, function (key, value) {
        //            var rowdata = value;
        //            var url = rowdata.matchedUrl;
        //            var matchFounds = rowdata.matchedFound;
        //            var fileName = rowdata.name;
        //            var totalRec = 0;
        //            $.each(matchFounds, function (key1, value1) {
        //                var arr = value1;
        //                console.log(arr);
        //                $.each(arr, function (index, val) {
        //                    totalRec = totalRec + parseInt(val);
        //                });


        //            });
        //            console.log(rowdata);
        //            var record = '<b>' + fileName + '</b>  ' ;
        //            $modalBody.append(
        //                '<a class="list-group-item" target="_blank" href="' + url + '">' + record + ' </a>'/*<b>(' + totalRec.toString() + ' matches)</b>*/
        //            );
        //            numFiles++;
        //        });
        //        if (numFiles === 0) {
        //            $("#searchModal .modal-body").unblock();
        //            $modalBody.append(
        //                '<a class="list-group-item" href="javascript:;">No attachment found.</a>'
        //            );
        //        }
        //        else {
        //            $("#searchModal .modal-body").unblock();

        //        }


        //    }
        //    else {
        //        alert('No attachments were found.');
        //        $("#searchModal .modal-body").unblock();
        //    }
        //    //});
        //}

        $("#search-form").on('submit', function (event) {
            event.preventDefault();

            var keyword = $.trim($(this).find('#keyword').val());
            if (keyword !== '') {
                //  pdfSearch("{{ url('getAppPDF') }}", keyword);
            } else {
                alert('Please enter any text to search...');
            }
        });
        $(document).on('submit', 'form.app-pdf-search', function (event) {
            event.preventDefault();
            var keyword = $.trim($(this).find('#keyword').val());
            var applicationId = $(this).find('#applicationId').val();
            if (keyword !== '' && applicationId !== "") {
                $('.bootbox').modal('hide');
                //  pdfSearch("{{ url('getAppPDF') }}/" + applicationId, keyword);
            } else {
                alert('Please enter any text to search...');
            }
        });
        $scope.setTabulatorGroupBy = function (persistenceID, type) {
            // $("button[name=group-rows]:not(." + type + ")").removeClass("col-hide active");
            var cookieName = 'tabulator-grouping-' + persistenceID;
            //$("." + type).toggleClass("col-hide active");            
            var applicationId = $scope.applicationId;
            var exists = _.findIndex($scope.groupBySetList, { applicationId: applicationId });
            if (!$scope.isGroupByFormTag) {
                tabulatorChildren[applicationId].setGroupBy(type);
                tabulatorChildren[applicationId].clearSort();
                tabulatorChildren[applicationId].setSort(type, "asc");
                $scope.groupBySetList.push({ persistenceID: persistenceID, applicationId: applicationId, type: type });
                $.cookie(cookieName, type);
            } else {
                //$("." + type).removeClass("col-hide active");
                tabulatorChildren[applicationId].setGroupBy(false);
                if (exists != -1)
                    $scope.groupBySetList.splice(exists, 1);
                $.cookie(cookieName, "");
            }
            $ngBootbox.hideAll();
        };
        function downloadXlsx() {
            bootbox.dialog({
                onEscape: true,
                title: "Select Menu",
                message: '<div id="myid" class="list-group">' +

                    '</div>'
            });
        };
        $(document).on('click', "div[id*=myid] a", function (e) {
            e.preventDefault();
            var id = $(this).attr('id');
            window.open("{{url('downloadXlsx')}}/" + id);
            bootbox.hideAll();
        });
    });
}(FormGeneratorApp));