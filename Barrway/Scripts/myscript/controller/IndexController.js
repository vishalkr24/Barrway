FormGeneratorApp.controller('IndexController', function ($scope, $http, $timeout, $state, DataService, $ngBootbox, $location, $window, $rootScope, mainService, adminService, CookiesPersistenceService, notifierService, translationService) {
    var breadCrumb;
    $scope.calendarList = [];
    $scope.selectedCalendarCode = '';
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
        
        var a = $scope.userDetail
        $scope.getLanguage();
        $scope.bindCalendarDropdown();

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

    $scope.bindCalendarDropdown = function () {
        if (localStorage.getItem("COMPANY_ID") != null && localStorage.getItem("COMPANY_ID") != undefined) {
            adminService.postAsync('/BusinessAdmin/GetAllCompanyCalendars/', { companyId: localStorage.getItem("COMPANY_ID") }).then(function (res) {

                $scope.calendarList = res.data;

                if (isEmptyLocalStorageValue("CALENDAR_CODE")) {
                    if (res.data.length > 0) {
                        $scope.selectedCalendarCode = res.data[0].CALENDAR_CODE;
                    }
                }

                $timeout(function () {
                    $scope.ManageCalendarMaster();
                }, 500);

            }, function (err) {

            });
        } else {
            if (window.location.href.includes("/calendar/index")) {
                swal({
                    icon: "warning",
                    title: "Company Required",
                    text: "Kindly Setup/Select a company."
                }).then(function () {
                    window.location.replace("/BusinessAdmin/Dashboard");
                })
            }
            
        }
        
    }

    $scope.ManageCalendarMaster = function () {

        if ($scope.calendarList != null) {
            if ($scope.calendarList.length > 0) {
                debugger;
                if (isEmptyLocalStorageValue("CALENDAR_CODE")) {
                    //$("#ddlMasterCalendar option[value='']").remove();
                    localStorage.setItem("CALENDAR_CODE", $("#ddlMasterCalendar option:selected").val());
                } else {
                    $("#ddlMasterCalendar").val(localStorage.getItem("CALENDAR_CODE"));
                }

                $(".lbl-company-name").text(localStorage.getItem("COMPANY_NAME_ENGLISH"));
                $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());

                $scope.CALENDAR_CODE = localStorage.getItem("CALENDAR_CODE");

                if ($scope.CALENDAR_CODE == undefined || $scope.CALENDAR_CODE == null || $scope.CALENDAR_CODE.includes("undefined") || $scope.CALENDAR_CODE == "null") {
                    swal({
                        icon: "warning",
                        title: "Select Calendar",
                        text: "Please select a calendar"
                    });
                    $(".lbl-calendar-name").text("Select Calendar");
                    return;
                } else {
                    $(".selectable-calendar-item").removeClass("selected");
                    setTimeout(function () {
                        $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
                    }, 500);
                }
                $scope.getCalendarDetails($scope.CALENDAR_CODE);
            } else {
                if (window.location.href.includes("/calendar/index")) {
                    swal({
                        icon: "warning",
                        title: "No Calendar",
                        text: "Calendars not found. Please create a calendar first."
                    }).then(function (response) {
                        window.location.replace("/BusinessAdmin/CalendarMaster");
                    });
                }
                
            }
        }
        
    }

    $scope.ChangeCalendarDropDown = function () {
        localStorage.setItem("CALENDAR_CODE", $scope.selectedCalendarCode);

        window.location.reload();
    };

    $scope.getCalendarDetails = function (id) {
        adminService.postAsync('/MarketPlace/GetCalendarDetails/' + id, {}).then(function (res) {
            if (res.data.Status) {
                $scope.calendarMaster = res.data.Data;
            } else {
                alert('Please choose/create a calendar');
            }
            

        }, function (err) {

        });
    }
    $scope.init();

});

function isEmptyLocalStorageValue(key) {
    if (localStorage.getItem(key) == undefined || localStorage.getItem(key) == null || localStorage.getItem(key) == "null" || localStorage.getItem(key) == "") {
        return true;
    }
    return false;
}