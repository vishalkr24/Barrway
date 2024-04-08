var pageNumber, SearchText = '';
$(document).ready(function () {
    $("#nv-business").addClass("active");    
    setCompanyData(1, '');

    $("#filter").change(function () {
        var SearchText = $("#filter").val();
        setCompanyData(pageNumber, SearchText);
    });

});

//
var calendar_category = [{ "categoryId": 1, "type": "1", "name": "1a" }, { "categoryId": 1, "type": "2", "name": "1b" },
{ "categoryId": 2, "type": "1", "name": "2a" }, { "categoryId": 2, "type": "2", "name": "2b" }, { "categoryId": 2, "type": "3", "name": "2c" }, { "categoryId": 2, "type": "4", "name": "2d" },
{ "categoryId": 3, "type": "1", "name": "3a" }, { "categoryId": 3, "type": "2", "name": "3b" }, { "categoryId": 3, "type": "3", "name": "3c" },
{ "categoryId": 4, "type": "1", "name": "5a" }, { "categoryId": 4, "type": "2", "name": "5b" }, { "categoryId": 4, "type": "3", "name": "5c" },
{ "categoryId": 6, "type": "1", "name": "6a" }];

function getCalendarCategoryMatrix(calendar) {

    return calendar_category.find(x => x.categoryId == calendar.CALENDAR_CATEGORY_ID && calendar.CALENDAR_TYPE == x.type)?.name ?? "";
}

function setCompanyData(pageNumber, SearchText) {
    $("#list-view").show();
    $("#detail-view").hide();
    pageNumber = pageNumber;

    $.ajax({
        url: "/MarketPlace/GetAllFeaturedCompany/",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0,
            SearchText: SearchText
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
            $(".pagination").append(`<button class="btn" onclick="setCompanyData(1,'')"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},'')"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},'')" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},'')" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${nextPage},'')"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="setCompanyData(${response.last_page},'')"><img src="../assets/marketplace/image/p2.png" /></button>`);

            $("#row1").empty();
            $("#row2").empty();

           

            for (var i = 0; i < response.data.length; i++) {

                var tagQuery = "";  
                if (response.data[i].TAGS != '') {
                    var tags = JSON.parse(response.data[i].TAGS);
                    for (var k = 0; k < tags.length; k++) {
                        if (k > 0) {
                            tagQuery += '<span>,</span>';
                        }
                        tagQuery += `&nbsp;<a href='/Marketplace/Search?keyword=${tags[k].value}'>${tags[k].value}</a>`;
                    }
                }



                if (i < 3) {
                    $("#row1").append(`<div class="media" style="cursor:pointer;" onclick="window.location.href = '/Marketplace/CompanyDetail?CompanyCode=${response.data[i].COMPANY_CODE}&CalendarCode=null'">
                                <div class="media-left">
                                    <img src="${response.data[i].COMPANY_LOGO_PATH.replace("~", "..")}" onerror="this.src='../assets/marketplace/image/alogo2.png'" class="media-object" style="width:150px">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">Featured company</h4>
                                    <p><b>${response.data[i].COMPANY_NAME_ENGLISH}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${response.data[i].COMPANY_DESCRIPTION}</p>
                                    <p>${tagQuery}</p>
                                </div>`);
                } else {
                    $("#row2").append(`<div class="media" style="cursor:pointer;" onclick="window.location.href = '/Marketplace/CompanyDetail?CompanyCode=${response.data[i].COMPANY_CODE}&CalendarCode=null'">
                                <div class="media-left">
                                    <img src="${response.data[i].COMPANY_LOGO_PATH.replace("~", "..")}" onerror="this.src='../assets/marketplace/image/alogo2.png'" class="media-object" style="width:150px">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">Featured company</h4>
                                    <p><b>${response.data[i].COMPANY_NAME_ENGLISH}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${response.data[i].COMPANY_DESCRIPTION}</p>
                                    <p>${tagQuery}</p>
                                </div>`);
                }
            }

        },
        error: function (errorResponse) {
            alert();
        }
    })

}


//function setCalendarSubCategoryWise(showFilterQuery = false, requestFromButton = false) {
//    debugger;
//    var fltr_subCategoryId = ''
//    var fltr_CategoryId = '';
//    var fltr_districtId = '';

//    var queryString = window.location.href.split("?")[1];

//    if (queryString == null) {

//    } else {
//        queryString = queryString.split("&");
//        try {
//            var object = queryString;

//            if (requestFromButton) {

//            } else {
//                fltr_CategoryId = object[0].split("=")[1];
//                fltr_subCategoryId = object[1].split("=")[1];
//                fltr_districtId = object[2].split("=")[1];
//                if (fltr_districtId[fltr_districtId.length - 1] == "#") {
//                    fltr_districtId = fltr_districtId.substring(0, fltr_districtId.length - 1)
//                }
//                $("#filter-category-master").val(fltr_CategoryId);
//                $("#filter-sub-category-master").val(fltr_subCategoryId);
//                $("#filter-district-master").val(fltr_districtId);
//            }

//            showFilterQuery = true;
//        } catch (ex) {

//        }
//    }

//    if (showFilterQuery) {

//        var title = "Barrway | Marketplace";
//        var url = "/Marketplace/index?CategoryId=" + fltr_CategoryId + "&SubCategoryId=" + fltr_subCategoryId + "&DistrictId=" + fltr_districtId + "";

//        window.history.replaceState('index', title, url);

//        $("#lblFilterLabel").show();

//        if (fltr_CategoryId == "-1") {
//            $("#lblSelectedCategory").text("All Categories");
//        } else {
//            $("#lblSelectedCategory").text($("#filter-category-master option:selected").text());
//        }

//        if (fltr_subCategoryId == "-1") {
//            $("#lblSelectedSubCategory").text("All Sub Categories");
//        } else {
//            $("#lblSelectedSubCategory").text($("#filter-sub-category-master option:selected").text());
//        }

//        if (fltr_districtId == "-1") {
//            $("#lblSelectedDistrict").text("All Districts");
//        } else {
//            $("#lblSelectedDistrict").text($("#filter-district-master option:selected").text() + " District");
//        }

//    } else {
//        $("#lblFilterLabel").hide();
//        $("#lblSelectedCategory").text("");
//        $("#lblSelectedSubCategory").text("");
//        $("#lblSelectedDistrict").text("");
//    }

//    if (fltr_subCategoryId == "-1") {
//        fltr_subCategoryId = "";
//    }

//    if (fltr_CategoryId == "-1") {
//        fltr_CategoryId = "";
//    }

//    if (fltr_districtId == "-1") {
//        fltr_districtId = "";
//    }

//    var data = GetFilterCompanyData(fltr_CategoryId, fltr_subCategoryId, fltr_districtId);
//    console.log(data);
//    if (data.Status) {
//        var corouselClassMaster = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
//        var corouselCounter = 0;

//        var categories = data.Data;

//        $("#company-category-wise-area").empty();
//        for (var i = 0; i < categories.length; i++) {

//            var calendars = data.Data[i];

//            if (calendars.length > 0) {

//                corouselCounter++;

//                $("#company-category-wise-area").append(`<div class="my-slide ${corouselClassMaster[corouselCounter]}">
//                                                            <div class="heading-cata">
//                                                                <h3>${calendars[0].CMN_CATEGORY_NAME}</h3>
//                                                            </div>
//                                                            <div id="owl-demo${corouselCounter}" class="owl-carousel owl-theme"></div>

//                                                        </div>`);

//                for (var j = 0; j < calendars.length; j++) {
//                    var tags = [];
//                    var tagString = "";


//                    if (calendars[j].TAGS != null && calendars[j].TAGS != "") {
//                        var tags = JSON.parse(calendars[j].TAGS);
//                        for (var k = 0; k < tags.length; k++) {
//                            tagString += `<a href='/Marketplace/Search?keyword=${tags[k].value}'>${tags[k].value}</a>`;
//                        }
//                    }


                    
//                    $("#owl-demo" + corouselCounter).append(` <div class="item">
//                                                    <div class="item-inner" onclick="viewMarketplaceCompanyCalendar('${calendars[j].PAGE_URL ? calendars[j].PAGE_URL : calendars[j].COMPANY_CODE}','${calendars[j].CALENDAR_CODE}')">
//                                                        <div class="pro-im">
//                                                            <img src="${(calendars[j].CALENDAR_PHOTO_PATH == "") ? "../assets/marketplace/image/pro.png" : calendars[j].CALENDAR_PHOTO_PATH.replaceAll("~", "..")}" onerror="this.src='../assets/marketplace/image/pro.png'">
//                                                        </div>
//                                                        <div class="pro-text">
//                                                            <p class="p1"><b>${calendars[j].COMPANY_NAME_ENGLISH}</b></p>
//                                                            <p class="p2">${calendars[j].CALENDAR_NAME} <span class="clr-tag">${getCalendarCategoryMatrix(calendars[j])}<span></p>
//                                                            <p class="p3">${calendars[j].DISTRICT_NAME}</p>
//                                                            <p class="p4">${tagString}</p>
//                                                        </div>
//                                                    </div>
//                                                </div>`);

//                }

//                $("#owl-demo" + corouselCounter).owlCarousel({
//                    loop: true,
//                    margin: 10,
//                    dots: false,
//                    responsiveClass: true,
//                    responsive: {
//                        0: {
//                            items: 1,
//                            nav: false
//                        },
//                        600: {
//                            items: 3,
//                            nav: false
//                        },
//                        1000: {
//                            items: 5,
//                            nav: true,
//                            loop: false,
//                            margin: 20
//                        }
//                    }
//                });

//            }


//        }



//    }

//}