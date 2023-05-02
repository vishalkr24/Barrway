$(document).ready(function () {
    setCompanyDetails();
});

function changeCompany() {
    var companyId = $("#navbar-company-selector option:selected").val();
    
    var data = getSingleCompanyByCompanyId(companyId).Data;

    localStorage.removeItem("COMPANY_ID");
    localStorage.removeItem("COMPANY_CODE");
    localStorage.removeItem("COMPANY_NAME_ENGLISH");
    localStorage.removeItem("COMPANY_NAME_CHINESE");
    localStorage.removeItem("COMPANY_CATEGORY_ID");
    localStorage.removeItem("COMPANY_SUB_CATEGORY_ID");
    
    localStorage.setItem("COMPANY_ID", data.Id);
    localStorage.setItem("COMPANY_CODE", data.COMPANY_CODE);
    localStorage.setItem("COMPANY_NAME_ENGLISH", data.COMPANY_NAME_ENGLISH);
    localStorage.setItem("COMPANY_NAME_CHINESE", data.COMPANY_NAME_CHINESE);
    localStorage.setItem("COMPANY_CATEGORY_ID", data.COMPANY_CATEGORY_ID);
    localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data.COMPANY_SUB_CATEGORY_ID);

    window.location.reload();

}

function Logout() {
    localStorage.removeItem("COMPANY_ID");
    localStorage.removeItem("COMPANY_CODE");
    localStorage.removeItem("COMPANY_NAME_ENGLISH");
    localStorage.removeItem("COMPANY_NAME_CHINESE");
    localStorage.removeItem("COMPANY_CATEGORY_ID");
    localStorage.removeItem("COMPANY_SUB_CATEGORY_ID");
    $('#mySignOutForm').submit()
}

function showNavbarNavigation(divId) {
    $("#navbarDoubleLineContainerNavDropdown li a").removeClass("active");
    $("#" + divId).addClass("active");
}

function setCompanyDetails() {
    var allCompanies = getAllCompanies();

    if (allCompanies.Status) {
        var data = allCompanies.Data;
        $("#navbar-company-selector").empty();
        for (var i = 0; i < data.length; i++) {

            if (data[i].IS_DEFAULT == "Y") {
                if (localStorage.getItem("COMPANY_ID") == null || localStorage.getItem("COMPANY_ID") == undefined) {
                    localStorage.setItem("COMPANY_ID", data[i].Id);
                    localStorage.setItem("COMPANY_CODE", data[i].COMPANY_CODE);
                    localStorage.setItem("COMPANY_NAME_ENGLISH", data[i].COMPANY_NAME_ENGLISH);
                    localStorage.setItem("COMPANY_NAME_CHINESE", data[i].COMPANY_NAME_CHINESE);
                    localStorage.setItem("COMPANY_CATEGORY_ID", data[i].COMPANY_CATEGORY_ID);
                    localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data[i].COMPANY_SUB_CATEGORY_ID);
                }

                if (localStorage.getItem("COMPANY_ID") == data[i].Id) {
                    $("#navbar-company-selector").append(`<option selected value="${data[i].Id}">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</option>`);
                } else {
                    $("#navbar-company-selector").append(`<option value="${data[i].Id}">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</option>`);
                }
                
            } else {
                $("#navbar-company-selector").append(`<option value="${data[i].Id}">${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</option>`);
            }
        }
        
        $("#navbar-company-selector").val(localStorage.getItem("COMPANY_ID"));
        $(".lbl-company-name").text(localStorage.getItem("COMPANY_NAME_ENGLISH"));

    }


}

function showComapanyWebsiteDetails(pageId = 1) {
    window.location.href = "/BusinessAdmin/ManageCompanyWebsite?CompanyId=" + localStorage.getItem('COMPANY_ID') + "&PId=" + pageId;
}