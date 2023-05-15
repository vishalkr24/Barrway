$(document).ready(function () {
    $("#nv-company-schedule").addClass("active");
})

function showCalendar(companyCode) {

    var calendarId = $("#calendar-selector option:selected").val();
    
    window.location.replace("/Marketplace/CompanySchedule?CompanyCode=" + companyCode + "&CalendarId=" + calendarId);
}