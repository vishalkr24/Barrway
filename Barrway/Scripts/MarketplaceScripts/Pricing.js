$(document).ready(function () {
    $("#nv-Pricing").addClass("active");
    GetAllSubscriptionPlansForBusiness();
});

function GetAllSubscriptionPlansForBusiness() {
    var data;
    $.ajax({
        url: "/BusinessAdmin/GetAllSubscriptionPlansForBusiness/",
        async: false,
        type: "GET",
        success: function (response) {
            data = response;
            BindSubscriptonPlan(data);

        },
        error: function (errorResponse) {
            data = null;
        }
    })
    return data;
}


function BindSubscriptonPlan(data) {
    if (data.Status) {
        var PricingList = data.Data;
        var colorTheme = ["purple", "turquois", "salmon", "purple-color", "turquois","turquois-color"];
        var Pricing_html = '';
        for (var i = 0; i < PricingList.length; i++) {          
            if (PricingList[i].IS_FREE_PLAN == 'Y') {
                Pricing_html += '<div class="pricing-custome basic">';
                Pricing_html += '<div class="pricing-custome-inner">';
                Pricing_html += '<div class="empty-space"></div>';
                Pricing_html += '    <div class="pricing-body">';
                Pricing_html += ' ';
                Pricing_html += '        <h2>' + PricingList[i].PLAN_NAME+'</h2>';//
                Pricing_html += '        <p><span class="extra-larg salmon-color">$ ' + PricingList[i].PLAN_PRICE+' </span> <span class="sm">paid yearly</span></p>';
                Pricing_html += '        <p>HK$ ' + PricingList[i].PLAN_PRICE +'/ month</p>';
                Pricing_html += '        <div class="price-btn"><button class="payment" onclick="window.location.href =/BusinessAdmin/PaymentHistory">Try for free</button></div>';
                Pricing_html += '        <div class="price-list-detail">';
                Pricing_html += '            <ul>';
                Pricing_html += '                <li><b> ' + PricingList[i].NUM_OF_AVAIL_CLR +'</b></li>';
                Pricing_html += '                <li>Calendar</li>';    
                Pricing_html += '                <li><b>' + PricingList[i].VALID_SESSIONS +'</b></li>';
                Pricing_html += '                <li>Sessions/month/calendar</li>';
                Pricing_html += '                <li><b>' + PricingList[i].VALID_BOOKING_SESSION +'</b></li>';
                Pricing_html += '                <li>Bookings/session/calendar</li>';   
                Pricing_html += '                <li><b>' + PricingList[i].COMPANY_ADMIN +'</b></li>';
                Pricing_html += '                <li>Company admin</li>';
                Pricing_html += '                <li><b>' + PricingList[i].COMPANY_WEBSITE + '</b></li>';
                Pricing_html += '                <li>Company website</li>'; 
                Pricing_html += '                <li><b>' + PricingList[i].PAYMENT_GATEWAY + '</b></li>';
                Pricing_html += '                <li>Payment gateway</li>';
                Pricing_html += '                <li><b>' + PricingList[i].PAYMENT_TRAN_FEE + '%</b></li>';
                Pricing_html += '                <li>Payment transaction fee</li>';
                Pricing_html += '            </ul>';
                Pricing_html += '        </div>';
                Pricing_html += '    </div>';
                Pricing_html += '</div>';
                Pricing_html += '</div>';
            }
            else {

                Pricing_html += ' <div class="pricing-custome">';
                Pricing_html += '     <div class="pricing-custome-inner">';
                Pricing_html += '         <div class="heder-price ' +colorTheme[i]+'"></div>';
                Pricing_html += '    <div class="pricing-body">';
                Pricing_html += ' ';
                Pricing_html += '        <h2>' + PricingList[i].PLAN_NAME + '</h2>';
                Pricing_html += '        <p><span class="extra-larg salmon-color">$ ' + PricingList[i].PLAN_PRICE + ' </span> <span class="sm">paid yearly</span></p>';
                Pricing_html += '        <p>HK$ ' + PricingList[i].PLAN_PRICE + '/ month</p>';
                Pricing_html += '        <div class="price-btn"><button class="payment" onclick="window.location.href =/BusinessAdmin/PaymentHistory">Subscribe</button></div>';
                Pricing_html += '        <div class="price-list-detail">';
                Pricing_html += '            <ul>';
                Pricing_html += '                <li><b> ' + PricingList[i].NUM_OF_AVAIL_CLR + '</b></li>';
                Pricing_html += '                <li>Calendar</li>';
                Pricing_html += '                <li><b>' + PricingList[i].VALID_SESSIONS + '</b></li>';
                Pricing_html += '                <li>Sessions/month/calendar</li>';
                Pricing_html += '                <li><b>' + PricingList[i].VALID_BOOKING_SESSION + '</b></li>';
                Pricing_html += '                <li>Bookings/session/calendar</li>';
                Pricing_html += '                <li><b>' + PricingList[i].COMPANY_ADMIN + '</b></li>';
                Pricing_html += '                <li>Company admin</li>';
                Pricing_html += '                <li><b>' + PricingList[i].COMPANY_WEBSITE + '</b></li>';
                Pricing_html += '                <li>Company website</li>';
                Pricing_html += '                <li><b>' + PricingList[i].PAYMENT_GATEWAY + '</b></li>';
                Pricing_html += '                <li>Payment gateway</li>';
                Pricing_html += '                <li><b>' + PricingList[i].PAYMENT_TRAN_FEE + '%</b></li>';
                Pricing_html += '                <li>Payment transaction fee</li>';
                Pricing_html += '                 </ul>';
                Pricing_html += '             </div>';
                Pricing_html += '         </div>';
                Pricing_html += '     </div>';
                Pricing_html += ' </div>';

            }


            

        }
        $("#Pricing_Table").append(Pricing_html);
    }


}

