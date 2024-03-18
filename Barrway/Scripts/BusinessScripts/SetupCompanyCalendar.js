var templateList = [];

$(document).on("change", "#COUNTRY_ID", function () {
    bindCityData($("#COUNTRY_ID option:selected").val());
})

$(document).on("change", "#CITY_ID", function () {
    bindDistrictData($("#CITY_ID option:selected").val());
})

$(document).on("change", "#CALENDAR_CATEGORY_ID", function () {
    renderTemplates($("#CALENDAR_CATEGORY_ID option:selected").val())
    bindCalendarSubCategoryData($("#CALENDAR_CATEGORY_ID option:selected").val());
})

$(document).ready(function () {
    
    readyPage();
    setTimeout(function () {
        $("#calendarsMegaMenu").addClass("active");
    }, 500);
    
    if (getUserRole() != "SUPERADMIN_USER") {
        if ($("#createCalendarCheck").val() == true || $("#createCalendarCheck").val() == "true" ) {
            $(".row-reverse").attr("style", "flex-direction:row-reverse");
        }
    }

    $("#DISPLAY_MIN_TIME").datetimepicker({
        format: "hh:mm A"
    });

    $("#DISPLAY_MAX_TIME").datetimepicker({
        format: "hh:mm A"
    });

});

function readyPage() {
    
    setCalendarCategory();

    checkRegistrationStep();
    setCountryData();
    renderTemplates($("#CALENDAR_CATEGORY_ID option:selected").val())

    if ($("#createCalendarCheck").val() == false || $("#createCalendarCheck").val() == "false" ) {
        
        $("#content").hide();
        $("#content-2").show();
        setCurrentCalendarData();

        $("#btn2").attr("onclick", "renderPage(2)");

        var obj = { 'create': true, 'placeholder': 'Add tags...' };
        $("#TAGS").attr("data-hs-tom-select-options", JSON.stringify(obj));
        HSCore.components.HSTomSelect.init('.js-select')
    } else {
        var obj = { 'create': true, 'placeholder': 'Add tags...' };

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

    console.log(data);
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
        $("#CALENDAR_SUB_CATEGORY_ID").val(data.Data.CALENDAR_SUB_CATEGORY_ID);
        $("#CALENDAR_SUB_CATEGORY_ID option[value=" + data.Data.CALENDAR_SUB_CATEGORY_ID + "]").attr("selected", true);

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
    }

}

function renderForm(CategoryId) {
    $("#CALENDAR_CATEGORY_ID").val(CategoryId);
    $("#CALENDAR_CATEGORY_ID option[value=" + CategoryId + "]").attr("selected", true);
    /*$("#CALENDAR_CATEGORY_ID").attr("disabled", true);*/
    bindCalendarSubCategoryData($("#CALENDAR_CATEGORY_ID option:selected").val());
    $("#content").hide();
    $("#content-2").show();

    renderTemplates(CategoryId);

    checkSlot();
}

function closeSchedularModal() {
    $('#SchedularModal').modal('hide')
}

$(document).on("click", "#templates-row .template-choose-btn", function () {
    let CalendarTemplateId = 0;
    debugger;
    $("#SCHEDULAR_ID").val("");
    $("#SCHEDULAR_ID").attr("value", "");

    $("#templates-row .template-choose-btn").removeClass("active");
    $("#templates-row .template-choose-btn").text("Select template");
    if (this.classList.contains('active')) {
        $(this).removeClass("active");
        CalendarTemplateId = 0;
    } else {
        $(this).addClass("active");
        $(this).text("Selected");
        CalendarTemplateId = $(this).attr("data-value");
    }

    $("#CALENDAR_TEMPLATE_ID").val(CalendarTemplateId);
    $("#CALENDAR_TEMPLATE_ID").attr("value", CalendarTemplateId);

    var template = templateList.find(x => x.Id == CalendarTemplateId)

    $("#CALENDAR_NAME").val(template.CALENDAR_NAME);
    $("#COUNTRY_ID").val(template.COUNTRY_ID);

    bindCityData(template.COUNTRY_ID);
    $("#CITY_ID").val(template.CITY_ID);

    bindDistrictData(template.CITY_ID);
    $("#DISTRICT_ID").val(template.DISTRICT_ID);

    $("#CALENDAR_CATEGORY_ID").val(template.CALENDAR_CATEGORY_ID);
    $("#CALENDAR_SUB_CATEGORY_ID").val(template.CALENDAR_SUB_CATEGORY_ID);
    $("#SLOT_DURATION_IN_MINS").val(template.SLOT_DURATION_IN_MINS);


    // bind schedules
    $.ajax({
        url: "/Calendar/GetSchedularFormList",
        type: "POST",
        data: {
            data: {},
            companyCode: template.COMPANY_CODE,
            calendarCode: template.CALENDAR_CODE
        },
        success: function (response) {
            if (response.data != null) {
                if (response.data.length > 0) {
                    console.log(response);
                    $("#schedular-selector").empty();
                    $("#schedular-selector").append("<option selected value='-1'>Select one</option>")
                    for (var i = 0; i < response.data.length; i++) {
                        $("#schedular-selector").append(`<option value="${response.data[i].Id}">${response.data[i].SCH_DAYS} Days | ${response.data[i].ACTIVITY_NAME} | ${response.data[i].FIRST_NAME} | ${response.data[i].LOCATION_BUILDING_NAME}</option>`);
                    }
                    $("#SchedularModal").modal("show");
                }
            }
            
        },
        error: function (error) {

        }
    })

});

function bindSchedularId() {
    
    $("#SCHEDULAR_ID").val($("#schedular-selector option:selected").val());
    $("#SCHEDULAR_ID").attr("value", $("#schedular-selector option:selected").val());
}

function renderTemplates(CategoryId) {
    var data = getTemplatesList(CategoryId);
    debugger;
    $("#templates-row").empty();
    templateList = [];
    if (data.Status) {
        
        for (var i = 0; i < data.Data.length; i++) {
            templateList.push(data.Data[i]);
            $("#templates-row").append(`<div class="col-sm-6"><div class="card">
                                          <img src="${data.Data[i].CALENDAR_PHOTO_PATH.replace('~', '..')}" onerror="this.src='../assets/img/160x160/img5.jpg'">

                                          <!-- A div with card__details class to hold the details in the card  -->
                                          <div class="card__details">

                                            <span class="tag">${data.Data[i].CALENDAR_SUB_CATEGORY_NAME}</span>
                                            <span class="tag">${data.Data[i].TOTAL_SCHEDULARS} Schedulars</span>
                                            <!-- A div with name class for the name of the card -->
                                            <div class="name">${data.Data[i].CALENDAR_NAME}</div>
                                            
                                            <p>
                                            <span class="tag">${data.Data[i].TOTAL_SERVICES} Service</span>
                                            <span class="tag">${data.Data[i].TOTAL_LOCATIONS} Location</span>
                                            <span class="tag">${data.Data[i].TOTAL_SERVICE_PROVIDERS} Providers</span>
                                            </p>

                                            <button class="template-choose-btn" data-value="${data.Data[i].Id}">Select template</button>
                                          </div>


                                        </div></div>`);

            //$("#templates-row").append(`<div class="col-md-4 col-sm-6 text-center" >

            //                <img class="template-image" src="${data.Data[i].CALENDAR_PHOTO_PATH.replace('~','..')}" onerror="this.src='../assets/img/160x160/img5.jpg'" />
            //                <div style="padding-top:12px;"></div>

            //            </div>`);
        }
    }
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