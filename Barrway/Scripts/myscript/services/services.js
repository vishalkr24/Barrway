(function () {
    'use strict';
    
    FormGeneratorApp.service('mainService', [
        '$http', '$q', '$resource', function ($http, $q, $resource) {
            var mainService, defer, jsonParam
            defer = $q.defer();
            return mainService = {
                apiurl: API_URL +'api/FormAPI',
                endpoint: BASE_URL+'FormAPI',
                baseUrl: BASE_URL,
                loginDetails: function () {
                    var userDetail = {};
                    if (localStorage.getItem("detail") != null && localStorage.getItem("detail") != "")
                        userDetail = JSON.parse(localStorage.getItem("detail"));
                    return userDetail;
                },
                getBaseUrl: function () {
                    return this.baseUrl;
                },
                getOtherBaseUrl: function () {
                    return window.location.href.split("#")[0];
                },
                getEditbaseUrl: function () {
                    return window.location.href.split("#")[0].replace("Index","EditIndex");
                },
                getCurrentEndPointUrl: function () {
                    return this.endpoint;
                },
                manageLogin: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageProfile: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {

                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageForgetPassword: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {

                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getWorkSheetList: function (col, params, reqType, uidParam, formId, userId) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col + "?filename=" + params + "&reqType=" + reqType + " &uid=" + uidParam + "&formId=" + formId + "&userId=" + userId,
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getReferenceFormList: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                managePlans: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {

                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getReferralFormFields: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getCalendarResourceActivity: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getCalendarEventData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                calenderToggle: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getReferralFormFieldsAndData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageTabOneToMany: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getPositions: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getQueueDetails: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                updateQueueDetail: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                updateFormRecord: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageXlDataNew: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageXlData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col + "?dataParam=" + params,
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getFormList: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getPrivateGroupForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getAssignForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageGroupUsers: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApplication: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageMoveFolder: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageSelectedFormCopyr: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                copyApplication: function (col, params) {
                    console.log(params, 'params');
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageDeletion: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageTopic: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                formDataForOne: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                validateUniqueness: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }, manageDraggableForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageSubscription: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageGroups: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageFormData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                executeSchedularFormEntry: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageGeneratedFormData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageBulkGeneratedFormData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },                
                getFormRecordList: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageMenuType: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageMenuMaster: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageMenuItemsMaster: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageGlobalSettings: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageOrder: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                importFormData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getFormSummary: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageFormSummaryConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                //?password=_543k@sdfPASS
                uploadFile: function (col, formda, reqType, uidParam, appId, appTitle, formId, FormTitle, isImportData, userId, actionType) {
                    var deferred = $q.defer();
                    console.log(formda)
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col + "?reqType=" + reqType + "&uid=" + uidParam + "&appId=" + appId + "&appTitle=" + appTitle + "&formId=" + formId + "&formTitle=" + FormTitle + "&isImportData=" + isImportData + "&userId=" + userId + "&actionType=" + actionType + "",
                        method: "POST",
                        data: formda,
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }

                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;

                },
                generateForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManagePaypalSettings: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageWhatsAppMessaging: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageCRUDWhatsAppN: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageEmailNotification: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageKanbanHistory: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageFormRoles: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                checkEditDeleteValidity: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageLanguages: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        debugger;
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getPaypalToken: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server application/x-www-form-urlencoded; charset=utf-8
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApplicationRoles: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageFilterCriteriaConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageCalenderSettingsConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageFormFields: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getCalenderSettingsFormData: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getRoomChat: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getRoomSummary: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageChat: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageSelectedChat: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageChatHeader: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getAdvertisement: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getQueuehistory: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }, getUserHistory: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getUserScreenQueueDetails: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageUserContact: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageUsers: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageTabulatorConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageFormForApproval: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApprovalHistory: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                submitForApproval: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (response) {
                        console.log((response.data), (params.afteraction), 'service');
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(response);
                        if (response.data != null && angular.isDefined(response.data) && response.data == 'Record Updated Successfully') {
                            if (params.afteraction == 1) {
                                //stay
                                alert(response.data);
                                window.location.reload(true)                        
                            }
                            else if (params.afteraction == 2) {
                                //exit
                                window.location.href = '/#/tasklist';
                                window.location.reload(true)                           
                            }
                            else if (params.afteraction == 3) {
                                //refresh
                                location.reload(true);
                            }
                            else {
                                swal(response.data, "Do you want to refresh?", "success")
                                    .then((value) => {
                                        location.reload(true);
                                    });                               
                            }
                        }
                        else {
                            alert(response.data);
                        }
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApprovaltaskForm: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }, getApprovalFormRecordList: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }, manageFormForApproval: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApprovalHistoryRecords: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageApprovalConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageImportUpdatedConfig: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { 'Content-Type': undefined }
                    }).then(function (data) {
                        console.log('service', data);
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                managePayPaltransaction: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageDeletionUserGroup: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params,
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                importAllGroupContact: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params,
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                uploadUserProfile: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { 'Content-Type': undefined }
                    }).then(function (data) {
                        console.log('service', data);
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                renameTabInApproval: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                updatekanbanStatus: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                /*New calender referrrence services */
                manageCalenderReferrenceNew: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageOneToManyReferrence: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getEventDetails: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageEditeventdata: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                manageTags: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                copyCalenderEvent: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageSubscriptionModelForTopic: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageSubscriptionModelDetails: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageSubscriptionModelHistory: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                GeneratingInvoice: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                stripePayment: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                ManageFormConfigration: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.endpoint + "/" + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }
                
            }
        }]);
    ///Cookies Factory
    FormGeneratorApp.factory("CookiesPersistenceService", [
        "$cookies", function ($cookies) {
            var data = "";
            return {
                setCookieData: function (name, value) {
                    $cookies.put(name, value);
                },
                getCookieData: function (name) {
                    data = $cookies.get(name);
                    return data;
                },
                clearCookieData: function (name) {
                    data = "";
                    $cookies.remove(name);
                },
                setCookieWithExpiry: function (name, value) {
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 10);
                    $cookies.put(name, value, { 'expires': expireDate });
                }
            }
        }
    ]);
    FormGeneratorApp.factory('DataService', function () {
        return {
            isEmpty: function (data) {
                if (angular.isUndefined(data) || data == '' || data == null || data == 'Undefined')
                    return true;
                else
                    return false;
            }
        }
    });
    FormGeneratorApp.factory('notifierService', function (toaster,$state) {
        return {
            notify: function (toatertype, msg) {
                toaster.pop('success', 'Update Successful', 'The ' + msg + ' setting was updated');
            },
            notifyError: function (msg) {
                toaster.pop('error', 'Something Went Wrong', 'Please check with an administrator or Service.');
            },
            notifyInfo: function (toatertype, msg) {
                toaster.pop('info', 'Information', 'The ' + msg + 'just happened');
            },
            notifyMessage: function (toatertype, toatertitle, msg) {
                toaster.pop(toatertype, toatertitle, msg);
            },
            notifyRegister: function (toatertype, msg) {
                toaster.pop('success', 'Player Registration', msg);
            },
            notifySweetAlertMessage: function (toatertype, toatertitle, msg) {
                swal({
                    title: toatertitle,
                    text: msg,
                    type: toatertype
                });
            },
            notifySweetAlertMessageForRole: function (toatertype, toatertitle, msg,routenm) {              
                swal({
                    title: toatertitle,
                    text: msg,
                    closeOnEsc: false,
                    allowOutsideClick: false,
                    type: toatertype
                })
                    .then((value) => {
                        $state.go(routenm);
                    });
            }

        };
    });
    FormGeneratorApp.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
        //var clientId = '8147855457-4mj1foqanlnp98ch3h74mklt927hs6kr.apps.googleusercontent.com',    
            //apiKey = 'AIzaSyBqqztecgkArb5au4awy5kY4nE6EZMoAF8',
        var clientId = '8147855457-ifoffp5daessuit3ue0ucq29f2u9ib24.apps.googleusercontent.com',
            apiKey = 'AIzaSyCXx6zTdeeUT-h2tEgl_c_n91wxHvndp1Q',
            scopes = 'https://www.googleapis.com/auth/contacts.readonly',
            domain = '',
            deferred = $q.defer();
        this.login = function () {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false,
                hd: domain
            }, this.handleAuthResult);

            return deferred.promise;
        }
        this.handleClientLoad = function () {
            gapi.client.setApiKey(apiKey);
            gapi.auth.init(function () { });
            window.setTimeout(checkAuth, 1);
        };
        this.checkAuth = function () {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: true,
                hd: domain
            }, this.handleAuthResult);
        };
        this.handleAuthResult = function (authResult) {
            if (authResult && !authResult.error) {
                var data = {};
                gapi.client.load('oauth2', 'v2', function () {
                    var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                        data.email = resp.email;
                    });
                });
                deferred.resolve(data);
            } else {
                deferred.reject('error');
            }
        };
        this.handleAuthClick = function (event) {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false,
                hd: domain
            }, this.handleAuthResult);
            return false;
        };
    }]);
    FormGeneratorApp.filter('customSearchMultiplefilter', function (DataService) {
        return function (items, search) {
            if (!search) {
                return items;
            }
            var title = search;
            if (!title || '' === title) {
                return items;
            }
            return items.filter(function (element, index, array) {
                return (!DataService.isEmpty(element.title) ? element.title.toLowerCase() : "").indexOf(title.toLowerCase()) !== -1 ||
                    (!DataService.isEmpty(element.description) ? element.description.toLowerCase() : "").indexOf(title.toLowerCase()) !== -1
            });
        };
    });   
    FormGeneratorApp.factory('Global', function ($log, $rootScope) {
        $log.debug('Inside Global Service');
        var globalService;
        globalService = {
            rootScope: rootScope,
            setInRootScope: setInRootScope
        };
        return globalService;
        function rootScope() {
            if ($rootScope.varStack === undefined) {
                $rootScope.varStack = {};
            }
            return $rootScope.varStack;
        }
        function setInRootScope(key, object) {
            rootScope()[key] = object;
        }
    });

  
    FormGeneratorApp.factory('Server', [
        '$timeout', '$q', function ($timeout, $q) {
            return {
                max: 99,
                first: 1,
                delay: 100,
                data: [],
                init: function () {
                    for (var i = this.first; i <= this.max; i++) {
                        this.data.push({
                            number: i,
                            title: 'Message #' + i,
                            text: Math.random().toString(36).substring(7)
                        });
                    }
                },
                request: function (start, end) {
                    var self = this;
                    var deferred = $q.defer();
                    $timeout(function () {
                        var result = [];
                        if (start <= end) {
                            for (var i = start; i <= end; i++) {
                                var serverDataIndex = (-1) * i + self.first;
                                var item = self.data[serverDataIndex];
                                if (item) {
                                    result.push(item);
                                }
                            }
                        }
                        deferred.resolve(result);
                    }, self.delay);
                    return deferred.promise;
                }
            };
        }
    ]);
    FormGeneratorApp.factory('datasource', ['$log', '$timeout',
            function (console, $timeout) {
                var get = function (index, count, success) {
                    $timeout(function () {
                        var result = [];
                        for (var i = index; i <= index + count - 1; i++) {
                            result.push("item #" + i);
                        }
                        success(result);
                    }, 100);
                };
                return {
                    get: get
                };
            }
    ]);

   

    FormGeneratorApp.service('translationService', function ($resource) {
        this.getTranslation = function ($scope, language) {
            var languageFilePath = '/Scripts/translation/translation_' + language + '.json';    
            $resource(languageFilePath).get(function (data) {
                $scope.translation = data;
            });

            
        };
    });


    FormGeneratorApp.service('adminService', [
        '$http', '$q', '$resource', function ($http, $q, $resource) {
            var adminService, defer, jsonParam;
            defer = $q.defer();

            return adminService = {
                baseUrl: BASE_URL,
                postAsync: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.baseUrl + col,
                        method: "POST",
                        data: params, //Data sent to server
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                },
                getAsync: function (col, params) {
                    var deferred = $q.defer();
                    $http({
                        cache: false,
                        url: this.baseUrl + col + "?" + params,
                        method: "Get",
                        headers: { "Content-Type": "application/json" },
                        dataType: "json"
                    }).then(function (data) {
                        // Simulated slow fetch from an HTTP server
                        deferred.resolve(data);
                    }, function (e) {
                        deferred.reject(e);
                    });
                    return deferred.promise;
                }
            };
        }]);

}(FormGeneratorApp));

