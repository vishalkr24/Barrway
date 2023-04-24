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