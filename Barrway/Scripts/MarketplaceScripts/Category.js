
var Id;
$(document).ready(function () {
    $("#nv-business").addClass("active");
     remove_hash_from_url();
     Id = getUrlVars()["id"];;
    
    setCompanyData(1, Id,'');


    $("#filter").change(function () {
        
        var SearchText = $("#filter").val();
        setCompanyData(1, Id, SearchText);
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


function setCompanyData(pageNumber, Subcategory, SearchText) {
    
    remove_hash_from_url();
    console.log(Subcategory,"Subcategory");
    $("#list-view").show();
    $("#detail-view").hide();

    $.ajax({
        url: "/MarketPlace/GetAllCompany_SubCategoryWise",
        type: "GET",
        data: {
            page: pageNumber,
            size: 6,
            page_records: 0,
            res: 0,
            Id: Subcategory,
            SearchText: SearchText
        },
        success: function (response) {
            console.log(response);
            remove_hash_from_url();
            var nextPage = 0;

            if (pageNumber == response.last_page) {
                nextPage = response.last_page;
            } else {
                nextPage = pageNumber + 1;
            }

            var hardBindLimit = (response.last_page < 5) ? response.last_page : 5;

            $(".pagination").empty();
            $(".pagination").append(`<button class="btn" onclick="setCompanyData(1,${Id},'')"><img src="../assets/marketplace/image/p1.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${(pageNumber <= 1) ? 1 : (pageNumber - 1)},${Id},'')"><img src="../assets/marketplace/image/p12.png" /></button>`);

            for (var i = 1; i <= hardBindLimit; i++) {
                if (i == pageNumber) {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},${Id},'')" class="page-link page-link--current">${i}</a>`);
                } else {
                    $(".pagination").append(`<a href="#" onclick="setCompanyData(${i},${Id},'')" class="page-link">${i}</a>`);
                }

            }

            $(".pagination").append(`<button class="btn" id="next-page-nav" onclick="setCompanyData(${nextPage},${Id},'')"><img src="../assets/marketplace/image/p11.png" /></button>`);
            $(".pagination").append(`<button class="btn" id="last-page-nav" onclick="setCompanyData(${response.last_page},${Id},'')"><img src="../assets/marketplace/image/p2.png" /></button>`);

            $("#row1").empty();
            $("#row2").empty();

           

            for (var i = 0; i < response.data.length; i++) {

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


