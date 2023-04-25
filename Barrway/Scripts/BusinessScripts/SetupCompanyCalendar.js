$(document).ready(function () {
    checkRegistrationStep();
});

function renderForm() {
    $("#content").hide();
    $("#content-2").show();
}

function renderCategory() {
    $("#content-2").hide();
    $("#content").show();    
}

function checkRegistrationStep() {
    var data = getCompanyWebsite().Data;

    console.log(data);

    if (data.COMPANY_PROFILE_STATUS == "N") {
        lockCalendarSetup();
    }

}

function lockCalendarSetup() {
    $("#error-div").show();
    $(".rectangle").attr("onclick", "");
    $("button").hide();
}