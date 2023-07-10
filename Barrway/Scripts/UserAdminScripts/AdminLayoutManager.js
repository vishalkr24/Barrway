$(document).ready(function () {
    setUserDetails();
});

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