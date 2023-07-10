$(document).ready(function () {
    $("#nv-company-package").addClass("active");
    setCompanyPackageDetails();
});

function setCompanyPackageDetails() {
    let CompanyCode = $("#txtCurrentCompanyCode").val();
    let CalendarCode = $("#txtCurrentCalendarCode").val();
    var data = getCompanyCalendarPackages(CompanyCode, CalendarCode);
    console.log(data);

    var calendarDetails = data.packageData.Data[0][0];
    var packageDetails = data.packageData.Data[1];

    $("#lblCalendarName").text(calendarDetails.CALENDAR_NAME);
    $("#lblCalendarLocation").text(calendarDetails.customTitle.split(',')[0])
    $("#lblSubCategory").text(calendarDetails.CALENDAR_SUB_CATEGORY_NAME);
    $("#lblServiceName").text(calendarDetails.customTitle.split(',')[1]);
    $("#packages-area").empty();
    for (var i = 0; i < packageDetails.length; i++) {
        $("#packages-area").append(`<div class="bpgd">
                                        <h4>${packageDetails[i].PACKAGE_NAME}</h4>
                                        <h4>HK$${packageDetails[i].PACKAGE_PRICE} = B$${packageDetails[i].PACKAGE_COIN}</h4>
                                        <p>Description:</p>
                                        <p>${packageDetails[i].PACKAGE_DESCRIPTION}</p>
                                        <p class="mt-10"><button onclick="buyPackage(${packageDetails[i].Id})">BUY</button></p>
                                    </div>`);
    }
}

function buyPackage(PackageId) {

    $.ajax({
        url: "/Account/CheckPublicUserLogin",
        type: "POST",
        success: function (response) {

            if (!response.Status) {

                swal({
                    title: "Login Required",
                    text: "Kindly login into your account and then you can buy this calendar package.",
                    icon: "info",
                    buttons: {
                        confirm: "Login",
                        cancel: "Leave it"
                    }
                }).then(function (value) {
                    if (value) {
                        window.location.href = '/Account/Login?returnUrl=/Marketplace/CompanyPackage?' + window.location.href.split('?')[1].replace('&', '$') + '';
                    }
                });


            } else {
                //var customTitleSplit = bgevent.customTitle.split(',');

                //const wrapper = document.createElement('div');
                //wrapper.innerHTML = `<div>
                //                        ${moment(start.format()).format("DD-MM-YYYY")}
                //                    </div>
                //                    <div>
                //                        ${moment(start.format()).format("hh:mm a")} to ${moment(start.format()).add("minute", 60).format("hh:mm a")}
                //                    </div>
                //                    <div>${customTitleSplit[2]}</div><br />
                //                    <div>${customTitleSplit[1]}</div>
                //                    <div>${customTitleSplit[0]}</div><br />
                //                    <h2>Are you sure?</h2>`;

                swal({
                    icon: "info",
                    title: "Confirm Payment!",
                    text: "Are you sure you want to buy this package?",
                    buttons: {
                        confirm: "Yes",
                        cancel: "No"
                    }
                }).then(function (confirm) {
                    if (confirm) {
                        $("#txtPackageName").val(PackageId);
                        $("#paymentForm").submit();
                    }
                })

            }
        }
    });

    
}