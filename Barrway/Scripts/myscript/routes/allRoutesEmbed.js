(function () {
    'use strict';
    FormGeneratorApp.config(function ($breadcrumbProvider) {
        $breadcrumbProvider.setOptions({
            prefixStateName: 'home',
            template: 'bootstrap3',
            includeAbstract: true
        });      
    });
   
    FormGeneratorApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$qProvider', 'FacebookProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $qProvider, FacebookProvider) {

        ///window.Stripe.setPublishableKey('pk_test_51IvKRmSAu68sur3N3pT3TuS5qyymcZv8r31IybzJfAgIt8KDv1878L8y9c2DZsmsyzSBSLbHotFv8F4OXCMOXe3300xFGKvDa5');
        //facebook API Key to connect Login/SignUp
        FacebookProvider.init("652884638798019");
       // $window.Stripe.setPublishableKey('YOUR-KEY-COMES-HERE');

        $locationProvider.hashPrefix('');
        // use the HTML5 History API 
        //$urlRouterProvider.otherwise('/saveFormEntryDataEmbed');
        $stateProvider.state('login', {
            url: '/login',
            onEnter: function ($window) { $window.document.title = "Form Builder-Login"; },
            views: {
                'content': {
                    templateUrl: 'Templates/auth/login.html',
                    controller: 'loginController'
                }
            }
        }).state('logout', {
            url: '/logout',
            views: {
                'content': {
                    templateUrl: 'Templates/auth/logout.html',
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
                    templateUrl: 'Templates/auth/register.html',
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
                    templateUrl: 'Templates/auth/forgot_password.html',
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
                        templateUrl: 'Templates/auth/resetPassword.html',
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
                onEnter: function ($window) { $window.document.title = "Home"; },
                abstract: false,

                views: {
                    'content': {
                        //templateUrl: 'Templates/Index.html',
                        //controller: 'MainDashboardController'
                        templateUrl: 'Templates/packery/packeryDashboard.html',
                        controller: 'packeryDashboardController'                        
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home',
                    parent: ''
                }

            }).state('homep', {
                url: '/homep',
                onEnter: function ($window) { $window.document.title = "Home"; },
                abstract: false,

                views: {
                    'content': {
                        templateUrl: 'Templates/packery/packeryDashboard.html',
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
                        templateUrl: 'Templates/application/editApplication.html',
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
                        templateUrl: 'Templates/application/createApplication.html',
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
                        templateUrl: 'Templates/application/applicationList.html',
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
                        templateUrl: 'Templates/formgenerator/forms.html',
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
                        templateUrl: 'Templates/settings/form-setting.html',
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
                        templateUrl: 'Templates/settings/form-setting.html',
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
                        templateUrl: 'Templates/formgenerator/forms.html',
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
                        templateUrl: 'Templates/formgenerator/forms.html',
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
                        templateUrl: 'Templates/formgenerator/forms.html',
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
                        templateUrl: 'Templates/formgenerator/forms.html',
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
                        templateUrl: 'Templates/queue/queue.html',
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
                        templateUrl: 'Templates/queue/queue.html',
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
                        templateUrl: 'Templates/queue/queue.html',
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
                        templateUrl: 'Templates/formgenerator/previewForm.html',
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
                        templateUrl: 'Templates/formgenerator/previewForm.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPage.html',
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
                        templateUrl: 'Templates/embed/formEntryPage.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPage.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPage.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPage.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPage.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPageCalender.html',
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
                        templateUrl: 'Templates/formgenerator/formEntryPageCalender.html',
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
                        templateUrl: 'Templates/embed/formEntryPageCalender.html',
                        controller: 'FormEntryCalenderEmbedController'
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
                        templateUrl: 'Templates/formgenerator/formRecords.html',
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
                        templateUrl: 'Templates/formgenerator/formRecords.html',
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
                        templateUrl: 'Templates/formgenerator/demoCalenderRecordsTemp.html',      
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
                        templateUrl: 'Templates/formgenerator/demoCalenderRecordsTemp.html',                 
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
                        templateUrl: 'Templates/queue/queueRecords.html',
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
                        templateUrl: 'Templates/groups/groupcreate.html',
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
                        templateUrl: 'Templates/groups/groupcreate.html',
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
                        templateUrl: 'Templates/groups/groupcreate.html',
                        controller: 'CreateGroupController'
                    }
                }
            }).state('createSubGroup', {
                url: '/createSubGroup/:masterGroupId',
                onEnter: function ($window) { $window.document.title = "Create Sub-group"; },
                views: {
                    'content': {
                        templateUrl: 'Templates/groups/groupcreate.html',
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
                        templateUrl: 'Templates/groups/grouplist.html',
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
                        templateUrl: 'Templates/groups/groupdetails.html',
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
                        templateUrl: 'Templates/groups/assignFormsToGroup.html',
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
                        templateUrl: 'Templates/user/contactlist.html',
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
                        templateUrl: 'Templates/user/createcontact.html',
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
                        templateUrl: 'Templates/user/userprofile.html',
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
                        templateUrl: 'Templates/user/orderHistory.html',
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
                        templateUrl: 'Templates/user/plan.html',
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
                        templateUrl: 'Templates/subscription/subscriptionHistory.html',
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
                        templateUrl: 'Templates/user/forms.html',
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
                        templateUrl: 'Templates/settings/github.html',
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
                        templateUrl: 'Templates/settings/global.html',
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
                        templateUrl: 'Templates/menu/menus.html',
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
                        templateUrl: 'Templates/menu/menuitem.html',
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
                        templateUrl: 'Templates/menu/menuSearch.html',
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
                        templateUrl: 'Templates/menu/createmenu.html',
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
                        templateUrl: 'Templates/menu/createmenu.html',
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
                        templateUrl: 'Templates/forms/personal.html',
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
                        templateUrl: 'Templates/forms/private.html',
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
                        templateUrl: 'Templates/forms/subscribed.html',
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
                        templateUrl: 'Templates/forms/public.html',
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
                        templateUrl: 'Templates/create/form.html',
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
                        templateUrl: 'Templates/create/queues.html',
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
                        templateUrl: 'Templates/create/calendar.html',
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
                       
                        templateUrl: 'Templates/formgenerator/basicCalendar.html',
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
                        templateUrl: 'Templates/forms/filter-criteria.html',
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
                        templateUrl: 'Templates/forms/record-access-rights.html',
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
                        templateUrl: 'Templates/formgenerator/quick-edit.html',
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
                        templateUrl: 'Templates/formgenerator/summary.html',
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
                        templateUrl: 'Templates/user/paymentStatus.html',
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
                        templateUrl: 'Templates/user/paymentPage.html',
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
                        templateUrl: 'Templates/user/paymentPage.html',
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
                        templateUrl: 'Templates/user/ppPaymentPage.html',
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
                        templateUrl: 'Templates/user/paypalPaymentStatus.html',
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
                        templateUrl: 'Templates/formgenerator/formRoles.html',
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
                        templateUrl: 'Templates/formgenerator/applicationRoles.html',
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
                        templateUrl: 'Templates/chat/chatSummary.html',
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
                        templateUrl: 'Templates/chat/chatting.html',
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
                        templateUrl: 'Templates/queue/queueHistory.html',
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
                        templateUrl: 'Templates/queue/userMasterHistory.html',
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
                        templateUrl: 'Templates/queue/newUserRegister.html',
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
                        templateUrl: 'Templates/queue/userQueueScreen.html',
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
                        templateUrl: 'tabulatorConfigurationsModelPopup.html',
                        controller: 'tabulatorConfigurationsController'
                    }
                }
            }).state('tasklist', {
                url: '/tasklist',
                onEnter: function ($window) { $window.document.title = "Tasklist"; },
                views: {
                    'content': {
                        templateUrl: 'Templates/Approval/tasklist.html',
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
                        templateUrl: 'Templates/Approval/approvalRecords.html',
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
                        templateUrl: 'Templates/Approval/approvalRecords.html',
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
                        templateUrl: 'Templates/Approval/approvalhistory.html',
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
                        templateUrl: 'Templates/Approval/formEntryPageofApproval.html',
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
                        templateUrl: 'Templates/Approval/formEntryPageofApproval.html',
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
                        templateUrl: 'Templates/user/calendar.html',
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
                        templateUrl: 'Templates/user/queue.html',
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
                        templateUrl: 'Templates/Approval/approvalconfig.html',
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
                        templateUrl: 'Templates/publicqueue/publicqueue.html',
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
                        templateUrl: 'Templates/publicqueue/publicqueue-list.html',
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
                        templateUrl: 'Templates/forms/templateform.html',
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
                        templateUrl: 'Templates/formgenerator/pivotsummary.html',
                        controller: 'pivotSummaryController'
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
                        templateUrl: 'Templates/kanban/kanbanView.html',
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
                        templateUrl: 'Templates/kanban/calendarKanban.html',
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
                        templateUrl: 'Templates/packery/packery.html',
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
                        templateUrl: 'Templates/packery/Marketplace.html',
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
                        templateUrl: 'Templates/packery/userappforms.html',
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
                        templateUrl: 'Templates/packery/mappforms.html',
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
                        templateUrl: 'Templates/packery/applicationforms.html',
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
                        templateUrl: 'Templates/chat/userchat.html',
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
                        templateUrl: 'Templates/chat/chatroom.html',
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
                        templateUrl: 'Templates/topics/topiclist.html',
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
                        templateUrl: 'Templates/printPages/printInvoice.html',
                        controller: 'printController'
                    }
                },
                ncyBreadcrumb: {
                    label: 'Print',
                    parent: ''
                }
            })
    }]);
}(FormGeneratorApp));
