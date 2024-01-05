$(document).ready(function () {
    if (getUserRole() == "BUSINESS_USER") {
        setPageStatus();
    } else {
        $("#content-2").show();
        $("#content").hide();
    }
    
    showNavbarNavigation('dashboardMegaMenu');
    setDashboardData();
});

function setDashboardData() {
    var response = getCompanyDashboardData(localStorage.getItem('COMPANY_CODE'));

    console.log(response);

    if (response.Status) {
        data = response.Data[0];
        $("#lblBookingToday").text(data[2].BookingsToday)
        $("#lblBookingThisWeek").text(data[3].BookingsThisWeek)
        $("#lblNumberOfServiceProvider").text(data[4].ServiceProviders)
        $("#lblNumberOfCalendar").text(data[0].Calendars)
        $("#lblNumberOfServices").text(data[1].Services)
        $(".lblNumberOfAdmin").text(data[5].Admins)
        if (data.length > 6 && data[6] != null) {
            var priceBeforeFee = parseFloat(data[6].ORDER_PRICE);
            
            $(".valid-till").text(moment(data[6].VALID_TILL).format("YYYY-MM-DD"));
            $(".valid-till").append(`<span style="margin-left: 4px; font-size:smaller;">${((data[6].IS_MONTHLY == "Y") ? "(1 Month)" : "(1 Year)")}</span>`);
            $(".plan-name-and-price").text(capitalizeFirstLetter(data[6].PLAN_NAME) + " HK$" + ((data[6].IS_MONTHLY == "Y") ? parseFloat(priceBeforeFee).toFixed(2) : (parseFloat(priceBeforeFee) / parseInt((parseInt(data[6].VALIDITY_DAYS) / 30))).toFixed(2)) + "/month");
            $(".booking-available").text(data[6].ASSIGNED_CALENDARS);
        }

        if (response.Data[1] != null) {
            var sessionData = response.Data[1];

            let tr = "";

            if (sessionData.length > 0) {
                let len = (sessionData.length > 10) ? 10 : sessionData.length;

                for (var i = 0; i < len; i++) {
                    if (((parseInt(sessionData[i].ASSIGNED_SESSIONS) * 20) / 100) <= sessionData[i].SESSIONS_CREATED) {
                        tr += `<tr>
                                                    <td>${sessionData[i].CALENDAR_NAME}</td>
                                                    <td class=""><span class="warning">${sessionData[i].SESSIONS_CREATED}/${sessionData[i].ASSIGNED_SESSIONS}</span></td>
                                                </tr>`;
                    } else {
                        tr += `<tr>
                                                    <td>${sessionData[i].CALENDAR_NAME}</td>
                                                    <td class=""><span class="">${sessionData[i].SESSIONS_CREATED}/${sessionData[i].ASSIGNED_SESSIONS}</span></td>
                                                </tr>`;
                    }

                }

            } else {
                tr = `<tr rowspan="2">
                                                    <td>No Calendars Created Yet</td>
                                                </tr>`;
            }

            $("#subs-det-table tbody").append(tr);
        } else {
            let tr = `<tr rowspan="2">
                                                    <td>No Calendars Created Yet</td>
                                                </tr>`;
            $("#subs-det-table tbody").append(tr);
        }
        
    }

}

function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function setPageStatus() {
    var response = getCompanyWebsite();

    if (response.Data.CURRENT_STEP == "COMPLETED") {
        $("#content-2").show();
        $("#content").hide();
    } else {
        if (response.Data.COMPANY_PROFILE_STATUS == "Y") {
            $("#CompanyProfileSetupBtn").text("View >");
            $("#CompanyProfileSetupBtn").attr("onclick", "window.location.href = '/BusinessAdmin/CompanyMaster'");
            $("#CompanyProfileSetupBtn").attr("style", `font-size: 15px; float:right; padding-top: 8px; padding-right: 8px; cursor: pointer;`);
            /*$("#CompanyProfileSetupBtn").attr("onclick", "");*/
        }

        if (response.Data.COMPANY_CALENDAR_STATUS == "Y") {
            /*$("#CalendarSetupBtn a").text("Done");*/
            $("#CalendarSetupBtn").text("View >");
            $("#CalendarSetupBtn").attr("onclick", "window.location.href = '/BusinessAdmin/CalendarMaster'");
            $("#CalendarSetupBtn").attr("style", `font-size: 15px; float:right; padding-top: 8px; padding-right: 8px; cursor: pointer;`);
        }

        $("#content-2").hide();
        $("#content").show();
    }
}

function setCalendarData() {
    var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"));

    if (data.Status) {

        var calendarData = data.Data;

        for (var i = 0; i < calendarData.length; i++) {

        }

    }

}