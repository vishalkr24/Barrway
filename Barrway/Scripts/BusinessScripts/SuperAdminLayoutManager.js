$(document).ready(function () {
    if (getUserRole() == "SUPERADMIN_USER") {
        // superadmin user
        updatePortalForSuperAdmin();
    } else {
        // business user
        $(".show-for-superadmin").remove();
        $("#header").show();
    }
});

function getUserRole() {
    var role = "";
    $.ajax({
        url: "/public/GetRole",
        type: "get",
        async: false,
        success: function (response) {
            role = response;
        }
    })
    return role;
}

function updatePortalForSuperAdmin() {
    $(".bui").text("Super Admin")
    $(".hide-for-superadmin").remove();
    $(".show-for-superadmin").show();
    $("#manage-website").text("Company Details");
    $("#calendarsMegaMenu").text("Calendar Master")
    $("#header").show();
    $("#header2").show();
}
