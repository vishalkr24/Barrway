function getCompanyCategory() {
    var data;
    $.ajax({
        url: "/Public/GetCompanyCategory/",
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
        url: "/Public/GetCompanySubCategory/",
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

function GetAllCompanySubCategory() {
    var data;
    $.ajax({
        url: "/Public/GetAllCompanySubCategory/",
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

function getCalendarCategory() {
    var data;
    $.ajax({
        url: "/Public/GetCalendarCategory/",
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
        url: "/Public/GetCalendarSubCategory/",
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

function getAllCalendarSubCategory() {
    var data;
    $.ajax({
        url: "/Public/GetAllCalendarSubCategory/",
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

function GetFilterCompanyData(subCategoryId, districtId) {

    var data;
    $.ajax({
        url: "/Public/GetFilterCompanyData/",
        async: false,
        type: "GET",
        data: {
            SubCategoryId: subCategoryId,
            DistrictId: districtId
        },
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
        url: "/Public/GetCountryMaster/",
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
        url: "/Public/GetCityMaster/",
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
        url: "/Public/GetDistrictMaster/",
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

function getDistrictMaster() {
    var data;

    $.ajax({
        url: "/Public/GetAllDistrictMaster/",
        type: "GET",
        async: false,
        success: function (response) {
            data = response;
            console.log(response);
        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}

function viewMarketplaceCompanyDetails(companyCode, calendarId) {
    window.location.replace("/Marketplace/CompanyDetail?CompanyCode=" + companyCode + "&CalendarId=" + calendarId);
}

function viewMarketplaceCompanyCalendar(companyCode, calendarId) {
    window.location.replace("/Marketplace/CompanySchedule?CompanyCode=" + companyCode + "&CalendarId=" + calendarId);
}