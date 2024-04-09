function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

(function () {
    'use strict';
    FormGeneratorApp.config(function ($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home',
            template: 'bootstrap3',
            includeAbstract: true
        });
    });

    FormGeneratorApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$qProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $qProvider) {

        $locationProvider.hashPrefix('');
        // use the HTML5 History API 
        var uuid = uuidv4();
        //$urlRouterProvider.otherwise('/home');
        $stateProvider.state('login', {
            url: '/login',
            onEnter: function ($window) { $window.document.title = "Form Builder-Login"; },
            views: {
                'content': {
                    templateUrl: '/Templates/auth/login.html?token=' + uuid,
                    controller: 'loginController'
                }
            }
        }).state('logout', {
            url: '/logout',
            views: {
                'content': {
                    templateUrl: '/Templates/auth/logout.html?token=' + uuid,
                    controller: 'logoutController'
                }
            },
            ncyBreadcrumb: {
                label: 'register'
            }
        }).state('register', {
            cache: false, //required
            url: '/register',
            onEnter: function ($window) { $window.document.title = "Form Builder-Register"; },
            views: {
                'content': {
                    templateUrl: '/Templates/auth/register.html?token=' + uuid,
                    controller: 'registerController'
                }
            },
            ncyBreadcrumb: {
                label: 'register'
            }
        }).state('forgotpassword', {
            url: '/forgotpassword',
            onEnter: function ($window) { $window.document.title = "Form Builder-Forget Password"; },
            views: {
                'content': {
                    templateUrl: '/Templates/auth/forgot_password.html?token=' + uuid,
                    controller: 'forgetController'
                }
            }
            ,
            ncyBreadcrumb: {
                label: 'forgotpassword'
            }
        })
            .state('resetPassword', {
                url: '/resetPassword',
                onEnter: function ($window) { $window.document.title = "Form Builder-Reset Password"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/auth/resetPassword.html?token=' + uuid,
                        controller: 'forgetController'
                    }
                }
                ,
                ncyBreadcrumb: {
                    label: 'forgotpassword'
                }
            })

            .state('Home', {
                url: '/home',
                onEnter: function ($window) {
                    $window.document.title = "Home";
                },
                abstract: false,

                views: {
                    'content': {
                        //templateUrl: '/Templates/Index.html?token='+uuid,
                        //controller: 'MainDashboardController'
                        templateUrl: '/Templates/dashboard/dashboard.html?token=' + uuid,
                        controller: 'DashboardController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home',
                    parent: ''
                }

            })
            //.state('UserHome', {
            //    url: '/UserHome',
            //    onEnter: function ($window) { $window.document.title = "Home"; },
            //    abstract: false,

            //    views: {
            //        'content': {
            //            //templateUrl: '/Templates/Index.html?token='+uuid,
            //            //controller: 'MainDashboardController'
            //            templateUrl: '/Templates/user-admin/dashboard.html?token=' + uuid,
            //            controller: 'DashboardController'
            //        }
            //    },
            //    ncyBreadcrumb: {
            //        label: 'Home',
            //        parent: ''
            //    }

            //})
            .state('homep', {
                url: '/homep',
                onEnter: function ($window) { $window.document.title = "Home"; },
                abstract: false,

                views: {
                    'content': {
                        templateUrl: '/Templates/packery/packeryDashboard.html?token=' + uuid,
                        controller: 'packeryDashboardController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home',
                    parent: ''
                }

            }).state('editApplication', {
                url: '/application/edit/:appId',
                onEnter: function ($window) { $window.document.title = "Folder"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/application/editApplication.html?token=' + uuid,
                        controller: 'EditApplicationController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Update',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "editApplication"
                        })
                    }
                }

            }).state('createApplication', {
                url: '/application/create',
                onEnter: function ($window) { $window.document.title = "Create"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/application/createApplication.html?token=' + uuid,
                        controller: 'CreateApplicationController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Create',
                    parent: 'home'
                }

            }).state('application', {
                url: '/application',
                onEnter: function ($window) { $window.document.title = "Folders"; },
                abstract: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/application/applicationList.html?token=' + uuid,
                        controller: 'ApplicationListController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Folders',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "application"
                        })
                    }
                }
            }).state('form', {
                url: '/form/create/:topicId?popup',
                onEnter: function ($window) { $window.document.title = "Forms"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/forms.html?token=' + uuid,
                        controller: 'FormGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            }).state('formSettings', {
                url: '/form/settings/:topicId?popup',
                onEnter: function ($window) { $window.document.title = "Forms"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/settings/form-setting.html?token=' + uuid,
                        controller: 'BasicFormSettingController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            })
            .state('formSettingsEdit', {
                url: '/form/settingsEdit/:formId',
                onEnter: function ($window) { $window.document.title = "Edit Form Settings"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/settings/form-setting.html?token=' + uuid,
                        controller: 'BasicFormSettingController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'forms'

                }
            })
            .state('calenderform', {
                url: '/calender/create/:topicId?popup',
                onEnter: function ($window) { $window.document.title = "Forms"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/forms.html?token=' + uuid,
                        controller: 'FormGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            }).state('formTopicEdit', {
                url: '/form/edittopic/:edittopicId',
                onEnter: function ($window) { $window.document.title = "Form Topics"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/forms.html?token=' + uuid,
                        controller: 'FormGeneratorController'
                    }
                }
                ,
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            }).state('formEdit', {
                url: '/form/edit/:formId',
                onEnter: function ($window) { $window.document.title = "Edit Form"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/forms.html?token=' + uuid,
                        controller: 'FormGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'forms'

                }
            }).state('formEditAction', {
                url: '/form/edit/:formId/:tab',
                onEnter: function ($window) { $window.document.title = "Edit Form"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/forms.html?token=' + uuid,
                        controller: 'FormGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'forms'

                }
            })
            .state('queue', {
                url: '/queue/create/:topicId',
                onEnter: function ($window) { $window.document.title = "Queue"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/queue.html?token=' + uuid,
                        controller: 'QueueGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            }).state('queueTopicEdit', {
                url: '/queue/edittopic/:edittopicId',
                onEnter: function ($window) { $window.document.title = "Edit Queue Topic"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/queue.html?token=' + uuid,
                        controller: 'QueueGeneratorController'
                    }
                }
                ,
                ncyBreadcrumb: {
                    label: 'form',
                    parent: 'forms'
                }
            }).state('queueEdit', {
                url: '/queue/edit/:formId',
                onEnter: function ($window) { $window.document.title = "Edit Queue  "; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/queue.html?token=' + uuid,
                        controller: 'QueueGeneratorController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'forms'

                }
            })
            .state('previewForm', {
                url: '/form/preview/:formId',
                onEnter: function ($window) { $window.document.title = "Preview"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/previewForm.html?token=' + uuid,
                        controller: 'PreviewFormController'
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            }).state('previewFormPage', {
                url: '/form/previewForm/:formId?popup',
                onEnter: function ($window) { $window.document.title = "Preview Form Page"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/previewForm.html?token=' + uuid,
                        controller: 'PreviewFormController'
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            }).state('saveFormEntryData', {
                onEnter: function ($window) { $window.document.title = "Form Entry"; },
                url: '/form/saveEntry/:formId?popup&check&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryBarrwayThemePage.html?token=' + uuid,
                        controller: 'FormEntryController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Entry",
                    parent: 'records'
                }
                //ncyBreadcrumb: {
                //    label: 'Entry',
                //    parent: 'records'
                //}
            })
            .state('saveFormEntryDataEmbed', {
                onEnter: function ($window) { $window.document.title = "Form Entry"; },
                url: '/embed/form/saveEntry/:formId?popup&check&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/embed/formEntryPage.html?token=' + uuid,
                        controller: 'FormEntryEmbedController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Entry",
                    parent: 'records'
                }
                //ncyBreadcrumb: {
                //    label: 'Entry',
                //    parent: 'records'
                //}
            })
            .state('saveonetomany', {
                onEnter: function ($window) { $window.document.title = "Form Entry"; },
                url: '/form/onetomany/:formId?popup&check&cname&value&master&masterformId&groupkey&formgroupkey',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPage.html?token=' + uuid,
                        controller: 'FormEntryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Entry',
                    parent: 'records'
                }
            })
            .state('saverecord', {
                onEnter: function ($window) { $window.document.title = "Form Entry"; },
                url: '/form/saveEntry/:formId?popup&check&start&svalue&end&tvalue',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPage.html?token=' + uuid,
                        controller: 'FormEntryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Entry',
                    parent: 'records'
                }
            }).state('showInformation', {
                onEnter: function ($window) { $window.document.title = "Information"; },
                url: '/form/show/:formId?popup&check',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPage.html?token=' + uuid,
                        controller: 'FormEntryController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('editFormEntryData', {
                onEnter: function ($window) { $window.document.title = "Edit Form entry"; },
                url: '/form/editEntry/:formId/:formGroupKey/:Id?popup&check&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryBarrwayThemePage.html?token=' + uuid,
                        controller: 'FormEntryController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'public'

                }
            })
            .state('editFormEventData', {
                onEnter: function ($window) { $window.document.title = "Edit Event"; },
                url: '/form/editEvent/:formId/:formGroupKey/:Id?popup&type&customForms&customFormIds&parentFormId&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPageCalender.html?token=' + uuid,
                        controller: 'FormEntryCalenderController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'public'

                }
            })
            .state('saveFormEventData', {
                onEnter: function ($window) { $window.document.title = " Form entry"; },
                url: '/form/saveEvent/:formId?popup&type&customForms&customFormIds&parentFormId&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPageCalender.html?token=' + uuid,
                        controller: 'FormEntryCalenderController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'public'

                }
            })
            .state('saveFormEventDataEmbed', {
                onEnter: function ($window) { $window.document.title = " Form entry"; },
                url: '/embed/form/saveEvent/:formId?popup&type&customForms&customFormIds&parentFormId&cname&value',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formEntryPageCalender.html?token=' + uuid,
                        controller: 'FormEntryCalenderController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'public'

                }
            })
            .state('records', {
                url: '/form/records/:formId?check',
                onEnter: function ($window) { $window.document.title = "Records"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formRecords.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'

                }
            }).state('calenderToggle', {
                url: '/form/records/:formId/:toggle/',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formRecords.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'
                }
            }).state('CalenderRecords', {
                url: '/form/calender/:formId',
                onEnter: function ($window) { $window.document.title = "Calendar Records"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/demoCalenderRecordsTemp.html?token=' + uuid,
                        controller: 'NewDemoCalenderRecordsControllerTemp'
                        //controller: 'DemoCalenderRecordsControllerTemp'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'
                }
            }).state('DemoCalenderRecords', {
                url: '/form/democalender/:formId',
                onEnter: function ($window) { $window.document.title = "Calendar Records"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/demoCalenderRecordsTemp.html?token=' + uuid,
                        controller: 'NewDemoCalenderRecordsControllerTemp'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'
                }
            })

            .state('queueRecords', {
                url: '/queue/show/:topicId',
                onEnter: function ($window) { $window.document.title = "Queue Records"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/queueRecords.html?token=' + uuid,
                        controller: 'queueRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'
                }
            })
            .state('groupcreate', {
                url: '/groupcreate',
                onEnter: function ($window) { $window.document.title = "Group Creation"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/groupcreate.html?token=' + uuid,
                        controller: 'CreateGroupController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Create',
                    parent: 'grouplist'
                }
            }).state('updateGroup', {
                url: '/updateGroup/:groupId',
                onEnter: function ($window) { $window.document.title = "Update Group"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/groupcreate.html?token=' + uuid,
                        controller: 'CreateGroupController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Edit",
                    parent: 'group_details'
                }
            }).state('updateSubgroup', {
                url: '/updateSubgroup/:groupId/:isSubGroup',
                onEnter: function ($window) { $window.document.title = "Update Sub-Group"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/groupcreate.html?token=' + uuid,
                        controller: 'CreateGroupController'
                    }
                }
            }).state('createSubGroup', {
                url: '/createSubGroup/:masterGroupId',
                onEnter: function ($window) { $window.document.title = "Create Sub-group"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/groupcreate.html?token=' + uuid,
                        controller: 'CreateGroupController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Create Subgroup",
                    parent: 'group_details'
                }
            }).state('grouplist', {
                url: '/grouplist',
                onEnter: function ($window) { $window.document.title = "Groups"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/grouplist.html?token=' + uuid,
                        controller: 'GroupListController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Groups',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", { action: 5, tabulatorID: "groupList" });
                    }
                }
            }).state('group_details', {
                url: '/group_details/:groupId',
                onEnter: function ($window) { $window.document.title = "Group Details"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/groupdetails.html?token=' + uuid,
                        controller: 'GroupDetailsController'
                    }
                },
                ncyBreadcrumb: {
                    label: "{{route}}",
                    parent: 'grouplist'
                }

            }).state('assign_form', {
                url: '/assign_form/:groupId',
                onEnter: function ($window) { $window.document.title = "Assign Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/groups/assignFormsToGroup.html?token=' + uuid,
                        controller: 'AssignGroupFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Assign Forms",
                    parent: function ($scope) {
                        var param = $scope.groupId; // Or wherever is the slug value.
                        return 'group_details({groupId: ' + param + '})';
                    }
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "formAssignTabulatorList"
                        })
                    }
                }
            }).state('contactlist', {
                url: '/contactlist',
                onEnter: function ($window) { $window.document.title = "Contacts"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/contactlist.html?token=' + uuid,
                        controller: 'ContactListController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Contacts',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "contactList"
                        })
                    }
                }
            }).state('createcontact', {
                url: '/createcontact',
                onEnter: function ($window) { $window.document.title = "Create"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/createcontact.html?token=' + uuid,
                        controller: 'CreateContactApplicationController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Create',
                    parent: 'contactlist'
                }
            })
            .state('userprofile', {
                url: '/userprofile',
                onEnter: function ($window) { $window.document.title = "My Profile"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/userprofile.html?token=' + uuid,
                        controller: 'userProfileUpdateController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'My Profile',
                    parent: 'Home'
                }
            }).state('orderHistory', {
                url: '/orderHistory',
                onEnter: function ($window) { $window.document.title = "Order History"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/orderHistory.html?token=' + uuid,
                        controller: 'orderHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Order History',
                    parent: 'Home'

                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "tabulatororder"
                        })
                    }
                }
            }).state('plan', {
                url: '/plan',
                onEnter: function ($window) { $window.document.title = "Plans"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/plan.html?token=' + uuid,
                        controller: 'userPlanController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Plans',
                    parent: 'Home'
                }
            }).state('subscriptionHistory', {
                url: '/subscriptionHistory',
                onEnter: function ($window) { $window.document.title = "Subscription History"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/subscription/subscriptionHistory.html?token=' + uuid,
                        controller: 'subscriptionHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Subscription History',
                    parent: 'Home'

                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "subscriptiontabulator"
                        })
                    }
                }
            }).state('forms', {
                url: '/forms',
                onEnter: function ($window) { $window.document.title = "Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/forms.html?token=' + uuid,
                        controller: 'userformsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Forms',
                    parent: 'home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "userAllForms"
                        })
                    }
                }
            }).state('github', {
                url: '/github',
                onEnter: function ($window) { $window.document.title = "Github"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/settings/github.html?token=' + uuid,
                        controller: 'githubApplicationController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('global', {
                url: '/global',
                onEnter: function ($window) { $window.document.title = "Global"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/settings/global.html?token=' + uuid,
                        controller: 'globalController'
                    }
                },
                ncyBreadcrumb: {

                    skip: true
                }
            }).state('menus', {
                url: '/menus',
                onEnter: function ($window) { $window.document.title = "Menus"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/menu/menus.html?token=' + uuid,
                        controller: 'menusController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Menu',
                    parent: 'home'
                }
            }).state('menuitem', {
                url: '/menus/editMenu/:menuId',
                onEnter: function ($window) { $window.document.title = "MenusItem"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/menu/menuitem.html?token=' + uuid,
                        controller: 'MenuItemController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'MenuItem',
                    parent: 'home'
                }
            }).state('menuSearch', {
                url: '/menuSearch',
                onEnter: function ($window) { $window.document.title = "Search"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/menu/menuSearch.html?token=' + uuid,
                        controller: 'menuSearchApplicationController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('createmenu', {
                url: '/createmenu',
                onEnter: function ($window) { $window.document.title = "Create Menu"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/menu/createmenu.html?token=' + uuid,
                        controller: 'menuController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Create",
                    parent: 'Menu'

                }
            }).state('updateMenu', {
                url: '/updateMenu/:menuId',
                onEnter: function ($window) { $window.document.title = "Update Menu"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/menu/createmenu.html?token=' + uuid,
                        controller: 'menuController'
                    }
                },
                ncyBreadcrumb: {
                    label: "Edit",
                    parent: 'Menu'
                }
            })
            .state('personal', {
                url: '/personal',
                onEnter: function ($window) { $window.document.title = "Personal Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/personal.html?token=' + uuid,
                        controller: 'personalFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Personal Forms',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "personal"
                        })
                    }
                }
            }).state('private', {
                url: '/private',
                onEnter: function ($window) { $window.document.title = "Private Group Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/private.html?token=' + uuid,
                        controller: 'privateFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Private Group Forms',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "PGF"
                        })
                    }
                }
            }).state('subscribed', {
                url: '/subscribed',
                onEnter: function ($window) { $window.document.title = "Subscribed Public Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/subscribed.html?token=' + uuid,
                        controller: 'subscribedFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'My Subscribed Public Forms',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "subscribedForms"
                        })
                    }
                }
            }).state('public', {
                url: '/public',
                onEnter: function ($window) { $window.document.title = "Public Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/public.html?token=' + uuid,
                        controller: 'publicFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'All Public Forms',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "publictable"
                        })
                    }
                }
            })
            .state('cform', {
                url: '/tailor-made/create/form',
                onEnter: function ($window) { $window.document.title = "Create"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/create/form.html?token=' + uuid,
                        controller: 'createFormController'
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            })
            .state('queues', {
                url: '/queues',
                onEnter: function ($window) { $window.document.title = "Queues"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/create/queues.html?token=' + uuid,
                        controller: 'createQueuesController'
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            }).state('calendar', {
                url: '/calendar',
                onEnter: function ($window) { $window.document.title = "Calendar"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/create/calendar.html?token=' + uuid,
                        controller: 'createCalendarController'
                    }
                },
                ncyBreadcrumb: {
                    skip: true
                }
            }).state('basiccalendar', {
                url: '/form/basiccalendar/:formId',
                onEnter: function ($window) { $window.document.title = "Basic Calendar"; },
                cache: false,
                views: {
                    'content': {

                        templateUrl: '/Templates/formgenerator/basicCalendar.html?token=' + uuid,
                        controller: 'calendarbasicController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Calendar',
                    parent: 'forms'
                }
            }).state('filterCriteria', {
                url: '/filterCriteria/:formId',
                onEnter: function ($window) { $window.document.title = "Filter Criteria"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/filter-criteria.html?token=' + uuid,
                        controller: 'MergefilterCriteriaController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Filter Criteria',
                    parent: 'forms'

                }
            }).state('recordaccessrights', {
                url: '/recordaccessrights/:formId',
                onEnter: function ($window) { $window.document.title = "Record Access Rights"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/record-access-rights.html?token=' + uuid,
                        controller: 'recordAccessRightController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Record Access Rights',
                    parent: 'forms'

                }
            }).state('quickedit', {
                url: '/quick-edit/:formId',
                onEnter: function ($window) { $window.document.title = "Quick Actions"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/quick-edit.html?token=' + uuid,
                        controller: 'quickEditController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Quick Edit',
                    parent: 'forms'
                }
            }).state('summary', {
                url: '/summary/:formId',
                onEnter: function ($window) { $window.document.title = "Summary"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/summary.html?token=' + uuid,
                        controller: 'summaryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Summary',
                    parent: 'records'
                }
            }).state('paymentProcess', {
                url: '/paymentProcess?token&PayerID',
                onEnter: function ($window) { $window.document.title = "Payment Process"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/paymentStatus.html?token=' + uuid,
                        controller: 'paymentController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('PayPalCheckout', {
                url: '/PayPalCheckout/:planId/:paidplan/:topicId',
                onEnter: function ($window) { $window.document.title = "Payment Process"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/paymentPage.html?token=' + uuid,
                        controller: 'paymentCheckoutController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('paymentStatus', {
                url: '/paymentStatus?token&PayerID',
                onEnter: function ($window) { $window.document.title = "Payment Status"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/paymentPage.html?token=' + uuid,
                        controller: 'paymentResultController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('ppPaymentProcess', {
                url: '/ppProcess/:formid/:recId',
                onEnter: function ($window) { $window.document.title = "Payment Process"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/ppPaymentPage.html?token=' + uuid,
                        controller: 'PPpaymentController'
                    }
                },
                ncyBreadcrumb: {

                }
            }).state('paypalpaymentStatus', {
                url: '/paypalpaymentStatus?amount&cc&item_name&item_number&st&tx',
                onEnter: function ($window) { $window.document.title = "Paypal Payment Status"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/paypalPaymentStatus.html?token=' + uuid,
                        controller: 'paypalpaymentResultController'
                    }
                },
                ncyBreadcrumb: {

                }
            })
            .state('formroles', {
                url: '/roles/:formId',
                onEnter: function ($window) { $window.document.title = "Form Roles"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formRoles.html?token=' + uuid,
                        controller: 'formRolesController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Form Roles',
                    parent: 'forms'
                }
            })
            .state('applicationRoles', {
                url: '/application/roles/:appId',
                onEnter: function ($window) { $window.document.title = "Roles"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/applicationRoles.html?token=' + uuid,
                        controller: 'applicationRolesController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Roles',
                    parent: 'home'
                }
            })
            .state('chatSummary', {
                url: '/chat/summary',
                onEnter: function ($window) { $window.document.title = "Chat"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/chat/chatSummary.html?token=' + uuid,
                        controller: 'chatSummaryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Chat',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "chatRoomSummary"
                        })
                    }
                }
            }).state('userChat', {
                url: '/chat/:Id/:chatType',
                onEnter: function ($window) { $window.document.title = "User Chat"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/chat/chatting.html?token=' + uuid,
                        controller: 'userChatController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'User Chat',
                    parent: 'chatSummary'
                }
            }).state('queueHistory', {
                url: '/queue/history/:topicId',
                onEnter: function ($window) { $window.document.title = "Queue History"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/queueHistory.html?token=' + uuid,
                        controller: 'queueHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Queue History',
                    parent: 'forms'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "queueHistory"
                        })
                    }
                }
            }).state('userHistory', {
                url: '/queue/userhistory/:topicId',
                onEnter: function ($window) { $window.document.title = "User Master"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/userMasterHistory.html?token=' + uuid,
                        controller: 'userHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'User Master',
                    parent: 'forms'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "AlluserHistory"
                        })
                    }
                }
            }).state('newUser', {
                url: '/newUser',
                onEnter: function ($window) { $window.document.title = "New User"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/newUserRegister.html?token=' + uuid,
                        controller: 'newUserRegisterController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'New User'
                }
            }).state('userScreen', {
                url: '/queue/userScreen/:topicId',
                onEnter: function ($window) { $window.document.title = "User Screen"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/queue/userQueueScreen.html?token=' + uuid,
                        controller: 'userQueueScreenController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'User Screen'
                }
            }).state('configurator', {
                url: '/form/configurator/:formId',
                onEnter: function ($window) { $window.document.title = "Configurator"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: 'tabulatorConfigurationsModelPopup.html?token=' + uuid,
                        controller: 'tabulatorConfigurationsController'
                    }
                }
            }).state('tasklist', {
                url: '/tasklist',
                onEnter: function ($window) { $window.document.title = "Tasklist"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/tasklist.html?token=' + uuid,
                        controller: 'TaskListController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Tasklist',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "taskList"
                        })
                    }
                }
            }).state('arecords', {
                url: '/form/apprrecords/:formId/:taskid?check',
                onEnter: function ($window) { $window.document.title = "Approval Task"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/approvalRecords.html?token=' + uuid,
                        controller: 'FormApprovalRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Task Details',
                    parent: 'Home'
                }
            }).state('popuparecords', {
                url: '/form/popuparecords/:formId/:taskid?popup',
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/approvalRecords.html?token=' + uuid,
                        controller: 'FormApprovalRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: '',
                    parent: 'public'

                }
            }).state('approvalhistory', {
                url: '/approvalhistory',
                onEnter: function ($window) { $window.document.title = "Approval History"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/approvalhistory.html?token=' + uuid,
                        controller: 'ApprovalHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Approval History',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "approvalhistory"
                        })
                    }
                }
            }).state('TabFormEntryDetails', {
                url: '/form/entryDetails/:formId/:formGroupKey/:Id/:istabAccess/:tabName?popup',
                onEnter: function ($window) { $window.document.title = "Details "; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/formEntryPageofApproval.html?token=' + uuid,
                        controller: 'EntryDetailController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Form',
                    parent: 'Approval'

                }
            }).state('FormEntryDetails', {
                url: '/form/entryDetails/:formId/:formGroupKey/:Id?popup',
                onEnter: function ($window) { $window.document.title = "Details "; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/formEntryPageofApproval.html?token=' + uuid,
                        controller: 'EntryDetailController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Info',
                    parent: 'Approval'

                }
            }).state('calendarList', {
                url: '/calendarList',
                onEnter: function ($window) { $window.document.title = "Calendar"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/calendar.html?token=' + uuid,
                        controller: 'userCalendarAllDetailsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Calendar',
                    parent: 'home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "userAllCalendarLists"
                        })
                    }
                }
            }).state('queueList', {
                url: '/queueList',
                onEnter: function ($window) { $window.document.title = "Queue"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user/queue.html?token=' + uuid,
                        controller: 'userQueueAllDetailsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'User Queue',
                    parent: 'home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "userAllQueueLists"
                        })
                    }
                }
            }).state('approvalconfig', {
                url: '/approvalconfig',
                onEnter: function ($window) { $window.document.title = "Approval Config"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/Approval/approvalconfig.html?token=' + uuid,
                        controller: 'ApprovalConfigController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Approval Config',
                    parent: 'Home'
                }
                , resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "approvalconfig"
                        })
                    }
                }
            })
            .state('publicqueue', {
                url: '/publicqueue',
                views: {
                    'content': {
                        templateUrl: '/Templates/publicqueue/publicqueue.html?token=' + uuid,
                        controller: 'publicQueueController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Public Queue',
                    parent: 'home'
                }
            })
            .state('publicqueuelist', {
                url: '/publicqueuelist',
                views: {
                    'content': {
                        templateUrl: '/Templates/publicqueue/publicqueue-list.html?token=' + uuid,
                        controller: 'publicQueueListController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Public Queue List',
                    parent: 'home'
                }
            })

            .state('templateform', {
                url: '/templateform',
                onEnter: function ($window) { $window.document.title = "Template Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/forms/templateform.html?token=' + uuid,
                        controller: 'templateFormsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Template Forms',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "template"
                        })
                    }
                }
            }).state('pivot', {
                url: '/pivot/:formId',
                onEnter: function ($window) { $window.document.title = "pivot"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/pivotsummary.html?token=' + uuid,
                        controller: 'pivotSummaryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Pivot Summary',
                    parent: 'records'
                }
            }).state('pivotTable', {
                url: '/pivotTable/:formId',
                onEnter: function ($window) { $window.document.title = "pivotTable"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/pivotTableSummery.html?token=' + uuid,
                        controller: 'pivotTableDataSummaryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Pivot Summary',
                    parent: 'records'
                }
            }).state('GoogleMap', {
                url: '/GoogleMap/:formId',
                onEnter: function ($window) { $window.document.title = "GoogleMap"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/GoogleMapLocation.html?token=' + uuid,
                        controller: 'GoogleMapController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Pivot Summary',
                    parent: 'records'
                }
            }).state('kanban', {
                url: '/kanban/:formId',
                onEnter: function ($window) { $window.document.title = "Kanban"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/kanban/kanbanView.html?token=' + uuid,
                        controller: 'kanbanController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Kanban View',
                    parent: 'forms'
                }
            }).state('CalendarStatus', {
                url: '/Calendar_K/:formId',
                onEnter: function ($window) { $window.document.title = "Calendar Resources"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/kanban/calendarKanban.html?token=' + uuid,
                        controller: 'CalendarkanbanController'
                    }
                },
                //ncyBreadcrumb: {
                //    label: 'Kanban View',
                //    parent: 'forms'
                //}
                ncyBreadcrumb: {
                    label: 'Records',
                    parent: 'forms'

                }
            }).state('packery', {
                url: '/packery/:menuId',
                onEnter: function ($window) { $window.document.title = "Folder"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/packery/packery.html?token=' + uuid,
                        controller: 'PackeryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Folder'
                }

            }).state('marketplace', {
                url: '/packerymarketplace',
                onEnter: function ($window) { $window.document.title = "Marketplace"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/packery/Marketplace.html?token=' + uuid,
                        controller: 'packeryMarketplaceController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Market Place'
                }
            }).state('userappforms', {
                url: '/userappforms/:appId',
                onEnter: function ($window) { $window.document.title = "Folder Items"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/packery/userappforms.html?token=' + uuid,
                        controller: 'userAppformsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Folder details',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "userappFormTabulator"
                        })
                    }
                }
            }).state('marketplaceappforms', {
                url: '/marketplace/:appId',
                onEnter: function ($window) { $window.document.title = "Marketplace"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/packery/mappforms.html?token=' + uuid,
                        controller: 'mAppformsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Folder details',
                    parent: 'Home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "mAppformsTabulator"
                        })
                    }
                }
            }).state('applicationform', {
                url: '/applicationform/:appId',
                onEnter: function ($window) { $window.document.title = "Folder Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/packery/applicationforms.html?token=' + uuid,
                        controller: 'applicationformController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Folder',
                    parent: 'Market place'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "userAllForms"
                        })
                    }
                }
            }).state('chat', {
                url: '/chat',
                onEnter: function ($window) { $window.document.title = "Chat"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/chat/userchat.html?token=' + uuid,
                        controller: 'wChatController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'User Chat',
                    parent: ''
                }
            }).state('chatroom', {
                url: '/chatroom/:chatType/:Id',
                onEnter: function ($window) { $window.document.title = "Chat Room"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/chat/chatroom.html?token=' + uuid,
                        controller: 'ChatRoomController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Chat Room',
                    parent: ''
                }
            }).state('topic', {
                url: '/topic',
                onEnter: function ($window) { $window.document.title = "Form Topics"; },
                cache: false,
                views: {
                    'content': {
                        templateUrl: '/Templates/topics/topiclist.html?token=' + uuid,
                        controller: 'topicController'
                    }
                }
                ,
                ncyBreadcrumb: {
                    label: 'Topic',
                    parent: 'home'
                }, resolve: {
                    tabulatorConfiguratorSettings: function ($http, mainService) {
                        return $http.post(mainService.getCurrentEndPointUrl() + "/manageTabulatorConfig", {
                            action: 5, tabulatorID: "topiclist"
                        })
                    }
                }
            })
            .state('printInvoice', {
                url: '/printInvoice/:studentId/:type',
                onEnter: function ($window) { $window.document.title = "printInvoice"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/printPages/printInvoice.html?token=' + uuid,
                        controller: 'printController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Print',
                    parent: ''
                }
            })
            //add application new route
            .state('gerneral-user', {
                url: '/admin/gerneral-user/:formId/:id',
                onEnter: function ($window) { $window.document.title = "General User Profile"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/general-user.html?token=' + uuid,
                        controller: 'GenerarlUserController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'General',
                    parent: 'records'
                }
            })
            .state('counsellor', {
                url: '/admin/counsellor/:formId/:id',
                onEnter: function ($window) { $window.document.title = "Counsellor Profile"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/counsellor.html?token=' + uuid,
                        controller: 'CounsellorController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'General',
                    parent: 'records'
                }
            })
            .state('schedule', {
                url: '/admin/schedule',
                onEnter: function ($window) { $window.document.title = "Schedule Calendar"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/schedule.html?token=' + uuid,
                        controller: 'ScheduleController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Schedule',
                    parent: 'home'
                }
            })
            .state('transactionrecord', {
                url: '/admin/transaction',
                onEnter: function ($window) { $window.document.title = "Transaction Table"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/transaction.html?token=' + uuid,
                        controller: 'TransactionTableController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Transaction Table',
                    parent: 'home'
                }
            })
            .state('forum-details', {
                url: '/admin/forum/:forumId',
                onEnter: function ($window) { $window.document.title = "Forum Detail"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/forum-details.html?token=' + uuid,
                        controller: 'ForumDetailController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Forum Detail',
                    parent: 'home'
                }
            })
            .state('article-details', {
                url: '/admin/article/:articleId',
                onEnter: function ($window) { $window.document.title = "Article Detail"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/article-details.html?token=' + uuid,
                        controller: 'ArticleDetailController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Article Detail',
                    parent: 'home'
                }
            })
            .state('forumMaster', {
                url: '/admin/forum',
                onEnter: function ($window) { $window.document.title = "Forum Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/forum-master.html?token=' + uuid,
                        controller: 'ForumMasterController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Forum Master',
                    parent: 'home'
                }
            })
            .state('cllractivity', {
                url: '/admin/cllractivity',
                onEnter: function ($window) { $window.document.title = "Counsellor work activity"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/cllractivity.html?token=' + uuid,
                        controller: 'CllrActivityController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Counsellor work activity',
                    parent: 'home'
                }
            }).state('notfound', {
                url: '/notfound',
                onEnter: function ($window) { $window.document.title = "notfound"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/error/notfound.html?token=' + uuid,
                        controller: 'notfoundController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'notfound',
                    parent: 'home'
                }
            })
            .state('payment-history', {
                url: '/admin/payment-history',
                onEnter: function ($window) { $window.document.title = "payment-history"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/payment-history.html?token=' + uuid,
                        controller: 'PaymentHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'payment-history',
                    parent: 'home'
                }
            })
            .state('admin-users', {
                url: '/admin/admin-users',
                onEnter: function ($window) { $window.document.title = "payment-history"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/admin/admin-users.html?token=' + uuid,
                        controller: 'AdminUsersController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('calendar_location', {
                url: '/calendar/location-master/:formId',
                onEnter: function ($window) { $window.document.title = "Location Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/location-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            // service master route state
            .state('calendar_service', {
                url: '/calendar/service-master/:formId',
                onEnter: function ($window) { $window.document.title = "Service Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/service-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            // service provider master route state
            .state('calendar_service_provider', {
                url: '/calendar/service-provider-master/:formId',
                onEnter: function ($window) { $window.document.title = "Service Provider Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/service-provider-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            // participant master route state
            .state('calendar_participant', {
                url: '/calendar/participant-master/:formId',
                onEnter: function ($window) { $window.document.title = "Calendar Participant Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/participant-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            // Schedular form route state
            .state('schedular_form_table', {
                url: '/calendar/schedular-form-table/:formId',
                onEnter: function ($window) { $window.document.title = "Schedular Forms"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/schedular-form-table.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('schedular_form', {
                url: '/calendar/schedular-form/:Id',
                onEnter: function ($window) { $window.document.title = "Schedular Form"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/schedular-form.html?token=' + uuid,
                        controller: 'NewSchedularFormController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('session_schedular_form', {
                url: '/calendar/schedular-form/session/:Id',
                onEnter: function ($window) { $window.document.title = "Schedular Form"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/session-schedular-form.html?token=' + uuid,
                        controller: 'SessionSchedularFormController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('business_user_master', {
                url: '/calendar/business-user-master/:formId',
                onEnter: function ($window) { $window.document.title = "User master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/business-user-master.html?token=' + uuid,
                        controller: 'BusinessUserMasterController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            // Transaction Master route state
            .state('transaction_master', {
                url: '/calendar/transaction-master/:formId',
                onEnter: function ($window) { $window.document.title = "Transaction Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/transaction-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('calendar_view', {
                url: '/calender/:formId',
                onEnter: function ($window) { $window.document.title = "Calendar"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/calendar.html?token=' + uuid,
                        controller: 'NewDemoCalenderRecordsControllerTemp'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('queue_view', {
                url: '/queue-manager',
                onEnter: function ($window) { $window.document.title = "Queue Manager"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/queue-manager.html?token=' + uuid,
                        controller: 'queueController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('my_calendar', {
                url: '/mycalendar/:formId',
                onEnter: function ($window) { $window.document.title = "My Calendar"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-calendar.html?token=' + uuid,
                        controller: 'UserAdminCalendarController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('my_favorite', {
                url: '/myfavorite/:formId',
                onEnter: function ($window) { $window.document.title = "My Favorite"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-favorite.html?token=' + uuid,
                        controller: 'UserMyFavoriteController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('user_dashboard', {
                url: '/userdashboard',
                onEnter: function ($window) { $window.document.title = "Dashboard"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/dashboard.html?token=' + uuid,
                        controller: 'UserDashboardController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('my_bookings', {
                url: '/mybookings/:formId',
                onEnter: function ($window) { $window.document.title = "My Bookings"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-booking.html?token=' + uuid,
                        controller: 'UserBookingsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('user_payment_history', {
                url: '/user_payment_history/:formId',
                onEnter: function ($window) { $window.document.title = "My Payment History"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-payment-history.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })

            .state('my_blogs', {
                url: '/my_blogs/:formId',
                onEnter: function ($window) { $window.document.title = "My blogs"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/blogs.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })

            .state('user_b_coin_balance', {
                url: '/b_coin_balance/:formId',
                onEnter: function ($window) { $window.document.title = "B Coin Balance"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-b-coin-balance.html?token=' + uuid,
                        controller: 'UserBCoinController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('my_profile', {
                url: '/myprofile',
                onEnter: function ($window) { $window.document.title = "My Profile"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/user-admin/my-profile.html?token=' + uuid,
                        controller: 'UserProfileController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('calendar_package', {
                url: '/calendar/calendar-package/:formId',
                onEnter: function ($window) { $window.document.title = "Service Package Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/calendar-package-master.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('client_payment_history', {
                url: '/calendar/client-payment-history/',
                onEnter: function ($window) { $window.document.title = "Client payment history"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/calendar-master/client-payment-history.html?token=' + uuid,
                        controller: 'ClientPaymentHistoryController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('superadmin_dashboard', {
                url: '/Superadmin/dashboard/',
                onEnter: function ($window) { $window.document.title = "Dashboard"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/superadmin/dashboard.html?token=' + uuid,
                        controller: 'SuperAdminDashboardController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('SuperadminBusinessUsers', {
                url: '/Superadmin/BusinessUsers/',
                onEnter: function ($window) { $window.document.title = "Business Users"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/superadmin/BusinessUserList.html?token=' + uuid,
                        controller: 'SuperAdminBusinessUsersController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('SuperadminPublicUsers', {
                url: '/Superadmin/PublicUsers/',
                onEnter: function ($window) { $window.document.title = "Public Users"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/superadmin/PublicUserList.html?token=' + uuid,
                        controller: 'SuperAdminPublicUsersController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('SuperAdminUserMaster', {
                url: '/Superadmin/SuperUsers/:formId',
                onEnter: function ($window) { $window.document.title = "Superadmin Users"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formRecords.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('SuperAdminBusinessCompanyMaster', {
                url: '/Superadmin/BusinessCompanyMaster/:UserId',
                onEnter: function ($window) { $window.document.title = "Business Company"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/Superadmin/BusinessCompanyMaster.html?token=' + uuid,
                        controller: 'SuperAdminBusinessCompanyMasterController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
            .state('SuperAdminCompanyMaster', {
                url: '/Superadmin/CompanyMaster/:formId',
                onEnter: function ($window) { $window.document.title = "Company Master"; },
                views: {
                    'content': {
                        templateUrl: '/Templates/formgenerator/formRecords.html?token=' + uuid,
                        controller: 'FormRecordsController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'admin-users',
                    parent: 'home'
                }
            })
    }]);
}(FormGeneratorApp));

