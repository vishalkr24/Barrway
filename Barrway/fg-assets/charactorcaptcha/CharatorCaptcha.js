
var code;
function createCaptcha(fieldName) {
    var captchaF = "captcha" + fieldName;

    document.getElementById(captchaF).innerHTML = "";
    var charsArray =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {        
        var index = Math.floor(Math.random() * charsArray.length + 1);
        if (captcha.indexOf(charsArray[index]) == -1)
            captcha.push(charsArray[index]);
        else
            i--;
    }
    var canv = document.createElement("canvas");
    canv.id = captchaF;
    canv.width = 100;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "25px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);    
    code = captcha.join("");
    document.getElementById(captchaF).appendChild(canv); 
    $(':input[type="submit"]').prop('disabled', true);
}

function validateCaptcha(fieldName) {
    event.preventDefault();
    var fname = "cpatchaTextBox" + fieldName;
    if (document.getElementById(fname).value != "") {
        if (document.getElementById(fname).value == code) {
            $(':input[type="submit"]').prop('disabled', false);
        } else {
            alert("Invalid Captcha. try Again");           
        }
    }
}