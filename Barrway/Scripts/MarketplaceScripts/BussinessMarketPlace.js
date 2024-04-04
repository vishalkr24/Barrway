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
                // Process the data as needed
                console.log(transactionData);
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



