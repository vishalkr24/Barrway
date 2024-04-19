var Id, SubCategoryId, Short;

$(document).ready(function () {
    $(".dropdown").addClass("active");
    scaltonLoader();
    remove_hash_from_url();
    Id = getUrlVars()["Category"];
    SubCategoryId = getUrlVars()["subcategory"];
    SetAllCalanders(1, Short);


    $("#filter-category-master").change(function () {
        SetAllCalanders(1, Short);
    });

});


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        });
    return vars;
}

function remove_hash_from_url() {

    var uri = window.location.toString();

    if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0,
            uri.indexOf("#"));

        window.history.replaceState({},
            document.title, clean_uri);
    }
}

function SetAllCalanders(pageNumber, Short) {
    scaltonLoader();
    remove_hash_from_url();
    var CategoryId = Id;
    Short = $("#filter-category-master").val();
    $("#list-view").show();
    $("#detail-view").hide();
    $.ajax({
        url: "/MarketPlace/GetAllCalenderByCategory",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0,
            CategoryId: CategoryId,
            SubCategoryId: SubCategoryId,
            Short: Short

        },
        success: function (response) {
            remove_hash_from_url();
            ///Pagination Start
            var heading = response.Heading.Data;
            var nextPage = 0;
            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }
            //var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;
            var hardBindLimit = response.Pagination;
            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="SetAllCalanders(1,'${Short}')"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="SetAllCalanders(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},'${Short}')"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="SetAllCalanders(${i},'${Short}')" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="SetAllCalanders(${i},'${Short}')" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="SetAllCalanders(${nextPage},'${Short}')"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="SetAllCalanders(${response.last_page},'${Short}')"><img src="../assets/marketplace/image/p2.png" /></button>`);
            /////Pagination Ends

            //Bread cam and Heading
            $('.bredcrum-content').empty();
            if (Id != null) {
                $('.bredcrum-content').append('<span><a href="/Marketplace/Index" style="color: #222;">Home</a></span>/<span><a href="/marketplace/AllCalanders?Category=' + Id + '">' + heading[0].Heading + '</a></span>')
            }


            if (SubCategoryId != null) {
                $('.bredcrum-content').append('<span><a href="/Marketplace/Index" style="color: #222;">Home</a></span>/<span><a href="/marketplace/AllCalanders?subcategory=' + SubCategoryId + '">' + heading[0].Heading + '</a></span>')
            }


            $('.head').empty();
            $('.head').append('<h2>' + heading[0].Heading + '</h2>');

            console.log(response.data,"response data");           

            if (response.data != null) {

                // Calanders start  
                if (response.data.length > 0) {
                    $("#Content-row").empty();
                    var itemCount = 0;
                    for (var i = 0; i < response.data.length; i++) {
                        var tagString = "";
                        var RowHead = '';
                        var RowEnd = '';
                        var ResponceData = response.data;
                        console.log(ResponceData, "ResponceData");
                        if (response.data[i].TAGS != '' && IsJsonString(response.data[i].TAGS)) {
                            var tags = JSON.parse(response.data[i].TAGS);
                            for (var k = 0; k < tags.length; k++) {
                                if (k > 0) {
                                    tagString += '<span>,</span>';
                                }
                                tagString += `&nbsp;<a href='/Marketplace/Search?keyword=${tags[k].value}'>${tags[k].value}</a>`;
                            }
                        }

                        var feturedSpan_html = '';
                        if (ResponceData[i].IS_FEATURED == 'Y') {
                            feturedSpan_html = '<div class="clr-tag new-clr-tag"><span>Featured</span></div>';
                        }

                        //if (itemCount == 0) {
                        //    RowHead = '<div class="row">';                            
                        //}
                        //if (itemCount == 1) {
                        //    RowHead = '</div>';
                        //}
                        

                        $("#Content-row").append(`<div class="col-md-6 col-sm-6 col-xs-6">
                                <div class="media" style="cursor:pointer;" onclick="window.location.href ='/company/calander/${response.data[i].PAGE_URL ? response.data[i].PAGE_URL : response.data[i].COMPANY_CODE}/${response.data[i].CALENDAR_CODE}'">
                                ${feturedSpan_html}
                                <div class="media-left">
                                        <img src="${(ResponceData[i].CALENDAR_PHOTO_PATH == "") ? "../assets/marketplace/image/pro.png" : ResponceData[i].CALENDAR_PHOTO_PATH.replaceAll("~", "..")}" onerror="this.src='../assets/marketplace/image/pro.png'">
                                   
                                </div>
                                <div class="media-body">                                    
                                    <h4 class="media-heading">${ResponceData[i].COMPANY_NAME_ENGLISH}</h4>
                                    <p><b>${ResponceData[i].CALENDAR_NAME}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${ResponceData[i].DISTRICT_NAME}</p>
                                    <p>${tagString}</p>
                                </div>                               
                                </div> </div>`);

                        itemCount++;

                        if (itemCount ==1) {
                            itemCount = 0;
                        }

                    }
                }

            }
            else {
                $("#Content-row").empty();
                $("#Content-row").append(`<div class="col-md-6">
                                <div class="media" style="cursor:pointer;">                              
                                <div class="media-left"> 
                                </div>
                                <div class="media-body">                                    
                                    <h4 class="media-heading">No data available !</h4>                                    
                                </div>

                    </div >`);

            }

            
            
           

           

        },
        error: function (errorResponse) {
            console.log(errorResponse, "Error")
        }
    })

}


function scaltonLoader() {
   
    $("#Content-row").empty();
    $("#Content-row").append(` <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 col-xs-6">
                            <div class="media skeleton-media" style="cursor: pointer;">
                                <div class="media-left skeleton-media-left"></div>
                                <div class="media-body Scmedia-body skeleton-media-body">
                                    <div class="skeleton-heading"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                    <div class="skeleton-text"></div>
                                </div>
                            </div>
                        </div>`);
    
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}