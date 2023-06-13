$(document).ready(function () {
    setCompanyDetails();
    setSelectedCalendar();
});

function setSelectedCalendar() {
    $("#ddlMasterCalendar").val(localStorage.getItem('CALENDAR_CODE'));
}

function setCalendarDashboardData() {
    var response = getCompanyCalendarDashboardData(localStorage.getItem('COMPANY_CODE'), localStorage.getItem('CALENDAR_CODE'))

    console.log(response);

    if (response.Status) {
        var data = response.Data;
        $("#lblBookingToday").text(data[0].BookingsToday)
        $("#lblBookingThisWeek").text(data[1].BookingsThisWeek)
    }


    // set upcoming bookings tabulator

    var companyCode = localStorage.getItem("COMPANY_CODE")
    var calendarCode = localStorage.getItem("CALENDAR_CODE");

    var CalendarMasterList = function () {
        var columns = [
            //{
            //    title: '', field: 'ACTION', formatter: function (cell, formatter) {
            //        return `<a href='#' onclick="GoToCalendarLayout(${cell.getRow().getData().Id}, '${cell.getRow().getData().CALENDAR_CODE}')" class="btn btn-warning text-light" style="border-radius:300px; background:#E2476C;">Calendar</a>`;
            //    }, headerSort: false
            //},
            {
                title: 'Date', field: 'BOOKING_DATE', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().BOOKING_DATE).format("DD-MM-YYYY")
                }
            },
            { title: 'Service Name', field: 'SERVICE_NAME', headerFilter: "input" },
            { title: 'Service Provider', field: 'SERVICE_PROVIDER', headerFilter: "input" },
            { title: 'Client Name', field: 'CLIENT_NAME', headerFilter: "input" },
            {
                title: 'From Time', field: 'FROM_TIME', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().FROM_TIME).format("HH:mm A")
                }
            },
            {
                title: 'To Time', field: 'TO_TIME', headerFilter: "input", formatter: function (cell, formatter) {
                    return moment(cell.getData().TO_TIME).format("HH:mm A")
                }
            }
        ];

        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                height: "530px",
                layout: "fitColumns",
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
                ajaxURL: "/Calendar/GetCalendarUpcomingBookingsData",
                ajaxConfig: "POST", //ajax HTTP request type
                ajaxContentType: "json",
                ajaxParams: { //ajax parameters
                    CompanyCode: companyCode,
                    CalendarCode: calendarCode
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

function Logout() {
    localStorage.removeItem("COMPANY_ID");
    localStorage.removeItem("COMPANY_CODE");
    localStorage.removeItem("COMPANY_NAME_ENGLISH");
    localStorage.removeItem("COMPANY_NAME_CHINESE");
    localStorage.removeItem("COMPANY_CATEGORY_ID");
    localStorage.removeItem("COMPANY_SUB_CATEGORY_ID");
    $('#mySignOutForm').submit()
}

function showNavbarNavigation(divId) {
    $("#navbarDoubleLineContainerNavDropdown li a").removeClass("active");
    $("#" + divId).addClass("active");
}

function setCompanyDetails() {
    var data = getSingleCompanyByCompanyId(localStorage.getItem('COMPANY_ID'));
    var user = getSingleUser();
    

    if (data.Status) {
        var company = data.Data;

        $(".company-name").text(company.COMPANY_NAME_ENGLISH);
        $(".company-image").attr("src", company.COMPANY_LOGO_PATH.replace("~", ".."));
        $(".company-email").text(company.COMPANY_EMAIL);

        $(".user-name").text(user.Data.USER_ID);
        $(".user-email").text(user.Data.USER_EMAIL);
        $(".company-email").text(user.Data.USER_EMAIL);

        var splitData = company.COMPANY_NAME_ENGLISH.split(' ');
        if (splitData.length >= 2) {
            $(".company-prefix").text(splitData[0][0] + splitData[1][0]);
        } else {
            $(".company-prefix").text(company.COMPANY_NAME_ENGLISH[0] + company.COMPANY_NAME_ENGLISH[company.COMPANY_NAME_ENGLISH.length - 1]);
        }

        $(".lbl-company-name").text(company.COMPANY_NAME_ENGLISH);
        $(".img-company-logo").attr("src", company.COMPANY_LOGO_PATH.replace("~", ".."));

    }
}

function showComapanyWebsiteDetails(pageId = 1) {
    window.location.href = "/BusinessAdmin/ManageCompanyWebsite?CompanyId=" + localStorage.getItem('COMPANY_ID') + "&PId=" + pageId;
}