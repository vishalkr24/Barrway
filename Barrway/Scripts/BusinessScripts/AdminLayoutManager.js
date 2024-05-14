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

function GenerateEventQR(eventId) {
    $.ajax({
        url: "/Calendar/GenerateEventQR",
        type: "Get",
        data: {
            eventId: eventId
        },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    $("#GeneratedQRCodeModalAdmin img").attr("src", response.Data.QRImageURL.replace("~", ".."));
                    $("#GeneratedQRCodeModalAdmin #btn-print-qr").attr("href", response.Data.QRImageURL.replace("~", ".."));
                    $("#GeneratedQRCodeModalAdmin").modal("show");
                } else {
                    alert("Failed to generate QR Code");
                }
            }
        }
    })

}

function ScanStudentQR(eventId) {

    const scanner = new Html5QrcodeScanner("qr-scanner", {
        qrbox: {
            width: 250,
            height: 250,
        },
        fps: 20,
    });
    scanner.render(success, error);

    $("#customEventDetailsModelPopUp").modal("hide");
    $("#html5-qrcode-button-camera-permission").addClass("btn btn-primary");
    $("#html5-qrcode-anchor-scan-type-change").addClass("btn btn-danger");
    $("#html5-qrcode-anchor-scan-type-change").empty();
    $("#html5-qrcode-anchor-scan-type-change").append(`Upload image to scan`);
    setTimeout(function () {
        $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
    }, 1000);

    $("#html5-qrcode-button-camera-start").on("click", function () {
        setTimeout(function () {
            $("#html5-qrcode-button-camera-stop").addClass("btn btn-danger");
        }, 500);
    })

    $("#html5-qrcode-button-camera-stop").on("click", function () {
        setTimeout(function () {
            $("#html5-qrcode-button-camera-start").addClass("btn btn-primary");
        }, 500);
    });

    $('#WebCamModal').on('hidden.bs.modal', function () {
        scanner.clear();
    });

    function success(result) {

        if (result.includes("Public/MarkPresentByCompany")) {
            $.ajax({
                url: result,
                type: "get",
                data: {
                    EventId: eventId
                },
                success: function (response) {
                    if (response.Status) {
                        swal({
                            icon: "success",
                            title: "Success",
                            text: "Attendance marked!"
                        });
                    } else {
                        swal({
                            icon: "error",
                            title: "Error",
                            text: response.Message
                        });
                    }
                },
                error: function (err) {
                    alert("Request not allowed");
                }
            })

            $("#html5-qrcode-button-camera-stop").trigger("click");

        }

    }

    function error(err) {

    }

    $("#WebCamModal").modal("show");

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
    var columns1 = [
        {
            title: 'Attendance', field: 'ACTION', formatter: function (cell, formatter) {

                return `<div class="login_primary"><a href='javascript:void(0)' onclick="ScanStudentQR('${cell.getData().EVENT_ID}')" class="btn btn-primary text-light" style="border-radius: 40px;">Scan QR</a>
        
                            <a href='javascript:void(0)' onclick="GenerateEventQR('${cell.getData().EVENT_ID}')"><img src="../../assets/img/QR_CODE_LOGO.png" style="height: 40px; width: 40px;" /></a></div>`;
            }, headerSort: false
        },
        {
            title: 'Date', field: 'BOOKING_DATE', headerFilter: "input"
        },
        { title: 'Service', field: 'SERVICE_NAME', headerFilter: "input" },
        { title: 'Service Provider', field: 'SERVICE_PROVIDER', headerFilter: "input" },
        { title: 'Client Name', field: 'CLIENT_NAME', headerFilter: "input" },
        {
            title: 'From Time', field: 'FROM_TIME', headerFilter: "input"
        },
        {
            title: 'To Time', field: 'TO_TIME', headerFilter: "input"
        }
    ];
    var columns2 = [{ title: 'FROM_TIME', field: 'FROM_TIME', visible: false } ];
    var CalendarMasterList = function () {
      
        setTimeout(function () {
            var options = {
                placeholder: "No Data.",
                tooltips: function (cell) {
                    return cell.getValue();
                },
                height: "75vh",
                layout: "fitDataFill",
                responsiveLayout: false,
                initialSort: [
                    { column: "FROM_TIME", dir: "desc" }
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
                columns: columns1,
                footerElement: "<div style='text-align:left' id='no-of-forms'></div>",
                dataLoaded: function (data) {
                    //data - all data loaded into the table                        
                    var count = 0;
                    if (data.length > 0)
                        count = data[0].total_records;
                    $('#form-records .tabulator-footer #no-of-forms').text("Total: " + count + " Entries");

                    if (window.innerWidth <= 576) {
                        toogleRowFormatter();
                    }
                },
                /// pagination: "local",              
                ajaxFiltering: false,
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
                        //params.sorters.push({ field: "created_at", dir: "desc" });
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



            const columnFields = columns1.map(column => column.field);

            // OPTIONAL - These columns will not be searched.
            // If you want to search all columns, set to [].
            const ignoreColumns = []

            const searchFields = columnFields.filter(field => !ignoreColumns.includes(field))

            const searchBar = document.getElementById("searchBar");

            searchBar.addEventListener("input", function () {
                // Capitalization does not affect search results, but white space does.
                var searchValue = searchBar.value.trim();

                // Allows searching in multiple columns at the same time
                var filterArray = searchFields.map((field) => {
                    // You can customize the properties here
                    return { field: field, type: 'like', value: searchValue };
                });
                var table = Tabulator.prototype.findTable("#form-records")[0];
                table.setFilter([filterArray])
            });


          
        }, 150);
    };

    CalendarMasterList();

    function toogleRowFormatter() {
        var table = Tabulator.prototype.findTable("#form-records")[0];
        if (window.innerWidth <= 576) { // Change this breakpoint according to your needs
            table.options.rowFormatter = function (row) {
                var element = row.getElement(),
                    data = row.getData(),
                    width = element.offsetWidth,
                    rowTable, cellContents;

                //clear current row data
                while (element.firstChild) element.removeChild(element.firstChild);

                //define a table layout structure and set width of row
                rowTable = document.createElement("table")
                rowTable.style.width = (width - 18) + "px";

                rowTabletr = document.createElement("tr");

                //add image on left of row
                //cellContents = "<td><img src='/sample_data/row_formatter/" + data.image + "'></td>";

                //add row data on right hand side
                cellContents = `<td class="login_primary"><a href='javascript:void(0)' style='margin-left:5px;' onclick="ScanStudentQR('${data.EVENT_ID}')"><img src="../../assets/img/qr-scan.png" style="height: 40px; width: 40px;" /></a>
                    <a href='javascript:void(0)' onclick="GenerateEventQR('${data.EVENT_ID}')"><img src="../../assets/img/QR_CODE_LOGO.png" style="height: 40px; width: 40px;" /></a></td>`;
                cellContents += "<td><div><strong>Date:</strong> " + data.BOOKING_DATE + "</div><div><strong>Service Name:</strong> " + data.SERVICE_NAME + "</div><div><strong>Service Provider:</strong> " + data.SERVICE_PROVIDER + "</div><div><strong>Client Name:</strong> " + data.CLIENT_NAME
                "</div><div><strong>From Time:</strong> " + data.FROM_TIME + "</div><div><strong>To Time:</strong> " + data.TO_TIME + "</div></td>"

                rowTabletr.innerHTML = cellContents;

                rowTable.appendChild(rowTabletr);

                //append newly formatted contents to the row
                element.append(rowTable);
            };
            table.setColumns(columns2);
            table.redraw();
        } else {
            table.options.rowFormatter = null;
            table.setColumns(columns1);
            table.redraw();
        }
        
    }
    //  var table = Tabulator.prototype.findTable("#form-records")[0];
    window.addEventListener('resize', function () {
        toogleRowFormatter();
    });



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
                
                let logopath = (data[i].COMPANY_LOGO_PATH != null && data[i].COMPANY_LOGO_PATH != "") ? data[i].COMPANY_LOGO_PATH?.replace("~", "..") : "../assets/svg/logos/favicon.png";
                $(".company-image-brand").attr("src", logopath);

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