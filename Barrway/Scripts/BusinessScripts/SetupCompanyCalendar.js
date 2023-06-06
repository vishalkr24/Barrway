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
    
    readyPage();
   
});

function readyPage() {
    
    setCalendarCategory();

    checkRegistrationStep();
    setCountryData();
    
    if ($("#createCalendarCheck").val() == false || $("#createCalendarCheck").val() == "false" ) {
        $("#content").hide();
        $("#content-2").show();
        setCurrentCalendarData();

        $("#btn2").attr("onclick", "renderPage(2)");
    } else {
        var obj = { 'create': true, 'placeholder': 'Add tags...' };
        $("#content").show();
        $("#content-2").hide();
        $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
        HSCore.components.HSTomSelect.init('.js-select')

    }


}

function setCurrentCalendarData() {
    
    var data = getSingleCalendar($("#calendarCodeInput").val());

    console.log(data);
    if (data.Status == "true" || data.Status == true) {

        $("#COUNTRY_ID").val(data.Data.COUNTRY_ID);
        bindCityData(data.Data.COUNTRY_ID);
        $("#CITY_ID").val(data.Data.CITY_ID);
        bindDistrictData(data.Data.DISTRICT_ID);
        $("#DISTRICT_ID").val(data.Data.DISTRICT_ID);
        renderForm(data.Data.CALENDAR_CATEGORY_ID);
        $("#CALENDAR_SUB_CATEGORY_ID").val(data.Data.CALENDAR_SUB_CATEGORY_ID);
        
        if (data.Data.TAGS != null && data.Data.TAGS != "" && data.Data.TAGS != "null") {

            if (data.Data.TAGS.includes(",")) {
                var tagData = data.Data.TAGS.split(',');

                for (var i = 0; i < tagData.length; i++) {
                    $("#TAGS").append(`<option selected>${tagData[i]}</option>`);
                }
            } else {
                $("#TAGS").append(`<option selected>${data.Data.TAGS}</option>`);
            }

            

        }
        var obj = { 'create': true, 'placeholder': 'Add tags...' };

        $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
        HSCore.components.HSTomSelect.init('.js-select')


    }

}

function renderForm(CategoryId) {
    $("#CALENDAR_CATEGORY_ID").val(CategoryId);
    /*$("#CALENDAR_CATEGORY_ID").attr("disabled", true);*/
    bindCalendarSubCategoryData($("#CALENDAR_CATEGORY_ID option:selected").val());
    $("#content").hide();
    $("#content-2").show();
    checkSlot();
}

function renderPage(pageName) {

    pageName = parseInt(pageName);

    if ($("#createCalendarCheck").val() == "true") {
        pageName = 1;
    }

    switch (pageName) {
        case 1:
            $("#div1").show();
            $("#div2").hide();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").addClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
        case 2:
            $("#div1").hide();
            $("#div2").show();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").removeClass('active');
            $("#btn2 .nav-link").addClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
       
        default:
            $("#div1").show();
            $("#div2").hide();
            $("#div3").hide();
            $("#div4").hide();

            $("#btn1 .nav-link").addClass('active');
            $("#btn2 .nav-link").removeClass('active');
            $("#btn3 .nav-link").removeClass('active');
            $("#btn4 .nav-link").removeClass('active');

            break;
    }
    $("#div" + pageName).show();
}

function renderCategory() {
    $("#content-2").hide();
    $("#content").show();    
}

function checkRegistrationStep() {
    var data = getCompanyWebsite().Data;

    if (data.COMPANY_PROFILE_STATUS == "N") {
        lockCalendarSetup();
    } else {
        $("#error-div").hide();
    }

}

function checkSlot() {
    categoryId = $("#CALENDAR_CATEGORY_ID option:selected").val();

    if (categoryId == 1 || categoryId == 2 || categoryId == 5) {
        $(".advanced-option").show();
        $("#duration-entry-field").show();
    } else {
        $(".advanced-option").hide();
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