(function () {
    'use strict';

    //records controller

    FormGeneratorApp.controller('DemoCalenderRecordsController', function ($scope, $rootScope, $filter, $http, $location, $window, mainService, $state, $stateParams, DataService, $timeout, notifierService, CookiesPersistenceService, $ngBootbox) {
        var tabulatorChildren = {};
        //var tabulator = '';
        $scope.init = function () {
            $scope.global = $rootScope;
            $scope.filterPopupPlaceHolder = {};
            $scope.formDetailsDataTemp = {};
            $scope.formDetailsDataInfo = {};
            $scope.displayInTabData = {};
            $scope.dataArrayTemp = [];
            $scope.formGroupFilesList = [];
            $scope.formDetails = {};
            $scope.label = {};
            $scope.activityFormId = 0;
            $scope.formfieldsData = [];
            $scope.ResourcefieldsData = [];
            $scope.ActivityFieldsData = [];
            $scope.selectedAxis = {};
            $scope.resultBasket = [];
            $scope.is2D = false;
            window["formGroupKeyList"] = null;

            bootbox.hideAll();
            var formId = $stateParams.formId;
            $scope.id = $stateParams.formId;
            $scope.currentFormId = $stateParams.formId;
            $scope.userDetail = mainService.loginDetails();
            window["EventBasicDetail"] = $scope.manageWindowParams();
            $scope.checkIfToggle();
            $scope.bindDraggable(0, 0);
            //$timeout(function () {

            //}, 200);

            $timeout(function () {
                $scope.getFormDetails();
            }, 800);

            // $scope.toggle();


            $scope.formDataTabulatorTemp = {};
            $scope.totalSelectListTagify = [];
            $scope.formDataTabulatorTempWithoutGroupBy = {};
            $scope.calenderSettingsFormDetailsDataList = [];
            $scope.xaxisFormList = [];
            $scope.yaxisFormList = [];
            $scope.Xdraggables = {};
            $scope.uiConfig = {};
            //$scope.changeTo="";
            var formId = $stateParams.formId;
            $scope.id = $stateParams.formId;
            $scope.getCalenderSettingsFormDetailsData(formId);
            $scope.currentUrl = mainService.getCurrentEndPointUrl();
            $scope.BaseUrl = mainService.getBaseUrl();
            /*Temp list of Event for Filter*/
            $scope.eventListTemp = [];
            /*Selected Tree CheckBoxes to filter Events*/
            $scope.selectedTreeList = [];
            $scope.listTabulator = [];
            $scope.basicViewCalenderDataTemp = {};

            /*Check Default X_Yselection*/
            $scope.isDefaultXYSelection = true;

            $timeout(function () {
                if ($("#form-table").length) {
                    window["popupTabulator"] = initTabulator("form-table", {
                        selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                    });
                }
            }, 450);


        };
        var finalArray = [];
        var popupTabulator = {};
        var tabulator = {};
        $scope.clickonTree = function (formId, key) {
            alert(formId)
        };
        function generateUniqueNumber() {
            return (new Date).getTime() + Math.floor(Math.random() * 899999 + 100000);
        };

        var out = [];
        $scope.getCalenderSettingsFormDetailsData = function (formId) {
            var param = {};
            param.action = 4;
            param.formId = formId;

            $rootScope.$emit("ShowLoading");
            mainService.getCalenderSettingsFormData("getCalenderSettingsFormData", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.calenderSettingsFormDetailsDataList = response.data;
                        //loadcssjsfile("Content/sidebar/js/sidebar-script.js", "js", "sidebarform");
                        $scope.multiDcalendar = false;
                        //console.log($scope.calenderSettingsFormDetailsDataList);
                        if (response.data.length <= 2) {
                            $scope.multiDcalendar = false;
                            // console.log($scope.multiDcalendar,'1D data ');
                        }
                        else {
                            $scope.multiDcalendar = true;
                            // console.log($scope.multiDcalendar,'ND data ');
                        }
                        // $scope.xaxisFormList = angular.copy($scope.calenderSettingsFormDetailsDataList);
                        loadLeftSideMenu(param);
                        $rootScope.$emit("HideLoading");
                    }


                    //else {
                    //$timeout(function(){
                    //console.log('actived')
                    //    console.log( $scope.calenderSettingsFormDetailsDataList);
                    //    },850);
                    //}

                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });

        };

        function loadLeftSideMenu(param) {
            $scope.yaxisFormList = angular.copy($scope.calenderSettingsFormDetailsDataList);
            $scope.yaxisFormList = _.filter($scope.yaxisFormList, function (item) { return item.resourceForm != 0 });
            $scope.yaxisFormListCopy = angular.copy($scope.yaxisFormList);


            angular.forEach($scope.calenderSettingsFormDetailsDataList, function (dataRow, position) {
                //console.log(dataRow);
                if (dataRow.activitiesForm !== 0)
                    $scope.xaxisFormList.push(dataRow);
            });
            var exists = _.findWhere($scope.xaxisFormList, { IsDefault: true });
            if (!DataService.isEmpty(exists)) {
                $scope.xSelection = exists.resourceActivityForm;
                $scope.xSelectionChange($scope.xSelection);
            }
            _.each($scope.calenderSettingsFormDetailsDataList, function (listSettings, setKey) {
                listSettings.majorGroupParseList = "";
                listSettings.formDataListTempList = [];
                var temp = {};
                temp = { "id": setKey.toString(), "parent": "#", "text": listSettings.title };
                listSettings.formDataListTempList.push(temp);
                var mainCount = 0;
                if (!DataService.isEmpty(listSettings.majorGroup)) {
                    if (!Array.isArray(listSettings.majorGroup)) {
                        //listSettings.majorGroup = listSettings.majorGroup.replace('\\"', '').replace('\\"', '').replace("[", "").replace("]", "");
                        listSettings.majorGroupParse = JSON.parse(listSettings.majorGroup);
                        if (Array.isArray(listSettings.majorGroup)) {
                            listSettings.majorGroupParseList = '[' + listSettings.majorGroupParse.join(',') + ']';
                        }
                        else {
                            listSettings.majorGroupParseList = '[' + listSettings.majorGroupParse + ']';
                            //listSettings.majorGroupParse = JSON.parse(listSettings.majorGroupParseList);    
                        }
                    }
                    listSettings.groupByList = {};
                    listSettings.resNew = [];
                    if (listSettings.formDataList.length > 0) {
                        _.each(listSettings.formDataList, function (t) {
                            t.title = t[listSettings.minorGroup];
                        });
                    }
                }
                else {
                    if (listSettings.formDataList.length > 0) {
                        _.each(listSettings.formDataList, function (t) {
                            t.title = t[listSettings.activitiesCategory];
                        });
                    }
                }
                listSettings.res = [];
                _.each(listSettings.majorGroupParse, function (item, itemKey) {
                    listSettings.groupByList = [];
                    if (itemKey == 0) {
                        var uniqData = _.uniq(listSettings.formDataList, item);
                        _.each(uniqData, function (unItem, key) {
                            temp = { "id": key + item, "parent": setKey.toString(), "text": unItem[item] };
                            listSettings.formDataListTempList.push(temp);
                        });
                    }
                });
                //console.log(listSettings.formDataListTempList);
                listSettings.selectedTreeNode = [];
                listSettings.nestedListTree = [];
                $timeout(function () {
                    $("#tree-" + setKey + "").jstree(

                        {

                            "core":
                            {
                                "html_titles": true, "load_open": true,
                                "check_callback": true,
                                "themes": {
                                    "icons": false,
                                    "stripes": true,
                                    "responsive": true,
                                    "dots": false,
                                },
                                'data': function (node, cb, data) {

                                    var urlTemp = "";
                                    if (node.id === '#') {
                                        urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection="a"&selectedRoot=0&query=null' + node.id;
                                    }
                                    else {
                                        $rootScope.$emit("ShowLoading");
                                        var selectedRoot = "";
                                        var previousSelection = "xyz";
                                        var exists = _.findWhere(node, { "id": node.id });
                                        if (DataService.isEmpty(exists))
                                            listSettings.selectedTreeNode.push(node);
                                        if (node.id != "#")
                                            if (listSettings.nestedListTree.length < listSettings.majorGroupParse.length) {
                                                if (listSettings.nestedListTree.length != 0) {
                                                    var indx = _.indexOf(listSettings.majorGroupParse, listSettings.nestedListTree[listSettings.nestedListTree.length - 1].nextField);
                                                    if (indx != -1) {
                                                        var field = listSettings.majorGroupParse[indx + 1];
                                                        selectedRoot = field;
                                                        var exists = _.findWhere(listSettings.nestedListTree, { nextField: field });
                                                        if (DataService.isEmpty(exists)) {
                                                            var queryText = field + " like '%" + node.text + "%'";
                                                            listSettings.nestedListTree.push({
                                                                text: node.text, data: field, nextField: field, query: queryText,
                                                                formId: listSettings.formId,
                                                                FormTableName: listSettings.FormTableName
                                                            });
                                                        }
                                                    }
                                                }
                                                else {
                                                    var queryText = node.original.index + " like '%" + node.text + "%' ";
                                                    selectedRoot = node.original.index;
                                                    listSettings.nestedListTree.push({
                                                        text: node.text, data: node.original.index, nextField: node.original.index, query: queryText
                                                        , formId: listSettings.resourceActivityForm,
                                                        FormTableName: listSettings.FormTableName
                                                    });
                                                }


                                            }
                                        //previousSelection=node.parent;
                                        var query = " ";
                                        if (node.original.index) {
                                            //var exists = _.findWhere(listSettings.nestedListTree, { nextField: node.original.index});                                                   

                                            out = _.uniq(out, "id");
                                            var ddd = $("#tree-" + setKey + "").jstree(true)._model.data;
                                            listSettings.selectListTree = angular.copy(getNestedChildrenNew(ddd, node.parent, node.id));
                                            out = _.uniq(out, "id");
                                            var persistwithoutlist = [];
                                            persistwithoutlist = _.without(out, _.findWhere(out, { id: "#" }));
                                            if (persistwithoutlist.length > 0) {


                                                var exists = _.findWhere(persistwithoutlist, { parent: node.parent });
                                                if (!DataService.isEmpty(exists)) {
                                                    var exists = _.without(persistwithoutlist, _.findWhere(persistwithoutlist, { id: node.parent }));
                                                    _.each(exists, function (ite) {
                                                        var innndx = _.indexOf(persistwithoutlist, ite);
                                                        if (innndx != -1)
                                                            persistwithoutlist.splice(innndx, 1);
                                                    });
                                                }
                                                else {

                                                    var exists = _.without(persistwithoutlist, _.findWhere(persistwithoutlist, { id: node.parent }));
                                                    _.each(exists, function (ite) {
                                                        var innndx = _.indexOf(persistwithoutlist, ite);
                                                        if (innndx != -1)
                                                            persistwithoutlist.splice(innndx, 1);
                                                    });
                                                }
                                            }
                                            persistwithoutlist.push(node);
                                            listSettings.nestedListTree = [];
                                            _.each(persistwithoutlist, function (item) {
                                                if (item.id != "#") {
                                                    var queryText = item.data + " like '%" + item.text + "%' ";
                                                    listSettings.nestedListTree.push({ query: queryText });
                                                }
                                            });


                                            //if (out.length > 0 && out.length>listSettings.nestedListTree.length)
                                            //listSettings.nestedListTree = persistwithoutlist;
                                            //_.each(persistwithoutlist, function (item,key) {
                                            //    var innndx = _.indexOf(out, item);
                                            //    if (innndx!=-1)
                                            //        out.splice(innndx, 1);
                                            //});   


                                            //if (!DataService.isEmpty(exists)) {

                                            //    exists.text = node.original.text;
                                            //    exists.query = exists.nextField + " like '%" + node.original.text + "%' ";
                                            //}
                                        }
                                        else {
                                            //var exists = listSettings.nestedListTree[listSettings.nestedListTree.length-1];  
                                            //if (!DataService.isEmpty(exists)) {
                                            //    exists.text = node.text;
                                            //    exists.query = exists.nextField + " like '%" + node.original.text + "%' ";
                                            //}                                                    
                                        }

                                        //listSettings.selectListTree=[];

                                        _.each(listSettings.nestedListTree, function (item) {

                                            query += item.query + " and ";
                                        });

                                        query = (query.length > 2) ? query.substring(0, query.length - 4) : query;
                                        urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection=' + previousSelection + '&selectedRoot=' + selectedRoot + '&query=' + query + '';
                                    }

                                    $.ajax({
                                        "url": urlTemp,
                                        "data": { "id": node.id },
                                        "success": function (data) {
                                            //console.log(data);
                                            //if (node.id === '#')
                                            //    cb(data);
                                            //else {
                                            var listJson = [];
                                            if (listSettings.formDataList.length > 0) {
                                                //var count = 0; _.each(listSettings.formDataList[0], function (t) { count++; });
                                                // for (var i = 0; i < count; i++) 
                                                //{                                                                 //}


                                                if (node.id == "#") {
                                                    // var index = node.id.split('_');
                                                    // if (parseInt(index[1]) <= listSettings.majorGroupParse.length) {
                                                    var grbp = listSettings.majorGroupParse[0];
                                                    listSettings.groupByList[0] = _.groupBy(listSettings.formDataListGroupBy, grbp);
                                                    _.each(listSettings.groupByList[0], function (t, k) {
                                                        var queryText = "";
                                                        if (node.id != "#")
                                                            queryText = grbp + " like '%" + node.text + "%' ";
                                                        else
                                                            queryText = grbp + " like '%" + k + "%' ";
                                                        listJson.push({
                                                            text: k, children: true, parent: node.parent, data: grbp, index: grbp, query: queryText, formId: listSettings.resourceActivityForm,
                                                            FormTableName: listSettings.FormTableName
                                                        });
                                                    });
                                                    //listSettings.nestedListTree.push({ text: node.text, nextField: listSettings.majorGroupParse[0]});
                                                    //}
                                                } else {


                                                    //if (node.parent.length == listSettings.majorGroupParse.length + 1) {
                                                    if (listSettings.majorGroupParse.length > listSettings.nestedListTree.length) {
                                                        _.each(data, function (itemList, keyl) {
                                                            _.each(itemList, function (t, key) {
                                                                if (!DataService.isEmpty(t))
                                                                    if (t.toString().toLowerCase() == node.text.toLowerCase()) {
                                                                        var indx = _.indexOf(listSettings.majorGroupParse, key);
                                                                        if (indx != -1) {
                                                                            if (listSettings.majorGroupParse.length > (indx + 1)) {
                                                                                var nestedKey = listSettings.majorGroupParse[indx + 1];
                                                                                var que = nestedKey + " like '%" + itemList[listSettings.majorGroupParse[indx + 1]] + "%' ";
                                                                                listJson.push({
                                                                                    text: itemList[listSettings.majorGroupParse[indx + 1]], parent: node.parent, children: true, index: key, query: que, data: nestedKey, formId: listSettings.resourceActivityForm,
                                                                                    FormTableName: listSettings.FormTableName
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                            });
                                                        });
                                                    } else {
                                                        if (!DataService.isEmpty(listSettings.minorGroup))
                                                            if (listSettings.minorGroup.length > 0) {
                                                                listSettings.lastNodeData = angular.copy(data);
                                                                listSettings.limitVal = 2;
                                                                var limitedList = [];
                                                                if (data.length > listSettings.limitVal) {
                                                                    _.each(data, function (itemList, keyl) {
                                                                        if (keyl < 2)
                                                                            limitedList.push(itemList);
                                                                    });



                                                                } else {
                                                                    limitedList = data;
                                                                }
                                                                _.each(limitedList, function (itemList, keyl) {
                                                                    var que = listSettings.minorGroup + " like '%" + itemList[listSettings.minorGroup] + "%' ";
                                                                    listJson.push({
                                                                        text: itemList[listSettings.minorGroup], children: false, index: listSettings.minorGroup, query: que, data: listSettings.minorGroup, formId: listSettings.resourceActivityForm,
                                                                        FormTableName: listSettings.FormTableName
                                                                    });

                                                                    //listJson.push({ children: false, id: 'x', text: '<button>hello</button>' });
                                                                });
                                                                if (data.length > listSettings.limitVal) {
                                                                    listSettings.generateUniqueModel = generateUniqueNumber();
                                                                    listJson.push({ children: false, class: "no_checkbox", id: 'more-button-' + listSettings.generateUniqueModel + '', text: '<a id="more-button-' + listSettings.generateUniqueModel + '" ><i class="fa fa-plus"></i> ' + (data.length - listSettings.limitVal) + ' more</a>' });
                                                                    $timeout(function () {
                                                                        $("#treeIndex").val(setKey)
                                                                        listSettings.lastNodeDataList = [];
                                                                        _.each(listSettings.lastNodeData, function (itemList, keyl) {
                                                                            var fieldKeyData = itemList[listSettings.minorGroup];
                                                                            var que = listSettings.minorGroup + " like '%" + fieldKeyData + "%' ";
                                                                            var firstchr = fieldKeyData.charAt(0).toUpperCase();
                                                                            listSettings.lastNodeDataList.push({
                                                                                text: fieldKeyData, children: false, index: listSettings.minorGroup, query: que, data: listSettings.minorGroup, firstChar: firstchr, formId: listSettings.resourceActivityForm,
                                                                                FormTableName: listSettings.FormTableName
                                                                            });
                                                                        });
                                                                        listSettings.lastNodeDataList = $filter('orderBy')(listSettings.lastNodeDataList, 'firstChar', false);
                                                                        //$scope.lastNodeDataList = _.groupBy($scope.lastNodeDataList,"firstChar");
                                                                        $("*[id*=more-button]").on('click', function () {
                                                                            var title = $(this).closest('.card-header').text().trim().toLowerCase();
                                                                            $scope.getSelectedModelPopData(listSettings);
                                                                        });
                                                                        $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').closest(".jstree-anchor").removeClass('jstree-anchor');
                                                                        $('#more-button-' + listSettings.generateUniqueModel + '').find('> a > .jstree-checkbox').remove();
                                                                    }, 450);

                                                                }


                                                            }

                                                    }


                                                    //} else {
                                                    //    _.each(node.parent, function (pid, pkey) {
                                                    //        if (pid != "#") {

                                                    //        }
                                                    //    });
                                                    //}




                                                }

                                            }
                                            var listJson = _.uniq(listJson, "text");
                                            cb(listJson);
                                            $timeout(function () {
                                                $scope.addSelectedTree(setKey, node)
                                            }, 650);
                                            //if (!node.id.contains("more-button"))
                                            //   $scope.applyCheckBoxesChanges(data, data.selected);
                                            $rootScope.$emit("HideLoading");
                                        }
                                        //cb([{ "id": 1, "text": "Updated Root node", }, { "id": 2, "text": "Updated Child node 1", "parent": 1, "children": true }]);
                                        // }
                                    });

                                    //                                              'url': function (node) {
                                    //                                                  var urlTemp="";
                                    //                                                   if(node.id === '#'){
                                    //                                                       urlTemp = $scope.currentUrl + '/getJSONjsTree?root=0&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection="a"&selectedRoot=0' + node.id;
                                    //                                                      }else{
                                    //                                                       var previousSelection="xyz";
                                    //                                                       listSettings.selectedTreeNode.push(node);
                                    //                                                       //previousSelection=node.parent;
                                    //urlTemp = $scope.currentUrl + '/getJSONjsTree?root=1&title=' + listSettings.title + '&formId=' + param.formId + '&resourceActivityForm=' + listSettings.resourceActivityForm + '&previousSelection=' + previousSelection+'&selectedRoot=' + node.text;
                                    //                                                      }
                                    //                                                  return urlTemp;
                                    //}
                                    //,
                                    //'data': function (node) {
                                    //    return { 'id': node.id };
                                    //}
                                }
                            },
                            "checkbox": {
                                "keep_selected_style": false,
                                "tie_selection": true

                            },
                            "plugins": ["wholerow", "checkbox", "search", "unique", "dnd"],

                            "search": {
                                "case_sensitive": false,
                                "show_only_matches": true
                            }






                            //                        'core': {
                            //                            'data': listSettings.formDataListTempList,
                            //                            callback: {
                            //                                onopen: function (node, tree_obj) {
                            //                                    if (tree_obj.children(node).length == 0) {

                            //                                    }
                            //                       return true;
                            //                                }                                        
                            //}
                            //                        }


                        })
                        .on("changed.jstree", function (e, data) {
                            var i, j, r = [];
                            for (i = 0, j = data.selected.length; i < j; i++) {
                                r.push(data.instance.get_node(data.selected[i]).text);
                            }

                            if (!DataService.isEmpty(data.action) && data.action == "select_node") {
                                $scope.selectedTreeList.push(data.node)

                            } else {
                                var item = _.findWhere($scope.selectedTreeList, { id: data.node.id });
                                if (!DataService.isEmpty(item)) {
                                    var indx = _.indexOf($scope.selectedTreeList, item);
                                    if (indx != -1) {
                                        $scope.selectedTreeList.splice(indx, 1);
                                        // reBindCalender();
                                    }
                                }
                            }

                            var tempListSelected = $("#tree-" + setKey + "").jstree(true).get_selected();
                            var exi = "";
                            if (tempListSelected.length > 0)
                                _.each(tempListSelected, function (item) {
                                    if (!item.contains("more")) {
                                        exi = _.filter(listSettings.selectedTreeNode, function (fil) { return fil == item });
                                        if (DataService.isEmpty(exi))
                                            listSettings.selectedTreeNode.push(item);
                                    }
                                    exi = "";
                                });
                            else
                                listSettings.selectedTreeNode = [];
                            //console.log(listSettings.selectedTreeNode)
                            $rootScope.safeApply();
                            //  if (!data.node.id.contains("more-button"))
                            //$scope.applyCheckBoxesChanges(data, data.selected);

                        })
                        .on("click", ".jstree-icon", function () {
                            $("*[id*=more-button]").find('> a > .jstree-checkbox').closest(".jstree-anchor").removeClass('jstree-anchor');
                            //$('*[id*=more-button]').contents().unwrap();
                            $("*[id*=more-button]").find('> a > .jstree-checkbox').remove();
                            $("*[id*=more-button]").on('click', function () {
                                var title = $(this).closest('.card-header').text().trim().toLowerCase();
                                var id = $("#treeIndex").val();

                                $scope.getSelectedModelPopData($scope.calenderSettingsFormDetailsDataList[id]);
                            });
                            //if (this.parents('.jstree-open').length) {
                            //    console.log('jstree-icon')
                            //}

                        });


                    var to = false;
                    $("#search-input-" + setKey + "").keyup(function () {
                        if (to) { clearTimeout(to); }
                        to = setTimeout(function () {
                            var v = $("#search-input-" + setKey + "").val();
                            $("#tree-" + setKey + "").jstree(true).search(v);
                        }, 250);
                    });


                    $rootScope.safeApply();

                }, 250);
            });
            $timeout(function () {
                $('.sidebar .card-header .arrow').on('click', function () {
                    $(this).closest('.card').find('.card-body').slideToggle();
                    $(this).toggleClass('bottom');
                });
                // $('.search-icon').on('click', function () {
                //   var $this = $(this);
                //$(this).closest('.card').find('.search-filter').slideToggle(function () {
                //    if ($(this).is(':visible')) {
                //        $this.find('i').addClass('fa-times').removeClass('fa-search')
                //    } else {
                //        $this.find('i').addClass('fa-search').removeClass('fa-times')
                //    }
                //});
                // });

            }, 150);
        }
        $scope.getSelectedModelPopData = function (listSettings) {
            if (!DataService.isEmpty(listSettings)) {

                $scope.filterPopupPlaceHolder.title = listSettings.title;
                _.map(listSettings.lastNodeDataList, function (itemmap) {
                    return _.extend(itemmap, { checked: false });
                });
                _.each($scope.selectedTreeList, function (item) {
                    var exists = _.findWhere(listSettings.lastNodeDataList, { text: item.text });
                    if (!DataService.isEmpty(exists))
                        exists.checked = true;
                    else {
                        exists = {};
                        exists.checked = false;
                    }
                });
            }
            $rootScope.safeApply();
            $timeout(function () {
                $scope.lastNodeDataList = listSettings.lastNodeDataList;
                $('#filterModal').modal('show');
            }, 100);
        };

        $scope.searchTabulatorDataInEvent = function (selectedData) {
            //console.log(selectedData)
        };
        $scope.getTabulatorListFromEvents = function (param) {
            var newParam = {};
            newParam.action = 11;
            newParam.formTableColumnNameList = "";
            newParam.formTableColumnData = "";
            if ($scope.listTabulator.length > 0) {
                var temp = $scope.listTabulator[0];
                newParam.searchTextData = temp.searchTextData;
                newParam.fieldLabel = temp.fieldLabel;
                newParam.title = temp.fieldLabel;
                newParam.fieldName = temp.fieldName;
                temp.fieldValidationRuleParse = JSON.parse(temp.fieldValidationRule);
                newParam.formId = temp.fieldValidationRuleParse.reference_form;
            }
            if (param.selectedId != "") {
                var list = window["EventBasicDetail"];
                var rowId = parseInt(param.selectedId);
                var exists = _.findWhere(list.formData.FormDataToOneListDynamic, {
                    Id: rowId
                });
                if (!DataService.isEmpty(exists)) {
                    //  if (newParam.formId == exists.resFormID) {
                    newParam.formGroupKey = exists.formGroupKey;
                    var rowResource = _.findWhere(list.resourceData, {
                        id: exists.resources
                    });
                    if (!DataService.isEmpty(rowResource)) {
                        _.each(rowResource, function (item, key) {
                            if (key != "id" && key != "title") {
                                newParam.formTableColumnNameList += key + ","
                                newParam.formTableColumnData += key + " like '%" + item + "%' and ";
                            }
                        });
                    }
                    //}
                }
            }
            if ($scope.listTabulator.length > 0) {
                newParam.formTableColumnName = $scope.listTabulator[0].searchTextData;

            }

            newParam.formTableColumnData = newParam.formTableColumnData.substring(0, newParam.formTableColumnData.length - 4);
            newParam.formTableColumnNameList = newParam.formTableColumnNameList.substring(0, newParam.formTableColumnNameList.length - 1);

            //$rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            $scope.tabuListLink = newParam;
            $scope.selectedTabulatorList = [];

            $("#strongFormName").remove();


            /* get Student List from one to many controls based*/
            var paramTemp = {};
            paramTemp.action = 4;
            $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
            paramTemp.formGroupKey = $scope.formGroupKey;
            $scope.GetTabOneToManyDynamimc(paramTemp, paramTemp.action);

            //mainService.getFormRecordList("GetFormRecordList", newParam)
            //    .then(function (response) {
            //        if (response.data != null && angular.isDefined(response.data)) {
            //            console.log(response.data)
            //            var formDataTemp = response.data;
            //            $scope.listTabulator[0].formData = formDataTemp;
            //            $scope.listTabulator[0].fieldValidationRuleParse = JSON.parse(temp.fieldValidationRule);
            //            $scope.listTabulator[0].reference_form = newParam.formId;
            //            $scope.listTabulator[0].formDataTemp = angular.copy(formDataTemp);

            //            if (!DataService.isEmpty(formDataTemp)) {
            //                $("#tabuList").empty();
            //                $("#tabuList").append('<strong>' + $scope.listTabulator[0].fieldLabel + '</strong>');
            //                $("#tabuListUl").empty();
            //                _.each($scope.listTabulator[0].formData, function (item) {
            //                    $("#tabuListUl").append('<li><a>' + item.dname + '</a></li>');
            //                });
            //                $("#tabuList").append("<a class='btn btn-primary edit-event' id='tabuListLink' style=' float: right;' title='Edit'> Edit</i></a>");
            //                var newWindow = mainService.getBaseUrl() + "#/form/saveEntry/" + newParam.formId + "?popup=1";



            //                //$("#tabuListLink").attr("href", newWindow);


            //            } else {
            //                $("#tabuListLink").hide();
            //                $("#tabuList").hide();
            //                $("#tabuListUl").hide();
            //            }

            //            $rootScope.safeApply();
            //        }

            //        $rootScope.$emit("HideLoading");
            //    }, function (err) {
            //        $("#tabuListLink").hide();
            //        $rootScope.$emit("HideLoading");
            //        //console.log("some error occured." + err);
            //    });
        };

        $scope.openFormEntry = function (temp) {
            //console.log('openFormEntry');
            var formId = temp.formId;
            var params = windowParams();
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        loadEventTabulator();
                    }, 150);
                }
            }, 500);
        };


        function loadEventTabulator() {
            window["tabulators"] = {};
            var form_id = $scope.tabuListLink.formId;
            loadcssjsfile("assets/js/code/form-entry.js", "js", "entryform")
            $rootScope.safeApply();
            $rootScope.$emit("ShowLoading");
            // one to many form control           
            if (!DataService.isEmpty(form_id)) {
                $timeout(function () {
                    if ($("#form-table").length) {
                        window["popupTabulator"] = initTabulator("form-table", {
                            selectable: $("input[name=multiple_records]").val() !== '1' ? true : 1
                        });

                        saveEventModelpopTabulator();
                    }
                    var param = {};
                    param.action = 2;
                    param.formId = form_id;
                    param.fieldName = "";
                    mainService.getReferralFormFieldsAndData("getReferralFormFieldsAndData", param)
                        .then(function (response) {
                            //console.log(response);
                            $scope.allReferrenceData = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));
                            if (!DataService.isEmpty($scope.allReferrenceData.formDataHeaders)) {
                                var firstName = $scope.allReferrenceData.formDataHeaders[0];
                                $scope.allReferrenceData.groupColumns.name = firstName.field;
                            }
                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                            $timeout(function () {
                                if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                    $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");
                                window["popupTabulator"].setColumns(bindTColumnHeaderTabulator($scope.allReferrenceData.formDataHeaders));
                                window["popupTabulator"].setData($scope.formDataTabulatorTempWithoutGroupBy);

                                getSelectedRows();


                                $("input[name='modal-one-to-many']").val("1");
                                var modal_field_map = "{";
                                _.each($scope.allReferrenceData.groupColumns, function (item, key) {
                                    if (key != "name")
                                        modal_field_map += "'" + key + "':'" + key + "',";
                                    else
                                        modal_field_map += "'" + key + "':'" + item + "',";
                                });
                                modal_field_map = modal_field_map.substring(0, modal_field_map.length - 1);
                                modal_field_map += "}"
                                modal_field_map = modal_field_map.replace(/'/g, '"');
                                $("input[name='modal-field-map']").val(modal_field_map);
                                $("input[name='tabulator-id']").val($scope.tabuListLink.fieldName);
                                window["tabulators"]["formGeneratorTabulator" + $scope.tabuListLink.fieldName] = window["popupTabulator"];
                                $rootScope.$emit("HideLoading");
                            }, 150);
                        }, function (err) {
                            $rootScope.$emit("HideLoading");
                            console.log("some error occured." + err);
                        });
                }, 450);
            }
        }

        function getSelectedRows() {
            if (!DataService.isEmpty($scope.selectedTabulatorList)) {
                _.each($scope.selectedTabulatorList, function (item) {
                    window["popupTabulator"].getRows()
                        .filter(row => row.getData().Id == item.Id)
                        .forEach(row => row.toggleSelect());
                });
            }
        }

        function saveEventModelpopTabulator() {
            /* Save Selected Student*/

            $("#get-tabulator-valuescalender").click(function () {
                var formID = $("#tabulatorModal input[name=formID]").val();
                var oneToMany = $("#tabulatorModal input[name='modal-one-to-many']").val();
                $rootScope.onetomany = $("#tabulatorModal input[name='modal-one-to-many']").val();
                var selectedRows = window["popupTabulator"].getSelectedRows();
                ////console.log(selectedRows);
                if (selectedRows.length > 0) {
                    var selectedData = window["popupTabulator"].getSelectedData();
                    selectedRecordOneToMany = selectedData;
                    ////console.log(selectedData);
                    if (oneToMany === '1') {
                        var tabulatorId = $("#tabulatorModal input[name='tabulator-id']").val();
                        var fieldMap = $("#tabulatorModal input[name='modal-field-map']").val();
                        if (fieldMap != "" && fieldMap.length > 0)
                            fieldMap = JSON.parse(fieldMap);
                        ////console.log(fieldMap);
                        var newTabulator = "formGeneratorTabulator" + tabulatorId;
                        var cols = getTabulatorColDefs(window["popupTabulator"], 1);
                        ////console.log(cols);
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
                            if (!DataService.isEmpty(fieldMap["name"]))
                                record['name'] = data[fieldMap["name"]];
                            record['Id'] = data.Id;
                            record['formGroupKey'] = localStorage.getItem("formGroupKey");
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
                        param.action = 1;
                        param.tabularId = newTabulator;
                        $scope.formGroupKey = $scope.tabuListLink.formGroupKey;
                        $scope.GetTabOneToManyDynamimc(param, param.action);
                        ////console.log(recordArr);

                    } else {
                        var recordArr = getTabulatorColDefs(window["popupTabulator"], 2);
                        selectedData.forEach(function (data) {
                            $.each(data, function (key, value) {
                                if (key === 'id') {
                                    recordArr[key] = value;
                                } else {
                                    if (typeof recordArr[key] !== 'undefined') {
                                        if (typeof recordArr[key]['data'] === 'undefined') {
                                            recordArr[key]['data'] = [];
                                            recordArr[key]['data'].push(value);
                                        } else {
                                            recordArr[key]['data'].push(value);
                                        }
                                    }
                                }
                            });
                        });

                        var records = {};
                        for (var field in recordArr) {
                            if (selectedRows.length > 1) {
                                if ($.inArray(recordArr[field].type, ['text', 'autocomplete', 'date', 'select', 'radio-group', 'checkbox-group', 'file']) !== -1) {
                                    records[field] = recordArr[field].data.join(' | ');
                                }
                                else if (recordArr[field].type === 'textarea') {
                                    records[field] = recordArr[field].data.join('\n\n');
                                }
                                else if (recordArr[field].type === 'number') {
                                    records[field] = recordArr[field].data.reduce(getSum);
                                }
                            } else {
                                if (field != "undefined")
                                    if (typeof recordArr[field] === 'string') {
                                        records[field] = recordArr[field];
                                    } else {
                                        records[field] = recordArr[field].data[0];
                                    }
                            }
                        }
                        selectedRecordOneToMany
                        ////console.log(records);
                        $.each(records, function (i, value) {
                            if ($("input#RowID-" + i).length) {
                                $("input#RowID-" + i).val($.trim(records['id']));
                            }
                            $("input[data-derived='" + i + "']").val(value).change();
                            $("input[data-referral-form-field-name='" + i + "']").val(value);
                            $('#customFormNew').formValidation('revalidateField', $("input[data-derived='" + i + "']").attr('name'));
                            $('#customFormNew').formValidation('revalidateField', $("input[data-referral-form-field-name='" + i + "']").attr('name'));
                            if ($("div#" + i).length) {
                                file_default_value(i, value, uploadPath);
                            }
                            set_reference_field(formID, i, value);
                        });
                    }

                    $('#tabulatorModal').modal('hide');
                } else {
                    alert("Please select some records in tabulator!!");
                }
            });
        }

        $scope.GetTabOneToManyDynamimc = function (param, type) {
            if (!$scope.isEdit && type == 1) {
                param.action = 1;
                if (!DataService.isEmpty($scope.freshEntryformGroupKey))
                    param.formGroupKey = $scope.freshEntryformGroupKey;
                else
                    param.formGroupKey = $scope.formGroupKey;
            }
            else if (type == 2) {
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
            var newParam = angular.copy(param);
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.manageTabOneToMany("ManageTabOneToMany", newParam)
                .then(function (response) {
                    $rootScope.$emit("HideLoading");
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var tempTabulatorData = response.data;
                        if (newParam.action == 4 || newParam.action == 1) {

                            var dataArray = [];
                            var oneToManyTempData = [];
                            if (!DataService.isEmpty(tempTabulatorData)) {
                                angular.forEach(tempTabulatorData, function (item) {
                                    if (!DataService.isEmpty(item.formfieldDataListTemp)) {
                                        var tempData = JSON.parse(item.formfieldDataListTemp)
                                        if (!DataService.isEmpty(tempData)) {
                                            if (tempData.length > 1) {
                                                //tempData.push({
                                                //    "name": "AutoId", "value": item.AutoId
                                                //});
                                                oneToManyTempData = tempData;
                                            } else if (tempData.length == 1) {
                                                //tempData[0].AutoId = item.AutoId;
                                                dataArray.push(tempData[0]);
                                                oneToManyTempData = tempData;
                                            }
                                        }
                                    }
                                });
                                if (!DataService.isEmpty(oneToManyTempData)) {
                                    $("#tabuListUl").empty();
                                    angular.forEach(oneToManyTempData, function (filterData) {
                                        //angular.forEach(filterData, function (item) {    
                                        if (!DataService.isEmpty($scope.tabuListLink.searchTextData) && filterData.name.toLowerCase().indexOf($scope.tabuListLink.searchTextData.toLowerCase()) != -1) {
                                            $("#tabuListUl").append('<li><span>' + filterData.name + ' (ID:' + filterData.Id + ')</span></li>');
                                        }
                                        if (DataService.isEmpty($scope.tabuListLink.searchTextData)) {
                                            $("#tabuListUl").append('<li><span>' + filterData.name + ' (Std ID:' + filterData.Id + ') </span></li>');
                                        }
                                        // });                                      
                                    });
                                    $("#tabuList").empty();
                                    $("#tabuList").append('<strong id="strongFormName">' + oneToManyTempData.length + ' Students in this lesson</strong>');
                                } else {
                                    $("#tabuList").empty();
                                    $("#tabuList").append('<strong id="strongFormName">0 Students in this lesson</strong>');
                                }



                                $scope.selectedTabulatorList = angular.copy(oneToManyTempData);
                                // $scope.formDetailsDataTemp = angular.copy(dataArray);
                                $timeout(function () {
                                    $("#tabuListUl").css("display", "block");
                                }, 100);
                            }
                            else {
                                $("#tabuList").append('<strong id="strongFormName">0 Students in this lesson</strong>');
                            }
                            //console.log(tempTabulatorData);
                            if (!$("body .popover").hasClass("isPopoverLoaded")) {
                                $("#tabuListLink").on("click", function () {
                                    var dialog = $ngBootbox.customDialog({
                                        templateUrl: 'tabulatorModal.html',
                                        scope: $scope,
                                        title: 'Student',
                                        size: "large"
                                    });
                                    loadEventTabulator();
                                    $("body .popover").removeClass('isPopoverLoaded');
                                });
                            }
                        }
                        else if (newParam.action == 5 && $stateParams.popup == 3) {
                            var tempParam = response.data;
                            if (tempParam.length > 0) {
                                var tempData = JSON.parse(tempParam[0].formfieldDataListTemp);
                                $scope.formDataList = tempData;
                            }
                            $scope.bindUpdateControlsNew();
                        }
                        else if (newParam.action == 2) {
                            //var exists = tempTabulatorData[0];
                            //notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                        }
                        else if (newParam.action == 3) {
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
                                tabulator.setData(temp);
                            }, 150);

                            notifierService.notifyMessage('success', 'FormEntry', exists.Message);

                        }
                        if (!DataService.isEmpty(param.fieldName))
                            if (DataService.isEmpty(param.tabularId))
                                param.tabularId = "formGeneratorTabulator" + param.fieldName;
                        if (newParam.action != 4)
                            if (!DataService.isEmpty(param.tabularId))
                                setTimeout(function () { setTabulatorCalc(param.tabularId); }, 500);


                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }



        function bindTColumnHeaderTabulator(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (item, pageKey) {
                var type = item.columnType;
                console.log(item, 'itemsData')
                // angular.forEach(pageData, function (item, key) {
                /// var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
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
                    else {
                        if (DataService.isEmpty(item.Display_tab))
                            finalArray.push({ title: item.title, bottomCalc: showFooter(item), columnType: type, field: item.field, align: "left", headerFilter: "input" });
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
        }


        $scope.rootScopeSafe = function () {
            $rootScope.safeApply();
        };
        $scope.$watchCollection("selectedTreeList", function (newVal, oldVal) {
            // console.log(newVal);
            // if (newVal.length > 0) {
            if (newVal.length != oldVal.length)
                reBindCalender();
            //}
            //else {
            //    if (!DataService.isEmpty($scope.basicViewCalenderDataTemp)) {
            //        $('.calendar').fullCalendar('destroy');
            //        var eventBasicData = window["EventBasicDetail"];
            //        window["EventBasicDetail"] = eventBasicData;
            //        if (!DataService.isEmpty($scope.basicViewCalenderDataTemp.eventData))
            //            loadCalendar('BasicView', $scope.basicViewCalenderDataTemp.eventData, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.basicViewCalenderDataTemp.activityEvents);
            //        $rootScope.safeApply();
            //    }
            //}
        });
        function seperateTitleQuery(item, newFilteredEventList) {
            var queryText = " ";
            var newFilteredEventListgroupBy = _.groupBy(newFilteredEventList, "formId");
            var tempArr = [];
            var count = 0;
            _.each(newFilteredEventListgroupBy, function (itemG, key) {
                tempArr[count] = [];
                _.each(itemG, function (item) {
                    tempArr[count].push(item.text);
                });
                count++;
            });
            var filterList = cartesianList(tempArr);
            _.each(filterList, function (itemUniq) {
                queryText += " ( ";
                if (itemUniq.length > 1) {
                    _.each(itemUniq, function (itemFilter) {
                        queryText += " seperatedTitles like '%" + itemFilter + "%' and  ";
                    });
                    queryText = queryText.substring(0, queryText.length - 5);
                } else {
                    _.each(itemUniq, function (itemFilter) {
                        queryText += " seperatedTitles like '%" + itemFilter + "%' ";
                    });
                }
                queryText += " )      ";
                queryText += " or  ";
            });
            queryText = queryText.substring(0, queryText.length - 4);
            return queryText;
        };
        function reBindCalender() {
            $scope.basicViewCalenderDataTemp.newFilteredEventList = [];
            var whereClouse = " where f.formId=" + $scope.formDetailsDataInfo.formId + " and ";
            var joinClouse = "";
            var FormTableNameTemp = "";
            _.each($scope.selectedTreeList, function (item) {
                if (!DataService.isEmpty(item.original)) {
                    FormTableNameTemp = item.original.FormTableName;

                }
                else {
                    FormTableNameTemp = item.FormTableName;
                }
                var exists = _.findWhere($scope.basicViewCalenderDataTemp.newFilteredEventList, { FormTableName: FormTableNameTemp });
                if (DataService.isEmpty(exists)) {
                    joinClouse += " ";
                    joinClouse += "  left join " + FormTableNameTemp + " on (( CHARINDEX(convert(nvarchar(100), " + FormTableNameTemp + ".formId) , f.seperatedResFormIDs)>0    and CHARINDEX(convert(nvarchar(100), " + FormTableNameTemp + ".Id), f.seperatedResEntryIDs) > 0)    or(CHARINDEX(convert(nvarchar(100), " + FormTableNameTemp + ".formId), f.seperatedFormIDs) > 0 and  CHARINDEX(convert(nvarchar(100), " + FormTableNameTemp + ".Id), f.seperatedIds) > 0) )  "

                }
                if (!DataService.isEmpty(item.original))
                    $scope.basicViewCalenderDataTemp.newFilteredEventList.push(item.original);
                else
                    $scope.basicViewCalenderDataTemp.newFilteredEventList.push(item);
            });
            whereClouse += seperateTitleQuery({}, $scope.basicViewCalenderDataTemp.newFilteredEventList);
            whereClouse = whereClouse.substring(0, whereClouse.length - 5);

            var newParam = {};
            newParam.action = 10;
            newParam.formTableColumnData = joinClouse + whereClouse;
            newParam.formId = $scope.formDetailsDataInfo.formId;
            newParam.FormTableName = $scope.formDetailsDataInfo.FormTableName;
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.getFormRecordList("GetFormRecordList", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        $scope.filterredFormDataTemp = response.data;
                        $('.calendar').fullCalendar('destroy');
                        var eventBasicData = window["EventBasicDetail"];
                        window["EventBasicDetail"] = eventBasicData;
                        console.log('loadCalendar2')
                        loadCalendar('BasicView', $scope.filterredFormDataTemp, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn, $scope.filterredFormDataTemp);
                        $rootScope.safeApply();
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        $scope.updateRowDataRecord = function (param) {
            var newParam = {};
            newParam = angular.copy(param);
            newParam.action = 8;
            newParam.formId = $scope.currentFormId;
            $rootScope.$emit("ShowLoading");
            newParam.created_by = $scope.userDetail.Id;
            newParam.update_by = $scope.userDetail.Id;
            mainService.updateFormRecord("UpdateFormRecord", newParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        var dataTemp = response.data;
                        $rootScope.$emit("HideLoading");
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };

        /*Load Selected tree*/
        $scope.addSelectedTree = function (key, node) {
            if (node.id != "#") {

                if ($("#tree-" + key + "").jstree(true)._model != null && node.state.selected) {
                    var treeData = $("#tree-" + key + "").jstree(true)._model.data;
                    var item = _.where(treeData, { parent: node.id });
                    if (!DataService.isEmpty(item) && item.length > 0) {
                        _.each(item, function (ite) {
                            if (ite.id.contains("more-button") != true)
                                $scope.selectedTreeList.push(ite);
                        });
                        $rootScope.safeApply();
                    }
                }

            }
        }

        $scope.applyCheckBoxesChanges = function (data, type) {
            if (type) {
                var item = _.findWhere($scope.selectedTreeList, { text: data.text });
                if (DataService.isEmpty(item)) {
                    if (!DataService.isEmpty(item))
                        if (item.id.contains("more-button") != true)
                            $scope.selectedTreeList.push(data);
                        else
                            $scope.selectedTreeList.push(data);
                    else
                        $scope.selectedTreeList.push(data);
                }
                else {
                    if (item.id.contains("more-button") != true)
                        $scope.selectedTreeList.push(data);
                }
            } else {
                var item = _.findWhere($scope.selectedTreeList, { text: data.text });
                if (!DataService.isEmpty(item)) {
                    var indx = _.indexOf($scope.selectedTreeList, item);
                    if (indx != -1)
                        $scope.selectedTreeList.splice(indx, 1);
                }
            }
            $rootScope.safeApply();
            _.each($scope.calenderSettingsFormDetailsDataList, function (listSettings, setKey) {
                if ($("#tree-" + setKey + "").jstree(true)._model != null) {
                    var ddd = $("#tree-" + setKey + "").jstree(true)._model.data;
                    //console.log(listSettings.selectedTreeNode)
                }
            });

        };

        function getChildList(treeNodeList, listindex, selected) {
            var temp = [];
            var list = $scope.calenderSettingsFormDetailsDataList[listindex];
            var exist = list.formDataList;
            var existslist = _.findWhere(treeNodeList._model.data, { id: treeNodeList._data.core.focused });

            return exist;
        }

        function findTextList(formDataList, selectText, parentId) {
            var temp = [];
            _.each(formDataList, function (item, key) {
                _.each(item, function (item1) {
                    if (item1.toLowerCase() == selectText.toLowerCase()) {
                        //var temp1 = { "id": key, "parent": parentId.toString(), "text":  };
                        temp.push()
                    }
                });
            });

            return temp;
        };

        function getNestedChildrenNew(arr, parent, current, list) {
            var count = arr.length;
            // if (parent!="#"){
            var parentExists = _.findWhere(arr, { id: parent });
            if (!DataService.isEmpty(parentExists)) {
                //var parentExistsChild = _.findWhere(arr, { id: current });
                //if (!DataService.isEmpty(parentExists)) {
                //    var alext = _.findWhere(out, { id: current });
                //    if (DataService.isEmpty(alext))
                //    //out.push(parentExistsChild)
                //}               
                var alext1 = _.findWhere(out, { id: parent });
                if (DataService.isEmpty(alext1))
                    out.push(parentExists);
                getNestedChildrenNew(arr, parentExists.parent, parentExists.id);
            }
            // }
        }

        function getNestedChildren(arr, parent) {
            var out = []
            var key = keyList[idex];
            for (var i = 0; i < count; i++) {
                if (arr[i][key] == parent) {

                    if (len > idex + 1)
                        var children = getNestedChildren(arr, arr[i][keyList[idex + 1]], keyList, idex + 1, len)
                    if (children) {
                        arr[i].children = children
                    }

                    out.push(arr[i])
                }
            }

            return out
        }

        $scope.customGroupfilter = function (item) {
            return true;
        };

        $scope.filterList = function (text, list) {
            var temp = [];
            _.each(list, function (item) {
                _.each(item, function (item1, key1) {
                    if (!DataService.isEmpty(item1))
                        if (item1.toLowerCase() == text.toLowerCase())
                            temp.push(item);
                });
            });
            return temp;
        };

        $scope.expendGroup = function (keyitem, itemdata, maillist, list) {
            // alert(itemdata)
            maillist[keyitem].isClick = true;
            if (maillist[keyitem].selected) {
                maillist[keyitem].nestedHtml = "";
                var indx = _.indexOf(list.majorGroupParse, list.groupBy);
                if (indx != -1) {
                    maillist[keyitem].nestedHtmlList = $scope.filterList(maillist[keyitem].selectedValue, list.formDataList);
                    maillist[keyitem].nestedHtmlListGroupby = _.groupBy(maillist[keyitem].nestedHtmlList, list.majorGroupParse[indx + 1]);

                    _.each(maillist[keyitem].nestedHtmlListGroupby, function (item, key) {
                        maillist[keyitem].nestedHtml += "<div>  <br />  <input type='checkbox' ng-model='value.selected' ng-change='value.selectedValue = keyitem; expendGroup(keyitem, value, nlist, list)' /> <b>" + key + " -- {{value.isClick}}</b>  <br /></div>";
                    })
                }
            }
            $timeout(function () {
                $rootScope.safeApply();
            }, 150);
            //console.log(itemdata);

            //_.each(maillist.majorGroupParse,function(item,key){
            //    if (key != 0) {
            //        maillist.ulliHtml="";
            //        var listGroup = _.groupBy(maillist.formDataListGroupBy, item);
            //        _.each(listGroup, function (itemgroup, keyg) {
            //            maillist.ulliHtml += "<ul>  " + keyg;


            //            maillist.ulliHtml += "</ul>";
            //        });
            //    }
            //});


        }

        $scope.xSelectionChange = function (formId) {

            //console.log($scope.xaxisFormList);
            //filter activity draggables based on x id .
            //var allData = $scope.calenderSettingsFormDetailsDataList;
            $rootScope.$emit("ShowLoading");
            $scope.selectedAxis.xSelected = formId;
            var dataTitle = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: formId });
            window["xTitle"] = dataTitle.title.toString();
            window["xSelected"] = formId;
            /*y Axis Selection*/
            if (formId != 0) {
                $scope.yaxisFormList = _.filter($scope.yaxisFormListCopy, function (item) { return item.resourceActivityForm != formId });
                if ($scope.yaxisFormList.length > 0 && $scope.isDefaultXYSelection == true) {
                    var exists1 = _.findWhere($scope.yaxisFormList, { IsDefault: true });
                    if (!DataService.isEmpty(exists1)) {
                        $scope.ySelection = exists1.resourceActivityForm;
                        $scope.ySelectionChange(exists1.resourceActivityForm);
                    }
                    else {
                        $scope.ySelection = $scope.yaxisFormList[0].resourceActivityForm;
                        $scope.ySelectionChange($scope.yaxisFormList[0].resourceActivityForm);
                    }
                    $scope.isDefaultXYSelection = false;
                } else if ($scope.ySelection == formId) {
                    $scope.ySelection = $scope.yaxisFormList[0].resourceActivityForm;
                    $scope.ySelectionChange($scope.yaxisFormList[0].resourceActivityForm);
                }
            }
            $scope.arrangeDraggables(formId);
            $rootScope.$emit("HideLoading");

        };

        $scope.ySelectionChange = function (formId) {
            try {
                // alert(formId);
                $scope.selectedAxis.ySelected = formId;
                var resTitle = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: formId });
                window["yTitle"] = resTitle.title.toString();
                window["ySelected"] = formId;

                if ($scope.selectedAxis.xSelected !== null && typeof $scope.selectedAxis.xSelected !== "undefined") {
                    $scope.arrangeDraggables($scope.selectedAxis.xSelected);
                }
                $scope.filterEvents("Yddl");

                if ($scope.selectedTreeList.length > 0) {
                    reBindCalender();
                }
            }
            catch (e) {
                console.log(e);
            }
        }


        $scope.arrangeDraggables = function (formId) {

            try {
                //var is2D = false;
                var formData = _.findWhere($scope.xaxisFormList, { activitiesForm: formId });

                //resData  with same formId.  for getting resColum(minor Group) textField.
                var resData = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: $scope.ySelection });
                var resData2 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: formId });
                var resData3 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
                //checking if  2D.
                if ($scope.calenderSettingsFormDetailsDataList.length == 2 && (resData == undefined || resData2 == undefined)) {
                    $scope.is2D = true;
                    resData = _.findWhere($scope.calenderSettingsFormDetailsDataList, { activitiesForm: formId });
                    resData2 = _.findWhere($scope.calenderSettingsFormDetailsDataList, { resourceForm: $scope.ySelection });
                }

                if (!DataService.isEmpty(formData))
                    $scope.selectedAxis.selectedFormName = formData.title;
                $scope.Xdraggables.draggableSlips = [];
                var draggables = [];
                // angular.forEach(allData, function (dataRow, position) {
                //console.log(dataRow);
                //   if (dataRow.activitiesForm == formId) {
                var activityField = formData.activities;
                var activityCategory = formData.activitiesCategory;
                var durationField = formData.durationField;
                var colorField = formData.colorField;

                var minorGroupAsRes = resData2.minorGroup;
                var majorGroup = resData2.majorGroup;
                if (majorGroup != undefined) {
                    majorGroup = majorGroup.replace('[', '').trim();
                    majorGroup = majorGroup.replace(']', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                    majorGroup = majorGroup.replace('"', '').trim();
                }
                majorGroup = majorGroup.split(',');


                //major/ minor  group resource

                var resMinor = resData3.minorGroup;
                var resMajorGroup = resData3.majorGroup;
                if (resMajorGroup != undefined) {
                    resMajorGroup = resMajorGroup.replace('[', '').trim();
                    resMajorGroup = resMajorGroup.replace(']', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                    resMajorGroup = resMajorGroup.replace('"', '').trim();
                }
                resMajorGroup = resMajorGroup.split(',');



                angular.forEach(formData.formDataList, function (entryRow, Key) {
                    var _arr = {};
                    _arr.Id = entryRow["id"];
                    _arr.durationField = entryRow[durationField];
                    _arr.formId = formId;
                    _arr.color = entryRow[colorField];
                    _arr.category = activityCategory;
                    _arr.servicefield = activityCategory;
                    _arr.value = entryRow[activityField];


                    //for create drop 
                    // we need y selection fields to create background  entry.
                    if (!$scope.is2D) {

                        _arr.activityField = resData.activities;
                        _arr.categoryField = majorGroup[majorGroup.length - 1] //resData.activitiesCategory;
                        _arr.colorField = resData.colorField;
                        _arr.dropIn = entryRow[resData2.minorGroup];
                        _arr.displayValue = entryRow[majorGroup[0]].toString() + " - " + entryRow[minorGroupAsRes].toString();
                        _arr.dimensionType = "ND";

                        //all values of grouping from same resource form . (applicable --->from activity to resource )
                        //start
                        var groupingValuesActivity = "";
                        if (majorGroup !== undefined && majorGroup.length > 0) {
                            angular.forEach(majorGroup, function (value1, pos) {
                                if (groupingValuesActivity == "")
                                    groupingValuesActivity = entryRow[resData2.minorGroup].toString() + " - " + entryRow[value1].toString();
                                else
                                    groupingValuesActivity += " - " + entryRow[value1].toString();

                            })
                        }
                        _arr.groupingValuesActivity = groupingValuesActivity;
                        // end

                        //all grouping fields for background label creating from resource to activity(applicable ---> from resource to activity).
                        var groupingFieldsRes = "";
                        if (resMajorGroup !== undefined && resMajorGroup.length > 0) {
                            angular.forEach(resMajorGroup, function (value1, pos) {
                                if (groupingFieldsRes == "")
                                    groupingFieldsRes = resMinor + " - " + value1.toString();
                                else
                                    groupingFieldsRes += " - " + value1.toString();

                            })
                        }
                        _arr.groupingFieldsRes = groupingFieldsRes;



                    }
                    else {//for 2D
                        // rgb(192, 192, 192)
                        _arr.activityField = "";
                        _arr.categoryField = "" //resData.activitiesCategory;
                        _arr.colorField = "";
                        _arr.dropIn = "";
                        _arr.dimensionType = "2D";
                        _arr.displayValue = entryRow[activityField].toString();

                    }


                    draggables.push(_arr);
                    //console.log(entryRow[activityField]);
                });
                // }
                //});;
                draggables = $filter('orderBy')(draggables, 'displayValue', false);
                //draggables = _.uniq(draggables, "durationField");
                //console.log('drag data is : ')
                //console.log(draggables);
                $scope.Xdraggables.draggableSlips = draggables;
                $scope.filterEvents("xddl");
                $timeout(function () {
                    $('.external-events-list .fc-event').each(function () {

                        $(this).data('event', {

                            title: $.trim($(this).text()), // use the element's text as the event title
                            color: $.trim($(this).data('color')),
                            duration: $.trim($(this).data('duration')),
                            stick: false, // maintain when user navigates (see docs on the renderEvent method)
                            id: $.trim($(this).data('id')),
                            formid: $.trim($(this).data('formid')),
                            activityfield: $.trim($(this).data('activityfield')),
                            colorfield: $.trim($(this).data('colorfield')),
                            categoryfield: $.trim($(this).data('categoryfield')),
                            servicefield: $.trim($(this).data('servicefield')),
                            dropin: $.trim($(this).data('dropin')),
                            dimensiontype: $.trim($(this).data('dimensiontype')),
                            groupingvaluesact: $.trim($(this).data('groupingvaluesact')),
                            groupingfieldsres: $.trim($(this).data('groupingfieldsres')),



                        });




                        $(this).draggable({
                            zIndex: 999,
                            revert: true,      // will cause the event to go back to its
                            containment: ".table-responsive", scroll: true,
                            revertDuration: 0,  //  original position after the drag
                            stop: function () {
                                //console.log($(this));
                                // is the "remove after drop" checkbox checked?
                                if ($('#drop-remove').is(':checked')) {
                                    // if so, remove the element from the "Draggable Events" list
                                    $(this).remove();
                                }
                            }
                        });

                    })
                }, 500);


            }
            catch (e) {
                console.log(e);
            }
        }

        $scope.filterEvents = function (reqFrom) {

            // $scope.bindDraggable($scope.selectedAxis.xSelected,$scope.selectedAxis.ySelected);
            //if(reqFrom=="Yddl")
            //{

            // $rootScope.$emit("ShowLoading");
            var _allEvents = window["CalendarEventList"];
            //console.log(_allEvents);
            $scope.resultBasket = [];
            var resResults = [];
            var resColumns = [];

            var activityResults = [];
            var activityColumns = [];
            var activities = [];
            var _AllFilterData = $scope.calenderSettingsFormDetailsDataList;
            console.log(_AllFilterData, '_AllFilterData');
            angular.forEach(_AllFilterData, function (row, position) {


                if (row.activitiesForm != 0) {
                    var _Arr = {};
                    _Arr["activitiesForm"] = row.activitiesForm;
                    _Arr["activities"] = row.activities;
                    activities.push(_Arr);
                }

            });
            if (typeof _allEvents !== "undefined") {
                var param = {};
                param.action = 9;
                param.formId = $stateParams.formId;
                param.resourceForm = $scope.selectedAxis.ySelected
                param.activitiesForm = $scope.selectedAxis.xSelected
                $rootScope.$emit("ShowLoading");
                mainService.getCalenderSettingsFormData("getAxisColumns", param)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            console.log(response.data, 'getAxisColumns');
                            var _resFields = response.data.resfields;
                            var _actFields = response.data.activityFields;
                            var _colGroupingData = response.data.colGrouping;
                            window["colGrouping"] = _colGroupingData;
                            angular.forEach(_resFields, function (row, position) {
                                var _Arr = {};
                                _Arr["field"] = row.fieldName;
                                _Arr["labelText"] = row.fieldLabel;
                                resColumns.push(_Arr);
                            });
                            angular.forEach(_actFields, function (row, position) {
                                var _Arr = {};
                                _Arr["field"] = row.fieldName;
                                _Arr["labelText"] = row.fieldLabel;

                                activityColumns.push(_Arr);
                            });
                            //console.log(resColumns);
                            //console.log(activityColumns);

                            //filter resData
                            angular.forEach(_AllFilterData, function (dataRow, position) {
                                //console.log(dataRow);
                                if (dataRow.resourceForm == $scope.selectedAxis.ySelected && dataRow.resourceForm !== 0) {
                                    resResults = dataRow.formDataList;

                                }
                                if (dataRow.activitiesForm == $scope.selectedAxis.xSelected && dataRow.activitiesForm !== 0) {
                                    activityResults = dataRow.formDataList;

                                }
                            });

                            if (!$scope.is2D) {
                                angular.forEach(_allEvents, function (dataRow, position) {
                                    ////console.log(dataRow);
                                    //if (dataRow.actFormID == $scope.selectedAxis.xSelected || (dataRow.actFormID !== $scope.selectedAxis.ySelected)) {
                                    //    $scope.resultBasket.push(dataRow);
                                    //}
                                    var rowRecord = dataRow;
                                    var seperatedFormIDsParam = dataRow.seperatedFormIDs;
                                    var seperatedIdsParam = dataRow.seperatedIds;
                                    var seperatedTitleParam = dataRow.seperatedTitles;
                                    var commaIDs = seperatedIdsParam.split(',');
                                    var commaVals = seperatedFormIDsParam.split(',');
                                    var commaEntryIds = dataRow.seperatedResEntryIDs.split(',');
                                    var ySelected = window["ySelected"];
                                    angular.forEach(commaVals, function (idVal, pos) {
                                        //console.log(commaVals + "," + commaIDs[pos].toString())
                                        if (idVal == ySelected.toString()) {
                                            dataRow.resFormID = idVal;
                                            dataRow.resources = commaIDs[pos];
                                            dataRow.resourceId = commaIDs[pos];
                                            dataRow.title = "";
                                        }

                                    })



                                });
                            }
                            $('.calendar').fullCalendar('destroy');
                            var eventBasicData = window["EventBasicDetail"];
                            eventBasicData.resourceData = resResults;
                            eventBasicData.resColumns = resColumns;
                            //console.log(activityColumns, 'activityColumns')
                            if (activityResults.length) {
                                angular.forEach(activityResults, function (item, key) {
                                    console.log(item, key, 'sona')
                                    var found = activities.filter(function (aitem) { return aitem.activitiesForm === response.data.activityFields[0].formId; });

                                    var ac_column = found[0].activities;
                                    for (var p in item) {
                                        if (p == ac_column) {
                                            item.title = p;
                                        }
                                    }
                                    //var settitle = item.ac_column;
                                    item.title = item[ac_column];

                                })
                            }
                            eventBasicData.activityData = activityResults;
                            eventBasicData.activityColumn = activityColumns;

                            window["EventBasicDetail"] = eventBasicData;
                            window["CalendarEventList"] = _allEvents;
                            console.log('loadCalendar3')
                            //console.log('kjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
                            //console.log(_allEvents);
                            loadCalendar("", _allEvents, resResults, resColumns, activityResults, activityColumns, $scope.resultBasket);

                            $('#basic-view div.calendar').fullCalendar('refetchEvents');
                            $rootScope.$emit("HideLoading");
                        }
                        $rootScope.$emit("HideLoading");
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });
            }
            else {
                var param = {};
                param.action = 9;
                param.formId = $stateParams.formId;
                param.resourceForm = $scope.selectedAxis.ySelected
                param.activitiesForm = $scope.selectedAxis.xSelected
                $rootScope.$emit("ShowLoading");
                mainService.getCalenderSettingsFormData("getAxisColumns", param)
                    .then(function (response) {
                        if (response.data != null && angular.isDefined(response.data)) {
                            //console.log(response.data);
                            var _resFields = response.data.resfields;
                            var _actFields = response.data.activityFields;
                            var _colGroupingData = response.data.colGrouping;
                            window["colGrouping"] = _colGroupingData;

                            $rootScope.$emit("HideLoading");
                        }
                        $rootScope.$emit("HideLoading");
                    }, function (err) {
                        $rootScope.$emit("HideLoading");
                        console.log("some error occured." + err);
                    });


            }
            //}

        }


        /*Calener code merge*/

        //$scope.getCalenderSettingsFormDetailsData = function () {
        //    var param = {};
        //    param.action = 4;
        //    param.formId = $scope.formDetailsDataInfo.formId;
        //    if (!DataService.isEmpty($scope.formDetailsDataInfo.isMultipleCalenderSettings))
        //        if ($scope.formDetailsDataInfo.isMultipleCalenderSettings) {
        //            $rootScope.$emit("ShowLoading");
        //            mainService.getCalenderSettingsFormData("getCalenderSettingsFormData", param)
        //                .then(function (response) {
        //                    if (response.data != null && angular.isDefined(response.data)) {
        //                        $scope.calenderSettingsFormDetailsDataList = response.data;
        //                        $rootScope.$emit("HideLoading");
        //                    }
        //                    $rootScope.$emit("HideLoading");
        //                }, function (err) {
        //                    $rootScope.$emit("HideLoading");
        //                    console.log("some error occured." + err);
        //                });
        //        }
        //};




        $scope.loadFormRoles = function (param) {
            $rootScope.$emit("ShowLoading");
            mainService.ManageFormRoles("ManageFormRoles", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (param.action == 5) {
                            if (response.data.length > 0) {
                                var exists = response.data[0];

                                //console.log('roles are above');
                                //console.log(exists);
                                $rootScope.currentUserFormRole = exists.role;
                                $timeout(function () {
                                    Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                                    Waves.attach('.flat-buttons', ['waves-button']);
                                    Waves.init();

                                }, 150);
                            }
                        }
                        //else
                        //    notifierService.notifyMessage('error', 'failed', exists.Message); 
                    }
                    $rootScope.$emit("HideLoading");

                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        $scope.manageWindowParams = function () {
            var data = {};
            data.action = 1;
            data.formId = $stateParams.formId;
            data.formGroupKey = create_UUID();
            data.userId = $scope.userDetail.Id;
            data.created_by = $scope.userDetail.Id;
            data.update_by = $scope.userDetail.Id;
            data.formData = [];
            data.resourceData = [];
            data.resColumns = [];
            data.activityData = [];
            data.activityColumn = [];
            return data;

        }
        $scope.getFormDetails = function () {
             
            var param = {};
            param.action = 4;
            param.formId = $scope.id;
            param.created_by = $scope.userDetail.Id;
            param.update_by = $scope.userDetail.Id;
            $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        //console.log(response.data)
                        // $rootScope.$emit("HideLoading"); 
                        //console.log('details are this: ');
                        var formDataTemp = response.data[0];
                        //console.log(formDataTemp);
                        $scope.formDetailsDataInfo = formDataTemp;

                        if ($scope.formDetailsDataInfo.isCalenderQueue > 0) {
                            $scope.$emit("loadSideBar", $scope.formDetailsDataInfo.applicationId, 1);
                            $rootScope.isHomePage = false;
                            $rootScope.isOtherPage = true;
                            $rootScope.isRecordPage = true;
                            $timeout(function () {
                                $(".sidebar-strip").css("display", "flex");
                                if ($("section.sidebar-strip:visible").length) {
                                    $("section.sidebar-strip").children('.side-nav').mCustomScrollbar();
                                }
                            }, 150);
                        }
                        var paramRoles = {};
                        paramRoles.action = 5;
                        paramRoles.formId = $scope.formDetailsDataInfo.formId;
                        paramRoles.userId = $scope.userDetail.Id;
                        paramRoles.created_by = $scope.formDetailsDataInfo.created_by;
                        $scope.loadFormRoles(paramRoles);
                        //$scope.getCalenderSettingsFormDetailsData();
                        $timeout(function () {
                            if ($("section.sidebar-strip:visible").length) {
                                $("section.sidebar-strip").children('.side-nav').mCustomScrollbar();
                            }
                            $scope.isAllowOwnUser = false;
                            $scope.isAllowOtherUser = false;
                            if (!DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity)) {
                                if (!Array.isArray($scope.formDetailsDataInfo.recordAccessSecurity) && DataService.isEmpty($scope.formDetailsDataInfo.recordAccessSecurity.max_one_record_per_user))
                                    $scope.formDetailsDataInfo.recordAccessSecurity = JSON.parse($scope.formDetailsDataInfo.recordAccessSecurity);

                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.view === true) ||
                                    ($scope.formDetailsDataInfo.recordAccessSecurity.other.view === true)) {

                                    if ($scope.formDetailsDataInfo.recordAccessSecurity.own.view)
                                        $scope.isAllowOwnUser = true;
                                    if ($scope.formDetailsDataInfo.recordAccessSecurity.other.view)
                                        $scope.isAllowOtherUser = true;


                                }
                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.edit === true && $scope.formDetailsDataInfo.created_by === $scope.userDetail.Id) ||
                                    ($scope.formDetailsDataInfo.created_by != $scope.userDetail.Id && $scope.formDetailsDataInfo.recordAccessSecurity.other.edit === true
                                    )) {
                                    $scope.isAllowEdit = true;
                                }
                                else {
                                    $scope.isAllowEdit = false;
                                }
                                if (($scope.formDetailsDataInfo.recordAccessSecurity.own.delete === true && $scope.formDetailsDataInfo.created_by === $scope.userDetail.Id) ||
                                    ($scope.formDetailsDataInfo.created_by != $scope.userDetail.Id && $scope.formDetailsDataInfo.recordAccessSecurity.other.delete === true
                                    )) {
                                    $scope.isAllowDelete = true;
                                }
                                else {
                                    $scope.isAllowDelete = false;
                                }

                                if (!DataService.isEmpty($scope.formDetailsDataInfo.formSettings)) {
                                    if (!Array.isArray($scope.formDetailsDataInfo.formSettings))
                                        $scope.formDetailsDataInfo.formSettings = JSON.parse($scope.formDetailsDataInfo.formSettings);

                                }
                                else {
                                    $scope.formDetailsDataInfo.formSettings = { "tabulator": { "format": "columns", "theme": "tabulator.min.css" } };

                                }
                                var paramTemp = {};
                                //   if ($scope.formDetailsDataInfo.IsFilterCriteria) {
                                //   paramTemp.action = 9;
                                //    var query = "";
                                //if (!DataService.isEmpty($scope.formDetailsDataInfo.recordFilters)) {
                                //    var columListFilterCriteria = JSON.parse($scope.formDetailsDataInfo.recordFilters);
                                //    angular.forEach(columListFilterCriteria, function (item) {
                                //        var exists = _.findWhere($scope.filterFieldsList, { field: item.field });
                                //        if (!DataService.isEmpty(exists))
                                //            query += item.query + " And";
                                //    });
                                //    query = query.substring(0, query.length - 3);
                                //    if (!DataService.isEmpty(query))
                                //        paramTemp.formTableColumnData = query;
                                //    else
                                //        paramTemp.action = 2;
                                //}
                                //}
                                //else
                                paramTemp.action = 2;
                                if ($scope.isAllowOwnUser == true && $scope.isAllowOtherUser == false) {
                                    paramTemp.action = 10;
                                    paramTemp.UserId = $scope.userDetail.Id;
                                }
                                else if ($scope.isAllowOwnUser == false && $scope.isAllowOtherUser == true) {
                                    paramTemp.action = 11;
                                    paramTemp.UserId = $scope.userDetail.Id;
                                }
                                paramTemp.formId = $scope.currentFormId;
                            }


                        }, 150);
                        //console.log('$scope.formDetailsDataInfo');
                        //console.log($scope.formDetailsDataInfo);
                        $rootScope.$emit("HideLoading");

                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        function create_UUID() {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
                var r = (dt + Math.random() * 12) % 12 | 0;
                dt = Math.floor(dt / 12);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(12);
            });
            return uuid;
        }

        $scope.exportAll = function (type) {
            var data = "";

            var fileNameDownload = angular.copy($scope.formDetailsDataInfo.title);
            fileNameDownload = fileNameDownload.split(" ").join("");
            var dataformatFile = moment(new Date());
            fileNameDownload = fileNameDownload + "_" + dataformatFile.format("DD_MM_YYYY") + "_" + dataformatFile.format("HH:MM:SS");
            switch (type) {
                case 1:

                    tabulator.download("json", fileNameDownload + ".json");
                    break;
                case 2:
                    tabulator.download("xlsx", fileNameDownload + ".xlsx", { sheetName: "sheet1" });
                    break;
                case 3:
                    tabulator.download("csv", fileNameDownload + ".csv", { delimiter: "," });
                    break;
                case 4:
                    tabulator.download("pdf", fileNameDownload + ".pdf", {
                        orientation: "portrait", //set page orientation to portrait
                        title: $scope.formDetailsDataInfo.title //add title to report
                        //autoTable: { //advanced table styling
                        //    styles: {
                        //        fillColor: [100, 255, 255]
                        //    },
                        //    columnStyles: {
                        //        id: { fillColor: 255 }
                        //    },
                        //    margin: { top: 60 },
                        //},
                        //documentProcessing: function (doc) {
                        //    //carry out an action on the doc object
                        //}
                    });
                    break;
                case 5:
                    data = 1;
                    if ($scope.selectedDeletedRecordList.length == 1) {
                        var temp = $scope.selectedDeletedRecordList[0];
                        var path = mainService.getCurrentEndPointUrl() + "/downloadExcel?formId=" + (!DataService.isEmpty(temp.formId) ? temp.formId : temp.formID) + "&formgroupkey='" + (!DataService.isEmpty(temp.formgroupkey) ? temp.formgroupkey : temp.formGroupKey) + "'&id=" + temp.Id + "&uid=" + $scope.userDetail.uid + "";

                        var filename = $scope.formDetailsDataInfo.xlsFile;
                        if (!DataService.isEmpty(filename)) {
                            downloadFileFunc(filename, path);
                        } else {
                            notifierService.notifyMessage('error', 'Download Excel', 'Excel File doesnot exists!');
                        }

                    } else {
                        notifierService.notifyMessage('error', 'Download Excel', 'Select atleast one record only');
                    }

                    break;
                default:
                    data = "";
                    break;
            }
        };
        $scope.entryPage = function (formId, isEdit, formGroupKey, rowId) {
            var reference_form = "2196";
            var params = windowParams();
            var newWindow = {};
            var baseUrl = mainService.getBaseUrl();
            $scope.isEdit = isEdit;
            if ($scope.isEdit) {
                newWindow = window.open(baseUrl + "#/form/editEntry/" + formId + "/" + formGroupKey + "/" + rowId + '?popup=1', 'example', params, true);
            }
            else {
                newWindow = window.open(baseUrl + "#/form/saveEntry/" + formId + '?popup=1', 'example', params, true);
            }
            newWindow.focus();
            var timer = setInterval(function () {
                if (newWindow.closed) {
                    clearInterval(timer);
                    $timeout(function () {
                        var paramTemp = {};
                        paramTemp.action = 2;
                        paramTemp.formId = formId;
                        $scope.GetFormRecordListDynamimc(paramTemp);
                    }, 150);
                    // $scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
                    //alert('closed: ' + reference_form);
                    // tabulators["tabulator_1574079483837"].setData("http://192.168.1.141:91/form-generator/public/get-linked-records/" + reference_form + "/0");
                }
            }, 500);
        };
        var tabulator = {};
        function showFooter(type) {

            if (!DataService.isEmpty(type.column_calculation))
                return type.column_calculation;
            else
                return "";
        }
        function bindTColumnHeader(formDetails, isExpend, isEdit) {
            var finalArray = [];
            var isTabulator = {};
            angular.forEach(formDetails, function (pageData, pageKey) {
                angular.forEach(pageData, function (item, key) {

                    var type = _.find(item, function (itemitem, keykey) { return keykey == "type" });
                    if (type == "radio-group" || type == "textarea" || type == "text-with-input" || type == "number" || type == "text" || type == "file" || type == "date"
                        || type == "autocomplete" || type == "checkbox-group" || type == "select") {
                        if (type == "file") {
                            if (type == "file" && item.multiple == true) {
                                finalArray.push({
                                    title: item.label, formatter: multilFiles, headerSort: false, align: "center", field: item.name, align: "left", cellClick: function (e, cell) {

                                        getAllFiles1(cell.getValue(), cell.getField()); console.log('cell-clicked')
                                    }
                                });
                            }
                            else {
                                finalArray.push({
                                    title: item.label, formatter: arrowImage, formatterParams: { height: 50, width: 50 }, headerSort: false, align: "center", field: item.name, align: "left", headerFilter: "input"
                                });
                            }
                        }
                        else {
                            if (DataService.isEmpty(item.Display_tab))
                                finalArray.push({ title: item.label, bottomCalc: showFooter(item), field: item.name, align: "left", headerFilter: "input" });
                            else {

                                $scope.displayInTabData = item;

                            }
                        }
                    }
                });
                isTabulator = _.findWhere(pageData, { type: "tabulator" });
            });
            finalArray.unshift({ title: "formId", visible: false });
            finalArray.unshift({ title: "Id", visible: false });
            finalArray.unshift({ title: "formGroupKey", visible: false });
            if (isEdit)
                finalArray.unshift({
                    title: "Edit", formatter: arrowEdit, headerSort: false, align: "center", cellClick: function (e, cell) {
                        $scope.entryPage($scope.currentFormId, true, cell.getRow().getData().formGroupKey, cell.getRow().getData().Id);
                    }
                });
            if (isExpend && !DataService.isEmpty(isTabulator))
                finalArray.unshift({
                    title: " ", field: "subItems", formatter: arrowIcon, width: 35, headerSort: false, align: "center", cellClick: function (e, cell) {
                        var formGroupKey = cell.getRow().getData().formGroupKey;
                        if ($(cell.getElement()).is('.active')) {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideUp();
                            $(cell.getElement()).removeClass('active');
                        } else {
                            $(cell.getRow().getElement()).find('.table-wrapper').slideDown();
                            $(cell.getElement()).addClass('active');

                            var table = tabulatorChildren[formGroupKey];
                            table.setData([]);
                        }
                        var columnData = $scope.formDataTabulatorTemp[formGroupKey];
                        var tabulatorDataFilter = {};
                        if (angular.isDefined(columnData))
                            tabulatorDataFilter = _.findWhere(columnData, { "fieldType": "tabulator" }).fieldDataText;
                        tabulatorDataFilter = JSON.parse(tabulatorDataFilter);
                        tabulatorChildren[formGroupKey].setColumns(bindTColumnHeader(tabulatorDataFilter, false, false));
                        //tabulatorChildren[formGroupKey].setData(bindTRowsData(tabulatorDataFilter));
                        var tabulatorGroup = $.cookie("form-" + formGroupKey);
                        if (typeof tabulatorGroup !== 'undefined' && tabulatorGroup !== "") {
                            tabulatorChildren[formGroupKey].setGroupBy(tabulatorGroup);
                            tabulatorChildren[formGroupKey].setSort(tabulatorGroup, "asc");
                        }
                    }
                });
            return finalArray;
        }
        //bind draggable activities
        $scope.bindDraggable = function (xSelected, ySelected) {

            var param1 = {};
            param1.action = 18;
            param1.formId = $stateParams.formId;
            param1.activitiesForm = xSelected;
            param1.resourceForm = ySelected;
            var basicDetails = window["EventBasicDetail"];
            $rootScope.$emit("ShowLoading");
            mainService.manageForm("ManageForm", param1)
                .then(function (response) {

                    var formdata = response.data.formDetails;

                    //console.log(formdata);
                    basicDetails.formData = formdata[0];   // calender  form Data
                    window["EventBasicDetail"] = basicDetails;
                    window["ySelected"] = basicDetails.formData.resourceForm;
                    $scope.ResourcefieldsData = response.data.resourceFields;  //all resource fields
                    $scope.ActivityFieldsData = response.data.activityFields;  // all activity fields 
                    //console.log($scope.ResourcefieldsData);
                    if (formdata != null && angular.isDefined(formdata)) {
                        $scope.formfieldsData = response.data.formFieldsData;

                        if (formdata.length > 0) {
                            var param = {};
                            param.action = 1;
                            param.formId = formdata[0].activitiesForm;
                            param.isActivityDraggable = 1;

                            $scope.activityFormId = formdata[0].activitiesForm;
                            if (formdata[0].colorField != 'no color')
                                param.fieldName = formdata[0].activities + "," + formdata[0].colorField;
                            else
                                param.fieldName = formdata[0].activities

                            if (formdata[0].durationField != 'no duration' && formdata[0].durationField != '')
                                param.fieldName += ',' + formdata[0].durationField;

                            $scope.label.fieldLabel = formdata[0].fieldLabel;

                            //console.log(formdata[0]);
                            //console.log('fields');
                            //console.log(formdata[0].activities + "," + formdata[0].colorField);
                            if ((formdata[0].activitiesForm != 0 && formdata[0].activitiesForm != null) && (formdata[0].activities != '' && formdata[0].activities != null)) {

                                mainService.getReferralFormFields("getReferralFormFields", param)
                                    .then(function (response) {
                                        if (response.data != null && angular.isDefined(response.data)) {
                                            //console.log('entries are');
                                            //console.log(response.data)
                                            if (response.data.length > 0) {

                                                $scope.formDetails = response.data;
                                                $scope.formDetails = _.without($scope.formDetails, _.findWhere($scope.formDetails, { value: "0" }));

                                                //console.log('draggeble data');
                                                //console.log($scope.formDetails);

                                                $timeout(function () {
                                                    $('.external-events-list .fc-event').each(function () {

                                                        $(this).data('event', {

                                                            title: $.trim($(this).text()), // use the element's text as the event title
                                                            color: $.trim($(this).data('color')),
                                                            duration: $.trim($(this).data('duration')),
                                                            stick: false, // maintain when user navigates (see docs on the renderEvent method)
                                                            id: $.trim($(this).data('id')),
                                                            formid: $.trim($(this).data('formid')),
                                                            activityfield: $.trim($(this).data('activityfield')),
                                                            colorfield: $.trim($(this).data('colorfield')),
                                                            categoryfield: $.trim($(this).data('categoryfield')),
                                                            servicefield: $.trim($(this).data('servicefield')),
                                                            dropin: $.trim($(this).data('dropin')),
                                                            dimensiontype: $.trim($(this).data('dimensiontype')),
                                                            groupingvaluesact: $.trim($(this).data('groupingvaluesact')),
                                                            groupingfieldsres: $.trim($(this).data('groupingfieldsres')),

                                                        });




                                                        $(this).draggable({
                                                            zIndex: 999,
                                                            revert: true,      // will cause the event to go back to its
                                                            containment: ".table-responsive", scroll: true,
                                                            revertDuration: 0,  //  original position after the drag
                                                            stop: function () {
                                                                //console.log($(this));
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



                            $timeout(function () {
                                $scope.getCalenderRecords();
                            }, 150);
                        }


                        $scope.totalSelectList = _.where($scope.formfieldsData, { fieldType: "select" });
                        if ($scope.totalSelectList.length > 0) {
                            var exists = _.filter($scope.totalSelectList, function (item) {
                                return item.fieldValidationRule.contains("Use_as_tags") == true;
                            });
                            $scope.totalSelectListTagify = exists;
                        }


                        $scope.listTabulator = _.where($scope.formfieldsData, { fieldType: "tabulator" });
                        if ($scope.listTabulator.length > 0) {
                            _.each($scope.listTabulator, function (item) {
                                item.fieldLabel = item.fieldLabel.split('(');
                                if (item.fieldLabel.length > 0) {
                                    item.fieldLabel = item.fieldLabel[0];
                                }
                            });
                        }

                    }
                });



            $rootScope.$emit("HideLoading");
        }
        $scope.checkIfToggle = function () {
            var toggleStatus = CookiesPersistenceService.getCookieData("Calender-Toggle");
            if (angular.isDefined(toggleStatus)) {
                if (toggleStatus == 1) {
                    $state.go('calenderToggle', { formId: $scope.id, toggle: 'calenderToggle' });

                }
            }
        }
        $scope.toggle = function () {
            //var param = {};
            //param.action = 24;
            //param.formID = $scope.id;
            //mainService.calenderToggle("ManageForm", param)
            //    .then(function (response) {
            //        console.log('toggle details are this');
            //        console.log(response.data);
            //    });
            //var records = $scope.getCalenderRecords($scope.id);

            // var calenderRecords = window["CalendarEventList"];
            CookiesPersistenceService.setCookieWithExpiry("Calender-Toggle", 1);
            $state.go('calenderToggle', { formId: $scope.id, toggle: 'calenderToggle' });




            //var toggleData = {};
            //angular.forEach(calenderRecords, function (value, key) {
            //    var rowData = value;
            //    angular.forEach(rowData, function (value1, key1) {

            //    });
            //}); 
            //console.log(calenderRecords);

        }
        //$scope.setActiveView = function () {
        //    var activeView = CookiesPersistenceService.getCookieData("calendar - activeView");
        //}
        $scope.filterInputControls = function (formFieldsList) {
            var columnString = '';
            if (formFieldsList.length > 0) {

                for (var i = 0; i < formFieldsList.length; i++) {
                    var temp = JSON.parse(formFieldsList[i].fieldValidationRule);

                    if (temp.type != "header" && temp.type != "Line" && temp.type != "button" && temp.type != "map" && temp.type != "hidden") {
                        // allInputControls.push({ Type: formFieldsList[i].fieldName })
                        if (angular.equals(columnString, ''))
                            columnString = formFieldsList[i].fieldName;
                        else
                            columnString += ',' + formFieldsList[i].fieldName;
                    }

                }
            }
            return columnString;
        }
        //get all events (calender records based on calender's  formID)
        $scope.getCalenderRecords = function (formId) {
            showLoader();
            if (DataService.isEmpty($scope.userDetail.Id)) {
                $.unblockUI();
                return true;
            }
            var data = $scope.formfieldsData;
            var ResourceInputFields = $scope.filterInputControls($scope.ResourcefieldsData); // comma seperated resource fields
            var ActivityInputFields = $scope.filterInputControls($scope.ActivityFieldsData); // comma seperated Activity fields
            if (data != null && angular.isDefined(data)) {
                //console.log(' calender all  columns :'); //console.log(data);
                if (data.length > 0) {

                    var fields = '';  // filtered input columns for calender
                    for (var count = 0; count < data.length; count++) {

                        var column = '';// alert(response.data[count].fieldName);
                        if (data[count].fieldName == "title") { column = data[count].fieldName }
                        if (data[count].fieldName == "start") { column = data[count].fieldName }
                        if (data[count].fieldName == "end") { column = data[count].fieldName }
                        if (data[count].fieldName == "service") { column = data[count].fieldName }
                        if (data[count].fieldName == "color") { column = data[count].fieldName }
                        if (data[count].fieldName == "allDay") { column = data[count].fieldName }
                        if (data[count].fieldName == "description") { column = data[count].fieldName }

                        if (data[count].fieldName == "resources") { column = data[count].fieldName }
                        if (data[count].fieldName == "resources") { column = data[count].fieldName }
                        if (data[count].fieldName == "activities") { column = data[count].fieldName }
                        if (data[count].fieldSubtype == "file") { column = data[count].fieldName }
                        if (fields.length == 0 && column.length > 0) {// if 
                            if (column == 'end') {
                                column = "[" + column + "]";
                            }
                            fields = column
                        }
                        else {

                            if (column.length > 0) {
                                if (column == 'end') {
                                    column = "[" + column + "]";
                                }
                                fields = fields + "," + column
                            }
                        }

                    }
                    fields += ",resFormID,actFormID,parentID, seperatedFormIDs,seperatedTitles,seperatedIds,seperatedResFormIDs,seperatedResEntryIDs,seperatedResColValues,seperatedColorValues"
                    //console.log(fields);   // all selected columns.
                    var basicdetails = window["EventBasicDetail"];
                    //console.log('basic details ');
                    //console.log(basicdetails.formData.resourceForm);

                    var param = {};
                    param.action = 1;
                    param.formId = $stateParams.formId;   // calender formID
                    param.fieldName = fields; // selected field's (columns).
                    param.ResourceFields = ResourceInputFields;
                    param.ActivityFields = ActivityInputFields;

                    param.isCalender = 1;
                    param.isEvent = 1;
                    param.resourceFormId = basicdetails.formData.resourceForm;
                    param.ActivityFormId = basicdetails.formData.activitiesForm;
                    param.resEntryColumn = basicdetails.formData.minorGroup;
                    param.activityEntryColumn = basicdetails.formData.activities;

                    if (param.resourceFormId == 0) {
                        var temp = _.filter($scope.calenderSettingsFormDetailsDataList, function (item) {
                            return item.resourceForm != 0;
                        });
                        if (!DataService.isEmpty(temp)) {
                            param.resourceFormId = temp[0].IsDefault ? temp[0].resourceForm : temp[0].resourceForm;
                            param.ResourceFields = temp[0].majorGroupParse.join(',');

                        }
                    }

                    $timeout(function () {
                        mainService.getReferralFormFields("getReferralFormFields", param)// getting all records for calender with specific  columns   are (param.fieldName). (based on formID)
                            .then(function (response) {
                                var eventData = response.data.events;
                                var resourceData = response.data.resourceDetails;
                                var activityData = response.data.activityDetails;
                                var activityEvents = response.data.activityEvents;

                                //console.log('event Data '); //console.log(eventData);
                                if (eventData != null && angular.isDefined(eventData)) {

                                    /// if (eventData.length > 0) {
                                    //console.log('#calenderData ( All calender records ): ');
                                    //console.log(eventData);

                                    eventData = _.without(eventData, _.findWhere(eventData, { value: "0" })); // removing '--select--'.
                                    resourceData = _.without(resourceData, _.findWhere(resourceData, { value: "0" })); // resource data 
                                    activityData = _.without(activityData, _.findWhere(activityData, { value: "0" })); // resource data 
                                    activityEvents = _.without(activityEvents, _.findWhere(activityEvents, { value: "0" })); // resource data 

                                    //_.each(activityEvents,function(item){
                                    //if(!DataService.isEmpty(item.start)){
                                    //    var dateTime = new Date(item.start);
                                    //    //dateTime = moment(dateTime).format("DD-MM-YYYY HH:MM");
                                    //    item.start = dateTime;
                                    //    dateTime = new Date(item.end);
                                    //   // dateTime = moment(dateTime).format("DD-MM-YYYY HH:MM");
                                    //    item.end = dateTime;
                                    //    }
                                    //});


                                    window["CalendarEventList"] = eventData;// setting window variable with all calender records as 'event list '.
                                    window["ActivityEventList"] = activityEvents;
                                    var resourceColumns = $scope.getResourceColumns(resourceData, ResourceInputFields, 'resource');
                                    var resourceFormData = $scope.arrangeData(resourceData, resourceColumns, 'resource');

                                    var activityColumns = $scope.getResourceColumns(activityData, ActivityInputFields, 'activity');
                                    var activityFormData = $scope.arrangeData(activityData, activityColumns, 'activity');


                                    basicdetails.resourceData = resourceFormData;
                                    basicdetails.resColumns = resourceColumns;
                                    basicdetails.activityData = activityFormData;
                                    basicdetails.activityColumn = activityColumns;

                                    window["EventBasicDetail"] = basicdetails;

                                    $scope.basicViewCalenderDataTemp.eventData = eventData;
                                    $scope.basicViewCalenderDataTemp.resourceFormData = resourceFormData;
                                    $scope.basicViewCalenderDataTemp.resourceColumns = resourceColumns;
                                    $scope.basicViewCalenderDataTemp.activityFormData = activityFormData;
                                    $scope.basicViewCalenderDataTemp.activityColumns = activityColumns;
                                    $scope.basicViewCalenderDataTemp.activityEvents = activityEvents;
                                    $('.calendar').fullCalendar('destroy');
                                    console.log('loadCalendar4')
                                    if (!DataService.isEmpty($scope.userDetail.Id))
                                        loadCalendar('BasicView', eventData, resourceFormData, resourceColumns, activityFormData, activityColumns, activityEvents);
                                    else
                                        $.unblockUI();
                                    $timeout(
                                        function () {
                                            //console.log($scope.calenderSettingsFormDetailsDataList);
                                        }, 450);

                                    // loading calender .
                                    //  loadCalendar('BasicView', CalendarEventList, eventBasicData.resourceData, eventBasicData.resColumns, eventBasicData.activityData, eventBasicData.activityColumn);
                                    //}




                                }
                                else {
                                    $.unblockUI();
                                }
                            });
                    }, 200);
                }

            }
        }
        $scope.getResourceColumns = function (data, inputfields, reqType) {

            var resourceColumns = [];
            var ResourceInputFields = [];
            var fields = inputfields.split(',');
            var basicDetails = window["EventBasicDetail"];
            //console.log('basic details are ');
            //console.log(basicDetails);
            var groupingColumn = '';
            if (reqType == "resource") {
                groupingColumn = basicDetails.formData.majorGroup;
                ResourceInputFields = $scope.ResourcefieldsData;
            }
            else if (reqType == "activity") {
                groupingColumn = basicDetails.formData.activities;
                ResourceInputFields = $scope.ActivityFieldsData;
            }



            for (var count = 0; count < fields.length; count++) {
                //console.log('outer val' + fields[count]);

                for (var innerCount = 0; innerCount < ResourceInputFields.length; innerCount++) {

                    var temp = ResourceInputFields[innerCount];
                    //console.log('inner val' + temp);

                    if (fields[count] == temp.fieldName) {
                        var row = {};
                        if (angular.equals(temp.fieldName, "Id")) {
                            temp.fieldName = "id";

                        }
                        if (temp.fieldName == basicDetails.formData.majorGroup) {


                            // if majorGroupColumn Found.
                            row = {
                                "labelText": temp.fieldLabel.replace(" ", ""),
                                "field": temp.fieldName,
                                "group": true

                            };
                        }
                        else {

                            row = {
                                "labelText": temp.fieldLabel.replace(" ", ""),
                                "field": temp.fieldName,

                            };
                        }
                        resourceColumns.push(row);
                        break;
                    }


                }



            }
            //console.log(resourceColumns);
            return resourceColumns;
        }
        $scope.arrangeData = function (data, resourceColumns, reqType) {
            $rootScope.$emit("ShowLoading");
            var resourceData = [];
            var basicDetails = window["EventBasicDetail"];
            var columnTitle = '';
            if (reqType == "resource")
                columnTitle = basicDetails.formData.minorGroup;
            else if (reqType == "activity")
                columnTitle = basicDetails.formData.activities;
            if (angular.isDefined(data)) {
                for (var count = 0; count < data.length; count++) {
                    var row = {};
                    var resColumns1 = [];
                    if (reqType == "resource")
                        resColumns1 = data[count].resColumns;
                    else
                        resColumns1 = data[count].actColumns;
                    if (angular.isDefined(resColumns1) && resColumns1 != null) {
                        for (var innerLoop = 0; innerLoop < resColumns1.length; innerLoop++) {
                            var columnName = resColumns1[innerLoop].columnName;
                            if (angular.equals(columnName, "Id"))
                                columnName = "id";

                            if (resColumns1[innerLoop].columnName == columnTitle) {
                                row.title = resColumns1[innerLoop].columnValue;
                                row[columnName] = resColumns1[innerLoop].columnValue;
                            }
                            else {
                                row[columnName] = resColumns1[innerLoop].columnValue;

                            }
                        }
                        var row1 = row;
                        resourceData.push(row1);
                    }
                }
            }
            $rootScope.$emit("HideLoading");
            return resourceData;
        }
        $scope.openTabulator = function (formId) {
            if (formId != 0)
                $state.go('records', { formId: formId });
        }
        $scope.editFormRedirect = function () {

            $state.go('formEdit', { formId: $stateParams.formId });
        }
        $scope.selectedTabFilter = function (filterValue, selectedId) {
            $rootScope.$emit("ShowLoading");
            var filterData = angular.copy($scope.formDetailsDataTemp);
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
            //    tabulator.setData(bindTRowsData(filterGroupByData));
            //} else {
            //    tabulator.setData(bindTRowsData(groupBy));
            //}
            var temp = [];
            var filterDataNew = _.filter(filterData, function (item, key) {
                var filterNest = _.filter(item, function (itemNest, keyNest) {
                    if (angular.isDefined(itemNest) && $scope.displayInTabData.name == keyNest)
                        return itemNest.toString() == filterValue.value;
                });
                if (!DataService.isEmpty(filterNest))
                    temp.push(item)
            });
            tabulator.setData(temp);
            $rootScope.$emit("HideLoading");
        }
        function bindTabulatorColumnsHeader(formDetails, tabularId, formId) {
            $timeout(function () {

                tabulator.setColumns(bindTColumnHeader(formDetails, true, true));
                // var param = {};
                // param.action = 1;
                //$scope.loadEntryDataIntoTabulatorOnetoMany(param, formId);
            }, 250);
        }
        function bindTRowsData(groupByData) {
            var dataArray = [];
            angular.forEach(groupByData, function (item, grp) {
                var list = '';
                list += '{"';
                angular.forEach(item, function (itemData, key) {
                    ////console.log(itemData)
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
                var parseData = JSON.parse(list);
                //angular.forEach(parseData, function (itemdata) {
                //    if (isNumeric(itemdata))
                //        itemdata = parseInt(itemdata);
                //})
                dataArray.push(parseData);
            });



            return dataArray;
        }
        function isNumeric(num) {
            return !isNaN(num)
        }
        $scope.loadEntryDataIntoTabulatorOnetoMany = function (paramData, formId) {
            $scope.formDataForOneParam = {}
            $scope.formDataForOneParam = paramData;
            $scope.formDataForOneParam.formId = formId;
            $scope.formDataForOneParam.created_by = $scope.userDetail.Id;
            $scope.formDataForOneParam.update_by = $scope.userDetail.Id;
            mainService.formDataForOne("FormDataForOne", $scope.formDataForOneParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if ($scope.formDataForOneParam.action == 1) {
                            var rowDataTabulator = [];
                            $scope.formDataTabulatorTempWithoutGroupBy = response.data;
                            var groupBy = response.data;
                            groupBy = _.groupBy(groupBy, "formGroupKey");
                            $scope.formDataTabulatorTemp = angular.copy(groupBy);
                            //console.log(groupBy);
                            //list = list.substring(0, list.length - 1);
                            //var formData = JSON.stringify(dataArray);
                            //formData = JSON.parse(formData);
                            //console.log(formData);
                            //tabulator.setData(bindTRowsData(groupBy));

                            var ddd = tabulator;
                            ////console.log(ddd);
                            if (!DataService.isEmpty($scope.displayInTabData.Referral_Forms)) {
                                $timeout(function () {
                                    var param = {};
                                    param.action = 1;
                                    param.formId = $scope.displayInTabData.Referral_Forms;
                                    param.fieldName = $scope.displayInTabData.Referral_Form_Fields;
                                    mainService.getReferralFormFields("getReferralFormFields", param)
                                        .then(function (response) {
                                            //console.log(response);
                                            $scope.tabList = response.data;
                                            $scope.tabList = _.without($scope.tabList, _.findWhere($scope.tabList, { value: "0" }));
                                            //$scope.tabList.unshift({
                                            //    "label": "All", "value": "All","isDefault":true
                                            //});
                                            $timeout(function () {
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

                        }
                        else if ($scope.formDataForOneParam.action == 3) {
                            var exists = _.findWhere(response.data, { res: 1 });
                            if (angular.isDefined(exists)) {
                                notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                            } else {
                                exists = _.findWhere(response.data, { res: -1 });
                                notifierService.notifyMessage('success', 'FormEntry', exists.Message);
                            }
                            // var param = {};
                            // param.action = 1;
                            // $scope.loadEntryDataIntoTabulatorOnetoMany(param, $scope.formDataForOneParam.formId);

                        }
                    }
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        };
        function getAllFiles(formGroupKey, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param.action = 4;
            param.formGroupKey = formGroupKey;
            mainService.formDataForOne("FormDataForOne", param)
                .then(function (response) {
                    // console.log('run')
                    //console.log(response.data)
                    if (response.data != null && angular.isDefined(response.data)) {
                        $scope.formGroupFilesList = response.data;
                        var newObj = response.data;
                        newObj = _.findWhere(newObj, { fieldName: fieldNameParam });
                        if (newObj.fieldType == 'file' && newObj.fieldDataMultimedia != null) {
                            var images = newObj.fieldDataMultimedia;
                            images = images.split(',');
                            //   console.log(images)
                            var newHtml = '';
                            $.each(images, function (i, val) {
                                //console.log(val)
                                var ext = val.substr(val.lastIndexOf('.') + 1);
                                if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                                    newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>';
                                } else if (ext == "xls" || ext == "xlsx") {
                                    var nameddd = val.substring(val.lastIndexOf('/') + 1);
                                    newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>";
                                } else {
                                    var nameddd = val.substring(val.lastIndexOf('/') + 1);
                                    newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>";
                                }
                            });
                            $('#galleryModal .modal-body').html(newHtml);
                        } else {
                            $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
                        }
                        //$rootScope.$emit("HideLoading");
                        //$.each(newObj, function (key, value) {
                        //    if (value.fieldType == 'file' && value.fieldDataMultimedia != null) {
                        //    //    console.log(value.fieldDataMultimedia)
                        //        var images = value.fieldDataMultimedia;
                        //        images = images.split(',');
                        //     //   console.log(images)
                        //        var newHtml = '';
                        //        $.each(images, function (i, val) {
                        //            console.log(val)
                        //            newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image" src="' + val + '" alt="" height="150"> </a>';
                        //        });
                        //        $('#galleryModal .modal-body').html(newHtml);
                        //    }
                        //})
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        function getAllFiles1(formData, fieldNameParam) {
            $rootScope.$emit("ShowLoading");
            $('#galleryModal .modal-body').html('');
            var param = {};
            param = formData;
            var images = param;
            if (!DataService.isEmpty(images)) {
                images = images.split(',');
                //   console.log(images)
                var newHtml = '';
                $.each(images, function (i, val) {
                    //console.log(val)
                    val = val.replace('~', '');
                    var ext = val.substr(val.lastIndexOf('.') + 1);
                    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
                        newHtml += '<a class="example-image-link" href="' + val + '" data-lightbox="example-set" title="' + val + '"> <img class="example-image img-fluid" src="' + val + '" alt="" height="150" width="150"> </a>';
                    } else if (ext == "xls" || ext == "xlsx") {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file-excel-o fa-3x'></i><br>" + nameddd + "</p></a></label>";
                    } else {
                        var nameddd = val.substring(val.lastIndexOf('/') + 1);
                        newHtml += "<label><a href='" + mainService.getBaseUrl() + val + "' title=" + nameddd + " download=''><p><i class='fa fa-file fa-3x'></i><br>" + nameddd + "</p></a></label>";
                    }
                });
                $('#galleryModal .modal-body').html(newHtml);
            } else {
                $('#galleryModal .modal-body').html("<label><p>No Records</p></label>");
            }

        }
        function GeneratedFormDataDelete(dataParam) {
            $rootScope.$emit("ShowLoading");
            dataParam.name = $scope.userDetail.name;
            dataParam.userId = $scope.userDetail.Id;
            dataParam.topicId = $scope.formDetailsDataInfo.topicId;
            mainService.manageGeneratedFormData("GeneratedFormData", dataParam)
                .then(function (response) {
                    if (response.data != null && angular.isDefined(response.data)) {
                        if (!DataService.isEmpty(response.data.Message)) {
                            var exists = response.data;
                            if (exists.res == 1) {
                                notifierService.notifyMessage('success', 'FormRecord', exists.Message);
                                angular.forEach(window["formGroupKeyList"], function (item) {
                                    var idx = _.findIndex($scope.formDetailsDataTemp, { Id: item });
                                    $scope.formDetailsDataTemp.splice(idx, 1);
                                });
                                $timeout(function () {
                                    //tabulator.setData($scope.formDetailsDataTemp);
                                    bindtabulatorOnly($scope.formDetailsDataInfo.formSettings.tabulator.format, $scope.formDetailsDataTemp)
                                    //  bindtabulatorOnly($scope.formDetailsDataInfo.formSettings.tabulator.format);
                                }, 150);

                                //window["formGroupKeyList"] = null;
                            }
                        }
                    }
                    $rootScope.$emit("HideLoading");
                }, function (err) {
                    $rootScope.$emit("HideLoading");
                    console.log("some error occured." + err);
                });
        }
        $("button#entry-form-action").on("click", function (e) {
            e.preventDefault();
            //console.log('id=' + $stateParams.formId);
            $state.go('saveFormEntryData', { 'formId': $stateParams.formId });
        });
        $('#tabulatorModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var form_id = button.attr('data-referral-form-id');
            var modal = $(this);
            var $formIdField = button.attr('data-referral-form-field-id');
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
                            $scope.allReferrenceData = response.data;
                            $scope.tabList = _.without($scope.allReferrenceData.tablist, _.findWhere($scope.allReferrenceData.tablist, { value: "0" }));

                            $scope.formDataTabulatorTempWithoutGroupBy = $scope.allReferrenceData.formDataListNew;
                            $timeout(function () {
                                if ($scope.formDataTabulatorTempWithoutGroupBy.length > 0)
                                    $("#tabulatorModal input[name=formID]").val($scope.formDataTabulatorTempWithoutGroupBy[0].formId);
                                window["popupTabulator"].setHeight("450px");
                                window["popupTabulator"].setColumns(bindTColumnHeader($scope.allReferrenceData.formDataHeaders));

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

        });
        $scope.init();
    });
}(FormGeneratorApp));