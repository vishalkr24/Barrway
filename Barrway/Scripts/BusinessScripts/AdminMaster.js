$(document).ready(function () {
    /*showNavbarNavigation('companyMasterMegaMenu');*/
    setCalendarMaster();
    
})

function setCalendarMaster() {
    //var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    //console.log(data);

    var CalendarMasterList = function () {
        var columns = [
            { title: 'Business Code', field: 'BUSINESS_CODE', headerFilter: "input" },
            { title: 'User Id', field: 'USER_ID', headerFilter: "input" },
            { title: 'Email Id', field: 'USER_EMAIL', headerFilter: "input" },
            {
                title: 'Role Type', field: 'ROLE_TYPE', headerFilter: "input", formatter: function (cell, formatter) {
                    if (cell.getData().ROLE_TYPE == 'SUPERUSER') {
                        return `<label style="background:crimson; border-radius:3px; color:white; font-size: smaller; padding:4px 10px; ">Super User</label>`;
                    } else {
                        return `<label style="background:lightgrey; border-radius:3px; font-size: smaller; padding:4px 10px; ">Admin</label>`;
                    }
                }
            },
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
                groupHeader: function (value, count, data, group) {
                    //value - the value all members of this group share
                    //count - the number of rows in this group
                    //data - an array of all the row data objects in this group
                    //group - the group component for the group

                    return value + "<span style='color:#d00; margin-left:10px;'>(" + count + " item)</span>";
                },
                height: "530px",
                layout: "fitDataFill",
                responsiveLayout: false,
                initialSort: [
                    { column: "ROLE_TYPE", dir: "desc" }
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
                ajaxURL: "/BusinessAdmin/GetAllBusinessAssignedUsers/",
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