var calendar_category = [{ "categoryId": 1, "type": "1", "name": "1a" }, { "categoryId": 1, "type": "2", "name": "1b" },
{ "categoryId": 2, "type": "1", "name": "2a" }, { "categoryId": 2, "type": "2", "name": "2b" }, { "categoryId": 2, "type": "3", "name": "2c" }, { "categoryId": 2, "type": "4", "name": "2d" },
{ "categoryId": 3, "type": "1", "name": "3a" }, { "categoryId": 3, "type": "2", "name": "3b" }, { "categoryId": 3, "type": "3", "name": "3c" },
{ "categoryId": 4, "type": "1", "name": "5a" }, { "categoryId": 4, "type": "2", "name": "5b" }, { "categoryId": 4, "type": "3", "name": "5c" },
{ "categoryId": 6, "type": "1", "name": "6a" }];


var Id;
$(document).ready(function () {
    $("#nv-business").addClass("active");
    remove_hash_from_url();
    Id = getUrlVars()["id"];
    SetAllCalanders(1, Id);




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

function getCalendarCategoryMatrix(calendar) {

    return calendar_category.find(x => x.categoryId == calendar.CALENDAR_CATEGORY_ID && calendar.CALENDAR_TYPE == x.type)?.name ?? "";
}

function SetAllCalanders(pageNumber, CategoryId) {
    remove_hash_from_url();
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
            CategoryId: CategoryId
        },
        success: function (response) {
            console.log(response, "response");
            remove_hash_from_url();
            var nextPage = 0;
            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }

            var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;

            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="SetAllCalanders(1,${Id})"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="SetAllCalanders(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},${Id})"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="SetAllCalanders(${i},${Id})" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="SetAllCalanders(${i},${Id})" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="SetAllCalanders(${nextPage},${Id})"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="SetAllCalanders(${response.last_page},${Id})"><img src="../assets/marketplace/image/p2.png" /></button>`);
            $('.bredcrum-content').empty();
            $('.bredcrum-content').append('<span><a href="/Marketplace/Index" style="color: #222;">Home</a></span>/<span><a href="/marketplace/AllCalanders?id=' + Id + '">' + response.data[0].CMN_CATEGORY_NAME + '</a></span>')
            $('.head').empty();
            $('.head').append('<h2>' + response.data[0].CMN_CATEGORY_NAME + '</h2>');
            $("#row1").empty();
            $("#row2").empty();

            for (var i = 0; i < response.data.length; i++) {               
                var tagString = "";
                var ResponceData = response.data;
                console.log(ResponceData,"ResponceData");

                if (response.data[i].TAGS.includes(",")) {
                    var tempTagData = response.data[i].TAGS.split(',');

                    for (var j = 0; j < tempTagData.length; j++) {
                        if (j == tempTagData.length - 1) {
                            tagString += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}</a>`
                        } else {
                            tagString += `<a href="/Marketplace/Tag?tag=${tempTagData[j]}">${tempTagData[j]}, </a>`
                        }

                    }

                } else {
                    tagString += `<a href="/Marketplace/Tag?tag=${response.data[i].TAGS}">${response.data[i].TAGS}</a>`
                }

                var feturedSpan_html = '';



                if (i < 3) {

                    $("#row1").append(`<div class="media" style="cursor:pointer;" onclick="window.location.href = '/Marketplace/CompanyDetail?CompanyCode=${response.data[i].COMPANY_CODE}&CalendarCode=${response.data[i].CALENDAR_CODE}'">
                                <div class="media-left">
                                        <img src="${(ResponceData[i].CALENDAR_PHOTO_PATH == "") ? "../assets/marketplace/image/pro.png" : ResponceData[i].CALENDAR_PHOTO_PATH.replaceAll("~", "..")}" onerror="this.src='../assets/marketplace/image/pro.png'">
                                   
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${ResponceData[i].COMPANY_NAME_ENGLISH}</h4>
                                    <p><b>${ResponceData[i].CALENDAR_NAME}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${ResponceData[i].DISTRICT_NAME}</p>
                                    <p>${tagString}</p>
                                </div>`);



                    
                } else {
                    $("#row2").append(`<div class="media" style="cursor:pointer;" onclick="window.location.href = '/Marketplace/CompanyDetail?CompanyCode=${response.data[i].COMPANY_CODE}&CalendarCode=${response.data[i].CALENDAR_CODE}'">
                                <div class="media-left">
                                        <img src="${(ResponceData[i].CALENDAR_PHOTO_PATH == "") ? "../assets/marketplace/image/pro.png" : ResponceData[i].CALENDAR_PHOTO_PATH.replaceAll("~", "..")}" onerror="this.src='../assets/marketplace/image/pro.png'">
                                   
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">${ResponceData[i].COMPANY_NAME_ENGLISH}</h4>
                                    <p><b>${ResponceData[i].CALENDAR_NAME}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${ResponceData[i].DISTRICT_NAME}</p>
                                    <p>${tagString}</p>
                                </div>`);
                }
            }

        },
        error: function (errorResponse) {
            alert();
        }
    })

}


