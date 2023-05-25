function getCompanyWebsite() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetBusinessAccountWebsite/",
        data: {
            UserId: $("#userIdHidden").val()
        },
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function getSingleDefaultCompany() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetDefaultCompany/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function getSingleCompanyByCompanyId(companyId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetSingleCompanyByCompanyId/",
        data: {
            CompanyId: companyId
        },
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function GetAllSubscriptionPlansForBusiness() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetAllSubscriptionPlansForBusiness/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function GetCompanyActiveSubscriptionPlan(companyId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCompanyActiveSubscriptionPlan/",
        async: false,
        data: {
            CompanyId: companyId
        },
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function getAllCompanies() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetAllCompanies/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}



function getCompanyPhotoAlbum(companyId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCompanyPhotoAlbum/",
        type: "GET",
        data: {
            CompanyId: companyId
        },
        async: false,
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function GetCompanyCalendars(companyId) {
    var data;

    $.ajax({
        url: "/BusinessAdmin/GetCompanyCalendars/",
        type: "GET",
        data: {
            CompanyId: companyId
        },
        async: false,
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}


function BindLogoName(inputId, labelId) {
    var value = $("#" + inputId).get(0);
    var files = value.files;
    $("#" + labelId).text(files[0].name);
}

function GoToCalendarLayout(CalendarId, CalendarCode) {
    localStorage.setItem("CALENDAR_ID", CalendarId);
    localStorage.setItem("CALENDAR_CODE", CalendarCode);
    window.location.replace("/Calendar/Index");
}

function setupNewCompanyCalendar() {
    var companyId = localStorage.getItem("COMPANY_ID");

    window.location.href = "/BusinessAdmin/SetupCompanyCalendar?CompanyId=" + companyId + "&IsPartial=true";

    //$.ajax({
    //    url: "/BusinessAdmin/SetupCompanyCalendar?CompanyId=" + companyId + "&returnPartial=true",
    //    type: "GET",
    //    success: function (data) {
    //        $("#AddNewCalendarModal .modal-body").html(data);
    //        $("#AddNewCalendarModal").modal("show");
    //        $(".hide-on-partial").hide();
    //    },
    //    error: function () {

    //    }
    //})

}