function getSingleUserDetailsByUserId() {
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