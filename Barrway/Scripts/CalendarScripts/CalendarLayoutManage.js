$(document).ready(function () {
    setCompanyDetails();
});

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
    var data = getSingleCompanyByCompanyId(localStorage.getItem('COMPANY_ID'));

    if (data.Status) {
        var company = data.Data;

        $(".lbl-company-name").text(company.COMPANY_NAME_ENGLISH);
        $(".img-company-logo").attr("src", company.COMPANY_LOGO_PATH.replace("~", ".."));
    }
}

function showComapanyWebsiteDetails(pageId = 1) {
    window.location.href = "/BusinessAdmin/ManageCompanyWebsite?CompanyId=" + localStorage.getItem('COMPANY_ID') + "&PId=" + pageId;
}