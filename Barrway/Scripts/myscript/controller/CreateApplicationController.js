(function () {
    'use strict';


    FormGeneratorApp.controller('CreateApplicationController', function ($scope, $ngBootbox, $rootScope, $http, $location, $window, $state, mainService, notifierService, translationService) {
        $scope.init = function () {
            $scope.applicationData = {};
            $scope.importFormSettings = { language: 1 };
            $scope.getLanguage();
            $scope.ApplyMultilingualText();

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

            $scope.accessList = [
                { name: getStringFromMultiligualText("Yes|是的|是的", langId), value: true, ischecked: false },
                { name: getStringFromMultiligualText("No|不|不", langId), value: false, ischecked: true }
            ];
            $scope.statusList = [
                { name: getStringFromMultiligualText("Draft|草稿|草稿", langId), value: 1, ischecked: true },
                { name: getStringFromMultiligualText("Active|積極的|积极的", langId), value: 2, ischecked: false },
                { name: getStringFromMultiligualText("InActive|不活躍|不活动", langId), value: 3, ischecked: false },
                { name: getStringFromMultiligualText("Template|模板|模板", langId), value: 4, ischecked: false }
            ];
            $scope.applicationData.status = "1";
            $scope.applicationData.publicTemplate = "No";
            $scope.applicationData.protectedApplication = "No";
            $scope.userDetail = mainService.loginDetails();
        }
        $scope.init();
        $scope.changeCheckbox = function (type, checked) {
            if (type == 1) {
                $scope.applicationData.publicTemplate = checked;
            }
            if (type == 2) {
                $scope.applicationData.protectedApplication = checked;
            }
        }
        $scope.onSubmit = function () {
            if ($scope.myForm.$valid) {
                console.log($scope.applicationData)
                $scope.applicationData.action = 1;
                $scope.applicationData.created_by = $scope.userDetail.Id;
                $scope.applicationData.update_by = $scope.userDetail.Id;
                mainService.manageApplication("ManageApplication", $scope.applicationData)
                    .then(function (response) {

                        if (response.data != null && angular.isDefined(response.data)) {
                            if (response.data.length > 0) {
                                //alert(response.data[0].Message);
                                notifierService.notifyMessage('success', 'Folder', response.data[0].Message);
                                $state.go('application', { reload: true, inherit: false });
                            }
                        }
                    }, function (err) {

                        console.log("some error occured." + err);

                    });
            }
        }

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


        $scope.cancel = function () {
            $window.history.back();
            //$ngBootbox.confirm('Are you sure to delete?')
            //    .then(function () {
            //        console.log('Confirm is Delete');
            //    },
            //        function () {
            //            //Confirm was cancelled, don't delete customer
            //            console.log('Confirm was cancelled');
            //        });
        }
    });
}(FormGeneratorApp));