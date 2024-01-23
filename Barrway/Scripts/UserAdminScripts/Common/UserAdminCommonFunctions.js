function getSingleUserDetailsByUserId() {
    var data;
    $.ajax({
        url: "/UserAdmin/GetSingleUserByUserId/",
        data: {
            UserId: $("#userIdHidden").val()
        },
        async: false,
        type: "POST",
        success: function (response) {
            data = response;
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function getUserCoinBalance() {
    var data;
    $.ajax({
        url: "/UserAdmin/GetUserCoinBalance/",
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

function getUserCoinBalanceByCalendar(companyCode, calendarCode) {
    var data;
    $.ajax({
        url: "/UserAdmin/GetUserCoinBalanceByCalendar/",
        async: false,
        data: {
            CompanyCode: companyCode,
            CalendarCode: calendarCode
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

function getSingleUserDetailsByParticipantId(participantId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetBusinessAccountWebsite/",
        data: {
            ParticipantId: participantId
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