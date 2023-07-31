FormGeneratorApp.controller('SuperAdminController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    var breadCrumb;
    if (localStorage.getItem("globalLang") == null || localStorage.getItem("globalLang") == "") {
        localStorage.setItem('globalLang', '1');
    }
    if (localStorage.getItem("globalLangForm") == null || localStorage.getItem("globalLang") == "") {
        localStorage.setItem('globalLangForm', '1');
    }

    $scope.setSpecialAccess = function (userDetails) {
        if (!jQuery.isEmptyObject(userDetails) && userDetails !== null && typeof userDetails !== undefined && userDetails !== "") {
            $scope.specialAccess.showQueue = false;
            $scope.specialAccess.showCalender = false;
            $scope.specialAccess.showCreateWithExcel = false;
            var accessData = userDetails.specialAccess;
            if (typeof accessData !== undefined && accessData !== null && accessData !== "") {
                var _accessArr = accessData.split(',');
                if (_accessArr.length > 0) {
                    angular.forEach(_accessArr, function (value, key) {
                        if (value == "Queue")
                            $scope.specialAccess.showQueue = true;
                        if (value == "Calender")
                            $scope.specialAccess.showCalender = true;
                        if (value == "CreateWithExcel")
                            $scope.specialAccess.showCreateWithExcel = true;
                    });
                }
            }
            else {
            }
        }
    };
    $scope.$on("loadSpecialAccess", function (event, data) {
        $scope.specialAccess = {};
        $scope.setSpecialAccess(mainService.loginDetails());
    });
    $scope.$on("loginuser", function (event, data) {
        if (data != null) {
            loadText(data);
        }
    });
    function loadText(data) {
        $timeout(function () {
            if (data != null) {
                if (!DataService.isEmpty(data.name)) {
                    var usernm = data.name.charAt(0);
                    $('#profileletter').text(usernm.toUpperCase());
                    $rootScope.safeApply();
                }
            }
        }, 400);
    }
    $scope.addFormQueueFunc = function (type) {
        var title = "";
        if (type == 1) {
            title = "Add New Form"
            $scope.currentFormType = 0;
        }
        else if (type == 2) {
            title = "Add New Queue"
            $scope.currentFormType = 2;
        }
        else {
            title = "Add New Calender"
            $scope.currentFormType = 1;
        }
        var dialog = $ngBootbox.customDialog({
            templateUrl: 'advanceQuickAddForms.html',
            scope: $scope,
            size: "large"
        });
    };
    $scope.init = function () {
        $rootScope.isPreviewPage = true;
        $scope.loginParam = {};
        $scope.resetParam = {};
        $scope.activatedServicesPlan = {};
        $scope.servicesPlanList = [];
        $scope.currentUrl = mainService.getCurrentEndPointUrl();
        window["ASSET_URL"] = $scope.currentUrl;
        window["bannerUploadUrl"] = $scope.currentUrl + "/uploadFile";
        window["bannerDeleteUrl"] = $scope.currentUrl + "/DeleteFile";
        if (localStorage.getItem("pservice") != null) {
            $scope.servicesPlanList = JSON.parse(localStorage.getItem("pservice"));
            $scope.servicesPlanList = $scope.servicesPlanList.split(',');
        }
        $rootScope.userDetail = mainService.loginDetails();
        $scope.specialAccess = {};
        $scope.setSpecialAccess(mainService.loginDetails());
        loadText(mainService.loginDetails());
        $scope.getLanguage();
        

        /*Theme List*/
        $scope.allFormsList = [];

        $scope.isShowHeader = true;
        $scope.importFormSettings = { language: 1 };
        $scope.SetLanguage();
        $scope.ApplyMultilingualText();
    };
    $scope.$on("showHeaderLogo", function (event) {
        $scope.isShowHeader = false;
    });
    /*Tabulator Configurator Settings Common Function*/
    $scope.cellFormatterBackgroundColorCustom = function (cell, tabulatorConfiguratorSettings) {
        if (!DataService.isEmpty(tabulatorConfiguratorSettings)) {
            /*heading height */
            if (!DataService.isEmpty(tabulatorConfiguratorSettings.headingHeight)) {
                if (tabulatorConfiguratorSettings.headingHeight > 0) {
                    cell.getColumn().getElement().style.height = (72) + tabulatorConfiguratorSettings.headingHeight + "px";
                }
            }
            var tabuSettings = tabulatorConfiguratorSettings.configSettings;
            if (!DataService.isEmpty(tabuSettings)) {
                var list = JSON.parse(tabuSettings);
                if (!DataService.isEmpty(list)) {
                    var exists = _.findWhere(list, { field: cell.getColumn().getField() });
                    if (!DataService.isEmpty(exists)) {
                        cell.getElement().style.backgroundColor = exists.backgroundColor;
                        cell.getElement().style.color = exists.forecolor;
                    }
                    else {
                        if (cell.getColumn().getDefinition().rowEdit) {
                            var exists = _.findWhere(list, { rowEdit: cell.getColumn().getDefinition().rowEdit });
                            cell.getElement().style.backgroundColor = exists.backgroundColor;
                            cell.getElement().style.color = exists.forecolor;
                        }
                        else if (cell.getColumn().getDefinition().rowHandle) {
                            var exists = _.findWhere(list, { rowHandle: cell.getColumn().getDefinition().rowHandle });
                            cell.getElement().style.backgroundColor = exists.backgroundColor;
                            cell.getElement().style.color = exists.forecolor;
                        }
                    }
                }
            }
        }
    };
    $scope.generateEmbedUrl = function (currentFormId, currentFormType) {
        var $scopeVar = angular.element($("main .card.card-default")).scope();
        $scope.embedUrl = "";
        if (currentFormType == 1) {
            $scope.embedUrl = mainService.getBaseUrl() + "Home/url/#/embed/form/saveEvent/" + currentFormId;
            var formList = "";
            var formlistIds = [];
            var list = [];
            if ($scopeVar.formDetailsDataInfo.calenderSettingsList.length > 0) {
                var temp = _.filter($scopeVar.formDetailsDataInfo.calenderSettingsList, function (item) {
                    return item.resourceForm != 0 && !DataService.isEmpty(item.resourceForm)
                });

                _.each(temp, function (item) {
                    list.push(item.resourceForm);
                    formlistIds.push(0);
                });
                formList = list.join(',');
                formlistIds = formlistIds.join(',');
            }
            $scope.embedUrl += "?popup=1&customForms=" + formList + "&customFormIds=" + formlistIds + "";
            //$state.go("saveFormEventData", {
            //    "formId": $scope.currentFormId, "popup": 1, "customForms": formList, "customFormIds": formlistIds
            //});
        }
        else
            $scope.embedUrl = mainService.getBaseUrl() + "Home/url/#/embed/form/saveEntry/" + currentFormId;
        //console.log($scope.embedUrl);
        var dialog = $ngBootbox.customDialog({
            templateUrl: 'copyEmbedUrl.html',
            title: "Embed Url",
            scope: $scope,
            size: "large"
        });

    };
    $scope.showHeader = function () {
        $scope.isShowHeader = !$scope.isShowHeader;
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

    $scope.SetLanguage = function () {
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
                    //console.log(response.data, "ldata");
                    $scope.languageList = null;
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

    $scope.showAlertError = function (title, message) {
        $scope.alert_error = true;
        $scope.alert = { title: title, message: message }
    }
    $scope.showAlertSuccess = function (title, message) {
        $scope.alert_success = true;
        $scope.alert = { title: title, message: message }
    }

    

    $scope.init();

});


FormGeneratorApp.controller('SuperAdminDashboardController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    checkLogin();
    $("#navbarVerticalMenuPagesMenu .nav-link").removeClass('active');
    $("#nav-super-dashboard").addClass('active');

    $.ajax({
        url: "/Superadmin/GetDashboardData",
        type: "GET",
        success: function (response) {
            if (response.Status) {
                $("#lblBusinessUsers").text(response.Data[0].BusinessUserCount)
                $("#lblPublicUsers").text(response.Data[0].PublicUserCount)
                $("#lblSuperUsers").text(response.Data[0].SuperUserCount)
                $("#lblTotalCompanies").text(response.Data[0].TotalCompanies)
                $("#lblTotalCalendars").text(response.Data[0].TotalCalendars)
            }
        }
    })

}); 

FormGeneratorApp.controller('SuperAdminBusinessUsersController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    checkLogin();
    $("#navbarVerticalMenuPagesMenu .nav-link").removeClass('active');
    $("#nav-super-business-users").addClass('active');
    $scope.CalendarMasterList = function () {

        var columns = [
            {
                title: 'Actions', field: 'ACTION', formatter: function (cell, formatter) {

                    return `<a href="/SuperAdmin#/Superadmin/BusinessCompanyMaster/${cell.getRow().getData().USER_ID}" class="btn btn-primary text-light" style="border-radius:300px;">View</a> ${(cell.getRow().getData().IS_ACTIVE == "Y") ? `<button onclick="activeInactiveUser(${cell.getRow().getData().Id}, 'N')"  class='btn btn-warning text-light' style='border-radius:300px; background:#E2476C;'>Inactive</button>` : `<button onclick="activeInactiveUser(${cell.getRow().getData().Id}, 'Y')" class="btn btn-success text-light" style="border-radius:300px;">Activate</button>`} `;
                }, headerSort: false
            },
            {
                title: 'Created At', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("YYYY-MM-DD")
                }
            },
            {
                title: 'Updated At', field: 'updated_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().updated_at).format("YYYY-MM-DD")
                }
            },
            { title: 'User Id', field: 'USER_ID', headerFilter: "input" },
            { title: 'Email', field: 'USER_EMAIL', headerFilter: "input" },
            
            { title: 'Password', field: 'USER_PASSWORD', headerFilter: "input" },
            { title: 'Signup Type', field: 'SIGNUP_TYPE', headerFilter: "input" },
            {
                title: 'Status', field: 'IS_ACTIVE', headerFilter: "input", formatter: function (cell, formatter) {

                    if (cell.getData().IS_ACTIVE != "Y") {
                        return `<span style="color:#e2476c;">Inactive</span>`;
                    } else {
                        return `<span style="color:green;">Active</span>`;
                    }

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
                //groupBy: groupBy,
                //groupHeader: function (value, count, data, group) {
                //    //value - the value all members of this group share
                //    //count - the number of rows in this group
                //    //data - an array of all the row data objects in this group
                //    //group - the group component for the group
                //    debugger;
                //    var creditValue = 0;
                //    var debitValue = 0;
                //    for (var i = 0; i < data.length; i++) {
                //        creditValue += parseInt(data[i].CREDIT_COIN);
                //        debitValue += parseInt(data[i].DEBIT_COIN)
                //    }

                //    return value + `<span style='margin-left:10px;'>(${count} transactions)</span>` + "<span style='margin-left:24px;'>Balance B$" + (creditValue - debitValue).toFixed(2) + "</span>";
                //},
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
                ajaxURL: "/SuperAdmin/GetUserList",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: {
                    role: 1
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

    $scope.CalendarMasterList();

});

FormGeneratorApp.controller('SuperAdminBusinessCompanyMasterController', function ($scope, $http, $timeout, $state, $stateParams, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    checkLogin();
    $("#navbarVerticalMenuPagesMenu .nav-link").removeClass('active');
    $("#nav-super-business-users").addClass('active');
    $scope.CalendarMasterList = function () {

        var columns = [
            {
                title: 'View Details', field: 'ACTION', formatter: function (cell, formatter) {

                    return `<button onclick="" class="btn btn-primary text-light" style="border-radius:300px;">Company</button>  ${(cell.getData().CALENDAR_CODE != null) ? `<button onclick=""  class='btn btn-warning text-light' style='border-radius:300px; background:#E2476C;'>Calendar</button>`: `` }`;
                }, headerSort: false
            },
            { title: 'Company', field: 'COMPANY_NAME_ENGLISH', headerFilter: "input" },
            { title: 'Calendar Name', field: 'CALENDAR_NAME', headerFilter: "input" },

            { title: 'Calendar Category', field: 'CALENDAR_CATEGORY_NAME', headerFilter: "input" },
            { title: 'Sub Category', field: 'CALENDAR_SUB_CATEGORY_NAME', headerFilter: "input" },
            {
                title: 'Slot Duration', field: 'SLOT_DURATION_IN_MINS', headerFilter: "input"
            }
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
                groupBy: "COMPANY_NAME_ENGLISH",
                groupHeader: function (value, count, data, group) {
                    //value - the value all members of this group share
                    //count - the number of rows in this group
                    //data - an array of all the row data objects in this group
                    //group - the group component for the group
                    
                    if (data[0].CALENDAR_CODE == null) {
                        data = [];
                        count = 0;
                    }
                    return value + `<span style='margin-left:10px;'>(${count} Calendars)</span>`;
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
                ajaxURL: "/SuperAdmin/GetCompanyMasterWithCalendars",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: {
                    UserId: $stateParams.UserId
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

    $scope.CalendarMasterList();

});

FormGeneratorApp.controller('SuperAdminPublicUsersController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    checkLogin();
    $("#navbarVerticalMenuPagesMenu .nav-link").removeClass('active');
    $("#nav-super-public-users").addClass('active');
    $scope.CalendarMasterList = function () {

        var columns = [
            {
                title: 'Actions', field: 'ACTION', formatter: function (cell, formatter) {

                    return `${(cell.getRow().getData().IS_ACTIVE == "Y") ? `<button onclick="activeInactiveUser(${cell.getRow().getData().Id}, 'N')"  class='btn btn-warning text-light' style='border-radius:300px; background:#E2476C;'>Inactive</button>` : `<button onclick="activeInactiveUser(${cell.getRow().getData().Id}, 'Y')" class="btn btn-success text-light" style="border-radius:300px;">Activate</button>`} `;
                }, headerSort: false
            },
            {
                title: 'Created At', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("YYYY-MM-DD")
                }
            },
            {
                title: 'Updated At', field: 'updated_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().updated_at).format("YYYY-MM-DD")
                }
            },
            { title: 'User Id', field: 'USER_ID', headerFilter: "input" },
            { title: 'Email', field: 'USER_EMAIL', headerFilter: "input" },

            { title: 'Password', field: 'USER_PASSWORD', headerFilter: "input" },
            { title: 'Signup Type', field: 'SIGNUP_TYPE', headerFilter: "input" },
            {
                title: 'Status', field: 'IS_ACTIVE', headerFilter: "input", formatter: function (cell, formatter) {

                    if (cell.getData().IS_ACTIVE != "Y") {
                        return `<span style="color:#e2476c;">Inactive</span>`;
                    } else {
                        return `<span style="color:green;">Active</span>`;
                    }

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
                //groupBy: groupBy,
                //groupHeader: function (value, count, data, group) {
                //    //value - the value all members of this group share
                //    //count - the number of rows in this group
                //    //data - an array of all the row data objects in this group
                //    //group - the group component for the group
                //    debugger;
                //    var creditValue = 0;
                //    var debitValue = 0;
                //    for (var i = 0; i < data.length; i++) {
                //        creditValue += parseInt(data[i].CREDIT_COIN);
                //        debitValue += parseInt(data[i].DEBIT_COIN)
                //    }

                //    return value + `<span style='margin-left:10px;'>(${count} transactions)</span>` + "<span style='margin-left:24px;'>Balance B$" + (creditValue - debitValue).toFixed(2) + "</span>";
                //},
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
                ajaxURL: "/SuperAdmin/GetUserList",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: {
                    role: 2
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

    $scope.CalendarMasterList();
});


function ShowBusinessCompanies(userId) {
    alert(userId);
}
function activeInactiveUser(userId, status) {

    swal({
        icon: "info",
        title: "Confirmation",
        text: "Are you sure you want to " + ((status == 'Y') ? "Active" : "Inactive") + " this user?",
        buttons: {
            confirm: "Yes, Update",
            cancel: "No, Leave it"
        }
    }).then(function (confirm) {
        if (confirm) {
            $.ajax({
                url: "/SuperAdmin/ActiveInactiveUser",
                type: "POST",
                data: {
                    UserId: userId,
                    Status: status
                },
                success: function (response) {
                    window.location.reload()
                },
                error: function (err) {
                    alert("Something went wrong.");
                }
            })
        }
    })

}