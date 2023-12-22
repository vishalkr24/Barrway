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
        if (data.length > 6) {
            var priceBeforeFee = parseFloat(data[6].ORDER_PRICE);
            
            $(".valid-till").text(moment(data[6].VALID_TILL).format("YYYY-MM-DD"));
            $(".valid-till").append(`<span style="margin-left: 4px; font-size:smaller;">${((data[6].IS_MONTHLY == "Y") ? "(1 Month)" : "(1 Year)")}</span>`);
            $(".plan-name-and-price").text(capitalizeFirstLetter(data[6].PLAN_NAME) + " HK$" + ((data[6].IS_MONTHLY == "Y") ? parseFloat(priceBeforeFee).toFixed(2) : (parseFloat(priceBeforeFee) / parseInt((parseInt(data[6].VALIDITY_DAYS) / 30))).toFixed(2)) + "/month");
            $(".booking-available").text(data[6].ASSIGNED_BOOKINGS + " per Session");
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