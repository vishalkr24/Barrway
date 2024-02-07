(function () {
    'use strict';

    FormGeneratorApp.controller('NewSchedularFormController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, adminService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox, translationService) {
        checkLogin();

        $scope.init = function () {
            $scope.scheduleList = {
                "Mon": [],
                "Tue": [],
                "Wed": [],
                "Thu": [],
                "Fri": [],
                "Sat": [],
                "Sun": []
            };

            $scope.addFormElement("Mon");
            $scope.addFormElement("Tue");
            $scope.addFormElement("Wed");
            $scope.addFormElement("Thu");
            $scope.addFormElement("Sat");
            $scope.addFormElement("Sun");
            $scope.addFormElement("Fri");

            console.log($scope.scheduleList);

        };

        $scope.addFormElement = function (abbr) {
            let id = getMaxId(abbr);

            $scope.scheduleList[abbr].push({ "Id": id, "start": "", "end": "" });
            
            $("#elements-row-" + abbr).append(`<div class="schedular-element form-element"  data-element-id="SCH_${id}">
                                        <div>

                                            <input type="time" class="form-control" />
                                        </div>
                                        <div> <b>--</b> </div>
                                        <div>

                                            <input type="time" class="form-control" />
                                        </div>
                                        <div class="delete-element">
                                            <button class="btn btn-primary" onclick="angular.element(this).scope().deleteFormElement('${abbr}', ${id})"><i class="fa fa-times" aria-hidden="true"></i></button>
                                        </div>
                                    </div>`);
        }

        $scope.deleteFormElement = function (abbr, id) {
            
            $scope.scheduleList[abbr].splice($scope.scheduleList[abbr].indexOf(x=> x.Id == id), 1);
            $("#elements-row-" + abbr + " .form-element[data-element-id=SCH_" + id + "]").remove();

        }

        function getMaxId(abbr) {
            $scope.scheduleList[abbr];

            let maxValue = 0;

            if ($scope.scheduleList[abbr].length > 0) {
                $scope.scheduleList[abbr].forEach(x => {
                    if (x => x.Id > maxValue) maxValue = x.Id;
                });
            }
            

            return parseInt(maxValue) + 1;
        }









        $scope.init();
    });

}(FormGeneratorApp));


