$(document).ready(function () {
    setUserDetails();
});

function setUserDetails() {
    var user = getSingleUserDetailsByUserId();

    if (user.Status) {
       
        if (localStorage.getItem("COMPANY_CODE") == null || localStorage.getItem("COMPANY_CODE") == undefined) {
   
            localStorage.setItem("COMPANY_CODE", data[i].COMPANY_CODE);
            localStorage.setItem("COMPANY_NAME_ENGLISH", data[i].COMPANY_NAME_ENGLISH);
            localStorage.setItem("COMPANY_NAME_CHINESE", data[i].COMPANY_NAME_CHINESE);
            localStorage.setItem("COMPANY_CATEGORY_ID", data[i].COMPANY_CATEGORY_ID);
            localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data[i].COMPANY_SUB_CATEGORY_ID);
        }

    }
}

function Logout() {
    
    $('#mySignOutForm').submit()
}