(function () {
    'use strict';
    FormGeneratorApp.controller('CreateGroupController', function ($scope, $compile, $rootScope, $http, $location, $window, mainService, DataService, notifierService, $state, $stateParams) {
        var roles = ["General User", "Supervisor", "Admin", "Super User"];
        $scope.commonDetails = {};
        $scope.userDetail = mainService.loginDetails();
        $scope.currentUrl = mainService.getCurrentEndPointUrl();
        $scope.PageRole = {};
        $scope.dyCreateColumns = [];
        $scope.setSubGroupName = function () {
            var masterGroupName = localStorage.getItem('groupNameParam');
            if (angular.isDefined(masterGroupName))
                $scope.commonDetails.groupName = masterGroupName;
            //  alert($scope.commonDetails.groupName);
        }
        $scope.baseurl = mainService.getBaseUrl();
        var selectText = function (cell, formatterParams, onRendered) { //plain text value ,defaultValue: "0"
            if (cell.getRow().getData().userRole == 0 || cell.getRow().getData().userRole == null) {
                return "General User";
            }

            if (cell.getRow().getData().userRole == 1) {
                return "Supervisor";
            }
            if (cell.getRow().getData().userRole == 2) {
                return "Admin";
            }
            if (cell.getRow().getData().userRole == 3) {
                return "Super User";
            }
        };
        var isExistTick = function (cell, formatterParams, onRendered) { //plain text value
            if (cell.getRow().getData().isExist == 0)
                return "";
            if (cell.getRow().getData().isExist == 1) {
                tabulator.selectRow(cell.getRow());
                return "<i class='fa fa-check' style='color:green'></i>";
            }
        };


        if ($stateParams.groupId) {
            $scope.paramgroupId = $stateParams.groupId;
            //$state.current.ncyBreadcrumb.parent = $scope.commonDetails.groupName;
            //var parseLabel = $interpolate($state.current.ncyBreadcrumb.label);
            //$state.current.ncyBreadcrumbLabel = $state.current.ncyBreadcrumb.label;
            $scope.dyCreateColumns = [

                {
                    title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                        cell.getRow().toggleSelect();
                    }
                },

                {
                    title: "contactUserId",
                    field: "contactUserId",
                    sorter: "string",
                    visible: false,
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search..."
                }, {
                    title: "Name",
                    field: "contactUserName",
                    sorter: "string",
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search...",

                    formatter: "text"
                },
                {
                    title: "Contact Tag",
                    field: "contactTag",
                    sorter: "string",
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search...",
                    editor: "input"


                },

                {
                    title: "Role",
                    field: "userRole",
                    sorter: "string",
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search...",

                    editor: "select",
                    editorParams: { values: { "0": "General User", "1": "Supervisor", "2": "Admin", "3": "Super User" } },
                    formatter: selectText
                },
                {
                    title: "isExist",
                    field: "isExist",
                    sorter: "string",

                    headerFilter: "input",
                    headerFilterPlaceholder: "Search...",
                    editor: true,
                    formatter: isExistTick
                }
            ];

        }
        else {
            $scope.dyCreateColumns = [


                {
                    title: "Select", width: 80, formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                        cell.getRow().toggleSelect();
                    }
                },
                {
                    title: "Name",
                    field: "contactUserName",
                    sorter: "string",
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search..."
                }, {
                    title: "Contact Tag",
                    field: "contactTag",
                    sorter: "string",
                    headerFilter: "input",
                    headerFilterPlaceholder: "Search...",
                    editor: "input"

                }];
        }


        var tabulator = "";
        if ($("#example-table").length)
            tabulator = new Tabulator("#example-table", {
                height: "50%",
                layout: "fitDataFill",
                responsiveLayout: false,
                movableColumns: true,
                placeholder: "No user in your contacts...",
                //persistentLayout:true,
                //persistenceID:"user-contacts",
                columns: $scope.dyCreateColumns,
                index: "contactUserId", //set the index field to the "contactUserId" field.
                //selectable: true, //make rows selectable
                initialSort: [{ column: "contactUserName", dir: "desc" }],
                rowSelectionChanged: function (data, rows) {
                    var users = [],
                        userIds = [], usersTags = [], usersRoles = [];
                    $scope.selecetedContact = [];
                    $("#select-stats").find('span').text('');
                    rows.forEach(function (row) {
                        userIds.push(row.getData().contactUserId);
                        users.push(row.getData().contactUserName);
                        var rolename = "";
                        if (row.getData().userRole == null || row.getData().userRole == 0) {
                            rolename = " (General User)";
                        }
                        if (row.getData().userRole == 1) {
                            rolename = " (Supervisor)";
                        }
                        if (row.getData().userRole == 2) {
                            rolename = " (Admin)";
                        }
                        if (row.getData().userRole == 3) {
                            rolename = " (Super User)";
                        }
                        var user_role = row.getData().contactUserName + rolename;

                        var obj = {};
                        obj.contactUserName = row.getData().contactUserName;
                        obj.rolename = rolename;
                        obj.roleId = row.getData().userRole;
                        obj.contactUserId = row.getData().contactUserId;
                        $scope.selecetedContact.push(obj);
                        $rootScope.safeApply();
                        //$("#select-stats").append(
                        //    $('<span id="sp_' + row.getIndex() + '">', { 'class': 'd-flex justify-content-between align-items-center' }).append(
                        //        user_role,
                        //        $compile(
                        //            $('<span>').html('<button id="del" class="btn btn-danger mb-1 mr-0 ml-2 btn-sm"  type="button"ng-click="deleteentry(' + row.getIndex() + ')"><i class="fa fa-trash"></i></button>'))($scope)

                        //    )
                        //    // .text(user_role)


                        //);
                        // $("#select-stats").append($compile(
                        //     $('<span>').html('<button id="del" class="btn btn-danger"  type="button"ng-click="deleteentry(' + row.getIndex() + ')"><i class="fa fa-trash"></i></button>'))($scope)//row.getData().contactUserId 
                        // );
                        try {
                            usersTags.push(row.getData().contactTag);
                            if (row.getData().userRole == null) {
                                usersRoles.push(0);
                            }
                            else { usersRoles.push(row.getData().userRole); }


                        }
                        catch
                        { }




                    });
                    window["userIds"] = userIds;
                    window["usersRoles"] = usersRoles;
                    window["usersTags"] = usersTags;
                    //update selected row counter on selection change
                    //console.log(users)

                    $("#groupUsers").val(userIds.join());
                    $("#usersTags").val(usersTags.join());

                    $("#usersRoles").val(usersRoles.join());


                },

                rowSelected: function (row) {
                    // console.log(row.getData().isExist, 'row selected');
                    var alreadyexist = row.getData().isExist;
                    if ($stateParams.groupId) {
                        $scope.isEdit = true;
                    } else {
                        $scope.isEdit = false;
                    }
                    if ($scope.isEdit == true && alreadyexist == 0) {
                        var param = {};
                        param.groupId = $stateParams.groupId
                        param.action = 2;
                        param.userId = row.getData().contactUserId;
                        param.updated_by = $scope.userDetail.Id;
                        param.status = 1;
                        param.contactUserId = row.getData().contactUserId;
                        param.userRole = row.getData().userRole;
                        //console.log(param, 'param')
                        //return false;
                        $rootScope.$emit("ShowLoading");
                        mainService.manageDeletionUserGroup("ManageDeletionUserGroup", param)
                            .then(function (response) {
                                console.log(response, 'ManageDeletionUserGroup');
                                if (response.data != null && angular.isDefined(response.data)) {
                                    var exists = response.data;
                                    console.log(exists.data, 'exists');
                                    if (exists.data.res == 1) {
                                        notifierService.notifyMessage('success', 'updated', exists.data.Message);
                                        tabulator.redraw();
                                        //location.reload();
                                    }

                                    else {
                                        notifierService.notifyMessage('error', 'failed', exists.data.Message);
                                    }

                                }
                                $rootScope.$emit("HideLoading");

                            }, function (err) {
                                $rootScope.$emit("HideLoading");
                                console.log("some error occured." + err);
                            });
                    }

                    //row - row component for the selected row
                },
                rowDeselected: function (row) {
                    console.log(row.getData(), 'row deselected');
                    if ($stateParams.groupId) {
                        $scope.isEdit = true;
                    } else {
                        $scope.isEdit = false;
                    }
                    if ($scope.isEdit == true) {
                        var param = {};
                        param.groupId = $stateParams.groupId
                        param.action = 7;
                        param.userId = row.getData().contactUserId;
                        param.updated_by = $scope.userDetail.Id;
                        param.status = 0;
                        param.contactUserId = row.getData().contactUserId;
                        param.userRole = row.getData().userRole;
                        console.log(param, 'param')
                        $rootScope.$emit("ShowLoading");
                        mainService.manageDeletionUserGroup("ManageDeletionUserGroup", param)
                            .then(function (response) {
                                console.log(response, 'ManageDeletionUserGroup');
                                if (response.data != null && angular.isDefined(response.data)) {
                                    var exists = response.data;
                                    console.log(exists.data, 'exists');
                                    if (exists.data.res == 1) {
                                        notifierService.notifyMessage('success', 'updated', exists.data.Message);
                                        tabulator.redraw();
                                    }

                                    else {
                                        notifierService.notifyMessage('error', 'failed', exists.data.Message);
                                    }

                                }
                                $rootScope.$emit("HideLoading");

                            }, function (err) {
                                $rootScope.$emit("HideLoading");
                                console.log("some error occured." + err);
                            });
                    }

                },
                cellEdited: function (cell) {

                    console.log(cell.getRow().getData());
                    // updating Contact Tag ...
                    var param = {};
                    param.action = 11;
                    param.userId = $scope.userDetail.Id;
                    param.contactUserId = cell.getRow().getData().contactUserId;
                    param.contactUserTag = cell.getValue();
                    var columnName = cell.getColumn().getField();
                    if (columnName == "contactTag") {
                        $rootScope.$emit("ShowLoading");
                        mainService.manageGroups("ManageGroups", param)
                            .then(function (response) {
                                if (response.data != null && angular.isDefined(response.data)) {
                                    var exists = response.data[0];
                                    if (exists.res == 1)
                                        notifierService.notifyMessage('success', 'updated', exists.Message);
                                    else
                                        notifierService.notifyMessage('error', 'failed', exists.Message);
                                }
                                $rootScope.$emit("HideLoading");

                            }, function (err) {
                                $rootScope.$emit("HideLoading");
                                console.log("some error occured." + err);
                            });


                    }
                    else if (columnName == "userRole") {
                        var rolename = "";
                        var getRole = cell.getRow().getData().userRole;
                        if (getRole == null || getRole == 0) {
                            rolename = " (General User)";
                        }
                        if (getRole == 1) {
                            rolename = " (Supervisor)";
                        }
                        if (getRole == 2) {
                            rolename = " (Admin)";
                        }
                        if (getRole == 3) {
                            rolename = " (Super User)";
                        }
                        var result = $scope.selecetedContact.map(el => el.contactUserId == cell.getRow().getData().contactUserId);
                        var objIndex = $scope.selecetedContact.findIndex((obj => obj.contactUserId == cell.getRow().getData().contactUserId));
                        $scope.selecetedContact[objIndex].rolename = rolename;
                        $scope.selecetedContact[objIndex].roleId = getRole;
                        $rootScope.safeApply();
                        var user_role = cell.getRow().getData().contactUserName + rolename;

                        var groupParam = {};
                        groupParam.action = 21;
                        groupParam.groupId = $stateParams.groupId;
                        if ($scope.isSubGroup) {
                            groupParam.masterGroupId = $scope.subGroup;
                        }
                        groupParam.created_by = $scope.userDetail.Id;
                        groupParam.updated_by = $scope.userDetail.Id;
                        groupParam.userId = $scope.userDetail.Id;
                        groupParam.contactUserId = cell.getRow().getData().contactUserId;
                        groupParam.userRole = getRole;
                        var isSuperUserAssigned = false;
                        angular.forEach($scope.selecetedContact, function (value, key) {
                            if (value.roleId == 3) {
                                isSuperUserAssigned = true;
                            }

                        });
                        if (!isSuperUserAssigned) {
                            notifierService.notifyMessage('warning', 'failed', 'No User selected as  Super User ');
                            $rootScope.safeApply();
                            return;
                        }
                        else {
                            $scope.manageGroup(groupParam);
                        }

                        // 
                        //$("#select-stats").append(
                        //    $('<span id="sp_' + cell.getRow().getData().contactUserId + '">', { 'class': 'd-flex justify-content-between align-items-center' }).append(
                        //        user_role,
                        //        $compile(
                        //            $('<span>').html('<button id="del" class="btn btn-danger mb-1 mr-0 ml-2 btn-sm"  type="button"ng-click="deleteentry(' + cell.getRow().getData().contactUserId + ')"><i class="fa fa-trash"></i></button>'))($scope)

                        //    )
                        //    // .text(user_role)


                        //);
                    }

                },

            });

        $scope.selectAll = function () {
            tabulator.selectRow();
        };
        $scope.deleteentry = function (rowindex) {
            tabulator.deselectRow(rowindex);
        }
        $scope.deSelectAll = function () {
            tabulator.deselectRow();
        };

        $scope.checkSuperUser = function () {

            console.log(a);

        };

        $scope.init = function () {
            var webActions = '<div class="pull-right text-right rightbtn">\n\
                            <a href="#/" class="btn btn-primary pull-left redirectMenuPage" title="Home"><i class="fa fa-home"></i></a>\n\
                            <a href="#/chat/summary" class="btn btn-primary pull-left chatSummary" title="Chat"><i class="fa fa-commenting"></i ></a >\n\  \n\ </div > ';
            $(".card-header").append(webActions);
            bootbox.hideAll();
            $scope.groupParam = {};
            $scope.groupParam.status = "1";
            if ($stateParams.groupId) {
                $scope.isEdit = true;
            } else {
                $scope.isEdit = false;
            }


            if ($scope.isEdit == true) {
                $('#btnSubmit').html('Update');
                // $('#menuName').text('Edit Group');
                //$.post($scope.currentUrl + "/ManageGroups",
                //    {
                //        "action": 7,
                //        "groupId": $stateParams.groupId
                //    },
                //    function (data, status) {

                //        $scope.commonDetails.groupName = data[0].groupName;
                //        if (data[0].masterGroupId != null && data[0].masterGroupId != '') {
                //            //  $('#menuName').text('Edit SubGroup');
                //            //$('#lbGroupName').text('SubGroup Name');
                //            //$('#lbGroupIcon').text('SubGroup Icon');
                //            //$('#lbGroupUsers').text('SubGroup Users');
                //            $('#groupName').val(data[0].groupName);
                //            $scope.groupParam = data[0];
                //        }
                //        else {
                //            $('#groupName').val(data[0].groupName);
                //            $scope.groupParam = data[0];

                //        }


                //        var a = [];
                //        if (data[0].groupIcon != null && data[0].groupIcon != '')
                //            a = data[0].groupIcon.split('/');

                //        if (a.length < 6) { }
                //        else {
                //            //$('#uploadPreview').src = $scope.baseurl + a[1] + '/' + a[2];

                //            $("#divImg").removeClass("hidden");
                //            $('#uploadPreview').attr('src', $scope.baseurl + a[1] + '/' + a[2] + '/' + a[3] + '/' + a[4] + '/' + a[5]);
                //            $scope.groupParam.groupIcon = data[0].groupIcon;
                //        }

                //        if (data[0].status == 1) { $("#status option[value='1']").prop('selected', true); }
                //        else { $("#status option[value='0']").prop('selected', true); }

                //        if (data[0].masterGroupId != null || data[0].masterGroupId != '' || data[0].masterGroupId != 'undefined') {
                //            $scope.isSubGroup = true;
                //            $scope.subGroup = data[0].masterGroupId;
                //        }
                //        else
                //            $scope.isSubGroup = false;

                //    });



                var param1 = {};
                param1.action = 7;
                param1.groupId = $stateParams.groupId;
                $rootScope.$emit("ShowLoading");
                mainService.manageGroups("ManageGroups", param1)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {

                            //console.log(response.data);

                            $scope.commonDetails.groupName = response.data[0].groupName;
                            if (response.data[0].masterGroupId != null && response.data[0].masterGroupId != '') {
                                //  $('#menuName').text('Edit SubGroup');
                                //$('#lbGroupName').text('SubGroup Name');
                                //$('#lbGroupIcon').text('SubGroup Icon');
                                //$('#lbGroupUsers').text('SubGroup Users');
                                $('#groupName').val(response.data[0].groupName);
                                $scope.groupParam = response.data[0];
                            }
                            else {
                                $('#groupName').val(response.data[0].groupName);
                                $scope.groupParam = response.data[0];

                            }


                            var a = [];
                            if (response.data[0].groupIcon != null && response.data[0].groupIcon != '')
                                a = response.data[0].groupIcon.split('/');

                            if (a.length < 6) { }
                            else {
                                //$('#uploadPreview').src = $scope.baseurl + a[1] + '/' + a[2];

                                $("#divImg").removeClass("hidden");
                                $('#uploadPreview').attr('src', $scope.baseurl + a[1] + '/' + a[2] + '/' + a[3] + '/' + a[4] + '/' + a[5]);
                                $scope.groupParam.groupIcon = response.data[0].groupIcon;
                            }
                            if (response.data[0].groupIcon != "" && response.data[0].groupIcon != null && response.data[0].groupIcon != undefined) {
                                $("#divImg").removeClass("hidden");
                                $scope.PreviewImage = response.data[0].groupIcon;
                            }

                            console.log(response.data[0].status);
                            setTimeout(function () {
                                if (response.data[0].status === 1) {
                                    $("#status option[value='1']").prop('selected', true);
                                }
                                else {
                                    $("#status option[value='0']").prop('selected', true);
                                }
                                //$("#status option[value='1']").prop('selected', true);;
                            }, 1000);



                            if (response.data[0].masterGroupId != null || response.data[0].masterGroupId != '' || response.data[0].masterGroupId != 'undefined') {
                                $scope.isSubGroup = true;
                                $scope.subGroup = response.data[0].masterGroupId;
                            }
                            else
                                $scope.isSubGroup = false;

                        }
                        $rootScope.$emit("HideLoading");

                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });











                var _Action = 6;
                var _GroupIdParam = $stateParams.groupId;

                if ($stateParams.isSubGroup) {
                    _Action = 14;
                    _GroupIdParam = $stateParams.groupId;
                }

                $.post($scope.currentUrl + "/ManageUserContact", {
                    "action": _Action,
                    "userId": $scope.userDetail.Id,
                    "groupId": _GroupIdParam
                }, function (data, status) { tabulator.setData(data); });
                $rootScope.safeApply();
            }
            else if ($stateParams.masterGroupId) {
                $scope.isSubGroup = true;
                $scope.subGroup = $stateParams.masterGroupId;
                //$('#menuName').text('Create Subgroup');
                //$('#lbGroupName').text('SubGroup Name');
                //$('#lbGroupIcon').text('SubGroup Icon');
                //$('#lbGroupUsers').text('SubGroup Users');
                var paramTemp = {};
                paramTemp.action = 7;
                paramTemp.groupId = $stateParams.masterGroupId;
                $scope.manageGroup($scope.groupParam);
                $.post($scope.currentUrl + "/ManageUserContact", { "action": 8, "groupId": $stateParams.masterGroupId, "userId": $scope.userDetail.Id }, function (data, status) { tabulator.setData(data); });
            }
            else {
                if ($stateParams.isSubGroup) {
                    $.post($scope.currentUrl + "/ManageUserContact", { "action": 14, "groupId": $stateParams.masterGroupId, "userId": $scope.userDetail.Id }, function (data, status) { tabulator.setData(data); });
                }
                else
                    $.post($scope.currentUrl + "/ManageUserContact", { "action": 4, "userId": $scope.userDetail.Id }, function (data, status) { tabulator.setData(data); });

            }
        }
        $scope.initLabelParams = function () {

            if ($stateParams.groupId)
                $scope.PageRole = 0;  //Role==0   // for edit group
            else if ($stateParams.masterGroupId)
                $scope.PageRole = 1;   //Role==1 // for  create subGroup
            else
                $scope.PageRole = 2;  // Role==2 // for  create Group
        }
        $scope.onChangeStatus = function (paramGroup) {
            $scope.groupParam.status = paramGroup.status;
        }

        $scope.onSubmit = function () {



            var userIds = window["userIds"];

            if (userIds == null || userIds.length == 0) {
                alert('please select at least one user');
                return;
            }

            if (DataService.isEmpty($scope.groupParam.groupName)) {
                alert('Group Name is required')
                return;
            }



            $scope.groupParam.userGroupId = userIds;
            if (!$scope.isEdit) {
                $scope.groupParam.groupId = 0;  // set groupId==0 in case of create 
                $scope.groupParam.action = 1;
            } else {
                $scope.groupParam.action = 2;
                $scope.groupParam.groupId = $stateParams.groupId; // set groupId==$stateParam  in case of Edit
            }
            if ($scope.isSubGroup) {
                $scope.groupParam.masterGroupId = $scope.subGroup;
            }
            var element = document.getElementById("uploadImage").files;
            if (element.length > 0)
                $scope.groupParam.groupIcon = "/uploadImages/users/" + $stateParams.groupId + "/groups/" + element[0].name;

            $scope.groupParam.created_by = $scope.userDetail.Id;
            $scope.groupParam.updated_by = $scope.userDetail.Id;
            $scope.groupParam.userId = $scope.userDetail.Id;
            if ($scope.isEdit == true) {
                $scope.groupParam.usersTags = window["usersTags"];
                $scope.groupParam.usersRoles = window["usersRoles"];

                $scope.groupParam.isEdit = true;
                //console.log('userRoles are =' + $scope.groupParam.usersRoles);
                var roles = window["usersRoles"];
                //console.log(roles);

                var isSuperUserAssigned = false;
                angular.forEach(roles, function (value, key) {
                    if (value == 3) {
                        isSuperUserAssigned = true;
                    }

                });
                if (!isSuperUserAssigned) {

                    notifierService.notifyMessage('error', 'failed', 'No User selected as  Super User ');
                    return;
                }


                // angular.forEach()



            }
            //console.log($scope.groupParam);
            $scope.manageGroup($scope.groupParam);
        }


        $scope.manageGroup = function (groupsParamData) {
            var param = {};
            param = groupsParamData;
            $rootScope.$emit("ShowLoading");
            mainService.manageGroups("ManageGroups", param)
                .then(function (response) {
                    console.log(response.data);
                    if (response.data != null && angular.isDefined(response.data)) {

                        if (param.action == 1 || param.action == 2 || param.action == 21) {
                            var exists = response.data[0];
                            if (exists.res == 1) {
                                if ($scope.isEdit == true)
                                    notifierService.notifyMessage('success', 'group  updated ', exists.Message);
                                else
                                    notifierService.notifyMessage('success', 'group  created ', exists.Message);
                                //$scope.upload("uploadPreview");

                                //location.reload();
                                //$state.go("grouplist", { reload: true, inherit: false });

                            }
                            else
                                notifierService.notifyMessage('error', 'failed', exists.Message);
                        }
                        else {
                            var tempData = response.data;
                            if (!DataService.isEmpty(tempData)) {
                                tempData = tempData[0]
                                if (tempData.masterGroupId != null && tempData.masterGroupId != '')
                                    $scope.groupParam = tempData;
                                else
                                    $scope.groupParam = tempData;
                                var a = [];
                                if (tempData.groupIcon != null && tempData.groupIcon != '')
                                    a = tempData.groupIcon.split('/');
                                if (a.length < 3) { }
                                else {
                                    $("#divImg").removeClass("hidden");
                                    $('#uploadPreview').attr('src', $scope.baseurl + a[1] + '/' + a[2]);
                                    $scope.groupParam.groupIcon = data[0].groupIcon;
                                }
                                if (tempData.masterGroupId != null || tempData.masterGroupId != '' || tempData.masterGroupId != 'undefined') {
                                    $scope.isSubGroup = true;
                                    $scope.subGroup = tempData.masterGroupId;
                                }
                                else
                                    $scope.isSubGroup = false;
                            }
                            $scope.groupParam.status = $scope.groupParam.status.toString();
                        }

                    }
                    $rootScope.$emit("HideLoading");

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        }

        $scope.upload = function (id) {

            var element = document.getElementById(id).files;
            if (angular.isDefined(element)) {
                var fileData = element;
                var fd = new FormData();
                var reqTypeParam = "groups";
                var uid = $scope.userDetail.uid;
                var userId = $scope.userDetail.Id;
                //angular.forEach(fileData, function (value, key) {
                //    console.log(value, key,'fhfhf');
                //    fd.append(key, value);
                //});
                fd.append('file', fileData[0], fileData[0].name);
                //fd.append('file', fileData);
                fd.append('reqType', reqTypeParam);
                fd.append('uid', uid);

                mainService.uploadFile("UploadFile", fd, reqTypeParam, uid, "", "", "", "", false, userId)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            if (angular.isDefined(response.data)) {
                                //console.log("uploaded Successfully");
                                $("input:hidden[name=" + id + "]").attr('value', "");
                                if (response.data.code == 200) {
                                    //console.log("uploaded Successfully")
                                    $("input:hidden[name=" + id + "]").attr('value', response.data.fileUrl);
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

        }



        $scope.Uploadtofolder = function (e) {
            var element = document.getElementById("uploadImage").files;
            //param.uid = $scope.userDetail.uid;
            console.log(element, 'ffff')
            if (element.length > 0)
                // param.userIcon = element[0].name;
                var formData = new FormData();
            var dataformatFile = moment(new Date());
            //+ $scope.userDetail.Id + "_" + dataformatFile.format("DDMMYYYY")
            formData.append('file', element[0], element[0].name);
            formData.append('uid', $scope.userDetail.uid);
            formData.append('folder', "groups");
            $rootScope.$emit("ShowLoading");
            mainService.uploadUserProfile("UploadUserProfile", formData)
                .then(function (response) {
                    $rootScope.$emit("HideLoading");
                    if (response.data != null && angular.isDefined(response.data)) {
                        var result = response.data;
                        console.log(result);
                        if (result.status == 1) {
                            //notifierService.notifyMessage('success', 'picture updated', result.message);
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $("#divImg").removeClass("hidden");
                                $scope.PreviewImage = e.target.result;
                                $scope.$apply();
                            };

                            reader.readAsDataURL(e.target.files[0]);
                        } else {
                            //notifierService.notifyMessage('error', 'failed', result.message);
                        }
                    }

                }, function (err) {
                    console.log("some error occured." + err);
                });
        }

        $scope.initLabelParams();
        $scope.init();
        $scope.setSubGroupName();

    });

}(FormGeneratorApp));