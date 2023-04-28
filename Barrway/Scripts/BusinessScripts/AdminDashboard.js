$(document).ready(function () {
    setPageStatus();
});

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