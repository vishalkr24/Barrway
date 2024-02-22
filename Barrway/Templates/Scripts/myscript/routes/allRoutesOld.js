
(function () {
    'use strict';
FormGeneratorApp.config(function ($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        prefixStateName: 'home',
        template: 'bootstrap3',
        includeAbstract: true
    });
    //$breadcrumbProvider.setOptions({
    //    template: '<ol class="breadcrumb">  <li ng-repeat="step in steps | limitTo:(steps.length-1)" ><a href="{{step.ncyBreadcrumbLink}}" ng-bind-html="step.ncyBreadcrumbLabel"></a>             </li>    <li ng-repeat="step in steps | limitTo:-1" class="active">        <span ng-bind-html="step.ncyBreadcrumbLabel"></span>    </li> </ol >'
    // });

    //var state = $stateProvider.state;
    //$breadcrumbProvider.setOptions({
    //    template: '<ol class="breadcrumb" ng-init="routes = ' + $state.get() + '">' +
    //        '<li ng-repeat="route in routes" ng-switch="step = (route | routeActive:steps)">' +
    //        '<span ng-switch-when="false">{{route.ncyBreadcrumb.label}}</span>' +
    //        '<a ng-switch-default href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
    //        '</li>' +
    //        '</ol>'
    //})

    //$breadcrumbProvider.setOptions({
    //    templateLast: '<i ng-bind-html="ncyBreadcrumbLabel"></i>'
    //});
    //$breadcrumbProvider.setOptions({
    //    prefixStateName: 'home',
    //    template: 'bootstrap3'
    //});
});
FormGeneratorApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$qProvider', 'FacebookProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $qProvider, FacebookProvider) {

    //facebook API Key to connect Login/SignUp
    FacebookProvider.init("652884638798019");
    //$qProvider.errorOnUnhandledRejections(false);
    $locationProvider.hashPrefix('');
    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: false
    //});



    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('login', {
        url: '/login',
        views: {
            'content': {
                templateUrl: 'oldTemplates/auth/login.html',
                controller: 'loginController'
            }
        }
    }).state('register', {
        url: '/register',
        views: {
            'content': {
                templateUrl: 'oldTemplates/auth/register.html',
                controller: 'registerController'
            }
        },
        ncyBreadcrumb: {
            label: 'register'
        }
    }).state('forgotpassword', {
        url: '/forgotpassword',
        views: {
            'content': {
                templateUrl: 'oldTemplates/auth/forgot_password.html',
                controller: 'IndexController'
            }
        }
        ,
        ncyBreadcrumb: {
            label: 'forgotpassword'
        }
    })
        .state('resetPassword', {
            url: '/resetPassword',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/auth/resetPassword.html',
                    controller: 'IndexController'
                }
            }
            ,
            ncyBreadcrumb: {
                label: 'forgotpassword'
            }
        })
        //.state('Index', {
        //url: '/home',
        //abstract: true,
        //views: {
        //    'content': {
        //        templateUrl: 'oldTemplates/Index.html',
        //        controller: 'IndexController'
        //    }
        //}
        //})

        .state('Home', {
            url: '/home',
            abstract: false,

            views: {
                'content': {
                    templateUrl: 'oldTemplates/Index.html',
                    controller: 'HomeController'
                }
            },
            ncyBreadcrumb: {
                label: 'Home',
                parent: ''
            }

        }).state('editApplication', {
            url: '/application/edit/:appId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/application/editApplication.html',
                    controller: 'EditApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: '',
                parent: 'application'
            }

        }).state('createApplication', {
            url: '/application/create',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/application/createApplication.html',
                    controller: 'CreateApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: 'Create',
                parent: 'application'
            }

        }).state('application', {
            url: '/application',
            abstract: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/application/applicationList.html',
                    controller: 'ApplicationListController'
                }
            }
            ,
            ncyBreadcrumb: {
                label: 'Applications',
                parent: 'Home'
            }
        })

        .state('form', {
            url: '/form/create/:topicId?popup',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/forms.html',
                    controller: 'FormGeneratorController'
                }
            },
            ncyBreadcrumb: {
                label: 'form',
                parent: 'forms'
            }
        }).state('formTopicEdit', {
            url: '/form/edittopic/:edittopicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/forms.html',
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
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/forms.html',
                    controller: 'FormGeneratorController'
                }
            },
            ncyBreadcrumb: {
                label: '',
                parent: 'public'

            }
        })

        .state('queue', {
            url: '/queue/create/:topicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/queue.html',
                    controller: 'QueueGeneratorController'
                }
            },
            ncyBreadcrumb: {
                label: 'form',
                parent: 'forms'
            }
        }).state('queueTopicEdit', {
            url: '/queue/edittopic/:edittopicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/queue.html',
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
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/queue.html',
                    controller: 'QueueGeneratorController'
                }
            },
            ncyBreadcrumb: {
                label: 'form',
                parent: 'forms'
            }
        })

        .state('previewForm', {
            url: '/form/preview/:formId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/previewForm.html',
                    controller: 'PreviewFormController'
                }
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('previewFormPage', {
            url: '/form/previewForm/:formId?popup',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/previewForm.html',
                    controller: 'PreviewFormController'
                }
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('saveFormEntryData', {
            url: '/form/saveEntry/:formId?popup&check',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formEntryPage.html',
                    controller: 'FormEntryController'
                }
            },
            ncyBreadcrumb: {
                label: 'Entry',
                parent: 'records'
            }
        }).state('showInformation', {
            url: '/form/show/:formId?popup&check',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formEntryPage.html',
                    controller: 'FormEntryController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('editFormEntryData', {
            url: '/form/editEntry/:formId/:formGroupKey/:Id?popup',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formEntryPage.html',
                    controller: 'FormEntryController'
                }
            },
            ncyBreadcrumb: {
                label: '',
                parent: 'public'

            }
        }).state('records', {
            url: '/form/records/:formId?check',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formRecords.html',
                    controller: 'FormRecordsController'

                }
            },
            ncyBreadcrumb: {
                label: 'Records',
                parent: 'public'

            }
        }).state('calenderToggle', {
            url: '/form/records/:formId/:toggle/',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formRecords.html',
                    controller: 'FormRecordsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Records',
                parent: 'forms'
            }
        }).state('CalenderRecords', {
            url: '/form/calender/:formId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/demoCalenderRecords.html',
                    controller: 'DemoCalenderRecordsController'
                    //templateUrl: 'oldTemplates/formgenerator/CalenderRecords.html',
                    //controller: 'CalenderRecordsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Records',
                parent: 'forms'
            }
        }).state('DemoCalenderRecords', {
            url: '/form/democalender/:formId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/demoCalenderRecords.html',
                    controller: 'DemoCalenderRecordsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Records',
                parent: 'forms'
            }
        })

        .state('queueRecords', {
            url: '/queue/show/:topicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/queueRecords.html',
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
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/groupcreate.html',
                    controller: 'CreateGroupController'
                }
            },
            ncyBreadcrumb: {
                label: 'Create',
                parent: 'grouplist'
            }
        }).state('updateGroup', {
            url: '/updateGroup/:groupId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/groupcreate.html',
                    controller: 'CreateGroupController'
                }
            },
            ncyBreadcrumb: {
                label: "Edit",
                parent: 'group_details'
            }
        }).state('updateSubgroup', {
            url: '/updateSubgroup/:groupId/:isSubGroup',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/groupcreate.html',
                    controller: 'CreateGroupController'
                }
            }
        }).state('createSubGroup', {
            url: '/createSubGroup/:masterGroupId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/groupcreate.html',
                    controller: 'CreateGroupController'
                }
            },
            ncyBreadcrumb: {
                label: "Create Subgroup",
                parent: 'group_details'
            }
        }).state('grouplist', {
            url: '/grouplist',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/grouplist.html',
                    controller: 'GroupListController'
                }
            },
            ncyBreadcrumb: {
                label: 'Groups',
                parent: 'Home'
            }
        }).state('group_details', {
            url: '/group_details/:groupId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/groupdetails.html',
                    controller: 'GroupDetailsController'
                }
            },
            ncyBreadcrumb: {
                label: "{{route}}",
                // label:"",
                parent: 'grouplist'
            }
        }).state('assign_form', {
            url: '/assign_form/:groupId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/groups/assignFormsToGroup.html',
                    controller: 'AssignGroupFormsController'
                }
            },
            ncyBreadcrumb: {
                label: "Assign Forms",
                // parent: 'group_details'
                parent: function ($scope) {
                    var param = $scope.groupId; // Or wherever is the slug value.
                    return 'group_details({groupId: ' + param + '})';
                }
            }
        }).state('contactlist', {
            url: '/contactlist',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/contactlist.html',
                    controller: 'ContactListApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: 'Contacts',
                parent: 'Home'
            }
        }).state('createcontact', {
            url: '/createcontact',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/createcontact.html',
                    controller: 'CreateContactApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: 'Create',
                parent: 'contactlist'
            }
        }).state('marketplace', {
            url: '/marketplace',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/marketplace.html',
                    controller: 'marketplaceApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: 'Market Place',
                parent: 'Home'
            }
        }).state('userprofile', {
            url: '/userprofile',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/userprofile.html',
                    controller: 'userProfileUpdateController'
                }
            },
            ncyBreadcrumb: {
                label: 'My Profile',
                parent: 'Home'
            }
        }).state('orderHistory', {
            url: '/orderHistory',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/orderHistory.html',
                    controller: 'orderHistoryApplicationController'
                }
            },
            ncyBreadcrumb: {
                label: 'Order History',
                parent: 'Home'

            }
        }).state('plan', {
            url: '/plan',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/plan.html',
                    controller: 'userPlanController'
                }
            },
            ncyBreadcrumb: {
                label: 'Plans',
                parent: 'Home'
            }
        }).state('forms', {
            url: '/forms',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/forms.html',
                    controller: 'userformsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Forms',
                parent: 'application'
            }
        }).state('github', {
            url: '/github',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/settings/github.html',
                    controller: 'githubApplicationController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('global', {
            url: '/global',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/settings/global.html',
                    controller: 'globalController'
                }
            },
            ncyBreadcrumb: {

                skip: true
            }
        }).state('menus', {
            url: '/menus',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/menu/menus.html',
                    controller: 'menusApplicationController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('menuSearch', {
            url: '/menuSearch',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/menu/menuSearch.html',
                    controller: 'menuSearchApplicationController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('personal', {
            url: '/personal',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/personal.html',
                    controller: 'personalFormsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Personal Forms',
                parent: 'Home'
            }
        }).state('private', {
            url: '/private',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/private.html',
                    controller: 'privateFormsController'
                }
            },
            ncyBreadcrumb: {
                label: 'Private Group Forms',
                parent: 'Home'
            }
        }).state('subscribed', {
            url: '/subscribed',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/subscribed.html',
                    controller: 'subscribedFormsController'
                }
            },
            ncyBreadcrumb: {
                label: 'My Subscribed Public Forms',
                parent: 'Home'
            }
        }).state('public', {
            url: '/public',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/public.html',
                    controller: 'publicFormsController'
                }
            },
            ncyBreadcrumb: {
                label: 'All Public Forms',
                parent: 'Home'
            }
        })
        .state('cform', {
            url: '/tailor-made/create/form',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/create/form.html',
                    controller: 'createFormController'
                }
            },
            ncyBreadcrumb: {
                skip: true
            }
        })
        .state('queues', {
            url: '/queues',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/create/queues.html',
                    controller: 'createQueuesController'
                }
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('calendar', {
            url: '/calendar',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/create/calendar.html',
                    controller: 'createCalendarController'
                }
            },
            ncyBreadcrumb: {
                skip: true
            }
        }).state('filterCriteria', {
            url: '/filterCriteria/:formId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/filter-criteria.html',
                    controller: 'MergefilterCriteriaController'
                    // templateUrl: 'oldTemplates/forms/filter-criteria2.html',
                    //controller: 'filterCriteriaController'

                }
            },
            ncyBreadcrumb: {
                label: 'Filter Criteria',
                parent: 'public'

            }
        }).state('recordaccessrights', {
            url: '/recordaccessrights/:formId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/forms/record-access-rights.html',
                    controller: 'recordAccessRightController'
                }
            },
            ncyBreadcrumb: {
                label: 'Record Access Rights',
                parent: 'public'

            }
        }).state('quickedit', {
            url: '/quick-edit/:formId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/quick-edit.html',
                    controller: 'quickEditController'
                }
            },
            ncyBreadcrumb: {
                label: 'Quick Edit',
                parent: 'forms'
            }
        }).state('summary', {
            url: '/summary/:formId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/summary.html',
                    controller: 'summaryController'
                }
            },
            ncyBreadcrumb: {
                label: 'Summary',
                parent: 'records'
            }
        }).state('paymentProcess', {
            url: '/paymentProcess/:planId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/paymentPage.html',
                    controller: 'paymentController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('paymentStatus', {
            url: '/paymentStatus?token&PayerID',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/user/paymentPage.html',
                    controller: 'paymentResultController'
                }
            },
            ncyBreadcrumb: {

            }
        }).state('formroles', {
            url: '/roles/:formId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/formRoles.html',
                    controller: 'formRolesController'
                }
            },
            ncyBreadcrumb: {
                label: 'Form Roles',
                parent: 'public'
            }
        })
        .state('applicationRoles', {
            url: '/application/roles/:appId',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/formgenerator/applicationRoles.html',
                    controller: 'applicationRolesController'
                }
            },
            ncyBreadcrumb: {
                label: 'Roles',
                parent: 'application'
            }
        })
        .state('chatSummary', {
            url: '/chat/summary',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/chat/chatSummary.html',
                    controller: 'chatSummaryController'
                }
            },
            ncyBreadcrumb: {
                label: 'Chat',
                parent: 'Home'
            }
        })
        .state('userChat', {
            url: '/chat/:Id/:chatType',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/chat/chatting.html',
                    controller: 'userChatController'
                }
            },
            ncyBreadcrumb: {
                label: 'User Chat',
                parent: 'chatSummary'
            }
        }).state('queueHistory', {
            url: '/queue/history/:topicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/queueHistory.html',
                    controller: 'queueHistoryController'
                }
            },
            ncyBreadcrumb: {
                label: 'Queue History',
                parent: 'forms'
            }
        }).state('userHistory', {
            url: '/queue/userhistory/:topicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/userMasterHistory.html',
                    controller: 'userHistoryController'
                }
            },
            ncyBreadcrumb: {
                label: 'User Master',
                parent: 'forms'
            }
        }).state('newUser', {
            url: '/newUser',
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/newUserRegister.html',
                    controller: 'newUserRegisterController'
                }
            },
            ncyBreadcrumb: {
                label: 'newUser'
            }
        }).state('userScreen', {
            url: '/queue/userScreen/:topicId',
            cache: false,
            views: {
                'content': {
                    templateUrl: 'oldTemplates/queue/userQueueScreen.html',
                    controller: 'userQueueScreenController'
                }
            },
            ncyBreadcrumb: {
                label: 'userScreen'
            }
        })


    //home.application.forms.filterCriteria






    }]);
    FormGeneratorApp.run(function ($rootScope, $timeout, $location, toaster, $filter, $transitions, $state, $breadcrumb, mainService, signalR) {
        $rootScope.isPreviewPage = false;
        $rootScope.isStateLoading = false;
        $rootScope.isLoginPage = false;
        signalR.setHubName("chatHub");
        signalR.start();

        $rootScope.$on("ShowLoading", function (event, message, progress) {
            $rootScope.IND_loading = true;
            $rootScope.IND_loadingMessage = message;
            $rootScope.IND_loadingProgress = progress;
        });
        $rootScope.$on('HideLoading', function () {
            $rootScope.IND_loading = false;
        });

        $rootScope.isActive = function (stateName) {
            return $state.includes(stateName);
        }

        $rootScope.getLastStepLabel = function () {
            return 'Angular-Breadcrumb';
        }
        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        //    if (fromState == "saveFormEntryData" || fromState == "editFormEntryData") {
        //        if (confirm('you have unsaved changed are you to lost it?')) {
        //            event.preventDefault();
        //        }
        //    }
        //});
        //$rootScope.$on('$stateChangeSuccess', function (event, toState, fromState) {

        //});

        $transitions.onStart({}, function (transition) {
            $timeout(function () {
                $rootScope.IND_loading = true;
                var userData = localStorage.getItem("detail");

                // console.log(transition.to().name);
                // alert(transition.to().name);
                if (angular.isDefined(userData) && userData != null) {
                    if (transition.to().name == "login") {
                        $state.go('Home');
                        $rootScope.IND_loading = false;
                    }
                    else if ((transition.from().name == "saveFormEntryData" || transition.from().name == "editFormEntryData")
                        && transition.to().name != "saveFormEntryData" && transition.from().name == "saveFormEntryData" && $rootScope.isEntryNotAllow != true) {
                        if (confirm('you have unsaved changed are you to lost it?')) {
                            localStorage.removeItem("formGroupKey");
                            return true;
                        } else {
                            $rootScope.IND_loading = false;
                            return false;
                        }
                    }
                    else {
                        $rootScope.isLoginPage = true;
                        $rootScope.isPreviewPage = false;
                        setTimeout(function () {
                            $("#navBarLogin").css("display", "flex");
                            $("#navBarLogin2").css("display", "none");
                        }, 150);
                    }
                    if (transition.from().name == "CalenderRecords") {
                        $("body .popover").popover('hide');
                    }



                    var param = {};
                    param.action = 4;
                    $rootScope.userDetail = mainService.loginDetails();
                    param.userId = $rootScope.userDetail.Id;
                    var globalFormSettings = {};
                    var globalLanguageSettings = {};
                    globalFormSettings.value = "tabulator_site.min.css";
                    mainService.manageGlobalSettings("ManageGlobalSettings", param)
                        .then(function (response) {
                            if (response.data != null && angular.isDefined(response.data)) {
                                if (response.data.length > 0) {
                                    //alert(response.data[0].Message);
                                    var temp = response.data;
                                    globalFormSettings = _.findWhere(temp, { type: "tabulator" });
                                    globalLanguageSettings = _.findWhere(temp, { type: "language" });
                                    if (localStorage.getItem("tabulatortheme") == null) {
                                        localStorage.setItem("tabulatortheme", globalFormSettings.value);
                                        loadcssjsfile("assets/tabulator/css/" + globalFormSettings.value, "css", "tabulatortheme");
                                    } else {
                                        if (localStorage.getItem("tabulatortheme") != null) {
                                            loadcssjsfile("assets/tabulator/css/" + globalFormSettings.value, "css", "tabulatortheme");
                                        }
                                    }
                                    if (localStorage.getItem("globalLang") == null) {
                                        localStorage.setItem("globalLang", globalLanguageSettings.value);
                                    } else {
                                        if (localStorage.getItem("globalLang") != null && globalLanguageSettings.value != localStorage.getItem("globalLang")) {
                                            localStorage.setItem("globalLang", globalLanguageSettings.value);
                                        }
                                    }
                                    //$scope.globalFormSettings.type2 = response.data[1].type;
                                    //$scope.globalFormSettings.category2 = response.data[1].category;
                                    //$scope.globalFormSettings.field2 = response.data[1].field;
                                    //$scope.globalFormSettings.value2 = response.data[1].value;
                                    //console.log(response.data)
                                }
                                else {
                                    localStorage.setItem("tabulatortheme", globalFormSettings.value);
                                    loadcssjsfile("assets/tabulator/css/" + globalFormSettings.value, "css", "tabulatortheme");
                                }
                            }
                        }, function (err) {
                            console.log("some error occured." + err);
                        });

                }
                else {
                    if (transition.to().name != "forgotpassword" && transition.to().name != "login" && transition.to().name != "register" && transition.to().name != "resetPassword") {

                        var qrString = $location.search();
                        if ((transition.to().name == "records" && angular.isDefined(qrString.check)) || (transition.to().name == "saveFormEntryData" && angular.isDefined(qrString.check))) {
                            // let the page load for further validations
                        }
                        else {
                            $state.go('login');
                            return true;

                        }

                    }
                    else {
                        $timeout(function () {
                            /// if (angular.isDefined(FB) && transition.to().name == "login")
                            //FB.XFBML.parse(document.getElementById('fb_login'));
                            $rootScope.safeApply();
                        }, 350);
                        return true;
                    }
                    $rootScope.IND_loading = false;
                }


                if (transition.from().name != "userChat") {
                    // signalR.stop();
                }

                //else if (transition.to().name == "saveFormEntryData") {
                //    localStorage.removeItem("formGroupKey");
                //    return true;
                //}
                // console.log("statechange start" + transition);
                //$('.favicon-loader-overlay').addClass('active');
                //$('.favicon-loader').addClass('active');

            }, 150);
        });
        //window.onbeforeunload = function () {
        //    return "Dude, are you sure you want to leave? Think of the kittens!";
        //}
        // window.onbeforeunload = function (event) {
        //  if ($state.current.controller === 'ReloadWarningController') {
        // Ask the user if he wants to reload
        //      return 'Are you sure you want to reload?'
        // } else {
        // Allow reload without any alert
        // event.preventDefault()
        // }
        // };
        $transitions.onSuccess({}, function (transition) {
            $timeout(function () {
                Waves.attach('.float-buttons', ['waves-button', 'waves-float']);
                Waves.attach('.flat-buttons', ['waves-button']);
                Waves.init();

                if (transition.to().name == "previewForm") {
                    $rootScope.isPreviewPage = true;
                }
                if (transition.to().name == "login") {
                    //$rootScope.isLoginPage = true;
                }

                //if (angular.isUndefined(mainService.loginDetails().id)) {
                //    transition.to().url = "/login";
                //    transition.to().name = "login";
                //}
                $rootScope.IND_loading = false;
            }, 150);
            //setTimeout(function () {
            //    $('.favicon-loader-overlay').removeClass('active');
            //    $('.favicon-loader').removeClass('active');
            //}, 300)
            //  console.log("statechange success" + transition);
        });

        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //    var ddd =  toState.name;
        //});
        //$rootScope.$on('$stateChangeSuccess', function (event, toState, fromState) {
        //    $rootScope.isStateLoading = false;
        //    $rootScope.currentState = toState.name;
        //});
        $rootScope.HandleError = function (error, message) {
            $rootScope.$emit('HideLoading');
            if (error != undefined && error.statusText != undefined && error.statusText.length > 0) {
                message = error.statusText;
            }
            toaster.pop('error', "Error", message);
        };

        $rootScope.ToCustomDateTime = function (date) {
            var dateTime = new Date(date);
            dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm");
            return dateTime;
        }


        $rootScope.ToJsonDate = function (date) {
            if (date != null) {
                var date1 = new Date();
                //console.log(date1);
                date = new Date(date);
                // return '\/Date(' + date.getTime() + '+0000)\/';
                return '\/Date(' + moment((date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " +0000", "MM-DD-YYYY Z").valueOf() + ')\/';
            }
        };
        $rootScope.ToJsonDate2 = function (date, format) {
            return moment(date).format(format);
        };
        $rootScope.ToTimeFormat = function (date) {
            if (date != null) {
                var tokens = date.split(/[A-Z]+/);
                var hours = tokens[1];
                if (hours.length == 1) {
                    hours = "0" + hours;
                } else if (hours.length == 0) {
                    hours = "00";
                }
                var minutes = tokens[2];
                if (minutes.length == 1) {
                    minutes = "0" + minutes;
                } else if (minutes.length == 0) {
                    minutes = "00";
                }
                return hours + ":" + minutes;

            }


        };
        $rootScope.ToTimeFormatSeconds = function (date) {
            if (date != null) {
                var tokens = date.split(/[A-Z]+/);
                var hours = tokens[1];
                if (hours.length == 1) {
                    hours = "0" + hours;
                } else if (hours.length == 0) {
                    hours = "00";
                }
                var minutes = tokens[2];
                if (minutes.length == 1) {
                    minutes = "0" + minutes;
                } else if (minutes.length == 0) {
                    minutes = "00";
                }
                var hoursSe = parseInt(hours) * 60 * 60;
                var minutesSe = parseInt(minutes) * 60;
                return hoursSe + minutesSe;

            }


        };
        $rootScope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
    });
}(FormGeneratorApp));
