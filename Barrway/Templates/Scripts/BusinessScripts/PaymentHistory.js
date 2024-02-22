$(document).ready(function () {
    showNavbarNavigation('subscriptionsMegaMenu');
    setSubscriptionHistoryMaster();
    
})

function setSubscriptionHistoryMaster() {
    //var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    //console.log(data);
    var companyId = localStorage.getItem("COMPANY_ID")
    var PaymentHistoryMasterList = function () {
        var columns = [
            {
                title: 'Action', field: 'ACTION', formatter: function (cell, formatter) {
                    return `<a href='#' class="btn btn-warning text-light" style="border-radius:300px; background:#E2476C;"><i class="bi-info-circle"></i></a>
                            <a href='#' class="btn btn-primary text-light" style="border-radius:300px;">PDF</a>`;
                }, headerSort: false
            },
            { title: 'Order Id', field: 'ORDER_ID', headerFilter: "input" },
            { title: 'Plan Name', field: 'PLAN_NAME', headerFilter: "input" },
            { title: 'Description', field: 'PAYMENT_DESCRIPTION', headerFilter: "input" },
            { title: 'Method', field: 'PAYMENT_METHOD', headerFilter: "input" },
            { title: 'HKD', field: 'HKD', headerFilter: "input" },
            {
                title: 'Paid Date', field: 'PAYMENT_DATE', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("DD-MM-YYYY HH:mm:ss")
                }
            },
            { title: 'Status', field: 'PAYMENT_STATUS', headerFilter: "input" }
        ];

        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                height: "530px",
                layout: "fitDataFill",
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
                    //id - tables persistence id
                    //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
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
                ajaxURL: "/BusinessAdmin/GetCompanyPaymentHistory",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: { //ajax parameters
                    CompanyId: companyId
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
                    //url - the URL of the request
                    //params - the parameters passed with the request
                    //response - the JSON object returned in the body of the response.
                    //$('#form-records').unblock();
                    //$.unblockUI();
                    if (response.data) {
                        return response;
                    }
                    else {
                        return response;
                    }

                },
                paginationSize: 50,

            };
            var tabulator = initTabulator('form-records', options);
            $('.form-builder-loader').hide();
        }, 150);

    };

    PaymentHistoryMasterList();

}

function initTabulator(elementID, options) {
    if (!elementID) {
        alert("Tabulator element is not set.");
    }

    var basicConfig = {
        height: "60%",
        layout: 'fitDataFill',
        placeholder: "No record found.",
        movableColumns: true,
        tooltips: true,
        tooltipsHeader: true,
        responsiveLayout: false,
        persistenceMode: "local",
        persistentLayout: true,
        persistentSort: true, //Enable sort persistence
        persistentFilter: false, //Enable filter persistence
        groupStartOpen: false,
        groupToggleElement: "header",
        paginationSize: 50,
        ajaxLoader: false,
        ajaxProgressiveLoadScrollMargin: 300, //triger next ajax load when scroll bar is 300px or less from the bottom of the table.
        ajaxRequesting: function (url, params) {
            //url - the URL of the request
            //params - the parameters passed with the request
            showTextLoader('#' + elementID, 'Loading Data');
        },
        ajaxResponse: function (url, params, response) {
            //url - the URL of the request
            //params - the parameters passed with the request
            //response - the JSON object returned in the body of the response.
            $('#' + elementID).unblock();
            return response; //return the response data to tabulator
        },
        ajaxError: function (xhr, textStatus, errorThrown) {
            //xhr - the XHR object
            //textStatus - error type
            //errorThrown - text portion of the HTTP status
            $('#' + elementID).unblock();
        }
    };

    var config = basicConfig;

    if (options !== '') {
        config = $.extend({}, basicConfig, options);
    }

    //$("#" + elementID).tabulator(config);
    return new Tabulator("#" + elementID, config);
}