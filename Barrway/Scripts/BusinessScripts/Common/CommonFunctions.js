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

function getCompanyCategory() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCompanyCategory/",
        type: "GET",
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

function getCompanySubCategory(categoryId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCompanySubCategory/",
        type: "GET",
        data: {
            CategoryId: categoryId
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

function getCalendarCategory() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCalendarCategory/",
        type: "GET",
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

function getCalendarSubCategory(categoryId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCalendarSubCategory/",
        type: "GET",
        data: {
            CalendarCategoryId: categoryId
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

function getCountryMaster() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCountryMaster/",
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

function getCityMaster(countryId) {

    var data;
    $.ajax({
        url: "/BusinessAdmin/GetCityMaster/",
        type: "GET",
        data: {
            CountryId: countryId
        },
        success: function (response) {
            data = response;
        },
        async: false,
        error: function (errorResponse) {
            data = null;

        }
    })
    return data;
}

function getDistrictMaster(cityId) {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetDistrictMaster/",
        type: "GET",
        data: {
            CityId: cityId
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

function GetCompanyCalendars(companyId, calendarCategoryId, calendarSubCategoryId) {
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
    $("#" + labelId).text(files[0].name);
}