$(document).ready(function () {
    $("#nv-news").addClass("active")
    GetallFeaturedComany();
});

function GetallFeaturedComany() {

    
    $.ajax({
        url: '/BusinessMarketplace/GetAllFeaturedComapy',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            // Handle success response
            if (response.data) {
                // Access the data returned from the server
                var transactionData = response.data;

                for (var i = 0; i < transactionData.length; i++) {
                    var item = transactionData[i];


                    $("#owl-demo5").append(`<div class="item">
                            <div class="item-inner">
                                <div class="pro-im">
                                    <img src="~/assets/img/alogo.png">
                                </div>
                                <div class="pro-text">
                                    <p class="f1"><b>Company Name</b></p>
                                    <p class="f2"><a href="javascript:void(0)"> Tag1</a></p>
                                </div>
                            </div>
                        </div>`);

                            /*<img src="${(ResponceData[i].CALENDAR_PHOTO_PATH == "") ? "../assets/marketplace/image/pro.png" : ResponceData[i].CALENDAR_PHOTO_PATH.replaceAll("~", "..")}" onerror="this.src='../assets/marketplace/image/pro.png'">*/




                    // Access properties of each item and perform operations as needed
                    console.log("Item " + (i + 1) + ": ", item);
                }






                // Process the data as needed
                console.log(transactionData.Data,"featured company");
            } else {
                console.log("No data returned from the server.");
            }
        },
        error: function (xhr, status, error) {
            // Handle error response
            console.error(xhr.responseText);
        }
    });

}



