function generateClientPaymentReceiptPdf(LedgerId) {
    window.location.href = "/Calendar/PaymentReceipt?Id=" + LedgerId;
}

function getServiceProviderData(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/Calendar/GetServiceProviderMasterList/",
        async: false,
        type: "POST",
        data: {
            data: {},
            companyCode: companyCode,
            calendarCode: calendarCode
        },
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getServiceMasterData(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/Calendar/GetServiceMasterList/",
        async: false,
        type: "POST",
        data: {
            data: {},
            companyCode: companyCode,
            calendarCode: calendarCode
        },
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getServiceProviderDataByCalendar(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/Calendar/GetServiceProviderMasterList/",
        async: false,
        type: "POST",
        data: {
            data: {
                filters: [{
                    field: "CALENDAR_CODE",
                    type: "=",
                    value: calendarCode
                }]
            },
            companyCode: companyCode
        },
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getServiceMasterDataByCalendar(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/Calendar/GetServiceMasterList/",
        async: false,
        type: "POST",
        data: {
            data: {
                filters: [{
                    field: "CALENDAR_CODE",
                    type: "=",
                    value: calendarCode
                }]
            },
            companyCode: companyCode
        },
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getBusiness() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetAllAssignedBusinessList/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getSuperBusiness() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetSuperAssignedBusinessList/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

function getCalendarSetupMatrix() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCalendarSetupMatrix",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    });
    return data;
}

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

function getTemplatesList(categoryId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetAllCalendarTemplatesByCategory/",
        data: {
            CalendarCategoryId: categoryId
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

function getSingleUser() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetSingleUserByUserId/",
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

function getCompanyDashboardData(companyCode) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/getCompanyDashboardData/",
        data: {
            CompanyCode: companyCode
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

function getCompanyCalendarDashboardData(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/getCompanyCalendarDashboardData/",
        data: {
            CompanyCode: companyCode,
            CalendarCode: calendarCode
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

function getSingleCalendar(calendarCode) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetSingleCalendar/",
        type: "GET",
        data: {
            CalendarCode: calendarCode
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
    $("#" + labelId).empty();
    for (var i = 0; i < files.length; i++) {
        if (i == files.length - 1) {
            $("#" + labelId).append(files[i].name);
        } else {
            $("#" + labelId).append(files[i].name + ", ");
        }
        
    }
    
}

function GoToCalendarLayout(CalendarId, CalendarCode) {
    localStorage.setItem("CALENDAR_ID", CalendarId);
    localStorage.setItem("CALENDAR_CODE", CalendarCode);
    window.location.replace("/Calendar/Index");
}

function setupNewCompanyCalendar() {
    var companyId = localStorage.getItem("COMPANY_ID");

    window.location.href = "/BusinessAdmin/SetupCompanyCalendar?CompanyId=" + companyId + "&IsPartial=true";

}

function setupNewCompany() {
    window.location.href = "/BusinessAdmin/SetupCompanyProfile?&IsNew=true";
}