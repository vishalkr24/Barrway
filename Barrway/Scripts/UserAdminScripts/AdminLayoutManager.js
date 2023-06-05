$(document).ready(function () {
    setUserDetails();
});

function setUserDetails() {
    var user = getSingleUserDetailsByUserId().data;
    console.log(user);
    if (user.Status) {

        var data = user.Data;

        if (localStorage.getItem("USER_ID") == null || localStorage.getItem("USER_ID") == undefined) {
            
            localStorage.setItem("USER_ID", data.USER_EMAIL);
            localStorage.setItem("USER_EMAIL", data.USER_EMAIL);
            localStorage.setItem("USER_GENDER", data.GENDER);
            localStorage.setItem("USER_FIRST_NAME", data.FIRST_NAME);
            localStorage.setItem("USER_NICK_NAME", data.NICK_NAME);
        }

        $(".layout-user-image").attr("src", data.PROFILE_PHOTO_PATH.replace('~', '..'));
        $(".layout-first-name").text(data.FIRST_NAME);
        $(".layout-last-name").text(data.LAST_NAME);
        $(".layout-email").text(data.USER_EMAIL);
    }
}

function Logout() {
    
    $('#mySignOutForm').submit()
}