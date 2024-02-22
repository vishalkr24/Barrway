$(document).ready(function () {
    $("#nv-news").addClass("active")

    var querystring = window.location.href;
    
    try {
        if (querystring.includes("?")) {
            querystring = querystring.split('?')[1];
            if (querystring.includes("=")) {
                querystring = querystring.split('=')[1]

                if (parseInt(querystring) > 0) {
                    getSingleBlogPost(querystring);
                }
            }
        } else {
            setNewsData(1);
        }
    } catch (ex) {
        window.location.replace("/Marketplace/News");
    }
    
});

function getSingleBlogPost(BlogId) {

    
    $.ajax({
        url: "/Marketplace/GetSingleBlogPost",
        type: "GET",
        data: {
            NewsId: BlogId
        },
        success: function (data) {
            $("#list-view").hide();
            $("#detail-view").show();
            console.log(data);

            $(".post-title").text(data.Data[0][0].POST_TITLE)
            $(".post-author").text(data.Data[0][0].FIRST_NAME + " " + data.Data[0][0].LAST_NAME);
            $(".post-date").text(data.Data[0][0].PUBLISH_DATE.substring(0, 10));
            if (data.Data[0][0].BLOG_IMAGE == null) {
                $(".post-image").attr("src", "failed");
            } else {
                $(".post-image").attr("src", data.Data[0][0].BLOG_IMAGE);
            }
            
            $(".post-content").empty();
            $(".post-content").append(data.Data[0][0].POST_CONTENT);

            if (data.Data[0][0].TAGS.includes(",")) {
                var tempTags = data.Data[0][0].TAGS.split(',');
                $(".post-tags").empty();
                for (var i = 0; i < tempTags.length; i++) {
                    
                    if (i == tempTags.length - 1) {
                        $(".post-tags").append(`<a href="/Marketplace/Tag?tag=${tempTags[i]}">${tempTags[i]}</a>`);
                    } else {
                        $(".post-tags").append(`<a href="/Marketplace/Tag?tag=${tempTags[i]}">${tempTags[i]}, </a>`);
                    }

                }
            } else {
                $(".post-tags").empty();
                $(".post-tags").append(`<a href="/Marketplace/Tag?tag=${data.Data[0][0].TAGS}">${data.Data[0][0].TAGS}</a>`);
            }
            $("#detail-sidebar").empty();
            for (var i = 0; i < data.Data[1].length; i++) {

                var tagQuery = "";
                if (data.Data[1][i].TAGS.includes(",")) {
                    var tempTagData = data.Data[1][i].TAGS.split(',');

                    for (var j = 0; j < tempTagData.length; j++) {
                        if (j == tempTagData.length - 1) {
                            tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}</a>`
                        } else {
                            tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}, </a>`
                        }

                    }

                } else {
                    tagQuery += `<a href="/Marketplace/Tag?tag=${data.Data[1][i].TAGS}">${data.Data[1][i].TAGS}</a>`
                }

                $("#detail-sidebar").append(`<div class="media">
                                                    <div class="media-left">
                                                        <img src="${data.Data[1][i].BLOG_IMAGE}" onerror="this.src='../assets/img/post_img.jpg'" class="media-object" style="width:150px">
                                                    </div>
                                                    <div class="media-body">
                                                        <h4 class="media-heading">${(data.Data[1][i].IS_HOT_TOPIC == "Y")? "Hot Topic": ""}</h4>
                                                        <p>${tagQuery}</p>
                                                        <p><b>${data.Data[1][i].POST_TITLE}</b></p>
                                                        <p><span>${data.Data[1][i].FIRST_NAME} ${data.Data[1][i].LAST_NAME}, </span><span>${data.Data[1][i].PUBLISH_DATE.substring(0, 10)}</span></p>
                                                    </div>
                                                </div>`);
            }

        },
        error: function (error) {
            alert("Post Deleted");
            window.location.replace("/Marketplace/News");
        }

    })

}

function setNewsData(pageNumber) {

    $("#list-view").show();
    $("#detail-view").hide();

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

            var headerTags = [];

            for (var i = 0; i < response.data.length; i++) {

                if (response.data[i].TAGS != null) {
                    if (response.data[i].TAGS.includes(",")) {
                        var tempTagSplit = response.data[i].TAGS.split(',');
                        for (var j = 0; j < tempTagSplit; j++) {
                            if (~headerTags.indexOf(tempTagSplit[j])) {
                                continue;
                            } else {
                                headerTags.push(tempTagSplit[i])
                            }
                        }
                    } else {
                        if (~headerTags.indexOf(response.data[i].TAGS)) {
                            
                        } else {
                            headerTags.push(response.data[i].TAGS)
                        }
                    }
                }


                var tagQuery = "";
                if (response.data[i].TAGS.includes(",")) {
                    var tempTagData = response.data[i].TAGS.split(',');

                    for (var j = 0; j < tempTagData.length; j++) {
                        if (j == tempTagData.length - 1) {
                            tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}</a>`
                        } else {
                            tagQuery += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}, </a>`
                        }

                    }

                } else {
                    tagQuery += `<a href="/Marketplace/Tag?tag=${response.data[i].TAGS}">${response.data[i].TAGS}</a>`
                }
                

                if (i < 3) {
                    $("#row1").append(`<div class="media" style="cursor:pointer" onclick="window.location.href = '/Marketplace/News?NId=${response.data[i].Id}'">
                                <div class="media-left">
                                    <img src="${response.data[i].BLOG_IMAGE}" onerror="this.src='../assets/marketplace/image/post_img.jpg'" class="media-object" style="width:250px; max-height:155px;">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${(response.data[i].IS_HOT_TOPIC == "Y") ? "Hot Topic" : ""}</h4>
                                    <p>${tagQuery}</p>
                                    <p><b>${response.data[i].POST_TITLE}</b></p>
                                    <p><span>${response.data[i].FIRST_NAME} ${response.data[i].LAST_NAME}, </span><span>${response.data[i].PUBLISH_DATE.substring(0, 10)}</span></p>
                                </div>
                            </div>`);
                } else {
                    $("#row2").append(`<div class="media" style="cursor:pointer" onclick="window.location.href = '/Marketplace/News?NId=${response.data[i].Id}'">
                                <div class="media-left">
                                    <img src="${response.data[i].BLOG_IMAGE}" onerror="this.src='../assets/marketplace/image/post_img.jpg'" class="media-object" style="width:250px; max-height:155px;">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${(response.data[i].IS_HOT_TOPIC == "Y") ? "Hot Topic" : ""}</h4>
                                    <p>${tagQuery}</p>
                                    <p><b>${response.data[i].POST_TITLE}</b></p>
                                    <p><span>${response.data[i].FIRST_NAME} ${response.data[i].LAST_NAME}, </span><span>${response.data[i].PUBLISH_DATE.substring(0, 10)}</span></p>
                                </div>
                            </div>`);
                }
            }

            $(".blog-slide").empty();

            $(".blog-slide").append(`<div id="owl-demo-blog" class="owl-carousel owl-theme">`);

            for (var i = 0; i < headerTags.length; i++) {
                $("#owl-demo-blog").append(`<div class="item">
                            <div class="item-inner">
                                <button class="blogtag_num" onclick="window.location.href = '/Marketplace/Tag?tag=${headerTags[i]}'">${headerTags[i]}</button>
                            </div>
                        </div>`);
            }

            $("#owl-demo-blog").owlCarousel({
                loop: true,
                margin: 10,
                dots: false,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 2,
                        nav: false
                    },
                    600: {
                        items: 4,
                        nav: false
                    },
                    1000: {
                        items: 7,
                        nav: false,
                        loop: false,
                        margin: 20
                    }
                }
            });

                        
        },
        error: function (errorResponse) {
            alert();
        }
    })

}

