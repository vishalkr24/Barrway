$(document).on("change", "#COUNTRY_ID", function () {
    bindCityData($("#COUNTRY_ID option:selected").val());
})

$(document).on("change", "#CITY_ID", function () {
    bindDistrictData($("#CITY_ID option:selected").val());
})

$(document).on("change", "#CALENDAR_CATEGORY_ID", function () {
    bindCalendarSubCategoryData($("#CALENDAR_CATEGORY_ID option:selected").val());
})

$(document).ready(function () {

    var obj = { 'create': true, 'placeholder': 'Add tags...' };
    $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj) );
    HSCore.components.HSTomSelect.init('.js-select')

    setCalendarCategory();
    checkRegistrationStep();
    setCountryData();
});

function renderForm(CategoryId) {
    $("#CALENDAR_CATEGORY_ID").val(CategoryId);
    /*$("#CALENDAR_CATEGORY_ID").attr("disabled", true);*/
    bindCalendarSubCategoryData($("#CALENDAR_CATEGORY_ID option:selected").val());
    $("#content").hide();
    $("#content-2").show();
    checkSlot();
}


function renderCategory() {
    $("#content-2").hide();
    $("#content").show();    
}

function checkRegistrationStep() {
    var data = getCompanyWebsite().Data;

    if (data.COMPANY_PROFILE_STATUS == "N") {
        lockCalendarSetup();
    }

}

function checkSlot() {
    categoryId = $("#CALENDAR_CATEGORY_ID option:selected").val();

    if (categoryId == 1 || categoryId == 2 || categoryId == 5) {
        $("#duration-entry-field").show();
    } else {
        $("#duration-entry-field").hide();
    }

}

function setCalendarCategory() {
    var data = getCalendarCategory();

    console.log(data);

    $("#CALENDAR_CATEGORY_ID").empty();
    $("#CALENDAR_CATEGORY_ID").append(`<option value="-1" selected disabled>Select a Calendar Category</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {

            $("#CALENDAR_CATEGORY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].CALENDAR_CATEGORY_NAME}</option>`);
        }
    }
}

function setCountryData() {
    var data = getCountryMaster();

    console.log(data);

    $("#COUNTRY_ID").empty();
    $("#COUNTRY_ID").append(`<option value="-1" selected disabled>Select a Country</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            
            $("#COUNTRY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].COUNTRY_NAME}</option>`);
        }
    }
}

function bindCityData(countryId) {
    var data = getCityMaster(countryId);

    console.log(data);

    $("#CITY_ID").empty();
    $("#CITY_ID").append(`<option value="-1" selected disabled>Select a City</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#CITY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].CITY_NAME}</option>`);
        }
    }
}

function bindDistrictData(cityId) {
    var data = getDistrictMaster(cityId);

    console.log(data);

    $("#DISTRICT_ID").empty();
    $("#DISTRICT_ID").append(`<option value="-1" selected disabled>Select a District</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#DISTRICT_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].DISTRICT_NAME}</option>`);
        }
    }
}

function bindCalendarSubCategoryData(categoryId) {
    var data = getCalendarSubCategory(categoryId);

    console.log(data);

    $("#CALENDAR_SUB_CATEGORY_ID").empty();
    $("#CALENDAR_SUB_CATEGORY_ID").append(`<option value="-1" selected disabled>Select a sub Category</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#CALENDAR_SUB_CATEGORY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].CALENDAR_SUB_CATEGORY_NAME}</option>`);
        }
    }
}

function lockCalendarSetup() {
    $("#error-div").show();
    $(".rectangle").attr("onclick", "");
    $("button").hide();
}