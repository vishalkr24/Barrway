var Hot = 0;
$(document).ready(function () {
    $("#nv-news").addClass("active");
    GetBlogs(1, '', Hot);
});


function GetHotBlogs() {
    if (Hot == 0) {
        Hot = 1;
    }
    else {
        Hot = 0;
    }

    GetBlogs(1, '', Hot);
}

function GetBlogs(pageNumber, blog_tag, Hot) {
    $("#blogrow").empty();
    Scaltonloader();
    $.ajax({
        url: "/MarketPlace/GetAllBlog/",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0,
            SearchText: blog_tag,
            Hot: Hot
        },
        async: true,
        success: function (response) {
            debugger;
            var nextPage = 0;
            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }
            //var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;
            var hardBindLimit = response.Pagination;
            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="setCompanyData(1)"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="GetBlogs(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},'',${Hot})"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="GetBlogs(${i},'',${Hot})" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="GetBlogs(${i},'',${Hot})" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="GetBlogs(${nextPage},'',${Hot})"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="GetBlogs(${response.last_page},'',${Hot})"><img src="../assets/marketplace/image/p2.png" /></button>`);


            $("#blogrow").empty();          

            var html = '';

            console.log(response.data,"gfhghgh");
            for (var i = 0; i < response.data.length; i++) {
                console.log(response.data[i], "Result_data");
                var formattedDate = moment(parseInt(response.data[i].created_at.substr(6))).format("YYYY-MM-DD HH:mm");
                html += '<div class="col-md-4">';
                html += '    <div class="blog-post-vew">';
                if (response.data[i].IS_HOT == 'YES') {
                    html += '        <div class="hotBlog"><span>Hot</span></div>';
                }    
                html += '        <div class="pro-im">';
                html += '            <a href="/MarketPlace/BlogDetails/' + response.data[i].Id + '"><img src="' + response.data[i].IMAGE + '" onerror=this.src="../assets/marketplace/image/dummy.jpg" ></a>';
                html += '                            </div>';
                html += '            <div class="pro-text">';
                html += '                <p class="p1"><b>' + response.data[i].BLOG_TITLE + '</b></p>';
                html += '                <p class="date">' + formattedDate + '</p>';
                html += '                <p class="tag">';

                if (response.data[i].TAG != null) {
                    
                    var array = JSON.parse(response.data[i].TAG);
                   
                    for (var j = 0; j < array.length; j++) {
                        if (j >0) {
                            html += '<span>,</span>';
                        }
                        html += '&nbsp;<a href="/Marketplace/Search?keyword=' + array[j].value + '">' + array[j].value + '</a> &nbsp';
                        //isFirst = false;
                    }
                }
                html += '                </p>';
                html += '            </div>';
                html += '        </div>';
                html += '    </div>';

            }

            $("#blogrow").append(html);

        },
        error: function (errorResponse) {
            alert();
        }
    })
}


function Scaltonloader() {
    $("#blogrow").append(`<div class="col-md-4">
                                <div class="blog-post-vew skeleton">
                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="blog-post-vew skeleton">

                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="blog-post-vew skeleton">

                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="blog-post-vew skeleton">

                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="blog-post-vew skeleton">

                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="blog-post-vew skeleton">

                                    <div class="pro-im skeleton-image"></div>
                                    <div class="pro-text">
                                        <p class="p1 skeleton-text"></p>
                                        <p class="date skeleton-text"></p>
                                        <p class="tag skeleton-text"></p>
                                    </div>
                                </div>
                            </div>`);
}


