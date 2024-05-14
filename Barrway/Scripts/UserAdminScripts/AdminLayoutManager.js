$(document).ready(function () {
    setUserDetails();
    setCompanyDetails();
});

function setCompanyDetails() {
    
    var allCompanies = getAllCompanies();
    var user = getSingleUserDetailsByUserId().data;

    if (allCompanies.Status) {
        var data = allCompanies.Data;
        $("#user-admin-layout-all-company").empty();
        
        for (var i = 0; i < data.length; i++) {

            if (data[i].IS_DEFAULT == "Y") {
                defaultId = data[i].Id;

                if (localStorage.getItem("COMPANY_ID") == null || localStorage.getItem("COMPANY_ID") == "null" || localStorage.getItem("COMPANY_ID") == undefined) {
                    localStorage.setItem("COMPANY_ID", data[i].Id);
                    localStorage.setItem("COMPANY_CODE", data[i].COMPANY_CODE);

                    localStorage.setItem("COMPANY_NAME_ENGLISH", data[i].COMPANY_NAME_ENGLISH);
                    localStorage.setItem("COMPANY_NAME_CHINESE", data[i].COMPANY_NAME_CHINESE);
                    localStorage.setItem("COMPANY_CATEGORY_ID", data[i].COMPANY_CATEGORY_ID);
                    localStorage.setItem("COMPANY_SUB_CATEGORY_ID", data[i].COMPANY_SUB_CATEGORY_ID);
                }
            } else {

            }
            let logopath = data[i].COMPANY_LOGO_PATH?.replace("~/", "/");
            $("#user-admin-layout-all-company").append(`<div class="added-company" onclick="openCompanyDashboard(${data[i].Id})">
                                    <span class="img-container">
                                        <img src="${logopath}" onerror="this.src='assets/svg/logos/logo.png'" />
                                    </span>
                                    <span>${data[i].COMPANY_NAME_ENGLISH} [${data[i].COMPANY_CODE}]</span>
                                </div>`);

        }


    } else {

        if (!window.location.href.includes("SetupCompanyProfile") && getUserRole() == "SUPERADMIN_USER") {
            window.location.href = "/BusinessAdmin/SetupCompanyProfile?&IsNew=true";
        }

    }

    if (localStorage.getItem("COMPANY_ROLE") == "SUPERUSER") {
        $("#admin-master-nav").show();
    } else {
        $("#admin-master-nav").hide();
    }

    if (localStorage.getItem("COMPANY_ROLE") == "SUPERUSER") {
        $("#subscription-master-nav").show();
    } else {
        $("#subscription-master-nav").hide();
    }

    

    $("#disp-navbar-company-selector").append(`<div class="add-company">
                                            <a href="/BusinessAdmin/CompanyMaster"><button>+ Add new company</button></a>
                                        </div>`);
}

function openCompanyDashboard(companyId) {
    localStorage.setItem("COMPANY_ID", companyId);
    window.location.href = "/BusinessAdmin/Dashboard";
}

function setUserDetails() {
    var user = getSingleUserDetailsByUserId().data;
    var coinBalance = getUserCoinBalance();
    $(".user-total-coin-balance").text(coinBalance.Data);
    if (user.Status) {

        var data = user.Data;

        if (localStorage.getItem("USER_ID") == null || localStorage.getItem("USER_ID") == undefined) {
            
            localStorage.setItem("USER_ID", data.USER_EMAIL);
            localStorage.setItem("USER_EMAIL", data.USER_EMAIL);
            localStorage.setItem("USER_GENDER", data.GENDER);
            localStorage.setItem("USER_FIRST_NAME", data.FIRST_NAME);
            localStorage.setItem("USER_NICK_NAME", data.NICK_NAME);
        }

        if (data.PROFILE_PHOTO_PATH != null && data.PROFILE_PHOTO_PATH != "null") {
            $(".layout-user-image").attr("src", data.PROFILE_PHOTO_PATH.replace('~', '..'));
            $(".layout-user-image").show();
        }

        
        $(".layout-first-name").text(data.FIRST_NAME);
        $(".layout-last-name").text(data.LAST_NAME);
        $(".layout-email").text(data.USER_EMAIL);
    }
}

function Logout() {

    localStorage.removeItem("USER_ID");
    localStorage.removeItem("USER_EMAIL");
    localStorage.removeItem("USER_GENDER");
    localStorage.removeItem("USER_FIRST_NAME");
    localStorage.removeItem("USER_NICK_NAME");

    localStorage.removeItem("publicUserSelectedCompany");
    localStorage.removeItem("CALENDAR_CODE");
    localStorage.removeItem("COMPANY_CODE");

    $('#mySignOutForm').submit()

}