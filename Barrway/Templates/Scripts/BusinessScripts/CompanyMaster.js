$(document).ready(function () {
    //showNavbarNavigation('companyMasterMegaMenu');
    setCalendarMaster();
    
})

function changeCompanyMaster(companyId) {
    $("#navbar-company-selector").val(companyId);
    changeCompany();
}
function editCompanyMaster(companyId) {
    $("#navbar-company-selector").val(companyId);
    changeCompany(false, "/BusinessAdmin/ManageCompanyWebsite?CompanyId=" + localStorage.getItem('COMPANY_ID') + "&PId=1");
}

function setCalendarMaster() {
    //var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    //console.log(data);

    var CalendarMasterList = function () {
        var columns = [
            {
                title: '', field: 'ACTION', formatter: function (cell, formatter) {
                    return `${(cell.getRow().getData().Id == localStorage.getItem("COMPANY_ID")) ? " <a href='javascript:void(0)' class='btn btn-success text-light' disabled style='border-radius:300px;'>Current</a>" : `<a href='javascript:void(0)' onclick="changeCompanyMaster(${cell.getRow().getData().Id})" class="btn btn-warning text-light" style="border-radius:300px; background:#E2476C;">Change</a>`} 
                            <a href='javascript:void(0)' onclick="editCompanyMaster(${cell.getRow().getData().Id})" class="btn btn-primary text-light" style="border-radius:300px;">Edit</a> `;
                }, headerSort: false
            },
            { title: 'Company Code', field: 'COMPANY_CODE', headerFilter: "input" },
            { title: 'Company Name', field: 'COMPANY_NAME_ENGLISH', headerFilter: "input" },
            { title: 'Chinese Name', field: 'COMPANY_NAME_CHINESE', headerFilter: "input" },
            { title: 'Company Phone', field: 'COMPANY_PHONE', headerFilter: "input" },
            { title: 'Company Category', field: 'COMPANY_CATEGORY_NAME', headerFilter: "input" },
            { title: 'Sub Category', field: 'COMPANY_SUB_CATEGORY_NAME', headerFilter: "input" },
            {
                title: 'Created Date', field: 'created_at', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().created_at).format("DD-MM-YYYY HH:mm:ss")
                }
            }
        ];

        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                groupBy: "BUSINESS_CODE",
                groupStartOpen: true,
                height: "530px",
                layout: "fitDataFill",
                responsiveLayout: false,
                initialSort: [
                    { column: "created_at", dir: "desc" }
                ],
                rowClick: function (e, row) {
                    //e - the click event object
                    //row - row component
                    if (row.getData().IS_EDITABLE == 'Y') {
                        row.toggleSelect();
                    }
                    //toggle row selected state on row click
                },
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
                ajaxURL: "/BusinessAdmin/GetAllCompaniesMaster/",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: { //ajax parameters
                    
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

    CalendarMasterList();

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