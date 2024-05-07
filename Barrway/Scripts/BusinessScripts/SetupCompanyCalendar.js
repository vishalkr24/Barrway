var templateList = [];

$(document).on("change", "#COUNTRY_ID", function () {
    bindCityData($("#COUNTRY_ID option:selected").val());
})

$(document).on("change", "#CITY_ID", function () {
    bindDistrictData($("#CITY_ID option:selected").val());
})

$(document).on("change", "#CALENDAR_COMMON_CATEGORY_ID", function () {
    bindCalendarSubCategoryData($("#CALENDAR_COMMON_CATEGORY_ID option:selected").val())
});

$(document).ready(function () {

    readyPage();
    $("#createCalendarButton").prop("disabled", false)
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);

    if (getUserRole() != "SUPERADMIN_USER") {
        if ($("#createCalendarCheck").val() == true || $("#createCalendarCheck").val() == "true") {
            $(".row-reverse").attr("style", "flex-direction:row-reverse");
        }
    }

    $("#DISPLAY_MIN_TIME").datetimepicker({
        format: "hh:mm A"
    });

    $("#DEFAULT_DATE").datepicker();

    $("#DISPLAY_MAX_TIME").datetimepicker({
        format: "hh:mm A"
    });

    $("#basic-calendar-form").on("submit", function (evt) {
        
        let requireTabs = $("#REQUIRED_CALENDAR_VIEWS").val();
        let defaultTab = $("#DEFAULT_CALENDAR_VIEW option:selected").val();
       
        if (requireTabs.find(x => x == defaultTab) == null) {
            swal({
                icon: "warning",
                title: "Warning",
                text: "Required views must contain the default tab. \n\nDo you want to Add default view in required view and continue?",
                buttons: {
                    confirm: "Yes",
                    cancel: "No"
                }
            }).then(function (check) {
                if (check) {
                    requireTabs.push(defaultTab);
                    $("#REQUIRED_CALENDAR_VIEWS").val(requireTabs);
                    
                    $("#basic-calendar-form").submit();
                    $("#createCalendarButton").prop("disabled", true)
                } else {
                    evt.preventDefault();
                }
            });
            evt.preventDefault();
        }

        $("#createCalendarButton").prop("disabled", true)

    })

});
var tomselect = {};
function readyPage() {

    setCalendarCommonCategory();

    checkRegistrationStep();
    setCountryData();
    if ($("#createCalendarCheck").val() == false || $("#createCalendarCheck").val() == "false") {

        $("#content").hide();
        $("#content-2").show();
        $("#CALENDAR_SUB_CATEGORY_ID").attr("disabled", false);
        setCurrentCalendarData();

        $("#btn2").attr("onclick", "renderPage(2)");

        var obj = { 'create': true, 'placeholder': 'Add tags...', maxItems: 15 };
        $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
        HSCore.components.HSTomSelect.init('.js-select');
    } else {
        $("#CALENDAR_SUB_CATEGORY_ID").attr("disabled", true);

        var obj = { 'create': true, 'placeholder': 'Add tags...', maxItems: 15 };

        if ($("#stepIndicatorInput").val() == "Y") {
            $("#content").hide();
            $("#content-2").show();
        } else {
            $("#content").show();
            $("#content-2").hide();
        }

        $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
        HSCore.components.HSTomSelect.init('.js-select')
    }

}

function setCurrentCalendarData() {

    var data = getSingleCalendar($("#calendarCodeInput").val());

  
    if (data.Status == "true" || data.Status == true) {

        $("#COUNTRY_ID").val(data.Data.COUNTRY_ID);
        $("#COUNTRY_ID option[value=" + data.Data.COUNTRY_ID + "]").attr("selected", true);
        bindCityData(data.Data.COUNTRY_ID);
        $("#CITY_ID").val(data.Data.CITY_ID);
        $("#CITY_ID option[value=" + data.Data.CITY_ID + "]").attr("selected", true);
        bindDistrictData(data.Data.DISTRICT_ID);
        $("#DISTRICT_ID").val(data.Data.DISTRICT_ID);
        $("#DISTRICT_ID option[value=" + data.Data.DISTRICT_ID + "]").attr("selected", true);

        renderForm(data.Data.CALENDAR_CATEGORY_ID);

        $("#CALENDAR_COMMON_CATEGORY_ID").val(data.Data.CALENDAR_COMMON_CATEGORY_ID);
        $("#CALENDAR_COMMON_CATEGORY_ID option[value=" + data.Data.CALENDAR_COMMON_CATEGORY_ID + "]").attr("selected", true);

        SetbindCalendarSubCategoryData(data.Data.CALENDAR_COMMON_CATEGORY_ID, data.Data.CALENDAR_SUB_CATEGORY_ID);
        $("#CALENDAR_SUB_CATEGORY_ID").val(data.Data.CALENDAR_SUB_CATEGORY_ID);
        //$("#CALENDAR_SUB_CATEGORY_ID option[value=" + data.Data.CALENDAR_SUB_CATEGORY_ID + "]").attr("selected", true);

       

       

       
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

        $("#CALENDAR_USE_TYPE").val(data.Data.CALENDAR_USE_TYPE);
        $("#DEFAULT_RESOURCE").val(data.Data.DEFAULT_RESOURCE);
        if (data.Data.NEED_ADDITIONAL_FORM != null && data.Data.NEED_ADDITIONAL_FORM != "") {
            $("#NEED_ADDITIONAL_FORM[value=" + data.Data.NEED_ADDITIONAL_FORM + "]").prop("checked", true);
        }
       
        $("#DEFAULT_CALENDAR_VIEW").val(data.Data.DEFAULT_CALENDAR_VIEW);  
        $("#REQUIRED_CALENDAR_VIEWS").val(((data.Data.REQUIRED_CALENDAR_VIEWS.includes(',')) ? data.Data.REQUIRED_CALENDAR_VIEWS.split(',') : data.Data.REQUIRED_CALENDAR_VIEWS));


        //console.log(((data.Data.CALENDAR_SUB_CATEGORY_ID.includes(',')) ? data.Data.CALENDAR_SUB_CATEGORY_ID.split(',') : data.Data.CALENDAR_SUB_CATEGORY_ID), "hjhkjhkj");
        //$("#CALENDAR_SUB_CATEGORY").val(((data.Data.CALENDAR_SUB_CATEGORY_ID.includes(',')) ? data.Data.CALENDAR_SUB_CATEGORY_ID.split(',') : data.Data.CALENDAR_SUB_CATEGORY_ID));
    }

}

function renderForm(CategoryId) {
    $("#CALENDAR_CATEGORY_ID").val(CategoryId);
    //$("#CALENDAR_CATEGORY_ID option[value=" + CategoryId + "]").attr("selected", true);
    /*$("#CALENDAR_CATEGORY_ID").attr("disabled", true);*/

    $("#content").hide();
    $("#content-2").show();
}

function closeSchedularModal() {
    $('#SchedularModal').modal('hide')
}

function bindSchedularId() {

    $("#SCHEDULAR_ID").val($("#schedular-selector option:selected").val());
    $("#SCHEDULAR_ID").attr("value", $("#schedular-selector option:selected").val());
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

function setCalendarCommonCategory() {
    var data = getCalendarCommonCategory();

    console.log(data);

    $("#CALENDAR_COMMON_CATEGORY_ID").empty();
    $("#CALENDAR_COMMON_CATEGORY_ID").append(`<option value="-1" selected disabled>Select a Calendar Category</option>`);

    if (data.Status == "true" || data.Status == true) {
        for (var i = 0; i < data.Data.length; i++) {
            $("#CALENDAR_COMMON_CATEGORY_ID").append(`<option value="${data.Data[i].Id}">${data.Data[i].CMN_CATEGORY_NAME}</option>`);
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

function bindCalendarSubCategoryData(id) {
    var data = getCalendarSubCategory(id);
    console.log(data.Data,"datasubcategory");

    if (data.Data != null) {
        var dynamic_Class = "js_select_" + uuidv4();
        $("#Su_category").empty();
        $("#Su_category").append(`<select class="${dynamic_Class} form-select" id="CALENDAR_SUB_CATEGORY" multiple name="CALENDAR_SUB_CATEGORY" placeholder="Select Calendar Sub Category" required>
                                </select>`);

        $("#CALENDAR_SUB_CATEGORY").attr("disabled", false);
        $("#CALENDAR_SUB_CATEGORY").empty();

        if (data.Status == "true" || data.Status == true) {
            for (var i = 0; i < data.Data.length; i++) {
                $("#CALENDAR_SUB_CATEGORY").append(`<option value="${data.Data[i].Id}">${data.Data[i].CALENDAR_SUB_CATEGORY_NAME}</option>`);
            }
        }
        HSCore.components.HSTomSelect.init("." + dynamic_Class);
    }
    else {
        var dynamic_Class = "js_select_" + uuidv4();
        $("#Su_category").empty();
        $("#Su_category").append(`<select class="${dynamic_Class} form-select" id="CALENDAR_CATEGORY" multiple name="CALENDAR_SUB_CATEGORY" placeholder="Select Calendar Sub Category" required>
                                </select>`);
        $("#CALENDAR_SUB_CATEGORY").attr("disabled", false);
        $("#CALENDAR_SUB_CATEGORY").empty();
        $("#CALENDAR_SUB_CATEGORY").append(`<option value="-1">Select subcategory</option>`);
        HSCore.components.HSTomSelect.init("." + dynamic_Class);
    }

    

}


function SetbindCalendarSubCategoryData(id, CALENDAR_SUB_CATEGORY_ID) {
    var data = getCalendarSubCategory(id);
    console.log(data.Data, "SetbindCalendarSubCategoryDatadatasubcategory");
   
    var valuesArray = CALENDAR_SUB_CATEGORY_ID.split(',');
   
    if (data.Data != null) {
        var dynamic_Class = "js_select_" + uuidv4();
        $("#Su_category").empty();
        $("#Su_category").append(`<select class="${dynamic_Class} form-select" id="CALENDAR_SUB_CATEGORY" multiple name="CALENDAR_SUB_CATEGORY" placeholder="Select Calendar Sub Category" required>
                                </select>`);

        $("#CALENDAR_SUB_CATEGORY").attr("disabled", false);
        $("#CALENDAR_SUB_CATEGORY").empty();

        if (data.Status == "true" || data.Status == true) {
            for (var i = 0; i < data.Data.length; i++) {
                
                var exists = CALENDAR_SUB_CATEGORY_ID.includes(data.Data[i].Id);
                if (exists) {
                    $("#CALENDAR_SUB_CATEGORY").append(`<option value="${data.Data[i].Id}" Selected>${data.Data[i].CALENDAR_SUB_CATEGORY_NAME}</option>`);
                } else {
                    $("#CALENDAR_SUB_CATEGORY").append(`<option value="${data.Data[i].Id}">${data.Data[i].CALENDAR_SUB_CATEGORY_NAME}</option>`);
                }

                
            }
        }
        HSCore.components.HSTomSelect.init("." + dynamic_Class);
    }
    else {
        var dynamic_Class = "js_select_" + uuidv4();
        $("#Su_category").empty();
        $("#Su_category").append(`<select class="${dynamic_Class} form-select" id="CALENDAR_CATEGORY" multiple name="CALENDAR_SUB_CATEGORY" placeholder="Select Calendar Sub Category" required>
                                </select>`);
        $("#CALENDAR_SUB_CATEGORY").attr("disabled", false);
        $("#CALENDAR_SUB_CATEGORY").empty();
        $("#CALENDAR_SUB_CATEGORY").append(`<option value="-1">Select subcategory</option>`);
        HSCore.components.HSTomSelect.init("." + dynamic_Class);
    }



}



function lockCalendarSetup() {
    $("#error-div").show();
    $(".rectangle").attr("onclick", "");
    $("button").hide();
}