$(document).ready(function () {
    setSubscriptionPlans();
});

function setSubscriptionPlans() {
    var data = GetAllSubscriptionPlansForBusiness();

    console.log(data);

    var colorTheme = ["purple", "turquois", "salmon"];

    $("#divSubscriptionPlans").empty();

    if (data.Status) {
        var plans = data.Data;

        var currentPlan = GetCompanyActiveSubscriptionPlan(localStorage.getItem("COMPANY_ID")).Data;

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
                                <h3>${(plans[i].Id == currentPlan.PLAN_ID)? "Your Current Plan": ""}</h3>
                                <h2>${plans[i].SUBSCRIPTION_PLAN_NAME}</h2>
                                <p><span class="extra-larg purple-color">$${plans[i].SUBSCRIPTION_PLAN_PRICE}</span> <span class="sm">/ month (paid yearly)</span></p>
                                <p>HK$ ${(parseFloat(plans[i].SUBSCRIPTION_PLAN_PRICE) / parseFloat(plans[i].VALIDITY_IN_MONTHS))}/ month</p>
                                <table>
                                    <tbody>
                                        ${validityDiv}
                                        <tr>
                                            <td> Booking transaction (per month)</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? plans[i].BOOKING_TRANSACTIONS + "/" : ""} ${plans[i].BOOKING_TRANSACTIONS} </td>
                                        </tr>
                                        <tr>
                                            <td>Calendar available</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? plans[i].CALENDAR_AVAILABLE + "/" : ""} ${plans[i].CALENDAR_AVAILABLE}</td>
                                        </tr>
                                        <tr>
                                            <td>Client package available</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? plans[i].CLIENT_PACKAGE_AVAILABLE + "/" : ""} ${plans[i].CLIENT_PACKAGE_AVAILABLE}</td>
                                        </tr>
                                        <tr>
                                            <td>Number of admin</td>
                                            <td>${(plans[i].Id == currentPlan.PLAN_ID) ? plans[i].NO_OF_ADMIN + "/" : ""} ${plans[i].NO_OF_ADMIN}</td>
                                        </tr>
                                        <tr>
                                            <td>Photo album in company profile</td>
                                            <td>${(plans[i].PHOTO_ALBUM == "Y")? "Yes": "No"}</td>
                                        </tr>
                                        <tr>
                                            <td>Client payment</td>
                                            <td>${(plans[i].CLIENT_PAYMENT == "Y") ? "Yes" : "No"}</td>
                                        </tr>
                                        <tr>
                                            <td>Promotion in market place</td>
                                            <td>${(plans[i].PROMOTION_IN_MARKETPLACE == "Y") ? "Yes" : "No"}</td>
                                        </tr>
                                        <tr>
                                            <td>Chat with client</td>
                                            <td>${(plans[i].CHAT_WITH_CLIENT == "Y") ? "Yes" : "No"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>`;

            $("#divSubscriptionPlans").append(div);
        }

        console.log(currentPlan);

        $("#divSubscriptionPlans").append(`<div class="pricing-custome free-plan">
                    <div class="pricing-custome-inner">
                        <div class="heder-price"></div>
                        <div class="pricing-body">
                            <h3>${(currentPlan.IS_FREE_PLAN == "Y")? "Your Current Plan": ""}</h3>
                            <h2>Free plan</h2>
                            <p><span class="extra-larg">$0</span> <span class="sm"></span></p>
                            <p>HK$ 0/ month</p>
                            <table>
                                <tbody>
                                    
                                    <tr>
                                        <td> Booking transaction (per month)</td>
                                        <td>${currentPlan.BOOKING_TRANSACTIONS + "/"} 500</td>
                                    </tr>
                                    <tr>
                                        <td>Calendar available</td>
                                        <td>${currentPlan.CALENDAR_AVAILABLE + "/"} 1</td>
                                    </tr>
                                    <tr>
                                        <td>Client package available</td>
                                        <td>${currentPlan.CLIENT_PACKAGE_AVAILABLE + "/"} 1</td>
                                    </tr>
                                    <tr>
                                        <td>Number of admin</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td>Photo album in company profile</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td>Client payment</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td>Promotion in market place</td>
                                        <td>No</td>
                                    </tr>
                                    <tr>
                                        <td>Chat with client</td>
                                        <td>No</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>`);

    }

}