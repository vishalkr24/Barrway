$(document).ready(function () {
    setCalendarMaster();
})

function setCalendarMaster() {
    var data = GetCompanyCalendars(localStorage.getItem("COMPANY_ID"), "", "");
    console.log(data);
    if (data.data != null) {
        var calendarData = data.data;
        console.log(calendarData);
        for (var i = 0; i < calendarData.length; i++) {
            $("#CalendarMasterTable tbody").append(`<tr>
                                                        <td>${calendarData[i].COMPANY_CODE}</td>
                                                        <td>${localStorage.getItem("COMPANY_NAME_ENGLISH")}</td>
                                                        <td>${calendarData[i].CALENDAR_NAME}</td>
                                                        <td>${calendarData[i].CALENDAR_CATEGORY_NAME}</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>`);
        }

        $("#CalendarMasterTable").DataTable();
        $('.dataTables_length').addClass('bs-select');

    }

}