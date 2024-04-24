$(document).ready(function () {
    setCompanyDetails();
    setTop5Calendars();

    //if (localStorage.getItem("CALENDAR_FUNCTION_TYPE") == "QUEUE") {
    //    $("#nav-calendar-master").attr("href", "/calendar/index#/queue-manager")
    //    $("#nav-schedular-form").attr("href", "/calendar/index#/calendar/queue-schedular-form/2311");
    //    if (window.location.href.includes("/calender/2305")) {
    //        window.location.href = "/calendar/index#/queue-manager";
    //    }
    //} else {
    //    $("#nav-calendar-master").attr("href", "/calendar/index#/calender/2305")
    //    $("#nav-schedular-form").attr("href", "/calendar/index#/calendar/schedular-form-table/2311")
    //};

    $(document).ajaxStart(function () {
        ajaxStart();
    });

    $(document).ajaxStop(function () {
        ajaxStop();
    });
});

function ajaxStart() {
    $(".favicon-loader-overlay").removeClass("ng-hide");
}

function ajaxStop() {
    $(".favicon-loader-overlay").addClass("ng-hide");
}

$(document).on("click", "#navbarDoubleLineContainerNavDropdown .nav-item .nav-link", function () {
    $("#navbarDoubleLineContainerNavDropdown .nav-item .nav-link").removeClass("active");
    $(this).addClass("active");
});

function setSelectedCalendar() {
    $("#ddlMasterCalendar").val(localStorage.getItem('CALENDAR_CODE'));
}

function goToCompanyAdminMaster() {
    if (localStorage.getItem("COMPANY_ID") != null && localStorage.getItem("COMPANY_ID") != "" && localStorage.getItem("COMPANY_ID") != undefined && localStorage.getItem("COMPANY_ID") != "null") {
        if (localStorage.getItem("COMPANY_ROLE") == "SUPERUSER") {
            window.location.href = "/BusinessAdmin/AdminMaster?CompanyId=" + localStorage.getItem("COMPANY_ID");
        } else {
            swal({
                icon: "error",
                title: "Access Denied",
                text: "You are not authorized for this request."
            });
        }
    } else {
        swal({
            icon: "error",
            title: "Error",
            text: "Please select a Company."
        });
        return;
    }
    
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
                height: "75vh",
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

function toggleDropdown() {
    var dropdown = document.querySelector('.dropdown-me');
    dropdown.classList.toggle('open');
}

function toggleDropdown2() {
    var dropdown = document.querySelector('.dropdown-me-2');
    dropdown.classList.toggle('open');
}

function selectItem(item) {
    
    var CompanyId = item.attributes["data-id"].nodeValue.split("_")[2];
    if (parseInt(CompanyId) > 0) {
        $("#navbar-company-selector").val(CompanyId);
        changeCompany();
    }
    
}

function selectItem2(item) {
    
    var CalendarId = item.attributes["data-id"].nodeValue.split("_")[2];
    
    if (CalendarId != null && !CalendarId.includes("undefined")) {
        
        $("#ddlMasterCalendar").val(CalendarId);
        localStorage.setItem("CALENDAR_CODE", CalendarId)
        $(".selectable-calendar-item").removeClass("selected");
        setTimeout(function () {
            $(".selectable-calendar-item[data-id=CLR_SEL_" + localStorage.getItem("CALENDAR_CODE") + "]").addClass("selected");
            $(".lbl-calendar-name").text($("#ddlMasterCalendar option:selected").text());
            window.location.reload();
        }, 500);
    } else {
        $(".lbl-calendar-name").text("Select Calendar");
    }

}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.closest('.dropdown-me')) {
        var dropdowns = document.getElementsByClassName("dropdown-me");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('open')) {
                openDropdown.classList.remove('open');
            }
        }
    }
}

function changeCompany(IsReload = true, returnUrl = null) {
    var companyId = $("#navbar-company-selector option:selected").val();
    
    var data = getSingleCompanyByCompanyId(companyId).Data;

    localStorage.setItem("COMPANY_ID", data.Id);
    localStorage.setItem("CALENDAR_CODE", null);
    localStorage.setItem("COMPANY_CODE", data.COMPANY_CODE);
    localStorage.setItem("COMPANY_NAME_ENGLISH", data.COMPANY_NAME_ENGLISH);
    localStorage.setItem("COMPANY_NAME_CHINESE", data.COMPANY_NAME_CHINESE);
    localStorage.setItem("COMPANY_CATEGORY_ID", data.COMPANY_CATEGORY_ID);
    localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data.COMPANY_SUB_CATEGORY_ID);

    if (window.location.href.includes("ManageCompanyWebsite")) {
        showComapanyWebsiteDetails(1)
        return;
    }

    if (IsReload) {
        window.location.reload();
    } else {
        window.location.href = returnUrl;
    }
    

}

function Logout() {
    localStorage.removeItem("COMPANY_ID");
    localStorage.removeItem("COMPANY_CODE");
    localStorage.removeItem("publicUserSelectedCompany");
    localStorage.removeItem("CALENDAR_CODE"); 
    localStorage.removeItem("COMPANY_NAME_ENGLISH");
    localStorage.removeItem("COMPANY_NAME_CHINESE");
    localStorage.removeItem("COMPANY_CATEGORY_ID");
    localStorage.removeItem("COMPANY_SUB_CATEGORY_ID");
    $('#mySignOutForm').submit()
}

function showNavbarNavigation(divId) {
    $("#navbarContainerNavDropdown ul li a").removeClass("active");
    $("#" + divId).addClass("active");
}

function setCompanyDetails() {
    
    var allCompanies = getAllCompanies();
    var user = getSingleUser();
    
    if (allCompanies.Status) {
        var data = allCompanies.Data;
        $("#navbar-company-selector").empty();
        $("#disp-navbar-company-selector").empty();
        var defaultId = "";

        for (var i = 0; i < data.length; i++) {

            if (data[i].IS_DEFAULT == "Y") {
                defaultId = data[i].Id;

                if (localStorage.getItem("COMPANY_ID") == null || localStorage.getItem("COMPANY_ID") == "null" || localStorage.getItem("COMPANY_ID") == undefined) {
                    localStorage.setItem("COMPANY_ID", data[i].Id);
                    localStorage.setItem("COMPANY_CODE", data[i].COMPANY_CODE);
                    
                    localStorage.setItem("COMPANY_NAME_ENGLISH", data[i].COMPANY_NAME_ENGLISH);
                    localStorage.setItem("COMPANY_NAME_CHINESE", data[i].COMPANY_NAME_CHINESE);
                    localStorage.setItem("COMPANY_CATEGORY_ID", data[i].COMPANY_CATEGORY_ID);
                    localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data[i].COMPANY_SUB_CATEGORY_ID);
                }

                $("#navbar-company-selector").append(`<option selected value="${data[i].Id}">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</option>`);
                $("#disp-navbar-company-selector").append(`<a href="javascript:void(0)" data-id="CMP_SEL_${data[i].Id}" class="selectable-company-item" onclick="selectItem(this)">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</a>`);

            } else {
                $("#navbar-company-selector").append(`<option value="${data[i].Id}">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</option>`);
                $("#disp-navbar-company-selector").append(`<a href="javascript:void(0)" data-id="CMP_SEL_${data[i].Id}" class="selectable-company-item" onclick="selectItem(this)">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</a>`);
            }

            if (localStorage.getItem("COMPANY_ID") == data[i].Id) {

                localStorage.setItem("COMPANY_CODE", data[i].COMPANY_CODE);

                localStorage.setItem("COMPANY_NAME_ENGLISH", data[i].COMPANY_NAME_ENGLISH);
                localStorage.setItem("COMPANY_NAME_CHINESE", data[i].COMPANY_NAME_CHINESE);
                localStorage.setItem("COMPANY_CATEGORY_ID", data[i].COMPANY_CATEGORY_ID);
                localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data[i].COMPANY_SUB_CATEGORY_ID);

                $("#navbar-company-selector").val(localStorage.getItem("COMPANY_ID"));
                localStorage.setItem("COMPANY_ROLE", data[i].ROLE_TYPE);

                $(".company-name").text(data[i].COMPANY_NAME_ENGLISH);
                $(".company-image").attr("src", data[i].COMPANY_LOGO_PATH.replace("~", ".."));
                $(".company-email").text(data[i].COMPANY_EMAIL);

                $(".user-name").text(user.Data.USER_ID);
                $(".user-email").text(user.Data.USER_EMAIL);
                $(".company-email").text(user.Data.USER_EMAIL);

                var splitData = data[i].COMPANY_NAME_ENGLISH.split(' ');
                if (splitData.length >= 2) {
                    $(".company-prefix").text(splitData[0][0] + splitData[1][0]);
                } else {
                    $(".company-prefix").text(data[i].COMPANY_NAME_ENGLISH[0] + data[i].COMPANY_NAME_ENGLISH[data[i].COMPANY_NAME_ENGLISH.length - 1]);
                }

                $("#navbar-company-selector").val(localStorage.getItem("COMPANY_ID"));
                $(".lbl-company-name").text(localStorage.getItem("COMPANY_NAME_ENGLISH"));

                $(".selectable-company-item").removeClass("selected");
                setTimeout(function () {
                    $(".selectable-company-item[data-id=CMP_SEL_" + localStorage.getItem("COMPANY_ID") + "]").addClass("selected");
                }, 500);
                

            }

        }


    } else {

        if (!window.location.href.includes("SetupCompanyProfile") && getUserRole() == "SUPERADMIN_USER") {
            window.location.href = "/BusinessAdmin/SetupCompanyProfile?&IsNew=true";
        }
        
    }

    if (localStorage.getItem("COMPANY_ROLE") == "SUPERUSER") {
        $("#admin-master-nav").show();
    } else {
        $("#admin-master-nav").hide();
    }

    if (localStorage.getItem("COMPANY_ROLE") == "SUPERUSER") {
        $("#subscription-master-nav").show();
    } else {
        $("#subscription-master-nav").hide();
    }

    $("#disp-navbar-company-selector").append(`<div class="add-company">
                                            <a href="/BusinessAdmin/CompanyMaster"><button>+ Add new company</button></a>
                                        </div>`);
}

function showComapanyWebsiteDetails(pageId = 1) {
    window.location.href = "/BusinessAdmin/ManageCompanyWebsite?CompanyId=" + localStorage.getItem('COMPANY_ID') + "&PId=" + pageId;
}

function setTop5Calendars() {
    var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"));

    if (data.data != null) {
        var calendars = data.data;

        $("#calendarsSubMenu").empty();

        //var len = 0;

        //if (calendars.length < 5) {
        //    len = calendars.length;
        //} else {
        //    len = 5;
        //}
        
        for (var i = 0; i < calendars.length; i++) {
            $("#calendarsSubMenu").append(`<a class="dropdown-item" onclick="GoToCalendarLayout(${calendars[i].Id}, '${calendars[i].CALENDAR_CODE}')" href="#" data-placement="left">${calendars[i].CALENDAR_NAME}</a>`);
        }

    }

}

function openCalendarSetting() {
    let company = localStorage.getItem("COMPANY_ID");
    let calendar = localStorage.getItem("CALENDAR_CODE");

    if (company != null && company != undefined) {
        if (calendar != null && calendar != undefined && !calendar.includes("undefined")) {
            window.location.replace(`/BusinessAdmin/SetupCompanyCalendar?CompanyId=${company}&IsPartial=false&CalendarCode=${calendar}`)
        } else {
            swal({
                icon: "Error",
                title: "Select a Calendar",
                text: "Please select a Calendar."
            });
        }
    } else {
        swal({
            icon: "Error",
            title: "Setup or select a company",
            text: "Setup or select a company and then create a calendar to view this information."
        });
    }
}