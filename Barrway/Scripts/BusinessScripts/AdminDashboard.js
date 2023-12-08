$(document).ready(function () {
    if (getUserRole() == "BUSINESS_USER") {
        setPageStatus();
    } else {
        $("#content-2").show();
        $("#content").hide();
    }
    
    showNavbarNavigation('dashboardsMegaMenu');
    setDashboardData();
});

function setDashboardData() {
    var response = getCompanyDashboardData(localStorage.getItem('COMPANY_CODE'));

    console.log(response);

    if (response.Status) {
        data = response.Data;
        $("#lblBookingToday").text(data[2].BookingsToday)
        $("#lblBookingThisWeek").text(data[3].BookingsThisWeek)
        $("#lblNumberOfServiceProvider").text(data[4].ServiceProviders)
        $("#lblNumberOfCalendar").text(data[0].Calendars)
        $("#lblNumberOfServices").text(data[1].Services)
        $(".lblNumberOfAdmin").text(data[5].Admins)
    }

}

function setPageStatus() {
    var response = getCompanyWebsite();

    if (response.Data.CURRENT_STEP == "COMPLETED") {
        $("#content-2").show();
        $("#content").hide();
    } else {
        if (response.Data.COMPANY_PROFILE_STATUS == "Y") {
            $("#CompanyProfileSetupBtn a").text("Done");
            /*$("#CompanyProfileSetupBtn").attr("onclick", "");*/
        }

        if (response.Data.COMPANY_CALENDAR_STATUS == "Y") {
            $("#CalendarSetupBtn a").text("Done");
            /*$("#CalendarSetupBtn").attr("onclick", "");*/
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