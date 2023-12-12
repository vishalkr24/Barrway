
$(document).on("change", "#COMPANY_CATEGORY_ID", function () {
    BindCompanySubCategory($("#COMPANY_CATEGORY_ID option:selected").val());
})

$(document).ready(function () {
    $("#COMPANY_SUB_CATEGORY_ID").attr("disabled", true);
    setCompanyCategory();
    setBusiness();
    setCompanyWebsite();
    

})

function setCompanyWebsite() {
    var response = getCompanyWebsite();

    if (response.Data.COMPANY_PROFILE_STATUS == "Y") {
        $("#companyProfileSkipButton").hide();
    }

    var data = getSingleDefaultCompany();

    //$("#COMPANY_NAME_ENGLISH").val(data.Data.COMPANY_NAME_ENGLISH);
    //$("#COMPANY_NAME_CHINESE").val(data.Data.COMPANY_NAME_CHINESE);
    //$("#COMPANY_CATEGORY_ID").val(data.Data.COMPANY_CATEGORY_ID);
    //BindCompanySubCategory(data.Data.COMPANY_CATEGORY_ID);
    //$("#COMPANY_SUB_CATEGORY_ID").val(data.Data.COMPANY_SUB_CATEGORY_ID);

}

function setBusiness() {
    var response = getBusiness();

    $("#BUSINESS_ACCOUNT_ID").empty();

    for (var i = 0; i < response.Data.length; i++) {
        $("#BUSINESS_ACCOUNT_ID").append(`<option value="${response.Data[i].Id}">${response.Data[i].BUSINESS_CODE} - ${response.Data[i].USER_ID}</option>`);
    }
}

function setCompanyCategory() {
    var response = getCompanyCategory();

    $("#COMPANY_CATEGORY_ID").empty();

    $("#COMPANY_CATEGORY_ID").append(`<option selected disabled value="-1">Select Company Category</option>`);

    for (var i = 0; i < response.Data.length; i++) {
        $("#COMPANY_CATEGORY_ID").append(`<option value="${response.Data[i].Id}">${response.Data[i].COMPANY_CATEGORY_NAME}</option>`);
    }
}

function BindCompanySubCategory(categoryId) {
    $("#COMPANY_SUB_CATEGORY_ID").attr("disabled", false);

    var response = getCompanySubCategory(categoryId);

    $("#COMPANY_SUB_CATEGORY_ID").empty();

    $("#COMPANY_SUB_CATEGORY_ID").append(`<option selected disabled value="-1">Select Company Sub Category</option>`);

    for (var i = 0; i < response.Data.length; i++) {
        $("#COMPANY_SUB_CATEGORY_ID").append(`<option value="${response.Data[i].Id}">${response.Data[i].COMPANY_SUB_CATEGORY_NAME}</option>`);
    }
}
