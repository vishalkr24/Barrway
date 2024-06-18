var pageNumber, SearchText, Featured='N';
$(document).ready(function () {
    $("#nv-business").addClass("active");    
    setCompanyData(1, '');

    $("#filter").change(function () {
        var SearchText = $("#filter").val();
        setCompanyData('1', SearchText);
    });
  
    $(".filter-btn").click(function () {
        if (Featured == 'N') {
            Featured = 'Y';
            $('.filter-btn img').attr('src', '/assets/img/filter_down.png');
            setCompanyData('1', SearchText)
        }
        else {
            Featured = 'N';
            $('.filter-btn img').attr('src', '/assets/img/filter_up.png');
            setCompanyData('1', SearchText)
        }
    });

});





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
    Featured = Featured;
    $("#ComapanyList").empty();
    SetScaltonLoader();
    $.ajax({
        url: "/MarketPlace/GetAllFeaturedCompany/",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0,
            SearchText: SearchText,
            Featured: Featured
        },
        success: function (response) {            
            var nextPage = 0;
            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }
            
            var hardBindLimit = response.Pagination;
            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="setCompanyData(1,${SearchText})"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},${SearchText})"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {                
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},${SearchText})" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},${SearchText})" class="page-link">${i}</a>`);
                }
            }
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${nextPage},${SearchText})"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="setCompanyData(${response.last_page},${SearchText})"><img src="../assets/marketplace/image/p2.png" /></button>`);

            $("#ComapanyList").empty();
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
                var feturedHtml = '';
                if (response.data[i].IS_FEATURED == 'Y') {
                    feturedHtml = '<h4 class="media-heading">Featured company</h4>';
                }
                $("#ComapanyList").append(`<div class="col-md-6 col-sm-6 col-xs-6">
                    <div class="media" style="cursor:pointer;" onclick="window.location.href = '/company/${response.data[i].COMPANY_CODE}'">
                                <div class="media-left">
                                    <img src="${response.data[i].COMPANY_LOGO_PATH.replace("~", "..")}" onerror="this.src='../assets/marketplace/image/alogo2.png'" class="media-object" style="width:150px">
                                </div>
                                <div class="media-body">
                                    ${feturedHtml}
                                    <p><b>${response.data[i].COMPANY_NAME_ENGLISH}</b></p>
                                    <p style="height: 48px; overflow: hidden;">${response.data[i].COMPANY_DESCRIPTION}</p>
                                    <p>${tagQuery}</p>
                                </div>
                </div>`);
            }
        },
        error: function (errorResponse) {
            alert();
        }
    })

}


function SetScaltonLoader() {
    $("#ComapanyList").append(`<div class="col-md-6 col-sm-6 col-xs-6">
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


