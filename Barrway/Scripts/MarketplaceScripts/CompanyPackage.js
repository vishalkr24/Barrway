var packagesList = {};

$(document).ready(function () {
    $("#nv-company-package").addClass("active");
    setCalendarsList(true);
});

function setCalendarsList(firstCall = false) {

    $("#calendars-list-area").empty();
    $("#btn-back").hide();

    let CompanyCode = $("#txtCurrentCompanyCode").val();
    if (firstCall) {
        packagesList = getCompanyCalendarPackages(CompanyCode);
    }
    
    var calendarDetails = packagesList.packageData.Data[0];

    $("#calendars-list-area").show();
    $("#calendars-area").hide();

    for (var i = 0; i < calendarDetails.length; i++) {
        $("#calendars-list-area").append(`<div class="card-pakage" onclick="setCompanyPackageDetails('${calendarDetails[i].CALENDAR_CODE}')">
                    <div class="card-top-detail">
                        <div class="media">
                            <div class="media-left">
                                <img src="${calendarDetails[i].CALENDAR_PHOTO_PATH.replace("~", "..")}" onerror="this.src='/assets/marketplace/image/pro.png'" class="media-object" style="width:195px; max-height: 120px">
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading" id="lblCalendarName">${calendarDetails[i].CALENDAR_NAME}</h4>
                                <p><span class="location" id="lblCalendarLocation"></span></p>
                                <p>
                                    <span id="lblSubCategory">${calendarDetails[i].CALENDAR_SUB_CATEGORY_NAME} </span>
                                    </br>
                                    <span id="lblServiceName">${calendarDetails[i].ActivityName}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>`);
    }


}

function setCompanyPackageDetails(calendarCode) {
    var data = packagesList;
    
    $("#calendars-list-area").hide();
    $("#calendars-area").show();
    $("#calendars-area").empty();
    $("#btn-back").show();

    var calendarDetails = data.packageData.Data[0].filter(x=> x.CALENDAR_CODE == calendarCode);
    var packageDetails = data.packageData.Data[1];

    for (var i = 0; i < calendarDetails.length; i++) {
        $("#calendars-area").append(`<div class="card-pakage">
                    <div class="card-top-detail">
                        <div class="media">
                            <div class="media-left">
                                <img src="${calendarDetails[i].CALENDAR_PHOTO_PATH.replace("~", "..")}" onerror="this.src='/assets/marketplace/image/pro.png'" class="media-object" style="width:195px; max-height: 120px">
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading" id="lblCalendarName">${calendarDetails[i].CALENDAR_NAME}</h4>
                                <p><span class="location" id="lblCalendarLocation"></span></p>
                                <p>
                                    <span id="lblSubCategory">${calendarDetails[i].CALENDAR_SUB_CATEGORY_NAME} </span>
                                    </br>
                                    <span id="lblServiceName">${calendarDetails[i].ActivityName}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="card-bottom" id="packages-area-${calendarDetails[i].CALENDAR_CODE}">

                    </div>
                </div>`);

        for (var j = 0; j < packageDetails.length; j++) {
            if (calendarDetails[i].CALENDAR_CODE == packageDetails[j].CALENDAR_CODE) {
                $(`#packages-area-${calendarDetails[i].CALENDAR_CODE}`).append(`<div class="bpgd">
                                        <h4>${packageDetails[j].PACKAGE_NAME}</h4>
                                        <h4>HK$${packageDetails[j].PACKAGE_PRICE} = B$${packageDetails[j].PACKAGE_COIN}</h4>
                                        <p>Description:</p>
                                        <p style="min-height: 40px; max-height: 120px">${packageDetails[j].PACKAGE_DESCRIPTION}</p>
                                        <p class="mt-10"><button onclick="buyPackage(${packageDetails[j].Id})">BUY</button></p>
                                    </div>`);
            }
            
        }
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