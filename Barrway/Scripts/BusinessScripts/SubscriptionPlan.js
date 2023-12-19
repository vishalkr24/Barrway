$(document).ready(function () {
    showNavbarNavigation('subscriptionsMegaMenu');
    setSubscriptionPlans();
    
});

function setSubscriptionPlans() {
    var data = GetAllSubscriptionPlansForBusiness();

    var colorTheme = ["purple", "turquois", "salmon"];

    $("#divSubscriptionPlans").empty();

    if (data.Status) {
        var plans = data.Data;
        debugger;
        var currentPlanData = GetCompanyActiveSubscriptionPlan(localStorage.getItem("COMPANY_ID"));

        console.log(currentPlanData)
        debugger;
        if (currentPlanData.Data != null) {
            var currentPlan = currentPlanData.Data;

            var colorCounter = 0;
            for (var i = 0; i < plans.length; i++) {
                colorCounter++;
                if (colorCounter > 2)
                    colorCounter = 0;

                var validityDiv = ``;
                if (plans[i].SUBSCRIPTION_HAS_VALIDITY == "Y") {
                    validityDiv = ` <tr>
                                            <td>Vaid till:</td>
                                            <td>${SUBSCRIPTION_PLAN_VALIDITY}</td>
                                        </tr>`;
                }

                var div = `<div class="pricing-custome">
                        <div class="pricing-custome-inner">
                            <div class="heder-price ${colorTheme[colorCounter]}"></div>
                            <div class="pricing-body">
                                <h3 style="color:crimson;">${(plans[i].Id == currentPlan.PLAN_ID) ? "Your Current Plan" : ""}</h3>
                                <h2>${plans[i].PLAN_NAME}</h2>
                                <p><span class="extra-larg purple-color">$${plans[i].YEARA_PRICE}</span> <span class="sm"> paid yearly</span></p>
                                <p>HK$ ${parseFloat(plans[i].PLAN_PRICE)}/ month</p>
                                <table>
                                    <tbody>
                                        ${validityDiv}
                                        <tr>
                                            <td> Plan Description</td>
                                            <td>${plans[i].PLAN_DESC} </td>
                                        </tr>
                                        <tr>
                                            <td> Number of available calendar</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? ((currentPlan.ASSIGNED_CALENDARS == -1) ? "Unlimited" : currentPlan.ASSIGNED_CALENDARS) :  plans[i].NUM_OF_AVAIL_CLR }  </td>
                                        </tr>
                                        <tr>
                                            <td>Sessions per Month</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? ((currentPlan.ASSIGNED_CALENDARS == -1) ? "Unlimited" : currentPlan.ASSIGNED_SESSIONS) : plans[i].VALID_SESSIONS}</td>
                                        </tr>
                                        <tr>
                                            <td>Bookings per Session</td>
                                            <td>${plans[i].VALID_BOOKING_SESSION}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="mt-4">
                                ${(plans[i].Id == currentPlan.PLAN_ID || plans[i].IS_FREE_PLAN == 'Y') ? "" : "<div class='price-btn'><button class='upgrade' onclick='buyPackage(" + plans[i].Id + ", false)'>Buy Yearly</button><button class='upgrade' onclick='buyPackage(" + plans[i].Id + ", true)'>Buy Monthly</button></div>"}
                            </div>
                        </div>
                    </div>`;

                $("#divSubscriptionPlans").append(div);
            }

        } else {
            var colorCounter = 0;
            for (var i = 0; i < plans.length; i++) {
                colorCounter++;
                if (colorCounter > 2)
                    colorCounter = 0;

                var validityDiv = ``;
                if (plans[i].SUBSCRIPTION_HAS_VALIDITY == "Y") {
                    validityDiv = ` <tr>
                                            <td>Vaid till:</td>
                                            <td>${SUBSCRIPTION_PLAN_VALIDITY}</td>
                                        </tr>`;
                }

                var div = `<div class="pricing-custome">
                        <div class="pricing-custome-inner">
                            <div class="heder-price ${colorTheme[colorCounter]}"></div>
                            <div class="pricing-body">
                                <h3></h3>
                                <h2>${plans[i].PLAN_NAME}</h2>
                                <p><span class="extra-larg purple-color">$${plans[i].YEARA_PRICE}</span> <span class="sm"> paid yearly</span></p>
                                <p>HK$ ${parseFloat(plans[i].PLAN_PRICE)}/ month</p>
                                <table>
                                    <tbody>
                                        ${validityDiv}
                                        <tr>
                                            <td> Plan Description</td>
                                            <td>${plans[i].PLAN_DESC} </td>
                                        </tr>
                                        <tr>
                                            <td> Number of available calendar</td>
                                            <td>${(false) ? plans[i].NUM_OF_AVAIL_CLR + "/" : ""} ${plans[i].NUM_OF_AVAIL_CLR} </td>
                                        </tr>
                                        <tr>
                                            <td>Sessions/ month/ company</td>
                                            <td>${(false) ? plans[i].VALID_SESSIONS + "/" : ""} ${plans[i].VALID_SESSIONS}</td>
                                        </tr>
                                        <tr>
                                            <td>Bookings/ session/ company</td>
                                            <td>${(false) ? plans[i].VALID_BOOKING_SESSION + "/" : ""} ${plans[i].VALID_BOOKING_SESSION}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="mt-4">
                                ${(false) ? "" : "<div class='price-btn'><button class='upgrade' onclick='buyPackage(" + plans[i].Id + ", false)'>Buy Yearly</button><button class='upgrade' onclick='buyPackage(" + plans[i].Id + ", true)'>Buy Monthly</button></div>"}
                            </div>
                        </div>
                    </div>`;

                $("#divSubscriptionPlans").append(div);
            }

            //$("#divSubscriptionPlans").append(`<div class="pricing-custome free-plan">
            //        <div class="pricing-custome-inner">
            //            <div class="heder-price"></div>
            //            <div class="pricing-body">
            //                <h3></h3>
            //                <h2>Free plan</h2>
            //                <p><span class="extra-larg">$0</span> <span class="sm"></span></p>
            //                <p>HK$ 0/ month</p>
            //                <table>
            //                    <tbody>
                                    
            //                        <tr>
            //                            <td> Booking transaction (per month)</td>
            //                            <td> 500</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Calendar available</td>
            //                            <td> 1</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Client package available</td>
            //                            <td>1</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Number of admin</td>
            //                            <td>No</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Photo album in company profile</td>
            //                            <td>No</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Client payment</td>
            //                            <td>No</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Promotion in market place</td>
            //                            <td>No</td>
            //                        </tr>
            //                        <tr>
            //                            <td>Chat with client</td>
            //                            <td>No</td>
            //                        </tr>
            //                    </tbody>
            //                </table>
            //            </div>
            //        </div>
            //    </div>`);
        }

        

    }

}

function buyPackage(PackageId, isMonthly) {
    $("#txtCompanyId").val(localStorage.getItem("COMPANY_ID"));
    $.ajax({
        url: "/Account/CheckPublicUserLogin",
        type: "POST",
        success: function (response) {
            swal({
                icon: "info",
                title: "Confirm Package!",
                text: "Are you sure you want to buy this package?",
                buttons: {
                    confirm: "Yes",
                    cancel: "No"
                }
            }).then(function (confirm) {
                if (confirm) {
                    $("#txtPackageName").val(PackageId);
                    $("#txtIsMonthly").val(isMonthly);
                    $("#paymentForm").submit();
                }
            })
        }
    });


}