$(document).ready(function () {
    $("#nv-news").addClass("active")
    setNewsData(1);
});

function setNewsData(pageNumber) {
    
    $.ajax({
        url: "/MarketPlace/GetAllBlogPosts/",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0
        },
        success: function (response) {
            console.log(response);

            var nextPage = 0;

            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }

            var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;

            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="setNewsData(1)"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setNewsData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)})"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="setNewsData(${i})" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="setNewsData(${i})" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setNewsData(${nextPage})"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="setNewsData(${response.last_page})"><img src="../assets/marketplace/image/p2.png" /></button>`);

            $("#row1").empty();
            $("#row2").empty();
            
            for (var i = 0; i < response.data.length; i++) {
                if (i < 3) {
                    $("#row1").append(`<div class="media">
                                <div class="media-left">
                                    <img src="../assets/marketplace/image/post_img.jpg" class="media-object" style="width:250px">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${(response.data[i].IS_HOT_TOPIC == "Y") ? "Hot Topic" : ""}</h4>
                                    <p><a href=""> ${response.data[i].TAGS}</a></p>
                                    <p><b>${response.data[i].POST_TITLE}</b></p>
                                    <p><span>${response.data[i].FIRST_NAME} ${response.data[i].LAST_NAME}, </span><span>${response.data[i].PUBLISH_DATE.substring(0, 10)}</span></p>
                                </div>
                            </div>`);
                } else {
                    $("#row2").append(`<div class="media">
                                <div class="media-left">
                                    <img src="../assets/marketplace/image/post_img.jpg" class="media-object" style="width:250px">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${(response.data[i].IS_HOT_TOPIC == "Y") ? "Hot Topic" : ""}</h4>
                                    <p><a href=""> ${response.data[i].TAGS}</a></p>
                                    <p><b>${response.data[i].POST_TITLE}</b></p>
                                    <p><span>${response.data[i].FIRST_NAME} ${response.data[i].LAST_NAME}, </span><span>${response.data[i].PUBLISH_DATE.substring(0, 10)}</span></p>
                                </div>
                            </div>`);
                }
            }
                        
        },
        error: function (errorResponse) {
            alert();
        }
    })

}

