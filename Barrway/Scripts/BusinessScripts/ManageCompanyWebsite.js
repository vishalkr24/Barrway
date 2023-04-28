$(document).ready(function () {
    var companyId = localStorage.getItem("COMPANY_ID");
    showNavbarNavigation('manage-website');
    SetCompanyDetails(companyId);
    
});

function SetCompanyDetails(companyId) {
    var data = getSingleCompanyByCompanyId(companyId);

    console.log(data);



}