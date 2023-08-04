$(document).ready(function () {
    if (getUserRole() == "SUPERADMIN_USER") {
        // superadmin user
        updatePortalForSuperAdmin();
    } else {
        // business user
        $(".show-for-superadmin").remove();
        $("#header").show();
        $("#header2").show();
    }
});

function updatePortalForSuperAdmin() {
    $(".bui").text("Super Admin")
    $(".hide-for-superadmin").remove();
    $(".show-for-superadmin").show();
    $("#manage-website").text("Company Details");
    $("#calendarsMegaMenu").text("Calendar Master")
    $("#header").show();
    $("#header2").show();
}
